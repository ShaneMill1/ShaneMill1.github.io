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

    var data = {"OkPercent": 99.91228779556214, "KoPercent": 0.0877122044378643};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.656025081958035, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.02960297190619921, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.7181271749446377, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.8819525065963061, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.14317752596789424, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.9021085925144966, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.9013067762672569, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.7165366779089376, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.003740939911152677, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.8807967959527825, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.8964971512977421, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.8007894125841654, 500, 1500, "WIFSGriddedLowResItemGlobal"], "isController": false}, {"data": [0.7448064958346515, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.720580474934037, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.09746865389164892, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.14415584415584415, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.7427788319628927, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.1263892173090565, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.8840556785827269, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.8859995356396564, 500, 1500, "WIFSGriddedHighResItemGlobal"], "isController": false}, {"data": [0.8345716275830044, 500, 1500, "WIFSGriddedHighResItemSector"], "isController": false}, {"data": [0.743377308707124, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 160753, 141, 0.0877122044378643, 2119.9104402406383, 26, 57869, 481.0, 6388.500000000007, 12982.850000000017, 25766.88000000018, 44.38707903127249, 236.26557821280176, 13.306167327156626], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 4307, 0, 0.0, 7476.4873461806455, 812, 45059, 5275.0, 16405.4, 21289.199999999997, 31154.520000000033, 1.1895838086236676, 0.3403789608659518, 0.4193747606573673], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 9483, 0, 0.0, 566.0496678266367, 169, 5592, 560.0, 851.0, 962.0, 1190.0, 2.6358206441208525, 0.9395259131876086, 0.7876573409189266], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM", 9475, 0, 0.0, 330.01340369393273, 61, 6102, 315.0, 615.0, 696.1999999999989, 894.0, 2.6360346916075885, 0.9447507146679541, 0.7671272832998647], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 4264, 139, 3.2598499061913695, 18699.29690431512, 4486, 57869, 17382.0, 30420.0, 33363.25, 40585.250000000015, 1.1807137170745214, 0.33810080345090165, 0.4139416254196809], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 4236, 0, 0.0, 5153.693342776203, 635, 36695, 3058.5, 12167.000000000004, 17686.15, 25687.490000000013, 1.1800501326302804, 0.3376510633405002, 0.39988026955342515], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC", 9485, 0, 0.0, 302.08191881918725, 59, 5236, 249.0, 586.0, 670.0, 861.2799999999988, 2.6358036338797888, 0.939519849966917, 0.7876522577804838], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC", 9489, 0, 0.0, 302.09020971651404, 59, 2161, 256.0, 585.0, 667.0, 849.1000000000004, 2.63563785685895, 0.9368868944303298, 0.7850288538495895], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 9488, 0, 0.0, 565.6580944350776, 170, 4379, 559.0, 854.0, 947.0, 1189.2200000000012, 2.6357869190740075, 0.9369398813895886, 0.7850732522632542], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 4277, 0, 0.0, 8434.51087210665, 1272, 43603, 6344.0, 17919.600000000006, 22296.6, 31023.28000000007, 1.1846313129326729, 0.33896188934499333, 0.41878567898596447], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM", 9488, 0, 0.0, 327.90145446880297, 59, 5980, 314.0, 613.0, 692.0, 906.2200000000012, 2.63639041251952, 0.9423036044747503, 0.7646562036311498], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 9478, 0, 0.0, 306.86642751635407, 59, 3223, 265.5, 592.1000000000004, 679.0499999999993, 881.4199999999983, 2.6347611674343745, 0.9391482676890104, 0.7873407394872252], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal", 4307, 0, 0.0, 375.3967959136294, 44, 3974, 401.0, 736.2000000000003, 822.0, 1034.92, 1.1969341588946074, 19.172376389435048, 0.26416710928728643], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 9483, 0, 0.0, 542.6705683855322, 174, 5401, 514.0, 836.6000000000004, 937.0, 1161.1599999999999, 2.635612593019782, 0.9445994351936131, 0.7670044460155224], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 9475, 0, 0.0, 565.2626912928748, 183, 2682, 555.0, 858.0, 960.0, 1216.7199999999993, 2.6354312664227697, 0.9393871213323349, 0.7875409839114917], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 4227, 0, 0.0, 5812.153300212913, 919, 38091, 3549.0, 13702.000000000002, 18968.799999999996, 28040.440000000002, 1.1765472138627155, 0.3366487633415778, 0.3963953015455438], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 4235, 0, 0.0, 5356.527508854781, 670, 38459, 2960.0, 13541.0, 18648.6, 27788.40000000002, 1.1773657754364524, 0.33688298066687555, 0.4001204002459819], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 9486, 0, 0.0, 544.9682690280426, 174, 1923, 519.0, 836.0, 935.0, 1174.1299999999992, 2.6359013318165183, 0.9421287963328572, 0.7645143511225645], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 4269, 0, 0.0, 10865.156242679734, 2399, 48507, 8975.0, 19807.0, 24364.0, 34194.50000000001, 1.1829515319624138, 0.3384812488915891, 0.4193470762718322], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 4229, 0, 0.0, 5540.515724757636, 769, 45050, 3214.0, 13428.0, 18134.0, 27679.59999999999, 1.1769482891390968, 0.33676352413843297, 0.40112788370072733], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM", 9483, 0, 0.0, 328.08161974058856, 59, 3729, 316.0, 614.0, 699.0, 902.0, 2.635980367602931, 0.9447312450295662, 0.7671114741656968], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 4307, 0, 0.0, 272.18202925470166, 30, 4324, 215.0, 624.0, 706.0, 902.3600000000006, 1.1973208035810095, 179.74822271824488, 0.2689294773668283], "isController": false}, {"data": ["WIFSGriddedHighResItemSector", 4307, 0, 0.0, 339.6946830740651, 26, 5684, 362.0, 682.0, 763.0, 960.6800000000003, 1.1971610577711513, 24.935321020773678, 0.2700626995557968], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 9475, 2, 0.021108179419525065, 551.5968337730845, 183, 30927, 518.0, 843.0, 944.0, 1172.6799999999985, 2.635021564070932, 0.9443387261297638, 0.7668324473565797], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 128, 90.78014184397163, 0.07962526360316759], "isController": false}, {"data": ["502/Proxy Error", 13, 9.21985815602837, 0.008086940834696708], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 160753, 141, "502/Bad Gateway", 128, "502/Proxy Error", 13, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 4264, 139, "502/Bad Gateway", 126, "502/Proxy Error", 13, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 9475, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
