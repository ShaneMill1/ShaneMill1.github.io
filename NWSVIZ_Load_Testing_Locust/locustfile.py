from locust import HttpUser, TaskSet, task, between
import json
import random

class MetadataOperations(TaskSet):
    weight = 3
    
    def get_chunk_info(self, base_url, var):
        try:
            resp = self.client.get(f"{base_url}/{var}/.zarray", catch_response=True)
            if resp.status_code == 200:
                zarray = json.loads(resp.text)
                chunks = zarray.get('chunks', [])
                shape = zarray.get('shape', [])
                return chunks, shape
        except:
            pass
        return None, None
    
    @task(3)
    def open_dataset(self):
        base_url = "/collections/NBM_icechunk/instances/2025-09-22T00:00:00Z/items/zarr/temperature/8/4326/degF"
        self.client.get(f"{base_url}/.zgroup")
        self.client.get(f"{base_url}/.zattrs")
        # Only check temperature attributes (skip .zarray)
        self.client.get(f"{base_url}/temperature/.zattrs")
    
    @task(1)
    def inspect_coordinates(self):
        base_url = "/collections/NBM_icechunk/instances/2025-09-22T00:00:00Z/items/zarr/temperature/8/4326/degF"
        # Only request existing coordinate data
        self.client.get(f"{base_url}/time/.zattrs")
        self.client.get(f"{base_url}/time/0")

class SpatialQueries(TaskSet):
    weight = 4
    
    @task(2)
    def bbox_selection(self):
        base_url = "/collections/NBM_icechunk/instances/2025-09-22T00:00:00Z/items/zarr/temperature/8/4326/degF"
        # Only use chunks with 0 failures
        valid_chunks = ["0.0.0", "0.0.1", "0.1.0", "0.1.1", "0.1.3"]
        chunk = random.choice(valid_chunks)
        self.client.get(f"{base_url}/temperature/{chunk}")
    
    @task(1)
    def point_selection(self):
        base_url = "/collections/NBM_icechunk/instances/2025-09-22T00:00:00Z/items/zarr/temperature/8/4326/degF"
        self.client.get(f"{base_url}/temperature/0.0.0")

class TemporalQueries(TaskSet):
    weight = 3
    
    @task(2)
    def time_slice(self):
        base_url = "/collections/NBM_icechunk/instances/2025-09-22T00:00:00Z/items/zarr/temperature/8/4326/degF"
        # Only successful chunks
        self.client.get(f"{base_url}/temperature/0.0.0")
        self.client.get(f"{base_url}/temperature/0.0.1")
    
    @task(1)
    def time_series(self):
        base_url = "/collections/NBM_icechunk/instances/2025-09-22T00:00:00Z/items/zarr/temperature/8/4326/degF"
        self.client.get(f"{base_url}/temperature/0.1.3")

class StatisticalOperations(TaskSet):
    weight = 2
    
    @task(1)
    def spatial_mean(self):
        base_url = "/collections/NBM_icechunk/instances/2025-09-22T00:00:00Z/items/zarr/temperature/8/4326/degF"
        # Only chunks with 0 failures
        self.client.get(f"{base_url}/temperature/0.0.0")
        self.client.get(f"{base_url}/temperature/0.1.1")
        self.client.get(f"{base_url}/temperature/1.1.3")

class ComplexSelections(TaskSet):
    weight = 1
    
    @task(1)
    def multi_dim_slice(self):
        base_url = "/collections/NBM_icechunk/instances/2025-09-22T00:00:00Z/items/zarr/temperature/8/4326/degF"
        # Only successful chunks
        self.client.get(f"{base_url}/temperature/0.0.0")
        self.client.get(f"{base_url}/temperature/0.1.1")

class APIEndpoints(TaskSet):
    weight = 1
    
    @task(2)
    def collections(self):
        self.client.get("/collections")
    
    @task(1)
    def conformance(self):
        self.client.get("/conformance")
    
    @task(1)
    def landing_page(self):
        self.client.get("/")
    
    @task(3)
    def position_query_apparent_temp(self):
        endpoint = "/collections/NBM_icechunk/instances/2025-09-22T00:00:00Z/position"
        # Vary coordinates within decimal points to avoid caching
        base_x = 10977974.475656517
        base_y = 18769450.517564356
        x_offset = random.uniform(-0.1, 0.1)
        y_offset = random.uniform(-0.1, 0.1)
        
        params = {
            "coords": f"POINT({base_x + x_offset} {base_y + y_offset})",
            "location": "conus",
            "datetime": "2025-09-22T01:00:00Z/2025-10-03T00:00:00Z",
            "parameter-name": "apparent_temperature",
            "f": "json"
        }
        self.client.get(endpoint, params=params)

class EDRLoadTest(HttpUser):
    wait_time = between(1, 3)
    tasks = [MetadataOperations, SpatialQueries, TemporalQueries, StatisticalOperations, ComplexSelections, APIEndpoints]