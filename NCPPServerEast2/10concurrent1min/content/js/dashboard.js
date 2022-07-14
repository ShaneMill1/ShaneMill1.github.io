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

    var data = {"OkPercent": 99.36532114749936, "KoPercent": 0.6346788525006347};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7325886434797326, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "NCPPServerEastGFSPosition-halftime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastGFSAreaUS-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastGFSPosition-fulltime-1zedd"], "isController": false}, {"data": [0.5303197353914002, 500, 1500, "NCPPServerEastCollections"], "isController": false}, {"data": [0.49513776337115073, 500, 1500, "NCPPServerEastGFSCollectionMeta"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastGFSAreaUS-1time-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastNWM-position-1day"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastNWM-position-1month"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastGFSAreaUS-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastGFSAreaUS-fulltime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastGFSPosition-halftime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastGFSAreaGlobe-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastGFSAreaTexas-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastGFSAreaUS-halftime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastGFSPosition-fulltime-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastGFSPosition-1time-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastGFSCorridor10waypoints"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastGFSAreaTexas-halftime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastGFSPosition-1time-1zedd"], "isController": false}, {"data": [0.9999364756701817, 500, 1500, "NCPPServerEastGFSInstances"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastGFSPosition-fulltime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastGFSAreaTexas-1time-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastGFSTrajectory5waypoints"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastGFSAreaTexas-halftime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastGFSCorridor5waypoints"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastGFSTrajectory20waypoints"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastGFSAreaTexas-fulltime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastGFSAreaTexas-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastGFSTrajectory10waypoints"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastGFSCorridor20waypoints"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastNWM-position-1hour"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastGFSAreaHalfGlobe-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastGFSPosition-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerEastGFSPosition-halftime-fullzedd"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 23634, 150, 0.6346788525006347, 1593.9715240754854, 57, 69493, 72.0, 5997.0, 6829.9000000000015, 21033.0, 9.986697924571994, 1581.070223875398, 3.2483660008163793], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NCPPServerEastGFSPosition-halftime-1zedd", 226, 0, 0.0, 5219.876106194693, 2929, 6815, 5388.0, 6113.9, 6371.0, 6800.959999999999, 3.4362171202675995, 27.083699587577925, 1.486566586209518], "isController": false}, {"data": ["NCPPServerEastGFSAreaUS-1time-1zedd", 230, 0, 0.0, 5145.695652173913, 2950, 6987, 5207.0, 6371.0, 6633.0, 6981.42, 3.5139181715403183, 164.9448288588169, 3.987473550126807], "isController": false}, {"data": ["NCPPServerEastGFSPosition-fulltime-1zedd", 230, 0, 0.0, 5065.234782608693, 2917, 6464, 5224.0, 5946.0, 6075.0, 6429.28, 3.5366660003382897, 45.11321415665893, 1.530022498193225], "isController": false}, {"data": ["NCPPServerEastCollections", 1814, 0, 0.0, 614.5854465270118, 382, 791, 621.0, 694.0, 719.0, 763.7999999999993, 29.997354147373994, 1208.5945703693444, 4.9800294971226355], "isController": false}, {"data": ["NCPPServerEastGFSCollectionMeta", 1234, 0, 0.0, 908.2965964343606, 518, 2038, 915.0, 1065.0, 1097.0, 1510.5500000000225, 20.246103363412633, 221.1056385869565, 5.101069011484824], "isController": false}, {"data": ["NCPPServerEastGFSAreaUS-1time-fullzedd", 172, 0, 0.0, 6819.465116279072, 3704, 10059, 7208.5, 8746.0, 8807.65, 10059.0, 2.6185184057485613, 4531.029014934688, 2.9586189408702004], "isController": false}, {"data": ["NCPPServerEastNWM-position-1day", 32, 0, 0.0, 51440.812500000015, 33790, 69493, 53622.5, 68905.0, 69493.0, 69493.0, 0.2967634239080033, 1.2615343596401745, 0.10172261893721599], "isController": false}, {"data": ["NCPPServerEastNWM-position-1month", 32, 0, 0.0, 47953.43750000001, 33313, 62340, 48512.5, 61948.0, 62340.0, 62340.0, 0.3179302739168016, 17.343034346404906, 0.10897805287577869], "isController": false}, {"data": ["NCPPServerEastGFSAreaUS-1time-halfzedd", 192, 0, 0.0, 6017.44791666667, 3593, 8646, 6390.0, 7977.0, 8073.0, 8646.0, 2.9825242718446603, 2645.097087378641, 3.3815533980582524], "isController": false}, {"data": ["NCPPServerEastGFSAreaUS-fulltime-1zedd", 174, 0, 0.0, 6762.7816091954, 4417, 8007, 6985.0, 7465.0, 7629.75, 8007.0, 2.6178798182529412, 14138.028689010172, 2.9706800281346855], "isController": false}, {"data": ["NCPPServerEastGFSPosition-halftime-halfzedd", 208, 0, 0.0, 5719.259615384612, 3634, 7769, 5693.0, 6780.2, 6898.549999999999, 7757.929999999999, 3.122513623466891, 165.7280204314473, 1.3478037320042635], "isController": false}, {"data": ["NCPPServerEastGFSAreaGlobe-1time-1zedd", 200, 0, 0.0, 5862.219999999998, 3829, 7682, 6019.5, 6748.0, 7010.849999999999, 7681.780000000001, 3.0070666065253344, 5994.064567358291, 1.5828211923019093], "isController": false}, {"data": ["NCPPServerEastGFSAreaTexas-1time-1zedd", 234, 0, 0.0, 4981.555555555552, 3401, 6420, 5049.0, 5880.0, 6043.0, 6363.300000000001, 3.6176429664672325, 25.305836492973423, 2.7980207318769996], "isController": false}, {"data": ["NCPPServerEastGFSAreaUS-halftime-1zedd", 200, 0, 0.0, 5827.350000000001, 4062, 7490, 5920.5, 6635.7, 6794.549999999999, 7489.89, 3.0635377734207463, 8343.598977161326, 3.4763973561669013], "isController": false}, {"data": ["NCPPServerEastGFSPosition-fulltime-fullzedd", 198, 0, 0.0, 5927.464646464651, 3744, 8972, 6056.0, 7543.0, 7619.0, 8972.0, 2.9940572500037805, 573.3181051152259, 1.2806612065445857], "isController": false}, {"data": ["NCPPServerEastGFSPosition-1time-fullzedd", 200, 0, 0.0, 5841.759999999998, 3367, 8241, 5897.5, 7627.000000000002, 7809.25, 8240.81, 3.0781069642170067, 16.929588303193537, 1.3166121585225088], "isController": false}, {"data": ["NCPPServerEastGFSCorridor10waypoints", 30, 30, 100.0, 21039.63333333333, 21023, 21056, 21040.5, 21054.9, 21055.45, 21056.0, 0.41608876560332875, 1.1905664875173372, 0.0], "isController": false}, {"data": ["NCPPServerEastGFSAreaTexas-halftime-halfzedd", 164, 0, 0.0, 7376.585365853659, 4723, 10083, 7196.5, 9209.5, 9453.5, 10083.0, 2.3719988429273937, 11308.879741285797, 1.8322764499566098], "isController": false}, {"data": ["NCPPServerEastGFSPosition-1time-1zedd", 214, 0, 0.0, 5429.046728971963, 3940, 6761, 5481.0, 6331.0, 6558.0, 6760.7, 3.2822589303516927, 9.946142051641896, 1.3238016974953604], "isController": false}, {"data": ["NCPPServerEastGFSInstances", 15742, 0, 0.0, 70.40401473764445, 57, 1066, 68.0, 80.0, 84.0, 97.0, 262.06092891626434, 454.511923589146, 65.00339447727652], "isController": false}, {"data": ["NCPPServerEastGFSPosition-fulltime-halfzedd", 204, 0, 0.0, 5765.774509803926, 3258, 7408, 5771.0, 7092.0, 7223.5, 7405.249999999999, 3.056042425059548, 311.39401038155586, 1.319112062379219], "isController": false}, {"data": ["NCPPServerEastGFSAreaTexas-1time-fullzedd", 178, 0, 0.0, 6789.426966292139, 3427, 10317, 8125.0, 8768.0, 8819.15, 10317.0, 2.632357290742384, 389.4629166204525, 2.0231105349748595], "isController": false}, {"data": ["NCPPServerEastGFSTrajectory5waypoints", 106, 0, 0.0, 5504.3867924528295, 2998, 8238, 5478.0, 6687.2, 6916.649999999999, 8184.729999999994, 1.6326782083667057, 6.406348673063889, 1.1256550928778262], "isController": false}, {"data": ["NCPPServerEastGFSAreaTexas-halftime-1zedd", 222, 0, 0.0, 5170.2252252252265, 3623, 6795, 5218.0, 5965.1, 6371.0, 6787.410000000001, 3.489907564610451, 809.5051899111016, 2.6992253820033953], "isController": false}, {"data": ["NCPPServerEastGFSCorridor5waypoints", 30, 30, 100.0, 21040.366666666672, 21018, 21061, 21042.5, 21055.0, 21060.45, 21061.0, 0.41604260276252286, 1.1904344004826093, 0.0], "isController": false}, {"data": ["NCPPServerEastGFSTrajectory20waypoints", 30, 30, 100.0, 21040.3, 21017, 21059, 21039.0, 21053.9, 21056.8, 21059.0, 0.41601375618820463, 1.1903518609682027, 0.0], "isController": false}, {"data": ["NCPPServerEastGFSAreaTexas-fulltime-1zedd", 228, 0, 0.0, 5148.166666666665, 3536, 6822, 5377.0, 6065.099999999999, 6235.0, 6784.880000000001, 3.5042958363432364, 1601.9696774664556, 2.710353810921722], "isController": false}, {"data": ["NCPPServerEastGFSAreaTexas-1time-halfzedd", 196, 0, 0.0, 5951.84693877551, 3134, 8048, 6242.0, 7480.0, 7768.0, 8048.0, 2.995247337133426, 231.65196104650275, 2.313711566086465], "isController": false}, {"data": ["NCPPServerEastGFSTrajectory10waypoints", 30, 30, 100.0, 21037.599999999995, 21020, 21061, 21036.5, 21051.0, 21057.7, 21061.0, 0.41589264424543215, 1.1900053199600742, 0.0], "isController": false}, {"data": ["NCPPServerEastGFSCorridor20waypoints", 30, 30, 100.0, 21037.500000000004, 21018, 21056, 21035.5, 21053.8, 21055.45, 21056.0, 0.41620999181453683, 1.190913355484954, 0.0], "isController": false}, {"data": ["NCPPServerEastNWM-position-1hour", 32, 0, 0.0, 49275.312500000015, 32773, 64695, 49115.5, 64652.0, 64695.0, 64695.0, 0.3111357426907408, 0.746543476358545, 0.10664906805122072], "isController": false}, {"data": ["NCPPServerEastGFSAreaHalfGlobe-1time-1zedd", 212, 0, 0.0, 5486.245283018864, 3472, 7346, 5498.0, 6617.0, 6798.0, 7336.900000000001, 3.217532516808572, 2818.3165413612287, 1.6716086903732035], "isController": false}, {"data": ["NCPPServerEastGFSPosition-1time-halfzedd", 210, 0, 0.0, 5589.590476190473, 3306, 10299, 5778.0, 6694.0, 6751.45, 9925.769999999953, 3.1583221789415106, 13.533904024604833, 1.3632601592696756], "isController": false}, {"data": ["NCPPServerEastGFSPosition-halftime-fullzedd", 200, 0, 0.0, 5907.040000000002, 3431, 9098, 6013.0, 7425.200000000002, 7702.55, 9097.75, 3.032876379958753, 298.64058424572363, 1.2972654828339196], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to ec2-3-22-82-155.us-east-2.compute.amazonaws.com:443 [ec2-3-22-82-155.us-east-2.compute.amazonaws.com/3.22.82.155] failed: Connection timed out: connect", 150, 100.0, 0.6346788525006347], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 23634, 150, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to ec2-3-22-82-155.us-east-2.compute.amazonaws.com:443 [ec2-3-22-82-155.us-east-2.compute.amazonaws.com/3.22.82.155] failed: Connection timed out: connect", 150, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerEastGFSCorridor10waypoints", 30, 30, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to ec2-3-22-82-155.us-east-2.compute.amazonaws.com:443 [ec2-3-22-82-155.us-east-2.compute.amazonaws.com/3.22.82.155] failed: Connection timed out: connect", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerEastGFSCorridor5waypoints", 30, 30, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to ec2-3-22-82-155.us-east-2.compute.amazonaws.com:443 [ec2-3-22-82-155.us-east-2.compute.amazonaws.com/3.22.82.155] failed: Connection timed out: connect", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerEastGFSTrajectory20waypoints", 30, 30, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to ec2-3-22-82-155.us-east-2.compute.amazonaws.com:443 [ec2-3-22-82-155.us-east-2.compute.amazonaws.com/3.22.82.155] failed: Connection timed out: connect", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerEastGFSTrajectory10waypoints", 30, 30, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to ec2-3-22-82-155.us-east-2.compute.amazonaws.com:443 [ec2-3-22-82-155.us-east-2.compute.amazonaws.com/3.22.82.155] failed: Connection timed out: connect", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerEastGFSCorridor20waypoints", 30, 30, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to ec2-3-22-82-155.us-east-2.compute.amazonaws.com:443 [ec2-3-22-82-155.us-east-2.compute.amazonaws.com/3.22.82.155] failed: Connection timed out: connect", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
