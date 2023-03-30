#!/bin/bash

JVM_ARGS="-Xms2048m -Xmx4096m"


/home/ec2-user/apache-jmeter-5.5/bin/jmeter -n -t WIFSTestPlan.jmx -l SummaryReport.jtl -e -o results
