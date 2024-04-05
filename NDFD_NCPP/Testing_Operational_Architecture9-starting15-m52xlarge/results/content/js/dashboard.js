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

    var data = {"OkPercent": 99.99838707075921, "KoPercent": 0.0016129292407942063};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.385586864304263, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -77"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77"], "isController": false}, {"data": [0.4623735173892649, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -78"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -77"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -78"], "isController": false}, {"data": [0.46555921052631577, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -77"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -78"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.4602305934859997, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -79"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -80"], "isController": false}, {"data": [0.4612796833773087, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -77"], "isController": false}, {"data": [0.027317625270089515, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77"], "isController": false}, {"data": [0.46425515107629517, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79"], "isController": false}, {"data": [0.25, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.46342433077126954, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80"], "isController": false}, {"data": [0.4629947796206965, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -78"], "isController": false}, {"data": [0.4629012921273478, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -79"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.4597532510836946, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -80"], "isController": false}, {"data": [0.4620019756338492, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78"], "isController": false}, {"data": [0.25, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP "], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -79"], "isController": false}, {"data": [0.08277404921700224, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -79"], "isController": false}, {"data": [0.4608009773198067, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -78"], "isController": false}, {"data": [0.46264578473842055, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -79"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -78"], "isController": false}, {"data": [0.46011631629495253, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -80"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -80"], "isController": false}, {"data": [0.4620938628158845, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -80"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -79"], "isController": false}, {"data": [0.4616610237004581, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -80"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -78"], "isController": false}, {"data": [0.45994556225649785, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -77"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 309995, 5, 0.0016129292407942063, 1451.6495201535051, 1, 15438, 1246.0, 2541.9000000000015, 3102.0, 6486.990000000002, 86.01011772755385, 4409.570277113462, 35.155605130475294], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_1Point_maxt_SOAP 34 -77", 2, 0, 0.0, 1105.0, 1089, 1121, 1105.0, 1121.0, 1121.0, 1121.0, 0.0022035410905324854, 0.019732882617366106, 0.0019194908718310325], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -79", 2, 0, 0.0, 1105.5, 1070, 1141, 1105.5, 1141.0, 1141.0, 1141.0, 0.011078491109510886, 0.032975821193153496, 0.003635129895308259], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77", 1, 1, 100.0, 1061.0, 1061, 1061, 1061.0, 1061.0, 1061.0, 1061.0, 0.942507068803016, 1.5076431432610746, 0.37000765786993406], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 14923, 0, 0.0, 1196.3729142933769, 708, 8457, 1129.0, 1435.6000000000004, 1608.7999999999993, 2217.2800000000007, 4.144710182744419, 36.82357754983137, 1.5178382016886298], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -79", 2, 0, 0.0, 1165.5, 1160, 1171, 1165.5, 1171.0, 1171.0, 1171.0, 0.0014535728821443107, 0.01291181536717251, 5.32314287894645E-4], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 5919, 0, 0.0, 3040.965365771245, 2267, 11114, 2913.0, 3402.0, 3724.0, 7155.0, 1.6433308503369535, 928.9505251157327, 0.6178538841598897], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -77", 1, 0, 0.0, 1244.0, 1244, 1244, 1244.0, 1244.0, 1244.0, 1244.0, 0.8038585209003215, 7.13502939107717, 0.2943817825562701], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -78", 1, 0, 0.0, 1189.0, 1189, 1189, 1189.0, 1189.0, 1189.0, 1189.0, 0.8410428931875525, 2.813058505046257, 0.29321514928511355], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 15200, 0, 0.0, 1185.1645394736868, 670, 9060, 1120.5, 1413.0, 1589.0, 2161.9399999999987, 4.220920771650963, 14.117825823148973, 1.4715514799603455], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -78", 3, 0, 0.0, 1129.0, 896, 1434, 1057.0, 1434.0, 1434.0, 1434.0, 0.004215217779226564, 0.031802116689171246, 0.0021460288433301907], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -80", 2, 0, 0.0, 1037.5, 945, 1130, 1037.5, 1130.0, 1130.0, 1130.0, 0.0018679682669550809, 0.005560124294608483, 6.12927087594636E-4], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 5967, 0, 0.0, 3016.3668510139014, 2163, 9736, 2907.0, 3394.0, 3680.399999999998, 4806.199999999997, 1.656893852998778, 936.6171114557709, 0.6229532552778608], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 18821, 0, 0.0, 1199.3617767387384, 645, 8697, 1132.0, 1446.0, 1629.0, 2229.3399999999965, 5.227724466339354, 29.263968012928625, 2.2578290093710733], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -80", 2, 0, 0.0, 1128.5, 1062, 1195, 1128.5, 1195.0, 1195.0, 1195.0, 0.00149862014550103, 0.00501247460775491, 5.224681561951833E-4], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 15160, 0, 0.0, 1199.4186675461758, 651, 7707, 1134.0, 1443.0, 1623.0, 2219.3899999999994, 4.210419900510777, 37.38311641061148, 1.5419018190347085], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 9719, 0, 0.0, 1852.0437287786776, 1186, 8604, 1773.0, 2142.0, 2371.0, 3119.5999999999985, 2.6991074255308516, 198.4085981630573, 0.9937143549073544], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80", 1, 0, 0.0, 1429.0, 1429, 1429, 1429.0, 1429.0, 1429.0, 1429.0, 0.6997900629811056, 2.8674991252624213, 0.2747222708187544], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77", 1, 0, 0.0, 1058.0, 1058, 1058, 1058.0, 1058.0, 1058.0, 1058.0, 0.945179584120983, 3.8730210302457464, 0.37105682892249525], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 15191, 0, 0.0, 1188.0242248699803, 624, 8138, 1121.0, 1421.0, 1602.0, 2256.24, 4.2192499006361235, 17.28903572565349, 1.6563852148981657], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79", 2, 0, 0.0, 910.5, 844, 977, 910.5, 977.0, 977.0, 977.0, 0.003411863047817261, 0.013980641942032445, 0.0013394227980688853], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -79", 2, 0, 0.0, 1388.5, 1000, 1777, 1388.5, 1777.0, 1777.0, 1777.0, 0.005386784601337538, 0.04780245280503341, 0.0019726994389663837], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 2716, 0, 0.0, 6631.331369661266, 5120, 15438, 6382.0, 7256.3, 7805.950000000003, 12078.49, 0.7535717664737698, 430.13550467744784, 0.33483901732965354], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 15092, 0, 0.0, 1183.240392260795, 658, 8680, 1124.0, 1428.0, 1599.3499999999985, 2109.0, 4.191599303992323, 17.175733085499793, 1.6455301955126114], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 15133, 0, 0.0, 1188.9054384457768, 649, 8163, 1122.0, 1427.6000000000004, 1616.0, 2222.3199999999997, 4.203126584018787, 17.22296791654573, 1.6500555534917503], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -78", 1, 0, 0.0, 866.0, 866, 866, 866.0, 866.0, 866.0, 866.0, 1.1547344110854503, 10.261799942263279, 0.4228763712471132], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 15014, 0, 0.0, 1195.0355001998134, 658, 9334, 1131.0, 1435.0, 1601.0, 2132.0, 4.169641709080982, 37.06138936884735, 1.5269683993216485], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78", 1, 0, 0.0, 1042.0, 1042, 1042, 1042.0, 1042.0, 1042.0, 1042.0, 0.9596928982725528, 3.93249160268714, 0.3767544385796545], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 7659, 0, 0.0, 2350.317534926226, 1614, 9702, 2256.0, 2680.0, 2926.0, 3803.799999999994, 2.126685951877309, 625.0051323128084, 0.8909651106985992], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 14995, 0, 0.0, 1200.9689229743267, 673, 9456, 1133.0, 1449.0, 1621.0, 2203.039999999999, 4.16460450005027, 36.98849393479998, 1.525123718280128], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 15185, 0, 0.0, 1191.4651300625635, 668, 8663, 1123.0, 1431.0, 1602.699999999999, 2208.4199999999983, 4.217350320863011, 17.281251900723824, 1.6556394814325495], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 5616, 0, 0.0, 3205.9255698005604, 2267, 10726, 3083.0, 3604.0, 3995.2999999999993, 7318.32, 1.5590005074524442, 112.6763518911001, 0.604417188924434], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78", 1, 0, 0.0, 1080.0, 1080, 1080, 1080.0, 1080.0, 1080.0, 1080.0, 0.9259259259259259, 3.794126157407407, 0.36349826388888884], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -80", 2, 0, 0.0, 1354.5, 1154, 1555, 1354.5, 1555.0, 1555.0, 1555.0, 0.004799408712846578, 0.04257834809751439, 0.0017575959641772134], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -77", 1, 1, 100.0, 1010.0, 1010, 1010, 1010.0, 1010.0, 1010.0, 1010.0, 0.9900990099009901, 1.5837716584158417, 0.3451810024752475], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 5756, 1, 0.017373175816539264, 3127.1111883252297, 1, 10510, 3001.5, 3537.3, 3848.1499999999996, 6197.610000000008, 1.598132439534176, 587.1257293466161, 1.9648913489975854], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -79", 1, 0, 0.0, 1254.0, 1254, 1254, 1254.0, 1254.0, 1254.0, 1254.0, 0.7974481658692185, 2.667246062599681, 0.27801659688995217], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 10281, 0, 0.0, 1750.7871802353839, 1073, 10215, 1661.0, 2032.800000000001, 2241.0, 3021.6200000000026, 2.8551512694189722, 204.9443508048251, 1.6255402246789654], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -79", 3, 0, 0.0, 968.6666666666666, 827, 1107, 972.0, 1107.0, 1107.0, 1107.0, 0.001772369817959896, 0.005275569536271253, 5.815588465180909E-4], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 18827, 1, 0.005311520688373081, 1198.3024911031916, 1, 8881, 1130.0, 1444.0, 1620.5999999999985, 2237.1600000000035, 5.2287389288181085, 28.894142847563803, 2.2434669924572517], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 15005, 0, 0.0, 1193.1910696434531, 690, 9295, 1119.0, 1430.3999999999996, 1603.0, 2219.880000000001, 4.167644579492856, 13.939631528088897, 1.452977651248974], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -78", 3, 0, 0.0, 2874.0, 1277, 5957, 1388.0, 5957.0, 5957.0, 5957.0, 9.639232447198694E-4, 0.0032240596808257352, 3.360552718408139E-4], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -80", 18742, 0, 0.0, 1197.0044819122782, 608, 8546, 1129.0, 1448.0, 1625.0, 2270.0, 5.204987701265588, 28.45646041508888, 2.221333713181905], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -80", 1, 0, 0.0, 1141.0, 1141, 1141, 1141.0, 1141.0, 1141.0, 1141.0, 0.8764241893076249, 2.931399265994741, 0.3055502300613497], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 15235, 0, 0.0, 1189.7321956022392, 598, 7595, 1121.0, 1431.0, 1614.0, 2249.279999999999, 4.230837375331233, 14.150994150888156, 1.4750087333918458], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -79", 1, 0, 0.0, 1168.0, 1168, 1168, 1168.0, 1168.0, 1168.0, 1168.0, 0.8561643835616438, 2.8636357555650687, 0.2984869970034247], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 15063, 1, 0.006638783774812454, 1191.0268206864448, 1, 8269, 1121.0, 1436.6000000000004, 1607.0, 2270.6800000000076, 4.183439213070171, 13.991606457373662, 1.4584841787754406], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -80", 1, 0, 0.0, 2025.0, 2025, 2025, 2025.0, 2025.0, 2025.0, 2025.0, 0.4938271604938272, 1.4699074074074074, 0.16203703703703703], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -78", 1, 0, 0.0, 1217.0, 1217, 1217, 1217.0, 1217.0, 1217.0, 1217.0, 0.8216926869350862, 13.714404016023007, 0.7157713640098603], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -77", 18737, 0, 0.0, 1196.1136254469748, 588, 8318, 1128.0, 1455.0, 1627.0, 2237.239999999998, 5.204013898108313, 28.65437157728879, 2.2288969261822698], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 3, 60.0, 9.677575444765238E-4], "isController": false}, {"data": ["Was not a proper XML response", 2, 40.0, 6.451716963176825E-4], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 309995, 5, "502/Bad Gateway", 3, "Was not a proper XML response", 2, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77", 1, 1, "Was not a proper XML response", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -77", 1, 1, "Was not a proper XML response", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 5756, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 18827, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 15063, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
