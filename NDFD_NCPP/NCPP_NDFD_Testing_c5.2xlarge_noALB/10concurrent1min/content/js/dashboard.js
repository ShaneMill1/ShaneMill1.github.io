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

    var data = {"OkPercent": 99.97332123896166, "KoPercent": 0.02667876103833738};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.965917882773524, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.999863238512035, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.999629410020753, 500, 1500, "NDFD_1Point-wspd-wdir_REST"], "isController": false}, {"data": [0.992834073475979, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST"], "isController": false}, {"data": [0.00980392156862745, 500, 1500, "NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST"], "isController": false}, {"data": [0.401840490797546, 500, 1500, "NDFD_CityLevel1234_Summaries_24hourly_REST"], "isController": false}, {"data": [0.10450819672131148, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.9997795090401294, 500, 1500, "NDFD_1Point_maxt_SOAP"], "isController": false}, {"data": [0.9997826086956522, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP"], "isController": false}, {"data": [0.7676470588235295, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP"], "isController": false}, {"data": [0.9069111424541608, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.08295964125560538, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.3911483253588517, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.9580283064909713, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 37483, 10, 0.02667876103833738, 210.13787583704624, 60, 64360, 82.0, 291.0, 1114.0, 3080.9600000000064, 43.386767631987425, 822.2691009067462, 16.918773184467554], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_Line_Summaries_24Hourly_REST", 7312, 0, 0.0, 75.81085886214444, 60, 1080, 73.0, 86.0, 92.0, 110.0, 121.73681406499733, 92.25367940863079, 57.0641315929675], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST", 6746, 0, 0.0, 82.16261488289317, 63, 1114, 78.0, 94.0, 103.0, 130.0, 112.287359765638, 543.6725876152668, 40.133958666233895], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST", 4954, 0, 0.0, 112.11687525232146, 66, 1469, 86.0, 126.0, 226.25, 1081.4499999999998, 81.75457125882897, 789.761932512047, 31.376510258515417], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 102, 0, 0.0, 5660.3725490196075, 1210, 35632, 3148.0, 17056.500000000033, 28134.849999999995, 35613.19, 1.6204623083644452, 964.8080665660498, 0.9225874275160855], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 163, 0, 0.0, 3440.472392638038, 393, 47733, 939.0, 2472.3999999999983, 30383.599999999973, 47610.759999999995, 2.6743232157506154, 676.866556219237, 0.914075317883511], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 244, 0, 0.0, 2311.926229508197, 548, 6230, 2119.5, 3782.5, 4558.75, 5731.400000000003, 3.941204974963657, 1608.1078506097563, 1.4202193708609272], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 10, 10, 100.0, 60506.200000000004, 60069, 64360, 60074.0, 63935.0, 64360.0, 64360.0, 0.13819980928426318, 0.05236477148661535, 0.05924776980057768], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP", 6803, 0, 0.0, 81.3960017639275, 63, 1349, 77.0, 94.0, 107.79999999999927, 139.0, 113.42870481525944, 317.91053009745565, 36.33263201113779], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP", 6900, 0, 0.0, 80.35275362318819, 61, 1071, 77.0, 93.0, 101.0, 120.0, 114.86025335841393, 350.97434839695035, 37.239847768548266], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP", 850, 0, 0.0, 656.1588235294118, 172, 7264, 445.0, 1323.6, 1730.0499999999993, 4143.590000000002, 13.994994731296101, 1365.537010329541, 16.7830600879215], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 709, 0, 0.0, 785.101551480959, 188, 32311, 283.0, 667.0, 1304.5, 24716.69999999998, 11.711652185404208, 752.2906583468235, 4.3575580885146525], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 223, 0, 0.0, 2531.228699551567, 827, 10237, 2093.0, 3985.3999999999996, 5632.999999999998, 9899.43999999999, 3.6230706742485785, 1478.301288967303, 1.3055791785134039], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 418, 0, 0.0, 1341.6578947368412, 255, 7002, 1131.0, 2209.2, 2637.3999999999996, 5784.9800000000005, 6.808815624440064, 1478.7231510929942, 2.7461336454040497], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 2049, 0, 0.0, 272.04782820888227, 115, 6981, 171.0, 404.0, 799.0, 1413.0, 33.743947827805414, 1191.8797353358339, 11.89605973226343], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 10, 100.0, 0.02667876103833738], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 37483, 10, "504/Gateway Time-out", 10, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 10, 10, "504/Gateway Time-out", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
