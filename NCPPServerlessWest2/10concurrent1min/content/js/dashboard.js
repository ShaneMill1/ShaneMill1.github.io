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

    var data = {"OkPercent": 99.43763962714736, "KoPercent": 0.5623603728526307};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.39862106155149835, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "NCPPServerlessWestGFSPosition-1time-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSTrajectory20waypoints"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSCorridor5waypoints"], "isController": false}, {"data": [0.49837662337662336, 500, 1500, "NCPPServerlessWestGFSAreaGlobe-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSPosition-halftime-fullzedd"], "isController": false}, {"data": [0.4906937394247039, 500, 1500, "NCPPServerlessWestGFSPosition-1time-1zedd"], "isController": false}, {"data": [0.4909240924092409, 500, 1500, "NCPPServerlessWestGFSPosition-fulltime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSCorridor10waypoints"], "isController": false}, {"data": [0.4975328947368421, 500, 1500, "NCPPServerlessWestGFSPosition-halftime-1zedd"], "isController": false}, {"data": [0.4959083469721768, 500, 1500, "NCPPServerlessWestGFSAreaTexas-halftime-1zedd"], "isController": false}, {"data": [0.4984350547730829, 500, 1500, "NCPPServerlessWestGFSAreaTexas-fulltime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSCorridor20waypoints"], "isController": false}, {"data": [0.5048275862068966, 500, 1500, "NCPPServerlessWestGFSCollectionMeta"], "isController": false}, {"data": [0.494077834179357, 500, 1500, "NCPPServerlessWestGFSAreaUS-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestNWM-position-1month"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSTrajectory5waypoints"], "isController": false}, {"data": [0.4900826446280992, 500, 1500, "NCPPServerlessWestGFSAreaTexas-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestNWM-position-1hour"], "isController": false}, {"data": [0.0018050541516245488, 500, 1500, "NCPPServerlessWestGFSPosition-fulltime-halfzedd"], "isController": false}, {"data": [0.49921996879875197, 500, 1500, "NCPPServerlessWestGFSAreaUS-1time-1zedd"], "isController": false}, {"data": [0.49761146496815284, 500, 1500, "NCPPServerlessWestGFSAreaHalfGlobe-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestCollections"], "isController": false}, {"data": [0.49012567324955114, 500, 1500, "NCPPServerlessWestGFSAreaTexas-1time-fullzedd"], "isController": false}, {"data": [0.49603174603174605, 500, 1500, "NCPPServerlessWestGFSAreaUS-halftime-1zedd"], "isController": false}, {"data": [0.4981481481481482, 500, 1500, "NCPPServerlessWestGFSAreaUS-1time-fullzedd"], "isController": false}, {"data": [0.49834162520729686, 500, 1500, "NCPPServerlessWestGFSAreaTexas-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSTrajectory10waypoints"], "isController": false}, {"data": [0.4991408934707904, 500, 1500, "NCPPServerlessWestGFSAreaTexas-halftime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSInstances"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSPosition-fulltime-fullzedd"], "isController": false}, {"data": [0.49922600619195046, 500, 1500, "NCPPServerlessWestGFSAreaUS-fulltime-1zedd"], "isController": false}, {"data": [0.001718213058419244, 500, 1500, "NCPPServerlessWestGFSPosition-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestNWM-position-1day"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSPosition-halftime-halfzedd"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 25962, 146, 0.5623603728526307, 1510.6662814883232, 481, 29101, 926.0, 2549.4000000000087, 3200.9500000000007, 10605.010000000158, 11.968511777657303, 63.509811307332406, 8.647223611948597], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NCPPServerlessWestGFSPosition-1time-fullzedd", 374, 0, 0.0, 3100.262032085561, 2551, 5035, 2992.0, 3421.0, 4382.5, 4971.0, 5.796023370062144, 23.359559031490694, 2.4451973592449674], "isController": false}, {"data": ["NCPPServerlessWestGFSTrajectory20waypoints", 422, 0, 0.0, 2694.9146919431287, 2281, 3800, 2657.0, 2989.4, 3128.0, 3532.549999999998, 6.750811857113148, 51.91005133096575, 11.7545874426101], "isController": false}, {"data": ["NCPPServerlessWestGFSCorridor5waypoints", 68, 0, 0.0, 18929.44117647058, 13843, 26505, 17545.5, 25773.4, 26224.0, 26505.0, 0.9288094847839152, 13.306284318144566, 0.6957000730754521], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaGlobe-1time-1zedd", 1232, 0, 0.0, 908.7305194805191, 519, 1665, 902.5, 1086.0, 1160.0, 1310.3700000000008, 20.301891767187396, 328.18087345923146, 10.567293273350472], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-halftime-fullzedd", 366, 0, 0.0, 3122.7322404371607, 2516, 5498, 3080.0, 3462.5, 3534.7499999999995, 4081.0, 5.807772259159936, 23.406910267141658, 2.450153921833098], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-1time-1zedd", 1182, 0, 0.0, 946.191201353638, 584, 4077, 898.0, 1061.7, 1117.0, 3609.0, 19.425453589271626, 57.1381505965685, 7.720858994954641], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-fulltime-1zedd", 1212, 0, 0.0, 926.2013201320124, 532, 1994, 902.0, 1099.0, 1187.0, 1703.6099999999997, 19.82173521956006, 58.30377586065909, 8.459080362253658], "isController": false}, {"data": ["NCPPServerlessWestGFSCorridor10waypoints", 64, 0, 0.0, 21802.156250000004, 12938, 25199, 22605.5, 24625.0, 24725.0, 25199.0, 0.8266384231872078, 17.946287876830876, 0.9130156802975898], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-halftime-1zedd", 1216, 0, 0.0, 918.8947368421051, 526, 1958, 905.5, 1079.0, 1103.1499999999999, 1270.7799999999952, 19.99079371342145, 58.801045571118564, 8.53122739527849], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-halftime-1zedd", 1222, 0, 0.0, 914.6219312602302, 544, 2862, 899.0, 1091.7, 1174.0, 1463.5099999999989, 20.09868421052632, 67.6367829975329, 15.427310341282896], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-fulltime-1zedd", 1278, 0, 0.0, 875.6729264475752, 512, 1991, 892.0, 1017.0, 1101.0, 1298.63, 21.01628021706956, 70.72470862111494, 16.131636963492845], "isController": false}, {"data": ["NCPPServerlessWestGFSCorridor20waypoints", 144, 144, 100.0, 7933.6805555555575, 3293, 11804, 8028.5, 10661.0, 10902.0, 11804.0, 2.3083211772438004, 1.1564148085215522, 4.161289934757867], "isController": false}, {"data": ["NCPPServerlessWestGFSCollectionMeta", 1450, 0, 0.0, 768.2496551724145, 481, 7263, 687.0, 868.0, 912.2500000000002, 6331.4000000000015, 23.948733194595846, 182.02440473978461, 5.729921516285138], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-1time-halfzedd", 1182, 0, 0.0, 945.4906937394253, 596, 2072, 913.0, 1103.0, 1191.0, 1588.0, 19.45903231648091, 107.91781691923349, 21.948420239780713], "isController": false}, {"data": ["NCPPServerlessWestNWM-position-1month", 130, 0, 0.0, 9021.230769230768, 6396, 10832, 9077.0, 9942.0, 10390.25, 10832.0, 1.9807712818637533, 4.845539122137405, 0.6866931690055005], "isController": false}, {"data": ["NCPPServerlessWestGFSTrajectory5waypoints", 440, 0, 0.0, 2592.8909090909096, 1880, 8278, 2231.0, 2968.400000000001, 5477.249999999999, 7624.359999999997, 7.069068007647447, 28.83544635541346, 4.832370708352746], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-1time-1zedd", 1210, 0, 0.0, 923.2082644628093, 497, 4204, 893.0, 1018.0, 1108.45, 3466.0600000000254, 19.9203187250996, 67.03654133466135, 15.290400896414344], "isController": false}, {"data": ["NCPPServerlessWestNWM-position-1hour", 114, 0, 0.0, 10546.982456140355, 7542, 17272, 9938.0, 14552.0, 16316.0, 17272.0, 1.7097093494106004, 4.182443281517142, 0.5927215029694952], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-fulltime-halfzedd", 554, 0, 0.0, 2031.8086642599283, 1459, 3445, 1983.0, 2256.0, 2462.0, 3433.0, 9.02368309606802, 31.653388360426103, 3.8421150682477117], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-1time-1zedd", 1282, 0, 0.0, 871.4336973478946, 500, 1902, 892.0, 1008.0, 1091.85, 1229.5800000000054, 21.110525622447636, 105.11969741099657, 23.831804315966274], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaHalfGlobe-1time-1zedd", 1256, 0, 0.0, 889.6847133757958, 495, 2077, 893.5, 1083.0, 1105.0, 1318.4400000000005, 20.716500626773108, 232.06931512667416, 10.641483720393218], "isController": false}, {"data": ["NCPPServerlessWestCollections", 60, 0, 0.0, 23437.53333333334, 21741, 26323, 22498.0, 25872.4, 25877.0, 26323.0, 0.7501312729727703, 25.304477111619534, 0.12233586190083263], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-1time-fullzedd", 1114, 0, 0.0, 1006.4021543985642, 674, 1730, 997.0, 1174.0, 1239.0, 1662.0, 18.289879818743024, 81.46498227860052, 13.949605603943652], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-halftime-1zedd", 1260, 0, 0.0, 885.3222222222217, 492, 2808, 879.5, 1057.9, 1111.0, 1633.6300000000117, 20.795854032910263, 103.55279268926704, 23.476569591840104], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-1time-fullzedd", 1080, 0, 0.0, 1035.9833333333336, 654, 2444, 1019.0, 1199.0, 1277.5500000000004, 1399.0800000000017, 17.76461880088823, 107.80209104367135, 19.967847890451516], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-1time-halfzedd", 1206, 0, 0.0, 928.5174129353226, 570, 1717, 911.0, 1096.3, 1173.2999999999997, 1383.7300000000039, 19.808485127211206, 77.87984484585188, 15.185215649278122], "isController": false}, {"data": ["NCPPServerlessWestGFSTrajectory10waypoints", 386, 0, 0.0, 2955.4507772020706, 2619, 3819, 2931.0, 3162.3, 3419.0, 3706.0, 6.155121826763618, 32.46466111948271, 6.329436800373134], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-halftime-halfzedd", 1164, 2, 0.1718213058419244, 990.3109965635731, 579, 29101, 917.5, 1103.0, 1174.25, 1218.0, 15.120810600155885, 59.360690276695244, 11.591637032346064], "isController": false}, {"data": ["NCPPServerlessWestGFSInstances", 358, 0, 0.0, 3187.284916201118, 2748, 6063, 2982.0, 3471.0, 5698.0, 6021.0, 5.703724946627155, 4.957339064939617, 1.34238057825893], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-fulltime-fullzedd", 356, 0, 0.0, 3190.6123595505624, 2602, 4850, 3171.0, 3603.0, 3727.0, 4360.0, 5.684086155418243, 22.908421448643644, 2.3979738468170715], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-fulltime-1zedd", 1292, 0, 0.0, 867.0294117647054, 484, 2106, 863.5, 1016.0, 1101.0, 1392.979999999999, 21.209534440869394, 105.61271104882134, 23.943575989887716], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-1time-halfzedd", 582, 0, 0.0, 1941.8109965635754, 1486, 3243, 1921.0, 2152.4, 2265.0, 2916.0, 9.422507164019622, 33.05238841128758, 4.01192687843023], "isController": false}, {"data": ["NCPPServerlessWestNWM-position-1day", 132, 0, 0.0, 9001.969696969696, 6227, 12455, 9059.0, 10378.0, 10657.5, 12455.0, 1.9091145758005263, 4.670246105840155, 0.6618512445402216], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-halftime-halfzedd", 574, 0, 0.0, 1960.2334494773513, 1551, 2849, 1952.0, 2170.0, 2262.25, 2552.0, 9.345490068381634, 32.78222688049495, 3.979134443178118], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Timeout", 2, 1.36986301369863, 0.007703566751405901], "isController": false}, {"data": ["502/Bad Gateway", 144, 98.63013698630137, 0.5546568061012249], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 25962, 146, "502/Bad Gateway", 144, "504/Gateway Timeout", 2, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessWestGFSCorridor20waypoints", 144, 144, "502/Bad Gateway", 144, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-halftime-halfzedd", 1164, 2, "504/Gateway Timeout", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
