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

    var data = {"OkPercent": 99.55688430943356, "KoPercent": 0.4431156905664407};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6877636004484544, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "NCPPServerlessEastGFSPosition-fulltime-fullzedd"], "isController": false}, {"data": [0.3842239185750636, 500, 1500, "NCPPServerlessEastGFSAreaUS-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSTrajectory20waypoints"], "isController": false}, {"data": [0.4945054945054945, 500, 1500, "NCPPServerlessEastGFSPosition-fulltime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaGlobe-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastCollections"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSPosition-fulltime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastNWM-position-1day"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSPosition-1time-fullzedd"], "isController": false}, {"data": [0.013333333333333334, 500, 1500, "NCPPServerlessEastGFSAreaHalfGlobe-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSTrajectory10waypoints"], "isController": false}, {"data": [0.47921225382932164, 500, 1500, "NCPPServerlessEastGFSPosition-halftime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSCorridor20waypoints"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSCorridor5waypoints"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaUS-1time-fullzedd"], "isController": false}, {"data": [0.9998236953455572, 500, 1500, "NCPPServerlessEastRoot"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaUS-fulltime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaUS-halftime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastNWM-position-1hour"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSInstances"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSPosition-halftime-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaTexas-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSPosition-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastNWM-position-1month"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaUS-1time-halfzedd"], "isController": false}, {"data": [0.30423280423280424, 500, 1500, "NCPPServerlessEastGFSAreaTexas-halftime-1zedd"], "isController": false}, {"data": [0.4929278642149929, 500, 1500, "NCPPServerlessEastGFSCollectionMeta"], "isController": false}, {"data": [0.23035230352303523, 500, 1500, "NCPPServerlessEastGFSAreaTexas-fulltime-1zedd"], "isController": false}, {"data": [0.4737442922374429, 500, 1500, "NCPPServerlessEastGFSPosition-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSCorridor10waypoints"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaTexas-1time-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSPosition-halftime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaTexas-halftime-halfzedd"], "isController": false}, {"data": [0.45689655172413796, 500, 1500, "NCPPServerlessEastGFSAreaTexas-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSTrajectory5waypoints"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 18731, 83, 0.4431156905664407, 1086.3284928727765, 36, 33393, 53.0, 3057.7999999999993, 3602.399999999998, 10799.520000000004, 8.269395730606034, 1481.6692817393134, 2.8275405091289607], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NCPPServerlessEastGFSPosition-fulltime-fullzedd", 162, 0, 0.0, 3524.8703703703704, 3098, 4164, 3519.0, 3816.5000000000005, 3917.1, 4136.280000000001, 2.5569796072984405, 492.87779570995644, 1.0787257718290295], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-1time-1zedd", 393, 0, 0.0, 1429.1145038167951, 1023, 2616, 1405.0, 1594.0, 1657.2999999999995, 1989.060000000001, 6.425243194637456, 301.15190149084447, 7.253497200196191], "isController": false}, {"data": ["NCPPServerlessEastGFSTrajectory20waypoints", 174, 0, 0.0, 3253.649425287355, 2765, 6692, 3074.0, 3621.5, 5312.25, 6410.75, 2.8067685061216587, 21.58525584541803, 4.887176021889568], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-fulltime-1zedd", 455, 0, 0.0, 1229.3802197802197, 803, 2350, 1212.0, 1362.2, 1396.6, 1603.0, 7.479493038318019, 104.93202830905923, 3.191932087641576], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-1time-1zedd", 239, 0, 0.0, 2375.9790794979076, 1554, 5374, 2305.0, 3030.0, 3235.0, 3858.399999999997, 3.818013355059267, 7632.3913946681605, 1.987305779537685], "isController": false}, {"data": ["NCPPServerlessEastCollections", 30, 0, 0.0, 23057.03333333333, 21029, 26085, 22377.0, 25793.8, 25955.75, 26085.0, 0.3824335521703104, 12.900783391229526, 0.06236953438715024], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-fulltime-halfzedd", 243, 0, 0.0, 2339.8930041152266, 1916, 3700, 2297.0, 2598.4, 2724.5999999999995, 3454.640000000001, 3.9174592938900528, 404.1524923676044, 1.6679807149766241], "isController": false}, {"data": ["NCPPServerlessEastNWM-position-1day", 57, 0, 0.0, 10292.561403508773, 8749, 11541, 10274.0, 11160.6, 11414.3, 11541.0, 0.8491240614944583, 3.6518968425992133, 0.2943740642876296], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-1time-fullzedd", 173, 0, 0.0, 3275.508670520232, 2859, 4201, 3222.0, 3623.0, 3733.899999999999, 4141.799999999999, 2.756313231896758, 15.227015578945272, 1.1628196447064447], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-1time-1zedd", 300, 0, 0.0, 1895.7733333333326, 1307, 5406, 1776.0, 1969.0, 2324.2499999999995, 5291.82, 4.7762334622916365, 4207.357936905956, 2.453416798013087], "isController": false}, {"data": ["NCPPServerlessEastGFSTrajectory10waypoints", 174, 0, 0.0, 3298.77011494253, 2917, 4204, 3273.0, 3566.0, 3788.5, 4080.25, 2.7487283182205933, 14.508668515607722, 2.8265731631702], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-halftime-1zedd", 457, 0, 0.0, 1227.3698030634566, 687, 2282, 1208.0, 1395.2, 1461.599999999999, 1955.0600000000006, 7.514469876348329, 64.10782113259668, 3.2068587265275585], "isController": false}, {"data": ["NCPPServerlessEastGFSCorridor20waypoints", 34, 34, 100.0, 20116.79411764706, 10946, 26698, 21189.5, 24412.0, 25999.75, 26698.0, 0.4452476362588722, 0.22305863027422018, 0.8026632192713654], "isController": false}, {"data": ["NCPPServerlessEastGFSCorridor5waypoints", 22, 20, 90.9090909090909, 29258.68181818182, 28433, 30276, 29143.0, 30044.3, 30265.95, 30276.0, 0.25015350328610736, 0.4415440298592318, 0.1873708369340277], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-1time-fullzedd", 102, 0, 0.0, 5773.098039215688, 5212, 6566, 5743.5, 6271.1, 6390.4, 6565.22, 1.5385079489577362, 2662.0920231850887, 1.7293189934085493], "isController": false}, {"data": ["NCPPServerlessEastRoot", 11344, 0, 0.0, 48.79407616361095, 36, 1340, 47.0, 56.0, 60.0, 83.0, 189.08557522418909, 302.46305880588056, 28.621351718505185], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-fulltime-1zedd", 150, 0, 0.0, 3790.026666666668, 2859, 6620, 3635.0, 4334.3, 4928.3, 6342.560000000005, 2.399616061430171, 12962.107312829947, 2.7089415693489043], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-halftime-1zedd", 244, 0, 0.0, 2325.7131147541, 1786, 2944, 2323.5, 2632.0, 2723.0, 2893.3000000000006, 3.9203084832904884, 10679.199783599775, 4.425660748714653], "isController": false}, {"data": ["NCPPServerlessEastNWM-position-1hour", 54, 0, 0.0, 11239.35185185185, 9741, 14488, 10809.5, 13850.0, 14411.5, 14488.0, 0.7816118573413617, 1.9143384162227886, 0.2709689544493979], "isController": false}, {"data": ["NCPPServerlessEastGFSInstances", 190, 0, 0.0, 2998.2000000000007, 2365, 5789, 2779.0, 3236.7, 5554.7, 5754.42, 3.0295299445117676, 2.6330875494291726, 0.7130046060813827], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-halftime-fullzedd", 167, 0, 0.0, 3436.3113772455085, 2967, 4505, 3377.0, 3814.2000000000003, 3860.0, 4455.36, 2.6461314192454566, 262.27451991827894, 1.1163366924941769], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-1time-halfzedd", 170, 0, 0.0, 3353.5058823529407, 2815, 4894, 3267.5, 3763.6, 4129.399999999998, 4619.939999999997, 2.6972567312421662, 208.4131292442128, 2.067721224633887], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-1time-halfzedd", 259, 0, 0.0, 2188.76447876448, 1828, 3124, 2183.0, 2385.0, 2445.0, 2678.9999999999977, 4.17418772563177, 17.988955501184567, 1.7772908675541517], "isController": false}, {"data": ["NCPPServerlessEastNWM-position-1month", 55, 0, 0.0, 11142.963636363636, 9986, 17154, 10902.0, 12059.0, 13513.599999999995, 17154.0, 0.7841571736123982, 42.814675367841005, 0.27185136389882947], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-1time-halfzedd", 167, 0, 0.0, 3446.329341317366, 2948, 5833, 3375.0, 3773.6000000000004, 3923.6, 5186.319999999993, 2.6366894548210364, 2338.200244204612, 2.974000312810837], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-halftime-1zedd", 378, 0, 0.0, 1487.41798941799, 1014, 2542, 1474.0, 1638.2, 1712.25, 2354.3499999999995, 6.17324274888947, 1435.3392246905214, 4.738446094362425], "isController": false}, {"data": ["NCPPServerlessEastGFSCollectionMeta", 707, 0, 0.0, 789.6930693069307, 486, 7491, 687.0, 791.8000000000002, 992.6, 6294.0, 11.631733078872035, 88.40798686802837, 2.782983012034813], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-fulltime-1zedd", 369, 0, 0.0, 1518.8536585365857, 1182, 2059, 1510.0, 1670.0, 1731.5, 1901.8000000000006, 6.0406639819271195, 2768.5708020761713, 4.636681533002652], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-1time-1zedd", 438, 0, 0.0, 1274.1232876712327, 817, 4329, 1204.0, 1399.0, 1513.2499999999998, 3865.9400000000005, 7.218312760592626, 22.056738894428054, 2.8689973569933582], "isController": false}, {"data": ["NCPPServerlessEastGFSCorridor10waypoints", 26, 26, 100.0, 23996.384615384613, 4768, 33393, 29159.0, 31508.9, 32800.45, 33393.0, 0.37647876514965034, 0.4011399342610156, 0.31985988835956614], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-1time-fullzedd", 105, 0, 0.0, 5609.733333333333, 4847, 8417, 5515.0, 6131.400000000001, 6824.799999999994, 8395.82, 1.6052591346888854, 237.38710035736128, 1.2243236173750192], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-halftime-halfzedd", 249, 0, 0.0, 2256.867469879517, 1911, 3246, 2245.0, 2462.0, 2551.0, 2760.5, 4.042535920123386, 217.17971540405065, 1.7212359972400357], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-halftime-halfzedd", 79, 0, 0.0, 7266.151898734178, 4742, 16455, 6693.0, 9744.0, 10619.0, 16455.0, 1.2172010538804061, 5803.871378249079, 0.933108229781366], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-1time-1zedd", 406, 0, 0.0, 1385.5714285714275, 874, 4299, 1307.0, 1493.6, 1553.3999999999996, 4103.41, 6.642778841276853, 45.99994605809977, 5.098851727776959], "isController": false}, {"data": ["NCPPServerlessEastGFSTrajectory5waypoints", 159, 3, 1.8867924528301887, 3599.5660377358486, 2145, 29117, 2511.0, 3098.0, 8859.0, 29115.8, 2.5236893481262794, 10.122006838960049, 1.725178265320699], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Timeout", 43, 51.80722891566265, 0.2295659601729753], "isController": false}, {"data": ["502/Bad Gateway", 34, 40.963855421686745, 0.18151727083444558], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 6, 7.228915662650603, 0.03203245955901981], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 18731, 83, "504/Gateway Timeout", 43, "502/Bad Gateway", 34, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 6, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSCorridor20waypoints", 34, 34, "502/Bad Gateway", 34, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessEastGFSCorridor5waypoints", 22, 20, "504/Gateway Timeout", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSCorridor10waypoints", 26, 26, "504/Gateway Timeout", 20, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 6, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSTrajectory5waypoints", 159, 3, "504/Gateway Timeout", 3, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
