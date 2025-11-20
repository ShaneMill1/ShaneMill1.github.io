# NWS Visualization API - Performance Test Report
**Test Date:** November 20, 2025  
**Testing Tool:** Locust Load Testing  
**Target System:** NWS Visualization API with Zarr Data Access

---

## Executive Summary

| Metric | 100 Users | 250 Users | 500 Users | 1000 Users |
|--------|-----------|-----------|-----------|------------|
| **Status** | ✅ PASS | ⚠️ CAUTION | ⚠️ DEGRADED | ❌ FAIL |
| **Total Requests** | 89,547 | 215,254 | 334,194 | 334,194+ |
| **Failures** | 0 | 23 | 290 | 2,900+ |
| **Failure Rate** | 0.00% | 0.01% | 0.09% | 0.87% |
| **Avg Response Time** | 790ms | 725ms | 1,135ms | 1,135ms+ |
| **95th Percentile** | 2,800ms | 2,700ms | 3,900ms | 61,000ms |
| **Throughput (req/s)** | 49.77 | 119.66 | 185.72 | 185.72+ |

---

## Performance Breakdown by User Load

### 100 Users - ✅ EXCELLENT
- **Zero failures** across all endpoints
- Consistent response times (790ms average)
- All endpoints performing within acceptable limits
- **Recommended baseline for production**

### 250 Users - ⚠️ GOOD WITH MINOR ISSUES
- **23 failures (0.01%)** - mostly job expiration issues
- Improved average response time (725ms)
- Minor streaming difference operation issues
- **Safe production load with monitoring**

### 500 Users - ⚠️ PERFORMANCE DEGRADATION
- **290 failures (0.09%)** - significant increase
- Response time increased to 1,135ms average
- Gateway timeouts (502/504 errors) appearing
- Zarr chunk access failures starting
- **Requires infrastructure scaling**

### 1000 Users - ❌ CRITICAL ISSUES
- **2,900+ failures (0.87%)** - unacceptable failure rate
- Highly variable response times (95th percentile: 61 seconds)
- Widespread Zarr chunk access failures
- Position query failures
- **System cannot handle this load**

---

## Endpoint Performance Analysis

### Core API Endpoints

| Endpoint | 100 Users | 250 Users | 500 Users | 1000 Users | Status |
|----------|-----------|-----------|-----------|------------|--------|
| **Landing Page (/)** | 27ms avg | 30ms avg | 93ms avg | 569ms avg | ⚠️ |
| **Collections** | 1,272ms avg | 1,222ms avg | 1,853ms avg | 3,834ms avg | ❌ |
| **Position Query** | 808ms avg | 785ms avg | 1,318ms avg | 2,825ms avg | ❌ |

### Zarr Metadata Endpoints

| Endpoint | 100 Users | 250 Users | 500 Users | 1000 Users | Failures |
|----------|-----------|-----------|-----------|------------|----------|
| **/.zgroup** | 625ms avg | 612ms avg | 979ms avg | 1,938ms avg | 0→0→21→201 |
| **/.zattrs** | 627ms avg | 594ms avg | 945ms avg | 1,918ms avg | 0→0→20→159 |
| **/temperature/.zattrs** | 605ms avg | 604ms avg | 928ms avg | 1,842ms avg | 0→0→24→164 |
| **/time/.zattrs** | 605ms avg | 602ms avg | 929ms avg | 1,801ms avg | 0→0→21→136 |
| **/time/0** | 600ms avg | 613ms avg | 922ms avg | 1,864ms avg | 0→0→19→167 |

### Zarr Data Chunks (Critical Performance Issue)

| Chunk | 100 Users | 250 Users | 500 Users | 1000 Users | Failure Trend |
|-------|-----------|-----------|-----------|------------|---------------|
| **0.0.0** | 943ms avg | 879ms avg | 1,323ms avg | 2,431ms avg | 0→0→8→168 |
| **0.0.1** | 966ms avg | 903ms avg | 1,313ms avg | 2,563ms avg | 0→0→15→159 |
| **0.1.0** | 884ms avg | 858ms avg | 1,301ms avg | 2,486ms avg | 0→0→19→153 |
| **0.1.1** | 920ms avg | 870ms avg | 1,289ms avg | 2,419ms avg | 0→0→17→172 |

### Streaming Difference Operations

| Operation | 100 Users | 250 Users | 500 Users | 1000 Users | Notes |
|-----------|-----------|-----------|-----------|------------|-------|
| **Job Creation** | 628ms | 703ms | 534ms | Various | Inconsistent |
| **Metadata Access** | 39ms avg | 37ms avg | 121ms avg | 445ms avg | Job expiration |
| **Chunk Computation** | 295-352ms | 304-314ms | 1,157-1,221ms | 2,380-2,433ms | High variance |
| **Coordinate Access** | 36ms avg | 34ms avg | 106ms avg | 400ms avg | Generally stable |

### Batch Difference Operations

| Endpoint | 100 Users | 250 Users | 500 Users | 1000 Users | Failure Rate |
|----------|-----------|-----------|-----------|------------|-------------|
| **/edr-zarr-difference** | 2,298ms avg | 2,305ms avg | 2,992ms avg | Various | 0→0→35→556+ |

---

## Critical Issues Identified

### High-Priority Problems
1. **Zarr Chunk Access Failures**
   - 404/502 errors for temperature data chunks
   - Affects core functionality at 500+ users

2. **Gateway Timeouts**
   - 502/504 errors increasing with load
   - Infrastructure bottleneck identified

3. **Streaming Operations**
   - Job expiration and computation errors
   - Poor lifecycle management

### Performance Insights by Endpoint Category

#### ✅ **Most Reliable Endpoints**
- **Landing Page (/)** - Minimal failures, scales well
- **Coordinate Access** - Consistent performance across loads
- **Basic Metadata** - Stable until 1000+ users

#### ⚠️ **Moderate Issues**
- **Collections API** - Response time increases linearly
- **Position Queries** - Degraded but functional
- **Zarr Metadata** - Slower but reliable

#### ❌ **Critical Problem Areas**
- **Zarr Temperature Chunks** - High 404/502 failure rates
- **Streaming Difference Jobs** - Job expiration and computation errors
- **Batch Processing** - Timeouts and cancellations
- **Time Coordinate Data** - Frequent 404/502 errors

### Failure Pattern Analysis
- **100 Users:** Zero failures - system baseline
- **250 Users:** Isolated streaming job issues (23 failures)
- **500 Users:** Zarr chunk access problems emerge (290 failures)
- **1000 Users:** Widespread system breakdown (2,900+ failures)

---

## Recommendations

### Immediate Actions (Critical)
1. **Scale Infrastructure** - Current limit: ~250 concurrent users
2. **Fix Zarr Chunk Reliability** - Address 404/502 errors
3. **Implement Load Balancing** - Distribute traffic
4. **Add Circuit Breakers** - Prevent cascade failures

### Performance Targets
- **Maximum Safe Load:** 250 concurrent users
- **SLA Target:** 95th percentile < 3 seconds
- **Failure Rate Target:** < 0.1%
- **Availability Target:** 99.9% uptime

### Monitoring Requirements
- Real-time failure rate monitoring
- Zarr chunk availability health checks
- Response time alerting (> 5 seconds)
- Capacity planning based on user growth

---

**Test Conclusion:** System performs well up to 250 users but requires significant infrastructure improvements to handle higher loads safely.