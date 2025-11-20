#!/usr/bin/env python3
"""
Quick test script to verify the zarr difference process fixes.
"""
import requests
import json
import time

BASE_URL = "http://localhost:5401"

def test_zarr_difference_minimal():
    """Test zarr difference with minimal parameters (should use defaults)."""
    payload = {
        "inputs": {
            "collection_a": "NBM_icechunk",
            "instance_a": "2025-09-22T00:00:00Z",
            "collection_b": "NBM_icechunk", 
            "instance_b": "2025-09-22T00:00:00Z",
            "parameter_name": "temperature",
            "zoom_level": 8,
            "datetime": "2025-09-22T12:00:00Z"
        }
    }
    
    print("Testing zarr difference with minimal parameters...")
    start_time = time.time()
    
    try:
        response = requests.post(
            f"{BASE_URL}/processes/edr-zarr-difference/execution",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        elapsed = time.time() - start_time
        print(f"Response status: {response.status_code}")
        print(f"Response time: {elapsed:.2f}s")
        
        if response.status_code == 200:
            print("✅ Minimal parameters test PASSED")
            return True
        else:
            print(f"❌ Minimal parameters test FAILED: {response.text}")
            return False
            
    except Exception as e:
        elapsed = time.time() - start_time
        print(f"❌ Minimal parameters test ERROR after {elapsed:.2f}s: {e}")
        return False

def test_zarr_difference_full():
    """Test zarr difference with all parameters."""
    payload = {
        "inputs": {
            "collection_a": "NBM_icechunk",
            "instance_a": "2025-09-22T00:00:00Z",
            "collection_b": "NBM_icechunk", 
            "instance_b": "2025-09-22T00:00:00Z",
            "parameter_name": "temperature",
            "zoom_level": 8,
            "crs": 4326,
            "unit": "degF",
            "datetime": "2025-09-22T12:00:00Z"
        }
    }
    
    print("\nTesting zarr difference with full parameters...")
    start_time = time.time()
    
    try:
        response = requests.post(
            f"{BASE_URL}/processes/edr-zarr-difference/execution",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        elapsed = time.time() - start_time
        print(f"Response status: {response.status_code}")
        print(f"Response time: {elapsed:.2f}s")
        
        if response.status_code == 200:
            print("✅ Full parameters test PASSED")
            return True
        else:
            print(f"❌ Full parameters test FAILED: {response.text}")
            return False
            
    except Exception as e:
        elapsed = time.time() - start_time
        print(f"❌ Full parameters test ERROR after {elapsed:.2f}s: {e}")
        return False

def test_basic_endpoints():
    """Test basic endpoints to ensure API is responsive."""
    print("\nTesting basic API endpoints...")
    
    try:
        # Test root endpoint
        response = requests.get(f"{BASE_URL}/", timeout=10)
        if response.status_code == 200:
            print("✅ Root endpoint OK")
        else:
            print(f"❌ Root endpoint failed: {response.status_code}")
            return False
            
        # Test collections endpoint
        response = requests.get(f"{BASE_URL}/collections", timeout=10)
        if response.status_code == 200:
            print("✅ Collections endpoint OK")
            return True
        else:
            print(f"❌ Collections endpoint failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Basic endpoints test ERROR: {e}")
        return False

if __name__ == "__main__":
    print("Testing zarr difference process fixes...")
    print("=" * 50)
    
    # Test basic connectivity first
    if not test_basic_endpoints():
        print("\n❌ Basic API connectivity failed. Is the server running?")
        exit(1)
    
    # Test the fixes
    minimal_ok = test_zarr_difference_minimal()
    full_ok = test_zarr_difference_full()
    
    print("\n" + "=" * 50)
    if minimal_ok and full_ok:
        print("🎉 All tests PASSED! The fixes are working.")
    else:
        print("❌ Some tests failed. Check the server logs for details.")
        exit(1)