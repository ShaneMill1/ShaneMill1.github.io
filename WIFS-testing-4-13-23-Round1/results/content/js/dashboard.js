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

    var data = {"OkPercent": 99.50380798522963, "KoPercent": 0.49619201477036695};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.29024760146384887, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.051713096381684275, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.5526146936156561, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.55376, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.554010866091403, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.055342290467050546, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.5546675191815856, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.5473059653624118, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.9533957845433255, 500, 1500, "WIFSGriddedLowResItemGlobal"], "isController": false}, {"data": [0.05323925593329057, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.05343388960205391, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.05824, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.5550576184379001, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.9768149882903981, 500, 1500, "WIFSGriddedHighResItemGlobal"], "isController": false}, {"data": [0.9838407494145199, 500, 1500, "WIFSGriddedHighResItemSector"], "isController": false}, {"data": [0.056019261637239165, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 60662, 301, 0.49619201477036695, 5622.478668688749, 12, 60010, 1633.0, 18989.500000000022, 29335.500000000007, 60001.0, 16.674661040826283, 124.7819947481085, 5.024750311814952], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 3123, 3, 0.09606147934678194, 1997.3080371437718, 12, 60001, 1771.0, 2664.7999999999997, 2923.399999999999, 3650.719999999995, 0.8677494779749177, 0.3092417390312215, 0.2593079494729735], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 2135, 37, 1.7330210772833723, 16218.744262295091, 1761, 60003, 13401.0, 31648.600000000002, 39075.6, 60002.0, 0.5875093045238217, 0.16809574664589974, 0.2071199794268551], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM", 3117, 0, 0.0, 681.2380494064803, 67, 11329, 583.0, 1006.0, 1319.1999999999998, 1974.8200000000002, 0.8663745767842188, 0.3105072946091878, 0.2521285389469699], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 2104, 57, 2.709125475285171, 21874.428231939157, 6396, 60005, 18679.5, 37862.0, 44826.75, 60002.0, 0.5816978610438823, 0.1664193556541917, 0.2039350899558142], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 2089, 29, 1.3882240306366682, 15232.85064624223, 1618, 60009, 12488.0, 31091.0, 38127.5, 60001.0, 0.5794793839598775, 0.16580020998846035, 0.1963665490567163], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC", 3125, 1, 0.032, 688.21952, 65, 60001, 585.0, 968.4000000000001, 1233.0, 1871.9599999999991, 0.8684125696119516, 0.3095217790925158, 0.2595060999035715], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC", 3129, 2, 0.06391818472355384, 690.3480345158173, 66, 60001, 585.0, 991.0, 1285.5, 1871.399999999996, 0.8691246589748162, 0.30890352669412646, 0.25887013768292866], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 3126, 2, 0.06397952655150352, 1964.7066538707609, 197, 60000, 1765.0, 2620.0, 2909.949999999999, 3598.9500000000003, 0.8683338157410087, 0.3086264735424853, 0.25863458379004656], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 2128, 33, 1.550751879699248, 16819.37030075194, 2507, 60004, 14162.5, 31532.100000000024, 38367.6, 60001.0, 0.5857132751858773, 0.16758291666976313, 0.2070587945481324], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM", 3128, 0, 0.0, 673.9341432225066, 67, 5769, 584.0, 981.0999999999999, 1330.849999999998, 1960.9700000000003, 0.8689726481969234, 0.31058983324225975, 0.252036012221178], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 3118, 0, 0.0, 669.1626042334822, 66, 2761, 586.0, 963.1999999999998, 1221.0499999999997, 1844.9099999999994, 0.8666901082528745, 0.3089276264768547, 0.2589913800052535], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal", 2135, 0, 0.0, 253.0665105386418, 119, 1375, 180.0, 489.8000000000002, 628.5999999999995, 840.4799999999991, 0.593652010923197, 9.580857654412782, 0.13102085397328372], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 3118, 3, 0.09621552277100706, 1979.0862732520816, 37, 60002, 1773.0, 2641.2999999999997, 2955.0999999999995, 3627.6799999999985, 0.8667819039957033, 0.31058812545625586, 0.2522470775299996], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 3116, 1, 0.03209242618741977, 1998.1883825417185, 196, 60001, 1779.5, 2655.6000000000004, 2930.0, 3777.279999999999, 0.865959670068254, 0.30864745344702527, 0.258773104532115], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 2061, 29, 1.4070839398350314, 16465.03736050459, 1898, 60003, 14279.0, 32192.0, 38770.899999999994, 60002.0, 0.5730784908988685, 0.16396868568160192, 0.19307820250010704], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 2082, 17, 0.8165225744476465, 15406.352065321844, 1660, 60004, 13229.0, 29897.8, 36511.299999999996, 59042.34, 0.5769806342907184, 0.165088490888722, 0.19608326243473634], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 3125, 1, 0.032, 1923.1379199999965, 194, 60002, 1760.0, 2559.8, 2852.7, 3425.4399999999987, 0.868394953249784, 0.31036327079778125, 0.2518684581202987], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 2118, 42, 1.9830028328611897, 19636.95561850805, 3884, 60010, 17136.0, 36216.3, 41864.95, 60002.0, 0.5853720014194856, 0.16748280124271325, 0.20750980128444657], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 2076, 38, 1.8304431599229287, 16481.673410404626, 1843, 60008, 14302.5, 31215.299999999992, 39575.35, 60002.0, 0.5763047152885369, 0.164889387352832, 0.19641635315986267], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM", 3124, 0, 0.0, 671.3991677336745, 65, 9997, 583.0, 1000.5, 1234.75, 1813.75, 0.8682181573209078, 0.31116803099294255, 0.2526650496890923], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 2135, 5, 0.234192037470726, 212.5611241217798, 21, 1214, 172.0, 375.4000000000001, 472.0, 704.5599999999995, 0.593672480207905, 97.21136386102891, 0.1333444047341974], "isController": false}, {"data": ["WIFSGriddedHighResItemSector", 2135, 0, 0.0, 173.40702576112443, 73, 1024, 126.0, 348.4000000000001, 444.39999999999964, 713.8399999999992, 0.5936799089264432, 14.381289959124373, 0.1339258388300863], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 3115, 1, 0.03210272873194221, 1962.3499197431775, 194, 60000, 1764.0, 2672.4, 2949.3999999999996, 3561.5600000000013, 0.8660377258822395, 0.3103662048517018, 0.2520305100711986], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 10, 3.3222591362126246, 0.01648478454386601], "isController": false}, {"data": ["504/Gateway Time-out", 291, 96.67774086378738, 0.4797072302265009], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 60662, 301, "504/Gateway Time-out", 291, "502/Bad Gateway", 10, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 3123, 3, "504/Gateway Time-out", 2, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 2135, 37, "504/Gateway Time-out", 37, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 2104, 57, "504/Gateway Time-out", 55, "502/Bad Gateway", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 2089, 29, "504/Gateway Time-out", 29, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC", 3125, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC", 3129, 2, "504/Gateway Time-out", 1, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 3126, 2, "504/Gateway Time-out", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 2128, 33, "504/Gateway Time-out", 33, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 3118, 3, "504/Gateway Time-out", 2, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 3116, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 2061, 29, "504/Gateway Time-out", 29, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 2082, 17, "504/Gateway Time-out", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 3125, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 2118, 42, "504/Gateway Time-out", 42, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 2076, 38, "504/Gateway Time-out", 38, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 2135, 5, "502/Bad Gateway", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 3115, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
