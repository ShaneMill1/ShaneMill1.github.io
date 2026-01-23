#!/usr/bin/env python3
import pandas as pd
import glob
import sys

def main():
    pattern = sys.argv[1] if len(sys.argv) > 1 else "*users_*_a"
    dirs = sorted(glob.glob(pattern), key=lambda x: int(x.split('users')[0].split('/')[-1]))
    
    if not dirs:
        print(f"No directories found matching pattern: {pattern}")
        return
    
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
            'Users': users,
            'Total Requests': int(row['Request Count']),
            'Failures': int(row['Failure Count']),
            'Failure %': f"{(row['Failure Count']/row['Request Count']*100):.2f}%" if row['Request Count'] > 0 else "0%",
            'RPS': float(row['Requests/s']),
            'Median (ms)': int(row['Median Response Time']),
            'Avg (ms)': float(row['Average Response Time']),
            'P95 (ms)': int(row['95%']),
            'P99 (ms)': int(row['99%']),
            'Max (ms)': int(row['Max Response Time'])
        }
    
    if not results:
        print("No valid test data found")
        return
    
    summary_df = pd.DataFrame(list(results.values()))
    summary_df['RPS_str'] = summary_df['RPS'].apply(lambda x: f"{x:.2f}")
    summary_df['Avg_str'] = summary_df['Avg (ms)'].apply(lambda x: f"{x:.1f}")
    
    display_df = summary_df[['Users', 'Total Requests', 'Failures', 'Failure %', 'RPS_str', 'Median (ms)', 'Avg_str', 'P95 (ms)', 'P99 (ms)', 'Max (ms)']].copy()
    display_df.columns = ['Users', 'Total Requests', 'Failures', 'Failure %', 'RPS', 'Median (ms)', 'Avg (ms)', 'P95 (ms)', 'P99 (ms)', 'Max (ms)']
    
    print("\n" + "="*100)
    print("LOAD TEST SUMMARY")
    print("="*100)
    print(display_df.to_string(index=False))
    print("="*100)
    
    print("\n📊 KEY FINDINGS:")
    print(f"  • Tested user loads: {', '.join(map(str, summary_df['Users'].tolist()))}")
    max_rps_idx = summary_df['RPS'].idxmax()
    print(f"  • Peak throughput: {summary_df.loc[max_rps_idx, 'RPS']:.2f} RPS at {summary_df.loc[max_rps_idx, 'Users']} users")
    min_median_idx = summary_df['Median (ms)'].idxmin()
    print(f"  • Best median response: {summary_df.loc[min_median_idx, 'Median (ms)']}ms at {summary_df.loc[min_median_idx, 'Users']} users")
    
    if summary_df['Failures'].sum() > 0:
        print(f"  ⚠️  Total failures: {summary_df['Failures'].sum()}")
    else:
        print(f"  ✓ Zero failures across all tests")
    
    p95_degradation = ((summary_df.iloc[-1]['P95 (ms)'] - summary_df.iloc[0]['P95 (ms)']) / summary_df.iloc[0]['P95 (ms)'] * 100)
    print(f"  • P95 degradation ({summary_df.iloc[0]['Users']}→{summary_df.iloc[-1]['Users']} users): {p95_degradation:.1f}%")
    print()

if __name__ == "__main__":
    main()
