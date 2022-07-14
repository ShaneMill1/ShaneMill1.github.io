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

    var data = {"OkPercent": 99.46152637368394, "KoPercent": 0.5384736263160652};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5787648630244618, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "NCPPServerlessWestGFSPosition-1time-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSTrajectory20waypoints"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSCorridor5waypoints"], "isController": false}, {"data": [0.5968841285296982, 500, 1500, "NCPPServerlessWestGFSAreaGlobe-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSPosition-halftime-fullzedd"], "isController": false}, {"data": [0.6532919530037685, 500, 1500, "NCPPServerlessWestGFSPosition-1time-1zedd"], "isController": false}, {"data": [0.659956942949408, 500, 1500, "NCPPServerlessWestGFSPosition-fulltime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSCorridor10waypoints"], "isController": false}, {"data": [0.6704405104981473, 500, 1500, "NCPPServerlessWestGFSPosition-halftime-1zedd"], "isController": false}, {"data": [0.6287018481407259, 500, 1500, "NCPPServerlessWestGFSAreaTexas-halftime-1zedd"], "isController": false}, {"data": [0.5360243055555556, 500, 1500, "NCPPServerlessWestGFSAreaTexas-fulltime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSCorridor20waypoints"], "isController": false}, {"data": [0.5741644303488656, 500, 1500, "NCPPServerlessWestGFSCollectionMeta"], "isController": false}, {"data": [0.41544117647058826, 500, 1500, "NCPPServerlessWestGFSAreaUS-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestNWM-position-1month"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSTrajectory5waypoints"], "isController": false}, {"data": [0.6248572081334247, 500, 1500, "NCPPServerlessWestGFSAreaTexas-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestNWM-position-1hour"], "isController": false}, {"data": [0.028072364316905803, 500, 1500, "NCPPServerlessWestGFSPosition-fulltime-halfzedd"], "isController": false}, {"data": [0.4435881627620222, 500, 1500, "NCPPServerlessWestGFSAreaUS-1time-1zedd"], "isController": false}, {"data": [0.6070139828597203, 500, 1500, "NCPPServerlessWestGFSAreaHalfGlobe-1time-1zedd"], "isController": false}, {"data": [0.9912840869865378, 500, 1500, "NCPPServerlessWestCollections"], "isController": false}, {"data": [0.49606085302906816, 500, 1500, "NCPPServerlessWestGFSAreaTexas-1time-fullzedd"], "isController": false}, {"data": [0.6551353674258702, 500, 1500, "NCPPServerlessWestGFSAreaUS-halftime-1zedd"], "isController": false}, {"data": [0.4916525183927561, 500, 1500, "NCPPServerlessWestGFSAreaUS-1time-fullzedd"], "isController": false}, {"data": [0.4794034090909091, 500, 1500, "NCPPServerlessWestGFSAreaTexas-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSTrajectory10waypoints"], "isController": false}, {"data": [0.4800853485064011, 500, 1500, "NCPPServerlessWestGFSAreaTexas-halftime-halfzedd"], "isController": false}, {"data": [0.8700224099293226, 500, 1500, "NCPPServerlessWestGFSInstances"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSPosition-fulltime-fullzedd"], "isController": false}, {"data": [0.6603361711416721, 500, 1500, "NCPPServerlessWestGFSAreaUS-fulltime-1zedd"], "isController": false}, {"data": [0.02573062261753494, 500, 1500, "NCPPServerlessWestGFSPosition-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestNWM-position-1day"], "isController": false}, {"data": [0.024667931688804556, 500, 1500, "NCPPServerlessWestGFSPosition-halftime-halfzedd"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 190910, 1028, 0.5384736263160652, 1016.2226913205237, 151, 120480, 964.5, 7215.0, 13374.900000000016, 25304.76000000004, 80.08016825602164, 684.9289834008569, 49.029074396043015], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NCPPServerlessWestGFSPosition-1time-fullzedd", 1944, 0, 0.0, 2915.1532921810717, 2367, 5212, 2913.0, 3203.5, 3325.0, 4000.0, 30.51517910400904, 122.98451578344269, 12.873591184503814], "isController": false}, {"data": ["NCPPServerlessWestGFSTrajectory20waypoints", 2090, 0, 0.0, 2693.6239234449768, 2205, 3834, 2660.0, 2995.0, 3246.399999999998, 3483.600000000006, 33.12937894303015, 254.74680644279238, 57.68523696818629], "isController": false}, {"data": ["NCPPServerlessWestGFSCorridor5waypoints", 806, 0, 0.0, 7186.791563275434, 4005, 13436, 6856.0, 9290.50000000001, 11001.499999999998, 12932.369999999964, 12.39866475917978, 177.625402360515, 9.286890498330948], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaGlobe-1time-1zedd", 8216, 0, 0.0, 674.8534566699115, 424, 3959, 641.0, 832.0, 936.0, 2831.279999999999, 134.58041900768237, 2175.4977303068026, 70.05015950302216], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-halftime-fullzedd", 1910, 0, 0.0, 2969.729842931934, 2411, 8022, 2967.0, 3269.0, 3363.0, 3938.0, 29.833028755291068, 120.23526335262328, 12.585809006138419], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-1time-1zedd", 9022, 0, 0.0, 613.6213699844815, 411, 4749, 549.0, 726.0, 809.0, 2960.3700000000354, 148.76741693461952, 437.58540996784564, 59.12923700428724], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-fulltime-1zedd", 9290, 2, 0.021528525296017224, 599.2064585575887, 413, 29219, 555.0, 720.0, 783.0, 1575.0, 123.05124706941997, 361.8792903194829, 52.513081024742704], "isController": false}, {"data": ["NCPPServerlessWestGFSCorridor10waypoints", 586, 0, 0.0, 9946.747440273033, 3913, 15626, 10024.0, 12200.700000000003, 13065.0, 14630.0, 8.93633244376668, 194.0074282786885, 9.87010936904308], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-halftime-1zedd", 9716, 0, 0.0, 569.9540963359394, 402, 1810, 536.0, 699.0, 748.0, 863.0, 159.46952910860537, 469.0646696046088, 68.0548674027935], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-halftime-1zedd", 8982, 0, 0.0, 623.3925629035841, 405, 3861, 580.0, 750.0, 852.0, 2017.0, 141.96525944775482, 477.7463711493781, 108.96942766204619], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-fulltime-1zedd", 6912, 0, 0.0, 708.1539351851862, 431, 5860, 652.0, 890.0, 1142.0, 1773.0, 120.85183760534322, 406.69475819141866, 92.76322691191383], "isController": false}, {"data": ["NCPPServerlessWestGFSCorridor20waypoints", 780, 780, 100.0, 7313.274358974354, 1849, 29250, 3986.5, 29098.0, 29226.0, 29240.0, 12.549473887440874, 6.301133072690414, 22.62336796505454], "isController": false}, {"data": ["NCPPServerlessWestGFSCollectionMeta", 8198, 0, 0.0, 675.0790436691893, 446, 7979, 562.0, 775.0, 876.0, 6149.0, 135.11330861145447, 1026.9403134013185, 32.32691465801401], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-1time-halfzedd", 3264, 66, 2.0220588235294117, 2051.983455882354, 501, 81668, 766.0, 3187.5, 5045.0, 34600.999999999985, 25.79503066321047, 141.68591658203988, 28.50666324702061], "isController": false}, {"data": ["NCPPServerlessWestNWM-position-1month", 340, 2, 0.5882352941176471, 18913.24705882354, 5234, 29253, 19819.5, 25176.200000000004, 25837.0, 27438.0, 4.493609822502411, 10.94148043792871, 1.5578432490120668], "isController": false}, {"data": ["NCPPServerlessWestGFSTrajectory5waypoints", 2354, 0, 0.0, 2385.5267629566742, 1606, 9567, 2145.0, 2483.0, 3056.0, 7625.0, 37.90660225442834, 154.62488048510465, 25.912716384863124], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-1time-1zedd", 8754, 0, 0.0, 634.3431574137513, 395, 4439, 586.0, 789.0, 879.0, 2510.0, 143.18661367093577, 481.856514365278, 109.90691244663624], "isController": false}, {"data": ["NCPPServerlessWestNWM-position-1hour", 324, 6, 1.8518518518518519, 19587.598765432085, 7702, 29299, 19809.0, 26641.5, 27574.0, 29167.0, 4.39214835701117, 10.586955260072118, 1.522668619862271], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-fulltime-halfzedd", 3206, 0, 0.0, 1745.8303181534586, 1407, 4282, 1718.0, 1937.3000000000002, 2010.2999999999993, 2731.4299999999917, 51.81162933514335, 181.7454810271825, 22.060420302854002], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-1time-1zedd", 3244, 136, 4.192355117139334, 1862.8649815043152, 426, 120480, 690.0, 4124.5, 5287.5, 24536.100000000057, 18.858162666186104, 92.27423087152151, 20.3965831206655], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaHalfGlobe-1time-1zedd", 8868, 0, 0.0, 625.1089309878224, 434, 5012, 596.0, 772.0, 875.0, 1625.0, 144.82859989221149, 1622.3914739878492, 74.39437846025706], "isController": false}, {"data": ["NCPPServerlessWestCollections", 23176, 2, 0.00862961684501208, 238.16292716603178, 151, 29297, 200.0, 302.0, 399.0, 484.0, 384.90027070566157, 12982.8906535445, 62.7718214920366], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-1time-fullzedd", 7362, 0, 0.0, 752.6759032871493, 565, 2564, 741.0, 903.0, 978.8499999999995, 1347.0, 121.00790611285524, 538.9815036921218, 92.29216276771479], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-halftime-1zedd", 9308, 0, 0.0, 595.6635152556938, 420, 3234, 557.5, 741.0, 820.0, 1465.0, 151.9599040047018, 756.6831548046626, 171.5484853803079], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-1time-fullzedd", 7068, 0, 0.0, 784.591114883984, 566, 3750, 762.5, 916.1000000000004, 982.0, 2363.619999999999, 114.4578313253012, 694.5712537650602, 128.65328501506025], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-1time-halfzedd", 7040, 0, 0.0, 786.2312499999994, 504, 8346, 709.0, 1038.9000000000005, 1393.0, 2118.9000000000015, 115.90194432096935, 455.6847928088112, 88.85061161324312], "isController": false}, {"data": ["NCPPServerlessWestGFSTrajectory10waypoints", 1932, 0, 0.0, 2930.815734989645, 2397, 5704, 2894.5, 3197.0, 3412.35, 3851.0, 30.584622203929143, 161.3159614486536, 31.450788262438856], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-halftime-halfzedd", 7030, 0, 0.0, 789.8227596017078, 506, 4231, 722.0, 980.0, 1309.0, 2209.6899999999996, 114.0474684057689, 448.39365996252496, 87.42896747903181], "isController": false}, {"data": ["NCPPServerlessWestGFSInstances", 11602, 0, 0.0, 476.7467677986541, 272, 5138, 400.0, 576.0, 620.0, 1097.7599999999948, 191.17453203269181, 255.95730802423873, 44.99322482410032], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-fulltime-fullzedd", 1764, 30, 1.7006802721088434, 3359.914965986393, 2454, 45687, 3043.0, 3692.5, 4812.5, 9770.0, 16.908212560386474, 67.82487158888314, 7.011840062111801], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-fulltime-1zedd", 9162, 0, 0.0, 604.8450120061093, 407, 5996, 569.0, 748.0, 834.8500000000004, 1755.0, 147.3938223938224, 733.9463870958012, 166.39380731177607], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-1time-halfzedd", 3148, 0, 0.0, 1784.2573062261752, 1422, 8968, 1741.0, 1958.1, 2051.0, 2716.0, 49.11382925611583, 172.28210418746878, 20.911747612955566], "isController": false}, {"data": ["NCPPServerlessWestNWM-position-1day", 350, 4, 1.1428571428571428, 18719.771428571432, 5990, 29316, 18836.0, 25020.0, 27121.0, 29175.0, 4.610844706750276, 11.177413159680139, 1.598486202047215], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-halftime-halfzedd", 3162, 0, 0.0, 1772.0202403542055, 1361, 6466, 1735.0, 1973.7000000000003, 2080.0, 2717.0, 50.00158132768272, 175.39617200101205, 21.28973579967741], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Timeout", 116, 11.284046692607005, 0.06076161542087895], "isController": false}, {"data": ["502/Bad Gateway", 680, 66.147859922179, 0.3561887800534283], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 232, 22.56809338521401, 0.1215232308417579], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 190910, 1028, "502/Bad Gateway", 680, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 232, "504/Gateway Timeout", 116, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-fulltime-1zedd", 9290, 2, "504/Gateway Timeout", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessWestGFSCorridor20waypoints", 780, 780, "502/Bad Gateway", 680, "504/Gateway Timeout", 100, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-1time-halfzedd", 3264, 66, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 66, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessWestNWM-position-1month", 340, 2, "504/Gateway Timeout", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessWestNWM-position-1hour", 324, 6, "504/Gateway Timeout", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-1time-1zedd", 3244, 136, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 136, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessWestCollections", 23176, 2, "504/Gateway Timeout", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-fulltime-fullzedd", 1764, 30, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessWestNWM-position-1day", 350, 4, "504/Gateway Timeout", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
