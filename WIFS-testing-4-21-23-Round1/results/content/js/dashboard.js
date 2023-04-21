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

    var data = {"OkPercent": 98.32974724915569, "KoPercent": 1.6702527508443186};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9174423275955986, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9664814646142635, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.0693496227093065, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.9991345934866773, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.22164948453608246, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.9993168776755624, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.9992033142128744, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.9661036241121835, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.013542795232936078, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.9991121835731197, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.998997995991984, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.9678404599353216, 500, 1500, "WIFSGriddedLowResItemGlobal"], "isController": false}, {"data": [0.9661155895614155, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.9648371669323617, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.1521819526627219, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.2126796903796535, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.9667562275149142, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.20509037255625231, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.9990663994899354, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.987603305785124, 500, 1500, "WIFSGriddedHighResItemGlobal"], "isController": false}, {"data": [0.9856270212001438, 500, 1500, "WIFSGriddedHighResItemSector"], "isController": false}, {"data": [0.9660395408163265, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 293728, 4906, 1.6702527508443186, 1161.1600426244743, 4, 60094, 175.0, 292.0, 557.8500000000022, 33935.97, 80.78947752041479, 171.55924930149686, 23.94669743420562], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 21958, 2, 0.009108297659167501, 271.78764004007604, 153, 30348, 217.0, 328.0, 393.0, 522.9900000000016, 6.102205692520309, 2.1750548503406124, 1.8235106854601706], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 2783, 994, 35.71685231764283, 17036.07761408548, 5, 60017, 5325.0, 44637.799999999996, 59997.0, 60010.0, 0.7662499786617415, 0.23732977877526104, 0.27013304911805536], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM", 21955, 0, 0.0, 103.28153040309736, 52, 9815, 76.0, 114.0, 148.0, 203.0, 6.102584571732261, 2.187156775220449, 1.7759474632580214], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 2731, 1050, 38.44745514463566, 21976.43207616261, 6, 60019, 17108.0, 44062.000000000015, 60000.0, 60010.0, 0.7529242325535104, 0.23009287912119875, 0.26396464793624047], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 2716, 198, 7.2901325478645065, 7753.109351988219, 6, 60015, 1831.5, 22618.80000000001, 59993.0, 60009.0, 0.7549324243754226, 0.2188627160875933, 0.25582182740065595], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC", 21958, 0, 0.0, 102.03688860552016, 53, 7868, 75.0, 113.0, 147.0, 211.0, 6.102354928725728, 2.1751558095555574, 1.8235552814356182], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC", 21966, 0, 0.0, 101.95565874533258, 52, 3917, 75.0, 113.0, 149.0, 202.9900000000016, 6.10171412444319, 2.168968692673165, 1.8174050858937234], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 21964, 4, 0.01821161901293025, 277.96990529957935, 154, 31184, 217.0, 328.0, 396.0, 527.9900000000016, 6.10170094220219, 2.168869596630452, 1.8174011595426447], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 2769, 978, 35.31960996749729, 16861.59046587217, 6, 60094, 5688.0, 42368.0, 59995.0, 60010.0, 0.7632653533761468, 0.23619950034235304, 0.2698262284396144], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM", 21964, 0, 0.0, 104.1392278273537, 52, 9684, 76.0, 114.0, 151.0, 210.9900000000016, 6.101683991441418, 2.180875332878476, 1.769726704548927], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 21956, 0, 0.0, 103.0118874111861, 52, 10467, 75.0, 112.0, 145.0, 208.0, 6.102584342740882, 2.1752375831058806, 1.823623836795615], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal", 2783, 59, 2.1200143729787997, 187.87279913762148, 5, 8878, 133.0, 397.5999999999999, 450.0, 669.4799999999996, 0.774385778236838, 12.086814707802931, 0.17090936121242714], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 21957, 1, 0.00455435624174523, 272.21961105797646, 152, 30376, 217.0, 327.0, 385.0, 517.9900000000016, 6.102492525092843, 2.1870993584732847, 1.7759206762477218], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 21955, 5, 0.02277385561375541, 278.75536324299486, 151, 30847, 217.0, 328.0, 393.0, 529.9900000000016, 6.1023555843015895, 2.1751031136188845, 1.8235554773401232], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 2704, 188, 6.952662721893491, 8220.31915680472, 5, 60025, 2148.5, 21844.5, 50671.75, 60010.0, 0.7531399865526632, 0.21833039959103717, 0.25374345250065317], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 2713, 265, 9.767784740140065, 8503.396977515678, 5, 60014, 1871.0, 28503.199999999993, 59996.0, 60009.0, 0.7554415880479283, 0.21961416858125954, 0.25673210218816317], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 21959, 1, 0.0045539414363131294, 269.3967393779334, 154, 30196, 217.0, 325.0, 385.0, 521.0, 6.101327210241138, 2.1807236623252004, 1.7696232240640803], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 2750, 925, 33.63636363636363, 17644.32254545452, 4, 60014, 8525.0, 42663.80000000001, 59997.0, 60010.0, 0.7590512025579197, 0.2330597173700449, 0.26907772121926254], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 2711, 207, 7.635558834378458, 7781.454075986704, 5, 60017, 1796.0, 20103.80000000001, 59996.4, 60010.0, 0.7539586304484706, 0.21850309184570518, 0.2569644160415197], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM", 21958, 0, 0.0, 103.37799435285547, 52, 7790, 76.0, 114.0, 148.0, 205.0, 6.102507564213481, 2.1871291758460427, 1.7759250528668138], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 2783, 18, 0.6467840459935321, 145.55839022637397, 6, 10295, 84.0, 322.0, 372.0, 472.6399999999994, 0.7743689713719993, 116.72312540076656, 0.17393053067925765], "isController": false}, {"data": ["WIFSGriddedHighResItemSector", 2783, 11, 0.3952569169960474, 156.43011139058575, 8, 9921, 82.0, 336.0, 389.7999999999997, 665.6799999999785, 0.7743965522518718, 16.744297462345212, 0.1746929722365062], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 21952, 0, 0.0, 271.4131741982488, 151, 18866, 216.0, 327.0, 392.0, 524.0, 6.102086528876779, 2.1869782774392363, 1.7758025250051563], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["408/Request Timeout", 9, 0.18344883815735832, 0.0030640592657152194], "isController": false}, {"data": ["502/Bad Gateway", 2140, 43.62005707297187, 0.7285652031811745], "isController": false}, {"data": ["504/Gateway Time-out", 1175, 23.950264981655117, 0.4000299596905981], "isController": false}, {"data": ["502/Proxy Error", 1129, 23.012637586628617, 0.3843692123324981], "isController": false}, {"data": ["500/INTERNAL SERVER ERROR", 438, 8.92784345699144, 0.14911755093147402], "isController": false}, {"data": ["404/NOT FOUND", 15, 0.30574806359559725, 0.0051067654428586995], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 293728, 4906, "502/Bad Gateway", 2140, "504/Gateway Time-out", 1175, "502/Proxy Error", 1129, "500/INTERNAL SERVER ERROR", 438, "404/NOT FOUND", 15], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 21958, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 2783, 994, "502/Bad Gateway", 506, "502/Proxy Error", 309, "504/Gateway Time-out", 153, "500/INTERNAL SERVER ERROR", 26, "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 2731, 1050, "502/Bad Gateway", 589, "502/Proxy Error", 237, "504/Gateway Time-out", 170, "500/INTERNAL SERVER ERROR", 53, "408/Request Timeout", 1], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 2716, 198, "504/Gateway Time-out", 138, "500/INTERNAL SERVER ERROR", 56, "408/Request Timeout", 4, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 21964, 4, "502/Bad Gateway", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 2769, 978, "502/Bad Gateway", 500, "502/Proxy Error", 294, "504/Gateway Time-out", 145, "500/INTERNAL SERVER ERROR", 37, "408/Request Timeout", 2], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal", 2783, 59, "500/INTERNAL SERVER ERROR", 57, "404/NOT FOUND", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 21957, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 21955, 5, "502/Bad Gateway", 4, "502/Proxy Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 2704, 188, "504/Gateway Time-out", 126, "500/INTERNAL SERVER ERROR", 57, "502/Bad Gateway", 4, "502/Proxy Error", 1, "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 2713, 265, "504/Gateway Time-out", 145, "502/Bad Gateway", 52, "500/INTERNAL SERVER ERROR", 40, "502/Proxy Error", 28, "", ""], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 21959, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 2750, 925, "502/Bad Gateway", 477, "502/Proxy Error", 258, "504/Gateway Time-out", 148, "500/INTERNAL SERVER ERROR", 41, "408/Request Timeout", 1], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 2711, 207, "504/Gateway Time-out", 150, "500/INTERNAL SERVER ERROR", 55, "408/Request Timeout", 1, "502/Proxy Error", 1, "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 2783, 18, "500/INTERNAL SERVER ERROR", 10, "404/NOT FOUND", 8, "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResItemSector", 2783, 11, "500/INTERNAL SERVER ERROR", 6, "404/NOT FOUND", 5, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
