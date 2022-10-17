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

    var data = {"OkPercent": 96.37857931114596, "KoPercent": 3.6214206888540397};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.23240111517686007, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.14285714285714285, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -77"], "isController": false}, {"data": [0.2222222222222222, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -79"], "isController": false}, {"data": [0.2222222222222222, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77"], "isController": false}, {"data": [0.3386952636282395, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -79"], "isController": false}, {"data": [0.0625, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.23333333333333334, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -78"], "isController": false}, {"data": [0.20612373737373738, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -77"], "isController": false}, {"data": [0.1111111111111111, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -77"], "isController": false}, {"data": [0.07142857142857142, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.31655960028551033, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -79"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -80"], "isController": false}, {"data": [0.3379464285714286, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -77"], "isController": false}, {"data": [0.0625, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -78"], "isController": false}, {"data": [0.0020920502092050207, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}, {"data": [0.35, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -77"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77"], "isController": false}, {"data": [0.49862334801762115, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -79"], "isController": false}, {"data": [0.2777777777777778, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_CityLevel1234_Summaries_24hourly_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.4977924944812362, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80"], "isController": false}, {"data": [0.47102649006622516, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -78"], "isController": false}, {"data": [0.31777777777777777, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -79"], "isController": false}, {"data": [0.2222222222222222, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78"], "isController": false}, {"data": [4.574565416285453E-4, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.2963620230700976, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -80"], "isController": false}, {"data": [0.4903581267217631, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -80"], "isController": false}, {"data": [0.25, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -77"], "isController": false}, {"data": [0.13636363636363635, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -77"], "isController": false}, {"data": [0.13636363636363635, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -79"], "isController": false}, {"data": [0.006230529595015576, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP "], "isController": false}, {"data": [0.2222222222222222, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -79"], "isController": false}, {"data": [0.002905287623474724, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.2953571428571429, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST"], "isController": false}, {"data": [0.19974874371859297, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -79"], "isController": false}, {"data": [0.35, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -78"], "isController": false}, {"data": [0.30626780626780625, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -80"], "isController": false}, {"data": [0.18181818181818182, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -80"], "isController": false}, {"data": [0.18911264946507236, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -80"], "isController": false}, {"data": [0.1, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -79"], "isController": false}, {"data": [0.15, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -80"], "isController": false}, {"data": [0.20875314861460958, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -78"], "isController": false}, {"data": [0.13636363636363635, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -78"], "isController": false}, {"data": [0.2644539614561028, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -77"], "isController": false}, {"data": [0.25, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -77"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 34434, 1247, 3.6214206888540397, 3661.415897078479, 36, 60113, 1922.0, 8937.900000000001, 19357.70000000002, 34018.88000000018, 12.966014387102216, 951.7161672268821, 5.217145657407505], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_1Point_maxt_SOAP 34 -77", 7, 0, 0.0, 2363.142857142857, 1241, 3380, 2679.0, 3380.0, 3380.0, 3380.0, 0.04307347719874718, 0.1198281541322848, 0.013586653452339196], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79", 9, 0, 0.0, 1592.4444444444443, 1250, 2238, 1542.0, 2238.0, 2238.0, 2238.0, 0.07568303943086355, 0.81758377166427, 0.02875068587754484], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -79", 10, 0, 0.0, 2578.0, 2117, 3924, 2322.5, 3869.7000000000003, 3924.0, 3924.0, 0.07567101270516302, 0.23639801723028958, 0.023868883890398103], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77", 9, 0, 0.0, 4839.333333333333, 192, 30747, 1763.0, 30747.0, 30747.0, 30747.0, 0.05690260171340056, 0.5479777348812949, 0.021616320377453927], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 1119, 17, 1.519213583556747, 1894.556747095622, 41, 39201, 1360.0, 2784.0, 3313.0, 26798.199999999924, 6.206322795341098, 54.90673096921797, 2.194032081946755], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -79", 5, 0, 0.0, 2878.0, 1650, 3503, 3235.0, 3503.0, 3503.0, 3503.0, 0.038627040473413005, 0.352509466039106, 0.013655262354858894], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -77", 8, 0, 0.0, 2175.8749999999995, 531, 3760, 2158.0, 3760.0, 3760.0, 3760.0, 0.05227972265607131, 0.36414562680119983, 0.01848169882958771], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 1083, 0, 0.0, 8168.186518928901, 2132, 10413, 8061.0, 9263.4, 9462.4, 9718.800000000003, 5.950582146055748, 2363.99660205894, 2.161734920246815], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -78", 15, 1, 6.666666666666667, 1940.266666666667, 50, 3921, 2480.0, 3554.4, 3921.0, 3921.0, 0.1243925497155557, 0.26486056890932613, 0.039965965680095535], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 1584, 242, 15.277777777777779, 1368.4387626262642, 36, 60054, 1579.0, 2366.0, 2676.75, 4135.900000000002, 6.721205743575817, 16.74157104471469, 2.1594498922230896], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -78", 9, 0, 0.0, 2180.0, 839, 3874, 1972.0, 3874.0, 3874.0, 3874.0, 0.055993828235821115, 0.15849728702125276, 0.017662115742353733], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -77", 1, 0, 0.0, 1668.0, 1668, 1668, 1668.0, 1668.0, 1668.0, 1668.0, 0.5995203836930455, 0.28980721672661874, 0.18910652727817748], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -80", 7, 0, 0.0, 2262.285714285714, 1240, 3123, 2586.0, 3123.0, 3123.0, 3123.0, 0.04306950187044694, 0.13455013328472634, 0.013585399515775745], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 1036, 0, 0.0, 8506.717181467184, 2275, 9896, 8697.0, 9309.9, 9473.3, 9663.719999999994, 5.7106319178021785, 2268.6712187045246, 2.0745655013890727], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 1401, 0, 0.0, 1484.2255531763024, 156, 3238, 1446.0, 2260.8, 2540.5999999999995, 3084.4800000000005, 7.762030870832271, 24.014686559871798, 2.448374971951976], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -80", 14, 1, 7.142857142857143, 1751.2857142857142, 63, 4288, 1925.0, 3943.0, 4288.0, 4288.0, 0.11017549382230267, 0.22556157531281973, 0.03539818112064217], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 1120, 16, 1.4285714285714286, 1906.5151785714268, 41, 40685, 1389.5, 2663.0, 3182.600000000003, 28182.32999999993, 6.2191817333747945, 55.23804464692262, 2.198577917462574], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -78", 8, 0, 0.0, 2009.0, 504, 2953, 1999.5, 2953.0, 2953.0, 2953.0, 0.052458328415365046, 0.42215122588556214, 0.01854483875621303], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 1673, 6, 0.3586371787208607, 5407.075313807528, 43, 35405, 5409.0, 5661.6, 5996.3, 6335.26, 8.431609716762424, 491.5314283621863, 2.9971737665053926], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80", 10, 0, 0.0, 1417.4, 1204, 1721, 1373.5, 1718.9, 1721.0, 1721.0, 0.08408731626921395, 0.9083729419629343, 0.031943326199926], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -77", 3, 0, 0.0, 3349.0, 3038, 3831, 3178.0, 3831.0, 3831.0, 3831.0, 0.13231013495633764, 1.2194756383964012, 0.046773700052924055], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77", 6, 0, 0.0, 1704.3333333333333, 1310, 1966, 1731.5, 1966.0, 1966.0, 1966.0, 0.053107214615105466, 0.5745329331114633, 0.020174518052027367], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 1816, 6, 0.3303964757709251, 1137.9410792951576, 40, 31073, 1033.0, 1406.8999999999999, 1549.1499999999999, 2550.779999999959, 10.073610579509966, 107.48961622615423, 3.8267915189740007], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -79", 1, 0, 0.0, 2083.0, 2083, 2083, 2083.0, 2083.0, 2083.0, 2083.0, 0.48007681228996635, 4.379294437109937, 0.16971465434469513], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79", 9, 0, 0.0, 1571.2222222222222, 1201, 2237, 1417.0, 2237.0, 2237.0, 2237.0, 0.06574333800841514, 0.7102078174307505, 0.024974764145774896], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 450, 0, 0.0, 20465.6711111111, 10969, 22898, 20932.5, 22025.7, 22223.25, 22731.45, 2.374895768463495, 1727.6160713814504, 0.8186896545582166], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 150, 150, 100.0, 60066.733333333344, 60057, 60113, 60066.0, 60070.9, 60073.0, 60105.86, 0.7894404446128584, 0.2968111046640141, 0.34075456691297207], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 1812, 12, 0.6622516556291391, 1211.0397350993373, 38, 30771, 1045.5, 1403.5000000000002, 1662.7499999999995, 2021.0899999999992, 10.071926450479696, 107.82972145002113, 3.826151747301368], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 1812, 8, 0.44150110375275936, 1175.48068432671, 42, 29068, 1043.0, 1427.0, 1697.7999999999993, 2429.569999999999, 10.037891378049592, 107.23795129309867, 3.8132224082629795], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -78", 5, 0, 0.0, 2876.6, 1507, 3803, 3073.0, 3803.0, 3803.0, 3803.0, 0.038669760247486466, 0.35293708913379734, 0.013670364462490332], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 1125, 19, 1.6888888888888889, 2004.8879999999979, 41, 36327, 1419.0, 2885.799999999999, 3493.9000000000005, 27203.280000000006, 6.261862751100696, 55.77280257320814, 2.213666324119582], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78", 9, 0, 0.0, 1625.3333333333333, 1122, 2246, 1759.0, 2246.0, 2246.0, 2246.0, 0.06574621959237344, 0.710238946416831, 0.024975858809993427], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 1093, 0, 0.0, 8023.433668801465, 1490, 10665, 7576.0, 10013.6, 10210.3, 10478.0, 6.0555358567502875, 1682.9717930470065, 2.4600614418048043], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 1127, 24, 2.129547471162378, 1926.3859804791475, 40, 37337, 1407.0, 2730.0, 3035.0, 27980.84000000003, 6.265009339144357, 55.55742605294683, 2.214778692158454], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 1815, 12, 0.6611570247933884, 1241.6280991735568, 39, 30968, 1057.0, 1440.0, 1723.0, 2514.7199999999993, 10.07795842217484, 107.93856991548951, 3.8284431896738407], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 1249, 0, 0.0, 7203.2970376301155, 2215, 14362, 6831.0, 8288.0, 9964.5, 11124.0, 6.755623826960835, 563.2567338617531, 2.533358935110313], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78", 6, 0, 0.0, 1650.8333333333335, 1219, 2070, 1708.5, 2070.0, 2070.0, 2070.0, 0.05346068857366883, 0.5775216181659419, 0.020308796733551928], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -79", 1, 0, 0.0, 1985.0, 1985, 1985, 1985.0, 1985.0, 1985.0, 1985.0, 0.5037783375314862, 5.442183564231738, 0.19137673173803527], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -80", 1, 0, 0.0, 4119.0, 4119, 4119, 4119.0, 4119.0, 4119.0, 4119.0, 0.24277737314882253, 2.2143951808691433, 0.08582559480456423], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -77", 14, 2, 14.285714285714286, 1656.8571428571427, 54, 3818, 1744.5, 3758.0, 3818.0, 3818.0, 0.11021105416873313, 0.2074529364357745, 0.03540960627100898], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -77", 11, 0, 0.0, 1939.5454545454545, 792, 2743, 2133.0, 2690.8, 2743.0, 2743.0, 0.07778249186819404, 0.22432211011525954, 0.024534907102955736], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -79", 11, 0, 0.0, 2256.909090909091, 410, 4638, 2340.0, 4527.200000000001, 4638.0, 4638.0, 0.0778105525256598, 0.17329841363736037, 0.024999679473576245], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 1605, 8, 0.4984423676012461, 5543.510903426789, 42, 36052, 5589.0, 7705.8, 8179.799999999977, 11727.64, 8.776198730321903, 159.98979527671, 10.55029359084596], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -79", 9, 0, 0.0, 2146.222222222222, 179, 3841, 2099.0, 3841.0, 3841.0, 3841.0, 0.05557476658598034, 0.15731108245751618, 0.01752993125710122], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 1721, 0, 0.0, 5148.63102847182, 518, 6804, 5061.0, 5817.8, 6065.299999999999, 6448.0, 9.4469603403321, 655.0599794582819, 5.2585619081926716], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 1400, 0, 0.0, 1524.089285714284, 134, 3275, 1463.5, 2265.700000000001, 2475.8, 3122.4300000000003, 7.764061269534933, 23.845069890415818, 2.449015419980257], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 392, 0, 0.0, 25390.461734693894, 5712, 40192, 25894.5, 33457.799999999996, 37284.899999999994, 39542.329999999994, 1.9134365222314964, 2695.632181488478, 1.0949939472926338], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 1592, 243, 15.263819095477388, 1493.2562814070377, 38, 60056, 1585.0, 2549.0, 2992.7, 3911.6999999999994, 6.712003608966764, 16.51305770209792, 2.156493347021548], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -78", 10, 2, 20.0, 1409.0, 46, 4400, 324.5, 4342.6, 4400.0, 4400.0, 0.08361693410149425, 0.13093725960131444, 0.026865206366593362], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -80", 1404, 0, 0.0, 1541.2820512820524, 137, 3240, 1442.5, 2359.0, 2619.25, 3025.95, 7.7747751738802995, 24.15697559722899, 2.452394903479821], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -80", 3, 0, 0.0, 2690.3333333333335, 2484, 3038, 2549.0, 3038.0, 3038.0, 3038.0, 0.14066676044450696, 1.2860568469545646, 0.049727897735265154], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -80", 11, 0, 0.0, 2537.6363636363635, 128, 3770, 2600.0, 3766.8, 3770.0, 3770.0, 0.07751664846199922, 0.21093419673373032, 0.024905251312497798], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 1589, 233, 14.663310258023914, 1436.8936438011306, 37, 60047, 1582.0, 2543.0, 3041.5, 3845.7999999999947, 6.724929640053325, 16.90645284693273, 2.1606463394311954], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -79", 10, 2, 20.0, 1807.2, 41, 3494, 2083.5, 3462.3, 3494.0, 3494.0, 0.08361693410149425, 0.20026419031632287, 0.026865206366593362], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -79", 1, 0, 0.0, 1625.0, 1625, 1625, 1625.0, 1625.0, 1625.0, 1625.0, 0.6153846153846154, 0.29747596153846156, 0.19411057692307693], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -80", 10, 0, 0.0, 2159.3, 1312, 3929, 2146.0, 3814.4000000000005, 3929.0, 3929.0, 0.07610871368662998, 0.23776540535500912, 0.02400694777420067], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 1588, 242, 15.239294710327457, 1460.7644836272057, 38, 60045, 1570.0, 2388.3, 2709.95, 3754.5399999999886, 6.70013923463145, 16.488380797487448, 2.152681453314206], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -78", 11, 0, 0.0, 2257.1818181818185, 874, 3931, 2185.0, 3797.8000000000006, 3931.0, 3931.0, 0.07735964498955646, 0.22310263383218581, 0.02440152864416673], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -77", 1401, 0, 0.0, 1603.124197002144, 148, 3436, 1491.0, 2524.8, 2653.0, 2865.0, 7.768443816019296, 24.180948104674375, 2.450397805248274], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80", 8, 0, 0.0, 1450.5, 206, 1940, 1693.0, 1940.0, 1940.0, 1940.0, 0.050603446094679046, 0.48116514039293573, 0.019223379424638816], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -77", 15, 1, 6.666666666666667, 1777.4, 52, 3855, 2139.0, 3534.0, 3855.0, 3855.0, 0.12438223489999667, 0.28723712592042855, 0.039962651642674714], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503/Service Unavailable", 589, 47.23336006415397, 1.7105186734041935], "isController": false}, {"data": ["502/Bad Gateway", 242, 19.406575781876505, 0.7027937503630133], "isController": false}, {"data": ["504/Gateway Time-out", 159, 12.750601443464314, 0.4617529186269385], "isController": false}, {"data": ["502/Proxy Error", 257, 20.609462710505213, 0.7463553464598943], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 34434, 1247, "503/Service Unavailable", 589, "502/Proxy Error", 257, "502/Bad Gateway", 242, "504/Gateway Time-out", 159, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 1119, 17, "502/Proxy Error", 10, "502/Bad Gateway", 5, "503/Service Unavailable", 2, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -78", 15, 1, "503/Service Unavailable", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 1584, 242, "503/Service Unavailable", 153, "502/Bad Gateway", 46, "502/Proxy Error", 42, "504/Gateway Time-out", 1, "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -80", 14, 1, "502/Proxy Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 1120, 16, "502/Proxy Error", 9, "502/Bad Gateway", 4, "503/Service Unavailable", 3, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 1673, 6, "502/Proxy Error", 4, "503/Service Unavailable", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 1816, 6, "502/Bad Gateway", 3, "502/Proxy Error", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 150, 150, "504/Gateway Time-out", 150, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 1812, 12, "502/Bad Gateway", 6, "502/Proxy Error", 6, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 1812, 8, "502/Proxy Error", 5, "502/Bad Gateway", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 1125, 19, "502/Proxy Error", 12, "502/Bad Gateway", 7, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 1127, 24, "502/Bad Gateway", 13, "502/Proxy Error", 7, "503/Service Unavailable", 4, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 1815, 12, "502/Proxy Error", 7, "502/Bad Gateway", 5, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -77", 14, 2, "503/Service Unavailable", 1, "502/Proxy Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 1605, 8, "502/Proxy Error", 6, "502/Bad Gateway", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 1592, 243, "503/Service Unavailable", 143, "502/Proxy Error", 54, "502/Bad Gateway", 43, "504/Gateway Time-out", 3, "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -78", 10, 2, "503/Service Unavailable", 1, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 1589, 233, "503/Service Unavailable", 141, "502/Bad Gateway", 54, "502/Proxy Error", 37, "504/Gateway Time-out", 1, "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -79", 10, 2, "503/Service Unavailable", 1, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 1588, 242, "503/Service Unavailable", 136, "502/Proxy Error", 53, "502/Bad Gateway", 49, "504/Gateway Time-out", 4, "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -77", 15, 1, "503/Service Unavailable", 1, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
