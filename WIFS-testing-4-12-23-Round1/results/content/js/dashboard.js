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

    var data = {"OkPercent": 99.93311211559063, "KoPercent": 0.06688788440937475};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8468607112063334, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.897813348577962, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.0016241299303944316, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.9519622560583315, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.006622516556291391, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.9576991782779564, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.9567857142857142, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.8952915118605316, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.9551332428377509, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.9579699785561115, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.8882189239332097, 500, 1500, "WIFSGriddedLowResItemGlobal"], "isController": false}, {"data": [0.9108125491317087, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.8973405776379754, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [2.3912003825920613E-4, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [7.122507122507123E-4, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.911867676478994, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.0014299332697807435, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.9545194712397285, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.9244670991658943, 500, 1500, "WIFSGriddedHighResItemGlobal"], "isController": false}, {"data": [0.9133456904541242, 500, 1500, "WIFSGriddedHighResItemSector"], "isController": false}, {"data": [0.912031741492708, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 191365, 128, 0.06688788440937475, 1781.2894886734775, 34, 60004, 243.0, 576.9000000000015, 12492.95, 29540.480000000083, 52.72591012913873, 135.12711615313907, 15.64674955201299], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 13994, 1, 0.007145919679862799, 391.8457910533102, 109, 60002, 289.0, 708.0, 858.25, 1209.0499999999993, 3.8816725087770343, 1.3835841961680064, 1.1599529176618872], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 2155, 22, 1.0208816705336428, 16825.71415313226, 182, 60003, 15754.0, 28769.4, 33046.799999999996, 59257.08, 0.5947239294279335, 0.1703120601664675, 0.20966341652683984], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM", 13989, 0, 0.0, 204.3523482736444, 37, 28455, 103.0, 483.0, 620.5, 957.2000000000007, 3.8868611921819323, 1.393044978057392, 1.1311373391310704], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 2128, 20, 0.9398496240601504, 20907.282894736825, 3274, 60004, 19833.0, 32828.4, 37159.15, 54802.090000000026, 0.5965603585641734, 0.17079021697780503, 0.2091456725825569], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 2114, 12, 0.5676442762535477, 15624.713339640455, 861, 60004, 14759.5, 27551.5, 30914.25, 40714.749999999876, 0.596135608725237, 0.17057065373714142, 0.20201079709732156], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC", 13995, 0, 0.0, 185.29732047159732, 37, 28398, 97.0, 450.0, 600.0, 896.0, 3.889991755830262, 1.3865693270293415, 1.162438942660215], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC", 14000, 0, 0.0, 188.01407142857167, 38, 8984, 98.0, 456.89999999999964, 597.0, 901.9699999999993, 3.88747643911601, 1.3818763904670193, 1.1578909315726398], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 13996, 2, 0.014289797084881395, 402.6751214632759, 106, 60002, 290.0, 711.0, 858.0, 1234.0, 3.888318902158328, 1.3821367918146388, 1.1581418605061427], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 2144, 18, 0.8395522388059702, 17316.896921641783, 1656, 60002, 16010.5, 29318.5, 34428.5, 56526.90000000002, 0.6016985636130652, 0.1723112310201148, 0.21270984377727498], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM", 13997, 2, 0.014288776166321354, 203.51253840108623, 38, 60002, 102.0, 467.0, 607.0, 913.0600000000013, 3.882068543180073, 1.3874961318336276, 1.1259515208246893], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 13990, 1, 0.007147962830593281, 192.09363831308065, 36, 60001, 98.0, 447.89999999999964, 598.4499999999989, 909.2700000000004, 3.8881912934531084, 1.3859077475372936, 1.1619009138639171], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal", 2156, 0, 0.0, 402.07096474953596, 57, 28203, 167.0, 693.3, 889.6000000000004, 1848.0599999999931, 0.5989176702102629, 9.735908945242368, 0.13218300143312442], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 13993, 3, 0.021439291074108482, 384.876080897593, 105, 60001, 280.0, 665.0, 837.0, 1207.0599999999995, 3.886834317472116, 1.3929743127764158, 1.1311295181705963], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 13988, 4, 0.028595939376608523, 405.68701744352404, 112, 60002, 289.0, 705.0, 853.5499999999993, 1220.1100000000006, 3.887990949886665, 1.3857768894126739, 1.161841045571601], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 2091, 3, 0.14347202295552366, 15883.170253467237, 185, 60001, 15008.0, 27229.6, 30856.799999999996, 37453.83999999997, 0.59230647426951, 0.1695281099666116, 0.19955638049119231], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 2106, 11, 0.5223171889838556, 15773.826685660048, 1097, 60003, 14619.5, 27742.699999999997, 30885.55, 49591.339999999975, 0.5947249086662376, 0.1702177443984736, 0.2021135431795417], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 13996, 4, 0.02857959416976279, 389.06559016861974, 100, 60003, 279.0, 675.0, 854.0, 1224.0300000000007, 3.8885025514477833, 1.38975556277295, 1.127817634550773], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 2136, 13, 0.6086142322097379, 18351.583801498124, 583, 60004, 17051.0, 29930.399999999998, 33947.45, 55110.70000000001, 0.5994305409860632, 0.17156333593339138, 0.21249344372845796], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 2098, 5, 0.23832221163012393, 15583.645853193531, 722, 60002, 14615.5, 26842.800000000003, 30720.749999999996, 40621.92999999998, 0.5945812056791857, 0.17027975091780326, 0.20264535232620687], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM", 13995, 3, 0.021436227224008574, 210.72161486244988, 38, 60002, 102.0, 472.0, 604.0, 956.0, 3.887875827996706, 1.3933475808911528, 1.131432614006854], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 2158, 0, 0.0, 233.94995366079698, 38, 12991, 96.0, 604.0, 716.0, 1223.3399999999892, 0.5994804132692405, 96.07490213518713, 0.13464892094914582], "isController": false}, {"data": ["WIFSGriddedHighResItemSector", 2158, 0, 0.0, 293.2933271547723, 34, 28347, 111.0, 614.0, 748.0, 1495.3799999999974, 0.5991450383544445, 12.415200470827218, 0.13515869517566084], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 13988, 4, 0.028595939376608523, 389.23563054046247, 106, 60002, 280.0, 671.0, 839.5499999999993, 1192.0, 3.8819830528183368, 1.3912153551467774, 1.1297177243553362], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 114, 89.0625, 0.05957202205209939], "isController": false}, {"data": ["500/INTERNAL SERVER ERROR", 14, 10.9375, 0.007315862357275364], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 191365, 128, "504/Gateway Time-out", 114, "500/INTERNAL SERVER ERROR", 14, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 13994, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 2155, 22, "504/Gateway Time-out", 19, "500/INTERNAL SERVER ERROR", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 2128, 20, "504/Gateway Time-out", 18, "500/INTERNAL SERVER ERROR", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 2114, 12, "504/Gateway Time-out", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 13996, 2, "504/Gateway Time-out", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 2144, 18, "504/Gateway Time-out", 15, "500/INTERNAL SERVER ERROR", 3, "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM", 13997, 2, "504/Gateway Time-out", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 13990, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 13993, 3, "504/Gateway Time-out", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 13988, 4, "504/Gateway Time-out", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 2091, 3, "504/Gateway Time-out", 2, "500/INTERNAL SERVER ERROR", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 2106, 11, "504/Gateway Time-out", 10, "500/INTERNAL SERVER ERROR", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 13996, 4, "504/Gateway Time-out", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 2136, 13, "504/Gateway Time-out", 12, "500/INTERNAL SERVER ERROR", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 2098, 5, "500/INTERNAL SERVER ERROR", 3, "504/Gateway Time-out", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM", 13995, 3, "504/Gateway Time-out", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 13988, 4, "504/Gateway Time-out", 4, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
