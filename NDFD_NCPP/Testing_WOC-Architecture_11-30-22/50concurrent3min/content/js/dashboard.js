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

    var data = {"OkPercent": 83.75920144910779, "KoPercent": 16.240798550892205};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.1648360118703511, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -77"], "isController": false}, {"data": [0.27419354838709675, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -79"], "isController": false}, {"data": [0.3194444444444444, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77"], "isController": false}, {"data": [0.09447983014861996, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -78"], "isController": false}, {"data": [0.14705882352941177, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -79"], "isController": false}, {"data": [0.057692307692307696, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -77"], "isController": false}, {"data": [0.04870892018779343, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -79"], "isController": false}, {"data": [0.06666666666666667, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -78"], "isController": false}, {"data": [0.14273927392739275, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -80"], "isController": false}, {"data": [0.2698161065313887, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.015151515151515152, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -79"], "isController": false}, {"data": [0.03333333333333333, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -80"], "isController": false}, {"data": [0.10512273212379936, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -77"], "isController": false}, {"data": [0.10416666666666667, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -78"], "isController": false}, {"data": [0.0024005486968449933, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}, {"data": [0.21666666666666667, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80"], "isController": false}, {"data": [0.023809523809523808, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -77"], "isController": false}, {"data": [0.27906976744186046, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -78"], "isController": false}, {"data": [0.3232951717272275, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -79"], "isController": false}, {"data": [0.28125, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_CityLevel1234_Summaries_24hourly_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.3149801587301587, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80"], "isController": false}, {"data": [0.3346534653465347, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79"], "isController": false}, {"data": [0.25, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -77"], "isController": false}, {"data": [0.15, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -78"], "isController": false}, {"data": [0.09798728813559322, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -79"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -77"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78"], "isController": false}, {"data": [0.0732662192393736, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.10159574468085106, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -80"], "isController": false}, {"data": [0.3191117764471058, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77"], "isController": false}, {"data": [0.13162970106075217, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.2619047619047619, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -80"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -77"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -79"], "isController": false}, {"data": [0.23240589198036007, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP "], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -79"], "isController": false}, {"data": [0.0020161290322580645, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.018518518518518517, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST"], "isController": false}, {"data": [0.13458401305057097, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -79"], "isController": false}, {"data": [0.125, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -78"], "isController": false}, {"data": [0.01751592356687898, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -77"], "isController": false}, {"data": [0.021739130434782608, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -80"], "isController": false}, {"data": [0.05, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -80"], "isController": false}, {"data": [0.14332247557003258, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -80"], "isController": false}, {"data": [0.09090909090909091, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -80"], "isController": false}, {"data": [0.13584288052373159, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -78"], "isController": false}, {"data": [0.016051364365971106, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -77"], "isController": false}, {"data": [0.20270270270270271, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80"], "isController": false}, {"data": [0.058823529411764705, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -77"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 25947, 4214, 16.240798550892205, 4939.326164874547, 9, 91040, 1493.0, 12032.900000000001, 14432.800000000003, 38411.98, 9.53891740070291, 851.343782627237, 3.7565129537024102], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_1Point-wspd-wdir_REST 37 -79", 2, 0, 0.0, 5909.0, 2243, 9575, 5909.0, 9575.0, 9575.0, 9575.0, 0.0836540070269366, 0.7996555154132508, 0.029736385310356366], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -77", 7, 0, 0.0, 2885.714285714286, 1589, 3897, 2986.0, 3897.0, 3897.0, 3897.0, 0.04151567809929364, 0.09367669888085595, 0.01317636267799847], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79", 31, 5, 16.129032258064516, 1235.8064516129034, 16, 3338, 1304.0, 2061.2000000000003, 3180.7999999999997, 3338.0, 0.18246886257151604, 1.2742470216372754, 0.06967316920455348], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -78", 1, 0, 0.0, 5758.0, 5758, 5758, 5758.0, 5758.0, 5758.0, 5758.0, 0.1736714136853074, 0.5142302014588399, 0.05512032172629385], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -79", 9, 0, 0.0, 3922.0, 2290, 5132, 4103.0, 5132.0, 5132.0, 5132.0, 0.07033392986925704, 0.20825437047225326, 0.022322780476082556], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77", 36, 5, 13.88888888888889, 1131.6666666666667, 13, 2622, 1022.0, 2417.500000000001, 2596.5, 2622.0, 0.22763199494151123, 1.5078890689219095, 0.0869180761934872], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 942, 310, 32.90870488322717, 2447.974522292994, 12, 43524, 1428.5, 5126.3, 6774.799999999961, 41442.66999999999, 4.552286049804523, 28.82586879134872, 1.6181954317664513], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -79", 17, 3, 17.647058823529413, 2217.8235294117653, 17, 4999, 1990.0, 4795.0, 4999.0, 4999.0, 0.12283592011329807, 0.8444334441566231, 0.043664330977773926], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -77", 26, 8, 30.76923076923077, 2393.9999999999995, 15, 11147, 2055.0, 7219.500000000002, 10545.349999999999, 11147.0, 0.16594650140097142, 0.9463700100365721, 0.05898879541987656], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 852, 25, 2.9342723004694835, 10863.976525821583, 16, 31683, 11909.5, 13196.8, 13490.05, 13976.070000000002, 4.471666325518414, 2908.809754863659, 1.6332062556092646], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -79", 3, 0, 0.0, 4362.0, 4329, 4409, 4348.0, 4409.0, 4409.0, 4409.0, 0.1162295145480609, 0.35572587753283486, 0.03757028253457828], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -78", 15, 0, 0.0, 4098.533333333333, 1143, 11254, 3533.0, 8293.000000000002, 11254.0, 11254.0, 0.104834989726171, 0.24626667313149103, 0.03388709140562755], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 606, 29, 4.785478547854786, 3425.0957095709578, 17, 14189, 2966.5, 7141.800000000005, 8183.099999999999, 11309.109999999973, 3.2041622384721538, 8.291825205944091, 1.0357204110686358], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -78", 9, 0, 0.0, 4097.444444444444, 2848, 5962, 3589.0, 5962.0, 5962.0, 5962.0, 0.058156065031404275, 0.15560028771097728, 0.01845773548359999], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -80", 8, 0, 0.0, 3861.5, 2750, 5169, 3784.5, 5169.0, 5169.0, 5169.0, 0.04751299183370453, 0.1406829992576095, 0.015079806978470675], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 1577, 429, 27.203551046290425, 5583.058972733042, 13, 33159, 211.0, 13264.800000000003, 14052.0, 24057.44, 8.31790538580418, 2663.9998600193967, 3.0379849748933228], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 627, 0, 0.0, 3343.6283891547027, 395, 6738, 3305.0, 4609.0, 5066.2, 5763.160000000002, 3.4046851073534685, 9.565039344611693, 1.0805885350487083], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -80", 15, 1, 6.666666666666667, 3829.0666666666666, 22, 6113, 3995.0, 6091.4, 6113.0, 6113.0, 0.09551037561047049, 0.24200936320048902, 0.03087298274127513], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 937, 329, 35.11205976520811, 2450.4887940234794, 13, 44304, 1225.0, 5494.600000000001, 7409.2, 40825.4, 4.560298633857176, 28.045407891518916, 1.621043655003918], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -78", 24, 8, 33.333333333333336, 3624.708333333334, 19, 41712, 1400.5, 7093.5, 33337.5, 41712.0, 0.12618495559866874, 0.727576210455475, 0.04485480843546428], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 1458, 320, 21.947873799725652, 6141.482853223583, 9, 30247, 7115.0, 8888.7, 9815.0, 22981.810000000005, 7.708127369138942, 447.73462033970213, 2.7550533370164576], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80", 30, 5, 16.666666666666668, 1142.5333333333333, 16, 1978, 1181.5, 1897.7, 1976.9, 1978.0, 0.17634092578986038, 1.39207154665687, 0.06733330271858927], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -77", 21, 10, 47.61904761904762, 1733.8095238095234, 16, 6140, 1135.0, 5696.6, 6100.999999999999, 6140.0, 0.1406592228912838, 0.677746685298432, 0.04999995813713604], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77", 43, 6, 13.953488372093023, 1244.3488372093025, 17, 2841, 1149.0, 2532.0000000000005, 2806.6, 2841.0, 0.2558549124143184, 1.4988651551641041, 0.09769460034570164], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -78", 1, 0, 0.0, 942.0, 942, 942, 942.0, 942.0, 942.0, 942.0, 1.0615711252653928, 10.113953025477707, 0.3773553609341826], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 2009, 307, 15.28123444499751, 1049.5495271279265, 9, 4183, 991.0, 1943.0, 2261.5, 2914.4000000000033, 11.07253086419753, 90.56786700321042, 4.227890203028549], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -79", 24, 5, 20.833333333333332, 3659.625, 18, 40162, 1526.5, 7605.0, 32598.25, 40162.0, 0.1289982746480766, 0.7903243903487791, 0.04585485544130847], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79", 32, 5, 15.625, 1157.5625000000002, 12, 2426, 1101.5, 2066.9, 2281.6999999999994, 2426.0, 0.1931282552672714, 1.5572969475173966, 0.07374330840771788], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 350, 0, 0.0, 27654.708571428575, 18958, 38532, 26658.5, 34045.5, 35847.54999999996, 38410.47, 1.7615824043083272, 1161.9306166560762, 0.6107048374311096], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 138, 138, 100.0, 65260.88405797103, 13, 91040, 90039.0, 90048.1, 90051.1, 90663.64999999998, 0.7267901156544271, 0.2494637947923908, 0.3151316517095367], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 2016, 319, 15.823412698412698, 1058.8933531746025, 9, 3495, 1031.5, 1939.6, 2243.0499999999993, 2847.49, 11.134676564156946, 88.1920144009312, 4.251619664634146], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 2020, 314, 15.544554455445544, 1028.5742574257392, 10, 3617, 996.0, 1900.000000000001, 2193.7999999999993, 2806.6499999999987, 11.10256128393976, 91.80296174219524, 4.239356896504342], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -77", 2, 1, 50.0, 560.5, 39, 1082, 560.5, 1082.0, 1082.0, 1082.0, 0.12973533990659056, 0.6509572035547483, 0.04611685910742086], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -78", 20, 3, 15.0, 2345.15, 26, 6401, 2093.0, 4605.900000000001, 6311.699999999999, 6401.0, 0.14524750174297002, 1.0558032391100687, 0.05163094788519638], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 944, 331, 35.063559322033896, 2428.14406779661, 13, 43131, 1235.5, 5226.5, 7402.0, 40700.54999999998, 4.575616423748613, 27.5746996873046, 1.6264886506293896], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -77", 1, 0, 0.0, 839.0, 839, 839, 839.0, 839.0, 839.0, 839.0, 1.1918951132300357, 12.611507374851014, 0.4551083879618594], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78", 33, 3, 9.090909090909092, 1188.787878787879, 15, 2556, 1109.0, 2135.0, 2339.699999999999, 2556.0, 0.1992525012226858, 1.4952487429733303, 0.07608176560358414], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 894, 34, 3.8031319910514543, 10177.395973154362, 15, 25879, 11385.0, 14168.5, 14497.5, 14943.449999999999, 4.771028012445232, 952.9572581231555, 1.9475485441426825], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 940, 321, 34.148936170212764, 2342.044680851062, 14, 43419, 1279.5, 5171.999999999998, 6979.399999999996, 39710.960000000036, 4.609379597120609, 27.59877526577487, 1.6384904036639665], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 2004, 309, 15.419161676646707, 1070.072355289422, 9, 3670, 999.0, 2028.0, 2366.75, 2985.2000000000016, 11.038463868860406, 93.87211132826486, 4.21488219992619], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 1037, 171, 16.48987463837994, 8740.283510125359, 12, 44507, 10147.0, 14178.2, 19718.299999999992, 39832.19999999995, 5.567456418681313, 505.29786244168133, 2.098670095323229], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78", 42, 6, 14.285714285714286, 1255.0, 16, 3791, 1222.5, 2218.5, 2732.85, 3791.0, 0.24923597305877812, 1.7949069815743408, 0.0951672514316233], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -79", 1, 1, 100.0, 22.0, 22, 22, 22.0, 22.0, 22.0, 22.0, 45.45454545454545, 22.54971590909091, 17.356178977272727], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -80", 21, 8, 38.095238095238095, 4424.0, 18, 41139, 2336.0, 9982.800000000001, 38071.89999999996, 41139.0, 0.1133878674981777, 0.5909098195243109, 0.04030584352474285], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -77", 12, 0, 0.0, 3949.583333333333, 58, 7054, 3828.5, 6982.900000000001, 7054.0, 7054.0, 0.08771801581848218, 0.23267260803935616, 0.028354163316325787], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -77", 15, 0, 0.0, 4177.4, 2110, 6105, 4220.0, 5470.200000000001, 6105.0, 6105.0, 0.09900663344444077, 0.29315245371439885, 0.03142300377875318], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -79", 12, 0, 0.0, 3531.8333333333335, 939, 6318, 3856.5, 6126.000000000001, 6318.0, 6318.0, 0.07721361790841179, 0.20198197705468654, 0.024958698757504196], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 611, 237, 38.788870703764324, 15818.86088379705, 16, 66239, 148.0, 54257.20000000002, 58967.4, 63063.92, 2.6532686011064697, 18.931594604658635, 3.194804868324489], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -78", 1, 0, 0.0, 3903.0, 3903, 3903, 3903.0, 3903.0, 3903.0, 3903.0, 0.25621316935690497, 0.7841524148091212, 0.08281890532923392], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -80", 2, 1, 50.0, 1916.0, 23, 3809, 1916.0, 3809.0, 3809.0, 3809.0, 0.13237143424449002, 0.6646364542656694, 0.04705390826659607], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -79", 9, 0, 0.0, 4356.555555555556, 3221, 5817, 4241.0, 5817.0, 5817.0, 5817.0, 0.05807650611739198, 0.17196090483196533, 0.018432484851711322], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 1240, 0, 0.0, 7213.82903225807, 571, 10094, 6830.5, 8691.5, 9179.2, 9997.849999999999, 6.741328694139393, 480.2125204720289, 3.7656640752419266], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 621, 0, 0.0, 3394.2302737520145, 460, 6415, 3373.0, 4622.8, 5015.6, 5780.519999999999, 3.377441302680742, 9.581335455791415, 1.0719418196984778], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 373, 82, 21.98391420911528, 25381.16621983916, 14, 54479, 30049.0, 38400.8, 49164.200000000004, 53806.899999999994, 1.7699954919685863, 2226.4499753096306, 1.0163645989038366], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 613, 37, 6.035889070146819, 3522.0538336052173, 14, 14202, 3163.0, 7446.8, 8451.8, 12723.540000000005, 3.2408484361452405, 8.423360113508998, 1.0475789378555418], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -78", 12, 0, 0.0, 3727.25, 45, 8251, 3703.0, 7405.900000000003, 8251.0, 8251.0, 0.07764678477605373, 0.22012560176258203, 0.02509871656335331], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -80", 628, 0, 0.0, 3447.993630573245, 438, 6643, 3508.0, 4719.8, 5066.799999999999, 5724.490000000001, 3.4307753661587883, 9.807536591978105, 1.0888691347671935], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -77", 4, 0, 0.0, 4254.0, 1682, 6814, 4260.0, 6814.0, 6814.0, 6814.0, 0.04017556722878981, 0.12295920673342506, 0.012986438235087331], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -80", 23, 7, 30.434782608695652, 2752.4782608695646, 12, 10273, 2354.0, 8139.000000000007, 10242.199999999999, 10273.0, 0.15061128536909588, 0.844329986461355, 0.05353760534604579], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -80", 10, 0, 0.0, 4033.4, 1104, 8055, 4180.5, 7827.900000000001, 8055.0, 8055.0, 0.06385451387558587, 0.19542973289656845, 0.020640472746893478], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 614, 29, 4.723127035830619, 3455.3517915309444, 15, 13866, 3048.5, 6948.5, 8671.25, 13246.050000000005, 3.2323445026453634, 8.764709487115368, 1.0448301077886868], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -79", 11, 2, 18.181818181818183, 2692.0, 25, 5895, 3540.0, 5592.4000000000015, 5895.0, 5895.0, 0.07242798353909466, 0.1349408436213992, 0.023411779835390948], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -80", 9, 0, 0.0, 3439.444444444444, 2320, 4812, 3368.0, 4812.0, 4812.0, 4812.0, 0.06977609626000124, 0.18669042768870556, 0.022145733676269923], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 611, 42, 6.873977086743044, 3559.021276595749, 14, 14585, 3085.0, 7215.600000000003, 8737.999999999985, 13390.48, 3.2702477038686335, 8.669378241479158, 1.0570820214653491], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -78", 14, 0, 0.0, 3677.0, 2744, 5405, 3775.5, 4814.5, 5405.0, 5405.0, 0.09158048289080335, 0.23756243008811348, 0.0290660712299913], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -77", 623, 0, 0.0, 3470.094703049758, 447, 6298, 3482.0, 4783.0, 5173.799999999999, 6033.199999999999, 3.39943033623258, 9.631054979510656, 1.078920761011317], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80", 37, 7, 18.91891891891892, 1152.9459459459456, 14, 2591, 1297.0, 2074.0000000000005, 2519.9, 2591.0, 0.2339536265973658, 1.3871977967259137, 0.0893319023433301], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -77", 17, 1, 5.882352941176471, 3250.2352941176473, 25, 7432, 3267.0, 6984.0, 7432.0, 7432.0, 0.12893146155187973, 0.3549170288123895, 0.04167608766960175], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503/Service Unavailable", 3825, 90.7688656858092, 14.741588622962192], "isController": false}, {"data": ["502/Bad Gateway", 133, 3.1561461794019934, 0.5125833429683586], "isController": false}, {"data": ["504/Gateway Time-out", 100, 2.3730422401518747, 0.38540100975064556], "isController": false}, {"data": ["502/Proxy Error", 156, 3.7019458946369244, 0.6012255752110071], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 25947, 4214, "503/Service Unavailable", 3825, "502/Proxy Error", 156, "502/Bad Gateway", 133, "504/Gateway Time-out", 100, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79", 31, 5, "503/Service Unavailable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77", 36, 5, "503/Service Unavailable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 942, 310, "503/Service Unavailable", 289, "502/Bad Gateway", 11, "502/Proxy Error", 10, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -79", 17, 3, "503/Service Unavailable", 2, "502/Proxy Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -77", 26, 8, "503/Service Unavailable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 852, 25, "503/Service Unavailable", 21, "502/Proxy Error", 3, "502/Bad Gateway", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 606, 29, "503/Service Unavailable", 29, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 1577, 429, "503/Service Unavailable", 383, "502/Proxy Error", 25, "502/Bad Gateway", 21, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -80", 15, 1, "503/Service Unavailable", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 937, 329, "503/Service Unavailable", 297, "502/Proxy Error", 18, "502/Bad Gateway", 14, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -78", 24, 8, "503/Service Unavailable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 1458, 320, "503/Service Unavailable", 268, "502/Proxy Error", 30, "502/Bad Gateway", 22, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80", 30, 5, "503/Service Unavailable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -77", 21, 10, "503/Service Unavailable", 8, "502/Bad Gateway", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77", 43, 6, "503/Service Unavailable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 2009, 307, "503/Service Unavailable", 307, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -79", 24, 5, "503/Service Unavailable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79", 32, 5, "503/Service Unavailable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 138, 138, "504/Gateway Time-out", 100, "503/Service Unavailable", 38, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 2016, 319, "503/Service Unavailable", 319, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 2020, 314, "503/Service Unavailable", 314, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -77", 2, 1, "503/Service Unavailable", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -78", 20, 3, "503/Service Unavailable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 944, 331, "503/Service Unavailable", 301, "502/Bad Gateway", 15, "502/Proxy Error", 15, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78", 33, 3, "503/Service Unavailable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 894, 34, "503/Service Unavailable", 23, "502/Bad Gateway", 6, "502/Proxy Error", 5, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 940, 321, "503/Service Unavailable", 295, "502/Proxy Error", 14, "502/Bad Gateway", 12, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 2004, 309, "503/Service Unavailable", 309, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 1037, 171, "503/Service Unavailable", 157, "502/Proxy Error", 9, "502/Bad Gateway", 5, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78", 42, 6, "503/Service Unavailable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -79", 1, 1, "503/Service Unavailable", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -80", 21, 8, "503/Service Unavailable", 7, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 611, 237, "503/Service Unavailable", 199, "502/Bad Gateway", 20, "502/Proxy Error", 18, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -80", 2, 1, "503/Service Unavailable", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 373, 82, "503/Service Unavailable", 71, "502/Proxy Error", 8, "502/Bad Gateway", 3, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 613, 37, "503/Service Unavailable", 37, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -80", 23, 7, "503/Service Unavailable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 614, 29, "503/Service Unavailable", 29, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -79", 11, 2, "503/Service Unavailable", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 611, 42, "503/Service Unavailable", 42, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80", 37, 7, "503/Service Unavailable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -77", 17, 1, "503/Service Unavailable", 1, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
