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

    var data = {"OkPercent": 58.603894508173354, "KoPercent": 41.396105491826646};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5711961703675307, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6249939522957085, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.42511762576909157, 500, 1500, "NDFD_1Point-wspd-wdir_REST"], "isController": false}, {"data": [0.41823529411764704, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST"], "isController": false}, {"data": [0.40222929936305735, 500, 1500, "NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST"], "isController": false}, {"data": [0.28335321179076506, 500, 1500, "NDFD_CityLevel1234_Summaries_24hourly_REST"], "isController": false}, {"data": [0.8163566034260453, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.546361384481489, 500, 1500, "NDFD_1Point_maxt_SOAP"], "isController": false}, {"data": [0.4648078963147456, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP"], "isController": false}, {"data": [0.5576543022195196, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP"], "isController": false}, {"data": [0.9965968756077008, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.8201333071946677, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.8261050297907718, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.6823209688185372, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 203466, 84227, 41.396105491826646, 183.26150806523114, 1, 60092, 100.0, 323.0, 353.9500000000007, 445.9900000000016, 238.07746357742204, 8652.466180686746, 58.880189105755655], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_Line_Summaries_24Hourly_REST", 20669, 7742, 37.4570612995307, 112.33441385649995, 2, 3779, 88.0, 216.0, 259.0, 307.0, 329.27101255336777, 459.6680558708501, 96.53985853565284], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST", 27630, 15881, 57.47737965979008, 96.9585233441903, 1, 620, 102.0, 126.0, 131.0, 227.0, 460.3849037740565, 1438.9327798258769, 69.97166723944014], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST", 22950, 13351, 58.17429193899782, 104.56762527233114, 1, 1108, 111.5, 139.0, 144.0, 222.0, 381.63496075562057, 1717.0838871994313, 61.260995259703], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 1570, 257, 16.369426751592357, 1765.1598726114648, 1, 50633, 770.0, 846.9000000000001, 890.4499999999998, 36835.86999999999, 25.88281842461011, 10012.022064278413, 12.323816906879554], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 11738, 8336, 71.01720906457659, 233.27807122167238, 1, 26702, 107.0, 346.0, 379.0, 479.6100000000006, 195.60399273442317, 10765.034821599676, 19.37697626606009], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 5429, 0, 0.0, 509.3088966660527, 216, 4659, 478.0, 684.0, 905.5, 1126.7999999999993, 89.89154731351934, 24990.02572258672, 32.39255952996937], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 50, 50, 100.0, 60069.88, 60059, 60092, 60068.0, 60081.9, 60087.25, 60092.0, 0.7156864148404735, 0.2711780556231482, 0.3068225938622733], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP", 29874, 13548, 45.35047198232577, 90.73806654616028, 1, 1963, 94.0, 128.0, 133.0, 208.0, 498.4649269171728, 1322.1484348928786, 87.25592129413334], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP", 21681, 11601, 53.5076795350768, 107.96706793967095, 2, 1079, 107.0, 158.0, 160.0, 182.0, 361.30784741780127, 964.148599981044, 54.462396053793725], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP", 13156, 5747, 43.68349042262086, 202.6215415019762, 3, 9933, 199.0, 267.0, 299.0, 410.0, 218.85813148788927, 12262.554137225095, 147.80762108647193], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 15427, 0, 0.0, 178.75419718675028, 104, 14752, 135.0, 190.0, 220.0, 305.0, 256.49253483190904, 11670.159853860814, 95.43325758882553], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 5101, 0, 0.0, 542.1701627131953, 268, 9804, 490.0, 542.0, 578.0, 697.9799999999996, 84.48161642928122, 23486.054370497266, 30.443082482817157], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 7217, 1128, 15.629763059442983, 378.8319246224199, 2, 7126, 372.0, 444.0, 470.0, 820.6399999999994, 120.27130620271306, 17049.677372757516, 40.926197093832286], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 20974, 6586, 31.400781920472966, 125.59793077143152, 1, 6625, 106.0, 137.0, 170.0, 259.0, 348.82831340329636, 6589.443912728474, 84.36030454288422], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 50, 0.05936338703741081, 0.024574130321527922], "isController": false}, {"data": ["502/Bad Gateway", 1, 0.0011872677407482161, 4.914826064305584E-4], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 84176, 99.93944934522185, 41.371039878898685], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 203466, 84227, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 84176, "504/Gateway Time-out", 50, "502/Bad Gateway", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["NDFD_Line_Summaries_24Hourly_REST", 20669, 7742, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 7741, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST", 27630, 15881, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 15881, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST", 22950, 13351, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 13351, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 1570, 257, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 257, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 11738, 8336, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 8336, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 50, 50, "504/Gateway Time-out", 50, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP", 29874, 13548, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 13548, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP", 21681, 11601, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 11601, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP", 13156, 5747, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 5747, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 7217, 1128, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 1128, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 20974, 6586, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 6586, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
