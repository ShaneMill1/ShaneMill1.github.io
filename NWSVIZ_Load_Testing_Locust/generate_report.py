#!/usr/bin/env python3
import pandas as pd
import glob
import sys
from datetime import datetime

def load_test_data(pattern="*users_*_a"):
    dirs = sorted(glob.glob(pattern), key=lambda x: int(x.split('users')[0].split('/')[-1]))
    results = {}
    
    for d in dirs:
        stats_file = glob.glob(f"{d}/*_stats.csv")
        if not stats_file:
            continue
        
        df = pd.read_csv(stats_file[0])
        aggregated = df[df['Name'] == 'Aggregated']
        
        if aggregated.empty:
            continue
        
        row = aggregated.iloc[-1]
        users = int(d.split('users')[0].split('/')[-1])
        results[users] = {
            'users': users,
            'total_requests': int(row['Request Count']),
            'failures': int(row['Failure Count']),
            'rps': float(row['Requests/s']),
            'median': int(row['Median Response Time']),
            'avg': float(row['Average Response Time']),
            'p50': int(row['50%']),
            'p95': int(row['95%']),
            'p99': int(row['99%']),
            'max': int(row['Max Response Time'])
        }
    
    return pd.DataFrame(list(results.values()))

def generate_html_report(df, output_file="load_test_report.html"):
    html = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Load Test Report</title>
    <script src="https://cdn.plot.ly/plotly-2.27.0.min.js"></script>
    <style>
        body {{ font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }}
        .container {{ max-width: 1400px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }}
        h1 {{ color: #232f3e; border-bottom: 3px solid #ff9900; padding-bottom: 10px; }}
        h2 {{ color: #232f3e; margin-top: 40px; }}
        .metric-grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 30px 0; }}
        .metric-card {{ background: #f9f9f9; padding: 20px; border-radius: 6px; border-left: 4px solid #ff9900; }}
        .metric-value {{ font-size: 32px; font-weight: bold; color: #232f3e; }}
        .metric-label {{ color: #666; font-size: 14px; margin-top: 5px; }}
        table {{ width: 100%; border-collapse: collapse; margin: 20px 0; }}
        th {{ background: #232f3e; color: white; padding: 12px; text-align: left; }}
        td {{ padding: 10px; border-bottom: 1px solid #ddd; }}
        tr:hover {{ background: #f5f5f5; }}
        .chart {{ margin: 30px 0; }}
        .success {{ color: #28a745; }}
        .warning {{ color: #ffc107; }}
        .footer {{ margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }}
    </style>
</head>
<body>
<div class="container">
    <h1>🚀 Load Test Report</h1>
    <p><strong>Generated:</strong> {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}</p>
    <p><strong>Test Duration:</strong> 30 minutes per load level</p>
    
    <div class="metric-grid">
        <div class="metric-card">
            <div class="metric-value">{len(df)}</div>
            <div class="metric-label">Test Scenarios</div>
        </div>
        <div class="metric-card">
            <div class="metric-value">{df['total_requests'].sum():,}</div>
            <div class="metric-label">Total Requests</div>
        </div>
        <div class="metric-card">
            <div class="metric-value" class="{'success' if df['failures'].sum() == 0 else 'warning'}">{df['failures'].sum()}</div>
            <div class="metric-label">Total Failures</div>
        </div>
        <div class="metric-card">
            <div class="metric-value">{df['rps'].max():.1f}</div>
            <div class="metric-label">Peak RPS</div>
        </div>
    </div>
    
    <h2>📊 Performance Summary</h2>
    <table>
        <thead>
            <tr>
                <th>Users</th>
                <th>Total Requests</th>
                <th>Failures</th>
                <th>RPS</th>
                <th>Median (ms)</th>
                <th>Avg (ms)</th>
                <th>P95 (ms)</th>
                <th>P99 (ms)</th>
                <th>Max (ms)</th>
            </tr>
        </thead>
        <tbody>
"""
    
    for _, row in df.iterrows():
        failure_pct = (row['failures'] / row['total_requests'] * 100) if row['total_requests'] > 0 else 0
        html += f"""
            <tr>
                <td><strong>{row['users']}</strong></td>
                <td>{row['total_requests']:,}</td>
                <td>{row['failures']} ({failure_pct:.2f}%)</td>
                <td>{row['rps']:.2f}</td>
                <td>{row['median']}</td>
                <td>{row['avg']:.1f}</td>
                <td>{row['p95']}</td>
                <td>{row['p99']}</td>
                <td>{row['max']}</td>
            </tr>
"""
    
    html += """
        </tbody>
    </table>
    
    <h2>📈 Response Time Analysis</h2>
    <div id="responseTimeChart" class="chart"></div>
    
    <h2>⚡ Throughput Analysis</h2>
    <div id="throughputChart" class="chart"></div>
    
    <h2>📉 Percentile Comparison</h2>
    <div id="percentileChart" class="chart"></div>
    
    <script>
"""
    
    # Response time chart
    html += f"""
        var responseData = [
            {{
                x: {df['users'].tolist()},
                y: {df['median'].tolist()},
                name: 'Median',
                type: 'scatter',
                mode: 'lines+markers',
                line: {{width: 3}}
            }},
            {{
                x: {df['users'].tolist()},
                y: {df['p95'].tolist()},
                name: 'P95',
                type: 'scatter',
                mode: 'lines+markers',
                line: {{width: 3}}
            }},
            {{
                x: {df['users'].tolist()},
                y: {df['p99'].tolist()},
                name: 'P99',
                type: 'scatter',
                mode: 'lines+markers',
                line: {{width: 3}}
            }}
        ];
        
        var responseLayout = {{
            title: 'Response Time vs User Load',
            xaxis: {{title: 'Concurrent Users'}},
            yaxis: {{title: 'Response Time (ms)'}},
            hovermode: 'x unified'
        }};
        
        Plotly.newPlot('responseTimeChart', responseData, responseLayout);
        
        var throughputData = [{{
            x: {df['users'].tolist()},
            y: {df['rps'].tolist()},
            type: 'bar',
            marker: {{color: '#ff9900'}}
        }}];
        
        var throughputLayout = {{
            title: 'Throughput (Requests per Second)',
            xaxis: {{title: 'Concurrent Users'}},
            yaxis: {{title: 'Requests/Second'}}
        }};
        
        Plotly.newPlot('throughputChart', throughputData, throughputLayout);
        
        var percentileData = [
            {{
                x: ['P50', 'P95', 'P99', 'Max'],
                y: [{df.iloc[0]['p50']}, {df.iloc[0]['p95']}, {df.iloc[0]['p99']}, {df.iloc[0]['max']}],
                name: '{df.iloc[0]['users']} users',
                type: 'bar'
            }},
            {{
                x: ['P50', 'P95', 'P99', 'Max'],
                y: [{df.iloc[-1]['p50']}, {df.iloc[-1]['p95']}, {df.iloc[-1]['p99']}, {df.iloc[-1]['max']}],
                name: '{df.iloc[-1]['users']} users',
                type: 'bar'
            }}
        ];
        
        var percentileLayout = {{
            title: 'Response Time Percentiles: {df.iloc[0]['users']} vs {df.iloc[-1]['users']} Users',
            xaxis: {{title: 'Percentile'}},
            yaxis: {{title: 'Response Time (ms)'}},
            barmode: 'group'
        }};
        
        Plotly.newPlot('percentileChart', percentileData, percentileLayout);
    </script>
    
    <h2>🔍 Key Findings</h2>
    <ul>
"""
    
    # Generate insights
    rps_increase = ((df.iloc[-1]['rps'] - df.iloc[0]['rps']) / df.iloc[0]['rps'] * 100)
    p95_increase = ((df.iloc[-1]['p95'] - df.iloc[0]['p95']) / df.iloc[0]['p95'] * 100)
    
    html += f"""
        <li><strong>Throughput Scaling:</strong> RPS increased by {rps_increase:.1f}% from {df.iloc[0]['users']} to {df.iloc[-1]['users']} users ({df.iloc[0]['rps']:.1f} → {df.iloc[-1]['rps']:.1f} RPS)</li>
        <li><strong>Response Time Impact:</strong> P95 response time {'decreased' if p95_increase < 0 else 'increased'} by {abs(p95_increase):.1f}% under maximum load ({df.iloc[0]['p95']}ms → {df.iloc[-1]['p95']}ms)</li>
        <li><strong>Reliability:</strong> {'✓ Zero failures across all test scenarios' if df['failures'].sum() == 0 else f'⚠️ {df["failures"].sum()} total failures detected'}</li>
        <li><strong>Best Performance:</strong> Median response time of {df['median'].min()}ms at {df.loc[df['median'].idxmin(), 'users']} concurrent users</li>
    </ul>
    
    <div class="footer">
        Report generated by Load Test Analysis Tool | Data source: Locust CSV exports
    </div>
</div>
</body>
</html>
"""
    
    with open(output_file, 'w') as f:
        f.write(html)
    
    print(f"✓ HTML report generated: {output_file}")

def main():
    pattern = sys.argv[1] if len(sys.argv) > 1 else "*users_*_a"
    output = sys.argv[2] if len(sys.argv) > 2 else "load_test_report.html"
    
    df = load_test_data(pattern)
    
    if df.empty:
        print("No test data found")
        return
    
    generate_html_report(df, output)

if __name__ == "__main__":
    main()
