#!/usr/bin/env python3
import glob
import csv
import re
from datetime import datetime
from collections import defaultdict

def parse_stats_file(filepath):
    """Extract key metrics from a stats CSV file."""
    try:
        with open(filepath, 'r') as f:
            reader = csv.DictReader(f)
            rows = list(reader)
            aggregated = [r for r in rows if r['Name'] == 'Aggregated']
            if aggregated:
                row = aggregated[0]
                return {
                    'total_requests': int(row['Request Count']),
                    'failures': int(row['Failure Count']),
                    'median_ms': float(row['Median Response Time']),
                    'avg_ms': float(row['Average Response Time']),
                    'p95_ms': float(row['95%']),
                    'p99_ms': float(row['99%']),
                    'max_ms': float(row['Max Response Time']),
                    'rps': float(row['Requests/s'])
                }
    except:
        pass
    return None

def extract_test_info(dirname):
    """Extract user count and date from directory name."""
    match = re.match(r'(\d+)users_(\d+)_(\d+)_(\d+)(?:_(.+))?', dirname)
    if match:
        users = int(match.group(1))
        month, day, year = int(match.group(2)), int(match.group(3)), int(match.group(4))
        label = match.group(5) or ''
        date = datetime(2000 + year, month, day)
        return users, date, label
    return None, None, None

# Scan all test directories
test_dirs = glob.glob('*users_*/')
results = defaultdict(lambda: defaultdict(list))

for test_dir in test_dirs:
    dirname = test_dir.rstrip('/')
    users, date, label = extract_test_info(dirname)
    if users and date:
        stats_files = glob.glob(f'{test_dir}*_stats.csv')
        for stats_file in stats_files:
            metrics = parse_stats_file(stats_file)
            if metrics:
                results[users][date.strftime('%Y-%m-%d')].append({
                    'label': label,
                    'metrics': metrics,
                    'dir': dirname
                })

# Generate comprehensive report
print("# EDR API Load Testing - Comprehensive Performance Report")
print("=" * 80)
print()

# Timeline of all tests
print("## Test Timeline")
print()
all_tests = []
for users in sorted(results.keys()):
    for date in sorted(results[users].keys()):
        for test in results[users][date]:
            all_tests.append((date, users, test['label'], test['metrics']))

print(f"Total test runs analyzed: {len(all_tests)}")
print(f"Date range: {min(t[0] for t in all_tests)} to {max(t[0] for t in all_tests)}")
print(f"User load levels tested: {sorted(set(t[1] for t in all_tests))}")
print()

# Performance by user load over time
print("## Performance Evolution by User Load")
print()
for users in sorted(results.keys()):
    print(f"### {users} Concurrent Users")
    print()
    print("| Date | Label | RPS | Avg (ms) | P95 (ms) | Failures | Total Requests |")
    print("|------|-------|-----|----------|----------|----------|----------------|")
    
    for date in sorted(results[users].keys()):
        for test in results[users][date]:
            m = test['metrics']
            label = test['label'] or '-'
            fail_pct = (m['failures'] / m['total_requests'] * 100) if m['total_requests'] > 0 else 0
            print(f"| {date} | {label:20s} | {m['rps']:7.1f} | {m['avg_ms']:8.1f} | {m['p95_ms']:8.0f} | {m['failures']:5d} ({fail_pct:.2f}%) | {m['total_requests']:,} |")
    print()

# Key milestones
print("## Key Performance Milestones")
print()

# Find best performance for each user load
for users in sorted(results.keys()):
    all_metrics = []
    for date in results[users].keys():
        for test in results[users][date]:
            all_metrics.append((date, test['label'], test['metrics']))
    
    if all_metrics:
        best_rps = max(all_metrics, key=lambda x: x[2]['rps'])
        best_latency = min(all_metrics, key=lambda x: x[2]['avg_ms'])
        most_reliable = min(all_metrics, key=lambda x: x[2]['failures'])
        
        print(f"### {users} Users - Best Results")
        print(f"- **Highest Throughput**: {best_rps[2]['rps']:.1f} RPS on {best_rps[0]} ({best_rps[1]})")
        print(f"- **Lowest Latency**: {best_latency[2]['avg_ms']:.1f}ms avg on {best_latency[0]} ({best_latency[1]})")
        print(f"- **Most Reliable**: {most_reliable[2]['failures']} failures on {most_reliable[0]} ({most_reliable[1]})")
        print()

# Compare specific test runs
print("## Notable Comparisons")
print()

# Early vs Latest
early_tests = [t for t in all_tests if t[0] < '2025-11-20']
recent_tests = [t for t in all_tests if t[0] >= '2026-01-20']

if early_tests and recent_tests:
    print("### Early Testing (Nov 2025) vs Recent Testing (Jan 2026)")
    print()
    for users in sorted(set(t[1] for t in all_tests)):
        early = [t for t in early_tests if t[1] == users]
        recent = [t for t in recent_tests if t[1] == users]
        if early and recent:
            early_avg_rps = sum(t[3]['rps'] for t in early) / len(early)
            recent_avg_rps = sum(t[3]['rps'] for t in recent) / len(recent)
            improvement = ((recent_avg_rps - early_avg_rps) / early_avg_rps * 100) if early_avg_rps > 0 else 0
            print(f"**{users} Users**: {early_avg_rps:.1f} RPS → {recent_avg_rps:.1f} RPS ({improvement:+.1f}%)")

print()
print("=" * 80)
print(f"Report generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
