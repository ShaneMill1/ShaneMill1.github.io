# NDFD NCPP Testing

## NDFD Testing c5.4xlarge without ALB and with Local Dask Cluster


### 1 concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_noALB_c5.4xlarge/1concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_noALB_c5.4xlarge/concurrent3min)

### 50 concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_noALB_c5.4xlarge/50concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_noALB_c5.4xlarge/50concurrent3min)

### 100 concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_noALB_c5.4xlarge/100concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_noALB_c5.4xlarge/100concurrent3min)

## NDFD Testing c5.2xlarge without ALB and with Local Dask Cluster

### 1 concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_noALB_c5.2xlarge/1concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_noALB_c5.2xlarge/1concurrent3min)

### 50 concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_noALB_c5.2xlarge/50concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_noALB_c5.2xlarge/50concurrent3min)

### 100 concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_noALB_c5.2xlarge/100concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_noALB_c5.2xlarge/100concurrent3min)


## NDFD Testing t3a.medium with ECS Fargate Dask Cluster


### 1 concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_spot_fargate_512_2048/1concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_spot_fargate_512_2048/1concurrent3min)

### 50 concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_spot_fargate_512_2048/50concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_spot_fargate_512_2048/50concurrent3min)

### 100 concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_spot_fargate_512_2048/100concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_spot_fargate_512_2048/100concurrent3min)



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

### 50 Concurrent - 1 minute per test

[https://shanemill1.github.io/NCPPServerlessEast3/50concurrent1min/index.html](https://shanemill1.github.io/NCPPServerlessEast3/50concurrent1min/index.html)

## ServerlessEast with CloudFront Tests

### 10 Concurrent - 1 minute per test

[https://shanemill1.github.io/NCPPServerlessEast3CF/10concurrent1min/index.html](https://shanemill1.github.io/NCPPServerlessEast3CF/10concurrent1min/index.html)

## ServerlessWest Tests

### 10 Concurrent - 1 minute per test 

[https://shanemill1.github.io/NCPPServerlessWest3/10concurrent1min/index.html](https://shanemill1.github.io/NCPPServerlessWest3/10concurrent1min/index.html)  

### 50 Concurrent - 1 minute per test

[https://shanemill1.github.io/NCPPServerlessWest3/50concurrent1min/index.html](https://shanemill1.github.io/NCPPServerlessWest3/50concurrent1min/index.html)

## Serverless West with CloudFront Tests

### 10 Concurrent - 1 minute per test

[https://shanemill1.github.io/NCPPServerlessWest3CF/10concurrent1min/index.html](https://shanemill1.github.io/NCPPServerlessWest3CF/10concurrent1min/index.html)


## ServerEast Tests

### 10 Concurrent - 1 minute per test (taken from Round 2, because no changes occurred on the Server implementation)

[https://shanemill1.github.io/NCPPServerEast2/10concurrent1min/index.html](https://shanemill1.github.io/NCPPServerEast2/10concurrent1min/index.html)

### 50 concurrent - 1 minute per test

[https://shanemill1.github.io/NCPPServerEast3/50concurrent1min/index.html](https://shanemill1.github.io/NCPPServerEast3/50concurrent1min/index.html)
