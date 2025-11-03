#!/bin/bash
set -euo pipefail

EDR_HOST="${1:-https://edr-api-desi-c.mdl.nws.noaa.gov}"

echo "Deploying Locust load testing..."
echo "Target EDR Host: $EDR_HOST"

# Update the deployment with the specified EDR host
sed "s|LOCUST_HOST_PLACEHOLDER|$EDR_HOST|g" locust-deployment.yaml | kubectl apply -f -

echo "Waiting for pods to be ready..."
kubectl wait --for=condition=ready pod -l app=locust-master --timeout=60s
kubectl wait --for=condition=ready pod -l app=locust-worker --timeout=60s

echo "Getting Locust web UI URL..."
kubectl get service locust-master

minikube tunnel --bind-address=0.0.0.0 --cleanup=true &
echo "Locust deployment complete. Access web UI at http://<external-ip>:8089"
echo "Usage: $0 [EDR_HOST_URL]"
