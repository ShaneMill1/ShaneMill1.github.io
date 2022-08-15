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

    var data = {"OkPercent": 99.94805842388482, "KoPercent": 0.05194157611518564};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9271779102865098, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9943191040415517, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.9778706108163034, 500, 1500, "NDFD_1Point-wspd-wdir_REST"], "isController": false}, {"data": [0.9472270363951473, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST"], "isController": false}, {"data": [0.10869565217391304, 500, 1500, "NDFD_CityLevel1234_Summaries_24hourly_REST"], "isController": false}, {"data": [0.02952755905511811, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.9724013412432293, 500, 1500, "NDFD_1Point_maxt_SOAP"], "isController": false}, {"data": [0.9757934038581207, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP"], "isController": false}, {"data": [0.43419434194341944, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP"], "isController": false}, {"data": [0.6291098636728147, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.11630695443645084, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.800242718446602, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 48131, 25, 0.05194157611518564, 412.69894662483716, 61, 69405, 104.0, 1189.9000000000015, 2786.9000000000015, 9279.960000000006, 50.67061102455047, 857.7392824866694, 19.90695535225502], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_Line_Summaries_24Hourly_REST", 12322, 0, 0.0, 111.97386787859134, 61, 2778, 88.0, 138.0, 172.0, 606.7000000000044, 204.76261694667397, 155.17167065490136, 95.98247669375343], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST", 8857, 0, 0.0, 156.216777689963, 66, 2892, 91.0, 255.0, 444.0, 1125.42, 144.26961167578838, 715.5716383802043, 51.56511511068217], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST", 5770, 0, 0.0, 240.3506065857889, 68, 17683, 100.0, 482.90000000000055, 1095.0, 1550.3199999999997, 93.82571507553214, 906.3710678976211, 36.0092832272306], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 120, 0, 0.0, 12175.25, 2859, 36580, 8722.0, 24363.2, 29805.59999999997, 36372.51999999999, 1.8418467583497053, 1134.444500936272, 1.0486295508963654], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 230, 0, 0.0, 6203.204347826086, 650, 45942, 2557.0, 23244.300000000003, 31538.35, 41131.61, 3.358154475105855, 887.6876129270697, 1.1478067053584466], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 254, 0, 0.0, 5826.901574803146, 455, 69405, 4448.0, 9245.5, 11433.25, 56349.79999999976, 2.9931652132924818, 1224.1987262108178, 1.0785917614305915], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 25, 25, 100.0, 60071.68000000001, 60063, 60104, 60070.0, 60084.6, 60100.7, 60104.0, 0.358844806797956, 0.135968540075788, 0.1538406935393581], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP", 7754, 0, 0.0, 178.3627805003871, 65, 4582, 107.0, 317.0, 503.25, 1253.0, 128.1695262653311, 379.2516255702668, 41.054301381863866], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP", 8035, 0, 0.0, 172.21132545115006, 63, 4720, 107.0, 259.0, 472.0, 1136.0, 132.0178104924174, 403.40207913161527, 42.802649495588454], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP", 813, 0, 0.0, 1731.5510455104545, 292, 59723, 895.0, 3449.4000000000015, 4864.899999999996, 11372.100000000013, 11.11597254505182, 1084.6214812879418, 13.33048270051136], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 1247, 0, 0.0, 1130.7377706495583, 211, 61764, 551.0, 2397.2000000000007, 3735.7999999999943, 7605.719999999999, 15.48029892991037, 1015.7132075222831, 5.759759660445167], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 227, 0, 0.0, 6315.704845814978, 1526, 34702, 5245.0, 11238.200000000006, 13607.599999999999, 25204.439999999995, 3.2069847279714057, 1311.650490098258, 1.1556419576381334], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 417, 0, 0.0, 3417.5875299760182, 640, 34970, 2375.0, 6503.599999999999, 9307.499999999989, 19357.039999999997, 6.34056593732419, 1377.0297449233658, 2.557279035268448], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 2060, 0, 0.0, 679.8645631067942, 142, 31487, 293.0, 1471.7000000000003, 2394.8499999999995, 5204.599999999995, 30.74397433027386, 1120.6538924334006, 10.838451887918813], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 25, 100.0, 0.05194157611518564], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 48131, 25, "504/Gateway Time-out", 25, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 25, 25, "504/Gateway Time-out", 25, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
