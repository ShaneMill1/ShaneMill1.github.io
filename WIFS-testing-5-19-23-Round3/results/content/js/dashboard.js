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

    var data = {"OkPercent": 99.97712126467745, "KoPercent": 0.022878735322553266};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6025889872100489, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.01844972758791481, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.6038875755187811, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.907227332457293, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.10105448154657294, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.9131005513258073, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.911100905392993, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.001983635011157947, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.608581550977562, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.9052617766697284, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.9139290407358739, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.8394006934125805, 500, 1500, "WIFSGriddedLowResItemGlobal"], "isController": false}, {"data": [0.6230789439117299, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.6078470031545742, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.052611657834973506, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.08888609504651747, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.6220472440944882, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.08287153652392946, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.9056591386554622, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.9135924733845011, 500, 1500, "WIFSGriddedHighResItemGlobal"], "isController": false}, {"data": [0.8794256003961377, 500, 1500, "WIFSGriddedHighResItemSector"], "isController": false}, {"data": [0.6234389378204286, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 135497, 31, 0.022878735322553266, 2515.8084238027946, 42, 60002, 465.0, 7913.600000000006, 12731.750000000004, 21545.75000000004, 37.38958101770346, 53371.20988037587, 11.231464735291082], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 4038, 0, 0.0, 7781.976225854383, 839, 50008, 6034.0, 16016.3, 19723.999999999993, 27874.510000000013, 1.1180723745581218, 1485.543592745547, 0.39416418673386916], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 7614, 4, 0.052534804307853955, 766.004465458368, 230, 31240, 601.5, 1171.0, 1482.0, 3087.9500000000025, 2.119131128405319, 0.7552586846733438, 0.6332559817304957], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM", 7610, 0, 0.0, 341.65729303548005, 79, 33808, 208.0, 682.9000000000005, 926.8999999999996, 1815.0, 2.1184559267910625, 0.7592512940745312, 0.6165037755700553], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 4015, 12, 0.298879202988792, 16191.153175591564, 4988, 60002, 14662.0, 26012.8, 30276.0, 41425.80000000003, 1.1122364290534437, 29149.61895795393, 0.38993445120135384], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 3983, 0, 0.0, 6531.073813708269, 645, 44906, 4644.0, 14903.8, 19455.599999999973, 27764.919999999987, 1.1065573315049069, 85.2215815594985, 0.3749759707345729], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC", 7618, 0, 0.0, 338.02480966132885, 78, 34659, 202.0, 664.0, 902.0499999999993, 1996.619999999999, 2.1198497015987363, 0.7556104893393933, 0.6334707116105599], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC", 7621, 0, 0.0, 331.80304421991895, 81, 34281, 201.0, 654.8000000000002, 883.0, 1969.7799999999997, 2.117862773274745, 0.752834032687507, 0.6308087361804661], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 4033, 0, 0.0, 8884.686585668185, 1288, 52022, 7219.0, 17367.199999999997, 21352.49999999999, 29781.91999999999, 1.1150673160028335, 5322.020883477348, 0.3941937191338141], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 7621, 2, 0.02624327516074006, 760.1237370423839, 231, 34744, 602.0, 1162.8000000000002, 1459.7999999999993, 3263.0999999999885, 2.117088524080111, 0.7525116075607923, 0.63057812484808], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM", 7621, 0, 0.0, 347.19708699645713, 79, 34399, 211.0, 674.0, 902.7999999999993, 1949.0399999999954, 2.1178333461627923, 0.7569599655230292, 0.6142543982522942], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 7610, 0, 0.0, 330.2795006570314, 80, 34264, 205.0, 660.9000000000005, 877.4499999999998, 1851.5600000000013, 2.1187974362829443, 0.755235414300073, 0.6331562651392393], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal", 4038, 0, 0.0, 698.2265973254102, 74, 35176, 223.0, 979.0, 1764.1499999999937, 14491.370000000003, 1.123851934316727, 18.004854002139577, 0.24803763394099637], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 7613, 5, 0.06567713122290818, 735.8629975042676, 238, 32475, 586.0, 1097.0, 1370.199999999997, 3087.6799999999876, 2.1187425361846324, 0.7592317120520911, 0.616587183381856], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 7608, 1, 0.013144058885383806, 740.103180862248, 233, 30734, 596.5, 1147.0, 1411.5499999999993, 2904.91, 2.1177399973110713, 0.7548345738312695, 0.6328402726339725], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 3963, 0, 0.0, 6882.977542265964, 943, 44486, 5180.0, 14754.4, 18173.6, 26280.080000000013, 1.1023831002417566, 1852.0043587013924, 0.37140836873379496], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 3977, 0, 0.0, 6605.179280864976, 697, 43338, 4764.0, 14913.2, 18863.199999999997, 26075.22, 1.1088854711187894, 225.48073103900296, 0.37684779682552605], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 7620, 4, 0.05249343832020997, 740.9576115485546, 237, 35157, 579.0, 1100.0, 1394.8999999999996, 3077.95, 2.1201248258270153, 0.7576822615249095, 0.6149190168658434], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 4023, 0, 0.0, 11533.436241610732, 2545, 45937, 9913.0, 20414.399999999998, 25269.59999999999, 32757.319999999952, 1.1117940259932635, 14676.342746260356, 0.3941222963237838], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 3970, 0, 0.0, 6842.256171284644, 757, 41553, 5153.5, 15064.300000000001, 19102.9, 27103.46, 1.1039157309103913, 530.1245052213025, 0.3762369043825454], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM", 7616, 0, 0.0, 352.8352153361339, 80, 34697, 208.5, 689.0, 949.2999999999993, 1995.5999999999985, 2.119605768912319, 0.7596633956941611, 0.616838397593624], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 4039, 0, 0.0, 332.5221589502356, 44, 32505, 116.0, 652.0, 933.0, 2229.999999999996, 1.121982155511338, 168.46651249857982, 0.25200771071055444], "isController": false}, {"data": ["WIFSGriddedHighResItemSector", 4039, 0, 0.0, 424.8281752909157, 42, 35324, 135.0, 789.0, 1162.0, 3246.1999999999916, 1.122026414707519, 23.376256376507506, 0.2531133806615594], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 7607, 3, 0.03943736032601551, 731.7532535822271, 228, 35087, 580.0, 1100.0, 1369.0, 3034.5200000000004, 2.119396672655882, 0.7595149939408993, 0.6167775473158721], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 30, 96.7741935483871, 0.022140711602470903], "isController": false}, {"data": ["504/Gateway Time-out", 1, 3.225806451612903, 7.380237200823634E-4], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 135497, 31, "502/Bad Gateway", 30, "504/Gateway Time-out", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 7614, 4, "502/Bad Gateway", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 4015, 12, "502/Bad Gateway", 11, "504/Gateway Time-out", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 7621, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 7613, 5, "502/Bad Gateway", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 7608, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 7620, 4, "502/Bad Gateway", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 7607, 3, "502/Bad Gateway", 3, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
