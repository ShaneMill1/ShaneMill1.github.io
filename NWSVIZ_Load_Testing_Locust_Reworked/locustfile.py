"""
EDR API Load & Stress Testing - Fully Dynamic
===============================================
All test targets are discovered from the live API at startup.
No hardcoded collections, instances, parameters, zoom levels, units, or chunks.

Usage:
    # Load test against memory node group
    locust -f locustfile.py --host https://edr-api-desi-c.mdl.nws.noaa.gov:8443

    # Stress test
    locust -f locustfile.py --host https://edr-api-desi-c.mdl.nws.noaa.gov:8443 -u 500 -r 10 --headless -t 10m
"""
import json
import math
import os
import random
import re
import subprocess
from locust import HttpUser, TaskSet, task, between, constant, events


def _get(url, timeout=15):
    """Use subprocess curl to avoid gevent ssl monkey-patching issues."""
    try:
        result = subprocess.run(
            ["curl", "-sk", "--max-time", str(timeout), url],
            capture_output=True, text=True
        )
        if result.returncode == 0 and result.stdout.strip():
            return json.loads(result.stdout)
    except Exception:
        pass
    return None

# ---------------------------------------------------------------------------
# Global discovery cache — populated at startup
# ---------------------------------------------------------------------------
# Structure:
# DISCOVERED[collection][instance] = [
#     {
#         "base_path": "/collections/{c}/instances/{i}/items/zarr/{param}/{zoom}/{epsg}/{unit}/tc{tc}",
#         "param": str,
#         "chunks": [str, ...],   # valid chunk coordinates
#         "has_tc": bool,
#     },
#     ...
# ]
DISCOVERED = {}
FLAT_CONFIGS = []  # Sampled configs (10 instances/collection) with validated params/zoom/epsg/unit/chunks.
                   # Used as path templates by _random_uncached_config() and directly by VisualizationUser
                   # for viewport pan simulation with known-good chunk coordinates.
ALL_INSTANCES = {}  # collection_id -> [instance_id, ...] — full instance list for every collection.
                    # Used by BatchUser and VisualizationUser.switch_instance() to pick uncached instances
                    # that are unlikely to be in Redis, guaranteeing cache misses.


def _get_chunks_from_zarray(host, base_path, param):
    """Derive valid chunk indices from a zarr .zarray file. Returns (chunks, n_chunks)."""
    data = _get(f"{host}{base_path}/{param}/.zarray")
    if not data:
        return [], []
    shape = data.get("shape", [])
    chunks = data.get("chunks", [])
    if not shape or not chunks:
        return [], []

    n_chunks = [math.ceil(s / c) for s, c in zip(shape, chunks)]

    all_chunks = []
    if len(n_chunks) == 3:
        for i in range(min(n_chunks[0], 4)):
            for j in range(min(n_chunks[1], 7)):
                for k in range(min(n_chunks[2], 8)):
                    all_chunks.append(f"{i}.{j}.{k}")
    elif len(n_chunks) == 4:
        for i in range(min(n_chunks[0], 3)):
            for j in range(min(n_chunks[1], 3)):
                for k in range(min(n_chunks[2], 5)):
                    for l in range(min(n_chunks[3], 5)):
                        all_chunks.append(f"{i}.{j}.{k}.{l}")
    elif len(n_chunks) == 2:
        for i in range(min(n_chunks[0], 14)):
            for j in range(min(n_chunks[1], 15)):
                all_chunks.append(f"{i}.{j}")

    return all_chunks[:200], n_chunks


def _discover_zarr_configs(host, collection, instance, instance_path):
    """
    Discover zarr endpoints using the /items/zarr metadata endpoint which
    returns available_parameters, available_zoom_levels, and supported_units.
    Falls back gracefully if the instance has broken icechunk data.
    """
    configs = []

    meta = _get(f"{host}{instance_path}/items/zarr")
    if not meta or "features" not in meta:
        return configs

    try:
        props = meta["features"][0]["properties"]
        parameters = props.get("available_parameters", [])
        zoom_levels = props.get("available_zoom_levels", [])
        supported_units = props.get("supported_units", [""])
        supported_crs = props.get("supported_crs", ["4326"])
    except (IndexError, KeyError):
        return configs

    if not parameters or not zoom_levels:
        return configs

    # Use first CRS and sample units
    epsg = supported_crs[0] if supported_crs else "4326"
    unit = supported_units[0] if supported_units else ""
    zoom = zoom_levels[0] if zoom_levels else "0"

    for param in parameters[:5]:  # cap at 5 params per instance
        base = f"{instance_path}/items/zarr/{param}/{zoom}/{epsg}"
        if unit:
            base += f"/{unit}"

        chunks, n_chunks = _get_chunks_from_zarray(host, base, param)
        if not chunks:
            continue

        configs.append({
            "base_path": base,
            "param": param,
            "chunks": chunks,
            "n_chunks": n_chunks,
            "has_tc": False,
        })

    return configs


