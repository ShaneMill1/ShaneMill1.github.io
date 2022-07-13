# Initial NCPP Testing

## ServerlessEast Tests

### 10 Concurrent - 30 minute per test 

[https://shanemill1.github.io/NCPPServerlessEast/10concurrent/index.html](https://shanemill1.github.io/NCPPServerlessEast/10concurrent/index.html)


## ServerlessWest Tests

### 10 Concurrent - 30 minute per test 

[https://shanemill1.github.io/NCPPServerlessWest/10concurrent/index.html](https://shanemill1.github.io/NCPPServerlessWest/10concurrent/index.html)


## ServerEast Tests

### 10 Concurrent - 30 minute per test 

[https://shanemill1.github.io/NCPPServerEast/10concurrent/index.html](https://shanemill1.github.io/NCPPServerEast/10concurrent/index.html)

# Round 2 of testing

- Changes were made to the Memory Allocations for Each Lambda function (decreased from 10240 to 256/512) to conserve costs
- Changes were made to Dask Fargate Cluster to conserve costs (CPU to 256, Memory to 2046)

## ServerlessEast Tests

### 10 Concurrent - 1 minute per test 

[https://shanemill1.github.io/NCPPServerlessEast2/10concurrent1min/index.html](https://shanemill1.github.io/NCPPServerlessEast2/10concurrent1min/index.html)


## ServerlessWest Tests

### 10 Concurrent - 1 minute per test 

[https://shanemill1.github.io/NCPPServerlessWest2/10concurrent1min/index.html](https://shanemill1.github.io/NCPPServerlessWest2/10concurrent1min/index.html)


## ServerEast Tests

### 10 Concurrent - 1 minute per test 

[https://shanemill1.github.io/NCPPServerEast2/10concurrent1min/index.html](https://shanemill1.github.io/NCPPServerEast2/10concurrent1min/index.html)
