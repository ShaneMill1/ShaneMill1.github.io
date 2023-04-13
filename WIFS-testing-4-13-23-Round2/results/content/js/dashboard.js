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

    var data = {"OkPercent": 97.51086000586307, "KoPercent": 2.4891399941369294};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.2185925965407883, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.045152462861610634, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.04226044226044226, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.5256360078277886, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.04868913857677903, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.5301016419077405, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.5298129384255651, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.048927875243664716, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.013597033374536464, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.5309820732657833, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.5226917057902973, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.507002457002457, 500, 1500, "WIFSGriddedLowResItemGlobal"], "isController": false}, {"data": [0.044209702660406885, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.040133124510571654, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.034569138276553106, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.04471646265301024, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.03752931978107897, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.03753753753753754, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.5236512900703675, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.5447174447174448, 500, 1500, "WIFSGriddedHighResItemGlobal"], "isController": false}, {"data": [0.6083538083538084, 500, 1500, "WIFSGriddedHighResItemSector"], "isController": false}, {"data": [0.04310344827586207, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 75046, 1868, 2.4891399941369294, 4560.269061642267, 1, 60006, 1761.0, 13747.700000000004, 23560.40000000001, 31134.830000000027, 20.550008324497682, 228.5762633135485, 6.268824410038879], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 2558, 0, 0.0, 2448.539093041444, 349, 29909, 1709.5, 3405.6999999999994, 5889.0, 16923.829999999918, 0.7108398915121604, 0.2533755472675181, 0.2124189519557823], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 4070, 164, 4.0294840294840295, 7438.117690417692, 1, 60003, 3857.5, 16480.7, 27003.399999999998, 60002.0, 1.1154477453841156, 0.32048701567094456, 0.3932389024254548], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM", 2555, 1, 0.03913894324853229, 842.0305283757319, 25, 24585, 588.0, 877.0, 1400.3999999999987, 9070.92000000002, 0.7103552276584245, 0.2545657678251898, 0.2067244705490337], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 4011, 847, 21.11692844677138, 18304.345300423884, 1, 60006, 17665.0, 30739.6, 31559.599999999995, 60001.0, 1.102321002691631, 0.3204729910570739, 0.38645824215458546], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 4005, 182, 4.544319600499376, 6272.540324594265, 1, 60005, 3705.0, 12693.400000000005, 22684.299999999996, 35176.66, 1.105973832741962, 0.3224470657416528, 0.374778242149864], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC", 2558, 0, 0.0, 854.5719311962463, 105, 24403, 587.0, 933.0999999999999, 1606.199999999999, 8585.82999999999, 0.7111118030103548, 0.25347246884646435, 0.21250020675895365], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC", 2566, 1, 0.03897116134060795, 865.7626656274352, 7, 24056, 590.0, 897.3000000000002, 1585.9500000000003, 8987.269999999984, 0.7127946076504583, 0.2533526073705907, 0.21230698763026348], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 2565, 0, 0.0, 2374.998440545805, 301, 26874, 1708.0, 3302.2000000000003, 5290.499999999997, 16775.12000000009, 0.7124982187544532, 0.253270851197872, 0.21221870773448065], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 4045, 146, 3.6093943139678615, 7827.570086526581, 1, 60004, 5345.0, 15074.800000000005, 22879.09999999999, 60001.0, 1.108489467294765, 0.3183109738573241, 0.3918683468366259], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM", 2566, 1, 0.03897116134060795, 819.6582229150428, 8, 24581, 586.0, 892.3000000000002, 1452.4500000000012, 6649.449999999995, 0.7128338144359682, 0.25475825382592576, 0.20674965125730715], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 2556, 0, 0.0, 849.7398278560247, 104, 22200, 589.0, 931.5000000000009, 1773.650000000001, 8396.57999999995, 0.7105641089509395, 0.2532772458663016, 0.21233654037010494], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal", 4070, 3, 0.07371007371007371, 1671.309090909092, 119, 8727, 891.5, 4276.9, 5532.799999999999, 7402.969999999997, 1.1340101916031422, 18.333404662464098, 0.2502795930686622], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 2556, 0, 0.0, 2308.1201095461624, 324, 24256, 1713.0, 3091.1000000000085, 5495.15, 13238.539999999972, 0.7105459361275914, 0.25465855328010356, 0.20677996969338108], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 2554, 0, 0.0, 2479.71574001566, 315, 27511, 1715.0, 3491.5, 6208.75, 18758.899999999994, 0.7099946903294497, 0.25307427926782144, 0.2121663820711051], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 3992, 124, 3.1062124248496996, 6076.7412324649285, 1, 60003, 4029.5, 14140.1, 18363.85, 30295.14, 1.104421503905591, 0.3186451623495461, 0.37209513559319224], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 4003, 143, 3.5723207594304274, 6296.3162628028995, 1, 60004, 3799.0, 14843.999999999998, 19129.199999999997, 30491.96, 1.1144196944101399, 0.3215154453127001, 0.37872856802219595], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 2558, 2, 0.07818608287724785, 2356.5476935105553, 339, 60002, 1720.5, 3117.3999999999987, 5848.149999999994, 13650.15999999996, 0.7110987559941622, 0.2541180002953645, 0.20624641653346307], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 4012, 73, 1.8195413758723828, 10501.231804586208, 1, 60004, 8955.5, 19876.700000000008, 23935.35, 31878.919999999966, 1.114134653114509, 0.31928811903620685, 0.39495203035211596], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 3996, 122, 3.053053053053053, 5863.6393893893755, 1, 60004, 3907.5, 11506.800000000005, 17244.549999999996, 30884.039999999957, 1.1050139315820504, 0.31868841763028155, 0.376611193478648], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM", 2558, 0, 0.0, 869.422986708365, 110, 24528, 587.0, 917.5999999999995, 1661.4999999999973, 9193.959999999992, 0.7110147525832656, 0.25482657636529144, 0.2069164026072394], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 4070, 50, 1.2285012285012284, 1396.281818181821, 5, 9771, 698.5, 3753.7000000000003, 5453.099999999997, 7022.929999999999, 1.13401556304012, 180.950001663931, 0.2547105268547145], "isController": false}, {"data": ["WIFSGriddedHighResItemSector", 4070, 8, 0.19656019656019655, 1134.3518427518434, 74, 12783, 536.5, 3081.6000000000004, 4158.45, 6259.29, 1.134034205480868, 27.657903498756742, 0.25582216940046926], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 2552, 1, 0.03918495297805643, 2332.8597178683403, 13, 48029, 1724.5, 3084.4000000000033, 4907.849999999991, 13779.129999999965, 0.7097782805064902, 0.2543589820119044, 0.20655656991302157], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["408/Request Timeout", 1, 0.05353319057815846, 0.0013325160568184848], "isController": false}, {"data": ["503/Service Unavailable", 2, 0.10706638115631692, 0.0026650321136369695], "isController": false}, {"data": ["502/Bad Gateway", 1111, 59.475374732334046, 1.4804253391253364], "isController": false}, {"data": ["504/Gateway Time-out", 280, 14.989293361884368, 0.3731044959091757], "isController": false}, {"data": ["502/Proxy Error", 241, 12.901498929336189, 0.3211363696932548], "isController": false}, {"data": ["500/INTERNAL SERVER ERROR", 233, 12.473233404710921, 0.31047624123870693], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 75046, 1868, "502/Bad Gateway", 1111, "504/Gateway Time-out", 280, "502/Proxy Error", 241, "500/INTERNAL SERVER ERROR", 233, "503/Service Unavailable", 2], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 4070, 164, "504/Gateway Time-out", 84, "502/Bad Gateway", 53, "502/Proxy Error", 20, "500/INTERNAL SERVER ERROR", 6, "503/Service Unavailable", 1], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM", 2555, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 4011, 847, "502/Bad Gateway", 653, "500/INTERNAL SERVER ERROR", 72, "502/Proxy Error", 71, "504/Gateway Time-out", 51, "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 4005, 182, "500/INTERNAL SERVER ERROR", 97, "502/Bad Gateway", 35, "504/Gateway Time-out", 27, "502/Proxy Error", 22, "408/Request Timeout", 1], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC", 2566, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 4045, 146, "502/Bad Gateway", 79, "504/Gateway Time-out", 42, "502/Proxy Error", 21, "500/INTERNAL SERVER ERROR", 3, "503/Service Unavailable", 1], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM", 2566, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal", 4070, 3, "502/Bad Gateway", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 3992, 124, "502/Bad Gateway", 58, "502/Proxy Error", 30, "500/INTERNAL SERVER ERROR", 21, "504/Gateway Time-out", 15, "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 4003, 143, "502/Bad Gateway", 71, "502/Proxy Error", 34, "504/Gateway Time-out", 21, "500/INTERNAL SERVER ERROR", 17, "", ""], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 2558, 2, "502/Bad Gateway", 1, "504/Gateway Time-out", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 4012, 73, "502/Bad Gateway", 38, "504/Gateway Time-out", 23, "502/Proxy Error", 6, "500/INTERNAL SERVER ERROR", 6, "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 3996, 122, "502/Bad Gateway", 59, "502/Proxy Error", 36, "504/Gateway Time-out", 16, "500/INTERNAL SERVER ERROR", 11, "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 4070, 50, "502/Bad Gateway", 49, "502/Proxy Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResItemSector", 4070, 8, "502/Bad Gateway", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 2552, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
