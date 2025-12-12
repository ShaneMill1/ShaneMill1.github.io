from locust import HttpUser, TaskSet, task, between
import json
import random

# Test paths with valid chunks for each
TEST_CONFIGS = [
    {
        'path': '/collections/aigfs0p25_v1p0_global/instances/2025-11-23T00:00Z/items/zarr/temperature/0/4326/degF',
        'param': 'temperature',
        'chunks': ['0.3.7']
    },
    {
        'path': '/collections/nbm_v5p0_conus/instances/2025-11-18T00:00Z/items/zarr/temperature/8/4326/degF',
        'param': 'temperature',
        'chunks': ['0.0.1']
    },
    # {
    #     'path': '/collections/gefs0p25_global/instances/2025-12-07T00:00Z/items/zarr/temperature/0/4326/degF',
    #     'param': 'temperature',
    #     'chunks': ['0.0.3.3']
    # },
    {
        'path': '/collections/gefs0p5_global/instances/2025-11-18T00:00Z/items/zarr/temperature_ground_or_water_surface/0/4326/degF',
        'param': 'temperature_ground_or_water_surface',
        'chunks': ['0.0.3.3']
    },
    {
        'path': '/collections/urma2p5_conus/instances/2025-10-01T00:00Z/items/zarr/temperature_height_above_ground/0/4326/degF',
        'param': 'temperature_height_above_ground',
        'chunks': ['0.0.0']
    },
    {
        'path': '/collections/rtma2p5_conus/instances/2020-02-01T00:00Z/items/zarr/temperature_height_above_ground/0/4326/degF',
        'param': 'temperature_height_above_ground',
        'chunks': ['0.0.0']
    },
    {
        'path': '/collections/nbm_v5p0_conus/instances/2025-11-18T00:00Z/items/zarr/temperature/4/4326/degF',
        'param': 'temperature',
        'chunks': ['0.0.1']
    },
    {
        'path': '/collections/nbm_v5p0_conus/instances/2025-11-18T00:00Z/items/zarr/temperature/0/4326/degF',
        'param': 'temperature',
        'chunks': ['0.0.1']
    },
]

class MetadataOperations(TaskSet):
    weight = 2
    
    @task(1)
    def dataset_metadata(self):
        config = random.choice(TEST_CONFIGS)
        self.client.get(f"{config['path']}/.zgroup")
        self.client.get(f"{config['path']}/.zattrs")

class ZarrDataQueries(TaskSet):
    weight = 5
    
    @task(3)
    def random_chunk_access(self):
        config = random.choice(TEST_CONFIGS)
        chunk = random.choice(config['chunks'])
        self.client.get(f"{config['path']}/{config['param']}/{chunk}")
    
    @task(1)
    def multi_chunk_access(self):
        config = random.choice(TEST_CONFIGS)
        for chunk in config['chunks']:
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
    
    def create_new_job(self):
        payload = {
            "inputs": {
                "collection_a": "aigfs0p25_v1p0_global",
                "instance_a": "2025-11-23T00:00Z",
                "collection_b": "aigfs0p25_v1p0_global", 
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
        if StreamingZarrDifferenceOperations.shared_job_id is None:
            self.create_new_job()
        self.job_id = StreamingZarrDifferenceOperations.shared_job_id
    
    @task(3)
    def access_zarr_metadata(self):
        if self.job_id:
            with self.client.get(f"/difference-results/{self.job_id}/zarr/.zmetadata", catch_response=True) as response:
                if response.status_code == 503:
                    response.failure(f"Job {self.job_id} expired, creating new session")
                    self.job_id = self.create_new_job()
                    StreamingZarrDifferenceOperations.shared_job_id = self.job_id
                else:
                    StreamingZarrDifferenceOperations.consecutive_failures = 0
    
    @task(2)
    def access_coordinate_data(self):
        if self.job_id:
            coords = random.choice(['time', 'latitude', 'longitude'])
            with self.client.get(f"/difference-results/{self.job_id}/zarr/{coords}/0", catch_response=True) as response:
                if response.status_code == 404:
                    response.failure(f"Job {self.job_id} expired, creating new session")
                    self.job_id = self.create_new_job()
                    StreamingZarrDifferenceOperations.shared_job_id = self.job_id
    
    @task(5)
    def access_difference_chunks(self):
        if self.job_id:
            chunk = random.choice(["0.0", "0.1", "1.0", "1.1"])
            with self.client.get(f"/difference-results/{self.job_id}/zarr/temperature_difference/{chunk}", catch_response=True) as response:
                if response.status_code == 404:
                    response.failure(f"Job {self.job_id} expired, creating new session")
                    self.job_id = self.create_new_job()
                    StreamingZarrDifferenceOperations.shared_job_id = self.job_id
                elif response.status_code >= 500:
                    response.failure(f"Server error for chunk {chunk}")
                else:
                    StreamingZarrDifferenceOperations.consecutive_failures = 0

class EDRLoadTest(HttpUser):
    host = 'http://localhost:5401'
    wait_time = between(1, 3)
    tasks = [MetadataOperations, ZarrDataQueries, APIEndpoints, StreamingZarrDifferenceOperations]
