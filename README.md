# NDFD NCPP Testing

## NDFD Testing c5.4xlarge without ALB and with Local Dask Cluster


### 1 concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_noALB_c5.4xlarge/1concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_noALB_c5.4xlarge/1concurrent3min)

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


## NDFD Testing t3a.medium with ECS Fargate Dask Cluster - 9/22/22

- Reduced ECS Fargate Autoscaling threshold from 50% memory/cpu utilization to 40% memory/cpu.
- Implemented a kill for Dask processing if a user disconnects.


### 1 concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_spot_fargate_512_2048_Updates9-22-22_DaskQuitClientDisconnect/1concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_spot_fargate_512_2048_Updates9-22-22_DaskQuitClientDisconnect/1concurrent3min)

### 50 concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_spot_fargate_512_2048_Updates9-22-22_DaskQuitClientDisconnect/50concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_spot_fargate_512_2048_Updates9-22-22_DaskQuitClientDisconnect/50concurrent3min)

### 100 concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_spot_fargate_512_2048_Updates9-22-22_DaskQuitClientDisconnect/100concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_spot_fargate_512_2048_Updates9-22-22_DaskQuitClientDisconnect/100concurrent3min)


## NDFD Testing t3a.medium with ECS Fargate Dask Cluster - Application Adjustment needed for Flask calling of Dask Future - 9/22/22

- Application level adjustment to the calling of a Dask Future (was checking every second, turned off the interval check).

### 1 concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_spot_fargate_512_2048_9-22-22-application-adjustment/1concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_spot_fargate_512_2048_9-22-22-application-adjustment/1concurrent3min)

### 50 concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_spot_fargate_512_2048_9-22-22-application-adjustment/50concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_spot_fargate_512_2048_9-22-22-application-adjustment/50concurrent3min)

### 100 concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_spot_fargate_512_2048_9-22-22-application-adjustment/100concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_spot_fargate_512_2048_9-22-22-application-adjustment/100concurrent3min)


## NDFD Testing t3a.medium with ec2 backed ECS Dask Cluster 9/28/22

- t3a.medium instances on the frontend as well as the Dask Cluster on the backend.
- We hit the AWS ec2 32 vCPU limit during testing so we need to request more vCPUs.

### 1 concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_ec2Backendt3a.medium-9-28-22/1concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_ec2Backendt3a.medium-9-28-22/1concurrent3min)

### 50 concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_ec2Backendt3a.medium-9-28-22/50concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_ec2Backendt3a.medium-9-28-22/50concurrent3min)

### 100 concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_ec2Backendt3a.medium-9-28-22/100concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_ec2Backendt3a.medium-9-28-22/100concurrent3min)



## NDFD Testing t3a.medium with ec2 backed ECS Dask Cluster 10/3/22