def _discover_tc_range(host, collection, instance, param, zoom, epsg, unit):
    """
    Discover valid tc range by probing the API.
    Tries tc values and finds the max that returns 200.
    """
    base = f"/collections/{collection}/instances/{instance}/items/zarr/{param}/{zoom}/{epsg}"
    if unit:
        base += f"/{unit}"

    valid_tcs = []
    # Probe a sample of tc values
    for tc in [1, 2, 5, 10, 20, 30, 50, 100]:
        resp = _get(f"{host}{base}/tc{tc}/.zmetadata")
        if resp:
            valid_tcs.append(tc)

    return valid_tcs if valid_tcs else None


def _discover_all(host):
    """
    Full discovery: collections -> instances -> zarr configs.
    Returns populated DISCOVERED dict and FLAT_CONFIGS list.
    """
    discovered = {}
    flat = []

    print(f"\n{'='*60}")
    print(f"Starting API discovery from {host}")
    print(f"This may take 30-60 seconds depending on collection count.")
    print(f"{'='*60}")

    # Step 1: Get all collections
    print("[1/3] Fetching collections...", flush=True)
    collections_data = _get(f"{host}/collections?f=json")
    if not collections_data:
        print("ERROR: Could not fetch collections from API")
        return discovered, flat

    collections = collections_data.get("collections", [])
    print(f"      Found {len(collections)} collections", flush=True)

    # Step 2: Get instances per collection
    print(f"[2/3] Fetching instances for each collection...", flush=True)
    for i, coll in enumerate(collections, 1):
        collection_id = coll.get("id")
        if not collection_id:
            continue

        print(f"      [{i}/{len(collections)}] {collection_id}...", end=" ", flush=True)

        instances_data = _get(f"{host}/collections/{collection_id}/instances?f=json")
        if not instances_data:
            print("no instances")
            continue

        instances = instances_data.get("instances", [])
        if not instances:
            print("no instances")
            continue

        print(f"{len(instances)} instances found", flush=True)

        # Store full instance list for BatchUser cache-miss requests
        # Only include instances from collections that have at least one valid zarr config
        # (filtered after discovery completes — see on_locust_init)
        ALL_INSTANCES[collection_id] = [inst.get("id") for inst in instances if inst.get("id")]

        # Sample up to 50 instances per collection to maximize cache miss pool
        sampled = random.sample(instances, min(50, len(instances)))
        discovered[collection_id] = {}

        # Step 3: Discover zarr configs for sampled instances
        for j, inst in enumerate(sampled, 1):
            instance_id = inst.get("id")
            if not instance_id:
                continue

            print(f"        [{j}/{len(sampled)}] Inspecting instance {instance_id}...", end=" ", flush=True)
            instance_path = f"/collections/{collection_id}/instances/{instance_id}"
            configs = _discover_zarr_configs(host, collection_id, instance_id, instance_path)

            if configs:
                discovered[collection_id][instance_id] = configs
                for cfg in configs:
                    flat.append({
                        "collection": collection_id,
                        "instance": instance_id,
                        **cfg,
                    })
                print(f"{len(configs)} zarr configs", flush=True)
            else:
                print("no zarr configs — trying next instance", flush=True)
                # Try remaining instances until we find one that works
                remaining = [i for i in instances if i.get("id") not in [s.get("id") for s in sampled]]
                for fallback in remaining[:5]:
                    fallback_id = fallback.get("id")
                    if not fallback_id:
                        continue
                    print(f"          fallback: {fallback_id}...", end=" ", flush=True)
                    fallback_path = f"/collections/{collection_id}/instances/{fallback_id}"
                    configs = _discover_zarr_configs(host, collection_id, fallback_id, fallback_path)
                    if configs:
                        discovered[collection_id][fallback_id] = configs
                        for cfg in configs:
                            flat.append({
                                "collection": collection_id,
                                "instance": fallback_id,
                                **cfg,
                            })
                        print(f"{len(configs)} zarr configs", flush=True)
                        break
                    else:
                        print("no zarr configs", flush=True)

        if discovered[collection_id]:
            total_configs = sum(len(v) for v in discovered[collection_id].values())
            print(f"      -> {collection_id}: {len(discovered[collection_id])} instances, {total_configs} zarr configs ready", flush=True)
        else:
            del discovered[collection_id]

    print(f"\n[3/3] Discovery complete.", flush=True)
    print(f"      Collections: {len(discovered)}")
    print(f"      Total zarr configs: {len(flat)}")
    print(f"{'='*60}\n", flush=True)
    return discovered, flat


