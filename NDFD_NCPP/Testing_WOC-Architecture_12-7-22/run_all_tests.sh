#!/bin/bash

JVM_ARGS="-Xms2048m -Xmx4096m"


/home/ec2-user/apache-jmeter-5.5/bin/jmeter -n -t test_plan1.jmx -l SummaryReport1all.jtl -e -o 1concurrent3min
/home/ec2-user/apache-jmeter-5.5/bin/jmeter -n -t test_plan50.jmx -l SummaryReport50all.jtl -e -o 50concurrent3min
/home/ec2-user/apache-jmeter-5.5/bin/jmeter -n -t test_plan100.jmx -l SummaryReport100all.jtl -e -o 100concurrent3min
/home/ec2-user/apache-jmeter-5.5/bin/jmeter -n -t test_plan250.jmx -l SummaryReport250all.jtl -e -o 250concurrent3min
/home/ec2-user/apache-jmeter-5.5/bin/jmeter -n -t test_plan500.jmx -l SummaryReport500all.jtl -e -o 500concurrent3min
/home/ec2-user/apache-jmeter-5.5/bin/jmeter -n -t test_plan1000.jmx -l SummaryReport1000all.jtl -e -o 1000concurrent3min