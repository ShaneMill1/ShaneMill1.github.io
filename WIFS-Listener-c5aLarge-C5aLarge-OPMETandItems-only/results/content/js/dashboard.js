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

    var data = {"OkPercent": 99.99951452775687, "KoPercent": 4.8547224312449935E-4};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7526567468504988, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.704438149197356, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.7443235572374646, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.7510618216139688, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.743764705882353, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.7103155911446067, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.7609411764705882, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.7635933806146572, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.7480136963531797, 500, 1500, "WIFSGriddedLowResItemGlobal"], "isController": false}, {"data": [0.7348771266540642, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.7219592995740653, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.7313854853911405, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.744454931571496, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.7704935729232404, 500, 1500, "WIFSGriddedHighResItemGlobal"], "isController": false}, {"data": [0.7458670477013308, 500, 1500, "WIFSGriddedHighResItemSector"], "isController": false}, {"data": [0.7385234264079508, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 205985, 1, 4.8547224312449935E-4, 836.9832366434518, 28, 90001, 96.0, 437.90000000000146, 2319.0, 2525.9900000000016, 114.28145021515327, 6996.361009294332, 26.446418923646945], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 2118, 0, 0.0, 1168.4145420207744, 191, 4951, 410.0, 3538.600000000001, 3747.1, 4207.62, 1.177587147286796, 39.24677164316774, 0.35074617179928974], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM", 2114, 0, 0.0, 855.9872280037856, 47, 4363, 114.0, 3180.5, 3394.25, 3865.2999999999984, 1.179890952178696, 0.42287107368123183, 0.3422144656221413], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC", 2119, 0, 0.0, 870.4865502595576, 66, 4084, 152.0, 3219.0, 3420.0, 3815.4000000000015, 1.178474678922655, 13.138151303301786, 0.3510105244837986], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC", 2125, 0, 0.0, 897.5477647058822, 66, 5789, 159.0, 3233.8, 3488.199999999999, 3943.0999999999967, 1.1809741452803828, 28.786244791209327, 0.3506016993801136], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 2123, 1, 0.047103155911446065, 1188.1323598681104, 211, 90001, 417.0, 3543.6000000000004, 3746.7999999999997, 4174.359999999997, 1.179797728319758, 81.83540793604307, 0.35025245059492816], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM", 2125, 0, 0.0, 802.7251764705887, 50, 4043, 115.0, 3145.0, 3367.0999999999995, 3820.2199999999993, 1.1804421019535345, 17.32391006656027, 0.34122154509594355], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 2115, 0, 0.0, 833.8581560283703, 64, 4305, 147.0, 3189.2000000000003, 3395.5999999999995, 3813.4400000000023, 1.1776654494672945, 10.497783420642053, 0.35076949422609843], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal", 60162, 0, 0.0, 868.6273893819986, 47, 6054, 140.0, 1778.9000000000015, 2323.9500000000007, 2597.9900000000016, 33.38455161254343, 533.2060279862046, 7.3354727664279995], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 2116, 0, 0.0, 1078.7759924385634, 185, 4551, 374.0, 3467.6, 3683.1499999999996, 4085.8099999999995, 1.178231450093323, 87.43420865345853, 0.34173314519308295], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 2113, 0, 0.0, 1153.8419309039286, 181, 81170, 395.0, 3508.2000000000003, 3761.3, 4187.300000000001, 1.1813735466253978, 32.59852630219457, 0.35187395675854133], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 2122, 0, 0.0, 1101.9524033930238, 180, 5947, 375.0, 3504.7, 3730.0999999999995, 4165.469999999999, 1.1788692410682045, 87.48038661161203, 0.34076688999627786], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM", 2119, 0, 0.0, 861.403964134027, 50, 5642, 117.0, 3193.0, 3404.0, 3823.600000000002, 1.1788805141454535, 17.3021437959883, 0.3419213991222653], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 60214, 0, 0.0, 754.0322350283985, 29, 6194, 85.0, 292.0, 2213.0, 2518.0, 33.40701140012738, 5368.770302060136, 7.47090391663005], "isController": false}, {"data": ["WIFSGriddedHighResItemSector", 60187, 0, 0.0, 824.0663598451397, 28, 5973, 85.0, 1877.7000000000044, 2257.0, 2522.0, 33.395811416066294, 679.170026974711, 7.501012329780517], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 2113, 0, 0.0, 1057.2271651680069, 169, 5956, 350.0, 3438.2000000000003, 3659.3, 4089.86, 1.1816999253957547, 0.4235194068557051, 0.34273913851810467], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 1, 100.0, 4.8547224312449935E-4], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 205985, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 2123, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
