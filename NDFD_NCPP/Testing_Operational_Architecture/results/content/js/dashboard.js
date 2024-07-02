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

    var data = {"OkPercent": 99.97909258434818, "KoPercent": 0.020907415651821085};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9865826237397788, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -79"], "isController": false}, {"data": [0.3, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -77"], "isController": false}, {"data": [0.3125, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77"], "isController": false}, {"data": [0.9881666540106816, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -78"], "isController": false}, {"data": [0.125, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -79"], "isController": false}, {"data": [0.9279324611427933, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.42857142857142855, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -77"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -78"], "isController": false}, {"data": [0.9915881561238223, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -77"], "isController": false}, {"data": [0.3, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -77"], "isController": false}, {"data": [0.75, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -80"], "isController": false}, {"data": [0.9301883099939114, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.9916831560722236, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -79"], "isController": false}, {"data": [0.25, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -80"], "isController": false}, {"data": [0.9881415973670327, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -77"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -78"], "isController": false}, {"data": [0.9928264780439938, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77"], "isController": false}, {"data": [0.9889221629781122, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -79"], "isController": false}, {"data": [0.1, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79"], "isController": false}, {"data": [0.9910593406018431, 500, 1500, "NDFD_CityLevel1234_Summaries_24hourly_REST"], "isController": false}, {"data": [0.9896520519433509, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.9890439225705021, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80"], "isController": false}, {"data": [0.9886455898634519, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79"], "isController": false}, {"data": [0.4, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -78"], "isController": false}, {"data": [0.9882202240417943, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -79"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78"], "isController": false}, {"data": [0.971387970376848, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.9880021973082973, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -80"], "isController": false}, {"data": [0.9897052631578948, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.9892316004027406, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -79"], "isController": false}, {"data": [0.4166666666666667, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -80"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -77"], "isController": false}, {"data": [0.9888710109949048, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP "], "isController": false}, {"data": [0.25, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -79"], "isController": false}, {"data": [0.25, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -78"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -80"], "isController": false}, {"data": [0.9925908669226513, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -79"], "isController": false}, {"data": [0.9913866054158608, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -80"], "isController": false}, {"data": [0.9899240256827024, 500, 1500, "NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST"], "isController": false}, {"data": [0.9896737503741395, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -79"], "isController": false}, {"data": [0.625, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -78"], "isController": false}, {"data": [0.9915991964448774, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -80"], "isController": false}, {"data": [0.375, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -80"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -80"], "isController": false}, {"data": [0.9911779968863519, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -80"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -79"], "isController": false}, {"data": [0.9906864183044881, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -78"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -78"], "isController": false}, {"data": [0.9918427548010355, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -77"], "isController": false}, {"data": [0.2, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -77"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1774490, 371, 0.020907415651821085, 131.9253441834077, 27, 65370, 48.0, 187.0, 1059.0, 1256.9900000000016, 489.46857398202656, 125483.84011994176, 238.40394269485756], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_1Point-wspd-wdir_REST 37 -79", 1, 0, 0.0, 581.0, 581, 581, 581.0, 581.0, 581.0, 581.0, 1.721170395869191, 15.63004249139415, 0.6303114242685026], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79", 5, 0, 0.0, 3202.2, 811, 10059, 1449.0, 10059.0, 10059.0, 10059.0, 0.0024176979357211485, 0.02704988448239263, 9.49135322421779E-4], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -77", 3, 0, 0.0, 714.6666666666666, 108, 1147, 889.0, 1147.0, 1147.0, 1147.0, 0.009618251594225202, 0.015385445421231329, 0.0031559888043551443], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77", 8, 0, 0.0, 5348.25, 43, 27680, 1438.0, 27680.0, 27680.0, 27680.0, 0.003258036047725341, 0.012154001662412893, 0.001279033682798425], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 39507, 3, 0.007593591009188245, 98.96532260105832, 28, 65308, 40.0, 63.0, 86.0, 1072.0, 10.974785522628082, 99.7726725111166, 4.019086495103057], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -79", 4, 0, 0.0, 2762.0, 1241, 4305, 2751.0, 4305.0, 4305.0, 4305.0, 0.0012470876605976105, 0.011327002499319557, 4.566971413321328E-4], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 44715, 15, 0.03354579000335458, 402.46078497148636, 141, 65370, 206.0, 387.90000000000146, 1213.0, 1497.9800000000032, 12.420453819466628, 7154.964092297267, 4.669799531733058], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -77", 7, 0, 0.0, 1694.0, 41, 4529, 1490.0, 4529.0, 4529.0, 4529.0, 0.002553912173879097, 0.02323212099578495, 9.352705714889271E-4], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -78", 2, 0, 0.0, 1055.5, 1010, 1101, 1055.5, 1101.0, 1101.0, 1101.0, 0.006904408464804778, 0.01104435650913108, 0.0023059645458625333], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 13374, 8, 0.0598175564528189, 159.30671452071184, 37, 63580, 74.0, 150.0, 191.0, 1063.0, 7.431721682189707, 11.883093628496157, 2.482078921200078], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -78", 5, 0, 0.0, 11095.6, 54, 46799, 2828.0, 46799.0, 46799.0, 46799.0, 0.0031548727008865194, 0.00988362463324605, 0.001035192604978389], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -77", 1, 0, 0.0, 21620.0, 21620, 21620, 21620.0, 21620.0, 21620.0, 21620.0, 0.04625346901017576, 0.14490344588344126, 0.015176919518963921], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -80", 4, 0, 0.0, 586.0, 57, 1176, 555.5, 1176.0, 1176.0, 1176.0, 0.011706414822662449, 0.0366740026866222, 0.003841167363686116], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 45988, 11, 0.02391928329129338, 391.3147560233122, 138, 65056, 205.0, 385.90000000000146, 1209.0, 1414.0, 12.774089608621983, 7359.386524473713, 4.802758300116664], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 16172, 5, 0.030917635419243136, 128.72773930249758, 29, 64699, 58.0, 119.0, 148.34999999999854, 1053.0, 8.985023479290888, 28.141161414777287, 2.9482108291423224], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -80", 2, 0, 0.0, 1628.5, 1442, 1815, 1628.5, 1815.0, 1815.0, 1815.0, 0.20286033066233897, 0.3244972867430774, 0.06775218074855462], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 39803, 4, 0.010049493756752004, 113.65582996256644, 29, 65169, 40.0, 63.0, 84.0, 1070.0, 11.050510631150374, 100.4698075971393, 4.046817858087295], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -78", 3, 0, 0.0, 1786.6666666666667, 43, 2840, 2477.0, 2840.0, 2840.0, 2840.0, 0.0027731584148256746, 0.025195841313866995, 0.0010155609429293242], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 244580, 8, 0.003270913402567667, 73.54232561943013, 27, 65366, 41.0, 65.0, 84.0, 1066.0, 67.92564338842814, 5493.344131824416, 25.00778081780997], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80", 6, 0, 0.0, 4073.333333333333, 34, 20713, 1025.5, 20713.0, 20713.0, 20713.0, 0.00378594757219802, 0.04234666163030475, 0.001486280199241801], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -77", 7, 0, 0.0, 5224.714285714286, 148, 28298, 1267.0, 28298.0, 28298.0, 28298.0, 0.0026863068959800565, 0.024714548112332143, 9.837549667895717E-4], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77", 1, 0, 0.0, 3668.0, 3668, 3668, 3668.0, 3668.0, 3668.0, 3668.0, 0.27262813522355506, 3.0481635939203926, 0.1070278421483097], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 41073, 12, 0.029216273464319625, 123.7916636233039, 28, 65323, 40.0, 62.0, 81.0, 1067.0, 11.409746662121991, 127.57874409614085, 4.4792169513408595], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -79", 3, 0, 0.0, 7358.666666666666, 1133, 14831, 6112.0, 14831.0, 14831.0, 14831.0, 0.001003479733221568, 0.00915283272293891, 3.674852538653203E-4], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79", 5, 0, 0.0, 7079.4, 947, 23026, 2024.0, 23026.0, 23026.0, 23026.0, 0.0021167569251819562, 0.023672536089647197, 8.309924647686978E-4], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 152897, 21, 0.013734736456568801, 118.09104168165395, 28, 65366, 42.0, 67.0, 90.0, 1071.0, 42.3178807763726, 15918.775711797727, 15.125336293117549], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 110505, 99, 0.08958870639337586, 162.8149857472501, 29, 65363, 42.0, 69.0, 103.0, 1074.0, 30.696225562882194, 21112.17735622889, 13.639436163194723], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 40708, 5, 0.01228259801513216, 99.69883069666871, 28, 61679, 40.0, 63.0, 82.0, 1070.0, 11.30795996157716, 126.51612468686996, 4.439257719291033], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 40645, 14, 0.0344445811292902, 120.93487513839297, 28, 63692, 40.0, 63.0, 82.0, 1071.0, 11.290996010579562, 126.24502955578632, 4.432598043215805], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -78", 5, 0, 0.0, 1903.8, 55, 5208, 1372.0, 5208.0, 5208.0, 5208.0, 0.005726806148757226, 0.052125121121950044, 0.002097219048617148], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 39814, 9, 0.022605113779072688, 118.61096599186294, 27, 61767, 40.0, 64.0, 84.0, 1071.0, 11.060765591445644, 100.65881729883708, 4.050573336711051], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78", 7, 0, 0.0, 4156.285714285715, 68, 16522, 2745.0, 16522.0, 16522.0, 16522.0, 0.0023689929952261405, 0.02650310913409245, 9.300148282040123E-4], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 73186, 9, 0.012297433935452136, 245.87291285218683, 91, 65004, 132.0, 250.0, 1141.0, 1247.0, 20.329342797730455, 5201.04996480226, 8.51688287131481], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 40049, 14, 0.034957177457614425, 117.81100651701655, 28, 64646, 39.0, 63.0, 84.0, 1070.0, 11.125346477774587, 101.3430161133347, 4.074223563638155], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 142500, 14, 0.009824561403508772, 126.2529754385961, 40, 65227, 60.0, 102.0, 159.0, 1097.0, 39.58386111814824, 3436.006781034424, 15.346477406157081], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 40721, 0, 0.0, 92.33547800889002, 28, 29908, 40.0, 63.0, 83.0, 1068.0, 11.312020476698837, 126.52177034962577, 4.440851788704036], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78", 6, 0, 0.0, 1549.3333333333335, 35, 5012, 1356.5, 5012.0, 5012.0, 5012.0, 0.0021038273879755744, 0.02353656890297674, 8.259166112950985E-4], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -79", 1, 0, 0.0, 2051.0, 2051, 2051, 2051.0, 2051.0, 2051.0, 2051.0, 0.4875670404680643, 5.45132328742077, 0.19140815455875182], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -80", 6, 0, 0.0, 1403.1666666666665, 888, 2409, 1340.0, 2409.0, 2409.0, 2409.0, 0.0019866576075079764, 0.018071341205795212, 7.275357449370031E-4], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -77", 3, 0, 0.0, 958.0, 99, 1599, 1176.0, 1599.0, 1599.0, 1599.0, 0.007248180102779194, 0.011594256844094063, 0.0024207789015141448], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 141702, 34, 0.023994015610224274, 126.94406571537631, 36, 65202, 53.0, 90.0, 145.0, 1089.0, 39.36225710052318, 721.5659130069242, 47.818992024463704], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -79", 2, 0, 0.0, 4676.0, 1219, 8133, 4676.0, 8133.0, 8133.0, 8133.0, 0.0020342320570561406, 0.0032539766693925375, 6.794017221808594E-4], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -77", 2, 0, 0.0, 1402.5, 1264, 1541, 1402.5, 1541.0, 1541.0, 1541.0, 0.003053248656570591, 0.009565255556912556, 0.0010018472154372253], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -78", 1, 0, 0.0, 1708.0, 1708, 1708, 1708.0, 1708.0, 1708.0, 1708.0, 0.585480093676815, 0.9365394467213115, 0.19554120316159251], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -80", 1, 0, 0.0, 1146.0, 1146, 1146, 1146.0, 1146.0, 1146.0, 1146.0, 0.8726003490401396, 7.931800828970332, 0.31955579188481675], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 240379, 4, 0.0016640388719480488, 74.81928537850439, 28, 65317, 41.0, 66.0, 88.0, 1069.0, 66.77294603863503, 5505.551653641558, 38.01623783254318], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -79", 5, 0, 0.0, 1916.7999999999997, 50, 6513, 1316.0, 6513.0, 6513.0, 6513.0, 0.0058503823224847745, 0.018328150869659332, 0.0019196566995653165], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 16544, 13, 0.07857833655705997, 155.48428433268853, 28, 64572, 58.0, 118.0, 147.0, 1057.0, 9.193005891769916, 28.78115672556677, 3.0164550582370033], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -80", 1, 0, 0.0, 1601.0, 1601, 1601, 1601.0, 1601.0, 1601.0, 1601.0, 0.6246096189881324, 0.9991314022485946, 0.20860985321673953], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 135967, 42, 0.030889848272007178, 133.21584649216288, 31, 64416, 44.0, 71.0, 96.0, 1074.0, 37.50462025630699, 53041.57428811849, 21.938737825710827], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 13364, 3, 0.022448368751870697, 166.01361867704287, 36, 65325, 74.0, 153.0, 193.0, 1075.3500000000004, 7.426738481442046, 11.878096095238307, 2.4804146100128706], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -78", 4, 0, 0.0, 883.5, 60, 1246, 1114.0, 1246.0, 1246.0, 1246.0, 0.004828398709851865, 0.007723551842516947, 0.0016126097253606813], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -80", 16427, 6, 0.03652523284835941, 140.2132464844465, 29, 64651, 58.0, 118.0, 148.0, 1056.7199999999993, 9.128591045011673, 28.589483389515262, 2.995318936644455], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -80", 8, 0, 0.0, 1339.875, 37, 2173, 1394.5, 2173.0, 2173.0, 2173.0, 0.0031927524519341096, 0.029002523646322845, 0.001169220868628214], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -80", 3, 0, 0.0, 3286.0, 954, 7603, 1301.0, 7603.0, 7603.0, 7603.0, 0.003051093613654254, 0.004880557948403973, 0.0010190175936228075], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 13489, 2, 0.014826895989324634, 148.81140188301575, 36, 65233, 75.0, 152.0, 194.0, 1066.1000000000004, 7.494809084893201, 11.987577493889528, 2.5031491279623777], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -79", 3, 0, 0.0, 2375.6666666666665, 780, 5129, 1218.0, 5129.0, 5129.0, 5129.0, 0.004044445762634174, 0.00646953335858865, 0.001350781690254773], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 13636, 9, 0.06600176004693459, 190.36117629803516, 36, 63754, 75.0, 154.0, 196.0, 1073.0, 7.575576598823886, 12.11261177114381, 2.530124215622821], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -78", 3, 0, 0.0, 1835.3333333333333, 1169, 3095, 1242.0, 3095.0, 3095.0, 3095.0, 0.002976648194910924, 0.009325280673119378, 9.767126889551469E-4], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -77", 16611, 7, 0.04214075010535188, 118.54548190957784, 28, 60060, 58.0, 118.0, 147.0, 1057.880000000001, 9.229148574790774, 28.90306634204077, 3.0283143761032227], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80", 5, 0, 0.0, 1679.8, 1226, 2303, 1570.0, 2303.0, 2303.0, 2303.0, 0.00288806829241807, 0.032288265063731, 0.0011337924351094376], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -77", 1, 0, 0.0, 1252.0, 1252, 1252, 1252.0, 1252.0, 1252.0, 1252.0, 0.7987220447284344, 1.277643270766773, 0.2667606829073482], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Proxy Error", 371, 100.0, 0.020907415651821085], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1774490, 371, "502/Proxy Error", 371, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 39507, 3, "502/Proxy Error", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 44715, 15, "502/Proxy Error", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 13374, 8, "502/Proxy Error", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 45988, 11, "502/Proxy Error", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 16172, 5, "502/Proxy Error", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 39803, 4, "502/Proxy Error", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 244580, 8, "502/Proxy Error", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 41073, 12, "502/Proxy Error", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 152897, 21, "502/Proxy Error", 21, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 110505, 99, "502/Proxy Error", 99, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 40708, 5, "502/Proxy Error", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 40645, 14, "502/Proxy Error", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 39814, 9, "502/Proxy Error", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 73186, 9, "502/Proxy Error", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 40049, 14, "502/Proxy Error", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 142500, 14, "502/Proxy Error", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 141702, 34, "502/Proxy Error", 34, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 240379, 4, "502/Proxy Error", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 16544, 13, "502/Proxy Error", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 135967, 42, "502/Proxy Error", 42, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 13364, 3, "502/Proxy Error", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -80", 16427, 6, "502/Proxy Error", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 13489, 2, "502/Proxy Error", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 13636, 9, "502/Proxy Error", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -77", 16611, 7, "502/Proxy Error", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
