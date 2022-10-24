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

    var data = {"OkPercent": 93.07174476779213, "KoPercent": 6.928255232207873};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.31200722948372056, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.15, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -77"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -79"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77"], "isController": false}, {"data": [0.46772823779193207, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -78"], "isController": false}, {"data": [0.25, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -79"], "isController": false}, {"data": [0.375, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -77"], "isController": false}, {"data": [0.034031413612565446, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.25, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -78"], "isController": false}, {"data": [0.1308016877637131, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -77"], "isController": false}, {"data": [0.25, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -78"], "isController": false}, {"data": [0.1, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -80"], "isController": false}, {"data": [0.033622559652928416, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.27565392354124746, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -79"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -80"], "isController": false}, {"data": [0.47768805779855505, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -77"], "isController": false}, {"data": [0.25, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -78"], "isController": false}, {"data": [0.0017277125086385626, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -77"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77"], "isController": false}, {"data": [0.4955235500194628, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -79"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_CityLevel1234_Summaries_24hourly_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.4941747572815534, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80"], "isController": false}, {"data": [0.4813302217036173, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -77"], "isController": false}, {"data": [0.75, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -78"], "isController": false}, {"data": [0.47113752122241087, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -79"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78"], "isController": false}, {"data": [5.91715976331361E-4, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.47367303609341826, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -80"], "isController": false}, {"data": [0.48464230171073097, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77"], "isController": false}, {"data": [0.01814300960512273, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -80"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -77"], "isController": false}, {"data": [0.125, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -77"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP "], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -79"], "isController": false}, {"data": [0.0021691973969631237, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.2856182795698925, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST"], "isController": false}, {"data": [0.14069081718618365, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -79"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -78"], "isController": false}, {"data": [0.2872053872053872, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -80"], "isController": false}, {"data": [0.125, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -80"], "isController": false}, {"data": [0.1351010101010101, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -80"], "isController": false}, {"data": [0.14135021097046413, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -78"], "isController": false}, {"data": [0.125, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -78"], "isController": false}, {"data": [0.2651821862348178, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -77"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -77"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 38177, 2645, 6.928255232207873, 3308.9863268459976, 32, 60222, 846.0, 10239.0, 17262.0, 51258.160000000455, 14.503043675142763, 891.9040618034962, 5.359238895662003], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_1Point_maxt_SOAP 34 -77", 10, 0, 0.0, 1701.7, 1007, 2230, 1673.5, 2226.6, 2230.0, 2230.0, 0.07930025455381712, 0.20845744649215325, 0.025013654512580988], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79", 6, 1, 16.666666666666668, 637.5, 43, 942, 784.5, 942.0, 942.0, 942.0, 0.04421159670181488, 0.32359952859385016, 0.01679522570020116], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -79", 1, 0, 0.0, 1127.0, 1127, 1127, 1127.0, 1127.0, 1127.0, 1127.0, 0.8873114463176576, 0.42892496672582076, 0.27988437222715173], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77", 3, 1, 33.333333333333336, 570.6666666666666, 48, 839, 825.0, 839.0, 839.0, 839.0, 0.025682952512220806, 0.18615124369697542, 0.00975651223364638], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 2355, 146, 6.199575371549894, 919.8462845010621, 38, 4974, 946.0, 1309.0, 1482.0, 1790.480000000001, 13.026955564529066, 109.29220402570266, 4.605232338241721], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -79", 2, 0, 0.0, 1614.5, 1300, 1929, 1614.5, 1929.0, 1929.0, 1929.0, 0.2257081593499605, 2.082069602753639, 0.07979136102020087], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -77", 4, 1, 25.0, 804.25, 60, 1478, 839.5, 1478.0, 1478.0, 1478.0, 0.04450724911820013, 0.11985228461273129, 0.015734007989051217], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 955, 26, 2.722513089005236, 9358.351832460738, 39, 38534, 9534.0, 10815.0, 11115.999999999998, 33631.3599999999, 5.190217391304348, 2558.5111614724865, 1.8855086616847827], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -78", 6, 0, 0.0, 1563.5, 1349, 1815, 1569.0, 1815.0, 1815.0, 1815.0, 0.05123169534218503, 0.14175436536737396, 0.016460183366776248], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 1185, 0, 0.0, 1850.2236286919822, 221, 3724, 1829.0, 2569.600000000001, 2735.8, 3138.1400000000003, 6.518115961958405, 19.97199526370867, 2.0941993666839016], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -78", 4, 0, 0.0, 1465.5, 569, 2197, 1548.0, 2197.0, 2197.0, 2197.0, 0.17428434490871858, 0.4294134787155244, 0.054974456450699316], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -80", 10, 0, 0.0, 1778.6000000000001, 1410, 2340, 1760.5, 2303.8, 2340.0, 2340.0, 0.07911767963669161, 0.24716548550564107, 0.024956064963526748], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 922, 31, 3.3622559652928414, 9996.289587852516, 42, 37755, 10067.5, 11811.0, 12724.749999999996, 37091.19, 4.760110071091883, 2329.7860733544835, 1.729258736763848], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 1491, 0, 0.0, 1475.592890677397, 269, 2666, 1458.0, 2034.8, 2219.3999999999996, 2472.24, 8.220310949388024, 24.399293997753336, 2.592930113918293], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -80", 3, 0, 0.0, 1646.3333333333333, 1353, 1957, 1629.0, 1957.0, 1957.0, 1957.0, 0.06680919294494922, 0.1543440241960627, 0.021465062967664348], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 2353, 127, 5.397365065873353, 936.8457288567789, 37, 6022, 956.0, 1327.6, 1481.5999999999995, 1797.6800000000003, 13.054308809577968, 110.89345128663722, 4.614902137760961], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -78", 4, 1, 25.0, 1069.0, 51, 1867, 1179.0, 1867.0, 1867.0, 1867.0, 0.04451170657883023, 0.21734231727944447, 0.01573558377103178], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 1447, 64, 4.42294402211472, 6138.995162404972, 40, 7380, 6437.0, 7226.0, 7275.6, 7335.04, 7.924077806010691, 542.4577296380771, 2.816762032605362], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80", 6, 2, 33.333333333333336, 749.8333333333334, 41, 1279, 897.5, 1279.0, 1279.0, 1279.0, 0.044160833756541326, 0.24711091545408378, 0.01677594172977986], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -77", 3, 0, 0.0, 1492.0, 1456, 1536, 1484.0, 1536.0, 1536.0, 1536.0, 0.023393636930754833, 0.21700796602074235, 0.008270016180598876], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77", 9, 1, 11.11111111111111, 752.3333333333334, 45, 1076, 827.0, 1076.0, 1076.0, 1076.0, 0.054611981868822025, 0.46112044065801366, 0.020746153268527114], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 2569, 419, 16.309848189957183, 881.5640326975471, 32, 53442, 647.0, 908.0, 1087.5, 2890.600000000004, 14.24800062116624, 125.19136846700886, 5.412570548470378], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -79", 2, 0, 0.0, 1169.5, 992, 1347, 1169.5, 1347.0, 1347.0, 1347.0, 0.6163328197226503, 2.9904781394453, 0.217883281972265], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79", 7, 3, 42.857142857142854, 728.0, 39, 1496, 815.0, 1496.0, 1496.0, 1496.0, 0.04615283180589438, 0.2943208837443133, 0.01753266755126261], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 314, 0, 0.0, 29175.691082802543, 21065, 31973, 29766.5, 31081.0, 31387.5, 31879.05, 1.5085709893150896, 1071.2945987813725, 0.520044491433815], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 150, 150, 100.0, 60065.326666666675, 60050, 60222, 60062.5, 60073.0, 60084.35, 60160.8, 0.7894612190333836, 0.2968189153592312, 0.3407635339968317], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 2575, 423, 16.42718446601942, 789.498252427184, 34, 56524, 666.0, 897.0, 995.1999999999998, 1598.999999999989, 14.313825765998132, 125.61345665516465, 5.437576389622338], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 2571, 443, 17.230649552703227, 868.1338000777906, 32, 53506, 651.0, 929.8000000000002, 1138.4, 2997.28, 14.308930419973509, 124.84922572428177, 5.435716731806343], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -77", 1, 0, 0.0, 2051.0, 2051, 2051, 2051.0, 2051.0, 2051.0, 2051.0, 0.4875670404680643, 4.48952111774744, 0.17236256704046804], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -78", 2, 0, 0.0, 868.5, 498, 1239, 868.5, 1239.0, 1239.0, 1239.0, 0.269179004037685, 1.3035729306864066, 0.09515898384925976], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 2356, 141, 5.98471986417657, 932.7678268251282, 36, 6036, 957.0, 1322.3000000000002, 1477.3000000000002, 1786.4299999999998, 13.085254096084421, 109.48745791099694, 4.625841780061094], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78", 7, 2, 28.571428571428573, 581.7142857142857, 45, 906, 775.0, 906.0, 906.0, 906.0, 0.04624155265921957, 0.36149437009096375, 0.017566371078551187], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 845, 0, 0.0, 10460.313609467452, 1475, 18951, 10282.0, 12025.0, 18282.8, 18727.3, 4.646278028878405, 1260.9789850855161, 1.8875504492318518], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 2355, 139, 5.902335456475583, 923.9409766454373, 38, 7201, 944.0, 1303.4, 1496.3999999999996, 1858.3200000000002, 13.07977272853501, 110.78866681778294, 4.623904030986009], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 2572, 454, 17.65163297045101, 856.1458009331269, 33, 53807, 652.0, 952.7000000000003, 1179.0, 2227.35, 14.280558563060437, 124.17229272507704, 5.424938751006358], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 937, 33, 3.52187833511206, 9439.42582710779, 40, 54270, 8852.0, 10185.0, 17231.8, 44085.0, 5.1525132937042555, 433.6902822953154, 1.9321924851390957], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78", 9, 1, 11.11111111111111, 718.4444444444445, 45, 991, 879.0, 991.0, 991.0, 991.0, 0.05458250448789481, 0.4608715461404104, 0.020734955318155352], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -80", 1, 0, 0.0, 1936.0, 1936, 1936, 1936.0, 1936.0, 1936.0, 1936.0, 0.5165289256198348, 4.7693173747417354, 0.18260104597107438], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -77", 3, 0, 0.0, 1723.3333333333333, 1367, 2223, 1580.0, 2223.0, 2223.0, 2223.0, 0.06720129026477309, 0.21984797108104473, 0.02159103954795932], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -77", 4, 0, 0.0, 1803.0, 1486, 2136, 1795.0, 2136.0, 2136.0, 2136.0, 0.02493765586034913, 0.0779058213840399, 0.007866076995012468], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -79", 3, 0, 0.0, 1631.3333333333333, 1354, 1852, 1688.0, 1852.0, 1852.0, 1852.0, 0.03849164089865151, 0.12408291660786, 0.012366943218414403], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 309, 1, 0.32362459546925565, 30625.016181229785, 4182, 60043, 30012.0, 41520.0, 43948.0, 46586.3, 1.5611579851462638, 28.389756834802707, 1.8767436325342293], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -79", 4, 0, 0.0, 2007.25, 1723, 2185, 2060.5, 2185.0, 2185.0, 2185.0, 0.17439832577607256, 0.544824457185211, 0.05501040940006976], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 1383, 0, 0.0, 6529.942154736079, 513, 8083, 6497.0, 7350.200000000001, 7740.0, 8008.4400000000005, 7.451187448816861, 538.7412268901394, 4.147633638501573], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 1488, 0, 0.0, 1466.129032258063, 228, 2992, 1444.5, 1998.1000000000001, 2140.75, 2449.5399999999986, 8.209836355009214, 24.176223199408536, 2.5896261158866953], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 377, 35, 9.283819628647215, 26009.899204244044, 36, 50977, 27766.0, 32178.4, 33600.4, 50411.07999999999, 1.8662072925638817, 2414.298951936809, 1.0679662826586276], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 1187, 0, 0.0, 1826.6849199663018, 294, 3543, 1800.0, 2539.0, 2753.2, 3176.3599999999997, 6.544091297516333, 19.917379426013728, 2.102544957893431], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -78", 3, 0, 0.0, 1500.0, 1441, 1597, 1462.0, 1597.0, 1597.0, 1597.0, 0.05179558011049724, 0.16696993158667126, 0.016641353375345305], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -80", 1485, 0, 0.0, 1459.0309764309775, 368, 2815, 1443.0, 1989.4, 2141.0, 2471.28, 8.190166285194275, 23.955132254295012, 2.583421591911866], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -80", 4, 0, 0.0, 1616.75, 1497, 1786, 1592.0, 1786.0, 1786.0, 1786.0, 0.03116308421044431, 0.2874977114610033, 0.011016637191582851], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -80", 3, 0, 0.0, 2295.3333333333335, 1825, 2878, 2183.0, 2878.0, 2878.0, 2878.0, 0.038328861632809505, 0.12355817602529706, 0.012314644020697586], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 1188, 0, 0.0, 1840.8947811447822, 215, 3397, 1819.5, 2535.500000000001, 2714.0, 3002.0, 6.542498705818859, 20.094614623145468, 2.1020332756000046], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -79", 3, 0, 0.0, 2640.0, 2313, 2881, 2726.0, 2881.0, 2881.0, 2881.0, 0.05116310798826659, 0.11819810462002865, 0.016438147000136433], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -80", 1, 0, 0.0, 1843.0, 1843, 1843, 1843.0, 1843.0, 1843.0, 1843.0, 0.5425935973955507, 1.6950751153011394, 0.17115012886597938], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 1185, 0, 0.0, 1851.6877637130815, 243, 3607, 1835.0, 2558.4, 2824.4, 3201.520000000002, 6.511454114854358, 19.861239015355494, 2.092058988073324], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -78", 4, 0, 0.0, 1820.25, 1301, 2371, 1804.5, 2371.0, 2371.0, 2371.0, 0.0250681540438066, 0.06176460219973052, 0.007907239996239776], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -77", 1482, 0, 0.0, 1474.3434547908225, 284, 2951, 1471.0, 2001.0, 2150.85, 2489.6800000000003, 8.194998949359109, 24.287203660515807, 2.584945957659172], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80", 3, 0, 0.0, 673.6666666666666, 450, 881, 690.0, 881.0, 881.0, 881.0, 0.025712669489346383, 0.18761376517047498, 0.009767801202495843], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -77", 6, 0, 0.0, 1765.8333333333333, 1382, 2242, 1697.5, 2242.0, 2242.0, 2242.0, 0.05115394780592192, 0.1415392436036251, 0.016435203933738585], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503/Service Unavailable", 1532, 57.92060491493384, 4.012887340545355], "isController": false}, {"data": ["504/Gateway Time-out", 151, 5.708884688090738, 0.39552610210336064], "isController": false}, {"data": ["502/Bad Gateway", 464, 17.542533081285445, 1.215391466065956], "isController": false}, {"data": ["502/Proxy Error", 498, 18.82797731568998, 1.3044503234932028], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 38177, 2645, "503/Service Unavailable", 1532, "502/Proxy Error", 498, "502/Bad Gateway", 464, "504/Gateway Time-out", 151, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79", 6, 1, "502/Proxy Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77", 3, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 2355, 146, "503/Service Unavailable", 146, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -77", 4, 1, "503/Service Unavailable", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 955, 26, "502/Proxy Error", 16, "502/Bad Gateway", 9, "503/Service Unavailable", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 922, 31, "502/Proxy Error", 17, "502/Bad Gateway", 14, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 2353, 127, "503/Service Unavailable", 127, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -78", 4, 1, "503/Service Unavailable", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 1447, 64, "503/Service Unavailable", 64, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80", 6, 2, "502/Bad Gateway", 1, "502/Proxy Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77", 9, 1, "503/Service Unavailable", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 2569, 419, "503/Service Unavailable", 221, "502/Bad Gateway", 105, "502/Proxy Error", 93, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79", 7, 3, "502/Proxy Error", 2, "503/Service Unavailable", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 150, 150, "504/Gateway Time-out", 150, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 2575, 423, "503/Service Unavailable", 215, "502/Proxy Error", 105, "502/Bad Gateway", 103, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 2571, 443, "503/Service Unavailable", 228, "502/Bad Gateway", 109, "502/Proxy Error", 106, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 2356, 141, "503/Service Unavailable", 141, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78", 7, 2, "503/Service Unavailable", 1, "502/Proxy Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 2355, 139, "503/Service Unavailable", 139, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 2572, 454, "503/Service Unavailable", 223, "502/Proxy Error", 125, "502/Bad Gateway", 106, "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 937, 33, "503/Service Unavailable", 19, "502/Proxy Error", 14, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78", 9, 1, "503/Service Unavailable", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 309, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 377, 35, "502/Proxy Error", 17, "502/Bad Gateway", 16, "503/Service Unavailable", 2, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
