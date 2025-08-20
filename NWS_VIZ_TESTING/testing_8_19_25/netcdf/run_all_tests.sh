#!/bin/bash

/home/shane.mill/apache-jmeter-5.6.3/bin/jmeter -Dheap_size=55g -Jsave.saveservice.response_data=false -n -t TestPlan.jmx -l SummaryReport.jtl -e -o results
