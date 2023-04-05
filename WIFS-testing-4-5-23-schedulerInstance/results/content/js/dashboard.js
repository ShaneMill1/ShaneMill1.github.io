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

    var data = {"OkPercent": 99.85035333240958, "KoPercent": 0.14964666759041154};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.24941111265068588, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3305351521511018, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.08593298671288273, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.40875656742556915, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.09749344214514719, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.4110450891296749, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.4173351935821416, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.33024799161718477, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.03157589803012746, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.40753663642707605, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.4119397759103641, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.3430551544903263, 500, 1500, "WIFSGriddedLowResItemGlobal"], "isController": false}, {"data": [0.34610003497726477, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.3318739054290718, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.07796410709032069, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.08845029239766082, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.34498427123383435, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.0806924882629108, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.40804195804195803, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.34293948126801155, 500, 1500, "WIFSGriddedHighResItemGlobal"], "isController": false}, {"data": [0.3443001443001443, 500, 1500, "WIFSGriddedHighResItemSector"], "isController": false}, {"data": [0.3433777154870357, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 72170, 108, 0.14964666759041154, 4715.709727033369, 33, 60012, 1623.0, 14774.0, 20282.850000000002, 30726.540000000074, 19.958252766556196, 170.222628221732, 6.046261087380477], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 2859, 0, 0.0, 1545.6302903113008, 232, 7688, 1386.0, 2247.0, 3533.0, 4737.000000000002, 0.7946129742872247, 0.28323606993636424, 0.23667671597422218], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 3462, 9, 0.25996533795493937, 9091.767475447714, 1028, 60005, 6611.5, 20697.200000000048, 26148.84999999999, 41144.28, 0.959345849166558, 0.2744978904678931, 0.33727002509761805], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM", 2855, 0, 0.0, 1367.831523642727, 83, 10497, 1235.0, 1990.8000000000002, 2949.199999999999, 4319.720000000001, 0.7941196759212901, 0.28461125103819673, 0.2303257263170148], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 3437, 10, 0.2909514111143439, 13194.379400640053, 3550, 60010, 11120.0, 24480.40000000002, 30282.6, 44006.019999999975, 0.9523954671850299, 0.2725088875753541, 0.3329663840353913], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 3431, 13, 0.3788982803847275, 8804.341008452333, 927, 60010, 6245.0, 19930.4, 25961.799999999974, 41808.91999999986, 0.9529615829550141, 0.27267005180739123, 0.3219967848656591], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC", 2861, 0, 0.0, 1356.9891646277545, 79, 9697, 1217.0, 1979.0, 3041.6000000000013, 4252.7400000000025, 0.7948323948236159, 0.2833142813580271, 0.23674207072383088], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC", 2867, 0, 0.0, 1345.546564352982, 84, 6418, 1220.0, 1948.6000000000008, 2990.5999999999995, 4108.32, 0.7961407583525357, 0.28300316019562793, 0.23635428763590904], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 2863, 0, 0.0, 1555.3440447083497, 226, 11226, 1398.0, 2282.5999999999995, 3567.399999999999, 4688.600000000001, 0.7952711505181901, 0.2826940417857629, 0.23609612281008768], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 3452, 16, 0.46349942062572425, 10111.081402085734, 1383, 60010, 7701.0, 21386.2, 27220.399999999987, 43776.13999999995, 0.9576806151794042, 0.274019513089319, 0.33761982624977044], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM", 2866, 0, 0.0, 1370.1859734822074, 79, 5262, 1238.0, 2044.9000000000005, 3011.2000000000007, 4143.189999999997, 0.7959846379964073, 0.28450232178387214, 0.23008930942083647], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 2856, 0, 0.0, 1354.5112044817927, 78, 8734, 1215.0, 1994.0, 3003.800000000001, 4226.769999999993, 0.793634473525232, 0.28288728792647433, 0.23638526799335527], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal", 3463, 0, 0.0, 1616.999711233032, 52, 5903, 1344.0, 3051.6, 3769.7999999999997, 4560.640000000007, 0.961624170172212, 15.503988871137086, 0.2112943733288552], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 2859, 0, 0.0, 1506.0779993004553, 241, 6000, 1367.0, 2159.0, 3265.0, 4475.8, 0.7941545337501789, 0.2846237440296051, 0.23033583644902647], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 2855, 0, 0.0, 1548.9183887915933, 230, 6906, 1389.0, 2297.4, 3433.999999999999, 4740.120000000001, 0.7935285867631094, 0.2828495450864599, 0.23635372945580896], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 3399, 14, 0.41188584877905265, 9328.032068255376, 1110, 60011, 6824.0, 20833.0, 26435.0, 43073.0, 0.9470520184829782, 0.27097884828346475, 0.31815028745912544], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 3420, 12, 0.3508771929824561, 8757.26783625729, 964, 60011, 6426.5, 19652.7, 24928.899999999987, 39280.94999999999, 0.9497699446134159, 0.27175709106016543, 0.32184586990317904], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 2861, 0, 0.0, 1518.2740300594155, 239, 6223, 1368.0, 2217.000000000001, 3432.9, 4601.780000000003, 0.7952546009967784, 0.2842413905906454, 0.22987828310063124], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 3447, 14, 0.40615027560197275, 11301.494633014228, 2139, 60012, 9006.0, 22880.400000000012, 28915.59999999999, 41773.4, 0.9552765937280978, 0.27333218955450633, 0.3377052020796596], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 3408, 20, 0.5868544600938967, 9137.130868544604, 1015, 60010, 6604.5, 20156.7, 25577.199999999953, 41773.61999999997, 0.9482824345704598, 0.27132928544080387, 0.32226785862355467], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM", 2860, 0, 0.0, 1369.04440559441, 81, 5823, 1240.0, 2012.7000000000003, 3053.7999999999956, 4148.6799999999985, 0.7946428844314177, 0.2847987681507132, 0.23047747722278425], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 3470, 0, 0.0, 1644.6031700288204, 37, 10064, 1319.5, 3264.9, 3760.699999999999, 4428.87, 0.9634095926165622, 134.65374137174047, 0.215449996786321], "isController": false}, {"data": ["WIFSGriddedHighResItemSector", 3465, 0, 0.0, 1646.8150072150074, 33, 10032, 1338.0, 3231.4, 3768.7, 4630.34, 0.9626246064073849, 15.167396549195674, 0.21621451120478372], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 2854, 0, 0.0, 1518.1976173791163, 235, 6645, 1363.0, 2153.5, 3446.25, 4534.149999999995, 0.7928625700248498, 0.2841607062491405, 0.22996111650134807], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 108, 100.0, 0.14964666759041154], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 72170, 108, "504/Gateway Time-out", 108, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 3462, 9, "504/Gateway Time-out", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 3437, 10, "504/Gateway Time-out", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 3431, 13, "504/Gateway Time-out", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 3452, 16, "504/Gateway Time-out", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 3399, 14, "504/Gateway Time-out", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 3420, 12, "504/Gateway Time-out", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 3447, 14, "504/Gateway Time-out", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 3408, 20, "504/Gateway Time-out", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
