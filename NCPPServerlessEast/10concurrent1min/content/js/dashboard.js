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

    var data = {"OkPercent": 14.23355025307303, "KoPercent": 85.76644974692697};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.10927783803326102, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "NCPPServerlessEastGFSPosition-fulltime-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSTrajectory20waypoints"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaHalfGlobe-halftime-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastNWM-position-1year"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastCollections"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaUS-fulltime-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaHalfGlobe-1time-halfzedd"], "isController": false}, {"data": [0.0661764705882353, 500, 1500, "NCPPServerlessEastGFSAreaHalfGlobe-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaGlobe-halftime-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaGlobe-1time-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaGlobe-fulltime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSCorridor20waypoints"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaUS-1time-fullzedd"], "isController": false}, {"data": [0.9999526739233318, 500, 1500, "NCPPServerlessEastRoot"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaUS-fulltime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaHalfGlobe-halftime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaTexas-fulltime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSPosition-halftime-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSPosition-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaTexas-halftime-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaHalfGlobe-fulltime-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaUS-1time-halfzedd"], "isController": false}, {"data": [0.4943502824858757, 500, 1500, "NCPPServerlessEastGFSAreaTexas-halftime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaHalfGlobe-fulltime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSCollectionMeta"], "isController": false}, {"data": [0.4, 500, 1500, "NCPPServerlessEastGFSPosition-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaGlobe-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSPosition-halftime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaTexas-halftime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaUS-halftime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSTrajectory5waypoints"], "isController": false}, {"data": [0.49122807017543857, 500, 1500, "NCPPServerlessEastGFSAreaUS-1time-1zedd"], "isController": false}, {"data": [0.4698544698544699, 500, 1500, "NCPPServerlessEastGFSPosition-fulltime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaUS-fulltime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastNWM-position-5year"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaGlobe-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaGlobe-halftime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSPosition-fulltime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastNWM-position-1day"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaHalfGlobe-halftime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSPosition-1time-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaUS-halftime-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaTexas-fulltime-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSTrajectory10waypoints"], "isController": false}, {"data": [0.4375, 500, 1500, "NCPPServerlessEastGFSPosition-halftime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSCorridor5waypoints"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaGlobe-halftime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaUS-halftime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaGlobe-fulltime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastNWM-position-1hour"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSInstances"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaTexas-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastNWM-position-1month"], "isController": false}, {"data": [0.4585152838427948, 500, 1500, "NCPPServerlessEastGFSAreaTexas-fulltime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSCorridor10waypoints"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaTexas-1time-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaHalfGlobe-1time-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaGlobe-fulltime-fullzedd"], "isController": false}, {"data": [0.49007936507936506, 500, 1500, "NCPPServerlessEastGFSAreaTexas-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaHalfGlobe-fulltime-1zedd"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 221280, 189784, 85.76644974692697, 329.19047360809503, 28, 29329, 38.0, 50.0, 64.0, 81.0, 51.96793807435868, 1462.5472496431723, 49.744986599520665], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NCPPServerlessEastGFSPosition-fulltime-fullzedd", 102, 0, 0.0, 11827.666666666672, 10477, 12895, 11965.0, 12483.5, 12863.0, 12895.0, 1.4544624905531236, 280.359008042322, 0.6136013632020989], "isController": false}, {"data": ["NCPPServerlessEastGFSTrajectory20waypoints", 27054, 27054, 100.0, 40.72115029200857, 29, 475, 38.0, 48.0, 54.0, 77.0, 450.5170604985762, 214.69953664385272, 782.2454429360043], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-halftime-fullzedd", 50, 50, 100.0, 26936.800000000003, 20189, 29163, 27026.0, 29150.0, 29158.6, 29163.0, 0.5857613139797795, 0.2951001432186413, 0.29802894978854017], "isController": false}, {"data": ["NCPPServerlessEastNWM-position-1year", 78, 78, 100.0, 16541.41025641025, 14562, 23170, 16604.0, 18319.0, 19566.0, 23170.0, 1.0286844708209695, 0.5153468100890207, 0.3566240108803165], "isController": false}, {"data": ["NCPPServerlessEastCollections", 60, 0, 0.0, 22772.09999999999, 21526, 24752, 22139.0, 24650.8, 24670.0, 24752.0, 0.7720715967727407, 26.044598796211705, 0.1259140201768044], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-fulltime-fullzedd", 78, 78, 100.0, 16044.974358974358, 13831, 29152, 15850.0, 17148.0, 19697.0, 29152.0, 1.0364484366902746, 0.5197294769921734, 1.1649923346001037], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-1time-halfzedd", 68, 68, 100.0, 18483.705882352933, 17148, 21188, 18122.0, 19868.3, 21130.0, 21188.0, 0.8704779948283367, 0.43608907358099286, 0.44628998758288746], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-1time-1zedd", 680, 0, 0.0, 1663.1176470588243, 1392, 4292, 1589.5, 1863.6999999999998, 1925.7999999999997, 2883.9799999999977, 11.041829046505585, 9726.686822064172, 5.671877029747987], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-halftime-fullzedd", 82, 82, 100.0, 15894.0, 12194, 29065, 14885.0, 22600.60000000002, 28923.249999999996, 29065.0, 0.9689349986411278, 0.48605992774344486, 0.49960710867433145], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-1time-fullzedd", 44, 44, 100.0, 29099.545454545456, 29042, 29177, 29083.5, 29162.0, 29175.0, 29177.0, 0.4983407518149796, 0.254036984811933, 0.25695695015459885], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-fulltime-1zedd", 134, 134, 100.0, 9169.298507462687, 5631, 29063, 7447.0, 15683.0, 19847.5, 29063.0, 1.7179927690453602, 0.8613502109028436, 0.8942286581066181], "isController": false}, {"data": ["NCPPServerlessEastGFSCorridor20waypoints", 26866, 26866, 100.0, 41.00982654656442, 29, 281, 38.0, 50.0, 64.0, 81.0, 447.75920401326647, 213.3852456625723, 805.0045845590074], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-1time-fullzedd", 120, 0, 0.0, 10347.38333333333, 9378, 11736, 10185.0, 11394.300000000001, 11505.199999999999, 11736.0, 1.6947716295229218, 2932.4762599567835, 1.9049630327938312], "isController": false}, {"data": ["NCPPServerlessEastRoot", 21130, 0, 0.0, 52.39148130620004, 38, 764, 49.0, 61.0, 68.0, 90.0, 352.4016010673783, 563.7049048323883, 53.34203922406604], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-fulltime-1zedd", 276, 0, 0.0, 4170.04347826087, 3383, 7431, 3936.5, 5157.0, 5807.0, 6957.450000000012, 4.331790002354233, 23399.212803107588, 4.890184807345209], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-halftime-1zedd", 60, 60, 100.0, 22267.766666666666, 21206, 23674, 22186.0, 23318.0, 23550.0, 23674.0, 0.7879185817465528, 0.39472874261326324, 0.40473161523309253], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-fulltime-halfzedd", 112, 112, 100.0, 10726.178571428574, 9045, 12348, 10649.5, 11571.0, 11871.0, 12348.0, 1.6086869093102756, 0.805914437965011, 1.233221898250553], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-halftime-fullzedd", 106, 0, 0.0, 11413.716981132075, 10475, 12562, 11470.0, 12003.7, 12228.0, 12562.0, 1.5264757131953746, 151.29848878004347, 0.6439819415042985], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-1time-halfzedd", 180, 0, 0.0, 6397.599999999999, 5732, 7520, 6366.5, 6875.7, 7137.0, 7520.0, 2.7480076944215446, 11.84273237840066, 1.1700501511404233], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-halftime-fullzedd", 82, 82, 100.0, 15167.951219512195, 13344, 18627, 14790.0, 17510.2, 17792.0, 18627.0, 1.1042878689937514, 0.5532223406189399, 0.8422351813321483], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-fulltime-fullzedd", 70, 70, 100.0, 18615.857142857145, 12120, 29164, 16873.0, 29067.0, 29157.0, 29164.0, 0.8304859529233105, 0.41730528811930523, 0.423353190845672], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-1time-halfzedd", 210, 0, 0.0, 5562.885714285714, 4895, 6525, 5470.0, 6131.0, 6236.349999999999, 6514.769999999999, 3.2165668509810525, 2852.432008142892, 3.6280612430499177], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-halftime-1zedd", 1062, 0, 0.0, 1056.8041431261788, 889, 3052, 1006.0, 1281.7, 1327.0, 1564.0999999999967, 17.386748743471784, 4042.5888753253876, 13.345688000360177], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-fulltime-halfzedd", 78, 78, 100.0, 15855.512820512822, 7961, 29050, 15252.0, 18325.0, 29039.0, 29050.0, 1.0873201739712277, 0.5454842669649826, 0.5585257924891268], "isController": false}, {"data": ["NCPPServerlessEastGFSCollectionMeta", 20746, 20746, 100.0, 53.35775571194419, 37, 512, 51.0, 63.0, 70.0, 95.0, 345.51904468464267, 173.0969432843962, 82.66813080833735], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-1time-1zedd", 410, 12, 2.926829268292683, 2737.043902439024, 1060, 29205, 1165.0, 1914.0, 15497.299999999794, 29143.23, 6.73389613375817, 20.07475420252603, 2.676460670351148], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-1time-halfzedd", 56, 56, 100.0, 26639.714285714286, 24737, 29062, 26329.0, 28356.0, 29048.4, 29062.0, 0.6302899333693499, 0.3161561740275527, 0.32745531694579505], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-halftime-halfzedd", 186, 0, 0.0, 6363.408602150539, 5738, 7787, 6309.0, 6909.500000000001, 7090.0, 7787.0, 2.812216510432416, 151.0824871957212, 1.1973890610825522], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-halftime-halfzedd", 142, 0, 0.0, 8449.478873239439, 7369, 11605, 8357.0, 9075.600000000002, 9481.0, 11605.0, 2.105512885145755, 10039.52956799917, 1.6140894676166189], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-halftime-halfzedd", 58, 58, 100.0, 23628.724137931036, 15675, 29062, 25886.0, 27920.0, 28268.749999999996, 29062.0, 0.6797379493009247, 0.34073879018364644, 0.7666966127368828], "isController": false}, {"data": ["NCPPServerlessEastGFSTrajectory5waypoints", 28788, 28788, 100.0, 38.348478532721856, 28, 294, 36.0, 45.0, 52.0, 76.0, 479.61614714359496, 228.56707012311946, 325.52072486796726], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-1time-1zedd", 1140, 0, 0.0, 981.4649122807018, 781, 2571, 923.0, 1204.9, 1273.0, 1949.0, 18.730591656671542, 877.9050259394049, 21.145081987414358], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-fulltime-1zedd", 962, 0, 0.0, 1163.3596673596687, 998, 2050, 1120.0, 1237.1000000000001, 1690.85, 1849.0, 15.785759997374509, 221.4631134006662, 6.7366964051295515], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-fulltime-halfzedd", 108, 108, 100.0, 11593.092592592595, 8488, 29047, 11393.5, 12638.500000000002, 15958.0, 29047.0, 1.3942860093727003, 0.6992106307853186, 1.572656582837372], "isController": false}, {"data": ["NCPPServerlessEastNWM-position-5year", 80, 80, 100.0, 16390.749999999996, 14612, 19630, 16476.5, 18362.9, 19378.25, 19630.0, 1.0391499753201883, 0.5205897825578676, 0.3602521887096355], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-1time-1zedd", 478, 0, 0.0, 2381.4895397489504, 1991, 5110, 2267.0, 2746.0, 3013.0, 4484.849999999996, 7.699618240685556, 15391.905301893896, 4.007711447544337], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-halftime-halfzedd", 84, 84, 100.0, 14654.690476190475, 11945, 29056, 13792.5, 18180.0, 21604.75, 29056.0, 1.1794108561961192, 0.5911040040296538, 0.61274079638314], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-fulltime-halfzedd", 182, 0, 0.0, 6446.912087912091, 5855, 7278, 6430.0, 6973.400000000001, 7111.0, 7278.0, 2.7733333333333334, 286.11645833333336, 1.1808333333333334], "isController": false}, {"data": ["NCPPServerlessEastNWM-position-1day", 80, 80, 100.0, 15801.650000000001, 13846, 23098, 15598.0, 17913.9, 18145.55, 23098.0, 1.0354780672801873, 0.518750242690172, 0.3589792127777994], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-halftime-halfzedd", 54, 54, 100.0, 25423.407407407412, 15966, 29134, 27237.0, 29011.0, 29071.0, 29134.0, 0.6342569210350134, 0.31816077972492046, 0.325180550335334], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-1time-fullzedd", 108, 0, 0.0, 11170.814814814818, 10120, 12232, 11116.5, 11934.1, 12212.0, 12232.0, 1.541777898328313, 8.517419502776628, 0.650437550857257], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-halftime-fullzedd", 80, 80, 100.0, 15561.949999999999, 12628, 29257, 15214.5, 16771.7, 17323.850000000002, 29257.0, 1.0575575707902598, 0.5300439299500304, 1.1887194960738174], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-fulltime-fullzedd", 64, 64, 100.0, 19472.999999999996, 18189, 21501, 19240.5, 20890.5, 21414.0, 21501.0, 0.8012720193306875, 0.40141850187172134, 0.6111264131809246], "isController": false}, {"data": ["NCPPServerlessEastGFSTrajectory10waypoints", 28094, 28094, 100.0, 39.27208656652673, 29, 333, 37.0, 46.0, 53.0, 77.0, 467.97594656272383, 223.01978703379808, 478.94413281028767], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-halftime-1zedd", 896, 0, 0.0, 1253.3816964285706, 1022, 2757, 1165.5, 1716.0, 1813.15, 2145.7399999999957, 14.589507278470707, 124.46673396945322, 6.226186211612987], "isController": false}, {"data": ["NCPPServerlessEastGFSCorridor5waypoints", 28226, 28226, 100.0, 39.129951108906845, 28, 510, 37.0, 46.0, 52.0, 75.9900000000016, 470.1434115628695, 224.05271957293002, 349.852812120026], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-halftime-1zedd", 68, 68, 100.0, 19166.588235294115, 13629, 29142, 17305.0, 29039.6, 29064.0, 29142.0, 0.8570168252567899, 0.43023150482071965, 0.4460839529901065], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-halftime-1zedd", 418, 0, 0.0, 2742.2200956937804, 2046, 5441, 2582.0, 3483.0, 3817.099999999998, 5039.610000000001, 6.670390169951328, 18170.618348809145, 7.530245152796617], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-fulltime-halfzedd", 88, 88, 100.0, 14050.86363636364, 8673, 29150, 11097.5, 29062.2, 29096.35, 29150.0, 1.070051921837571, 0.537353399846788, 0.5559254125171755], "isController": false}, {"data": ["NCPPServerlessEastNWM-position-1hour", 62, 62, 100.0, 19442.741935483875, 14760, 25974, 19654.0, 23408.9, 23957.0, 25974.0, 0.8242050409443794, 0.41290740820748695, 0.28573514603052214], "isController": false}, {"data": ["NCPPServerlessEastGFSInstances", 388, 0, 0.0, 2913.649484536084, 2624, 5382, 2736.0, 3148.8, 4783.0, 5162.0, 6.204624684171811, 5.392691375891515, 1.4602681141459046], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-1time-halfzedd", 226, 0, 0.0, 5181.442477876108, 4639, 6899, 5101.0, 5699.8, 5934.0, 6729.979999999993, 3.4811003973999566, 268.9795964291766, 2.668617003866178], "isController": false}, {"data": ["NCPPServerlessEastNWM-position-1month", 80, 80, 100.0, 16223.400000000005, 13727, 24154, 15957.5, 18213.4, 21513.200000000008, 24154.0, 1.071983705847671, 0.5370387120115774, 0.37163497614836255], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-fulltime-1zedd", 916, 0, 0.0, 1224.0196506550215, 990, 2600, 1149.0, 1464.0, 1625.0, 2311.0, 14.986175416782554, 6868.497870073459, 11.503060427335047], "isController": false}, {"data": ["NCPPServerlessEastGFSCorridor10waypoints", 27886, 27886, 100.0, 39.607473284085195, 28, 716, 37.0, 46.0, 54.0, 76.0, 464.4570286475683, 221.34280271485676, 510.7213029855097], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-1time-fullzedd", 122, 0, 0.0, 9690.14754098361, 8657, 11191, 9537.0, 10753.800000000001, 10928.7, 11191.0, 1.7789961795327949, 263.0794838541515, 1.356832047085071], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-1time-fullzedd", 44, 44, 100.0, 29093.545454545456, 29041, 29153, 29086.5, 29144.5, 29151.25, 29153.0, 0.4987248512326438, 0.2542327854916407, 0.25374574950410883], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-fulltime-fullzedd", 108, 108, 100.0, 11127.0925925926, 6488, 29329, 8461.0, 28042.10000000001, 29063.0, 29329.0, 1.5691060454169026, 0.7876460594371559, 0.8090703046680906], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-1time-1zedd", 1008, 0, 0.0, 1109.2658730158691, 747, 17940, 849.5, 1121.2, 1199.8499999999997, 11739.839999999967, 16.566958122411414, 114.72294926369075, 12.716434652554073], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-fulltime-1zedd", 62, 62, 100.0, 22880.67741935484, 3121, 29276, 26801.0, 29150.5, 29162.0, 29276.0, 0.7012940005429373, 0.3537178125848339, 0.3609198616075468], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 22644, 11.931458921721536, 10.233188720173535], "isController": false}, {"data": ["504/Gateway Timeout", 216, 0.11381359861737554, 0.09761388286334056], "isController": false}, {"data": ["500/Internal Server Error", 10, 0.005269148084137756, 0.004519161243673174], "isController": false}, {"data": ["403/Forbidden", 166914, 87.94945833157695, 75.43112798264642], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 221280, 189784, "403/Forbidden", 166914, "502/Bad Gateway", 22644, "504/Gateway Timeout", 216, "500/Internal Server Error", 10, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSTrajectory20waypoints", 27054, 27054, "403/Forbidden", 27054, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-halftime-fullzedd", 50, 50, "502/Bad Gateway", 34, "504/Gateway Timeout", 16, "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessEastNWM-position-1year", 78, 78, "502/Bad Gateway", 78, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-fulltime-fullzedd", 78, 78, "502/Bad Gateway", 74, "504/Gateway Timeout", 2, "500/Internal Server Error", 2, "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-1time-halfzedd", 68, 68, "502/Bad Gateway", 68, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-halftime-fullzedd", 82, 82, "502/Bad Gateway", 76, "504/Gateway Timeout", 4, "500/Internal Server Error", 2, "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-1time-fullzedd", 44, 44, "504/Gateway Timeout", 44, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-fulltime-1zedd", 134, 134, "502/Bad Gateway", 128, "504/Gateway Timeout", 6, "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessEastGFSCorridor20waypoints", 26866, 26866, "403/Forbidden", 26866, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-halftime-1zedd", 60, 60, "502/Bad Gateway", 60, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-fulltime-halfzedd", 112, 112, "502/Bad Gateway", 112, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-halftime-fullzedd", 82, 82, "502/Bad Gateway", 82, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-fulltime-fullzedd", 70, 70, "502/Bad Gateway", 58, "504/Gateway Timeout", 12, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-fulltime-halfzedd", 78, 78, "502/Bad Gateway", 72, "504/Gateway Timeout", 4, "500/Internal Server Error", 2, "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessEastGFSCollectionMeta", 20746, 20746, "502/Bad Gateway", 20746, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-1time-1zedd", 410, 12, "504/Gateway Timeout", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-1time-halfzedd", 56, 56, "502/Bad Gateway", 52, "504/Gateway Timeout", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-halftime-halfzedd", 58, 58, "502/Bad Gateway", 56, "504/Gateway Timeout", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessEastGFSTrajectory5waypoints", 28788, 28788, "403/Forbidden", 28788, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-fulltime-halfzedd", 108, 108, "502/Bad Gateway", 102, "504/Gateway Timeout", 4, "500/Internal Server Error", 2, "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessEastNWM-position-5year", 80, 80, "502/Bad Gateway", 80, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-halftime-halfzedd", 84, 84, "502/Bad Gateway", 82, "504/Gateway Timeout", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastNWM-position-1day", 80, 80, "502/Bad Gateway", 80, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-halftime-halfzedd", 54, 54, "502/Bad Gateway", 50, "504/Gateway Timeout", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-halftime-fullzedd", 80, 80, "502/Bad Gateway", 78, "504/Gateway Timeout", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-fulltime-fullzedd", 64, 64, "502/Bad Gateway", 64, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessEastGFSTrajectory10waypoints", 28094, 28094, "403/Forbidden", 28094, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSCorridor5waypoints", 28226, 28226, "403/Forbidden", 28226, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-halftime-1zedd", 68, 68, "502/Bad Gateway", 60, "504/Gateway Timeout", 8, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-fulltime-halfzedd", 88, 88, "502/Bad Gateway", 76, "504/Gateway Timeout", 12, "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessEastNWM-position-1hour", 62, 62, "502/Bad Gateway", 62, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastNWM-position-1month", 80, 80, "502/Bad Gateway", 80, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSCorridor10waypoints", 27886, 27886, "403/Forbidden", 27886, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-1time-fullzedd", 44, 44, "504/Gateway Timeout", 44, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-fulltime-fullzedd", 108, 108, "502/Bad Gateway", 96, "504/Gateway Timeout", 10, "500/Internal Server Error", 2, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-fulltime-1zedd", 62, 62, "502/Bad Gateway", 38, "504/Gateway Timeout", 24, "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
