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

    var data = {"OkPercent": 83.22699470308794, "KoPercent": 16.773005296912057};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7731819391549906, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9681408313690276, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.9918229108192058, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.9915441314027014, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.9917511503497811, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.9677515899738122, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.991638608305275, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.9920103285682209, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.4683905013192612, 500, 1500, "WIFSGriddedLowResItemGlobal"], "isController": false}, {"data": [0.9674637030384673, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.9672916432768235, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.9678614187369051, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.9918621618587945, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.517043056141832, 500, 1500, "WIFSGriddedHighResItemGlobal"], "isController": false}, {"data": [0.5014775725593668, 500, 1500, "WIFSGriddedHighResItemSector"], "isController": false}, {"data": [0.967122005988024, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 424587, 71216, 16.773005296912057, 804.8153193574127, 3, 60040, 111.0, 192.0, 379.8500000000022, 41880.4800000004, 116.05002384756146, 7269.707494113273, 34.58265374118016], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 26727, 0, 0.0, 216.26258091068922, 90, 3188, 146.0, 218.0, 438.0, 667.9900000000016, 7.425930325118882, 2.6469380553402266, 2.211824950352792], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 9475, 8705, 91.87335092348285, 2744.881160949871, 4, 60025, 6.0, 3077.99999999797, 20054.59999999998, 60001.0, 2.6179703007502177, 566.6134351075619, 0.9203801838574984], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM", 26721, 0, 0.0, 91.5223606900937, 32, 2419, 52.0, 85.0, 151.0, 231.9900000000016, 7.427482602912788, 2.661998159442376, 2.1542600908838847], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 9436, 9436, 100.0, 5409.898367952522, 3, 60006, 5.0, 7.0, 60002.0, 60003.0, 2.6449153492544006, 1.1843105965845386, 0.9246872021807377], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 9413, 8811, 93.60458939764156, 2571.6614256878806, 3, 60004, 6.0, 7.0, 14447.399999999965, 60002.0, 2.696344309390113, 37.93726264344649, 0.9110694639150185], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC", 26727, 0, 0.0, 91.99128222396848, 32, 4721, 52.0, 86.0, 151.0, 227.0, 7.426993050132967, 2.647316858689974, 2.212141484658745], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC", 26731, 0, 0.0, 91.54307732595127, 32, 2434, 52.0, 85.0, 150.0, 223.9900000000016, 7.425362344404477, 2.6394842708625292, 2.2044044459950793], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 26730, 0, 0.0, 216.57519640853195, 89, 4392, 146.0, 222.0, 442.0, 670.0, 7.425123752062534, 2.639399458740979, 2.204333613893565], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 9467, 8774, 92.67983521706982, 3573.5799091581307, 4, 60025, 5.0, 7.0, 31638.20000000001, 60002.0, 2.613925399723228, 2065.340319270369, 0.9215108098633646], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM", 26730, 0, 0.0, 91.74223718668173, 31, 2465, 52.0, 84.0, 148.0, 233.0, 7.4257549517534285, 2.6541272581462447, 2.1465072907412255], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 26722, 0, 0.0, 91.05467405134368, 32, 2470, 52.0, 85.0, 151.0, 231.0, 7.427252697528038, 2.6474094087868494, 2.2122188210410663], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal", 9475, 0, 0.0, 1164.4035883905021, 46, 4557, 994.0, 2274.0, 2343.0, 2451.0, 2.6335421266679564, 42.467982333761654, 0.5786591586916896], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 26724, 1, 0.00374195479718605, 220.84714114653482, 87, 60002, 147.0, 233.0, 457.0, 685.0, 7.400871687760979, 2.6524405655398366, 2.146541886000987], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 26721, 0, 0.0, 217.75588488454795, 89, 4463, 146.0, 222.90000000000146, 445.0, 684.0, 7.4273773111009564, 2.64745382671079, 2.2122559373884685], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 9399, 8768, 93.28651984253644, 2560.080008511542, 3, 60004, 5.0, 7.0, 19608.0, 60001.0, 2.846754127854061, 810.520576340218, 0.9563314648259735], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 9408, 8812, 93.66496598639456, 2710.3527848639465, 4, 60040, 5.0, 7.0, 17595.14999999999, 60002.0, 2.757224452665449, 121.06647910480399, 0.9343328955809675], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 26728, 0, 0.0, 217.51354384914868, 90, 4532, 147.0, 229.0, 453.0, 684.9800000000032, 7.426243245586153, 2.6543017850434882, 2.1466484381772473], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 9452, 9114, 96.4240372407956, 5586.558929327133, 4, 60022, 6.0, 8.0, 60001.0, 60003.0, 2.6111160836131746, 3019.763880922958, 0.9230703342460638], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 9403, 8794, 93.5233436137403, 2486.526321386793, 3, 60005, 6.0, 7.0, 15382.59999999997, 60002.0, 2.8124132617413693, 349.37774243147004, 0.9557810694199185], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM", 26727, 0, 0.0, 90.80117484191945, 31, 2423, 52.0, 83.0, 149.0, 228.0, 7.427125138180042, 2.6618700446406987, 2.1541564121479224], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 9476, 0, 0.0, 1049.1596665259563, 28, 4735, 662.5, 2168.0, 2229.1499999999996, 2344.2299999999996, 2.6322755989218667, 367.97039266568805, 0.5886631954620191], "isController": false}, {"data": ["WIFSGriddedHighResItemSector", 9475, 0, 0.0, 1082.536781002638, 28, 4185, 926.0, 2181.0, 2247.0, 2344.0, 2.6334272102653355, 41.5016579408913, 0.5914924398056906], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 26720, 1, 0.0037425149700598802, 219.90183383233534, 89, 60002, 147.0, 227.0, 457.0, 696.0, 7.389302877901172, 2.6482943508371593, 2.143186479235008], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 2549, 3.579251853516064, 0.6003481029800724], "isController": false}, {"data": ["500/INTERNAL SERVER ERROR", 68667, 96.42074814648393, 16.172657193931986], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 424587, 71216, "500/INTERNAL SERVER ERROR", 68667, "504/Gateway Time-out", 2549, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 9475, 8705, "500/INTERNAL SERVER ERROR", 8528, "504/Gateway Time-out", 177, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 9436, 9436, "500/INTERNAL SERVER ERROR", 8586, "504/Gateway Time-out", 850, "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 9413, 8811, "500/INTERNAL SERVER ERROR", 8599, "504/Gateway Time-out", 212, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 9467, 8774, "500/INTERNAL SERVER ERROR", 8577, "504/Gateway Time-out", 197, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 26724, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 9399, 8768, "500/INTERNAL SERVER ERROR", 8636, "504/Gateway Time-out", 132, "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 9408, 8812, "500/INTERNAL SERVER ERROR", 8593, "504/Gateway Time-out", 219, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 9452, 9114, "500/INTERNAL SERVER ERROR", 8533, "504/Gateway Time-out", 581, "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 9403, 8794, "500/INTERNAL SERVER ERROR", 8615, "504/Gateway Time-out", 179, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 26720, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
