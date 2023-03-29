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

    var data = {"OkPercent": 98.62704883771478, "KoPercent": 1.3729511622852237};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9577400226270822, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9827453180893596, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [3.246753246753247E-4, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.9995264819361628, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [3.3311125916055963E-4, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.9992985901662341, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.9993513551418253, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.9827489481065919, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.9994916026787279, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.9991231146965976, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.9847600518806745, 500, 1500, "WIFSGriddedLowResItemGlobal"], "isController": false}, {"data": [0.9828505295644245, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.9829358119957909, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [3.3444816053511704E-4, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.9827132788667204, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.9992109139370134, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.9899546338302009, 500, 1500, "WIFSGriddedHighResItemGlobal"], "isController": false}, {"data": [0.9912451361867705, 500, 1500, "WIFSGriddedHighResItemSector"], "isController": false}, {"data": [0.9828130480533146, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 358862, 4927, 1.3729511622852237, 953.4320295824127, 1, 60063, 121.0, 243.0, 403.0, 50351.88000000002, 98.15898899485384, 12766.560528949267, 28.901270766028226], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 28514, 3, 0.01052114750648804, 209.21354422389027, 99, 60003, 153.0, 227.0, 289.0, 464.9900000000016, 7.9968521894867495, 2.8503804978884655, 2.381874919720175], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 1540, 743, 48.246753246753244, 18118.991558441583, 1, 58555, 2718.0, 48189.1, 51129.149999999994, 55620.83999999998, 0.42355435261229896, 287.3752736966456, 0.14890582709026137], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM", 28510, 1, 0.00350754121360926, 78.90140301648557, 35, 60001, 54.0, 82.0, 101.0, 155.9900000000016, 7.996802401004158, 2.8660209417314717, 2.319385071384995], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 1514, 508, 33.55350066050198, 32417.896961690858, 1, 60063, 46772.0, 57022.5, 59864.25, 60002.0, 0.4164434082564719, 7499.439391223225, 0.145592519683415], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 1501, 753, 50.16655562958028, 18510.219187208568, 1, 60002, 9.0, 49073.59999999999, 52700.7, 56965.08, 0.41471305779735146, 25.698214517909886, 0.14012765429480822], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC", 28514, 0, 0.0, 76.57410394893715, 34, 5198, 54.0, 82.90000000000146, 103.0, 161.9900000000016, 7.997269361909674, 2.8505891768525693, 2.381999175178174], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC", 28521, 1, 0.0035061884225658286, 78.76273622944524, 35, 60001, 54.0, 82.0, 102.0, 158.0, 7.976570066481207, 2.835401726271165, 2.368044238486608], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 28520, 3, 0.010518934081346423, 210.2219495091163, 97, 60002, 153.0, 227.0, 288.0, 466.0, 7.859033410536671, 2.7935826562540904, 2.333150543753074], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 1533, 454, 29.615133724722767, 28520.171559034537, 1, 60001, 40922.0, 51999.0, 54192.4, 57365.12, 0.4220691796990506, 1411.8521443292816, 0.14879587292124732], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM", 28521, 2, 0.007012376845131657, 81.51207881911593, 35, 60001, 54.0, 82.0, 101.0, 159.0, 7.862665118448606, 2.8102486647790865, 2.27280163580155], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 28510, 0, 0.0, 79.15755875131514, 36, 34232, 54.0, 82.0, 103.0, 161.0, 7.996887637137085, 2.850453112846715, 2.381885477858214], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal", 1542, 2, 0.1297016861219196, 231.19325551232134, 45, 60002, 126.0, 270.70000000000005, 413.94999999999936, 908.6499999999971, 0.4217949261516957, 6.792761572006713, 0.09267954920325346], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 28514, 6, 0.02104229501297608, 214.61902924878927, 98, 60002, 153.0, 228.0, 290.0, 453.0, 7.864937340330518, 2.81866004067624, 2.281139052810707], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 28510, 3, 0.01052262364082778, 208.7043493511055, 97, 60001, 153.0, 226.0, 283.0, 460.0, 7.992563075648166, 2.8488516871253573, 2.380597400461612], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 1476, 448, 30.352303523035232, 29192.07520325203, 1, 59602, 41103.5, 52178.1, 54158.1, 58066.18, 0.41033430847965857, 486.27438302728655, 0.1378466817548853], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 1495, 458, 30.63545150501672, 27919.777257525035, 1, 59022, 40199.0, 51484.200000000004, 53893.0, 57189.92, 0.4133207042431863, 112.14450034814321, 0.14006082458240787], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 28519, 8, 0.028051474455626075, 219.41333847610255, 99, 60010, 153.0, 231.0, 292.0, 467.0, 7.845367123513022, 2.80394678941438, 2.2678014341404826], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 1520, 772, 50.78947368421053, 19623.921710526316, 1, 60003, 5.0, 52551.5, 54690.5, 57551.8, 0.41780876892646235, 2711.9670724170487, 0.14770192807751892], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 1479, 754, 50.98039215686274, 19124.368492224457, 1, 60002, 4.0, 50380.0, 52676.0, 56954.0, 0.410344567359767, 204.0038446913787, 0.13945303656367083], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM", 28514, 0, 0.0, 77.77197166304308, 34, 5117, 54.0, 83.0, 105.0, 160.0, 7.997294034760211, 2.86621768628613, 2.3195276643786937], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 1543, 1, 0.06480881399870382, 142.1121192482179, 28, 60002, 78.0, 179.0, 320.0, 694.9199999999996, 0.4225358669420042, 59.02335009567987, 0.09449288430636617], "isController": false}, {"data": ["WIFSGriddedHighResItemSector", 1542, 0, 0.0, 103.79247730220483, 28, 2748, 77.0, 168.70000000000005, 326.24999999999955, 851.699999999993, 0.4288292266863042, 6.757769036110369, 0.0963190645877441], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 28510, 7, 0.024552788495264818, 218.09316029463528, 99, 60002, 153.0, 227.0, 287.0, 462.9900000000016, 7.867375530723605, 2.8195136184277336, 2.2818462232665144], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503/Service Unavailable", 4806, 97.54414450984372, 1.3392334657890776], "isController": false}, {"data": ["504/Gateway Time-out", 115, 2.334077531966714, 0.03204574460377527], "isController": false}, {"data": ["502/Bad Gateway", 6, 0.12177795818956769, 0.0016719518923708834], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 358862, 4927, "503/Service Unavailable", 4806, "504/Gateway Time-out", 115, "502/Bad Gateway", 6, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 28514, 3, "504/Gateway Time-out", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 1540, 743, "503/Service Unavailable", 743, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM", 28510, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 1514, 508, "503/Service Unavailable", 438, "504/Gateway Time-out", 70, "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 1501, 753, "503/Service Unavailable", 751, "504/Gateway Time-out", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC", 28521, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 28520, 3, "504/Gateway Time-out", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 1533, 454, "503/Service Unavailable", 449, "502/Bad Gateway", 3, "504/Gateway Time-out", 2, "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM", 28521, 2, "504/Gateway Time-out", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal", 1542, 2, "504/Gateway Time-out", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 28514, 6, "504/Gateway Time-out", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 28510, 3, "504/Gateway Time-out", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 1476, 448, "503/Service Unavailable", 447, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 1495, 458, "503/Service Unavailable", 456, "502/Bad Gateway", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 28519, 8, "504/Gateway Time-out", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 1520, 772, "503/Service Unavailable", 771, "504/Gateway Time-out", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 1479, 754, "503/Service Unavailable", 751, "504/Gateway Time-out", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 1543, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 28510, 7, "504/Gateway Time-out", 7, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
