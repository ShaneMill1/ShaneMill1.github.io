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

    var data = {"OkPercent": 99.91294752329573, "KoPercent": 0.0870524767042668};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.28209293771456595, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.28286082474226804, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.30930833872010344, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.32570876288659795, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.33515775917578877, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.3170103092783505, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.3168061815840309, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.33580645161290323, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.2659229747675963, 500, 1500, "WIFSGriddedLowResItemGlobal"], "isController": false}, {"data": [0.32055412371134023, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.32307193778353854, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.327319587628866, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.3170103092783505, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.3024119230412241, 500, 1500, "WIFSGriddedHighResItemGlobal"], "isController": false}, {"data": [0.26851986996616467, 500, 1500, "WIFSGriddedHighResItemSector"], "isController": false}, {"data": [0.3314935064935065, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 244680, 213, 0.0870524767042668, 2737.2716241621833, 26, 90045, 2312.0, 4445.9000000000015, 4687.0, 58283.19000000013, 67.03591029440129, 1931.27560413621, 17.102283605472653], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 1552, 2, 0.12886597938144329, 3063.2847938144355, 158, 90008, 2881.5, 4904.0, 5092.099999999999, 5859.810000000003, 0.4315096582260004, 7.337732615019427, 0.1285258259364552], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM", 1547, 2, 0.1292824822236587, 2727.1105365222984, 58, 90013, 2658.0, 4675.6, 4835.2, 5455.16, 0.4301980690864173, 0.15414158061430727, 0.12477424464713469], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC", 1552, 1, 0.06443298969072164, 2538.0393041237076, 51, 90007, 2612.5, 4656.1, 4822.449999999999, 5472.750000000001, 0.4315742142193137, 1.764855485031577, 0.1285450540399323], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC", 1553, 2, 0.128783000643915, 2530.4198325821026, 47, 90001, 2566.0, 4615.200000000001, 4781.799999999999, 5132.76, 0.4317939355890234, 4.774938684670314, 0.1281888246279913], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 1552, 0, 0.0, 2696.284149484541, 179, 80357, 2857.0, 4877.7, 5054.799999999999, 5620.6100000000015, 0.4318113652083573, 21.63906270084654, 0.12819399904623108], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM", 1553, 1, 0.0643915003219575, 2574.7256922086344, 55, 90002, 2662.0, 4662.6, 4825.2, 5947.040000000001, 0.4314369461709485, 7.701575100795949, 0.1247122422525398], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 1550, 1, 0.06451612903225806, 2812.364516129036, 52, 90009, 2586.5, 4638.9, 4815.049999999998, 25466.14000000002, 0.4254155898620446, 3.1201325401997146, 0.12671069815226912], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal", 75300, 60, 0.0796812749003984, 2820.472815405013, 45, 90028, 2644.0, 4470.0, 4743.0, 16588.960000000006, 20.67986497943136, 330.26240267092265, 5.149771064213865], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 1552, 1, 0.06443298969072164, 2697.7500000000023, 191, 90004, 2815.0, 4897.0, 5033.049999999999, 5880.820000000005, 0.43145003908626, 25.431650608971438, 0.1251373648521672], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 1543, 2, 0.12961762799740764, 2880.9034348671407, 175, 90012, 2826.0, 4896.400000000001, 5085.0, 6753.159999999968, 0.42414778045363194, 11.75086485309588, 0.12633307913902125], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 1552, 1, 0.06443298969072164, 2798.7487113402053, 185, 90009, 2819.0, 4910.0, 5049.7, 5767.040000000001, 0.4318691614531173, 25.455934134370164, 0.12483717948254172], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM", 1552, 2, 0.12886597938144329, 2494.8730670103128, 57, 90007, 2651.0, 4646.0, 4833.35, 5264.82, 0.43165151482703484, 7.700934544998419, 0.12519580068713804], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 75417, 60, 0.07955765941366005, 2599.440338385215, 27, 90045, 2540.0, 4364.9000000000015, 4664.0, 13426.700000000048, 20.730830709348623, 1183.3408941295186, 5.243442532930951], "isController": false}, {"data": ["WIFSGriddedHighResItemSector", 75365, 76, 0.10084256617793405, 2797.7095866781906, 26, 90033, 2616.0, 4426.0, 4691.0, 16527.94000000001, 20.718102945866, 307.9991546502334, 5.26045582609879], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 1540, 2, 0.12987012987012986, 2760.1402597402616, 184, 90005, 2770.0, 4867.6, 5037.749999999999, 6400.00999999998, 0.4286193003374403, 0.15357571737372153, 0.12431634003927712], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 213, 100.0, 0.0870524767042668], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 244680, 213, "504/Gateway Time-out", 213, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 1552, 2, "504/Gateway Time-out", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM", 1547, 2, "504/Gateway Time-out", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC", 1552, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC", 1553, 2, "504/Gateway Time-out", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM", 1553, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 1550, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal", 75300, 60, "504/Gateway Time-out", 60, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 1552, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 1543, 2, "504/Gateway Time-out", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 1552, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM", 1552, 2, "504/Gateway Time-out", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 75417, 60, "504/Gateway Time-out", 60, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResItemSector", 75365, 76, "504/Gateway Time-out", 76, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 1540, 2, "504/Gateway Time-out", 2, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
