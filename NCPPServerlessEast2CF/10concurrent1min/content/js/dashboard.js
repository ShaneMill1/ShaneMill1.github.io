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

    var data = {"OkPercent": 97.27690515508787, "KoPercent": 2.723094844912119};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9685343779202991, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9995756118262837, 500, 1500, "NCPPServerlessEastGFSPosition-fulltime-fullzedd"], "isController": false}, {"data": [0.9999641859465654, 500, 1500, "NCPPServerlessEastGFSAreaUS-1time-1zedd"], "isController": false}, {"data": [0.9994737949905284, 500, 1500, "NCPPServerlessEastGFSTrajectory20waypoints"], "isController": false}, {"data": [0.9999745106035889, 500, 1500, "NCPPServerlessEastGFSPosition-fulltime-1zedd"], "isController": false}, {"data": [0.5730027548209367, 500, 1500, "NCPPServerlessEastGFSAreaGlobe-1time-1zedd"], "isController": false}, {"data": [0.9987874378561902, 500, 1500, "NCPPServerlessEastCollections"], "isController": false}, {"data": [0.9998260869565218, 500, 1500, "NCPPServerlessEastGFSPosition-fulltime-halfzedd"], "isController": false}, {"data": [0.9996615578010927, 500, 1500, "NCPPServerlessEastNWM-position-1day"], "isController": false}, {"data": [0.9998121448363312, 500, 1500, "NCPPServerlessEastGFSPosition-1time-fullzedd"], "isController": false}, {"data": [0.953542780748663, 500, 1500, "NCPPServerlessEastGFSAreaHalfGlobe-1time-1zedd"], "isController": false}, {"data": [0.9998553938108551, 500, 1500, "NCPPServerlessEastGFSTrajectory10waypoints"], "isController": false}, {"data": [1.0, 500, 1500, "NCPPServerlessEastGFSPosition-halftime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSCorridor20waypoints"], "isController": false}, {"data": [0.992570385818561, 500, 1500, "NCPPServerlessEastGFSCorridor5waypoints"], "isController": false}, {"data": [0.5870418848167539, 500, 1500, "NCPPServerlessEastGFSAreaUS-1time-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaUS-fulltime-1zedd"], "isController": false}, {"data": [0.3806146572104019, 500, 1500, "NCPPServerlessEastGFSAreaUS-halftime-1zedd"], "isController": false}, {"data": [0.9994661541746743, 500, 1500, "NCPPServerlessEastNWM-position-1hour"], "isController": false}, {"data": [0.9997342074953486, 500, 1500, "NCPPServerlessEastGFSInstances"], "isController": false}, {"data": [0.9995351539802441, 500, 1500, "NCPPServerlessEastGFSPosition-halftime-fullzedd"], "isController": false}, {"data": [0.9996969467383893, 500, 1500, "NCPPServerlessEastGFSAreaTexas-1time-halfzedd"], "isController": false}, {"data": [0.9999106584472438, 500, 1500, "NCPPServerlessEastGFSPosition-1time-halfzedd"], "isController": false}, {"data": [0.9991928323512793, 500, 1500, "NCPPServerlessEastNWM-position-1month"], "isController": false}, {"data": [0.9577421344848859, 500, 1500, "NCPPServerlessEastGFSAreaUS-1time-halfzedd"], "isController": false}, {"data": [0.9998962009549512, 500, 1500, "NCPPServerlessEastGFSAreaTexas-halftime-1zedd"], "isController": false}, {"data": [0.999642948227493, 500, 1500, "NCPPServerlessEastGFSCollectionMeta"], "isController": false}, {"data": [0.999578947368421, 500, 1500, "NCPPServerlessEastGFSAreaTexas-fulltime-1zedd"], "isController": false}, {"data": [0.9998227421784986, 500, 1500, "NCPPServerlessEastGFSPosition-1time-1zedd"], "isController": false}, {"data": [0.9844868735083532, 500, 1500, "NCPPServerlessEastGFSCorridor10waypoints"], "isController": false}, {"data": [0.9992713140636386, 500, 1500, "NCPPServerlessEastGFSAreaTexas-1time-fullzedd"], "isController": false}, {"data": [0.9998534583821805, 500, 1500, "NCPPServerlessEastGFSPosition-halftime-halfzedd"], "isController": false}, {"data": [0.02754237288135593, 500, 1500, "NCPPServerlessEastGFSAreaTexas-halftime-halfzedd"], "isController": false}, {"data": [0.999809351317859, 500, 1500, "NCPPServerlessEastGFSAreaTexas-1time-1zedd"], "isController": false}, {"data": [0.9995796111403048, 500, 1500, "NCPPServerlessEastGFSTrajectory5waypoints"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 781170, 21272, 2.723094844912119, 48.290610238487545, 16, 26483, 29.0, 40.0, 263.0, 296.0, 381.4282428871301, 20336.81860936674, 222.6639565932321], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NCPPServerlessEastGFSPosition-fulltime-fullzedd", 14138, 0, 0.0, 78.43061253359754, 36, 3217, 76.0, 91.0, 97.0, 115.0, 235.3979353979354, 45397.2903073489, 95.40053045912421], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-1time-1zedd", 27922, 0, 0.0, 39.63405200200541, 27, 739, 39.0, 46.0, 51.0, 82.9900000000016, 465.1108556960338, 21844.264300468076, 517.3449849978346], "isController": false}, {"data": ["NCPPServerlessEastGFSTrajectory20waypoints", 28506, 0, 0.0, 38.748474005472616, 20, 2875, 27.0, 94.0, 116.0, 251.9700000000048, 474.1438099832005, 3691.6671171470866, 817.7128597952462], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-fulltime-1zedd", 39232, 0, 0.0, 28.221095024470074, 20, 719, 28.0, 32.0, 35.0, 47.0, 653.5943356934611, 9231.952506768013, 268.07580174927114], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-1time-1zedd", 1452, 0, 0.0, 769.8939393939395, 172, 2656, 681.0, 1204.0, 1372.2499999999986, 2092.510000000001, 23.937090951054255, 47853.67626300302, 12.062049737054682], "isController": false}, {"data": ["NCPPServerlessEastCollections", 16494, 0, 0.0, 67.18685582636101, 23, 26483, 36.0, 43.0, 45.0, 57.04999999999927, 274.9687421855464, 9301.886995186296, 40.278624343585896], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-fulltime-halfzedd", 23000, 0, 0.0, 48.17695652173926, 29, 1743, 47.0, 59.0, 64.0, 77.0, 383.03966958665023, 39553.65642200355, 156.73205230156879], "isController": false}, {"data": ["NCPPServerlessEastNWM-position-1day", 41366, 0, 0.0, 26.750181308320794, 17, 7337, 24.0, 28.0, 30.0, 40.0, 689.2954742384856, 3030.3801544378625, 227.52135770762513], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-1time-fullzedd", 42586, 0, 0.0, 25.928286291269476, 18, 3374, 24.0, 28.0, 31.0, 38.0, 709.6838702151416, 3988.430711729465, 287.6160216203943], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-1time-1zedd", 2992, 0, 0.0, 371.7266042780743, 148, 1303, 351.0, 495.0, 559.0, 712.0, 49.65727847576054, 43747.57004448948, 24.683158929845817], "isController": false}, {"data": ["NCPPServerlessEastGFSTrajectory10waypoints", 41492, 0, 0.0, 26.54656319290479, 18, 2983, 25.0, 30.0, 32.0, 62.9900000000016, 691.3144171012513, 3715.047266282344, 699.4157579266566], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-halftime-1zedd", 42372, 0, 0.0, 26.08260171811564, 18, 495, 26.0, 30.0, 32.0, 40.9900000000016, 705.7647783866615, 6088.538695408664, 289.47383488515413], "isController": false}, {"data": ["NCPPServerlessEastGFSCorridor20waypoints", 21272, 21272, 100.0, 52.07681459195176, 18, 6584, 29.0, 40.0, 263.0, 296.0, 352.9509366340905, 210.59275653735753, 630.4172491247574], "isController": false}, {"data": ["NCPPServerlessEastGFSCorridor5waypoints", 7672, 0, 0.0, 144.71506777893686, 23, 8795, 98.0, 213.0, 361.0, 522.6199999999972, 127.54779717373232, 1838.4571124272652, 93.41879675810475], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-1time-fullzedd", 1528, 0, 0.0, 731.4162303664921, 154, 7069, 691.5, 1007.0, 1155.2999999999997, 1609.0, 25.184599156118146, 43579.508656690894, 27.889976018591774], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-fulltime-1zedd", 438, 0, 0.0, 2593.3835616438355, 1519, 6779, 2433.0, 3441.0, 3780.0, 4120.780000000002, 7.0872639601300955, 38284.249199294914, 7.883196924402517], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-halftime-1zedd", 846, 0, 0.0, 1321.1063829787215, 484, 2211, 1311.0, 1607.3000000000002, 1687.3, 1841.2099999999984, 13.92409230060239, 37931.54974833561, 15.487833135142697], "isController": false}, {"data": ["NCPPServerlessEastNWM-position-1hour", 37464, 0, 0.0, 29.542333973948256, 17, 11383, 23.0, 27.0, 29.0, 38.0, 624.2231367779129, 1588.5225748537914, 206.04240256927204], "isController": false}, {"data": ["NCPPServerlessEastGFSInstances", 45148, 0, 0.0, 24.465934260653988, 16, 6066, 22.0, 25.0, 28.0, 39.0, 752.3538135946275, 725.8034016251729, 164.57739672382476], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-halftime-fullzedd", 17210, 0, 0.0, 64.39883788495096, 28, 3238, 57.0, 98.0, 108.0, 133.88999999999942, 286.64223850766155, 28438.278972872253, 116.16848533269487], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-1time-halfzedd", 26398, 0, 0.0, 41.95060231835784, 28, 3704, 39.0, 49.0, 56.0, 71.0, 439.7467932700316, 34020.62272900008, 329.81009495252374], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-1time-halfzedd", 44772, 0, 0.0, 24.658357902260384, 17, 2085, 24.0, 28.0, 30.0, 42.0, 745.8643610375331, 3285.646524168291, 305.192546166725], "isController": false}, {"data": ["NCPPServerlessEastNWM-position-1month", 24778, 0, 0.0, 44.74784082653986, 25, 9986, 37.0, 46.0, 52.0, 69.0, 412.69841269841265, 22572.610485476107, 136.22271825396825], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-1time-halfzedd", 3242, 0, 0.0, 343.4059222702032, 85, 3386, 316.0, 476.7000000000003, 570.6999999999998, 801.840000000002, 53.74935756088665, 47669.73944042517, 59.73317275809473], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-halftime-1zedd", 9634, 0, 0.0, 114.9246418932946, 35, 849, 113.0, 153.0, 169.0, 216.64999999999964, 160.31017039403622, 37288.99831233568, 120.38918069630259], "isController": false}, {"data": ["NCPPServerlessEastGFSCollectionMeta", 39210, 0, 0.0, 28.195409334353457, 18, 6730, 25.0, 30.0, 32.0, 41.0, 653.271355025741, 5027.6754372948635, 145.45495014245014], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-fulltime-1zedd", 4750, 0, 0.0, 233.7772631578945, 65, 893, 235.0, 315.0, 348.0, 393.0, 78.88661916861807, 36163.03048656436, 59.242002090495404], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-1time-1zedd", 45132, 0, 0.0, 24.435744039705824, 17, 3713, 23.0, 27.0, 29.0, 37.0, 752.1874635422743, 2370.3275518324695, 286.47764724754586], "isController": false}, {"data": ["NCPPServerlessEastGFSCorridor10waypoints", 5866, 0, 0.0, 189.4943743607226, 29, 7664, 137.0, 350.3000000000002, 425.0, 930.5799999999981, 97.24962283857491, 2120.6715157122962, 105.79695297087153], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-1time-fullzedd", 16468, 0, 0.0, 67.2810298761231, 30, 7714, 63.0, 74.0, 80.0, 101.0, 274.2427017935353, 40581.452360780364, 204.61076579127047], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-halftime-halfzedd", 27296, 0, 0.0, 40.55605216881601, 24, 1702, 38.0, 49.0, 54.0, 75.0, 454.7287054158962, 24473.142717287636, 186.06574957935595], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-halftime-halfzedd", 472, 0, 0.0, 2394.4872881355927, 753, 8548, 2291.0, 3004.0, 3341.0, 5805.639999999943, 7.646201198768832, 36459.42913570185, 5.734650899076624], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-1time-1zedd", 41962, 0, 0.0, 26.346789952814664, 18, 3639, 25.0, 30.0, 32.0, 41.9900000000016, 699.2151700464899, 4908.751085702264, 525.094204849366], "isController": false}, {"data": ["NCPPServerlessEastGFSTrajectory5waypoints", 38060, 0, 0.0, 28.94151339989506, 17, 7485, 25.0, 29.0, 31.0, 40.0, 634.1430904062114, 2646.721120382635, 422.9684870580492], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 21272, 100.0, 2.723094844912119], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 781170, 21272, "502/Bad Gateway", 21272, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSCorridor20waypoints", 21272, 21272, "502/Bad Gateway", 21272, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
