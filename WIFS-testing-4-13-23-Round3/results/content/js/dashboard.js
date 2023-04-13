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

    var data = {"OkPercent": 97.08276605400499, "KoPercent": 2.917233945995008};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.23184706149307918, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0335285505124451, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.05321067821067821, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.5370036101083032, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.045319465081723624, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.5364095169430425, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.5329018338727076, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.05309575233981281, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.006778661951075744, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.5399280575539568, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.5314079422382672, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.5124450951683748, 500, 1500, "WIFSGriddedLowResItemGlobal"], "isController": false}, {"data": [0.05178635871526525, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.04949421965317919, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.0204416592062071, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.03286734086853064, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.05367435158501441, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.023958333333333335, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.5437995674116799, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.6, 500, 1500, "WIFSGriddedHighResItemGlobal"], "isController": false}, {"data": [0.6399707174231333, 500, 1500, "WIFSGriddedHighResItemSector"], "isController": false}, {"data": [0.054371387283237, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 70512, 2057, 2.917233945995008, 4873.495901407, 1, 60005, 1707.0, 14356.900000000001, 27099.950000000015, 48480.74000000004, 19.321251705392562, 192.37544918546698, 5.872671085057131], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 3415, 168, 4.919472913616398, 9066.120351390917, 2, 60003, 5307.0, 20211.00000000001, 31336.399999999998, 60002.0, 0.9361309256539347, 0.27057625283237857, 0.33002271890729534], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 2772, 0, 0.0, 2154.701659451663, 298, 21619, 1684.0, 3058.100000000001, 4878.449999999999, 11339.32, 0.7703725607300642, 0.27459568815085295, 0.2302089878744137], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM", 2770, 0, 0.0, 752.0779783393504, 104, 17961, 580.0, 752.8000000000002, 1269.1499999999987, 5774.939999999997, 0.7700617773025821, 0.27598893776371836, 0.2241000094103217], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 3367, 644, 19.126819126819125, 19728.09296109297, 1, 60003, 18391.0, 31232.4, 33806.2, 50285.52000000006, 0.9254426361619665, 0.2678672168473987, 0.3244471742013144], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 3365, 209, 6.210995542347697, 8016.129271916792, 1, 60003, 4812.0, 18570.000000000004, 28907.0, 54277.40000000004, 0.9255029276421733, 0.26973252303580914, 0.3136225741131193], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC", 2774, 0, 0.0, 758.6045421773615, 102, 18026, 581.0, 787.5, 1387.0, 5414.75, 0.7710065944132873, 0.274821686485205, 0.23039845497115813], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC", 2781, 0, 0.0, 781.9791441927355, 102, 18617, 580.0, 786.8000000000002, 1294.8000000000002, 6397.659999999985, 0.7724712469035875, 0.2745893885477596, 0.23008176787655682], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 2778, 1, 0.03599712023038157, 2255.7973362131056, 331, 60001, 1681.0, 3215.7999999999993, 5410.6499999999905, 13466.390000000003, 0.7717693548669393, 0.27432035401377014, 0.2298727082367348], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 3393, 169, 4.980842911877395, 10122.73239021515, 1, 60004, 6502.0, 23919.6, 30871.799999999996, 60002.0, 0.9304379063638881, 0.2680897272374522, 0.3289243379919214], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM", 2780, 0, 0.0, 740.6255395683455, 102, 19439, 580.0, 738.8000000000002, 1175.2999999999975, 5192.63000000001, 0.772343222660439, 0.2760523627868366, 0.22400970422866248], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 2770, 1, 0.036101083032490974, 798.6191335740083, 103, 19607, 580.0, 790.8000000000002, 1673.249999999999, 6493.339999999995, 0.7700853265662201, 0.27453592932826876, 0.23012315422779625], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal", 3415, 2, 0.05856515373352855, 1381.7232796486142, 119, 7286, 939.0, 3555.000000000002, 4309.399999999999, 5506.68, 0.9488206423362937, 15.341882736517508, 0.20940768082812733], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 2771, 2, 0.07217610970768676, 2162.3702634427973, 19, 22582, 1671.0, 2866.4000000000005, 4681.600000000003, 12034.520000000062, 0.7701631406202273, 0.2759764101232678, 0.22412950771955834], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 2768, 0, 0.0, 2206.3829479768833, 311, 22414, 1685.0, 2975.199999999999, 5227.249999999985, 13391.919999999987, 0.7700546660917222, 0.27448237609714704, 0.2301139920156904], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 3351, 227, 6.7740972843927185, 8955.56609967171, 1, 60004, 5090.0, 20236.2, 30917.399999999998, 60002.0, 0.9236819821647511, 0.2679940325554485, 0.31120144906917885], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 3362, 228, 6.781677572873289, 7635.042831647833, 1, 60003, 4975.0, 15409.500000000004, 27784.09999999999, 60001.37, 0.9256044717543342, 0.27056636585094906, 0.31456089469776205], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 2776, 0, 0.0, 2231.0979827089304, 307, 22578, 1683.0, 2917.600000000002, 4987.200000000004, 14622.640000000001, 0.7713026512695097, 0.27568043980921925, 0.22370789787797302], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 3372, 100, 2.965599051008304, 11829.386714116268, 1, 60005, 10218.5, 19784.000000000004, 26044.449999999997, 54671.39999999997, 0.9250640508093899, 0.26612448177758247, 0.3279279789490318], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 3360, 250, 7.440476190476191, 8440.09375, 1, 60005, 4781.5, 20602.70000000001, 30521.5, 60001.0, 0.9256902177686237, 0.2696779273885562, 0.3154940292980954], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM", 2774, 0, 0.0, 744.9307858687823, 102, 19275, 582.0, 780.5, 1235.5, 5191.0, 0.7709390977566895, 0.2763033680436573, 0.2243553233705991], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 3415, 49, 1.4348462664714494, 1038.108052708639, 6, 10092, 613.0, 2322.0000000000005, 3763.3999999999996, 5395.400000000005, 0.9488222240559635, 151.08434054962646, 0.21311436673131995], "isController": false}, {"data": ["WIFSGriddedHighResItemSector", 3415, 4, 0.1171303074670571, 913.9754026354306, 75, 6640, 531.0, 2325.0000000000005, 3058.7999999999956, 4774.200000000019, 0.9488303963582695, 23.159665335763016, 0.2140427944909768], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 2768, 3, 0.10838150289017341, 2308.688945086702, 294, 60001, 1687.0, 3159.2999999999997, 5119.299999999993, 14800.979999999996, 0.7696433531648107, 0.2757778801601626, 0.22397824144835313], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503/Service Unavailable", 27, 1.3125911521633447, 0.03829135466303608], "isController": false}, {"data": ["502/Bad Gateway", 1128, 54.83714146815751, 1.5997277059223962], "isController": false}, {"data": ["504/Gateway Time-out", 367, 17.841516771998055, 0.5204787837531201], "isController": false}, {"data": ["502/Proxy Error", 429, 20.855614973262032, 0.6084070796460177], "isController": false}, {"data": ["500/INTERNAL SERVER ERROR", 106, 5.153135634419057, 0.15032902201043793], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 70512, 2057, "502/Bad Gateway", 1128, "502/Proxy Error", 429, "504/Gateway Time-out", 367, "500/INTERNAL SERVER ERROR", 106, "503/Service Unavailable", 27], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 3415, 168, "504/Gateway Time-out", 70, "502/Bad Gateway", 48, "502/Proxy Error", 40, "500/INTERNAL SERVER ERROR", 9, "503/Service Unavailable", 1], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 3367, 644, "502/Bad Gateway", 525, "502/Proxy Error", 74, "504/Gateway Time-out", 29, "500/INTERNAL SERVER ERROR", 16, "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 3365, 209, "502/Bad Gateway", 83, "500/INTERNAL SERVER ERROR", 48, "502/Proxy Error", 46, "504/Gateway Time-out", 30, "503/Service Unavailable", 2], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 2778, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 3393, 169, "502/Bad Gateway", 82, "504/Gateway Time-out", 50, "502/Proxy Error", 33, "503/Service Unavailable", 2, "500/INTERNAL SERVER ERROR", 2], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 2770, 1, "502/Proxy Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal", 3415, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 2771, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 3351, 227, "502/Bad Gateway", 94, "504/Gateway Time-out", 64, "502/Proxy Error", 56, "503/Service Unavailable", 9, "500/INTERNAL SERVER ERROR", 4], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 3362, 228, "502/Bad Gateway", 87, "502/Proxy Error", 79, "504/Gateway Time-out", 37, "500/INTERNAL SERVER ERROR", 20, "503/Service Unavailable", 5], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 3372, 100, "502/Bad Gateway", 43, "504/Gateway Time-out", 30, "502/Proxy Error", 24, "503/Service Unavailable", 2, "500/INTERNAL SERVER ERROR", 1], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 3360, 250, "502/Bad Gateway", 109, "502/Proxy Error", 76, "504/Gateway Time-out", 53, "503/Service Unavailable", 6, "500/INTERNAL SERVER ERROR", 6], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 3415, 49, "502/Bad Gateway", 49, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResItemSector", 3415, 4, "502/Bad Gateway", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 2768, 3, "504/Gateway Time-out", 3, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
