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

    var data = {"OkPercent": 99.99386223344557, "KoPercent": 0.006137766554433221};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6440095398428731, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6853849265201564, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.003909643788010426, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.8002968560248279, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.003980539584254755, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.8375572930709086, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.836566963082727, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.6838027220051206, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.8003907302613851, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.8339630279314533, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.7501085540599218, 500, 1500, "WIFSGriddedLowResItemGlobal"], "isController": false}, {"data": [0.7336751214247167, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.6870192956416138, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [8.952551477170994E-4, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.0015555555555555555, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.7318059299191375, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [8.932559178204555E-4, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.8018333782690752, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.8637152777777778, 500, 1500, "WIFSGriddedHighResItemGlobal"], "isController": false}, {"data": [0.7584635416666666, 500, 1500, "WIFSGriddedHighResItemSector"], "isController": false}, {"data": [0.7311740890688259, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 114048, 7, 0.006137766554433221, 2989.2431607743933, 30, 60002, 863.0, 13482.400000000009, 19599.850000000002, 30070.460000000086, 31.425808853333272, 119.16350498263145, 9.34917820921207], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 7417, 0, 0.0, 682.9786975866265, 205, 4850, 591.0, 1204.1999999999998, 1384.3999999999978, 2211.6399999999994, 2.0605542354710367, 0.7344748983856724, 0.6137392986510413], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 2302, 0, 0.0, 15139.559513466584, 1031, 52256, 13478.0, 28489.20000000002, 33024.84999999999, 42337.64999999995, 0.6366585328146033, 0.18216889659636595, 0.22382526544263392], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM", 7411, 2, 0.02698691134799622, 504.5610578869251, 69, 60002, 344.0, 1049.0, 1219.3999999999996, 2016.4000000000005, 2.060049712493669, 0.7382778795907754, 0.5974948873150584], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 2277, 0, 0.0, 19049.06016688631, 4561, 53570, 17592.0, 32033.000000000007, 37258.3, 46030.07999999988, 0.6287333632099034, 0.17990124552783368, 0.2198110781534623], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 2261, 0, 0.0, 14818.692613887653, 902, 47929, 13376.0, 28562.6, 33470.600000000006, 41237.36000000006, 0.626033294117419, 0.17912866716445683, 0.21153078102014355], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC", 7418, 0, 0.0, 427.4317875438134, 67, 4910, 286.0, 1002.0, 1166.0, 2039.7699999999913, 2.0615084305634603, 0.7348150167535773, 0.6140235071502494], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC", 7422, 0, 0.0, 426.128940986257, 71, 4421, 287.0, 1010.0, 1157.0, 1993.079999999998, 2.0619748173477035, 0.7329676108540665, 0.6121487739000995], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 7421, 1, 0.013475272874275704, 690.3967120334194, 206, 60000, 587.0, 1202.0, 1393.7999999999993, 2211.579999999997, 2.0613030012638363, 0.7327092707942724, 0.6119493285002013], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 2296, 0, 0.0, 15604.702961672474, 1579, 48925, 14042.0, 28241.30000000001, 33284.9, 43117.420000000006, 0.6329907849664689, 0.18111943358903845, 0.22315397790321803], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM", 7422, 2, 0.026946914578280787, 503.9680679062255, 72, 60002, 343.0, 1050.0, 1221.8499999999995, 2065.539999999999, 2.0615664516308234, 0.7368088009610644, 0.5959215524245349], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 7411, 1, 0.01349345567399811, 433.932262852518, 70, 60000, 293.0, 996.0, 1153.3999999999996, 1948.7600000000002, 2.0600445587832645, 0.7342734102132178, 0.6135874906532185], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal", 2303, 0, 0.0, 570.7911419887093, 49, 4370, 445.0, 1154.6, 1552.7999999999997, 2517.2800000000007, 0.6397126265328242, 10.315173505904356, 0.14056185641590377], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 7412, 1, 0.013491635186184566, 620.1713437668665, 205, 60002, 501.0, 1153.0, 1331.0, 2153.74, 2.0592126428766298, 0.737998245435949, 0.5972521044280851], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 7411, 0, 0.0, 683.9295641613782, 204, 4577, 591.0, 1211.0, 1411.0, 2252.5200000000004, 2.0593639230340868, 0.7340506170971111, 0.6133847622318325], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 2234, 0, 0.0, 15425.389883616821, 1313, 50544, 14084.0, 28159.0, 33155.25, 42279.55, 0.6203310301854634, 0.17749706234798907, 0.20839245545292912], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 2250, 0, 0.0, 14676.446222222214, 1019, 49123, 13141.5, 27925.300000000003, 32377.24999999998, 40105.75999999997, 0.6255357018246459, 0.17898628968224733, 0.21197352395815638], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 7420, 0, 0.0, 618.2766846361219, 206, 27480, 502.0, 1176.0, 1349.0, 2200.58, 2.060889565482822, 0.7366070126628054, 0.5957258900223781], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 2285, 0, 0.0, 17285.792560175054, 2916, 52345, 15902.0, 29922.000000000007, 35155.299999999974, 43543.579999999885, 0.6308303494275594, 0.18050126209206535, 0.22300838524685207], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 2239, 0, 0.0, 14873.377847253252, 1219, 48209, 13311.0, 27624.0, 32611.0, 41446.59999999999, 0.6213089834230656, 0.17777688685835766, 0.21114797483518247], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM", 7418, 0, 0.0, 486.2156915610693, 70, 5860, 339.0, 1046.2000000000007, 1215.1499999999978, 2034.4299999999985, 2.0609522888711633, 0.7386420800934735, 0.5977566697214214], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 2304, 0, 0.0, 371.50520833333275, 34, 5197, 107.0, 949.0, 1122.0, 2175.699999999999, 0.6401146872147927, 89.47312234370811, 0.14315064782440187], "isController": false}, {"data": ["WIFSGriddedHighResItemSector", 2304, 0, 0.0, 555.9904513888889, 30, 3900, 399.0, 1141.0, 1655.5, 2572.899999999996, 0.6400270233632086, 10.085895683998325, 0.1437560697007207], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 7410, 0, 0.0, 613.5798920377885, 202, 4510, 509.5, 1157.0, 1327.4499999999998, 2152.2300000000023, 2.059632618243342, 0.7381691122024477, 0.5973739136897193], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 7, 100.0, 0.006137766554433221], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 114048, 7, "504/Gateway Time-out", 7, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM", 7411, 2, "504/Gateway Time-out", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 7421, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM", 7422, 2, "504/Gateway Time-out", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 7411, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 7412, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
