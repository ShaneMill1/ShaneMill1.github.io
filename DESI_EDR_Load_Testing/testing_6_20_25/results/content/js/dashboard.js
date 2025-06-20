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

    var data = {"OkPercent": 99.99512238509631, "KoPercent": 0.004877614903695798};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.43182600686882944, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9566646378575776, 500, 1500, "HREF_ResLevel-1_Times-One_5threads"], "isController": false}, {"data": [0.014739651213306027, 500, 1500, "HREF_ResLevel-4_Times-One_250threads"], "isController": false}, {"data": [0.41150952088452086, 500, 1500, "HREF_ResLevel-4_Times-One_50threads"], "isController": false}, {"data": [0.14860604866515614, 500, 1500, "HREF_ResLevel-4_Times-One_100threads"], "isController": false}, {"data": [0.49445960698689956, 500, 1500, "HREF_ResLevel-2_Times-One_25threads"], "isController": false}, {"data": [0.02178652535957608, 500, 1500, "HREF_ResLevel-4_Times-One_500threads"], "isController": false}, {"data": [0.8982891802208562, 500, 1500, "HREF_ResLevel-1_Times-One_25threads"], "isController": false}, {"data": [0.8665550260412824, 500, 1500, "HREF_ResLevel-1_Times-One_50threads"], "isController": false}, {"data": [0.14517186015269176, 500, 1500, "HREF_ResLevel-2_Times-One_100threads"], "isController": false}, {"data": [0.01501025545403692, 500, 1500, "HREF_ResLevel-2_Times-One_250threads"], "isController": false}, {"data": [0.03896941407689473, 500, 1500, "HREF_ResLevel-2_Times-One_500threads"], "isController": false}, {"data": [0.4759287755550671, 500, 1500, "HREF_ResLevel-4_Times-One_25threads"], "isController": false}, {"data": [0.5902780038412708, 500, 1500, "HREF_ResLevel-1_Times-One_250threads"], "isController": false}, {"data": [0.4502353175129259, 500, 1500, "HREF_ResLevel-2_Times-One_50threads"], "isController": false}, {"data": [0.210677160223582, 500, 1500, "HREF_ResLevel-1_Times-One_500threads"], "isController": false}, {"data": [0.6822395230668612, 500, 1500, "HREF_ResLevel-1_Times-One_100threads"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 697062, 34, 0.004877614903695798, 2384.4419836398756, 2, 155388, 1978.0, 7295.9000000000015, 9290.750000000004, 15046.94000000001, 71.95110320029035, 395.27789362668506, 21.290219013367164], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["HREF_ResLevel-1_Times-One_5threads", 8215, 0, 0.0, 362.697869750458, 281, 834, 331.0, 420.0, 564.0, 640.0, 13.687879686620034, 28.685732233873626, 4.050222211958857], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_250threads", 32226, 1, 0.0031030844659591635, 4637.75786631913, 550, 155388, 3510.0, 6283.9000000000015, 7555.750000000004, 23878.530000000235, 52.42412362111345, 751.3723715420064, 15.512216266794313], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_50threads", 26048, 0, 0.0, 1143.1861179361217, 540, 7873, 956.0, 1649.0, 1996.9500000000007, 2771.980000000003, 43.32214022815307, 620.9365743443385, 12.818953602666387], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_100threads", 30453, 2, 0.0065674974550947365, 1956.3592092733106, 2, 51841, 1772.0, 3043.9000000000015, 3331.9500000000007, 3847.0, 50.61572240385207, 725.42879828017, 14.977113172233572], "isController": false}, {"data": ["HREF_ResLevel-2_Times-One_25threads", 18320, 0, 0.0, 812.8821506550205, 522, 5113, 688.0, 1236.0, 1316.0, 1513.7900000000009, 30.45374753976275, 202.85645700070484, 9.011216313035268], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_500threads", 33025, 6, 0.018168054504163512, 9083.644360333194, 2, 126591, 6722.0, 19587.20000000001, 25098.850000000002, 40455.67000000006, 53.75915248553671, 770.3930042418251, 15.907249221794556], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_25threads", 36766, 0, 0.0, 404.7820812707376, 268, 1371, 353.0, 610.0, 664.0, 753.0, 61.230845583888055, 128.32167443654666, 18.118111535076252], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_50threads", 67777, 0, 0.0, 439.18143322956524, 272, 1761, 392.0, 652.0, 718.0, 975.9800000000032, 112.81650942454043, 236.4299113526013, 33.38222886292553], "isController": false}, {"data": ["HREF_ResLevel-2_Times-One_100threads", 30519, 0, 0.0, 1952.8557619843357, 531, 31399, 1780.0, 3198.0, 3585.9500000000007, 4353.950000000008, 50.6753895839733, 337.5555003440253, 14.994768597601475], "isController": false}, {"data": ["HREF_ResLevel-2_Times-One_250threads", 32178, 1, 0.0031077133445211015, 4649.409969544474, 536, 41106, 4255.0, 8853.500000000007, 10277.900000000001, 16300.980000000003, 51.82719115565069, 345.21751058694156, 15.33558488297086], "isController": false}, {"data": ["HREF_ResLevel-2_Times-One_500threads", 32564, 19, 0.05834664046185972, 9204.829934897458, 524, 99103, 6133.5, 20186.9, 27797.150000000012, 44726.83000000003, 52.84381993116217, 351.8005350393156, 15.636403749162247], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_25threads", 18196, 0, 0.0, 818.1317322488426, 549, 5227, 697.0, 1253.0, 1480.2999999999956, 1922.0, 30.283815068344957, 434.0581579668935, 8.960933560262228], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_250threads", 122876, 1, 8.138285751489306E-4, 1213.0339692047198, 276, 53285, 491.0, 2743.800000000003, 4378.600000000006, 8803.920000000013, 203.1532097532587, 425.74579890382887, 60.112717339099], "isController": false}, {"data": ["HREF_ResLevel-2_Times-One_50threads", 30172, 0, 0.0, 986.9511136152664, 532, 4930, 873.0, 1500.0, 1687.0, 2166.950000000008, 50.16635103476828, 334.1647269610883, 14.844144886264443], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_500threads", 98219, 4, 0.004072531791201295, 3039.873873690407, 274, 56649, 1978.0, 7295.9000000000015, 9290.750000000004, 15046.94000000001, 162.25882710552878, 340.03427005602794, 48.012133411108614], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_100threads", 79508, 0, 0.0, 748.8568194395516, 270, 50984, 486.0, 1354.0, 1691.0, 2460.980000000003, 132.2360783557142, 277.12756264781507, 39.12844896658339], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 16, 47.05882352941177, 0.0022953481899744927], "isController": false}, {"data": ["500/Internal Server Error", 18, 52.94117647058823, 0.0025822667137213044], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 697062, 34, "500/Internal Server Error", 18, "502/Bad Gateway", 16, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_250threads", 32226, 1, "500/Internal Server Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_100threads", 30453, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_500threads", 33025, 6, "502/Bad Gateway", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["HREF_ResLevel-2_Times-One_250threads", 32178, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-2_Times-One_500threads", 32564, 19, "500/Internal Server Error", 17, "502/Bad Gateway", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_250threads", 122876, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_500threads", 98219, 4, "502/Bad Gateway", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
