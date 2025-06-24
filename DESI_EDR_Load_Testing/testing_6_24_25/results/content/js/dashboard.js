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

    var data = {"OkPercent": 99.99431536840153, "KoPercent": 0.005684631598473527};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5405413963350083, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6283156001798291, 500, 1500, "NBM_ResLevel-1_Times-One_100threads"], "isController": false}, {"data": [0.3825653004884264, 500, 1500, "HREF_ResLevel-4_Times-One_50threads"], "isController": false}, {"data": [0.4974543276430069, 500, 1500, "HREF_ResLevel-2_Times-One_25threads"], "isController": false}, {"data": [0.829888637221593, 500, 1500, "MRMS_ResLevel-1_Times-One_50threads"], "isController": false}, {"data": [0.2134505314799673, 500, 1500, "MRMS_ResLevel-1_Times-One_500threads"], "isController": false}, {"data": [0.45095693779904306, 500, 1500, "LREF_ResLevel-2_Times-One_100threads"], "isController": false}, {"data": [0.9507672634271099, 500, 1500, "MRMS_ResLevel-1_Times-One_5threads"], "isController": false}, {"data": [0.8327943694122123, 500, 1500, "NBM_ResLevel-1_Times-One_25threads"], "isController": false}, {"data": [0.1281087142951382, 500, 1500, "HREF_ResLevel-2_Times-One_100threads"], "isController": false}, {"data": [0.0035697427425064906, 500, 1500, "NBM_ResLevel-8_Times-One_500threads"], "isController": false}, {"data": [0.89909137918298, 500, 1500, "LREF_ResLevel-1_Times-One_50threads"], "isController": false}, {"data": [0.9372822299651568, 500, 1500, "LREF_ResLevel-4_Times-One_25threads"], "isController": false}, {"data": [0.0139364591945199, 500, 1500, "HREF_ResLevel-2_Times-One_250threads"], "isController": false}, {"data": [0.08888932853242591, 500, 1500, "LREF_ResLevel-2_Times-One_250threads"], "isController": false}, {"data": [0.9321236559139785, 500, 1500, "LREF_ResLevel-2_Times-One_5threads"], "isController": false}, {"data": [0.5, 500, 1500, "HREF_ResLevel-2_Times-One_5threads"], "isController": false}, {"data": [1.0, 500, 1500, "LREF_ResLevel-1_Times-One_5threads"], "isController": false}, {"data": [0.5, 500, 1500, "HREF_ResLevel-4_Times-One_5threads"], "isController": false}, {"data": [0.8877777777777778, 500, 1500, "HREF_ResLevel-1_Times-One_5threads"], "isController": false}, {"data": [0.9846909300982092, 500, 1500, "LREF_ResLevel-4_Times-One_5threads"], "isController": false}, {"data": [0.3760611205432937, 500, 1500, "NBM_ResLevel-8_Times-One_25threads"], "isController": false}, {"data": [0.6801655419176593, 500, 1500, "MRMS_ResLevel-1_Times-One_250threads"], "isController": false}, {"data": [0.4388235294117647, 500, 1500, "NBM_ResLevel-4_Times-One_5threads"], "isController": false}, {"data": [0.7311912225705329, 500, 1500, "LREF_ResLevel-4_Times-One_50threads"], "isController": false}, {"data": [0.911944202266783, 500, 1500, "NBM_ResLevel-1_Times-One_5threads"], "isController": false}, {"data": [0.030447593657920585, 500, 1500, "NBM_ResLevel-4_Times-One_100threads"], "isController": false}, {"data": [0.01969756701959901, 500, 1500, "HREF_ResLevel-2_Times-One_500threads"], "isController": false}, {"data": [0.3628583654257595, 500, 1500, "HREF_ResLevel-4_Times-One_25threads"], "isController": false}, {"data": [0.8196292835677669, 500, 1500, "LREF_ResLevel-1_Times-One_250threads"], "isController": false}, {"data": [0.5790075267479472, 500, 1500, "HREF_ResLevel-1_Times-One_250threads"], "isController": false}, {"data": [0.018417488148092406, 500, 1500, "LREF_ResLevel-2_Times-One_500threads"], "isController": false}, {"data": [0.0096736747065652, 500, 1500, "NBM_ResLevel-8_Times-One_250threads"], "isController": false}, {"data": [0.4669811320754717, 500, 1500, "NBM_ResLevel-8_Times-One_5threads"], "isController": false}, {"data": [0.46312026913372584, 500, 1500, "LREF_ResLevel-4_Times-One_100threads"], "isController": false}, {"data": [0.022021490140512457, 500, 1500, "HREF_ResLevel-4_Times-One_250threads"], "isController": false}, {"data": [0.38660076880834704, 500, 1500, "NBM_ResLevel-4_Times-One_25threads"], "isController": false}, {"data": [0.05491463745112462, 500, 1500, "LREF_ResLevel-4_Times-One_250threads"], "isController": false}, {"data": [0.025642857142857144, 500, 1500, "NBM_ResLevel-8_Times-One_100threads"], "isController": false}, {"data": [0.18500223086238765, 500, 1500, "HREF_ResLevel-4_Times-One_100threads"], "isController": false}, {"data": [0.9780327490774908, 500, 1500, "LREF_ResLevel-1_Times-One_25threads"], "isController": false}, {"data": [0.6996777534814133, 500, 1500, "NBM_ResLevel-1_Times-One_50threads"], "isController": false}, {"data": [0.00322892147987205, 500, 1500, "NBM_ResLevel-4_Times-One_500threads"], "isController": false}, {"data": [0.7648376813149268, 500, 1500, "LREF_ResLevel-1_Times-One_500threads"], "isController": false}, {"data": [0.13846447669977083, 500, 1500, "NBM_ResLevel-8_Times-One_50threads"], "isController": false}, {"data": [0.37433862433862436, 500, 1500, "HREF_ResLevel-2_Times-One_50threads"], "isController": false}, {"data": [0.5574602152718678, 500, 1500, "HREF_ResLevel-1_Times-One_500threads"], "isController": false}, {"data": [0.5261486184023115, 500, 1500, "NBM_ResLevel-1_Times-One_500threads"], "isController": false}, {"data": [0.7216012773722628, 500, 1500, "LREF_ResLevel-2_Times-One_50threads"], "isController": false}, {"data": [0.8985973115137347, 500, 1500, "LREF_ResLevel-2_Times-One_25threads"], "isController": false}, {"data": [0.02606005390426299, 500, 1500, "LREF_ResLevel-4_Times-One_500threads"], "isController": false}, {"data": [0.8237959342512462, 500, 1500, "MRMS_ResLevel-1_Times-One_100threads"], "isController": false}, {"data": [0.009210671674768007, 500, 1500, "HREF_ResLevel-4_Times-One_500threads"], "isController": false}, {"data": [0.888195852175269, 500, 1500, "HREF_ResLevel-1_Times-One_25threads"], "isController": false}, {"data": [0.517773852137666, 500, 1500, "NBM_ResLevel-1_Times-One_250threads"], "isController": false}, {"data": [0.7444025714919087, 500, 1500, "HREF_ResLevel-1_Times-One_50threads"], "isController": false}, {"data": [0.9152731471271227, 500, 1500, "LREF_ResLevel-1_Times-One_100threads"], "isController": false}, {"data": [0.18002257336343114, 500, 1500, "NBM_ResLevel-4_Times-One_50threads"], "isController": false}, {"data": [0.011950655358519661, 500, 1500, "NBM_ResLevel-4_Times-One_250threads"], "isController": false}, {"data": [0.8972602739726028, 500, 1500, "MRMS_ResLevel-1_Times-One_25threads"], "isController": false}, {"data": [0.742671009771987, 500, 1500, "HREF_ResLevel-1_Times-One_100threads"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2005407, 114, 0.005684631598473527, 2009.1952875401428, 1, 203504, 2259.0, 7724.0, 9671.850000000002, 14179.960000000006, 127.10192957345582, 900.7902076196657, 37.58761265400297], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NBM_ResLevel-1_Times-One_100threads", 40038, 0, 0.0, 712.9829412058548, 334, 5998, 563.0, 989.9000000000015, 1064.0, 1207.0, 133.11877221389173, 545.2149713525995, 40.03963070495962], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_50threads", 4709, 0, 0.0, 1126.263325546827, 539, 3802, 949.0, 1726.0, 1850.0, 2821.499999999998, 38.621470223986485, 553.5618344506344, 11.428032693230374], "isController": false}, {"data": ["HREF_ResLevel-2_Times-One_25threads", 3339, 0, 0.0, 793.1410601976627, 539, 1684, 676.0, 1231.0, 1304.0, 1436.7999999999993, 27.646678920959808, 184.15820011705748, 8.180609094776193], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_50threads", 10596, 0, 0.0, 498.0926764816903, 291, 1515, 456.0, 783.0, 853.1499999999996, 961.0, 87.82719692322995, 945.7719731176334, 25.387549110621155], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_500threads", 85610, 13, 0.015185141922672585, 3429.4942880504636, 1, 39587, 2259.0, 7724.0, 9671.850000000002, 14179.960000000006, 141.25034854732078, 1520.8369296610883, 40.830178876959906], "isController": false}, {"data": ["LREF_ResLevel-2_Times-One_100threads", 25080, 0, 0.0, 1138.9087320574167, 234, 4185, 1004.0, 2180.0, 2917.0, 3328.980000000003, 83.28960739643595, 712.7605757958675, 24.563927181370758], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_5threads", 1564, 0, 0.0, 345.91751918158565, 293, 730, 307.0, 439.5, 602.0, 691.0, 12.971610088661453, 139.68549262467758, 3.7496060412537013], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_25threads", 5257, 0, 0.0, 503.2634582461476, 336, 1704, 452.0, 760.0, 821.1999999999989, 896.0, 43.532987189360625, 178.29819167204928, 13.093906303049875], "isController": false}, {"data": ["HREF_ResLevel-2_Times-One_100threads", 15159, 0, 0.0, 1887.0426809156274, 532, 6115, 1755.0, 3035.0, 3388.0, 3858.3999999999996, 50.22896109318153, 334.58178087557735, 14.862671104720707], "isController": false}, {"data": ["NBM_ResLevel-8_Times-One_500threads", 16948, 2, 0.011800802454566911, 17507.911552985708, 1074, 203110, 14724.0, 25722.2, 28772.55, 55899.41999999977, 27.274380460548866, 608.754989703511, 8.203622247899464], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_50threads", 13537, 0, 0.0, 389.7337667134514, 187, 1020, 391.0, 540.0, 575.0999999999985, 632.619999999999, 112.34584294653675, 903.7038167486555, 33.13324665024815], "isController": false}, {"data": ["LREF_ResLevel-4_Times-One_25threads", 7462, 0, 0.0, 354.43768426695254, 195, 3824, 298.0, 514.0, 562.8499999999995, 746.7399999999998, 61.89038550859266, 336.40809154377615, 18.252828538666975], "isController": false}, {"data": ["HREF_ResLevel-2_Times-One_250threads", 16934, 0, 0.0, 4231.734439588996, 537, 21496, 3674.0, 6813.0, 7270.25, 8005.0, 55.7975551088998, 371.67492519316943, 16.510409373043593], "isController": false}, {"data": ["LREF_ResLevel-2_Times-One_250threads", 25273, 1, 0.003956791833181656, 2830.977921101568, 234, 51736, 2727.0, 4826.9000000000015, 5576.9000000000015, 7692.960000000006, 83.57114277494685, 715.1424445057338, 24.646958123080026], "isController": false}, {"data": ["LREF_ResLevel-2_Times-One_5threads", 1488, 0, 0.0, 363.4173387096773, 265, 644, 320.0, 512.0, 544.0, 612.0, 12.36270583739054, 105.79530395805986, 3.646032385636663], "isController": false}, {"data": ["HREF_ResLevel-2_Times-One_5threads", 791, 0, 0.0, 685.3843236409607, 532, 1284, 612.0, 1136.0, 1189.6, 1260.0, 6.545737409178928, 43.6020262382905, 1.936873471661343], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_5threads", 2125, 0, 0.0, 254.5025882352939, 196, 368, 244.0, 292.0, 329.6999999999998, 344.0, 17.663291938889166, 142.08255439514656, 5.209291177289578], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_5threads", 949, 0, 0.0, 569.7881981032676, 539, 1213, 552.0, 626.0, 641.0, 954.0, 7.887169428699655, 113.04686104006333, 2.3338011102499956], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_5threads", 1350, 0, 0.0, 401.08296296296305, 288, 680, 336.0, 571.0, 644.0, 661.96, 11.190967645669096, 23.45294586680262, 3.311389840466539], "isController": false}, {"data": ["LREF_ResLevel-4_Times-One_5threads", 1731, 0, 0.0, 312.4194107452341, 224, 596, 276.0, 444.0, 476.0, 534.0400000000002, 14.39453157483327, 78.2421511186738, 4.245262241796531], "isController": false}, {"data": ["NBM_ResLevel-8_Times-One_25threads", 1767, 0, 0.0, 1502.6321448783265, 1078, 3213, 1326.0, 2415.2, 2546.6, 2719.24, 14.502507366157532, 323.7288216558876, 4.362082293727071], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_250threads", 88316, 0, 0.0, 809.1302368766711, 291, 13008, 499.0, 1353.9000000000015, 2346.9500000000007, 5906.840000000026, 291.1279742086907, 3135.0275113273756, 84.15418004469966], "isController": false}, {"data": ["NBM_ResLevel-4_Times-One_5threads", 425, 0, 0.0, 1284.2494117647054, 1023, 2361, 1149.0, 2210.6000000000004, 2295.8, 2336.0, 3.482578911140975, 56.77215797234013, 1.0474944381166214], "isController": false}, {"data": ["LREF_ResLevel-4_Times-One_50threads", 8932, 0, 0.0, 590.9933945364986, 195, 2103, 508.0, 1018.0, 1211.3500000000004, 1725.67, 74.03171129953337, 402.40283700508076, 21.833571105917066], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_5threads", 1147, 0, 0.0, 472.021795989538, 348, 888, 412.0, 708.8000000000002, 776.0, 819.04, 9.510306286586074, 38.95139117767773, 2.8605218127622174], "isController": false}, {"data": ["NBM_ResLevel-4_Times-One_100threads", 7127, 0, 0.0, 4025.9179177774545, 1012, 15803, 3777.0, 6364.4, 7146.799999999998, 8530.16, 23.473652661082877, 382.66180065571916, 7.060434589466333], "isController": false}, {"data": ["HREF_ResLevel-2_Times-One_500threads", 35512, 27, 0.07603063753097544, 8291.362553503015, 51, 84283, 6308.5, 17138.0, 22969.650000000005, 36625.870000000024, 58.19340227877183, 387.35122937085515, 17.219336807097523], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_25threads", 2337, 0, 0.0, 1134.5220367993165, 544, 3858, 898.0, 1808.2000000000003, 1915.2999999999997, 2950.41999999999, 19.304317658040162, 276.6889358076713, 5.712117432017743], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_250threads", 118797, 0, 0.0, 601.3122974485954, 187, 50952, 331.0, 777.9000000000015, 1347.9000000000015, 2887.920000000013, 387.79840502453186, 3119.429162292059, 114.37023273184434], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_250threads", 64304, 0, 0.0, 1111.9405324707666, 275, 12972, 609.0, 2483.0, 3632.7500000000036, 5264.970000000005, 212.21461714640247, 444.73883632439424, 62.7939736282812], "isController": false}, {"data": ["LREF_ResLevel-2_Times-One_500threads", 53156, 2, 0.003762510346903454, 5523.948528858511, 228, 65085, 5017.0, 8404.900000000001, 9798.750000000004, 14181.830000000027, 87.9722492536029, 752.8054021938448, 25.944940697839918], "isController": false}, {"data": ["NBM_ResLevel-8_Times-One_250threads", 7753, 0, 0.0, 9316.452727976246, 1042, 30877, 8875.0, 13760.6, 15528.999999999993, 18615.74, 25.251357345953043, 563.6675060681588, 7.595134826712438], "isController": false}, {"data": ["NBM_ResLevel-8_Times-One_5threads", 424, 0, 0.0, 1285.0754716981137, 1086, 2470, 1198.5, 1326.0, 2305.0, 2399.25, 3.5035531317137663, 78.2072436374153, 1.0538030903982814], "isController": false}, {"data": ["LREF_ResLevel-4_Times-One_100threads", 23780, 0, 0.0, 1201.13931875525, 196, 4790, 1222.0, 2133.0, 2400.0, 2761.0, 79.02353758270388, 429.53614275911116, 23.305769873023998], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_250threads", 16938, 1, 0.00590388475616956, 4241.2712835045595, 542, 101496, 3667.0, 6624.0, 7284.049999999999, 9588.520000000077, 54.655635293510244, 783.3342707035889, 16.172517083919537], "isController": false}, {"data": ["NBM_ResLevel-4_Times-One_25threads", 1821, 0, 0.0, 1460.9434376716104, 1012, 2833, 1257.0, 2362.8, 2467.7, 2630.56, 14.955527632000395, 243.80138941502207, 4.498342295562619], "isController": false}, {"data": ["LREF_ResLevel-4_Times-One_250threads", 25831, 1, 0.0038713174093143897, 2770.566489876517, 108, 15034, 2437.5, 4324.9000000000015, 5329.950000000001, 7329.900000000016, 85.50536580844627, 464.7513266855871, 25.217402806787863], "isController": false}, {"data": ["NBM_ResLevel-8_Times-One_100threads", 7000, 0, 0.0, 4101.372857142858, 1073, 12344, 3975.0, 6111.900000000001, 7314.9, 8880.99, 22.996813298728604, 513.3409749827524, 6.917010250008214], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_100threads", 15689, 0, 0.0, 1822.817260500993, 538, 9002, 1722.0, 3130.0, 3705.0, 4393.4000000000015, 51.96977677077847, 744.8832164694488, 15.377775743697145], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_25threads", 8672, 0, 0.0, 304.8854935424361, 188, 1015, 260.0, 446.0, 492.35000000000036, 801.0800000000017, 72.01102751897432, 579.2527672595619, 21.2376272565725], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_50threads", 8689, 0, 0.0, 607.5627805271045, 334, 1786, 540.0, 903.0, 963.0, 1064.1000000000004, 71.93357175971919, 294.61855464869365, 21.636269630853036], "isController": false}, {"data": ["NBM_ResLevel-4_Times-One_500threads", 16569, 0, 0.0, 17861.931257166878, 1014, 203504, 16908.0, 24232.0, 28044.0, 38076.29999999999, 26.99664191689355, 440.0927182799844, 8.120083701565639], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_500threads", 354149, 11, 0.0031060372893894944, 827.218427836857, 1, 36991, 313.0, 2291.9000000000015, 3643.9500000000007, 6921.930000000011, 587.1676603420719, 4723.002779855131, 173.168587327447], "isController": false}, {"data": ["NBM_ResLevel-8_Times-One_50threads", 2618, 0, 0.0, 2028.3693659281914, 1072, 5525, 1819.0, 3095.7999999999993, 3533.0499999999997, 4255.049999999999, 21.374569324472166, 477.12881408084456, 6.429069679626394], "isController": false}, {"data": ["HREF_ResLevel-2_Times-One_50threads", 4536, 0, 0.0, 1167.7627865961226, 531, 3384, 963.5, 1695.3000000000002, 1948.1499999999996, 2994.8900000000003, 37.286073618623305, 248.36748843030233, 11.032890924260608], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_500threads", 226783, 11, 0.004850451753438309, 1292.0502639086517, 1, 33481, 558.0, 2429.7000000000044, 4575.9000000000015, 8262.88000000002, 374.7612122814555, 785.355066015199, 110.8912571496885], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_500threads", 245730, 17, 0.006918162210556302, 1192.8949822976263, 1, 25835, 634.0, 2447.9000000000015, 4000.9500000000007, 8150.0, 404.5277875179645, 1656.7186719970525, 121.67437358938776], "isController": false}, {"data": ["LREF_ResLevel-2_Times-One_50threads", 8768, 0, 0.0, 602.1124543795645, 235, 1871, 532.0, 988.0, 1248.5499999999993, 1572.0, 72.72124077299493, 622.3205399353074, 21.44708468109812], "isController": false}, {"data": ["LREF_ResLevel-2_Times-One_25threads", 6844, 0, 0.0, 386.3343074225609, 236, 1204, 336.0, 587.0, 626.0, 708.0, 56.81271064034665, 486.1814290442947, 16.755311145883486], "isController": false}, {"data": ["LREF_ResLevel-4_Times-One_500threads", 52686, 8, 0.015184299434384846, 5576.366188361182, 2, 80882, 4462.0, 10288.0, 13420.900000000001, 22178.69000000005, 86.98710201493869, 472.754248713421, 25.65439922706199], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_100threads", 53963, 0, 0.0, 528.827270537228, 293, 17552, 461.0, 785.0, 862.0, 991.9900000000016, 179.4316761099141, 1932.2198168593968, 51.86696887552203], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_500threads", 36208, 20, 0.0552364118426867, 8130.6457136544495, 1, 78194, 6949.0, 12585.30000000001, 16816.30000000001, 29693.020000000157, 59.53676816374585, 852.8785042061161, 17.616836673452138], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_25threads", 6413, 0, 0.0, 412.39154841727736, 275, 1352, 360.0, 617.0, 667.0, 740.8599999999997, 53.152428866252805, 111.39171127634621, 15.727720650854101], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_250threads", 64533, 0, 0.0, 1107.9570452326923, 334, 14560, 614.0, 2451.9000000000015, 3711.9500000000007, 6102.960000000006, 212.85515439774656, 871.791521039208, 64.0228394086972], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_50threads", 9022, 0, 0.0, 585.3725338062507, 274, 2062, 499.0, 890.0, 985.0, 1596.0, 74.64711820092337, 156.4381988859195, 22.087965639531035], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_100threads", 77083, 0, 0.0, 370.14091304178396, 185, 10021, 295.0, 508.0, 558.0, 1181.0, 256.2386769716613, 2061.1699045073965, 75.57039106000167], "isController": false}, {"data": ["NBM_ResLevel-4_Times-One_50threads", 2658, 0, 0.0, 1999.322799097069, 1024, 9496, 1728.5, 3214.5999999999995, 3664.2499999999986, 4626.049999999999, 21.701147923776556, 353.7668577066426, 6.527298398948417], "isController": false}, {"data": ["NBM_ResLevel-4_Times-One_250threads", 7782, 0, 0.0, 9274.099331791305, 1024, 32298, 9058.0, 13255.5, 15262.399999999998, 19114.38, 25.42347963867427, 414.4474078206929, 7.646905985069994], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_25threads", 6497, 0, 0.0, 407.0669539787589, 292, 964, 352.0, 616.1999999999998, 671.0, 765.039999999999, 53.879006509930754, 580.1990281103579, 15.57440031927686], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_100threads", 44208, 0, 0.0, 645.8304379297832, 273, 4988, 488.0, 1185.0, 1789.0, 2291.0, 146.83189461902026, 307.71606040275145, 43.44732819293275], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 114, 100.0, 0.005684631598473527], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2005407, 114, "502/Bad Gateway", 114, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_500threads", 85610, 13, "502/Bad Gateway", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NBM_ResLevel-8_Times-One_500threads", 16948, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["LREF_ResLevel-2_Times-One_250threads", 25273, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["HREF_ResLevel-2_Times-One_500threads", 35512, 27, "502/Bad Gateway", 27, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["LREF_ResLevel-2_Times-One_500threads", 53156, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_250threads", 16938, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["LREF_ResLevel-4_Times-One_250threads", 25831, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_500threads", 354149, 11, "502/Bad Gateway", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_500threads", 226783, 11, "502/Bad Gateway", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_500threads", 245730, 17, "502/Bad Gateway", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["LREF_ResLevel-4_Times-One_500threads", 52686, 8, "502/Bad Gateway", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_500threads", 36208, 20, "502/Bad Gateway", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
