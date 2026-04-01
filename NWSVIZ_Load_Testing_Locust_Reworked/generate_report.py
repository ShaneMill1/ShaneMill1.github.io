#!/usr/bin/env python3
"""
Load Test Report Generator
Combines Locust CSV results with Prometheus metrics into HTML, MD, and textile reports.

Usage:
    python3 generate_report.py <results_dir> <target> [prometheus_url]

    results_dir:     directory containing Locust CSV output
    target:          production | memory | compute
    prometheus_url:  optional, defaults to https://edr-api-desi-c.mdl.nws.noaa.gov/prometheus
"""
import sys
import os
import glob
from datetime import datetime, timezone
import pandas as pd
import requests
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec

PROMETHEUS_URL = "https://edr-api-desi-c.mdl.nws.noaa.gov/prometheus"


# ---------------------------------------------------------------------------
# Locust data
# ---------------------------------------------------------------------------

def load_locust_stats(results_dir):
    stats_files = glob.glob(f"{results_dir}/*_stats.csv")
    history_files = glob.glob(f"{results_dir}/*_stats_history.csv")
    failures_files = glob.glob(f"{results_dir}/*_failures.csv")

    if not stats_files:
        print(f"No stats CSV found in {results_dir}")
        return None, None, None

    stats = pd.read_csv(stats_files[0])
    history = pd.read_csv(history_files[0]) if history_files else None
    failures = pd.read_csv(failures_files[0]) if failures_files else pd.DataFrame()

    return stats, history, failures


def get_test_time_window(history):
    if history is None or history.empty:
        return None, None
    history = history.dropna(subset=["Timestamp"])
    return int(history["Timestamp"].min()), int(history["Timestamp"].max())


# ---------------------------------------------------------------------------
# Prometheus queries
# ---------------------------------------------------------------------------

def prom_query_range(query, start, end, step="30s", url=PROMETHEUS_URL):
    try:
        resp = requests.get(
            f"{url}/api/v1/query_range",
            params={"query": query, "start": start, "end": end, "step": step},
            timeout=15
        )
        if resp.status_code == 200:
            return resp.json().get("data", {}).get("result", [])
    except Exception as e:
        print(f"Prometheus query failed: {e}")
    return []


def prom_scalar(query, start, end, url=PROMETHEUS_URL):
    results = prom_query_range(query, start, end, url=url)
    if not results:
        return None
    values = [float(v[1]) for r in results for v in r.get("values", []) if v[1] != "NaN"]
    return sum(values) / len(values) if values else None


def _avg_series(results):
    if not results:
        return None
    values = [float(v[1]) for r in results for v in r.get("values", []) if v[1] != "NaN"]
    return sum(values) / len(values) if values else None


def _ts_to_series(results, transform=None):
    """Convert Prometheus range result to (timestamps, values) lists."""
    if not results:
        return [], []
    values = results[0].get("values", [])
    ts = [datetime.fromtimestamp(float(v[0]), tz=timezone.utc) for v in values]
    data = []
    for v in values:
        try:
            val = float(v[1])
            data.append(transform(val) if transform else val)
        except (ValueError, TypeError):
            data.append(None)
    return ts, data


