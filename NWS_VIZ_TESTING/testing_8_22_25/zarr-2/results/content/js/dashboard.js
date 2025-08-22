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

    var data = {"OkPercent": 97.11365451157839, "KoPercent": 2.886345488421613};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.601224381155177, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8366983372921615, 500, 1500, "HREF_ResLevel-1_Time-All_5threads_ZARR"], "isController": false}, {"data": [0.10458348490360131, 500, 1500, "NBM_ResLevel-1_Times-One_100threads_ZARR"], "isController": false}, {"data": [0.6012682551883167, 500, 1500, "HREF_ResLevel-1_Times-One_50threads_ZARR"], "isController": false}, {"data": [0.39266900790166814, 500, 1500, "NBM_ResLevel-1_Times-One_25threads_ZARR"], "isController": false}, {"data": [0.6655574043261231, 500, 1500, "HREF_ResLevel-1_Times-One_25threads_ZARR"], "isController": false}, {"data": [0.24249812453113279, 500, 1500, "NBM_ResLevel-1_Times-One_50threads_ZARR"], "isController": false}, {"data": [0.552765292163377, 500, 1500, "HREF_ResLevel-1_Time-All_50threads_ZARR"], "isController": false}, {"data": [0.7954620190726734, 500, 1500, "LREF_ResLevel-1_Time-All_50threads_ZARR"], "isController": false}, {"data": [0.16997167138810199, 500, 1500, "NBM_ResLevel-1_Time-All_25threads_ZARR"], "isController": false}, {"data": [0.6288651448923426, 500, 1500, "MRMS_ResLevel-1_Times-One_100threads_ZARR"], "isController": false}, {"data": [0.32407752515840477, 500, 1500, "HREF_ResLevel-1_Times-One_100threads_ZARR"], "isController": false}, {"data": [0.846116504854369, 500, 1500, "MRMS_ResLevel-1_Times-One_25threads_ZARR"], "isController": false}, {"data": [0.3769802464306669, 500, 1500, "HREF_ResLevel-1_Time-All_100threads_ZARR"], "isController": false}, {"data": [0.7791777188328912, 500, 1500, "LREF_ResLevel-1_Times-One_50threads_ZARR"], "isController": false}, {"data": [0.8004750593824228, 500, 1500, "HREF_ResLevel-1_Times-One_5threads_ZARR"], "isController": false}, {"data": [0.8259073842302879, 500, 1500, "LREF_ResLevel-1_Time-All_25threads_ZARR"], "isController": false}, {"data": [0.04206008583690987, 500, 1500, "NBM_ResLevel-1_Time-All_50threads_ZARR"], "isController": false}, {"data": [0.44600431965442766, 500, 1500, "NBM_ResLevel-1_Time-All_5threads_ZARR"], "isController": false}, {"data": [0.5712910765846281, 500, 1500, "LREF_ResLevel-1_Times-One_100threads_ZARR"], "isController": false}, {"data": [0.8884986830553117, 500, 1500, "MRMS_ResLevel-1_Times-One_5threads_ZARR"], "isController": false}, {"data": [0.6319406764333514, 500, 1500, "LREF_ResLevel-1_Time-All_100threads_ZARR"], "isController": false}, {"data": [0.8524324324324324, 500, 1500, "LREF_ResLevel-1_Time-All_5threads_ZARR"], "isController": false}, {"data": [0.7230880230880231, 500, 1500, "HREF_ResLevel-1_Time-All_25threads_ZARR"], "isController": false}, {"data": [0.03563129357087529, 500, 1500, "NBM_ResLevel-1_Time-All_100threads_ZARR"], "isController": false}, {"data": [0.4457092819614711, 500, 1500, "NBM_ResLevel-1_Times-One_5threads_ZARR"], "isController": false}, {"data": [0.7680897818238895, 500, 1500, "MRMS_ResLevel-1_Times-One_50threads_ZARR"], "isController": false}, {"data": [0.8338399189463019, 500, 1500, "LREF_ResLevel-1_Times-One_5threads_ZARR"], "isController": false}, {"data": [0.7911105178857448, 500, 1500, "LREF_ResLevel-1_Times-One_25threads_ZARR"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 93925, 2711, 2.886345488421613, 1472.0658929997421, 5, 95551, 811.0, 5839.800000000003, 12346.950000000015, 27449.710000000046, 25.59733705935721, 2347.3692210366503, 7.248938718871335], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["HREF_ResLevel-1_Time-All_5threads_ZARR", 842, 2, 0.2375296912114014, 644.3966745843228, 32, 6720, 444.0, 1031.7, 1498.5499999999997, 4348.5999999999885, 6.959252830812464, 940.2213154237954, 1.855347678527151], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_100threads_ZARR", 2749, 130, 4.728992360858494, 4267.618042924704, 6, 75444, 2954.0, 7679.0, 11161.0, 34275.5, 18.191563984806173, 161.3971449638187, 5.453916155601069], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_50threads_ZARR", 5204, 213, 4.093005380476557, 1017.5728285933906, 5, 26272, 546.0, 2103.0, 2999.75, 6264.949999999985, 42.41169663086176, 250.34362183124563, 12.508137092304935], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_25threads_ZARR", 2278, 10, 0.43898156277436345, 1165.136084284462, 41, 13193, 815.0, 2014.1, 2967.9999999999945, 4900.4900000000025, 18.74557693257188, 173.59326204822995, 5.620011834276921], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_25threads_ZARR", 3005, 9, 0.2995008319467554, 882.4073211314468, 112, 15450, 519.0, 1692.2000000000003, 2335.0999999999995, 4407.320000000007, 24.495019481895692, 149.99813090468544, 7.224117073762207], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_50threads_ZARR", 2666, 25, 0.9377344336084021, 1997.9921230307555, 455, 28993, 1544.0, 3549.800000000001, 4969.750000000002, 8011.629999999941, 21.814016282780347, 201.01593183631306, 6.539944334778873], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_50threads_ZARR", 5117, 19, 0.3713113152237639, 1033.9699042407676, 18, 17053, 676.0, 2086.5999999999995, 2965.899999999995, 4608.559999999998, 40.327220282613666, 5440.990210223959, 10.751299938626495], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_50threads_ZARR", 6082, 140, 2.3018743834265045, 888.4113778362381, 5, 34579, 393.0, 1342.3999999999996, 2497.4499999999907, 10007.0, 45.4817385061769, 14507.762497581307, 12.08108679070324], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_25threads_ZARR", 1412, 0, 0.0, 1891.9050991501422, 829, 6770, 1778.5, 2861.4, 3240.35, 4250.8399999999965, 11.571209650323288, 2297.601545790071, 3.141402619911987], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_100threads_ZARR", 6177, 310, 5.0186174518374616, 1808.1324267443763, 5, 81384, 517.0, 4665.399999999998, 6594.699999999985, 25292.240000000013, 34.440845046863416, 622.9027028355014, 9.921923133617877], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_100threads_ZARR", 5366, 62, 1.1554230339172569, 1976.9506149832284, 37, 17479, 1456.5, 4354.0, 5373.549999999997, 7667.059999999994, 43.29269768530097, 262.9435284713426, 12.767963575157124], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_25threads_ZARR", 4120, 22, 0.5339805825242718, 651.1912621359223, 6, 48235, 271.0, 1111.8000000000002, 1886.5999999999985, 6436.269999999992, 32.17442913816262, 608.8568694260925, 9.269000581794897], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_100threads_ZARR", 5113, 256, 5.00684529630354, 2085.3428515548567, 5, 34086, 1112.0, 4557.800000000003, 6498.200000000001, 18859.37999999999, 38.73837015486256, 4983.907132241662, 10.327710011989726], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_50threads_ZARR", 6032, 55, 0.9118037135278515, 897.3967175066298, 6, 32746, 386.0, 1482.6999999999998, 2494.7499999999973, 9856.060000000009, 45.69004696258143, 499.95890182358727, 13.430375132555673], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_5threads_ZARR", 842, 1, 0.1187648456057007, 642.9216152019003, 126, 4321, 410.0, 1231.4000000000005, 1707.7999999999993, 3055.3299999999954, 6.982047348563373, 42.82545820981384, 2.0591584953770887], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_25threads_ZARR", 3995, 65, 1.6270337922403004, 665.5326658322899, 6, 27021, 383.0, 974.4000000000001, 1661.3999999999996, 5029.479999999999, 31.717173321054013, 10186.929841694488, 8.424874163404972], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_50threads_ZARR", 1165, 7, 0.6008583690987125, 4615.918454935624, 9, 27118, 3059.0, 10059.8, 12569.400000000001, 18048.879999999986, 9.382449584433992, 1851.819027761279, 2.547188461399072], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_5threads_ZARR", 463, 0, 0.0, 1170.2440604751614, 802, 6459, 1050.0, 1546.0, 1995.7999999999993, 2802.6400000000012, 3.8396470510183773, 762.4027017084563, 1.0424041798663173], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_100threads_ZARR", 7273, 632, 8.689674137219853, 1587.3046885741767, 5, 40974, 554.0, 3355.2000000000025, 5735.199999999997, 21009.500000000015, 45.186823564496684, 456.55132954330116, 13.282454973548342], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_5threads_ZARR", 1139, 1, 0.08779631255487269, 474.7971905179984, 157, 11784, 229.0, 706.0, 1615.0, 5000.599999999993, 9.456755477694843, 179.7627511691215, 2.724358267499979], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_100threads_ZARR", 5529, 577, 10.435883523241092, 2082.6069813709514, 6, 95551, 470.0, 4593.0, 11236.5, 24995.99999999998, 28.570838005570515, 8355.494662951376, 7.561676760421457], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_5threads_ZARR", 925, 1, 0.10810810810810811, 585.276756756757, 181, 23318, 353.0, 814.4, 1287.1, 4174.920000000004, 7.668266640138609, 2500.8649225116474, 2.036883326286818], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_25threads_ZARR", 3465, 15, 0.4329004329004329, 763.6704184704206, 6, 27510, 495.0, 1225.0, 1796.3999999999996, 4149.560000000005, 28.69137519872814, 3868.681171297964, 7.64916545825467], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_100threads_ZARR", 1291, 0, 0.0, 8660.850503485666, 869, 70568, 3398.0, 22467.399999999994, 28650.599999999948, 45429.75999999987, 9.836715100995862, 1953.188894776769, 2.6705144512469237], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_5threads_ZARR", 571, 0, 0.0, 950.5901926444837, 587, 4650, 710.0, 1521.2000000000003, 2333.7999999999997, 3642.359999999997, 4.725178332036875, 43.94323560154996, 1.4166306132180864], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_50threads_ZARR", 6371, 135, 2.118976612776644, 834.6254905038465, 5, 41358, 354.0, 1606.8000000000002, 3490.7999999999993, 7477.879999999982, 50.616518892808344, 942.9734610365622, 14.581907298221154], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_5threads_ZARR", 987, 2, 0.20263424518743667, 548.560283687944, 65, 11720, 331.0, 960.400000000001, 1434.5999999999995, 2882.0, 8.168501200033104, 89.98639132717454, 2.401092637900356], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_25threads_ZARR", 3746, 22, 0.587293112653497, 712.9767752269089, 17, 32381, 367.0, 1330.3000000000002, 1958.5999999999985, 4628.299999999997, 30.29396304233553, 332.4814851552707, 8.904768433342769], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 334,111; received: 295,317)", 1, 0.03688675765400221, 0.001064679265371307], "isController": false}, {"data": ["502/Bad Gateway", 2615, 96.45887126521579, 2.7841362789459674], "isController": false}, {"data": ["504/Gateway Time-out", 76, 2.803393581704168, 0.08091562416821932], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 334,108; received: 295,317)", 8, 0.2950940612320177, 0.008517434122970456], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 334,110; received: 295,317)", 11, 0.40575433419402435, 0.011711471919084376], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 93925, 2711, "502/Bad Gateway", 2615, "504/Gateway Time-out", 76, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 334,110; received: 295,317)", 11, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 334,108; received: 295,317)", 8, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 334,111; received: 295,317)", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["HREF_ResLevel-1_Time-All_5threads_ZARR", 842, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_100threads_ZARR", 2749, 130, "502/Bad Gateway", 130, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_50threads_ZARR", 5204, 213, "502/Bad Gateway", 202, "504/Gateway Time-out", 11, "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_25threads_ZARR", 2278, 10, "502/Bad Gateway", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_25threads_ZARR", 3005, 9, "502/Bad Gateway", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_50threads_ZARR", 2666, 25, "502/Bad Gateway", 25, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_50threads_ZARR", 5117, 19, "502/Bad Gateway", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_50threads_ZARR", 6082, 140, "502/Bad Gateway", 116, "504/Gateway Time-out", 24, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_100threads_ZARR", 6177, 310, "502/Bad Gateway", 310, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_100threads_ZARR", 5366, 62, "502/Bad Gateway", 62, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_25threads_ZARR", 4120, 22, "502/Bad Gateway", 22, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_100threads_ZARR", 5113, 256, "502/Bad Gateway", 256, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_50threads_ZARR", 6032, 55, "502/Bad Gateway", 55, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_5threads_ZARR", 842, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_25threads_ZARR", 3995, 65, "502/Bad Gateway", 65, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_50threads_ZARR", 1165, 7, "502/Bad Gateway", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_100threads_ZARR", 7273, 632, "502/Bad Gateway", 617, "504/Gateway Time-out", 15, "", "", "", "", "", ""], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_5threads_ZARR", 1139, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_100threads_ZARR", 5529, 577, "502/Bad Gateway", 531, "504/Gateway Time-out", 26, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 334,110; received: 295,317)", 11, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 334,108; received: 295,317)", 8, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of Content-Length delimited message body (expected: 334,111; received: 295,317)", 1], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_5threads_ZARR", 925, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_25threads_ZARR", 3465, 15, "502/Bad Gateway", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_50threads_ZARR", 6371, 135, "502/Bad Gateway", 135, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_5threads_ZARR", 987, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_25threads_ZARR", 3746, 22, "502/Bad Gateway", 22, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
