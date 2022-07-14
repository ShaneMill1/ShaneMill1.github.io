jmeter -n -t NCPPServerlessWestTestPlan.jmx -l SummaryReport.jtl -e -o 10concurrent1min 
jmeter -n -t NCPPServerlessWestTestPlan1min50concurrent.jmx -l SummaryReport50.jtl -e -o 50concurrent1min