def collect_prometheus_metrics(start, end, pod_filter, url=PROMETHEUS_URL):
    metrics = {}
    series = {}

    # Zarr request rate
    ts = prom_query_range(
        f'sum(rate(http_requests_total{{path_template=~".*zarr.*",status_code="200",pod=~"{pod_filter}"}}[1m]))',
        start, end, url=url
    )
    series["zarr_rps"] = _ts_to_series(ts)
    metrics["zarr_rps"] = _avg_series(ts)

    # Latency percentiles (convert s -> ms)
    for pct in [50, 95, 99]:
        ts = prom_query_range(
            f'histogram_quantile(0.{pct:02d}, sum(rate(http_request_duration_seconds_bucket{{path_template=~".*zarr.*",pod=~"{pod_filter}"}}[5m])) by (le))',
            start, end, url=url
        )
        series[f"p{pct}_latency"] = _ts_to_series(ts, transform=lambda v: v * 1000)
        metrics[f"p{pct}_latency"] = _avg_series(ts)

    # Error rates
    metrics["rate_429"] = prom_scalar(
        f'sum(rate(http_requests_total{{status_code="429",pod=~"{pod_filter}"}}[1m]))',
        start, end, url=url
    )
    metrics["rate_500"] = prom_scalar(
        f'sum(rate(http_requests_total{{status_code="500",pod=~"{pod_filter}"}}[1m]))',
        start, end, url=url
    )

    # CPU and Memory — filtered to nodes running the target deployment pods
    # Joins kube_pod_info host_ip to node_exporter instance label (host_ip:9100)
    pod_node_selector = f'kube_pod_info{{namespace="edr-api",pod=~"{pod_filter}",host_network="false"}}'
    node_join = f'label_replace({pod_node_selector}, "instance", "$1:9100", "host_ip", "(.+)")'

    # CPU (convert to %) — avg across target nodes only
    ts = prom_query_range(
        f'avg(label_replace({pod_node_selector}, "instance", "$1:9100", "host_ip", "(.+)") * on(instance) group_right() (1 - avg by (instance) (rate(node_cpu_seconds_total{{mode="idle"}}[1m])))) * 100',
        start, end, url=url
    )
    if not _avg_series(ts):  # fallback
        ts = prom_query_range('(1 - avg(rate(node_cpu_seconds_total{mode="idle"}[1m]))) * 100', start, end, url=url)
    series["cpu_pct"] = _ts_to_series(ts)
    metrics["cpu_pct"] = _avg_series(ts)

    # Memory used (convert to GB)
    ts = prom_query_range(
        f'sum(({node_join}) * on(instance) group_right() (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes))',
        start, end, url=url
    )
    if not _avg_series(ts):  # fallback
        ts = prom_query_range('sum(node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes)', start, end, url=url)
    series["mem_used_gb"] = _ts_to_series(ts, transform=lambda v: v / 1024**3)
    metrics["mem_used_bytes"] = _avg_series(ts)

    total_ts = prom_query_range(
        f'sum(({node_join}) * on(instance) group_right() node_memory_MemTotal_bytes)',
        start, end, url=url
    )
    metrics["mem_total_bytes"] = _avg_series(total_ts) or prom_scalar('sum(node_memory_MemTotal_bytes)', start, end, url=url)

    # Network
    metrics["net_rx_bps"] = prom_scalar(
        'sum(rate(node_network_receive_bytes_total{device="eth0"}[1m]))',
        start, end, url=url
    )
    metrics["net_tx_bps"] = prom_scalar(
        'sum(rate(node_network_transmit_bytes_total{device="eth0"}[1m]))',
        start, end, url=url
    )

    # Redis cache hits and misses
    ts = prom_query_range(
        f'sum(rate(redis_cache_hits_total{{pod=~"{pod_filter}"}}[1m]))',
        start, end, url=url
    )
    series["cache_hits_rps"] = _ts_to_series(ts)
    metrics["cache_hits_rps"] = _avg_series(ts)

    ts = prom_query_range(
        f'sum(rate(redis_cache_misses_total{{pod=~"{pod_filter}"}}[1m]))',
        start, end, url=url
    )
    series["cache_misses_rps"] = _ts_to_series(ts)
    metrics["cache_misses_rps"] = _avg_series(ts)

    # Cache hit ratio time series
    ts_hits = series["cache_hits_rps"]
    ts_misses = series["cache_misses_rps"]
    if ts_hits[0] and ts_misses[0]:
        ratio_vals = []
        for h, m in zip(ts_hits[1], ts_misses[1]):
            if h is not None and m is not None and (h + m) > 0:
                ratio_vals.append(round(h / (h + m) * 100, 1))
            else:
                ratio_vals.append(None)
        series["cache_hit_ratio"] = (ts_hits[0], ratio_vals)
    else:
        series["cache_hit_ratio"] = ([], [])

    # Pod restarts
    metrics["pod_restarts"] = prom_scalar(
        f'sum(kube_pod_container_status_restarts_total{{namespace="edr-api",pod=~"{pod_filter}"}})',
        start, end, url=url
    )

    return metrics, series


