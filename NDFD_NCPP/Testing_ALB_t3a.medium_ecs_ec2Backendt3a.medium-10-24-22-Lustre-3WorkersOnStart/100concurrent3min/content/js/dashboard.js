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

    var data = {"OkPercent": 99.60944111022874, "KoPercent": 0.3905588897712627};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.37917409813443037, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.27234927234927236, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -80"], "isController": false}, {"data": [0.3764705882352941, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -79"], "isController": false}, {"data": [0.5650172612197929, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -78"], "isController": false}, {"data": [0.3418803418803419, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -77"], "isController": false}, {"data": [0.39191176470588235, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -80"], "isController": false}, {"data": [0.5684931506849316, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79"], "isController": false}, {"data": [0.31958762886597936, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -78"], "isController": false}, {"data": [0.3302047781569966, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -79"], "isController": false}, {"data": [0.5451428571428572, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77"], "isController": false}, {"data": [0.4252199413489736, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -78"], "isController": false}, {"data": [0.3286764705882353, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -79"], "isController": false}, {"data": [0.5354285714285715, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -80"], "isController": false}, {"data": [0.3216723549488055, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -80"], "isController": false}, {"data": [0.3448529411764706, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.23229166666666667, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -79"], "isController": false}, {"data": [0.2813807531380753, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -78"], "isController": false}, {"data": [0.2806652806652807, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -77"], "isController": false}, {"data": [0.3586206896551724, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -78"], "isController": false}, {"data": [0.313893653516295, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -77"], "isController": false}, {"data": [0.327319587628866, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.35409556313993173, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -79"], "isController": false}, {"data": [0.24581589958158995, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -80"], "isController": false}, {"data": [0.36617647058823527, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -77"], "isController": false}, {"data": [0.4007352941176471, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -78"], "isController": false}, {"data": [0.27205882352941174, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -77"], "isController": false}, {"data": [0.7829974160206719, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}, {"data": [0.25833333333333336, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -79"], "isController": false}, {"data": [0.5097701149425288, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80"], "isController": false}, {"data": [0.24375, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -78"], "isController": false}, {"data": [0.3609215017064846, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -80"], "isController": false}, {"data": [0.3604992657856094, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -77"], "isController": false}, {"data": [0.5423825887743413, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77"], "isController": false}, {"data": [0.3654970760233918, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -78"], "isController": false}, {"data": [0.5526315789473685, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78"], "isController": false}, {"data": [0.3782991202346041, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -79"], "isController": false}, {"data": [0.5217889908256881, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_CityLevel1234_Summaries_24hourly_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.5354691075514875, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80"], "isController": false}, {"data": [0.5296803652968036, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79"], "isController": false}, {"data": [0.4065693430656934, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -77"], "isController": false}, {"data": [0.3941176470588235, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -78"], "isController": false}, {"data": [0.3519061583577713, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -79"], "isController": false}, {"data": [0.5389908256880734, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -77"], "isController": false}, {"data": [0.5730593607305936, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.31841652323580033, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -77"], "isController": false}, {"data": [0.5420991926182238, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -79"], "isController": false}, {"data": [0.4299410029498525, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -80"], "isController": false}, {"data": [0.5894077448747153, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -78"], "isController": false}, {"data": [0.36254295532646047, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -79"], "isController": false}, {"data": [0.5499425947187141, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -77"], "isController": false}, {"data": [0.3316151202749141, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -78"], "isController": false}, {"data": [0.5953196347031964, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77"], "isController": false}, {"data": [0.0082010582010582, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.534443168771527, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78"], "isController": false}, {"data": [0.5285388127853882, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -79"], "isController": false}, {"data": [0.36597938144329895, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -80"], "isController": false}, {"data": [0.22661122661122662, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -77"], "isController": false}, {"data": [0.3492201039861352, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -77"], "isController": false}, {"data": [0.28526970954356845, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP "], "isController": false}, {"data": [0.5495444191343963, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -80"], "isController": false}, {"data": [0.2526205450733753, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -78"], "isController": false}, {"data": [0.38669590643274854, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -80"], "isController": false}, {"data": [0.33592400690846286, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -79"], "isController": false}, {"data": [0.05158998646820027, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.32597623089983024, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -78"], "isController": false}, {"data": [0.2907949790794979, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST"], "isController": false}, {"data": [0.2657563025210084, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -79"], "isController": false}, {"data": [0.26811594202898553, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -78"], "isController": false}, {"data": [0.33391003460207613, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -80"], "isController": false}, {"data": [0.2815126050420168, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -77"], "isController": false}, {"data": [0.4199706314243759, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -77"], "isController": false}, {"data": [0.4358600583090379, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -80"], "isController": false}, {"data": [0.44052863436123346, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -78"], "isController": false}, {"data": [0.39824304538799415, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -79"], "isController": false}, {"data": [0.26141078838174275, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -80"], "isController": false}, {"data": [0.28870292887029286, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -79"], "isController": false}, {"data": [0.27882599580712786, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -80"], "isController": false}, {"data": [0.3548109965635739, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -80"], "isController": false}, {"data": [0.34165232358003444, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -79"], "isController": false}, {"data": [0.23221757322175732, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -78"], "isController": false}, {"data": [0.3433734939759036, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -78"], "isController": false}, {"data": [0.3628620102214651, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -77"], "isController": false}, {"data": [0.5712643678160919, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80"], "isController": false}, {"data": [0.28778467908902694, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -77"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 76813, 300, 0.3905588897712627, 3268.2223191386897, 122, 60188, 6647.5, 14424.700000000004, 23886.650000000063, 60062.0, 29.521694965673387, 2083.9457057196914, 11.59733824078074], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -80", 481, 0, 0.0, 1797.7505197505202, 152, 5693, 1698.0, 3379.6000000000004, 4166.0999999999985, 4876.880000000001, 2.671227931825376, 7.576243538863312, 0.858236317939989], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -79", 680, 0, 0.0, 1286.1235294117653, 133, 4395, 1577.5, 2091.7, 2230.85, 2808.4299999999885, 3.780318992211431, 29.529616089148817, 1.3364018312309942], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -78", 869, 0, 0.0, 971.140391254315, 131, 2823, 1055.0, 1634.0, 1785.5, 2309.7999999999865, 4.85469436095686, 45.052170986567184, 1.8442149476681824], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -77", 585, 0, 0.0, 1466.687179487179, 144, 4234, 1333.0, 2639.2, 3037.7999999999975, 3790.1399999999994, 3.2613785875164463, 8.976875963430746, 1.028735628679504], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -80", 680, 0, 0.0, 1297.9779411764698, 139, 5987, 1604.5, 2086.8, 2373.7999999999984, 4263.539999999996, 3.792166944573019, 28.644116024275444, 1.340590267515071], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79", 876, 0, 0.0, 951.6826484018268, 124, 2374, 1050.5, 1570.5000000000005, 1695.35, 1994.9800000000005, 4.873299769130205, 44.14317295589831, 1.851282822452783], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -78", 582, 0, 0.0, 1578.4982817869425, 164, 4008, 1433.0, 2973.1000000000004, 3352.85, 3625.399999999999, 3.240354100551194, 8.638040841963141, 1.0221038813262067], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -79", 586, 0, 0.0, 1471.4692832764501, 173, 4749, 1398.0, 2617.2000000000016, 2992.5499999999997, 4028.6399999999994, 3.2493456948942026, 8.511110624001908, 1.0249400971199485], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77", 875, 0, 0.0, 1012.8697142857143, 139, 2683, 1114.0, 1694.6, 1892.0, 2522.44, 4.851704195753788, 45.418979745521185, 1.8430790353009998], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 682, 0, 0.0, 1237.0777126099708, 136, 4701, 1539.0, 2093.7, 2309.5, 3052.8299999999876, 3.801136996990302, 30.802758105980384, 1.34376132120165], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -79", 680, 0, 0.0, 1398.4485294117626, 134, 4137, 1646.0, 2113.6, 2347.8999999999996, 3217.6999999999925, 3.778932451582428, 30.001463120675762, 1.3359116674539444], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -80", 875, 0, 0.0, 1009.5302857142858, 127, 2534, 1124.0, 1621.0, 1774.3999999999999, 2295.1200000000003, 4.891711484061406, 49.04284711235283, 1.8582771165037961], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -80", 586, 0, 0.0, 1559.477815699657, 152, 4607, 1424.5, 2928.3, 3260.3, 4436.24, 3.2608272262379736, 9.084858629089249, 1.0285617129637359], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -77", 680, 0, 0.0, 1379.267647058824, 136, 7328, 1619.0, 2139.8, 2428.199999999999, 2915.029999999998, 3.7612491772267425, 30.08070264836192, 1.3296603536680476], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 1701, 0, 0.0, 10413.944150499708, 2693, 14546, 10446.0, 11953.2, 12305.699999999999, 13135.96, 8.976063829787234, 4731.647897273936, 3.2608356881648937], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -79", 480, 0, 0.0, 1995.3604166666685, 171, 6841, 1845.5, 3910.2000000000007, 4430.8, 5664.71, 2.673290486427481, 8.053037404485558, 0.8588989941744545], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -78", 478, 0, 0.0, 1751.8619246861908, 143, 5596, 1648.0, 3305.6000000000004, 3885.3999999999996, 4773.399999999985, 2.6381292462566712, 7.4910771694197775, 0.8476020722836376], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 481, 0, 0.0, 1833.5114345114337, 176, 7242, 1769.0, 3289.4, 3993.999999999998, 5458.980000000002, 2.663182198204982, 7.447219741253302, 0.8556513117279679], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -78", 580, 0, 0.0, 1507.8741379310343, 157, 4960, 1370.0, 2771.8999999999996, 3363.85, 4771.38, 3.214186755333887, 8.270534600997507, 1.0138499238016072], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -77", 583, 0, 0.0, 1563.8713550600337, 177, 4795, 1483.0, 2871.8, 3160.7999999999984, 4229.71999999999, 3.2437545206698934, 9.046344038627385, 1.023176474781617], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -80", 582, 0, 0.0, 1539.7920962199305, 152, 4840, 1429.0, 2787.2000000000003, 3083.8000000000006, 3985.549999999987, 3.2321302626244677, 8.836088181760122, 1.0195098386989287], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 1691, 0, 0.0, 10734.527498521578, 5191, 21163, 10504.0, 12988.0, 13608.399999999996, 14729.8, 9.032058198288663, 4761.164803682259, 3.281177392347053], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 586, 0, 0.0, 1472.046075085326, 149, 4524, 1367.0, 2807.2000000000003, 3092.0, 4046.5499999999993, 3.2426390433661467, 8.040573711244653, 1.0228246201242825], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -80", 478, 0, 0.0, 1822.1150627615057, 153, 4854, 1760.0, 3103.0000000000005, 3739.399999999997, 4689.98, 2.6529762730678508, 8.019915533509089, 0.8523722596087137], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 680, 0, 0.0, 1336.042647058824, 128, 4185, 1574.5, 2071.9, 2331.0, 3155.459999999998, 3.7993284128305556, 30.34600078780192, 1.3431219584420517], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -78", 680, 0, 0.0, 1270.3382352941173, 129, 4253, 1595.5, 2118.6, 2254.85, 3256.989999999993, 3.7827794528320777, 29.41834094351142, 1.3372716425050901], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -77", 476, 0, 0.0, 1875.9579831932774, 178, 7879, 1711.5, 3607.8, 4383.549999999997, 5667.240000000002, 2.633092888436518, 7.078414291028676, 0.845983945601186], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 9675, 0, 0.0, 1854.4227390180902, 277, 17041, 420.0, 6891.0, 7359.199999999999, 16676.559999999998, 52.4296467298532, 3753.839823872966, 18.637100986002505], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -79", 480, 0, 0.0, 1928.581249999999, 175, 5768, 1722.5, 3817.9000000000005, 4111.85, 4649.61, 2.671757849680224, 7.636600577767634, 0.8584065747507751], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80", 870, 0, 0.0, 1077.7287356321845, 131, 3135, 1203.0, 1672.8999999999996, 1802.9499999999994, 2787.079999999998, 4.833199077803394, 49.23224788894753, 1.83604925904836], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -78", 480, 0, 0.0, 1902.4937499999996, 169, 6114, 1801.0, 3263.9000000000005, 3649.999999999999, 4803.7699999999995, 2.6791993659228166, 7.780230997220332, 0.8607974525279363], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -80", 586, 0, 0.0, 1419.0597269624584, 147, 4680, 1303.5, 2599.0000000000014, 2933.7999999999997, 3822.869999999998, 3.252989308434457, 8.696557351283987, 1.026089401000322], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -77", 681, 0, 0.0, 1342.2452276064623, 132, 4369, 1604.0, 2096.8, 2264.8, 3752.4199999999964, 3.780665863529621, 31.11679862506731, 1.3365244556618385], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77", 873, 0, 0.0, 995.4902634593354, 144, 2681, 1055.0, 1659.2000000000003, 1788.8999999999999, 2160.04, 4.863645226886543, 48.583107076450595, 1.8476152277918605], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -78", 684, 0, 0.0, 1301.843567251463, 144, 4531, 1597.5, 2021.5, 2150.25, 2835.649999999998, 3.7841276866476723, 29.13401103185251, 1.337748264225056], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 874, 0, 0.0, 1021.6407322654461, 122, 2842, 1159.5, 1605.0, 1748.25, 2645.0, 4.868185793141095, 46.583178432029214, 1.8493401108709822], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -79", 682, 0, 0.0, 1376.1451612903224, 127, 6209, 1603.0, 2190.4, 2640.9500000000003, 4479.529999999995, 3.800035660158688, 30.07329529466992, 1.343371981423286], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79", 872, 0, 0.0, 1043.6009174311946, 136, 2765, 1156.5, 1681.2000000000003, 1849.0499999999997, 2279.3399999999992, 4.846059797710348, 46.13166954088863, 1.840934825497388], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 900, 0, 0.0, 20943.18555555558, 12757, 29189, 20559.0, 25681.5, 27085.85, 28477.04, 4.628534400296226, 3286.901271754112, 1.595578753227117], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 300, 300, 100.0, 60065.50666666665, 60053, 60188, 60064.0, 60070.0, 60075.95, 60124.84, 1.578199800094692, 0.5933661357777894, 0.6812151480877479], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 874, 0, 0.0, 1029.8764302059496, 148, 4119, 1120.5, 1730.5, 1920.5, 2549.25, 4.851108705908473, 46.64666655392279, 1.842852818943746], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 876, 0, 0.0, 1036.4257990867586, 144, 2418, 1191.0, 1638.6000000000001, 1792.8999999999999, 2079.5900000000006, 4.8772340070152, 46.9668874575469, 1.8527773718055787], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -77", 685, 0, 0.0, 1253.7810218978116, 137, 4388, 1567.0, 2060.2, 2183.299999999999, 3588.7, 3.7927655074277298, 28.305734922718944, 1.340801868836756], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -78", 680, 0, 0.0, 1307.1661764705877, 124, 5946, 1569.5, 2184.9, 2479.599999999998, 4328.439999999995, 3.7545206084531926, 29.206193233580873, 1.3272816994727106], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 682, 0, 0.0, 1354.057184750732, 139, 6010, 1619.5, 2078.8, 2231.85, 4342.849999999996, 3.7987445205059793, 29.81827983922176, 1.3429155433819968], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -77", 872, 0, 0.0, 1004.7878440366985, 133, 2909, 1101.0, 1643.2000000000003, 1812.3999999999996, 2315.9099999999994, 4.872923977915372, 47.18694139673257, 1.8511400658291794], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78", 876, 0, 0.0, 972.6415525114147, 128, 2946, 1073.0, 1595.3000000000002, 1788.4499999999998, 2524.4500000000003, 4.887329208486992, 45.01147908658272, 1.8566123653334374], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 1874, 0, 0.0, 9437.8964781217, 1676, 16838, 8983.0, 12024.5, 13835.75, 16184.0, 10.285908744120182, 2791.549426923531, 4.178650427298824], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -77", 581, 0, 0.0, 1523.7108433734927, 164, 4453, 1468.0, 2712.0, 3058.7, 4332.62, 3.2443057129934165, 8.73448759618445, 1.023350337203978], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -79", 867, 0, 0.0, 1011.8985005767017, 144, 2395, 1159.0, 1590.4, 1719.1999999999998, 2022.9999999999936, 4.843521301437972, 46.58827572457291, 1.8399704943939172], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 678, 0, 0.0, 1202.6592920353987, 129, 4342, 1499.5, 2052.2, 2241.25, 3411.040000000001, 3.7731858934047158, 29.806675092103582, 1.3338801693481517], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -78", 878, 0, 0.0, 950.3291571753988, 132, 2295, 1062.0, 1559.5, 1706.1, 2099.63, 4.85842505132334, 43.461130048985424, 1.845632172817167], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -79", 582, 0, 0.0, 1468.3213058419258, 162, 5064, 1307.0, 2820.6000000000004, 3249.4, 3866.689999999998, 3.234663139290597, 7.78632821618332, 1.0203087831942022], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -77", 871, 0, 0.0, 992.5442020665905, 139, 3001, 1081.0, 1633.0, 1784.1999999999998, 2294.959999999991, 4.846994140201114, 46.93017581657382, 1.8412897661506185], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -78", 582, 0, 0.0, 1581.2388316151205, 140, 4911, 1387.0, 3017.1000000000013, 3427.5, 4455.929999999995, 3.2490732883747935, 8.204296037609978, 1.0248541720166586], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 876, 0, 0.0, 929.0513698630137, 128, 3318, 987.5, 1576.3000000000002, 1747.0499999999997, 2473.880000000001, 4.8842227339381, 45.837585088833194, 1.8554322690448444], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 1890, 0, 0.0, 9381.135978836, 202, 29611, 9521.5, 10262.9, 10544.0, 10821.71, 10.361955723198719, 914.1200128804867, 3.88573339619952], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78", 871, 0, 0.0, 1035.071182548795, 144, 3041, 1175.0, 1642.8000000000002, 1781.3999999999999, 2506.119999999998, 4.843409404332934, 45.7588812492354, 1.8399279866069442], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -79", 876, 0, 0.0, 1054.9589041095885, 137, 4163, 1170.5, 1659.3000000000006, 1803.6999999999996, 2946.92, 4.883868737664886, 46.802870945441164, 1.8552977919449616], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -80", 679, 0, 0.0, 1300.1178203240058, 148, 4464, 1612.0, 2054.0, 2165.0, 2914.000000000002, 3.7722431791287727, 30.35837720799838, 1.333546905121695], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -77", 481, 0, 0.0, 1912.910602910603, 169, 5290, 1817.0, 3388.6000000000004, 4179.899999999999, 5114.1, 2.649597602692564, 7.654474363352925, 0.8512867297713413], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -77", 577, 0, 0.0, 1532.5667244367435, 138, 4770, 1325.0, 2987.0, 3479.8000000000006, 4123.3, 3.2033665883868245, 8.116236674036632, 1.0104369219227973], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -79", 482, 0, 0.0, 1780.5145228215767, 159, 5505, 1660.0, 3187.0, 3655.5499999999993, 5012.780000000005, 2.6724180948209426, 7.308292033061472, 0.8586187042930568], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 2766, 0, 0.0, 6414.621113521337, 1962, 14378, 6068.0, 8550.3, 9438.25, 11808.66, 14.858346136077955, 274.53116102987786, 17.861937591320277], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -80", 878, 0, 0.0, 1023.7243735763094, 124, 2963, 1137.5, 1688.3000000000002, 1876.1499999999999, 2664.130000000002, 4.8966571113069275, 45.45601992892039, 1.8601558752914011], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -78", 477, 0, 0.0, 1884.2851153039828, 172, 5354, 1731.0, 3534.2, 4132.999999999999, 4659.699999999999, 2.6578702491265807, 7.422842491586197, 0.8539446405885204], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -80", 684, 0, 0.0, 1287.4444444444455, 123, 4830, 1598.0, 2099.0, 2232.0, 2981.4499999999975, 3.7897466299511877, 30.354776677129102, 1.339734648478838], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -79", 579, 0, 0.0, 1538.7512953367886, 163, 4424, 1306.0, 3086.0, 3433.0, 4206.600000000003, 3.2358661390919456, 8.337997509179466, 1.020688245045604], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 2956, 0, 0.0, 6101.494248985114, 312, 9141, 6344.0, 7478.6, 7784.050000000001, 8918.0, 15.94321712115982, 1152.3508342496684, 8.874642342833104], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 589, 0, 0.0, 1539.2512733446501, 155, 4720, 1447.0, 2817.0, 3201.0, 3949.3000000000034, 3.260123541523679, 9.13235772072254, 1.0283397499142073], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -80", 478, 0, 0.0, 1763.592050209205, 186, 4920, 1633.0, 3324.000000000001, 4034.899999999999, 4733.609999999999, 2.659234162814115, 6.97171017129251, 0.8543828511385194], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 723, 0, 0.0, 26114.30705394191, 7685, 54933, 27857.0, 31966.8, 32619.2, 34426.24, 3.6979259903332227, 5273.379689937473, 2.1161959280617855], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 476, 0, 0.0, 1783.474789915966, 150, 6004, 1704.5, 3159.5, 3656.799999999999, 4564.120000000001, 2.6365348399246704, 7.072489129832724, 0.847089806967985], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -78", 483, 0, 0.0, 1802.747412008283, 153, 5906, 1784.0, 3141.6000000000013, 3470.2, 4934.919999999981, 2.6838701073548044, 7.5707252995738035, 0.8622981106637995], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -80", 578, 0, 0.0, 1564.4100346020755, 149, 4831, 1397.5, 2903.6000000000004, 3342.3499999999995, 4213.710000000002, 3.2032453641613374, 8.514324807278793, 1.0103986842032342], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -77", 476, 0, 0.0, 1755.83193277311, 152, 5352, 1574.5, 3268.3, 3889.7, 4711.820000000001, 2.6464586935612107, 7.434282446917932, 0.8502782325992561], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -77", 681, 0, 0.0, 1263.87958883994, 141, 6110, 1555.0, 2118.8, 2314.0, 4394.939999999993, 3.788300215838544, 29.237959865087003, 1.3392233184897977], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -80", 686, 0, 0.0, 1200.6107871720133, 131, 4561, 1498.0, 2067.5000000000005, 2218.7499999999995, 2847.8399999999992, 3.7948144911021005, 30.41518446131336, 1.341526216581016], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -78", 681, 0, 0.0, 1196.6049926578548, 137, 4599, 1536.0, 2075.000000000001, 2229.2999999999997, 3108.8599999999988, 3.7760958163519924, 30.29033220182151, 1.3349088725775597], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -79", 683, 0, 0.0, 1239.1434846266475, 149, 4278, 1560.0, 2042.4, 2221.0, 2680.7999999999993, 3.779201664398039, 28.719273020691546, 1.336006838390713], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -80", 482, 0, 0.0, 1833.9024896265566, 171, 5285, 1703.0, 3330.0999999999995, 4016.3999999999996, 4777.350000000001, 2.668778065080534, 7.222475803817128, 0.8574492025502888], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -79", 478, 0, 0.0, 1736.9623430962351, 202, 5554, 1599.5, 3110.100000000001, 4042.3999999999996, 4891.5999999999985, 2.639979675470281, 6.951499175696722, 0.8481965949509007], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 477, 0, 0.0, 1801.4926624737946, 161, 5731, 1620.0, 3599.4, 4128.0, 4801.759999999998, 2.6360581811751183, 6.619898034078098, 0.8469366617252089], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -80", 582, 0, 0.0, 1447.8470790377999, 137, 4455, 1266.0, 2782.6000000000004, 3130.850000000001, 3832.479999999998, 3.2461556481435, 8.241113596623329, 1.0239338616702642], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -79", 581, 0, 0.0, 1466.841652323579, 157, 4385, 1434.0, 2598.000000000001, 2970.6, 3833.5399999999972, 3.2350206295205375, 8.533053125539402, 1.0204215462257165], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 478, 0, 0.0, 1964.9937238493724, 167, 5925, 1835.5, 3457.3, 4270.149999999999, 5217.19, 2.647642047657557, 7.260060468571713, 0.8506584313274768], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -78", 581, 0, 0.0, 1466.6970740103284, 151, 5033, 1352.0, 2688.2000000000003, 3188.5, 4313.27999999999, 3.244215134459037, 8.704754043752233, 1.0233217660451845], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -77", 587, 0, 0.0, 1455.4310051107325, 169, 4578, 1345.0, 2806.8, 3138.2000000000003, 3503.2000000000003, 3.2519334323132494, 8.447540457001905, 1.0257563463253705], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80", 870, 0, 0.0, 957.5172413793101, 141, 2447, 1042.0, 1569.6999999999998, 1717.0499999999993, 2030.9999999999964, 4.858245335805268, 46.063241999251716, 1.8455639019807122], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -77", 483, 0, 0.0, 1734.7453416149058, 175, 5883, 1607.0, 3329.6000000000004, 3832.2, 4637.199999999978, 2.687723281359554, 7.612091285558079, 0.8635360933274349], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 300, 100.0, 0.3905588897712627], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 76813, 300, "504/Gateway Time-out", 300, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 300, 300, "504/Gateway Time-out", 300, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
