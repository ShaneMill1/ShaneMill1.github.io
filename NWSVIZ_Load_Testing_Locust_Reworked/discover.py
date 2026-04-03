"""
Pre-test discovery script. Run once before locust to populate discovery_cache.json.
Workers load from the cache file — no discovery HTTP calls during load testing.

Usage:
    python3 discover.py https://edr-api-desi-c.mdl.nws.noaa.gov:8443
"""
import json
import math
import random
import subprocess
import sys


def _get(url, timeout=30):
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


def _get_chunks_from_zarray(host, base_path, param):
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


def _validate_chunk_readable(host, base_path, param, chunks):
    for chunk in chunks[:3]:
        result = subprocess.run(
            ["curl", "-sk", "--max-time", "30", "-o", "/dev/null", "-w", "%{http_code}",
             f"{host}{base_path}/{param}/{chunk}"],
            capture_output=True, text=True
        )
        if result.returncode == 0 and result.stdout.strip() == "200":
            return True
    return False


def _discover_zarr_configs(host, instance_path):
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

    epsg = supported_crs[0] if supported_crs else "4326"
    unit = supported_units[0] if supported_units else ""
    zoom = zoom_levels[0] if zoom_levels else "0"

    for param in parameters[:5]:
        base = f"{instance_path}/items/zarr/{param}/{zoom}/{epsg}"
        if unit:
            base += f"/{unit}"
        chunks, n_chunks = _get_chunks_from_zarray(host, base, param)
        if not chunks:
            continue
        if not _validate_chunk_readable(host, base, param, chunks):
            continue
        configs.append({
            "base_path": base,
            "param": param,
            "chunks": chunks,
            "n_chunks": n_chunks,
            "has_tc": False,
        })
    return configs


def discover_all(host):
    discovered = {}
    flat = []
    all_instances = {}

    print(f"\n{'='*60}")
    print(f"Discovery: {host}")
    print(f"{'='*60}")

    collections_data = _get(f"{host}/collections?f=json")
    if not collections_data:
        print("ERROR: Could not fetch collections")
        sys.exit(1)

    collections = collections_data.get("collections", [])
    print(f"Found {len(collections)} collections\n")

    for i, coll in enumerate(collections, 1):
        collection_id = coll.get("id")
        if not collection_id:
            continue

        print(f"[{i}/{len(collections)}] {collection_id}...", end=" ", flush=True)
        instances_data = _get(f"{host}/collections/{collection_id}/instances?f=json")
        if not instances_data:
            print("no instances")
            continue

        instances = instances_data.get("instances", [])
        if not instances:
            print("no instances")
            continue

        print(f"{len(instances)} instances")
        all_instances[collection_id] = [inst.get("id") for inst in instances if inst.get("id")]

        sampled = random.sample(instances, min(50, len(instances)))
        discovered[collection_id] = {}

        for j, inst in enumerate(sampled, 1):
            instance_id = inst.get("id")
            if not instance_id:
                continue

            print(f"  [{j}/{len(sampled)}] {instance_id}...", end=" ", flush=True)
            instance_path = f"/collections/{collection_id}/instances/{instance_id}"
            configs = _discover_zarr_configs(host, instance_path)

            if configs:
                discovered[collection_id][instance_id] = configs
                for cfg in configs:
                    flat.append({"collection": collection_id, "instance": instance_id, **cfg})
                print(f"{len(configs)} configs")
            else:
                print("no configs — trying fallback...", end=" ", flush=True)
                remaining = [x for x in instances if x.get("id") not in [s.get("id") for s in sampled]]
                found = False
                for fallback in remaining[:20]:
                    fallback_id = fallback.get("id")
                    if not fallback_id:
                        continue
                    fallback_path = f"/collections/{collection_id}/instances/{fallback_id}"
                    configs = _discover_zarr_configs(host, fallback_path)
                    if configs:
                        discovered[collection_id][fallback_id] = configs
                        for cfg in configs:
                            flat.append({"collection": collection_id, "instance": fallback_id, **cfg})
                        print(f"ok ({fallback_id}, {len(configs)} configs)")
                        found = True
                        break
                if not found:
                    print("skipped")

        if not discovered[collection_id]:
            del discovered[collection_id]

    # Filter all_instances to valid collections only
    valid_collections = set(cfg["collection"] for cfg in flat)
    all_instances = {k: v for k, v in all_instances.items() if k in valid_collections}

    print(f"\n{'='*60}")
    print(f"Collections: {len(discovered)}")
    print(f"Total configs: {len(flat)}")
    print(f"{'='*60}\n")

    return {"discovered": discovered, "flat_configs": flat, "all_instances": all_instances}


if __name__ == "__main__":
    host = sys.argv[1] if len(sys.argv) > 1 else "https://edr-api-desi-c.mdl.nws.noaa.gov:8443"
    cache_file = sys.argv[2] if len(sys.argv) > 2 else "discovery_cache.json"

    result = discover_all(host)

    with open(cache_file, "w") as f:
        json.dump(result, f)

    print(f"Discovery saved to {cache_file}")
