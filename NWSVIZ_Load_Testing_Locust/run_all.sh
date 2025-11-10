#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# Function to handle errors
handle_error() {
    echo "ERROR: Command failed at line $1"
    echo "Last command: $2"
    exit 1
}

# Trap errors
trap 'handle_error $LINENO "$BASH_COMMAND"' ERR

# --- Configuration ---
HOST_URL="https://edr-api-desi-c.mdl.nws.noaa.gov"
LOCUST_FILE="locustfile.py"

# Generate a unique tag for this test run (format: Month_Day_Year)
# This replaces the hardcoded "11_10_25"
RUN_TAG=$(date +%m_%d_%y)

# --- Timer Start ---
start_time=$(date +%s)
echo "Starting Locust test suite at $(date)"
echo "-------------------------------------------------"
echo "Target host: $HOST_URL"
echo "Locust file: $LOCUST_FILE"
echo "Run tag: $RUN_TAG"
echo "-------------------------------------------------"

# --- Test 1: 100 Users ---
USER_COUNT=100
OUTPUT_DIR="${USER_COUNT}users_${RUN_TAG}"
echo "Running test 1: $USER_COUNT users for 30 minutes..."
echo "Output directory: $OUTPUT_DIR"
if [ -d "$OUTPUT_DIR" ]; then
    rm -rf "$OUTPUT_DIR"/*
else
    mkdir -p "$OUTPUT_DIR"
fi
echo "Starting locust command..."
locust -f "$LOCUST_FILE" --host "$HOST_URL" -u $USER_COUNT -t 30m --headless \
       --html "$OUTPUT_DIR/index.html" \
       --csv "$OUTPUT_DIR/${OUTPUT_DIR}" || true
echo "Test 1 (100 users) finished successfully."
echo "-------------------------------------------------"

# --- Test 2: 250 Users ---
USER_COUNT=250
OUTPUT_DIR="${USER_COUNT}users_${RUN_TAG}"
echo "Running test 2: $USER_COUNT users for 30 minutes..."
echo "Output directory: $OUTPUT_DIR"
if [ -d "$OUTPUT_DIR" ]; then
    rm -rf "$OUTPUT_DIR"/*
else
    mkdir -p "$OUTPUT_DIR"
fi
echo "Starting locust command..."
locust -f "$LOCUST_FILE" --host "$HOST_URL" -u $USER_COUNT -t 30m --headless \
       --html "$OUTPUT_DIR/index.html" \
       --csv "$OUTPUT_DIR/${OUTPUT_DIR}" || true
echo "Test 2 (250 users) finished successfully."
echo "-------------------------------------------------"

# --- Test 3: 500 Users ---
USER_COUNT=500
OUTPUT_DIR="${USER_COUNT}users_${RUN_TAG}"
echo "Running test 3: $USER_COUNT users for 30 minutes..."
echo "Output directory: $OUTPUT_DIR"
if [ -d "$OUTPUT_DIR" ]; then
    rm -rf "$OUTPUT_DIR"/*
else
    mkdir -p "$OUTPUT_DIR"
fi
echo "Starting locust command..."
locust -f "$LOCUST_FILE" --host "$HOST_URL" -u $USER_COUNT -t 30m --headless \
       --html "$OUTPUT_DIR/index.html" \
       --csv "$OUTPUT_DIR/${OUTPUT_DIR}" || true
echo "Test 3 (500 users) finished successfully."
echo "-------------------------------------------------"

# --- Test 4: 1000 Users ---
USER_COUNT=1000
OUTPUT_DIR="${USER_COUNT}users_${RUN_TAG}"
echo "Running test 4: $USER_COUNT users for 30 minutes..."
echo "Output directory: $OUTPUT_DIR"
if [ -d "$OUTPUT_DIR" ]; then
    rm -rf "$OUTPUT_DIR"/*
else
    mkdir -p "$OUTPUT_DIR"
fi
echo "Starting locust command..."
locust -f "$LOCUST_FILE" --host "$HOST_URL" -u $USER_COUNT -t 30m --headless \
       --html "$OUTPUT_DIR/index.html" \
       --csv "$OUTPUT_DIR/${OUTPUT_DIR}" || true
echo "Test 4 (1000 users) finished successfully."
echo "-------------------------------------------------"

# --- Timer End & Report ---
end_time=$(date +%s)
echo "Locust test suite finished at $(date)."

# Calculate total duration
duration=$((end_time - start_time))
hours=$((duration / 3600))
minutes=$(( (duration % 3600) / 60 ))
seconds=$((duration % 60))

echo "================================================="
printf "Total test suite duration: %02dh %02dm %02ds\n" $hours $minutes $seconds
echo "================================================="