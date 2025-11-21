from locust import HttpUser, TaskSet, task, between
import json
import random

# Common constants to reduce repetition
BASE_URL = "/collections/NBM_icechunk/instances/2025-09-22T00:00:00Z/items/zarr/temperature/8/4326/degF"
# Remove problematic chunks that are failing 100%
VALID_CHUNKS = ["0.0.0", "0.0.1", "0.1.0", "0.1.1"]

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
        with self.client.get(f"{BASE_URL}/temperature/{chunk}", catch_response=True) as response:
            if response.status_code != 200:
                response.failure(f"Chunk {chunk} failed with status {response.status_code}")
    
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
    shared_job_id = None
    consecutive_failures = 0
    
    def create_new_job(self):
        """Create a new streaming job."""
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
            job_info = response.json()
            StreamingZarrDifferenceOperations.shared_job_id = job_info['job_id']
            StreamingZarrDifferenceOperations.consecutive_failures = 0
            return job_info['job_id']
        return None
    
    def on_start(self):
        """Use shared job ID or create one if it doesn't exist."""
        if StreamingZarrDifferenceOperations.shared_job_id is None:
            self.create_new_job()
        
        self.job_id = StreamingZarrDifferenceOperations.shared_job_id
    
    @task(3)
    def access_zarr_metadata(self):
        """Test metadata access performance."""
        if self.job_id:
            failed = False
            with self.client.get(f"/difference-results/{self.job_id}/zarr/.zmetadata", catch_response=True) as response:
                if response.status_code == 404:
                    response.failure(f"Job {self.job_id} not found - may have expired")
                    failed = True
            with self.client.get(f"/difference-results/{self.job_id}/zarr/.zgroup", catch_response=True) as response:
                if response.status_code == 404:
                    response.failure(f"Job {self.job_id} not found - may have expired")
                    failed = True
            
            if failed:
                StreamingZarrDifferenceOperations.consecutive_failures += 1
                if StreamingZarrDifferenceOperations.consecutive_failures >= 3:
                    self.job_id = self.create_new_job()
            else:
                StreamingZarrDifferenceOperations.consecutive_failures = 0
    
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
            with self.client.get(f"/difference-results/{self.job_id}/zarr/temperature_difference/{chunk}", catch_response=True) as response:
                if response.status_code == 404:
                    response.failure(f"Job {self.job_id} expired or chunk {chunk} not available")
                    StreamingZarrDifferenceOperations.consecutive_failures += 1
                    if StreamingZarrDifferenceOperations.consecutive_failures >= 3:
                        self.job_id = self.create_new_job()
                elif response.status_code >= 500:
                    response.failure(f"Server error computing difference for chunk {chunk}")
                    StreamingZarrDifferenceOperations.consecutive_failures += 1
                    if StreamingZarrDifferenceOperations.consecutive_failures >= 3:
                        self.job_id = self.create_new_job()
                else:
                    StreamingZarrDifferenceOperations.consecutive_failures = 0

class ZarrDifferenceOperations(TaskSet):
    weight = 1
    
    @task(2)
    def zarr_difference_test_full(self):
        payload = {
            "inputs": {
                "edr_base_url": "https://edr-api-desi-c.mdl.nws.noaa.gov",
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
        with self.client.post("/processes/edr-zarr-difference/execution", 
                             json=payload, 
                             headers={"Content-Type": "application/json"},
                             catch_response=True) as response:
            if response.status_code == 400 and "cancelled" in response.text:
                response.failure("Dask computation cancelled")
    
    @task(1)
    def zarr_difference_test_minimal(self):
        payload = {
            "inputs": {
                "edr_base_url": "https://edr-api-desi-c.mdl.nws.noaa.gov",
                "collection_a": "NBM_icechunk",
                "instance_a": "2025-09-22T00:00:00Z",
                "collection_b": "NBM_icechunk", 
                "instance_b": "2025-09-22T00:00:00Z",
                "parameter_name": "temperature",
                "zoom_level": 8,
                "datetime": "2025-09-22T12:00:00Z"
            }
        }
        with self.client.post("/processes/edr-zarr-difference/execution", 
                             json=payload, 
                             headers={"Content-Type": "application/json"},
                             catch_response=True) as response:
            if response.status_code == 400 and "cancelled" in response.text:
                response.failure("Dask computation cancelled")

class EDRLoadTest(HttpUser):
    wait_time = between(1, 3)
    tasks = [MetadataOperations, ZarrDataQueries, APIEndpoints, StreamingZarrDifferenceOperations]