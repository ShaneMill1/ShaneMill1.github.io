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

    var data = {"OkPercent": 99.5238492030426, "KoPercent": 0.4761507969573964};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.41365600485673815, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.25296442687747034, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -80"], "isController": false}, {"data": [0.4290450928381963, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -79"], "isController": false}, {"data": [0.5025, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -78"], "isController": false}, {"data": [0.37460815047021945, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -77"], "isController": false}, {"data": [0.46112600536193027, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -80"], "isController": false}, {"data": [0.5080745341614907, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79"], "isController": false}, {"data": [0.4062015503875969, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -78"], "isController": false}, {"data": [0.37697160883280756, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -79"], "isController": false}, {"data": [0.5588235294117647, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77"], "isController": false}, {"data": [0.4098798397863818, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -78"], "isController": false}, {"data": [0.45086321381142097, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -79"], "isController": false}, {"data": [0.5143570536828964, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -80"], "isController": false}, {"data": [0.3501552795031056, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -80"], "isController": false}, {"data": [0.42353723404255317, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.3061630218687873, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -79"], "isController": false}, {"data": [0.313, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -78"], "isController": false}, {"data": [0.2879684418145957, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -77"], "isController": false}, {"data": [0.3858267716535433, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -78"], "isController": false}, {"data": [0.35524256651017216, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -77"], "isController": false}, {"data": [0.384012539184953, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.3703416149068323, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -79"], "isController": false}, {"data": [0.2749003984063745, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -80"], "isController": false}, {"data": [0.4472630173564753, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -77"], "isController": false}, {"data": [0.43584656084656087, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -78"], "isController": false}, {"data": [0.25349301397205587, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -77"], "isController": false}, {"data": [0.7595093715545755, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}, {"data": [0.2844311377245509, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -79"], "isController": false}, {"data": [0.5031133250311333, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80"], "isController": false}, {"data": [0.2371031746031746, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -78"], "isController": false}, {"data": [0.38671875, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -80"], "isController": false}, {"data": [0.4212283044058745, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -77"], "isController": false}, {"data": [0.5292652552926526, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77"], "isController": false}, {"data": [0.4381578947368421, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -78"], "isController": false}, {"data": [0.5494367959949937, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78"], "isController": false}, {"data": [0.44466666666666665, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -79"], "isController": false}, {"data": [0.4894409937888199, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.5273291925465838, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80"], "isController": false}, {"data": [0.5169172932330827, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79"], "isController": false}, {"data": [0.4383289124668435, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -77"], "isController": false}, {"data": [0.48936170212765956, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -78"], "isController": false}, {"data": [0.4601593625498008, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -79"], "isController": false}, {"data": [0.5298136645962733, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -77"], "isController": false}, {"data": [0.5168119551681195, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.3989028213166144, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -77"], "isController": false}, {"data": [0.5211706102117061, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -79"], "isController": false}, {"data": [0.4535809018567639, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -80"], "isController": false}, {"data": [0.559850374064838, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -78"], "isController": false}, {"data": [0.38828125, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -79"], "isController": false}, {"data": [0.48509316770186334, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -77"], "isController": false}, {"data": [0.39794303797468356, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -78"], "isController": false}, {"data": [0.4968671679197995, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.5142503097893433, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78"], "isController": false}, {"data": [0.496875, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -79"], "isController": false}, {"data": [0.42572944297082227, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -80"], "isController": false}, {"data": [0.2898406374501992, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -77"], "isController": false}, {"data": [0.4119496855345912, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -77"], "isController": false}, {"data": [0.2962226640159046, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP "], "isController": false}, {"data": [0.5288220551378446, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -80"], "isController": false}, {"data": [0.25992063492063494, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -78"], "isController": false}, {"data": [0.43412384716732544, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -80"], "isController": false}, {"data": [0.3906497622820919, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -79"], "isController": false}, {"data": [0.43333333333333335, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.35859375, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -78"], "isController": false}, {"data": [0.28884462151394424, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST"], "isController": false}, {"data": [0.24554455445544554, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -79"], "isController": false}, {"data": [0.23652694610778444, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -78"], "isController": false}, {"data": [0.3919558359621451, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -80"], "isController": false}, {"data": [0.27634194831013914, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -77"], "isController": false}, {"data": [0.46788990825688076, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -77"], "isController": false}, {"data": [0.5139257294429708, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -80"], "isController": false}, {"data": [0.4472630173564753, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -78"], "isController": false}, {"data": [0.4675925925925926, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -79"], "isController": false}, {"data": [0.28330019880715707, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -80"], "isController": false}, {"data": [0.30119284294234594, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -80"], "isController": false}, {"data": [0.28330019880715707, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -79"], "isController": false}, {"data": [0.3974960876369327, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -79"], "isController": false}, {"data": [0.33096366508688785, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -80"], "isController": false}, {"data": [0.3092885375494071, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -78"], "isController": false}, {"data": [0.41823899371069184, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -78"], "isController": false}, {"data": [0.37598116169544743, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -77"], "isController": false}, {"data": [0.5168119551681195, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80"], "isController": false}, {"data": [0.3203592814371258, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -77"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 84007, 400, 0.4761507969573964, 2781.2858571309584, 120, 60119, 2473.0, 12125.800000000003, 23118.55000000002, 60063.0, 34.757859276327196, 1346.0900131626665, 13.77378466820492], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -80", 506, 0, 0.0, 1805.4466403162066, 155, 4858, 1839.0, 2996.5, 3328.95, 4026.9900000000002, 2.7989821882951653, 8.189209605597965, 0.8992823632315522], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -79", 754, 0, 0.0, 1221.466843501325, 149, 4605, 1405.0, 1937.0, 2212.75, 3124.45, 4.20643908752629, 22.427513542613905, 1.4870419430512862], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -78", 800, 0, 0.0, 1119.662499999999, 124, 4099, 1194.5, 1828.9, 2223.8499999999985, 3164.51, 4.404364725442914, 40.423245471418426, 1.6731424591770443], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -77", 638, 0, 0.0, 1388.0376175548602, 149, 4147, 1329.0, 2505.5, 2792.5999999999995, 3757.0500000000043, 3.561818202119226, 9.626873112320094, 1.1235032024262792], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -80", 746, 0, 0.0, 1148.152815013405, 131, 3170, 1341.0, 1931.0000000000007, 2198.2, 2960.179999999997, 4.140419037047315, 21.80480999375607, 1.4637028236436798], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79", 805, 0, 0.0, 1134.9527950310546, 125, 4331, 1209.0, 1960.0, 2585.499999999995, 3403.2399999999916, 4.423635953994186, 40.57809117017535, 1.680463267679432], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -78", 645, 0, 0.0, 1326.7348837209297, 142, 5553, 1225.0, 2441.6, 3000.8999999999946, 4029.519999999986, 3.5863019944287218, 9.289607047986944, 1.1312261173832785], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -79", 634, 0, 0.0, 1411.7523659306003, 167, 5505, 1308.0, 2673.0, 3093.25, 4480.0, 3.5221439523566143, 9.431593794443458, 1.1109887662218618], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77", 799, 0, 0.0, 1014.7484355444312, 129, 4378, 1091.0, 1719.0, 2032.0, 2632.0, 4.412755569792231, 39.62566330267693, 1.6763299967277125], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 749, 0, 0.0, 1209.8598130841124, 146, 2864, 1427.0, 1905.0, 2074.5, 2382.5, 4.15370367289445, 21.582296077203985, 1.4683991499880769], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -79", 753, 0, 0.0, 1166.9734395750336, 144, 3353, 1401.0, 1889.6, 2074.5, 2785.6200000000163, 4.201446234879257, 21.54625745052281, 1.4852768916272374], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -80", 801, 0, 0.0, 1119.414481897629, 136, 4059, 1156.0, 2056.4, 2558.2, 3348.000000000001, 4.414779867281024, 39.92712995215944, 1.6770989925510924], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -80", 644, 0, 0.0, 1457.1273291925465, 154, 4654, 1437.5, 2556.5, 2966.25, 3500.1499999999987, 3.5847481213470638, 9.961100577511829, 1.1307359796827163], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -77", 752, 0, 0.0, 1211.4640957446804, 149, 3394, 1411.0, 1920.8000000000002, 2172.1000000000004, 3038.480000000005, 4.177754568030177, 22.218084031477602, 1.4769015172137931], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 1771, 0, 0.0, 10319.40090344438, 2169, 14713, 10268.0, 11691.8, 13104.799999999997, 13926.56, 9.411752201478459, 2543.0389007438125, 3.419113104443346], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -79", 503, 0, 0.0, 1676.3916500994037, 183, 5175, 1646.0, 2923.4000000000005, 3519.7999999999984, 4673.679999999998, 2.7765051362585074, 7.800872651631403, 0.8920607322549305], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -78", 500, 0, 0.0, 1602.0820000000006, 160, 4094, 1563.0, 2761.7000000000003, 2887.85, 3927.8500000000004, 2.765563206947095, 7.53591127036146, 0.8885452100445256], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 507, 0, 0.0, 1744.5739644970404, 170, 4247, 1755.0, 2996.7999999999997, 3503.6, 4108.960000000001, 2.81824801694284, 8.003519726693867, 0.9054722632560492], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -78", 635, 0, 0.0, 1369.941732283463, 175, 4577, 1295.0, 2460.4, 2817.599999999999, 4101.639999999999, 3.5297387437465257, 9.274016163493608, 1.1133843888966093], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -77", 639, 0, 0.0, 1441.062597809075, 150, 4404, 1407.0, 2585.0, 3044.0, 3622.6000000000017, 3.562369337979094, 9.478141332752614, 1.1236770470383275], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -80", 638, 0, 0.0, 1331.1065830721016, 154, 5438, 1292.5, 2322.0, 2629.1499999999996, 3004.61, 3.5536840229039948, 9.619378874657443, 1.12093744081835], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 1770, 0, 0.0, 10521.425423728813, 2119, 17340, 10285.5, 12468.6, 14517.25, 15418.8, 9.238140471928059, 2496.129316596163, 3.3560432183176143], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 644, 0, 0.0, 1413.2313664596275, 149, 5578, 1323.0, 2591.0, 3040.0, 4071.6499999999996, 3.5738465465765437, 9.503413432724003, 1.1272972993595933], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -80", 502, 0, 0.0, 1785.705179282869, 172, 4923, 1790.5, 3127.3999999999996, 3685.5499999999997, 4685.19, 2.7799775165165, 8.020784156481723, 0.8931763700526645], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 749, 0, 0.0, 1146.9786381842464, 126, 2959, 1385.0, 1904.0, 2086.0, 2633.5, 4.158754483570421, 21.745679835246136, 1.4701846904809497], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -78", 756, 0, 0.0, 1157.8148148148125, 126, 2791, 1418.0, 1918.3000000000002, 2065.15, 2390.1899999999982, 4.224384083683037, 22.616992363210418, 1.493385779583261], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -77", 501, 0, 0.0, 1813.5309381237512, 148, 5657, 1883.0, 3041.2000000000003, 3424.1, 4751.120000000001, 2.7747931366793313, 8.246780784765223, 0.8915106855151367], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 10884, 0, 0.0, 1620.0769018743056, 191, 15509, 440.0, 7165.0, 7985.25, 10835.749999999998, 59.974542228491764, 2261.5790757919735, 21.31907555778418], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -79", 501, 0, 0.0, 1774.6546906187625, 168, 6083, 1736.0, 3138.4, 3755.199999999998, 4724.580000000004, 2.7869253704775043, 7.7950567276295, 0.8954086395381825], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80", 803, 0, 0.0, 1114.0983810709827, 147, 3898, 1236.0, 1768.0, 2361.6, 2853.8, 4.431640700453098, 42.217587461781925, 1.6835041332775929], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -78", 504, 0, 0.0, 1812.273809523812, 153, 5229, 1829.0, 2974.5, 3353.25, 4913.699999999994, 2.785361378532822, 8.08549019804251, 0.894906146032518], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -80", 640, 0, 0.0, 1386.1374999999994, 155, 6164, 1290.5, 2489.2999999999993, 2917.2999999999975, 5232.6400000000285, 3.553640538154439, 9.580774527060417, 1.1209237244373864], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -77", 749, 0, 0.0, 1231.77036048064, 135, 3904, 1423.0, 1936.0, 2113.5, 3425.5, 4.1763082327357886, 22.75303774673116, 1.4763902150882378], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77", 803, 0, 0.0, 1137.364881693648, 139, 6885, 1194.0, 1883.2000000000003, 2599.7999999999993, 4084.6000000000004, 4.413712740404435, 39.87760196232954, 1.6766936093919191], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -78", 760, 0, 0.0, 1183.2736842105267, 136, 2773, 1391.0, 1967.5999999999997, 2124.0, 2468.41, 4.235092196842627, 23.409740947142147, 1.4971712648994444], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 799, 0, 0.0, 1018.1652065081347, 120, 3925, 1056.0, 1780.0, 2115.0, 2674.0, 4.418245862387401, 39.67124975289066, 1.6784156645202137], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -79", 750, 0, 0.0, 1168.3866666666663, 129, 3475, 1403.0, 1942.6, 2128.7999999999997, 2679.1800000000007, 4.168612018942173, 22.417612159980212, 1.4736694832588542], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79", 805, 0, 0.0, 1142.5801242236012, 142, 4173, 1220.0, 1811.3999999999996, 2249.7999999999993, 3249.619999999996, 4.4463592326854355, 41.2224946250145, 1.689095450697885], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 300, 300, 100.0, 60063.26666666667, 60051, 60119, 60062.0, 60070.0, 60071.95, 60104.88, 1.5781914977563378, 0.5933630142931543, 0.6812115644612317], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 805, 0, 0.0, 1072.977639751553, 135, 4108, 1158.0, 1751.0, 2044.8999999999996, 3184.3399999999965, 4.451424179251387, 42.46971441763759, 1.6910195368445209], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 798, 0, 0.0, 1105.6704260651604, 132, 4107, 1206.5, 1793.6000000000001, 2259.6499999999987, 3587.2799999999997, 4.414766786348523, 40.23283849311507, 1.6770940233296636], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -77", 754, 0, 0.0, 1185.4774535809004, 134, 3153, 1368.0, 1892.5, 2173.75, 2935.4000000000015, 4.204140576647505, 22.262861066814608, 1.4862293835414029], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -78", 752, 0, 0.0, 1082.9215425531906, 132, 2730, 1314.0, 1848.5000000000002, 1994.75, 2523.800000000001, 4.184682503909228, 21.90465396376243, 1.4793506507960357], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 753, 0, 0.0, 1126.5909694555119, 131, 2762, 1366.0, 1909.2000000000003, 2034.3999999999996, 2302.7400000000007, 4.17264672145228, 21.333638007311826, 1.4750958136384038], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -77", 805, 0, 0.0, 1054.3105590062128, 155, 4021, 1116.0, 1829.1999999999998, 2144.299999999998, 2695.219999999996, 4.434333307627053, 40.78491400560764, 1.6845270084637927], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78", 803, 0, 0.0, 1108.4009962640087, 131, 4187, 1156.0, 1896.2, 2484.199999999997, 3547.2400000000007, 4.410973050767389, 41.15355910216374, 1.6756528483872208], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 1900, 0, 0.0, 9359.786842105284, 2588, 14063, 8954.5, 12288.0, 12924.0, 13585.95, 10.375823239659674, 1589.9834524391376, 4.215178191111742], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -77", 638, 0, 0.0, 1326.3040752351105, 158, 4016, 1246.0, 2357.6000000000004, 2773.45, 3480.1600000000008, 3.5646440943122135, 9.41307382458934, 1.124394572717622], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -79", 803, 0, 0.0, 1134.6886674968855, 126, 5736, 1169.0, 1742.6000000000001, 2741.999999999999, 4583.1200000000035, 4.39347598907923, 39.53282044197384, 1.6690060153826374], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 754, 0, 0.0, 1167.6777188328922, 125, 3507, 1414.5, 1933.5, 2145.75, 3169.700000000002, 4.177285318559557, 21.628873788088644, 1.4767356301939059], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -78", 802, 0, 0.0, 994.0573566084786, 149, 4051, 1073.5, 1635.0, 1898.7499999999968, 2633.6100000000006, 4.430204938407999, 40.50984945520079, 1.6829587119538199], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -79", 640, 0, 0.0, 1347.3687499999996, 140, 5395, 1219.0, 2442.0, 2865.099999999996, 3583.520000000001, 3.56490352479836, 9.043766849739317, 1.1244764047947953], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -77", 805, 0, 0.0, 1178.2484472049714, 122, 5839, 1288.0, 1958.4, 2294.7, 3101.3599999999974, 4.452261250947142, 41.38634790826683, 1.6913375259945689], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -78", 632, 0, 0.0, 1309.2325949367093, 167, 3250, 1326.0, 2371.1000000000004, 2608.0500000000006, 3068.0199999999995, 3.5239343165407457, 9.239219451336808, 1.1115535002369734], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 798, 0, 0.0, 1135.8508771929821, 131, 4173, 1235.5, 1828.5, 2135.4999999999986, 3836.0899999999992, 4.419534564304782, 40.93198856210055, 1.6789052202290624], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 1900, 0, 0.0, 9631.966842105254, 5388, 15241, 9339.0, 11260.8, 12172.0, 13530.070000000002, 10.103588369174483, 665.8600205993555, 3.7888456384404314], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78", 807, 0, 0.0, 1116.7385377942985, 143, 4803, 1188.0, 1821.0000000000005, 2186.7999999999997, 3681.239999999998, 4.462286216678002, 39.69087837954592, 1.695145838171624], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -79", 800, 0, 0.0, 1179.3199999999997, 124, 4388, 1263.5, 2063.9, 2645.7, 3548.3100000000004, 4.462069619441237, 39.46706025258103, 1.695063556604142], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -80", 754, 0, 0.0, 1201.6405835543787, 130, 2876, 1435.5, 1952.0, 2117.0, 2471.050000000001, 4.213467449008102, 22.266994752374966, 1.4895265786532552], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -77", 502, 0, 0.0, 1700.478087649404, 178, 5082, 1688.5, 2967.5, 3231.199999999999, 4037.969999999997, 2.775688945901712, 7.955251043993564, 0.8917984992203742], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -77", 636, 0, 0.0, 1329.0424528301894, 168, 5435, 1250.5, 2468.6000000000004, 2804.0499999999997, 4017.2699999999995, 3.5374603704321705, 8.992196625229434, 1.115820019189054], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -79", 503, 0, 0.0, 1743.6918489065597, 192, 4695, 1672.0, 3032.2000000000007, 3646.799999999997, 4271.839999999999, 2.791188058376339, 8.146241494298318, 0.8967781945369291], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 2166, 0, 0.0, 8165.293628808886, 2542, 17153, 8367.0, 11249.5, 11733.65, 12273.269999999999, 11.567423230974631, 2528.6323431241653, 13.905759763017356], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -80", 798, 0, 0.0, 1055.9411027568924, 161, 4105, 1144.0, 1692.2, 1968.149999999999, 2923.4299999999994, 4.41787078558379, 39.824157116758016, 1.6782731792891548], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -78", 504, 0, 0.0, 1805.8809523809525, 167, 4709, 1850.0, 3122.5, 3432.5, 3979.5, 2.801042610304947, 8.252844027360185, 0.8999443542874292], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -80", 759, 0, 0.0, 1207.646903820816, 131, 2975, 1415.0, 2046.0, 2226.0, 2614.9999999999995, 4.226481495918299, 23.20001817588901, 1.4941272475804925], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -79", 631, 0, 0.0, 1345.4072900158474, 149, 5237, 1303.0, 2465.0000000000005, 2771.2, 3897.759999999997, 3.519123732613521, 9.044556033052435, 1.1100360992521163], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 8595, 100, 1.1634671320535195, 2014.29517161139, 336, 60099, 961.0, 1807.4000000000005, 6557.0, 60053.0, 48.12699479254157, 134.29862044347388, 26.789440460692088], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 640, 0, 0.0, 1439.7453124999984, 166, 5240, 1373.5, 2567.1, 3032.249999999999, 3690.8300000000013, 3.546433340906446, 9.547576927126336, 1.1186503604617013], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -80", 502, 0, 0.0, 1675.519920318725, 142, 4304, 1640.0, 2964.2999999999997, 3166.3999999999996, 3983.85, 2.7989495575763996, 7.800510289066812, 0.8992718793385112], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 800, 0, 0.0, 24506.686250000024, 15831, 32555, 24444.0, 28479.6, 30079.999999999996, 31593.620000000003, 3.9592200336533705, 3382.1327823418787, 2.265725527071167], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 505, 0, 0.0, 1824.0970297029708, 195, 4587, 1918.0, 2951.6000000000004, 3333.9999999999995, 4356.88, 2.8004680386187313, 8.252688821904096, 0.899759750689026], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -78", 501, 0, 0.0, 1949.0698602794423, 161, 4890, 1949.0, 3373.8, 3815.7, 4685.780000000004, 2.773779204960691, 8.456165092805337, 0.8911849203438157], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -80", 634, 0, 0.0, 1355.6987381703475, 154, 3781, 1330.5, 2518.5, 2812.0, 3445.5499999999993, 3.516732212490501, 9.196613117161542, 1.1092817428070623], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -77", 503, 0, 0.0, 1773.4473161033814, 169, 4957, 1754.0, 3085.6000000000004, 3548.1999999999994, 4754.959999999999, 2.8177535277938053, 8.193073317260561, 0.9053133893009394], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -77", 763, 0, 0.0, 1136.3709043250335, 121, 3244, 1368.0, 1953.4, 2122.2, 2708.88, 4.2224214452524045, 22.23340690058771, 1.492691956231807], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -80", 754, 0, 0.0, 1031.7108753315656, 139, 2523, 1218.0, 1829.0, 1953.75, 2155.350000000003, 4.1964191298830675, 20.74189139574069, 1.483499731462569], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -78", 749, 0, 0.0, 1196.365821094793, 134, 4758, 1396.0, 1905.0, 2173.0, 3102.0, 4.17456247909932, 21.79738445407424, 1.4757730639003457], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -79", 756, 0, 0.0, 1124.5423280423279, 128, 2587, 1373.0, 1867.9, 1996.8999999999999, 2372.2999999999993, 4.208721406024706, 21.358251012862766, 1.487848778301703], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -80", 503, 0, 0.0, 1739.7733598409545, 161, 4514, 1782.0, 2950.4000000000005, 3203.1999999999994, 4284.079999999999, 2.778637086795121, 8.185297814447255, 0.8927457046441356], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 503, 0, 0.0, 1701.5208747514914, 169, 4663, 1687.0, 2996.6000000000004, 3437.7999999999965, 4301.359999999998, 2.7774250012423867, 8.287642900379893, 0.8923562748132278], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -79", 503, 0, 0.0, 1803.9681908548712, 151, 4696, 1759.0, 3187.6, 3876.5999999999985, 4581.8, 2.7843897038472183, 7.489312681635759, 0.8945939575837254], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -79", 639, 0, 0.0, 1337.6713615023464, 169, 5467, 1217.0, 2505.0, 2839.0, 3350.2000000000007, 3.561614821668441, 9.683842456023253, 1.1234390501942444], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -80", 633, 0, 0.0, 1512.0284360189573, 146, 4214, 1469.0, 2602.4000000000005, 3178.3999999999996, 3879.3799999999987, 3.5356807721524643, 9.507853126466218, 1.1152586810598104], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 506, 0, 0.0, 1662.2865612648218, 194, 4808, 1600.0, 2933.9, 3413.799999999999, 4241.09, 2.808832835588911, 8.309297562810166, 0.902447268465578], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -78", 636, 0, 0.0, 1298.1194968553455, 149, 5404, 1167.0, 2448.2000000000007, 2821.35, 3608.3, 3.5520605860899965, 8.84893218273006, 1.1204253606514345], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -77", 637, 0, 0.0, 1395.5761381475668, 160, 4426, 1340.0, 2466.0000000000005, 2978.4, 3812.4800000000005, 3.532667468957447, 9.120152590645917, 1.1143081957746634], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80", 803, 0, 0.0, 1108.0136986301372, 140, 4212, 1196.0, 1798.8000000000002, 2171.2, 3887.3600000000015, 4.466023737222056, 41.667171779582546, 1.6965656579876753], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -77", 501, 0, 0.0, 1632.4830339321356, 168, 4375, 1522.0, 2957.8, 3259.3999999999996, 3942.680000000001, 2.7832560206660926, 7.586893202619372, 0.8942297175772895], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 400, 100.0, 0.4761507969573964], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 84007, 400, "504/Gateway Time-out", 400, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 300, 300, "504/Gateway Time-out", 300, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 8595, 100, "504/Gateway Time-out", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
