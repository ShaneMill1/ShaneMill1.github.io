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

    var data = {"OkPercent": 86.12258758277208, "KoPercent": 13.877412417227914};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7318278717905182, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9259421081376297, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.9037328094302554, 500, 1500, "NDFD_1Point-wspd-wdir_REST"], "isController": false}, {"data": [0.8712194337194337, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST"], "isController": false}, {"data": [0.017928286852589643, 500, 1500, "NDFD_CityLevel1234_Summaries_24hourly_REST"], "isController": false}, {"data": [0.007547169811320755, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.9325853951717921, 500, 1500, "NDFD_1Point_maxt_SOAP"], "isController": false}, {"data": [0.4316659385466725, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP"], "isController": false}, {"data": [0.2577433628318584, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP"], "isController": false}, {"data": [0.45256024096385544, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.07255936675461741, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.6414503133393017, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 53007, 7356, 13.877412417227914, 764.2791706755662, 3, 95394, 201.0, 2345.600000000006, 5773.9000000000015, 26094.770000000037, 49.28618848640718, 809.770876220602, 16.4934254195049], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_Line_Summaries_24Hourly_REST", 9155, 0, 0.0, 302.71960677225553, 64, 8872, 136.0, 705.3999999999996, 1150.0, 2613.880000000001, 145.39361887973064, 110.18110180729589, 68.15325884987375], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST", 8144, 0, 0.0, 340.36222986247446, 66, 16143, 117.0, 1086.0, 1252.0, 2887.8500000000013, 133.3224195792748, 645.5200744863714, 47.6523491855611], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST", 6216, 0, 0.0, 448.31660231660425, 71, 46422, 164.5, 1113.3000000000002, 1478.5999999999985, 3276.899999999998, 92.49036558691803, 893.4713831892512, 35.49679069888553], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 122, 0, 0.0, 24896.008196721297, 3901, 72685, 23179.0, 47040.900000000016, 59849.99999999999, 70653.17999999996, 1.4999877050188113, 893.0786171834657, 0.8539969062753584], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 251, 0, 0.0, 11645.235059760955, 862, 76411, 5597.0, 29718.600000000002, 37330.399999999994, 69151.87999999987, 2.9806082340786832, 851.9291501592726, 1.0187625800073625], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 265, 0, 0.0, 11443.184905660388, 869, 95394, 8742.0, 20667.8, 27516.6, 73848.49999999987, 2.6081136940731846, 1064.1740618325937, 0.9398378448369191], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 50, 22, 44.0, 61347.520000000004, 58223, 67446, 60078.5, 64554.2, 65957.5, 67446.0, 0.6878525244187645, 156.27912625533085, 0.29488990060531023], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP", 9983, 0, 0.0, 278.0124211158965, 66, 22392, 106.0, 640.2000000000007, 1111.0, 2342.239999999998, 162.65845472023986, 481.30382597883465, 52.10153627757682], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP", 13734, 7334, 53.40032037279744, 200.72586282219262, 3, 29515, 123.0, 258.5, 591.25, 1731.6999999999862, 222.31214995629512, 608.8239783478747, 33.58800867622779], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP", 904, 0, 0.0, 3179.226769911501, 301, 68132, 1809.0, 6795.0, 9487.75, 22743.35000000003, 10.627292391611023, 1036.9393743240385, 12.744448297752282], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 1328, 0, 0.0, 2180.484939759035, 212, 62117, 1041.0, 4700.600000000008, 6973.749999999999, 21982.600000000075, 14.69481697871022, 943.9123843668393, 5.467505145399017], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 242, 0, 0.0, 12280.789256198348, 2137, 75007, 9674.5, 23745.100000000002, 29619.1, 60599.92999999982, 2.98746990926486, 1218.9606592571447, 1.0765394497253256], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 379, 0, 0.0, 7995.617414248022, 564, 74560, 3875.0, 17782.0, 27025.0, 72858.99999999999, 4.140221321593603, 899.1638864347669, 1.669835357244295], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 2234, 0, 0.0, 1261.3487018800374, 121, 59295, 491.5, 2927.5, 4090.0, 11425.400000000089, 30.50370714256455, 1077.4302574603685, 10.753748318814262], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 22, 0.29907558455682437, 0.04150395230818571], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 7334, 99.70092441544318, 13.835908464919727], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 53007, 7356, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 7334, "504/Gateway Time-out", 22, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 50, 22, "504/Gateway Time-out", 22, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP", 13734, 7334, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 7334, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
