#!/bin/bash
set -e

# Usage:
#   ./run_all.sh production        -> :443  (m5n.4xlarge baseline)
#   ./run_all.sh memory            -> :8443 (m8i.4xlarge)
#   ./run_all.sh compute           -> :9443 (c7i.4xlarge)
#   ./run_all.sh memory post_optim -> :8443 with suffix appended to run tag

TARGET=${1:-production}
SUFFIX=${2:-}

case $TARGET in
    production) HOST="https://edr-api-desi-c.mdl.nws.noaa.gov" ;;
    memory)     HOST="https://edr-api-desi-c.mdl.nws.noaa.gov:8443" ;;
    compute)    HOST="https://edr-api-desi-c.mdl.nws.noaa.gov:9443" ;;
    *) echo "Unknown target: $TARGET. Use production, memory, or compute."; exit 1 ;;
esac

RUN_TAG=$(date +%m_%d_%y)_${TARGET}${SUFFIX:+_$SUFFIX}
NUM_WORKERS=8
LOCUST_FILE="locustfile.py"
OUTPUT_DIR="real_life_${RUN_TAG}"

echo "================================================="
echo "Target:  $TARGET ($HOST)"
echo "Run tag: $RUN_TAG"
echo "================================================="
echo ""
echo "This test simulates the real-life production scenario:"
echo "  - VisualizationUser (85%) — NWSViz map clients panning/zooming"
echo "    with cache miss bursts every 5 minutes (new model run arrival)"
echo "  - BatchUser (15%) — programmatic clients with sustained cache misses"
echo "  - Flat 500 users for 30 minutes"
echo ""
echo "⚠️  Redis must be flushed before running to guarantee a cold"
echo "   cache. Run the following on the Kubernetes cluster:"
echo ""
echo "   kubectl exec -n edr-api \$(kubectl get pod -n edr-api -l app=redis -o jsonpath='{.items[0].metadata.name}') -- redis-cli FLUSHALL"
echo ""
read -p "Confirm Redis has been flushed and you are ready to proceed? (y/N): " confirm
[ "$confirm" = "y" ] || [ "$confirm" = "Y" ] || { echo "Aborting."; exit 1; }

echo ""
echo "Starting real-life test..."
mkdir -p "$OUTPUT_DIR"

locust -f "$LOCUST_FILE" \
    --host "$HOST" \
    --headless \
    --processes $NUM_WORKERS \
    --users 500 \
    --spawn-rate 50 \
    --run-time 30m \
    --html "$OUTPUT_DIR/index.html" \
    --csv "$OUTPUT_DIR/${OUTPUT_DIR}" \
    VisualizationUser BatchUser || true

echo ""
echo "================================================="
echo "Test complete for $TARGET"
echo "Results: $OUTPUT_DIR/"
echo "================================================="

python3 generate_report.py "$OUTPUT_DIR" "$TARGET" || true
