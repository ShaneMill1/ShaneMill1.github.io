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

    var data = {"OkPercent": 97.64224337318998, "KoPercent": 2.3577566268100196};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.2413055972189125, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.05212495459498729, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.5363901018922853, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.533042846768337, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.5395070677781805, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.05348078317621465, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.5339013778100072, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.5389374090247453, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.6783783783783783, 500, 1500, "WIFSGriddedLowResItemGlobal"], "isController": false}, {"data": [0.05252635405307161, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.049490538573508006, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.0484573502722323, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.5384894698620188, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.7034982935153583, 500, 1500, "WIFSGriddedHighResItemGlobal"], "isController": false}, {"data": [0.7526315789473684, 500, 1500, "WIFSGriddedHighResItemSector"], "isController": false}, {"data": [0.05060065526028395, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 71339, 1682, 2.3577566268100196, 4773.22913133066, 1, 60004, 1670.0, 14903.700000000004, 22969.40000000001, 31969.780000000035, 19.704456628319683, 191.73010072340801, 5.9922559587723905], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 2753, 0, 0.0, 2251.8020341445667, 308, 19256, 1698.0, 3405.599999999998, 5464.799999999993, 12129.080000000002, 0.7652834300709409, 0.2727816913827084, 0.22868821250166788], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 3514, 98, 2.7888446215139444, 7548.128343767789, 1, 60003, 5336.0, 12952.5, 18100.75, 60001.0, 0.9732322360883043, 0.279778681668448, 0.3431023801053495], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM", 2748, 0, 0.0, 777.551673944688, 98, 17827, 583.0, 904.0999999999999, 1452.4999999999973, 4941.159999999996, 0.7649925171037628, 0.27417212282918063, 0.22262477548527473], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 3467, 776, 22.382463224689932, 20425.4228439573, 8, 60003, 20071.0, 30815.0, 31326.0, 32009.64, 0.9609622594337557, 0.2786521715231709, 0.33689985462570143], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 3451, 130, 3.7670240509997104, 8020.017096493777, 3, 60003, 5978.0, 15951.000000000011, 21308.199999999964, 30624.24, 0.9630859831221344, 0.27898889070829935, 0.32635823842127015], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC", 2754, 0, 0.0, 795.0363108206243, 103, 16945, 584.0, 927.0, 1497.25, 5390.5499999999965, 0.7656516546304967, 0.2729129433009094, 0.22879824835637885], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC", 2759, 2, 0.07249003262051468, 775.9539688292867, 8, 17008, 583.0, 920.0, 1456.0, 5064.600000000018, 0.7662901226064196, 0.27234499758225605, 0.22824071034663865], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 2758, 0, 0.0, 2212.3139956490236, 292, 18561, 1701.0, 3192.199999999998, 5176.799999999996, 12003.41, 0.7661626142646255, 0.27234686678937864, 0.22820273178780354], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 3501, 75, 2.1422450728363325, 9072.137674950018, 12, 60004, 7069.0, 15439.800000000012, 20072.9, 55460.58000000002, 0.9698866941851124, 0.27839755121616755, 0.34287010087403386], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM", 2758, 0, 0.0, 772.7831762146484, 99, 16022, 583.0, 975.0999999999999, 1524.9999999999945, 5798.82, 0.7668121051772606, 0.2740754204051537, 0.2224054640992641], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 2748, 1, 0.036390101892285295, 781.0211062590961, 100, 17012, 583.0, 928.1999999999998, 1404.6499999999992, 4832.229999999983, 0.7651079587376276, 0.27269521842328737, 0.2286357767321426], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal", 3515, 13, 0.36984352773826457, 906.5541963015651, 8, 7095, 353.0, 2528.8, 3625.3999999999996, 5239.9200000000055, 0.9764699901464039, 15.729339449391075, 0.21550997829403054], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 2751, 0, 0.0, 2234.089785532536, 300, 20045, 1705.0, 3344.2000000000007, 4946.600000000002, 11576.360000000008, 0.764764882752731, 0.2740905390334495, 0.22255853033233772], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 2748, 1, 0.036390101892285295, 2238.732896652113, 325, 19794, 1697.0, 3336.999999999999, 5108.449999999995, 12510.02, 0.7641110285579545, 0.27233989851059526, 0.22833786595579503], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 3441, 163, 4.736995059575705, 8321.465271723344, 2, 60003, 6134.0, 14950.6, 22992.199999999986, 30856.699999999997, 0.9605625027217334, 0.2788290945302651, 0.3236270150771465], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 3449, 167, 4.841983183531458, 7797.783125543651, 1, 60003, 5545.0, 15562.0, 23368.0, 30747.0, 0.9636043103761381, 0.28166368858035296, 0.3274749023543907], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 2755, 1, 0.036297640653357534, 2213.8972776769574, 182, 20055, 1700.0, 3319.4, 4892.2, 10071.440000000013, 0.7656257121291786, 0.27362722380573506, 0.22206136377184188], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 3490, 62, 1.7765042979942693, 12227.274785100259, 14, 60003, 10969.5, 19508.7, 22182.0, 30996.340000000004, 0.9671740034712957, 0.27766902699385415, 0.34285562818367216], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 3447, 153, 4.438642297650131, 7984.37278793152, 1, 60004, 5866.0, 15724.2, 21998.799999999996, 30875.719999999998, 0.9642500179730384, 0.28005398869978426, 0.3286359924537016], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM", 2754, 0, 0.0, 755.9106753812641, 102, 15920, 584.0, 954.5, 1516.25, 4470.949999999987, 0.7654884241417371, 0.2743498551367359, 0.2227690921818727], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 3516, 36, 1.023890784982935, 824.6188850966994, 12, 7796, 379.0, 2043.6000000000004, 3370.449999999999, 5238.289999999995, 0.9766284153870639, 151.25072450504368, 0.21935989798732883], "isController": false}, {"data": ["WIFSGriddedHighResItemSector", 3515, 1, 0.02844950213371266, 655.2258890469417, 75, 7086, 304.0, 1749.4, 2408.2, 4052.5200000000004, 0.9765445934990746, 20.33071476405196, 0.22029472763504515], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 2747, 3, 0.10921004732435384, 2221.3698580269397, 20, 60001, 1698.0, 3086.0, 4903.399999999999, 11762.48, 0.7638796968729595, 0.27370404190938225, 0.2223009274102949], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503/Service Unavailable", 9, 0.535077288941736, 0.012615820238579179], "isController": false}, {"data": ["502/Bad Gateway", 1009, 59.98810939357907, 1.4143736245251546], "isController": false}, {"data": ["504/Gateway Time-out", 149, 8.858501783590963, 0.20886191283869973], "isController": false}, {"data": ["502/Proxy Error", 255, 15.160523186682521, 0.35744824009307674], "isController": false}, {"data": ["500/INTERNAL SERVER ERROR", 260, 15.457788347205707, 0.3644570291145096], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 71339, 1682, "502/Bad Gateway", 1009, "500/INTERNAL SERVER ERROR", 260, "502/Proxy Error", 255, "504/Gateway Time-out", 149, "503/Service Unavailable", 9], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 3514, 98, "504/Gateway Time-out", 49, "502/Bad Gateway", 25, "502/Proxy Error", 19, "500/INTERNAL SERVER ERROR", 4, "503/Service Unavailable", 1], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 3467, 776, "502/Bad Gateway", 655, "502/Proxy Error", 60, "500/INTERNAL SERVER ERROR", 57, "504/Gateway Time-out", 4, "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 3451, 130, "500/INTERNAL SERVER ERROR", 56, "502/Bad Gateway", 53, "502/Proxy Error", 14, "504/Gateway Time-out", 7, "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC", 2759, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 3501, 75, "504/Gateway Time-out", 30, "502/Bad Gateway", 25, "500/INTERNAL SERVER ERROR", 19, "502/Proxy Error", 1, "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 2748, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal", 3515, 13, "500/INTERNAL SERVER ERROR", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 2748, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 3441, 163, "502/Bad Gateway", 69, "502/Proxy Error", 55, "504/Gateway Time-out", 22, "500/INTERNAL SERVER ERROR", 14, "503/Service Unavailable", 3], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 3449, 167, "502/Proxy Error", 62, "502/Bad Gateway", 49, "500/INTERNAL SERVER ERROR", 45, "504/Gateway Time-out", 10, "503/Service Unavailable", 1], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 2755, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 3490, 62, "502/Bad Gateway", 33, "500/INTERNAL SERVER ERROR", 13, "504/Gateway Time-out", 9, "502/Proxy Error", 7, "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 3447, 153, "502/Bad Gateway", 57, "500/INTERNAL SERVER ERROR", 39, "502/Proxy Error", 36, "504/Gateway Time-out", 17, "503/Service Unavailable", 4], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 3516, 36, "502/Bad Gateway", 35, "502/Proxy Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResItemSector", 3515, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 2747, 3, "502/Bad Gateway", 2, "504/Gateway Time-out", 1, "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
