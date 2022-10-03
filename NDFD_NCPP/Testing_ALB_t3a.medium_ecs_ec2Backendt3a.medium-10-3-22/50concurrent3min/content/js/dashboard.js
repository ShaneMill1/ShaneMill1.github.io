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

    var data = {"OkPercent": 90.77748861418347, "KoPercent": 9.222511385816526};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.062296681847755365, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77"], "isController": false}, {"data": [0.031746031746031744, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -78"], "isController": false}, {"data": [0.03684210526315789, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -77"], "isController": false}, {"data": [0.13350449293966624, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77"], "isController": false}, {"data": [0.0044742729306487695, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78"], "isController": false}, {"data": [0.2118380062305296, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -80"], "isController": false}, {"data": [0.031578947368421054, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -77"], "isController": false}, {"data": [0.0014388489208633094, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP "], "isController": false}, {"data": [0.0013799448022079118, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -78"], "isController": false}, {"data": [0.13688946015424164, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_CityLevel1234_Summaries_24hourly_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -80"], "isController": false}, {"data": [0.12387676508344031, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80"], "isController": false}, {"data": [0.13222079589216945, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79"], "isController": false}, {"data": [0.026455026455026454, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -80"], "isController": false}, {"data": [0.05455455455455455, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 12296, 1134, 9.222511385816526, 10670.241541964866, 93, 60358, 8226.0, 21707.10000000002, 41872.94999999999, 60191.0, 4.434188400356438, 252.92214616681707, 1.798584368854803], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_1Point_maxt_SOAP 34 -79", 1, 0, 0.0, 14673.0, 14673, 14673, 14673.0, 14673.0, 14673.0, 14673.0, 0.06815238874122538, 0.19267691934164793, 0.022096282287194166], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77", 1, 0, 0.0, 1922.0, 1922, 1922, 1922.0, 1922.0, 1922.0, 1922.0, 0.5202913631633715, 0.2504918379292404, 0.20222261966701355], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 189, 0, 0.0, 11593.85185185185, 423, 57331, 6889.0, 24648.0, 43594.5, 55525.59999999999, 1.0012661513766086, 3.964980021031887, 0.36276342007882983], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 190, 0, 0.0, 11234.431578947371, 574, 55764, 5727.5, 27391.500000000004, 43196.699999999975, 55744.89, 1.0165211436397876, 4.052698846917266, 0.3682903752835559], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 752, 0, 0.0, 12287.259308510647, 5048, 20975, 12314.5, 14344.0, 14673.35, 15760.220000000003, 3.9617522324368464, 685.7003859020625, 1.4740503911703502], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 178, 0, 0.0, 13500.011235955055, 2093, 60118, 11351.0, 14133.699999999999, 48898.1, 57225.020000000026, 0.8678735634986031, 2.142267651841306, 0.2864660785766874], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 779, 0, 0.0, 2794.774069319635, 221, 20165, 1984.0, 5720.0, 6943.0, 11427.800000000005, 4.295963779345183, 36.973747452890535, 1.6697202970501783], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 447, 48, 10.738255033557047, 20140.44966442953, 110, 60197, 13242.0, 60099.0, 60111.0, 60181.56, 2.4145977831075385, 108.64570103180841, 0.9266962194934206], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78", 1, 0, 0.0, 2854.0, 2854, 2854, 2854.0, 2854.0, 2854.0, 2854.0, 0.35038542396636296, 3.3875153293622984, 0.13618495970567623], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 1284, 331, 25.778816199376948, 7183.12694704049, 96, 50508, 8478.5, 15046.0, 20053.0, 41815.5, 6.773044969009627, 606.8945183716867, 2.520048958195965], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 216, 0, 0.0, 10537.930555555555, 1561, 16605, 10931.0, 13059.500000000002, 14158.35, 15294.339999999997, 1.1140567137390012, 2.8955380835903575, 0.3611980751575668], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -80", 1, 0, 0.0, 13773.0, 13773, 13773, 13773.0, 13773.0, 13773.0, 13773.0, 0.07260582298700355, 0.22377341537791332, 0.023965593915632036], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 190, 0, 0.0, 12385.289473684217, 588, 57015, 9148.5, 25234.400000000005, 47589.44999999993, 56248.780000000006, 1.007348341056337, 3.9872997066760685, 0.3649670259100597], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 1390, 335, 24.100719424460433, 7391.472661870503, 97, 49572, 8173.5, 9228.8, 9431.45, 49443.09, 6.319187143409179, 136.86966179278522, 2.301813285636351], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -77", 1, 0, 0.0, 12784.0, 12784, 12784, 12784.0, 12784.0, 12784.0, 12784.0, 0.07822277847309136, 0.24429340386420526, 0.02581962805068836], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77", 1, 0, 0.0, 2762.0, 2762, 2762, 2762.0, 2762.0, 2762.0, 2762.0, 0.3620564808110065, 3.500350742215786, 0.1407211712527154], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 157, 146, 92.99363057324841, 58500.73248407645, 7609, 60354, 60190.0, 60200.0, 60202.2, 60286.72, 0.6806289531753291, 6.394973188042172, 0.8241991229857502], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 1087, 0, 0.0, 8093.96780128794, 996, 20346, 7626.0, 8574.2, 8787.8, 20252.6, 6.008280040018351, 260.0224006381379, 3.397259905440064], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 216, 0, 0.0, 10543.615740740734, 2138, 15399, 10930.0, 13056.7, 13749.599999999999, 14942.179999999995, 1.116342531099959, 2.743877720438888, 0.36193918000506486], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 778, 0, 0.0, 2841.5514138817507, 420, 20361, 2026.5, 5853.9000000000015, 7034.4, 11032.660000000002, 4.303501988571934, 37.89661348999906, 1.6726501869644823], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79", 1, 0, 0.0, 3361.0, 3361, 3361, 3361.0, 3361.0, 3361.0, 3361.0, 0.2975304968759298, 2.8765155459684615, 0.11564173609044927], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 267, 1, 0.37453183520599254, 36399.15355805243, 13217, 60113, 35460.0, 52411.6, 53249.2, 58956.439999999995, 1.3101015206009785, 619.9859224270858, 0.7612406296460764], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 300, 50, 16.666666666666668, 36226.98, 25396, 60357, 31711.0, 60109.0, 60112.95, 60341.94, 1.3486055418697067, 394.16267505180895, 0.476753131012533], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 180, 0, 0.0, 13603.505555555557, 3260, 50357, 11494.0, 15032.800000000003, 48057.5, 49944.71, 0.8769109350793605, 2.4112719516992587, 0.28944911724299205], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 150, 150, 100.0, 60193.506666666675, 60177, 60358, 60189.0, 60197.9, 60210.6, 60334.03, 0.7880386243997772, 0.29474491518077606, 0.34707560508232377], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -80", 216, 0, 0.0, 10425.875000000002, 1873, 16396, 11012.5, 12990.500000000002, 14038.149999999996, 15146.449999999999, 1.114815694127605, 2.9217239547312572, 0.36144415083043446], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 779, 0, 0.0, 2802.03594351733, 227, 22923, 2013.0, 5450.0, 6903.0, 10124.800000000005, 4.300683471904778, 37.97798586785198, 1.67155470880674], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 779, 0, 0.0, 2823.8973042361986, 338, 19396, 2084.0, 5404.0, 6951.0, 11334.0, 4.305603917602127, 39.39235506585529, 1.6734671476617642], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 189, 0, 0.0, 11938.587301587297, 472, 56471, 8930.0, 26052.0, 42291.0, 55302.799999999996, 1.0042934875021254, 4.0002208930905665, 0.3638602381477427], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78", 1, 0, 0.0, 3385.0, 3385, 3385, 3385.0, 3385.0, 3385.0, 3385.0, 0.2954209748892171, 2.856120753323486, 0.11482182422451995], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 179, 0, 0.0, 13731.592178770949, 2691, 50476, 11446.0, 15183.0, 48697.0, 50286.399999999994, 0.873699213182608, 2.3500447755593625, 0.28838899810129054], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 999, 73, 7.307307307307307, 9250.988988988982, 93, 32783, 9817.0, 12411.0, 14430.0, 32048.0, 5.261217611122814, 571.8562947239704, 2.1836108249289023], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -80", 1, 0, 0.0, 14291.0, 14291, 14291, 14291.0, 14291.0, 14291.0, 14291.0, 0.0699741095794556, 0.19782719456301168, 0.02268691834021412], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 179, 0, 0.0, 13616.335195530723, 2278, 59247, 11511.0, 14467.0, 48348.0, 52137.3999999999, 0.8753484277959802, 2.3290459267568093, 0.288933367768595], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -77", 216, 0, 0.0, 10606.819444444449, 2075, 15349, 11233.0, 13358.0, 13740.15, 15122.399999999998, 1.117763644737455, 2.880895507857982, 0.36239993169222173], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80", 1, 0, 0.0, 1789.0, 1789, 1789, 1789.0, 1789.0, 1789.0, 1789.0, 0.5589714924538849, 0.269114204863052, 0.21725649804359978], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503/Service Unavailable", 321, 28.306878306878307, 2.61060507482108], "isController": false}, {"data": ["504/Gateway Time-out", 394, 34.74426807760141, 3.2042940793754067], "isController": false}, {"data": ["502/Bad Gateway", 208, 18.34215167548501, 1.6916070266753416], "isController": false}, {"data": ["502/Proxy Error", 211, 18.606701940035272, 1.7160052049446974], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 12296, 1134, "504/Gateway Time-out", 394, "503/Service Unavailable", 321, "502/Proxy Error", 211, "502/Bad Gateway", 208, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 447, 48, "504/Gateway Time-out", 47, "502/Proxy Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 1284, 331, "503/Service Unavailable", 126, "502/Bad Gateway", 106, "502/Proxy Error", 99, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 1390, 335, "503/Service Unavailable", 187, "502/Proxy Error", 76, "502/Bad Gateway", 72, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 157, 146, "504/Gateway Time-out", 146, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 267, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 300, 50, "504/Gateway Time-out", 50, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 150, 150, "504/Gateway Time-out", 150, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 999, 73, "502/Proxy Error", 35, "502/Bad Gateway", 30, "503/Service Unavailable", 8, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
