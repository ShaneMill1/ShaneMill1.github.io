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

    var data = {"OkPercent": 99.8934741327405, "KoPercent": 0.10652586725950627};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7632086285952481, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.01589895988112927, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.7955167240314183, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.9784182187306911, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.07981927710843373, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.9787384208204676, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.9786155202821869, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.797663139329806, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [5.961251862891207E-4, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.9748677248677249, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.9790361020390149, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.9652303120356612, 500, 1500, "WIFSGriddedLowResItemGlobal"], "isController": false}, {"data": [0.8107953040868567, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.7957454320769706, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.04233687405159332, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.07684178743961352, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.8082723344210248, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.06232980332829047, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.9752933909820877, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.9850059382422803, 500, 1500, "WIFSGriddedHighResItemGlobal"], "isController": false}, {"data": [0.978021978021978, 500, 1500, "WIFSGriddedHighResItemSector"], "isController": false}, {"data": [0.8076277920014125, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 172728, 184, 0.10652586725950627, 1972.0117294243141, 36, 60018, 397.0, 8453.0, 15631.150000000012, 27068.49000000008, 47.73915595819093, 189.56869240730862, 14.243920130407373], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 3365, 22, 0.6537890044576523, 10328.539375928667, 908, 60015, 8018.0, 21305.800000000003, 25888.499999999985, 37645.56000000002, 0.9305626073672905, 0.26625450382623006, 0.3280596691988202], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 11331, 2, 0.017650692789691995, 508.7521842732348, 172, 30556, 463.0, 711.0, 803.0, 1033.0, 3.149639129909063, 1.1226928340914872, 0.9412007556173568], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM", 11329, 0, 0.0, 231.09992055786063, 60, 6973, 184.0, 403.0, 481.0, 675.1000000000022, 3.1505220372467404, 1.1291421754585484, 0.9168511397456334], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 3330, 27, 0.8108108108108109, 16601.863963963948, 3765, 60013, 14517.5, 27617.9, 32610.499999999993, 46412.93000000001, 0.9221216995727503, 0.2638338612399297, 0.323282900533806], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 3320, 25, 0.7530120481927711, 8570.087048192772, 650, 60018, 5734.5, 19113.9, 24479.349999999988, 36610.46999999998, 0.9210540187084937, 0.2635329398879088, 0.31211498485531963], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC", 11335, 1, 0.00882223202470225, 225.7880899867666, 60, 30174, 175.0, 391.0, 475.0, 667.6399999999994, 3.1502991464037255, 1.1228854793825636, 0.9413979871089259], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC", 11340, 0, 0.0, 223.93112874779476, 59, 5046, 176.0, 399.0, 482.9499999999989, 681.0, 3.1506896509569313, 1.1199717118635968, 0.9384378354901017], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 11340, 1, 0.008818342151675485, 504.6356261022929, 177, 30427, 460.0, 700.0, 798.0, 1052.0, 3.150469069839287, 1.1198696983946776, 0.9383721350595533], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 3355, 19, 0.5663189269746647, 10977.505812220554, 1240, 60016, 8583.0, 22280.0, 27067.199999999997, 37739.64000000001, 0.9278130988957503, 0.2654726402297547, 0.32799642753931796], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM", 11340, 0, 0.0, 232.160582010582, 60, 4476, 184.0, 405.0, 498.0, 715.7700000000004, 3.150853356117282, 1.1261839143934815, 0.913870553483235], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 11329, 0, 0.0, 222.940506664313, 60, 6115, 174.0, 394.0, 480.5, 691.7000000000007, 3.1507340773764, 1.12306439281483, 0.9415279567159945], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal", 3365, 0, 0.0, 240.22852897474, 58, 4126, 190.0, 440.0, 535.6999999999998, 780.6800000000003, 0.9358145257325357, 14.990439882885525, 0.20653719024956352], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 11329, 0, 0.0, 493.10715861947114, 177, 7302, 452.0, 690.0, 786.5, 1006.0, 3.150435301783004, 1.1291110896038694, 0.9168258983704444], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 11329, 2, 0.017653808809250597, 508.3614617353702, 179, 30965, 463.0, 708.0, 805.0, 1066.7000000000007, 3.1502180460306115, 1.1228326631403633, 0.9413737520364912], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 3295, 18, 0.5462822458270106, 9495.084066767813, 905, 60013, 6854.0, 20365.600000000006, 25046.59999999999, 37624.52, 0.9145966573226993, 0.26169123468397565, 0.30814047536751105], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 3312, 25, 0.7548309178743962, 8882.178140096607, 687, 60018, 5918.0, 20282.100000000002, 25161.749999999996, 38613.48999999996, 0.9190510797601477, 0.26296389559377165, 0.31233376538723767], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 11339, 2, 0.017638239703677575, 499.46247464503085, 180, 30879, 455.0, 689.0, 788.0, 1013.0, 3.1505037221733057, 1.1260106500029035, 0.9137691459819061], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 3345, 25, 0.7473841554559043, 13046.281315396156, 2471, 60017, 10732.0, 24039.000000000004, 28819.39999999999, 43346.299999999945, 0.9257903606541588, 0.26488818841300715, 0.3281854501147067], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 3305, 15, 0.45385779122541603, 8856.916792738266, 791, 60014, 6132.0, 20283.0, 24956.499999999996, 35757.00000000002, 0.9174902795999577, 0.2625200076383495, 0.3126993238089699], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM", 11333, 0, 0.0, 232.86411365040172, 60, 5830, 185.0, 413.0, 497.0, 682.3199999999997, 3.1498422160569968, 1.128898528606365, 0.9166533011572119], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 3368, 0, 0.0, 177.3084916864611, 40, 4522, 129.0, 362.0, 441.0, 622.1699999999996, 0.935541522432719, 140.46037600451618, 0.2101313966401615], "isController": false}, {"data": ["WIFSGriddedHighResItemSector", 3367, 0, 0.0, 195.8987228987232, 36, 5482, 146.0, 389.0, 463.1999999999998, 740.2400000000011, 0.9352855718242096, 19.483249382980972, 0.21098727255018793], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 11327, 0, 0.0, 495.10055619316495, 175, 8946, 457.0, 687.0, 789.0, 1032.7199999999993, 3.1498922690681526, 1.1289164675273553, 0.9166678673655365], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 12, 6.521739130434782, 0.006947339169098236], "isController": false}, {"data": ["504/Gateway Time-out", 171, 92.93478260869566, 0.09899958315964985], "isController": false}, {"data": ["502/Proxy Error", 1, 0.5434782608695652, 5.789449307581863E-4], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 172728, 184, "504/Gateway Time-out", 171, "502/Bad Gateway", 12, "502/Proxy Error", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 3365, 22, "504/Gateway Time-out", 21, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 11331, 2, "502/Bad Gateway", 1, "502/Proxy Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 3330, 27, "504/Gateway Time-out", 25, "502/Bad Gateway", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 3320, 25, "504/Gateway Time-out", 24, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC", 11335, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 11340, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 3355, 19, "504/Gateway Time-out", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 11329, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 3295, 18, "504/Gateway Time-out", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 3312, 25, "504/Gateway Time-out", 25, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 11339, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 3345, 25, "504/Gateway Time-out", 24, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 3305, 15, "504/Gateway Time-out", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
