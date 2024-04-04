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

    var data = {"OkPercent": 99.8553337461436, "KoPercent": 0.14466625385639684};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4055148529500408, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77"], "isController": false}, {"data": [0.435575246949448, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -78"], "isController": false}, {"data": [0.43788501026694043, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -77"], "isController": false}, {"data": [0.4396931382298622, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -77"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.4373407285264578, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78"], "isController": false}, {"data": [0.44403798804080197, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -79"], "isController": false}, {"data": [0.43598200899550227, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -77"], "isController": false}, {"data": [0.0803357314148681, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP "], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -79"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -77"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -78"], "isController": false}, {"data": [0.08413615928066795, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.44572345472303615, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -78"], "isController": false}, {"data": [0.4369766746411483, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_CityLevel1234_Summaries_24hourly_REST"], "isController": false}, {"data": [0.4423215313759355, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.4446394720213438, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -80"], "isController": false}, {"data": [0.43822949825678337, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80"], "isController": false}, {"data": [0.43802691909480845, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79"], "isController": false}, {"data": [0.43703433162892624, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.4406640485540878, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -80"], "isController": false}, {"data": [0.44101083032490973, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -78"], "isController": false}, {"data": [0.4457494407158837, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -77"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 182489, 264, 0.14466625385639684, 1567.7268383299545, 26, 90003, 943.0, 1758.0, 3422.9000000000015, 8351.640000000058, 50.55720164951081, 1665.9607659934015, 18.260907778538492], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77", 1, 1, 100.0, 896.0, 896, 896, 896.0, 896.0, 896.0, 896.0, 1.1160714285714286, 1.7852783203125, 0.43814522879464285], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 6884, 2, 0.02905287623474724, 1319.947704822777, 609, 60062, 1019.0, 1642.5, 2324.5, 6482.649999999981, 1.9127678923959697, 16.9872221077895, 0.7004765230942271], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 6818, 3, 0.04400117336462306, 1317.0882956878845, 613, 69882, 1018.0, 1622.2000000000007, 2190.349999999995, 6340.4299999999985, 1.899845961448007, 16.86444896960943, 0.6957443706474635], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 1500, 2, 0.13333333333333333, 4779.539999999998, 2312, 85580, 3895.0, 6583.700000000003, 9261.15000000001, 19628.710000000003, 0.4166241941446525, 235.19078434833864, 0.15664093236883905], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -77", 1, 0, 0.0, 1084.0, 1084, 1084, 1084.0, 1084.0, 1084.0, 1084.0, 0.9225092250922509, 8.188170260608855, 0.3378329681734317], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 14078, 6, 0.04261969029691717, 1293.5641426338918, 578, 82920, 995.0, 1599.1000000000004, 2290.0, 6723.739999999918, 3.9043942045899236, 13.260212343555905, 1.3611999326548854], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -80", 1, 0, 0.0, 1005.0, 1005, 1005, 1005.0, 1005.0, 1005.0, 1005.0, 0.9950248756218905, 2.961753731343284, 0.32649253731343286], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 1612, 8, 0.49627791563275436, 4449.107940446639, 2241, 69553, 3430.0, 6076.000000000004, 8152.649999999998, 25597.819999999883, 0.44754294205068507, 32.183377152499006, 0.17351030077550975], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 6671, 4, 0.0599610253335332, 1316.9466346874538, 575, 68440, 998.0, 1609.0, 2175.5999999999985, 7045.079999999946, 1.856019515609789, 7.7843134403210845, 0.7286326614014992], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 3988, 4, 0.10030090270812438, 4484.175777332004, 2414, 60066, 3845.0, 5948.0, 7610.65, 16963.530000000002, 1.106937427780521, 625.0896644601127, 0.4161825289995123], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78", 1, 0, 0.0, 1165.0, 1165, 1165, 1165.0, 1165.0, 1165.0, 1165.0, 0.8583690987124463, 3.601964860515021, 0.3369769313304721], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 14215, 3, 0.021104467112205417, 1249.7006683081318, 580, 63411, 976.0, 1556.0, 2109.399999999998, 6015.200000000001, 3.9490575740090614, 11.752518466150201, 1.2957845164717234], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 6670, 2, 0.029985007496251874, 1301.6772113943048, 623, 60062, 1025.0, 1637.9000000000005, 2288.45, 6521.829999999999, 1.849891946341485, 16.417759876623716, 0.6774506639434149], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 1668, 2, 0.11990407673860912, 2158.5425659472467, 1163, 61416, 1806.5, 2697.2000000000003, 3783.55, 7077.529999999992, 0.463225633373574, 34.00805070199651, 0.17054303103695057], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80", 1, 0, 0.0, 680.0, 680, 680, 680.0, 680.0, 680.0, 680.0, 1.4705882352941175, 6.171013327205882, 0.5773207720588235], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 678, 2, 0.2949852507374631, 5311.045722713861, 2887, 64511, 4445.0, 7468.300000000001, 10212.399999999998, 19324.80000000009, 0.1882624734301395, 68.97006528185224, 0.23146724028178284], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -79", 1, 0, 0.0, 783.0, 783, 783, 783.0, 783.0, 783.0, 783.0, 1.277139208173691, 4.339030571519795, 0.44525263409961685], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -77", 1, 0, 0.0, 918.0, 918, 918, 918.0, 918.0, 918.0, 918.0, 1.0893246187363836, 3.2424428104575163, 0.3574346405228758], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -78", 1, 0, 0.0, 940.0, 940, 940, 940.0, 940.0, 940.0, 940.0, 1.0638297872340425, 3.614320146276596, 0.3708859707446809], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 3114, 2, 0.06422607578676943, 2303.363198458568, 1164, 66212, 1827.5, 2892.5, 4512.75, 12892.44999999997, 0.8643817269591889, 69.0054528596733, 0.49212358087617886], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 14334, 5, 0.03488209850704618, 1264.8290079531234, 580, 84704, 980.0, 1543.5, 2055.25, 5705.65, 3.9767156556753513, 11.83354794027963, 1.3048598245184746], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 6688, 7, 0.10466507177033493, 1387.5067284689019, 587, 71759, 1000.0, 1629.2000000000007, 2251.399999999994, 7886.749999999959, 1.8603988730789602, 7.799631120480717, 0.7303519013454511], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 438, 13, 2.9680365296803655, 16370.952054794561, 9938, 75844, 13410.5, 22102.00000000002, 33552.99999999994, 60063.61, 0.12162629349424288, 157.26707178537262, 0.07114663066704247], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 279, 151, 54.121863799283155, 25734.2329749104, 8976, 90002, 21256.0, 45849.0, 60060.0, 72992.59999999995, 0.07729484659466333, 13.675067210933896, 0.027626868997701934], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 13896, 6, 0.04317789291882556, 1290.3277921704084, 602, 69643, 989.0, 1575.0, 2189.1499999999996, 6979.970000000065, 3.859214221104425, 13.106708498658467, 1.3454487079436326], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 373, 4, 1.0723860589812333, 9661.723860589816, 5247, 73741, 7771.0, 12267.000000000005, 20454.800000000003, 60062.0, 0.10348813271340335, 58.5304422554427, 0.0459834964693345], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -80", 14243, 5, 0.03510496384188724, 1267.4489222776035, 590, 78680, 979.0, 1552.0, 2087.0, 5768.999999999962, 3.95384085811366, 11.765457638237303, 1.2973540315685446], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 6597, 8, 0.12126724268606942, 1333.3674397453356, 586, 90003, 1003.0, 1616.0, 2119.199999999999, 6796.419999999919, 1.8322643504460399, 7.680495221638855, 0.7193069032024492], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 6761, 4, 0.05916284573287975, 1311.6493122319146, 584, 63057, 1010.0, 1613.6000000000004, 2143.0, 7045.060000000004, 1.8785820803664137, 7.8789978587922285, 0.737490230768846], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 6845, 3, 0.04382761139517896, 1313.5142439737022, 617, 65946, 1015.0, 1625.800000000001, 2229.0, 6539.459999999993, 1.9067760609210076, 16.93915393062594, 0.6982822488724393], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 1971, 7, 0.35514967021816335, 3637.752917300864, 1754, 67358, 2872.0, 4550.999999999999, 6445.7999999999965, 19015.519999999982, 0.5474048123854018, 177.54754062644244, 0.22933268018880604], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 14005, 4, 0.028561228132809712, 1275.1221706533408, 26, 62849, 992.0, 1595.0, 2218.0999999999967, 6163.040000000008, 3.8956797870825324, 13.232156641758516, 1.3581618007699845], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 13850, 3, 0.021660649819494584, 1260.0206498194962, 597, 89820, 990.0, 1589.8999999999996, 2126.0, 5976.409999999998, 3.8445310504868817, 13.059255602241626, 1.340329672874821], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -77", 14304, 3, 0.02097315436241611, 1223.144854586136, 582, 61863, 981.0, 1541.5, 2060.75, 5554.500000000007, 3.9790432604120243, 11.84182863607193, 1.3056235698226957], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80", 1, 0, 0.0, 936.0, 936, 936, 936.0, 936.0, 936.0, 936.0, 1.0683760683760686, 4.483214810363248, 0.4194210737179487], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 2, 0.7575757575757576, 0.0010959564686090668], "isController": false}, {"data": ["502/Bad Gateway", 1, 0.3787878787878788, 5.479782343045334E-4], "isController": false}, {"data": ["502/Proxy Error", 114, 43.18181818181818, 0.06246951871071681], "isController": false}, {"data": ["Was not a proper XML response", 147, 55.68181818181818, 0.08055280044276641], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 182489, 264, "Was not a proper XML response", 147, "502/Proxy Error", 114, "504/Gateway Time-out", 2, "502/Bad Gateway", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77", 1, 1, "Was not a proper XML response", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 6884, 2, "502/Proxy Error", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 6818, 3, "502/Proxy Error", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 1500, 2, "Was not a proper XML response", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 14078, 6, "502/Proxy Error", 5, "Was not a proper XML response", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 1612, 8, "502/Proxy Error", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 6671, 4, "502/Proxy Error", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 3988, 4, "Was not a proper XML response", 3, "502/Proxy Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 14215, 3, "502/Proxy Error", 2, "Was not a proper XML response", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 6670, 2, "502/Proxy Error", 1, "Was not a proper XML response", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 1668, 2, "502/Proxy Error", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 678, 2, "502/Proxy Error", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 3114, 2, "502/Proxy Error", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 14334, 5, "502/Proxy Error", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 6688, 7, "502/Proxy Error", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 438, 13, "502/Proxy Error", 12, "Was not a proper XML response", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 279, 151, "Was not a proper XML response", 135, "502/Proxy Error", 15, "504/Gateway Time-out", 1, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 13896, 6, "502/Proxy Error", 5, "Was not a proper XML response", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 373, 4, "502/Proxy Error", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -80", 14243, 5, "502/Proxy Error", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 6597, 8, "502/Proxy Error", 7, "504/Gateway Time-out", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 6761, 4, "502/Proxy Error", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 6845, 3, "502/Proxy Error", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 1971, 7, "502/Proxy Error", 6, "Was not a proper XML response", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 14005, 4, "502/Proxy Error", 3, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 13850, 3, "502/Proxy Error", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -77", 14304, 3, "502/Proxy Error", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
