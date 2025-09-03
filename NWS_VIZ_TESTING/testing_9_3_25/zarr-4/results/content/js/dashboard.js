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

    var data = {"OkPercent": 99.76237945103857, "KoPercent": 0.23762054896142434};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4368566858308605, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.05083179297597042, 500, 1500, "NBM_ResLevel-1_Times-One_100threads_ZARR"], "isController": false}, {"data": [0.41485998193315266, 500, 1500, "HREF_ResLevel-1_Times-One_50threads_ZARR"], "isController": false}, {"data": [0.31952291274325173, 500, 1500, "NBM_ResLevel-1_Times-One_25threads_ZARR"], "isController": false}, {"data": [0.376665022200296, 500, 1500, "HREF_ResLevel-1_Times-One_25threads_ZARR"], "isController": false}, {"data": [0.2031434184675835, 500, 1500, "NBM_ResLevel-1_Times-One_50threads_ZARR"], "isController": false}, {"data": [0.4214811510149454, 500, 1500, "HREF_ResLevel-1_Time-All_50threads_ZARR"], "isController": false}, {"data": [0.5586385788398051, 500, 1500, "LREF_ResLevel-1_Time-All_50threads_ZARR"], "isController": false}, {"data": [0.04862953138815208, 500, 1500, "NBM_ResLevel-1_Time-All_25threads_ZARR"], "isController": false}, {"data": [0.6178201176800224, 500, 1500, "LREF_ResLevel-1_Time-All_25threads_ZARR"], "isController": false}, {"data": [0.020645645645645645, 500, 1500, "NBM_ResLevel-1_Time-All_50threads_ZARR"], "isController": false}, {"data": [0.40802036919159773, 500, 1500, "LREF_ResLevel-1_Times-One_100threads_ZARR"], "isController": false}, {"data": [0.381741935483871, 500, 1500, "LREF_ResLevel-1_Time-All_100threads_ZARR"], "isController": false}, {"data": [0.4292738895263072, 500, 1500, "MRMS_ResLevel-1_Times-One_100threads_ZARR"], "isController": false}, {"data": [0.23613560650597687, 500, 1500, "HREF_ResLevel-1_Times-One_100threads_ZARR"], "isController": false}, {"data": [0.45471556886227543, 500, 1500, "HREF_ResLevel-1_Time-All_25threads_ZARR"], "isController": false}, {"data": [0.010114335971855761, 500, 1500, "NBM_ResLevel-1_Time-All_100threads_ZARR"], "isController": false}, {"data": [0.6363961387200572, 500, 1500, "MRMS_ResLevel-1_Times-One_50threads_ZARR"], "isController": false}, {"data": [0.7892602605062669, 500, 1500, "MRMS_ResLevel-1_Times-One_25threads_ZARR"], "isController": false}, {"data": [0.23048048048048048, 500, 1500, "HREF_ResLevel-1_Time-All_100threads_ZARR"], "isController": false}, {"data": [0.6334752204317422, 500, 1500, "LREF_ResLevel-1_Times-One_50threads_ZARR"], "isController": false}, {"data": [0.7193812324213756, 500, 1500, "LREF_ResLevel-1_Times-One_25threads_ZARR"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 86272, 205, 0.23762054896142434, 1524.9082089206167, 6, 65440, 1217.0, 3936.800000000003, 7581.0, 19727.840000000026, 33.46693417869617, 6.803329576900592, 9.46353716917886], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NBM_ResLevel-1_Times-One_100threads_ZARR", 2705, 34, 1.2569316081330868, 3950.3981515711703, 55, 21501, 3523.0, 6779.0, 7878.099999999999, 11323.16, 21.868658695318246, 4.460593086310462, 6.556326386194045], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_50threads_ZARR", 4428, 16, 0.36133694670280037, 1210.880081300818, 89, 13174, 835.0, 1878.0, 2242.750000000001, 6196.590000000001, 35.1911751849762, 7.156775771495784, 10.378647369006652], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_25threads_ZARR", 1593, 7, 0.4394224733207784, 1674.2868801004402, 222, 8649, 1255.0, 2402.0, 3302.6, 5240.059999999998, 13.070983728963757, 2.658913825765346, 3.9187421921795638], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_25threads_ZARR", 2027, 7, 0.3453379378391712, 1316.8120374938328, 74, 7528, 938.0, 2452.4000000000005, 3953.199999999998, 5375.72, 16.450652101576893, 3.345366748804954, 4.851657162769747], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_50threads_ZARR", 2545, 21, 0.825147347740668, 2084.324950884083, 25, 9436, 1749.0, 3424.4000000000005, 3943.199999999999, 6867.299999999998, 20.953227785050345, 4.26777454543022, 6.281875908213336], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_50threads_ZARR", 4483, 5, 0.1115324559446799, 1178.7776042828427, 188, 8369, 843.0, 1838.6, 2227.0, 6138.119999999999, 37.111541581814265, 7.541070953678869, 9.893994972495406], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_50threads_ZARR", 6361, 8, 0.1257663889325578, 829.3310800188651, 6, 6782, 607.0, 1275.8000000000002, 1480.7999999999993, 5622.180000000001, 52.7516088369933, 10.719640976414782, 14.012146097326344], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_25threads_ZARR", 1131, 10, 0.8841732979664014, 2353.9336870026527, 6, 6664, 2101.0, 3658.6000000000004, 4216.999999999999, 5254.640000000001, 9.273380233187385, 1.8891802620898313, 2.517577836744232], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_25threads_ZARR", 3569, 2, 0.05603810591202017, 761.8038666293103, 54, 6304, 562.0, 1198.0, 1366.5, 4761.600000000006, 28.940262562539022, 5.879583618830226, 7.687257243174429], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_50threads_ZARR", 1332, 1, 0.07507507507507508, 4033.995495495495, 126, 21054, 3519.0, 6898.8, 8410.799999999997, 11390.520000000004, 10.75182022181683, 2.184507392380899, 2.918951193032304], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_100threads_ZARR", 7855, 15, 0.19096117122851686, 1347.1163590070032, 77, 10525, 1021.0, 2194.0, 2805.0, 7252.919999999993, 64.67522416078647, 13.145476992643244, 19.010978976949932], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_100threads_ZARR", 7750, 17, 0.21935483870967742, 1364.4034838709665, 40, 9223, 1078.0, 2263.9000000000005, 2819.8999999999996, 6898.939999999999, 63.96236536953741, 13.001809580427516, 16.990003301283373], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_100threads_ZARR", 6101, 1, 0.016390755613833796, 1819.1734141943957, 27, 8915, 989.0, 7126.200000000002, 7755.0, 8230.899999999998, 48.3220732315832, 9.815954820821815, 13.9209097688643], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_100threads_ZARR", 5103, 19, 0.37233000195963156, 2072.2719968645906, 37, 15411, 1559.0, 3708.6000000000004, 6384.600000000001, 8699.84, 42.08139199274317, 8.558340398610481, 12.410723029109802], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_25threads_ZARR", 2672, 4, 0.1497005988023952, 991.3858532934138, 87, 6385, 756.0, 1426.800000000001, 1828.0499999999997, 2620.5099999999998, 22.102920861285973, 4.49188537625425, 5.892673237432686], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_100threads_ZARR", 1137, 2, 0.1759014951627089, 10170.613016710642, 87, 65440, 4673.0, 23907.600000000002, 30498.19999999997, 53266.73999999958, 8.413310345337901, 1.7099508714842797, 2.2840823007850943], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_50threads_ZARR", 5594, 0, 0.0, 952.4554880228814, 241, 7414, 591.0, 1036.5, 6133.25, 6825.1, 46.05366066503659, 9.354649822585559, 13.267412007993942], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_25threads_ZARR", 4069, 0, 0.0, 650.2872941754736, 246, 5965, 447.0, 755.0, 947.5, 5553.3, 33.775483099807424, 6.860645004648384, 9.730241713323428], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_100threads_ZARR", 5328, 31, 0.5818318318318318, 1990.807807807805, 6, 11257, 1585.5, 3431.300000000001, 4849.850000000012, 8085.2300000000005, 43.804982323439944, 8.915060981562936, 11.67847673271397], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_50threads_ZARR", 6578, 3, 0.045606567345697784, 803.2780480389193, 147, 7162, 586.0, 1254.0, 1403.0999999999985, 5262.9400000000005, 54.38161375661376, 11.047936495019016, 15.98522044994213], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_25threads_ZARR", 3911, 2, 0.05113781641523907, 676.74252109435, 21, 5714, 518.0, 982.8000000000002, 1235.3999999999996, 1646.5200000000004, 32.4645139868847, 6.595473069021333, 9.542791709035445], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 205, 100.0, 0.23762054896142434], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 86272, 205, "502/Bad Gateway", 205, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["NBM_ResLevel-1_Times-One_100threads_ZARR", 2705, 34, "502/Bad Gateway", 34, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_50threads_ZARR", 4428, 16, "502/Bad Gateway", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_25threads_ZARR", 1593, 7, "502/Bad Gateway", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_25threads_ZARR", 2027, 7, "502/Bad Gateway", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_50threads_ZARR", 2545, 21, "502/Bad Gateway", 21, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_50threads_ZARR", 4483, 5, "502/Bad Gateway", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_50threads_ZARR", 6361, 8, "502/Bad Gateway", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_25threads_ZARR", 1131, 10, "502/Bad Gateway", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_25threads_ZARR", 3569, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_50threads_ZARR", 1332, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_100threads_ZARR", 7855, 15, "502/Bad Gateway", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_100threads_ZARR", 7750, 17, "502/Bad Gateway", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_100threads_ZARR", 6101, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_100threads_ZARR", 5103, 19, "502/Bad Gateway", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_25threads_ZARR", 2672, 4, "502/Bad Gateway", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_100threads_ZARR", 1137, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_100threads_ZARR", 5328, 31, "502/Bad Gateway", 31, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_50threads_ZARR", 6578, 3, "502/Bad Gateway", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_25threads_ZARR", 3911, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
