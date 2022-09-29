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

    var data = {"OkPercent": 99.12124844155609, "KoPercent": 0.8787515584439051};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9384482415934373, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79"], "isController": false}, {"data": [0.3, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77"], "isController": false}, {"data": [0.1441351888667992, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -78"], "isController": false}, {"data": [0.1272365805168986, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -78"], "isController": false}, {"data": [0.016741071428571428, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -78"], "isController": false}, {"data": [0.5393374741200828, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.25, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.008226691042047532, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -79"], "isController": false}, {"data": [0.08946322067594434, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80"], "isController": false}, {"data": [0.375, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -79"], "isController": false}, {"data": [0.17903930131004367, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP "], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -79"], "isController": false}, {"data": [1.0, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.010054844606946984, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -78"], "isController": false}, {"data": [0.5201030927835052, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_CityLevel1234_Summaries_24hourly_REST"], "isController": false}, {"data": [0.022271714922048998, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -78"], "isController": false}, {"data": [0.010036496350364963, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -80"], "isController": false}, {"data": [0.5211776859504132, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80"], "isController": false}, {"data": [0.5082304526748971, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -80"], "isController": false}, {"data": [0.08648111332007952, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78"], "isController": false}, {"data": [0.01002227171492205, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.015625, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -78"], "isController": false}, {"data": [0.007312614259597806, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -77"], "isController": false}, {"data": [0.4, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -77"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 166031, 1459, 0.8787515584439051, 761.323879275554, 32, 60671, 55.0, 67.0, 76.0, 14459.660000023105, 63.17335069388295, 200.66857158941394, 30.014387951448168], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79", 2, 0, 0.0, 6166.0, 5555, 6777, 6166.0, 6777.0, 6777.0, 6777.0, 0.0831186102568365, 0.8999375311694788, 0.03230586609591887], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77", 5, 0, 0.0, 3165.2, 442, 6503, 3098.0, 6503.0, 6503.0, 6503.0, 0.11814465631719477, 0.7871618478414971, 0.04591950509203469], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 503, 11, 2.1868787276341948, 4280.964214711725, 38, 10899, 4881.0, 6994.6, 7554.199999999999, 9875.559999999998, 2.760142012873346, 21.86274025204816, 1.0000123894296986], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 503, 12, 2.3856858846918487, 4204.11332007952, 39, 11380, 5010.0, 6424.8, 7408.399999999999, 11025.0, 2.7626130035040695, 22.60733552188945, 1.0009076409179782], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 400, 0, 0.0, 23796.609999999997, 16358, 43315, 18869.5, 39237.2, 40419.549999999996, 42235.89, 2.0405872810194774, 1470.0916861372705, 0.7592419473324423], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -78", 3, 0, 0.0, 6868.666666666667, 5078, 10329, 5199.0, 10329.0, 10329.0, 10329.0, 0.03133944800785576, 0.10157776165827466, 0.010344466236968013], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 448, 0, 0.0, 4843.133928571425, 368, 13797, 3996.0, 8446.000000000002, 9869.949999999999, 11904.22, 2.428236926545833, 7.466837018146735, 0.8015078917700112], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -78", 1, 0, 0.0, 8192.0, 8192, 8192, 8192.0, 8192.0, 8192.0, 8192.0, 0.1220703125, 0.3834962844848633, 0.039577484130859375], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 966, 80, 8.281573498964804, 2271.0683229813662, 33, 42181, 396.0, 4508.200000000002, 6409.25, 38024.590000000004, 5.363686840644087, 34.43804548688229, 2.0847142212659633], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 150, 150, 100.0, 60064.61333333332, 60051, 60101, 60063.5, 60071.0, 60077.9, 60098.96, 0.7896565520436312, 0.2968923559929668, 0.3030615478058077], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78", 4, 1, 25.0, 2842.25, 97, 6452, 2410.0, 6452.0, 6452.0, 6452.0, 0.03148391565458996, 0.1788802942171918, 0.012236912529811333], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 150, 120, 80.0, 59500.106666666645, 54094, 60230, 60061.0, 60076.7, 60098.9, 60173.9, 0.7928621265619384, 114.47814145188913, 0.295000459199315], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 547, 0, 0.0, 4171.680073126148, 410, 13194, 3294.0, 6214.399999999999, 7896.800000000006, 11597.759999999998, 3.023937199402952, 8.853419852880204, 0.9804171388689259], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 503, 12, 2.3856858846918487, 4558.196819085486, 36, 13222, 4967.0, 7564.6, 8434.399999999987, 9692.999999999998, 2.774942763357515, 23.052871270998263, 1.0053747707086311], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 700, 0, 0.0, 12553.817142857144, 4075, 13955, 12668.5, 13696.0, 13801.9, 13889.0, 3.874274265409926, 240.0006970234504, 1.411234668943264], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80", 2, 0, 0.0, 6211.0, 5570, 6852, 6211.0, 6852.0, 6852.0, 6852.0, 0.08286033889878609, 0.8958464960434188, 0.03220548328292663], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77", 4, 1, 25.0, 2215.5, 70, 7861, 465.5, 7861.0, 7861.0, 7861.0, 0.03250209232219324, 0.10074379006898569, 0.01263264916428995], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -79", 2, 0, 0.0, 6902.5, 6372, 7433, 6902.5, 7433.0, 7433.0, 7433.0, 0.11940298507462686, 0.38701026119402987, 0.03941231343283582], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 687, 235, 34.206695778748184, 13189.212518195052, 36, 60069, 277.0, 38014.6, 41483.0, 60047.0, 3.688372767245961, 33.643629604426046, 4.466388897836906], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -79", 1, 0, 0.0, 5975.0, 5975, 5975, 5975.0, 5975.0, 5975.0, 5975.0, 0.1673640167364017, 0.5257910564853557, 0.054262552301255235], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 153385, 0, 0.0, 57.01723766991496, 33, 350, 54.0, 66.0, 73.0, 105.0, 851.9353709947069, 643.1113689247152, 409.32832278261304], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 547, 0, 0.0, 3902.285191956125, 374, 13268, 3167.0, 6003.2, 7035.200000000001, 9888.31999999999, 3.026966006120337, 8.65634956442402, 0.981399134796828], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 970, 73, 7.525773195876289, 2245.0814432989714, 33, 42000, 408.0, 4594.299999999999, 5604.45, 34177.98999999999, 5.379086997027638, 33.82916520520939, 2.0906998289228516], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79", 1, 0, 0.0, 6307.0, 6307, 6307, 6307.0, 6307.0, 6307.0, 6307.0, 0.15855398763278897, 1.714210153400983, 0.06162547566196289], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 150, 150, 100.0, 60076.58666666667, 60054, 60671, 60065.0, 60081.6, 60116.45, 60548.600000000006, 0.789581732237043, 0.2968642254992789, 0.4587901666807037], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 200, 150, 75.0, 49896.76999999999, 14604, 60093, 60057.0, 60070.0, 60075.0, 60083.99, 0.9768725425550102, 0.44312235939140837, 0.34533970742667347], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 449, 0, 0.0, 4769.828507795102, 208, 13550, 3831.0, 8315.0, 10029.5, 12430.5, 2.425899311671331, 7.296644997122959, 0.8007362962352635], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 150, 150, 100.0, 60065.73999999999, 60052, 60104, 60065.5, 60072.9, 60081.9, 60099.92, 0.7895401718039413, 0.2968485997505053, 0.3477369311363062], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -78", 1, 0, 0.0, 12509.0, 12509, 12509, 12509.0, 12509.0, 12509.0, 12509.0, 0.07994244144216164, 0.2591103155727876, 0.02638725117915101], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -80", 548, 0, 0.0, 3886.8978102189812, 363, 13869, 3223.0, 6017.0, 6972.249999999996, 10384.659999999993, 3.014848679903393, 9.076599007933233, 0.9774704704374282], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 968, 80, 8.264462809917354, 2238.7675619834704, 32, 42055, 406.0, 4339.100000000001, 5606.349999999999, 34234.009999999995, 5.360148843802604, 35.60669994379596, 2.0833391013998406], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 972, 71, 7.304526748971194, 2226.5524691358023, 34, 41957, 406.0, 4586.4, 5302.5999999999985, 34321.299999999996, 5.384474764429229, 25.670725579786616, 2.0927939025808917], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -80", 2, 0, 0.0, 7378.0, 4193, 10563, 7378.0, 10563.0, 10563.0, 10563.0, 0.1372589389884016, 0.2556179654793769, 0.045306173220781], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 503, 13, 2.584493041749503, 4552.880715705768, 39, 12365, 5113.0, 7171.2, 8570.6, 11056.64, 2.7720829751118754, 22.631603976189297, 1.0043386560219782], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78", 1, 0, 0.0, 6263.0, 6263, 6263, 6263.0, 6263.0, 6263.0, 6263.0, 0.1596678907871627, 1.7287479542551494, 0.06205841848954175], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 449, 0, 0.0, 5140.062360801789, 327, 14416, 4400.0, 8499.0, 10291.0, 12799.0, 2.417279510729706, 7.270718270851054, 0.7978910885025787], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -79", 1, 0, 0.0, 6797.0, 6797, 6797, 6797.0, 6797.0, 6797.0, 6797.0, 0.14712373105781962, 0.4768590462704134, 0.04856232529056937], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 150, 150, 100.0, 60067.639999999985, 60056, 60111, 60065.0, 60077.9, 60090.45, 60109.47, 0.7894653740486942, 0.29682047754760477, 0.32765896872138184], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 448, 0, 0.0, 4871.361607142855, 306, 13667, 4089.5, 7518.100000000001, 9543.599999999984, 12514.26, 2.422197711888233, 7.314070643828803, 0.7995144791193581], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -77", 547, 0, 0.0, 4103.085923217553, 290, 13266, 3311.0, 6121.0, 7439.200000000002, 10239.919999999993, 3.02880968333158, 8.985435922610314, 0.9819968895176607], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80", 5, 0, 0.0, 2318.4, 425, 5204, 2412.0, 5204.0, 5204.0, 5204.0, 0.11814744801512288, 0.7889111235822306, 0.045920590146502835], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -77", 3, 0, 0.0, 10338.666666666666, 10212, 10421, 10383.0, 10421.0, 10421.0, 10421.0, 0.029718270792883462, 0.09632318433748069, 0.009809351101557237], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503/Service Unavailable", 258, 17.683344756682658, 0.15539266763435744], "isController": false}, {"data": ["502/Bad Gateway", 152, 10.418094585332419, 0.09154916852876872], "isController": false}, {"data": ["504/Gateway Time-out", 880, 60.31528444139822, 0.530021502008661], "isController": false}, {"data": ["502/Proxy Error", 169, 11.583276216586704, 0.10178822027211785], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 166031, 1459, "504/Gateway Time-out", 880, "503/Service Unavailable", 258, "502/Proxy Error", 169, "502/Bad Gateway", 152, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 503, 11, "503/Service Unavailable", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 503, 12, "503/Service Unavailable", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 966, 80, "502/Proxy Error", 31, "502/Bad Gateway", 27, "503/Service Unavailable", 22, "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 150, 150, "504/Gateway Time-out", 150, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78", 4, 1, "502/Proxy Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 150, 120, "504/Gateway Time-out", 120, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 503, 12, "503/Service Unavailable", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77", 4, 1, "502/Proxy Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 687, 235, "503/Service Unavailable", 126, "502/Proxy Error", 55, "502/Bad Gateway", 44, "504/Gateway Time-out", 10, "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 970, 73, "502/Proxy Error", 28, "502/Bad Gateway", 26, "503/Service Unavailable", 19, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 150, 150, "504/Gateway Time-out", 150, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 200, 150, "504/Gateway Time-out", 150, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 150, 150, "504/Gateway Time-out", 150, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 968, 80, "502/Proxy Error", 32, "502/Bad Gateway", 28, "503/Service Unavailable", 20, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 972, 71, "502/Bad Gateway", 27, "503/Service Unavailable", 23, "502/Proxy Error", 21, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 503, 13, "503/Service Unavailable", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 150, 150, "504/Gateway Time-out", 150, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