def _discover_tc_configs(host, flat_configs):
    """
    For configs that have tc in their path, discover the valid tc range
    and expand into multiple tc variants to maximize cache misses.
    """
    tc_configs = []
    seen_bases = set()

    for cfg in flat_configs:
        if not cfg.get("has_tc"):
            continue

        # Extract base path without tc
        base = re.sub(r"/tc\d+$", "", cfg["base_path"])
        if base in seen_bases:
            continue
        seen_bases.add(base)

        # Probe tc range
        parts = base.split("/")
        try:
            zarr_idx = parts.index("zarr")
            param = parts[zarr_idx + 1]
            zoom = parts[zarr_idx + 2] if zarr_idx + 2 < len(parts) else "0"
            epsg = parts[zarr_idx + 3] if zarr_idx + 3 < len(parts) else "4326"
            unit = parts[zarr_idx + 4] if zarr_idx + 4 < len(parts) else ""
            collection = parts[2]
            instance = parts[4]
        except (ValueError, IndexError):
            continue

        valid_tcs = _discover_tc_range(host, collection, instance, param, zoom, epsg, unit)
        if valid_tcs:
            tc_configs.append({
                "collection": collection,
                "instance": instance,
                "base_path": base,
                "param": param,
                "chunks": cfg["chunks"],
                "has_tc": True,
                "valid_tcs": valid_tcs,
            })
            print(f"  tc discovery: {collection}/{instance}/{param} -> tcs={valid_tcs}")

    return tc_configs


@events.init.add_listener
def on_locust_init(environment, **kwargs):
    global DISCOVERED, FLAT_CONFIGS

    host = environment.host or os.getenv(
        "LOCUST_HOST", "https://edr-api-desi-c.mdl.nws.noaa.gov"
    )

    DISCOVERED, FLAT_CONFIGS = _discover_all(host)

    # Filter ALL_INSTANCES to only collections that have valid zarr configs in FLAT_CONFIGS
    # This prevents BatchUser from hitting instances with no icechunk data (404s)
    valid_collections = set(cfg["collection"] for cfg in FLAT_CONFIGS)
    for coll in list(ALL_INSTANCES.keys()):
        if coll not in valid_collections:
            del ALL_INSTANCES[coll]

    if not FLAT_CONFIGS:
        print("WARNING: No zarr configs discovered. Tests will be limited to API endpoints only.")


# ---------------------------------------------------------------------------
# Viewport burst sizes derived from zarray shape/chunk analysis
# At each zoom level, a typical map viewport covers roughly N spatial chunks.
# Based on observed chunk layout: shape=[time, y, x], chunks=[10, 200, 200]
# zoom 0: full extent fits in ~1x1 spatial chunks
# zoom 2: ~1x2
# zoom 4: ~2x4 = 8 chunks per time step
# zoom 8: ~4x8 = 32 chunks per time step (high detail)
# These are used by VisualizationUser to simulate realistic viewport bursts.
# ---------------------------------------------------------------------------
VIEWPORT_BURST_BY_ZOOM = {
    0: 1,
    2: 2,
    4: 8,
    8: 16,
}

# ---------------------------------------------------------------------------
# Task helpers
# ---------------------------------------------------------------------------

def _random_flat_config():
    if FLAT_CONFIGS:
        return random.choice(FLAT_CONFIGS)
    return None


def _random_tc_config():
    tc_configs = [c for c in FLAT_CONFIGS if c.get("has_tc") and c.get("valid_tcs")]
    if tc_configs:
        return random.choice(tc_configs)
    return None


def _random_collection():
    if DISCOVERED:
        return random.choice(list(DISCOVERED.keys()))
    return None


def _configs_for_collection(collection):
    """Return all flat configs for a specific collection."""
    return [c for c in FLAT_CONFIGS if c["collection"] == collection]


def _random_chunk(n_chunks):
    """Generate a random valid chunk coordinate from the full grid — guarantees cache miss."""
    if not n_chunks:
        return None
    return ".".join(str(random.randint(0, max(0, n - 1))) for n in n_chunks)


