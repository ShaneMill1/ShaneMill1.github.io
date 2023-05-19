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

    var data = {"OkPercent": 99.92167731051934, "KoPercent": 0.07832268948066032};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6330770273526931, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.01431238332296204, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.5832719233603537, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.929958220693045, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.08001893939393939, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.941544885177453, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.9341637010676157, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.5775745673253958, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.0012472715933894605, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.9294918998527246, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.9392356844433521, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.9018357187305538, 500, 1500, "WIFSGriddedLowResItemGlobal"], "isController": false}, {"data": [0.5985872235872236, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.5882389086887059, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.04105665181413113, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.0641998734977862, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.5969425343811395, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.05340729001584786, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.9302468377747759, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.9311256218905473, 500, 1500, "WIFSGriddedHighResItemGlobal"], "isController": false}, {"data": [0.9100808960796515, 500, 1500, "WIFSGriddedHighResItemSector"], "isController": false}, {"data": [0.5932390903503381, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 132784, 104, 0.07832268948066032, 2566.9630151223096, 45, 60018, 491.0, 9211.900000000016, 14978.250000000011, 27710.87000000002, 36.56296457838896, 177.18760263490896, 10.942892420046052], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 3214, 11, 0.3422526446795271, 10261.255133789668, 807, 60018, 7761.0, 21357.5, 26711.5, 38420.59999999997, 0.8866343866277658, 0.2536922272971665, 0.3125732554420151], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 8142, 0, 0.0, 715.6887742569364, 340, 7237, 603.0, 1044.6999999999998, 1370.699999999999, 2681.1099999999933, 2.2639079355228344, 0.8069593715486665, 0.6765193635449094], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM", 8138, 0, 0.0, 318.62865568935837, 112, 3728, 209.0, 584.0, 908.0, 1717.829999999999, 2.263853235101353, 0.8113614621896452, 0.6588166641212923], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 3188, 24, 0.7528230865746549, 17617.40213299874, 4568, 60013, 15406.0, 29565.5, 34632.69999999999, 48778.63000000017, 0.8796045421586621, 0.251673213203256, 0.3083769830419528], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 3168, 7, 0.22095959595959597, 8852.041035353515, 660, 60009, 6293.5, 20158.0, 25223.149999999998, 35721.779999999984, 0.8797497600682472, 0.25172337481296986, 0.2981183268981268], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC", 8143, 0, 0.0, 297.2551885054657, 112, 7479, 202.0, 530.6000000000004, 822.7999999999993, 1393.119999999999, 2.263974474890263, 0.8069830891942831, 0.6765392473793168], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC", 8149, 0, 0.0, 306.8705362621167, 111, 5105, 205.0, 562.0, 850.5, 1595.5, 2.2635815587963157, 0.8046325072283779, 0.6742113041336683], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 8147, 1, 0.012274456855284154, 722.9860071191819, 332, 30811, 607.0, 1043.0, 1400.3999999999978, 2685.9999999999764, 2.2636352977068013, 0.8046280034254606, 0.6742273103521235], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 3207, 17, 0.5300904271905207, 11569.629560336773, 1222, 60013, 9100.0, 22829.800000000003, 28575.59999999999, 47117.00000000004, 0.8854417310592915, 0.25334934917824, 0.31301748695650733], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM", 8148, 0, 0.0, 317.6831124202272, 112, 6368, 209.0, 597.1000000000004, 889.0, 1533.0400000000009, 2.263702442592723, 0.8090967714735708, 0.6565621342285534], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 8138, 0, 0.0, 302.6343081838282, 115, 7351, 203.0, 526.0, 825.0499999999993, 1617.399999999987, 2.263853235101353, 0.8069398738398378, 0.6765030175205216], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal", 3214, 0, 0.0, 351.8649657747351, 71, 5704, 199.0, 785.0, 1100.5, 2276.099999999996, 0.8931402438600777, 14.30806824701983, 0.19711884288318118], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 8140, 0, 0.0, 689.0782555282541, 349, 8397, 588.0, 991.9000000000005, 1299.0, 2263.3700000000063, 2.26369486728046, 0.8113047034100866, 0.6587705766109151], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 8137, 0, 0.0, 714.0592355905126, 339, 8366, 600.0, 1029.1999999999998, 1362.0999999999995, 2746.0599999999986, 2.263627947139544, 0.8068595710018883, 0.6764356951413091], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 3142, 13, 0.4137492043284532, 9672.133354551243, 917, 60012, 6859.5, 21434.300000000003, 26949.0, 39122.47000000001, 0.8704083328716272, 0.24904886740608898, 0.2932528074616322], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 3162, 8, 0.2530044275774826, 9444.802024035402, 695, 60007, 7117.0, 20379.500000000004, 26289.249999999996, 37787.95999999998, 0.8794869270192736, 0.25164789499588075, 0.2988881353542063], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 8144, 0, 0.0, 695.2593320235776, 340, 8182, 592.0, 1005.0, 1304.0, 2362.2000000000007, 2.263237535727834, 0.8089306035902217, 0.6564272930773111], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 3200, 14, 0.4375, 13739.483124999995, 2356, 60012, 11401.0, 25734.8, 30825.19999999997, 42154.269999999786, 0.8823217193141603, 0.2524574253921162, 0.3127761563584377], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 3155, 9, 0.28526148969889065, 9448.191125198122, 798, 60011, 6854.0, 20694.0, 26434.39999999999, 37729.64000000002, 0.8733675224653379, 0.24989667255970593, 0.2976613919339872], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM", 8143, 0, 0.0, 316.986245855338, 113, 6511, 210.0, 579.0, 882.9999999999964, 1547.6799999999985, 2.26411925677498, 0.8114568039418141, 0.6588940805849063], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 3216, 0, 0.0, 252.7179726368169, 48, 6477, 116.0, 582.3000000000002, 909.0, 1903.9199999999983, 0.8933253926631763, 134.1295455845948, 0.20064925811770562], "isController": false}, {"data": ["WIFSGriddedHighResItemSector", 3214, 0, 0.0, 301.1658369632861, 45, 7246, 133.0, 769.5, 1117.5, 2151.2499999999995, 0.8931270897061963, 18.6065833395742, 0.20147691183801886], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 8135, 0, 0.0, 697.4368776889976, 346, 8007, 593.0, 995.4000000000005, 1321.0, 2528.4800000000023, 2.2638499753439327, 0.8113602938976789, 0.6588157154809491], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 2, 1.9230769230769231, 0.0015062055669357755], "isController": false}, {"data": ["504/Gateway Time-out", 102, 98.07692307692308, 0.07681648391372455], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 132784, 104, "504/Gateway Time-out", 102, "502/Bad Gateway", 2, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 3214, 11, "504/Gateway Time-out", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 3188, 24, "504/Gateway Time-out", 23, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 3168, 7, "504/Gateway Time-out", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 8147, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 3207, 17, "504/Gateway Time-out", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 3142, 13, "504/Gateway Time-out", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 3162, 8, "504/Gateway Time-out", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 3200, 14, "504/Gateway Time-out", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 3155, 9, "504/Gateway Time-out", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
