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

    var data = {"OkPercent": 99.66843867773345, "KoPercent": 0.3315613222665532};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4484808965418154, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3676680972818312, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -80"], "isController": false}, {"data": [0.35638297872340424, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -79"], "isController": false}, {"data": [0.37257617728531855, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -78"], "isController": false}, {"data": [0.5039840637450199, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -77"], "isController": false}, {"data": [0.39361702127659576, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -80"], "isController": false}, {"data": [0.42559109874826145, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79"], "isController": false}, {"data": [0.42220744680851063, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -78"], "isController": false}, {"data": [0.43949468085106386, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -79"], "isController": false}, {"data": [0.4168975069252078, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77"], "isController": false}, {"data": [0.3930197268588771, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -78"], "isController": false}, {"data": [0.3916030534351145, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -79"], "isController": false}, {"data": [0.38365650969529086, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -80"], "isController": false}, {"data": [0.4362549800796813, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -80"], "isController": false}, {"data": [0.38467374810318666, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.37679083094555876, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -79"], "isController": false}, {"data": [0.4114730878186969, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -78"], "isController": false}, {"data": [0.3780313837375178, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -77"], "isController": false}, {"data": [0.46941489361702127, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -78"], "isController": false}, {"data": [0.4350132625994695, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -77"], "isController": false}, {"data": [0.4576719576719577, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.4649006622516556, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -79"], "isController": false}, {"data": [0.39229671897289586, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -80"], "isController": false}, {"data": [0.3919330289193303, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -77"], "isController": false}, {"data": [0.34779299847793, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -78"], "isController": false}, {"data": [0.37889518413597734, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -77"], "isController": false}, {"data": [0.8883772956661984, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}, {"data": [0.39015691868758917, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -79"], "isController": false}, {"data": [0.4533426183844011, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80"], "isController": false}, {"data": [0.39285714285714285, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -78"], "isController": false}, {"data": [0.4205607476635514, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -80"], "isController": false}, {"data": [0.37784522003034904, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -77"], "isController": false}, {"data": [0.37534626038781166, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77"], "isController": false}, {"data": [0.41539634146341464, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -78"], "isController": false}, {"data": [0.4026243093922652, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78"], "isController": false}, {"data": [0.38763197586727, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -79"], "isController": false}, {"data": [0.4102920723226704, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_CityLevel1234_Summaries_24hourly_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.4702627939142462, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80"], "isController": false}, {"data": [0.41046831955922863, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79"], "isController": false}, {"data": [0.36798179059180575, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -77"], "isController": false}, {"data": [0.3546423135464231, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -78"], "isController": false}, {"data": [0.4010654490106545, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -79"], "isController": false}, {"data": [0.36130374479889044, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -77"], "isController": false}, {"data": [0.4015256588072122, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78"], "isController": false}, {"data": [2.6567481402763017E-4, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.41788079470198675, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -77"], "isController": false}, {"data": [0.4419889502762431, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -79"], "isController": false}, {"data": [0.3769113149847095, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -80"], "isController": false}, {"data": [0.4097222222222222, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -78"], "isController": false}, {"data": [0.4451058201058201, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -79"], "isController": false}, {"data": [0.4513888888888889, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -77"], "isController": false}, {"data": [0.44562334217506633, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -78"], "isController": false}, {"data": [0.4488243430152144, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77"], "isController": false}, {"data": [0.0022396416573348264, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.40083217753120665, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78"], "isController": false}, {"data": [0.435506241331484, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -79"], "isController": false}, {"data": [0.41818181818181815, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -80"], "isController": false}, {"data": [0.40404040404040403, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -77"], "isController": false}, {"data": [0.46941489361702127, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -77"], "isController": false}, {"data": [0.4106382978723404, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP "], "isController": false}, {"data": [0.39903181189488246, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -80"], "isController": false}, {"data": [0.40767045454545453, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -78"], "isController": false}, {"data": [0.3915022761760243, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -80"], "isController": false}, {"data": [0.47015915119363394, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -79"], "isController": false}, {"data": [0.023243045387994144, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.42980132450331127, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -78"], "isController": false}, {"data": [0.3924501424501424, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST"], "isController": false}, {"data": [0.38483547925608014, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -79"], "isController": false}, {"data": [0.419054441260745, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -78"], "isController": false}, {"data": [0.47820343461030385, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -80"], "isController": false}, {"data": [0.4187853107344633, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -77"], "isController": false}, {"data": [0.3544207317073171, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -77"], "isController": false}, {"data": [0.38257575757575757, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -80"], "isController": false}, {"data": [0.45612708018154313, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -78"], "isController": false}, {"data": [0.3972602739726027, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -79"], "isController": false}, {"data": [0.3908701854493581, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -80"], "isController": false}, {"data": [0.39574468085106385, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -80"], "isController": false}, {"data": [0.3806818181818182, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -79"], "isController": false}, {"data": [0.4613848202396804, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -79"], "isController": false}, {"data": [0.45750332005312083, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -80"], "isController": false}, {"data": [0.365, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -78"], "isController": false}, {"data": [0.4661803713527852, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -78"], "isController": false}, {"data": [0.46879150066401065, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -77"], "isController": false}, {"data": [0.45429362880886426, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80"], "isController": false}, {"data": [0.3914285714285714, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -77"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 90481, 300, 0.3315613222665532, 2783.667797659155, 104, 60174, 7449.5, 15033.500000000007, 24612.450000000008, 60059.990000000005, 34.65036187552585, 1537.771197812969, 13.3611025115251], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -80", 699, 0, 0.0, 1266.1673819742489, 157, 3213, 1404.0, 1838.0, 1976.0, 2748.0, 3.902281075890714, 11.844103670391233, 1.2613818712107678], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -79", 658, 0, 0.0, 1372.6565349544073, 140, 3880, 1702.5, 2206.6000000000004, 2374.2999999999997, 3275.879999999998, 3.683529918883969, 18.5973235803295, 1.3093797758532857], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -78", 722, 0, 0.0, 1292.5678670360087, 135, 3126, 1465.0, 2021.1000000000001, 2273.65, 2957.349999999999, 3.9959487057443144, 38.52428614617867, 1.525796820259792], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -77", 753, 0, 0.0, 1051.038512616203, 135, 2794, 1030.0, 1800.4, 2103.7999999999993, 2483.140000000004, 4.184542201080313, 10.759222586177673, 1.32810177280381], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -80", 658, 0, 0.0, 1323.420972644377, 118, 3466, 1617.0, 2263.0, 2565.7999999999993, 3211.8099999999986, 3.664676528248084, 17.981113671109206, 1.3026779846506862], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79", 719, 0, 0.0, 1185.0097357440895, 144, 3278, 1392.0, 1949.0, 2108.0, 2719.7999999999984, 3.968867299624641, 35.41888040958269, 1.5154561661652683], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -78", 752, 0, 0.0, 1219.5226063829768, 143, 3686, 1198.0, 2122.0000000000005, 2423.55, 2912.1100000000006, 4.175991381464596, 11.318096737784392, 1.3253878896249938], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -79", 752, 0, 0.0, 1182.2380319148938, 148, 3188, 1157.0, 2053.8, 2462.4000000000005, 2851.7000000000003, 4.175203069218426, 11.205438070134528, 1.3251376928671765], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77", 722, 0, 0.0, 1228.6288088642652, 104, 3718, 1422.5, 2000.1000000000001, 2225.2000000000003, 3333.609999999989, 4.00110834026046, 37.374435006234414, 1.527766954142422], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 659, 0, 0.0, 1329.3429438543235, 106, 3505, 1653.0, 2251.0, 2444.0, 3171.399999999999, 3.6709001782531194, 18.18349909654913, 1.3048902977384134], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -79", 655, 0, 0.0, 1320.395419847327, 130, 3985, 1533.0, 2281.3999999999996, 2555.599999999997, 2981.0799999999995, 3.6171258483678757, 17.585518665818988, 1.2857752039120183], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -80", 722, 0, 0.0, 1256.159279778393, 137, 3298, 1425.5, 2021.0, 2242.4, 2683.31, 3.9968335335440623, 36.347697011508885, 1.5261346793122346], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -80", 753, 0, 0.0, 1222.486055776893, 132, 5004, 1130.0, 2196.6, 2612.7999999999993, 3777.380000000002, 4.185891378064373, 11.180394746442271, 1.3285299783895714], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -77", 659, 0, 0.0, 1329.2169954476485, 138, 3463, 1534.0, 2195.0, 2389.0, 3181.7999999999997, 3.679221054747256, 18.78540757387753, 1.3078481093046885], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 1786, 0, 0.0, 10333.062150055986, 3259, 20960, 10356.5, 11756.8, 12335.849999999999, 13140.779999999999, 9.386217081233347, 3967.26809916294, 3.4281691292785856], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -79", 698, 0, 0.0, 1289.580229226362, 173, 3200, 1421.0, 1850.3000000000002, 1970.1, 2788.3799999999987, 3.8782948837622797, 11.465287385540295, 1.2536285219973775], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -78", 706, 0, 0.0, 1210.6855524079324, 152, 2977, 1376.5, 1812.6000000000008, 1966.3, 2440.1499999999974, 3.9234646526955763, 11.412630926876844, 1.2682292969162456], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 701, 0, 0.0, 1252.3495007132653, 151, 3017, 1410.0, 1834.4, 1959.9, 2407.980000000001, 3.913511944306426, 11.497342477306098, 1.2650121616849874], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -78", 752, 0, 0.0, 1125.2393617021282, 144, 2860, 1096.0, 1986.7, 2259.4, 2708.82, 4.168514412416852, 10.870244941796008, 1.3230148281596452], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -77", 754, 0, 0.0, 1178.9694960212212, 138, 3021, 1170.0, 2017.5, 2283.0, 2757.8500000000004, 4.181849442327637, 11.33687329453753, 1.3272471374575021], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -80", 756, 0, 0.0, 1149.636243386244, 149, 2941, 1166.5, 1975.8000000000004, 2249.45, 2659.7599999999984, 4.185536645591346, 11.198217998084397, 1.3284173923995968], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 1604, 0, 0.0, 11015.562967581043, 2717, 19991, 11076.5, 13592.5, 14247.25, 15581.900000000001, 8.44010629061538, 3592.806535129838, 3.082616945986477], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 755, 0, 0.0, 1147.06357615894, 130, 3604, 1112.0, 2054.3999999999996, 2337.6, 2893.1999999999907, 4.181342903347289, 10.992428801214528, 1.3270863706912785], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -80", 701, 0, 0.0, 1239.843081312411, 150, 3216, 1390.0, 1884.4, 2012.0, 3057.86, 3.9181054478992583, 11.740905277634939, 1.2664969758346234], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 657, 0, 0.0, 1326.7792998477928, 126, 3762, 1669.0, 2218.6000000000004, 2602.1000000000004, 3428.319999999998, 3.642472224070255, 17.124478118485683, 1.2947850483999732], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -78", 657, 0, 0.0, 1417.0060882800597, 130, 3868, 1686.0, 2295.8, 2500.0, 3291.5999999999985, 3.6519680049804615, 18.656049631607033, 1.2981605017703985], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -77", 706, 0, 0.0, 1252.9886685552392, 132, 2857, 1416.5, 1845.6000000000001, 1928.25, 2331.3599999999924, 3.9357787936224775, 11.785004686280523, 1.2722097467666407], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 19221, 0, 0.0, 920.6218719109314, 222, 15694, 413.0, 551.0, 6819.399999999987, 10149.0, 105.60234708509832, 1103.94015790596, 37.744588899556625], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -79", 701, 0, 0.0, 1254.4108416547788, 143, 2874, 1382.0, 1874.8000000000002, 2038.6999999999998, 2678.6400000000003, 3.9013802315227073, 11.492245980701803, 1.2610906803066562], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80", 718, 0, 0.0, 1145.5974930362124, 121, 3064, 1285.0, 1903.1, 2184.05, 2794.0699999999974, 3.9802870463276587, 36.8257973047137, 1.5198166358536274], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -78", 700, 0, 0.0, 1240.409999999999, 171, 2882, 1367.5, 1857.2999999999997, 2008.1499999999987, 2595.090000000001, 3.888478438387059, 11.39170118848566, 1.256920276470817], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -80", 749, 0, 0.0, 1243.7823765020023, 163, 3146, 1232.0, 2077.0, 2413.0, 2940.5, 4.147401644563803, 11.112264104418728, 1.316313998518785], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -77", 659, 0, 0.0, 1324.561456752655, 129, 3543, 1614.0, 2191.0, 2356.0, 3205.7999999999993, 3.692062905132472, 17.656160928632254, 1.3124129858088083], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77", 722, 0, 0.0, 1298.7119113573417, 144, 4235, 1460.5, 1996.4, 2237.3, 3639.199999999999, 3.9869457896858482, 36.203283803101755, 1.5223591833663737], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -78", 656, 0, 0.0, 1249.1646341463413, 118, 3301, 1525.5, 2156.6000000000004, 2342.6, 3115.9599999999964, 3.664804469273743, 16.61123537884078, 1.3027234636871508], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 724, 0, 0.0, 1270.7900552486176, 116, 3101, 1406.5, 2056.0, 2544.0, 3024.5, 3.9948133638645955, 35.85315573530223, 1.5253633059287663], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -79", 663, 0, 0.0, 1309.8823529411764, 120, 3538, 1578.0, 2198.8, 2362.7999999999997, 3109.84, 3.697074125499774, 17.396400327815606, 1.3141943180487479], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79", 719, 0, 0.0, 1194.16411682893, 146, 3788, 1371.0, 1916.0, 2182.0, 2996.5999999999976, 3.955548220278373, 36.11435790250041, 1.5103704630164492], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 900, 0, 0.0, 21083.56666666669, 11369, 26404, 21050.0, 24625.8, 25176.649999999998, 26112.3, 4.603015486589881, 1981.4453324783658, 1.5957719704486406], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 300, 300, 100.0, 60062.706666666665, 60036, 60174, 60066.0, 60077.9, 60087.0, 60117.91, 1.578166591265374, 0.5933536500362978, 0.6842831704314708], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 723, 0, 0.0, 1149.0829875518668, 116, 3122, 1283.0, 1937.6, 2475.1999999999994, 2794.6, 3.9856890060033408, 34.51246888764547, 1.5218792981907288], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 726, 0, 0.0, 1227.0716253443545, 153, 3195, 1425.5, 1964.6000000000001, 2140.95, 2895.2200000000003, 3.999933885390324, 36.78418775275065, 1.527318505066032], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -77", 659, 0, 0.0, 1368.723823975722, 106, 3404, 1668.0, 2256.0, 2425.0, 3079.0, 3.668897326548564, 18.298588445339554, 1.30417834654656], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -78", 657, 0, 0.0, 1362.5601217656013, 138, 3615, 1682.0, 2188.4, 2418.3, 3308.9399999999996, 3.6666015570499764, 17.46120019114323, 1.3033622722326088], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 657, 0, 0.0, 1337.3378995433782, 130, 3595, 1612.0, 2309.2000000000003, 2604.000000000001, 3187.739999999996, 3.6571314062421725, 18.990759193969907, 1.299995929562647], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -77", 721, 0, 0.0, 1322.3384188626912, 131, 3448, 1507.0, 2016.6000000000001, 2252.9, 3250.8999999999987, 3.988118614723404, 35.77022679831791, 1.5228070101141122], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78", 721, 0, 0.0, 1311.3689320388346, 108, 6643, 1453.0, 2045.8000000000002, 2435.9, 6138.6999999999925, 3.982765287521405, 35.8857453702425, 1.520762917403193], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 1882, 0, 0.0, 9653.429330499494, 1422, 11694, 9984.0, 11035.1, 11201.949999999999, 11460.51, 10.069555912252541, 1519.9620974618779, 4.110424190743713], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -77", 755, 0, 0.0, 1245.7403973509936, 136, 3612, 1192.0, 2119.8, 2555.599999999999, 3140.279999999998, 4.20514420024284, 11.318322497312606, 1.3346404932411358], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -79", 724, 0, 0.0, 1200.8950276243083, 112, 2894, 1372.0, 2054.0, 2229.25, 2738.25, 4.000906282638609, 35.41704586743406, 1.5276898012809532], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 654, 0, 0.0, 1397.2828746177386, 136, 3547, 1735.5, 2309.5, 2651.0, 3246.7500000000036, 3.6366062789844196, 18.44626743930649, 1.292699888232743], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -78", 720, 0, 0.0, 1222.9402777777798, 106, 3235, 1415.0, 1971.9, 2197.349999999999, 2820.3099999999968, 3.9911971928579746, 36.50130857220464, 1.523982521882293], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -79", 756, 0, 0.0, 1151.111111111112, 137, 3136, 1115.0, 1945.3000000000002, 2248.7999999999997, 2784.029999999999, 4.1972484704471515, 11.049960997790338, 1.33213452431184], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -77", 720, 0, 0.0, 1132.0833333333326, 116, 3329, 1280.5, 1916.8, 2099.6499999999996, 2566.1799999999985, 3.9667891596467353, 35.24509492919006, 1.5146626576385482], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -78", 754, 0, 0.0, 1198.383289124669, 151, 3182, 1162.5, 2127.0, 2400.75, 3011.1500000000005, 4.193291845326482, 11.312540059423505, 1.3308787595030336], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 723, 0, 0.0, 1167.0940525587814, 106, 3593, 1334.0, 1948.4, 2120.2, 2886.12, 3.989009533898305, 34.92234116893704, 1.5231471950724975], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 1786, 0, 0.0, 10009.888017917141, 698, 14668, 10306.5, 11465.6, 11560.25, 11734.65, 9.715392314722138, 879.4137828628857, 3.6622474936354936], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78", 721, 0, 0.0, 1248.4285714285716, 127, 4191, 1431.0, 1947.2000000000003, 2467.8, 3115.399999999999, 3.968821903933592, 34.94530635032147, 1.5154388324590182], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -79", 721, 0, 0.0, 1210.6699029126232, 121, 4312, 1368.0, 1979.8000000000002, 2204.7999999999997, 3750.5199999999963, 3.9912977530266884, 35.798741120262065, 1.524020919368589], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -80", 660, 0, 0.0, 1257.3181818181813, 117, 3006, 1492.5, 2201.9, 2342.1499999999987, 2786.469999999999, 3.6608702887095435, 18.042206827037745, 1.3013249854397204], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -77", 693, 0, 0.0, 1236.8975468975468, 139, 3017, 1371.0, 1920.2000000000003, 2218.8999999999987, 2815.8199999999974, 3.8539824485301475, 11.148222303672128, 1.2457697172494913], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -77", 752, 0, 0.0, 1154.8630319148924, 135, 3796, 1107.0, 2127.6000000000004, 2488.35, 2869.5700000000006, 4.168329564099153, 11.118028302514302, 1.3229561604806883], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -79", 705, 0, 0.0, 1203.1886524822698, 132, 2868, 1345.0, 1839.4, 1985.1, 2423.159999999999, 3.9237293795498567, 11.381081650095172, 1.2683148678037135], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 2875, 0, 0.0, 6223.015652173917, 2424, 16525, 5437.0, 9966.8, 10483.4, 11204.919999999998, 15.28312317931489, 3111.067465727596, 18.402432500093028], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -80", 723, 0, 0.0, 1252.5159059474436, 119, 3373, 1434.0, 1956.2, 2209.3999999999996, 2909.2399999999984, 3.993195550597046, 37.19360215372974, 1.5247455666830518], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -78", 704, 0, 0.0, 1236.088068181819, 162, 3964, 1374.0, 1859.5, 2057.25, 2843.8, 3.9053182224145297, 11.417200770246357, 1.262363605096884], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -80", 659, 0, 0.0, 1308.911987860394, 123, 3225, 1658.0, 2226.0, 2356.0, 2862.3999999999996, 3.6686930768031707, 17.261585401496426, 1.3041057421448774], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -79", 754, 0, 0.0, 1119.7029177718819, 151, 3648, 1107.0, 1877.5, 2223.0, 2851.3500000000004, 4.188237385295621, 11.18833120750661, 1.3292745607627703], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 2732, 0, 0.0, 6612.168740849197, 345, 8228, 6841.0, 7694.0, 7928.7, 8052.0, 14.715308337417927, 688.0074935314182, 8.219879266604545], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 755, 0, 0.0, 1215.1417218543038, 139, 3335, 1215.0, 2110.3999999999996, 2353.3999999999987, 3103.4399999999987, 4.17366884839908, 10.999764928812688, 1.3246507575485362], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -80", 702, 0, 0.0, 1239.52279202279, 153, 3924, 1378.5, 1832.4, 1948.7500000000005, 2371.6200000000013, 3.898115910643189, 11.484195399307003, 1.2600355140848591], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 700, 0, 0.0, 26756.89428571431, 19102, 32985, 26614.0, 29624.2, 30289.5, 32502.640000000003, 3.6202839336970856, 2864.4895601678263, 2.0788349150526235], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 699, 0, 0.0, 1270.766809728184, 163, 3163, 1410.0, 1826.0, 1999.0, 2867.0, 3.899581589958159, 11.71343815376569, 1.2605092834728033], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -78", 698, 0, 0.0, 1235.1833810888243, 150, 3649, 1377.5, 1899.0, 2066.05, 2889.2299999999996, 3.886782156440198, 11.872393701658844, 1.2563719665836968], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -80", 757, 0, 0.0, 1144.7225891677679, 141, 3026, 1133.0, 2084.4000000000005, 2384.2, 2779.5599999999995, 4.175952690924336, 11.215390094041682, 1.3253756099125091], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -77", 708, 0, 0.0, 1186.8728813559328, 161, 2608, 1353.5, 1827.4, 1954.3999999999996, 2302.73, 3.9302546338701356, 11.679653021799592, 1.270424105284194], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -77", 656, 0, 0.0, 1404.375000000001, 147, 3651, 1725.5, 2360.3, 2549.7, 3293.1599999999994, 3.646145979234754, 18.863751000466884, 1.296090953556104], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -80", 660, 0, 0.0, 1343.73484848485, 125, 3334, 1653.0, 2205.2, 2472.0999999999985, 3165.8999999999996, 3.686162369867298, 18.588645310894286, 1.310315529913766], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -78", 661, 0, 0.0, 1227.5007564296527, 108, 4190, 1200.0, 2262.4, 2529.999999999999, 3184.1799999999994, 3.7023138061018166, 19.132911481583648, 1.316056860762755], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -79", 657, 0, 0.0, 1326.782343987824, 120, 3501, 1612.0, 2271.4, 2508.6000000000004, 3192.999999999998, 3.653247330960854, 18.347987925030584, 1.2986152621774911], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -80", 701, 0, 0.0, 1271.0057061340945, 149, 3433, 1398.0, 1899.2000000000003, 2102.0999999999995, 2909.3200000000006, 3.901553942740104, 11.278934887252884, 1.2611468311005611], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 705, 0, 0.0, 1228.9758865248218, 156, 3020, 1374.0, 1870.0, 2084.4999999999995, 2728.979999999999, 3.9201294476787827, 11.187535317655595, 1.2671512179508566], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -79", 704, 0, 0.0, 1299.2215909090894, 148, 3636, 1417.5, 1855.0, 2051.0, 3043.4500000000035, 3.910329045302051, 11.477576446516252, 1.2639833144482215], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -79", 751, 0, 0.0, 1139.8069241011974, 134, 3878, 1085.0, 2058.0000000000005, 2349.6, 2952.6400000000017, 4.186432835904096, 10.845587530798989, 1.3287018278015932], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -80", 753, 0, 0.0, 1185.5683930942896, 120, 5221, 1118.0, 2088.0, 2570.5999999999995, 3818.9000000000005, 4.183705218241621, 10.89805530456874, 1.327836128836452], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 700, 0, 0.0, 1308.2014285714274, 155, 3709, 1441.0, 1964.9, 2216.0, 3158.8, 3.906947669226647, 11.415176677754955, 1.2628903110488479], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -78", 754, 0, 0.0, 1155.251989389919, 146, 3294, 1162.5, 2014.0, 2351.5, 3014.05, 4.196349065004453, 10.946880826330142, 1.3318490684828583], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -77", 753, 0, 0.0, 1129.9402390438245, 140, 3120, 1140.0, 1925.2, 2287.3, 2826.400000000005, 4.168211986515585, 10.940340173910757, 1.3229188433765287], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80", 722, 0, 0.0, 1165.4570637119095, 117, 3838, 1346.5, 2000.4, 2244.0000000000005, 3261.16, 3.9888841621409594, 35.18501765164113, 1.5230993236299952], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -77", 700, 0, 0.0, 1263.9614285714292, 154, 3391, 1382.5, 1868.9, 2034.6499999999996, 2723.8700000000017, 3.910964108523667, 11.42691176306262, 1.2641885936731774], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 300, 100.0, 0.3315613222665532], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 90481, 300, "504/Gateway Time-out", 300, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 300, 300, "504/Gateway Time-out", 300, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
