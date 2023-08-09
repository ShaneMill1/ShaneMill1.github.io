#!/bin/bash

JVM_ARGS="-Xss100k -Xms2G -Xmx50G" && \
/home/ec2-user/apache-jmeter-5.5/bin/jmeter -n -t WIFSTestPlan-AMQP.jmx -l SummaryReport-AMQP.jtl -e -o results_amqp
/home/ec2-user/apache-jmeter-5.5/bin/jmeter -n -t WIFSTestPlan-MQTT.jmx -l SummaryReport-MQTT.jtl -e -o results_mqtt
