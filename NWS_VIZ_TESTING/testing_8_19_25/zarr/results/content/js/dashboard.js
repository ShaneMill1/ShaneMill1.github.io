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

    var data = {"OkPercent": 99.00722675678702, "KoPercent": 0.9927732432129752};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6801353122920742, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9451338994121489, 500, 1500, "HREF_ResLevel-1_Time-All_5threads_ZARR"], "isController": false}, {"data": [0.1652690426275332, 500, 1500, "NBM_ResLevel-1_Times-One_100threads_ZARR"], "isController": false}, {"data": [0.596405777628485, 500, 1500, "HREF_ResLevel-1_Times-One_50threads_ZARR"], "isController": false}, {"data": [0.5032015065913371, 500, 1500, "NBM_ResLevel-1_Times-One_25threads_ZARR"], "isController": false}, {"data": [0.6885185185185185, 500, 1500, "HREF_ResLevel-1_Times-One_25threads_ZARR"], "isController": false}, {"data": [0.38924731182795697, 500, 1500, "NBM_ResLevel-1_Times-One_50threads_ZARR"], "isController": false}, {"data": [0.5798169801728521, 500, 1500, "HREF_ResLevel-1_Time-All_50threads_ZARR"], "isController": false}, {"data": [0.7382654826432937, 500, 1500, "LREF_ResLevel-1_Time-All_50threads_ZARR"], "isController": false}, {"data": [0.447649150533386, 500, 1500, "NBM_ResLevel-1_Time-All_25threads_ZARR"], "isController": false}, {"data": [0.8025441623319771, 500, 1500, "MRMS_ResLevel-1_Times-One_100threads_ZARR"], "isController": false}, {"data": [0.34760357432981315, 500, 1500, "HREF_ResLevel-1_Times-One_100threads_ZARR"], "isController": false}, {"data": [0.9507143648244545, 500, 1500, "MRMS_ResLevel-1_Times-One_25threads_ZARR"], "isController": false}, {"data": [0.32996855866291575, 500, 1500, "HREF_ResLevel-1_Time-All_100threads_ZARR"], "isController": false}, {"data": [0.7392123287671233, 500, 1500, "LREF_ResLevel-1_Times-One_50threads_ZARR"], "isController": false}, {"data": [0.9431818181818182, 500, 1500, "HREF_ResLevel-1_Times-One_5threads_ZARR"], "isController": false}, {"data": [0.8945283849200528, 500, 1500, "LREF_ResLevel-1_Time-All_25threads_ZARR"], "isController": false}, {"data": [0.2712230215827338, 500, 1500, "NBM_ResLevel-1_Time-All_50threads_ZARR"], "isController": false}, {"data": [0.4912559618441971, 500, 1500, "NBM_ResLevel-1_Time-All_5threads_ZARR"], "isController": false}, {"data": [0.4836748110003287, 500, 1500, "LREF_ResLevel-1_Times-One_100threads_ZARR"], "isController": false}, {"data": [0.9933431952662722, 500, 1500, "MRMS_ResLevel-1_Times-One_5threads_ZARR"], "isController": false}, {"data": [0.5160900199810705, 500, 1500, "LREF_ResLevel-1_Time-All_100threads_ZARR"], "isController": false}, {"data": [0.9818775995246584, 500, 1500, "LREF_ResLevel-1_Time-All_5threads_ZARR"], "isController": false}, {"data": [0.7946071202864967, 500, 1500, "HREF_ResLevel-1_Time-All_25threads_ZARR"], "isController": false}, {"data": [0.12788365095285859, 500, 1500, "NBM_ResLevel-1_Time-All_100threads_ZARR"], "isController": false}, {"data": [0.795687885010267, 500, 1500, "NBM_ResLevel-1_Times-One_5threads_ZARR"], "isController": false}, {"data": [0.9035062915311749, 500, 1500, "MRMS_ResLevel-1_Times-One_50threads_ZARR"], "isController": false}, {"data": [0.998567335243553, 500, 1500, "LREF_ResLevel-1_Times-One_5threads_ZARR"], "isController": false}, {"data": [0.8311977220145933, 500, 1500, "LREF_ResLevel-1_Times-One_25threads_ZARR"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 151797, 1507, 0.9927732432129752, 879.5564668603467, 5, 21174, 1032.0, 3679.0, 5122.0, 8399.910000000014, 44.83856026976923, 4158.9688875940365, 12.693261247172428], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["HREF_ResLevel-1_Time-All_5threads_ZARR", 1531, 0, 0.0, 353.4056172436317, 232, 1525, 314.0, 506.79999999999995, 563.0, 636.7200000000003, 12.725353458952215, 1723.2973537722028, 3.39259911552144], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_100threads_ZARR", 2862, 187, 6.533892382948987, 3715.177498252965, 21, 17603, 2720.5, 7891.700000000001, 10321.349999999999, 14463.509999999987, 23.46748007478107, 163.62244791410427, 7.035660530232215], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_50threads_ZARR", 5954, 95, 1.5955660060463555, 887.8627813234787, 6, 5620, 618.0, 1898.0, 2434.0, 3723.8999999999996, 49.292159947015485, 268.42470015108864, 14.537336234373706], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_25threads_ZARR", 2655, 26, 0.9792843691148776, 999.8139359698683, 6, 4971, 765.0, 1886.0, 2339.5999999999995, 3497.6400000000003, 21.860848085631947, 161.13329495162617, 6.553984728797859], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_25threads_ZARR", 4050, 44, 1.0864197530864197, 654.685185185185, 8, 3070, 544.0, 1195.0, 1443.4499999999998, 1971.4899999999998, 33.21959381869484, 181.81516564171233, 9.797184895747892], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_50threads_ZARR", 2790, 32, 1.146953405017921, 1896.5562724014303, 76, 18417, 1196.5, 4189.400000000001, 5965.299999999997, 10374.780000000006, 23.062044338640085, 169.70400545450414, 6.914108996057134], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_50threads_ZARR", 5901, 75, 1.2709710218607015, 894.7985087273316, 6, 5282, 657.0, 1845.6000000000004, 2275.0999999999967, 3202.6199999999917, 48.874422302837544, 6534.72212785898, 13.029997352221338], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_50threads_ZARR", 8671, 76, 0.876484834505824, 608.4632683658194, 8, 4519, 467.0, 1190.8000000000002, 1458.7999999999993, 2138.2800000000007, 71.90360886294282, 23270.12329182543, 19.099396104219185], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_25threads_ZARR", 2531, 0, 0.0, 1048.1698933227956, 552, 3479, 970.0, 1519.8000000000002, 1781.8000000000002, 2447.239999999997, 20.93205971136749, 4156.281078133399, 5.682727148203283], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_100threads_ZARR", 19417, 14, 0.07210176649327908, 545.8289128083629, 8, 3933, 358.0, 1231.0, 1963.0999999999985, 2933.8199999999997, 159.72524986632666, 2948.222184698001, 46.014598350162466], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_100threads_ZARR", 6155, 189, 3.0706742485783916, 1719.4305442729456, 7, 8656, 1286.0, 3758.4000000000005, 4637.0, 6251.199999999998, 50.78508543940857, 272.6213491129112, 14.977632619825572], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_25threads_ZARR", 9029, 8, 0.08860338907963229, 292.62841953704793, 6, 3288, 215.0, 455.0, 605.0, 1873.7000000000007, 75.113348030448, 1386.1725233065388, 21.639099286115385], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_100threads_ZARR", 6043, 175, 2.89591262617905, 1752.896409068344, 6, 10472, 1296.0, 3744.800000000001, 4804.200000000002, 6665.720000000015, 49.66549961372191, 6531.434591292614, 13.240899799361408], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_50threads_ZARR", 8760, 78, 0.8904109589041096, 602.204794520549, 6, 2801, 452.0, 1219.0, 1502.949999999999, 2031.3899999999994, 72.68925344153743, 752.3810158188328, 21.36666531826442], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_5threads_ZARR", 1628, 0, 0.0, 332.74385749385715, 212, 1344, 267.0, 509.10000000000014, 584.55, 713.5500000000002, 13.487986743993373, 74.59225481565866, 3.97790234051367], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_25threads_ZARR", 6817, 24, 0.35206102391081123, 387.7440222971983, 6, 3297, 322.0, 633.0, 759.1999999999989, 1053.8199999999997, 56.64547758527567, 18429.03480293635, 15.046454983588848], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_50threads_ZARR", 2780, 12, 0.4316546762589928, 1909.5312949640297, 72, 10798, 1391.0, 3820.000000000001, 5140.749999999999, 7314.170000000002, 22.81718347313646, 4511.073826643781, 6.194508794464781], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_5threads_ZARR", 629, 0, 0.0, 865.2686804451507, 544, 1877, 785.0, 1233.0, 1306.5, 1718.3000000000004, 5.201442180471024, 1032.8088030041636, 1.4121102794638132], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_100threads_ZARR", 9127, 196, 2.147474526131259, 1157.4256601292843, 6, 7935, 916.0, 2368.0, 2938.0, 4156.679999999988, 75.5658955804673, 772.4739629689234, 22.212240790742825], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_5threads_ZARR", 2704, 0, 0.0, 199.63387573964513, 99, 1908, 167.0, 272.0, 311.75, 858.4999999999873, 22.511759563751404, 415.7640594430338, 6.485321358697915], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_100threads_ZARR", 9509, 163, 1.7141655273950993, 1111.9558313177001, 7, 8169, 776.0, 2357.0, 3031.5, 4677.799999999992, 78.61146475752716, 25226.133993462307, 20.88117032621815], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_5threads_ZARR", 1683, 0, 0.0, 321.0986333927519, 179, 1351, 281.0, 443.0, 484.0, 622.920000000001, 13.998170173833486, 4570.2317140844625, 3.7182639524245196], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_25threads_ZARR", 4747, 23, 0.48451653676005896, 557.8053507478395, 5, 12491, 411.0, 860.1999999999998, 1061.5999999999995, 1651.0, 39.33608445615605, 5301.245893643622, 10.487061578643166], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_100threads_ZARR", 2991, 56, 1.8722835172183216, 3558.575058508861, 12, 21174, 2678.0, 7352.8, 9010.600000000004, 14025.479999999976, 24.447859279724053, 4763.623598447385, 6.637211796643834], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_5threads_ZARR", 974, 2, 0.2053388090349076, 555.7156057494864, 189, 1540, 471.0, 841.5, 880.0, 1212.5, 8.08802159020137, 60.05926276728254, 2.424826785343575], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_50threads_ZARR", 14146, 12, 0.08482963381874735, 373.39170083415615, 7, 3068, 253.0, 622.3000000000011, 1188.0, 2328.0, 117.28712378741398, 2164.633417821387, 33.78877101297571], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_5threads_ZARR", 2094, 0, 0.0, 257.82139446036325, 161, 576, 224.0, 360.0, 391.25, 449.10000000000036, 17.43271256004462, 182.0390742721801, 5.124264141184992], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_25threads_ZARR", 5619, 20, 0.3559352197899982, 470.8250578394736, 6, 6689, 363.0, 815.0, 989.0, 2070.000000000002, 46.636123699018974, 485.30383911305046, 13.708469954496788], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 1507, 100.0, 0.9927732432129752], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 151797, 1507, "502/Bad Gateway", 1507, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_100threads_ZARR", 2862, 187, "502/Bad Gateway", 187, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_50threads_ZARR", 5954, 95, "502/Bad Gateway", 95, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_25threads_ZARR", 2655, 26, "502/Bad Gateway", 26, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_25threads_ZARR", 4050, 44, "502/Bad Gateway", 44, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_50threads_ZARR", 2790, 32, "502/Bad Gateway", 32, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_50threads_ZARR", 5901, 75, "502/Bad Gateway", 75, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_50threads_ZARR", 8671, 76, "502/Bad Gateway", 76, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_100threads_ZARR", 19417, 14, "502/Bad Gateway", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_100threads_ZARR", 6155, 189, "502/Bad Gateway", 189, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_25threads_ZARR", 9029, 8, "502/Bad Gateway", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_100threads_ZARR", 6043, 175, "502/Bad Gateway", 175, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_50threads_ZARR", 8760, 78, "502/Bad Gateway", 78, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_25threads_ZARR", 6817, 24, "502/Bad Gateway", 24, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_50threads_ZARR", 2780, 12, "502/Bad Gateway", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_100threads_ZARR", 9127, 196, "502/Bad Gateway", 196, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_100threads_ZARR", 9509, 163, "502/Bad Gateway", 163, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_25threads_ZARR", 4747, 23, "502/Bad Gateway", 23, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_100threads_ZARR", 2991, 56, "502/Bad Gateway", 56, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_5threads_ZARR", 974, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_50threads_ZARR", 14146, 12, "502/Bad Gateway", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_25threads_ZARR", 5619, 20, "502/Bad Gateway", 20, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
