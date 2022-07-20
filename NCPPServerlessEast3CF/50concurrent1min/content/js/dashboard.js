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

    var data = {"OkPercent": 97.6612413918636, "KoPercent": 2.3387586081363954};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9696637138609957, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9439316710290674, 500, 1500, "NCPPServerlessEastGFSPosition-fulltime-fullzedd"], "isController": false}, {"data": [0.9976309125071481, 500, 1500, "NCPPServerlessEastGFSAreaUS-1time-1zedd"], "isController": false}, {"data": [0.9971783617397253, 500, 1500, "NCPPServerlessEastGFSTrajectory20waypoints"], "isController": false}, {"data": [0.9999771814530851, 500, 1500, "NCPPServerlessEastGFSPosition-fulltime-1zedd"], "isController": false}, {"data": [0.3314663951120163, 500, 1500, "NCPPServerlessEastGFSAreaGlobe-1time-1zedd"], "isController": false}, {"data": [0.9996138276339619, 500, 1500, "NCPPServerlessEastCollections"], "isController": false}, {"data": [0.9946269678302533, 500, 1500, "NCPPServerlessEastGFSPosition-fulltime-halfzedd"], "isController": false}, {"data": [0.9996293389150532, 500, 1500, "NCPPServerlessEastNWM-position-1day"], "isController": false}, {"data": [0.9998145591659283, 500, 1500, "NCPPServerlessEastGFSPosition-1time-fullzedd"], "isController": false}, {"data": [0.6416075650118204, 500, 1500, "NCPPServerlessEastGFSAreaHalfGlobe-1time-1zedd"], "isController": false}, {"data": [0.9997483305929331, 500, 1500, "NCPPServerlessEastGFSTrajectory10waypoints"], "isController": false}, {"data": [0.999987536145179, 500, 1500, "NCPPServerlessEastGFSPosition-halftime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSCorridor20waypoints"], "isController": false}, {"data": [0.9987174554315762, 500, 1500, "NCPPServerlessEastGFSCorridor5waypoints"], "isController": false}, {"data": [0.3081570996978852, 500, 1500, "NCPPServerlessEastGFSAreaUS-1time-fullzedd"], "isController": false}, {"data": [0.09344660194174757, 500, 1500, "NCPPServerlessEastGFSAreaUS-fulltime-1zedd"], "isController": false}, {"data": [0.24113475177304963, 500, 1500, "NCPPServerlessEastGFSAreaUS-halftime-1zedd"], "isController": false}, {"data": [0.999397387070337, 500, 1500, "NCPPServerlessEastNWM-position-1hour"], "isController": false}, {"data": [0.9997599121964604, 500, 1500, "NCPPServerlessEastGFSInstances"], "isController": false}, {"data": [0.9910511553359156, 500, 1500, "NCPPServerlessEastGFSPosition-halftime-fullzedd"], "isController": false}, {"data": [0.9882861833796414, 500, 1500, "NCPPServerlessEastGFSAreaTexas-1time-halfzedd"], "isController": false}, {"data": [0.9998591053187742, 500, 1500, "NCPPServerlessEastGFSPosition-1time-halfzedd"], "isController": false}, {"data": [0.997747183979975, 500, 1500, "NCPPServerlessEastNWM-position-1month"], "isController": false}, {"data": [0.25312294543063774, 500, 1500, "NCPPServerlessEastGFSAreaUS-1time-halfzedd"], "isController": false}, {"data": [0.8362965447836297, 500, 1500, "NCPPServerlessEastGFSAreaTexas-halftime-1zedd"], "isController": false}, {"data": [0.9995983461311282, 500, 1500, "NCPPServerlessEastGFSCollectionMeta"], "isController": false}, {"data": [0.48426435877262, 500, 1500, "NCPPServerlessEastGFSAreaTexas-fulltime-1zedd"], "isController": false}, {"data": [0.9997151424287856, 500, 1500, "NCPPServerlessEastGFSPosition-1time-1zedd"], "isController": false}, {"data": [0.9982324008607439, 500, 1500, "NCPPServerlessEastGFSCorridor10waypoints"], "isController": false}, {"data": [0.8275981925616962, 500, 1500, "NCPPServerlessEastGFSAreaTexas-1time-fullzedd"], "isController": false}, {"data": [0.9952146873719883, 500, 1500, "NCPPServerlessEastGFSPosition-halftime-halfzedd"], "isController": false}, {"data": [0.07758620689655173, 500, 1500, "NCPPServerlessEastGFSAreaTexas-halftime-halfzedd"], "isController": false}, {"data": [0.9996996025510676, 500, 1500, "NCPPServerlessEastGFSAreaTexas-1time-1zedd"], "isController": false}, {"data": [0.99924232092255, 500, 1500, "NCPPServerlessEastGFSTrajectory5waypoints"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2637040, 61674, 2.3387586081363954, 73.16930118617512, 16, 82240, 67.0, 73.0, 80.0, 4189.350000005867, 1097.5662036314448, 27887.65128391473, 585.9756036691639], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NCPPServerlessEastGFSPosition-fulltime-fullzedd", 14518, 0, 0.0, 380.5367130458753, 33, 4601, 375.0, 510.0, 598.0, 848.0, 240.60324825986078, 46401.13652842227, 97.51010549593967], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-1time-1zedd", 48964, 0, 0.0, 112.456212727718, 28, 2970, 119.0, 134.0, 143.0, 249.9600000000064, 814.3023449193414, 38244.25320659405, 905.7523152960252], "isController": false}, {"data": ["NCPPServerlessEastGFSTrajectory20waypoints", 70172, 0, 0.0, 78.54508920937124, 20, 2889, 51.0, 62.0, 448.0, 477.0, 1161.3650657045446, 9042.374783036394, 2002.901080111549], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-fulltime-1zedd", 131472, 0, 0.0, 41.855832420591845, 21, 763, 41.0, 47.0, 51.0, 74.0, 2189.667232936944, 30928.80904590745, 898.1057010092935], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-1time-1zedd", 1964, 54, 2.74949083503055, 3044.6670061099753, 169, 54275, 1554.5, 5385.5, 8912.5, 34288.0, 17.21372540426837, 33467.91174569438, 8.435610127525308], "isController": false}, {"data": ["NCPPServerlessEastCollections", 75096, 0, 0.0, 73.37384148290217, 26, 2676, 77.0, 89.0, 95.0, 115.0, 1250.2663825253064, 42295.18272956763, 183.14448962773042], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-fulltime-halfzedd", 29220, 0, 0.0, 188.64318959616708, 31, 4086, 209.0, 247.0, 269.0, 403.9900000000016, 485.5837141670129, 50142.60857005609, 198.69099241794765], "isController": false}, {"data": ["NCPPServerlessEastNWM-position-1day", 183456, 0, 0.0, 29.945469213326472, 16, 9865, 27.0, 33.0, 36.0, 43.0, 3055.9701492537315, 13435.129519464619, 1008.7088969216419], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-1time-fullzedd", 194132, 0, 0.0, 28.294335812746127, 17, 3856, 27.0, 33.0, 36.0, 47.0, 3234.077998234128, 18175.502599351126, 1310.685907487464], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-1time-1zedd", 4230, 36, 0.851063829787234, 1463.125768321512, 92, 82240, 557.0, 2072.0, 4219.0, 21853.80999999998, 37.91647618791513, 33120.68931529051, 18.686753351305562], "isController": false}, {"data": ["NCPPServerlessEastGFSTrajectory10waypoints", 119204, 0, 0.0, 46.134123016006356, 20, 4102, 46.0, 51.0, 54.0, 77.9900000000016, 1985.4097268487676, 10669.33375796344, 2008.6762470852766], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-halftime-1zedd", 160464, 0, 0.0, 34.2765480107685, 19, 587, 34.0, 39.0, 43.0, 56.0, 2672.751803054783, 23057.399824795542, 1096.2458567216884], "isController": false}, {"data": ["NCPPServerlessEastGFSCorridor20waypoints", 61286, 61286, 100.0, 89.78432268381034, 19, 5505, 67.0, 73.0, 80.0, 4189.350000005867, 1020.0902145508414, 608.6088863205114, 1822.0166039194228], "isController": false}, {"data": ["NCPPServerlessEastGFSCorridor5waypoints", 77970, 0, 0.0, 70.6152109785819, 22, 17990, 53.0, 86.0, 114.0, 135.0, 1298.158569478206, 18711.50377682645, 950.7997335045453], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-1time-fullzedd", 1986, 58, 2.920443101711984, 3369.009063444114, 177, 63563, 1552.0, 5336.899999999999, 9475.0, 50656.0, 17.246469944595933, 28973.25397199077, 18.541339206627647], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-fulltime-1zedd", 824, 96, 11.650485436893204, 7978.048543689321, 493, 72031, 4770.5, 17642.5, 30534.0, 59811.5, 7.2758739437179365, 34726.561758422664, 7.150116224139301], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-halftime-1zedd", 1410, 68, 4.822695035460993, 4704.651063829783, 238, 76067, 2143.0, 7997.0, 22562.45, 50987.700000000004, 12.21403140998432, 31670.11886077087, 12.930526334881021], "isController": false}, {"data": ["NCPPServerlessEastNWM-position-1hour", 165944, 0, 0.0, 33.114677240515405, 18, 12959, 26.0, 32.0, 35.0, 49.0, 2762.280482729921, 7029.38218502913, 911.7683624635871], "isController": false}, {"data": ["NCPPServerlessEastGFSInstances", 204092, 0, 0.0, 26.917537189110913, 16, 5014, 25.0, 31.0, 35.0, 46.0, 3399.5502623469642, 4876.393848380112, 743.6516198883985], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-halftime-fullzedd", 29948, 0, 0.0, 183.8484039000938, 30, 4166, 181.0, 230.0, 266.0, 523.9900000000016, 497.9962419142957, 49407.07305558558, 201.8246488226882], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-1time-halfzedd", 31672, 0, 0.0, 173.01667087648377, 31, 6653, 153.0, 291.0, 377.9500000000007, 626.9900000000016, 526.0780014616969, 40699.527303781724, 394.55850109627266], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-1time-halfzedd", 198730, 0, 0.0, 27.63602878277067, 17, 2806, 27.0, 34.0, 38.0, 54.0, 3310.1805583316673, 14581.819463009693, 1354.4586464267272], "isController": false}, {"data": ["NCPPServerlessEastNWM-position-1month", 47940, 0, 0.0, 115.22882770129297, 29, 13991, 95.0, 137.0, 180.0, 370.9900000000016, 772.2667010325886, 42239.22925988088, 254.9083446767724], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-1time-halfzedd", 3042, 4, 0.13149243918474687, 1840.6245890861273, 91, 14801, 1641.0, 3249.4000000000005, 3889.0, 5791.230000000007, 47.01700154559505, 41644.23013065108, 52.18260964064915], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-halftime-1zedd", 11924, 2, 0.01677289500167729, 475.977692049648, 44, 25219, 341.0, 825.5, 1029.25, 1863.0, 140.28565378008895, 32625.788644475455, 105.33356759129626], "isController": false}, {"data": ["NCPPServerlessEastGFSCollectionMeta", 169300, 0, 0.0, 32.498334317779694, 17, 7075, 28.0, 37.0, 41.0, 72.0, 2819.317235636969, 21697.853774198586, 627.7386032472939], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-fulltime-1zedd", 5084, 10, 0.1966955153422502, 1091.7403619197494, 54, 11946, 1047.5, 1807.5, 2087.75, 3211.3499999999967, 83.41400187041626, 38163.720577347456, 62.51874646220611], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-1time-1zedd", 200100, 0, 0.0, 27.444397801099377, 16, 5903, 25.0, 30.0, 33.0, 45.9900000000016, 3332.7226395296543, 10502.095573233291, 1269.2986615396146], "isController": false}, {"data": ["NCPPServerlessEastGFSCorridor10waypoints", 65060, 0, 0.0, 79.93913310790047, 23, 5981, 74.0, 110.0, 118.0, 201.9400000000096, 1083.1238450397057, 23619.102809154778, 1178.3202767326486], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-1time-fullzedd", 11508, 0, 0.0, 479.1887382690316, 33, 9676, 447.0, 655.1000000000004, 746.0, 1189.0, 189.9950470529965, 28114.76864965123, 141.75411713719663], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-halftime-halfzedd", 53706, 0, 0.0, 102.64607306446251, 28, 1968, 80.0, 105.0, 403.0, 527.0, 889.0544298768375, 47848.18084033779, 363.783013787495], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-halftime-halfzedd", 812, 60, 7.389162561576355, 8349.02955665024, 483, 75375, 5232.5, 15828.0, 27323.7499999998, 65532.8, 6.934303452634096, 30623.158209079495, 4.8164373735044705], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-1time-1zedd", 129828, 0, 0.0, 42.389823458729545, 19, 4801, 41.0, 49.0, 54.0, 65.0, 2161.5303930872583, 15174.720482295672, 1623.258664339943], "isController": false}, {"data": ["NCPPServerlessEastGFSTrajectory5waypoints", 131982, 0, 0.0, 41.67907744995518, 18, 13513, 35.0, 40.0, 42.0, 48.0, 2198.27112376955, 9174.794228803361, 1466.2296655611353], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 61286, 99.37088562441224, 2.324045141522313], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 388, 0.629114375587768, 0.014713466614082456], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2637040, 61674, "502/Bad Gateway", 61286, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 388, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-1time-1zedd", 1964, 54, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 54, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-1time-1zedd", 4230, 36, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 36, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSCorridor20waypoints", 61286, 61286, "502/Bad Gateway", 61286, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-1time-fullzedd", 1986, 58, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 58, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-fulltime-1zedd", 824, 96, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 96, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-halftime-1zedd", 1410, 68, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 68, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-1time-halfzedd", 3042, 4, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-halftime-1zedd", 11924, 2, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-fulltime-1zedd", 5084, 10, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-halftime-halfzedd", 812, 60, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 60, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
