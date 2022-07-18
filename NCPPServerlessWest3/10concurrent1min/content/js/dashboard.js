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

    var data = {"OkPercent": 98.44705882352942, "KoPercent": 1.5529411764705883};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5119327731092437, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "NCPPServerlessWestGFSPosition-1time-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSTrajectory20waypoints"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSCorridor5waypoints"], "isController": false}, {"data": [0.0984375, 500, 1500, "NCPPServerlessWestGFSAreaGlobe-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSPosition-halftime-fullzedd"], "isController": false}, {"data": [0.7478494623655914, 500, 1500, "NCPPServerlessWestGFSPosition-1time-1zedd"], "isController": false}, {"data": [0.7770460959548448, 500, 1500, "NCPPServerlessWestGFSPosition-fulltime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSCorridor10waypoints"], "isController": false}, {"data": [0.768095238095238, 500, 1500, "NCPPServerlessWestGFSPosition-halftime-1zedd"], "isController": false}, {"data": [0.4939655172413793, 500, 1500, "NCPPServerlessWestGFSAreaTexas-halftime-1zedd"], "isController": false}, {"data": [0.49146110056925996, 500, 1500, "NCPPServerlessWestGFSAreaTexas-fulltime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSCorridor20waypoints"], "isController": false}, {"data": [0.5719602977667494, 500, 1500, "NCPPServerlessWestGFSCollectionMeta"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSAreaUS-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestNWM-position-1month"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSTrajectory5waypoints"], "isController": false}, {"data": [0.495752427184466, 500, 1500, "NCPPServerlessWestGFSAreaTexas-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestNWM-position-1hour"], "isController": false}, {"data": [0.018092105263157895, 500, 1500, "NCPPServerlessWestGFSPosition-fulltime-halfzedd"], "isController": false}, {"data": [0.4993412384716733, 500, 1500, "NCPPServerlessWestGFSAreaUS-1time-1zedd"], "isController": false}, {"data": [0.36739659367396593, 500, 1500, "NCPPServerlessWestGFSAreaHalfGlobe-1time-1zedd"], "isController": false}, {"data": [0.989853195164076, 500, 1500, "NCPPServerlessWestCollections"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSAreaTexas-1time-fullzedd"], "isController": false}, {"data": [0.06484641638225255, 500, 1500, "NCPPServerlessWestGFSAreaUS-halftime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSAreaUS-1time-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSAreaTexas-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSTrajectory10waypoints"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSAreaTexas-halftime-halfzedd"], "isController": false}, {"data": [0.854419410745234, 500, 1500, "NCPPServerlessWestGFSInstances"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSPosition-fulltime-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSAreaUS-fulltime-1zedd"], "isController": false}, {"data": [0.014331210191082803, 500, 1500, "NCPPServerlessWestGFSPosition-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestNWM-position-1day"], "isController": false}, {"data": [0.00980392156862745, 500, 1500, "NCPPServerlessWestGFSPosition-halftime-halfzedd"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 29750, 462, 1.5529411764705883, 1298.275966386561, 163, 29271, 1170.0, 3458.0, 5093.0, 5956.900000000016, 13.952652903488445, 4142.045600274199, 7.653762008954556], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NCPPServerlessWestGFSPosition-1time-fullzedd", 396, 0, 0.0, 2904.090909090907, 2454, 4191, 2923.0, 3168.0, 3270.0, 3757.0, 6.294506612410987, 34.773460846102495, 2.655494977110885], "isController": false}, {"data": ["NCPPServerlessWestGFSTrajectory20waypoints", 426, 0, 0.0, 2674.633802816904, 2323, 3422, 2645.0, 2898.2, 3170.0, 3389.990000000001, 6.772332003243089, 52.08214309134699, 11.792058556428152], "isController": false}, {"data": ["NCPPServerlessWestGFSCorridor5waypoints", 264, 0, 0.0, 4421.106060606065, 3214, 9025, 4087.5, 4923.5, 8387.0, 8890.450000000004, 4.118371995070433, 58.9683302653542, 3.0847571486513896], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaGlobe-1time-1zedd", 640, 0, 0.0, 1765.353124999999, 1185, 3001, 1800.5, 2018.0, 2148.7999999999997, 2357.8500000000035, 10.34176294740244, 20673.679001373515, 5.382968409145997], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-halftime-fullzedd", 374, 0, 0.0, 3046.5935828877014, 2448, 4183, 3004.0, 3355.0, 3461.0, 3897.0, 5.973963740915262, 592.1166502775337, 2.5202659531986265], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-1time-1zedd", 1860, 2, 0.10752688172043011, 598.4107526881735, 394, 29176, 497.0, 696.0, 746.0, 2251.449999999955, 30.783998940765628, 93.98128729042882, 12.235437078995714], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-fulltime-1zedd", 2126, 0, 0.0, 524.0602069614288, 368, 1118, 483.0, 655.0, 691.2999999999997, 890.0, 35.149791680444416, 462.88568438553995, 15.000448207377158], "isController": false}, {"data": ["NCPPServerlessWestGFSCorridor10waypoints", 234, 0, 0.0, 4920.478632478634, 3923, 6044, 4901.0, 5453.0, 5651.0, 5985.550000000001, 3.676701652944504, 79.82463979322482, 4.060888251445541], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-halftime-1zedd", 2100, 0, 0.0, 530.3161904761906, 403, 1124, 489.0, 663.0, 712.0, 799.0, 34.75037646241168, 296.46414919494964, 14.829994642650297], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-halftime-1zedd", 1160, 0, 0.0, 967.475862068966, 563, 1901, 1013.0, 1179.0, 1242.6500000000003, 1516.0, 19.02512628747622, 4423.527654087122, 14.603270763629206], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-fulltime-1zedd", 1054, 0, 0.0, 1061.4857685009508, 661, 1761, 1085.0, 1282.0, 1350.25, 1567.5500000000009, 17.288324639963257, 7313.332751554145, 13.270139811534298], "isController": false}, {"data": ["NCPPServerlessWestGFSCorridor20waypoints", 458, 458, 100.0, 2486.6288209607, 2006, 3625, 2444.0, 2780.0, 3145.399999999998, 3538.4299999999994, 7.349401457042909, 3.681877878381848, 13.249018642286337], "isController": false}, {"data": ["NCPPServerlessWestGFSCollectionMeta", 1612, 0, 0.0, 690.9689826302719, 456, 7619, 581.5, 770.0, 882.7999999999993, 6176.949999999991, 26.713509213840645, 203.0383224719939, 6.3914157787021075], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-1time-halfzedd", 348, 0, 0.0, 3295.0344827586205, 2666, 4177, 3285.5, 3627.7000000000003, 3754.0, 4120.0, 5.50545799715235, 4882.206818046986, 6.2097695182724255], "isController": false}, {"data": ["NCPPServerlessWestNWM-position-1month", 204, 0, 0.0, 5629.607843137253, 4843, 7149, 5516.0, 6428.5, 6714.75, 7135.599999999997, 3.1847133757961785, 7.790729498407644, 1.1040754378980893], "isController": false}, {"data": ["NCPPServerlessWestGFSTrajectory5waypoints", 468, 0, 0.0, 2420.910256410255, 1878, 7627, 2182.5, 2534.4, 3185.0, 7491.360000000001, 7.532229250156922, 30.717372410796195, 5.1489848389744575], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-1time-1zedd", 1648, 0, 0.0, 678.5861650485442, 482, 4184, 639.5, 784.0, 856.7499999999998, 3189.3699999999963, 27.106600654637564, 187.7079152754248, 20.806433705610477], "isController": false}, {"data": ["NCPPServerlessWestNWM-position-1hour", 200, 0, 0.0, 5861.539999999999, 4946, 14979, 5368.5, 8314.900000000001, 9446.849999999995, 14925.01000000005, 3.0704986489805948, 7.511327261422255, 1.0644795120977648], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-fulltime-halfzedd", 608, 0, 0.0, 1847.9769736842097, 1449, 2888, 1846.5, 2075.1, 2147.2, 2270.74, 9.880876927827345, 942.8807509791494, 4.207092129426487], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-1time-1zedd", 1518, 0, 0.0, 735.7299077733861, 504, 2590, 739.0, 926.0, 980.0, 1104.0, 25.043719272775267, 1173.8020571258292, 28.272011210281455], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaHalfGlobe-1time-1zedd", 822, 0, 0.0, 1372.2749391727482, 898, 1949, 1416.0, 1599.0, 1639.0, 1772.85, 13.385442110405473, 11791.16275341964, 6.8757251465559355], "isController": false}, {"data": ["NCPPServerlessWestCollections", 4632, 0, 0.0, 239.94127806563057, 163, 3185, 205.0, 386.0, 457.0, 528.0, 77.04462666954974, 2598.97708891236, 12.564895169741021], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-1time-fullzedd", 230, 0, 0.0, 5084.478260869569, 4264, 6594, 5074.0, 5521.0, 5744.0, 6527.039999999999, 3.537917243501, 523.190242366559, 2.6983528976311333], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-halftime-1zedd", 586, 0, 0.0, 1925.7098976109207, 1268, 5295, 1975.0, 2198.8, 2311.0, 2614.0, 9.476220508093597, 25813.900214923025, 10.697764557965039], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-1time-fullzedd", 210, 0, 0.0, 5570.447619047619, 4594, 7050, 5500.0, 6220.0, 6308.95, 7017.549999999996, 3.218390804597701, 5568.806124281609, 3.617546695402299], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-1time-halfzedd", 402, 0, 0.0, 2848.2089552238785, 2332, 3871, 2826.0, 3135.1, 3292.5999999999995, 3487.4099999999985, 6.373668188736682, 492.48412900137936, 4.886063992342085], "isController": false}, {"data": ["NCPPServerlessWestGFSTrajectory10waypoints", 390, 0, 0.0, 2919.723076923078, 2565, 4146, 2889.0, 3139.0, 3337.0, 3718.0, 6.223470462451728, 32.849470556202725, 6.399721090782881], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-halftime-halfzedd", 234, 0, 0.0, 4936.205128205127, 3977, 5813, 4984.0, 5316.0, 5384.0, 5761.200000000001, 3.6166365280289328, 17244.885849909584, 2.7725192133815555], "isController": false}, {"data": ["NCPPServerlessWestGFSInstances", 2308, 0, 0.0, 483.27556325823195, 231, 5047, 401.0, 580.0999999999999, 616.0, 1130.0, 38.21888092202222, 51.1700056094653, 8.994873341999371], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-fulltime-fullzedd", 362, 0, 0.0, 3135.6353591160223, 2507, 3700, 3137.0, 3470.7, 3540.2, 3663.0, 5.836826830054821, 1039.6334788677038, 2.4624113189293775], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-fulltime-1zedd", 430, 0, 0.0, 2622.40465116279, 1871, 3973, 2684.0, 2962.0, 3207.0, 3700.5699999999997, 6.890804781898017, 34335.99868969544, 7.779072585814557], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-1time-halfzedd", 628, 0, 0.0, 1791.5127388535032, 1420, 3688, 1781.0, 1947.1, 2007.0, 2909.240000000009, 10.186702136287694, 43.90030910882577, 4.337306768966244], "isController": false}, {"data": ["NCPPServerlessWestNWM-position-1day", 206, 2, 0.970873786407767, 5688.339805825242, 4701, 29271, 5327.0, 6015.6, 6447.349999999997, 27838.94000000014, 2.6331599197269693, 6.391963749312949, 0.9128630581084708], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-halftime-halfzedd", 612, 0, 0.0, 1849.4215686274508, 1468, 2298, 1861.0, 2051.0, 2107.0, 2251.48, 9.894107186161182, 531.547381476841, 4.212725325357692], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Timeout", 4, 0.8658008658008658, 0.013445378151260505], "isController": false}, {"data": ["502/Bad Gateway", 458, 99.13419913419914, 1.5394957983193278], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 29750, 462, "502/Bad Gateway", 458, "504/Gateway Timeout", 4, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-1time-1zedd", 1860, 2, "504/Gateway Timeout", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessWestGFSCorridor20waypoints", 458, 458, "502/Bad Gateway", 458, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessWestNWM-position-1day", 206, 2, "504/Gateway Timeout", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
