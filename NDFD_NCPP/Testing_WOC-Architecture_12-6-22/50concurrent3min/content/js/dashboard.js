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

    var data = {"OkPercent": 98.38621444201313, "KoPercent": 1.613785557986871};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.027580233406272792, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.06231454005934718, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -78"], "isController": false}, {"data": [0.05357142857142857, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.03298611111111111, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -77"], "isController": false}, {"data": [0.07581227436823104, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.0061162079510703364, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -79"], "isController": false}, {"data": [0.057863501483679525, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP "], "isController": false}, {"data": [0.0016220600162206002, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.00764525993883792, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -78"], "isController": false}, {"data": [0.08483754512635379, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_CityLevel1234_Summaries_24hourly_REST"], "isController": false}, {"data": [0.0328719723183391, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.009174311926605505, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -80"], "isController": false}, {"data": [0.08589511754068715, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80"], "isController": false}, {"data": [0.08408679927667269, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79"], "isController": false}, {"data": [0.04599406528189911, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -79"], "isController": false}, {"data": [0.03298611111111111, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.020761245674740483, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -78"], "isController": false}, {"data": [0.004601226993865031, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -77"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 10968, 177, 1.613785557986871, 11815.992432531026, 82, 90006, 7571.5, 21199.1, 46868.89999999999, 90002.0, 3.8841057632650284, 504.00859447043473, 1.5653273049881793], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 337, 0, 0.0, 6494.620178041543, 227, 15534, 6981.0, 11773.799999999997, 13153.1, 15024.560000000001, 1.807639287457558, 15.349837456619339, 0.6443245507050865], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 336, 0, 0.0, 6767.991071428577, 220, 14565, 7080.0, 11887.4, 12679.149999999998, 14059.14, 1.786160446114835, 15.49351320748699, 0.6366685183905418], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 712, 0, 0.0, 12941.804775280889, 4134, 39105, 12393.5, 15730.900000000003, 18527.000000000004, 35891.79, 3.7152219740769343, 1643.0170848601442, 1.3605549221473148], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 288, 0, 0.0, 7957.270833333336, 186, 19888, 6659.0, 14097.900000000003, 16428.8, 19423.030000000006, 1.5051583029340134, 4.327738421256179, 0.48800054352938715], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 554, 0, 0.0, 4128.590252707583, 196, 12199, 3452.5, 8417.5, 9328.25, 11151.25, 2.9649768796026716, 28.6156310878361, 1.1350302117228976], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 166, 77, 46.3855421686747, 64700.524096385554, 14350, 90005, 86370.5, 90003.0, 90004.0, 90005.0, 0.6180400683567209, 29.568841862487947, 0.23357568989653413], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 542, 0, 0.0, 16724.293357933573, 3121, 63417, 12267.0, 30150.19999999999, 42973.600000000006, 53833.14, 2.828898608515924, 1249.3845475735802, 1.0359736115170621], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 327, 0, 0.0, 6867.541284403674, 590, 15596, 6688.0, 9349.8, 10034.8, 14455.199999999995, 1.7448095916505257, 4.9332994676196416, 0.5554764910918666], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 337, 0, 0.0, 6490.94658753709, 209, 15225, 6996.0, 11695.0, 12771.4, 14174.980000000001, 1.7764330068632515, 15.171991257195346, 0.6332012182666864], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 885, 0, 0.0, 10218.953672316386, 5591, 25467, 7965.0, 19336.8, 21260.1, 25194.4, 4.619046127830144, 356.01107914585486, 1.655458914954749], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 222, 0, 0.0, 44501.32432432432, 9650, 72181, 47781.0, 64322.3, 67058.34999999999, 72021.90000000001, 0.9210395300209101, 16.79611573229903, 1.1099245898884795], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 1233, 0, 0.0, 7129.892133008926, 774, 12776, 6979.0, 8555.2, 8825.5, 8948.560000000001, 6.819049093835203, 542.9534710422001, 3.8157374323902067], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 327, 0, 0.0, 6850.143730886848, 659, 15585, 6603.0, 9343.4, 9876.4, 14594.759999999998, 1.7452193265694966, 4.907042970688854, 0.5556069340445858], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 554, 0, 0.0, 3961.613718411555, 82, 12681, 2990.5, 8566.0, 9398.0, 10963.950000000013, 2.9813316973679256, 27.998880318905623, 1.141291040398659], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 200, 0, 0.0, 48752.21000000001, 36835, 55039, 50316.5, 52746.6, 53158.4, 54629.23, 0.9957580706191624, 1392.098653875117, 0.5727553746041861], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 250, 0, 0.0, 36616.11599999998, 26829, 82172, 34586.0, 47339.6, 48279.3, 50966.36, 1.1264711713497828, 851.012636859207, 0.39162474316457296], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 289, 0, 0.0, 7592.785467128023, 440, 20275, 6469.0, 13598.0, 15781.5, 18272.500000000015, 1.512020299788108, 4.362396424647501, 0.4902253315719256], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 100, 100, 100.0, 90002.54, 90001, 90006, 90002.0, 90004.0, 90004.95, 90005.99, 0.52685651062933, 0.1502364268591449, 0.22895619846684753], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -80", 327, 0, 0.0, 6878.779816513765, 747, 15095, 6633.0, 9545.6, 11263.999999999989, 14624.95999999998, 1.7527497266353638, 4.9832827977262495, 0.5580043075030553], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 553, 0, 0.0, 4002.5298372513544, 120, 13420, 3085.0, 8474.400000000001, 9488.0, 11817.460000000028, 2.9796542954437695, 26.923362764491465, 1.1406489099745678], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 553, 0, 0.0, 3931.7432188065113, 133, 12234, 3113.0, 8120.8, 9042.999999999996, 10924.520000000002, 2.973917719817155, 27.369257738975534, 1.1384528771175049], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 337, 0, 0.0, 6763.364985163207, 434, 15455, 7127.0, 11884.6, 12804.099999999999, 14795.180000000004, 1.7806192539363839, 15.431751459632252, 0.6346933864128712], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 288, 0, 0.0, 7867.538194444443, 692, 20162, 6843.5, 14172.5, 16166.5, 19807.64, 1.5208804207769164, 4.330676468336114, 0.49309794892376585], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 636, 0, 0.0, 14483.559748427673, 9161, 60801, 12013.5, 19048.9, 32218.6, 56022.409999999996, 3.3591608435930342, 965.8998423082611, 1.3745003842436343], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 289, 0, 0.0, 7895.103806228371, 511, 20046, 6111.0, 14999.0, 16964.0, 19816.9, 1.5097769813863828, 4.314110586592762, 0.48949800568386626], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -77", 326, 0, 0.0, 6687.858895705525, 717, 15577, 6549.5, 9436.2, 9987.499999999998, 14463.070000000007, 1.7481954975922094, 4.997248753874452, 0.5565544259912697], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 177, 100.0, 1.613785557986871], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 10968, 177, "504/Gateway Time-out", 177, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 166, 77, "504/Gateway Time-out", 77, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 100, 100, "504/Gateway Time-out", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