# ---------------------------------------------------------------------------
# Chart generation
# ---------------------------------------------------------------------------

def generate_charts(data, base):
    series = data.get("series", {})
    history = data.get("history")

    fig, axes = plt.subplots(4, 2, figsize=(14, 16))
    fig.suptitle(f"Load Test — {data['target']} ({data['instance']})\n{data['test_start']} → {data['test_end']}", fontsize=13)
    fig.patch.set_facecolor('#f5f5f5')

    def _plot(ax, ts, vals, title, ylabel, color, secondary_ts=None, secondary_vals=None, secondary_label=None, secondary_color=None):
        if ts and any(v is not None for v in vals):
            clean = [(t, v) for t, v in zip(ts, vals) if v is not None]
            ax.plot([c[0] for c in clean], [c[1] for c in clean], color=color, linewidth=1.5, label=ylabel)
            ax.fill_between([c[0] for c in clean], [c[1] for c in clean], alpha=0.15, color=color)
        else:
            ax.text(0.5, 0.5, 'No data', ha='center', va='center', transform=ax.transAxes, color='gray')
        if secondary_ts and secondary_vals and any(v is not None for v in secondary_vals):
            clean2 = [(t, v) for t, v in zip(secondary_ts, secondary_vals) if v is not None]
            ax.plot([c[0] for c in clean2], [c[1] for c in clean2], color=secondary_color, linewidth=1.5, linestyle='--', label=secondary_label)
            ax.legend(fontsize=7)
        ax.set_title(title, fontsize=10, fontweight='bold')
        ax.set_ylabel(ylabel, fontsize=9)
        ax.tick_params(axis='x', rotation=30, labelsize=7)
        ax.tick_params(axis='y', labelsize=8)
        ax.set_facecolor('white')
        ax.grid(True, alpha=0.3)

    # Row 0: Locust req/s and failure rate
    if history is not None and not history.empty:
        h = history.dropna(subset=["Timestamp"])
        ts_hist = [datetime.fromtimestamp(float(t), tz=timezone.utc) for t in h["Timestamp"]]
        rps = h.get("Requests/s", h.get("requests/s", None))
        fail_pct = None
        if "Failures/s" in h.columns and "Requests/s" in h.columns:
            rps = h["Requests/s"].replace(0, float('nan'))
            fail_pct = (h["Failures/s"] / rps * 100).fillna(0).tolist()
        _plot(axes[0][0], ts_hist, rps.tolist() if rps is not None else [], "Locust Req/s", "req/s", "#ff9900")
        _plot(axes[0][1], ts_hist, fail_pct if fail_pct is not None else [], "Failure Rate", "%", "#d9534f")
    else:
        for ax in axes[0]:
            ax.text(0.5, 0.5, 'No locust history', ha='center', va='center', transform=ax.transAxes, color='gray')
            ax.set_facecolor('white')

    # Row 1: Zarr req/s and latency percentiles
    _plot(axes[1][0], *series.get("zarr_rps", ([], [])), "Zarr Req/s (Prometheus)", "req/s", "#5bc0de")
    p50_ts, p50_vals = series.get("p50_latency", ([], []))
    p95_ts, p95_vals = series.get("p95_latency", ([], []))
    p99_ts, p99_vals = series.get("p99_latency", ([], []))
    _plot(axes[1][1], p50_ts, p50_vals, "Zarr Latency Percentiles", "ms", "#2ecc71",
          secondary_ts=p95_ts, secondary_vals=p95_vals, secondary_label="p95", secondary_color="#e67e22")
    if p99_ts and any(v is not None for v in p99_vals):
        clean99 = [(t, v) for t, v in zip(p99_ts, p99_vals) if v is not None]
        axes[1][1].plot([c[0] for c in clean99], [c[1] for c in clean99], color="#d9534f", linewidth=1.5, linestyle=':', label="p99")
        axes[1][1].legend(fontsize=7)

    # Row 2: Cache hit ratio and CPU
    _plot(axes[2][0], *series.get("cache_hit_ratio", ([], [])), "Redis Cache Hit Ratio", "%", "#9b59b6")
    _plot(axes[2][1], *series.get("cpu_pct", ([], [])), "Node CPU Usage", "%", "#2ecc71")

    # Row 3: Memory and cache hits/misses
    _plot(axes[3][0], *series.get("mem_used_gb", ([], [])), "Node Memory Used", "GB", "#e67e22")
    hits_ts, hits_vals = series.get("cache_hits_rps", ([], []))
    miss_ts, miss_vals = series.get("cache_misses_rps", ([], []))
    _plot(axes[3][1], hits_ts, hits_vals, "Redis Cache Hits vs Misses", "req/s", "#2ecc71",
          secondary_ts=miss_ts, secondary_vals=miss_vals, secondary_label="misses", secondary_color="#d9534f")

    plt.tight_layout()
    chart_path = f"{base}_charts.png"
    plt.savefig(chart_path, dpi=150, bbox_inches='tight', facecolor='#f5f5f5')
    plt.close()
    print(f"✅ Charts: {chart_path}")
    return chart_path


