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

    var data = {"OkPercent": 99.72043644942495, "KoPercent": 0.2795635505750516};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4162606900619286, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.053636363636363635, 500, 1500, "NBM_ResLevel-1_Times-One_100threads_ZARR"], "isController": false}, {"data": [0.377997002997003, 500, 1500, "HREF_ResLevel-1_Times-One_50threads_ZARR"], "isController": false}, {"data": [0.315989847715736, 500, 1500, "NBM_ResLevel-1_Times-One_25threads_ZARR"], "isController": false}, {"data": [0.31169557918298824, 500, 1500, "HREF_ResLevel-1_Times-One_25threads_ZARR"], "isController": false}, {"data": [0.23202979515828678, 500, 1500, "NBM_ResLevel-1_Times-One_50threads_ZARR"], "isController": false}, {"data": [0.3815916787614901, 500, 1500, "HREF_ResLevel-1_Time-All_50threads_ZARR"], "isController": false}, {"data": [0.543305811882791, 500, 1500, "LREF_ResLevel-1_Time-All_50threads_ZARR"], "isController": false}, {"data": [0.016210739614994935, 500, 1500, "NBM_ResLevel-1_Time-All_25threads_ZARR"], "isController": false}, {"data": [0.5753012048192772, 500, 1500, "LREF_ResLevel-1_Time-All_25threads_ZARR"], "isController": false}, {"data": [0.006211180124223602, 500, 1500, "NBM_ResLevel-1_Time-All_50threads_ZARR"], "isController": false}, {"data": [0.36901140684410644, 500, 1500, "LREF_ResLevel-1_Times-One_100threads_ZARR"], "isController": false}, {"data": [0.37013649700216866, 500, 1500, "LREF_ResLevel-1_Time-All_100threads_ZARR"], "isController": false}, {"data": [0.4277264624858208, 500, 1500, "MRMS_ResLevel-1_Times-One_100threads_ZARR"], "isController": false}, {"data": [0.24275979557069846, 500, 1500, "HREF_ResLevel-1_Times-One_100threads_ZARR"], "isController": false}, {"data": [0.4505882352941176, 500, 1500, "HREF_ResLevel-1_Time-All_25threads_ZARR"], "isController": false}, {"data": [0.003658536585365854, 500, 1500, "NBM_ResLevel-1_Time-All_100threads_ZARR"], "isController": false}, {"data": [0.6338115479985831, 500, 1500, "MRMS_ResLevel-1_Times-One_50threads_ZARR"], "isController": false}, {"data": [0.7702445974827832, 500, 1500, "MRMS_ResLevel-1_Times-One_25threads_ZARR"], "isController": false}, {"data": [0.22769996314043495, 500, 1500, "HREF_ResLevel-1_Time-All_100threads_ZARR"], "isController": false}, {"data": [0.5749919276719406, 500, 1500, "LREF_ResLevel-1_Times-One_50threads_ZARR"], "isController": false}, {"data": [0.6799102428722281, 500, 1500, "LREF_ResLevel-1_Times-One_25threads_ZARR"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 84775, 237, 0.2795635505750516, 1541.5185491005568, 5, 53977, 1262.0, 4660.9000000000015, 6305.9000000000015, 16938.900000000016, 33.03942438327057, 6.7173569713721335, 9.345739974346948], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NBM_ResLevel-1_Times-One_100threads_ZARR", 2750, 65, 2.3636363636363638, 3882.4818181818164, 6, 17096, 3452.0, 6936.600000000001, 8217.349999999999, 10600.799999999996, 22.279834724135135, 4.561076179312161, 6.679598887020983], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_50threads_ZARR", 4004, 11, 0.27472527472527475, 1321.3583916083892, 39, 8343, 1045.5, 2104.5, 2738.75, 5557.9, 33.03412316018745, 6.716171465064187, 9.742485541383408], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_25threads_ZARR", 1576, 9, 0.5710659898477157, 1688.0901015228442, 139, 5995, 1299.0, 2528.0, 3290.899999999999, 4097.420000000001, 12.840986865691098, 2.6132666730151874, 3.8497880544601246], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_25threads_ZARR", 1787, 8, 0.4476776720761052, 1489.4767767207597, 57, 6939, 1227.0, 2555.0, 3686.7999999999965, 5504.8399999999965, 14.5770454360062, 2.9653596337384776, 4.299089571947141], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_50threads_ZARR", 2685, 11, 0.409683426443203, 1984.1810055865913, 232, 6303, 1572.0, 3234.2000000000007, 3666.0, 4587.0, 21.899060420200964, 4.454292019586813, 6.565440965821969], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_50threads_ZARR", 4134, 11, 0.2660861151427189, 1279.0962747943868, 67, 7394, 1017.0, 1988.0, 2436.0, 5304.200000000003, 34.159643034209225, 6.944802189204264, 9.10701420736242], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_50threads_ZARR", 6177, 5, 0.08094544277157197, 854.9297393556753, 222, 6071, 665.0, 1327.0, 1501.0, 4666.80000000001, 51.060136391816485, 10.374375193738377, 13.562848729076256], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_25threads_ZARR", 987, 3, 0.303951367781155, 2705.9452887537973, 253, 6881, 2465.0, 3964.2000000000007, 4576.599999999997, 5940.88, 8.062803274135312, 1.6394082657008184, 2.1889251076265785], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_25threads_ZARR", 3320, 2, 0.060240963855421686, 799.0442771084336, 289, 5106, 639.0, 1293.0, 1446.9499999999998, 1998.699999999999, 27.47252747252747, 5.581472309223156, 7.29739010989011], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_50threads_ZARR", 1127, 2, 0.1774622892635315, 4766.813664596274, 428, 20632, 4043.0, 8301.400000000001, 10443.199999999999, 13621.960000000005, 9.068233022207918, 1.8430692036128098, 2.4618835743884775], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_100threads_ZARR", 7890, 28, 0.3548795944233207, 1382.1484157160992, 5, 8452, 1102.0, 2346.0, 3020.8499999999976, 5698.540000000001, 63.484655863278675, 12.910501671601681, 18.661017006686407], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_100threads_ZARR", 7839, 16, 0.20410766679423395, 1348.205638474297, 72, 7617, 1065.0, 2350.0, 2955.0, 5783.600000000002, 64.69529908886835, 13.150130397464677, 17.184688820480655], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_100threads_ZARR", 6171, 1, 0.01620482903905364, 1716.288445956896, 90, 8094, 997.0, 5826.200000000001, 6246.799999999999, 6887.399999999999, 50.91752203043005, 10.343177644579855, 14.668622069313344], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_100threads_ZARR", 5283, 25, 0.47321597577134206, 2006.5112625402223, 7, 13699, 1527.0, 3686.800000000001, 5476.000000000002, 7664.839999999989, 43.37189159900498, 8.82374531276938, 12.791319592675297], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_25threads_ZARR", 2550, 5, 0.19607843137254902, 1038.7576470588247, 6, 6833, 797.5, 1480.8000000000002, 1846.8999999999996, 4562.659999999993, 21.07054915635174, 4.282739204958602, 5.6174413278164295], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_100threads_ZARR", 1230, 3, 0.24390243902439024, 8966.184552845532, 422, 53977, 5150.0, 20117.80000000001, 25922.850000000013, 37771.120000000046, 9.483496403210511, 1.927893803633798, 2.5746210938403533], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_50threads_ZARR", 5646, 1, 0.017711654268508677, 938.0281615302877, 8, 6524, 599.0, 1211.3000000000002, 4928.549999999997, 5529.0599999999995, 46.72525944684443, 9.491625972925666, 13.460890172674908], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_25threads_ZARR", 4211, 0, 0.0, 628.5616243172627, 246, 5198, 464.0, 830.8000000000002, 1028.3999999999996, 4616.040000000001, 34.939099266536125, 7.097004538515151, 10.065463167605621], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_100threads_ZARR", 5426, 21, 0.3870254330998894, 1951.6979358643564, 21, 10446, 1592.5, 3275.6000000000004, 4619.299999999999, 7864.449999999972, 44.58248087620268, 9.067443031727839, 11.885759061722005], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_50threads_ZARR", 6194, 8, 0.12915724895059735, 852.3624475298714, 34, 7361, 621.0, 1339.0, 1531.75, 4566.250000000005, 51.22140813390008, 10.408806315432578, 15.056292820609299], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_25threads_ZARR", 3788, 2, 0.05279831045406547, 698.4017951425576, 35, 4687, 535.0, 1069.1, 1287.5499999999997, 1686.9900000000011, 31.418736780989505, 6.383048692613943, 9.235390401443205], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 237, 100.0, 0.2795635505750516], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 84775, 237, "502/Bad Gateway", 237, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["NBM_ResLevel-1_Times-One_100threads_ZARR", 2750, 65, "502/Bad Gateway", 65, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_50threads_ZARR", 4004, 11, "502/Bad Gateway", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_25threads_ZARR", 1576, 9, "502/Bad Gateway", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_25threads_ZARR", 1787, 8, "502/Bad Gateway", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_50threads_ZARR", 2685, 11, "502/Bad Gateway", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_50threads_ZARR", 4134, 11, "502/Bad Gateway", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_50threads_ZARR", 6177, 5, "502/Bad Gateway", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_25threads_ZARR", 987, 3, "502/Bad Gateway", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_25threads_ZARR", 3320, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_50threads_ZARR", 1127, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_100threads_ZARR", 7890, 28, "502/Bad Gateway", 28, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_100threads_ZARR", 7839, 16, "502/Bad Gateway", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_100threads_ZARR", 6171, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_100threads_ZARR", 5283, 25, "502/Bad Gateway", 25, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_25threads_ZARR", 2550, 5, "502/Bad Gateway", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_100threads_ZARR", 1230, 3, "502/Bad Gateway", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_50threads_ZARR", 5646, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_100threads_ZARR", 5426, 21, "502/Bad Gateway", 21, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_50threads_ZARR", 6194, 8, "502/Bad Gateway", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_25threads_ZARR", 3788, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
