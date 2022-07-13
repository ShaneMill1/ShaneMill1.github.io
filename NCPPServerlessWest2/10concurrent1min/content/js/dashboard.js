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

    var data = {"OkPercent": 99.50939859985668, "KoPercent": 0.49060140014332176};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5615732319056281, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "NCPPServerlessWestGFSPosition-1time-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSTrajectory20waypoints"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSCorridor5waypoints"], "isController": false}, {"data": [0.49606299212598426, 500, 1500, "NCPPServerlessWestGFSAreaGlobe-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSPosition-halftime-fullzedd"], "isController": false}, {"data": [0.48717948717948717, 500, 1500, "NCPPServerlessWestGFSPosition-1time-1zedd"], "isController": false}, {"data": [0.5014903129657228, 500, 1500, "NCPPServerlessWestGFSPosition-fulltime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSCorridor10waypoints"], "isController": false}, {"data": [0.4992537313432836, 500, 1500, "NCPPServerlessWestGFSPosition-halftime-1zedd"], "isController": false}, {"data": [0.49065420560747663, 500, 1500, "NCPPServerlessWestGFSAreaTexas-halftime-1zedd"], "isController": false}, {"data": [0.4977744807121662, 500, 1500, "NCPPServerlessWestGFSAreaTexas-fulltime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSCorridor20waypoints"], "isController": false}, {"data": [0.5077247191011236, 500, 1500, "NCPPServerlessWestGFSCollectionMeta"], "isController": false}, {"data": [0.4960380348652932, 500, 1500, "NCPPServerlessWestGFSAreaUS-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestNWM-position-1month"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSTrajectory5waypoints"], "isController": false}, {"data": [0.4899536321483771, 500, 1500, "NCPPServerlessWestGFSAreaTexas-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestNWM-position-1hour"], "isController": false}, {"data": [0.003355704697986577, 500, 1500, "NCPPServerlessWestGFSPosition-fulltime-halfzedd"], "isController": false}, {"data": [0.5007418397626113, 500, 1500, "NCPPServerlessWestGFSAreaUS-1time-1zedd"], "isController": false}, {"data": [0.4923547400611621, 500, 1500, "NCPPServerlessWestGFSAreaHalfGlobe-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestCollections"], "isController": false}, {"data": [0.49830508474576274, 500, 1500, "NCPPServerlessWestGFSAreaTexas-1time-fullzedd"], "isController": false}, {"data": [0.9994756711409396, 500, 1500, "NCPPServerlessWestRoot"], "isController": false}, {"data": [0.48522550544323484, 500, 1500, "NCPPServerlessWestGFSAreaUS-halftime-1zedd"], "isController": false}, {"data": [0.4975, 500, 1500, "NCPPServerlessWestGFSAreaUS-1time-fullzedd"], "isController": false}, {"data": [0.4967585089141005, 500, 1500, "NCPPServerlessWestGFSAreaTexas-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSTrajectory10waypoints"], "isController": false}, {"data": [0.496742671009772, 500, 1500, "NCPPServerlessWestGFSAreaTexas-halftime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSInstances"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSPosition-fulltime-fullzedd"], "isController": false}, {"data": [0.486697965571205, 500, 1500, "NCPPServerlessWestGFSAreaUS-fulltime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSPosition-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestNWM-position-1day"], "isController": false}, {"data": [0.008503401360544218, 500, 1500, "NCPPServerlessWestGFSPosition-halftime-halfzedd"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 18141, 89, 0.49060140014332176, 1111.465464968862, 92, 33115, 800.0, 2032.6000000000022, 3022.0, 10106.319999999992, 8.177876592096117, 35.154651966064584, 4.675411907818457], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NCPPServerlessWestGFSPosition-1time-fullzedd", 181, 0, 0.0, 3137.790055248619, 2547, 4542, 3131.0, 3463.4, 3761.5000000000005, 4419.820000000001, 2.8781783198435287, 11.599845630853753, 1.2142314786839887], "isController": false}, {"data": ["NCPPServerlessWestGFSTrajectory20waypoints", 204, 0, 0.0, 2781.4068627450984, 2280, 3718, 2762.5, 3060.0, 3276.5, 3567.0499999999993, 3.266822534669955, 25.120078748038306, 5.688227128238799], "isController": false}, {"data": ["NCPPServerlessWestGFSCorridor5waypoints", 27, 9, 33.333333333333336, 22680.7037037037, 11579, 29671, 23789.0, 29549.8, 29628.6, 29671.0, 0.373614512848188, 3.631795762588734, 0.27984602671343767], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaGlobe-1time-1zedd", 635, 0, 0.0, 880.8393700787398, 545, 1821, 868.0, 1086.8, 1180.6, 1371.0799999999997, 10.447687523651261, 168.88727693261652, 5.43810297861926], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-halftime-fullzedd", 183, 0, 0.0, 3105.2950819672114, 2412, 5554, 3102.0, 3380.0, 3571.999999999998, 5053.359999999998, 2.9059150456530367, 11.711632220127035, 1.225932909884875], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-1time-1zedd", 624, 0, 0.0, 893.0544871794875, 423, 3732, 836.5, 1031.0, 1161.75, 3055.5, 10.313708637730985, 30.3368070477009, 4.099296304254405], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-fulltime-1zedd", 671, 0, 0.0, 833.7123695976151, 499, 1260, 813.0, 991.8000000000001, 1022.1999999999999, 1183.1999999999996, 11.06056110506709, 32.53360356295124, 4.720180862221014], "isController": false}, {"data": ["NCPPServerlessWestGFSCorridor10waypoints", 27, 5, 18.51851851851852, 25315.407407407405, 4788, 33115, 27813.0, 29315.0, 31601.39999999999, 33115.0, 0.34166835391779715, 6.10670393646234, 0.36339335992862926], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-halftime-1zedd", 670, 0, 0.0, 833.1820895522386, 557, 1600, 811.5, 996.0, 1048.4499999999998, 1331.1599999999999, 11.032983681064435, 32.45248715563094, 4.708411981079257], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-halftime-1zedd", 642, 0, 0.0, 867.8317757009349, 489, 3693, 820.5, 1062.9000000000003, 1200.8000000000002, 1725.3700000000022, 10.625796520961948, 35.75829571409656, 8.156128970191496], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-fulltime-1zedd", 674, 0, 0.0, 829.0400593471813, 489, 1920, 802.0, 999.0, 1069.25, 1314.25, 11.103972058847758, 37.367468471474, 8.52316605298275], "isController": false}, {"data": ["NCPPServerlessWestGFSCorridor20waypoints", 65, 65, 100.0, 9771.630769230767, 2906, 11320, 10228.0, 11000.2, 11167.0, 11320.0, 0.9504452470426531, 0.4761507927078916, 1.713400318399158], "isController": false}, {"data": ["NCPPServerlessWestGFSCollectionMeta", 712, 0, 0.0, 783.595505617978, 476, 7552, 662.0, 886.3000000000004, 1124.7, 6201.32, 11.764900279251144, 89.42013561856608, 2.814844305094268], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-1time-halfzedd", 631, 0, 0.0, 885.3565768621246, 573, 2903, 887.0, 1087.8000000000002, 1149.999999999999, 1426.239999999999, 10.388541323674678, 57.613795094871584, 11.717544168793216], "isController": false}, {"data": ["NCPPServerlessWestNWM-position-1month", 64, 0, 0.0, 9329.90625, 6908, 14797, 9282.5, 11175.5, 11631.0, 14797.0, 0.9597504648791314, 2.3478270649631097, 0.33272599124227703], "isController": false}, {"data": ["NCPPServerlessWestGFSTrajectory5waypoints", 96, 10, 10.416666666666666, 5907.916666666668, 1879, 29359, 2271.5, 29159.6, 29299.15, 29359.0, 1.5494617234533627, 5.744312839953516, 1.0592023500169472], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-1time-1zedd", 647, 0, 0.0, 863.4018547140654, 474, 4084, 805.0, 1002.2, 1097.6, 3255.0799999999945, 10.648803449751473, 35.83571942172224, 8.173788585453767], "isController": false}, {"data": ["NCPPServerlessWestNWM-position-1hour", 63, 0, 0.0, 9500.206349206348, 6944, 14991, 9147.0, 12121.2, 12643.6, 14991.0, 0.9384636010189034, 2.295753242726907, 0.32534626793135807], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-fulltime-halfzedd", 298, 0, 0.0, 1891.8859060402683, 1445, 2675, 1887.5, 2111.1, 2180.4500000000003, 2545.02, 4.824270288646776, 16.922635621893768, 2.0540838338378853], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-1time-1zedd", 674, 0, 0.0, 829.209198813057, 479, 4590, 803.0, 1000.5, 1048.75, 1276.5, 11.093554546053063, 55.24026819367634, 12.523583061755218], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaHalfGlobe-1time-1zedd", 654, 0, 0.0, 874.423547400612, 502, 4136, 812.0, 1083.5, 1284.0, 1864.1500000000021, 10.212207804375323, 114.39866769920833, 5.245723930763105], "isController": false}, {"data": ["NCPPServerlessWestCollections", 30, 0, 0.0, 23591.899999999998, 21713, 26596, 22648.5, 26459.5, 26578.4, 26596.0, 0.37858711289467706, 12.771029922578935, 0.06174223423184674], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-1time-fullzedd", 590, 0, 0.0, 949.3610169491527, 637, 1995, 927.0, 1101.8, 1133.4499999999998, 1390.3600000000001, 9.686104544260573, 43.14289338512937, 7.387546532292488], "isController": false}, {"data": ["NCPPServerlessWestRoot", 4768, 0, 0.0, 116.25104865771826, 92, 1516, 106.0, 121.0, 194.7500000000009, 317.3100000000004, 79.42430703624734, 127.0478661380597, 12.02223397521322], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-halftime-1zedd", 643, 0, 0.0, 870.8164852255051, 464, 2416, 816.0, 1174.8000000000002, 1328.7999999999995, 1782.7999999999997, 10.535802064558414, 52.46294406951499, 11.893932799442897], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-1time-fullzedd", 600, 0, 0.0, 932.7416666666661, 606, 1863, 916.0, 1094.9, 1150.6999999999996, 1336.5800000000004, 9.872805357642374, 59.911730949599324, 11.097264615865598], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-1time-halfzedd", 617, 0, 0.0, 907.1750405186384, 613, 2070, 898.0, 1081.0000000000002, 1121.0, 1302.2800000000002, 10.13552361396304, 39.8492363963039, 7.7699082392197125], "isController": false}, {"data": ["NCPPServerlessWestGFSTrajectory10waypoints", 185, 0, 0.0, 3068.902702702703, 2588, 3896, 3031.0, 3361.4, 3576.3999999999996, 3834.079999999999, 2.95385597956251, 15.579859517204214, 3.037510103983714], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-halftime-halfzedd", 614, 0, 0.0, 911.9820846905537, 599, 2589, 900.0, 1090.0, 1122.25, 1289.7, 10.087070806637096, 39.65873737062593, 7.732764241416133], "isController": false}, {"data": ["NCPPServerlessWestGFSInstances", 179, 0, 0.0, 3185.4189944134077, 2726, 6349, 2985.0, 3415.0, 5736.0, 6256.999999999999, 2.8599274632922715, 2.48567914290051, 0.6730883971224976], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-fulltime-fullzedd", 182, 0, 0.0, 3134.8351648351627, 2543, 5621, 3074.5, 3479.6000000000004, 3881.399999999999, 5169.479999999993, 2.899381890014656, 11.685301816494615, 1.2231767348499332], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-fulltime-1zedd", 639, 0, 0.0, 874.6651017214394, 445, 3273, 812.0, 1084.0, 1315.0, 2004.8000000000002, 10.51211607745077, 52.34499988175926, 11.86719354055966], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-1time-halfzedd", 293, 0, 0.0, 1935.552901023891, 1504, 3663, 1880.0, 2261.4, 2439.800000000001, 2965.9800000000014, 4.751865066493675, 16.668651678559844, 2.0232550478430102], "isController": false}, {"data": ["NCPPServerlessWestNWM-position-1day", 65, 0, 0.0, 8949.138461538463, 6277, 11838, 8746.0, 11190.0, 11384.199999999999, 11838.0, 0.9907328374588464, 2.423618904135166, 0.34346695048622117], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-halftime-halfzedd", 294, 0, 0.0, 1932.3027210884356, 1417, 3545, 1891.0, 2235.0, 2484.75, 3191.1500000000033, 4.724865003857032, 16.573940521342248, 2.0117589274235024], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Timeout", 23, 25.84269662921348, 0.12678463149771235], "isController": false}, {"data": ["502/Bad Gateway", 65, 73.03370786516854, 0.35830439336310016], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 1, 1.1235955056179776, 0.005512375282509233], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 18141, 89, "502/Bad Gateway", 65, "504/Gateway Timeout", 23, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessWestGFSCorridor5waypoints", 27, 9, "504/Gateway Timeout", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessWestGFSCorridor10waypoints", 27, 5, "504/Gateway Timeout", 4, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessWestGFSCorridor20waypoints", 65, 65, "502/Bad Gateway", 65, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessWestGFSTrajectory5waypoints", 96, 10, "504/Gateway Timeout", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
