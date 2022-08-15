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

    var data = {"OkPercent": 99.61644416189871, "KoPercent": 0.3835558381012926};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7481457936003391, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8222375105842507, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.8029430181590482, 500, 1500, "NDFD_1Point-wspd-wdir_REST"], "isController": false}, {"data": [0.7531007751937985, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST"], "isController": false}, {"data": [0.010638297872340425, 500, 1500, "NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST"], "isController": false}, {"data": [0.002857142857142857, 500, 1500, "NDFD_CityLevel1234_Summaries_24hourly_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.8334932309988274, 500, 1500, "NDFD_1Point_maxt_SOAP"], "isController": false}, {"data": [0.8357206803939122, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP"], "isController": false}, {"data": [0.12391774891774891, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP"], "isController": false}, {"data": [0.2871939736346516, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.02345679012345679, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.33753071253071254, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 47190, 181, 0.3835558381012926, 1779.8509218054746, 63, 135162, 308.0, 4956.800000000003, 15005.800000000003, 60073.0, 33.8239320625646, 559.8506071869316, 13.104801182708725], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_Line_Summaries_24Hourly_REST", 9448, 0, 0.0, 589.3075783234525, 71, 34211, 161.0, 1399.0, 2536.5499999999993, 4385.650000000003, 129.29182346903866, 97.97895997263086, 60.60554225111187], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST", 7985, 0, 0.0, 703.8154038822804, 64, 67216, 217.0, 1481.4000000000005, 2585.0, 7764.0, 87.39192295064026, 423.1339394426507, 31.23578496087337], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST", 6450, 0, 0.0, 883.9381395348827, 70, 94566, 268.0, 1950.0, 3033.949999999998, 8260.98, 62.05861412049955, 599.4959090624819, 23.817417333355785], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 141, 80, 56.737588652482266, 43549.276595744675, 753, 110349, 60085.0, 60119.6, 60219.0, 110318.76, 1.2524872086412733, 322.8853452334423, 0.7130859791385376], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 175, 0, 0.0, 35365.81714285713, 1173, 93763, 42664.0, 64587.200000000004, 70913.0, 91685.16000000002, 1.806880601329864, 676.1133953900022, 0.6175861430326683], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 296, 0, 0.0, 21775.716216216217, 1616, 119029, 15346.0, 48521.80000000001, 64203.34999999998, 81575.51999999993, 2.3963536564632735, 933.1878536847985, 0.8635297844091288], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 100, 100, 100.0, 60072.38999999999, 60060, 60146, 60070.0, 60076.9, 60090.85, 60145.93, 1.4290409706046272, 0.5414725552681595, 0.6126454942338196], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP", 9381, 0, 0.0, 602.7710265430117, 65, 62560, 147.0, 1304.4000000000033, 2281.699999999999, 5474.6400000000285, 106.97669114628472, 299.8272495994504, 34.265971382794326], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP", 8936, 0, 0.0, 645.0794538943587, 63, 94600, 153.0, 1304.100000000003, 2183.2999999999993, 5845.029999999935, 86.52877837167867, 264.40287844236576, 28.054252362692694], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP", 924, 0, 0.0, 6636.780303030308, 344, 94957, 3495.5, 14983.5, 24014.0, 61697.5, 8.842443729903538, 862.7859035872187, 10.604024316720258], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 1062, 0, 0.0, 5563.306967984934, 224, 78440, 1982.0, 17476.900000000005, 22345.94999999996, 42136.06999999926, 12.334208264616386, 772.2129803169496, 4.589192723455901], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 259, 0, 0.0, 24405.698841698842, 3724, 86696, 19807.0, 46032.0, 65230.0, 83776.39999999997, 2.694604548575709, 1049.3326927903722, 0.971004959398864], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 405, 0, 0.0, 16024.874074074063, 832, 135162, 9534.0, 38630.80000000003, 51789.59999999999, 86952.43999999997, 2.8712000907441015, 623.5607306450984, 1.1580133178489393], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 1628, 1, 0.06142506142506143, 3715.547297297298, 140, 96498, 1804.0, 8120.400000000006, 12628.349999999999, 34928.02000000003, 15.490451677973681, 540.0281258028298, 5.457634896214926], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 180, 99.4475138121547, 0.3814367450731087], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 1, 0.5524861878453039, 0.0021190930281839372], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 47190, 181, "504/Gateway Time-out", 180, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 141, 80, "504/Gateway Time-out", 80, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 100, 100, "504/Gateway Time-out", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 1628, 1, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 1, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
