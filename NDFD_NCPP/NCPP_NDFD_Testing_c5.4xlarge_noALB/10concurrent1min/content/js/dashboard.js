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

    var data = {"OkPercent": 99.97210288456174, "KoPercent": 0.027897115438263682};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.959270211460135, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.9948275862068966, 500, 1500, "NDFD_1Point-wspd-wdir_REST"], "isController": false}, {"data": [0.9926180079018507, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST"], "isController": false}, {"data": [0.3368200836820084, 500, 1500, "NDFD_CityLevel1234_Summaries_24hourly_REST"], "isController": false}, {"data": [0.09504132231404959, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.9999245055110977, 500, 1500, "NDFD_1Point_maxt_SOAP"], "isController": false}, {"data": [0.998208164537239, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP"], "isController": false}, {"data": [0.7511820330969267, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP"], "isController": false}, {"data": [0.8807251908396947, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.08108108108108109, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.35459183673469385, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.9560913705583757, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 35846, 10, 0.027897115438263682, 219.2628466216591, 58, 60146, 84.0, 359.0, 1231.9500000000007, 3284.9900000000016, 41.70695298165271, 871.095603197759, 16.324573632257792], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_Line_Summaries_24Hourly_REST", 7111, 0, 0.0, 77.92096751511731, 58, 165, 75.0, 89.0, 97.39999999999964, 118.0, 118.35294509262187, 89.68934120300251, 55.477943012166506], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST", 5800, 0, 0.0, 95.57948275862033, 62, 2587, 80.0, 100.0, 121.0, 462.9599999999991, 96.53312917131302, 478.8005498643543, 34.503052028027895], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST", 4809, 0, 0.0, 115.44853399875251, 65, 2372, 88.0, 135.0, 239.0, 1084.0, 79.62447844228095, 769.1849030771905, 30.559003933414463], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 116, 0, 0.0, 4877.974137931035, 1711, 26659, 3505.0, 7480.999999999997, 21192.299999999996, 26445.989999999998, 1.8712997467292585, 1152.5854133394635, 1.0653981956476148], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 239, 0, 0.0, 2343.594142259414, 458, 31107, 1250.0, 2441.0, 5305.0, 30100.199999999997, 3.9085497481520246, 971.1456508440587, 1.335930089700399], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 242, 0, 0.0, 2340.2644628099206, 577, 7085, 2255.5, 3566.7, 4171.449999999998, 6394.659999999994, 3.890487597061235, 1591.2018285894571, 1.4019432844878863], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 10, 10, 100.0, 60083.4, 60069, 60146, 60074.0, 60142.1, 60146.0, 60146.0, 0.14477856119065888, 0.054857501701148094, 0.06206815269794849], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP", 6623, 0, 0.0, 83.64426996829216, 60, 1081, 80.0, 100.0, 108.0, 129.0, 110.36861751766432, 326.57901472512, 35.35244779862685], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP", 6418, 0, 0.0, 86.36678092863778, 60, 2727, 78.0, 95.0, 106.0, 181.8099999999995, 106.84735378826976, 326.4896191440392, 34.64191548604059], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP", 846, 0, 0.0, 658.3699763593384, 231, 5079, 465.0, 1217.1000000000004, 1732.2999999999986, 3860.7199999999993, 13.953028103971501, 1361.4421904378053, 16.732732921559574], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 1048, 0, 0.0, 531.0372137404581, 196, 13523, 333.0, 766.2, 1313.1, 3777.4299999999857, 17.29173197815434, 1134.5672735822595, 6.433740120778128], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 222, 0, 0.0, 2540.058558558556, 784, 8702, 2118.0, 3907.200000000002, 5699.599999999997, 8310.04, 3.6096974032942555, 1476.3591877571098, 1.3007600994292776], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 392, 0, 0.0, 1430.224489795918, 464, 6217, 1184.5, 2419.4999999999995, 2929.2499999999995, 5443.009999999998, 6.4283371597245, 1396.0917001475893, 2.5926789521154476], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 1970, 0, 0.0, 282.52690355329986, 130, 4816, 182.0, 392.9000000000001, 1096.4999999999873, 2155.379999999999, 32.47395489911645, 1183.7137114886918, 11.448337615801794], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 10, 100.0, 0.027897115438263682], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 35846, 10, "504/Gateway Time-out", 10, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 10, 10, "504/Gateway Time-out", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
