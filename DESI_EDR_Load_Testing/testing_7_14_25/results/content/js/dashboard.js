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

    var data = {"OkPercent": 99.99863503151471, "KoPercent": 0.0013649684852864426};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7545112208438717, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.837480037746806, 500, 1500, "NBM_ResLevel-1_Times-One_100threads"], "isController": false}, {"data": [0.4495341614906832, 500, 1500, "HREF_ResLevel-4_Times-One_50threads"], "isController": false}, {"data": [0.4912959381044487, 500, 1500, "HREF_ResLevel-2_Times-One_25threads"], "isController": false}, {"data": [0.9322696753651277, 500, 1500, "MRMS_ResLevel-1_Times-One_50threads"], "isController": false}, {"data": [0.5370193455935037, 500, 1500, "LREF_ResLevel-2_Times-One_100threads"], "isController": false}, {"data": [0.9690533980582524, 500, 1500, "MRMS_ResLevel-1_Times-One_5threads"], "isController": false}, {"data": [0.9011270491803278, 500, 1500, "NBM_ResLevel-1_Times-One_25threads"], "isController": false}, {"data": [0.22933316284125055, 500, 1500, "HREF_ResLevel-2_Times-One_100threads"], "isController": false}, {"data": [0.993854988461332, 500, 1500, "LREF_ResLevel-1_Times-One_50threads"], "isController": false}, {"data": [0.9669900615238997, 500, 1500, "LREF_ResLevel-4_Times-One_25threads"], "isController": false}, {"data": [0.024919467574302558, 500, 1500, "HREF_ResLevel-2_Times-One_250threads"], "isController": false}, {"data": [0.1976491727184248, 500, 1500, "LREF_ResLevel-2_Times-One_250threads"], "isController": false}, {"data": [0.9004992867332382, 500, 1500, "LREF_ResLevel-2_Times-One_5threads"], "isController": false}, {"data": [0.5, 500, 1500, "HREF_ResLevel-2_Times-One_5threads"], "isController": false}, {"data": [0.9965940054495913, 500, 1500, "LREF_ResLevel-1_Times-One_5threads"], "isController": false}, {"data": [0.49737876802096986, 500, 1500, "HREF_ResLevel-4_Times-One_5threads"], "isController": false}, {"data": [0.9052924791086351, 500, 1500, "HREF_ResLevel-1_Times-One_5threads"], "isController": false}, {"data": [0.96, 500, 1500, "LREF_ResLevel-4_Times-One_5threads"], "isController": false}, {"data": [0.47363420427553443, 500, 1500, "NBM_ResLevel-8_Times-One_25threads"], "isController": false}, {"data": [0.8369803524749135, 500, 1500, "MRMS_ResLevel-1_Times-One_250threads"], "isController": false}, {"data": [0.48580786026200873, 500, 1500, "NBM_ResLevel-4_Times-One_5threads"], "isController": false}, {"data": [0.7878366823428816, 500, 1500, "LREF_ResLevel-4_Times-One_50threads"], "isController": false}, {"data": [0.8746543778801843, 500, 1500, "NBM_ResLevel-1_Times-One_5threads"], "isController": false}, {"data": [0.07691788222582388, 500, 1500, "NBM_ResLevel-4_Times-One_100threads"], "isController": false}, {"data": [0.4662960389159138, 500, 1500, "HREF_ResLevel-4_Times-One_25threads"], "isController": false}, {"data": [0.9003564696972285, 500, 1500, "LREF_ResLevel-1_Times-One_250threads"], "isController": false}, {"data": [0.8212969400647423, 500, 1500, "HREF_ResLevel-1_Times-One_250threads"], "isController": false}, {"data": [0.012640995721509141, 500, 1500, "NBM_ResLevel-8_Times-One_250threads"], "isController": false}, {"data": [0.4957081545064378, 500, 1500, "NBM_ResLevel-8_Times-One_5threads"], "isController": false}, {"data": [0.5182919343618284, 500, 1500, "LREF_ResLevel-4_Times-One_100threads"], "isController": false}, {"data": [0.04324825153924323, 500, 1500, "HREF_ResLevel-4_Times-One_250threads"], "isController": false}, {"data": [0.4056603773584906, 500, 1500, "NBM_ResLevel-4_Times-One_25threads"], "isController": false}, {"data": [0.1980611045828437, 500, 1500, "LREF_ResLevel-4_Times-One_250threads"], "isController": false}, {"data": [0.07507590394700524, 500, 1500, "NBM_ResLevel-8_Times-One_100threads"], "isController": false}, {"data": [0.23746978755883474, 500, 1500, "HREF_ResLevel-4_Times-One_100threads"], "isController": false}, {"data": [0.998466672679715, 500, 1500, "LREF_ResLevel-1_Times-One_25threads"], "isController": false}, {"data": [0.8908131216192636, 500, 1500, "NBM_ResLevel-1_Times-One_50threads"], "isController": false}, {"data": [0.2657894736842105, 500, 1500, "NBM_ResLevel-8_Times-One_50threads"], "isController": false}, {"data": [0.46295025728987993, 500, 1500, "HREF_ResLevel-2_Times-One_50threads"], "isController": false}, {"data": [0.8155507559395249, 500, 1500, "LREF_ResLevel-2_Times-One_50threads"], "isController": false}, {"data": [0.9764406975401316, 500, 1500, "LREF_ResLevel-2_Times-One_25threads"], "isController": false}, {"data": [0.8779638030210916, 500, 1500, "MRMS_ResLevel-1_Times-One_100threads"], "isController": false}, {"data": [0.022703366058906032, 500, 1500, "HREF_ResLevel-4_Times-One_500threads"], "isController": false}, {"data": [0.9437121721587088, 500, 1500, "HREF_ResLevel-1_Times-One_25threads"], "isController": false}, {"data": [0.7666426280058688, 500, 1500, "NBM_ResLevel-1_Times-One_250threads"], "isController": false}, {"data": [0.9322793606671299, 500, 1500, "HREF_ResLevel-1_Times-One_50threads"], "isController": false}, {"data": [0.9946600688851114, 500, 1500, "LREF_ResLevel-1_Times-One_100threads"], "isController": false}, {"data": [0.19425735554767812, 500, 1500, "NBM_ResLevel-4_Times-One_50threads"], "isController": false}, {"data": [0.017610403684638308, 500, 1500, "NBM_ResLevel-4_Times-One_250threads"], "isController": false}, {"data": [0.9243820695433599, 500, 1500, "MRMS_ResLevel-1_Times-One_25threads"], "isController": false}, {"data": [0.8903739002932551, 500, 1500, "HREF_ResLevel-1_Times-One_100threads"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1245450, 17, 0.0013649684852864426, 949.1950973543517, 1, 48295, 4954.0, 10809.900000000001, 12520.900000000001, 16823.99, 126.02702743178685, 923.5808243629599, 37.20272925399781], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NBM_ResLevel-1_Times-One_100threads", 55104, 0, 0.0, 517.9138356562195, 322, 3358, 419.0, 716.0, 916.0, 1198.0, 182.70678187521136, 748.3127374849965, 54.95477423590342], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_50threads", 5796, 0, 0.0, 912.4549689440981, 535, 6440, 698.0, 1509.9000000000005, 1850.1499999999996, 3124.0299999999997, 47.80639893103704, 685.2094893660455, 14.145838746195531], "isController": false}, {"data": ["HREF_ResLevel-2_Times-One_25threads", 3619, 0, 0.0, 738.3337938657085, 524, 4157, 644.0, 1036.0, 1252.0, 1652.0, 29.428745680016263, 196.02878347987397, 8.707919864301688], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_50threads", 14447, 0, 0.0, 365.04215408043234, 283, 1195, 313.0, 541.0, 589.0, 660.0, 119.86326942063735, 1290.7541717786798, 34.647976316902984], "isController": false}, {"data": ["LREF_ResLevel-2_Times-One_100threads", 25122, 0, 0.0, 1137.3644614282316, 225, 11739, 888.0, 2483.9000000000015, 3180.0, 4934.880000000019, 83.4177295050123, 713.8569957543192, 24.601713193861052], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_5threads", 1648, 0, 0.0, 328.1729368932041, 287, 4337, 302.0, 397.0, 539.0, 614.53, 13.686798219387416, 147.387035122251, 3.956340110291675], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_25threads", 5856, 0, 0.0, 451.6758879781412, 335, 1067, 408.0, 659.3000000000002, 745.1499999999996, 837.0, 48.49729604385958, 198.63052696088582, 14.587077325692139], "isController": false}, {"data": ["HREF_ResLevel-2_Times-One_100threads", 15641, 0, 0.0, 1828.5490058180433, 519, 8130, 1633.0, 3146.0, 4052.0, 5312.58, 51.81438121550622, 345.1424748739921, 15.33179444169764], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_50threads", 18633, 0, 0.0, 282.9478344871969, 184, 954, 254.0, 414.0, 438.0, 508.0, 154.67434794879884, 1244.1919961467345, 45.616848711462154], "isController": false}, {"data": ["LREF_ResLevel-4_Times-One_25threads", 8452, 0, 0.0, 312.7256270705154, 195, 1062, 272.0, 473.0, 524.0, 660.9399999999987, 70.21449814744048, 381.6541959850134, 20.707791445827173], "isController": false}, {"data": ["HREF_ResLevel-2_Times-One_250threads", 16453, 0, 0.0, 4357.339877226043, 523, 23591, 4025.0, 6818.6, 8100.0, 11438.199999999983, 54.229634634717115, 361.2307986752007, 16.046464154608678], "isController": false}, {"data": ["LREF_ResLevel-2_Times-One_250threads", 26714, 4, 0.014973422175638242, 2677.113311372304, 2, 32664, 2547.0, 5038.9000000000015, 6044.0, 8806.81000000003, 88.43879733299786, 756.7156315901206, 26.082535932192727], "isController": false}, {"data": ["LREF_ResLevel-2_Times-One_5threads", 1402, 0, 0.0, 385.7560627674753, 235, 661, 335.0, 540.0, 576.0, 623.9100000000001, 11.646839901641522, 99.66919732234831, 3.4349078616169333], "isController": false}, {"data": ["HREF_ResLevel-2_Times-One_5threads", 745, 0, 0.0, 728.228187919463, 558, 1300, 632.0, 1144.0, 1206.7999999999997, 1264.3199999999997, 6.154684995786726, 40.99717417603638, 1.821161673557986], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_5threads", 2202, 0, 0.0, 245.3274296094459, 187, 635, 235.0, 332.70000000000005, 387.39999999999964, 471.9099999999994, 18.32831149806063, 147.43193536086466, 5.405419992592099], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_5threads", 763, 0, 0.0, 709.0209698558314, 550, 2993, 600.0, 1162.6, 1221.9999999999998, 1323.8400000000001, 6.350395339159384, 91.02026600863503, 1.8790720583645442], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_5threads", 1436, 0, 0.0, 376.713091922005, 277, 803, 328.0, 564.0, 605.0, 671.2599999999998, 11.92641501598771, 24.994225219052364, 3.5290075682073003], "isController": false}, {"data": ["LREF_ResLevel-4_Times-One_5threads", 1500, 0, 0.0, 360.47400000000056, 213, 588, 348.0, 475.60000000000036, 516.0, 548.0, 12.474012474012476, 67.80307952182952, 3.6788591476091477], "isController": false}, {"data": ["NBM_ResLevel-8_Times-One_25threads", 2105, 1, 0.047505938242280284, 1260.2351543942982, 3, 2750, 1206.0, 1325.4, 1547.6999999999998, 2451.0, 17.37730631114046, 387.7188044975647, 5.226767913897717], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_250threads", 142308, 1, 7.027011833487928E-4, 501.3107344632764, 2, 7763, 379.0, 850.0, 1046.0, 1763.9800000000032, 471.7778028258664, 5080.3302670777775, 136.37327112935202], "isController": false}, {"data": ["NBM_ResLevel-4_Times-One_5threads", 458, 0, 0.0, 1183.0764192139738, 1025, 2356, 1149.0, 1271.2, 1314.6499999999994, 2305.46, 3.796733814142419, 61.8934351166791, 1.1419863425350245], "isController": false}, {"data": ["LREF_ResLevel-4_Times-One_50threads", 9356, 0, 0.0, 564.8182984181286, 194, 5887, 366.5, 1191.0, 1421.2999999999993, 2423.010000000002, 77.45610186189369, 421.0162724250979, 22.84349879130068], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_5threads", 1085, 0, 0.0, 498.8691244239633, 357, 892, 416.0, 776.0, 788.0, 820.0, 9.007064527108358, 36.890262330754354, 2.709156127294311], "isController": false}, {"data": ["NBM_ResLevel-4_Times-One_100threads", 7404, 0, 0.0, 3873.952998379245, 982, 15643, 3685.5, 6663.0, 7601.0, 9485.55, 24.44508275472707, 398.4978187740811, 7.352622547320252], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_25threads", 2878, 0, 0.0, 920.6205698401667, 534, 2017, 841.0, 1405.0, 1544.0999999999995, 1754.5200000000004, 23.847205535070636, 341.8021832404607, 7.056350856568753], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_250threads", 175611, 2, 0.001138880821816401, 406.238709420254, 2, 19878, 243.0, 721.0, 1085.0, 3358.7400000000416, 582.6528953314377, 4686.776443844995, 171.83708436532635], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_250threads", 133761, 0, 0.0, 533.3294831826922, 264, 8804, 360.0, 795.0, 975.9500000000007, 1703.9700000000048, 443.71208024971884, 929.8887931795866, 131.29371124576642], "isController": false}, {"data": ["NBM_ResLevel-8_Times-One_250threads", 7713, 0, 0.0, 9343.104628549227, 1054, 25874, 9576.0, 14254.0, 15835.0, 18982.72, 25.121978229573124, 560.7794710659986, 7.556220014363792], "isController": false}, {"data": ["NBM_ResLevel-8_Times-One_5threads", 466, 0, 0.0, 1164.3175965665234, 1091, 1630, 1142.0, 1227.0, 1243.9499999999998, 1484.6999999999985, 3.85324590489263, 86.01317860745678, 1.1589841198309865], "isController": false}, {"data": ["LREF_ResLevel-4_Times-One_100threads", 24437, 0, 0.0, 1169.1410156729537, 188, 13314, 859.0, 2591.800000000003, 3351.800000000003, 5077.94000000001, 81.08637223346716, 440.7487771987092, 23.914144936042074], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_250threads", 16729, 0, 0.0, 4287.235997369835, 523, 22583, 4098.0, 6818.0, 8226.5, 11482.400000000001, 55.1111843188931, 789.9090353988222, 16.30731332873497], "isController": false}, {"data": ["NBM_ResLevel-4_Times-One_25threads", 2014, 0, 0.0, 1319.4657398212516, 1014, 2451, 1161.0, 2083.5, 2218.75, 2343.7, 16.55446781578017, 269.8669250476742, 4.97927352271513], "isController": false}, {"data": ["LREF_ResLevel-4_Times-One_250threads", 25530, 1, 0.0039169604386995694, 2801.869095182142, 2, 20496, 2589.0, 5328.9000000000015, 6555.950000000001, 9451.680000000051, 84.46789855911595, 459.1121331359907, 24.911431020364272], "isController": false}, {"data": ["NBM_ResLevel-8_Times-One_100threads", 7246, 0, 0.0, 3960.2947833287376, 1042, 17714, 3725.0, 6791.3, 7833.299999999999, 10706.299999999997, 23.867087398467714, 532.7674646036864, 7.178772381570366], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_100threads", 15722, 1, 0.006360513929525506, 1819.4299071365033, 2, 11353, 1549.0, 3109.0, 3509.699999999997, 5601.540000000001, 52.03978617413899, 745.840114950019, 15.398491416761829], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_25threads", 11087, 0, 0.0, 238.41084152611228, 184, 1211, 213.0, 321.0, 384.0, 455.0, 92.10843323447067, 740.9151997581396, 27.164791832822406], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_50threads", 11462, 0, 0.0, 460.40708427848625, 333, 1560, 416.0, 681.0, 753.0, 853.3700000000008, 94.98475205515778, 389.0293458196599, 28.569632454090428], "isController": false}, {"data": ["NBM_ResLevel-8_Times-One_50threads", 2850, 0, 0.0, 1865.2873684210529, 1048, 7649, 1429.5, 3415.8, 3936.8999999999996, 5292.679999999993, 23.286216194133505, 519.8011032866248, 7.004057214641719], "isController": false}, {"data": ["HREF_ResLevel-2_Times-One_50threads", 5830, 0, 0.0, 906.4415094339612, 534, 3518, 791.0, 1394.0, 1623.0, 2179.6899999999996, 48.15555151735417, 320.77052431628204, 14.249152450935853], "isController": false}, {"data": ["LREF_ResLevel-2_Times-One_50threads", 9260, 0, 0.0, 570.4685745140424, 233, 7122, 362.0, 1121.0, 2019.949999999999, 3168.6999999999825, 76.63215736901776, 655.7886670163113, 22.600499536565785], "isController": false}, {"data": ["LREF_ResLevel-2_Times-One_25threads", 8659, 0, 0.0, 305.3074257997448, 235, 897, 277.0, 412.0, 494.0, 584.0, 71.8887505188875, 615.1964070283312, 21.201565094437527], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_100threads", 64149, 3, 0.004676612262077351, 444.854978253755, 1, 2661, 341.0, 654.0, 868.9500000000007, 1249.9600000000064, 213.2832838490669, 2296.647994001418, 61.6521992376209], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_500threads", 11408, 1, 0.00876577840112202, 8362.022966339406, 2, 48295, 8365.5, 12169.0, 14168.0, 17991.92, 54.21537876627697, 777.0026167902291, 16.042245865412035], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_25threads", 7435, 0, 0.0, 355.5958305312711, 273, 1267, 320.0, 516.4000000000005, 585.0, 708.2800000000007, 61.7453120069095, 129.39984332698026, 18.27034134579451], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_250threads", 120639, 2, 0.0016578386757184658, 591.3198965508755, 1, 4438, 457.0, 836.0, 1087.0, 1515.0, 400.66090999667887, 1640.9627329998339, 120.51128933493855], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_50threads", 14390, 0, 0.0, 366.5325920778329, 271, 2003, 325.0, 535.0, 596.0, 679.0, 119.31017328579719, 250.0387029993367, 35.30369385312163], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_100threads", 112361, 1, 8.89988519148103E-4, 253.85056202775087, 1, 971, 232.0, 377.0, 425.0, 528.9900000000016, 374.0192733385483, 3008.5647048926066, 110.30646537914218], "isController": false}, {"data": ["NBM_ResLevel-4_Times-One_50threads", 2821, 0, 0.0, 1885.1970932293548, 1013, 7924, 1639.0, 3273.6000000000004, 3606.100000000001, 4194.080000000007, 23.095123089392292, 376.4911032531499, 6.946579991731275], "isController": false}, {"data": ["NBM_ResLevel-4_Times-One_250threads", 7382, 0, 0.0, 9789.215659712812, 1011, 30561, 9667.0, 16318.999999999998, 18659.59999999999, 22785.68, 24.05861149677024, 392.1976579253766, 7.236379239262924], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_25threads", 7161, 0, 0.0, 369.174975562071, 293, 1287, 311.0, 562.0, 597.0, 685.3800000000001, 59.492556161105945, 640.6488445200345, 17.197067015319686], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_100threads", 68200, 0, 0.0, 418.3583137829932, 264, 5134, 329.0, 520.9000000000015, 590.0, 675.0, 226.85316080961965, 475.41687802484745, 67.12549582550268], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 17, 100.0, 0.0013649684852864426], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1245450, 17, "502/Bad Gateway", 17, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["LREF_ResLevel-2_Times-One_250threads", 26714, 4, "502/Bad Gateway", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NBM_ResLevel-8_Times-One_25threads", 2105, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_250threads", 142308, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_250threads", 175611, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["LREF_ResLevel-4_Times-One_250threads", 25530, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_100threads", 15722, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_100threads", 64149, 3, "502/Bad Gateway", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_500threads", 11408, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_250threads", 120639, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_100threads", 112361, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
