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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.43908613134934404, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -79"], "isController": false}, {"data": [0.47172044350317677, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -78"], "isController": false}, {"data": [0.47014080965551924, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -78"], "isController": false}, {"data": [0.4778389576405168, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -77"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.4739413680781759, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.47759484228474, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -79"], "isController": false}, {"data": [0.4711694809255785, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -77"], "isController": false}, {"data": [0.00196078431372549, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP "], "isController": false}, {"data": [7.918910357934748E-4, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -79"], "isController": false}, {"data": [0.47911101613420237, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -78"], "isController": false}, {"data": [0.47120200333889817, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_CityLevel1234_Summaries_24hourly_REST"], "isController": false}, {"data": [0.4781216648879402, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.4793885811674478, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -80"], "isController": false}, {"data": [0.4713891554702495, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80"], "isController": false}, {"data": [0.47244094488188976, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -80"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -80"], "isController": false}, {"data": [0.47066549912434325, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -79"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.4782283485601325, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -80"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -79"], "isController": false}, {"data": [0.4792427497314715, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -78"], "isController": false}, {"data": [0.4786727377400953, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -77"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -77"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 233469, 0, 0.0, 1225.4302755397985, 517, 44951, 836.0, 1968.0, 3065.9000000000015, 9318.87000000002, 64.61090904260486, 1741.0339922484463, 23.219619757813216], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_1Point_maxt_SOAP 34 -77", 1, 0, 0.0, 876.0, 876, 876, 876.0, 876.0, 876.0, 876.0, 1.141552511415525, 3.3900988156392695, 0.3745719178082192], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -79", 1, 0, 0.0, 1501.0, 1501, 1501, 1501.0, 1501.0, 1501.0, 1501.0, 0.6662225183211192, 1.9830529646902066, 0.21860426382411727], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 8027, 0, 0.0, 1103.4899713466991, 632, 11861, 916.0, 1241.0, 1607.5999999999995, 7411.640000000003, 2.230977146867335, 19.5674769748956, 0.817008232495362], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 7954, 0, 0.0, 1119.567513200905, 614, 10233, 916.0, 1259.0, 1707.5, 7462.099999999997, 2.2110597464258612, 19.41215040432316, 0.8097142626071269], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 1977, 0, 0.0, 3633.3763277693447, 2233, 16275, 3085.0, 4923.000000000002, 8031.399999999998, 10780.080000000007, 0.5472438645437185, 238.8761008434358, 0.2057508670403629], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -78", 1, 0, 0.0, 705.0, 705, 705, 705.0, 705.0, 705.0, 705.0, 1.4184397163120568, 4.744292996453901, 0.4945146276595745], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 18343, 0, 0.0, 963.7203837976396, 536, 11213, 787.0, 1086.0, 1373.7999999999993, 7078.840000000018, 5.094969249084361, 17.041278982533143, 1.776273458909294], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -78", 1, 0, 0.0, 745.0, 745, 745, 745.0, 745.0, 745.0, 745.0, 1.3422818791946307, 3.9953859060402683, 0.44043624161073824], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 2118, 0, 0.0, 3386.4428706326726, 2164, 19229, 2825.0, 4863.100000000003, 7904.649999999994, 10824.869999999999, 0.5879580201304834, 37.15135395430223, 0.22794856835136906], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 8289, 0, 0.0, 1073.3417782603447, 595, 12188, 875.0, 1214.0, 1555.5, 7285.5000000000055, 2.303331118645311, 9.48099674325194, 0.9042374118119288], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 4976, 0, 0.0, 3593.5697347266987, 2298, 24080, 3070.0, 4718.000000000002, 7545.7999999999665, 10654.46, 1.3816442343841715, 603.0979167117868, 0.5194658498417051], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 18768, 0, 0.0, 959.6557971014508, 517, 12674, 780.0, 1083.0, 1382.5499999999993, 6960.4800000000105, 5.216975071765374, 15.52865236205162, 1.7118199454230134], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 7995, 0, 0.0, 1121.7778611632277, 634, 13719, 913.0, 1244.4000000000005, 1640.5999999999995, 7606.04, 2.2210961630459605, 19.456935107980833, 0.813389708146714], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 1530, 0, 0.0, 2353.349673202621, 1423, 13812, 1959.0, 2772.8, 4821.30000000001, 9752.790000000005, 0.42488657888824677, 31.676274554729975, 0.15642796898522368], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 814, 0, 0.0, 4424.186732186732, 2654, 14810, 3749.5, 6530.5, 9226.5, 11356.650000000003, 0.22599302975306512, 81.70396739188149, 0.27785666451084867], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 3157, 0, 0.0, 2271.259423503326, 1408, 13300, 1901.0, 2582.2000000000016, 4303.199999999999, 9313.0, 0.8767423066348592, 69.71809114582611, 0.49916090309387], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -79", 1, 0, 0.0, 872.0, 872, 872, 872.0, 872.0, 872.0, 872.0, 1.146788990825688, 3.413489105504587, 0.3762901376146789], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 18718, 0, 0.0, 937.3354525056111, 518, 12598, 779.0, 1074.0, 1329.0499999999993, 6667.430000000004, 5.199081952897173, 15.47539237542049, 1.7059487657943848], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 8386, 0, 0.0, 1071.3611972334863, 604, 14036, 880.0, 1217.0, 1646.8499999999967, 7188.209999999986, 2.3309854848483162, 9.594827947886381, 0.915093911043968], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 464, 0, 0.0, 15482.258620689665, 10692, 44951, 14128.5, 20241.0, 21783.75, 27837.65, 0.1286231748468511, 167.11336972066317, 0.07523953294264044], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 601, 0, 0.0, 11965.106489184695, 7371, 26602, 12042.0, 16692.00000000001, 19474.6, 21948.680000000004, 0.16634794842604672, 49.91354817458037, 0.05945639562884091], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 18740, 0, 0.0, 966.2031483457858, 531, 14097, 790.0, 1097.0, 1379.0, 7127.18, 5.204383123690746, 17.40723847523516, 1.8144187257398403], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 208, 0, 0.0, 17309.802884615383, 11703, 34627, 15320.5, 23419.899999999998, 24578.399999999998, 30131.449999999997, 0.05776636891991609, 32.56799843011908, 0.025667673690001783], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -80", 18776, 0, 0.0, 940.7051022582008, 539, 10202, 779.0, 1071.0, 1315.0, 6824.149999999998, 5.2029687070916495, 15.48696154220249, 1.7072241070144476], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 8336, 0, 0.0, 1072.6926583493344, 603, 11619, 874.0, 1220.0, 1627.1499999999996, 7305.449999999988, 2.315195414046704, 9.498179623447465, 0.9088950746550537], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 8382, 0, 0.0, 1062.473872584102, 594, 10347, 871.0, 1216.0, 1586.2499999999973, 6985.690000000004, 2.332214527008697, 9.604442051167652, 0.9155764061108361], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -80", 1, 0, 0.0, 830.0, 830, 830, 830.0, 830.0, 830.0, 830.0, 1.2048192771084338, 10.573936370481928, 0.44121799698795183], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -80", 1, 0, 0.0, 1008.0, 1008, 1008, 1008.0, 1008.0, 1008.0, 1008.0, 0.992063492063492, 3.3181811135912698, 0.3458658854166667], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 7994, 0, 0.0, 1125.5529146860165, 653, 10556, 917.0, 1263.0, 1726.75, 7531.650000000002, 2.220596883330884, 19.502405875939218, 0.8132068664541813], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78", 1, 0, 0.0, 940.0, 940, 940, 940.0, 940.0, 940.0, 940.0, 1.0638297872340425, 4.381025598404255, 0.41763630319148937], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 2462, 0, 0.0, 2918.1937449228267, 1905, 15225, 2495.0, 3478.4000000000005, 5920.549999999999, 9980.209999999995, 0.681341617547065, 185.7819885690726, 0.28544487688251063], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 18717, 0, 0.0, 957.4119249879825, 524, 13768, 790.0, 1094.0, 1353.199999999997, 6849.939999999995, 5.201813811917621, 17.398644829900242, 1.813522979350186], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -79", 1, 0, 0.0, 770.0, 770, 770, 770.0, 770.0, 770.0, 770.0, 1.2987012987012987, 4.34380073051948, 0.45276988636363635], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 18620, 0, 0.0, 951.8660580021516, 529, 11792, 789.0, 1086.0, 1332.8500000000022, 6632.540000000023, 5.175659722888174, 17.311166553605464, 1.8044048057334747], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -77", 19107, 0, 0.0, 953.43240697127, 529, 10365, 778.0, 1081.0, 1354.0, 6937.1999999999825, 5.310811881298199, 15.807963490426669, 1.7426101485509713], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -77", 1, 0, 0.0, 755.0, 755, 755, 755.0, 755.0, 755.0, 755.0, 1.3245033112582782, 4.430101407284768, 0.4617653145695364], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 233469, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
