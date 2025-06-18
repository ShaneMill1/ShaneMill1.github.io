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

    var data = {"OkPercent": 99.98373610393587, "KoPercent": 0.016263896064137154};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4575894992633412, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.860056258790436, 500, 1500, "HREF_ResLevel-1_Times-One_5threads"], "isController": false}, {"data": [0.2672943889315911, 500, 1500, "HREF_ResLevel-4_Times-One_250threads"], "isController": false}, {"data": [0.42955135335558026, 500, 1500, "HREF_ResLevel-4_Times-One_50threads"], "isController": false}, {"data": [0.4045103616416091, 500, 1500, "HREF_ResLevel-4_Times-One_100threads"], "isController": false}, {"data": [0.4893248701673399, 500, 1500, "HREF_ResLevel-2_Times-One_25threads"], "isController": false}, {"data": [0.09285534907081869, 500, 1500, "HREF_ResLevel-4_Times-One_500threads"], "isController": false}, {"data": [0.9296103183315039, 500, 1500, "HREF_ResLevel-1_Times-One_25threads"], "isController": false}, {"data": [0.8728175556623419, 500, 1500, "HREF_ResLevel-1_Times-One_50threads"], "isController": false}, {"data": [0.4497427101200686, 500, 1500, "HREF_ResLevel-2_Times-One_100threads"], "isController": false}, {"data": [0.24622629338149915, 500, 1500, "HREF_ResLevel-2_Times-One_250threads"], "isController": false}, {"data": [0.1232434485377896, 500, 1500, "HREF_ResLevel-2_Times-One_500threads"], "isController": false}, {"data": [0.33316221765913756, 500, 1500, "HREF_ResLevel-4_Times-One_25threads"], "isController": false}, {"data": [0.6018536031776055, 500, 1500, "HREF_ResLevel-1_Times-One_250threads"], "isController": false}, {"data": [0.47362932061978547, 500, 1500, "HREF_ResLevel-2_Times-One_50threads"], "isController": false}, {"data": [0.33808724832214765, 500, 1500, "HREF_ResLevel-1_Times-One_500threads"], "isController": false}, {"data": [0.8289414108485013, 500, 1500, "HREF_ResLevel-1_Times-One_100threads"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 104526, 17, 0.016263896064137154, 1503.1729139161384, 20, 40524, 1575.0, 4588.800000000003, 6052.950000000001, 10872.930000000011, 102.48671926016131, 625.9111904220447, 30.325660093582886], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["HREF_ResLevel-1_Times-One_5threads", 711, 0, 0.0, 395.1645569620253, 273, 726, 320.0, 560.0, 613.1999999999999, 646.64, 11.792804896253173, 24.714218073593074, 3.4894725425436635], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_250threads", 7806, 0, 0.0, 1793.0659748911087, 540, 12004, 1419.5, 3296.0, 4049.949999999999, 6144.93, 123.08808224794222, 1764.2224444853985, 36.42157121203759], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_50threads", 2697, 0, 0.0, 1029.819428995179, 536, 4620, 833.0, 1797.800000000001, 2102.1, 2851.02, 44.146533097623255, 632.752603783024, 13.062890164628756], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_100threads", 4922, 0, 0.0, 1131.7771231206832, 541, 5426, 896.5, 1972.3999999999996, 2317.0999999999967, 3387.3099999999986, 79.33335482415139, 1137.0855944863963, 23.47461573409948], "isController": false}, {"data": ["HREF_ResLevel-2_Times-One_25threads", 1733, 0, 0.0, 801.7663012117711, 523, 2145, 711.0, 1200.6000000000001, 1319.3, 1597.6200000000006, 28.41496007476758, 189.2758229199118, 8.407942287748611], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_500threads", 7964, 4, 0.050226017076845805, 3590.4411099949757, 536, 16877, 2970.5, 7030.0, 8429.75, 11106.35, 120.56436962577207, 1727.1985015554985, 35.67480859043842], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_25threads", 3644, 0, 0.0, 380.0315587266749, 266, 1889, 331.0, 547.0, 627.75, 865.1000000000004, 60.271253721468746, 126.31065477174991, 17.83416980234866], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_50threads", 6243, 0, 0.0, 443.316674675637, 270, 2505, 349.0, 771.0, 916.5999999999985, 1343.6799999999985, 102.80096823593341, 215.4403103850714, 30.418645874499827], "isController": false}, {"data": ["HREF_ResLevel-2_Times-One_100threads", 5830, 0, 0.0, 957.846655231562, 533, 12538, 733.0, 1502.9000000000005, 1901.8999999999996, 4236.069999999999, 88.16635160680529, 587.2877776465028, 26.0882856805293], "isController": false}, {"data": ["HREF_ResLevel-2_Times-One_250threads", 7751, 0, 0.0, 1807.1797187459672, 531, 8597, 1516.0, 3244.8, 3875.3999999999996, 5191.599999999991, 124.1172797002354, 826.7616844094781, 36.72610913005012], "isController": false}, {"data": ["HREF_ResLevel-2_Times-One_500threads", 7899, 10, 0.126598303582732, 3679.513735915944, 20, 40524, 2646.0, 7240.0, 9254.0, 16001.0, 93.53463587921847, 622.2825890874777, 27.676752608792185], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_25threads", 974, 0, 0.0, 1432.8901437371644, 544, 5739, 1133.0, 2307.0, 2396.5, 4422.75, 15.527356204565743, 222.55371778751115, 4.594520439436934], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_250threads", 15861, 1, 0.006304772712943698, 877.4441712376281, 268, 9558, 630.0, 1735.800000000001, 2301.699999999999, 3577.7599999999984, 253.86942394801287, 532.0057312340941, 75.11956587524209], "isController": false}, {"data": ["HREF_ResLevel-2_Times-One_50threads", 3356, 0, 0.0, 827.4725864123941, 521, 3444, 696.0, 1224.0, 1536.2999999999993, 2125.319999999996, 53.99230979616134, 359.6499464058755, 15.976240105700082], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_500threads", 16092, 2, 0.012428535918468804, 1744.7937484464305, 272, 10199, 1307.0, 3667.0, 4470.0, 6248.07, 253.40535092830257, 531.0049020813977, 74.98224739382391], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_100threads", 11043, 0, 0.0, 501.2787286063569, 271, 2684, 389.0, 887.6000000000004, 1103.0, 1565.0, 181.33600446648492, 380.02643123542646, 53.657040384125914], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 9, 52.94117647058823, 0.008610297916307904], "isController": false}, {"data": ["500/Internal Server Error", 8, 47.05882352941177, 0.007653598147829248], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 104526, 17, "502/Bad Gateway", 9, "500/Internal Server Error", 8, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_500threads", 7964, 4, "502/Bad Gateway", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["HREF_ResLevel-2_Times-One_500threads", 7899, 10, "500/Internal Server Error", 8, "502/Bad Gateway", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_250threads", 15861, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_500threads", 16092, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
