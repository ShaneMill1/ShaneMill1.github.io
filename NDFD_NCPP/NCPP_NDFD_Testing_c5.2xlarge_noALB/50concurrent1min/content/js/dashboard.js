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

    var data = {"OkPercent": 99.89522811696352, "KoPercent": 0.10477188303647966};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8693399371368702, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9582581715852515, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.9106463878326996, 500, 1500, "NDFD_1Point-wspd-wdir_REST"], "isController": false}, {"data": [0.8620718186331292, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST"], "isController": false}, {"data": [0.019823788546255508, 500, 1500, "NDFD_CityLevel1234_Summaries_24hourly_REST"], "isController": false}, {"data": [0.007434944237918215, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.9204557612068043, 500, 1500, "NDFD_1Point_maxt_SOAP"], "isController": false}, {"data": [0.9240622635390768, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP"], "isController": false}, {"data": [0.23772321428571427, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP"], "isController": false}, {"data": [0.4538539553752535, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.0468384074941452, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.6485674676524954, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 52495, 55, 0.10477188303647966, 770.4117154014716, 2, 92470, 120.0, 2029.9000000000015, 5609.0, 28526.790000000354, 49.41691895229919, 745.62760735848, 19.39459405664942], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_Line_Summaries_24Hourly_REST", 13859, 0, 0.0, 199.4718955191576, 57, 5859, 95.0, 332.0, 1086.0, 1760.0, 227.8578827088437, 172.6735517402956, 106.80838251977048], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST", 8679, 0, 0.0, 320.17905288627855, 67, 15396, 111.0, 1018.0, 1134.0, 2755.4000000000124, 135.3534723413546, 655.3540194027698, 48.378291872007615], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST", 6043, 0, 0.0, 463.3878868111849, 67, 62678, 190.0, 1123.6000000000004, 1616.4000000000015, 3245.0, 72.92496319358965, 704.4665389755751, 27.987803256914777], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 66, 0, 0.0, 45179.66666666667, 4932, 66305, 55708.0, 62978.3, 65017.299999999996, 66305.0, 0.9256142712891282, 551.1020594917536, 0.5269854689077751], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 227, 0, 0.0, 13109.251101321577, 1121, 92470, 5980.0, 36098.200000000004, 44876.19999999998, 80438.19999999998, 2.454850221693522, 713.9286833736618, 0.8390601343679032], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 269, 0, 0.0, 11028.31598513011, 658, 74702, 9019.0, 18108.0, 22754.5, 65695.80000000002, 3.2925739605135926, 1340.2448029504646, 1.1864841713178864], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 50, 50, 100.0, 60074.24, 60067, 60135, 60071.0, 60078.8, 60099.75, 60135.0, 0.7157069037087932, 0.2711858189834099, 0.3068313776642189], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP", 9347, 0, 0.0, 296.54381084839986, 66, 10258, 113.0, 959.4000000000051, 1130.0, 2473.040000000001, 146.949235147075, 411.8596727266653, 47.069676883047464], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP", 9251, 5, 0.05404821100421576, 300.03156415522824, 2, 15487, 116.0, 685.0, 1136.0, 2696.399999999998, 150.085985917778, 458.5641891720611, 48.634390513968654], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP", 896, 0, 0.0, 3217.8370535714266, 292, 62994, 1871.0, 6627.700000000002, 9204.199999999997, 23236.5999999999, 11.853419764519117, 1156.576597433523, 14.214843233231909], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 986, 0, 0.0, 3005.4563894523335, 214, 71320, 1014.5, 7329.300000000001, 14506.04999999999, 30939.349999999995, 11.880376894715281, 743.7997682814421, 4.4203355438344945], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 231, 0, 0.0, 12957.675324675327, 2516, 74155, 10206.0, 21882.800000000007, 31899.79999999995, 69066.60000000002, 2.542596750759477, 1034.9659938003565, 0.9162287119436006], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 427, 0, 0.0, 6884.086651053862, 704, 71166, 4386.0, 13587.599999999999, 22316.79999999997, 44435.79999999981, 5.063261119609169, 1099.627578505745, 2.0421160570298698], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 2164, 0, 0.0, 1314.4782809611827, 131, 59405, 464.0, 3027.5, 4470.0, 12065.8, 27.019940316398007, 948.4421237623144, 9.525584427948907], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 50, 90.9090909090909, 0.0952471663967997], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 5, 9.090909090909092, 0.00952471663967997], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 52495, 55, "504/Gateway Time-out", 50, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 5, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 50, 50, "504/Gateway Time-out", 50, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP", 9251, 5, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
