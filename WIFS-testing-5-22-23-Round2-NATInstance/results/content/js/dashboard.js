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

    var data = {"OkPercent": 99.99643763637174, "KoPercent": 0.0035623636282673555};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.465543037805584, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.023045639403524627, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.47145003756574005, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.750093984962406, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.12511425959780623, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.787981220657277, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.7952925731432858, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.4662225558266091, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.0019230769230769232, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.7536585365853659, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.7824248120300752, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.7295526434704022, 500, 1500, "WIFSGriddedLowResItemGlobal"], "isController": false}, {"data": [0.5081751550460439, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.47058270676691727, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.06346286502644286, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.11134020618556702, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.5137976346911958, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.08771526980482204, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.7510798122065727, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.8291911432444645, 500, 1500, "WIFSGriddedHighResItemGlobal"], "isController": false}, {"data": [0.7451423407139629, 500, 1500, "WIFSGriddedHighResItemSector"], "isController": false}, {"data": [0.513063909774436, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 112285, 4, 0.0035623636282673555, 3033.410446631327, 42, 53870, 753.0, 8977.0, 14516.100000000013, 23624.290000000114, 30.94480808762271, 54217.96876307984, 9.323691725112766], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 4426, 0, 0.0, 7387.885675553553, 828, 46319, 5225.0, 15838.7, 20834.899999999998, 32366.57999999998, 1.2236707579183332, 1628.6555546092106, 0.430196750830664], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 5324, 0, 0.0, 1042.8279489105971, 330, 23998, 864.0, 1873.0, 2167.0, 2642.5, 1.4798475012146757, 0.5274847050228092, 0.4407748904985118], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM", 5320, 0, 0.0, 593.3772556390985, 114, 17916, 418.0, 1316.0, 1580.8999999999996, 2063.58, 1.4804087931829957, 0.5305761983380464, 0.4293763784915525], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 4409, 3, 0.06804264005443411, 14083.415740530741, 3910, 53870, 12224.0, 23448.0, 28545.0, 38884.29999999986, 1.2179211475474594, 29447.909770227445, 0.42579665119335003], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 4376, 0, 0.0, 6019.935557586849, 673, 45261, 3596.0, 14963.400000000001, 19136.099999999988, 31530.489999999972, 1.2129954612459593, 99.55890399365104, 0.40985979452256044], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC", 5325, 0, 0.0, 526.3295774647885, 113, 17596, 347.0, 1190.800000000001, 1476.0, 1928.4399999999987, 1.4807000137920603, 0.5277885791348652, 0.4410288127017367], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC", 5332, 0, 0.0, 521.6888597149283, 112, 20989, 336.0, 1188.6999999999998, 1456.3499999999995, 1903.67, 1.4808021993189755, 0.526378906789167, 0.43961315292282077], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 5329, 0, 0.0, 1042.2542690936407, 346, 27999, 873.0, 1875.0, 2166.5, 2660.0999999999995, 1.4804517308561533, 0.5262543262027732, 0.4395091075979205], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 4420, 1, 0.02262443438914027, 7979.955203619903, 1332, 47257, 5929.5, 16353.700000000004, 20846.899999999994, 32299.989999999994, 1.2242573577313238, 5896.284254385895, 0.431598541153328], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM", 5330, 0, 0.0, 581.199249530956, 114, 4985, 414.0, 1284.800000000001, 1534.0, 1999.7599999999984, 1.4805654259917287, 0.5291864706181374, 0.4279759434507341], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 5320, 0, 0.0, 538.7039473684213, 115, 22634, 357.5, 1197.9000000000005, 1492.9499999999998, 1952.5299999999997, 1.4803980823835967, 0.5276809570996218, 0.440938881959958], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal", 4426, 0, 0.0, 616.9389968368745, 58, 22404, 465.0, 1333.0, 1595.6499999999996, 2369.78999999999, 1.2298116798766296, 53.49620052559097, 0.2702222929416423], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 5321, 0, 0.0, 955.9349746288275, 335, 24254, 772.0, 1782.6000000000004, 2091.0, 2661.579999999997, 1.4789038712483689, 0.5300368366681166, 0.4289398923444976], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 5320, 0, 0.0, 1039.0409774436064, 323, 22934, 867.0, 1890.0, 2168.7999999999993, 2742.4299999999994, 1.4799351944167498, 0.5275159628536267, 0.4408010100557702], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 4349, 0, 0.0, 6622.56426764773, 918, 43014, 4435.0, 14867.0, 19844.0, 31038.5, 1.2134852277914623, 2108.700174432398, 0.40765519371119446], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 4365, 0, 0.0, 6049.977319587646, 722, 42994, 3770.0, 14742.800000000001, 18713.5, 29220.520000000004, 1.2150272566939233, 263.11650868354786, 0.4117328692117103], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 5327, 0, 0.0, 941.2333395907641, 340, 22792, 754.0, 1748.0, 2063.0, 2561.0, 1.4799072106235502, 0.5289512100470892, 0.4277856780708699], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 4414, 0, 0.0, 10081.917988219293, 2415, 49895, 7928.5, 19018.5, 23723.5, 35843.35000000004, 1.2210360106037048, 13939.145166983295, 0.43165530843607525], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 4355, 0, 0.0, 6238.465671641791, 799, 41065, 4060.0, 14442.600000000002, 19112.8, 30853.64, 1.2132994333849856, 683.9060066283795, 0.4123322293144287], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM", 5325, 0, 0.0, 585.648638497652, 113, 7678, 415.0, 1311.4000000000005, 1558.6999999999998, 2060.8799999999974, 1.4802801663028746, 0.5305300986651904, 0.42933907167182983], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 4426, 0, 0.0, 432.42928151830057, 43, 22403, 228.0, 1066.0, 1347.0, 1840.2999999999956, 1.2302051212777678, 250.14354986192504, 0.27511423122325085], "isController": false}, {"data": ["WIFSGriddedHighResItemSector", 4426, 0, 0.0, 688.9801174875714, 42, 22701, 410.5, 1352.0, 1610.0, 3862.959999999759, 1.2298092878665114, 35.750829603754674, 0.2762266955168923], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 5320, 0, 0.0, 952.5964285714286, 342, 22589, 760.5, 1754.0, 2111.7999999999993, 2695.4799999999996, 1.4796116742473586, 0.5302905121570124, 0.4291451828627593], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 4, 100.0, 0.0035623636282673555], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 112285, 4, "502/Bad Gateway", 4, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 4409, 3, "502/Bad Gateway", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 4420, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
