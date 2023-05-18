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

    var data = {"OkPercent": 99.73442772039634, "KoPercent": 0.2655722796036668};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.82194047359753, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9479046637152041, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.10588134430727024, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.9844100697603883, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.252814827645938, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.9856882959369315, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.9872984115435917, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.9473716121991148, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.0018874399450926561, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.9840235251318741, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.9862913987625864, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.9750514403292181, 500, 1500, "WIFSGriddedLowResItemGlobal"], "isController": false}, {"data": [0.9515434532112317, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.9495298756445253, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.226546212647672, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.27577542886848033, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.9521889400921659, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.26175602984556656, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.9862029231608952, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.9851680384087792, 500, 1500, "WIFSGriddedHighResItemGlobal"], "isController": false}, {"data": [0.97599451303155, 500, 1500, "WIFSGriddedHighResItemSector"], "isController": false}, {"data": [0.9505491171652205, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 261699, 695, 0.2655722796036668, 1300.0560261980063, 32, 60014, 218.0, 1674.5000000000073, 5617.950000000001, 19080.76000000004, 72.54647413640397, 325.5725715359619, 21.687777637900506], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 16489, 10, 0.060646491600460914, 373.8156346655353, 163, 30952, 305.0, 501.0, 663.5, 1077.2000000000007, 4.583498958990624, 1.633527835621284, 1.36967839985462], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 5832, 46, 0.7887517146776406, 5641.084533607676, 828, 60008, 2805.5, 13549.8, 19513.0, 34908.72000000001, 1.6193981236973591, 0.46389062985062773, 0.570901096342526], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM", 16485, 1, 0.006066120715802244, 141.0344555656663, 56, 30592, 104.0, 196.0, 334.0, 723.4199999999983, 4.583913563823871, 1.6428430195387056, 1.3339904707221812], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 5801, 375, 6.464402689191519, 13536.918807102224, 2631, 60009, 10142.0, 29031.000000000022, 31252.899999999994, 40103.259999999966, 1.6122980458425167, 0.46284101477708267, 0.5652490219311167], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 5773, 34, 0.5889485536116404, 4170.590853975385, 77, 60009, 1471.0, 11129.6, 17243.5, 30555.06000000002, 1.6103544704561463, 0.4618463622844271, 0.5456962902815261], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC", 16490, 3, 0.018192844147968467, 144.57077016373543, 56, 31244, 104.0, 192.0, 327.4499999999989, 683.0, 4.583268595938318, 1.6336129499503733, 1.36960956089563], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC", 16494, 1, 0.006062810719049351, 138.53461864920567, 56, 31091, 103.0, 190.0, 310.0, 674.0, 4.581660303249579, 1.6286134606931102, 1.364654680167111], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 16493, 9, 0.05456860486266901, 368.3024313345066, 162, 31395, 305.0, 503.0, 652.0, 1066.119999999999, 4.582234056503755, 1.6286285707454098, 1.364825573470357], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 5828, 83, 1.424159231297186, 6405.21928620452, 1247, 60010, 3652.5, 14409.1, 20751.050000000003, 35287.18000000002, 1.6177712785639475, 0.46459711808120335, 0.571907424648583], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM", 16493, 0, 0.0, 140.8684290304982, 54, 12452, 105.0, 202.0, 351.0, 723.0599999999995, 4.582212414286678, 1.6377829527626215, 1.3290205928155698], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 16486, 1, 0.006065752759917505, 137.2465121921634, 55, 30201, 105.0, 194.0, 322.64999999999964, 671.1299999999992, 4.583723859970378, 1.6338229898455197, 1.3697456065927105], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal", 5832, 0, 0.0, 161.89711934156395, 53, 25432, 115.0, 225.69999999999982, 446.04999999999836, 1073.0600000000013, 1.6212199680259396, 25.96946498246875, 0.35780831325572493], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 16489, 4, 0.024258596640184364, 356.12432530777875, 166, 33902, 304.0, 488.0, 634.0, 1029.1000000000004, 4.583529537343994, 1.642698606525296, 1.3338787130161232], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 16485, 4, 0.024264482863208977, 365.3929026387623, 167, 30915, 305.0, 496.0, 654.0, 1048.4199999999983, 4.583628064649592, 1.6337171587463186, 1.3697169802566165], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 5756, 18, 0.3127171646977067, 3909.300208478118, 824, 60013, 1681.0, 9435.800000000001, 15306.349999999997, 29680.72000000003, 1.6067521554094455, 0.4598851755619585, 0.5413373961096276], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 5771, 23, 0.3985444463697799, 3485.662623462127, 687, 60012, 1303.0, 8413.2, 13981.19999999999, 31476.599999999962, 1.6103324690573961, 0.46090929528910085, 0.5472614250312244], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 16492, 1, 0.00606354596167839, 349.8455008488968, 160, 30744, 304.0, 487.0, 630.0, 1036.0699999999997, 4.582732889361402, 1.6379448305976891, 1.329171550918297], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 5813, 66, 1.1353862033373474, 8965.100980560797, 74, 60014, 6006.0, 18775.20000000001, 25325.600000000006, 36675.559999999954, 1.6138462623342775, 0.4634591109263194, 0.5720958918235769], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 5763, 13, 0.22557695644629533, 3574.703973624838, 744, 60012, 1402.0, 8860.400000000003, 14073.400000000003, 28526.079999999998, 1.6072915199544837, 0.45994514460533786, 0.5477975981094871], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM", 16489, 0, 0.0, 134.843228819213, 56, 9152, 105.0, 196.0, 333.5, 674.1000000000004, 4.583742323016925, 1.642806086471886, 1.3339406369717222], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 5832, 0, 0.0, 105.11676954732506, 35, 7308, 73.0, 138.0, 299.34999999999945, 799.3600000000006, 1.620675731742596, 243.32423480595662, 0.36401896318437216], "isController": false}, {"data": ["WIFSGriddedHighResItemSector", 5832, 0, 0.0, 151.7244513031545, 32, 23677, 70.0, 168.0, 403.34999999999945, 1446.3400000000001, 1.6209739351727164, 33.76704183652567, 0.36566892482900143], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 16481, 3, 0.018202778957587526, 358.5127116073047, 160, 30890, 303.0, 491.0, 639.0, 1044.1800000000003, 4.583109707093656, 1.6425060348669227, 1.3337565358534271], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 437, 62.87769784172662, 0.166985735520579], "isController": false}, {"data": ["504/Gateway Time-out", 93, 13.381294964028777, 0.035537010076461886], "isController": false}, {"data": ["502/Proxy Error", 39, 5.611510791366906, 0.014902617128838856], "isController": false}, {"data": ["500/INTERNAL SERVER ERROR", 126, 18.1294964028777, 0.04814691687778708], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 261699, 695, "502/Bad Gateway", 437, "500/INTERNAL SERVER ERROR", 126, "504/Gateway Time-out", 93, "502/Proxy Error", 39, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 16489, 10, "502/Bad Gateway", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 5832, 46, "502/Bad Gateway", 23, "504/Gateway Time-out", 11, "500/INTERNAL SERVER ERROR", 9, "502/Proxy Error", 3, "", ""], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM", 16485, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 5801, 375, "502/Bad Gateway", 311, "502/Proxy Error", 27, "500/INTERNAL SERVER ERROR", 24, "504/Gateway Time-out", 13, "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 5773, 34, "500/INTERNAL SERVER ERROR", 22, "504/Gateway Time-out", 8, "502/Bad Gateway", 4, "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC", 16490, 3, "502/Bad Gateway", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC", 16494, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 16493, 9, "502/Bad Gateway", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 5828, 83, "500/INTERNAL SERVER ERROR", 36, "502/Bad Gateway", 31, "504/Gateway Time-out", 15, "502/Proxy Error", 1, "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 16486, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 16489, 4, "502/Bad Gateway", 3, "502/Proxy Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 16485, 4, "502/Bad Gateway", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 5756, 18, "504/Gateway Time-out", 14, "500/INTERNAL SERVER ERROR", 3, "502/Bad Gateway", 1, "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 5771, 23, "504/Gateway Time-out", 13, "502/Bad Gateway", 7, "502/Proxy Error", 2, "500/INTERNAL SERVER ERROR", 1, "", ""], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 16492, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 5813, 66, "500/INTERNAL SERVER ERROR", 30, "502/Bad Gateway", 24, "504/Gateway Time-out", 7, "502/Proxy Error", 5, "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 5763, 13, "504/Gateway Time-out", 12, "500/INTERNAL SERVER ERROR", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 16481, 3, "502/Bad Gateway", 3, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
