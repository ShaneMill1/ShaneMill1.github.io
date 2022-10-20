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

    var data = {"OkPercent": 93.06593340905015, "KoPercent": 6.934066590949848};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.10694004423456274, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77"], "isController": false}, {"data": [0.024024024024024024, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -78"], "isController": false}, {"data": [0.015015015015015015, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -77"], "isController": false}, {"data": [0.05917159763313609, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.002, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -80"], "isController": false}, {"data": [0.2869114126097366, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77"], "isController": false}, {"data": [0.022835394862036156, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78"], "isController": false}, {"data": [0.17155525238744884, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.007272727272727273, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -79"], "isController": false}, {"data": [0.01951951951951952, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -80"], "isController": false}, {"data": [0.0018754688672168042, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80"], "isController": false}, {"data": [0.25, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP "], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -79"], "isController": false}, {"data": [0.0017409470752089136, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.007246376811594203, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -78"], "isController": false}, {"data": [0.2795527156549521, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_CityLevel1234_Summaries_24hourly_REST"], "isController": false}, {"data": [0.004016064257028112, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -78"], "isController": false}, {"data": [0.0018050541516245488, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -80"], "isController": false}, {"data": [0.2752988047808765, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80"], "isController": false}, {"data": [0.2789305666400638, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79"], "isController": false}, {"data": [0.021021021021021023, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -79"], "isController": false}, {"data": [0.01, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.004016064257028112, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -78"], "isController": false}, {"data": [0.0018115942028985507, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 16729, 1160, 6.934066590949848, 7621.184649411198, 36, 60204, 6364.0, 11146.0, 24363.0, 60066.0, 6.169618216840561, 655.7778631973644, 2.4264607556048965], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79", 1, 0, 0.0, 2710.0, 2710, 2710, 2710.0, 2710.0, 2710.0, 2710.0, 0.36900369003690037, 3.9494926199261995, 0.14017815959409594], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -79", 1, 0, 0.0, 9562.0, 9562, 9562, 9562.0, 9562.0, 9562.0, 9562.0, 0.10458063166701527, 0.3267123444363104, 0.03298783596527923], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77", 2, 0, 0.0, 3383.5, 2466, 4301, 3383.5, 4301.0, 4301.0, 4301.0, 0.1069575913150436, 0.5976150963955291, 0.04063135060698433], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 333, 0, 0.0, 6666.159159159161, 246, 27124, 5495.0, 12396.200000000004, 19283.50000000001, 25432.480000000007, 1.7763884369382106, 15.193754659352178, 0.6279810685269845], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 333, 0, 0.0, 6553.183183183185, 467, 27551, 5775.0, 11736.000000000015, 15306.300000000005, 25869.300000000014, 1.7824262407399476, 14.88331556371237, 0.6301155265115831], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -77", 1, 0, 0.0, 26055.0, 26055, 26055, 26055.0, 26055.0, 26055.0, 26055.0, 0.038380349261178275, 0.35025816781807717, 0.013568053156783727], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 1014, 44, 4.339250493096647, 8920.02662721892, 38, 18081, 9892.5, 10869.0, 11070.0, 11466.75, 5.372783197070932, 1915.8274625090737, 1.9518313958109246], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 250, 0, 0.0, 8989.380000000005, 1436, 13071, 9160.0, 11286.800000000001, 11831.3, 12423.500000000002, 1.3216115202232994, 3.63748790725459, 0.42461932632174365], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -78", 2, 0, 0.0, 8589.5, 7224, 9955, 8589.5, 9955.0, 9955.0, 9955.0, 0.02340796573073817, 0.042221203813157616, 0.00738356731545745], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -77", 1, 0, 0.0, 10223.0, 10223, 10223, 10223.0, 10223.0, 10223.0, 10223.0, 0.09781864423359092, 0.30558773721021226, 0.03085490438227526], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -80", 1, 0, 0.0, 9596.0, 9596, 9596, 9596.0, 9596.0, 9596.0, 9596.0, 0.10421008753647354, 0.3255547558878699, 0.03287095534597749], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 1253, 0, 0.0, 1737.9824421388664, 415, 8840, 1358.0, 2979.8, 3696.6, 7362.940000000001, 6.977819111316542, 68.87939185285323, 2.6507535491231784], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 1051, 35, 3.330161750713606, 9200.103710751671, 40, 40493, 8803.0, 10274.4, 11720.2, 35562.84, 4.934944194279972, 386.97208554803234, 1.8506040728549895], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78", 2, 0, 0.0, 2349.5, 1545, 3154, 2349.5, 3154.0, 3154.0, 3154.0, 0.03249285157265401, 0.3477750519885625, 0.012343475841564856], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 1466, 464, 31.65075034106412, 6266.7980900409275, 36, 45060, 4351.0, 11902.699999999992, 17432.749999999978, 43000.89999999998, 7.759734072960556, 1534.9374171707273, 2.8189658936927016], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 275, 0, 0.0, 8003.429090909093, 885, 11270, 8278.0, 10081.2, 10533.0, 11091.680000000002, 1.4800144234132901, 4.168831678295992, 0.4668404870727468], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 333, 0, 0.0, 6706.4504504504575, 457, 27600, 5914.0, 12509.200000000003, 17890.7, 24696.900000000016, 1.8099596699677143, 14.21888312273755, 0.6398490239534302], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -78", 1, 0, 0.0, 7650.0, 7650, 7650, 7650.0, 7650.0, 7650.0, 7650.0, 0.13071895424836602, 1.1931934232026142, 0.04621119281045751], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -80", 1, 0, 0.0, 5001.0, 5001, 5001, 5001.0, 5001.0, 5001.0, 5001.0, 0.1999600079984003, 0.09666035542891421, 0.07068898720255948], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 1333, 300, 22.50562640660165, 6683.695423855957, 36, 51484, 6655.0, 7471.0, 7639.9, 51291.6, 7.279379641764963, 329.67417839053627, 2.587591982033639], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80", 1, 0, 0.0, 3469.0, 3469, 3469, 3469.0, 3469.0, 3469.0, 3469.0, 0.28826751225136926, 3.085363217065437, 0.10950787330642837], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77", 2, 0, 0.0, 2761.0, 533, 4989, 2761.0, 4989.0, 4989.0, 4989.0, 0.03303600925008259, 0.18477904587875785, 0.01254981210769739], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 179, 137, 76.53631284916202, 53788.648044692745, 7406, 60204, 60065.0, 60073.0, 60082.0, 60116.0, 0.7463277754845918, 3.375282999987492, 0.8971967691616529], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -79", 2, 0, 0.0, 9355.5, 8517, 10194, 9355.5, 10194.0, 10194.0, 10194.0, 0.023342670401493928, 0.07292304942810457, 0.007362971230158729], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 1436, 0, 0.0, 6225.766713091925, 551, 8299, 6119.5, 6954.3, 7176.15, 8223.89, 7.815433849101171, 492.81500355123296, 4.350387982409831], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 276, 0, 0.0, 8037.00724637681, 732, 11229, 8336.0, 9974.7, 10469.55, 11128.990000000002, 1.4867885905136422, 4.246467362027635, 0.4689772604842837], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 1252, 0, 0.0, 1737.7100638977633, 410, 10647, 1354.0, 3074.4, 3900.35, 6133.440000000018, 6.964377099882073, 67.20717227064003, 2.6456471600137954], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -79", 1, 0, 0.0, 5011.0, 5011, 5011, 5011.0, 5011.0, 5011.0, 5011.0, 0.19956096587507485, 0.096467459090002, 0.07054791957693075], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79", 3, 0, 0.0, 4839.333333333333, 2593, 8683, 3242.0, 8683.0, 8683.0, 8683.0, 0.02740802324200371, 0.29335149876207095, 0.010411836954237738], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 248, 0, 0.0, 37478.08467741931, 17272, 59612, 37199.5, 50002.6, 51976.35, 59207.659999999996, 1.200160666669893, 1692.7305137219982, 0.6868106940122629], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 400, 0, 0.0, 22926.592500000002, 16807, 26398, 22904.0, 25630.9, 25837.8, 26350.04, 2.120058937638466, 1342.485914858433, 0.7308406298695104], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 249, 0, 0.0, 8998.674698795183, 1429, 13420, 9177.0, 11087.0, 11812.0, 12805.0, 1.3134019748501982, 3.8147616541348426, 0.4219816891852688], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 174, 174, 100.0, 51790.563218390795, 40, 60110, 60066.0, 60079.0, 60084.25, 60102.5, 0.9158135740414222, 0.3642673984841706, 0.3953023434827232], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -78", 2, 0, 0.0, 10689.0, 10619, 10759, 10689.0, 10759.0, 10759.0, 10759.0, 0.039345294302801384, 0.12683478173197985, 0.012641212720333648], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -80", 277, 0, 0.0, 8010.5812274368245, 579, 11256, 8248.0, 9916.4, 10303.299999999997, 10971.23999999999, 1.4894635242750291, 4.014165320705156, 0.4698210140047211], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 1255, 0, 0.0, 1755.595219123506, 268, 8704, 1373.0, 3060.8, 3874.6000000000013, 6473.040000000003, 6.96537293883237, 66.95071244179336, 2.6460254621150314], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 1253, 0, 0.0, 1717.3192338387848, 342, 8762, 1351.0, 2895.2000000000007, 3612.2999999999993, 5225.900000000008, 6.9618846538504275, 69.74418598594289, 2.6447003226052894], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 333, 0, 0.0, 6757.849849849851, 272, 29745, 6066.0, 12613.600000000002, 16576.900000000005, 25196.18, 1.7847285122438807, 14.485515703802061, 0.6309294154612156], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78", 3, 0, 0.0, 3447.6666666666665, 2757, 4347, 3239.0, 4347.0, 4347.0, 4347.0, 0.028538541300025682, 0.20823287865887882, 0.010841301333701163], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 250, 0, 0.0, 9008.311999999998, 1817, 13781, 9175.5, 11204.9, 11822.15, 12778.210000000006, 1.3231923868802828, 3.6708458044215795, 0.4251272414879034], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -79", 2, 0, 0.0, 10129.5, 9661, 10598, 10129.5, 10598.0, 10598.0, 10598.0, 0.04021393815096313, 0.1296349705432903, 0.012920298487955926], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 950, 6, 0.631578947368421, 9491.642105263156, 44, 33055, 9747.0, 11082.0, 11277.9, 11696.39, 5.124221927354714, 1204.1882971199175, 2.081715157987853], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 249, 0, 0.0, 8984.95582329317, 763, 13314, 9216.0, 11004.0, 11558.0, 12881.5, 1.3143170829550492, 3.658315538038659, 0.4222757034103625], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -77", 276, 0, 0.0, 8004.829710144924, 919, 11309, 8270.0, 10070.300000000001, 10436.849999999997, 11243.51, 1.4867485455720748, 4.0472108314479645, 0.46896462912087916], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80", 2, 0, 0.0, 2224.5, 2067, 2382, 2224.5, 2382.0, 2382.0, 2382.0, 0.1214697843911327, 0.6794122950197389, 0.04614428332827209], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503/Service Unavailable", 441, 38.01724137931034, 2.6361408332835197], "isController": false}, {"data": ["504/Gateway Time-out", 287, 24.74137931034483, 1.7155837168987984], "isController": false}, {"data": ["502/Bad Gateway", 193, 16.637931034482758, 1.1536852172873453], "isController": false}, {"data": ["502/Proxy Error", 239, 20.603448275862068, 1.4286568234801842], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 16729, 1160, "503/Service Unavailable", 441, "504/Gateway Time-out", 287, "502/Proxy Error", 239, "502/Bad Gateway", 193, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 1014, 44, "503/Service Unavailable", 44, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 1051, 35, "502/Proxy Error", 26, "502/Bad Gateway", 5, "503/Service Unavailable", 4, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 1466, 464, "503/Service Unavailable", 244, "502/Proxy Error", 117, "502/Bad Gateway", 103, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 1333, 300, "503/Service Unavailable", 148, "502/Bad Gateway", 76, "502/Proxy Error", 76, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 179, 137, "504/Gateway Time-out", 137, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 174, 174, "504/Gateway Time-out", 150, "502/Proxy Error", 16, "502/Bad Gateway", 8, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 950, 6, "502/Proxy Error", 4, "503/Service Unavailable", 1, "502/Bad Gateway", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
