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

    var data = {"OkPercent": 99.95719477931964, "KoPercent": 0.04280522068036952};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6422106172512823, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6420923632610939, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.030018472906403942, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.8964382500967867, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.09990633780830471, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.9147646679561573, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.916430412371134, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.6450302952172231, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.005084745762711864, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.898349877529973, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.9163763066202091, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.8536472760849492, 500, 1500, "WIFSGriddedLowResItemGlobal"], "isController": false}, {"data": [0.6805161290322581, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.6424054716737644, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.05508341202392194, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.08020050125313283, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.6800773694390716, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.07304429783223375, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.8977170127692506, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.9013542628501078, 500, 1500, "WIFSGriddedHighResItemGlobal"], "isController": false}, {"data": [0.8561095721760542, 500, 1500, "WIFSGriddedHighResItemSector"], "isController": false}, {"data": [0.6772715539494063, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 128489, 55, 0.04280522068036952, 2650.542715718863, 44, 60003, 438.0, 6566.500000000007, 14138.90000000003, 35143.890000000014, 35.261357050021076, 42294.42318788619, 10.526288605915523], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 7752, 8, 0.10319917440660474, 765.2329721362206, 216, 31530, 582.0, 1243.0, 1547.3499999999995, 2449.4700000000003, 2.1546033523093335, 0.7678071803713188, 0.6417519750530729], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 3248, 2, 0.06157635467980296, 10326.368842364538, 795, 60000, 6869.0, 23802.0, 30188.6, 45416.009999999944, 0.8978070068750788, 1184.2660395326013, 0.3156352758545199], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM", 7749, 0, 0.0, 352.34494773519106, 75, 16184, 204.0, 755.0, 1021.5, 1664.0, 2.1553744312901735, 0.7724828284018492, 0.6251427793878725], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 3223, 10, 0.31026993484331367, 16490.23921811973, 4591, 60002, 13364.0, 29971.0, 36231.19999999998, 51116.32, 0.8930840161237272, 23235.691473531562, 0.3122305446995062], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 3203, 0, 0.0, 9017.835154542587, 630, 56782, 5411.0, 22328.199999999997, 29327.999999999996, 44312.20000000001, 0.8907480670794754, 66.20577280633475, 0.3009754211030259], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC", 7755, 0, 0.0, 314.93139909735663, 75, 9455, 192.0, 677.0, 938.1999999999998, 1471.4399999999996, 2.155141868362101, 0.7681902167501627, 0.6419123729008209], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC", 7760, 0, 0.0, 313.5131443298972, 75, 16339, 193.0, 669.9000000000005, 934.0, 1461.1200000000026, 2.155520228974025, 0.7662200813931105, 0.6399200679766637], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 7757, 4, 0.05156632718834601, 741.0511795797352, 216, 30612, 576.0, 1216.0, 1531.0, 2335.2000000000007, 2.154925144339981, 0.765980604232593, 0.6397434022259318], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 3245, 1, 0.030816640986132512, 11221.005546995333, 1256, 59976, 7630.0, 25214.200000000004, 31644.499999999985, 45653.619999999995, 0.891470536280653, 4323.1956026593225, 0.31427818710675365], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM", 7757, 2, 0.025783163594173004, 360.3710197241205, 75, 31059, 202.0, 761.1999999999998, 1015.0999999999995, 1671.7200000000012, 2.1550843961276827, 0.7702260119408956, 0.6229540832556583], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 7749, 0, 0.0, 323.7514518002331, 75, 31584, 191.0, 678.0, 939.5, 1587.0, 2.155330667610128, 0.7682575133571257, 0.6419686070518448], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal", 3249, 0, 0.0, 506.67497691597566, 60, 33213, 192.0, 981.0, 1309.5, 3255.5, 0.9024984958358403, 40.56267355222811, 0.19830289215142977], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 7750, 5, 0.06451612903225806, 704.0637419354837, 215, 46474, 542.0, 1122.0, 1444.0, 2315.9199999999983, 2.154440886450957, 0.7720260827733408, 0.6248720149179047], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 7749, 8, 0.10323912762937153, 762.4763195251005, 228, 33589, 578.0, 1237.0, 1533.0, 2406.0, 2.1546678352497985, 0.7678300853143079, 0.641771181397645], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 3177, 0, 0.0, 9841.944287063256, 882, 58443, 6323.0, 23810.400000000023, 29852.899999999998, 43603.17999999985, 0.8837301032075481, 1389.1636310031129, 0.2968780815462857], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 3192, 1, 0.03132832080200501, 9557.968045112826, 657, 60002, 6115.5, 23861.4, 30132.999999999993, 43311.32000000004, 0.8894013286964837, 180.12990982072725, 0.3013889268141405], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 7755, 6, 0.07736943907156674, 710.0560928433241, 218, 32053, 542.0, 1119.0, 1446.1999999999998, 2411.879999999999, 2.1551478575940544, 0.7701520654125587, 0.6229724275857814], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 3237, 4, 0.1235712079085573, 13287.80413963544, 2494, 60003, 9702.0, 27004.4, 34127.7, 47053.73999999999, 0.8909278117277146, 11493.816075544097, 0.31495690219280537], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 3183, 0, 0.0, 9370.611058749624, 736, 57218, 5986.0, 22703.6, 29136.599999999995, 42831.999999999985, 0.8870713324630763, 463.27270509309375, 0.3014656481417486], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM", 7753, 2, 0.025796465884173867, 361.90184444731017, 73, 30722, 204.0, 765.6000000000004, 1036.2999999999993, 1733.46, 2.1547854691918205, 0.7722228905552136, 0.6249719573730182], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 3249, 0, 0.0, 356.52631578947336, 44, 19723, 116.0, 747.0, 1049.0, 3699.5, 0.9025940202104387, 183.65658260843142, 0.20184963928534222], "isController": false}, {"data": ["WIFSGriddedHighResItemSector", 3249, 0, 0.0, 474.4481378885816, 44, 20306, 154.0, 960.0, 1328.0, 5701.5, 0.9025732087158181, 27.853126711076285, 0.20272640430140446], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 7748, 2, 0.02581311306143521, 690.7252194114594, 213, 30577, 544.0, 1131.0, 1436.0999999999985, 2284.5300000000007, 2.154933247966678, 0.7722758193571857, 0.6250148189903353], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 42, 76.36363636363636, 0.032687623065009455], "isController": false}, {"data": ["504/Gateway Time-out", 12, 21.818181818181817, 0.009339320875716987], "isController": false}, {"data": ["502/Proxy Error", 1, 1.8181818181818181, 7.782767396430823E-4], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 128489, 55, "502/Bad Gateway", 42, "504/Gateway Time-out", 12, "502/Proxy Error", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 7752, 8, "502/Bad Gateway", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 3248, 2, "504/Gateway Time-out", 1, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 3223, 10, "504/Gateway Time-out", 8, "502/Bad Gateway", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 7757, 4, "502/Bad Gateway", 3, "502/Proxy Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 3245, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM", 7757, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 7750, 5, "502/Bad Gateway", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 7749, 8, "502/Bad Gateway", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 3192, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 7755, 6, "502/Bad Gateway", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 3237, 4, "502/Bad Gateway", 2, "504/Gateway Time-out", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM", 7753, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 7748, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
