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

    var data = {"OkPercent": 99.99056069473286, "KoPercent": 0.009439305267132339};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.00917185828456359, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.02653927813163482, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.01700318809776833, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.046610169491525424, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.0452155625657203, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.030063291139240507, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.024185068349106203, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.044633368756641874, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteTAC"], "isController": false}, {"data": [5.156157925751326E-4, 500, 1500, "WIFSGriddedLowResItemGlobal"], "isController": false}, {"data": [0.0010626992561105207, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.026063829787234042, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.0026371308016877636, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.016454352441613588, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.002120193010674075, 500, 1500, "WIFSGriddedHighResItemGlobal"], "isController": false}, {"data": [0.001171817782334847, 500, 1500, "WIFSGriddedHighResItemSector"], "isController": false}, {"data": [5.324813631522897E-4, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 31782, 3, 0.009439305267132339, 5432.554905292327, 148, 32680, 2744.5, 7417.9000000000015, 7846.950000000001, 9495.980000000003, 8.802383417995781, 24860.47103694286, 2.7601961218219735], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 942, 0, 0.0, 2152.68789808917, 274, 6861, 2082.0, 2717.1000000000004, 2925.5499999999997, 4271.359999999991, 0.5232993188776063, 32.3903881143559, 0.1885717272127312], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM", 941, 0, 0.0, 2170.0170031881003, 652, 7138, 2103.0, 2653.2000000000003, 2922.8, 3964.940000000002, 0.523395093212717, 0.1778725512090093, 0.18451721547831137], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC", 944, 0, 0.0, 2074.875000000005, 154, 7732, 1996.0, 2613.5, 2914.0, 4650.399999999992, 0.5242708525399368, 11.170962628485235, 0.1889218208859733], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC", 951, 0, 0.0, 2053.1167192429034, 148, 6681, 1973.0, 2587.6000000000004, 2767.999999999999, 4872.560000000003, 0.5284111271937257, 30.38209173416503, 0.1898977488352452], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 948, 0, 0.0, 2136.789029535866, 199, 6420, 2080.0, 2673.1000000000004, 2901.2999999999997, 4096.209999999999, 0.5268033428672884, 65.32618679749135, 0.18931995134293175], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM", 951, 1, 0.10515247108307045, 2187.685594111458, 234, 32161, 2103.0, 2660.4000000000005, 2882.2, 4053.080000000001, 0.5276658360507291, 28.868194732794958, 0.1853124547447479], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 941, 0, 0.0, 2042.588735387887, 605, 6214, 1981.0, 2596.600000000001, 2765.9, 3440.9400000000037, 0.5239242987849523, 3.8061258385363863, 0.18879693969887437], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal", 6788, 0, 0.0, 7223.326605774909, 397, 11573, 7056.0, 7837.4000000000015, 8333.55, 10370.769999999997, 3.755629571433314, 23926.452162734033, 1.0782764589857365], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 941, 0, 0.0, 2530.2316684378325, 1019, 6418, 2459.0, 3093.000000000001, 3282.8, 4802.580000000023, 0.5242392402820752, 104.50637581689539, 0.18481481029475505], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 940, 0, 0.0, 2128.5319148936146, 1183, 6817, 2050.5, 2699.3999999999996, 2944.5499999999993, 4695.360000000001, 0.5233899633849746, 11.282529347421804, 0.18860439110259336], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 948, 0, 0.0, 2509.819620253166, 604, 7163, 2443.5, 3036.3, 3261.6499999999996, 5032.409999999996, 0.5260748324801265, 104.87178486702459, 0.18494818329379448], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM", 942, 0, 0.0, 2196.14755838641, 509, 6614, 2162.5, 2670.4, 2894.0999999999995, 4615.469999999996, 0.5238729224434501, 28.690228018192073, 0.1846856689473491], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 6839, 0, 0.0, 7215.477408977916, 242, 12689, 7092.0, 7892.0, 8340.0, 10367.400000000009, 3.787616559621316, 22949.78644174307, 1.1022556003585469], "isController": false}, {"data": ["WIFSGriddedHighResItemSector", 6827, 1, 0.014647722279185586, 7195.613593086265, 160, 11516, 7027.0, 7824.2, 8313.8, 10430.44, 3.77675593980204, 2389.41464090565, 1.1027832285164159], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 939, 1, 0.10649627263045794, 2465.7209797657074, 1273, 32680, 2373.0, 2984.0, 3138.0, 4479.600000000018, 0.5227848453636946, 0.1786269634008852, 0.18410580442891739], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: a2d70e5fc3b2743499cfeb7722229bda-1213434934.us-east-1.elb.amazonaws.com:80 failed to respond", 2, 66.66666666666667, 0.006292870178088226], "isController": false}, {"data": ["500/INTERNAL SERVER ERROR", 1, 33.333333333333336, 0.003146435089044113], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 31782, 3, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: a2d70e5fc3b2743499cfeb7722229bda-1213434934.us-east-1.elb.amazonaws.com:80 failed to respond", 2, "500/INTERNAL SERVER ERROR", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM", 951, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: a2d70e5fc3b2743499cfeb7722229bda-1213434934.us-east-1.elb.amazonaws.com:80 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResItemSector", 6827, 1, "500/INTERNAL SERVER ERROR", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 939, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: a2d70e5fc3b2743499cfeb7722229bda-1213434934.us-east-1.elb.amazonaws.com:80 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
