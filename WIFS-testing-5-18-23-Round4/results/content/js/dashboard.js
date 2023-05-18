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

    var data = {"OkPercent": 99.99844005927774, "KoPercent": 0.0015599407222525543};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6739021917167147, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0070160957490713995, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.6705736835905289, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.8804501531934952, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.039190897597977246, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.8929454716758921, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.894101718860372, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.6680795949605558, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [2.0729684908789387E-4, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.8819755121262067, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.8937912346842601, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.8565827486586876, 500, 1500, "WIFSGriddedLowResItemGlobal"], "isController": false}, {"data": [0.6834727294145364, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.6719891586141881, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.017659574468085106, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.03446088794926004, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.6839750382668079, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.028450106157112527, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.883555189068206, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.9083780437474206, 500, 1500, "WIFSGriddedHighResItemGlobal"], "isController": false}, {"data": [0.8848534874122989, 500, 1500, "WIFSGriddedHighResItemSector"], "isController": false}, {"data": [0.6805964870918307, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 128210, 2, 0.0015599407222525543, 2657.776889478229, 36, 60011, 389.0, 4635.200000000012, 13777.450000000008, 38537.77000000003, 35.34200091242511, 136.42352255745382, 10.539669688672834], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 2423, 0, 0.0, 14218.01692117211, 1000, 52912, 11138.0, 30595.0, 37647.79999999999, 46400.959999999985, 0.6689615111075772, 0.19141183862746103, 0.2358350639744486], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 8489, 1, 0.011779950524207798, 639.7661679820951, 177, 30416, 589.0, 949.0, 1057.0, 1323.4000000000015, 2.3598103367420715, 0.8411194436286372, 0.7051776982842519], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM", 8486, 0, 0.0, 354.674051378742, 61, 5942, 299.0, 659.0, 748.6499999999996, 1003.2599999999984, 2.359663818812521, 0.8456998256876908, 0.6866990410216126], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 2388, 1, 0.04187604690117253, 20587.974455611395, 4655, 60011, 17570.0, 37409.2, 43542.399999999994, 50939.99, 0.6595355080329105, 0.1887144801428165, 0.2312238743982567], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 2373, 0, 0.0, 13088.236831015618, 678, 48623, 10211.0, 29423.199999999993, 36741.99999999995, 43758.279999999795, 0.6585021282688887, 0.18841906599881286, 0.22314476416924256], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC", 8491, 0, 0.0, 334.82075138381947, 60, 2505, 282.0, 628.0, 721.0, 927.1599999999999, 2.3598408503987076, 0.8411542093706332, 0.7051868166230514], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC", 8494, 0, 0.0, 336.2434659759842, 63, 2651, 282.0, 633.0, 721.0, 955.0999999999985, 2.3595126081420132, 0.8387329974254811, 0.7027845170735487], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 8493, 0, 0.0, 636.5928411633108, 200, 4956, 586.0, 942.0, 1051.0, 1311.0599999999995, 2.359688419995088, 0.8387954930451288, 0.7028368829086931], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 2412, 0, 0.0, 15202.048922056394, 1497, 53271, 12228.5, 31164.000000000007, 37880.1, 47167.60999999998, 0.6659785992250129, 0.19055832966106329, 0.235433840741655], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM", 8494, 0, 0.0, 352.95467388744896, 60, 5487, 304.0, 644.5, 751.0, 977.0499999999993, 2.3595984737892612, 0.8433721107488962, 0.6843757292142681], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 8488, 0, 0.0, 333.1504476908586, 60, 2871, 277.0, 622.0, 722.0, 925.1100000000006, 2.3598163969429145, 0.8411454930509412, 0.7051795092427069], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal", 2423, 0, 0.0, 369.26165910028914, 60, 2451, 318.0, 697.1999999999998, 783.0, 990.2799999999993, 0.6736429347700675, 10.790657769024158, 0.14867510083792507], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 8489, 0, 0.0, 623.0454706090229, 193, 4237, 569.0, 928.0, 1041.5, 1297.0, 2.3597250610362384, 0.8457217748049801, 0.6867168634656241], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 8486, 0, 0.0, 635.1447089323568, 205, 4443, 586.0, 939.0, 1057.0, 1319.0, 2.3594538723431464, 0.8410162728566881, 0.7050711766962919], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 2350, 0, 0.0, 13715.371914893616, 957, 49605, 10651.5, 29326.6, 36305.35, 43986.19999999987, 0.6536105866002042, 0.18701943542369123, 0.22021059802448287], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 2365, 0, 0.0, 13271.939112050759, 757, 49480, 10300.0, 29569.2, 36420.2, 43424.920000000006, 0.6561343008424321, 0.1877415528777662, 0.22298314130192026], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 8493, 0, 0.0, 622.2653950312025, 197, 3565, 572.0, 922.6000000000004, 1038.0, 1282.0, 2.3599434813959594, 0.8434954240145714, 0.6844757948970702], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 2400, 0, 0.0, 17348.873333333366, 2536, 55586, 14292.5, 33523.9, 40512.45, 48746.61999999992, 0.662417991272643, 0.18953952289344178, 0.23482200276559512], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 2355, 0, 0.0, 13639.849256900217, 846, 49526, 10687.0, 30340.800000000003, 36647.59999999999, 44404.76000000001, 0.6537524418555909, 0.18706002486688295, 0.22281211153086058], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM", 8489, 0, 0.0, 350.6318765461174, 61, 2337, 299.0, 652.0, 744.0, 959.1000000000004, 2.3600465170200526, 0.845836984127304, 0.6868104121796638], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 2423, 0, 0.0, 295.2179116797361, 38, 2563, 239.0, 601.5999999999999, 713.7999999999997, 951.4399999999955, 0.6737129871455118, 101.14933043081345, 0.15132225297213642], "isController": false}, {"data": ["WIFSGriddedHighResItemSector", 2423, 0, 0.0, 332.77300866694213, 36, 2735, 285.0, 649.1999999999998, 757.0, 1080.6399999999908, 0.6736762733885638, 14.033400325470023, 0.1519718937038655], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 8483, 0, 0.0, 625.529293881882, 193, 4129, 579.0, 927.0, 1037.7999999999993, 1288.1599999999999, 2.3588919353313793, 0.8454231838541174, 0.6864744108679209], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 1, 50.0, 7.799703611262772E-4], "isController": false}, {"data": ["504/Gateway Time-out", 1, 50.0, 7.799703611262772E-4], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 128210, 2, "502/Bad Gateway", 1, "504/Gateway Time-out", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 8489, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 2388, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
