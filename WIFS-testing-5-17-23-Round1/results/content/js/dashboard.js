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

    var data = {"OkPercent": 98.5090386476736, "KoPercent": 1.4909613523263885};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8588548439134558, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8983056708160443, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.10238429172510519, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.9959189320052569, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.24776226279985678, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.9960243379658439, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.9957489458768232, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.8999032213466058, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.021433591004919185, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.9965438584364416, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.9959189320052569, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.9638849929873773, 500, 1500, "WIFSGriddedLowResItemGlobal"], "isController": false}, {"data": [0.89925295704503, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.8982429441062535, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.18923298523586604, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.2465925394548063, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.8980226769911505, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.2251976994967649, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.9963354767337343, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.9863253856942497, 500, 1500, "WIFSGriddedHighResItemGlobal"], "isController": false}, {"data": [0.9822931276297335, 500, 1500, "WIFSGriddedHighResItemSector"], "isController": false}, {"data": [0.9014391475818169, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 204566, 3050, 1.4909613523263885, 1672.1914003304423, 31, 60080, 316.0, 570.0, 4231.700000000004, 60006.0, 55.897557668624316, 164.39952017216632, 16.617132651566717], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 14460, 0, 0.0, 416.82572614107966, 185, 4755, 369.0, 573.0, 656.0, 820.0, 4.018850241964801, 1.432500330387844, 1.2009454824621377], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 2852, 335, 11.746143057503506, 11672.021037868184, 770, 60039, 2954.5, 59998.0, 60005.0, 60011.0, 0.779801074167777, 0.22302520914773377, 0.27491033962360106], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM", 14457, 0, 0.0, 155.33361001590902, 62, 2663, 124.0, 255.0, 350.0, 483.0, 4.019317858621322, 1.4405172403457276, 1.1696842987003455], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 2812, 525, 18.669985775248932, 19051.117354196263, 1139, 60080, 10671.0, 60001.0, 60007.0, 60012.0, 0.7705669723267259, 0.2205198189441643, 0.27014994439970175], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 2793, 356, 12.746151092015754, 10943.470819906908, 653, 60021, 1519.0, 59999.0, 60006.0, 60012.0, 0.7684155617769796, 0.21985708421441133, 0.26039082025059757], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC", 14463, 0, 0.0, 155.14229412984818, 62, 3000, 123.0, 251.0, 361.0, 489.0, 4.019666153427125, 1.4327911582040045, 1.20118929975459], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC", 14467, 0, 0.0, 155.60496301928552, 63, 2124, 123.0, 253.0, 356.0, 489.0, 4.018785258472311, 1.4285525723475796, 1.1970014685879444], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 14466, 0, 0.0, 417.1959076455108, 192, 4827, 370.0, 576.0, 661.0, 816.3299999999999, 4.018832338348678, 1.4285693077723818, 1.1970154914026825], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 2846, 357, 12.543921293042867, 12470.735066760375, 1097, 60040, 3791.5, 59998.0, 60006.0, 60011.0, 0.7801712593789826, 0.22320448774259394, 0.27580273036639813], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM", 14467, 0, 0.0, 154.60765880970476, 58, 1373, 124.0, 254.0, 347.59999999999854, 477.0, 4.0190174784339305, 1.4364847627996276, 1.1656720616160912], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 14457, 0, 0.0, 154.93414954693262, 61, 1594, 123.0, 256.0, 360.0, 483.0, 4.01932344585882, 1.4326690016977244, 1.2010868890945305], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal", 2852, 0, 0.0, 185.90778401122023, 51, 1727, 124.0, 462.7000000000003, 523.0, 647.2899999999986, 0.792660827880316, 12.696823752893268, 0.17494272177827289], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 14457, 0, 0.0, 415.99979248806505, 186, 4040, 367.0, 580.0, 667.0, 827.8400000000001, 4.019050806784764, 1.4404215293847742, 1.1696065824432227], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 14456, 0, 0.0, 417.8524488101845, 185, 4612, 370.0, 577.0, 666.0, 816.0, 4.018989558856401, 1.432549989240807, 1.2009871142676354], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 2777, 385, 13.86388188692834, 12296.326251350374, 917, 60024, 2037.0, 60001.0, 60006.1, 60011.0, 0.7651773492074339, 0.21892324209665756, 0.2577990092544577], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 2788, 350, 12.553802008608322, 11178.56779053085, 710, 60017, 1523.5, 59999.1, 60006.0, 60012.0, 0.7669169416298636, 0.21933399234527218, 0.26063192938202395], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 14464, 0, 0.0, 416.51825221239, 179, 2950, 369.0, 580.0, 672.0, 820.3500000000004, 4.019138702799642, 1.436528091039716, 1.1657072214174744], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 2830, 365, 12.897526501766784, 14274.989752650177, 2016, 60018, 6135.0, 59999.0, 60006.0, 60011.0, 0.7754015237324925, 0.22185551050189575, 0.2748737823387644], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 2782, 377, 13.551401869158878, 11674.812005751268, 765, 60018, 1761.5, 60000.0, 60007.0, 60011.17, 0.7653692163659158, 0.21887580911246057, 0.26085337549971155], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM", 14463, 0, 0.0, 154.98091682223713, 62, 1796, 124.0, 255.0, 350.0, 480.0, 4.019709723762034, 1.4406576841998697, 1.1697983375791858], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 2852, 0, 0.0, 142.0487377279105, 35, 2061, 80.0, 384.7000000000003, 451.3499999999999, 574.349999999999, 0.7925288868720591, 118.97969358785913, 0.1780094179497789], "isController": false}, {"data": ["WIFSGriddedHighResItemSector", 2852, 0, 0.0, 146.01893408134657, 31, 2210, 77.0, 410.0, 477.0, 586.4099999999994, 0.7926577436157979, 16.510158383116472, 0.1788124402102044], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 14453, 0, 0.0, 416.10765930948753, 181, 3975, 367.0, 582.6000000000004, 673.0, 834.0, 4.018993519223486, 1.4404009976123235, 1.1695899108677723], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["408/Request Timeout", 11, 0.36065573770491804, 0.005377237664127958], "isController": false}, {"data": ["502/Bad Gateway", 155, 5.081967213114754, 0.07577016708543942], "isController": false}, {"data": ["504/Gateway Time-out", 2872, 94.1639344262295, 1.4039478701250452], "isController": false}, {"data": ["502/Proxy Error", 12, 0.39344262295081966, 0.005866077451775955], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 204566, 3050, "504/Gateway Time-out", 2872, "502/Bad Gateway", 155, "502/Proxy Error", 12, "408/Request Timeout", 11, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 2852, 335, "504/Gateway Time-out", 332, "502/Bad Gateway", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 2812, 525, "504/Gateway Time-out", 396, "502/Bad Gateway", 117, "502/Proxy Error", 9, "408/Request Timeout", 3, "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 2793, 356, "504/Gateway Time-out", 351, "408/Request Timeout", 3, "502/Bad Gateway", 2, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 2846, 357, "504/Gateway Time-out", 348, "502/Bad Gateway", 6, "408/Request Timeout", 3, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 2777, 385, "504/Gateway Time-out", 381, "502/Bad Gateway", 2, "408/Request Timeout", 1, "502/Proxy Error", 1, "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 2788, 350, "504/Gateway Time-out", 347, "502/Bad Gateway", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 2830, 365, "504/Gateway Time-out", 345, "502/Bad Gateway", 17, "502/Proxy Error", 2, "408/Request Timeout", 1, "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 2782, 377, "504/Gateway Time-out", 372, "502/Bad Gateway", 5, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
