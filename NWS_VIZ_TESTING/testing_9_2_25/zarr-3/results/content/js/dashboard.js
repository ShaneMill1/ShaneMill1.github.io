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

    var data = {"OkPercent": 99.72396725680564, "KoPercent": 0.2760327431943651};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4548670600926455, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.49746514575411915, 500, 1500, "HREF_ResLevel-1_Time-All_5threads_ZARR"], "isController": false}, {"data": [0.07220286488579171, 500, 1500, "NBM_ResLevel-1_Times-One_100threads_ZARR"], "isController": false}, {"data": [0.42766190998902304, 500, 1500, "HREF_ResLevel-1_Times-One_50threads_ZARR"], "isController": false}, {"data": [0.4625561657513729, 500, 1500, "NBM_ResLevel-1_Times-One_25threads_ZARR"], "isController": false}, {"data": [0.4817464953271028, 500, 1500, "HREF_ResLevel-1_Times-One_25threads_ZARR"], "isController": false}, {"data": [0.20859253499222394, 500, 1500, "NBM_ResLevel-1_Times-One_50threads_ZARR"], "isController": false}, {"data": [0.4084249084249084, 500, 1500, "HREF_ResLevel-1_Time-All_50threads_ZARR"], "isController": false}, {"data": [0.5041443619409428, 500, 1500, "LREF_ResLevel-1_Time-All_50threads_ZARR"], "isController": false}, {"data": [0.09979423868312758, 500, 1500, "NBM_ResLevel-1_Time-All_25threads_ZARR"], "isController": false}, {"data": [0.37809647979139505, 500, 1500, "MRMS_ResLevel-1_Times-One_100threads_ZARR"], "isController": false}, {"data": [0.2579983593109106, 500, 1500, "HREF_ResLevel-1_Times-One_100threads_ZARR"], "isController": false}, {"data": [0.8323170731707317, 500, 1500, "MRMS_ResLevel-1_Times-One_25threads_ZARR"], "isController": false}, {"data": [0.23939267886855242, 500, 1500, "HREF_ResLevel-1_Time-All_100threads_ZARR"], "isController": false}, {"data": [0.5830594807755505, 500, 1500, "LREF_ResLevel-1_Times-One_50threads_ZARR"], "isController": false}, {"data": [0.49089805825242716, 500, 1500, "HREF_ResLevel-1_Times-One_5threads_ZARR"], "isController": false}, {"data": [0.6380560928433269, 500, 1500, "LREF_ResLevel-1_Time-All_25threads_ZARR"], "isController": false}, {"data": [0.010268948655256724, 500, 1500, "NBM_ResLevel-1_Time-All_50threads_ZARR"], "isController": false}, {"data": [0.39645776566757496, 500, 1500, "NBM_ResLevel-1_Time-All_5threads_ZARR"], "isController": false}, {"data": [0.39818381948266374, 500, 1500, "LREF_ResLevel-1_Times-One_100threads_ZARR"], "isController": false}, {"data": [0.9819314641744549, 500, 1500, "MRMS_ResLevel-1_Times-One_5threads_ZARR"], "isController": false}, {"data": [0.3632714830898802, 500, 1500, "LREF_ResLevel-1_Time-All_100threads_ZARR"], "isController": false}, {"data": [0.8637218045112782, 500, 1500, "LREF_ResLevel-1_Time-All_5threads_ZARR"], "isController": false}, {"data": [0.48111332007952284, 500, 1500, "HREF_ResLevel-1_Time-All_25threads_ZARR"], "isController": false}, {"data": [0.0015204170286707212, 500, 1500, "NBM_ResLevel-1_Time-All_100threads_ZARR"], "isController": false}, {"data": [0.4912854030501089, 500, 1500, "NBM_ResLevel-1_Times-One_5threads_ZARR"], "isController": false}, {"data": [0.615019185090444, 500, 1500, "MRMS_ResLevel-1_Times-One_50threads_ZARR"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "LREF_ResLevel-1_Times-One_5threads_ZARR"], "isController": false}, {"data": [0.7938606073847498, 500, 1500, "LREF_ResLevel-1_Times-One_25threads_ZARR"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 94554, 261, 0.2760327431943651, 1425.2075745076902, 6, 28491, 1347.0, 4638.0, 6720.800000000003, 12431.980000000003, 27.751379292330142, 2838.8579408901, 7.848461204064679], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["HREF_ResLevel-1_Time-All_5threads_ZARR", 789, 0, 0.0, 686.8010139416984, 587, 1579, 654.0, 753.0, 779.5, 1228.9000000000005, 6.5423428054959, 885.9824352036501, 1.7441988143558405], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_100threads_ZARR", 2583, 16, 0.6194347657762292, 4145.049941927996, 32, 28491, 3484.0, 8146.5999999999985, 10496.199999999993, 16975.879999999997, 20.97595439374376, 193.89902568498712, 6.2886894520305985], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_50threads_ZARR", 4555, 14, 0.30735455543358947, 1161.3066959385308, 6, 8134, 751.0, 1874.2000000000016, 4033.399999999998, 5871.959999999996, 37.4912547841475, 229.5907801632783, 11.0569911570435], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_25threads_ZARR", 2003, 0, 0.0, 1326.2321517723403, 1053, 5528, 1220.0, 1406.0000000000007, 2265.8, 3579.96, 16.525720886102057, 153.68981174714327, 4.954488585970051], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_25threads_ZARR", 3424, 2, 0.05841121495327103, 773.8408294392522, 6, 3621, 653.0, 1154.0, 1297.5, 2655.0, 28.30196477132773, 173.7324875651962, 8.346868516543921], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_50threads_ZARR", 2572, 2, 0.07776049766718507, 2064.9774494556777, 325, 9539, 1716.0, 3433.100000000001, 3929.7499999999977, 5860.75, 21.120746288266982, 196.2742267308419, 6.332098740720667], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_50threads_ZARR", 4095, 22, 0.5372405372405372, 1325.0769230769204, 40, 10661, 888.0, 1930.0, 3052.7999999999993, 7639.48, 33.11124407717063, 4459.9694022945405, 8.82750940729256], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_50threads_ZARR", 5791, 22, 0.3798998445864272, 912.0918666896906, 18, 8679, 634.0, 1400.0, 1813.7999999999993, 6670.639999999999, 47.92882267742603, 15588.865069897061, 12.731093523691289], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_25threads_ZARR", 1458, 0, 0.0, 1825.3079561042516, 1300, 5070, 1637.5, 2638.0, 2812.1499999999996, 3659.5500000000047, 11.983627307546891, 2379.4914201584666, 3.2533675698223004], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_100threads_ZARR", 5369, 1, 0.018625442354255915, 2106.686906314026, 253, 14696, 1209.0, 2551.0, 11947.0, 12998.0, 41.77527407972238, 794.6251928794711, 12.034868997576273], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_100threads_ZARR", 4876, 36, 0.7383100902379, 2174.9060705496345, 6, 16091, 1447.0, 4341.700000000002, 8195.899999999998, 10795.839999999953, 40.097694958183595, 244.5388856309055, 11.825687380245554], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_25threads_ZARR", 4264, 2, 0.04690431519699812, 620.5792682926832, 46, 5241, 426.0, 658.0, 1176.25, 4819.000000000007, 35.42028359485974, 673.5524586112657, 10.204085605941039], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_100threads_ZARR", 4808, 40, 0.831946755407654, 2227.4737936772026, 9, 14405, 1531.0, 3931.300000000001, 5860.050000000002, 11988.099999999999, 39.2300851018693, 5268.527109902169, 10.458801985166328], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_50threads_ZARR", 6086, 25, 0.4107788366743345, 868.804962208344, 49, 8253, 577.0, 1388.0, 1914.6499999999996, 5735.26, 50.31914541786553, 553.3165595958594, 14.791076924587427], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_5threads_ZARR", 824, 1, 0.12135922330097088, 656.7669902912623, 523, 3340, 593.0, 673.5, 703.0, 3277.5, 6.843114946060641, 41.980379181961254, 2.0181842907327283], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_25threads_ZARR", 4136, 2, 0.048355899419729204, 639.7241295938109, 246, 4086, 527.0, 884.3000000000002, 1053.2999999999993, 3306.8200000000015, 34.311407547514165, 11196.903891077769, 9.11396762980845], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_50threads_ZARR", 2045, 0, 0.0, 2602.0508557457206, 1321, 11311, 2212.0, 3703.4, 4326.099999999999, 8815.599999999995, 16.756114547912656, 3327.124624562149, 4.549023285468475], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_5threads_ZARR", 367, 0, 0.0, 1475.6920980926443, 1275, 2642, 1419.0, 1558.4, 1647.9999999999998, 2561.56, 3.037501138028355, 603.132494175364, 0.8246340980194169], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_100threads_ZARR", 7268, 23, 0.31645569620253167, 1455.4797743533309, 43, 12630, 1004.5, 2617.1000000000004, 3405.5499999999993, 9631.029999999993, 59.82533110538576, 658.4595503274013, 17.585375647188588], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_5threads_ZARR", 1605, 0, 0.0, 336.7046728971959, 247, 3054, 296.0, 393.4000000000001, 436.6999999999998, 1316.1000000000035, 13.33776540491129, 253.74821137345745, 3.842422650828936], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_100threads_ZARR", 7599, 25, 0.3289906566653507, 1388.3447822081898, 13, 14851, 1021.0, 2439.0, 3015.0, 10540.0, 62.77519392652683, 20428.083417578127, 16.67466088673369], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_5threads_ZARR", 1064, 1, 0.09398496240601503, 508.35902255639036, 423, 3181, 489.0, 567.0, 600.0, 871.7499999999995, 8.833467551120373, 2881.3270995570815, 2.346389818266349], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_25threads_ZARR", 3018, 0, 0.0, 877.775347912525, 590, 4462, 725.0, 1233.0, 1400.0999999999995, 3765.6699999999996, 24.923404712158625, 3375.1908833671578, 6.644618639081353], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_100threads_ZARR", 2302, 5, 0.21720243266724587, 4669.028670721123, 174, 11035, 4550.0, 6710.700000000006, 7279.549999999999, 8804.249999999995, 18.551649662330963, 3675.6597128831013, 5.036483013796883], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_5threads_ZARR", 459, 0, 0.0, 1181.7538126361653, 1067, 3740, 1145.0, 1232.0, 1270.0, 2158.6, 3.7993858073487905, 35.335089893964856, 1.1390736746641392], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_50threads_ZARR", 5473, 11, 0.20098666179426275, 966.026128266033, 7, 9223, 612.0, 1083.6000000000004, 1755.600000000004, 8359.26, 45.280427570344756, 859.7427147366157, 13.044654427003616], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_5threads_ZARR", 1144, 0, 0.0, 474.0253496503504, 393, 3139, 450.0, 523.0, 542.5, 820.8499999999997, 9.399083096439194, 103.76653337947977, 2.7628164179962864], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_25threads_ZARR", 4577, 11, 0.2403320952589032, 578.221105527637, 14, 3592, 485.0, 843.0, 951.0, 1659.4400000000005, 37.506863010218716, 413.11579511558534, 11.024966568433431], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 257, 98.46743295019157, 0.27180235632548594], "isController": false}, {"data": ["500/Internal Server Error", 4, 1.5325670498084292, 0.004230386868879159], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 94554, 261, "502/Bad Gateway", 257, "500/Internal Server Error", 4, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_100threads_ZARR", 2583, 16, "502/Bad Gateway", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_50threads_ZARR", 4555, 14, "502/Bad Gateway", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_25threads_ZARR", 3424, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_50threads_ZARR", 2572, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_50threads_ZARR", 4095, 22, "502/Bad Gateway", 22, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_50threads_ZARR", 5791, 22, "502/Bad Gateway", 22, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_100threads_ZARR", 5369, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_100threads_ZARR", 4876, 36, "502/Bad Gateway", 36, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_25threads_ZARR", 4264, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_100threads_ZARR", 4808, 40, "502/Bad Gateway", 40, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_50threads_ZARR", 6086, 25, "502/Bad Gateway", 24, "500/Internal Server Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_5threads_ZARR", 824, 1, "500/Internal Server Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_25threads_ZARR", 4136, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_100threads_ZARR", 7268, 23, "502/Bad Gateway", 23, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_100threads_ZARR", 7599, 25, "502/Bad Gateway", 25, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_5threads_ZARR", 1064, 1, "500/Internal Server Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_100threads_ZARR", 2302, 5, "502/Bad Gateway", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_50threads_ZARR", 5473, 11, "502/Bad Gateway", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_25threads_ZARR", 4577, 11, "502/Bad Gateway", 10, "500/Internal Server Error", 1, "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
