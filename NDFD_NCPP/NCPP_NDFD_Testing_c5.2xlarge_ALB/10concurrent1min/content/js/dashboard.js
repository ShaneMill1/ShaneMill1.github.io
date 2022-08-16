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

    var data = {"OkPercent": 99.98178307283128, "KoPercent": 0.01821692716872518};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.998442452727074, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.9999315630988229, 500, 1500, "NDFD_1Point-wspd-wdir_REST"], "isController": false}, {"data": [0.999857509261898, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST"], "isController": false}, {"data": [0.9804045512010113, 500, 1500, "NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST"], "isController": false}, {"data": [0.9854060913705583, 500, 1500, "NDFD_CityLevel1234_Summaries_24hourly_REST"], "isController": false}, {"data": [0.9997575169738119, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.9998563218390805, 500, 1500, "NDFD_1Point_maxt_SOAP"], "isController": false}, {"data": [0.9993148807892573, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP"], "isController": false}, {"data": [0.9981740718198417, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP"], "isController": false}, {"data": [0.9952872531418312, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.994114636642784, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.9975942261427426, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.9986889874949576, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 54894, 10, 0.01821692716872518, 142.4367872627236, 54, 60096, 119.0, 303.0, 351.0, 434.0, 64.48907090343909, 3201.192379951237, 27.282666515485527], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_Line_Summaries_24Hourly_REST", 7741, 0, 0.0, 71.59578865779633, 54, 268, 70.0, 82.0, 87.0, 105.0, 128.8641773900884, 97.65488442842637, 60.40508315160394], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST", 7306, 0, 0.0, 75.8513550506434, 57, 505, 73.0, 88.0, 95.0, 117.0, 121.62072180050606, 489.2146026330903, 43.46990642479025], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST", 7018, 0, 0.0, 78.96423482473615, 62, 1136, 76.0, 90.0, 99.0, 129.0, 116.79731056634547, 856.4755908620001, 44.825530324779066], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 791, 0, 0.0, 704.2907711757277, 239, 32840, 363.0, 450.0, 479.4, 21086.360000000022, 13.094508914529772, 6050.366436862657, 7.455174508955916], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 788, 0, 0.0, 706.4365482233501, 156, 38851, 350.0, 380.0, 397.0, 25455.99, 13.066259866021092, 2397.5948853178684, 4.466006790143928], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 2062, 0, 0.0, 270.00775945683824, 178, 520, 261.0, 309.0, 329.0, 378.47999999999956, 34.20192738310472, 9508.20261314253, 12.32471797301332], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 10, 10, 100.0, 60067.59999999999, 60058, 60096, 60064.0, 60093.9, 60096.0, 60096.0, 0.14479742839767168, 0.05486465060380528, 0.062076241275954944], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP", 6960, 0, 0.0, 79.53505747126432, 59, 1127, 77.0, 92.0, 102.0, 124.0, 116.03867955985328, 326.13214821607204, 37.16863954651551], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP", 7298, 0, 0.0, 75.93984653329686, 57, 1901, 72.0, 86.0, 94.0, 113.0, 121.47945935148812, 353.0496787402623, 39.38591846161529], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP", 3286, 0, 0.0, 169.02221545952563, 130, 6224, 155.0, 182.0, 198.0, 253.1300000000001, 54.62464259591728, 5330.330236437347, 65.50689561307269], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 2228, 0, 0.0, 249.31328545781008, 102, 30073, 124.0, 141.0, 149.0, 178.71000000000004, 37.05674938460515, 1686.0459087677134, 13.78771632376422], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 1954, 0, 0.0, 284.3346980552714, 185, 8994, 249.0, 295.0, 322.0, 441.8000000000002, 32.470337997274754, 9026.817381871282, 11.700737032221078], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 2494, 0, 0.0, 222.94145950280685, 164, 5454, 209.0, 247.0, 265.0, 368.45000000000164, 41.42306670209939, 6941.073970911258, 16.706764206999072], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 4958, 0, 0.0, 111.92154094392882, 80, 7536, 101.0, 119.0, 127.0, 154.0, 82.42589483134113, 2176.8807615417863, 29.058347689564595], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 10, 100.0, 0.01821692716872518], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 54894, 10, "504/Gateway Time-out", 10, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 10, 10, "504/Gateway Time-out", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
