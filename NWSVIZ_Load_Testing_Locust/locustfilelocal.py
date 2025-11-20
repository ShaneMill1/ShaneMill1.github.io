from locust import HttpUser, TaskSet, task, between
import json
import random

# Common constants to reduce repetition
BASE_URL = "/collections/NBM_icechunk/instances/2025-09-22T00:00:00Z/items/zarr/temperature/8/4326/degF"
VALID_CHUNKS = ["0.0.0", "0.0.1", "0.1.0", "0.1.1", "0.1.3", "1.1.3"]

class MetadataOperations(TaskSet):
    weight = 2
    
    @task(1)
    def dataset_metadata(self):
        self.client.get(f"{BASE_URL}/.zgroup")
        self.client.get(f"{BASE_URL}/.zattrs")
        self.client.get(f"{BASE_URL}/temperature/.zattrs")
        self.client.get(f"{BASE_URL}/time/.zattrs")
        self.client.get(f"{BASE_URL}/time/0")

class ZarrDataQueries(TaskSet):
    weight = 5
    
    @task(3)
    def random_chunk_access(self):
        chunk = random.choice(VALID_CHUNKS)
        self.client.get(f"{BASE_URL}/temperature/{chunk}")
    
    @task(1)
    def multi_chunk_access(self):
        for chunk in random.sample(VALID_CHUNKS, 2):
            self.client.get(f"{BASE_URL}/temperature/{chunk}")

class APIEndpoints(TaskSet):
    weight = 1
    
    @task(2)
    def collections(self):
        self.client.get("/collections")
    
    @task(1)
    def landing_page(self):
        self.client.get("/")
    
    @task(3)
    def position_query_apparent_temp(self):
        endpoint = "/collections/NBM_icechunk/instances/2025-09-22T00:00:00Z/position"
        params = {
            "coords": "POINT(10977974.475656526 18769450.517564365)",
            "location": "conus",
            "datetime": "2025-09-22T01:00:00Z/2025-10-03T00:00:00Z",
            "parameter-name": "apparent_temperature",
            "f": "json"
        }
        self.client.get(endpoint, params=params)

class StreamingZarrDifferenceOperations(TaskSet):
    weight = 3
    
    def on_start(self):
        """Create a streaming difference job for this user."""
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
        response = self.client.post("/processes/edr-zarr-difference-streaming/execution", 
                                   json=payload, 
                                   headers={"Content-Type": "application/json"})
        if response.status_code == 200:
            self.job_info = response.json()
            self.job_id = self.job_info['job_id']
        else:
            self.job_id = None
    
    @task(3)
    def access_zarr_metadata(self):
        """Test metadata access performance."""
        if self.job_id:
            self.client.get(f"/difference-results/{self.job_id}/zarr/.zmetadata")
            self.client.get(f"/difference-results/{self.job_id}/zarr/.zgroup")
    
    @task(2)
    def access_coordinate_data(self):
        """Test coordinate data access (should be cached)."""
        if self.job_id:
            coords = random.choice(['time', 'x', 'y'])
            self.client.get(f"/difference-results/{self.job_id}/zarr/{coords}/0")
    
    @task(5)
    def access_difference_chunks(self):
        """Test on-demand difference chunk computation."""
        if self.job_id:
            chunk = random.choice(["0.0", "0.1", "1.0", "1.1"])
            self.client.get(f"/difference-results/{self.job_id}/zarr/temperature_difference/{chunk}")

class ZarrDifferenceOperations(TaskSet):
    weight = 1
    
    @task(2)
    def zarr_difference_test_full(self):
        payload = {
            "inputs": {
                "edr_base_url": "http://localhost:5401",
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
        self.client.post("/processes/edr-zarr-difference/execution", 
                        json=payload, 
                        headers={"Content-Type": "application/json"})
    
    @task(1)
    def zarr_difference_test_minimal(self):
        payload = {
            "inputs": {
                "edr_base_url": "http://localhost:5401",
                "collection_a": "NBM_icechunk",
                "instance_a": "2025-09-22T00:00:00Z",
                "collection_b": "NBM_icechunk", 
                "instance_b": "2025-09-22T00:00:00Z",
                "parameter_name": "temperature",
                "zoom_level": 8,
                "datetime": "2025-09-22T12:00:00Z"
            }
        }
        self.client.post("/processes/edr-zarr-difference/execution", 
                        json=payload, 
                        headers={"Content-Type": "application/json"})

class EDRLoadTest(HttpUser):
    wait_time = between(1, 3)
    tasks = [MetadataOperations, ZarrDataQueries, APIEndpoints, StreamingZarrDifferenceOperations, ZarrDifferenceOperations]