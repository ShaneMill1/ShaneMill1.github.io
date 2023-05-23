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

    var data = {"OkPercent": 99.99556265530707, "KoPercent": 0.004437344692935747};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.42819266950656726, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4223818854779012, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.013223397635345364, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.665104620749782, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.062065698041692985, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.7146277753591641, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.7064389819447465, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.41884247171453437, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [3.1201248049921997E-4, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.6694952132288947, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.7127914578339507, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.6856920684292379, 500, 1500, "WIFSGriddedLowResItemGlobal"], "isController": false}, {"data": [0.46231757786974514, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.4185742315238718, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.029796048438495856, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.058039961941008564, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.45746301131418626, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.044239338001273075, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.6658685241619504, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.771850699844479, 500, 1500, "WIFSGriddedHighResItemGlobal"], "isController": false}, {"data": [0.6598755832037325, 500, 1500, "WIFSGriddedHighResItemSector"], "isController": false}, {"data": [0.4661867364746946, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 90144, 4, 0.004437344692935747, 3777.353689652093, 42, 58664, 1140.0, 13651.500000000007, 19770.70000000002, 29775.890000000018, 24.88287844643214, 39243.64377211556, 7.477511317770677], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 4593, 0, 0.0, 1161.3890703244122, 345, 12671, 1032.0, 2019.2000000000007, 2302.500000000001, 2793.600000000004, 1.276055225158597, 0.454843903498914, 0.38007504264977743], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 3214, 0, 0.0, 10235.491599253264, 875, 51265, 7815.0, 22017.5, 27121.0, 38062.39999999998, 0.8919141076169022, 1187.1005701579666, 0.31356355345906717], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM", 4588, 0, 0.0, 725.5115518744557, 110, 11243, 604.0, 1496.0, 1743.0, 2167.1899999999905, 1.2753052755054106, 0.45706741807664614, 0.36988834650889346], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 3181, 2, 0.06287331027978624, 17492.06916064132, 5072, 56539, 15328.0, 29761.800000000003, 34925.699999999924, 45375.07999999998, 0.8804836819884483, 21290.17151602333, 0.30782534975768017], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 3166, 0, 0.0, 8833.967466835118, 725, 50366, 5986.5, 20754.000000000004, 26002.149999999987, 37198.92, 0.8818604972456482, 72.37993258291745, 0.29797239457714286], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC", 4594, 0, 0.0, 646.8691771876347, 112, 12171, 488.0, 1389.5, 1639.5, 2176.250000000001, 1.2770550676486145, 0.4552002926677191, 0.3803728472976831], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC", 4597, 0, 0.0, 654.5625407874703, 113, 6711, 505.0, 1422.1999999999998, 1683.0999999999995, 2098.2399999999943, 1.2765100764323252, 0.45375944123180306, 0.3789639289408465], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 4596, 1, 0.02175805047867711, 1170.148825065273, 357, 30160, 1045.5, 2065.3, 2312.449999999999, 2810.0, 1.2770873960143536, 0.45394105226402365, 0.37913532069176126], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 3205, 0, 0.0, 10987.369422776917, 1383, 58664, 8687.0, 22424.2, 27406.599999999984, 38795.14000000002, 0.8870096400373734, 4272.95748500568, 0.31270554692723807], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM", 4596, 0, 0.0, 717.3833768494336, 111, 6833, 612.0, 1454.3000000000002, 1709.1499999999996, 2182.239999999998, 1.2772918300568221, 0.4565320408210908, 0.3692171696258002], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 4589, 0, 0.0, 642.0838962736977, 114, 6507, 503.0, 1378.0, 1633.0, 2137.0, 1.2755995512469132, 0.4546814806690657, 0.3799393194631919], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal", 3215, 0, 0.0, 674.3060653188165, 57, 6588, 588.0, 1406.0, 1611.1999999999998, 2043.5600000000013, 0.8928995461626289, 38.84102339740501, 0.19619374793612449], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 4591, 0, 0.0, 1069.6477891526913, 341, 7358, 903.0, 1959.0, 2286.3999999999996, 2855.16, 1.27595190570129, 0.4572991693284897, 0.37007589452469053], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 4587, 0, 0.0, 1157.540222367562, 347, 7716, 1029.0, 2046.0, 2307.5999999999995, 2818.199999999999, 1.2751074125799478, 0.45450606014812595, 0.37979273519226964], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 3138, 0, 0.0, 9943.285213511788, 999, 52370, 7716.0, 21622.1, 26703.05, 37728.640000000014, 0.8742291293814536, 1519.162184286414, 0.29368634815158207], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 3153, 0, 0.0, 9338.78686964795, 734, 49863, 6848.0, 21705.999999999996, 26389.89999999997, 36822.48, 0.8779487019557678, 190.1208550063577, 0.2975080074010268], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 4596, 0, 0.0, 1074.9027415143617, 347, 12429, 914.0, 1971.3000000000002, 2268.1499999999996, 2748.0, 1.2769642702841024, 0.4564149637929506, 0.3691224843789983], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 3195, 1, 0.03129890453834116, 13314.491705790288, 2518, 54374, 11080.0, 25344.4, 30258.399999999998, 40891.16, 0.8857012883003433, 10107.792927281482, 0.31310924449680105], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 3142, 0, 0.0, 9472.932527052844, 784, 48442, 7095.0, 21552.2, 26288.249999999996, 36488.16000000002, 0.8745467915934398, 492.95771465712033, 0.2972092612055831], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM", 4594, 0, 0.0, 717.2261645624734, 111, 6186, 613.0, 1469.5, 1703.0, 2138.6500000000024, 1.2764358931328081, 0.45747262966771546, 0.3702162697855899], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 3215, 0, 0.0, 517.0488335925345, 43, 6193, 364.0, 1211.0, 1453.1999999999998, 1881.9600000000028, 0.8932376767929905, 181.62864067718945, 0.19975725389218246], "isController": false}, {"data": ["WIFSGriddedHighResItemSector", 3215, 0, 0.0, 738.2292379471226, 42, 6212, 652.0, 1491.4, 1717.1999999999998, 2266.720000000001, 0.8932572828252602, 25.967448245516973, 0.20063396000957995], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 4584, 0, 0.0, 1070.7521815008736, 353, 12206, 914.5, 1962.5, 2275.75, 2808.749999999998, 1.274170392493958, 0.4566606777785962, 0.3695591861042045], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 4, 100.0, 0.004437344692935747], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 90144, 4, "502/Bad Gateway", 4, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 3181, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 4596, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 3195, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
