#!/bin/bash

JVM_ARGS="-Xms2048m -Xmx4096m"

/home/shane.mill/apache-jmeter-5.6.3/bin/jmeter -n -t test_plan.jmx -l SummaryReport.jtl -e -o results
#/home/shane.mill/apache-jmeter-5.6.3/bin/jmeter -n -t test_planconsec_500.jmx -l SummaryReport500consec.jtl -e -o results500
#/home/shane.mill/apache-jmeter-5.6.3/bin/jmeter -n -t test_root.jmx -l SummaryReportRoot.jtl -e -o resultsRoot
