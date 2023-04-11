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

    var data = {"OkPercent": 99.38092553682161, "KoPercent": 0.6190744631783939};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8971531799313278, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9302224886757261, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.003948312993539124, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.9656137544982007, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.0070842654735272185, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.9673283154599347, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.9684732671948865, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.9310448158753413, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.9652440242359678, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.9677795548447288, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.9109834888729361, 500, 1500, "WIFSGriddedLowResItemGlobal"], "isController": false}, {"data": [0.9376665778251599, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.9298947087831534, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.003787878787878788, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.00299625468164794, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.9372585586785667, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.0026435045317220545, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.966060484945377, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.9300071787508973, 500, 1500, "WIFSGriddedHighResItemGlobal"], "isController": false}, {"data": [0.9174443646805456, 500, 1500, "WIFSGriddedHighResItemSector"], "isController": false}, {"data": [0.9374250299880048, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 195130, 1208, 0.6190744631783939, 1748.1301440065392, 2, 60007, 238.0, 358.0, 3116.4000000000233, 43405.21000000012, 53.777176242134814, 90.38842696592054, 15.914199131350333], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 15012, 1, 0.006661337596589395, 376.2828403943516, 217, 60001, 289.0, 585.7000000000007, 756.0, 1119.0, 4.172410726197358, 1.4872164312123393, 1.246833674039445], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 1393, 134, 9.619526202440776, 25678.368987796086, 1320, 60004, 25146.0, 59473.00000000001, 60001.0, 60002.0, 0.38471820841176835, 0.1100443623005707, 0.13562819652016442], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM", 15006, 0, 0.0, 179.03798480607682, 73, 41898, 102.0, 385.3000000000011, 558.6499999999996, 832.9300000000003, 4.172580092627608, 1.49544618554134, 1.2142860035185812], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 1352, 161, 11.908284023668639, 28892.909763313604, 4700, 60005, 29460.0, 60001.0, 60002.0, 60003.0, 0.3741454429527824, 0.10701177781558283, 0.131170130878954], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 1341, 146, 10.887397464578672, 26710.55853840415, 989, 60006, 28540.0, 60001.0, 60002.0, 60003.0, 0.3716987826241213, 0.10631569822757056, 0.12595652106500985], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC", 15013, 0, 0.0, 169.40444947711956, 72, 6245, 99.0, 351.60000000000036, 549.0, 847.1600000000035, 4.172602844807413, 1.487304724955767, 1.2468910844834649], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC", 15019, 0, 0.0, 169.12770490711853, 73, 10789, 99.0, 342.0, 543.0, 803.1999999999971, 4.17204990459481, 1.4830333645239366, 1.2426515829115403], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 15017, 4, 0.026636478657521476, 381.7632682959309, 218, 60003, 290.0, 584.0, 755.0, 1079.0, 4.1498419871047325, 1.4750614224006906, 1.2360369199872496], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 1381, 152, 11.006517016654598, 26119.661839246935, 2, 60006, 26033.0, 60000.0, 60002.0, 60003.0, 0.3814572551043041, 0.10915930599984476, 0.1348510999489825], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM", 15019, 0, 0.0, 179.46820693787774, 72, 41653, 102.0, 385.0, 555.0, 805.5999999999985, 4.172528598448228, 1.4913529951484874, 1.2101962829483628], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 15006, 1, 0.006664001066240171, 173.50359856057585, 73, 60001, 100.0, 342.0, 550.6499999999996, 837.0, 4.172597496163441, 1.487282995681559, 1.2468894861582156], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal", 1393, 0, 0.0, 281.0696338837041, 58, 6440, 161.0, 624.6000000000001, 768.5999999999999, 1421.8599999999956, 0.3876598923123676, 6.223436652950612, 0.085557749670503], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 15008, 3, 0.019989339019189766, 379.1987606609783, 213, 60002, 286.0, 555.1000000000004, 744.0, 1071.4599999999991, 4.171772046903527, 1.4950955058489033, 1.2140508495871591], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 15006, 3, 0.019992003198720514, 379.2241103558594, 212, 60002, 290.0, 594.0, 755.0, 1106.7900000000009, 4.172112571971445, 1.4870705080873257, 1.2467445771711543], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 1320, 137, 10.378787878787879, 26493.847727272743, 1129, 60007, 27497.5, 60000.0, 60002.0, 60003.0, 0.36780420333330915, 0.105203572225182, 0.12391840834960124], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 1335, 153, 11.460674157303371, 26841.51685393262, 1254, 60004, 27283.0, 60001.0, 60002.0, 60003.0, 0.3710680338647528, 0.10613320998448185, 0.12610515213372459], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 15014, 3, 0.019981350739309976, 375.07892633541996, 215, 60002, 285.0, 557.0, 746.0, 1110.7000000000007, 4.171987938080963, 1.4910995092690156, 1.2100394703223105], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 1367, 174, 12.728602779809803, 28495.825164594004, 4, 60004, 30060.0, 60001.0, 60002.0, 60003.0, 0.37748739200394993, 0.10801746191574713, 0.13381633134515022], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 1324, 135, 10.196374622356496, 25525.19864048337, 3, 60005, 25506.5, 59772.0, 60002.0, 60003.0, 0.36868381826115454, 0.10566902407457995, 0.1256549341534599], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM", 15012, 0, 0.0, 179.96203037570018, 73, 41950, 102.0, 387.0, 553.0, 797.869999999999, 4.1725081410047595, 1.4954203981921357, 1.2142650644720883], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 1393, 0, 0.0, 209.66690595836275, 38, 5002, 100.0, 565.0, 673.3, 1046.319999999996, 0.3875396407426851, 58.672978941564004, 0.08704503649493903], "isController": false}, {"data": ["WIFSGriddedHighResItemSector", 1393, 0, 0.0, 371.3496051687005, 35, 36252, 109.0, 614.6000000000001, 740.5999999999999, 2165.7999999999984, 0.38762127425833, 7.594612491248608, 0.08744190854850999], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 15006, 1, 0.006664001066240171, 364.4242969478868, 217, 60002, 286.0, 562.0, 749.0, 1105.8600000000006, 4.172219292023932, 1.4952965111498293, 1.2141810049054023], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503/Service Unavailable", 6, 0.4966887417218543, 0.0030748731614820887], "isController": false}, {"data": ["504/Gateway Time-out", 1202, 99.50331125827815, 0.6159995900169118], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 195130, 1208, "504/Gateway Time-out", 1202, "503/Service Unavailable", 6, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 15012, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 1393, 134, "504/Gateway Time-out", 134, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 1352, 161, "504/Gateway Time-out", 161, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 1341, 146, "504/Gateway Time-out", 146, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 15017, 4, "504/Gateway Time-out", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 1381, 152, "504/Gateway Time-out", 151, "503/Service Unavailable", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 15006, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 15008, 3, "504/Gateway Time-out", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 15006, 3, "504/Gateway Time-out", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 1320, 137, "504/Gateway Time-out", 137, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 1335, 153, "504/Gateway Time-out", 153, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 15014, 3, "504/Gateway Time-out", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 1367, 174, "504/Gateway Time-out", 173, "503/Service Unavailable", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 1324, 135, "504/Gateway Time-out", 131, "503/Service Unavailable", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 15006, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
