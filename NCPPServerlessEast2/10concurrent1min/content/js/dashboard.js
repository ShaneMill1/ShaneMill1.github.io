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

    var data = {"OkPercent": 98.28753215107622, "KoPercent": 1.712467848923785};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5528969811831596, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "NCPPServerlessEastGFSPosition-fulltime-fullzedd"], "isController": false}, {"data": [0.7080952380952381, 500, 1500, "NCPPServerlessEastGFSAreaUS-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSTrajectory20waypoints"], "isController": false}, {"data": [0.9682539682539683, 500, 1500, "NCPPServerlessEastGFSPosition-fulltime-1zedd"], "isController": false}, {"data": [0.18347338935574228, 500, 1500, "NCPPServerlessEastGFSAreaGlobe-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastCollections"], "isController": false}, {"data": [0.01488095238095238, 500, 1500, "NCPPServerlessEastGFSPosition-fulltime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastNWM-position-1day"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSPosition-1time-fullzedd"], "isController": false}, {"data": [0.4973913043478261, 500, 1500, "NCPPServerlessEastGFSAreaHalfGlobe-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSTrajectory10waypoints"], "isController": false}, {"data": [0.9526584122359796, 500, 1500, "NCPPServerlessEastGFSPosition-halftime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSCorridor20waypoints"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSCorridor5waypoints"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaUS-1time-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaUS-fulltime-1zedd"], "isController": false}, {"data": [0.03308823529411765, 500, 1500, "NCPPServerlessEastGFSAreaUS-halftime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastNWM-position-1hour"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSInstances"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSPosition-halftime-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaTexas-1time-halfzedd"], "isController": false}, {"data": [0.07848837209302326, 500, 1500, "NCPPServerlessEastGFSPosition-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastNWM-position-1month"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaUS-1time-halfzedd"], "isController": false}, {"data": [0.5005417118093174, 500, 1500, "NCPPServerlessEastGFSAreaTexas-halftime-1zedd"], "isController": false}, {"data": [0.9714867617107943, 500, 1500, "NCPPServerlessEastGFSCollectionMeta"], "isController": false}, {"data": [0.4988009592326139, 500, 1500, "NCPPServerlessEastGFSAreaTexas-fulltime-1zedd"], "isController": false}, {"data": [0.9273232724384433, 500, 1500, "NCPPServerlessEastGFSPosition-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSCorridor10waypoints"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaTexas-1time-fullzedd"], "isController": false}, {"data": [0.03654970760233918, 500, 1500, "NCPPServerlessEastGFSPosition-halftime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaTexas-halftime-halfzedd"], "isController": false}, {"data": [0.8437204910292729, 500, 1500, "NCPPServerlessEastGFSAreaTexas-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSTrajectory5waypoints"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 29548, 506, 1.712467848923785, 1313.6808582645144, 261, 25867, 700.5, 3393.9000000000015, 4792.9000000000015, 6995.910000000014, 13.841777076559344, 4338.981539300425, 8.747113759001863], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NCPPServerlessEastGFSPosition-fulltime-fullzedd", 396, 0, 0.0, 2884.89898989899, 2556, 3499, 2838.0, 3161.0, 3232.0, 3439.0, 6.2942064690455375, 1213.2574703965668, 2.655368354128586], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-1time-1zedd", 2100, 0, 0.0, 531.0180952380955, 428, 2490, 508.0, 636.9000000000001, 666.0, 741.0, 34.72222222222222, 1627.4346245659724, 39.19813368055556], "isController": false}, {"data": ["NCPPServerlessEastGFSTrajectory20waypoints", 438, 0, 0.0, 2612.721461187215, 2178, 3498, 2587.0, 2814.0, 3150.0, 3408.2300000000005, 6.977744499848656, 53.66185345342594, 12.149725042216946], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-fulltime-1zedd", 2772, 0, 0.0, 401.18470418470406, 323, 1563, 383.0, 446.0, 514.3499999999999, 590.0, 45.92141011198728, 644.2450953796965, 19.597320526307072], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-1time-1zedd", 714, 0, 0.0, 1577.0756302521, 1194, 2872, 1546.0, 1801.0, 1921.0, 2245.0, 11.63378032685383, 23256.483567947223, 6.055473549036221], "isController": false}, {"data": ["NCPPServerlessEastCollections", 60, 0, 0.0, 23003.666666666668, 21186, 25867, 22141.0, 25408.7, 25778.0, 25867.0, 0.7687379884689303, 25.932144859064703, 0.12537035554131967], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-fulltime-halfzedd", 672, 0, 0.0, 1670.2678571428576, 1387, 2139, 1658.0, 1818.0, 1869.0, 1968.3199999999997, 10.972324271369091, 1131.9816923830517, 4.671809943668871], "isController": false}, {"data": ["NCPPServerlessEastNWM-position-1day", 176, 0, 0.0, 6583.045454545453, 6001, 8136, 6545.5, 6935.0, 7090.0, 8136.0, 2.686243685037928, 11.552946473542026, 0.9312661212777972], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-1time-fullzedd", 396, 0, 0.0, 2851.5606060606074, 2518, 3495, 2833.5, 3115.0, 3161.0, 3282.0, 6.3566463874664905, 35.11674669325971, 2.681710194712426], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-1time-1zedd", 1150, 0, 0.0, 971.7426086956516, 829, 2278, 948.0, 1091.0, 1124.0, 1307.0, 18.904523934771174, 16652.891750024657, 9.710722255556286], "isController": false}, {"data": ["NCPPServerlessEastGFSTrajectory10waypoints", 406, 0, 0.0, 2802.6650246305453, 2519, 3601, 2744.0, 3085.5, 3226.7999999999997, 3479.02, 6.507244518528016, 34.34732092055071, 6.691531716806642], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-halftime-1zedd", 2746, 0, 0.0, 405.4209759650399, 328, 1406, 387.0, 497.0, 532.0, 576.0, 45.48089504281432, 388.0088858340096, 19.40932727901353], "isController": false}, {"data": ["NCPPServerlessEastGFSCorridor20waypoints", 506, 506, 100.0, 2250.4229249011846, 1727, 3444, 2194.0, 2600.500000000001, 3067.0, 3324.0, 8.129036403945635, 4.072456714086045, 14.654493361019181], "isController": false}, {"data": ["NCPPServerlessEastGFSCorridor5waypoints", 298, 0, 0.0, 3847.7785234899334, 3009, 10099, 3463.0, 4092.0, 8412.7, 9225.819999999992, 4.69018052473362, 67.15569028676205, 3.51305513913153], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-1time-fullzedd", 222, 0, 0.0, 5225.783783783785, 4727, 6888, 5202.0, 5621.3, 5691.0, 6660.30000000001, 3.405795989751929, 5893.074743654403, 3.828194515824678], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-fulltime-1zedd", 300, 0, 0.0, 3808.786666666665, 2093, 7199, 3695.0, 4677.9000000000015, 5466.0, 6784.0, 4.77752651527216, 25806.96652944549, 5.393379542631462], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-halftime-1zedd", 544, 0, 0.0, 2075.661764705881, 1192, 5316, 2010.5, 2534.5, 2710.0, 3538.0, 8.822575413558223, 24033.324379662667, 9.959860525462213], "isController": false}, {"data": ["NCPPServerlessEastNWM-position-1hour", 168, 0, 0.0, 7027.750000000003, 6021, 12226, 6522.0, 9940.599999999999, 10657.649999999998, 12226.0, 2.530196692671466, 6.197005180878943, 0.8771677987288774], "isController": false}, {"data": ["NCPPServerlessEastGFSInstances", 378, 0, 0.0, 2992.5396825396847, 2482, 5813, 2777.0, 3224.0, 5543.200000000001, 5698.0, 6.030535568992199, 5.24138345351861, 1.4192959688741404], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-halftime-fullzedd", 390, 0, 0.0, 2918.6564102564107, 2592, 4247, 2840.0, 3240.0, 3478.0, 4160.0, 6.242996638386425, 618.7821716924124, 2.6337642068192735], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-1time-halfzedd", 422, 0, 0.0, 2666.6540284360194, 2312, 4026, 2623.0, 2960.5, 3043.0, 3946.259999999994, 6.7635792476720145, 522.6119929819852, 5.184970419357941], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-1time-halfzedd", 688, 0, 0.0, 1637.6598837209292, 1421, 3743, 1605.5, 1790.1, 1855.5999999999995, 2769.180000000002, 11.17100733909203, 48.14224158927064, 4.756405468597778], "isController": false}, {"data": ["NCPPServerlessEastNWM-position-1month", 164, 0, 0.0, 7284.768292682925, 6654, 8438, 7200.0, 7866.0, 8195.75, 8438.0, 2.4575547330406247, 134.1815284417005, 0.8519843068646696], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-1time-halfzedd", 400, 0, 0.0, 2840.1000000000017, 2536, 3952, 2782.0, 3107.4, 3233.9, 3392.7300000000005, 6.436145392524417, 5707.534765241597, 7.25951946129463], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-halftime-1zedd", 1846, 0, 0.0, 604.1061755146266, 474, 1442, 586.0, 713.3, 742.6499999999999, 796.1799999999998, 30.53308853934071, 7099.241260089481, 23.43653085148613], "isController": false}, {"data": ["NCPPServerlessEastGFSCollectionMeta", 2946, 0, 0.0, 377.541072640869, 261, 6608, 325.0, 365.0, 537.0, 638.0, 48.856531617439764, 371.33826716653675, 11.689306881125724], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-fulltime-1zedd", 1668, 0, 0.0, 669.3477218225416, 557, 2634, 653.0, 752.0, 793.0, 902.6199999999999, 27.48076511194952, 12595.04652721716, 21.093634158195627], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-1time-1zedd", 2518, 0, 0.0, 441.76092136616427, 328, 3789, 397.0, 527.0, 565.0, 958.0, 41.75441505679463, 127.58746553975624, 16.59574895323771], "isController": false}, {"data": ["NCPPServerlessEastGFSCorridor10waypoints", 278, 0, 0.0, 4104.417266187053, 3553, 5259, 4044.0, 4542.0, 4763.0, 5059.129999999995, 4.403611595121179, 95.6065361159512, 4.863754603595755], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-1time-fullzedd", 226, 0, 0.0, 5147.619469026548, 4383, 6429, 5181.0, 5395.1, 5531.0, 6390.659999999999, 3.4994812715814247, 517.5062978081788, 2.669037962016692], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-halftime-halfzedd", 684, 0, 0.0, 1645.1608187134511, 1435, 2398, 1627.0, 1798.0, 1850.25, 1949.7499999999995, 11.130276304227552, 597.9588772699906, 4.739062957659388], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-halftime-halfzedd", 264, 0, 0.0, 4323.303030303029, 3980, 5365, 4304.5, 4598.5, 4699.0, 5023.100000000012, 4.160887656033287, 19839.990031206657, 3.1897429785020806], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-1time-1zedd", 2118, 0, 0.0, 526.4220963172825, 413, 3716, 479.0, 613.0, 639.0, 1636.0, 35.06216167000513, 242.79862148633438, 26.91294831310941], "isController": false}, {"data": ["NCPPServerlessEastGFSTrajectory5waypoints", 494, 0, 0.0, 2277.417004048581, 1801, 7930, 2038.0, 2291.0, 2879.0, 7542.250000000001, 8.055573674254779, 32.851636390320266, 5.506739816385102], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 506, 100.0, 1.712467848923785], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 29548, 506, "502/Bad Gateway", 506, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSCorridor20waypoints", 506, 506, "502/Bad Gateway", 506, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
