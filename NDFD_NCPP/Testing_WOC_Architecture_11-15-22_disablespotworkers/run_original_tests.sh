#!/bin/bash

/c/Users/Shane.Mill/Desktop/apache-jmeter-5.5/apache-jmeter-5.5/bin/jmeter.bat -n -t test_plan1.jmx -l SummaryReport1.jtl -e -o 1concurrent3min
/c/Users/Shane.Mill/Desktop/apache-jmeter-5.5/apache-jmeter-5.5/bin/jmeter.bat -n -t test_plan50.jmx -l SummaryReport50.jtl -e -o 50concurrent3min
/c/Users/Shane.Mill/Desktop/apache-jmeter-5.5/apache-jmeter-5.5/bin/jmeter.bat -n -t test_plan100.jmx -l SummaryReport100.jtl -e -o 100concurrent3min
