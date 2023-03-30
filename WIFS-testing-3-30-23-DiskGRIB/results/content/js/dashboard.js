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

    var data = {"OkPercent": 97.79122065429566, "KoPercent": 2.2087793457043383};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9491911726133448, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9721950367004544, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.9989862975391499, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [8.833922261484099E-4, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.999073815182441, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.999126393402523, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.9726881945900608, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.9992137540622706, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.9992484619686801, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.9948364888123924, 500, 1500, "WIFSGriddedLowResItemGlobal"], "isController": false}, {"data": [0.9733999790275787, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.9733447528490526, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [2.962085308056872E-4, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.9752900880749336, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [2.977963073257892E-4, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.9991960852848655, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.9902467010900746, 500, 1500, "WIFSGriddedHighResItemGlobal"], "isController": false}, {"data": [0.9945496270797476, 500, 1500, "WIFSGriddedHighResItemSector"], "isController": false}, {"data": [0.9727145603915399, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 362191, 8000, 2.2087793457043383, 944.7174888387779, 3, 60005, 112.0, 234.0, 348.9500000000007, 50877.05000000063, 99.07173332793559, 116.8119189699867, 29.17975254992278], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 28610, 3, 0.01048584411045089, 216.03194687172368, 92, 60002, 153.0, 269.0, 672.0, 803.0, 7.950736005829243, 2.833943146384277, 2.3681391423612492], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 1743, 1005, 57.6592082616179, 20270.86288009182, 3, 60003, 14070.0, 52859.4, 57936.99999999999, 60002.0, 0.4770032700585622, 0.18307104311009414, 0.16769646212996328], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM", 28608, 0, 0.0, 73.01747762863522, 34, 3421, 54.0, 91.0, 194.95000000000073, 260.0, 7.951238628878272, 2.849711500779615, 2.3061697976336393], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 1709, 1002, 58.63077823288473, 23812.22995904038, 3, 60005, 19720.0, 55061.0, 60001.0, 60003.0, 0.4690497173488289, 0.17872346208505638, 0.16398417852625075], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 1698, 991, 58.362779740871616, 21006.955830388673, 3, 60004, 14192.0, 54639.1, 58750.3, 60002.0, 0.4658479667574402, 0.17872439302245893, 0.1574056606426507], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC", 28612, 1, 0.0034950370473927025, 75.44156298056733, 33, 60001, 54.0, 93.0, 222.0, 267.0, 7.950929437863286, 2.8340517177746567, 2.3681967563948265], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC", 28617, 0, 0.0, 72.63147779292119, 33, 6401, 54.0, 91.0, 177.0, 256.0, 7.949385274761722, 2.825758046887956, 2.3599737534448866], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 28614, 3, 0.010484378276368212, 215.36552037464128, 93, 60002, 153.0, 267.0, 669.0, 800.0, 7.949693614240659, 2.8258090481593516, 2.3600652917276954], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 1732, 1010, 58.314087759815244, 21143.99076212468, 3, 60004, 15019.5, 55872.7, 59360.6, 60002.0, 0.4742636659540846, 0.18167626440760717, 0.16719646817326617], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM", 28617, 0, 0.0, 73.23321801726186, 33, 10950, 54.0, 92.0, 216.0, 258.9900000000016, 7.9500941776540595, 2.841537567403697, 2.2980740982281267], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 28608, 0, 0.0, 72.5799077181211, 33, 9574, 54.0, 92.0, 217.0, 259.0, 7.951152441835935, 2.834151016865348, 2.368263178476524], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal", 1743, 0, 0.0, 120.47332185886422, 49, 2020, 124.0, 162.0, 180.0, 492.75999999999885, 0.4843947358547983, 7.810982358360395, 0.10643439020247034], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 28609, 4, 0.013981614177356777, 219.393128036633, 93, 60002, 153.0, 266.0, 658.0, 795.0, 7.950325541223226, 2.849302836758494, 2.3059049665461893], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 28606, 3, 0.01048731035447109, 215.76469971334677, 93, 60002, 153.0, 266.0, 667.0, 809.0, 7.950523651737826, 2.8338674470407463, 2.368075892363317], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 1669, 993, 59.49670461354104, 21203.917315757964, 3, 60004, 16112.0, 53818.0, 57651.5, 60002.0, 0.45918242418056293, 0.17787886307160852, 0.15425659562315788], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 1688, 988, 58.53080568720379, 21170.980450236926, 3, 60005, 15406.0, 53671.600000000006, 58400.2, 60002.0, 0.4635167299883242, 0.1783439635149451, 0.15707061065034034], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 28612, 2, 0.006990074094785405, 210.3352439535868, 94, 60001, 153.0, 263.0, 540.8500000000022, 783.0, 7.950324089909907, 2.8415795826413293, 2.2981405572395825], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 1716, 1012, 58.97435897435897, 21533.212703962676, 3, 60004, 15026.5, 54784.299999999996, 59950.84999999999, 60003.0, 0.4713771602382927, 0.18011240643877577, 0.1666391914123652], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 1679, 980, 58.36807623585467, 21222.066706372858, 3, 60005, 16118.0, 53430.0, 57861.0, 60002.0, 0.46293922013352723, 0.17891068655830195, 0.15732700059225338], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM", 28610, 0, 0.0, 72.58357217755973, 33, 8709, 54.0, 91.0, 189.95000000000073, 264.0, 7.950886255638362, 2.8495852107610147, 2.306067595629486], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 1743, 0, 0.0, 102.22834193918523, 33, 8826, 77.0, 100.0, 109.79999999999995, 718.4399999999987, 0.4842405133449518, 67.68711780412832, 0.10829206792577535], "isController": false}, {"data": ["WIFSGriddedHighResItemSector", 1743, 0, 0.0, 82.41422834193932, 29, 5905, 75.0, 96.0, 106.0, 483.55999999999995, 0.48432689814880425, 7.632580721931199, 0.10878436188889157], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 28605, 3, 0.01048767697954903, 217.60157315154868, 93, 60002, 154.0, 268.0, 669.0, 794.0, 7.950879933513354, 2.849521871000065, 2.3060657619662757], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 489, 6.1125, 0.13501163750617767], "isController": false}, {"data": ["500/INTERNAL SERVER ERROR", 7511, 93.8875, 2.0737677081981607], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 362191, 8000, "500/INTERNAL SERVER ERROR", 7511, "504/Gateway Time-out", 489, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 28610, 3, "504/Gateway Time-out", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 1743, 1005, "500/INTERNAL SERVER ERROR", 958, "504/Gateway Time-out", 47, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 1709, 1002, "500/INTERNAL SERVER ERROR", 913, "504/Gateway Time-out", 89, "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 1698, 991, "500/INTERNAL SERVER ERROR", 932, "504/Gateway Time-out", 59, "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC", 28612, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 28614, 3, "504/Gateway Time-out", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 1732, 1010, "500/INTERNAL SERVER ERROR", 945, "504/Gateway Time-out", 65, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 28609, 4, "504/Gateway Time-out", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 28606, 3, "504/Gateway Time-out", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 1669, 993, "500/INTERNAL SERVER ERROR", 951, "504/Gateway Time-out", 42, "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 1688, 988, "500/INTERNAL SERVER ERROR", 937, "504/Gateway Time-out", 51, "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 28612, 2, "504/Gateway Time-out", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 1716, 1012, "500/INTERNAL SERVER ERROR", 927, "504/Gateway Time-out", 85, "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 1679, 980, "500/INTERNAL SERVER ERROR", 948, "504/Gateway Time-out", 32, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 28605, 3, "504/Gateway Time-out", 3, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
