#!/bin/bash

JVM_ARGS="-Xss100k -Xms2G -Xmx50G" && \
/home/shane.mill/apache-jmeter-5.6.3/bin/jmeter -n -t WIFSTestPlan-AMQP.jmx -l SummaryReport-AMQP.jtl -e -o results_amqp
