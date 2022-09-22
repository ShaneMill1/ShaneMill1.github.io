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

    var data = {"OkPercent": 99.64693525608726, "KoPercent": 0.353064743912738};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9730925632855247, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.012711864406779662, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -80"], "isController": false}, {"data": [0.10337552742616034, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77"], "isController": false}, {"data": [0.1182170542635659, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -77"], "isController": false}, {"data": [0.02364864864864865, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP "], "isController": false}, {"data": [0.9999051146835027, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -78"], "isController": false}, {"data": [0.08755274261603375, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_CityLevel1234_Summaries_24hourly_REST"], "isController": false}, {"data": [0.01267605633802817, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -80"], "isController": false}, {"data": [0.09894736842105263, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80"], "isController": false}, {"data": [0.08227848101265822, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78"], "isController": false}, {"data": [0.011267605633802818, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -80"], "isController": false}, {"data": [0.00423728813559322, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.011267605633802818, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 281818, 995, 0.353064743912738, 463.573852628296, 18, 60226, 30.0, 39.0, 43.0, 45731.360000073735, 100.7454616496391, 198.2691688239344, 47.84627145563872], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_1Point_maxt_SOAP 34 -79", 1, 0, 0.0, 7328.0, 7328, 7328, 7328.0, 7328.0, 7328.0, 7328.0, 0.13646288209606985, 0.4279124164164847, 0.04384403145469432], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77", 1, 0, 0.0, 3233.0, 3233, 3233, 3233.0, 3233.0, 3233.0, 3233.0, 0.3093102381688834, 3.33414688369935, 0.11931400788741107], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 173, 0, 0.0, 13099.780346820813, 6175, 38253, 11382.0, 20105.999999999996, 32717.499999999985, 38178.26, 0.8983046447023392, 7.7402662704130645, 0.32282823168990316], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 173, 0, 0.0, 13132.121387283238, 6269, 37933, 11390.0, 20312.599999999995, 32988.599999999984, 37369.85999999999, 0.8918077406849909, 7.564191108148442, 0.32049340680866856], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 342, 0, 0.0, 26986.947368421053, 12603, 41292, 28742.5, 34257.0, 34886.85, 39435.009999999995, 1.7365606958429174, 699.571102116243, 0.6410351006138895], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 354, 0, 0.0, 6312.319209039548, 237, 9383, 6369.5, 7406.0, 8291.5, 9347.6, 1.8975637211546192, 5.386962792474069, 0.6207850064324194], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -77", 1, 0, 0.0, 7332.0, 7332, 7332, 7332.0, 7332.0, 7332.0, 7332.0, 0.13638843426077468, 0.42767896719858156, 0.04382011217948718], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -80", 1, 0, 0.0, 8174.0, 8174, 8174, 8174.0, 8174.0, 8174.0, 8174.0, 0.12233912405187178, 0.3836239524712503, 0.03930622247369709], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 474, 0, 0.0, 4572.339662447259, 196, 9216, 5404.0, 7382.5, 7480.25, 8401.0, 2.617439658076237, 24.277478672905637, 1.00965689935558], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 258, 186, 72.09302325581395, 36477.089147286846, 22, 60171, 60025.0, 60048.0, 60050.0, 60066.28, 1.1197576462520669, 19.865254744864522, 0.4264701973030333], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78", 1, 0, 0.0, 7389.0, 7389, 7389, 7389.0, 7389.0, 7389.0, 7389.0, 0.13533631073216945, 1.4649098321829745, 0.05220492455000676], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 150, 150, 100.0, 60049.65333333334, 60036, 60226, 60046.0, 60054.0, 60065.35, 60199.99, 0.7896607091153168, 0.2968939189544892, 0.2914958477007712], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 306, 0, 0.0, 7248.133986928107, 2839, 20828, 6413.0, 8390.0, 12523.999999999996, 19604.57, 1.6407418726977336, 4.504971236749401, 0.5271524180835492], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 174, 0, 0.0, 13240.93103448276, 5723, 38193, 11377.0, 21307.0, 33034.75, 37836.75, 0.896043504457044, 7.736331071982161, 0.3220156344142502], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 888, 0, 0.0, 10368.122747747768, 784, 14250, 11528.0, 12767.2, 13189.85, 13693.09, 4.650042415927443, 275.0117535647707, 1.6801911073175329], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77", 1, 0, 0.0, 8288.0, 8288, 8288, 8288.0, 8288.0, 8288.0, 8288.0, 0.12065637065637067, 1.3060109495656371, 0.04654225235279923], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 188, 150, 79.7872340425532, 57242.696808510635, 38249, 60195, 60046.0, 60055.1, 60063.65, 60168.3, 0.790254646949533, 3.190237714797939, 0.9546337873794651], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 274015, 0, 0.0, 31.878076017735765, 18, 5553, 30.0, 38.0, 42.0, 50.0, 1522.0856987324055, 1148.9963331251458, 726.8553776173302], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 306, 0, 0.0, 7264.954248366013, 4266, 18386, 6993.0, 8392.1, 12183.049999999997, 18054.85, 1.642450364183847, 4.538135057324738, 0.5277013377114118], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 474, 0, 0.0, 4624.3143459915655, 147, 8424, 5383.5, 7404.5, 7463.5, 8354.75, 2.6211884933143104, 24.76972255113806, 1.011102983260891], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79", 1, 0, 0.0, 4278.0, 4278, 4278, 4278.0, 4278.0, 4278.0, 4278.0, 0.2337540906965872, 2.5302054114072, 0.09016881428237496], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 150, 150, 100.0, 60052.76666666666, 60039, 60222, 60048.0, 60059.9, 60088.0, 60194.97, 0.7897480177324755, 0.29692674494824517, 0.45657307275158737], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 200, 68, 34.0, 53797.67499999998, 46192, 60159, 52730.5, 60047.0, 60050.95, 60073.0, 0.9043921806252062, 426.2734018542301, 0.31706718051215727], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 355, 0, 0.0, 6352.200000000002, 203, 9393, 6375.0, 8161.000000000002, 8371.0, 9327.88, 1.8886796267330632, 5.451697226367564, 0.6178785888238049], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 150, 150, 100.0, 60050.33333333334, 60039, 60223, 60047.0, 60056.9, 60061.9, 60221.98, 0.7897147550304829, 0.29691423895189056, 0.3455002053258363], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -80", 306, 0, 0.0, 7227.669934640523, 3877, 19981, 6423.5, 8400.7, 12089.249999999996, 19496.140000000007, 1.6484049258217783, 4.6546038676912636, 0.5296144732376612], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 475, 0, 0.0, 4600.387368421056, 155, 8443, 5446.0, 7393.2, 7486.599999999999, 8392.28, 2.6240049497019684, 24.711329244949482, 1.0121894093088648], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 474, 0, 0.0, 4659.3270042194035, 178, 8510, 5416.5, 7403.5, 7504.75, 8395.25, 2.6228129392105, 26.329999425913833, 1.0117296005743628], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 173, 0, 0.0, 13174.601156069359, 6788, 38953, 11405.0, 20148.599999999995, 32886.29999999999, 38514.17999999999, 0.8975123861897227, 7.480198714041141, 0.3225435137869316], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78", 1, 0, 0.0, 1577.0, 1577, 1577, 1577.0, 1577.0, 1577.0, 1577.0, 0.6341154090044389, 6.853895846544071, 0.24460506499682944], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 355, 0, 0.0, 6288.188732394365, 211, 10183, 6364.0, 7443.0, 8347.6, 9248.36, 1.8968133535660092, 5.372246907325974, 0.6205395248482549], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 236, 141, 59.74576271186441, 41273.25423728812, 1245, 60189, 60026.0, 60049.0, 60053.3, 60139.87, 1.0742409759206153, 119.23023991192134, 0.44270477718603485], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 355, 0, 0.0, 6345.642253521122, 176, 9349, 6374.0, 8227.8, 8343.2, 9230.88, 1.9007335225143223, 5.324412002395995, 0.6218220019944316], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -77", 305, 0, 0.0, 7295.157377049185, 3208, 20121, 6532.0, 9193.600000000006, 13849.099999999991, 19363.299999999996, 1.639071157184237, 4.583810066248032, 0.5266156354625137], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80", 1, 0, 0.0, 2242.0, 2242, 2242, 2242.0, 2242.0, 2242.0, 2242.0, 0.44603033006244425, 4.820960637823372, 0.17205271520963425], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 959, 96.38190954773869, 0.3402905421229304], "isController": false}, {"data": ["502/Bad Gateway", 20, 2.0100502512562812, 0.007096778772115337], "isController": false}, {"data": ["502/Proxy Error", 16, 1.6080402010050252, 0.0056774230176922695], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 281818, 995, "504/Gateway Time-out", 959, "502/Bad Gateway", 20, "502/Proxy Error", 16, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 258, 186, "504/Gateway Time-out", 150, "502/Bad Gateway", 20, "502/Proxy Error", 16, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 150, 150, "504/Gateway Time-out", 150, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 188, 150, "504/Gateway Time-out", 150, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 150, 150, "504/Gateway Time-out", 150, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 200, 68, "504/Gateway Time-out", 68, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 150, 150, "504/Gateway Time-out", 150, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 236, 141, "504/Gateway Time-out", 141, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
