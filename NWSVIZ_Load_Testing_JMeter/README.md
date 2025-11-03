JMeter Test Plan (from Locust)

This directory contains a JMeter test plan (load_test.jmx) that was translated from a Python Locust script.

Files

load_test.jmx: The Apache JMeter test plan file. You can open this directly in JMeter.

valid_chunks.csv: A required data file used by the test plan for the "bbox_selection" task. It provides the list of valid chunks.

README.md: This file.

How to Use

Install JMeter: If you haven't already, download and install Apache JMeter from here.

Place CSV File: Ensure the valid_chunks.csv file is in the same directory as the load_test.jmx file (or in JMeter's bin directory). The test plan is configured to look for it by name.

Open Test Plan: Start JMeter and open the load_test.jmx file (File > Open).

Configure Target Server:

In the test plan tree on the left, click on "HTTP Request Defaults".

In the main panel, change YOUR_SERVER_HOST to the domain or IP address of your server (e.g., api.my-service.com).

Update the Protocol if necessary (e.g., from https to http).

Configure Load:

Click on "EDRLoadTest Users" (this is the Thread Group).

Adjust the "Number of Threads (users)", "Ramp-up period", and "Loop Count" to match your desired load.

Run Test:

Click the green "Start" button in the toolbar (or Run > Start).

You can watch the results come in by clicking on the "View Results Tree" and "Summary Report" listeners at the bottom of the test plan.

Translation Logic

Here is how the Locust concepts were mapped to JMeter:

EDRLoadTest(HttpUser): Mapped to the main Thread Group ("EDRLoadTest Users").

wait_time = between(1, 3): Mapped to a Uniform Random Timer with a 1000ms constant delay and a 2000ms random delay. This is placed at the Thread Group level to execute between tasks.

TaskSet Weights: The list of TaskSets and their weights (e.g., MetadataOperations weight 3, SpatialQueries weight 4) was translated into a series of top-level Throughput Controllers. The percentage for each is calculated from its weight divided by the total weight (14).

MetadataOperations: 3/14 = 21.43%

SpatialQueries: 4/14 = 28.57%

...and so on.

@task(n) Weights: The weighted tasks within each TaskSet (e.D., open_dataset weight 3, inspect_coordinates weight 1) were mapped to nested Throughput Controllers.

open_dataset: 3 / (3+1) = 75%

inspect_coordinates: 1 / (3+1) = 25%

Multi-Request Tasks: Tasks in Locust that make multiple self.client.get() calls (like open_dataset) are grouped in JMeter using a Transaction Controller. This groups the individual HTTP requests into a single "task" sample for clearer reporting.

random.choice(valid_chunks): This is handled by a CSV Data Set Config element, which reads from valid_chunks.csv and assigns the value to a variable named ${CHUNK}.

Ignored Code: The get_chunk_info function from the MetadataOperations class was defined in the Locust script but never called by a @task. Therefore, it was not included in the JMeter test plan as it does not contribute to the load simulation.
