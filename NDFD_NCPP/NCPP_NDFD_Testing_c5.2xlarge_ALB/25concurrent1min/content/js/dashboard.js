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

    var data = {"OkPercent": 71.07529464864196, "KoPercent": 28.924705351358043};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.708077631454425, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6467169499405899, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.8441979187119576, 500, 1500, "NDFD_1Point-wspd-wdir_REST"], "isController": false}, {"data": [0.17198367100090717, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST"], "isController": false}, {"data": [0.9082628497072218, 500, 1500, "NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST"], "isController": false}, {"data": [0.42298193162615366, 500, 1500, "NDFD_CityLevel1234_Summaries_24hourly_REST"], "isController": false}, {"data": [0.9954837176135013, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.999907737729118, 500, 1500, "NDFD_1Point_maxt_SOAP"], "isController": false}, {"data": [0.8532036862346709, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP"], "isController": false}, {"data": [0.3075072621641249, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP"], "isController": false}, {"data": [0.9966018757645779, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.9836826744494561, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.995400568656966, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.994585958995296, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 137367, 39733, 28.924705351358043, 140.62185240996664, 1, 60108, 67.0, 223.0, 242.0, 284.0, 161.21903358011014, 6756.490273811047, 45.654865355562215], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_Line_Summaries_24Hourly_REST", 19357, 6835, 35.31022369168776, 69.39871880973283, 1, 1092, 69.0, 88.0, 98.0, 126.0, 322.62742091403044, 438.62313314089636, 97.83138604620154], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST", 15279, 2377, 15.557300870475817, 88.98789187774051, 3, 1355, 82.0, 127.0, 138.0, 159.0, 254.62453754624536, 962.3997723925524, 76.84993219428057], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST", 19842, 16418, 82.7436750327588, 68.27950811410085, 2, 2599, 65.0, 97.0, 111.0, 150.0, 330.68346582670864, 1092.077459929087, 21.90046747662617], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 1537, 0, 0.0, 901.2765126870518, 352, 36762, 439.0, 528.0, 581.1999999999998, 26231.979999999952, 25.290004113533524, 11685.340250282805, 14.398508201357467], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 7693, 4414, 57.37683608475237, 179.57961783439487, 2, 26988, 23.0, 246.60000000000036, 263.2999999999993, 318.0, 127.76735148062646, 10123.62526093135, 18.61374089659697], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 4207, 0, 0.0, 328.99738531019733, 233, 1272, 319.0, 389.0, 423.0, 490.7600000000002, 69.76435666550586, 19394.62741151974, 25.13969493122233], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 25, 25, 100.0, 60071.16000000001, 60062, 60108, 60069.0, 60083.0, 60102.3, 60108.0, 0.358849957655705, 0.13597049176798195, 0.1538429017684126], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP", 16258, 0, 0.0, 84.79536228318399, 62, 1116, 80.0, 100.0, 118.0, 153.0, 270.989249104092, 761.6279872281024, 86.80124385365447], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP", 13781, 2022, 14.672375009070459, 95.89151730643653, 13, 1120, 89.0, 127.0, 137.0, 157.0, 229.35077471000383, 651.5982489452794, 63.449469623213005], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP", 11016, 7598, 68.97240377632535, 125.24037763253419, 3, 8058, 91.0, 189.0, 203.0, 246.0, 183.03259894327584, 5852.485095682551, 68.10437124082013], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 7357, 0, 0.0, 187.66073127633553, 106, 20422, 129.0, 152.0, 168.0, 197.42000000000007, 122.3576762519334, 5567.154779544755, 45.52565883983069], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 3769, 0, 0.0, 366.99708145396687, 219, 9674, 325.0, 436.0, 470.0, 594.0, 62.4989636016914, 17374.833949558495, 22.521599188500126], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 5979, 0, 0.0, 231.29703963873592, 151, 7023, 215.0, 254.0, 274.0, 327.0, 99.26452276991019, 16633.30241066463, 40.03539834372354], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 11267, 44, 0.3905209905032396, 122.4704890387859, 2, 7058, 111.0, 140.0, 157.0, 210.0, 187.4147509897202, 4932.125283816827, 65.81299940845504], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 25, 0.0629199909395213, 0.018199421986357715], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 39708, 99.93708000906048, 28.906505929371683], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 137367, 39733, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 39708, "504/Gateway Time-out", 25, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["NDFD_Line_Summaries_24Hourly_REST", 19357, 6835, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 6835, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST", 15279, 2377, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 2377, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST", 19842, 16418, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 16418, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 7693, 4414, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 4414, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 25, 25, "504/Gateway Time-out", 25, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP", 13781, 2022, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 2022, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP", 11016, 7598, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 7598, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 11267, 44, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 44, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
