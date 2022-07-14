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

    var data = {"OkPercent": 96.18583517170985, "KoPercent": 3.8141648282901452};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9610856848089735, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9996538921402052, 500, 1500, "NCPPServerlessWestGFSPosition-1time-fullzedd"], "isController": false}, {"data": [0.9992751288659794, 500, 1500, "NCPPServerlessWestGFSTrajectory20waypoints"], "isController": false}, {"data": [0.9972693032015066, 500, 1500, "NCPPServerlessWestGFSCorridor5waypoints"], "isController": false}, {"data": [0.9971025690554375, 500, 1500, "NCPPServerlessWestGFSAreaGlobe-1time-1zedd"], "isController": false}, {"data": [0.999602994555354, 500, 1500, "NCPPServerlessWestGFSPosition-halftime-fullzedd"], "isController": false}, {"data": [0.9997674899245634, 500, 1500, "NCPPServerlessWestGFSPosition-1time-1zedd"], "isController": false}, {"data": [0.9999509274708018, 500, 1500, "NCPPServerlessWestGFSPosition-fulltime-1zedd"], "isController": false}, {"data": [0.989577905158937, 500, 1500, "NCPPServerlessWestGFSCorridor10waypoints"], "isController": false}, {"data": [0.9992879521503845, 500, 1500, "NCPPServerlessWestGFSPosition-halftime-1zedd"], "isController": false}, {"data": [0.9999776925136076, 500, 1500, "NCPPServerlessWestGFSAreaTexas-halftime-1zedd"], "isController": false}, {"data": [0.9999759869368937, 500, 1500, "NCPPServerlessWestGFSAreaTexas-fulltime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSCorridor20waypoints"], "isController": false}, {"data": [0.9995662781241529, 500, 1500, "NCPPServerlessWestGFSCollectionMeta"], "isController": false}, {"data": [0.99997534273597, 500, 1500, "NCPPServerlessWestGFSAreaUS-1time-halfzedd"], "isController": false}, {"data": [0.9996472129825622, 500, 1500, "NCPPServerlessWestNWM-position-1month"], "isController": false}, {"data": [0.9978378378378379, 500, 1500, "NCPPServerlessWestGFSTrajectory5waypoints"], "isController": false}, {"data": [0.9989763837098778, 500, 1500, "NCPPServerlessWestGFSAreaTexas-1time-1zedd"], "isController": false}, {"data": [0.9994464740396325, 500, 1500, "NCPPServerlessWestNWM-position-1hour"], "isController": false}, {"data": [0.999579674948627, 500, 1500, "NCPPServerlessWestGFSPosition-fulltime-halfzedd"], "isController": false}, {"data": [0.9999750287169755, 500, 1500, "NCPPServerlessWestGFSAreaUS-1time-1zedd"], "isController": false}, {"data": [0.9983489746263469, 500, 1500, "NCPPServerlessWestGFSAreaHalfGlobe-1time-1zedd"], "isController": false}, {"data": [0.9984144601236721, 500, 1500, "NCPPServerlessWestCollections"], "isController": false}, {"data": [0.9997973246858533, 500, 1500, "NCPPServerlessWestGFSAreaTexas-1time-fullzedd"], "isController": false}, {"data": [0.9922366352201258, 500, 1500, "NCPPServerlessWestGFSAreaUS-halftime-1zedd"], "isController": false}, {"data": [0.9996624409271623, 500, 1500, "NCPPServerlessWestGFSAreaUS-1time-fullzedd"], "isController": false}, {"data": [0.9996506346803308, 500, 1500, "NCPPServerlessWestGFSAreaTexas-1time-halfzedd"], "isController": false}, {"data": [0.9986055159590951, 500, 1500, "NCPPServerlessWestGFSTrajectory10waypoints"], "isController": false}, {"data": [0.999977136586035, 500, 1500, "NCPPServerlessWestGFSAreaTexas-halftime-halfzedd"], "isController": false}, {"data": [0.9995563723936878, 500, 1500, "NCPPServerlessWestGFSInstances"], "isController": false}, {"data": [0.9981101068200493, 500, 1500, "NCPPServerlessWestGFSPosition-fulltime-fullzedd"], "isController": false}, {"data": [0.9857355494914414, 500, 1500, "NCPPServerlessWestGFSAreaUS-fulltime-1zedd"], "isController": false}, {"data": [0.9998096325909004, 500, 1500, "NCPPServerlessWestGFSPosition-1time-halfzedd"], "isController": false}, {"data": [0.9997053334642962, 500, 1500, "NCPPServerlessWestNWM-position-1day"], "isController": false}, {"data": [0.9998794236450232, 500, 1500, "NCPPServerlessWestGFSPosition-halftime-halfzedd"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 911130, 34752, 3.8141648282901452, 41.291407373261094, 14, 27334, 24.0, 30.0, 35.0, 52.0, 445.6953004198526, 2123.1261277988947, 289.87336031011273], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NCPPServerlessWestGFSPosition-1time-fullzedd", 31782, 0, 0.0, 34.78132276131138, 16, 4105, 27.0, 52.0, 66.95000000000073, 119.0, 525.1053283767038, 2166.497799204874, 212.81124148079306], "isController": false}, {"data": ["NCPPServerlessWestGFSTrajectory20waypoints", 12416, 0, 0.0, 89.20457474226781, 20, 3028, 106.0, 133.0, 139.0, 190.65999999999985, 206.5752695328098, 1608.1757115790963, 356.2616464794356], "isController": false}, {"data": ["NCPPServerlessWestGFSCorridor5waypoints", 10620, 0, 0.0, 104.50659133709937, 23, 9577, 75.0, 116.0, 194.0, 397.0, 175.8802292073797, 2536.4927280687953, 128.8185272514988], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaGlobe-1time-1zedd", 10354, 0, 0.0, 107.12594166505679, 21, 3475, 84.0, 183.0, 278.0, 446.0, 172.41436730887716, 2803.558484276389, 86.88067727673888], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-halftime-fullzedd", 35264, 0, 0.0, 31.415154264972706, 18, 3595, 26.0, 58.0, 83.0, 109.0, 586.8530537527042, 2421.256266641704, 237.83595440173073], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-1time-1zedd", 38708, 0, 0.0, 28.595432468740373, 14, 4116, 26.0, 40.0, 45.0, 58.0, 644.6176392219558, 1957.6819338799794, 245.50867118804956], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-fulltime-1zedd", 20378, 0, 0.0, 54.352144469526024, 17, 1073, 56.0, 81.0, 89.0, 107.0, 339.3731472537721, 1030.6831819563336, 139.19601742830497], "isController": false}, {"data": ["NCPPServerlessWestGFSCorridor10waypoints", 7676, 0, 0.0, 144.62115685252778, 28, 4259, 111.0, 218.0, 382.0, 661.4599999999991, 127.43421598738274, 2778.765914231759, 138.6344888768988], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-halftime-1zedd", 28088, 0, 0.0, 39.25391626317269, 14, 1008, 28.0, 57.0, 79.0, 170.9800000000032, 468.4846968559753, 1422.803723886665, 192.15192644483363], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-halftime-1zedd", 44828, 0, 0.0, 24.649906308557068, 17, 585, 24.0, 28.0, 31.0, 48.0, 746.8470419672459, 2584.7165813000847, 560.8646242898556], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-fulltime-1zedd", 41644, 0, 0.0, 26.543463644222395, 17, 1012, 25.0, 32.0, 36.0, 54.0, 693.9625722808246, 2401.6924479557233, 521.1496270351114], "isController": false}, {"data": ["NCPPServerlessWestGFSCorridor20waypoints", 34752, 34752, 100.0, 31.656307550644485, 17, 7452, 24.0, 30.0, 35.0, 52.0, 579.0262921123664, 345.49615584074775, 1034.2178596421074], "isController": false}, {"data": ["NCPPServerlessWestGFSCollectionMeta", 36890, 0, 0.0, 30.02423420981277, 18, 8215, 26.0, 32.0, 35.0, 45.0, 614.5772594752187, 4729.869455435235, 136.83946793002914], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-1time-halfzedd", 40556, 0, 0.0, 27.165105039944606, 18, 730, 26.0, 31.0, 36.0, 68.0, 675.53926875989, 3811.058718351795, 750.7457889147997], "isController": false}, {"data": ["NCPPServerlessWestNWM-position-1month", 39684, 0, 0.0, 27.846487249269096, 14, 6590, 24.0, 32.0, 35.0, 50.0, 661.1245314452312, 1680.4747696272386, 218.22274573094543], "isController": false}, {"data": ["NCPPServerlessWestGFSTrajectory5waypoints", 22200, 0, 0.0, 49.85378378378372, 18, 7888, 36.0, 59.0, 68.0, 249.9800000000032, 369.74733931813256, 1543.546382628121, 246.61858667410604], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-1time-1zedd", 27354, 0, 0.0, 40.36894055713975, 15, 4961, 28.0, 68.0, 90.0, 168.9900000000016, 455.73289793742293, 1577.1886245876512, 342.2447251112092], "isController": false}, {"data": ["NCPPServerlessWestNWM-position-1hour", 36132, 0, 0.0, 30.598472268349187, 17, 9938, 24.0, 32.0, 36.0, 56.9900000000016, 601.868972065364, 1529.8678500262356, 198.66378179501274], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-fulltime-halfzedd", 21412, 0, 0.0, 51.73584905660372, 16, 2265, 41.0, 83.0, 93.0, 132.0, 355.7578879159952, 1281.9533742232543, 145.56890140312692], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-1time-1zedd", 40046, 0, 0.0, 27.46521500274689, 19, 574, 26.0, 31.0, 34.0, 49.9900000000016, 667.1886974775916, 3386.0437370880677, 742.1171156513445], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaHalfGlobe-1time-1zedd", 11508, 0, 0.0, 96.4410844629819, 23, 1439, 76.0, 145.0, 212.0, 415.0, 191.38851469340918, 2162.2540184436793, 95.13354880756374], "isController": false}, {"data": ["NCPPServerlessWestCollections", 12614, 0, 0.0, 87.90550182337111, 24, 27334, 46.0, 63.0, 67.0, 79.0, 210.48942880504615, 7120.619800966176, 30.83341242261418], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-1time-fullzedd", 19736, 0, 0.0, 56.0921159302799, 19, 1115, 56.0, 90.0, 101.0, 141.0, 328.85660012663715, 1496.2128953764955, 245.35785400073314], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-halftime-1zedd", 10176, 0, 0.0, 109.11438679245248, 22, 2052, 75.0, 229.0, 337.0, 595.0, 168.6555290373906, 855.9415903751492, 187.59633552108195], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-1time-fullzedd", 26662, 0, 0.0, 41.53521866326591, 18, 1134, 28.0, 84.0, 96.0, 266.9800000000032, 442.64771802832337, 2728.444644131954, 490.19776586339714], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-1time-halfzedd", 17174, 0, 0.0, 64.63712588797036, 18, 850, 64.0, 92.0, 104.0, 165.0, 283.7645814745051, 1142.7861782182513, 212.82343610587887], "isController": false}, {"data": ["NCPPServerlessWestGFSTrajectory10waypoints", 19362, 0, 0.0, 57.13263092655733, 19, 3241, 49.0, 77.0, 88.0, 318.0, 322.44741619065064, 1731.5154561218712, 326.2260968491349], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-halftime-halfzedd", 43738, 0, 0.0, 25.27207462618303, 17, 804, 24.0, 30.0, 33.0, 48.0, 728.6509179355612, 2934.456071639789, 546.4881884516709], "isController": false}, {"data": ["NCPPServerlessWestGFSInstances", 31558, 0, 0.0, 35.07560681919015, 15, 6258, 25.0, 42.0, 47.0, 58.0, 525.8089239894699, 507.26006156486386, 115.02070212269652], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-fulltime-fullzedd", 24340, 0, 0.0, 45.50632703368933, 14, 3282, 29.0, 78.0, 109.0, 233.0, 402.5402705652764, 1660.8160022264578, 163.1388791841696], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-fulltime-1zedd", 8062, 0, 0.0, 137.78640535847242, 22, 5255, 83.0, 298.39999999999964, 379.0, 952.5499999999984, 133.88245844196823, 679.4679814255111, 148.9180860990252], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-1time-halfzedd", 31518, 0, 0.0, 35.10628847008068, 17, 2681, 33.0, 44.0, 49.0, 63.0, 525.1599573447081, 1892.3593031441617, 214.884787233821], "isController": false}, {"data": ["NCPPServerlessWestNWM-position-1day", 40724, 0, 0.0, 27.138640605048682, 17, 5356, 25.0, 32.0, 37.0, 52.0, 678.2924432452239, 1724.1156204196438, 223.88949786805242], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-halftime-halfzedd", 33174, 0, 0.0, 33.26713691445109, 15, 2129, 26.0, 47.0, 57.0, 84.0, 552.7802309499609, 1991.8893549626748, 226.18644215628282], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 34752, 100.0, 3.8141648282901452], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 911130, 34752, "502/Bad Gateway", 34752, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessWestGFSCorridor20waypoints", 34752, 34752, "502/Bad Gateway", 34752, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
