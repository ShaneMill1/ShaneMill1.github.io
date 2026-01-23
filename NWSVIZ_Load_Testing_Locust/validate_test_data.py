#!/usr/bin/env python3
import requests
import json
import sys
from datetime import datetime

def validate_test_data(host_url, max_collections=15, max_instances_per_collection=5, max_chunks_per_param=15):
    """Query API to build validated test configuration"""
    print(f"Validating test data from {host_url}...")
    validated_configs = []
    
    # Get collections
    try:
        resp = requests.get(f"{host_url}/collections", timeout=30)
        resp.raise_for_status()
        collections = resp.json().get('collections', [])
        print(f"Found {len(collections)} collections")
    except Exception as e:
        print(f"ERROR: Failed to fetch collections: {e}")
        sys.exit(1)
    
    # Process subset of collections
    for collection in collections[:max_collections]:
        collection_id = collection.get('id')
        if not collection_id:
            continue
        
        print(f"\nProcessing collection: {collection_id}")
        
        # Get collection details to find instances
        try:
            coll_resp = requests.get(f"{host_url}/collections/{collection_id}", timeout=30)
            coll_resp.raise_for_status()
            coll_data = coll_resp.json()
            
            # Get instances from extent temporal interval
            extent = coll_data.get('extent', {}).get('temporal', {}).get('interval', [[]])
            instances_url = f"{host_url}/collections/{collection_id}/instances"
            inst_resp = requests.get(instances_url, timeout=30)
            
            if inst_resp.status_code != 200:
                print(f"  Skipping - no instances endpoint")
                continue
                
            instances_data = inst_resp.json()
            instances = instances_data.get('instances', [])[:max_instances_per_collection]
            print(f"  Found {len(instances)} instances")
            
        except Exception as e:
            print(f"  ERROR: {e}")
            continue
        
        # Process instances
        for instance in instances:
            instance_id = instance.get('id')
            if not instance_id:
                continue
            
            # Get zarr metadata for this instance
            try:
                zarr_meta_url = f"{host_url}/collections/{collection_id}/instances/{instance_id}/items/zarr"
                zarr_resp = requests.get(zarr_meta_url, timeout=30)
                if zarr_resp.status_code != 200:
                    print(f"  Skipping instance {instance_id} - no zarr metadata")
                    continue
                    
                zarr_data = zarr_resp.json()
                features = zarr_data.get('features', [])
                if not features:
                    continue
                
                properties = features[0].get('properties', {})
                parameters = properties.get('available_parameters', [])
                zoom_levels = sorted([int(z) for z in properties.get('available_zoom_levels', ['0'])])  # Sort ascending
                units_list = properties.get('supported_units', [''])
                
                print(f"  Instance {instance_id}: {len(parameters)} params, {len(zoom_levels)} zooms")
                
                for param_id in parameters[:2]:  # Limit to 2 parameters per instance
                    for zoom in zoom_levels[:2]:  # Test first 2 zoom levels
                        # Skip units for air_quality collections (special characters cause issues)
                        if 'air_quality' in collection_id:
                            test_units = ['']
                        else:
                            test_units = units_list[:1]
                        
                        for unit in test_units:
                            unit_str = f"/{unit}" if unit else ""
                            base_path = f"/collections/{collection_id}/instances/{instance_id}/items/zarr/{param_id}/{zoom}/4326{unit_str}"
                            
                            # Get zarr metadata to determine valid chunks
                            try:
                                zmeta_url = f"{host_url}{base_path}/.zmetadata"
                                zmeta_resp = requests.get(zmeta_url, timeout=10)
                                if zmeta_resp.status_code != 200:
                                    print(f"    ✗ {param_id} (zoom {zoom}): HTTP {zmeta_resp.status_code}")
                                    continue
                                
                                zmeta = zmeta_resp.json()
                                metadata = zmeta.get('metadata', {})
                                zarray_key = f"{param_id}/.zarray"
                                zarray = metadata.get(zarray_key, {})
                                
                                shape = zarray.get('shape', [])
                                chunks_size = zarray.get('chunks', [])
                                
                                if not shape or not chunks_size:
                                    continue
                                
                                # Calculate valid chunk indices
                                chunk_ranges = []
                                for dim_size, chunk_size in zip(shape, chunks_size):
                                    num_chunks = (dim_size + chunk_size - 1) // chunk_size
                                    chunk_ranges.append(num_chunks)
                                
                                # Generate sample chunk IDs
                                chunk_ids = []
                                if len(chunk_ranges) == 4:  # 4D array (ensemble/threshold, time, y, x)
                                    for d0 in range(min(chunk_ranges[0], 2)):
                                        for d1 in range(min(chunk_ranges[1], 2)):
                                            for y in range(min(chunk_ranges[2], 2)):
                                                for x in range(min(chunk_ranges[3], 2)):
                                                    chunk_ids.append(f"{d0}.{d1}.{y}.{x}")
                                                    if len(chunk_ids) >= max_chunks_per_param:
                                                        break
                                                if len(chunk_ids) >= max_chunks_per_param:
                                                    break
                                            if len(chunk_ids) >= max_chunks_per_param:
                                                break
                                        if len(chunk_ids) >= max_chunks_per_param:
                                            break
                                elif len(chunk_ranges) == 3:  # 3D array (time, y, x)
                                    for t in range(min(chunk_ranges[0], 3)):
                                        for y in range(min(chunk_ranges[1], 3)):
                                            for x in range(min(chunk_ranges[2], 3)):
                                                chunk_ids.append(f"{t}.{y}.{x}")
                                                if len(chunk_ids) >= max_chunks_per_param:
                                                    break
                                            if len(chunk_ids) >= max_chunks_per_param:
                                                break
                                        if len(chunk_ids) >= max_chunks_per_param:
                                            break
                                elif len(chunk_ranges) == 2:  # 2D array (y, x)
                                    for y in range(min(chunk_ranges[0], 5)):
                                        for x in range(min(chunk_ranges[1], 5)):
                                            chunk_ids.append(f"{y}.{x}")
                                            if len(chunk_ids) >= max_chunks_per_param:
                                                break
                                        if len(chunk_ids) >= max_chunks_per_param:
                                            break
                                
                                if chunk_ids:
                                    validated_configs.append({
                                        'path': base_path,
                                        'param': param_id,
                                        'chunks': chunk_ids,
                                        'collection': collection_id,
                                        'instance': instance_id,
                                        'zoom': zoom,
                                        'unit': unit
                                    })
                                    print(f"    ✓ {param_id} (zoom {zoom}): {len(chunk_ids)} chunks")
                                
                            except Exception as e:
                                print(f"    ✗ {param_id}: {e}")
                                continue
                
            except Exception as e:
                print(f"  ERROR processing instance {instance_id}: {e}")
                continue
    
    print(f"\n{'='*60}")
    print(f"Validation complete: {len(validated_configs)} configurations generated")
    print(f"{'='*60}")
    
    return validated_configs

if __name__ == "__main__":
    host_url = sys.argv[1] if len(sys.argv) > 1 else "https://edr-api-desi-c.mdl.nws.noaa.gov"
    output_file = sys.argv[2] if len(sys.argv) > 2 else "validated_test_config.json"
    
    configs = validate_test_data(host_url)
    
    if not configs:
        print("ERROR: No valid configurations found!")
        sys.exit(1)
    
    with open(output_file, 'w') as f:
        json.dump(configs, f, indent=2)
    
    print(f"\nValidated config saved to: {output_file}")
