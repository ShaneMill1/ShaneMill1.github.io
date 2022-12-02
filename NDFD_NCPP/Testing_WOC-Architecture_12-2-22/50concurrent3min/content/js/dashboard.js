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

    var data = {"OkPercent": 95.06868615709757, "KoPercent": 4.931313842902431};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.2475343430785488, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -77"], "isController": false}, {"data": [0.42424242424242425, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -79"], "isController": false}, {"data": [0.4107142857142857, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77"], "isController": false}, {"data": [0.2457898957497995, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -78"], "isController": false}, {"data": [0.275, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -79"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -80"], "isController": false}, {"data": [0.09090909090909091, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -77"], "isController": false}, {"data": [0.16228070175438597, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.1, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -78"], "isController": false}, {"data": [0.15918653576437589, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.039603960396039604, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -79"], "isController": false}, {"data": [0.25, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -80"], "isController": false}, {"data": [0.2432, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -77"], "isController": false}, {"data": [0.05, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -78"], "isController": false}, {"data": [4.1946308724832214E-4, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}, {"data": [0.3870967741935484, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80"], "isController": false}, {"data": [0.1875, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -77"], "isController": false}, {"data": [0.4852941176470588, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77"], "isController": false}, {"data": [0.5237375917134225, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78"], "isController": false}, {"data": [0.1590909090909091, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -79"], "isController": false}, {"data": [0.5161290322580645, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_CityLevel1234_Summaries_24hourly_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.5060266896254842, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80"], "isController": false}, {"data": [0.5140207075064711, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -77"], "isController": false}, {"data": [0.14285714285714285, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -78"], "isController": false}, {"data": [0.23624595469255663, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -79"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -77"], "isController": false}, {"data": [0.4393939393939394, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.26067687348912166, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -80"], "isController": false}, {"data": [0.511858559724019, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77"], "isController": false}, {"data": [0.13004291845493562, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.42424242424242425, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -79"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -80"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -77"], "isController": false}, {"data": [0.1875, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP "], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -79"], "isController": false}, {"data": [0.016695205479452056, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.03469640644361834, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST"], "isController": false}, {"data": [0.13737796373779637, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -78"], "isController": false}, {"data": [0.030284301606922127, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -77"], "isController": false}, {"data": [0.11764705882352941, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -80"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -80"], "isController": false}, {"data": [0.1404494382022472, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -80"], "isController": false}, {"data": [0.25, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -79"], "isController": false}, {"data": [0.1451388888888889, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -78"], "isController": false}, {"data": [0.03660049627791563, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -77"], "isController": false}, {"data": [0.4482758620689655, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80"], "isController": false}, {"data": [0.2, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -77"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 28390, 1400, 4.931313842902431, 4447.016026769982, 32, 90146, 1123.0, 11660.700000000004, 14061.500000000007, 34083.900000000016, 10.729496136965667, 628.485097302315, 4.133542284192191], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_1Point-wspd-wdir_REST 37 -79", 1, 0, 0.0, 1286.0, 1286, 1286, 1286.0, 1286.0, 1286.0, 1286.0, 0.7776049766718507, 0.30527070373250387, 0.27641426905132194], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -77", 1, 0, 0.0, 3008.0, 3008, 3008, 3008.0, 3008.0, 3008.0, 3008.0, 0.3324468085106383, 0.9979897357047872, 0.10551290309175532], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79", 33, 4, 12.121212121212121, 911.0606060606059, 41, 2067, 946.0, 1541.8000000000002, 1814.299999999999, 2067.0, 0.19269960467384134, 1.4565095149079421, 0.07357963420651557], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -79", 2, 0, 0.0, 2885.0, 2519, 3251, 2885.0, 3251.0, 3251.0, 3251.0, 0.018274686817554665, 0.05411020549885326, 0.005800071499712174], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77", 28, 1, 3.5714285714285716, 1074.5714285714287, 48, 1711, 1055.5, 1544.4000000000003, 1702.45, 1711.0, 0.16229814168627768, 1.4320580762888213, 0.06197126308528768], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 1247, 30, 2.405773857257418, 1706.3023255813966, 36, 5256, 1548.0, 3176.000000000002, 3844.6, 4591.48, 6.865719303847996, 47.56410007701223, 2.440548658789717], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -79", 20, 0, 0.0, 1687.2500000000002, 768, 3989, 1445.0, 3411.7000000000003, 3960.7, 3989.0, 0.11419957517758034, 0.6058153635543475, 0.04059438023890551], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -80", 1, 0, 0.0, 726.0, 726, 726, 726.0, 726.0, 726.0, 726.0, 1.3774104683195594, 14.109041408402204, 0.525944817493113], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -77", 11, 1, 9.090909090909092, 1767.181818181818, 45, 2905, 2009.0, 2884.0, 2905.0, 2905.0, 0.06661579642212613, 0.40915724961544514, 0.02367983388442765], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 1140, 166, 14.56140350877193, 7940.116666666679, 32, 17789, 10552.0, 12871.000000000002, 13360.85, 14699.9, 6.110045128578932, 1808.2766804466496, 2.2315985137583207], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -78", 5, 0, 0.0, 3296.2, 1300, 4819, 3648.0, 4819.0, 4819.0, 4819.0, 0.029194693572496263, 0.058195516132987665, 0.009436956613765882], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 713, 0, 0.0, 2992.143057503507, 231, 13367, 2785.0, 5835.6, 6416.599999999997, 7020.4400000000005, 3.9126808174374963, 11.301464974509955, 1.2647435064177843], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -78", 1, 0, 0.0, 1722.0, 1722, 1722, 1722.0, 1722.0, 1722.0, 1722.0, 0.5807200929152149, 1.7194759001161442, 0.18431057636469222], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -77", 1, 0, 0.0, 2041.0, 2041, 2041, 2041.0, 2041.0, 2041.0, 2041.0, 0.4899559039686428, 1.4507288094071533, 0.15550358280254778], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -80", 1, 0, 0.0, 4476.0, 4476, 4476, 4476.0, 4476.0, 4476.0, 4476.0, 0.22341376228775692, 0.6615141867739053, 0.07090768822609472], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 790, 0, 0.0, 11599.045569620266, 4815, 18902, 11671.5, 13316.9, 13873.099999999997, 15098.480000000018, 4.032772658822328, 1728.0921429927384, 1.4729072015620612], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 808, 0, 0.0, 2719.298267326734, 148, 5479, 2792.0, 3648.0, 3915.6999999999966, 5112.669999999999, 4.362003066358591, 12.194620983502128, 1.384424801334514], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -80", 8, 0, 0.0, 2502.125, 697, 5942, 1639.5, 5942.0, 5942.0, 5942.0, 0.061988594098685845, 0.18971899795437638, 0.0200373287565088], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 1250, 31, 2.48, 1718.5248000000004, 37, 5165, 1544.5, 3074.9, 3830.0, 4554.9, 6.8595009575863335, 46.69465943263695, 2.438338231017017], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -78", 10, 0, 0.0, 1964.8, 1458, 2924, 1846.5, 2853.9, 2924.0, 2924.0, 0.06038465022191359, 0.36275606865734733, 0.021464856133570846], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 1192, 0, 0.0, 7557.635067114093, 1345, 14634, 7495.0, 8348.5, 9187.649999999987, 10158.07, 6.422517605349225, 387.6136924441801, 2.2955482847244295], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80", 31, 2, 6.451612903225806, 1022.9354838709678, 39, 1930, 972.0, 1648.6, 1863.3999999999999, 1930.0, 0.18129185063890757, 1.5703755500891838, 0.06922374374981724], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -77", 16, 0, 0.0, 1774.1875, 776, 2699, 1817.5, 2620.6, 2699.0, 2699.0, 0.10008319415514147, 0.7044246643303497, 0.03557644792233544], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77", 34, 1, 2.9411764705882355, 1114.5882352941178, 43, 4297, 930.0, 1697.5, 3898.75, 4297.0, 0.1957048540559831, 1.5493319683159599, 0.07472714642176699], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 2317, 145, 6.258092360811394, 916.5360379801476, 33, 28616, 720.0, 1314.2000000000003, 1538.1999999999998, 2798.080000000007, 12.819732539546413, 117.47966312929837, 4.895034592736961], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -79", 22, 1, 4.545454545454546, 1780.6363636363637, 57, 4490, 1551.5, 3428.699999999999, 4397.899999999999, 4490.0, 0.14080720932911767, 0.9078964842999963, 0.05005256269120979], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79", 31, 2, 6.451612903225806, 807.0322580645162, 39, 1428, 827.0, 1280.0, 1370.3999999999999, 1428.0, 0.1867267404739245, 1.3206987532978351, 0.07129898000518016], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 400, 23, 5.75, 22291.677500000005, 40, 29399, 24142.0, 28438.6, 28662.3, 29252.7, 2.1781746896101066, 19.853184857261493, 0.7551289207144414], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 110, 110, 100.0, 81912.48181818178, 37, 90146, 90097.5, 90109.9, 90120.6, 90144.79, 0.5789473684210527, 0.17793996710526316, 0.25102796052631576], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 2323, 172, 7.404218682737839, 889.3189840723196, 35, 28996, 725.0, 1341.0, 1563.199999999999, 2205.3199999999924, 12.788962844291763, 114.77071466691166, 4.883285617302811], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 2318, 144, 6.212251941328732, 932.1009490940469, 34, 28943, 719.0, 1316.2999999999997, 1554.0999999999995, 4009.2099999999978, 12.80415389289364, 117.19684297925815, 4.889086105587317], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -77", 1, 0, 0.0, 1773.0, 1773, 1773, 1773.0, 1773.0, 1773.0, 1773.0, 0.5640157924421885, 4.175038776085731, 0.20048998871968415], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -78", 21, 1, 4.761904761904762, 1830.095238095238, 47, 4305, 1778.0, 2795.4, 4155.599999999998, 4305.0, 0.11900107100963908, 0.7628043912811883, 0.04230116196045765], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 1236, 30, 2.4271844660194173, 1746.4919093851108, 36, 5789, 1582.0, 3292.7, 4079.6499999999987, 4830.26, 6.7824512305539555, 46.74112088272011, 2.410949460860976], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -77", 2, 0, 0.0, 994.0, 985, 1003, 994.0, 1003.0, 1003.0, 1003.0, 0.03954522985664854, 0.40458554745427583, 0.015099789915966385], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78", 33, 1, 3.0303030303030303, 1963.2424242424245, 49, 29399, 1198.0, 1701.6000000000001, 10109.099999999922, 29399.0, 0.1982446338782057, 1.8512923072070935, 0.07569692563122893], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 800, 0, 0.0, 11501.562500000004, 2776, 20896, 11159.0, 13567.699999999999, 18833.75, 20235.32, 4.222504895466614, 758.4915233214223, 1.7236396936572698], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 1241, 27, 2.17566478646253, 1702.5398871877503, 35, 5767, 1493.0, 3137.1999999999994, 3904.499999999998, 5012.839999999993, 6.830728922990549, 46.30423348839161, 2.428110671844297], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 2319, 157, 6.770159551530832, 925.2466580422587, 32, 27922, 725.0, 1338.0, 1630.0, 4113.200000000005, 12.868463109295925, 117.07617031430347, 4.913641675522174], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 1165, 292, 25.064377682403432, 7867.579399141625, 34, 70512, 9089.0, 12476.400000000001, 23075.5, 55255.999999999985, 6.176603133366911, 474.80555732742624, 2.328289853007449], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78", 33, 2, 6.0606060606060606, 999.2424242424241, 42, 2025, 975.0, 1599.6000000000001, 1785.599999999999, 2025.0, 0.19021598160092687, 1.2098236287156963, 0.07263129766207266], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -79", 2, 0, 0.0, 1128.5, 881, 1376, 1128.5, 1376.0, 1376.0, 1376.0, 0.05187663735636656, 0.531380907452079, 0.019808364459315747], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -80", 21, 1, 4.761904761904762, 1618.4761904761906, 44, 3424, 1568.0, 2856.8, 3372.2999999999993, 3424.0, 0.13287859325862605, 0.8068493971424776, 0.04723418744740223], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -77", 7, 0, 0.0, 2285.4285714285716, 734, 5231, 1062.0, 5231.0, 5231.0, 5231.0, 0.0542433823073585, 0.1475650048819044, 0.017533749554429358], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -77", 3, 0, 0.0, 3552.3333333333335, 3012, 4163, 3482.0, 4163.0, 4163.0, 4163.0, 0.031488128975376284, 0.09323438188802821, 0.009993790934567669], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -79", 8, 0, 0.0, 3170.875, 990, 6265, 2842.0, 6265.0, 6265.0, 6265.0, 0.07364244750674288, 0.22538616258411348, 0.023804345824933494], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 477, 0, 0.0, 19973.354297693928, 4001, 45374, 19418.0, 31405.0, 36921.799999999996, 41897.55999999999, 2.15523084013338, 601.8339070872981, 2.5951168221527907], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -79", 1, 0, 0.0, 1808.0, 1808, 1808, 1808.0, 1808.0, 1808.0, 1808.0, 0.5530973451327433, 1.6376866703539823, 0.17554359098451328], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 1168, 0, 0.0, 7582.078767123294, 545, 11519, 7598.5, 9542.000000000004, 10216.5, 10949.779999999999, 6.394849080466693, 371.14352262321586, 3.5721227285419417], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 807, 0, 0.0, 2721.292441140023, 370, 5193, 2823.0, 3681.2, 3913.5999999999985, 4958.5199999999995, 4.415602891207643, 12.455987601293494, 1.4014364644946131], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 347, 52, 14.985590778097983, 26309.936599423643, 41, 54635, 30137.0, 35163.8, 36573.2, 52902.51999999999, 1.8347071606452672, 1788.7332029866204, 1.0535232524017744], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 717, 0, 0.0, 3143.8898186889833, 221, 11618, 2898.0, 5995.4000000000015, 6507.200000000001, 7413.640000000003, 3.935840853698702, 11.503948277589311, 1.272229807201436], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -78", 2, 0, 0.0, 2743.5, 2072, 3415, 2743.5, 3415.0, 3415.0, 3415.0, 0.06788866259334692, 0.2077764341479973, 0.021944479803122877], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -80", 809, 0, 0.0, 2742.4375772558665, 369, 5201, 2789.0, 3693.0, 4003.0, 4716.399999999999, 4.4286543240964775, 12.480277793364134, 1.4055787649720266], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -77", 1, 0, 0.0, 3364.0, 3364, 3364, 3364.0, 3364.0, 3364.0, 3364.0, 0.29726516052318663, 0.9097939580856124, 0.09608864075505351], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -80", 17, 0, 0.0, 2198.823529411765, 1060, 3948, 2131.0, 3380.7999999999993, 3948.0, 3948.0, 0.10554024187340137, 0.6963909893466439, 0.037516257853435646], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -80", 7, 0, 0.0, 1729.7142857142858, 938, 3869, 1398.0, 3869.0, 3869.0, 3869.0, 0.06446800084729373, 0.14816487806338124, 0.020838777617631078], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 712, 0, 0.0, 2956.4985955056163, 255, 10164, 2794.0, 5741.100000000002, 6161.4, 6911.22, 3.9277124384915822, 11.196755913634457, 1.2696023604889781], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -79", 2, 0, 0.0, 1233.0, 808, 1658, 1233.0, 1658.0, 1658.0, 1658.0, 0.07447957397683684, 0.22794822738613935, 0.024074940416340816], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -80", 2, 0, 0.0, 2975.5, 2585, 3366, 2975.5, 3366.0, 3366.0, 3366.0, 0.018255504034466394, 0.05405340647705283, 0.005793983214064041], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -79", 1, 0, 0.0, 2060.0, 2060, 2060, 2060.0, 2060.0, 2060.0, 2060.0, 0.4854368932038835, 1.4373483009708738, 0.15406932645631066], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 720, 0, 0.0, 3051.8944444444455, 200, 9275, 2934.5, 5901.4, 6255.95, 7222.899999999989, 3.9378907125941405, 11.33709592182193, 1.2728924080748636], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -78", 3, 0, 0.0, 2942.0, 1737, 3910, 3179.0, 3910.0, 3910.0, 3910.0, 0.03134730726630583, 0.0928174176088274, 0.009949096544481829], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -77", 806, 0, 0.0, 2707.384615384615, 401, 5378, 2753.5, 3657.9, 3991.8999999999996, 4833.849999999998, 4.410831162576888, 12.469871348477552, 1.3999219998412977], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80", 29, 4, 13.793103448275861, 835.9655172413793, 37, 1879, 797.0, 1481.0, 1699.5, 1879.0, 0.16844404172765504, 1.097155183429753, 0.06431798858936828], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -77", 5, 0, 0.0, 2110.8, 666, 3624, 2556.0, 3624.0, 3624.0, 3624.0, 0.02972033167890154, 0.07510188501203673, 0.00960686502511368], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503/Service Unavailable", 1144, 81.71428571428571, 4.029587883057415], "isController": false}, {"data": ["502/Bad Gateway", 61, 4.357142857142857, 0.2148643888693202], "isController": false}, {"data": ["504/Gateway Time-out", 100, 7.142857142857143, 0.3522367030644593], "isController": false}, {"data": ["502/Proxy Error", 95, 6.785714285714286, 0.33462486791123636], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 28390, 1400, "503/Service Unavailable", 1144, "504/Gateway Time-out", 100, "502/Proxy Error", 95, "502/Bad Gateway", 61, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79", 33, 4, "503/Service Unavailable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77", 28, 1, "503/Service Unavailable", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 1247, 30, "503/Service Unavailable", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -77", 11, 1, "503/Service Unavailable", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 1140, 166, "503/Service Unavailable", 166, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 1250, 31, "503/Service Unavailable", 31, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80", 31, 2, "503/Service Unavailable", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77", 34, 1, "503/Service Unavailable", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 2317, 145, "503/Service Unavailable", 113, "502/Bad Gateway", 20, "502/Proxy Error", 12, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -79", 22, 1, "503/Service Unavailable", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79", 31, 2, "503/Service Unavailable", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 400, 23, "503/Service Unavailable", 23, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 110, 110, "504/Gateway Time-out", 100, "502/Proxy Error", 10, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 2323, 172, "503/Service Unavailable", 142, "502/Proxy Error", 18, "502/Bad Gateway", 12, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 2318, 144, "503/Service Unavailable", 123, "502/Proxy Error", 14, "502/Bad Gateway", 7, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -78", 21, 1, "503/Service Unavailable", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 1236, 30, "503/Service Unavailable", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78", 33, 1, "502/Proxy Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 1241, 27, "503/Service Unavailable", 27, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 2319, 157, "503/Service Unavailable", 125, "502/Bad Gateway", 17, "502/Proxy Error", 15, "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 1165, 292, "503/Service Unavailable", 273, "502/Proxy Error", 18, "502/Bad Gateway", 1, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78", 33, 2, "503/Service Unavailable", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -80", 21, 1, "503/Service Unavailable", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 347, 52, "503/Service Unavailable", 42, "502/Proxy Error", 7, "502/Bad Gateway", 3, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80", 29, 4, "503/Service Unavailable", 3, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