# ---------------------------------------------------------------------------
# Formatting helpers
# ---------------------------------------------------------------------------

def fmt_bytes(b):
    if b is None:
        return "N/A"
    for unit in ["B", "KB", "MB", "GB"]:
        if b < 1024:
            return f"{b:.1f} {unit}"
        b /= 1024
    return f"{b:.1f} TB"

def fmt_ms(s):
    return "N/A" if s is None else f"{s * 1000:.0f} ms"

def fmt_pct(v):
    return "N/A" if v is None else f"{v * 100:.1f}%"

def fmt_rps(v):
    return "N/A" if v is None else f"{v:.2f}"


# ---------------------------------------------------------------------------
# Build report data
# ---------------------------------------------------------------------------

def build_report(results_dir, target, prometheus_url):
    stats, history, failures = load_locust_stats(results_dir)
    if stats is None:
        sys.exit(1)

    start_ts, end_ts = get_test_time_window(history)
    start_dt = datetime.fromtimestamp(start_ts, tz=timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC") if start_ts else "N/A"
    end_dt = datetime.fromtimestamp(end_ts, tz=timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC") if end_ts else "N/A"

    agg = stats[stats["Name"] == "Aggregated"]
    if agg.empty:
        agg = stats.tail(1)
    row = agg.iloc[-1]

    def safe_int(val, default=0):
        try:
            v = float(val)
            return default if v != v else int(v)
        except (TypeError, ValueError):
            return default

    def safe_float(val, default=0.0):
        try:
            v = float(val)
            return default if v != v else v
        except (TypeError, ValueError):
            return default

    locust = {
        "total_requests": safe_int(row.get("Request Count", 0)),
        "failures": safe_int(row.get("Failure Count", 0)),
        "rps": safe_float(row.get("Requests/s", 0)),
        "p50": safe_int(row.get("50%", 0)),
        "p95": safe_int(row.get("95%", 0)),
        "p99": safe_int(row.get("99%", 0)),
        "max": safe_int(row.get("Max Response Time", 0)),
        "avg": safe_float(row.get("Average Response Time", 0)),
    }
    locust["failure_pct"] = (locust["failures"] / locust["total_requests"] * 100) if locust["total_requests"] > 0 else 0

    pod_filters = {
        "production": "edr-desi-api-[^mc].*",
        "memory": "edr-desi-api-memory-.*",
        "compute": "edr-desi-api-compute-.*",
    }
    pod_filter = pod_filters.get(target, "edr-desi-api-.*")

    prom, series = {}, {}
    if start_ts and end_ts:
        print(f"Querying Prometheus ({prometheus_url}) for {start_dt} -> {end_dt}...")
        prom, series = collect_prometheus_metrics(start_ts, end_ts, pod_filter, url=prometheus_url)
    else:
        print("No time window found — skipping Prometheus queries")

    return {
        "target": target,
        "instance": {"production": "m5n.4xlarge", "memory": "m8i.4xlarge", "compute": "c8i.4xlarge"}.get(target, "unknown"),
        "generated": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "test_start": start_dt,
        "test_end": end_dt,
        "locust": locust,
        "prom": prom,
        "series": series,
        "history": history,
        "failures_df": failures,
    }


def _build_timeseries_md(series, mem_total_bytes=None):
    """Build a markdown time series table sampled every ~5 minutes."""
    zarr_ts, zarr_vals = series.get("zarr_rps", ([], []))
    p50_ts, p50_vals = series.get("p50_latency", ([], []))
    p95_ts, p95_vals = series.get("p95_latency", ([], []))
    p99_ts, p99_vals = series.get("p99_latency", ([], []))
    cpu_ts, cpu_vals = series.get("cpu_pct", ([], []))
    mem_ts, mem_vals = series.get("mem_used_gb", ([], []))
    hit_ts, hit_vals = series.get("cache_hit_ratio", ([], []))
    mem_total_gb = mem_total_bytes / 1024**3 if mem_total_bytes else None

    if not zarr_ts:
        return "_No time series data available._\n"

    step = max(1, len(zarr_ts) // 20)
    indices = list(range(0, len(zarr_ts), step))

    def _get(vals, i):
        try:
            v = vals[i]
            return f"{v:.1f}" if v is not None else "N/A"
        except IndexError:
            return "N/A"

    def _mem_pct(i):
        try:
            v = mem_vals[i]
            if v is not None and mem_total_gb:
                return f"{v / mem_total_gb * 100:.1f}%"
        except IndexError:
            pass
        return "N/A"

    rows = []
    for i in indices:
        ts = zarr_ts[i].strftime("%H:%M")
        rows.append(
            f"| {ts} | {_get(zarr_vals, i)} | {_get(p50_vals, i)} | {_get(p95_vals, i)} | {_get(p99_vals, i)} | {_get(hit_vals, i)}% | {_get(cpu_vals, i)} | {_get(mem_vals, i)} | {_mem_pct(i)} |"
        )

    header = "| Time | Zarr req/s | p50 (ms) | p95 (ms) | p99 (ms) | Cache Hit % | CPU % | Mem (GB) | Mem % |\n|------|-----------|----------|----------|----------|-------------|-------|----------|-------|\n"
    return header + "\n".join(rows) + "\n"


def _build_timeseries_textile(series, mem_total_bytes=None):
    """Build a textile time series table sampled every ~5 minutes."""
    zarr_ts, zarr_vals = series.get("zarr_rps", ([], []))
    p50_ts, p50_vals = series.get("p50_latency", ([], []))
    p95_ts, p95_vals = series.get("p95_latency", ([], []))
    p99_ts, p99_vals = series.get("p99_latency", ([], []))
    cpu_ts, cpu_vals = series.get("cpu_pct", ([], []))
    mem_ts, mem_vals = series.get("mem_used_gb", ([], []))
    hit_ts, hit_vals = series.get("cache_hit_ratio", ([], []))
    mem_total_gb = mem_total_bytes / 1024**3 if mem_total_bytes else None

    if not zarr_ts:
        return "_No time series data available._\n"

    step = max(1, len(zarr_ts) // 20)
    indices = list(range(0, len(zarr_ts), step))

    def _get(vals, i):
        try:
            v = vals[i]
            return f"{v:.1f}" if v is not None else "N/A"
        except IndexError:
            return "N/A"

    def _mem_pct(i):
        try:
            v = mem_vals[i]
            if v is not None and mem_total_gb:
                return f"{v / mem_total_gb * 100:.1f}%"
        except IndexError:
            pass
        return "N/A"

    rows = []
    for i in indices:
        ts = zarr_ts[i].strftime("%H:%M")
        rows.append(
            f"| {ts} | {_get(zarr_vals, i)} | {_get(p50_vals, i)} | {_get(p95_vals, i)} | {_get(p99_vals, i)} | {_get(hit_vals, i)}% | {_get(cpu_vals, i)} | {_get(mem_vals, i)} | {_mem_pct(i)} |"
        )

    header = "|_. Time |_. Zarr req/s |_. p50 (ms) |_. p95 (ms) |_. p99 (ms) |_. Cache Hit % |_. CPU % |_. Mem (GB) |_. Mem % |\n"
    return header + "\n".join(rows) + "\n"



def write_html(data, output_file, chart_path):
    l = data["locust"]
    p = data["prom"]
    mem_pct = (p.get("mem_used_bytes") / p.get("mem_total_bytes") * 100) if p.get("mem_used_bytes") and p.get("mem_total_bytes") else None
    chart_filename = os.path.basename(chart_path)

    html = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Load Test Report — {data['target']} ({data['instance']})</title>
    <style>
        body {{ font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }}
        .container {{ max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }}
        h1 {{ color: #232f3e; border-bottom: 3px solid #ff9900; padding-bottom: 10px; }}
        h2 {{ color: #232f3e; margin-top: 40px; }}
        .grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px; margin: 20px 0; }}
        .card {{ background: #f9f9f9; padding: 15px; border-radius: 6px; border-left: 4px solid #ff9900; }}
        .card-value {{ font-size: 28px; font-weight: bold; color: #232f3e; }}
        .card-label {{ color: #666; font-size: 13px; margin-top: 4px; }}
        table {{ width: 100%; border-collapse: collapse; margin: 15px 0; }}
        th {{ background: #232f3e; color: white; padding: 10px; text-align: left; }}
        td {{ padding: 9px; border-bottom: 1px solid #ddd; }}
        tr:hover {{ background: #f5f5f5; }}
        .charts img {{ width: 100%; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }}
        .footer {{ margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }}
    </style>
</head>
<body>
<div class="container">
    <h1>Load Test Report — {data['target']} ({data['instance']})</h1>
    <p><strong>Generated:</strong> {data['generated']}</p>
    <p><strong>Test window:</strong> {data['test_start']} → {data['test_end']}</p>

    <h2>Time Series Charts</h2>
    <div class="charts">
        <img src="{chart_filename}" alt="Load test charts">
    </div>

    <h2>Locust Results</h2>
    <div class="grid">
        <div class="card"><div class="card-value">{l['total_requests']:,}</div><div class="card-label">Total Requests</div></div>
        <div class="card"><div class="card-value">{l['failures']:,}</div><div class="card-label">Failures ({l['failure_pct']:.2f}%)</div></div>
        <div class="card"><div class="card-value">{l['rps']:.1f}</div><div class="card-label">Requests/s</div></div>
        <div class="card"><div class="card-value">{l['p50']} ms</div><div class="card-label">p50 Latency</div></div>
        <div class="card"><div class="card-value">{l['p95']} ms</div><div class="card-label">p95 Latency</div></div>
        <div class="card"><div class="card-value">{l['p99']} ms</div><div class="card-label">p99 Latency</div></div>
        <div class="card"><div class="card-value">{l['max']} ms</div><div class="card-label">Max Latency</div></div>
        <div class="card"><div class="card-value">{l['avg']:.0f} ms</div><div class="card-label">Avg Latency</div></div>
    </div>

    <h2>Prometheus Metrics (avg over test window)</h2>
    <table>
        <thead><tr><th>Metric</th><th>Value</th></tr></thead>
        <tbody>
            <tr><td>Zarr Req/s</td><td>{fmt_rps(p.get('zarr_rps'))}</td></tr>
            <tr><td>p50 Zarr Latency</td><td>{fmt_ms(p.get('p50_latency'))}</td></tr>
            <tr><td>p95 Zarr Latency</td><td>{fmt_ms(p.get('p95_latency'))}</td></tr>
            <tr><td>p99 Zarr Latency</td><td>{fmt_ms(p.get('p99_latency'))}</td></tr>
            <tr><td>429 Rate Limits/s</td><td>{fmt_rps(p.get('rate_429'))}</td></tr>
            <tr><td>500 Errors/s</td><td>{fmt_rps(p.get('rate_500'))}</td></tr>
            <tr><td>Avg Cache Hit Rate</td><td>{fmt_pct(p.get('cache_hits_rps') / (p.get('cache_hits_rps', 0) + p.get('cache_misses_rps', 1)) if p.get('cache_hits_rps') else None)}</td></tr>
            <tr><td>Avg Cache Hits/s</td><td>{fmt_rps(p.get('cache_hits_rps'))}</td></tr>
            <tr><td>Avg Cache Misses/s</td><td>{fmt_rps(p.get('cache_misses_rps'))}</td></tr>
            <tr><td>Pod Restarts</td><td>{int(p.get('pod_restarts') or 0)}</td></tr>
            <tr><td>Avg Node CPU</td><td>{fmt_pct(p.get('cpu_pct'))}</td></tr>
            <tr><td>Avg Node Memory Used</td><td>{fmt_bytes(p.get('mem_used_bytes'))} / {fmt_bytes(p.get('mem_total_bytes'))} ({f"{mem_pct:.1f}%" if mem_pct else "N/A"})</td></tr>
            <tr><td>Avg Network RX</td><td>{fmt_bytes(p.get('net_rx_bps'))}/s</td></tr>
            <tr><td>Avg Network TX</td><td>{fmt_bytes(p.get('net_tx_bps'))}/s</td></tr>
        </tbody>
    </table>

    <div class="footer">
        Generated by EDR Load Test Report Generator | Target: {data['target']} | Instance: {data['instance']}
    </div>
</div>
</body>
</html>"""

    with open(output_file, "w") as f:
        f.write(html)
    print(f"✅ HTML report: {output_file}")


# ---------------------------------------------------------------------------
# Markdown report
# ---------------------------------------------------------------------------

def write_md(data, output_file, chart_path):
    l = data["locust"]
    p = data["prom"]
    mem_pct = (p.get("mem_used_bytes") / p.get("mem_total_bytes") * 100) if p.get("mem_used_bytes") and p.get("mem_total_bytes") else None
    chart_filename = os.path.basename(chart_path)

    md = f"""# Load Test Report — {data['target']} ({data['instance']})

**Generated:** {data['generated']}
**Test window:** {data['test_start']} → {data['test_end']}

## Time Series Charts

![Load test charts]({chart_filename})

## Performance Over Time (sampled every ~5 min)

{_build_timeseries_md(data.get('series', {}), data.get('prom', {}).get('mem_total_bytes'))}
## Locust Results

| Metric | Value |
|--------|-------|
| Total Requests | {l['total_requests']:,} |
| Failures | {l['failures']:,} ({l['failure_pct']:.2f}%) |
| Requests/s | {l['rps']:.1f} |
| p50 Latency | {l['p50']} ms |
| p95 Latency | {l['p95']} ms |
| p99 Latency | {l['p99']} ms |
| Max Latency | {l['max']} ms |
| Avg Latency | {l['avg']:.0f} ms |

## Prometheus Metrics (avg over test window)

| Metric | Value |
|--------|-------|
| Zarr Req/s | {fmt_rps(p.get('zarr_rps'))} |
| p50 Zarr Latency | {fmt_ms(p.get('p50_latency'))} |
| p95 Zarr Latency | {fmt_ms(p.get('p95_latency'))} |
| p99 Zarr Latency | {fmt_ms(p.get('p99_latency'))} |
| 429 Rate Limits/s | {fmt_rps(p.get('rate_429'))} |
| 500 Errors/s | {fmt_rps(p.get('rate_500'))} |
| Avg Cache Hit Rate | {fmt_pct(p.get('cache_hits_rps') / (p.get('cache_hits_rps', 0) + p.get('cache_misses_rps', 1)) if p.get('cache_hits_rps') else None)} |
| Avg Cache Hits/s | {fmt_rps(p.get('cache_hits_rps'))} |
| Avg Cache Misses/s | {fmt_rps(p.get('cache_misses_rps'))} |
| Pod Restarts | {int(p.get('pod_restarts') or 0)} |
| Avg Node CPU | {fmt_pct(p.get('cpu_pct'))} |
| Avg Node Memory Used | {fmt_bytes(p.get('mem_used_bytes'))} / {fmt_bytes(p.get('mem_total_bytes'))} ({f"{mem_pct:.1f}%" if mem_pct else "N/A"}) |
| Avg Network RX | {fmt_bytes(p.get('net_rx_bps'))}/s |
| Avg Network TX | {fmt_bytes(p.get('net_tx_bps'))}/s |
"""

    with open(output_file, "w") as f:
        f.write(md)
    print(f"✅ Markdown report: {output_file}")


# ---------------------------------------------------------------------------
# Textile report
# ---------------------------------------------------------------------------

def write_textile(data, output_file, chart_path):
    l = data["locust"]
    p = data["prom"]
    mem_pct = (p.get("mem_used_bytes") / p.get("mem_total_bytes") * 100) if p.get("mem_used_bytes") and p.get("mem_total_bytes") else None
    chart_filename = os.path.basename(chart_path)

    textile = f"""h1. Load Test Report — {data['target']} ({data['instance']})

*Generated:* {data['generated']}
*Test window:* {data['test_start']} -> {data['test_end']}

h2. Time Series Charts

!{chart_filename}!

h2. Performance Over Time (sampled every ~5 min)

{_build_timeseries_textile(data.get('series', {}), data.get('prom', {}).get('mem_total_bytes'))}
h2. Locust Results

|_. Metric |_. Value |
| Total Requests | {l['total_requests']:,} |
| Failures | {l['failures']:,} ({l['failure_pct']:.2f}%) |
| Requests/s | {l['rps']:.1f} |
| p50 Latency | {l['p50']} ms |
| p95 Latency | {l['p95']} ms |
| p99 Latency | {l['p99']} ms |
| Max Latency | {l['max']} ms |
| Avg Latency | {l['avg']:.0f} ms |

h2. Prometheus Metrics (avg over test window)

|_. Metric |_. Value |
| Zarr Req/s | {fmt_rps(p.get('zarr_rps'))} |
| p50 Zarr Latency | {fmt_ms(p.get('p50_latency'))} |
| p95 Zarr Latency | {fmt_ms(p.get('p95_latency'))} |
| p99 Zarr Latency | {fmt_ms(p.get('p99_latency'))} |
| 429 Rate Limits/s | {fmt_rps(p.get('rate_429'))} |
| 500 Errors/s | {fmt_rps(p.get('rate_500'))} |
| Avg Cache Hit Rate | {fmt_pct(p.get('cache_hits_rps') / (p.get('cache_hits_rps', 0) + p.get('cache_misses_rps', 1)) if p.get('cache_hits_rps') else None)} |
| Avg Cache Hits/s | {fmt_rps(p.get('cache_hits_rps'))} |
| Avg Cache Misses/s | {fmt_rps(p.get('cache_misses_rps'))} |
| Pod Restarts | {int(p.get('pod_restarts') or 0)} |
| Avg Node CPU | {fmt_pct(p.get('cpu_pct'))} |
| Avg Node Memory Used | {fmt_bytes(p.get('mem_used_bytes'))} / {fmt_bytes(p.get('mem_total_bytes'))} ({f"{mem_pct:.1f}%" if mem_pct else "N/A"}) |
| Avg Network RX | {fmt_bytes(p.get('net_rx_bps'))}/s |
| Avg Network TX | {fmt_bytes(p.get('net_tx_bps'))}/s |
"""

    with open(output_file, "w") as f:
        f.write(textile)
    print(f"✅ Textile report: {output_file}")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    if len(sys.argv) < 3:
        print("Usage: python3 generate_report.py <results_dir> <target> [prometheus_url]")
        print("  target: production | memory | compute")
        sys.exit(1)

    results_dir = sys.argv[1]
    target = sys.argv[2]
    prometheus_url = sys.argv[3] if len(sys.argv) > 3 else PROMETHEUS_URL

    if not os.path.isdir(results_dir):
        print(f"Results directory not found: {results_dir}")
        sys.exit(1)

    print(f"Building report for {target} from {results_dir}...")
    data = build_report(results_dir, target, prometheus_url)

    base = os.path.join(results_dir, f"load_test_report_{target}_{datetime.now().strftime('%m_%d_%y')}")
    chart_path = generate_charts(data, base)
    write_html(data, f"{base}.html", chart_path)
    write_md(data, f"{base}.md", chart_path)
    write_textile(data, f"{base}.textile", chart_path)

    print(f"\nDone. Reports saved in {results_dir}/")


if __name__ == "__main__":
    main()