def _viewport_chunks(cfg, burst_size, origin=None):
    """
    Simulate a viewport pan using the discovered chunk pool.
    The fixed pool ensures multiple users hit the same chunks, warming Redis.
    origin is kept for API compatibility but not used.
    """
    chunks = cfg.get("chunks", [])
    if not chunks:
        return [], None
    start = random.randint(0, max(0, len(chunks) - burst_size))
    return chunks[start:start + burst_size], start


def _random_uncached_config():
    """
    Pick a random instance from DISCOVERED that is different from recently used ones.
    Uses that instance's own validated configs rather than substituting a template,
    guaranteeing no 404s while still hitting uncached paths.
    """
    if not DISCOVERED:
        return None
    collection = random.choice(list(DISCOVERED.keys()))
    instances = list(DISCOVERED[collection].keys())
    if not instances:
        return None
    instance = random.choice(instances)
    configs = DISCOVERED[collection][instance]
    if not configs:
        return None
    cfg = random.choice(configs)
    return {
        "collection": collection,
        "instance": instance,
        **cfg,
    }


# ---------------------------------------------------------------------------
# Task mixins
# ---------------------------------------------------------------------------

class ZarrTasks(TaskSet):

    def on_start(self):
        import gevent
        while not FLAT_CONFIGS or not DISCOVERED:
            gevent.sleep(0.5)

    @task(5)
    def zarr_chunk_uncached(self):
        cfg = _random_flat_config()
        if not cfg:
            return
        chunk = random.choice(cfg["chunks"])
        self.client.get(f"{cfg['base_path']}/{cfg['param']}/{chunk}", name="/collections/{c}/instances/{i}/items/zarr/{p}/chunk")

    @task(3)
    def zarr_tc_random(self):
        cfg = _random_tc_config()
        if not cfg:
            cfg = _random_flat_config()
            if not cfg:
                return
            chunk = random.choice(cfg["chunks"])
            self.client.get(f"{cfg['base_path']}/{cfg['param']}/{chunk}", name="/collections/{c}/instances/{i}/items/zarr/{p}/chunk")
            return
        tc = random.choice(cfg["valid_tcs"])
        base = f"{cfg['base_path']}/tc{tc}"
        self.client.get(f"{base}/.zmetadata", name="/collections/{c}/instances/{i}/items/zarr/tc/.zmetadata")
        chunk = random.choice(cfg["chunks"])
        self.client.get(f"{base}/{cfg['param']}/{chunk}", name="/collections/{c}/instances/{i}/items/zarr/tc/{p}/chunk")

    @task(2)
    def zarr_metadata(self):
        cfg = _random_flat_config()
        if not cfg:
            return
        self.client.get(f"{cfg['base_path']}/.zmetadata", name="/collections/{c}/instances/{i}/items/zarr/.zmetadata")


class ApiTasks(TaskSet):

    @task(1)
    def collection_instances(self):
        collection = _random_collection()
        if not collection:
            return
        self.client.get(f"/collections/{collection}/instances?f=json", name="/collections/{c}/instances")

    @task(1)
    def landing_page(self):
        self.client.get("/", name="/")


# ---------------------------------------------------------------------------
# User classes
# ---------------------------------------------------------------------------

class LoadTestUser(HttpUser):
    """
    Realistic load test with think time between requests.
    Use for baseline comparison between :443, :8443, :9443.
    """
    wait_time = between(1, 3)
    tasks = [ZarrTasks, ApiTasks]


class StressTestUser(HttpUser):
    """
    Stress test — no wait time, maximum throughput to find breaking point.
    """
    wait_time = constant(0)
    tasks = [ZarrTasks]


