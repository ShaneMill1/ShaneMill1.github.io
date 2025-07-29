#!/bin/bash

JVM_ARGS="-Xms2048m -Xmx4096m"


/home/shane.mill/apache-jmeter-5.6.3/bin/jmeter -n -t TestPlan.jmx -l SummaryReport.jtl -e -o results
