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

    var data = {"OkPercent": 94.41309862402952, "KoPercent": 5.5869013759704815};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.2510800215235606, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.058912896691424715, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.5524357239512855, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.5530047265361242, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.5512129380053908, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.06456507080242752, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.552596089008766, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.5508961785593507, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.6257374631268436, 500, 1500, "WIFSGriddedLowResItemGlobal"], "isController": false}, {"data": [0.06450523471800068, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.06410690121786197, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.06776803776129467, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.5523295070898042, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.6532079646017699, 500, 1500, "WIFSGriddedHighResItemGlobal"], "isController": false}, {"data": [0.7063053097345132, 500, 1500, "WIFSGriddedHighResItemSector"], "isController": false}, {"data": [0.06393775372124492, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 65045, 3634, 5.5869013759704815, 5252.823537550895, 1, 60004, 1715.0, 14080.800000000003, 20373.700000000004, 30572.93000000001, 17.77234836261875, 147.75825642234253, 5.377977771722662], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 2962, 2, 0.0675219446320054, 2080.644834571237, 328, 60000, 1676.0, 2530.0, 4177.099999999996, 10903.719999999961, 0.8231886861302712, 0.29337805261751493, 0.24599193159752245], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 2712, 384, 14.15929203539823, 9663.566740412987, 1711, 60002, 5566.5, 30254.0, 30667.0, 60000.0, 0.74154787180956, 0.22118895030098037, 0.26142459152661246], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM", 2956, 0, 0.0, 694.1789580514189, 106, 11994, 578.0, 742.3000000000002, 1092.15, 3993.589999999998, 0.8226313796023597, 0.29482980108795503, 0.2393985850795929], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 2670, 985, 36.89138576779026, 22839.53558052437, 2, 60003, 24120.0, 31093.9, 31549.45, 32038.29, 0.7330394037506909, 0.2224379715166146, 0.25699330658837694], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 2668, 369, 13.830584707646176, 11332.064467766106, 2, 60003, 7602.0, 30159.0, 30563.55, 30996.0, 0.7338672299950351, 0.22204515420357665, 0.2486835242268332], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC", 2962, 0, 0.0, 690.7781904118834, 108, 16642, 579.0, 759.3000000000025, 1144.85, 3533.7999999999847, 0.8236561155076205, 0.2935883614846499, 0.24613161264192565], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC", 2968, 0, 0.0, 704.3042452830184, 113, 16656, 577.0, 720.0, 1126.5499999999997, 3959.0999999999995, 0.8243418596796843, 0.2930277704330128, 0.24553151093974973], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 2966, 1, 0.033715441672285906, 2071.4935940660785, 328, 60002, 1664.0, 2512.7000000000035, 4077.0500000000034, 11494.55999999999, 0.824187427890547, 0.2929533364307516, 0.24548551319005552], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 2687, 365, 13.58392259024935, 11487.28395980648, 705, 60004, 7826.0, 30222.2, 30620.0, 30987.84, 0.7351557096455056, 0.22214437099043285, 0.2598890301676494], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM", 2966, 0, 0.0, 714.6962238705337, 100, 20236, 577.0, 745.3000000000002, 1110.8500000000008, 4683.32, 0.8248546562155413, 0.2948210978270392, 0.2392400711875154], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 2957, 0, 0.0, 710.2340209671966, 104, 21605, 578.0, 772.4000000000005, 1143.1999999999998, 3781.8400000000074, 0.8220940629072938, 0.29303157515738504, 0.24566482739221868], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal", 2712, 3, 0.11061946902654868, 1096.6474926253645, 119, 8402, 454.0, 3059.4000000000005, 4096.049999999997, 5940.61, 0.7537654922155369, 12.173620981498141, 0.16635839964913215], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 2961, 1, 0.033772374197906116, 2089.115501519758, 331, 60002, 1677.0, 2574.6000000000004, 4243.100000000002, 11870.760000000011, 0.8229091687255607, 0.2949090051025371, 0.23947942605489952], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 2956, 1, 0.03382949932341001, 2092.9878213802494, 323, 60001, 1667.0, 2498.800000000001, 3948.7000000000016, 12263.629999999994, 0.8219638986559666, 0.2929653556363338, 0.24562593065305255], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 2644, 354, 13.388804841149772, 12043.833585476536, 1, 60003, 8750.5, 30168.5, 30632.75, 31003.1, 0.7307567616420138, 0.21886756859550707, 0.24620222926415503], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 2662, 346, 12.997746055597295, 11646.469947407973, 2, 60003, 8111.0, 30118.100000000002, 30501.4, 30979.37, 0.7327257563287741, 0.21848382092259586, 0.24901226875235685], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 2966, 1, 0.033715441672285906, 2052.2434254888726, 307, 60001, 1670.0, 2439.7000000000016, 3940.9000000000005, 11692.569999999983, 0.824037444528194, 0.2945089310892436, 0.23900304787585316], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 2671, 384, 14.376637963309621, 15008.427555222768, 1, 60003, 12586.0, 30267.0, 30653.0, 30970.0, 0.7410202275495285, 0.2227904359389262, 0.26268588144578014], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 2657, 418, 15.73202860368837, 12355.9394053444, 2, 60004, 8811.0, 30280.0, 30688.0, 31306.780000000006, 0.7329875574189679, 0.22024099741895686, 0.24981704837814434], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM", 2962, 0, 0.0, 707.3666441593518, 102, 17153, 575.0, 727.4000000000005, 1127.2999999999984, 3805.949999999996, 0.8235413836496173, 0.2951559451166109, 0.2396634104761582], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 2712, 14, 0.5162241887905604, 1057.6025073746273, 38, 10611, 486.5, 2987.400000000006, 4854.149999999994, 6318.889999999995, 0.7538679513555029, 117.21605812139136, 0.16932580938648992], "isController": false}, {"data": ["WIFSGriddedHighResItemSector", 2712, 2, 0.07374631268436578, 792.0368731563419, 73, 8393, 359.0, 2118.100000000001, 2923.35, 5153.659999999987, 0.7538298140247368, 15.617712756964378, 0.1700534053122209], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 2956, 4, 0.13531799729364005, 2150.1566305818715, 17, 60002, 1667.0, 2601.1000000000013, 4341.100000000005, 12422.22999999999, 0.8217682974801237, 0.2944349561948291, 0.2391474146963641], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503/Service Unavailable", 18, 0.4953219592735278, 0.027673149358136674], "isController": false}, {"data": ["502/Bad Gateway", 1958, 53.880022014309304, 3.010223691290645], "isController": false}, {"data": ["504/Gateway Time-out", 114, 3.1370390753990094, 0.17526327926819893], "isController": false}, {"data": ["502/Proxy Error", 1382, 38.02971931755641, 2.1246829118302712], "isController": false}, {"data": ["500/INTERNAL SERVER ERROR", 162, 4.45789763346175, 0.24905834422323006], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 65045, 3634, "502/Bad Gateway", 1958, "502/Proxy Error", 1382, "500/INTERNAL SERVER ERROR", 162, "504/Gateway Time-out", 114, "503/Service Unavailable", 18], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 2962, 2, "504/Gateway Time-out", 1, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 2712, 384, "502/Bad Gateway", 190, "502/Proxy Error", 148, "504/Gateway Time-out", 30, "500/INTERNAL SERVER ERROR", 16, "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 2670, 985, "502/Bad Gateway", 714, "502/Proxy Error", 220, "500/INTERNAL SERVER ERROR", 45, "504/Gateway Time-out", 5, "503/Service Unavailable", 1], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 2668, 369, "502/Proxy Error", 164, "502/Bad Gateway", 144, "500/INTERNAL SERVER ERROR", 52, "504/Gateway Time-out", 8, "503/Service Unavailable", 1], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 2966, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 2687, 365, "502/Proxy Error", 191, "502/Bad Gateway", 145, "500/INTERNAL SERVER ERROR", 15, "504/Gateway Time-out", 14, "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal", 2712, 3, "502/Bad Gateway", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 2961, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 2956, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 2644, 354, "502/Bad Gateway", 164, "502/Proxy Error", 159, "504/Gateway Time-out", 18, "500/INTERNAL SERVER ERROR", 7, "503/Service Unavailable", 6], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 2662, 346, "502/Bad Gateway", 177, "502/Proxy Error", 139, "500/INTERNAL SERVER ERROR", 19, "504/Gateway Time-out", 9, "503/Service Unavailable", 2], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 2966, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 2671, 384, "502/Bad Gateway", 194, "502/Proxy Error", 187, "504/Gateway Time-out", 3, "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 2657, 418, "502/Bad Gateway", 211, "502/Proxy Error", 172, "504/Gateway Time-out", 19, "503/Service Unavailable", 8, "500/INTERNAL SERVER ERROR", 8], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 2712, 14, "502/Bad Gateway", 12, "502/Proxy Error", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResItemSector", 2712, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 2956, 4, "504/Gateway Time-out", 3, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
