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

    var data = {"OkPercent": 99.91007819384988, "KoPercent": 0.08992180615011336};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9020805349562612, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.46389645776566757, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -80"], "isController": false}, {"data": [0.2798913043478261, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -79"], "isController": false}, {"data": [0.3600605143721634, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -78"], "isController": false}, {"data": [0.6163949275362319, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -77"], "isController": false}, {"data": [0.2927272727272727, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -80"], "isController": false}, {"data": [0.405446293494705, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79"], "isController": false}, {"data": [0.6087941976427924, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -78"], "isController": false}, {"data": [0.6021798365122616, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -79"], "isController": false}, {"data": [0.3821752265861027, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77"], "isController": false}, {"data": [0.3007246376811594, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -78"], "isController": false}, {"data": [0.26880733944954127, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -79"], "isController": false}, {"data": [0.416289592760181, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -80"], "isController": false}, {"data": [0.6101083032490975, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -80"], "isController": false}, {"data": [0.28506375227686703, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.4491869918699187, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -79"], "isController": false}, {"data": [0.4385245901639344, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -78"], "isController": false}, {"data": [0.42476060191518467, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -77"], "isController": false}, {"data": [0.602994555353902, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -78"], "isController": false}, {"data": [0.614441416893733, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -77"], "isController": false}, {"data": [0.6084776663628076, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.6157323688969258, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -79"], "isController": false}, {"data": [0.40896739130434784, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -80"], "isController": false}, {"data": [0.23996350364963503, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -77"], "isController": false}, {"data": [0.2619047619047619, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -78"], "isController": false}, {"data": [0.432157394843962, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -77"], "isController": false}, {"data": [0.5813649925410244, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}, {"data": [0.4201909959072306, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -79"], "isController": false}, {"data": [0.4318181818181818, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80"], "isController": false}, {"data": [0.46389645776566757, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -78"], "isController": false}, {"data": [0.6015342960288809, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -80"], "isController": false}, {"data": [0.2941712204007286, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -77"], "isController": false}, {"data": [0.43277945619335345, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77"], "isController": false}, {"data": [0.3003629764065336, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -78"], "isController": false}, {"data": [0.3640483383685801, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78"], "isController": false}, {"data": [0.291970802919708, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -79"], "isController": false}, {"data": [0.39334341906202724, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_CityLevel1234_Summaries_24hourly_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.36425339366515835, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80"], "isController": false}, {"data": [0.39081325301204817, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79"], "isController": false}, {"data": [0.29326047358834245, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -77"], "isController": false}, {"data": [0.2952468007312614, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -78"], "isController": false}, {"data": [0.32877959927140255, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -79"], "isController": false}, {"data": [0.38368580060422963, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -77"], "isController": false}, {"data": [0.4040785498489426, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.6172727272727273, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -77"], "isController": false}, {"data": [0.4200603318250377, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -79"], "isController": false}, {"data": [0.3190127970749543, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -80"], "isController": false}, {"data": [0.4086102719033233, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -78"], "isController": false}, {"data": [0.6116681859617138, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -79"], "isController": false}, {"data": [0.3838612368024133, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -77"], "isController": false}, {"data": [0.6172727272727273, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -78"], "isController": false}, {"data": [0.3661119515885023, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77"], "isController": false}, {"data": [0.01031434184675835, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.3995468277945619, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78"], "isController": false}, {"data": [0.41074130105900153, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -79"], "isController": false}, {"data": [0.31602914389799636, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -80"], "isController": false}, {"data": [0.4298365122615804, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -77"], "isController": false}, {"data": [0.6133879781420765, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -77"], "isController": false}, {"data": [0.45725915875169604, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP "], "isController": false}, {"data": [0.39090909090909093, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -80"], "isController": false}, {"data": [0.43953804347826086, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -78"], "isController": false}, {"data": [0.31386861313868614, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -80"], "isController": false}, {"data": [0.6052871467639015, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -79"], "isController": false}, {"data": [0.9998591568369876, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.6124206708975521, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -78"], "isController": false}, {"data": [0.44633152173913043, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST"], "isController": false}, {"data": [0.44528043775649795, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -79"], "isController": false}, {"data": [0.47758152173913043, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -78"], "isController": false}, {"data": [0.6129326047358834, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -80"], "isController": false}, {"data": [0.436820652173913, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -77"], "isController": false}, {"data": [0.2983576642335766, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -77"], "isController": false}, {"data": [0.2978142076502732, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -80"], "isController": false}, {"data": [0.2791970802919708, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -78"], "isController": false}, {"data": [0.27595628415300544, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -79"], "isController": false}, {"data": [0.46866485013623976, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -80"], "isController": false}, {"data": [0.4542974079126876, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -79"], "isController": false}, {"data": [0.4377564979480164, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -80"], "isController": false}, {"data": [0.6025524156791249, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -80"], "isController": false}, {"data": [0.6075949367088608, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -79"], "isController": false}, {"data": [0.45776566757493187, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -78"], "isController": false}, {"data": [0.6069153776160146, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -78"], "isController": false}, {"data": [0.6259057971014492, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -77"], "isController": false}, {"data": [0.3990963855421687, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80"], "isController": false}, {"data": [0.4645776566757493, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -77"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 445943, 401, 0.08992180615011336, 573.7117434290845, 16, 60238, 48.0, 60.0, 69.0, 29279.950000000008, 168.2118231060549, 1225.4713534495847, 77.08217249550184], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -80", 734, 0, 0.0, 1165.5613079019072, 179, 3276, 1249.0, 1716.0, 1890.5, 2619.699999999997, 4.079092151915617, 11.025612159056807, 1.3344686239177068], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -79", 552, 0, 0.0, 1673.5869565217408, 203, 6080, 1845.5, 2725.7, 3089.1000000000004, 4388.500000000004, 3.061869737411389, 24.87054136020235, 1.1003594368822178], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -78", 661, 0, 0.0, 1387.9773071104382, 233, 5108, 1356.0, 2267.8000000000006, 2876.9999999999977, 4121.7, 3.686538279206474, 35.81528712542038, 1.422053340123591], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -77", 1104, 0, 0.0, 767.4547101449285, 139, 1756, 724.5, 1207.0, 1330.5, 1603.8000000000002, 6.1556990398447695, 16.041029804121642, 1.977758773543876], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -80", 550, 0, 0.0, 1596.8381818181817, 187, 6001, 1802.5, 2584.8, 2824.7999999999997, 4152.700000000001, 3.033227629946229, 24.071461808906662, 1.0900661795119262], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79", 661, 0, 0.0, 1283.6111951588493, 181, 4901, 1268.0, 2117.6000000000004, 2637.7, 4081.98, 3.674937592776885, 33.80823248045778, 1.41757846596374], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -78", 1103, 0, 0.0, 800.3046237534003, 198, 2133, 740.0, 1294.0, 1421.1999999999998, 1747.4000000000005, 6.146319173952534, 15.460076482458193, 1.9747451252249844], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -79", 1101, 0, 0.0, 809.4187102633972, 176, 3936, 760.0, 1286.4, 1412.6999999999996, 1777.98, 6.110183083505836, 15.671408004214971, 1.963134994602949], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77", 662, 0, 0.0, 1392.714501510574, 182, 7710, 1289.5, 2368.400000000002, 3099.4500000000007, 6054.950000000002, 3.6733493510601107, 34.05445869597485, 1.4169658141296324], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 552, 0, 0.0, 1564.5760869565224, 198, 6058, 1691.0, 2509.0, 2721.8, 3983.520000000003, 3.0610886828445945, 23.327067551905415, 1.100078745397276], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -79", 545, 0, 0.0, 1666.0605504587174, 212, 6495, 1834.0, 2612.2000000000003, 2964.999999999999, 4537.639999999998, 3.046020053431104, 24.727959538583853, 1.094663456701803], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -80", 663, 0, 0.0, 1209.0542986425332, 193, 4390, 1160.0, 1997.4, 2405.399999999999, 3543.400000000003, 3.6820855154642036, 33.65330880923687, 1.420335721297227], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -80", 1108, 0, 0.0, 821.2590252707577, 172, 4727, 782.5, 1300.0, 1440.1499999999994, 1797.2800000000007, 6.172358085900506, 16.591911662302937, 1.9831111428332684], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -77", 549, 0, 0.0, 1585.0091074681247, 180, 6222, 1746.0, 2543.0, 2832.0, 3912.5, 3.034892977180258, 23.09996576071334, 1.0906646636741555], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 1172, 0, 0.0, 15919.524744027296, 5513, 28563, 15929.0, 18279.600000000002, 19040.75, 22107.869999999984, 6.100830275109966, 2455.6166285202103, 2.252064300773015], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -79", 738, 0, 0.0, 1198.3306233062328, 181, 3312, 1292.0, 1747.1, 2016.2499999999998, 2740.2900000000013, 4.067706926676552, 10.991407968130783, 1.3307439652701607], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -78", 732, 0, 0.0, 1207.860655737703, 188, 3325, 1281.5, 1810.4, 2098.2000000000003, 2935.3099999999963, 4.045562316581832, 11.23328338556088, 1.3234993906786265], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 731, 0, 0.0, 1234.9466484268114, 185, 3025, 1295.0, 1832.6000000000001, 2067.7999999999997, 2627.0399999999922, 4.0397453468323095, 11.442719659426256, 1.3215963781140856], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -78", 1102, 0, 0.0, 804.8248638838473, 171, 2685, 768.0, 1266.4, 1388.85, 1688.7600000000002, 6.118856850954198, 16.24172894144332, 1.9659217812147765], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -77", 1101, 0, 0.0, 787.6112624886476, 190, 2192, 743.0, 1273.4000000000005, 1402.7999999999997, 1705.7200000000003, 6.1259236179115115, 15.003417273254584, 1.9681922561453975], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -80", 1097, 0, 0.0, 803.9261622607107, 163, 2151, 756.0, 1292.4, 1422.8999999999992, 1743.6599999999994, 6.1032942210649885, 15.773843209806998, 1.960921678447638], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 1157, 0, 0.0, 15965.656006914433, 4301, 32880, 15806.0, 20076.0, 20937.999999999996, 28656.780000000013, 6.082430869519504, 2450.2989599624775, 2.245272332693723], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 1106, 0, 0.0, 786.2685352622067, 180, 2231, 729.5, 1283.0, 1403.2999999999997, 1718.690000000002, 6.123827558331395, 15.560665810521245, 1.9675188151279581], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -80", 736, 0, 0.0, 1263.3872282608672, 193, 3201, 1309.5, 1846.8000000000004, 2180.0999999999995, 2765.46, 4.09516814671385, 11.87121902889987, 1.339727860497207], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 548, 0, 0.0, 1665.2664233576636, 180, 4204, 1829.5, 2521.5, 2784.1499999999996, 3836.6099999999997, 3.0309399232309375, 24.21718578887402, 1.0892440349111183], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -78", 546, 0, 0.0, 1652.5952380952392, 172, 4687, 1896.5, 2605.9, 2787.5499999999997, 4234.869999999995, 3.021499128413713, 23.33779286336847, 1.085851249273678], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -77", 737, 0, 0.0, 1210.6852103120768, 190, 3285, 1281.0, 1801.8000000000002, 2096.7000000000003, 2701.92, 4.074411919175167, 11.630344599123752, 1.3329374930895321], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 8044, 0, 0.0, 2178.1611138736926, 275, 13817, 611.0, 10750.5, 12495.75, 13568.0, 44.586834578631134, 410.13931285578286, 16.11047733798195], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -79", 733, 0, 0.0, 1231.8894952251032, 167, 3507, 1322.0, 1793.6000000000001, 2011.6999999999996, 2879.3199999999933, 4.044785096649947, 11.56773984699621, 1.3232451243923165], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80", 660, 0, 0.0, 1232.1030303030311, 156, 4794, 1178.5, 2211.7, 2429.85, 3809.1799999999976, 3.6640204296896686, 31.34871342919003, 1.4133672555931827], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -78", 734, 0, 0.0, 1168.7084468664864, 192, 3521, 1238.0, 1705.5, 2002.75, 2579.3999999999983, 4.0659864171679905, 11.432276086848141, 1.3301811032727313], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -80", 1108, 0, 0.0, 806.0279783393506, 166, 2064, 759.5, 1296.5, 1427.0499999999995, 1740.91, 6.145790577194014, 16.049715798786373, 1.9745752928679987], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -77", 549, 0, 0.0, 1568.0218579234984, 164, 5855, 1710.0, 2447.0, 2872.5, 4007.0, 3.075923197167237, 23.752180048309924, 1.1054098989819758], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77", 662, 0, 0.0, 1306.003021148037, 200, 8596, 1169.5, 2104.4, 3295.4, 5320.270000000004, 3.688762091561539, 31.80346558885069, 1.4229111583660232], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -78", 551, 0, 0.0, 1586.8148820326687, 186, 6369, 1766.0, 2527.4, 2875.3999999999987, 4421.040000000001, 3.0466227274737916, 23.53448345126786, 1.0948800426858938], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 662, 0, 0.0, 1368.5287009063459, 184, 5222, 1311.0, 2221.2000000000003, 2897.250000000002, 4489.360000000001, 3.6864409139255025, 34.02924172151779, 1.4220157822271227], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -79", 548, 0, 0.0, 1581.4671532846735, 197, 4430, 1796.0, 2516.0, 2750.449999999998, 3725.04, 3.0257520208489774, 23.54152316660409, 1.0873796324926013], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79", 661, 0, 0.0, 1267.9531013615724, 147, 4346, 1225.0, 2103.000000000001, 2401.7999999999997, 3836.4399999999996, 3.674774148714385, 33.62524431028492, 1.4175154186935373], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 700, 0, 0.0, 28097.201428571407, 21066, 32194, 28423.5, 30190.7, 30661.1, 31482.97, 3.457797580529636, 2203.1100650930393, 1.2122552064552141], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 370, 300, 81.08108108108108, 55024.018918918984, 30164, 60185, 60042.0, 60049.0, 60054.0, 60073.03, 1.7030756625884909, 0.6749282377999946, 0.7450956023824648], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 663, 0, 0.0, 1385.150829562596, 182, 4922, 1331.0, 2321.8, 2949.3999999999996, 4149.920000000001, 3.6864873280473294, 35.42507265764876, 1.4220336861120069], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 664, 0, 0.0, 1283.6611445783126, 169, 4400, 1303.5, 2118.0, 2557.5, 3933.300000000002, 3.6930332929176073, 34.16533219745214, 1.4245587409203662], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -77", 549, 0, 0.0, 1541.692167577413, 193, 3895, 1745.0, 2500.0, 2680.5, 3522.0, 3.060866074564705, 24.154977601039246, 1.0999987455466909], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -78", 547, 0, 0.0, 1655.9488117001833, 191, 7748, 1781.0, 2634.4, 3136.000000000002, 5571.519999999997, 3.027100016048611, 23.84948603805458, 1.0878640682674694], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 549, 0, 0.0, 1544.324225865208, 171, 5362, 1741.0, 2527.0, 3035.5, 4427.5, 3.0413153550417142, 23.897043866749947, 1.092972705718116], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -77", 662, 0, 0.0, 1353.0770392749234, 146, 4498, 1309.0, 2302.2000000000003, 2918.6500000000005, 3824.11, 3.662253890453245, 33.586207103707615, 1.4126858268838203], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78", 662, 0, 0.0, 1379.7447129909356, 154, 7180, 1275.5, 2411.6000000000013, 3211.3, 5011.62, 3.6819096986618316, 33.42190893565279, 1.4202679013392807], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 1487, 0, 0.0, 11912.934767989223, 1856, 22989, 11927.0, 14131.0, 15129.199999999999, 17122.479999999974, 8.144598110365603, 2126.138412724223, 3.35646523688895], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -77", 1100, 0, 0.0, 801.6936363636362, 176, 2893, 746.5, 1312.9, 1454.7000000000003, 1836.99, 6.130729445336187, 15.070491196829854, 1.9697363159332084], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -79", 663, 0, 0.0, 1232.217194570134, 185, 4729, 1199.0, 2010.8000000000002, 2453.2, 4022.000000000002, 3.6921946003742314, 33.92741102952642, 1.4242352218240444], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 547, 0, 0.0, 1545.9872029250457, 142, 6306, 1725.0, 2518.2, 2888.2000000000016, 4498.839999999998, 3.0325878452548594, 22.8780991595934, 1.0898362568884652], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -78", 662, 0, 0.0, 1270.5362537764324, 231, 5583, 1257.5, 2091.2000000000003, 2582.0, 4157.4000000000015, 3.664199881550034, 32.803947706623234, 1.413436477746351], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -79", 1097, 0, 0.0, 785.0510483135824, 168, 2104, 718.0, 1287.0, 1400.8999999999992, 1650.7599999999993, 6.10404135390642, 15.244470081781355, 1.961161724057824], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -77", 663, 0, 0.0, 1331.9381598793377, 204, 5694, 1299.0, 2249.6000000000004, 2750.3999999999987, 3788.8000000000006, 3.6865898210085577, 34.72947327430897, 1.4220732219710743], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -78", 1100, 0, 0.0, 786.5618181818177, 155, 2477, 723.0, 1297.0, 1416.0, 1656.93, 6.138461366756325, 15.296714388553443, 1.9722204977176083], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 661, 0, 0.0, 1659.4795763993943, 218, 12971, 1355.0, 3060.8000000000084, 4597.999999999998, 10471.159999999996, 3.6775546765031515, 33.47808967099517, 1.4185879855651806], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 1018, 100, 9.82318271119843, 17266.094302554055, 363, 60238, 11210.5, 27671.1, 60045.0, 60053.0, 5.628943163156411, 456.40363994393175, 2.1438357750302734], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78", 662, 0, 0.0, 1291.7069486404832, 152, 5501, 1208.0, 2169.5, 2669.1000000000013, 4535.9400000000005, 3.684327693677649, 32.34074661377171, 1.4212006240260462], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -79", 661, 0, 0.0, 1282.944024205749, 200, 5384, 1245.0, 2111.4, 2609.199999999999, 3843.7799999999997, 3.667149332312523, 33.32599647744232, 1.4145742053353971], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -80", 549, 0, 0.0, 1554.5154826958103, 194, 4489, 1799.0, 2493.0, 2771.5, 3924.0, 3.066662197942152, 23.56481391777268, 1.102081727385461], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -77", 734, 0, 0.0, 1221.6961852861032, 181, 3510, 1291.5, 1820.5, 2078.0, 2727.499999999999, 4.046841919548342, 11.928194916912933, 1.3239180107897406], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -77", 1098, 0, 0.0, 790.1757741347906, 154, 2627, 766.0, 1264.2, 1381.2499999999998, 1604.2799999999997, 6.100542270424038, 16.138207510806517, 1.9600375068061604], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -79", 737, 0, 0.0, 1186.355495251017, 183, 3237, 1273.0, 1726.4, 1977.4000000000005, 2724.6600000000003, 4.075200442355543, 11.160875509745646, 1.3331954572159248], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 1362, 0, 0.0, 13246.445668135102, 3998, 39613, 12610.0, 20198.7, 25755.7, 33808.12999999996, 7.070880122105066, 130.7284203825128, 8.541678428753874], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -80", 660, 0, 0.0, 1309.6954545454553, 193, 7488, 1224.0, 2147.3999999999996, 2683.0, 4104.789999999998, 3.674116959389874, 33.431876617864006, 1.4172619130458988], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -78", 736, 0, 0.0, 1214.4347826086953, 161, 3387, 1270.0, 1774.6000000000001, 2142.4499999999994, 2968.71, 4.046690895495308, 11.201111791897821, 1.3238686035067655], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -80", 548, 0, 0.0, 1628.8686131386885, 197, 7791, 1748.0, 2607.4, 3256.9999999999945, 5660.409999999999, 3.0424330581448933, 23.24125929420272, 1.093374380270821], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -79", 1097, 0, 0.0, 810.0218778486785, 192, 2284, 778.0, 1282.4, 1433.3999999999996, 1883.2199999999998, 6.109582632522806, 15.804867329257494, 1.9629420762695344], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 369205, 0, 0.0, 47.382727752874274, 16, 6173, 47.0, 57.0, 62.0, 72.0, 2050.4667914405836, 1547.8621384605185, 979.1779892719193], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 1103, 0, 0.0, 788.6672710788763, 145, 2433, 730.0, 1261.2000000000003, 1402.8, 1703.6400000000003, 6.103837171981008, 15.485318910620014, 1.9610961226384294], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -80", 736, 0, 0.0, 1202.554347826087, 173, 3121, 1285.0, 1790.0, 2003.0, 2736.93, 4.068231314326144, 11.260734986651117, 1.3309155178703695], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 500, 1, 0.2, 40053.733999999975, 19151, 60058, 39864.5, 44741.4, 45813.75, 47815.38, 2.4175611642974566, 3443.5414995149767, 1.3976525481094673], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 731, 0, 0.0, 1207.0218878248984, 207, 3699, 1282.0, 1765.6000000000001, 1995.3999999999999, 2654.9199999999955, 4.041420412766687, 11.204032341383924, 1.3221443733172265], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -78", 736, 0, 0.0, 1147.0597826086982, 175, 3632, 1222.0, 1684.1000000000004, 1910.75, 2929.26, 4.07093155746319, 11.070329871289976, 1.331798898193524], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -80", 1098, 0, 0.0, 788.4735883424399, 185, 2689, 754.5, 1250.0, 1392.3499999999997, 1689.08, 6.080407575589766, 16.4080778775335, 1.9535684495791337], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -77", 736, 0, 0.0, 1220.1100543478246, 190, 3224, 1279.5, 1826.0, 2147.649999999999, 2891.27, 4.06580415640088, 11.649276831683443, 1.3301214769475533], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -77", 548, 0, 0.0, 1623.8083941605835, 185, 5193, 1786.0, 2632.9000000000005, 3027.95, 4556.859999999999, 3.0206484472323583, 24.03784871126349, 1.0855455357241288], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -80", 549, 0, 0.0, 1544.6739526411652, 174, 4991, 1775.0, 2484.0, 2628.5, 3374.5, 3.0403553172990123, 23.47755847249835, 1.0926276921543328], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -78", 548, 0, 0.0, 1625.60401459854, 155, 4950, 1812.0, 2634.0, 2935.7999999999993, 4085.099999999999, 3.0398171672010386, 24.25016810348414, 1.092434294462873], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -79", 549, 0, 0.0, 1635.0236794171221, 219, 6121, 1830.0, 2518.0, 2769.5, 4277.5, 3.0374116163013287, 24.133308750608588, 1.09156979960829], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -80", 734, 0, 0.0, 1170.0517711171656, 174, 3180, 1267.0, 1737.5, 1913.0, 2637.8999999999996, 4.071173429769485, 11.065263659091917, 1.331878026340603], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -79", 733, 0, 0.0, 1183.918144611187, 201, 3876, 1264.0, 1783.4, 2005.7999999999993, 2981.4199999999987, 4.063598363473074, 10.91975662240412, 1.329399855237773], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 731, 0, 0.0, 1228.7852257181937, 195, 3316, 1291.0, 1809.8000000000002, 2094.7999999999997, 3101.959999999999, 4.041420412766687, 11.432249842088822, 1.3221443733172265], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -80", 1097, 0, 0.0, 806.8924339106665, 171, 1985, 772.0, 1297.0, 1404.7999999999993, 1656.5399999999995, 6.107609736543215, 15.607791682557401, 1.9623082063698418], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -79", 1106, 0, 0.0, 825.0244122965656, 171, 4834, 753.0, 1376.0, 1515.0, 1907.2500000000016, 6.167091374436124, 15.448756004689443, 1.9814190060444188], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 734, 0, 0.0, 1181.7356948228862, 190, 3274, 1246.0, 1728.5, 1987.0, 2930.2, 4.077505944048174, 11.327076892790481, 1.3339496984923227], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -78", 1099, 0, 0.0, 789.6979071883535, 153, 2288, 757.0, 1248.0, 1378.0, 1714.0, 6.125429170196638, 15.866762031047957, 1.9680333955026308], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -77", 1104, 0, 0.0, 778.3795289855072, 158, 2100, 719.0, 1268.0, 1404.25, 1685.95, 6.119869620168961, 15.058819382081644, 1.966247172886317], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80", 664, 0, 0.0, 1291.1234939759015, 158, 5915, 1221.0, 2148.0, 2758.0, 4031.5000000000027, 3.700421870384922, 33.20645569316035, 1.4274088269551213], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -77", 734, 0, 0.0, 1153.6689373296995, 177, 3257, 1220.0, 1714.5, 1981.75, 2594.3999999999996, 4.063420359175359, 10.846138781859652, 1.3293416214099072], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 401, 100.0, 0.08992180615011336], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 445943, 401, "504/Gateway Time-out", 401, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 370, 300, "504/Gateway Time-out", 300, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 1018, 100, "504/Gateway Time-out", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 500, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