- Requested more vCPU's from AWS
- Adjusted ECS Dask Scheduler and Worker allocations for CPU from 512 -> 2048, and Memory from 2048 -> 3895 to match the cpu/memory available by a t3a.medium (2vCPU and 4GB Memory).
- Adjusted cpu utilization autoscaling to 25% to make Dask Cluster more reactive to increased workload (because the dask scheduler is included in the autoscaling group, so cpu utilization for Workers that needed autoscaling wasn't reactive enough.

### 1 concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_ec2Backendt3a.medium-10-3-22/1concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_ec2Backendt3a.medium-10-3-22/1concurrent3min)

### 50 concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_ec2Backendt3a.medium-10-3-22/50concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_ec2Backendt3a.medium-10-3-22/50concurrent3min)

### 100 concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_ec2Backendt3a.medium-10-3-22/100concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_ec2Backendt3a.medium-10-3-22/100concurrent3min)

## NDFD Testing t3a.medium with ec2 backed ECS Dask Cluster 10/3/22 - m5a.large backend instances

- Adjusted the ECS Dask Cluster to use m5a.large ec2 instances to test if improved Network Capabilities allow for faster response times.

### 1 concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_ec2Backendm5a.large-10-3-22/1concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_ec2Backendm5a.large-10-3-22/1concurrent3min)

### 50 concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_ec2Backendm5a.large-10-3-22/50concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_ec2Backendm5a.large-10-3-22/50concurrent3min)

### 100 concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_ec2Backendm5a.large-10-3-22/100concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_ec2Backendm5a.large-10-3-22/100concurrent3min)


## NDFD Testing - t3a.medium front end with ec2 backed ECS Dask Cluster 10/17/22 - m5a.large backend instances with Lustre FSx file system

### 1 concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_ec2Backendm5a.largeLustre-10-17-22/1concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_ec2Backendm5a.largeLustre-10-17-22/1concurrent3min)

### 50 concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_ec2Backendm5a.largeLustre-10-17-22/50concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_ec2Backendm5a.largeLustre-10-17-22/50concurrent3min)

### 100 concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_ec2Backendm5a.largeLustre-10-17-22/100concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_ec2Backendm5a.largeLustre-10-17-22/100concurrent3min)


/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_ec2Backendt3a.mediumLustre-10-17-22


## NDFD Testing - t3a.medium front end with ec2 backed ECS Dask Cluster 10/18/22 - t3a.medium backend instances with Lustre FSx file system

### 1 concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_ec2Backendt3a.mediumLustre-10-18-22/1concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_ec2Backendt3a.mediumLustre-10-18-22/1concurrent3min)

### 50 concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_ec2Backendt3a.mediumLustre-10-18-22/50concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_ec2Backendt3a.mediumLustre-10-18-22/50concurrent3min)

### 100 concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_ec2Backendt3a.mediumLustre-10-18-22/100concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_ec2Backendt3a.mediumLustre-10-18-22/100concurrent3min)


## NDFD Testing - t3a.medium front end with ec2 backed ECS Dask Cluster 10/21/22 - t3a.medium backend instances with Lustre FSx file system - Slight modification to the scaling at 25%, with a min ec2 instance set at 4 instances


### 1 concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_ec2Backendt3a.medium-10-21-22-Lustre-3WorkersOnStart/1concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_ec2Backendt3a.medium-10-21-22-Lustre-3WorkersOnStart/1concurrent3min)

### 50 concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_ec2Backendt3a.medium-10-21-22-Lustre-3WorkersOnStart/50concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_ec2Backendt3a.medium-10-21-22-Lustre-3WorkersOnStart/50concurrent3min)

## 100 concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_ec2Backendt3a.medium-10-21-22-Lustre-3WorkersOnStart/100concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_ec2Backendt3a.medium-10-21-22-Lustre-3WorkersOnStart/100concurrent3min)


Testing_ALB_t3a.medium_ecs_ec2Backendt3a.medium-10-24-22-Lustre-3WorkersOnStart

## NDFD Testing - t3a.medium front end with ec2 backed ECS Dask Cluster 10/21/22 - t3a.medium backend instances with Lustre FSx file system - Slight modification to the scaling at 25%, with a min ec2 instance set at 4 instances

### 1 concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_ec2Backendt3a.medium-10-24-22-Lustre-3WorkersOnStart/1concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_ec2Backendt3a.medium-10-24-22-Lustre-3WorkersOnStart/1concurrent3min)

### 50 concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_ec2Backendt3a.medium-10-24-22-Lustre-3WorkersOnStart/50concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_ec2Backendt3a.medium-10-24-22-Lustre-3WorkersOnStart/50concurrent3min)

### 100 concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_ec2Backendt3a.medium-10-24-22-Lustre-3WorkersOnStart/100concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_ec2Backendt3a.medium-10-24-22-Lustre-3WorkersOnStart/100concurrent3min)

### 250 concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_ec2Backendt3a.medium-10-24-22-Lustre-3WorkersOnStart/250concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_ec2Backendt3a.medium-10-24-22-Lustre-3WorkersOnStart/250concurrent3min)

### 500 concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_ec2Backendt3a.medium-10-24-22-Lustre-3WorkersOnStart/500concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_ec2Backendt3a.medium-10-24-22-Lustre-3WorkersOnStart/500concurrent3min)

### 2.8 Million Hits over 8 hours

[https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_ec2Backendt3a.medium-10-24-22-Lustre-3WorkersOnStart/Over1millionHits](https://shanemill1.github.io/NDFD_NCPP/Testing_ALB_t3a.medium_ecs_ec2Backendt3a.medium-10-24-22-Lustre-3WorkersOnStart/Over1millionHits)



## WOC Architecture Testing - 11/7/22

### 1 Concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_WOC_Architecture_11-7-22/1concurrent3minall](https://shanemill1.github.io/NDFD_NCPP/Testing_WOC_Architecture_11-7-22/1concurrent3minall)

### 50 Concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_WOC_Architecture_11-7-22/50concurrent3minall](https://shanemill1.github.io/NDFD_NCPP/Testing_WOC_Architecture_11-7-22/50concurrent3minall)

### 100 Concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_WOC_Architecture_11-7-22/100concurrent3minall](https://shanemill1.github.io/NDFD_NCPP/Testing_WOC_Architecture_11-7-22/100concurrent3minall)

### 250 Concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_WOC_Architecture_11-7-22/250concurrent3minall](https://shanemill1.github.io/NDFD_NCPP/Testing_WOC_Architecture_11-7-22/250concurrent3minall)

### 500 Concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_WOC_Architecture_11-7-22/500concurrent3minall](https://shanemill1.github.io/NDFD_NCPP/Testing_WOC_Architecture_11-7-22/500concurrent3minall)

### 1000 Concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_WOC_Architecture_11-7-22/1000concurrent3minall](https://shanemill1.github.io/NDFD_NCPP/Testing_WOC_Architecture_11-7-22/1000concurrent3minall)



## WOC Architecture Testing - 11/15/22

### 1 Concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_WOC_Architecture_11-15-22_disablespotworkers/1concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_WOC_Architecture_11-15-22_disablespotworkers/1concurrent3min)

### 50 Concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_WOC_Architecture_11-15-22_disablespotworkers/50concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_WOC_Architecture_11-15-22_disablespotworkers/50concurrent3min)

### 100 Concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_WOC_Architecture_11-15-22_disablespotworkers/100concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_WOC_Architecture_11-15-22_disablespotworkers/100concurrent3min)

### 250 Concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_WOC_Architecture_11-15-22_disablespotworkers/250concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_WOC_Architecture_11-15-22_disablespotworkers/250concurrent3min)

### 500 Concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_WOC_Architecture_11-15-22_disablespotworkers/500concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_WOC_Architecture_11-15-22_disablespotworkers/500concurrent3min)

### 1000 Concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_WOC_Architecture_11-15-22_disablespotworkers/1000concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_WOC_Architecture_11-15-22_disablespotworkers/1000concurrent3min)



## WOC Architecture Testing - 11/30/22

### 1 Concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_WOC-Architecture_11-30-22/1concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_WOC-Architecture_11-30-22/1concurrent3min)

### 50 Concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_WOC-Architecture_11-30-22/50concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_WOC-Architecture_11-30-22/50concurrent3min)

### 100 Concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_WOC-Architecture_11-30-22/100concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_WOC-Architecture_11-30-22/100concurrent3min)

### 250 Concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_WOC-Architecture_11-30-22/250concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_WOC-Architecture_11-30-22/250concurrent3min)

### 500 Concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_WOC-Architecture_11-30-22/500concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_WOC-Architecture_11-30-22/500concurrent3min)



## WOC Architecture Testing - 12/6/22

* Problematic results for t3a.medium, potential scaling issues

### 1 Concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_WOC-Architecture_12-6-22/1concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_WOC-Architecture_12-6-22/1concurrent3min)

### 50 Concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_WOC-Architecture_12-6-22/50concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_WOC-Architecture_12-6-22/50concurrent3min)

### 100 Concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_WOC-Architecture_12-6-22/100concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_WOC-Architecture_12-6-22/100concurrent3min)

### 250 Concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_WOC-Architecture_12-6-22/250concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_WOC-Architecture_12-6-22/250concurrent3min)

### 500 Concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_WOC-Architecture_12-6-22/500concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_WOC-Architecture_12-6-22/500concurrent3min)

### 1000 Concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_WOC-Architecture_12-6-22/1000concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_WOC-Architecture_12-6-22/1000concurrent3min)


## WOC Architecture Testing - 12/7/22 - m6a.large

* Testing of m6a.large without warm pool

### 1 Concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_WOC-Architecture_12-7-22-m6a.large/1concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_WOC-Architecture_12-7-22-m6a.large/1concurrent3min)

### 50 Concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_WOC-Architecture_12-7-22-m6a.large/50concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_WOC-Architecture_12-7-22-m6a.large/50concurrent3min)

### 100 Concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_WOC-Architecture_12-7-22-m6a.large/100concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_WOC-Architecture_12-7-22-m6a.large/100concurrent3min)

### 250 Concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_WOC-Architecture_12-7-22-m6a.large/250concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_WOC-Architecture_12-7-22-m6a.large/250concurrent3min)

### 500 Concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_WOC-Architecture_12-7-22-m6a.large/500concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_WOC-Architecture_12-7-22-m6a.large/500concurrent3min)

### 1000 Concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_WOC-Architecture_12-7-22-m6a.large/1000concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_WOC-Architecture_12-7-22-m6a.large/1000concurrent3min)


## WOC Architecture Testing - 12/7/22 - t3a.medium

* Rerun t3a.medium on frontend, without the warm pool

### 1 Concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_WOC-Architecture_12-7-22-t3a.medium/1concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_WOC-Architecture_12-7-22-t3a.medium/1concurrent3min)

### 50 Concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_WOC-Architecture_12-7-22-t3a.medium/50concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_WOC-Architecture_12-7-22-t3a.medium/50concurrent3min)

### 100 Concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_WOC-Architecture_12-7-22-t3a.medium/100concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_WOC-Architecture_12-7-22-t3a.medium/100concurrent3min)

### 250 Concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_WOC-Architecture_12-7-22-t3a.medium/250concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_WOC-Architecture_12-7-22-t3a.medium/250concurrent3min)

### 500 Concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_WOC-Architecture_12-7-22-t3a.medium/500concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_WOC-Architecture_12-7-22-t3a.medium/500concurrent3min)

### 1000 Concurrent

[https://shanemill1.github.io/NDFD_NCPP/Testing_WOC-Architecture_12-7-22-t3a.medium/1000concurrent3min](https://shanemill1.github.io/NDFD_NCPP/Testing_WOC-Architecture_12-7-22-t3a.medium/1000concurrent3min)


# WIFS Testing

## Initial Testing with Items/Locations only (No Cube Queries) - t3a.medium instances

### 1 hour test with two thread groups (172 hits per second for gridded and 15 per second for opmet occurring at the same time)

[https://shanemill1.github.io/WIFS-t3aMedium/results](https://shanemill1.github.io/WIFS-t3aMedium/results)


## Testing with Items/Locations only (No Cube Queries) - c5a.xlarge

### 1 hour test with two thread groups of c5a.xlarge instances (172 hits per second for gridded and 15 per second for opmet occurring at the same time)

[https://shanemill1.github.io/WIFS-c5aXlarge/results](https://shanemill1.github.io/WIFS-c5aXlarge/results)

## Testing with Items/Locations only - c5a.large and c5a.xlarge

### 1 hour test with two thread groups of c5a.xlarge for /cube and c5a.large for /items and /locations (172 hits per second for gridded and 15 per second for opmet occurring at the same time)

[https://shanemill1.github.io/WIFS-Listener-c5aLarge-c5aXlarge/results](https://shanemill1.github.io/WIFS-Listener-c5aLarge-c5aXlarge/results)

## Testing with Items/Locations only - c5a.large and c5a.xlarge - CloudFront

### 1 hour test with two thread groups of c5a.xlarge for /cube and c5a.large for /items and /locations (172 hits per second for gridded and 15 per second for opmet occurring at the same time), along with CloudFront

[https://shanemill1.github.io/WIFS-Listener-c5aLarge-c5aXlarge-CloudFront/results](https://shanemill1.github.io/WIFS-Listener-c5aLarge-c5aXlarge-CloudFront/results)


## Testing with Items/Locations only - all c5a.large - without CloudFront - to capture memory and cpu utilization for this instance type

### Half hour testing with items and locations (82 hits per second for girdded and 15 per second for OPMET)

[https://shanemill1.github.io/WIFS-Listener-c5aLarge-C5aLarge-OPMETandItems-only/results](https://shanemill1.github.io/WIFS-Listener-c5aLarge-C5aLarge-OPMETandItems-only/results)

## Testing - c5a.large for item/location, c5a.2xlarge for cube, t3a.mediums in dask cluster - without CloudFront 

### Hour testing with items, locations, and cube queries. (82 hits per second for gridded and 15 per second for OPMET)

[https://shanemill1.github.io/WIFS-Listener-c5aLarge-C5aLarge-CentralizedDask/results](https://shanemill1.github.io/WIFS-Listener-c5aLarge-C5aLarge-CentralizedDask/results)


## Testing - c5a.large for item/location, c5a.2xlarge for cube, t3a.mediums in dask cluster - without CloudFront, with warm pool of 2 instances for Gridded

### Hour testing with items, locations, and cube queries. (82 hits per second for gridded and 15 per second for OPMET)

[https://shanemill1.github.io/WIFS-Listener-c5aLarge-C5a2xLarge-CentralizedDask-WarmPool2/results](https://shanemill1.github.io/WIFS-Listener-c5aLarge-C5a2xLarge-CentralizedDask-WarmPool2/results)


## Testing - c5a.large for item/location, c5a.2xlarge for cube, t3a.mediums in dask cluster - without CloudFront, with warm pool of 2 instances for Gridded, 2 minute rampup and increase of Gunicorn to 8

### Hour testing with items, locations, and cube queries. (82 hits per second for girdded and 15 per second for OPMET)

[https://shanemill1.github.io/WIFS-Listener-c5aLarge-C5a2xLarge-CentralizedDask-WarmPool2-2minuteRampup/results](https://shanemill1.github.io/WIFS-Listener-c5aLarge-C5a2xLarge-CentralizedDask-WarmPool2-2minuteRampup/results)


## Testing - c5a.large for item/location, c5a.2xlarge for cube, c5a.large in dask cluster - without CloudFront, with warm pool of 2 instances for Gridded, 2 minute rampup and increase of Gunicorn to 8

### Hour testing with items, locations, and cube queries. (82 hits per second for gridded and 15 per second for OPMET)

[https://shanemill1.github.io/WIFS-Listener-c5aLarge-C5a2xLarge-CentralizedDaskc5a.large-WarmPool2-2minuteRampup/results](https://shanemill1.github.io/WIFS-Listener-c5aLarge-C5a2xLarge-CentralizedDaskc5a.large-WarmPool2-2minuteRampup/results)


## Testing - c5a.large for item/location, c5a.2xlarge for cube, c5a.large in dask cluster - without CloudFront, with warm pool of 2 instances for Gridded, 2 minute rampup and increase of Gunicorn to 8. Upped to 5 workers and set timeout to 60 on LB

### Hour testing with items, locations, and cube queries. (82 hits per second for girdded and 15 per second for OPMET)

[https://shanemill1.github.io/WIFS-Listener-c5aLarge-C5a2xLarge-CentralizedDaskc5a.large-WarmPool2-2minuteRampup-5workers-60secTimeout/results](https://shanemill1.github.io/WIFS-Listener-c5aLarge-C5a2xLarge-CentralizedDaskc5a.large-WarmPool2-2minuteRampup-5workers-60secTimeout/results)


## Testing - c5a.large for item/location, m5a.4xlarge for cube, c5a.large in dask cluster - without CloudFront, with warm pool of 2 instances for Gridded, 2 minute rampup and increase of Gunicorn to 8. Upped to 5 workers and set timeout to 60 on LB

### Hour testing with items, locations, and cube queries. (82 hits per second for girdded and 15 per second for OPMET)

- Application fixes such as deletion of temporary grib files and mounting of fsx when instance reboots

[https://shanemill1.github.io/WIFS-testing-3-31-23-DiskGRIB-MountFix/results](https://shanemill1.github.io/WIFS-testing-3-31-23-DiskGRIB-MountFix/results)


## Testing - 3/29/23

### Hour testing with items, locations, and cube queries. (82 hits per second for gridded and 15 per second for OPMET)

- This testing uses the convert to grib module that uses memory. This approach was causing major resource issues with a potential memory leak.
- This now uses c5a.large on the frontend for non dynamic queries, and m5.4xlarge for dynamic queries. Error rates have luckily decreased.

[https://shanemill1.github.io/WIFS-testing-3-29-23-DiskGRIB/results](https://shanemill1.github.io/WIFS-testing-3-29-23-DiskGRIB/results)

## Testing - 3/30/23

### Hour testing with items, locations, and cube queries. (82 hits per second for gridded and 15 per second for OPMET)

- This testing uses the convert to grib module that writes to disk instead of the one that uses memory. The memory approached exhausted resources way too quickly so decided to go back to what was working more effectively.
- This now uses c5a.large on the frontend for non dynamic queries, and m5.4xlarge for dynamic queries. Error rates have luckily decreased.

[https://shanemill1.github.io/WIFS-testing-3-30-23-DiskGRIB/results](https://shanemill1.github.io/WIFS-testing-3-30-23-DiskGRIB/results)


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
