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

    var data = {"OkPercent": 99.63883303049661, "KoPercent": 0.3611669695033892};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5908659307444315, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.02977520704614171, 500, 1500, "NBM_ResLevel-8_Times-One_250threads"], "isController": false}, {"data": [0.7053254437869823, 500, 1500, "NBM_ResLevel-8_Times-One_5threads"], "isController": false}, {"data": [0.42532238120473415, 500, 1500, "LREF_ResLevel-4_Times-One_100threads"], "isController": false}, {"data": [0.031786165793751125, 500, 1500, "HREF_ResLevel-4_Times-One_250threads"], "isController": false}, {"data": [0.5112299465240642, 500, 1500, "NBM_ResLevel-4_Times-One_25threads"], "isController": false}, {"data": [0.7230087064963857, 500, 1500, "NBM_ResLevel-1_Times-One_100threads"], "isController": false}, {"data": [0.17717550038656474, 500, 1500, "LREF_ResLevel-4_Times-One_250threads"], "isController": false}, {"data": [0.09517555985623445, 500, 1500, "NBM_ResLevel-8_Times-One_100threads"], "isController": false}, {"data": [0.597323600973236, 500, 1500, "HREF_ResLevel-4_Times-One_50threads"], "isController": false}, {"data": [0.2806326748531767, 500, 1500, "HREF_ResLevel-4_Times-One_100threads"], "isController": false}, {"data": [0.8055835517032857, 500, 1500, "HREF_ResLevel-2_Times-One_25threads"], "isController": false}, {"data": [0.5103876633112016, 500, 1500, "LREF_ResLevel-2_Times-One_100threads"], "isController": false}, {"data": [0.7727910238429172, 500, 1500, "NBM_ResLevel-1_Times-One_25threads"], "isController": false}, {"data": [0.961039668700959, 500, 1500, "LREF_ResLevel-1_Times-One_25threads"], "isController": false}, {"data": [0.7174175625075492, 500, 1500, "NBM_ResLevel-1_Times-One_50threads"], "isController": false}, {"data": [0.2709844904479798, 500, 1500, "HREF_ResLevel-2_Times-One_100threads"], "isController": false}, {"data": [0.8955931965139162, 500, 1500, "LREF_ResLevel-1_Times-One_50threads"], "isController": false}, {"data": [0.8317843866171004, 500, 1500, "LREF_ResLevel-4_Times-One_25threads"], "isController": false}, {"data": [0.048079253514299564, 500, 1500, "HREF_ResLevel-2_Times-One_250threads"], "isController": false}, {"data": [0.2983251919050942, 500, 1500, "NBM_ResLevel-8_Times-One_50threads"], "isController": false}, {"data": [0.2594606614376971, 500, 1500, "LREF_ResLevel-2_Times-One_250threads"], "isController": false}, {"data": [0.5718578296703297, 500, 1500, "HREF_ResLevel-2_Times-One_50threads"], "isController": false}, {"data": [0.9739900387382402, 500, 1500, "LREF_ResLevel-2_Times-One_5threads"], "isController": false}, {"data": [0.91854893908282, 500, 1500, "HREF_ResLevel-2_Times-One_5threads"], "isController": false}, {"data": [0.9921586715867159, 500, 1500, "LREF_ResLevel-1_Times-One_5threads"], "isController": false}, {"data": [0.9428571428571428, 500, 1500, "HREF_ResLevel-4_Times-One_5threads"], "isController": false}, {"data": [0.7370044556152177, 500, 1500, "LREF_ResLevel-2_Times-One_50threads"], "isController": false}, {"data": [0.9941573033707866, 500, 1500, "HREF_ResLevel-1_Times-One_5threads"], "isController": false}, {"data": [0.8486646884272997, 500, 1500, "LREF_ResLevel-2_Times-One_25threads"], "isController": false}, {"data": [0.9833162217659137, 500, 1500, "LREF_ResLevel-4_Times-One_5threads"], "isController": false}, {"data": [0.514519056261343, 500, 1500, "NBM_ResLevel-8_Times-One_25threads"], "isController": false}, {"data": [0.007729861676159479, 500, 1500, "HREF_ResLevel-4_Times-One_500threads"], "isController": false}, {"data": [0.9273081924577373, 500, 1500, "HREF_ResLevel-1_Times-One_25threads"], "isController": false}, {"data": [0.7251092488818056, 500, 1500, "NBM_ResLevel-1_Times-One_250threads"], "isController": false}, {"data": [0.8142896602522788, 500, 1500, "HREF_ResLevel-1_Times-One_50threads"], "isController": false}, {"data": [0.7441489361702127, 500, 1500, "NBM_ResLevel-4_Times-One_5threads"], "isController": false}, {"data": [0.7313563271964577, 500, 1500, "LREF_ResLevel-4_Times-One_50threads"], "isController": false}, {"data": [0.9637491835401698, 500, 1500, "NBM_ResLevel-1_Times-One_5threads"], "isController": false}, {"data": [0.8708074987234663, 500, 1500, "LREF_ResLevel-1_Times-One_100threads"], "isController": false}, {"data": [0.12304448374370834, 500, 1500, "NBM_ResLevel-4_Times-One_100threads"], "isController": false}, {"data": [0.2590316573556797, 500, 1500, "NBM_ResLevel-4_Times-One_50threads"], "isController": false}, {"data": [0.013341921236658078, 500, 1500, "HREF_ResLevel-2_Times-One_500threads"], "isController": false}, {"data": [0.6176151761517615, 500, 1500, "HREF_ResLevel-4_Times-One_25threads"], "isController": false}, {"data": [0.09202092871157619, 500, 1500, "NBM_ResLevel-4_Times-One_250threads"], "isController": false}, {"data": [0.8207372951421352, 500, 1500, "LREF_ResLevel-1_Times-One_250threads"], "isController": false}, {"data": [0.556028699217294, 500, 1500, "HREF_ResLevel-1_Times-One_250threads"], "isController": false}, {"data": [0.7420220837126783, 500, 1500, "HREF_ResLevel-1_Times-One_100threads"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 804614, 2906, 0.3611669695033892, 1742.06347888551, 1, 65973, 7664.0, 14014.800000000003, 16192.850000000002, 21375.800000000032, 83.99103067393852, 9958.753132177077, 24.91803963144931], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NBM_ResLevel-8_Times-One_250threads", 7607, 216, 2.839489943473117, 9454.629683186578, 89, 58230, 8033.0, 17551.6, 21323.8, 29610.96000000002, 24.97578593121563, 5891.121753929657, 7.512248112123451], "isController": false}, {"data": ["NBM_ResLevel-8_Times-One_5threads", 845, 0, 0.0, 639.9869822485203, 391, 1308, 546.0, 875.0, 898.0, 1233.1799999999994, 7.0294237536290956, 1706.4543982381726, 2.1143188633962513], "isController": false}, {"data": ["LREF_ResLevel-4_Times-One_100threads", 22644, 33, 0.14573396926338103, 1260.9895336512845, 12, 7232, 1071.0, 2506.9000000000015, 3048.9500000000007, 4280.980000000003, 75.31430852125324, 2156.064821455298, 22.211837083416484], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_250threads", 16611, 157, 0.9451568237914635, 4306.996448136766, 16, 19503, 3822.0, 7632.800000000001, 8999.0, 11652.080000000042, 54.997665802516956, 7406.415180555762, 16.273723377111953], "isController": false}, {"data": ["NBM_ResLevel-4_Times-One_25threads", 2805, 0, 0.0, 944.0442067736178, 394, 3138, 823.0, 1660.8000000000002, 1946.8999999999987, 2568.94, 23.24848946980183, 5645.137367401246, 6.992709723338831], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_100threads", 43301, 13, 0.03002240133022332, 659.1057019468377, 2, 13849, 451.0, 1005.9000000000015, 1233.0, 2709.9900000000016, 144.02030206978668, 34968.722251708954, 43.318606481928036], "isController": false}, {"data": ["LREF_ResLevel-4_Times-One_250threads", 23282, 144, 0.6185035649858259, 3067.2033330469926, 9, 19981, 2610.5, 6425.0, 7716.0, 10549.860000000022, 77.31210753695088, 2202.877070911909, 22.801031714999187], "isController": false}, {"data": ["NBM_ResLevel-8_Times-One_100threads", 7234, 51, 0.7050041470832181, 3958.1130771357534, 33, 38516, 3096.0, 7689.5, 9303.25, 13144.3, 23.93866090426852, 5770.395936762671, 7.200300350112015], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_50threads", 6165, 0, 0.0, 856.8220600162196, 227, 4479, 715.0, 1600.2000000000016, 1943.0, 2674.040000000001, 51.10075925864527, 6947.158201829867, 15.120634819696793], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_100threads", 14984, 42, 0.2802989855846236, 1906.4851174586329, 82, 12110, 1510.0, 3734.5, 4475.75, 6076.0, 49.75957068090646, 6745.899350732911, 14.723779215151033], "isController": false}, {"data": ["HREF_ResLevel-2_Times-One_25threads", 4961, 0, 0.0, 533.2876436202373, 229, 3380, 449.0, 829.8000000000002, 1031.4999999999982, 1721.220000000002, 41.178325973637904, 5487.936839793299, 12.184602314465122], "isController": false}, {"data": ["LREF_ResLevel-2_Times-One_100threads", 23345, 69, 0.2955665024630542, 1222.7972156778897, 30, 11043, 864.0, 2818.9000000000015, 3785.800000000003, 5733.0, 77.6324190587672, 3224.22809565818, 22.895498589597356], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_25threads", 4991, 0, 0.0, 530.0022039671413, 218, 2541, 464.0, 908.8000000000002, 1053.0, 1356.0, 41.462786505279425, 10070.355254474633, 12.471228753541077], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_25threads", 9176, 0, 0.0, 287.9906277244985, 120, 1959, 253.0, 468.0, 549.0, 730.6899999999987, 76.29436855102227, 3215.762930694016, 22.500878225008524], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_50threads", 8279, 2, 0.024157506945283246, 637.2983452107719, 75, 3986, 526.0, 1165.0, 1400.0, 1960.0000000000036, 68.76474301471809, 16697.341124549403, 20.68314535989568], "isController": false}, {"data": ["HREF_ResLevel-2_Times-One_100threads", 15023, 55, 0.36610530519869533, 1902.705851028417, 2, 10992, 1530.0, 3681.6000000000004, 4470.5999999999985, 6088.76, 49.86722432450375, 6621.645997617299, 14.755633760082654], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_50threads", 14228, 1, 0.007028394714647174, 370.65188360978516, 78, 2951, 299.0, 637.0, 768.0, 1320.7099999999991, 118.15607430844483, 4979.8615176843805, 34.84681097768588], "isController": false}, {"data": ["LREF_ResLevel-4_Times-One_25threads", 5918, 0, 0.0, 447.0633660020274, 161, 1581, 376.5, 793.0, 924.1000000000004, 1219.6200000000008, 49.16997623755795, 1409.6513597714734, 14.501301585686036], "isController": false}, {"data": ["HREF_ResLevel-2_Times-One_250threads", 16504, 137, 0.8301017935046049, 4367.915050896761, 35, 22289, 3779.5, 8056.0, 9619.75, 13219.150000000027, 53.204555785157275, 7031.96150772367, 15.743144924709622], "isController": false}, {"data": ["NBM_ResLevel-8_Times-One_50threads", 2866, 12, 0.418702023726448, 1851.376133984649, 45, 9198, 1419.5, 3773.3, 4865.6, 6708.229999999998, 23.595857140504847, 5704.144753734707, 7.097191405542474], "isController": false}, {"data": ["LREF_ResLevel-2_Times-One_250threads", 24734, 242, 0.9784102854370502, 2888.930540955744, 1, 22183, 2181.0, 6874.800000000003, 8690.750000000004, 12578.970000000005, 82.08331120904795, 3385.886814212835, 24.20816404798094], "isController": false}, {"data": ["HREF_ResLevel-2_Times-One_50threads", 5824, 5, 0.08585164835164835, 906.1557348901091, 13, 4486, 721.0, 1742.5, 2160.5, 2811.25, 48.30388985651489, 6432.062724843452, 14.293045533714855], "isController": false}, {"data": ["LREF_ResLevel-2_Times-One_5threads", 1807, 0, 0.0, 299.265633646929, 169, 946, 249.0, 445.20000000000005, 501.0, 591.9200000000001, 15.031402071288941, 626.1224843249594, 4.433089282743418], "isController": false}, {"data": ["HREF_ResLevel-2_Times-One_5threads", 1461, 0, 0.0, 370.1601642710472, 218, 939, 298.0, 544.0, 645.0, 738.1399999999996, 12.150496498727566, 1619.3265699979, 3.5953129288227075], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_5threads", 2168, 0, 0.0, 249.3879151291512, 123, 980, 241.0, 366.0, 419.0, 532.7199999999993, 18.032105131830658, 760.0426656200615, 5.31806225567662], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_5threads", 1470, 0, 0.0, 367.3843537414962, 229, 1103, 332.0, 507.0, 544.9000000000001, 742.0, 12.241227120563597, 1664.197217905293, 3.6221599780573923], "isController": false}, {"data": ["LREF_ResLevel-2_Times-One_50threads", 8753, 1, 0.011424654404204274, 604.6927910430696, 52, 3408, 484.0, 1116.6000000000004, 1431.2999999999993, 2162.7599999999948, 72.25285610513109, 3009.3003100261876, 21.308947796630456], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_5threads", 2225, 0, 0.0, 242.85662921348282, 156, 1075, 203.0, 347.0, 386.0, 514.7399999999998, 18.516360973336443, 2383.4028390366498, 5.478962280196232], "isController": false}, {"data": ["LREF_ResLevel-2_Times-One_25threads", 6066, 0, 0.0, 435.5954500494557, 163, 1952, 365.0, 759.0, 913.0, 1188.6499999999996, 50.436098477604745, 2100.8802192028834, 14.874708730699837], "isController": false}, {"data": ["LREF_ResLevel-4_Times-One_5threads", 1948, 0, 0.0, 277.4594455852157, 167, 716, 233.0, 418.0, 483.0, 549.02, 16.21171770972037, 464.77284844166115, 4.781190183921439], "isController": false}, {"data": ["NBM_ResLevel-8_Times-One_25threads", 2755, 0, 0.0, 962.3843920145179, 379, 3451, 833.0, 1765.6000000000004, 2118.5999999999995, 2718.6400000000003, 22.794026393083193, 5533.45024504354, 6.856015751044554], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_500threads", 35641, 1011, 2.8366207457703205, 8234.432675850856, 1, 44106, 7916.5, 14577.0, 16868.0, 21690.99, 59.070086580660565, 7803.245564766236, 17.478746322207176], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_25threads", 7690, 0, 0.0, 343.695318595578, 155, 2301, 290.0, 544.0, 688.4499999999998, 1149.0, 63.935216747867436, 8229.661180764562, 18.918330736917806], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_250threads", 97255, 43, 0.044213665107192435, 734.0851884221998, 5, 19976, 413.0, 977.0, 1205.9500000000007, 1731.9900000000016, 321.42656482898343, 78032.62683393243, 96.67908395246768], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_50threads", 10861, 0, 0.0, 485.4448025043749, 158, 3323, 383.0, 853.0, 1101.0, 2074.1399999999976, 90.22262834357866, 11613.343942100017, 26.69673475400814], "isController": false}, {"data": ["NBM_ResLevel-4_Times-One_5threads", 940, 0, 0.0, 575.3468085106381, 399, 955, 503.0, 870.9, 891.0, 922.9500000000002, 7.8198441022569405, 1898.794078911794, 2.3520624838819706], "isController": false}, {"data": ["LREF_ResLevel-4_Times-One_50threads", 8582, 0, 0.0, 615.0222558844117, 165, 2869, 496.0, 1165.0, 1452.8499999999995, 1965.2500000000018, 71.26663953961518, 2043.1393915668777, 21.018090957972447], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_5threads", 1531, 0, 0.0, 353.05160026126754, 214, 1213, 334.0, 493.79999999999995, 509.0, 540.6800000000001, 12.723978591137262, 3090.3611518431485, 3.827134185615505], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_100threads", 68545, 10, 0.014588956160186739, 416.42949886935656, 6, 8721, 320.0, 673.0, 812.9500000000007, 2329.930000000011, 228.12897299528066, 9614.108743922981, 67.28022445759254], "isController": false}, {"data": ["NBM_ResLevel-4_Times-One_100threads", 7351, 89, 1.2107196299823153, 3893.5894436131175, 2, 26850, 3213.0, 7905.8, 9835.999999999989, 14138.879999999997, 24.31457121215629, 5832.599284817822, 7.313367122406385], "isController": false}, {"data": ["NBM_ResLevel-4_Times-One_50threads", 2685, 17, 0.633147113594041, 1975.9418994413386, 47, 10243, 1569.0, 3909.4, 4740.4, 6335.2199999999975, 22.09385568639068, 5330.843154003328, 6.645417530672196], "isController": false}, {"data": ["HREF_ResLevel-2_Times-One_500threads", 16302, 389, 2.386210280947123, 7988.713777450649, 1, 37705, 7667.5, 13832.400000000001, 15927.549999999996, 21402.339999999986, 57.98864557988646, 7544.250574257267, 17.15874961982968], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_25threads", 3690, 0, 0.0, 717.7891598916008, 234, 2504, 582.0, 1220.8000000000002, 1425.0, 1772.3600000000006, 30.586362958173773, 4158.222018062739, 9.050457008131497], "isController": false}, {"data": ["NBM_ResLevel-4_Times-One_250threads", 7645, 48, 0.6278613472858077, 9407.51170699809, 4, 65973, 6963.0, 20878.800000000003, 27460.099999999984, 38837.58, 25.111020601219256, 6059.151274781531, 7.55292416521048], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_250threads", 129419, 27, 0.020862469961906674, 552.5408015824522, 10, 11728, 334.0, 852.0, 1216.7500000000036, 3350.6900000000496, 427.70839461047564, 18023.921345219514, 126.14056169176138], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_250threads", 53660, 80, 0.14908684308609765, 1329.3964964591917, 3, 22179, 598.0, 3331.0, 4775.0, 6187.950000000008, 178.47996008647928, 22939.538551887577, 52.81194131465159], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_100threads", 42837, 12, 0.02801316618810841, 666.8044214114029, 3, 8193, 428.0, 1102.0, 1928.9000000000015, 3550.9600000000064, 141.25596027145204, 18177.207904964587, 41.79741793188474], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 2900, 99.79353062629043, 0.36042127032340976], "isController": false}, {"data": ["500/Internal Server Error", 6, 0.20646937370956642, 7.456991799794685E-4], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 804614, 2906, "502/Bad Gateway", 2900, "500/Internal Server Error", 6, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["NBM_ResLevel-8_Times-One_250threads", 7607, 216, "502/Bad Gateway", 213, "500/Internal Server Error", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["LREF_ResLevel-4_Times-One_100threads", 22644, 33, "502/Bad Gateway", 33, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_250threads", 16611, 157, "502/Bad Gateway", 157, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_100threads", 43301, 13, "502/Bad Gateway", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-4_Times-One_250threads", 23282, 144, "502/Bad Gateway", 144, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-8_Times-One_100threads", 7234, 51, "502/Bad Gateway", 51, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_100threads", 14984, 42, "502/Bad Gateway", 42, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["LREF_ResLevel-2_Times-One_100threads", 23345, 69, "502/Bad Gateway", 69, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_50threads", 8279, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-2_Times-One_100threads", 15023, 55, "502/Bad Gateway", 55, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_50threads", 14228, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["HREF_ResLevel-2_Times-One_250threads", 16504, 137, "502/Bad Gateway", 137, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-8_Times-One_50threads", 2866, 12, "502/Bad Gateway", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-2_Times-One_250threads", 24734, 242, "502/Bad Gateway", 242, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-2_Times-One_50threads", 5824, 5, "502/Bad Gateway", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["LREF_ResLevel-2_Times-One_50threads", 8753, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_500threads", 35641, 1011, "502/Bad Gateway", 1010, "500/Internal Server Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_250threads", 97255, 43, "502/Bad Gateway", 43, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_100threads", 68545, 10, "502/Bad Gateway", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-4_Times-One_100threads", 7351, 89, "502/Bad Gateway", 89, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-4_Times-One_50threads", 2685, 17, "502/Bad Gateway", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-2_Times-One_500threads", 16302, 389, "502/Bad Gateway", 389, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NBM_ResLevel-4_Times-One_250threads", 7645, 48, "502/Bad Gateway", 46, "500/Internal Server Error", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_250threads", 129419, 27, "502/Bad Gateway", 27, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_250threads", 53660, 80, "502/Bad Gateway", 80, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_100threads", 42837, 12, "502/Bad Gateway", 12, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
