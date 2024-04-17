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

    var data = {"OkPercent": 99.98170917157435, "KoPercent": 0.018290828425648845};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.640971242989402, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.709864135965805, 500, 1500, "NDFDTimeSeries_1Point_1elem"], "isController": false}, {"data": [0.5812510692707349, 500, 1500, "NDFDTimeSeries_1Point_5elems"], "isController": false}, {"data": [0.5087346553352219, 500, 1500, "NDFDSummaries_SinglePoint"], "isController": false}, {"data": [0.14730840625828692, 500, 1500, "NDFDTimeSeries_MultiPoint27_6Elems"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 470181, 86, 0.018290828425648845, 799.2130243459166, 26, 1259911, 565.0, 718.0, 850.0, 2004.0, 119.41107794567058, 1273.3341061245349, 110.74914122200413], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFDTimeSeries_1Point_1elem", 235824, 44, 0.01865798222403148, 769.0489856842341, 26, 1259911, 528.0, 657.0, 790.0, 5529.75000000004, 59.89182473443168, 198.70923821385415, 54.74278176007156], "isController": false}, {"data": ["NDFDTimeSeries_1Point_5elems", 222114, 39, 0.017558551014343986, 810.7354106449917, 27, 1238019, 587.0, 791.0, 884.0, 5276.870000000021, 56.623441646988226, 853.3248537329251, 53.74682258088981], "isController": false}, {"data": ["NDFDSummaries_SinglePoint", 8472, 1, 0.011803588290840416, 846.2497639282333, 411, 40773, 621.0, 819.6999999999998, 951.0, 6509.610000000019, 2.353041164055463, 20.76151960480532, 1.2730320360221938], "isController": false}, {"data": ["NDFDTimeSeries_MultiPoint27_6Elems", 3771, 2, 0.05303632988597189, 1901.2086979581013, 1039, 35981, 1628.0, 1991.8000000000002, 2252.3999999999996, 8682.199999999997, 1.0471349571191155, 224.72388125155328, 1.419358711407551], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 4, 4.651162790697675, 8.507362058441324E-4], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection timed out (Read failed)", 14, 16.27906976744186, 0.0029775767204544635], "isController": false}, {"data": ["Was not a proper XML response", 68, 79.06976744186046, 0.01446251549935025], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 470181, 86, "Was not a proper XML response", 68, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection timed out (Read failed)", 14, "502/Bad Gateway", 4, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["NDFDTimeSeries_1Point_1elem", 235824, 44, "Was not a proper XML response", 32, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection timed out (Read failed)", 9, "502/Bad Gateway", 3, "", "", "", ""], "isController": false}, {"data": ["NDFDTimeSeries_1Point_5elems", 222114, 39, "Was not a proper XML response", 33, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection timed out (Read failed)", 5, "502/Bad Gateway", 1, "", "", "", ""], "isController": false}, {"data": ["NDFDSummaries_SinglePoint", 8472, 1, "Was not a proper XML response", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFDTimeSeries_MultiPoint27_6Elems", 3771, 2, "Was not a proper XML response", 2, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
