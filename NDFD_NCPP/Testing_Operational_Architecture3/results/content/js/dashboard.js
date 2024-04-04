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

    var data = {"OkPercent": 99.9872902897814, "KoPercent": 0.012709710218607015};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.42496799035944943, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.44618960416960135, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -78"], "isController": false}, {"data": [0.4497098646034816, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.46663906305453684, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -77"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.4510797998419805, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.4680783268640287, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -79"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -80"], "isController": false}, {"data": [0.4445071217035679, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -77"], "isController": false}, {"data": [0.001444043321299639, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP "], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -77"], "isController": false}, {"data": [0.0010567101091933778, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -79"], "isController": false}, {"data": [0.46791412822744416, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -78"], "isController": false}, {"data": [0.4531393971304462, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_CityLevel1234_Summaries_24hourly_REST"], "isController": false}, {"data": [0.46576745274738135, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.46612865903042927, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -80"], "isController": false}, {"data": [0.45411454904542464, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80"], "isController": false}, {"data": [0.4491279069767442, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79"], "isController": false}, {"data": [0.44403773053639306, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.4670290500801996, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -80"], "isController": false}, {"data": [0.46492980085766317, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -78"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -78"], "isController": false}, {"data": [0.4655262698551231, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -77"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 212436, 27, 0.012709710218607015, 1349.1488589504559, 522, 60063, 824.0, 2079.800000000003, 3146.0, 9305.920000000013, 58.06327824816369, 1560.1998391914283, 21.496389391800033], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 7099, 2, 0.02817298211015636, 1236.9404141428327, 655, 60061, 971.0, 1551.0, 2319.0, 6914.0, 1.9504499442669712, 17.102416914410995, 0.7142761026368303], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 7238, 5, 0.06907985631389886, 1252.7133185962994, 655, 60063, 973.0, 1502.0, 2294.0999999999985, 7085.439999999999, 1.9794420259772365, 17.36728833902375, 0.7248933200600233], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 1854, 0, 0.0, 3868.2529665587936, 2277, 17337, 3262.5, 5469.5, 7651.0, 10746.300000000003, 0.5147923670786116, 224.7076093046117, 0.19354986457545456], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 16906, 0, 0.0, 1050.1714775819166, 522, 26788, 833.0, 1299.0, 1769.0, 6573.790000000001, 4.700808001772882, 7.51945654971092, 1.5699964224671152], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -78", 1, 0, 0.0, 983.0, 983, 983, 983.0, 983.0, 983.0, 983.0, 1.0172939979654119, 3.028039165818922, 0.3824787004069176], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 1973, 0, 0.0, 3635.9822605169816, 2173, 15264, 2984.0, 5630.8, 7824.9, 10452.42, 0.5475422347105144, 34.97526976662504, 0.21227955779304125], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 7594, 0, 0.0, 1171.651171977882, 611, 19691, 924.0, 1488.5, 2380.0, 6790.750000000003, 2.110940866970141, 24.01688695795603, 0.8287092075410124], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 4545, 2, 0.04400440044004401, 3950.2752475247457, 2311, 60063, 3287.0, 5766.800000000001, 7910.7, 11076.18, 1.2505888361076503, 545.6435896646915, 0.4701920917006302], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 17261, 1, 0.005793407102717108, 1030.3991657493837, 555, 60060, 822.0, 1279.0, 1713.7999999999956, 6132.700000000015, 4.757279787362465, 14.159666129654823, 1.7886257013032705], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -80", 1, 0, 0.0, 1184.0, 1184, 1184, 1184.0, 1184.0, 1184.0, 1184.0, 0.8445945945945946, 1.351021431587838, 0.28208139780405406], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 7091, 5, 0.07051191651389085, 1283.7319136934173, 649, 60061, 973.0, 1564.0, 2736.399999999998, 7391.48, 1.951431884817359, 17.083246244504974, 0.714635700006357], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 1385, 0, 0.0, 2599.730685920577, 1449, 20418, 2078.0, 3813.0, 5869.200000000001, 9674.520000000002, 0.38462478394362315, 28.67093873545091, 0.14160502299486907], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -77", 1, 0, 0.0, 1335.0, 1335, 1335, 1335.0, 1335.0, 1335.0, 1335.0, 0.7490636704119851, 1.1982092696629214, 0.2501755617977528], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 781, 2, 0.2560819462227913, 4658.448143405893, 2966, 60062, 3897.0, 6540.400000000001, 8587.999999999998, 12473.239999999974, 0.2146566222392506, 3.925077654128814, 0.2607742559234646], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -77", 1, 0, 0.0, 1747.0, 1747, 1747, 1747.0, 1747.0, 1747.0, 1747.0, 0.5724098454493417, 1.7038136805953061, 0.21521268603319976], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 2839, 1, 0.03522367030644593, 2526.95033462487, 1372, 60062, 2028.0, 3544.0, 5715.0, 9264.999999999996, 0.7877257948427961, 67.04833381618187, 0.448480603899756], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -79", 1, 0, 0.0, 1964.0, 1964, 1964, 1964.0, 1964.0, 1964.0, 1964.0, 0.5091649694501018, 1.5155613543788187, 0.1914340949592668], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 17235, 0, 0.0, 1028.923411662317, 530, 24990, 823.0, 1282.0, 1715.199999999999, 6519.479999999967, 4.790446124366485, 14.259062292059616, 1.8010954666807586], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 7597, 1, 0.01316309069369488, 1181.1311043833111, 622, 60061, 925.0, 1472.0, 2256.9999999999945, 6883.879999999979, 2.092054241951842, 23.798948649028503, 0.8212947317037506], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 432, 0, 0.0, 16612.495370370376, 11914, 48760, 15185.5, 21492.2, 23689.349999999984, 28632.86000000002, 0.11985726996768016, 155.52822740366196, 0.07011182100648478], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 568, 0, 0.0, 12652.836267605637, 7026, 42896, 12421.5, 17489.9, 19303.34999999999, 23298.859999999993, 0.15726026047061242, 50.8270243858267, 0.05620825716039467], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 17089, 0, 0.0, 1050.6115044765693, 546, 22687, 830.0, 1305.0, 1886.5, 6680.299999999996, 4.745298089635012, 7.590623311349757, 1.5848554166554438], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 189, 0, 0.0, 19093.75661375661, 11495, 37404, 16930.0, 27952.0, 31504.5, 35849.69999999999, 0.052370949252550175, 29.51437479728771, 0.023270294833896806], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -80", 17286, 0, 0.0, 1030.6634849010784, 527, 13635, 822.0, 1294.0, 1807.0, 6537.560000000012, 4.800073308998818, 14.287718208816795, 1.804715062465376], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 7595, 0, 0.0, 1165.1777485187633, 588, 25027, 929.0, 1455.0, 2127.5999999999995, 6864.24, 2.1094140133969317, 23.97065642066951, 0.8281097982280923], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 7568, 0, 0.0, 1194.9951109936567, 601, 29436, 930.0, 1515.1000000000004, 2486.849999999995, 7180.3099999999995, 2.108282950069519, 23.99077508248713, 0.8276657675077606], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 7103, 5, 0.07039279177812192, 1277.3704068703357, 654, 60062, 977.0, 1551.6000000000004, 2625.9999999999964, 7168.4800000000005, 1.9544481236142348, 17.153512759271177, 0.7157402796438849], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 2159, 2, 0.09263547938860583, 3335.377952755902, 1904, 60060, 2728.0, 4851.0, 6848.0, 10193.200000000012, 0.5948353196075795, 184.83942510390676, 0.24920346885903477], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 16833, 0, 0.0, 1047.0317234004647, 531, 29199, 833.0, 1297.0, 1779.5999999999985, 6617.179999999997, 4.67461403817171, 7.477556439966076, 1.5612480479050048], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 17023, 1, 0.005874405216471832, 1065.1251248311148, 539, 60059, 833.0, 1302.6000000000004, 1908.3999999999978, 6790.399999999976, 4.689746142661069, 7.501467030758156, 1.5663019343653182], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -78", 1, 0, 0.0, 680.0, 680, 680, 680.0, 680.0, 680.0, 680.0, 1.4705882352941175, 4.377297794117647, 0.5529067095588235], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -77", 17187, 0, 0.0, 1054.6625356374054, 534, 23399, 821.0, 1297.0, 1896.3999999999942, 6729.359999999997, 4.774165340509628, 14.210601521360688, 1.7949742735314518], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Proxy Error", 27, 100.0, 0.012709710218607015], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 212436, 27, "502/Proxy Error", 27, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 7099, 2, "502/Proxy Error", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 7238, 5, "502/Proxy Error", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 4545, 2, "502/Proxy Error", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 17261, 1, "502/Proxy Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 7091, 5, "502/Proxy Error", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 781, 2, "502/Proxy Error", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 2839, 1, "502/Proxy Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 7597, 1, "502/Proxy Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 7103, 5, "502/Proxy Error", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 2159, 2, "502/Proxy Error", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 17023, 1, "502/Proxy Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
