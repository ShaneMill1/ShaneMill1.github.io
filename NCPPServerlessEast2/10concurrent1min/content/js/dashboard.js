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

    var data = {"OkPercent": 98.9143022582513, "KoPercent": 1.0856977417486973};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.12637521713954836, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "NCPPServerlessEastGFSPosition-fulltime-fullzedd"], "isController": false}, {"data": [0.2386058981233244, 500, 1500, "NCPPServerlessEastGFSAreaUS-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSTrajectory20waypoints"], "isController": false}, {"data": [0.3111979166666667, 500, 1500, "NCPPServerlessEastGFSPosition-fulltime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaGlobe-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastCollections"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSPosition-fulltime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastNWM-position-1day"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSPosition-1time-fullzedd"], "isController": false}, {"data": [0.0017421602787456446, 500, 1500, "NCPPServerlessEastGFSAreaHalfGlobe-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSTrajectory10waypoints"], "isController": false}, {"data": [0.3093994778067885, 500, 1500, "NCPPServerlessEastGFSPosition-halftime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSCorridor20waypoints"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSCorridor5waypoints"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaUS-1time-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaUS-fulltime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaUS-halftime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastNWM-position-1hour"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSInstances"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSPosition-halftime-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaTexas-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSPosition-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastNWM-position-1month"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaUS-1time-halfzedd"], "isController": false}, {"data": [0.13725490196078433, 500, 1500, "NCPPServerlessEastGFSAreaTexas-halftime-1zedd"], "isController": false}, {"data": [0.4909983633387889, 500, 1500, "NCPPServerlessEastGFSCollectionMeta"], "isController": false}, {"data": [0.04505813953488372, 500, 1500, "NCPPServerlessEastGFSAreaTexas-fulltime-1zedd"], "isController": false}, {"data": [0.28690807799442897, 500, 1500, "NCPPServerlessEastGFSPosition-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSCorridor10waypoints"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaTexas-1time-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSPosition-halftime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaTexas-halftime-halfzedd"], "isController": false}, {"data": [0.22413793103448276, 500, 1500, "NCPPServerlessEastGFSAreaTexas-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSTrajectory5waypoints"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 13816, 150, 1.0856977417486973, 2863.9221192820073, 604, 29148, 2026.5, 4204.0, 6056.0, 21488.67, 6.232066907210496, 3347.2028833148547, 4.059457280503004], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NCPPServerlessEastGFSPosition-fulltime-fullzedd", 308, 0, 0.0, 3712.1233766233736, 3166, 4919, 3707.0, 4005.2000000000007, 4079.0, 4278.0, 4.86126456011869, 937.0467225922536, 2.0508459863000725], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-1time-1zedd", 746, 0, 0.0, 1513.1554959785537, 1020, 2542, 1507.0, 1650.2000000000003, 1694.0, 1890.0, 12.133632607917765, 568.7047822431769, 13.697733686282165], "isController": false}, {"data": ["NCPPServerlessEastGFSTrajectory20waypoints", 350, 0, 0.0, 3273.0628571428547, 2631, 5294, 3241.0, 3531.0, 3695.0, 4343.0, 5.5420084238528045, 42.620426111172684, 9.649805683329639], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-fulltime-1zedd", 768, 0, 0.0, 1466.497395833333, 1103, 2501, 1477.5, 1600.0, 1638.0, 1758.0, 12.516909236109978, 175.60343563081636, 5.341688804863341], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-1time-1zedd", 536, 0, 0.0, 2120.944029850748, 1733, 2794, 2112.0, 2300.0, 2378.15, 2627.0, 8.628461043142304, 17248.706510584354, 4.491181382807469], "isController": false}, {"data": ["NCPPServerlessEastCollections", 60, 0, 0.0, 22957.1, 21201, 26695, 22166.0, 25372.2, 25476.0, 26695.0, 0.7808941237717186, 26.34221261469383, 0.12735285026355178], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-fulltime-halfzedd", 452, 0, 0.0, 2507.831858407078, 2223, 3041, 2488.0, 2680.0, 2776.649999999999, 2930.5799999999995, 7.284330631254936, 751.5024813258449, 3.1015314015890154], "isController": false}, {"data": ["NCPPServerlessEastNWM-position-1day", 110, 0, 0.0, 11208.963636363635, 8731, 13241, 11249.0, 12297.0, 12560.0, 13241.0, 1.5832121936124584, 6.809049317059831, 0.5488675085277566], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-1time-fullzedd", 306, 0, 0.0, 3724.000000000001, 3188, 10215, 3608.0, 3988.6, 4602.0, 7006.0, 4.796087896931131, 26.49557542279239, 2.0233495815178206], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-1time-1zedd", 574, 0, 0.0, 1966.3693379790948, 1487, 4942, 1861.0, 2107.0, 2421.5, 4744.0, 9.313645951646926, 8204.339784804479, 4.7841579790686355], "isController": false}, {"data": ["NCPPServerlessEastGFSTrajectory10waypoints", 334, 0, 0.0, 3431.5808383233525, 3021, 4178, 3378.0, 3784.0, 3901.0, 4079.0, 5.243410414606195, 27.676399698189925, 5.391905436113597], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-halftime-1zedd", 766, 0, 0.0, 1471.9921671018294, 1012, 1994, 1475.0, 1622.0, 1700.0, 1857.0, 12.493068467234236, 106.58149036109208, 5.3315145704896105], "isController": false}, {"data": ["NCPPServerlessEastGFSCorridor20waypoints", 70, 70, 100.0, 16670.42857142857, 6483, 21398, 18494.0, 20501.0, 20700.0, 21398.0, 1.032539752780482, 0.5172782159925657, 1.8613949058913768], "isController": false}, {"data": ["NCPPServerlessEastGFSCorridor5waypoints", 44, 40, 90.9090909090909, 29035.272727272724, 27950, 29148, 29070.0, 29145.5, 29147.5, 29148.0, 0.5048824427130547, 0.8911641269549851, 0.378168782774329], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-1time-fullzedd", 198, 0, 0.0, 5892.777777777782, 5247, 7022, 5839.0, 6334.0, 6541.0, 7022.0, 3.0070620396385452, 5203.142352541955, 3.3800082105702787], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-fulltime-1zedd", 366, 0, 0.0, 3125.67213114754, 2521, 6007, 3053.0, 3510.2, 4036.5499999999965, 4986.0, 5.83071800672285, 31496.035440330725, 6.582333999776967], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-halftime-1zedd", 512, 0, 0.0, 2214.1132812500023, 1800, 3374, 2190.0, 2434.0, 2519.0, 2714.0, 8.276887760875539, 22546.83231219386, 9.343830323800901], "isController": false}, {"data": ["NCPPServerlessEastNWM-position-1hour", 106, 0, 0.0, 11913.698113207545, 9744, 17067, 11479.0, 14096.3, 15422.0, 17067.0, 1.5064093454225054, 3.6895260139840262, 0.5222415211181537], "isController": false}, {"data": ["NCPPServerlessEastGFSInstances", 384, 0, 0.0, 2969.749999999998, 2590, 5805, 2761.0, 3183.5, 5364.0, 5749.0, 6.13918687748805, 5.335816719691762, 1.4448672240963085], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-halftime-fullzedd", 292, 0, 0.0, 3881.78082191781, 3222, 6929, 3716.5, 4179.0, 5547.149999999997, 6818.329999999999, 4.653757271495737, 461.26278737349594, 1.963303848912264], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-1time-halfzedd", 342, 0, 0.0, 3376.5614035087715, 2923, 4319, 3337.0, 3723.1, 3866.0, 4243.0, 5.369928400954653, 414.9266063171241, 4.116595502684964], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-1time-halfzedd", 460, 0, 0.0, 2468.36086956522, 2048, 3574, 2445.0, 2672.0000000000005, 2739.0, 2877.479999999998, 7.422227959210017, 31.98661326561895, 3.16024549825739], "isController": false}, {"data": ["NCPPServerlessEastNWM-position-1month", 108, 0, 0.0, 11475.388888888889, 10437, 12663, 11537.5, 12322.2, 12378.0, 12663.0, 1.5270845410969558, 83.37821942649492, 0.5294091914935736], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-1time-halfzedd", 322, 0, 0.0, 3563.701863354038, 3148, 4466, 3515.0, 3918.0, 4041.85, 4433.0, 5.090989580862939, 4514.658735958275, 5.74227828700849], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-halftime-1zedd", 714, 0, 0.0, 1577.179271708683, 1296, 1908, 1573.0, 1725.0, 1798.0, 1900.0, 11.64535490605428, 2707.6587398266247, 8.938719683748696], "isController": false}, {"data": ["NCPPServerlessEastGFSCollectionMeta", 1222, 0, 0.0, 912.9067103109647, 604, 6906, 804.0, 978.7, 1085.0, 6386.919999999998, 20.163352858675026, 153.25329619049583, 4.824239697632208], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-fulltime-1zedd", 688, 0, 0.0, 1647.281976744186, 1320, 2432, 1627.5, 1797.4, 1868.9499999999996, 2107.490000000002, 11.164843724643795, 5117.096471227808, 8.5698898120801], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-1time-1zedd", 718, 0, 0.0, 1561.0584958217257, 1141, 4511, 1486.0, 1678.0, 1811.0, 4277.0, 11.740658981277083, 35.87550971915624, 4.666453325566184], "isController": false}, {"data": ["NCPPServerlessEastGFSCorridor10waypoints", 44, 40, 90.9090909090909, 28916.681818181813, 26496, 29145, 29072.0, 29143.5, 29144.75, 29145.0, 0.5117409660273781, 1.2471868784964122, 0.5652138990009421], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-1time-fullzedd", 214, 0, 0.0, 5426.9252336448635, 4660, 6540, 5387.0, 5906.0, 6068.0, 6507.149999999999, 3.322929768171302, 491.3977097599416, 2.534382957950964], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-halftime-halfzedd", 432, 0, 0.0, 2630.9259259259265, 2183, 4489, 2551.0, 2981.0, 3577.0, 3991.810000000001, 6.936750325160172, 372.66742738089505, 2.9535382243846042], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-halftime-halfzedd", 222, 0, 0.0, 5325.1981981981935, 4533, 7884, 5183.0, 5927.500000000002, 6347.0, 7840.990000000002, 3.4089338636119346, 16254.515733688557, 2.6132940263040707], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-1time-1zedd", 696, 0, 0.0, 1616.2241379310337, 1221, 4916, 1517.5, 1734.0, 1992.249999999999, 4521.42, 11.35436718979412, 78.62677513948253, 8.71536387810369], "isController": false}, {"data": ["NCPPServerlessEastGFSTrajectory5waypoints", 352, 0, 0.0, 3197.1079545454536, 2399, 8566, 2706.0, 5388.0, 7531.0, 8455.0, 5.677694081971708, 23.15434617804087, 3.8812361888478475], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Timeout", 80, 53.333333333333336, 0.5790387955993052], "isController": false}, {"data": ["502/Bad Gateway", 70, 46.666666666666664, 0.506658946149392], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 13816, 150, "504/Gateway Timeout", 80, "502/Bad Gateway", 70, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSCorridor20waypoints", 70, 70, "502/Bad Gateway", 70, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessEastGFSCorridor5waypoints", 44, 40, "504/Gateway Timeout", 40, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSCorridor10waypoints", 44, 40, "504/Gateway Timeout", 40, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
