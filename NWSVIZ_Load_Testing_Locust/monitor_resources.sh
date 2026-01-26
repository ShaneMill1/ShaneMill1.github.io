#!/bin/bash
# Monitor system resources during load test
OUTPUT_FILE="$1"
INTERVAL=5

echo "timestamp,cpu_percent,mem_percent,locust_cpu" > "$OUTPUT_FILE"

while true; do
    TIMESTAMP=$(date +%s)
    CPU=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
    MEM=$(free | grep Mem | awk '{printf "%.1f", $3/$2 * 100.0}')
    LOCUST_CPU=$(ps aux | grep "[l]ocust" | awk '{sum+=$3} END {print sum}')
    echo "$TIMESTAMP,$CPU,$MEM,${LOCUST_CPU:-0}" >> "$OUTPUT_FILE"
    sleep $INTERVAL
done
