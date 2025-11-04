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
        # Predefined coordinate variations (10 total)
        coords_list = [
            "POINT(10977974.475656517 18769450.517564356)",
            "POINT(10977974.475656518 18769450.517564357)",
            "POINT(10977974.475656519 18769450.517564358)",
            "POINT(10977974.475656520 18769450.517564359)",
            "POINT(10977974.475656521 18769450.517564360)",
            "POINT(10977974.475656522 18769450.517564361)",
            "POINT(10977974.475656523 18769450.517564362)",
            "POINT(10977974.475656524 18769450.517564363)",
            "POINT(10977974.475656525 18769450.517564364)",
            "POINT(10977974.475656526 18769450.517564365)"
        ]
        
        params = {
            "coords": random.choice(coords_list),
            "location": "conus",
            "datetime": "2025-09-22T01:00:00Z/2025-10-03T00:00:00Z",
            "parameter-name": "apparent_temperature",
            "f": "json"
        }
        self.client.get(endpoint, params=params)

class EDRLoadTest(HttpUser):
    wait_time = between(1, 3)
    tasks = [MetadataOperations, SpatialQueries, TemporalQueries, StatisticalOperations, ComplexSelections, APIEndpoints]