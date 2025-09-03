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

    var data = {"OkPercent": 99.82741722418716, "KoPercent": 0.17258277581284356};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4340563344270678, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "HREF_ResLevel-1_Time-All_5threads_ZARR"], "isController": false}, {"data": [0.07970742685671418, 500, 1500, "NBM_ResLevel-1_Times-One_100threads_ZARR"], "isController": false}, {"data": [0.40068042142230026, 500, 1500, "HREF_ResLevel-1_Times-One_50threads_ZARR"], "isController": false}, {"data": [0.42834890965732086, 500, 1500, "NBM_ResLevel-1_Times-One_25threads_ZARR"], "isController": false}, {"data": [0.4610325550805656, 500, 1500, "HREF_ResLevel-1_Times-One_25threads_ZARR"], "isController": false}, {"data": [0.2209165687426557, 500, 1500, "NBM_ResLevel-1_Times-One_50threads_ZARR"], "isController": false}, {"data": [0.37012987012987014, 500, 1500, "HREF_ResLevel-1_Time-All_50threads_ZARR"], "isController": false}, {"data": [0.48604891491560454, 500, 1500, "LREF_ResLevel-1_Time-All_50threads_ZARR"], "isController": false}, {"data": [0.07708628005657708, 500, 1500, "NBM_ResLevel-1_Time-All_25threads_ZARR"], "isController": false}, {"data": [0.43733660130718954, 500, 1500, "MRMS_ResLevel-1_Times-One_100threads_ZARR"], "isController": false}, {"data": [0.22919280635717273, 500, 1500, "HREF_ResLevel-1_Times-One_100threads_ZARR"], "isController": false}, {"data": [0.7832817337461301, 500, 1500, "MRMS_ResLevel-1_Times-One_25threads_ZARR"], "isController": false}, {"data": [0.22537647537647537, 500, 1500, "HREF_ResLevel-1_Time-All_100threads_ZARR"], "isController": false}, {"data": [0.6003191974464205, 500, 1500, "LREF_ResLevel-1_Times-One_50threads_ZARR"], "isController": false}, {"data": [0.46691729323308273, 500, 1500, "HREF_ResLevel-1_Times-One_5threads_ZARR"], "isController": false}, {"data": [0.5737370994024986, 500, 1500, "LREF_ResLevel-1_Time-All_25threads_ZARR"], "isController": false}, {"data": [0.017510648367250355, 500, 1500, "NBM_ResLevel-1_Time-All_50threads_ZARR"], "isController": false}, {"data": [0.37988826815642457, 500, 1500, "NBM_ResLevel-1_Time-All_5threads_ZARR"], "isController": false}, {"data": [0.4033145636037881, 500, 1500, "LREF_ResLevel-1_Times-One_100threads_ZARR"], "isController": false}, {"data": [0.9802538787023978, 500, 1500, "MRMS_ResLevel-1_Times-One_5threads_ZARR"], "isController": false}, {"data": [0.342588811759902, 500, 1500, "LREF_ResLevel-1_Time-All_100threads_ZARR"], "isController": false}, {"data": [0.8222222222222222, 500, 1500, "LREF_ResLevel-1_Time-All_5threads_ZARR"], "isController": false}, {"data": [0.4531586503948313, 500, 1500, "HREF_ResLevel-1_Time-All_25threads_ZARR"], "isController": false}, {"data": [0.006697282816685802, 500, 1500, "NBM_ResLevel-1_Time-All_100threads_ZARR"], "isController": false}, {"data": [0.4934640522875817, 500, 1500, "NBM_ResLevel-1_Times-One_5threads_ZARR"], "isController": false}, {"data": [0.6132768361581921, 500, 1500, "MRMS_ResLevel-1_Times-One_50threads_ZARR"], "isController": false}, {"data": [0.9096385542168675, 500, 1500, "LREF_ResLevel-1_Times-One_5threads_ZARR"], "isController": false}, {"data": [0.7063249171129814, 500, 1500, "LREF_ResLevel-1_Times-One_25threads_ZARR"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 93868, 162, 0.17258277581284356, 1426.1510312353662, 6, 30326, 1346.0, 5016.600000000006, 6721.650000000005, 8806.950000000008, 27.471813500253447, 5.5834068454255394, 7.772590762702216], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["HREF_ResLevel-1_Time-All_5threads_ZARR", 785, 0, 0.0, 690.7719745222936, 622, 1272, 663.0, 749.0, 776.6999999999999, 1159.54, 6.50771807073102, 1.3218802331172383, 1.7349678059663753], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_100threads_ZARR", 2666, 28, 1.0502625656414104, 3993.8293323330804, 23, 28140, 3174.5, 7641.200000000001, 9412.050000000001, 13499.749999999995, 21.803847160429207, 4.444336959810913, 6.5368955842302405], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_50threads_ZARR", 4556, 8, 0.17559262510974538, 1161.7157594381054, 204, 6086, 785.0, 2040.6000000000004, 2897.2999999999993, 4118.580000000002, 37.5517201589107, 7.632136248619423, 11.074823718741243], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_25threads_ZARR", 1926, 7, 0.363447559709242, 1381.3104880581513, 8, 4468, 1230.0, 2206.7999999999997, 2347.6499999999996, 3410.6300000000006, 15.833867705815615, 3.220132110750752, 4.7470677594583925], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_25threads_ZARR", 3041, 4, 0.1315356790529431, 870.5468595856622, 133, 3450, 684.0, 1310.6000000000004, 1732.8000000000002, 2351.6399999999994, 25.21767974127208, 5.124576301932167, 7.437245392445476], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_50threads_ZARR", 2553, 19, 0.7442224833529182, 2087.343517430478, 17, 7591, 1670.0, 3649.3999999999996, 4384.499999999998, 5887.340000000001, 20.59219706563208, 4.193116563591414, 6.173637206200244], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_50threads_ZARR", 3927, 12, 0.30557677616501144, 1353.8701298701308, 35, 8561, 943.0, 2544.0, 3688.6, 4749.16, 32.38896449338117, 6.585677502165037, 8.63494854169244], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_50threads_ZARR", 5806, 4, 0.06889424733034792, 910.1903203582508, 57, 4643, 690.0, 1536.6000000000004, 1849.0, 3511.8800000000047, 47.926830274964296, 9.737362301164739, 12.730564291787392], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_25threads_ZARR", 1414, 0, 0.0, 1884.8677510608215, 1326, 4926, 1649.0, 2749.0, 2926.0, 3868.5499999999997, 11.599005799502901, 2.3560480530240264, 3.14894884009942], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_100threads_ZARR", 6120, 0, 0.0, 1726.0124183006542, 258, 9878, 1002.5, 6098.0, 7793.549999999998, 8897.0, 50.589382842594276, 10.275968389901962, 14.574089783755186], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_100threads_ZARR", 4782, 10, 0.20911752404851527, 2207.1631116687604, 58, 9464, 1614.5, 4882.0, 5968.249999999997, 7444.02, 39.60806076217769, 8.050968485211168, 11.681283545095376], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_25threads_ZARR", 4199, 2, 0.04763038818766373, 630.2079066444394, 6, 3716, 437.0, 868.0, 2622.0, 3100.0, 34.852546916890084, 7.080542174362337, 10.040528652815013], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_100threads_ZARR", 4914, 5, 0.10175010175010175, 2159.823361823356, 59, 11196, 1610.0, 4351.5, 6002.25, 8102.85, 40.3769833118329, 8.204343065187382, 10.764566839971076], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_50threads_ZARR", 6579, 2, 0.030399756801945583, 802.3977808177522, 257, 5912, 588.0, 1336.0, 1640.0, 3338.0, 54.474998136969965, 11.066349873934968, 16.012670350808555], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_5threads_ZARR", 665, 0, 0.0, 817.5338345864669, 562, 4815, 617.0, 736.0, 3306.0, 3426.0800000000004, 5.443101176200961, 1.1056299264158203, 1.6052896046998928], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_25threads_ZARR", 3682, 7, 0.19011406844106463, 718.9397066811523, 17, 3364, 546.0, 1188.5000000000014, 1477.7999999999993, 2135.17, 30.485432070144643, 6.19625870132639, 8.097692893632171], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_50threads_ZARR", 2113, 11, 0.5205868433506863, 2513.231897775677, 37, 11913, 2016.0, 4047.2000000000003, 4804.599999999999, 6322.080000000004, 17.273938670568906, 3.5148282492867247, 4.68960444376773], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_5threads_ZARR", 358, 0, 0.0, 1514.5418994413403, 1322, 4498, 1457.5, 1562.1, 1658.6000000000001, 2730.05, 2.9591423446656915, 0.6010757887602186, 0.8033609099775998], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_100threads_ZARR", 7814, 12, 0.15357051446122344, 1353.0354491937555, 6, 8650, 1019.0, 2416.0, 3624.5, 5728.700000000001, 64.31593329711755, 13.070829372232375, 18.905367111750376], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_5threads_ZARR", 1418, 0, 0.0, 451.42595204513384, 251, 30326, 309.0, 404.0, 443.0, 1239.489999999993, 10.121703130018915, 2.055970948285092, 2.9159203353081837], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_100threads_ZARR", 7347, 6, 0.08166598611678236, 1443.894786987885, 7, 7943, 1123.0, 2471.3999999999996, 3717.1999999999935, 5925.119999999997, 60.66636389909583, 12.326193566533174, 16.11450291069733], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_5threads_ZARR", 1035, 0, 0.0, 522.7990338164257, 432, 3166, 493.0, 574.4, 705.599999999996, 892.8800000000017, 8.594560930039444, 1.745770188914262, 2.2829302470417274], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_25threads_ZARR", 2786, 8, 0.2871500358937545, 952.0656855707106, 45, 3457, 746.0, 1429.2000000000007, 1889.65, 2681.170000000001, 22.992679645783987, 4.6748369013526565, 6.1298843196279575], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_100threads_ZARR", 2613, 12, 0.4592422502870264, 4108.632988901632, 86, 15256, 3538.0, 7030.199999999999, 8092.699999999995, 10788.160000000007, 21.094185173524497, 4.291283966239616, 5.7267416779685645], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_5threads_ZARR", 459, 0, 0.0, 1182.9084967320262, 1072, 3876, 1153.0, 1236.0, 1262.0, 2130.4, 3.7907881370630068, 0.7700038403409232, 1.1364960528108818], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_50threads_ZARR", 5310, 0, 0.0, 998.4205273069705, 257, 6601, 604.0, 1284.9000000000005, 5035.749999999997, 5697.780000000001, 43.89082673455555, 8.915324180456597, 12.6443299674745], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_5threads_ZARR", 1079, 0, 0.0, 501.4911955514365, 408, 3163, 463.0, 535.0, 581.0, 897.0000000000007, 8.963878642873757, 1.8207878493337322, 2.634890108891603], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_25threads_ZARR", 3921, 5, 0.12751849018107625, 675.3884213210907, 55, 3342, 514.0, 1101.000000000001, 1328.699999999999, 1942.5799999999972, 32.51540356085547, 6.6074852520752305, 9.557750460759273], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 162, 100.0, 0.17258277581284356], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 93868, 162, "502/Bad Gateway", 162, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_100threads_ZARR", 2666, 28, "502/Bad Gateway", 28, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_50threads_ZARR", 4556, 8, "502/Bad Gateway", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_25threads_ZARR", 1926, 7, "502/Bad Gateway", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_25threads_ZARR", 3041, 4, "502/Bad Gateway", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_50threads_ZARR", 2553, 19, "502/Bad Gateway", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_50threads_ZARR", 3927, 12, "502/Bad Gateway", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_50threads_ZARR", 5806, 4, "502/Bad Gateway", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_100threads_ZARR", 4782, 10, "502/Bad Gateway", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_25threads_ZARR", 4199, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_100threads_ZARR", 4914, 5, "502/Bad Gateway", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_50threads_ZARR", 6579, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_25threads_ZARR", 3682, 7, "502/Bad Gateway", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_50threads_ZARR", 2113, 11, "502/Bad Gateway", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_100threads_ZARR", 7814, 12, "502/Bad Gateway", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_100threads_ZARR", 7347, 6, "502/Bad Gateway", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_25threads_ZARR", 2786, 8, "502/Bad Gateway", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_100threads_ZARR", 2613, 12, "502/Bad Gateway", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_25threads_ZARR", 3921, 5, "502/Bad Gateway", 5, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
