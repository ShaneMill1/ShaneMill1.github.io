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

    var data = {"OkPercent": 99.77247273798999, "KoPercent": 0.22752726201002063};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.40488653109342765, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4062425542053848, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.013141228625712476, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.6187410586552218, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.07094594594594594, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.6779761904761905, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.6850487283099596, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.4041617122473246, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.0012714558169103624, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.6187871581450654, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.6875298044825942, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.6632362254591514, 500, 1500, "WIFSGriddedLowResItemGlobal"], "isController": false}, {"data": [0.459604385128694, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.40951359084406297, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.032090761750405185, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.05738233397807866, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.45384249345705446, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.04380860006466214, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.618123362705406, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.7587733164717041, 500, 1500, "WIFSGriddedHighResItemGlobal"], "isController": false}, {"data": [0.5993356532742803, 500, 1500, "WIFSGriddedHighResItemSector"], "isController": false}, {"data": [0.45635583114715, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 84825, 193, 0.22752726201002063, 4012.902410845824, 42, 60010, 1379.0, 13897.600000000006, 19872.800000000003, 31522.18000000013, 23.423546318009056, 39860.184707539884, 7.046042564063019], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 4197, 0, 0.0, 1250.7410054801028, 319, 19102, 1068.0, 2277.0, 2563.2, 3102.0599999999986, 1.1665802687554117, 0.4158220684528566, 0.34746775583046924], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 3158, 27, 0.8549715009499683, 10409.905953134896, 829, 60003, 7958.0, 21394.999999999996, 28384.04999999999, 40494.73999999997, 0.8746366989582463, 1167.498007236317, 0.30748946447750847], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM", 4194, 0, 0.0, 810.9573199809248, 110, 10391, 664.0, 1675.5, 1905.25, 2327.1500000000005, 1.1665515135129723, 0.4180902397063094, 0.33834550733725854], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 3126, 30, 0.9596928982725528, 17828.189699296272, 4779, 60004, 15768.5, 29973.9, 35811.54999999999, 47485.63000000001, 0.866111276735575, 21465.704526926285, 0.30280062213997644], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 3108, 14, 0.45045045045045046, 8695.063384813384, 695, 60003, 6325.0, 19416.899999999998, 24794.199999999997, 35231.14999999998, 0.8673767546378702, 70.20588619424984, 0.29307847373506163], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC", 4200, 0, 0.0, 728.871666666668, 111, 25568, 529.0, 1585.0, 1818.7999999999993, 2318.9199999999983, 1.1671974172700197, 0.4160420481480051, 0.34765157447983985], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC", 4207, 0, 0.0, 702.3665319705267, 111, 13227, 522.0, 1556.2000000000003, 1805.6, 2185.2800000000007, 1.1681996452360668, 0.4152584676425081, 0.34680926967945735], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 4205, 1, 0.023781212841854936, 1265.7648038049952, 326, 31217, 1065.0, 2261.0, 2526.7, 3121.7599999999984, 1.1679640650371277, 0.41515112783179203, 0.34673933180789723], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 3146, 23, 0.7310870947234583, 11394.665924984107, 1267, 60003, 9172.5, 22399.900000000012, 27946.499999999953, 40162.30999999994, 0.8713324961598775, 4267.547329662166, 0.30717874132198814], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM", 4205, 0, 0.0, 814.0865636147431, 112, 9406, 672.0, 1716.0, 1938.0, 2355.879999999999, 1.1686635852486584, 0.4177059298837979, 0.33781681761094035], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 4194, 0, 0.0, 714.5610395803546, 109, 24906, 513.0, 1557.5, 1790.0, 2335.1000000000004, 1.166941661264159, 0.41595088511857226, 0.3475753971538755], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal", 3158, 0, 0.0, 757.3423052564914, 57, 19286, 609.5, 1579.1999999999998, 1851.0499999999997, 2397.279999999999, 0.877503510847644, 39.17842339035555, 0.19281083002023428], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 4196, 0, 0.0, 1145.4473307912292, 323, 25827, 943.5, 2169.3, 2431.2999999999993, 2962.0599999999995, 1.16607834734795, 0.4179206576920875, 0.33820827066634873], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 4194, 0, 0.0, 1257.2963757749171, 324, 28705, 1078.0, 2271.0, 2517.0, 3018.850000000003, 1.1660958061422722, 0.41564938402532153, 0.3473234578841728], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 3085, 26, 0.8427876823338736, 10165.653160453769, 995, 60005, 7880.0, 21181.600000000006, 27362.799999999996, 40641.59999999991, 0.8602593103202116, 1468.8730732548622, 0.2889933620606961], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 3102, 22, 0.7092198581560284, 9270.6260477112, 706, 60004, 7136.5, 19622.000000000007, 25762.599999999995, 38290.979999999974, 0.8626066683221745, 187.16313334294566, 0.29230909561308055], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 4203, 0, 0.0, 1153.5417558886525, 335, 18035, 932.0, 2211.6, 2492.7999999999997, 2976.8, 1.167482163466947, 0.4172836638954127, 0.33747531287716437], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 3138, 26, 0.82855321861058, 13456.800828553225, 2537, 60010, 11289.0, 24087.199999999997, 30732.949999999968, 43950.9000000001, 0.871503501844377, 10664.732193954347, 0.30809010514420354], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 3093, 24, 0.7759456838021338, 9593.992563853859, 829, 60005, 7545.0, 20171.8, 25596.19999999998, 39037.07999999999, 0.8626943677186629, 490.1304640338834, 0.29318128902938934], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM", 4199, 0, 0.0, 815.777327935222, 109, 15024, 672.0, 1682.0, 1901.0, 2326.0, 1.1668027797638219, 0.41818029313801036, 0.33841838436509286], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 3163, 0, 0.0, 571.768890294025, 43, 25546, 327.0, 1376.6, 1655.5999999999995, 2255.160000000004, 0.8783085825993269, 178.9153568349895, 0.19641861856957604], "isController": false}, {"data": ["WIFSGriddedHighResItemSector", 3161, 0, 0.0, 970.2268269534968, 42, 25034, 763.0, 1733.8000000000002, 2005.0, 6881.6600000000335, 0.8781843559277582, 26.808242313907428, 0.1972484393197113], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 4193, 0, 0.0, 1160.8507035535429, 323, 27473, 970.0, 2190.0, 2456.6999999999975, 2955.320000000009, 1.16618902886742, 0.41796032577572567, 0.3382403726304919], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["408/Request Timeout", 1, 0.5181347150259067, 0.0011788977306218685], "isController": false}, {"data": ["502/Bad Gateway", 3, 1.5544041450777202, 0.0035366931918656055], "isController": false}, {"data": ["504/Gateway Time-out", 189, 97.92746113989638, 0.22281167108753316], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 84825, 193, "504/Gateway Time-out", 189, "502/Bad Gateway", 3, "408/Request Timeout", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 3158, 27, "504/Gateway Time-out", 27, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 3126, 30, "504/Gateway Time-out", 28, "502/Bad Gateway", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 3108, 14, "504/Gateway Time-out", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 4205, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 3146, 23, "504/Gateway Time-out", 23, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 3085, 26, "504/Gateway Time-out", 25, "408/Request Timeout", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 3102, 22, "504/Gateway Time-out", 22, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 3138, 26, "504/Gateway Time-out", 26, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 3093, 24, "504/Gateway Time-out", 24, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
