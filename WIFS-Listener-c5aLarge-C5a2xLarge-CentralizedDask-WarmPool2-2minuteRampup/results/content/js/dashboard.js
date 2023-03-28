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

    var data = {"OkPercent": 97.15010926777833, "KoPercent": 2.849890732221665};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9049901786549434, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9312794908372655, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.9712161123916145, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.9753127057274523, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.9758117595436595, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.9294921017990346, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.9726031154014919, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.9743716386785205, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.8731097961867192, 500, 1500, "WIFSGriddedLowResItemGlobal"], "isController": false}, {"data": [0.9396125987708516, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.9316722463092036, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.9387273724629731, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.9713885993306633, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.928007889546351, 500, 1500, "WIFSGriddedHighResItemGlobal"], "isController": false}, {"data": [0.9151873767258383, 500, 1500, "WIFSGriddedHighResItemSector"], "isController": false}, {"data": [0.9403886266330004, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 235202, 6703, 2.849890732221665, 1455.7046453686512, 1, 90002, 138.0, 417.0, 470.0, 56568.85000000002, 64.34038399831053, 9951.236892363224, 18.97087705761985], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 18226, 5, 0.027433336991111598, 323.60688028091835, 101, 90001, 208.0, 580.0, 743.0, 1035.4599999999991, 5.06453629732546, 1.8051311761896491, 1.5084800494963528], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 1521, 1004, 66.00920447074293, 17005.25904010516, 1, 72029, 3.0, 56607.2, 60182.2, 67223.01999999999, 0.42272933066188406, 188.44378918662332, 0.14861578031081862], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM", 18222, 0, 0.0, 147.8945779826589, 36, 76443, 74.0, 349.0, 516.0, 786.5400000000009, 5.064304325169359, 1.8150387571651903, 1.468846078686816], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 1500, 722, 48.13333333333333, 31405.520666666664, 1, 80253, 47438.0, 66463.2, 69795.45000000001, 74663.02, 0.4120664031273093, 5792.336397619355, 0.14406227765583665], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 1486, 1028, 69.17900403768506, 16952.323014804806, 1, 72392, 3.0, 57978.29999999999, 62121.34999999998, 68912.72, 0.4093684211106281, 15.763331974683346, 0.13832175166433333], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC", 18228, 0, 0.0, 134.65350010972145, 35, 12351, 72.0, 320.0, 493.0, 761.0, 5.064910490183193, 1.8053636024578765, 1.508591503423705], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC", 18232, 1, 0.005484861781483106, 137.93330408073805, 35, 90001, 72.0, 320.0, 486.34999999999854, 750.0, 5.06488762211138, 1.8003897389632704, 1.5036385128143157], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 18232, 3, 0.01645458534444932, 317.5490346643268, 99, 90002, 208.0, 584.7000000000007, 744.0, 1077.0199999999895, 5.0645541764516, 1.8002321473909713, 1.503539521134069], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 1521, 780, 51.282051282051285, 26285.1972386588, 1, 72520, 4.0, 59953.4, 62880.09999999999, 67759.73999999999, 0.41657970804910877, 964.5823953827919, 0.1468606197321565], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM", 18232, 0, 0.0, 139.1188569548041, 34, 10058, 73.0, 334.7000000000007, 511.34999999999854, 765.0, 5.065136679790682, 1.8103906492220605, 1.4641410715019942], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 18222, 1, 0.005487871803314674, 138.77834485786406, 36, 90000, 71.0, 327.0, 498.84999999999854, 756.3100000000013, 5.0645337554982515, 1.8052095034112368, 1.5084792924091472], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal", 1521, 0, 0.0, 353.58382642998043, 47, 10899, 147.0, 760.3999999999999, 1174.3999999999992, 2339.719999999998, 0.4226972587207363, 6.815957201468324, 0.09287781563688054], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 18224, 4, 0.021949078138718173, 306.4616988586493, 100, 90002, 203.0, 542.0, 722.0, 990.75, 5.064395692040056, 1.814990087759886, 1.4688725786483365], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 18221, 6, 0.03292903792327534, 325.3885077657645, 98, 90002, 208.0, 569.0, 735.8999999999978, 1037.3399999999965, 5.063811078521448, 1.8048528503599501, 1.5082640419424236], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 1455, 775, 53.264604810996566, 25941.40412371133, 1, 71665, 4.0, 59408.8, 62926.0, 67615.68000000001, 0.4062429064544041, 323.1109866265114, 0.13647222638702636], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 1478, 590, 39.918809201623816, 33054.593369418144, 1, 73746, 49667.5, 60966.3, 64144.4, 68632.54000000001, 0.4085886551683148, 96.04891969266697, 0.13845728842129415], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 18230, 3, 0.016456390565002744, 303.3121777290189, 101, 90002, 203.0, 545.9000000000015, 723.0, 986.6899999999987, 5.0649708229341215, 1.810271134132541, 1.4640931285043943], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 1506, 850, 56.440903054448874, 24879.798804780887, 1, 75740, 3.0, 63865.4, 67310.19999999997, 72400.82, 0.41278017865762023, 2371.629426543218, 0.14592424284576028], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 1458, 927, 63.58024691358025, 20134.88614540466, 1, 74031, 3.0, 58936.4, 62542.899999999994, 68357.75000000003, 0.4080862657419697, 150.78240276104435, 0.1386855668732475], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM", 18227, 1, 0.005486366379546826, 147.28765018927902, 34, 90001, 73.0, 347.2000000000007, 516.0, 810.7600000000093, 5.064894393603455, 1.8152298843288381, 1.4690172215822521], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 1521, 0, 0.0, 211.19000657462183, 29, 9894, 86.0, 566.8, 739.8999999999999, 1586.1399999999996, 0.4226815182297731, 59.081554971245986, 0.09452545671349417], "isController": false}, {"data": ["WIFSGriddedHighResItemSector", 1521, 0, 0.0, 225.5798816568049, 28, 5134, 85.0, 601.8, 781.0, 1626.3599999999997, 0.42270383718370863, 6.661262881732691, 0.09494324467993455], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 18218, 3, 0.01646723021187836, 300.1605554945677, 101, 90001, 201.0, 538.0, 726.0, 998.6200000000026, 5.064384793168612, 1.8150065154298611, 1.4688694175498809], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503/Service Unavailable", 6675, 99.5822765925705, 2.8379860715470104], "isController": false}, {"data": ["502/Bad Gateway", 1, 0.01491869312248247, 4.2516645266621884E-4], "isController": false}, {"data": ["504/Gateway Time-out", 27, 0.4028047143070267, 0.011479494221987909], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 235202, 6703, "503/Service Unavailable", 6675, "504/Gateway Time-out", 27, "502/Bad Gateway", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 18226, 5, "504/Gateway Time-out", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 1521, 1004, "503/Service Unavailable", 1004, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 1500, 722, "503/Service Unavailable", 721, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 1486, 1028, "503/Service Unavailable", 1028, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC", 18232, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 18232, 3, "504/Gateway Time-out", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 1521, 780, "503/Service Unavailable", 780, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 18222, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 18224, 4, "504/Gateway Time-out", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 18221, 6, "504/Gateway Time-out", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 1455, 775, "503/Service Unavailable", 775, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 1478, 590, "503/Service Unavailable", 590, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 18230, 3, "504/Gateway Time-out", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 1506, 850, "503/Service Unavailable", 850, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 1458, 927, "503/Service Unavailable", 927, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM", 18227, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 18218, 3, "504/Gateway Time-out", 3, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
