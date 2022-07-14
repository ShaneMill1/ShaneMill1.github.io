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

    var data = {"OkPercent": 98.90155536068676, "KoPercent": 1.0984446393132414};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5937831725665759, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "NCPPServerlessWestGFSPosition-1time-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSTrajectory20waypoints"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSCorridor5waypoints"], "isController": false}, {"data": [0.653072625698324, 500, 1500, "NCPPServerlessWestGFSAreaGlobe-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSPosition-halftime-fullzedd"], "isController": false}, {"data": [0.6929175475687104, 500, 1500, "NCPPServerlessWestGFSPosition-1time-1zedd"], "isController": false}, {"data": [0.7032032032032032, 500, 1500, "NCPPServerlessWestGFSPosition-fulltime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSCorridor10waypoints"], "isController": false}, {"data": [0.7098890010090817, 500, 1500, "NCPPServerlessWestGFSPosition-halftime-1zedd"], "isController": false}, {"data": [0.6643318965517241, 500, 1500, "NCPPServerlessWestGFSAreaTexas-halftime-1zedd"], "isController": false}, {"data": [0.7334975369458128, 500, 1500, "NCPPServerlessWestGFSAreaTexas-fulltime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSCorridor20waypoints"], "isController": false}, {"data": [0.5564320388349514, 500, 1500, "NCPPServerlessWestGFSCollectionMeta"], "isController": false}, {"data": [0.5006009615384616, 500, 1500, "NCPPServerlessWestGFSAreaUS-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestNWM-position-1month"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSTrajectory5waypoints"], "isController": false}, {"data": [0.7244582043343654, 500, 1500, "NCPPServerlessWestGFSAreaTexas-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestNWM-position-1hour"], "isController": false}, {"data": [0.006430868167202572, 500, 1500, "NCPPServerlessWestGFSPosition-fulltime-halfzedd"], "isController": false}, {"data": [0.7236842105263158, 500, 1500, "NCPPServerlessWestGFSAreaUS-1time-1zedd"], "isController": false}, {"data": [0.6568627450980392, 500, 1500, "NCPPServerlessWestGFSAreaHalfGlobe-1time-1zedd"], "isController": false}, {"data": [0.9894412670479542, 500, 1500, "NCPPServerlessWestCollections"], "isController": false}, {"data": [0.49933774834437084, 500, 1500, "NCPPServerlessWestGFSAreaTexas-1time-fullzedd"], "isController": false}, {"data": [0.6191827468785471, 500, 1500, "NCPPServerlessWestGFSAreaUS-halftime-1zedd"], "isController": false}, {"data": [0.5, 500, 1500, "NCPPServerlessWestGFSAreaUS-1time-fullzedd"], "isController": false}, {"data": [0.5017964071856288, 500, 1500, "NCPPServerlessWestGFSAreaTexas-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSTrajectory10waypoints"], "isController": false}, {"data": [0.5011764705882353, 500, 1500, "NCPPServerlessWestGFSAreaTexas-halftime-halfzedd"], "isController": false}, {"data": [0.845082680591819, 500, 1500, "NCPPServerlessWestGFSInstances"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSPosition-fulltime-fullzedd"], "isController": false}, {"data": [0.6478711162255466, 500, 1500, "NCPPServerlessWestGFSAreaUS-fulltime-1zedd"], "isController": false}, {"data": [0.00487012987012987, 500, 1500, "NCPPServerlessWestGFSPosition-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestNWM-position-1day"], "isController": false}, {"data": [0.008090614886731391, 500, 1500, "NCPPServerlessWestGFSPosition-halftime-halfzedd"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 43334, 476, 1.0984446393132414, 884.976923431947, 158, 11774, 633.0, 2531.9000000000015, 3673.600000000006, 5681.990000000002, 20.605820832925186, 167.40417931775255, 13.459983489939125], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NCPPServerlessWestGFSPosition-1time-fullzedd", 376, 0, 0.0, 3029.3138297872333, 2494, 4092, 3039.0, 3352.0, 3455.35, 3931.0, 5.965413295256227, 24.042246747580517, 2.5166587339362207], "isController": false}, {"data": ["NCPPServerlessWestGFSTrajectory20waypoints", 424, 0, 0.0, 2677.6415094339623, 2289, 6537, 2606.0, 2956.0, 3189.0, 3638.25, 6.814967211006815, 52.40337091744889, 11.866295446508936], "isController": false}, {"data": ["NCPPServerlessWestGFSCorridor5waypoints", 296, 0, 0.0, 3881.7567567567594, 3008, 9840, 3504.5, 4211.0, 8374.049999999996, 9068.849999999979, 4.664061515189713, 66.81814690218077, 3.493491388818858], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaGlobe-1time-1zedd", 1790, 0, 0.0, 622.3888268156421, 419, 1297, 613.0, 809.0, 871.0, 980.0, 29.545266980275645, 477.60039484814723, 15.378542285631756], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-halftime-fullzedd", 364, 0, 0.0, 3119.478021978018, 2497, 4429, 3041.0, 3554.5, 3922.0, 4384.0, 5.788804071246819, 23.33046328323791, 2.442151717557252], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-1time-1zedd", 1892, 0, 0.0, 589.8139534883721, 397, 3202, 563.0, 732.0, 824.3999999999996, 1496.099999999998, 31.25, 91.9189453125, 12.420654296875], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-fulltime-1zedd", 1998, 0, 0.0, 559.1201201201197, 403, 1109, 545.0, 696.0, 754.0, 870.0, 32.96812091611115, 96.97263691340505, 14.069403164395089], "isController": false}, {"data": ["NCPPServerlessWestGFSCorridor10waypoints", 270, 0, 0.0, 4258.592592592595, 3661, 5368, 4184.0, 4795.0, 5015.0, 5252.270000000003, 4.241481690937367, 92.0824018273717, 4.684683391064612], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-halftime-1zedd", 1982, 0, 0.0, 564.2552976791128, 400, 1688, 549.0, 696.7, 739.0, 1095.0, 32.30012059580848, 95.00777659626479, 13.784328808953424], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-halftime-1zedd", 1856, 0, 0.0, 600.5754310344855, 404, 1795, 583.0, 784.0, 889.2999999999997, 1130.330000000002, 30.643749896808494, 103.12340053164264, 23.521472088761207], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-fulltime-1zedd", 2030, 0, 0.0, 549.0581280788175, 398, 1064, 524.0, 686.0, 740.0, 870.8300000000004, 33.59203058033128, 113.04505603498205, 25.784507847793353], "isController": false}, {"data": ["NCPPServerlessWestGFSCorridor20waypoints", 476, 476, 100.0, 2414.4033613445404, 1927, 3880, 2343.0, 2663.0, 3166.0, 3565.830000000002, 7.484394408717119, 3.749506183273322, 13.492375076652149], "isController": false}, {"data": ["NCPPServerlessWestGFSCollectionMeta", 1648, 0, 0.0, 677.7026699029122, 440, 7139, 578.5, 771.3000000000004, 866.0999999999999, 6132.629999999998, 27.182608408794763, 206.6037512164547, 6.50365142593234], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-1time-halfzedd", 1664, 0, 0.0, 670.3473557692303, 491, 1574, 662.0, 824.0, 906.0, 1140.049999999998, 27.47325320301149, 152.3638720116233, 30.987897899881126], "isController": false}, {"data": ["NCPPServerlessWestNWM-position-1month", 210, 0, 0.0, 5433.057142857145, 4911, 8108, 5339.0, 5821.0, 6034.149999999999, 7990.189999999985, 3.307659594575438, 8.09149148868308, 1.1466983946037896], "isController": false}, {"data": ["NCPPServerlessWestGFSTrajectory5waypoints", 478, 0, 0.0, 2367.1548117154807, 1819, 7397, 2129.0, 2601.0, 3024.0, 7363.36, 7.699246182591328, 31.406007133480443, 5.26315657013079], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-1time-1zedd", 1938, 0, 0.0, 575.8988648090829, 404, 3852, 519.0, 693.0, 754.1999999999998, 2118.0, 31.96595576228413, 107.57293316096788, 24.536368387847], "isController": false}, {"data": ["NCPPServerlessWestNWM-position-1hour", 190, 0, 0.0, 6185.263157894734, 4846, 11774, 5759.0, 8507.0, 9779.0, 11774.0, 2.914602156805596, 7.12995937773244, 1.0104333649081902], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-fulltime-halfzedd", 622, 0, 0.0, 1814.6559485530559, 1451, 2487, 1800.0, 2058.7, 2090.0, 2317.62, 10.034523924757202, 35.19922845481238, 4.272512139838028], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-1time-1zedd", 1976, 0, 0.0, 564.5587044534395, 398, 1682, 534.0, 705.0, 779.2999999999997, 1060.0, 32.57178650314839, 162.19095642534535, 36.77049335706986], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaHalfGlobe-1time-1zedd", 1938, 0, 0.0, 577.8059855521159, 401, 1619, 558.0, 712.0, 768.0, 894.0, 31.65942431469925, 354.65357061905775, 16.262555849152154], "isController": false}, {"data": ["NCPPServerlessWestCollections", 4546, 0, 0.0, 244.33611966563944, 158, 2142, 208.0, 409.0, 465.0, 522.0, 75.57772236076475, 2549.4934213944307, 12.325663705320034], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-1time-fullzedd", 1510, 0, 0.0, 740.5894039735089, 558, 1879, 740.0, 890.0, 944.0, 1052.0, 24.617290793785358, 109.64791338911623, 18.775492294869498], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-halftime-1zedd", 1762, 0, 0.0, 634.1691259931895, 412, 1948, 606.0, 816.2000000000003, 971.7499999999986, 1456.0, 28.714371852745142, 142.98299030971432, 32.415833849388065], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-1time-fullzedd", 1494, 0, 0.0, 747.5261044176708, 560, 1308, 745.0, 889.0, 940.0, 1078.099999999999, 24.598666337367252, 149.27354748085946, 27.649477494443072], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-1time-halfzedd", 1670, 0, 0.0, 667.6622754490998, 491, 1631, 664.0, 822.0, 879.0, 1109.8799999999974, 27.55866530248523, 108.35076807402885, 21.126515881299714], "isController": false}, {"data": ["NCPPServerlessWestGFSTrajectory10waypoints", 386, 0, 0.0, 2928.8186528497426, 2495, 3835, 2928.0, 3139.7000000000003, 3304.0, 3724.0, 6.206586056084384, 32.736104774327885, 6.382358512750836], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-halftime-halfzedd", 1700, 0, 0.0, 656.8211764705876, 473, 1713, 648.5, 820.9000000000001, 870.0, 1016.0, 28.07040718602424, 110.36275325286483, 21.518818008817412], "isController": false}, {"data": ["NCPPServerlessWestGFSInstances", 2298, 0, 0.0, 484.9321148825066, 316, 4836, 403.0, 589.0, 633.0, 1114.1799999999957, 37.95712067655512, 50.81954340581745, 8.933267659228305], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-fulltime-fullzedd", 360, 0, 0.0, 3161.1388888888896, 2469, 5647, 3134.5, 3541.3000000000006, 4021.95, 5459.0, 5.713922925528538, 23.028671790679958, 2.410561234207352], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-fulltime-1zedd", 1738, 0, 0.0, 642.5224395857315, 403, 2532, 594.0, 844.0, 1051.7499999999993, 1988.0, 28.6038741956189, 142.43276808931716, 32.2910923536479], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-1time-halfzedd", 616, 0, 0.0, 1827.3766233766225, 1459, 2975, 1814.5, 2022.0, 2094.3, 2324.920000000001, 9.991079393398751, 35.046833184656556, 4.254014272970562], "isController": false}, {"data": ["NCPPServerlessWestNWM-position-1day", 218, 0, 0.0, 5441.908256880736, 4880, 10908, 5388.0, 5680.0, 5796.4, 10029.06000000001, 3.1686507071323713, 7.75143556774081, 1.0985068369453044], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-halftime-halfzedd", 618, 0, 0.0, 1829.080906148867, 1439, 3776, 1799.0, 2043.0, 2141.3499999999995, 2928.299999999982, 10.00971817298348, 35.11221452866861, 4.261950315840622], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 476, 100.0, 1.0984446393132414], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 43334, 476, "502/Bad Gateway", 476, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessWestGFSCorridor20waypoints", 476, 476, "502/Bad Gateway", 476, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
