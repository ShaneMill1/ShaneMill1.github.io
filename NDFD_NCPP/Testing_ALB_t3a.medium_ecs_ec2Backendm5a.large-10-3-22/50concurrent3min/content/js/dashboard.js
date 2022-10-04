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

    var data = {"OkPercent": 96.27285276590014, "KoPercent": 3.727147234099862};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.38576142217433756, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6666666666666666, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -79"], "isController": false}, {"data": [1.0, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77"], "isController": false}, {"data": [0.41674876847290643, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -78"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -79"], "isController": false}, {"data": [0.00527831094049904, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -78"], "isController": false}, {"data": [0.4722513089005236, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -77"], "isController": false}, {"data": [1.0, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -78"], "isController": false}, {"data": [0.05281007751937984, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.4874768089053803, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -79"], "isController": false}, {"data": [0.75, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -80"], "isController": false}, {"data": [0.41970443349753694, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -77"], "isController": false}, {"data": [0.18076398362892224, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -77"], "isController": false}, {"data": [0.2, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77"], "isController": false}, {"data": [0.5613726352837659, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78"], "isController": false}, {"data": [0.014814814814814815, 500, 1500, "NDFD_CityLevel1234_Summaries_24hourly_REST"], "isController": false}, {"data": [0.07598039215686274, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.5606860158311345, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80"], "isController": false}, {"data": [0.5683516483516483, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -78"], "isController": false}, {"data": [0.4123152709359606, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -79"], "isController": false}, {"data": [0.05722599418040737, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.4088669950738916, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -80"], "isController": false}, {"data": [0.5666520017597888, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77"], "isController": false}, {"data": [0.0689484126984127, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.3, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78"], "isController": false}, {"data": [0.25, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -77"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP "], "isController": false}, {"data": [1.0, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -79"], "isController": false}, {"data": [0.04778156996587031, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.5041743970315399, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST"], "isController": false}, {"data": [0.4643605870020964, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -79"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -78"], "isController": false}, {"data": [0.5398517145505097, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -80"], "isController": false}, {"data": [0.25, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -80"], "isController": false}, {"data": [0.4832285115303983, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -80"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -80"], "isController": false}, {"data": [0.49581151832460735, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -78"], "isController": false}, {"data": [1.0, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -78"], "isController": false}, {"data": [0.5514842300556586, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80"], "isController": false}, {"data": [1.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -77"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 29701, 1107, 3.727147234099862, 4261.857412208368, 94, 60523, 1491.0, 10165.900000000001, 16871.10000000007, 59557.17000000013, 10.9464812486087, 307.21685364125943, 4.245054445162924], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79", 3, 0, 0.0, 890.6666666666667, 185, 2300, 187.0, 2300.0, 2300.0, 2300.0, 0.02954878997705044, 0.10426721463256079, 0.011484783604361401], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -79", 1, 0, 0.0, 2589.0, 2589, 2589, 2589.0, 2589.0, 2589.0, 2589.0, 0.3862495171881035, 0.18595801950560062, 0.12522933565083044], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77", 1, 0, 0.0, 343.0, 343, 343, 343.0, 343.0, 343.0, 343.0, 2.9154518950437316, 1.3381468658892128, 1.1331541545189503], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 1015, 149, 14.679802955665025, 2452.909359605913, 97, 60409, 953.0, 4817.599999999999, 6509.799999999997, 59467.60000000002, 5.574533990926965, 12.67216930209855, 2.019679795540922], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -79", 3, 0, 0.0, 836.0, 188, 2093, 227.0, 2093.0, 2093.0, 2093.0, 0.024195109361894316, 0.039939257673882185, 0.008766001536389444], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 1042, 0, 0.0, 8492.720729366609, 1207, 18248, 8292.5, 12846.1, 15662.249999999998, 16440.929999999986, 5.490134092046682, 723.5717320003162, 2.042715907294713], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -78", 1, 0, 0.0, 6514.0, 6514, 6514, 6514.0, 6514.0, 6514.0, 6514.0, 0.15351550506601166, 0.4731395839729813, 0.05067211007061713], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 955, 0, 0.0, 2315.452356020947, 175, 7470, 1535.0, 5384.0, 6034.5999999999985, 6778.959999999996, 5.196543618317952, 8.289074785676585, 1.7152653740151051], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -78", 1, 0, 0.0, 223.0, 223, 223, 223.0, 223.0, 223.0, 223.0, 4.484304932735426, 2.0582258968609866, 1.4538957399103138], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 1032, 26, 2.5193798449612403, 8831.806201550386, 103, 35610, 8474.5, 14940.600000000002, 18114.099999999995, 35109.7, 5.0209449301592395, 616.050346018578, 1.8681445492096391], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 1078, 0, 0.0, 2222.8710575139166, 154, 9544, 1365.0, 5770.1, 6519.5, 7600.9200000000055, 5.872419240616659, 8.741290362668192, 1.9039484256686823], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -80", 2, 0, 0.0, 477.0, 228, 726, 477.0, 726.0, 726.0, 726.0, 0.048677197166987124, 0.022342072918441355, 0.01606727797113442], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 1015, 154, 15.172413793103448, 2139.603940886698, 94, 60249, 666.0, 4475.599999999999, 5992.0, 57711.32000000003, 5.579099538831083, 11.77886423927741, 2.0213339149475895], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 1466, 180, 12.278308321964529, 5996.442019099593, 96, 60396, 6018.5, 7196.5, 12801.29999999997, 60107.33, 8.110156504998313, 135.3733421652071, 2.9541878675433306], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80", 3, 0, 0.0, 318.6666666666667, 172, 520, 264.0, 520.0, 520.0, 520.0, 0.029452189279403105, 0.013738602616336148, 0.011447237630080502], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -77", 3, 0, 0.0, 483.3333333333333, 192, 1044, 214.0, 1044.0, 1044.0, 1044.0, 0.033034917908228996, 0.015409842891436248, 0.01196870560932906], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77", 5, 0, 0.0, 1784.6, 713, 2566, 2135.0, 2566.0, 2566.0, 2566.0, 0.03195623274363432, 0.19152518710374272, 0.012420488898404745], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 2273, 2, 0.08798944126704795, 969.4883413990317, 106, 2910, 1020.0, 1812.2000000000003, 2028.0, 2492.299999999999, 12.571972190111671, 78.67278545511867, 4.886372003578559], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 405, 28, 6.91358024691358, 22340.745679012358, 100, 28583, 24300.0, 27721.8, 27976.1, 28355.78, 1.9660575933513271, 614.6417607168343, 0.6950320788995903], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 204, 182, 89.2156862745098, 44332.43627450981, 98, 60523, 60184.0, 60196.5, 60203.5, 60362.4, 1.071614302899137, 0.4380724140738679, 0.47197075254639725], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 2274, 4, 0.1759014951627089, 971.0624450307834, 98, 3090, 1037.0, 1832.5, 2054.0, 2425.5, 12.515754770461937, 78.74229654502699, 4.864521873675636], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 2275, 3, 0.13186813186813187, 963.9630769230779, 108, 3175, 1014.0, 1826.4, 2040.1999999999998, 2562.359999999997, 12.578025222396072, 74.88588854418342, 4.888724646985973], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -78", 3, 0, 0.0, 1453.6666666666667, 197, 2208, 1956.0, 2208.0, 2208.0, 2208.0, 0.023814626943868922, 0.06783137557254332, 0.00862815097282751], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 1015, 152, 14.975369458128078, 2142.5261083743812, 97, 60243, 814.0, 4818.0, 6235.399999999998, 54284.880000000005, 5.577934460643963, 11.877679486527777, 2.020911801659092], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 1031, 30, 2.909796314258002, 8592.666343355955, 103, 39108, 9408.0, 10380.4, 10693.0, 28948.919999999984, 5.657405933965836, 626.2672714899802, 2.3480444550151174], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 1015, 159, 15.665024630541872, 1926.2926108374397, 97, 60245, 804.0, 4375.199999999999, 6086.599999999999, 8900.240000000018, 5.573523839855912, 12.14441651485907, 2.0193138130727966], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 2273, 3, 0.13198416190057194, 955.0941487021565, 100, 3057, 987.0, 1808.0, 2022.2999999999997, 2475.2599999999998, 12.53847596562262, 74.35371539576461, 4.873352963200979], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 1008, 7, 0.6944444444444444, 9138.234126984136, 126, 36150, 9608.0, 12168.000000000002, 13207.3, 25228.28, 4.962779156327543, 208.31334647725149, 1.9046603598014888], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78", 5, 0, 0.0, 1691.8, 339, 2620, 2166.0, 2620.0, 2620.0, 2620.0, 0.031956028504777426, 0.1913804105550762, 0.012420409516505289], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -77", 2, 0, 0.0, 3181.0, 743, 5619, 3181.0, 5619.0, 5619.0, 5619.0, 0.04865706500583884, 0.0871455636920981, 0.0160606327851304], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -77", 1, 0, 0.0, 715.0, 715, 715, 715.0, 715.0, 715.0, 715.0, 1.3986013986013985, 0.6419361888111889, 0.45345279720279724], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -79", 2, 0, 0.0, 4922.0, 4442, 5402, 4922.0, 5402.0, 5402.0, 5402.0, 0.0702000702000702, 0.2163588101088101, 0.02317150754650755], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 382, 22, 5.7591623036649215, 25133.256544502616, 1716, 60288, 11809.5, 55010.79999999999, 60106.7, 60198.17, 1.794126349704345, 94.49412799353739, 2.172574876595105], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -79", 1, 0, 0.0, 223.0, 223, 223, 223.0, 223.0, 223.0, 223.0, 4.484304932735426, 2.0582258968609866, 1.4538957399103138], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 1465, 5, 0.3412969283276451, 6112.122184300342, 106, 31696, 6506.0, 6897.4, 7014.7, 7170.4, 7.499244956565806, 304.3837929766883, 4.240295732276955], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 1078, 0, 0.0, 2010.2875695732837, 157, 8841, 1083.5, 5251.3, 5986.4, 7699.770000000001, 5.87847159738468, 8.617374184416597, 1.9059107132145643], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 328, 0, 0.0, 29857.204268292673, 3150, 54225, 32944.0, 46323.6, 47075.75, 52031.53999999989, 1.530664625780499, 492.89639488814015, 0.8893998558001922], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 954, 0, 0.0, 2367.928721174006, 181, 7666, 1817.0, 5482.0, 6015.0, 6870.9000000000015, 5.170535535237145, 8.339897842629277, 1.7066806747169483], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -78", 3, 0, 0.0, 3716.6666666666665, 278, 5643, 5229.0, 5643.0, 5643.0, 5643.0, 0.03940783164974319, 0.08699997208611926, 0.013007663181262891], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -80", 1079, 0, 0.0, 1967.2011121408705, 157, 9396, 344.0, 5339.0, 6368.0, 7591.000000000002, 5.8649272999048785, 8.491223544299498, 1.9015193980160348], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -80", 3, 1, 33.333333333333336, 1824.6666666666667, 131, 2952, 2391.0, 2952.0, 2952.0, 2952.0, 0.032552083333333336, 0.09436077541775174, 0.011793772379557293], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -80", 2, 0, 0.0, 3870.5, 710, 7031, 3870.5, 7031.0, 7031.0, 7031.0, 0.0664032670407384, 0.1175675030711511, 0.02191826587868123], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 954, 0, 0.0, 2321.5754716981132, 180, 8053, 1345.0, 5505.5, 6058.0, 6846.8, 5.196531288129685, 8.492706336064145, 1.715261304089681], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -79", 3, 0, 0.0, 1523.0, 410, 3701, 458.0, 3701.0, 3701.0, 3701.0, 0.040215016287081594, 0.018759153105269506, 0.013274097172884355], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -80", 1, 0, 0.0, 6268.0, 6268, 6268, 6268.0, 6268.0, 6268.0, 6268.0, 0.1595405232929164, 0.4261165343809828, 0.05172602903637524], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 955, 0, 0.0, 2246.039790575922, 174, 7656, 682.0, 5338.2, 5896.0, 6852.719999999997, 5.19112019481649, 7.924824222147331, 1.7134752205546617], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -78", 1, 0, 0.0, 192.0, 192, 192, 192.0, 192.0, 192.0, 192.0, 5.208333333333333, 2.3905436197916665, 1.6886393229166667], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -77", 1078, 0, 0.0, 1983.812615955474, 158, 8705, 332.5, 5601.0, 6419.749999999996, 8080.5900000000065, 5.928386412006358, 8.056891697646794, 1.9220940320176862], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80", 1, 0, 0.0, 1993.0, 1993, 1993, 1993.0, 1993.0, 1993.0, 1993.0, 0.5017561465127948, 4.850962744606121, 0.19501850225790265], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -77", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 1.9124348958333335, 1.3753255208333335], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503/Service Unavailable", 504, 45.52845528455285, 1.6969125618666039], "isController": false}, {"data": ["504/Gateway Time-out", 212, 19.15085817524842, 0.7137806807851588], "isController": false}, {"data": ["502/Bad Gateway", 165, 14.905149051490515, 0.5555368506110905], "isController": false}, {"data": ["502/Proxy Error", 226, 20.41553748870822, 0.7609171408370089], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 29701, 1107, "503/Service Unavailable", 504, "502/Proxy Error", 226, "504/Gateway Time-out", 212, "502/Bad Gateway", 165, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 1015, 149, "503/Service Unavailable", 95, "502/Proxy Error", 24, "502/Bad Gateway", 23, "504/Gateway Time-out", 7, "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 1032, 26, "502/Proxy Error", 15, "502/Bad Gateway", 11, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 1015, 154, "503/Service Unavailable", 101, "502/Bad Gateway", 25, "502/Proxy Error", 25, "504/Gateway Time-out", 3, "", ""], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 1466, 180, "503/Service Unavailable", 91, "502/Proxy Error", 34, "502/Bad Gateway", 30, "504/Gateway Time-out", 25, "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 2273, 2, "503/Service Unavailable", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 405, 28, "502/Proxy Error", 28, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 204, 182, "504/Gateway Time-out", 150, "502/Proxy Error", 22, "502/Bad Gateway", 10, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 2274, 4, "503/Service Unavailable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 2275, 3, "503/Service Unavailable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 1015, 152, "503/Service Unavailable", 105, "502/Proxy Error", 24, "502/Bad Gateway", 22, "504/Gateway Time-out", 1, "", ""], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 1031, 30, "502/Proxy Error", 20, "502/Bad Gateway", 10, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 1015, 159, "503/Service Unavailable", 99, "502/Bad Gateway", 28, "502/Proxy Error", 28, "504/Gateway Time-out", 4, "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 2273, 3, "503/Service Unavailable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 1008, 7, "502/Bad Gateway", 4, "502/Proxy Error", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 382, 22, "504/Gateway Time-out", 22, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 1465, 5, "502/Bad Gateway", 2, "502/Proxy Error", 2, "503/Service Unavailable", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -80", 3, 1, "502/Proxy Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
