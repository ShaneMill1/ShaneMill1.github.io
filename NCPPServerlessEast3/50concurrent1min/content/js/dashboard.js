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

    var data = {"OkPercent": 99.75731651909885, "KoPercent": 0.2426834809011425};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7003080639620571, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "NCPPServerlessEastGFSPosition-fulltime-fullzedd"], "isController": false}, {"data": [0.6982456140350877, 500, 1500, "NCPPServerlessEastGFSAreaUS-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSTrajectory20waypoints"], "isController": false}, {"data": [0.9611766462595192, 500, 1500, "NCPPServerlessEastGFSPosition-fulltime-1zedd"], "isController": false}, {"data": [0.06767411300919843, 500, 1500, "NCPPServerlessEastGFSAreaGlobe-1time-1zedd"], "isController": false}, {"data": [0.9975474683544304, 500, 1500, "NCPPServerlessEastCollections"], "isController": false}, {"data": [0.03212121212121212, 500, 1500, "NCPPServerlessEastGFSPosition-fulltime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastNWM-position-1day"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSPosition-1time-fullzedd"], "isController": false}, {"data": [0.2981786133960047, 500, 1500, "NCPPServerlessEastGFSAreaHalfGlobe-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSTrajectory10waypoints"], "isController": false}, {"data": [0.9402985074626866, 500, 1500, "NCPPServerlessEastGFSPosition-halftime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSCorridor20waypoints"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSCorridor5waypoints"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaUS-1time-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaUS-fulltime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaUS-halftime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastNWM-position-1hour"], "isController": false}, {"data": [0.9810267857142857, 500, 1500, "NCPPServerlessEastGFSInstances"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSPosition-halftime-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaTexas-1time-halfzedd"], "isController": false}, {"data": [0.09959349593495935, 500, 1500, "NCPPServerlessEastGFSPosition-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastNWM-position-1month"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaUS-1time-halfzedd"], "isController": false}, {"data": [0.5014263770024139, 500, 1500, "NCPPServerlessEastGFSAreaTexas-halftime-1zedd"], "isController": false}, {"data": [0.9692620081221117, 500, 1500, "NCPPServerlessEastGFSCollectionMeta"], "isController": false}, {"data": [0.3922378199834847, 500, 1500, "NCPPServerlessEastGFSAreaTexas-fulltime-1zedd"], "isController": false}, {"data": [0.9322789943227899, 500, 1500, "NCPPServerlessEastGFSPosition-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSCorridor10waypoints"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaTexas-1time-fullzedd"], "isController": false}, {"data": [0.05611045828437133, 500, 1500, "NCPPServerlessEastGFSPosition-halftime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaTexas-halftime-halfzedd"], "isController": false}, {"data": [0.7655688622754491, 500, 1500, "NCPPServerlessEastGFSAreaTexas-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSTrajectory5waypoints"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 180482, 438, 0.2426834809011425, 1064.2691958200855, 97, 60128, 2793.0, 8064.600000000006, 9970.95, 20958.81000000003, 77.36203858371772, 11100.907385403822, 37.24228728970322], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NCPPServerlessEastGFSPosition-fulltime-fullzedd", 1948, 0, 0.0, 2914.9548254620113, 2548, 8282, 2860.5, 3183.1000000000004, 3240.0, 3415.0, 30.90836969456565, 5957.8297302657675, 13.039468464894883], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-1time-1zedd", 10260, 0, 0.0, 539.80292397661, 420, 16085, 510.0, 645.0, 679.0, 811.8999999999942, 169.25386429997198, 7932.948454176908, 191.07174524489022], "isController": false}, {"data": ["NCPPServerlessEastGFSTrajectory20waypoints", 2170, 0, 0.0, 2636.8092165898656, 2262, 5398, 2542.0, 2948.0, 3232.3499999999995, 4306.0, 34.00188028831087, 261.489069600047, 59.20444585357255], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-fulltime-1zedd", 13394, 0, 0.0, 418.201881439451, 302, 6301, 392.0, 460.0, 532.0, 1372.0, 208.52534562211983, 2925.4639796947004, 88.9898203485023], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-1time-1zedd", 1522, 4, 0.2628120893561104, 3900.6215505913274, 1197, 60128, 2767.0, 5771.200000000001, 7868.699999999994, 40605.0, 16.163461232118774, 32226.737790287854, 8.391096921030554], "isController": false}, {"data": ["NCPPServerlessEastCollections", 37920, 0, 0.0, 145.411497890295, 97, 5340, 134.0, 156.0, 169.0, 265.0, 631.884154571662, 21315.599952508706, 103.05141973971438], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-fulltime-halfzedd", 3300, 0, 0.0, 1691.8884848484847, 1420, 4680, 1653.0, 1853.9, 1981.0, 2713.0, 53.417074039302015, 5510.878860091781, 22.743988555796562], "isController": false}, {"data": ["NCPPServerlessEastNWM-position-1day", 884, 2, 0.22624434389140272, 6634.113122171958, 5807, 29311, 6495.5, 6978.0, 7259.25, 9014.099999999991, 12.969483568075116, 55.66767303036972, 4.496256510416667], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-1time-fullzedd", 2006, 0, 0.0, 2823.9850448654015, 2379, 3865, 2790.0, 3096.0, 3182.6499999999996, 3594.9500000000007, 31.911170500461328, 176.29051906358373, 13.462525054882123], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-1time-1zedd", 3404, 2, 0.05875440658049354, 1662.9905992949425, 838, 40569, 1352.0, 2467.5, 2808.75, 4586.099999999982, 35.43323479202232, 31194.66452148478, 18.190362230399302], "isController": false}, {"data": ["NCPPServerlessEastGFSTrajectory10waypoints", 1996, 0, 0.0, 2835.7074148296574, 2476, 8546, 2785.0, 3094.0, 3252.0, 3614.0, 31.3663864225662, 165.56183458395537, 32.25469228804903], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-halftime-1zedd", 13132, 0, 0.0, 420.9843131282356, 315, 2379, 400.0, 519.0, 550.0, 606.0, 217.24097999966915, 1853.3371106221775, 92.70928541001506], "isController": false}, {"data": ["NCPPServerlessEastGFSCorridor20waypoints", 394, 394, 100.0, 7070.230964467005, 1624, 29199, 3798.5, 29041.0, 29060.25, 29070.3, 6.487839417741112, 3.2574917872844935, 11.695851137841888], "isController": false}, {"data": ["NCPPServerlessEastGFSCorridor5waypoints", 906, 2, 0.22075055187637968, 6397.423841059597, 3637, 29159, 6015.0, 8335.700000000003, 9886.0, 11568.0, 13.954133103331435, 199.37493502317986, 10.451972744389852], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-1time-fullzedd", 970, 0, 0.0, 5966.317525773198, 4586, 26956, 5587.0, 7375.0, 8464.099999999997, 9820.0, 12.704483241869786, 21982.664125838233, 14.280136925187621], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-fulltime-1zedd", 636, 14, 2.20125786163522, 10125.41823899372, 2507, 56599, 8035.0, 19144.0, 24083.0, 54510.31999999998, 6.2853923923033586, 33205.10038036013, 6.939425889689387], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-halftime-1zedd", 632, 0, 0.0, 9279.180379746836, 2302, 13279, 9805.5, 11189.0, 11954.0, 12673.359999999995, 9.577208667979995, 26088.999161804823, 10.811770722836794], "isController": false}, {"data": ["NCPPServerlessEastNWM-position-1hour", 538, 0, 0.0, 12275.007434944244, 5977, 26181, 10545.0, 21361.0, 23620.84999999999, 25389.0, 7.109349190617773, 17.412351337958377, 2.4646669557317478], "isController": false}, {"data": ["NCPPServerlessEastGFSInstances", 15232, 0, 0.0, 362.7205882352942, 239, 4777, 321.0, 363.0, 384.0, 881.6700000000001, 250.63761867934775, 335.5704836029158, 58.987955177463675], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-halftime-fullzedd", 1950, 0, 0.0, 2894.043076923071, 2500, 5449, 2856.0, 3164.0, 3262.0, 3472.0, 30.990750452941736, 3071.6857590051973, 13.074222847334797], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-1time-halfzedd", 2128, 0, 0.0, 2652.0469924812014, 2165, 7520, 2591.0, 2935.2000000000003, 3037.1, 3510.0, 34.0153452685422, 2628.3165660965474, 26.076216831841432], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-1time-halfzedd", 3444, 0, 0.0, 1626.614982578399, 1349, 3854, 1596.0, 1781.0, 1848.75, 2595.750000000001, 55.688506564905246, 239.993534639577, 23.711121935838563], "isController": false}, {"data": ["NCPPServerlessEastNWM-position-1month", 800, 0, 0.0, 7360.557500000002, 6653, 15189, 7225.0, 7853.4, 8180.549999999999, 9833.800000000001, 11.89113664402396, 649.2514157884567, 4.122415535770025], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-1time-halfzedd", 1910, 0, 0.0, 2953.9518324607316, 2395, 4369, 2907.0, 3315.0, 3445.0, 3883.0, 30.10861169349118, 26700.134551553117, 33.96039697849835], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-halftime-1zedd", 9114, 0, 0.0, 608.0737327188946, 474, 2578, 588.0, 715.0, 753.0, 818.0, 150.23242013648502, 34930.50479521066, 115.31511936257542], "isController": false}, {"data": ["NCPPServerlessEastGFSCollectionMeta", 14282, 0, 0.0, 387.0630163842604, 273, 9506, 328.0, 378.0, 582.8499999999985, 696.3400000000001, 233.50336799424497, 1774.762415135946, 55.86750503768557], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-fulltime-1zedd", 4844, 0, 0.0, 1157.2213047068512, 536, 9339, 980.0, 1887.5, 2182.75, 3087.300000000001, 78.83088139565162, 36129.948162470704, 60.50886013377164], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-1time-1zedd", 12330, 0, 0.0, 448.75166261151634, 319, 6460, 399.0, 524.0, 557.0, 1499.0, 200.90922422642615, 613.9110962934448, 79.85356861343305], "isController": false}, {"data": ["NCPPServerlessEastGFSCorridor10waypoints", 716, 0, 0.0, 8202.997206703916, 3692, 12813, 8234.0, 9592.0, 10066.0, 11280.0, 10.828796128251664, 235.10331594071383, 11.960320723684209], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-1time-fullzedd", 1126, 0, 0.0, 5135.495559502664, 4153, 6133, 5193.0, 5397.3, 5453.65, 5911.0, 17.248246070892435, 2550.685451675041, 13.155156427116204], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-halftime-halfzedd", 3404, 0, 0.0, 1644.67508813161, 1394, 3138, 1617.5, 1802.5, 1874.75, 2498.2499999999973, 55.20328235732935, 2965.720871409922, 23.504522566206642], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-halftime-halfzedd", 694, 20, 2.881844380403458, 9011.527377521621, 4215, 53422, 7633.0, 12768.0, 19371.0, 37986.299999999675, 6.470922805807048, 29966.083891225095, 4.817662198482037], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-1time-1zedd", 10020, 0, 0.0, 557.0381237524944, 398, 25001, 497.0, 635.0, 672.0, 2929.069999999969, 120.57181363111283, 834.9362602131065, 92.54828663481902], "isController": false}, {"data": ["NCPPServerlessEastGFSTrajectory5waypoints", 2476, 0, 0.0, 2265.12197092084, 1781, 7727, 2030.0, 2308.0, 2800.0, 7182.76, 39.764241090786456, 162.1635456983635, 27.1825866831548], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Timeout", 54, 12.32876712328767, 0.02991988120699017], "isController": false}, {"data": ["502/Bad Gateway", 344, 78.53881278538813, 0.19060072472601144], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 40, 9.132420091324201, 0.02216287496814087], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 180482, 438, "502/Bad Gateway", 344, "504/Gateway Timeout", 54, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 40, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-1time-1zedd", 1522, 4, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastNWM-position-1day", 884, 2, "504/Gateway Timeout", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-1time-1zedd", 3404, 2, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSCorridor20waypoints", 394, 394, "502/Bad Gateway", 344, "504/Gateway Timeout", 50, "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessEastGFSCorridor5waypoints", 906, 2, "504/Gateway Timeout", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-fulltime-1zedd", 636, 14, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-halftime-halfzedd", 694, 20, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
