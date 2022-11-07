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

    var data = {"OkPercent": 61.37833057899162, "KoPercent": 38.62166942100838};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.27130265866457914, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -77"], "isController": false}, {"data": [0.17391304347826086, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -79"], "isController": false}, {"data": [0.13636363636363635, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77"], "isController": false}, {"data": [0.18102864877058425, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -78"], "isController": false}, {"data": [0.2222222222222222, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -80"], "isController": false}, {"data": [0.1875, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -77"], "isController": false}, {"data": [0.31446377564269024, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.125, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -78"], "isController": false}, {"data": [0.3944085027726433, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -77"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -80"], "isController": false}, {"data": [0.3506090279436351, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.520116134384073, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -79"], "isController": false}, {"data": [1.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -80"], "isController": false}, {"data": [0.17831298055178652, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -77"], "isController": false}, {"data": [0.125, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -78"], "isController": false}, {"data": [0.0012124151309408342, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}, {"data": [0.13636363636363635, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80"], "isController": false}, {"data": [0.13157894736842105, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -77"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77"], "isController": false}, {"data": [0.24025974025974026, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -79"], "isController": false}, {"data": [0.14285714285714285, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_CityLevel1234_Summaries_24hourly_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.23769898697539799, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80"], "isController": false}, {"data": [0.2420328343795268, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79"], "isController": false}, {"data": [0.1111111111111111, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -78"], "isController": false}, {"data": [0.17696122633002706, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -79"], "isController": false}, {"data": [0.15625, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78"], "isController": false}, {"data": [0.07188644688644688, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.18549480343425215, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -80"], "isController": false}, {"data": [0.23270062469966363, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77"], "isController": false}, {"data": [0.0858974358974359, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -79"], "isController": false}, {"data": [0.2, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -80"], "isController": false}, {"data": [1.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -77"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -77"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -79"], "isController": false}, {"data": [0.19261006289308177, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP "], "isController": false}, {"data": [0.0017568517217146872, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.5217751970136872, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST"], "isController": false}, {"data": [0.39972273567467653, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -79"], "isController": false}, {"data": [0.25, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -78"], "isController": false}, {"data": [0.520746887966805, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -80"], "isController": false}, {"data": [0.13157894736842105, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -80"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -80"], "isController": false}, {"data": [0.3978743068391867, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -80"], "isController": false}, {"data": [0.25, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -79"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -80"], "isController": false}, {"data": [0.37933425797503467, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -78"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -78"], "isController": false}, {"data": [0.5176421751764217, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -77"], "isController": false}, {"data": [0.18181818181818182, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80"], "isController": false}, {"data": [0.375, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -77"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 68982, 26642, 38.62166942100838, 1820.1315125684885, 17, 60098, 314.0, 10007.0, 11643.700000000004, 29638.860000000022, 26.263269267231106, 668.3078720117022, 9.888811558463587], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_1Point_maxt_SOAP 34 -77", 1, 0, 0.0, 610.0, 610, 610, 610.0, 610.0, 610.0, 610.0, 1.639344262295082, 0.7924564549180328, 0.5202996926229508], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79", 23, 16, 69.56521739130434, 324.4347826086957, 23, 1405, 30.0, 1274.2, 1380.1999999999996, 1405.0, 0.14879604590681486, 0.40206268518638316, 0.056815677685121684], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -79", 1, 0, 0.0, 1162.0, 1162, 1162, 1162.0, 1162.0, 1162.0, 1162.0, 0.8605851979345955, 2.5573835520654047, 0.2731349505163511], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77", 11, 8, 72.72727272727273, 252.7272727272727, 27, 978, 40.0, 973.0, 978.0, 978.0, 0.0712398321330501, 0.1678474702573701, 0.027201928089865813], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 4433, 2589, 58.4028874351455, 493.95962102413864, 21, 3837, 52.0, 1363.1999999999998, 1554.0, 1945.0, 24.566770298203902, 64.22791928689587, 8.732719129439669], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -79", 9, 5, 55.55555555555556, 522.3333333333335, 46, 1545, 57.0, 1545.0, 1545.0, 1545.0, 0.06914407320052549, 0.11813613027511657, 0.024578557270499294], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -80", 1, 0, 0.0, 1610.0, 1610, 1610, 1610.0, 1610.0, 1610.0, 1610.0, 0.6211180124223603, 6.429541925465838, 0.23716517857142855], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -77", 8, 5, 62.5, 458.5, 27, 1420, 58.0, 1420.0, 1420.0, 1420.0, 0.07295010213014298, 0.13478671213889698, 0.025931481616574263], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 3851, 1761, 45.728382238379645, 2342.555180472607, 17, 30670, 85.0, 10131.6, 10605.8, 11278.28, 18.842997851966746, 1832.27770214418, 6.882110543589418], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -78", 4, 0, 0.0, 1553.75, 1181, 1766, 1634.0, 1766.0, 1766.0, 1766.0, 0.036850396602393434, 0.1189360945028421, 0.01191160280800022], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 2164, 224, 10.351201478743068, 1015.1848428835478, 32, 2968, 1037.5, 1821.5, 2046.75, 2379.0999999999995, 11.993969760120606, 31.82463383128076, 3.8769570220702345], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -80", 1, 0, 0.0, 1059.0, 1059, 1059, 1059.0, 1059.0, 1059.0, 1059.0, 0.9442870632672333, 2.8061186850802646, 0.29970048394711996], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 4187, 1921, 45.88010508717459, 2152.2947217578244, 32, 46096, 89.0, 9977.800000000001, 10847.199999999999, 12420.879999999986, 22.58116708014238, 1830.1119849952138, 8.247418445286378], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 2411, 0, 0.0, 905.642472003318, 138, 3375, 875.0, 1297.4000000000005, 1443.4, 2028.840000000002, 13.281697589352607, 37.28947053794732, 4.215382535683201], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -80", 1, 0, 0.0, 93.0, 93, 93, 93.0, 93.0, 93.0, 93.0, 10.752688172043012, 4.777805779569893, 3.475722446236559], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 4422, 2605, 58.909995477159654, 500.9228855721403, 20, 5377, 52.0, 1356.4000000000005, 1588.8499999999995, 2193.079999999998, 24.51600026611669, 64.02713905151575, 8.714671969596168], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -78", 8, 5, 62.5, 476.5, 41, 1558, 53.0, 1558.0, 1558.0, 1558.0, 0.07387570412780496, 0.13642476221257732, 0.02626050420168067], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 2062, 777, 37.68186226964112, 4285.515033947625, 21, 20437, 6022.0, 7371.7, 7474.549999999999, 20381.0, 11.350063025325722, 273.2387827305103, 4.056760807880092], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80", 22, 15, 68.18181818181819, 362.77272727272725, 25, 1526, 31.0, 1208.6, 1480.5499999999993, 1526.0, 0.14242432089494264, 0.462423851542067, 0.05438272409172127], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -77", 19, 10, 52.63157894736842, 749.2631578947369, 39, 1941, 69.0, 1883.0, 1941.0, 1941.0, 0.1122334455667789, 0.31131282673223465, 0.03989548260381594], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77", 7, 3, 42.857142857142854, 591.5714285714286, 39, 1227, 621.0, 1227.0, 1227.0, 1227.0, 0.048117571849845685, 0.16106095164527726, 0.018373018157509434], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 4158, 2401, 57.744107744107744, 517.5081770081767, 20, 59046, 33.0, 970.0, 1165.0499999999997, 1624.0499999999993, 23.097433618486836, 104.56828581546495, 8.819430219558937], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -79", 5, 3, 60.0, 762.4, 43, 1869, 60.0, 1869.0, 1869.0, 1869.0, 0.040436062497978195, 0.10700550991896612, 0.014373756591078188], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79", 14, 11, 78.57142857142857, 151.78571428571428, 23, 718, 30.5, 696.0, 718.0, 718.0, 0.09064011342962768, 0.11361626941478858, 0.03460965268650822], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 378, 0, 0.0, 23364.108465608468, 3710, 30084, 25073.5, 26271.4, 27712.350000000002, 29523.659999999996, 2.0796426095663563, 895.2170927847955, 0.7209698499961488], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 186, 186, 100.0, 48442.82258064517, 37, 60098, 60055.5, 60066.3, 60070.0, 60091.04, 0.9790968095130309, 0.4084402191650304, 0.42453025724979077], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 4146, 2367, 57.09117221418234, 557.1497829233, 20, 59298, 33.0, 980.0, 1159.0, 1782.359999999997, 23.05549222308107, 104.92586711811909, 8.80341548752412], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 4142, 2383, 57.532592950265574, 514.6419604056032, 20, 59565, 33.0, 916.0, 1094.85, 1434.2699999999968, 22.931487889273356, 105.67346993944636, 8.756066176470588], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -78", 9, 6, 66.66666666666667, 442.0, 42, 1825, 46.0, 1825.0, 1825.0, 1825.0, 0.06914672935970129, 0.11894347879116152, 0.02457950145208132], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 4436, 2643, 59.58070333633904, 480.9429666366112, 20, 4342, 51.0, 1346.0, 1552.2999999999993, 1931.5200000000004, 24.590345683939777, 63.082864832784544, 8.741099442337969], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78", 16, 11, 68.75, 364.62500000000006, 22, 1199, 42.5, 1143.0, 1199.0, 1199.0, 0.10312467773538209, 0.375419397187919, 0.039376708002474996], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 1092, 48, 4.395604395604396, 8032.798534798531, 23, 42690, 8854.5, 9704.0, 9818.35, 17196.56999999999, 6.051806120526264, 809.2741701194151, 2.470366170292947], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 4426, 2592, 58.56303660189788, 495.1339810212374, 21, 3530, 52.0, 1352.0, 1513.6499999999996, 1965.4599999999991, 24.416885495509412, 64.49050275351965, 8.679439765981861], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 4162, 2401, 57.68861124459394, 510.66770783277394, 21, 59582, 33.0, 944.4000000000005, 1102.6999999999998, 2408.979999999994, 23.0878469833803, 105.60273020586017, 8.815769697755563], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 1170, 121, 10.341880341880342, 7748.288034188038, 23, 11656, 9426.5, 10501.7, 11313.5, 11565.58, 6.282014110370156, 466.4522681862966, 2.368024850198125], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78", 6, 4, 66.66666666666667, 422.8333333333333, 26, 1274, 43.5, 1274.0, 1274.0, 1274.0, 0.041248453183005636, 0.15846817853705486, 0.015750141791557815], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -79", 1, 0, 0.0, 1266.0, 1266, 1266, 1266.0, 1266.0, 1266.0, 1266.0, 0.7898894154818326, 8.176589652448657, 0.30160816548183256], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -80", 5, 3, 60.0, 375.4, 43, 937, 55.0, 937.0, 937.0, 937.0, 0.04043246565262043, 0.022056225892142355, 0.014372478024954918], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -77", 1, 0, 0.0, 183.0, 183, 183, 183.0, 183.0, 183.0, 183.0, 5.46448087431694, 2.4280652322404372, 1.7663507513661203], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -77", 1, 0, 0.0, 881.0, 881, 881, 881.0, 881.0, 881.0, 881.0, 1.1350737797956867, 0.548692891600454, 0.36025290862656073], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -79", 3, 0, 0.0, 1395.0, 985, 1717, 1483.0, 1717.0, 1717.0, 1717.0, 0.04907734589713388, 0.15839905096682372, 0.015863868644483706], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 1272, 646, 50.78616352201258, 7460.238207547176, 22, 60042, 54.5, 27300.9, 35476.799999999945, 55490.74, 5.966088975399264, 373.37484939670736, 7.183777057292277], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 1423, 0, 0.0, 6271.164441321162, 647, 7271, 6456.0, 6989.200000000001, 7069.8, 7176.28, 7.757812329633426, 362.84439815963214, 4.333465481006171], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 2411, 0, 0.0, 914.5126503525489, 172, 3003, 910.0, 1303.8000000000002, 1418.2000000000003, 1742.2000000000016, 13.320883565201056, 38.1831167832221, 4.227819490908538], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 520, 170, 32.69230769230769, 18247.367307692308, 37, 30108, 26558.5, 29128.1, 29541.9, 30011.79, 2.6637706698358707, 1419.131328216247, 1.5295870643198164], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 2164, 226, 10.44362292051756, 1001.2814232902023, 31, 2752, 1029.0, 1766.5, 2012.5, 2396.0, 11.941286833682817, 31.28947851713387, 3.859927677684582], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -78", 2, 0, 0.0, 1530.5, 744, 2317, 1530.5, 2317.0, 2317.0, 2317.0, 0.017150746486240813, 0.05535470423537685, 0.0055438448114704195], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -80", 2410, 0, 0.0, 905.320331950206, 184, 2664, 898.0, 1282.0, 1427.8999999999996, 1735.0, 13.265008448874676, 37.721066990356725, 4.210085689340107], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -80", 19, 9, 47.36842105263158, 768.9473684210526, 38, 1883, 698.0, 1850.0, 1883.0, 1883.0, 0.11272619400771285, 0.3095045516908929, 0.040070639276179175], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -80", 3, 0, 0.0, 935.3333333333333, 130, 1743, 933.0, 1743.0, 1743.0, 1743.0, 0.050188205771643665, 0.11542307089084065, 0.016222945420326224], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 2164, 231, 10.674676524953789, 1005.3886321626617, 30, 3053, 1044.5, 1731.0, 1970.25, 2340.9499999999966, 12.01568035180846, 32.14702680970915, 3.883974801219336], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -79", 2, 0, 0.0, 1320.5, 685, 1956, 1320.5, 1956.0, 1956.0, 1956.0, 0.01697432633142372, 0.031495332060258854, 0.005486818374708253], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -80", 1, 0, 0.0, 1085.0, 1085, 1085, 1085.0, 1085.0, 1085.0, 1085.0, 0.9216589861751152, 2.7388752880184333, 0.2925187211981567], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 2163, 229, 10.587147480351364, 1023.5043920480795, 32, 2959, 1046.0, 1809.0000000000007, 2020.7999999999997, 2487.520000000001, 11.962106171296476, 31.940303056959646, 3.8666573659171224], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -78", 1, 0, 0.0, 1374.0, 1374, 1374, 1374.0, 1374.0, 1374.0, 1374.0, 0.727802037845706, 2.1627945323871907, 0.23099185771470157], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -77", 2409, 0, 0.0, 918.3528435035277, 178, 2369, 899.0, 1312.0, 1451.5, 1871.6000000000004, 13.328095780819492, 38.10625801366282, 4.230108524185874], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80", 11, 7, 63.63636363636363, 452.90909090909093, 24, 1426, 44.0, 1390.8000000000002, 1426.0, 1426.0, 0.07111455908973364, 0.29279197375226274, 0.02715409433992759], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -77", 4, 0, 0.0, 1140.75, 166, 2172, 1112.5, 2172.0, 2172.0, 2172.0, 0.037198229364282256, 0.06865688818212254, 0.012024037030837332], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503/Service Unavailable", 25026, 93.93438931011185, 36.279029311994435], "isController": false}, {"data": ["504/Gateway Time-out", 151, 0.5667742661962315, 0.21889768345365457], "isController": false}, {"data": ["502/Bad Gateway", 714, 2.6799789805570153, 1.0350526224232408], "isController": false}, {"data": ["502/Proxy Error", 751, 2.8188574431349, 1.0886898031370502], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 68982, 26642, "503/Service Unavailable", 25026, "502/Proxy Error", 751, "502/Bad Gateway", 714, "504/Gateway Time-out", 151, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79", 23, 16, "503/Service Unavailable", 15, "502/Proxy Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77", 11, 8, "503/Service Unavailable", 7, "502/Proxy Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 4433, 2589, "503/Service Unavailable", 2589, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -79", 9, 5, "503/Service Unavailable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -77", 8, 5, "503/Service Unavailable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 3851, 1761, "503/Service Unavailable", 1731, "502/Proxy Error", 16, "502/Bad Gateway", 14, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 2164, 224, "503/Service Unavailable", 224, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 4187, 1921, "503/Service Unavailable", 1810, "502/Proxy Error", 63, "502/Bad Gateway", 48, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 4422, 2605, "503/Service Unavailable", 2605, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -78", 8, 5, "503/Service Unavailable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 2062, 777, "503/Service Unavailable", 677, "502/Proxy Error", 54, "502/Bad Gateway", 46, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80", 22, 15, "503/Service Unavailable", 14, "502/Proxy Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -77", 19, 10, "503/Service Unavailable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77", 7, 3, "503/Service Unavailable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 4158, 2401, "503/Service Unavailable", 2098, "502/Bad Gateway", 164, "502/Proxy Error", 139, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -79", 5, 3, "503/Service Unavailable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79", 14, 11, "503/Service Unavailable", 10, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 186, 186, "504/Gateway Time-out", 150, "503/Service Unavailable", 34, "502/Proxy Error", 2, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 4146, 2367, "503/Service Unavailable", 2073, "502/Bad Gateway", 147, "502/Proxy Error", 147, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 4142, 2383, "503/Service Unavailable", 2085, "502/Proxy Error", 158, "502/Bad Gateway", 140, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -78", 9, 6, "503/Service Unavailable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 4436, 2643, "503/Service Unavailable", 2643, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78", 16, 11, "503/Service Unavailable", 10, "502/Proxy Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 1092, 48, "503/Service Unavailable", 42, "502/Proxy Error", 6, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 4426, 2592, "503/Service Unavailable", 2592, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 4162, 2401, "503/Service Unavailable", 2086, "502/Proxy Error", 162, "502/Bad Gateway", 153, "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 1170, 121, "503/Service Unavailable", 121, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78", 6, 4, "503/Service Unavailable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -80", 5, 3, "503/Service Unavailable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 1272, 646, "503/Service Unavailable", 645, "504/Gateway Time-out", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 520, 170, "503/Service Unavailable", 170, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 2164, 226, "503/Service Unavailable", 226, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -80", 19, 9, "503/Service Unavailable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 2164, 231, "503/Service Unavailable", 231, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 2163, 229, "503/Service Unavailable", 229, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80", 11, 7, "503/Service Unavailable", 6, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
