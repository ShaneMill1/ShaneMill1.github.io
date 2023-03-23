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

    var data = {"OkPercent": 99.97829832853726, "KoPercent": 0.02170167146273606};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.944589122254196, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9556187144731089, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [4.926108374384236E-4, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.9921272757093652, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [5.165289256198347E-4, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.9929777583474507, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.992241285105453, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.9533384329581467, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.9933887006884493, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.9924279700399103, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.9802955665024631, 500, 1500, "WIFSGriddedLowResItemGlobal"], "isController": false}, {"data": [0.969660525884218, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.9550574084199016, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [5.313496280552603E-4, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [5.208333333333333E-4, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.9699196765204087, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.9927318432701241, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.9847290640394089, 500, 1500, "WIFSGriddedHighResItemGlobal"], "isController": false}, {"data": [0.9798029556650246, 500, 1500, "WIFSGriddedHighResItemSector"], "isController": false}, {"data": [0.9718409973207939, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 230397, 50, 0.02170167146273606, 1505.4691944773804, 28, 90004, 273.0, 368.0, 426.0, 62560.900000000016, 63.18220322831258, 14959.894637925132, 18.602400901852683], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 18296, 0, 0.0, 344.8899759510269, 161, 3114, 332.0, 480.2999999999993, 587.0, 811.0, 5.085026049085398, 169.4743837921743, 1.5145829540732876], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 1015, 5, 0.49261083743842365, 35560.669950738884, 1438, 90002, 34701.0, 63094.799999999996, 68513.2, 83094.64000000006, 0.27846013465948033, 356.5909210876557, 0.09789614109122355], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM", 18291, 0, 0.0, 120.43835766223839, 45, 2594, 96.0, 198.0, 325.0, 551.0, 5.085151474460396, 1.822510342897427, 1.474892566322986], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 980, 19, 1.9387755102040816, 42839.65102040819, 5220, 90004, 41283.0, 71129.6, 79779.45, 90002.19, 0.2716177218922775, 7192.5057820969, 0.09496010198968295], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 968, 6, 0.6198347107438017, 37744.74380165289, 1494, 90003, 35048.5, 66872.1, 73879.14999999998, 87266.12, 0.27154124341203917, 33.05687139473247, 0.09175124044977105], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC", 18299, 0, 0.0, 139.10454123176223, 59, 2137, 119.0, 210.0, 329.0, 538.0, 5.085588461141897, 56.696365109761615, 1.5147504693830844], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC", 18302, 0, 0.0, 141.3179980330018, 60, 2575, 120.0, 212.0, 328.0, 549.0, 5.084390266262368, 123.93201274014521, 1.5094283602966403], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 18302, 0, 0.0, 350.69058026445174, 161, 2422, 336.0, 489.0, 602.0, 836.0, 5.084607795935592, 352.8539054636475, 1.509492939418379], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 998, 2, 0.20040080160320642, 37332.61022044085, 1915, 90002, 35538.5, 63879.100000000006, 70534.45, 83223.00999999998, 0.2743514392454511, 1266.5094319260336, 0.09671959918711702], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM", 18302, 0, 0.0, 121.34821331002058, 45, 1998, 98.0, 201.0, 317.0, 547.9700000000012, 5.08456824370145, 74.62001129525918, 1.4697580079449506], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 18291, 0, 0.0, 139.29391504018318, 58, 5265, 118.0, 212.79999999999927, 334.0, 545.0799999999981, 5.085191059560763, 45.32971092936586, 1.5146321027012037], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal", 1015, 0, 0.0, 164.85221674876848, 46, 1286, 132.0, 327.19999999999993, 442.19999999999925, 664.2800000000005, 0.2824208727667535, 4.481679539279039, 0.062055367551288605], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 18293, 0, 0.0, 311.2948668889732, 149, 3457, 300.0, 424.0, 528.0, 754.0, 5.085068500956942, 377.35280304611047, 1.474868500765832], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 18290, 1, 0.005467468562055768, 348.3625478403516, 158, 90002, 329.0, 481.0, 600.0, 818.1800000000003, 5.084736338767431, 140.2993513850972, 1.5144966634024086], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 941, 4, 0.4250797024442083, 36169.570669500565, 1477, 90002, 35735.0, 61441.80000000001, 67793.19999999998, 76783.40000000005, 0.2733661217742943, 465.54393776899036, 0.09183393153355199], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 960, 5, 0.5208333333333334, 37442.7625, 1468, 90003, 35697.0, 65743.5, 70319.95, 84270.79, 0.2712505753479001, 104.55009700342637, 0.09191791957589973], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 18301, 0, 0.0, 310.978197912682, 147, 3112, 300.0, 423.0, 524.0, 752.9799999999996, 5.08492612950738, 377.33727219629577, 1.4698614593107273], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 987, 2, 0.20263424518743667, 39874.945288753814, 3340, 90003, 38668.0, 66242.0, 72036.79999999999, 86038.64, 0.27160460533539316, 3576.1384339409515, 0.09601647180801985], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 948, 6, 0.6329113924050633, 36802.32172995783, 1611, 90004, 35960.5, 63247.9, 68505.79999999999, 82545.73, 0.2715920710012723, 274.3729397821935, 0.09229886787933864], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM", 18299, 0, 0.0, 121.78031586425435, 46, 2369, 98.0, 200.0, 319.0, 537.0, 5.086139734177697, 74.6480410790592, 1.4751792002448985], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 1015, 0, 0.0, 123.26502463054187, 28, 1401, 81.0, 292.4, 408.19999999999993, 774.4800000000007, 0.2823449036327636, 42.17226821830491, 0.06314158489443639], "isController": false}, {"data": ["WIFSGriddedHighResItemSector", 1015, 0, 0.0, 136.1556650246305, 29, 2028, 81.0, 304.19999999999993, 453.1999999999996, 1112.5600000000036, 0.2823591987341406, 5.436019305058375, 0.0634205231531761], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 18289, 0, 0.0, 301.2535403794635, 138, 2793, 291.0, 414.0, 517.0, 740.0999999999985, 5.0848852488004415, 1.8224149280368769, 1.4748153504821593], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 50, 100.0, 0.02170167146273606], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 230397, 50, "504/Gateway Time-out", 50, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 1015, 5, "504/Gateway Time-out", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 980, 19, "504/Gateway Time-out", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 968, 6, "504/Gateway Time-out", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 998, 2, "504/Gateway Time-out", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 18290, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 941, 4, "504/Gateway Time-out", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 960, 5, "504/Gateway Time-out", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 987, 2, "504/Gateway Time-out", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 948, 6, "504/Gateway Time-out", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
