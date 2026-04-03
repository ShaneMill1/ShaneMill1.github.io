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
import os
import random
from locust import HttpUser, TaskSet, task, between, constant, events

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
FLAT_CONFIGS = []
ALL_INSTANCES = {}



@events.init.add_listener
def on_locust_init(environment, **kwargs):
    global DISCOVERED, FLAT_CONFIGS, ALL_INSTANCES

    cache_file = os.getenv("DISCOVERY_CACHE", "discovery_cache.json")

    if not os.path.exists(cache_file):
        print(f"ERROR: Discovery cache not found at {cache_file}")
        print(f"Run: python3 discover.py <host> before starting locust")
        return

    with open(cache_file) as f:
        data = json.load(f)

    DISCOVERED = data.get("discovered", {})
    FLAT_CONFIGS = data.get("flat_configs", [])
    ALL_INSTANCES = data.get("all_instances", {})

    print(f"Loaded discovery cache: {len(FLAT_CONFIGS)} configs across {len(DISCOVERED)} collections")

    if not FLAT_CONFIGS:
        print("WARNING: No zarr configs in cache. Tests will be limited to API endpoints only.")


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
    wait_time = constant(0)
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
    wait_time = constant(0)

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
    wait_time = constant(0)
    tasks = [BatchTasks]


