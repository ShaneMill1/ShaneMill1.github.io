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

    var data = {"OkPercent": 92.7807274744433, "KoPercent": 7.2192725255567005};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.08693240351850384, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.04888888888888889, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -78"], "isController": false}, {"data": [0.057649667405764965, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -80"], "isController": false}, {"data": [0.26607142857142857, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.09610983981693363, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -77"], "isController": false}, {"data": [0.1512455516014235, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77"], "isController": false}, {"data": [0.21285714285714286, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.19636135508155583, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.009656652360515022, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -79"], "isController": false}, {"data": [0.04666666666666667, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -77"], "isController": false}, {"data": [0.02193548387096774, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}, {"data": [0.25377969762419006, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP "], "isController": false}, {"data": [0.0018782870022539444, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.007526881720430108, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -78"], "isController": false}, {"data": [0.14412811387900357, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST"], "isController": false}, {"data": [0.009722222222222222, 500, 1500, "NDFD_CityLevel1234_Summaries_24hourly_REST"], "isController": false}, {"data": [0.10640732265446225, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -79"], "isController": false}, {"data": [0.020491803278688523, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.0075107296137339056, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -80"], "isController": false}, {"data": [0.12943262411347517, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80"], "isController": false}, {"data": [0.1512455516014235, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79"], "isController": false}, {"data": [0.05543237250554324, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -79"], "isController": false}, {"data": [0.0958904109589041, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -80"], "isController": false}, {"data": [0.06265508684863523, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.10526315789473684, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -78"], "isController": false}, {"data": [0.010752688172043012, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -77"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 12619, 911, 7.2192725255567005, 10275.121008003818, 1, 90005, 6530.0, 24124.0, 42692.0, 90001.0, 4.474086533279631, 455.79593824145604, 1.8399018576819275], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 450, 59, 13.11111111111111, 4974.904444444444, 2, 21522, 4348.0, 9571.6, 10017.4, 14747.48000000001, 2.4147071765097285, 17.69786471133517, 0.8607110541270029], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 451, 70, 15.521064301552107, 4796.23281596452, 2, 22211, 3819.0, 9738.8, 11002.8, 19407.800000000014, 2.398783056400655, 16.575898205633152, 0.8550349761584367], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 840, 87, 10.357142857142858, 10707.928571428582, 2, 86042, 8099.0, 27876.39999999997, 43654.9, 68799.87000000001, 4.06437190938386, 887.2026463249489, 1.4884174472841285], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 437, 23, 5.2631578947368425, 5124.215102974834, 2, 12357, 5136.0, 10491.2, 11004.3, 12094.04, 2.319890004300025, 6.231116885030073, 0.7521518373316487], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 281, 33, 11.743772241992882, 6355.00355871886, 2, 88253, 2328.0, 19064.60000000001, 31033.19999999999, 85212.36000000002, 1.5544356734689362, 11.58297781437217, 0.5950574062498272], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 350, 69, 19.714285714285715, 29543.651428571415, 1, 90004, 16449.0, 90001.0, 90002.0, 90004.0, 1.2973197374224852, 52.15948209258601, 0.4902956429516619], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 797, 24, 3.0112923462986196, 11651.79297365119, 2, 49499, 10727.0, 21677.000000000004, 28227.799999999945, 43108.39999999999, 3.9829686859701554, 1111.321575605816, 1.4586066965222737], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 466, 0, 0.0, 4702.963519313305, 382, 8257, 4492.5, 7077.3, 7399.799999999999, 7988.399999999999, 2.487628585308044, 7.160054260063952, 0.7919598816508031], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 450, 53, 11.777777777777779, 5108.4400000000005, 2, 22831, 4268.5, 9475.9, 10202.35, 19020.700000000004, 2.444323737099402, 18.049039244975557, 0.8712677383215643], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 775, 13, 1.6774193548387097, 12357.939354838723, 1, 40141, 8035.0, 26751.59999999999, 29410.79999999999, 34698.92, 3.761551603634387, 279.4475977563558, 1.3481342173181836], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 463, 78, 16.846652267818573, 20634.18358531317, 2, 90002, 15119.0, 59442.200000000004, 66701.39999999992, 89574.40000000001, 2.2044574796813774, 18.24139836046451, 2.65654348625666], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 1331, 50, 3.756574004507889, 6721.284748309539, 1, 8061, 7050.0, 7774.6, 7894.0, 7988.360000000001, 7.237511079210236, 480.80478503783246, 4.049896336315884], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 465, 0, 0.0, 4848.860215053764, 646, 8131, 4724.0, 7035.200000000001, 7403.1, 7996.099999999999, 2.4870566086175177, 7.089281320867743, 0.7917777875090926], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 281, 25, 8.896797153024911, 8358.92526690391, 2, 90003, 2499.0, 25322.200000000008, 74598.39999999997, 89754.18000000001, 1.5527178087338995, 11.843175069623644, 0.5943997861559459], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 237, 25, 10.548523206751055, 44974.599156118165, 1, 66070, 50904.0, 59017.200000000004, 61682.3, 65728.26, 1.0788223084066204, 1350.7410431005444, 0.6205335348159174], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 360, 17, 4.722222222222222, 24441.42222222222, 2, 70695, 25924.5, 30529.600000000002, 33691.9, 70569.95, 1.767886344551227, 971.8161443089406, 0.6146167369728874], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 437, 16, 3.6613272311212817, 5009.466819221962, 2, 12933, 5009.0, 10332.6, 11173.5, 12062.84, 2.3006538700472765, 6.400780929185137, 0.7459151219293905], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 122, 118, 96.72131147540983, 73814.36885245905, 1, 90005, 90002.0, 90004.0, 90004.0, 90005.0, 0.642751397457444, 0.20259881314900768, 0.2793206756528932], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -80", 466, 0, 0.0, 4994.227467811156, 528, 8471, 5001.5, 7166.200000000001, 7533.75, 7973.58, 2.4931651962698824, 7.244695503474916, 0.7937225136562321], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 282, 26, 9.21985815602837, 7850.847517730496, 2, 86146, 2546.5, 24838.10000000001, 32745.399999999998, 83226.99000000003, 1.5548069448043533, 11.54635082985064, 0.5951995335579165], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 281, 22, 7.829181494661921, 8803.999999999998, 2, 90001, 2496.0, 27513.000000000004, 76091.29999999993, 87040.90000000001, 1.5510037367598926, 11.943603066889105, 0.5937436179783964], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 451, 59, 13.082039911308204, 4836.563192904657, 2, 22512, 4061.0, 9400.4, 10346.199999999999, 17459.280000000006, 2.411558369337383, 17.462446186088357, 0.8595886765704539], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 438, 17, 3.8812785388127855, 5147.805936073058, 3, 12497, 5128.5, 10323.4, 11089.05, 11990.19, 2.296427953505199, 6.321085471816328, 0.7445450005505135], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 806, 8, 0.9925558312655087, 11047.405707196014, 2, 77422, 10364.5, 12037.5, 13262.349999999995, 69400.13, 4.399203122015119, 1034.8691044333161, 1.8000645587151707], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 437, 19, 4.3478260869565215, 5252.711670480549, 2, 12319, 5223.0, 10714.8, 11327.9, 12060.26, 2.3019748521099683, 6.306479374410679, 0.7463434090825287], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -77", 465, 0, 0.0, 4600.524731182801, 481, 7999, 4475.0, 6793.000000000002, 7226.4, 7828.279999999999, 2.5261305113105457, 7.242518460445686, 0.8042173307492557], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503/Service Unavailable", 423, 46.432491767288695, 3.3520881210872493], "isController": false}, {"data": ["502/Bad Gateway", 193, 21.185510428100987, 1.5294397337348442], "isController": false}, {"data": ["504/Gateway Time-out", 150, 16.46542261251372, 1.1886837308820033], "isController": false}, {"data": ["502/Proxy Error", 145, 15.916575192096596, 1.1490609398526033], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 12619, 911, "503/Service Unavailable", 423, "502/Bad Gateway", 193, "504/Gateway Time-out", 150, "502/Proxy Error", 145, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 450, 59, "503/Service Unavailable", 38, "502/Bad Gateway", 16, "502/Proxy Error", 5, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 451, 70, "503/Service Unavailable", 45, "502/Bad Gateway", 18, "502/Proxy Error", 7, "", "", "", ""], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 840, 87, "503/Service Unavailable", 44, "502/Bad Gateway", 23, "502/Proxy Error", 20, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 437, 23, "503/Service Unavailable", 23, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 281, 33, "502/Proxy Error", 17, "502/Bad Gateway", 16, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 350, 69, "504/Gateway Time-out", 43, "503/Service Unavailable", 22, "502/Proxy Error", 4, "", "", "", ""], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 797, 24, "502/Bad Gateway", 13, "502/Proxy Error", 10, "503/Service Unavailable", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 450, 53, "503/Service Unavailable", 35, "502/Bad Gateway", 15, "502/Proxy Error", 3, "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 775, 13, "502/Bad Gateway", 12, "503/Service Unavailable", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 463, 78, "503/Service Unavailable", 51, "502/Proxy Error", 12, "502/Bad Gateway", 11, "504/Gateway Time-out", 4, "", ""], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 1331, 50, "503/Service Unavailable", 50, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 281, 25, "502/Bad Gateway", 14, "502/Proxy Error", 9, "504/Gateway Time-out", 2, "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 237, 25, "503/Service Unavailable", 12, "502/Proxy Error", 8, "502/Bad Gateway", 5, "", "", "", ""], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 360, 17, "502/Proxy Error", 11, "503/Service Unavailable", 6, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 437, 16, "503/Service Unavailable", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 122, 118, "504/Gateway Time-out", 100, "502/Bad Gateway", 10, "502/Proxy Error", 8, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 282, 26, "502/Proxy Error", 17, "502/Bad Gateway", 9, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 281, 22, "502/Bad Gateway", 11, "502/Proxy Error", 10, "504/Gateway Time-out", 1, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 451, 59, "503/Service Unavailable", 43, "502/Bad Gateway", 13, "502/Proxy Error", 3, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 438, 17, "503/Service Unavailable", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 806, 8, "502/Bad Gateway", 7, "502/Proxy Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 437, 19, "503/Service Unavailable", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
