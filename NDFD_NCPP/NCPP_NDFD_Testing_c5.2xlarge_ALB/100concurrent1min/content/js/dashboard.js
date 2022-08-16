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

    var data = {"OkPercent": 62.83483186230031, "KoPercent": 37.16516813769969};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5713547251780362, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3205267172507929, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.5693100814663951, 500, 1500, "NDFD_1Point-wspd-wdir_REST"], "isController": false}, {"data": [0.35524604749846006, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST"], "isController": false}, {"data": [0.637123745819398, 500, 1500, "NDFD_CityLevel1234_Summaries_24hourly_REST"], "isController": false}, {"data": [0.49774943735933985, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.6848475251108497, 500, 1500, "NDFD_1Point_maxt_SOAP"], "isController": false}, {"data": [0.5389667978493432, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP"], "isController": false}, {"data": [0.45823762123532413, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP"], "isController": false}, {"data": [0.8693470048569887, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.46242124212421243, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.6807432432432432, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.7600828093850637, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 181845, 67583, 37.16516813769969, 383.3833209601626, 2, 60618, 249.0, 551.0, 734.0, 1596.9800000000032, 208.60147705607446, 8400.203122678835, 55.33411330714128], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_Line_Summaries_24Hourly_REST", 24909, 16898, 67.8389337187362, 177.77385683889366, 2, 1186, 231.0, 270.0, 280.0, 294.0, 415.0462384403899, 794.3390779909189, 62.57029492626843], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST", 23568, 10137, 43.01171079429735, 167.6055244399188, 2, 2814, 139.0, 312.0, 376.0, 473.0, 392.6560261237546, 1315.8857702696512, 79.97956087976075], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST", 14611, 9385, 64.23242762302375, 304.4994182465298, 4, 3251, 291.0, 495.0, 572.3999999999996, 977.7599999999984, 243.45174620101307, 1023.5164340290506, 33.41911557959544], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 278, 238, 85.61151079136691, 21478.658273381294, 3, 60618, 9.0, 60067.0, 60076.0, 60438.5, 3.9729609992425647, 270.72018515177285, 0.8136508903434182], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 4186, 8, 0.19111323459149546, 1323.5582895365535, 2, 34645, 538.0, 1062.0, 1569.2999999999993, 30043.330000000027, 63.95721925133691, 11842.916020101222, 21.81859959893048], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 6665, 11, 0.16504126031507876, 833.5179294823675, 212, 8254, 734.0, 1245.0, 1646.6999999999998, 2720.34, 106.3422417231751, 27745.637106726168, 38.2573481751097], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 100, 100, 100.0, 60068.75, 60059, 60116, 60066.0, 60079.9, 60099.65, 60115.94, 1.4292452156016406, 0.5415499449740592, 0.612733056297969], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP", 22102, 6954, 31.46321599855217, 202.1279069767438, 3, 2374, 132.0, 469.0, 526.0, 617.0, 363.10765742824753, 980.7014153859108, 79.71370894872595], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP", 18041, 8283, 45.912089130314286, 199.09666869907426, 6, 4133, 123.0, 343.0, 364.0, 389.0, 299.4158064194908, 809.0951916833322, 52.506498531217844], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP", 15672, 7768, 49.56610515569168, 345.2269014803481, 3, 10935, 282.0, 457.0, 611.0, 1322.2700000000004, 260.69598775700314, 13147.993956475813, 157.67225031605562], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 18530, 2304, 12.433890987587695, 296.2018348623857, 3, 18367, 215.0, 258.0, 277.0, 436.6899999999987, 308.76128903255903, 12337.21819075549, 100.59674227055353], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 4444, 4, 0.09000900090009001, 1248.0717821782193, 283, 28332, 641.5, 1282.5, 1822.25, 20612.9, 71.95013357079253, 18786.39873664292, 25.904006111875656], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 9176, 855, 9.317785527462947, 596.3726024411512, 2, 9140, 467.0, 852.3000000000011, 1418.0, 3177.8799999998882, 151.66691459645295, 23080.89758459571, 55.47062561465926], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 19563, 4638, 23.708020242294126, 196.19449982109032, 2, 5456, 146.0, 371.0, 431.0, 560.0, 325.9467835185524, 6757.657438425748, 87.67220458313201], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 1, 0.0014796620451888788, 5.499188869641728E-4], "isController": false}, {"data": ["504/Gateway Time-out", 160, 0.23674592723022062, 0.08798702191426765], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 67401, 99.73070150777562, 37.06508290027221], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 21, 0.031072902948966457, 0.011548296626247628], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 181845, 67583, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 67401, "504/Gateway Time-out", 160, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 21, "502/Bad Gateway", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["NDFD_Line_Summaries_24Hourly_REST", 24909, 16898, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 16898, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST", 23568, 10137, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 10137, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST", 14611, 9385, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 9385, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 278, 238, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 178, "504/Gateway Time-out", 60, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 4186, 8, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 6, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 6665, 11, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 100, 100, "504/Gateway Time-out", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP", 22102, 6954, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 6954, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP", 18041, 8283, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 8283, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP", 15672, 7768, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 7768, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 18530, 2304, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 2304, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 4444, 4, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 9176, 855, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 851, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 4, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 19563, 4638, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 4637, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
