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

    var data = {"OkPercent": 99.99549541433178, "KoPercent": 0.004504585668210238};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5146312696324858, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5892304686227896, 500, 1500, "NBM_ResLevel-1_Times-One_100threads"], "isController": false}, {"data": [0.35829223981313263, 500, 1500, "HREF_ResLevel-4_Times-One_50threads"], "isController": false}, {"data": [0.49551856594110116, 500, 1500, "HREF_ResLevel-2_Times-One_25threads"], "isController": false}, {"data": [0.893128190975576, 500, 1500, "MRMS_ResLevel-1_Times-One_50threads"], "isController": false}, {"data": [0.43678051823026126, 500, 1500, "MRMS_ResLevel-1_Times-One_500threads"], "isController": false}, {"data": [0.5270055429037941, 500, 1500, "LREF_ResLevel-2_Times-One_100threads"], "isController": false}, {"data": [0.8123317570025463, 500, 1500, "NBM_ResLevel-1_Times-One_25threads"], "isController": false}, {"data": [0.9905862216516902, 500, 1500, "MRMS_ResLevel-1_Times-One_5threads"], "isController": false}, {"data": [0.17894387246761873, 500, 1500, "HREF_ResLevel-2_Times-One_100threads"], "isController": false}, {"data": [0.008860153256704981, 500, 1500, "NBM_ResLevel-8_Times-One_500threads"], "isController": false}, {"data": [0.9009563592393096, 500, 1500, "LREF_ResLevel-1_Times-One_50threads"], "isController": false}, {"data": [0.9626820529523987, 500, 1500, "LREF_ResLevel-4_Times-One_25threads"], "isController": false}, {"data": [0.013333333333333334, 500, 1500, "HREF_ResLevel-2_Times-One_250threads"], "isController": false}, {"data": [0.053622117665357544, 500, 1500, "LREF_ResLevel-2_Times-One_250threads"], "isController": false}, {"data": [0.9959813084112149, 500, 1500, "LREF_ResLevel-2_Times-One_5threads"], "isController": false}, {"data": [0.5, 500, 1500, "HREF_ResLevel-2_Times-One_5threads"], "isController": false}, {"data": [0.9997865680136596, 500, 1500, "LREF_ResLevel-1_Times-One_5threads"], "isController": false}, {"data": [0.4997612225405922, 500, 1500, "HREF_ResLevel-4_Times-One_5threads"], "isController": false}, {"data": [0.921731123388582, 500, 1500, "HREF_ResLevel-1_Times-One_5threads"], "isController": false}, {"data": [0.9993224932249323, 500, 1500, "LREF_ResLevel-4_Times-One_5threads"], "isController": false}, {"data": [0.3834910620399579, 500, 1500, "NBM_ResLevel-8_Times-One_25threads"], "isController": false}, {"data": [0.6819085939872457, 500, 1500, "MRMS_ResLevel-1_Times-One_250threads"], "isController": false}, {"data": [0.6642779112956084, 500, 1500, "LREF_ResLevel-4_Times-One_50threads"], "isController": false}, {"data": [0.4806671721000758, 500, 1500, "NBM_ResLevel-4_Times-One_5threads"], "isController": false}, {"data": [0.9845614945511157, 500, 1500, "NBM_ResLevel-1_Times-One_5threads"], "isController": false}, {"data": [0.03649736330835415, 500, 1500, "NBM_ResLevel-4_Times-One_100threads"], "isController": false}, {"data": [0.02613590671491757, 500, 1500, "HREF_ResLevel-2_Times-One_500threads"], "isController": false}, {"data": [0.40024313501144165, 500, 1500, "HREF_ResLevel-4_Times-One_25threads"], "isController": false}, {"data": [0.5970154186842062, 500, 1500, "LREF_ResLevel-1_Times-One_250threads"], "isController": false}, {"data": [0.4853580748042911, 500, 1500, "HREF_ResLevel-1_Times-One_250threads"], "isController": false}, {"data": [0.04719126677279964, 500, 1500, "LREF_ResLevel-2_Times-One_500threads"], "isController": false}, {"data": [0.008465011286681716, 500, 1500, "NBM_ResLevel-8_Times-One_250threads"], "isController": false}, {"data": [0.4898119122257053, 500, 1500, "NBM_ResLevel-8_Times-One_5threads"], "isController": false}, {"data": [0.44889455782312926, 500, 1500, "LREF_ResLevel-4_Times-One_100threads"], "isController": false}, {"data": [0.01784651992861392, 500, 1500, "HREF_ResLevel-4_Times-One_250threads"], "isController": false}, {"data": [0.04138585482996359, 500, 1500, "LREF_ResLevel-4_Times-One_250threads"], "isController": false}, {"data": [0.37222450657894735, 500, 1500, "NBM_ResLevel-4_Times-One_25threads"], "isController": false}, {"data": [0.021546170365068004, 500, 1500, "NBM_ResLevel-8_Times-One_100threads"], "isController": false}, {"data": [0.16289668019426518, 500, 1500, "HREF_ResLevel-4_Times-One_100threads"], "isController": false}, {"data": [0.9827234112073191, 500, 1500, "LREF_ResLevel-1_Times-One_25threads"], "isController": false}, {"data": [0.5912324700583478, 500, 1500, "NBM_ResLevel-1_Times-One_50threads"], "isController": false}, {"data": [0.4477355734112491, 500, 1500, "LREF_ResLevel-1_Times-One_500threads"], "isController": false}, {"data": [0.008882046423495974, 500, 1500, "NBM_ResLevel-4_Times-One_500threads"], "isController": false}, {"data": [0.141635636463936, 500, 1500, "NBM_ResLevel-8_Times-One_50threads"], "isController": false}, {"data": [0.44278659611992943, 500, 1500, "HREF_ResLevel-2_Times-One_50threads"], "isController": false}, {"data": [0.26414681236440357, 500, 1500, "HREF_ResLevel-1_Times-One_500threads"], "isController": false}, {"data": [0.2206174269054216, 500, 1500, "NBM_ResLevel-1_Times-One_500threads"], "isController": false}, {"data": [0.7179753435553002, 500, 1500, "LREF_ResLevel-2_Times-One_50threads"], "isController": false}, {"data": [0.8798790230540973, 500, 1500, "LREF_ResLevel-2_Times-One_25threads"], "isController": false}, {"data": [0.02937560539453096, 500, 1500, "LREF_ResLevel-4_Times-One_500threads"], "isController": false}, {"data": [0.8835044011566939, 500, 1500, "MRMS_ResLevel-1_Times-One_100threads"], "isController": false}, {"data": [0.033341011171254174, 500, 1500, "HREF_ResLevel-4_Times-One_500threads"], "isController": false}, {"data": [0.8773679256383103, 500, 1500, "HREF_ResLevel-1_Times-One_25threads"], "isController": false}, {"data": [0.30621171146310505, 500, 1500, "NBM_ResLevel-1_Times-One_250threads"], "isController": false}, {"data": [0.8656899030373475, 500, 1500, "HREF_ResLevel-1_Times-One_50threads"], "isController": false}, {"data": [0.7934717657603825, 500, 1500, "LREF_ResLevel-1_Times-One_100threads"], "isController": false}, {"data": [0.1274387388793507, 500, 1500, "NBM_ResLevel-4_Times-One_50threads"], "isController": false}, {"data": [0.009842771315352166, 500, 1500, "NBM_ResLevel-4_Times-One_250threads"], "isController": false}, {"data": [0.9621137755340532, 500, 1500, "MRMS_ResLevel-1_Times-One_25threads"], "isController": false}, {"data": [0.74672484185024, 500, 1500, "HREF_ResLevel-1_Times-One_100threads"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1331976, 60, 0.004504585668210238, 2010.1415768752618, 2, 185679, 710.0, 5123.0, 6514.750000000004, 10300.860000000022, 73.092093252046, 580.2320272145918, 21.561750316247664], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NBM_ResLevel-1_Times-One_100threads", 30707, 0, 0.0, 930.8968964731182, 333, 10181, 565.0, 2541.9000000000015, 2907.0, 4256.990000000002, 101.5617764959583, 415.9668853750479, 30.547878086674956], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_50threads", 11559, 0, 0.0, 1236.9861579721398, 540, 10386, 949.0, 2054.0, 2402.0, 3196.199999999999, 38.31644965392877, 549.189972237024, 11.337777583144938], "isController": false}, {"data": ["HREF_ResLevel-2_Times-One_25threads", 8591, 0, 0.0, 832.1877546269333, 532, 5347, 698.0, 1258.0, 1327.0, 1485.4799999999996, 28.533849694932595, 190.0677624698586, 8.443121540590406], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_50threads", 36235, 0, 0.0, 393.9146129432879, 282, 1357, 339.0, 597.0, 635.0, 713.0, 120.55588456445507, 1298.2126358322716, 34.84818538191279], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_500threads", 73751, 2, 0.002711827636235441, 1944.150777616588, 286, 104791, 710.0, 5123.0, 6514.750000000004, 10300.860000000022, 241.91442741681539, 2604.9998709721795, 69.9283891751732], "isController": false}, {"data": ["LREF_ResLevel-2_Times-One_100threads", 23273, 10, 0.042968246465861726, 1227.80642804967, 228, 71883, 975.5, 2104.0, 2464.9500000000007, 7264.880000000019, 77.25066884414437, 660.8040144807661, 22.78291210051914], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_25threads", 13745, 0, 0.0, 519.9343033830481, 324, 1675, 463.0, 788.3999999999996, 862.6999999999989, 1000.0, 45.694813829787236, 187.15239179895278, 13.744143222240691], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_5threads", 4674, 0, 0.0, 308.2359863072317, 280, 661, 294.0, 365.0, 375.0, 566.25, 15.56796077699912, 167.64443699997, 4.500113662101308], "isController": false}, {"data": ["HREF_ResLevel-2_Times-One_100threads", 15055, 0, 0.0, 1901.1546330122908, 537, 31302, 1795.0, 3071.0, 3726.0, 4634.880000000001, 49.49274457075605, 329.6777448409444, 14.644825786073325], "isController": false}, {"data": ["NBM_ResLevel-8_Times-One_500threads", 8352, 3, 0.035919540229885055, 17593.220785440644, 1044, 185679, 13049.5, 29670.399999999998, 40733.7, 67555.76, 25.77077830712646, 575.0580312339935, 7.75136691269038], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_50threads", 36388, 0, 0.0, 392.253517643177, 181, 1223, 355.0, 548.0, 600.0, 972.0, 121.08627580171242, 974.0113806432668, 35.71099149620815], "isController": false}, {"data": ["LREF_ResLevel-4_Times-One_25threads", 21491, 0, 0.0, 332.4593550788727, 189, 3932, 292.0, 476.0, 528.0, 647.9800000000032, 71.51033174724652, 388.6977602589592, 21.089961120769974], "isController": false}, {"data": ["HREF_ResLevel-2_Times-One_250threads", 16950, 1, 0.0058997050147492625, 4241.74973451327, 540, 37547, 3483.0, 6413.0, 6775.0, 11360.860000000022, 54.157161206218966, 360.7276247751439, 16.025019380355808], "isController": false}, {"data": ["LREF_ResLevel-2_Times-One_250threads", 25717, 0, 0.0, 2782.398880118211, 232, 160283, 2563.0, 4320.800000000003, 5203.9000000000015, 7883.680000000051, 85.13674118655796, 728.5676396658274, 25.108687342129393], "isController": false}, {"data": ["LREF_ResLevel-2_Times-One_5threads", 5350, 0, 0.0, 269.24205607476665, 225, 717, 248.0, 323.0, 364.0, 482.9599999999991, 17.821155543711797, 152.506626981979, 5.255848607618128], "isController": false}, {"data": ["HREF_ResLevel-2_Times-One_5threads", 2099, 0, 0.0, 686.6155312053352, 552, 1252, 624.0, 1088.0, 1140.0, 1212.0, 6.9871873824511415, 46.54258314033129, 2.067497828987008], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_5threads", 7028, 0, 0.0, 204.92401821286225, 177, 969, 191.0, 261.0, 282.0, 374.0, 23.40786235057837, 188.2915646305801, 6.9034906541744805], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_5threads", 2094, 0, 0.0, 688.1427889207273, 545, 1917, 597.0, 1131.5, 1166.25, 1233.0, 6.975396238482602, 99.97840878145425, 2.064008847910379], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_5threads", 3801, 0, 0.0, 379.1760063141274, 280, 1144, 332.0, 560.0, 600.0, 644.0, 12.650686618429198, 26.512083479637752, 3.743318403695358], "isController": false}, {"data": ["LREF_ResLevel-4_Times-One_5threads", 5904, 0, 0.0, 243.96544715447166, 192, 538, 229.0, 318.0, 391.0, 447.9499999999998, 19.664989058352127, 106.88996982303509, 5.799635444943693], "isController": false}, {"data": ["NBM_ResLevel-8_Times-One_25threads", 4755, 0, 0.0, 1504.2565720294415, 1077, 3198, 1323.0, 2414.0, 2537.0, 2724.879999999999, 15.765915119363395, 351.9309451156333, 4.7420916569960205], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_250threads", 65860, 0, 0.0, 1089.7935772851638, 284, 97750, 483.0, 2626.0, 5238.0, 9831.850000000024, 214.71372589931343, 2312.156499503642, 62.06568639277029], "isController": false}, {"data": ["LREF_ResLevel-4_Times-One_50threads", 22885, 0, 0.0, 623.8427791129534, 190, 2205, 601.0, 999.0, 1135.0, 1336.0, 76.14018977655341, 413.86357060185185, 22.45540753175696], "isController": false}, {"data": ["NBM_ResLevel-4_Times-One_5threads", 1319, 0, 0.0, 1092.7300985595143, 980, 2128, 1046.0, 1151.0, 1307.0, 1985.9999999999995, 4.385352457326763, 71.48895368179264, 1.3190317938053155], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_5threads", 3854, 0, 0.0, 373.8401660612346, 322, 1075, 344.0, 432.0, 448.0, 686.7999999999993, 12.834217475715223, 52.56514462221645, 3.8602919751174696], "isController": false}, {"data": ["NBM_ResLevel-4_Times-One_100threads", 7206, 0, 0.0, 3983.7950319178426, 1014, 9628, 3872.5, 6225.3, 7098.65, 8455.600000000006, 23.694750064119848, 386.2660769730006, 7.1269365427235485], "isController": false}, {"data": ["HREF_ResLevel-2_Times-One_500threads", 17409, 1, 0.005744155321959906, 8318.347980929435, 517, 130255, 6788.0, 15462.0, 20661.5, 32960.70000000012, 55.73412558666658, 371.2319534246362, 16.491640676523414], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_25threads", 6992, 0, 0.0, 1022.2848970251763, 538, 5637, 830.0, 1727.6999999999998, 1870.3499999999995, 3289.3499999999985, 23.259991616822244, 333.38564156259775, 6.882595175680801], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_250threads", 60511, 0, 0.0, 1181.3163887557562, 180, 27427, 565.0, 3021.9000000000015, 4107.9000000000015, 5980.980000000003, 199.67002689280824, 1606.1347768711537, 58.88705871252743], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_250threads", 44837, 0, 0.0, 1599.4534647723985, 272, 56696, 710.0, 4415.9000000000015, 5328.0, 10191.81000000003, 146.6056749740055, 307.2419711857576, 43.380390153441084], "isController": false}, {"data": ["LREF_ResLevel-2_Times-One_500threads", 26382, 11, 0.041695095140626186, 5453.85660677734, 224, 107925, 4546.5, 10259.800000000003, 14159.400000000009, 27031.160000000134, 84.52789080772804, 723.0627886101855, 24.92912404681042], "isController": false}, {"data": ["NBM_ResLevel-8_Times-One_250threads", 7974, 0, 0.0, 9068.104464509614, 1064, 33132, 7849.5, 14444.5, 15274.0, 16653.5, 25.888853897126385, 577.8978734184715, 7.786881836245044], "isController": false}, {"data": ["NBM_ResLevel-8_Times-One_5threads", 1276, 0, 0.0, 1129.6763322884005, 1038, 2235, 1099.0, 1181.0, 1202.0, 2179.53, 4.246991159867931, 94.80246477759879, 1.2774153098040262], "isController": false}, {"data": ["LREF_ResLevel-4_Times-One_100threads", 23520, 0, 0.0, 1214.4064625850333, 190, 4893, 1190.0, 2136.9000000000015, 2385.0, 2730.9900000000016, 78.1548542737613, 424.81437391382366, 23.049576162769448], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_250threads", 16810, 2, 0.01189767995240928, 4266.572337894115, 545, 44622, 3466.0, 6398.0, 6810.899999999998, 12140.359999999986, 55.266964755391896, 792.0488625435626, 16.35340851648803], "isController": false}, {"data": ["LREF_ResLevel-4_Times-One_250threads", 25818, 2, 0.0077465334262917344, 2772.8097838717217, 2, 37651, 2441.0, 4466.0, 4806.0, 7313.990000000002, 85.20595233773477, 463.1068560812951, 25.129099224605373], "isController": false}, {"data": ["NBM_ResLevel-4_Times-One_25threads", 4864, 0, 0.0, 1471.252878289475, 1026, 3425, 1282.0, 2309.0, 2451.75, 2782.050000000001, 16.15163409110531, 263.3000272293173, 4.858108691465269], "isController": false}, {"data": ["NBM_ResLevel-8_Times-One_100threads", 6985, 0, 0.0, 4107.794130279173, 1053, 37351, 3794.0, 6393.800000000001, 7324.099999999999, 9468.800000000023, 22.90224005875564, 511.229885999059, 6.888564392672595], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_100threads", 15031, 0, 0.0, 1903.5011642605318, 543, 7750, 1830.0, 3347.800000000001, 3780.0, 4317.68, 49.81457484779893, 713.9926904698681, 14.740054862190503], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_25threads", 24484, 0, 0.0, 291.7658879268095, 183, 1144, 254.0, 415.0, 460.0, 560.0, 81.51008722285106, 655.6626840377189, 24.039107755176776], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_50threads", 19538, 0, 0.0, 731.0048623195855, 334, 2941, 648.0, 1063.0, 1139.0, 1643.0, 64.95086632182228, 266.0194661657447, 19.536002760860605], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_500threads", 82140, 0, 0.0, 1742.8739103968774, 185, 43547, 1228.0, 4543.0, 6164.0, 9697.980000000003, 270.55335968379444, 2176.316429409585, 79.79210412549406], "isController": false}, {"data": ["NBM_ResLevel-4_Times-One_500threads", 8444, 5, 0.05921364282330649, 17339.29926575083, 934, 140205, 13658.0, 31716.5, 40551.5, 63655.44999999994, 26.4523081549797, 430.96801763931006, 7.9563583122399875], "isController": false}, {"data": ["NBM_ResLevel-8_Times-One_50threads", 7251, 0, 0.0, 1974.2401048131273, 1076, 5382, 1804.0, 2932.2000000000007, 3303.3999999999996, 3951.4799999999996, 23.969138618377993, 535.045479041879, 7.2094674750590055], "isController": false}, {"data": ["HREF_ResLevel-2_Times-One_50threads", 14175, 0, 0.0, 1007.9361552028256, 539, 2951, 892.0, 1539.0, 1698.0, 2186.4799999999996, 47.072380218641655, 313.5553764368699, 13.928643756101975], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_500threads", 50241, 2, 0.003980812483827949, 2858.2754125116985, 272, 86139, 2344.0, 7189.9000000000015, 9064.0, 15103.970000000005, 164.14711523068027, 343.9916958127636, 48.570874916890745], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_500threads", 48362, 1, 0.0020677391340308505, 2971.3240353996844, 333, 81783, 2631.0, 6485.800000000003, 9157.95, 14804.890000000018, 155.65797858986656, 637.5165575644766, 46.8190013727333], "isController": false}, {"data": ["LREF_ResLevel-2_Times-One_50threads", 22631, 0, 0.0, 630.8493217268405, 229, 3889, 540.0, 1198.0, 1480.0, 1743.9700000000048, 75.28884955869975, 644.2931530106308, 22.204328678444654], "isController": false}, {"data": ["LREF_ResLevel-2_Times-One_25threads", 17524, 0, 0.0, 407.59569732937604, 232, 4037, 348.0, 614.0, 663.75, 785.75, 58.35225796999141, 499.3562857334323, 17.20935733099356], "isController": false}, {"data": ["LREF_ResLevel-4_Times-One_500threads", 26842, 11, 0.04098055286491319, 5359.2871246553605, 195, 100016, 4526.5, 10369.800000000003, 12787.900000000001, 22695.93000000001, 86.51453619544898, 470.0687056067895, 25.51502922951718], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_100threads", 62938, 5, 0.007944326162254918, 453.38504560043157, 65, 21854, 379.0, 634.0, 711.0, 869.9900000000016, 209.3599582198183, 2254.328526928425, 60.51811292291623], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_500threads", 17366, 1, 0.005758378440631118, 8346.688702061509, 540, 106915, 6456.0, 16860.300000000003, 22623.59999999999, 36267.929999999964, 55.05029211588267, 788.9916887939561, 16.28929542100825], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_25threads", 16998, 0, 0.0, 420.3270384751145, 275, 1364, 364.0, 626.0, 677.0, 773.0, 56.551233128283265, 118.51459598954678, 16.733421521357258], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_250threads", 36238, 0, 0.0, 1976.522628180368, 332, 39783, 1600.0, 3389.0, 5570.950000000001, 7931.930000000011, 118.94883342305319, 487.17910876590344, 35.777578803027716], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_50threads", 32693, 0, 0.0, 436.6058483467428, 274, 1763, 364.0, 609.0, 659.0, 745.9900000000016, 108.80366883322185, 228.02018878524814, 32.1948356020178], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_100threads", 46858, 0, 0.0, 609.4604549916767, 182, 18466, 400.0, 1387.0, 1534.0, 2826.9900000000016, 155.54109766379648, 1251.1640834538005, 45.87247216256498], "isController": false}, {"data": ["NBM_ResLevel-4_Times-One_50threads", 6407, 0, 0.0, 2234.469954737023, 1025, 8086, 1846.0, 3652.0, 4032.199999999999, 5956.84, 21.173515755382606, 345.1655258834002, 6.368596535798674], "isController": false}, {"data": ["NBM_ResLevel-4_Times-One_250threads", 7823, 3, 0.03834845967020325, 9245.879713664857, 1007, 75416, 7797.0, 14572.400000000001, 15816.599999999999, 26272.840000000033, 25.34421874493796, 412.9995063245132, 7.62306579437587], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_25threads", 21393, 0, 0.0, 333.917963819942, 283, 834, 300.0, 437.90000000000146, 557.0, 626.0, 71.20438016941537, 766.76826184389, 20.58251614272163], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_100threads", 44578, 0, 0.0, 640.7168109829961, 274, 4646, 464.0, 1260.0, 2088.0, 2420.980000000003, 147.9139154151929, 309.9836547666054, 43.76749645586274], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 26, 43.333333333333336, 0.0019519871228911032], "isController": false}, {"data": ["500/Internal Server Error", 34, 56.666666666666664, 0.002552598545319135], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1331976, 60, "500/Internal Server Error", 34, "502/Bad Gateway", 26, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_500threads", 73751, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-2_Times-One_100threads", 23273, 10, "500/Internal Server Error", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NBM_ResLevel-8_Times-One_500threads", 8352, 3, "502/Bad Gateway", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["HREF_ResLevel-2_Times-One_250threads", 16950, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["HREF_ResLevel-2_Times-One_500threads", 17409, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["LREF_ResLevel-2_Times-One_500threads", 26382, 11, "500/Internal Server Error", 10, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_250threads", 16810, 2, "500/Internal Server Error", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-4_Times-One_250threads", 25818, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NBM_ResLevel-4_Times-One_500threads", 8444, 5, "502/Bad Gateway", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_500threads", 50241, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_500threads", 48362, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["LREF_ResLevel-4_Times-One_500threads", 26842, 11, "500/Internal Server Error", 8, "502/Bad Gateway", 3, "", "", "", "", "", ""], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_100threads", 62938, 5, "500/Internal Server Error", 4, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_500threads", 17366, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NBM_ResLevel-4_Times-One_250threads", 7823, 3, "502/Bad Gateway", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
