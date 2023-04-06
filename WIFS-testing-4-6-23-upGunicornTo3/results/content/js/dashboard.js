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

    var data = {"OkPercent": 99.99933857184432, "KoPercent": 6.614281556737307E-4};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6178168902293832, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.05726092089728453, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.7114834724922795, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.8070848117202701, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.0733890214797136, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.8476669716376944, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.8440608208528638, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.7088954950834667, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.015287982934344631, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.8142007774982849, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.8463035019455253, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.7639282341831917, 500, 1500, "WIFSGriddedLowResItemGlobal"], "isController": false}, {"data": [0.7539464653397392, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.7116529304029304, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.0551417587698222, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.07282946663477637, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.7564600960439057, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.07190795781399809, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.8098478783026422, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.8343558282208589, 500, 1500, "WIFSGriddedHighResItemGlobal"], "isController": false}, {"data": [0.7762039660056658, 500, 1500, "WIFSGriddedHighResItemSector"], "isController": false}, {"data": [0.7567830566685747, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 151188, 1, 6.614281556737307E-4, 2252.4436727782636, 27, 60000, 586.0, 7305.700000000004, 11362.0, 22501.720000000045, 41.71872723499883, 213.716786510026, 12.476633213784885], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 4235, 0, 0.0, 8081.275324675318, 1067, 54590, 6255.0, 17196.0, 23546.2, 34717.08000000004, 1.1712565079408979, 0.33513491877605767, 0.4117698660729719], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 8743, 0, 0.0, 585.4098135651362, 215, 1931, 582.0, 910.0, 995.0, 1181.5599999999995, 2.429638983381025, 0.8660334266934318, 0.7236717675109497], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM", 8737, 1, 0.011445576284765937, 417.99908435389756, 71, 60000, 401.0, 742.0, 823.0, 1004.6200000000008, 2.428317793062966, 0.8702849462223635, 0.7043070161520516], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 4205, 0, 0.0, 12954.26064209276, 3580, 58327, 11607.0, 22806.600000000002, 27642.7, 37795.89999999999, 1.1625399493514106, 0.33264082535152667, 0.4064348651052783], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 4190, 0, 0.0, 7193.356563245811, 958, 51918, 5272.5, 15517.000000000004, 20695.59999999999, 31490.51000000002, 1.1614376102880641, 0.33232540997500276, 0.39243888003874045], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC", 8744, 0, 0.0, 359.5990393412612, 71, 1599, 319.0, 701.0, 780.0, 954.0, 2.429231005588843, 0.8658880049218043, 0.723550250688083], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC", 8747, 0, 0.0, 365.5541328455474, 72, 1455, 328.0, 707.1999999999998, 787.6000000000004, 976.0, 2.4293011433573737, 0.8635406408028165, 0.7211987769342203], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 8746, 0, 0.0, 585.6805396752787, 213, 1746, 579.0, 911.0, 998.0, 1210.5300000000007, 2.430056008539927, 0.8638089717856772, 0.7214228775352908], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 4219, 0, 0.0, 8351.43683337284, 1444, 49747, 6986.0, 16614.0, 22447.0, 32453.200000000008, 1.1700369591906972, 0.3347859658621819, 0.41248373268343913], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM", 8746, 0, 0.0, 404.8246055339593, 71, 1524, 390.0, 732.0, 819.0, 994.5300000000007, 2.43009652034407, 0.8685696547323531, 0.7024497754119577], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 8738, 0, 0.0, 362.5582513160911, 72, 1463, 329.0, 708.0, 788.0, 958.2200000000012, 2.4282852715522125, 0.8655509024575759, 0.7232685623275634], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal", 4236, 0, 0.0, 478.9985835694049, 45, 1489, 465.0, 910.0, 994.0, 1176.8900000000003, 1.1766254847746995, 18.972696144437027, 0.2585358731194408], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 8742, 0, 0.0, 536.3955616563718, 208, 1805, 490.5, 887.0, 972.8500000000004, 1166.5699999999997, 2.4289115492215787, 0.8705181040667181, 0.7044792286316492], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 8736, 0, 0.0, 582.9753891941397, 212, 1863, 568.0, 920.0, 1009.1499999999996, 1201.6299999999992, 2.427998018913704, 0.8654485126010762, 0.7231830036803514], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 4162, 0, 0.0, 7577.487265737628, 1161, 46999, 5703.0, 16278.800000000012, 22256.35, 32395.579999999994, 1.1569791668693652, 0.33104970302023823, 0.3886726888701773], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 4181, 0, 0.0, 7037.321693374803, 1003, 47853, 5157.0, 14977.600000000002, 20505.999999999985, 32823.360000000044, 1.1607111625378739, 0.3321175494371065, 0.39332692714906464], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 8746, 0, 0.0, 533.5396752801288, 214, 1838, 483.0, 883.3000000000002, 973.0, 1166.0, 2.4295456755142575, 0.8683727707404475, 0.7022905468283401], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 4211, 0, 0.0, 9660.453811446212, 2214, 53427, 8005.0, 17990.6, 23872.39999999998, 34834.12, 1.1690331421312217, 0.33449874086371867, 0.41327148188623264], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 4172, 0, 0.0, 7132.732023010537, 1082, 41040, 5224.0, 15494.100000000026, 21673.049999999996, 30955.989999999794, 1.1611524911619375, 0.33224382803754654, 0.39461041691831467], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM", 8743, 0, 0.0, 408.54157611803765, 73, 1482, 398.0, 738.0, 822.0, 998.239999999998, 2.4296957002750954, 0.8707991425790623, 0.7047066630680695], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 4238, 0, 0.0, 363.7647475224163, 29, 1731, 319.0, 739.0, 833.0, 985.4399999999987, 1.176999573136304, 164.51945620234756, 0.2632157248517711], "isController": false}, {"data": ["WIFSGriddedHighResItemSector", 4236, 0, 0.0, 443.57932011331525, 27, 2251, 436.0, 829.0, 904.1499999999996, 1060.63, 1.1769219933546693, 18.54645274910682, 0.26434771335114643], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 8735, 0, 0.0, 533.3919862621631, 216, 1666, 488.0, 879.0, 966.0, 1148.0, 2.4275122876308872, 0.8700166108989605, 0.7040733881116928], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 1, 100.0, 6.614281556737307E-4], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 151188, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM", 8737, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
