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

    var data = {"OkPercent": 99.89185214796625, "KoPercent": 0.1081478520337507};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4561947660722699, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -79"], "isController": false}, {"data": [0.4860414497965364, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -78"], "isController": false}, {"data": [0.48677606177606175, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -77"], "isController": false}, {"data": [0.4872177645083038, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -77"], "isController": false}, {"data": [0.4859288838182164, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.48851479646181634, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -79"], "isController": false}, {"data": [0.487355010458262, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -77"], "isController": false}, {"data": [0.41177787729511867, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP "], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -79"], "isController": false}, {"data": [0.43992440819574297, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.4889888482803861, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -78"], "isController": false}, {"data": [0.48821062441752094, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_CityLevel1234_Summaries_24hourly_REST"], "isController": false}, {"data": [0.48666260372228215, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -78"], "isController": false}, {"data": [0.48935874895900805, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -80"], "isController": false}, {"data": [0.4863207547169811, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80"], "isController": false}, {"data": [0.48669292851652574, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79"], "isController": false}, {"data": [0.48689915174363807, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -79"], "isController": false}, {"data": [0.48704128977831934, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -80"], "isController": false}, {"data": [0.001371951219512195, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -79"], "isController": false}, {"data": [0.48687744428214674, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -78"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -80"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -78"], "isController": false}, {"data": [0.4906029939840507, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -77"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 280172, 303, 0.1081478520337507, 1020.9410861899345, 2, 90004, 686.0, 1241.0, 2346.9500000000007, 6749.600000000224, 77.54155959354419, 2627.8991280373134, 28.0884776757729], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_1Point_maxt_SOAP 34 -79", 1, 0, 0.0, 969.0, 969, 969, 969.0, 969.0, 969.0, 969.0, 1.0319917440660473, 3.0717879256965945, 0.33862229102167185], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 10567, 5, 0.04731711933377496, 874.042680041639, 447, 90001, 691.0, 912.0, 1066.0, 3936.9199999999983, 2.938148185324385, 26.085158772646775, 1.0759820014615666], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 10360, 4, 0.03861003861003861, 838.5270270270277, 463, 60063, 692.0, 916.8999999999996, 1069.949999999999, 3826.3899999999994, 2.878360645808554, 25.54831345317913, 1.0540871505646559], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 2457, 3, 0.1221001221001221, 2918.5995115995106, 1855, 60062, 2421.0, 3411.800000000001, 4977.299999999996, 13091.420000000004, 0.6821695267625906, 385.13319080414584, 0.25647975371445053], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -77", 1, 0, 0.0, 740.0, 740, 740, 740.0, 740.0, 740.0, 740.0, 1.3513513513513513, 11.994562922297298, 0.4948796452702703], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 21436, 6, 0.02799029669714499, 830.4514834857229, 444, 90004, 678.0, 882.9000000000015, 1008.0, 3804.9900000000016, 5.958514440836115, 20.238926850486205, 2.0773336478305597], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 10518, 1, 0.009507510933637574, 836.1229321163726, 443, 49849, 683.0, 914.0, 1054.0499999999993, 4158.859999999997, 2.9224727820757224, 12.262521680893508, 1.1472988851508208], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 2620, 7, 0.26717557251908397, 2736.832061068703, 1633, 60062, 2320.0, 2932.6000000000004, 4123.699999999999, 9888.979999999998, 0.7275991117736644, 52.440596769952876, 0.2820867650138133], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 6061, 15, 0.24748391354561952, 2949.4502557333776, 1887, 90002, 2422.0, 3391.8, 4867.699999999999, 12335.780000000046, 1.6828412112569608, 948.8929932719843, 0.6327088538417285], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 21593, 8, 0.03704904367156023, 841.8198027138416, 414, 90001, 666.0, 862.0, 991.0, 3864.9900000000016, 6.003063110700398, 17.862913885179776, 1.9697550831985682], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 10518, 4, 0.038030043734550295, 845.1035367940638, 444, 60064, 691.0, 916.0, 1054.0499999999993, 3894.859999999997, 2.921452426822033, 25.922303403913574, 1.0698678320881467], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 2233, 5, 0.2239140170174653, 1611.922973578144, 947, 90001, 1267.0, 1670.4000000000005, 2074.899999999999, 5833.539999999968, 0.6202943189596167, 45.49080917114387, 0.22837007641384327], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80", 1, 0, 0.0, 805.0, 805, 805, 805.0, 805.0, 805.0, 805.0, 1.2422360248447206, 5.212781444099378, 0.48767468944099374], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 1174, 2, 0.17035775127768313, 3065.8884156729096, 2094, 90003, 2610.0, 3673.0, 4950.5, 10222.25, 0.3261069441890465, 119.61686348938319, 0.4009459401699312], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -79", 1, 0, 0.0, 665.0, 665, 665, 665.0, 665.0, 665.0, 665.0, 1.5037593984962407, 5.1089638157894735, 0.5242598684210527], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 5027, 4, 0.07957032027053909, 1426.2574099860778, 829, 60466, 1203.0, 1541.0, 1820.5999999999995, 4959.160000000007, 1.39613835961658, 111.43619263043354, 0.7948717418520176], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 21342, 12, 0.056227157717177394, 841.5165401555572, 400, 89997, 665.0, 872.0, 1004.0, 3782.980000000003, 5.928099502741836, 17.637091858112818, 1.9451576493371652], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 10730, 2, 0.01863932898415657, 834.1385834109982, 434, 90004, 683.5, 910.0, 1052.449999999999, 3875.4900000000107, 2.9831508968358027, 12.516056612482027, 1.1711197856718678], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79", 1, 0, 0.0, 978.0, 978, 978, 978.0, 978.0, 978.0, 978.0, 1.0224948875255624, 4.290684112985685, 0.40140912576687116], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 699, 9, 1.2875536480686696, 10273.670958512164, 7561, 60067, 8966.0, 11757.0, 13011.0, 60059.0, 0.19378088122895337, 254.90090175856844, 0.11335424595326471], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 382, 165, 43.19371727748691, 18818.675392670135, 7086, 90001, 15381.0, 30055.3, 43471.85, 89999.34, 0.10572389733711393, 23.14938259544557, 0.03778803361853877], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 21331, 4, 0.018752051005578734, 836.2785148375558, 418, 89632, 678.0, 884.0, 1027.0, 3886.920000000013, 5.924540501626464, 20.125176740158448, 2.0654892178521953], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 599, 3, 0.5008347245409015, 6013.622704507509, 2, 60062, 5195.0, 7312.0, 9068.0, 17545.0, 0.16625090064135656, 94.56869385649495, 0.07387124979669653], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -78", 2, 0, 0.0, 770.5, 574, 967, 770.5, 967.0, 967.0, 967.0, 0.012801720551242088, 0.04349334550563595, 0.004463099840618579], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -80", 21614, 5, 0.023133154436939023, 820.3977514573867, 121, 90002, 664.0, 858.0, 981.9500000000007, 3768.0, 6.003240205433357, 17.865553251676417, 1.9698131924078204], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 10600, 3, 0.02830188679245283, 866.2017924528301, 426, 60062, 688.0, 913.0, 1068.949999999999, 4609.319999999985, 2.9441631133025066, 12.35150393571767, 1.1558140347144605], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 10408, 3, 0.028823981552651805, 845.5652382782464, 440, 90002, 684.0, 915.0, 1074.0, 3910.0, 2.8912404138073953, 12.129356742152218, 1.1350377405767313], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 10610, 2, 0.01885014137606032, 840.2945334590034, 460, 60061, 693.0, 916.0, 1059.8999999999978, 4067.819999999978, 2.9487801610739894, 26.198148809714883, 1.0798755472683068], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 21337, 9, 0.04218025026948493, 835.9059380419008, 428, 90003, 679.0, 886.0, 1027.0, 3800.9600000000064, 5.9272259876788596, 20.130164895940194, 2.066425466407571], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 3280, 6, 0.18292682926829268, 2185.6057926829358, 1403, 60062, 1806.0, 2448.8, 3136.049999999993, 8400.76, 0.9110184908978699, 295.9895303981769, 0.3816669263624865], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -79", 1, 0, 0.0, 593.0, 593, 593, 593.0, 593.0, 593.0, 593.0, 1.6863406408094435, 5.729276454468803, 0.5879136804384486], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 21223, 9, 0.04240682278659944, 845.6953776563196, 427, 90000, 678.0, 887.0, 1015.9500000000007, 3888.8900000000176, 5.897151761559785, 20.028102224533296, 2.055940604371917], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -80", 1, 0, 0.0, 677.0, 677, 677, 677.0, 677.0, 677.0, 677.0, 1.4771048744460857, 4.396694977843427, 0.4846750369276218], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -78", 1, 0, 0.0, 716.0, 716, 716, 716.0, 716.0, 716.0, 716.0, 1.3966480446927374, 4.157210195530727, 0.4582751396648045], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -77", 21443, 7, 0.03264468591148627, 818.7278365900272, 396, 90000, 667.0, 865.0, 983.9500000000007, 3757.9900000000016, 5.960060948662259, 17.735664553188602, 1.9556449987798037], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 19, 6.270627062706271, 0.0067815484773639054], "isController": false}, {"data": ["502/Bad Gateway", 1, 0.33003300330033003, 3.569236040717845E-4], "isController": false}, {"data": ["502/Proxy Error", 114, 37.62376237623762, 0.04068929086418343], "isController": false}, {"data": ["Was not a proper XML response", 169, 55.775577557755774, 0.06032008908813158], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 280172, 303, "Was not a proper XML response", 169, "502/Proxy Error", 114, "504/Gateway Time-out", 19, "502/Bad Gateway", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 10567, 5, "502/Proxy Error", 3, "504/Gateway Time-out", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 10360, 4, "502/Proxy Error", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 2457, 3, "502/Proxy Error", 2, "Was not a proper XML response", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 21436, 6, "502/Proxy Error", 4, "504/Gateway Time-out", 1, "Was not a proper XML response", 1, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 10518, 1, "502/Proxy Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 2620, 7, "502/Proxy Error", 5, "Was not a proper XML response", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 6061, 15, "502/Proxy Error", 12, "Was not a proper XML response", 2, "504/Gateway Time-out", 1, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 21593, 8, "502/Proxy Error", 6, "504/Gateway Time-out", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 10518, 4, "502/Proxy Error", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 2233, 5, "502/Proxy Error", 3, "504/Gateway Time-out", 1, "Was not a proper XML response", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 1174, 2, "504/Gateway Time-out", 1, "502/Proxy Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 5027, 4, "502/Proxy Error", 3, "Was not a proper XML response", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 21342, 12, "502/Proxy Error", 10, "504/Gateway Time-out", 1, "Was not a proper XML response", 1, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 10730, 2, "504/Gateway Time-out", 1, "502/Proxy Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 699, 9, "502/Proxy Error", 8, "Was not a proper XML response", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 382, 165, "Was not a proper XML response", 154, "502/Proxy Error", 7, "504/Gateway Time-out", 4, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 21331, 4, "502/Proxy Error", 3, "Was not a proper XML response", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 599, 3, "502/Proxy Error", 2, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -80", 21614, 5, "502/Proxy Error", 4, "504/Gateway Time-out", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 10600, 3, "502/Proxy Error", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 10408, 3, "502/Proxy Error", 2, "504/Gateway Time-out", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 10610, 2, "502/Proxy Error", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 21337, 9, "502/Proxy Error", 5, "Was not a proper XML response", 3, "504/Gateway Time-out", 1, "", "", "", ""], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 3280, 6, "502/Proxy Error", 5, "Was not a proper XML response", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 21223, 9, "502/Proxy Error", 8, "504/Gateway Time-out", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -77", 21443, 7, "502/Proxy Error", 6, "504/Gateway Time-out", 1, "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
