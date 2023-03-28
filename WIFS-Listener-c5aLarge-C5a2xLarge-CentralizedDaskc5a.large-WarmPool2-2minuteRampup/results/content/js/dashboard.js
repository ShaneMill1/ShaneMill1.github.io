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

    var data = {"OkPercent": 99.77852736542633, "KoPercent": 0.22147263457367397};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9396988817216416, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9565955166562472, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.0014154281670205238, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.9988165416220078, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.0021961932650073207, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.998928475756764, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.9988840780252645, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.9573475582537273, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.9987948042672856, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.9987050102706082, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.9865534324133051, 500, 1500, "WIFSGriddedLowResItemGlobal"], "isController": false}, {"data": [0.9563722425649728, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.9548702603724711, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [7.363770250368188E-4, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.9554910714285715, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.9988391302406572, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.9897454031117398, 500, 1500, "WIFSGriddedHighResItemGlobal"], "isController": false}, {"data": [0.9900920028308563, 500, 1500, "WIFSGriddedHighResItemSector"], "isController": false}, {"data": [0.9551138901295221, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 284008, 629, 0.22147263457367397, 1202.66079476636, 1, 90005, 124.0, 372.90000000000146, 736.0, 49481.870000000024, 78.06543898478206, 18016.694411038367, 22.994584472242334], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 22394, 1, 0.00446548182548897, 270.51384299366055, 92, 90001, 233.0, 349.90000000000146, 454.0, 780.9900000000016, 6.224110214055583, 2.2185350964502226, 1.8538609524286649], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 1413, 87, 6.1571125265392785, 23957.573956121723, 1, 90001, 20756.0, 50872.40000000002, 55035.5, 70255.6599999998, 0.38899568911288335, 478.4210623813295, 0.13675629695374805], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM", 22392, 0, 0.0, 102.09816005716314, 33, 4253, 81.0, 130.0, 176.0, 277.0, 6.2176114009534675, 2.228382211083909, 1.8033501817218553], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 1382, 64, 4.630969609261939, 32751.74240231546, 1, 90002, 30063.5, 63956.50000000001, 69809.65, 87649.33000000002, 0.3811064938947126, 9850.391050926837, 0.13323840313897178], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 1366, 79, 5.783308931185944, 25731.180087847693, 1, 90005, 21177.0, 54071.2, 60825.45, 69620.62999999996, 0.37808773960549336, 44.13433177273536, 0.12775230264013743], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC", 22398, 0, 0.0, 101.94544155728177, 34, 1900, 81.0, 127.0, 169.95000000000073, 269.0, 6.223203452185832, 2.2182316992654574, 1.853590871988944], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC", 22403, 0, 0.0, 101.48426550015557, 33, 1117, 81.0, 126.0, 170.0, 265.0, 6.2232180506935455, 2.2121595414574715, 1.8475178587996464], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 22402, 0, 0.0, 266.69895545040646, 94, 14502, 231.0, 350.0, 458.9500000000007, 774.9900000000016, 6.200155820360988, 2.203961639268945, 1.8406712591696683], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 1402, 66, 4.70756062767475, 24966.097717546363, 1, 84058, 22412.5, 51605.4, 56933.04999999997, 70177.76000000004, 0.38582773809726933, 1747.275684995594, 0.13601934907530686], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM", 22403, 0, 0.0, 101.26041155202451, 32, 4996, 81.0, 126.0, 159.0, 268.0, 6.215139884341748, 2.2214269508487106, 1.7965638728175366], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 22394, 0, 0.0, 101.5561311065464, 34, 2691, 81.0, 127.0, 165.0, 268.0, 6.222003899796675, 2.217804124439245, 1.8532335834355331], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal", 1413, 0, 0.0, 162.81670205237097, 48, 908, 137.0, 336.2000000000003, 433.29999999999995, 569.0199999999993, 0.3926478973746778, 6.331394699468745, 0.08627517276299074], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 22394, 0, 0.0, 267.20496561578864, 94, 1874, 236.0, 358.0, 464.0, 777.0, 6.224143082471147, 2.2307231555340925, 1.8052446245057914], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 22391, 0, 0.0, 267.57433790362126, 95, 2881, 234.0, 349.0, 467.0, 781.0, 6.223188192312663, 2.2182262599551974, 1.8535863268118773], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 1346, 84, 6.240713224368499, 26546.754829123303, 1, 90004, 22842.0, 54313.4, 62164.19999999997, 85393.51, 0.375967781851538, 599.7294102015023, 0.12630167671575104], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 1358, 94, 6.9219440353460975, 24673.956553755517, 1, 90002, 20635.0, 52941.600000000006, 59439.25, 71560.05000000008, 0.378075412402878, 137.588735728732, 0.1281173516638659], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 22400, 0, 0.0, 268.3248214285719, 93, 10843, 235.0, 361.0, 469.0, 774.0, 6.20742785250708, 2.2186705019703044, 1.794334613615328], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 1392, 80, 5.747126436781609, 27431.479885057463, 1, 88543, 24350.0, 54996.4, 61030.79999999999, 70990.57999999999, 0.3832584345765187, 4764.53927372062, 0.1354878450358396], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 1351, 74, 5.477424130273871, 25627.983715766124, 1, 90002, 21473.0, 53703.8, 61202.79999999997, 72516.36, 0.37749809574424686, 361.71702561075546, 0.1282903684755839], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM", 22397, 0, 0.0, 101.02553913470554, 34, 4698, 81.0, 124.0, 162.0, 270.9900000000016, 6.216755679031433, 2.2280755216841173, 1.8031019889378277], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 1414, 0, 0.0, 119.14356435643546, 31, 2903, 82.0, 255.5, 343.5, 782.6999999999925, 0.39270752676465653, 54.892294364997625, 0.08782228870029918], "isController": false}, {"data": ["WIFSGriddedHighResItemSector", 1413, 0, 0.0, 120.32342533616428, 29, 2788, 83.0, 272.60000000000014, 348.29999999999995, 657.599999999999, 0.39260240379365613, 6.186958817174813, 0.08818218053959075], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 22390, 0, 0.0, 268.7257257704344, 94, 14027, 234.0, 360.0, 472.9500000000007, 786.9900000000016, 6.200879699610444, 2.2223855954658527, 1.7984973347502948], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503/Service Unavailable", 591, 93.95866454689984, 0.20809272978225965], "isController": false}, {"data": ["502/Bad Gateway", 2, 0.3179650238473768, 7.042055153375961E-4], "isController": false}, {"data": ["504/Gateway Time-out", 35, 5.5643879173290935, 0.012323596518407932], "isController": false}, {"data": ["502/Proxy Error", 1, 0.1589825119236884, 3.5210275766879806E-4], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 284008, 629, "503/Service Unavailable", 591, "504/Gateway Time-out", 35, "502/Bad Gateway", 2, "502/Proxy Error", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 22394, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 1413, 87, "503/Service Unavailable", 84, "504/Gateway Time-out", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 1382, 64, "503/Service Unavailable", 53, "504/Gateway Time-out", 8, "502/Bad Gateway", 2, "502/Proxy Error", 1, "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 1366, 79, "503/Service Unavailable", 75, "504/Gateway Time-out", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 1402, 66, "503/Service Unavailable", 66, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 1346, 84, "503/Service Unavailable", 74, "504/Gateway Time-out", 10, "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 1358, 94, "503/Service Unavailable", 90, "504/Gateway Time-out", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 1392, 80, "503/Service Unavailable", 80, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 1351, 74, "503/Service Unavailable", 69, "504/Gateway Time-out", 5, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