class VisualizationUser(HttpUser):
    """
    Simulates a browser-based map visualization client (e.g. NWSViz).
    """
    weight = 75
    wait_time = between(2, 5)

    def on_start(self):
        """Wait for discovery then pick a session."""
        import gevent
        while not FLAT_CONFIGS or not DISCOVERED:
            gevent.sleep(0.5)
        self._pick_session()
        self.viewport_origin = None
        def _model_refresh():
            # Stagger initial refresh with random offset so not all users burst simultaneously
            gevent.sleep(random.randint(60, 300))
            while True:
                self._pick_new_model()
                gevent.sleep(300)
        gevent.spawn(_model_refresh)

    def _pick_new_model(self):
        """Force switch to an uncached instance — simulates new model run arriving."""
        cfg = _random_uncached_config()
        if not cfg:
            return
        self.collection = cfg["collection"]
        self.instance = cfg["instance"]
        self.current_cfg = cfg
        parts = cfg["base_path"].split("/")
        try:
            zarr_idx = parts.index("zarr")
            zoom = int(parts[zarr_idx + 2]) if zarr_idx + 2 < len(parts) else 0
        except (ValueError, IndexError):
            zoom = 0
        self.zoom = zoom
        self.burst_size = VIEWPORT_BURST_BY_ZOOM.get(zoom, 4)

    def _pick_session(self):
        """Select a random collection/instance/zoom for this user's current session.
        50% chance of picking from full instance pool (cache miss) vs discovered pool (cache hit).
        """
        if ALL_INSTANCES and random.random() < 0.5:
            cfg = _random_uncached_config()
        else:
            cfg = _random_flat_config()
        if not cfg:
            self.collection = None
            self.instance = None
            self.current_cfg = None
            self.viewport_origin = None
            return
        self.collection = cfg["collection"]
        self.instance = cfg["instance"]
        self.current_cfg = cfg
        self.viewport_origin = None  # reset origin on session change

        parts = cfg["base_path"].split("/")
        try:
            zarr_idx = parts.index("zarr")
            zoom = int(parts[zarr_idx + 2]) if zarr_idx + 2 < len(parts) else 0
        except (ValueError, IndexError):
            zoom = 0
        self.zoom = zoom
        self.burst_size = VIEWPORT_BURST_BY_ZOOM.get(zoom, 4)

    @task(8)
    def viewport_pan(self):
        """
        Simulate a map pan — request spatially adjacent chunks near current viewport origin.
        Repeated pans in the same area generate cache hits; occasional drift creates misses.
        """
        if not self.current_cfg:
            return
        chunks, new_origin = _viewport_chunks(self.current_cfg, self.burst_size, self.viewport_origin)
        self.viewport_origin = new_origin
        for chunk in chunks:
            self.client.get(
                f"{self.current_cfg['base_path']}/{self.current_cfg['param']}/{chunk}",
                name=f"/collections/{{c}}/instances/{{i}}/items/zarr/{{p}}/zoom{self.zoom}/chunk"
            )

    @task(3)
    def fetch_metadata(self):
        """Fetch zarr metadata — happens when user first opens a dataset."""
        if not self.current_cfg:
            return
        self.client.get(
            f"{self.current_cfg['base_path']}/.zmetadata",
            name="/collections/{c}/instances/{i}/items/zarr/.zmetadata"
        )

    @task(1)
    def switch_param(self):
        """
        Simulate user switching to a different parameter on the same instance.
        Same instance = same session, but new param = cache misses for those chunks.
        """
        if not self.collection or not self.instance:
            return
        # Find all configs for the current instance
        instance_configs = [
            c for c in FLAT_CONFIGS
            if c["collection"] == self.collection and c["instance"] == self.instance
            and c != self.current_cfg
        ]
        if not instance_configs:
            return
        cfg = random.choice(instance_configs)
        self.current_cfg = cfg
        parts = cfg["base_path"].split("/")
        try:
            zarr_idx = parts.index("zarr")
            zoom = int(parts[zarr_idx + 2]) if zarr_idx + 2 < len(parts) else 0
        except (ValueError, IndexError):
            zoom = 0
        self.zoom = zoom
        self.burst_size = VIEWPORT_BURST_BY_ZOOM.get(zoom, 4)

    @task(1)
    def switch_instance(self):
        """
        Simulate user switching to a different model run.
        New instance = cold cache = burst of cache misses again.
        """
        self._pick_session()


class BatchTasks(TaskSet):

    def on_start(self):
        import gevent
        while not FLAT_CONFIGS or not DISCOVERED:
            gevent.sleep(0.5)

    @task(5)
    def zarr_chunk_cache_miss(self):
        cfg = _random_uncached_config()
        if not cfg:
            return
        chunk = random.choice(cfg["chunks"])
        self.client.get(
            f"{cfg['base_path']}/{cfg['param']}/{chunk}",
            name="/collections/{c}/instances/{i}/items/zarr/{p}/chunk"
        )

    @task(2)
    def zarr_metadata_cache_miss(self):
        cfg = _random_uncached_config()
        if not cfg:
            return
        self.client.get(
            f"{cfg['base_path']}/.zmetadata",
            name="/collections/{c}/instances/{i}/items/zarr/.zmetadata"
        )


class BatchUser(HttpUser):
    """
    Simulates a programmatic batch client — always cache misses by picking
    random instances from the full instance pool, not just discovered ones.
    """
    weight = 25
    wait_time = between(0.5, 1.5)
    tasks = [BatchTasks]


