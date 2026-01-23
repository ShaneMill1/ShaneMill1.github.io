from locust import HttpUser, TaskSet, task, between
import json
import random
import threading
import os

# Load validated test configuration
CONFIG_FILE = os.getenv('TEST_CONFIG_FILE', 'validated_test_config.json')

try:
    with open(CONFIG_FILE, 'r') as f:
        TEST_CONFIGS = json.load(f)
    print(f"Loaded {len(TEST_CONFIGS)} validated test configurations")
except FileNotFoundError:
    print(f"ERROR: {CONFIG_FILE} not found. Run validate_test_data.py first!")
    TEST_CONFIGS = []

class MetadataOperations(TaskSet):
    weight = 2
    
    @task(1)
    def dataset_metadata(self):
        if not TEST_CONFIGS:
            return
        config = random.choice(TEST_CONFIGS)
        self.client.get(f"{config['path']}/.zgroup")
        self.client.get(f"{config['path']}/.zattrs")

class ZarrDataQueries(TaskSet):
    weight = 5
    
    @task(3)
    def random_chunk_access(self):
        if not TEST_CONFIGS:
            return
        config = random.choice(TEST_CONFIGS)
        chunk = random.choice(config['chunks'])
        self.client.get(f"{config['path']}/{config['param']}/{chunk}")
    
    @task(1)
    def multi_chunk_access(self):
        if not TEST_CONFIGS:
            return
        config = random.choice(TEST_CONFIGS)
        # Access 2-3 random chunks from same dataset
        num_chunks = min(random.randint(2, 3), len(config['chunks']))
        chunks = random.sample(config['chunks'], num_chunks)
        for chunk in chunks:
            self.client.get(f"{config['path']}/{config['param']}/{chunk}")

class APIEndpoints(TaskSet):
    weight = 3
    
    @task(2)
    def collections(self):
        self.client.get("/collections")
    
    @task(1)
    def landing_page(self):
        self.client.get("/")

class StreamingZarrDifferenceOperations(TaskSet):
    weight = 3
    shared_job_id = None
    consecutive_failures = 0
    _lock = threading.Lock()
    
    def create_new_job(self):
        # Use static, known-good data for difference operations
        payload = {
            "inputs": {
                "collection_a": "aigfs0p25_v1p0_global_latlon",
                "instance_a": "2025-11-23T00:00Z",
                "collection_b": "aigfs0p25_v1p0_global_latlon", 
                "instance_b": "2025-11-23T06:00Z",
                "parameter_name": "temperature",
                "zoom_level": 0,
                "epsg": 4326,
                "units": "degF",
                "datetime": "2025-11-24T12:00Z" 
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
        with StreamingZarrDifferenceOperations._lock:
            if StreamingZarrDifferenceOperations.shared_job_id is None:
                self.create_new_job()
            self.job_id = StreamingZarrDifferenceOperations.shared_job_id
    
    @task(3)
    def access_zarr_metadata(self):
        if self.job_id:
            self.client.get(f"/difference-results/{self.job_id}/zarr/.zmetadata")
    
    @task(2)
    def access_coordinate_data(self):
        if self.job_id:
            coords = random.choice(['latitude', 'longitude'])
            self.client.get(f"/difference-results/{self.job_id}/zarr/{coords}/0")
    
    @task(5)
    def access_difference_chunks(self):
        if self.job_id:
            chunk = random.choice(["0.0", "0.1", "1.0", "1.1"])
            self.client.get(f"/difference-results/{self.job_id}/zarr/temperature_difference/{chunk}")

class EDRLoadTest(HttpUser):
    host = 'http://localhost:5401'
    tasks = [MetadataOperations, ZarrDataQueries, APIEndpoints]
