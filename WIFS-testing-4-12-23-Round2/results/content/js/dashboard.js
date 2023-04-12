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

    var data = {"OkPercent": 99.79783461924204, "KoPercent": 0.20216538075796223};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6478057948811093, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.7159464394400487, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.007961165048543689, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.7719800292255237, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.01382306477093207, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.818242667640258, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.8203381583748935, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.7141727493917275, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.7754531078944167, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.8191282113722148, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.7382615444315095, 500, 1500, "WIFSGriddedLowResItemGlobal"], "isController": false}, {"data": [0.7785827346889078, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.7157471684325905, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.003201280512204882, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.007137192704203013, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.7781968609319868, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.00716275368085953, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.7746744553973469, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.8350795498641832, 500, 1500, "WIFSGriddedHighResItemGlobal"], "isController": false}, {"data": [0.69965075669383, 500, 1500, "WIFSGriddedHighResItemSector"], "isController": false}, {"data": [0.7772295321637427, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 126629, 256, 0.20216538075796223, 2689.6704704293006, 34, 60004, 644.5, 10523.800000000003, 16572.9, 32478.950000000008, 34.96046313937665, 151.58428499949477, 10.436071217390475], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 8215, 4, 0.048691418137553254, 632.9217285453404, 220, 60002, 601.0, 969.0, 1087.1999999999998, 1846.5200000000004, 2.2826114742419175, 0.8135469270290929, 0.682108506951198], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 2575, 30, 1.1650485436893203, 12781.912233009698, 1038, 60004, 9591.0, 26359.800000000003, 33330.19999999999, 60001.0, 0.7121415853626833, 0.20375897237900092, 0.2510577268710241], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM", 8212, 2, 0.024354603019970774, 444.021797369704, 75, 60002, 441.0, 801.0, 925.0, 1666.2699999999977, 2.282386077333755, 0.8179628910413567, 0.664210010786581], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 2544, 39, 1.5330188679245282, 20148.816037735873, 5967, 60004, 16904.5, 34914.0, 42191.75, 60001.0, 0.7055370234990421, 0.20186673034133681, 0.2473513588243712], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 2532, 27, 1.066350710900474, 11972.469984202227, 867, 60003, 8507.0, 25189.600000000013, 33037.45, 60000.0, 0.7056586746827114, 0.20190475281810588, 0.23912457042470786], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC", 8217, 3, 0.03650967506389193, 393.96385542168713, 72, 60002, 202.0, 738.1999999999998, 861.0999999999995, 1530.0999999999985, 2.283468571252306, 0.8138722357024771, 0.6823646316437556], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC", 8221, 2, 0.024327940639824838, 376.2919352876773, 73, 60001, 193.0, 747.0, 865.8999999999996, 1435.1399999999967, 2.283971471054322, 0.811841415187174, 0.6802844713589533], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 8220, 2, 0.024330900243309004, 621.7974452554719, 220, 60002, 607.0, 957.0, 1084.0, 1822.6499999999987, 2.283354898351818, 0.8116222486545707, 0.6801008242161176], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 2571, 25, 0.9723842862699339, 13701.153247763505, 1832, 60003, 10393.0, 27768.800000000007, 35660.0, 59927.56000000002, 0.7109199348198961, 0.20341076955907758, 0.25132130508281486], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM", 8221, 0, 0.0, 424.2644447147551, 72, 6449, 431.0, 789.8000000000002, 911.8999999999996, 1672.5599999999995, 2.2836631278823574, 0.816231157036077, 0.6623515126768165], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 8213, 2, 0.024351637647631805, 378.7984901984669, 73, 60001, 195.0, 755.0, 873.0, 1461.2999999999984, 2.2828353187116615, 0.813666318419393, 0.6821753979743832], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal", 2577, 1, 0.038804811796662786, 567.51144741948, 56, 60000, 493.0, 999.0, 1218.6999999999994, 2322.179999999996, 0.7158303507068721, 11.631811885679644, 0.15798599537085262], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 8213, 5, 0.060879094119079505, 570.9582369414322, 217, 60002, 363.0, 930.2000000000007, 1062.0, 1735.4399999999987, 2.2828848125757966, 0.8180805578572181, 0.6643551505347531], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 8211, 3, 0.03653635367190355, 626.5968822311554, 219, 60002, 600.0, 969.8000000000002, 1094.3999999999996, 1879.5600000000013, 2.2820719912974985, 0.8133744242708404, 0.6819472942744479], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 2499, 17, 0.6802721088435374, 12527.677470988368, 1192, 60003, 9254.0, 26606.0, 33082.0, 53912.0, 0.7022365348462751, 0.2009282496002675, 0.23659336379098136], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 2522, 22, 0.8723235527359239, 12528.040840602698, 979, 60004, 8875.5, 26901.500000000044, 34105.95, 58881.979999999996, 0.7030233628434033, 0.2011520631589276, 0.23891809596631286], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 8219, 2, 0.024333860566978952, 550.7683416474026, 221, 60002, 359.0, 936.0, 1070.0, 1763.2000000000016, 2.283635979700396, 0.8161812959057649, 0.6623436386435719], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 2555, 35, 1.36986301369863, 16473.583561643874, 3355, 60004, 13143.0, 30902.200000000004, 37855.99999999998, 60001.0, 0.7070838175220076, 0.2023104223186095, 0.25065568921922726], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 2513, 22, 0.8754476721050537, 12217.7600477517, 1062, 60004, 9013.0, 25404.399999999994, 31659.499999999996, 58355.500000000146, 0.7024440749135782, 0.20098629337829757, 0.23940720912581911], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM", 8217, 4, 0.04867956675185591, 454.7023244493127, 74, 60002, 424.0, 794.0, 916.0, 1716.4599999999991, 2.28315133233842, 0.8181964666552097, 0.6644327119500479], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 2577, 1, 0.038804811796662786, 400.0197904540161, 36, 60001, 106.0, 794.2000000000003, 938.0999999999999, 2358.7599999999884, 0.7159474871826786, 114.69643522458512, 0.16080851762892195], "isController": false}, {"data": ["WIFSGriddedHighResItemSector", 2577, 4, 0.15521924718665114, 1191.5836243694218, 34, 60002, 563.0, 1045.2000000000003, 1670.9999999999964, 38895.1, 0.7159590239175322, 14.81307740605434, 0.16151028762202144], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 8208, 4, 0.04873294346978557, 564.6622807017532, 221, 60002, 360.0, 936.0, 1053.5499999999993, 1740.829999999998, 2.281801989738007, 0.8177128232796066, 0.6640400321698496], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 256, 100.0, 0.20216538075796223], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 126629, 256, "504/Gateway Time-out", 256, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 8215, 4, "504/Gateway Time-out", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 2575, 30, "504/Gateway Time-out", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM", 8212, 2, "504/Gateway Time-out", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 2544, 39, "504/Gateway Time-out", 39, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 2532, 27, "504/Gateway Time-out", 27, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC", 8217, 3, "504/Gateway Time-out", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC", 8221, 2, "504/Gateway Time-out", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 8220, 2, "504/Gateway Time-out", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 2571, 25, "504/Gateway Time-out", 25, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 8213, 2, "504/Gateway Time-out", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal", 2577, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 8213, 5, "504/Gateway Time-out", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 8211, 3, "504/Gateway Time-out", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 2499, 17, "504/Gateway Time-out", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 2522, 22, "504/Gateway Time-out", 22, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 8219, 2, "504/Gateway Time-out", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 2555, 35, "504/Gateway Time-out", 35, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 2513, 22, "504/Gateway Time-out", 22, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM", 8217, 4, "504/Gateway Time-out", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 2577, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResItemSector", 2577, 4, "504/Gateway Time-out", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 8208, 4, "504/Gateway Time-out", 4, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
