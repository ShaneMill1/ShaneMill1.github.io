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

- Changes were made to the Memory Allocations for Each Lambda function (decreased from 10240 to 1024,512,and 256) to conserve costs

## ServerlessEast Tests

### 10 Concurrent - 1 minute per test 

[https://shanemill1.github.io/NCPPServerlessEast2/10concurrent1min/index.html](https://shanemill1.github.io/NCPPServerlessEast2/10concurrent1min/index.html)

## ServerlessEast with CloudFront Tests

### 10 Concurrent - 1 minute per test

[https://shanemill1.github.io/NCPPServerlessEast2CF/10concurrent1min/index.html](https://shanemill1.github.io/NCPPServerlessEast2CF/10concurrent1min/index.html)

## ServerlessWest Tests

### 10 Concurrent - 1 minute per test 

[https://shanemill1.github.io/NCPPServerlessWest2/10concurrent1min/index.html](https://shanemill1.github.io/NCPPServerlessWest2/10concurrent1min/index.html)

## Serverless West with CloudFront Tests

### 10 Concurrent - 1 minute per test

[https://shanemill1.github.io/NCPPServerlessWest2CF/10concurrent1min/index.html](https://shanemill1.github.io/NCPPServerlessWest2CF/10concurrent1min/index.html)


## ServerEast Tests

### 10 Concurrent - 1 minute per test 

[https://shanemill1.github.io/NCPPServerEast2/10concurrent1min/index.html](https://shanemill1.github.io/NCPPServerEast2/10concurrent1min/index.html)


# Round 3 of testing

- Changes were to increase memory GetEDRCollections Lambda function to 512mb (previously 128mb)
- Rewrite of the GetEDRCollections Lambda function and GetEDRInstances Lambda function to use s3fs for a more streamlined lookup of the available collections and instances from the s3 buckets.


## ServerlessEast Tests

### 10 Concurrent - 1 minute per test 

[https://shanemill1.github.io/NCPPServerlessEast3/10concurrent1min/index.html](https://shanemill1.github.io/NCPPServerlessEast3/10concurrent1min/index.html)  

## ServerlessEast with CloudFront Tests

### 10 Concurrent - 1 minute per test

[https://shanemill1.github.io/NCPPServerlessEast3CF/10concurrent1min/index.html](https://shanemill1.github.io/NCPPServerlessEast3CF/10concurrent1min/index.html)

## ServerlessWest Tests

### 10 Concurrent - 1 minute per test 

[https://shanemill1.github.io/NCPPServerlessWest3/10concurrent1min/index.html](https://shanemill1.github.io/NCPPServerlessWest3/10concurrent1min/index.html)  

## Serverless West with CloudFront Tests

### 10 Concurrent - 1 minute per test

[https://shanemill1.github.io/NCPPServerlessWest3CF/10concurrent1min/index.html](https://shanemill1.github.io/NCPPServerlessWest3CF/10concurrent1min/index.html)


## ServerEast Tests

### 10 Concurrent - 1 minute per test (taken from Round 2, because no changes occurred on the Server implementation)

[https://shanemill1.github.io/NCPPServerEast2/10concurrent1min/index.html](https://shanemill1.github.io/NCPPServerEast2/10concurrent1min/index.html)


