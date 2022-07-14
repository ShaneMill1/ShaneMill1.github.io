/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 98.18715137526448, "KoPercent": 1.812848624735526};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8603216964800924, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "NCPPServerEastGFSPosition-halftime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastGFSAreaUS-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastGFSPosition-fulltime-1zedd"], "isController": false}, {"data": [0.03894736842105263, 500, 1500, "NCPPServerEastCollections"], "isController": false}, {"data": [0.025925925925925925, 500, 1500, "NCPPServerEastGFSCollectionMeta"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastGFSAreaUS-1time-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastNWM-position-1day"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastNWM-position-1month"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastGFSAreaUS-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastGFSAreaUS-fulltime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastGFSPosition-halftime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastGFSAreaGlobe-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastGFSAreaTexas-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastGFSAreaUS-halftime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastGFSPosition-fulltime-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastGFSPosition-1time-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastGFSCorridor10waypoints"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastGFSAreaTexas-halftime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastGFSPosition-1time-1zedd"], "isController": false}, {"data": [1.0, 500, 1500, "NCPPServerEastGFSInstances"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastGFSPosition-fulltime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastGFSAreaTexas-1time-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastGFSTrajectory5waypoints"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastGFSAreaTexas-halftime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastGFSCorridor5waypoints"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastGFSTrajectory20waypoints"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastGFSAreaTexas-fulltime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastGFSAreaTexas-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastGFSTrajectory10waypoints"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastGFSCorridor20waypoints"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastNWM-position-1hour"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastGFSAreaHalfGlobe-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastGFSPosition-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastGFSPosition-halftime-fullzedd"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 41592, 754, 1.812848624735526, 3189.129592229283, 56, 306980, 76.0, 26730.800000000003, 30144.800000000003, 38898.570000000225, 11.457065341798868, 766.9052633661458, 3.1720437341212686], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NCPPServerEastGFSPosition-halftime-1zedd", 159, 0, 0.0, 21277.276729559748, 3218, 28026, 25302.0, 26995.0, 27441.0, 27933.0, 1.8532116507570195, 14.606710188730375, 0.801731212192734], "isController": false}, {"data": ["NCPPServerEastGFSAreaUS-1time-1zedd", 155, 0, 0.0, 22242.87096774193, 3388, 29986, 26411.0, 28775.0, 29394.6, 29956.32, 1.7737597985924358, 83.26104710834238, 2.0128016464496192], "isController": false}, {"data": ["NCPPServerEastGFSPosition-fulltime-1zedd", 153, 0, 0.0, 22025.50980392157, 3364, 29875, 26084.0, 28719.6, 29304.4, 29727.58, 1.7868613138686131, 22.792951642335765, 0.7730269160583941], "isController": false}, {"data": ["NCPPServerEastCollections", 950, 0, 0.0, 2984.6842105263177, 438, 3449, 3239.0, 3325.0, 3345.45, 3408.0, 15.042594293314753, 606.066711678991, 2.497305693226082], "isController": false}, {"data": ["NCPPServerEastGFSCollectionMeta", 675, 0, 0.0, 4261.792592592595, 622, 5021, 4676.0, 4811.0, 4852.0, 4918.08, 10.438736217001995, 114.00037804173175, 2.630072210924331], "isController": false}, {"data": ["NCPPServerEastGFSAreaUS-1time-fullzedd", 127, 0, 0.0, 29007.50393700787, 4182, 44808, 34430.0, 39569.2, 39693.8, 43450.84, 1.2952971534060196, 2241.354871579447, 1.4635339907136373], "isController": false}, {"data": ["NCPPServerEastNWM-position-1day", 56, 0, 0.0, 162848.23214285716, 31361, 306980, 157464.5, 272889.4, 292168.1, 306980.0, 0.1647693670208227, 0.7004307174234778, 0.05647856232842654], "isController": false}, {"data": ["NCPPServerEastNWM-position-1month", 56, 0, 0.0, 167694.35714285713, 32919, 302115, 165838.0, 273837.1, 294577.2, 302115.0, 0.16665029922656405, 9.090741273922502, 0.05712329592629295], "isController": false}, {"data": ["NCPPServerEastGFSAreaUS-1time-halfzedd", 138, 0, 0.0, 26236.768115942024, 3856, 37260, 31448.0, 34405.5, 35242.95, 36534.989999999976, 1.4891229281767957, 1320.6513547107002, 1.688351288684824], "isController": false}, {"data": ["NCPPServerEastGFSAreaUS-fulltime-1zedd", 134, 0, 0.0, 26918.335820895514, 4875, 36867, 32330.5, 35265.5, 35779.75, 36748.700000000004, 1.4330937713894594, 7739.515279760759, 1.6262255491743667], "isController": false}, {"data": ["NCPPServerEastGFSPosition-halftime-halfzedd", 150, 0, 0.0, 23382.279999999995, 3208, 33153, 27943.0, 30555.100000000002, 30919.85, 32604.24000000001, 1.6801451645422165, 89.17403276143058, 0.7252189089137301], "isController": false}, {"data": ["NCPPServerEastGFSAreaGlobe-1time-1zedd", 142, 0, 0.0, 25156.1338028169, 4370, 33403, 29308.5, 31854.3, 32428.399999999998, 33377.63, 1.5753097924362942, 3140.106238074239, 0.8291913848859009], "isController": false}, {"data": ["NCPPServerEastGFSAreaTexas-1time-1zedd", 155, 0, 0.0, 22296.85806451613, 3516, 31945, 26209.0, 29145.600000000002, 29501.8, 31449.399999999998, 1.7482123119261916, 12.228949990554014, 1.3521329600054137], "isController": false}, {"data": ["NCPPServerEastGFSAreaUS-halftime-1zedd", 142, 0, 0.0, 24649.464788732388, 4911, 32411, 29287.5, 31318.0, 31724.6, 32374.45, 1.576219072250774, 4292.860350250863, 1.78863922065957], "isController": false}, {"data": ["NCPPServerEastGFSPosition-fulltime-fullzedd", 146, 0, 0.0, 23758.876712328765, 3478, 34638, 28578.0, 31036.1, 31774.100000000002, 33897.75, 1.6309569025223978, 312.30435586278736, 0.6976163313523537], "isController": false}, {"data": ["NCPPServerEastGFSPosition-1time-fullzedd", 146, 0, 0.0, 24057.253424657523, 3723, 32386, 28443.0, 31480.0, 31756.65, 32353.57, 1.6176568351541207, 8.897112593347662, 0.6919274353491257], "isController": false}, {"data": ["NCPPServerEastGFSCorridor10waypoints", 150, 150, 100.0, 21044.780000000017, 21020, 21085, 21042.0, 21064.0, 21069.45, 21081.43, 2.0559210526315788, 5.8826647306743425, 0.0], "isController": false}, {"data": ["NCPPServerEastGFSAreaTexas-halftime-halfzedd", 124, 0, 0.0, 29322.338709677413, 5454, 40517, 34408.0, 38014.0, 39161.75, 40446.75, 1.3104497801826176, 6247.77664427101, 1.0122712657465338], "isController": false}, {"data": ["NCPPServerEastGFSPosition-1time-1zedd", 147, 0, 0.0, 23335.10204081633, 3755, 31742, 27097.0, 29275.800000000003, 30332.2, 31723.760000000002, 1.6920863309352518, 5.127484262589928, 0.6824527877697841], "isController": false}, {"data": ["NCPPServerEastGFSInstances", 35728, 0, 0.0, 77.08226041200157, 56, 325, 72.0, 90.0, 112.0, 167.0, 594.7331624329994, 1031.4903285947332, 147.52170240037287], "isController": false}, {"data": ["NCPPServerEastGFSPosition-fulltime-halfzedd", 145, 0, 0.0, 23590.268965517258, 3412, 34590, 27907.0, 31251.2, 31873.299999999996, 33764.29999999999, 1.6587542183835726, 169.01798354115425, 0.7159857075444718], "isController": false}, {"data": ["NCPPServerEastGFSAreaTexas-1time-fullzedd", 123, 0, 0.0, 29105.17886178862, 4285, 42026, 32744.0, 39696.0, 40683.2, 41937.68, 1.306967304565885, 193.36862064809108, 1.004475848333351], "isController": false}, {"data": ["NCPPServerEastGFSTrajectory5waypoints", 149, 0, 0.0, 23297.429530201345, 3038, 30901, 28136.0, 29961.0, 30334.5, 30787.5, 1.6643395699525272, 6.530582414130131, 1.147484117564926], "isController": false}, {"data": ["NCPPServerEastGFSAreaTexas-halftime-1zedd", 150, 1, 0.6666666666666666, 23071.19333333333, 4406, 33395, 26448.5, 29210.0, 30686.75, 33330.23, 1.6987734855434378, 391.4422140079446, 1.305135816940169], "isController": false}, {"data": ["NCPPServerEastGFSCorridor5waypoints", 150, 150, 100.0, 21046.173333333343, 21016, 21077, 21047.0, 21061.9, 21066.0, 21073.43, 2.0562874415671653, 5.883713089640423, 0.0], "isController": false}, {"data": ["NCPPServerEastGFSTrajectory20waypoints", 150, 150, 100.0, 21043.02, 21014, 21071, 21043.0, 21058.8, 21064.45, 21069.98, 2.05738739233006, 5.8868604096944095, 0.0], "isController": false}, {"data": ["NCPPServerEastGFSAreaTexas-fulltime-1zedd", 155, 0, 0.0, 22275.509677419355, 3143, 33318, 26988.0, 29304.4, 30030.8, 31803.199999999993, 1.7480940136238552, 799.1316184390084, 1.3520414636622005], "isController": false}, {"data": ["NCPPServerEastGFSAreaTexas-1time-halfzedd", 141, 2, 1.4184397163120568, 25465.333333333336, 4006, 39759, 29636.0, 34692.2, 35889.3, 39212.580000000016, 1.5168793166512469, 115.70503790853542, 1.155109735057125], "isController": false}, {"data": ["NCPPServerEastGFSTrajectory10waypoints", 150, 150, 100.0, 21045.46, 21011, 21090, 21042.0, 21067.9, 21072.45, 21089.49, 2.0571052415041553, 5.886053083600756, 0.0], "isController": false}, {"data": ["NCPPServerEastGFSCorridor20waypoints", 150, 150, 100.0, 21045.49333333333, 21022, 21078, 21043.0, 21063.0, 21067.45, 21074.43, 2.0562028786840303, 5.883471127484579, 0.0], "isController": false}, {"data": ["NCPPServerEastNWM-position-1hour", 56, 0, 0.0, 165023.28571428577, 33842, 293634, 162396.5, 264223.60000000003, 288855.8, 293634.0, 0.17008507290878883, 0.4081045157586857, 0.058300645108383675], "isController": false}, {"data": ["NCPPServerEastGFSAreaHalfGlobe-1time-1zedd", 149, 0, 0.0, 23821.95973154363, 3943, 33746, 27370.0, 30443.0, 32183.5, 33405.0, 1.617631093258061, 1416.9231994184943, 0.840409903919227], "isController": false}, {"data": ["NCPPServerEastGFSPosition-1time-halfzedd", 143, 0, 0.0, 24234.489510489508, 3226, 34905, 26895.0, 33256.6, 33849.8, 34899.28, 1.6155636396502249, 6.922942627719909, 0.6973428991458979], "isController": false}, {"data": ["NCPPServerEastGFSPosition-halftime-fullzedd", 148, 1, 0.6756756756756757, 23340.533783783783, 3766, 35540, 27145.0, 30846.799999999996, 31897.85, 34590.37999999998, 1.6753642219178393, 163.8830709150262, 0.7117689030326356], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to ec2-3-22-82-155.us-east-2.compute.amazonaws.com:443 [ec2-3-22-82-155.us-east-2.compute.amazonaws.com/3.22.82.155] failed: Connection timed out: connect", 750, 99.46949602122015, 1.8032313906520485], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 4, 0.5305039787798409, 0.009617234083477592], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 41592, 754, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to ec2-3-22-82-155.us-east-2.compute.amazonaws.com:443 [ec2-3-22-82-155.us-east-2.compute.amazonaws.com/3.22.82.155] failed: Connection timed out: connect", 750, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 4, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerEastGFSCorridor10waypoints", 150, 150, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to ec2-3-22-82-155.us-east-2.compute.amazonaws.com:443 [ec2-3-22-82-155.us-east-2.compute.amazonaws.com/3.22.82.155] failed: Connection timed out: connect", 150, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerEastGFSAreaTexas-halftime-1zedd", 150, 1, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerEastGFSCorridor5waypoints", 150, 150, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to ec2-3-22-82-155.us-east-2.compute.amazonaws.com:443 [ec2-3-22-82-155.us-east-2.compute.amazonaws.com/3.22.82.155] failed: Connection timed out: connect", 150, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerEastGFSTrajectory20waypoints", 150, 150, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to ec2-3-22-82-155.us-east-2.compute.amazonaws.com:443 [ec2-3-22-82-155.us-east-2.compute.amazonaws.com/3.22.82.155] failed: Connection timed out: connect", 150, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerEastGFSAreaTexas-1time-halfzedd", 141, 2, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerEastGFSTrajectory10waypoints", 150, 150, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to ec2-3-22-82-155.us-east-2.compute.amazonaws.com:443 [ec2-3-22-82-155.us-east-2.compute.amazonaws.com/3.22.82.155] failed: Connection timed out: connect", 150, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerEastGFSCorridor20waypoints", 150, 150, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to ec2-3-22-82-155.us-east-2.compute.amazonaws.com:443 [ec2-3-22-82-155.us-east-2.compute.amazonaws.com/3.22.82.155] failed: Connection timed out: connect", 150, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerEastGFSPosition-halftime-fullzedd", 148, 1, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 1, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
