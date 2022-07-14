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

    var data = {"OkPercent": 98.75494592455816, "KoPercent": 1.245054075441836};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5490371933526774, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "NCPPServerlessWestGFSPosition-1time-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSTrajectory20waypoints"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSCorridor5waypoints"], "isController": false}, {"data": [0.6453362255965293, 500, 1500, "NCPPServerlessWestGFSAreaGlobe-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSPosition-halftime-fullzedd"], "isController": false}, {"data": [0.7328838174273858, 500, 1500, "NCPPServerlessWestGFSPosition-1time-1zedd"], "isController": false}, {"data": [0.7415621986499518, 500, 1500, "NCPPServerlessWestGFSPosition-fulltime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSCorridor10waypoints"], "isController": false}, {"data": [0.7917833800186741, 500, 1500, "NCPPServerlessWestGFSPosition-halftime-1zedd"], "isController": false}, {"data": [0.7320038910505836, 500, 1500, "NCPPServerlessWestGFSAreaTexas-halftime-1zedd"], "isController": false}, {"data": [0.7331378299120235, 500, 1500, "NCPPServerlessWestGFSAreaTexas-fulltime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSCorridor20waypoints"], "isController": false}, {"data": [0.5188556566970091, 500, 1500, "NCPPServerlessWestGFSCollectionMeta"], "isController": false}, {"data": [0.49936868686868685, 500, 1500, "NCPPServerlessWestGFSAreaUS-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestNWM-position-1month"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSTrajectory5waypoints"], "isController": false}, {"data": [0.743680485338726, 500, 1500, "NCPPServerlessWestGFSAreaTexas-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestNWM-position-1hour"], "isController": false}, {"data": [0.019169329073482427, 500, 1500, "NCPPServerlessWestGFSPosition-fulltime-halfzedd"], "isController": false}, {"data": [0.7134207870837538, 500, 1500, "NCPPServerlessWestGFSAreaUS-1time-1zedd"], "isController": false}, {"data": [0.7333664349553128, 500, 1500, "NCPPServerlessWestGFSAreaHalfGlobe-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestCollections"], "isController": false}, {"data": [0.49934469200524245, 500, 1500, "NCPPServerlessWestGFSAreaTexas-1time-fullzedd"], "isController": false}, {"data": [0.7264705882352941, 500, 1500, "NCPPServerlessWestGFSAreaUS-halftime-1zedd"], "isController": false}, {"data": [0.49421965317919075, 500, 1500, "NCPPServerlessWestGFSAreaUS-1time-fullzedd"], "isController": false}, {"data": [0.5011862396204033, 500, 1500, "NCPPServerlessWestGFSAreaTexas-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSTrajectory10waypoints"], "isController": false}, {"data": [0.5005787037037037, 500, 1500, "NCPPServerlessWestGFSAreaTexas-halftime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSInstances"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSPosition-fulltime-fullzedd"], "isController": false}, {"data": [0.6834016393442623, 500, 1500, "NCPPServerlessWestGFSAreaUS-fulltime-1zedd"], "isController": false}, {"data": [0.015873015873015872, 500, 1500, "NCPPServerlessWestGFSPosition-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestNWM-position-1day"], "isController": false}, {"data": [0.041033434650455926, 500, 1500, "NCPPServerlessWestGFSPosition-halftime-halfzedd"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 37910, 472, 1.245054075441836, 1019.7111052492759, 383, 26171, 612.0, 2546.9000000000015, 3794.9500000000007, 5792.990000000002, 17.848449666053668, 95.21171864921699, 13.127037104094926], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NCPPServerlessWestGFSPosition-1time-fullzedd", 386, 0, 0.0, 2938.865284974093, 2472, 4398, 2911.0, 3209.7000000000003, 3655.0, 4387.0, 6.144637768827902, 24.764570382766358, 2.592269058724271], "isController": false}, {"data": ["NCPPServerlessWestGFSTrajectory20waypoints", 414, 0, 0.0, 2739.154589371981, 2290, 3970, 2700.0, 2991.0, 3294.25, 3719.9000000000015, 6.645904902558835, 51.103374221433846, 11.571922305920314], "isController": false}, {"data": ["NCPPServerlessWestGFSCorridor5waypoints", 282, 0, 0.0, 4097.66666666667, 3282, 9477, 3709.0, 4367.200000000001, 8965.099999999999, 9307.680000000004, 4.439476708490106, 63.60070636088852, 3.3252721048944442], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaGlobe-1time-1zedd", 1844, 0, 0.0, 607.4587852494584, 437, 1509, 567.0, 774.0, 834.75, 899.8499999999997, 30.33543356309737, 490.3734685253426, 15.789830165166894], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-halftime-fullzedd", 386, 0, 0.0, 2942.492227979274, 2469, 4007, 2947.0, 3223.3, 3304.0, 3681.0, 6.148650801236102, 24.780744000684955, 2.5939620567714807], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-1time-1zedd", 1928, 0, 0.0, 577.8153526970939, 410, 3930, 504.0, 685.2000000000003, 760.55, 3014.0, 31.914717518332754, 93.87414957540845, 12.68485354488421], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-fulltime-1zedd", 2074, 0, 0.0, 536.5284474445509, 383, 1652, 512.0, 660.0, 712.0, 800.0, 34.37531077004674, 101.11175394470779, 14.669932428232837], "isController": false}, {"data": ["NCPPServerlessWestGFSCorridor10waypoints", 266, 0, 0.0, 4311.0751879699255, 3628, 5666, 4249.0, 4757.200000000001, 5111.0, 5560.809999999998, 4.197304888440054, 91.12332517081137, 4.635890457837599], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-halftime-1zedd", 2142, 0, 0.0, 520.0494864612492, 386, 985, 478.0, 643.7, 693.0, 821.0, 35.39091930473862, 104.09907123620381, 15.103351304854272], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-halftime-1zedd", 2056, 0, 0.0, 543.023346303502, 411, 1116, 517.0, 673.0, 727.0, 855.1500000000003, 33.966628118288455, 114.30566454650587, 26.07204072360813], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-fulltime-1zedd", 2046, 0, 0.0, 545.1124144672528, 396, 1755, 516.0, 665.5999999999999, 737.2999999999997, 946.1799999999998, 33.54043376338093, 112.87142065294012, 25.744903259782628], "isController": false}, {"data": ["NCPPServerlessWestGFSCorridor20waypoints", 472, 472, 100.0, 2389.1525423728817, 1821, 4252, 2326.5, 2659.0, 3226.0, 3523.359999999997, 7.6012561397858125, 3.8080511715919156, 13.703045736371688], "isController": false}, {"data": ["NCPPServerlessWestGFSCollectionMeta", 1538, 0, 0.0, 726.5773732119644, 465, 7116, 625.0, 816.0, 950.8999999999992, 6343.0, 25.021556282232744, 190.17848881310297, 5.986602821432639], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-1time-halfzedd", 1584, 0, 0.0, 706.9065656565657, 509, 2168, 688.0, 864.0, 937.0, 1215.0, 25.553745140110024, 141.71847524480938, 28.82282777033894], "isController": false}, {"data": ["NCPPServerlessWestNWM-position-1month", 212, 0, 0.0, 5417.603773584907, 4801, 6267, 5405.0, 5790.0, 5879.95, 6240.610000000001, 3.3151935947957716, 8.109921831018953, 1.1493102794457997], "isController": false}, {"data": ["NCPPServerlessWestGFSTrajectory5waypoints", 472, 0, 0.0, 2409.0635593220354, 1794, 7811, 2180.5, 2447.0, 2997.0, 7397.529999999995, 7.592086215216343, 30.96889074312369, 5.189902686183046], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-1time-1zedd", 1978, 0, 0.0, 563.5904954499504, 404, 4113, 502.0, 664.0, 731.1999999999998, 2794.0, 32.693134111269046, 110.02005873772768, 25.09453458150144], "isController": false}, {"data": ["NCPPServerlessWestNWM-position-1hour", 186, 0, 0.0, 6353.784946236557, 4805, 12767, 5961.0, 8767.800000000001, 9881.0, 12767.0, 2.674604201716923, 6.542855005176652, 0.9272309488374099], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-fulltime-halfzedd", 626, 0, 0.0, 1798.9872204472854, 1426, 3376, 1732.0, 2026.3000000000006, 2423.0, 3033.6700000000033, 10.163822636424152, 35.6527840918316, 4.327565106914971], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-1time-1zedd", 1982, 0, 0.0, 564.1735620585274, 410, 1737, 551.0, 716.7, 765.0, 1069.0, 32.5515700959138, 162.09028898346145, 36.747670928590196], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaHalfGlobe-1time-1zedd", 2014, 0, 0.0, 553.5054617676262, 420, 1088, 518.0, 693.0, 748.25, 842.9499999999994, 33.315137379451805, 373.20111414032385, 17.113049083585594], "isController": false}, {"data": ["NCPPServerlessWestCollections", 60, 0, 0.0, 23280.900000000012, 21401, 26171, 22468.5, 25772.8, 25930.0, 26171.0, 0.747971128314447, 25.23160809117768, 0.12198357268409439], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-1time-fullzedd", 1526, 0, 0.0, 730.4180865006552, 551, 1991, 731.0, 898.0, 944.6499999999999, 1141.0, 25.208557033121334, 112.2814732695961, 19.22644828405055], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-halftime-1zedd", 2040, 0, 0.0, 547.948039215686, 401, 1044, 536.5, 678.9000000000001, 737.0, 815.1799999999998, 33.50303826572508, 166.82811730169158, 37.8217892921662], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-1time-fullzedd", 1384, 0, 0.0, 808.729768786127, 567, 2474, 781.0, 987.5, 1141.0, 1540.0, 22.785268599463297, 138.2691983174462, 25.611175935529545], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-1time-halfzedd", 1686, 0, 0.0, 659.8042704626331, 487, 1797, 664.0, 805.0, 845.0, 955.1299999999999, 27.93888575879097, 109.84565826649654, 21.41799347719816], "isController": false}, {"data": ["NCPPServerlessWestGFSTrajectory10waypoints", 398, 0, 0.0, 2884.9246231155757, 2479, 4541, 2846.0, 3173.0, 3285.0, 3800.0, 6.2876190777105485, 33.1635064831198, 6.465686414872273], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-halftime-halfzedd", 1728, 0, 0.0, 645.8101851851841, 493, 2591, 655.5, 782.2000000000003, 821.0, 920.0, 28.478665721772668, 111.96787909751636, 21.831789640226116], "isController": false}, {"data": ["NCPPServerlessWestGFSInstances", 356, 0, 0.0, 3194.528089887641, 2741, 6196, 2995.0, 3414.0, 5702.0, 6053.0, 5.6694217508320985, 4.927524763906805, 1.3343072675298202], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-fulltime-fullzedd", 390, 0, 0.0, 2938.774358974359, 2478, 4106, 2957.0, 3213.0, 3294.0, 4064.0, 6.202388714833251, 24.997322486442215, 2.616632739070278], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-fulltime-1zedd", 1952, 0, 0.0, 570.8719262295087, 412, 1706, 559.0, 710.0, 765.0, 910.0, 32.21813260270355, 160.42993959100136, 36.3712512585208], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-1time-halfzedd", 630, 0, 0.0, 1789.7460317460318, 1456, 2970, 1773.0, 1970.0, 2078.0, 2580.7499999999777, 10.236745040053297, 35.90858221081195, 4.358614099085193], "isController": false}, {"data": ["NCPPServerlessWestNWM-position-1day", 214, 0, 0.0, 5472.214953271027, 4907, 6485, 5437.0, 5817.0, 5917.0, 6468.799999999999, 3.3003300330033003, 8.073561262376238, 1.144157384488449], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-halftime-halfzedd", 658, 0, 0.0, 1717.9696048632206, 1420, 3624, 1708.0, 1904.0, 1948.2499999999998, 2096.74, 10.71434386856203, 37.58390935144025, 4.561966725286178], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 472, 100.0, 1.245054075441836], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 37910, 472, "502/Bad Gateway", 472, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessWestGFSCorridor20waypoints", 472, 472, "502/Bad Gateway", 472, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
