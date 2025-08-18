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

    var data = {"OkPercent": 94.641294986471, "KoPercent": 5.358705013529001};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5794616881751785, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9559399477806788, 500, 1500, "HREF_ResLevel-1_Time-All_5threads_ZARR"], "isController": false}, {"data": [0.024803149606299212, 500, 1500, "NBM_ResLevel-1_Times-One_100threads_ZARR"], "isController": false}, {"data": [0.1702127659574468, 500, 1500, "HREF_ResLevel-1_Times-One_50threads_ZARR"], "isController": false}, {"data": [0.15453460620525059, 500, 1500, "NBM_ResLevel-1_Times-One_25threads_ZARR"], "isController": false}, {"data": [0.36807095343680707, 500, 1500, "HREF_ResLevel-1_Times-One_25threads_ZARR"], "isController": false}, {"data": [0.05357142857142857, 500, 1500, "NBM_ResLevel-1_Times-One_50threads_ZARR"], "isController": false}, {"data": [0.2581903276131045, 500, 1500, "HREF_ResLevel-1_Time-All_50threads_ZARR"], "isController": false}, {"data": [0.31102613129381773, 500, 1500, "LREF_ResLevel-1_Time-All_50threads_ZARR"], "isController": false}, {"data": [0.12435233160621761, 500, 1500, "NBM_ResLevel-1_Time-All_25threads_ZARR"], "isController": false}, {"data": [0.7793160478019633, 500, 1500, "MRMS_ResLevel-1_Times-One_100threads_ZARR"], "isController": false}, {"data": [0.08985507246376812, 500, 1500, "HREF_ResLevel-1_Times-One_100threads_ZARR"], "isController": false}, {"data": [0.020444131124427212, 500, 1500, "HREF_ResLevel-1_Time-All_250threads_ZARR"], "isController": false}, {"data": [0.980795847750865, 500, 1500, "MRMS_ResLevel-1_Times-One_25threads_ZARR"], "isController": false}, {"data": [0.14293230445457733, 500, 1500, "HREF_ResLevel-1_Time-All_100threads_ZARR"], "isController": false}, {"data": [0.04591549295774648, 500, 1500, "LREF_ResLevel-1_Time-All_250threads_ZARR"], "isController": false}, {"data": [0.41238121855785353, 500, 1500, "LREF_ResLevel-1_Times-One_50threads_ZARR"], "isController": false}, {"data": [0.9915506958250497, 500, 1500, "HREF_ResLevel-1_Times-One_5threads_ZARR"], "isController": false}, {"data": [0.527816411682893, 500, 1500, "LREF_ResLevel-1_Time-All_25threads_ZARR"], "isController": false}, {"data": [0.648391127772571, 500, 1500, "MRMS_ResLevel-1_Times-One_250threads_ZARR"], "isController": false}, {"data": [0.04346092503987241, 500, 1500, "NBM_ResLevel-1_Time-All_50threads_ZARR"], "isController": false}, {"data": [0.4986225895316804, 500, 1500, "NBM_ResLevel-1_Time-All_5threads_ZARR"], "isController": false}, {"data": [0.15264527320034693, 500, 1500, "LREF_ResLevel-1_Times-One_100threads_ZARR"], "isController": false}, {"data": [0.9966985803895675, 500, 1500, "MRMS_ResLevel-1_Times-One_5threads_ZARR"], "isController": false}, {"data": [0.15069712251557402, 500, 1500, "LREF_ResLevel-1_Time-All_100threads_ZARR"], "isController": false}, {"data": [0.0018129079042784628, 500, 1500, "NBM_ResLevel-1_Times-One_250threads_ZARR"], "isController": false}, {"data": [0.9975688816855753, 500, 1500, "LREF_ResLevel-1_Time-All_5threads_ZARR"], "isController": false}, {"data": [0.489086859688196, 500, 1500, "HREF_ResLevel-1_Time-All_25threads_ZARR"], "isController": false}, {"data": [0.015455304928989139, 500, 1500, "NBM_ResLevel-1_Time-All_100threads_ZARR"], "isController": false}, {"data": [0.018914473684210526, 500, 1500, "HREF_ResLevel-1_Times-One_250threads_ZARR"], "isController": false}, {"data": [0.6771907216494846, 500, 1500, "NBM_ResLevel-1_Times-One_5threads_ZARR"], "isController": false}, {"data": [0.9335132010021199, 500, 1500, "MRMS_ResLevel-1_Times-One_50threads_ZARR"], "isController": false}, {"data": [0.9991111111111111, 500, 1500, "LREF_ResLevel-1_Times-One_5threads_ZARR"], "isController": false}, {"data": [0.001534526854219949, 500, 1500, "NBM_ResLevel-1_Time-All_250threads_ZARR"], "isController": false}, {"data": [0.051643192488262914, 500, 1500, "LREF_ResLevel-1_Times-One_250threads_ZARR"], "isController": false}, {"data": [0.5417726116963313, 500, 1500, "LREF_ResLevel-1_Times-One_25threads_ZARR"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 147461, 7902, 5.358705013529001, 2238.9428052162593, 6, 62416, 1062.5, 15140.100000000013, 20854.850000000002, 30571.99, 33.989359323591906, 2020.8823424422162, 9.682616942146451], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["HREF_ResLevel-1_Time-All_5threads_ZARR", 1532, 0, 0.0, 352.8165796344645, 238, 1951, 304.0, 488.0, 539.0, 581.0200000000004, 12.73165461647137, 1724.1246240806531, 3.3942790139616057], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_100threads_ZARR", 1270, 321, 25.275590551181104, 8496.50393700787, 6, 31083, 7148.0, 17112.100000000002, 20032.350000000006, 27668.06999999999, 9.97902048449323, 56.173855948517684, 2.9917571179095916], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_50threads_ZARR", 1880, 27, 1.4361702127659575, 2827.9287234042517, 6, 13931, 2205.0, 5622.8, 7098.499999999998, 10176.18, 15.44998068752414, 84.26954380182524, 4.556537273078408], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_25threads_ZARR", 838, 6, 0.7159904534606205, 3186.834128878278, 391, 18001, 2918.0, 5906.3, 7111.849999999998, 11682.690000000006, 6.86176571737386, 50.710290371214974, 2.0571895265954834], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_25threads_ZARR", 1804, 4, 0.22172949002217296, 1472.8065410199558, 222, 6695, 1421.5, 2757.0, 3153.0, 4280.85, 14.878227808430447, 82.101368622733, 4.387914841939447], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_50threads_ZARR", 1036, 110, 10.617760617760618, 5252.551158301157, 6, 25522, 4560.5, 9922.7, 12368.349999999999, 17857.249999999873, 8.293838862559243, 55.403183528704204, 2.486531768364929], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_50threads_ZARR", 2564, 22, 0.858034321372855, 2074.162246489859, 105, 11757, 1678.5, 4016.0, 5058.0, 7359.899999999997, 21.04433756299348, 2825.431465924527, 5.610453276071505], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_50threads_ZARR", 3138, 13, 0.41427660930529, 1687.0936902485682, 27, 11460, 1379.5, 3156.1, 4064.5999999999967, 6324.660000000001, 25.903057518325298, 8422.028130004375, 6.880499653305157], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_25threads_ZARR", 965, 3, 0.31088082901554404, 2771.993782383422, 540, 16133, 2490.0, 5036.799999999999, 6163.9, 9328.560000000003, 7.887595631988492, 1561.309197835611, 2.1413589704031257], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_100threads_ZARR", 18744, 17, 0.09069568928723858, 561.8358941528027, 15, 3294, 388.0, 1322.5, 1795.0, 2295.5499999999993, 155.5441222843676, 2870.2809987158316, 44.81007429090668], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_100threads_ZARR", 2415, 124, 5.134575569358178, 4426.82774327123, 71, 25349, 3498.0, 8840.2, 11034.599999999999, 16530.280000000006, 19.63494450993943, 103.26182752601731, 5.790774650392292], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_250threads_ZARR", 2837, 799, 28.163553048995418, 9721.784279168109, 7, 49834, 7872.0, 20590.800000000003, 24867.499999999996, 32106.25999999998, 22.16787260310366, 2158.250305655562, 5.909989473288378], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_25threads_ZARR", 11560, 0, 0.0, 228.51314878892708, 99, 1950, 178.0, 330.0, 414.0, 1154.0, 96.15544575867978, 1775.9272299371164, 27.701031737119663], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_100threads_ZARR", 2851, 90, 3.156787092248334, 3751.913363732034, 12, 23158, 3034.0, 7550.000000000001, 9211.0, 14294.240000000007, 23.170196511873606, 3038.8797606052817, 6.177210593497554], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_250threads_ZARR", 3550, 475, 13.380281690140846, 7524.351267605635, 7, 38191, 5885.0, 16260.7, 20093.749999999993, 28726.559999999925, 28.75681455499842, 8133.636204905467, 7.623466978266329], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_50threads_ZARR", 3578, 24, 0.6707657909446618, 1479.5422023476808, 54, 13862, 1073.0, 3167.7999999999993, 4076.2499999999986, 6285.780000000001, 29.518285992426556, 306.1927354249338, 8.676761800508197], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_5threads_ZARR", 2012, 0, 0.0, 268.31858846918465, 204, 2031, 244.0, 318.0, 334.3499999999999, 822.5699999999988, 16.75647314550315, 92.66133121882106, 4.941850478458938], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_25threads_ZARR", 2876, 4, 0.13908205841446453, 921.374130737135, 116, 3219, 849.5, 1635.3000000000002, 1903.2000000000007, 2439.07, 23.84822050482603, 7775.307112370539, 6.3346835715944145], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_250threads_ZARR", 35211, 27, 0.07668058277242908, 748.0884098719126, 12, 7991, 669.0, 1318.0, 1524.0, 1957.9700000000048, 291.39494852527395, 5378.159240623655, 83.94678692866778], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_50threads_ZARR", 1254, 16, 1.2759170653907497, 4253.578149920254, 234, 18106, 3296.5, 8311.0, 10414.5, 14566.650000000005, 10.223465053522366, 2004.1269456888608, 2.775511020389861], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_5threads_ZARR", 726, 1, 0.13774104683195593, 745.1707988980718, 8, 1556, 681.5, 1009.0, 1154.6, 1265.19, 6.02834818277686, 1195.3502712393404, 1.6366023386835615], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_100threads_ZARR", 3459, 68, 1.965886094246892, 3060.4252674183303, 16, 15243, 2430.0, 6024.0, 7815.0, 11046.000000000004, 28.487893263053863, 291.76784032181683, 8.373882687675012], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_5threads_ZARR", 3029, 0, 0.0, 178.27764938923815, 98, 1419, 155.0, 238.0, 272.0, 371.8999999999987, 25.20008652390223, 465.42886853878605, 7.25979055131949], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_100threads_ZARR", 3371, 89, 2.640166122812222, 3157.8736280035655, 56, 18136, 2540.0, 6339.200000000001, 7826.599999999991, 11612.639999999996, 27.58818233898028, 8769.625581509841, 7.328110933791636], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_250threads_ZARR", 1379, 1135, 82.30601885424221, 20454.265409717194, 6, 54103, 20522.0, 32322.0, 33787.0, 47977.60000000001, 9.952295378930579, 15.318719902696285, 2.983744805987976], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_5threads_ZARR", 1851, 0, 0.0, 291.8076715289029, 179, 685, 260.0, 396.0, 423.7999999999997, 474.48, 15.40728162612995, 5030.272819720863, 4.092559181940768], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_25threads_ZARR", 2245, 1, 0.044543429844097995, 1180.5425389754998, 239, 6442, 1057.0, 2325.0, 2702.199999999999, 3622.9399999999996, 18.565072854472984, 2512.970298273841, 4.949477430928832], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_100threads_ZARR", 1197, 181, 15.121136173767752, 9157.033416875525, 154, 40730, 7904.0, 17980.600000000002, 21670.499999999996, 29019.539999999986, 9.333915565883252, 1573.4911217658803, 2.5340122337065862], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_250threads_ZARR", 2432, 1757, 72.24506578947368, 12196.737253289462, 6, 50890, 10014.0, 28864.2, 30826.75, 32875.0, 16.6488677126975, 28.80756421314932, 4.910115282455708], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_5threads_ZARR", 776, 0, 0.0, 698.2835051546396, 395, 2941, 615.5, 1117.6000000000001, 1277.3, 1532.5300000000002, 6.431827600497306, 47.863169550352254, 1.9282920638209697], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_50threads_ZARR", 15567, 3, 0.01927153594141453, 339.45300957153074, 8, 5395, 246.0, 554.0, 1042.5999999999985, 1558.3199999999997, 128.4914817749604, 2372.722966294407, 37.016588987903624], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_5threads_ZARR", 2250, 0, 0.0, 240.1564444444444, 159, 812, 212.0, 331.9000000000001, 353.4499999999998, 410.4899999999998, 18.71459821837025, 195.40306760856546, 5.501068421610786], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_250threads_ZARR", 1955, 1601, 81.8925831202046, 15309.585677749363, 6, 62416, 15173.0, 30028.600000000006, 30890.2, 35540.28000000002, 13.419179473803428, 485.45263936984765, 3.643097552458352], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_250threads_ZARR", 2556, 982, 38.41940532081377, 10625.438967136159, 7, 32909, 8469.5, 23891.3, 26532.0, 32603.0, 20.453399697520148, 133.6169076761265, 6.012180965774965], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_25threads_ZARR", 2753, 2, 0.0726480203414457, 964.0944424264452, 23, 5966, 835.0, 1769.7999999999997, 2310.2999999999997, 3502.340000000001, 22.745862698602863, 237.32631931993754, 6.686039719022911], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 334,111; received: 295,317)", 3, 0.037965072133637055, 0.0020344362238151103], "isController": false}, {"data": ["502/Bad Gateway", 7789, 98.56998228296634, 5.2820745824319655], "isController": false}, {"data": ["504/Gateway Time-out", 105, 1.3287775246772968, 0.07120526783352886], "isController": false}, {"data": ["500/Internal Server Error", 1, 0.012655024044545684, 6.781454079383702E-4], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 334,114; received: 295,317)", 3, 0.037965072133637055, 0.0020344362238151103], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 334,112; received: 295,317)", 1, 0.012655024044545684, 6.781454079383702E-4], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 147461, 7902, "502/Bad Gateway", 7789, "504/Gateway Time-out", 105, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 334,111; received: 295,317)", 3, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 334,114; received: 295,317)", 3, "500/Internal Server Error", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_100threads_ZARR", 1270, 321, "502/Bad Gateway", 319, "504/Gateway Time-out", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_50threads_ZARR", 1880, 27, "502/Bad Gateway", 27, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_25threads_ZARR", 838, 6, "502/Bad Gateway", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_25threads_ZARR", 1804, 4, "502/Bad Gateway", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_50threads_ZARR", 1036, 110, "502/Bad Gateway", 110, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_50threads_ZARR", 2564, 22, "502/Bad Gateway", 22, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_50threads_ZARR", 3138, 13, "502/Bad Gateway", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_25threads_ZARR", 965, 3, "502/Bad Gateway", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_100threads_ZARR", 18744, 17, "502/Bad Gateway", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_100threads_ZARR", 2415, 124, "502/Bad Gateway", 124, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_250threads_ZARR", 2837, 799, "502/Bad Gateway", 798, "504/Gateway Time-out", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_100threads_ZARR", 2851, 90, "502/Bad Gateway", 90, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_250threads_ZARR", 3550, 475, "502/Bad Gateway", 468, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 334,111; received: 295,317)", 3, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 334,114; received: 295,317)", 3, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 334,112; received: 295,317)", 1, "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_50threads_ZARR", 3578, 24, "502/Bad Gateway", 24, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_25threads_ZARR", 2876, 4, "502/Bad Gateway", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_250threads_ZARR", 35211, 27, "502/Bad Gateway", 27, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_50threads_ZARR", 1254, 16, "502/Bad Gateway", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_5threads_ZARR", 726, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_100threads_ZARR", 3459, 68, "502/Bad Gateway", 67, "500/Internal Server Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_100threads_ZARR", 3371, 89, "502/Bad Gateway", 89, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_250threads_ZARR", 1379, 1135, "502/Bad Gateway", 1130, "504/Gateway Time-out", 5, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_25threads_ZARR", 2245, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_100threads_ZARR", 1197, 181, "502/Bad Gateway", 181, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_250threads_ZARR", 2432, 1757, "502/Bad Gateway", 1685, "504/Gateway Time-out", 72, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_50threads_ZARR", 15567, 3, "502/Bad Gateway", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_250threads_ZARR", 1955, 1601, "502/Bad Gateway", 1601, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_250threads_ZARR", 2556, 982, "502/Bad Gateway", 957, "504/Gateway Time-out", 25, "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_25threads_ZARR", 2753, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
