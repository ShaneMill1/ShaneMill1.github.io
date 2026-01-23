# Load Test Reporting Tools

Two Python scripts to analyze and communicate Locust load testing results.

## Scripts

### 1. `quick_summary.py` - Console Summary
Quick command-line summary with key metrics in table format.

**Usage:**
```bash
python3 quick_summary.py [pattern]
```

**Examples:**
```bash
# Analyze all test directories matching default pattern
python3 quick_summary.py

# Analyze specific test run
python3 quick_summary.py "*users_01_23_26_a"

# Analyze different date
python3 quick_summary.py "*users_01_24_26_*"
```

**Output:**
- Summary table with all key metrics
- Key findings and insights
- Failure analysis
- Performance degradation metrics

---

### 2. `generate_report.py` - HTML Report
Comprehensive HTML report with interactive charts and detailed analysis.

**Usage:**
```bash
python3 generate_report.py [pattern] [output_file]
```

**Examples:**
```bash
# Generate report with default settings
python3 generate_report.py

# Specify custom pattern and output file
python3 generate_report.py "*users_01_23_26_a" report_jan23.html

# Generate report for specific test run
python3 generate_report.py "*users_01_24_*" latest_report.html
```

**Output:**
- Interactive HTML report with Plotly charts
- Response time trends (Median, P95, P99)
- Throughput analysis
- Percentile comparisons
- Automated insights and recommendations

---

## Quick Start

Run both tools in sequence:
```bash
python3 quick_summary.py && python3 generate_report.py
```

Then open `load_test_report.html` in your browser.

---

## Metrics Explained

- **RPS**: Requests per second (throughput)
- **Median**: 50th percentile response time
- **P95**: 95% of requests completed within this time
- **P99**: 99% of requests completed within this time
- **Max**: Maximum response time observed

---

## Requirements

```bash
pip install pandas
```

The HTML report uses Plotly.js loaded from CDN (no installation needed).
