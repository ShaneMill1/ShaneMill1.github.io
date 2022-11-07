#!/bin/bash

/c/Users/Shane.Mill/Desktop/apache-jmeter-5.5/apache-jmeter-5.5/bin/jmeter.bat -n -t test_plan1.jmx -l SummaryReport1all.jtl -e -o 1concurrent3minall
/c/Users/Shane.Mill/Desktop/apache-jmeter-5.5/apache-jmeter-5.5/bin/jmeter.bat -n -t test_plan50.jmx -l SummaryReport50all.jtl -e -o 50concurrent3minall
/c/Users/Shane.Mill/Desktop/apache-jmeter-5.5/apache-jmeter-5.5/bin/jmeter.bat -n -t test_plan100.jmx -l SummaryReport100all.jtl -e -o 100concurrent3minall
/c/Users/Shane.Mill/Desktop/apache-jmeter-5.5/apache-jmeter-5.5/bin/jmeter.bat -n -t test_plan250.jmx -l SummaryReport250all.jtl -e -o 250concurrent3minall
/c/Users/Shane.Mill/Desktop/apache-jmeter-5.5/apache-jmeter-5.5/bin/jmeter.bat -n -t test_plan500.jmx -l SummaryReport500all.jtl -e -o 500concurrent3minall
/c/Users/Shane.Mill/Desktop/apache-jmeter-5.5/apache-jmeter-5.5/bin/jmeter.bat -n -t test_plan1000.jmx -l SummaryReport1000all.jtl -e -o 1000concurrent3minall
