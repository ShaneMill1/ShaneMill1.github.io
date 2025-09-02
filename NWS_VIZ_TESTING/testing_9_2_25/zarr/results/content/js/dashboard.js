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

    var data = {"OkPercent": 98.69279159692965, "KoPercent": 1.3072084030703526};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5884505877147419, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.7723684210526316, 500, 1500, "HREF_ResLevel-1_Time-All_5threads_ZARR"], "isController": false}, {"data": [0.06514886164623468, 500, 1500, "NBM_ResLevel-1_Times-One_100threads_ZARR"], "isController": false}, {"data": [0.5727237278221876, 500, 1500, "HREF_ResLevel-1_Times-One_50threads_ZARR"], "isController": false}, {"data": [0.3939260563380282, 500, 1500, "NBM_ResLevel-1_Times-One_25threads_ZARR"], "isController": false}, {"data": [0.4868217054263566, 500, 1500, "HREF_ResLevel-1_Times-One_25threads_ZARR"], "isController": false}, {"data": [0.19422120168388826, 500, 1500, "NBM_ResLevel-1_Times-One_50threads_ZARR"], "isController": false}, {"data": [0.5217215599110931, 500, 1500, "HREF_ResLevel-1_Time-All_50threads_ZARR"], "isController": false}, {"data": [0.7679134127962735, 500, 1500, "LREF_ResLevel-1_Time-All_50threads_ZARR"], "isController": false}, {"data": [0.08164128595600677, 500, 1500, "NBM_ResLevel-1_Time-All_25threads_ZARR"], "isController": false}, {"data": [0.6019507051535521, 500, 1500, "MRMS_ResLevel-1_Times-One_100threads_ZARR"], "isController": false}, {"data": [0.31672564723412183, 500, 1500, "HREF_ResLevel-1_Times-One_100threads_ZARR"], "isController": false}, {"data": [0.829595134004942, 500, 1500, "MRMS_ResLevel-1_Times-One_25threads_ZARR"], "isController": false}, {"data": [0.49112071034317256, 500, 1500, "HREF_ResLevel-1_Time-All_100threads_ZARR"], "isController": false}, {"data": [0.7210628645495788, 500, 1500, "LREF_ResLevel-1_Times-One_50threads_ZARR"], "isController": false}, {"data": [0.7649572649572649, 500, 1500, "HREF_ResLevel-1_Times-One_5threads_ZARR"], "isController": false}, {"data": [0.8634838998211091, 500, 1500, "LREF_ResLevel-1_Time-All_25threads_ZARR"], "isController": false}, {"data": [0.08855291576673865, 500, 1500, "NBM_ResLevel-1_Time-All_50threads_ZARR"], "isController": false}, {"data": [0.31769436997319034, 500, 1500, "NBM_ResLevel-1_Time-All_5threads_ZARR"], "isController": false}, {"data": [0.5484326982175783, 500, 1500, "LREF_ResLevel-1_Times-One_100threads_ZARR"], "isController": false}, {"data": [0.8687881429816914, 500, 1500, "MRMS_ResLevel-1_Times-One_5threads_ZARR"], "isController": false}, {"data": [0.5515278609946076, 500, 1500, "LREF_ResLevel-1_Time-All_100threads_ZARR"], "isController": false}, {"data": [0.8575638506876228, 500, 1500, "LREF_ResLevel-1_Time-All_5threads_ZARR"], "isController": false}, {"data": [0.6268983644859814, 500, 1500, "HREF_ResLevel-1_Time-All_25threads_ZARR"], "isController": false}, {"data": [0.030556924593395762, 500, 1500, "NBM_ResLevel-1_Time-All_100threads_ZARR"], "isController": false}, {"data": [0.3955512572533849, 500, 1500, "NBM_ResLevel-1_Times-One_5threads_ZARR"], "isController": false}, {"data": [0.7842679127725857, 500, 1500, "MRMS_ResLevel-1_Times-One_50threads_ZARR"], "isController": false}, {"data": [0.857208448117539, 500, 1500, "LREF_ResLevel-1_Times-One_5threads_ZARR"], "isController": false}, {"data": [0.8477866061293984, 500, 1500, "LREF_ResLevel-1_Times-One_25threads_ZARR"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 103962, 1359, 1.3072084030703526, 1306.1651468805876, 6, 86973, 779.0, 4667.800000000003, 7180.700000000004, 24256.0, 29.842023454644355, 2959.023623688373, 8.445498419265762], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["HREF_ResLevel-1_Time-All_5threads_ZARR", 760, 0, 0.0, 713.6921052631584, 373, 5584, 474.0, 1088.3999999999999, 1628.3999999999992, 4293.139999999999, 6.229355015860266, 843.5970196429596, 1.660755780595559], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_100threads_ZARR", 2855, 132, 4.6234676007005255, 3754.3971978984227, 6, 31243, 3319.0, 6978.200000000001, 8690.199999999997, 13666.040000000005, 22.933753183012154, 203.71541361084113, 6.875646706235089], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_50threads_ZARR", 5129, 5, 0.09748488984207448, 1030.3298888672239, 16, 51449, 724.0, 1815.0, 2400.5, 4869.5999999999985, 42.373371446510745, 260.03004226803694, 12.49683415707641], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_25threads_ZARR", 2272, 38, 1.6725352112676057, 1168.7667253521124, 6, 10008, 866.0, 1915.7, 2294.0499999999997, 4245.4, 18.672693651119786, 170.77132184867475, 5.598161084857201], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_25threads_ZARR", 2580, 4, 0.15503875968992248, 1028.3193798449618, 27, 13789, 688.0, 1762.7000000000003, 2155.749999999999, 4629.660000000001, 20.85960997380421, 127.92153921485398, 6.151955285243039], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_50threads_ZARR", 2613, 25, 0.9567546880979717, 2060.9188672024516, 6, 10166, 1829.0, 3437.7999999999997, 4058.7999999999984, 6394.58, 21.218026796589523, 195.46282639311815, 6.361263893118148], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_50threads_ZARR", 4949, 10, 0.2020610224287735, 1069.77813699737, 364, 32493, 787.0, 1685.0, 3051.0, 4194.5, 40.84411725868216, 5520.0496901770675, 10.88910548009788], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_50threads_ZARR", 7299, 84, 1.1508425811755034, 723.6902315385674, 8, 27340, 450.0, 1052.0, 1527.0, 4148.0, 60.09781642130224, 19395.703781123408, 15.956921252840628], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_25threads_ZARR", 1182, 0, 0.0, 2259.521150592212, 799, 12278, 2125.0, 3234.7, 3828.7, 5712.1600000000035, 9.651421992504225, 1916.3867488915564, 2.6202102674962644], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_100threads_ZARR", 7587, 238, 3.13694477395545, 1414.3422960326886, 6, 42433, 586.0, 4417.399999999999, 5810.199999999999, 12220.719999999998, 53.01368140084129, 977.3747212667873, 15.272496106687676], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_100threads_ZARR", 5369, 46, 0.856770348295772, 1984.2143788414985, 16, 18404, 1455.0, 4359.0, 5353.0, 8124.500000000005, 41.22895933161322, 251.1893343992851, 12.15932199037812], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_25threads_ZARR", 5261, 1, 0.019007793195210038, 503.30431476905454, 37, 6370, 303.0, 947.6000000000004, 1718.9999999999964, 2425.1400000000003, 42.881828407479254, 815.8581345365404, 12.353651738482792], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_100threads_ZARR", 4167, 267, 6.407487401007919, 2778.912167026641, 33, 86973, 749.0, 4518.4000000000015, 12450.399999999972, 43820.43999999999, 31.842217875045847, 4036.4116757783845, 8.489185038952654], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_50threads_ZARR", 7715, 0, 0.0, 684.906545690216, 268, 6411, 498.0, 1152.0, 1740.1999999999998, 2835.5200000000004, 63.78088805482759, 704.1226905004505, 18.74809307080381], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_5threads_ZARR", 819, 0, 0.0, 660.2759462759453, 346, 2816, 451.0, 1066.0, 1340.0, 2019.399999999999, 6.813643926788685, 41.846686187084025, 2.0094926424708817], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_25threads_ZARR", 4472, 3, 0.06708407871198568, 595.5968246869433, 63, 23538, 407.0, 969.0, 1227.3499999999995, 3070.4599999999537, 36.4021164021164, 11876.910040191291, 9.66931216931217], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_50threads_ZARR", 1389, 6, 0.4319654427645788, 3862.493160547152, 781, 27207, 2806.0, 7805.0, 9798.0, 15340.899999999914, 11.11769225843632, 2198.0276557847615, 3.0182797342239223], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_5threads_ZARR", 373, 0, 0.0, 1466.0509383378026, 804, 7514, 1207.0, 2198.6000000000004, 2678.0, 5804.799999999988, 3.0621962432680943, 608.0373415539209, 0.8313384332309864], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_100threads_ZARR", 8135, 98, 1.2046711739397664, 1311.9591886908413, 6, 28197, 778.0, 2790.800000000001, 4188.2, 7839.800000000007, 62.42518186561895, 681.1355351486962, 18.349589591358697], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_5threads_ZARR", 1147, 0, 0.0, 471.10287707061894, 180, 17139, 257.0, 749.6000000000001, 1111.5999999999976, 3590.9199999999964, 9.535686078895955, 181.42015252837012, 2.7470970637444405], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_100threads_ZARR", 8345, 272, 3.2594367884961053, 1303.4534451767527, 6, 44137, 756.0, 2577.2000000000016, 3992.7, 10005.0, 61.11672598907296, 19304.152243734985, 16.22634885236777], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_5threads_ZARR", 1018, 0, 0.0, 531.4793713163065, 290, 6301, 371.0, 863.1, 956.9499999999991, 2801.2899999999995, 8.457678375594032, 2761.3328762129872, 2.2465708185171644], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_25threads_ZARR", 3424, 3, 0.08761682242990654, 774.7155373831771, 371, 27407, 542.0, 1323.5, 1768.75, 3192.5, 27.939388499481847, 3780.3322777991407, 7.448684629256391], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_100threads_ZARR", 2029, 69, 3.4006899950714637, 5419.51453918186, 6, 43161, 3450.0, 12536.0, 17393.5, 26884.400000000027, 15.69182462897226, 3009.9595886213006, 4.260085202006141], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_5threads_ZARR", 517, 1, 0.19342359767891681, 1051.0986460348172, 375, 4350, 740.0, 1665.2, 2308.2999999999993, 3661.740000000013, 4.264128534195506, 39.57693428386147, 1.2784057226543168], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_50threads_ZARR", 7062, 57, 0.8071367884451996, 747.9303313508914, 7, 32299, 414.0, 1012.0999999999995, 3730.949999999996, 4688.48, 57.89141465893906, 1092.6725926738095, 16.677702465221703], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_5threads_ZARR", 1089, 0, 0.0, 497.0275482093668, 274, 3365, 349.0, 861.0, 1077.0, 1765.7999999999938, 9.022444262172844, 99.5993261128924, 2.652105198158228], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_25threads_ZARR", 4405, 0, 0.0, 600.7375709421107, 281, 18940, 411.0, 1074.4, 1304.6999999999998, 2576.9399999999996, 36.22681853694642, 399.9245622635594, 10.648703495723508], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 334,111; received: 295,317)", 1, 0.07358351729212656, 9.618899213174045E-4], "isController": false}, {"data": ["502/Bad Gateway", 1262, 92.86239882266372, 1.2139050807025644], "isController": false}, {"data": ["504/Gateway Time-out", 90, 6.622516556291391, 0.0865700929185664], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 334,116; received: 295,317)", 3, 0.22075055187637968, 0.002885669763952213], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 334,110; received: 295,317)", 3, 0.22075055187637968, 0.002885669763952213], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 103962, 1359, "502/Bad Gateway", 1262, "504/Gateway Time-out", 90, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 334,116; received: 295,317)", 3, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 334,110; received: 295,317)", 3, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 334,111; received: 295,317)", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_100threads_ZARR", 2855, 132, "502/Bad Gateway", 129, "504/Gateway Time-out", 3, "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_50threads_ZARR", 5129, 5, "502/Bad Gateway", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_25threads_ZARR", 2272, 38, "502/Bad Gateway", 34, "504/Gateway Time-out", 4, "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_25threads_ZARR", 2580, 4, "502/Bad Gateway", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_50threads_ZARR", 2613, 25, "502/Bad Gateway", 25, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_50threads_ZARR", 4949, 10, "502/Bad Gateway", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_50threads_ZARR", 7299, 84, "502/Bad Gateway", 53, "504/Gateway Time-out", 28, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 334,116; received: 295,317)", 3, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_100threads_ZARR", 7587, 238, "502/Bad Gateway", 214, "504/Gateway Time-out", 24, "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_100threads_ZARR", 5369, 46, "502/Bad Gateway", 46, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_25threads_ZARR", 5261, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_100threads_ZARR", 4167, 267, "502/Bad Gateway", 267, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_25threads_ZARR", 4472, 3, "502/Bad Gateway", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_50threads_ZARR", 1389, 6, "502/Bad Gateway", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_100threads_ZARR", 8135, 98, "502/Bad Gateway", 98, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_100threads_ZARR", 8345, 272, "502/Bad Gateway", 239, "504/Gateway Time-out", 29, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 334,110; received: 295,317)", 3, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 334,111; received: 295,317)", 1, "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_25threads_ZARR", 3424, 3, "502/Bad Gateway", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_100threads_ZARR", 2029, 69, "502/Bad Gateway", 67, "504/Gateway Time-out", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_5threads_ZARR", 517, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_50threads_ZARR", 7062, 57, "502/Bad Gateway", 57, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
