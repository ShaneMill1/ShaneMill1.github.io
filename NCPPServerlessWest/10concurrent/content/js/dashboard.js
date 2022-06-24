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

    var data = {"OkPercent": 92.95109146853699, "KoPercent": 7.048908531463018};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5293936504886418, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "NCPPServerlessWestGFSPosition-1time-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSAreaTexas-fulltime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSAreaGlobe-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSAreaUS-fulltime-fullzedd"], "isController": false}, {"data": [0.46641368750416085, 500, 1500, "NCPPServerlessWestGFSPosition-fulltime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSAreaGlobe-fulltime-fullzedd"], "isController": false}, {"data": [0.46687040769881005, 500, 1500, "NCPPServerlessWestGFSPosition-halftime-1zedd"], "isController": false}, {"data": [0.29991752577319586, 500, 1500, "NCPPServerlessWestGFSAreaTexas-halftime-1zedd"], "isController": false}, {"data": [0.19821999481551889, 500, 1500, "NCPPServerlessWestGFSAreaTexas-fulltime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSAreaUS-1time-halfzedd"], "isController": false}, {"data": [0.4600256808812597, 500, 1500, "NCPPServerlessWestGFSAreaTexas-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestNWM-position-1hour"], "isController": false}, {"data": [0.05167157275021026, 500, 1500, "NCPPServerlessWestGFSAreaHalfGlobe-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestCollections"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestNWM-position-1year"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSAreaUS-1time-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSAreaTexas-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSAreaUS-fulltime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSAreaHalfGlobe-1time-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSAreaHalfGlobe-fulltime-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSAreaGlobe-1time-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSAreaHalfGlobe-fulltime-1zedd"], "isController": false}, {"data": [0.0020273694880892043, 500, 1500, "NCPPServerlessWestGFSPosition-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSAreaUS-halftime-fullzedd"], "isController": false}, {"data": [4.40251572327044E-4, 500, 1500, "NCPPServerlessWestGFSPosition-halftime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSAreaGlobe-fulltime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSAreaUS-fulltime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSPosition-halftime-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSAreaHalfGlobe-halftime-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSAreaGlobe-1time-halfzedd"], "isController": false}, {"data": [0.46132578500427884, 500, 1500, "NCPPServerlessWestGFSPosition-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSAreaHalfGlobe-halftime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSAreaHalfGlobe-fulltime-halfzedd"], "isController": false}, {"data": [0.4760748715783548, 500, 1500, "NCPPServerlessWestGFSCollectionMeta"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestNWM-position-1month"], "isController": false}, {"data": [2.5122472051249844E-4, 500, 1500, "NCPPServerlessWestGFSPosition-fulltime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSAreaGlobe-halftime-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSAreaTexas-fulltime-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSAreaUS-halftime-halfzedd"], "isController": false}, {"data": [0.4364557149194145, 500, 1500, "NCPPServerlessWestGFSAreaUS-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSAreaGlobe-fulltime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSAreaGlobe-halftime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSAreaHalfGlobe-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSAreaTexas-1time-fullzedd"], "isController": false}, {"data": [0.999794414020368, 500, 1500, "NCPPServerlessWestRoot"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSAreaUS-halftime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSAreaGlobe-halftime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSAreaTexas-halftime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSInstances"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSPosition-fulltime-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSAreaHalfGlobe-halftime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestNWM-position-1day"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSAreaTexas-halftime-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestNWM-position-5year"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 811842, 57226, 7.048908531463018, 2396.5494197146577, 81, 33445, 15250.0, 29195.0, 29242.0, 29389.980000000003, 8.306065141677792, 2152.973521443298, 3.5008168747642876], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NCPPServerlessWestGFSPosition-1time-fullzedd", 10606, 0, 0.0, 3389.824061851781, 2005, 8330, 3153.0, 4731.300000000001, 5264.65, 6179.110000000008, 5.875841681357194, 33.83199468093947, 2.478870709322566], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-fulltime-halfzedd", 6674, 6674, 100.0, 5388.970332634112, 3499, 19137, 5234.0, 6581.0, 6990.0, 8345.0, 3.695473902722768, 1.8513458125945117, 2.832956068005247], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaGlobe-1time-1zedd", 11522, 0, 0.0, 3117.892900538104, 1587, 10979, 2898.0, 4273.700000000001, 4848.500000000004, 6208.0, 6.3901838966478435, 12775.793569861857, 3.3261406415168953], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-fulltime-fullzedd", 1284, 1284, 100.0, 28157.777258566988, 23966, 29637, 28175.0, 29212.0, 29233.75, 29332.75, 0.7052732357046223, 0.35492813793035266, 0.7927436467734573], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-fulltime-1zedd", 30042, 0, 0.0, 1195.2001864057063, 892, 12168, 1158.0, 1363.0, 1586.9500000000007, 1965.9400000000096, 16.68270595023176, 237.9566436612159, 7.119475097901639], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaGlobe-fulltime-fullzedd", 1288, 1288, 100.0, 28089.25310559003, 24913, 29579, 28228.0, 29217.0, 29278.2, 29373.66, 0.7053279090258425, 0.355635192823398, 0.36368470309145], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-halftime-1zedd", 30758, 0, 0.0, 1167.477794394952, 891, 4227, 1129.0, 1351.0, 1567.9500000000007, 1890.9900000000016, 17.073511910048495, 149.64332948504418, 7.286254594424992], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-halftime-1zedd", 24250, 0, 0.0, 1481.1491134020587, 987, 8609, 1455.0, 1756.0, 1932.9500000000007, 2297.970000000005, 13.462514253610452, 3133.3344575949536, 10.333531448572085], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-fulltime-1zedd", 23146, 0, 0.0, 1551.668884472478, 1041, 6100, 1550.0, 1861.0, 2009.0, 2326.9600000000064, 12.851335159667261, 5893.0901786269515, 9.864403745603973], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-1time-halfzedd", 9784, 0, 0.0, 3674.0598937040068, 2274, 11822, 3408.5, 5029.5, 5509.0, 6375.0, 5.424688097067763, 4811.8572685082, 6.118666750110612], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-1time-1zedd", 29594, 0, 0.0, 1213.4340744745539, 921, 16121, 1169.0, 1437.9000000000015, 1620.9500000000007, 2005.9100000000144, 16.42980193078209, 117.62390425250341, 12.611156560151096], "isController": false}, {"data": ["NCPPServerlessWestNWM-position-1hour", 2664, 8, 0.3003003003003003, 13529.530780780799, 10532, 29093, 13183.5, 14646.0, 16096.0, 26026.89999999998, 1.4738173362743292, 3.8852378854040635, 0.5109425335716669], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaHalfGlobe-1time-1zedd", 19024, 0, 0.0, 1888.347981497053, 1156, 7709, 1838.0, 2297.0, 2483.0, 2981.5, 10.554979771101637, 9300.318396396526, 5.421796249608849], "isController": false}, {"data": ["NCPPServerlessWestCollections", 1576, 0, 0.0, 22926.163705583742, 21942, 27783, 22807.0, 23481.0, 23815.35, 26104.0, 0.8648919186935742, 29.175743698664192, 0.1410517093963153], "isController": false}, {"data": ["NCPPServerlessWestNWM-position-1year", 2230, 44, 1.9730941704035874, 16166.1533632287, 12251, 29358, 15220.0, 20292.0, 23921.0, 29123.04, 1.2300815053108631, 819.934304020367, 0.4264442718606996], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-1time-fullzedd", 5630, 0, 0.0, 6391.664298401425, 4318, 14517, 6033.0, 8217.0, 8953.0, 10404.539999999974, 3.1177162147270283, 5395.341873953724, 3.5043860968269622], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-1time-halfzedd", 10742, 0, 0.0, 3345.713833550553, 2080, 10484, 3078.0, 4656.0, 5214.0, 6098.0, 5.954033882898088, 461.4608838694569, 4.564371677807617], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-fulltime-1zedd", 8916, 0, 0.0, 4028.529161058771, 2253, 8396, 4027.5, 4752.0, 4958.0, 5406.0, 4.947654525416938, 26727.123449037106, 5.5854381165839655], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaHalfGlobe-1time-fullzedd", 2138, 2138, 100.0, 16886.92329279705, 13692, 29252, 15613.0, 21150.0, 22599.05, 29085.0, 1.1780445122300636, 0.5902792318135934, 0.5993761629608039], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaHalfGlobe-fulltime-fullzedd", 1240, 1240, 100.0, 29184.62096774194, 29082, 29662, 29179.0, 29318.0, 29342.95, 29445.39, 0.6817460836711366, 0.3475307184339193, 0.3475307184339193], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaGlobe-1time-fullzedd", 1638, 1638, 100.0, 22068.078144078136, 18344, 29849, 20156.0, 28960.0, 29174.0, 29308.539999999997, 0.8978102309805919, 0.4505237637432657, 0.46293340034936764], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaHalfGlobe-fulltime-1zedd", 2628, 2628, 100.0, 13719.670471841717, 12263, 19205, 13497.5, 14658.8, 15426.0, 16772.910000000003, 1.4497998525926483, 0.7263157464648716, 0.7461372288245367], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-1time-halfzedd", 15784, 0, 0.0, 2275.785478966054, 1450, 21247, 2137.0, 3050.0, 3383.0, 4360.0, 8.758398274067284, 39.78912965914161, 3.7291617651302107], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-halftime-fullzedd", 2078, 2078, 100.0, 17393.26179018289, 15178, 29199, 17122.0, 19050.0, 19677.0, 20603.350000000006, 1.1422816829250326, 0.5722660136568076, 1.2839513838346803], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-halftime-halfzedd", 15900, 0, 0.0, 2259.813333333329, 1463, 9359, 2132.0, 2894.8999999999996, 3190.0, 3924.0, 8.817163634911752, 475.7565842966593, 3.75418295392727], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaGlobe-fulltime-1zedd", 1310, 1310, 100.0, 27638.432061068703, 26493, 29477, 27436.0, 28763.0, 29102.0, 29245.0, 0.7170075280317103, 0.3596561586294319, 0.37320801996181796], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-fulltime-halfzedd", 2324, 2324, 100.0, 15531.917383820966, 13902, 21640, 15381.5, 16708.5, 17139.5, 18117.0, 1.2806658580764334, 0.6415835792902443, 1.4445010410920707], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-halftime-fullzedd", 11312, 0, 0.0, 3176.9444837340743, 2040, 10106, 2946.5, 4348.0, 4798.0, 5683.0, 6.270277101681922, 622.9557040425882, 2.6452731522720607], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaHalfGlobe-halftime-fullzedd", 1240, 1240, 100.0, 29207.111290322628, 29082, 30225, 29214.5, 29324.0, 29355.9, 29579.91999999999, 0.6815141485634891, 0.34741248588880985, 0.3467469447281033], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaGlobe-1time-halfzedd", 3076, 3076, 100.0, 11718.100130039009, 8684, 29092, 10865.5, 14817.0, 16230.0, 20929.460000000003, 1.6940770089076729, 0.8487025575138043, 0.8801259460340644], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-1time-1zedd", 30382, 2, 0.006582845105654664, 1181.9283786452527, 884, 29252, 1126.0, 1410.9000000000015, 1600.0, 2079.900000000016, 16.85593672171948, 55.42068567328599, 6.699576411855301], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaHalfGlobe-halftime-1zedd", 4356, 4356, 100.0, 8268.259412304826, 4753, 16394, 8160.0, 9177.0, 9920.0, 10869.0, 2.4094959363264703, 1.2311660033315872, 1.232575872709361], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaHalfGlobe-fulltime-halfzedd", 1240, 1240, 100.0, 29191.20483870967, 29084, 29736, 29191.5, 29323.9, 29348.85, 29445.489999999998, 0.6821278648682696, 0.347725337364489, 0.3503898993366307], "isController": false}, {"data": ["NCPPServerlessWestGFSCollectionMeta", 28422, 0, 0.0, 1263.4668214763199, 1026, 7346, 1240.0, 1416.9000000000015, 1489.0, 1690.0, 15.777947401290682, 119.92164514086461, 3.7749971809728677], "isController": false}, {"data": ["NCPPServerlessWestNWM-position-1month", 2600, 12, 0.46153846153846156, 13909.528461538479, 11063, 29326, 13672.0, 15153.2, 16058.599999999988, 23770.919999999387, 1.4316439567555423, 78.08812484375808, 0.4963218795392749], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-fulltime-halfzedd", 15922, 0, 0.0, 2256.8380856676154, 1486, 18831, 2128.0, 2902.0, 3189.0, 3805.0, 8.832728470987133, 913.3248256074235, 3.76081016928749], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaGlobe-halftime-fullzedd", 1260, 1260, 100.0, 28927.474603174564, 4843, 33445, 29169.5, 29311.0, 29352.0, 33305.12, 0.6893133454346121, 0.3779939996914502, 0.3497854922517898], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-fulltime-fullzedd", 4248, 4248, 100.0, 8474.671374764635, 5944, 21696, 8153.0, 10327.3, 10918.749999999998, 12758.240000000005, 2.3497238742565845, 1.177156589349246, 1.7921233845648363], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-halftime-halfzedd", 3684, 3684, 100.0, 9771.16666666663, 8468, 24345, 9663.5, 10906.5, 11295.75, 12095.600000000006, 2.0365472894683303, 1.0202624604465367, 2.2970821477889865], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-1time-1zedd", 27052, 0, 0.0, 1327.6528907289578, 953, 18101, 1308.0, 1529.9000000000015, 1705.9500000000007, 1954.0, 15.01765901720158, 707.3992018503109, 16.953529124887723], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaGlobe-fulltime-halfzedd", 1240, 1240, 100.0, 29183.61129032256, 28984, 29638, 29176.5, 29310.0, 29329.0, 29427.59, 0.6820258146770855, 0.3476636473503022, 0.3543337240314546], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaGlobe-halftime-1zedd", 2376, 2376, 100.0, 15164.379629629637, 14125, 20284, 14898.0, 16219.0, 16864.4, 18060.0, 1.3101440772499766, 0.6563514762004278, 0.6819402277092164], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaHalfGlobe-1time-halfzedd", 4050, 4050, 100.0, 8894.274567901239, 6100, 29217, 8419.0, 11071.0, 11810.999999999996, 14119.269999999995, 2.235126475045503, 1.119755679290808, 1.1459388666004775], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-1time-fullzedd", 5946, 0, 0.0, 6050.930373360234, 3948, 18657, 5604.0, 8013.500000000001, 8848.0, 10888.0, 3.292296822761919, 487.6425306690654, 2.511019354079159], "isController": false}, {"data": ["NCPPServerlessWestRoot", 335626, 0, 0.0, 106.83799228903523, 81, 1113, 98.0, 109.0, 127.0, 304.0, 186.45453828299563, 298.24887310789137, 28.223099056508126], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-halftime-1zedd", 14242, 0, 0.0, 2522.3811262463214, 1612, 5544, 2491.0, 2899.0, 3071.0, 3581.1399999999994, 7.902265367858719, 21528.19401763847, 8.920916762934258], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaGlobe-halftime-halfzedd", 1240, 1240, 100.0, 29175.825806451616, 29081, 29823, 29175.0, 29308.8, 29338.0, 29459.72, 0.682095970903106, 0.3477090789174037, 0.35437017238325436], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-halftime-halfzedd", 7070, 0, 0.0, 5084.132390381881, 3118, 13472, 4872.0, 6413.0, 6941.0, 8368.45, 3.9202726336136484, 18693.61332025952, 3.0052871263542134], "isController": false}, {"data": ["NCPPServerlessWestGFSInstances", 9432, 0, 0.0, 3812.141857506362, 3402, 7061, 3751.0, 4181.0, 4284.0, 4451.67, 5.228514696051008, 4.544314530747458, 1.2305391032698174], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-fulltime-fullzedd", 10994, 0, 0.0, 3269.023467345821, 2052, 11277, 3041.0, 4448.0, 5007.0, 6011.0, 6.0950290087677725, 1176.2989334548154, 2.5713403630739036], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaHalfGlobe-halftime-halfzedd", 1240, 1240, 100.0, 29193.088709677453, 29083, 29896, 29185.0, 29311.0, 29337.65, 29490.309999999998, 0.6817022324648594, 0.3475083645963443, 0.3495055391055187], "isController": false}, {"data": ["NCPPServerlessWestNWM-position-1day", 2664, 6, 0.22522522522522523, 13550.17192192193, 10632, 29230, 13406.0, 14703.0, 15218.0, 18263.949999999975, 1.4704323866044935, 6.59656726793497, 0.509769040277925], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-halftime-fullzedd", 4838, 4838, 100.0, 7432.153369160813, 4982, 29490, 7152.0, 9046.0, 9701.0, 11482.319999999996, 2.6803264701906477, 1.3427904799656953, 2.044272434784078], "isController": false}, {"data": ["NCPPServerlessWestNWM-position-5year", 1320, 464, 35.15151515151515, 27414.269696969695, 23471, 32742, 27864.5, 29320.8, 29646.9, 30160.0, 0.7230305496839754, 1593.363707577415, 0.2506600050173938], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 20, 0.034949148988222135, 0.0024635335447045115], "isController": false}, {"data": ["504/Gateway Timeout", 10296, 17.991821899136756, 1.2682270688138826], "isController": false}, {"data": ["502/Bad Gateway", 46890, 81.9382798028868, 5.775754395559727], "isController": false}, {"data": ["500/Internal Server Error", 2, 0.0034949148988222137, 2.4635335447045114E-4], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 18, 0.03145423408939992, 0.0022171801902340603], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 811842, 57226, "502/Bad Gateway", 46890, "504/Gateway Timeout", 10296, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 20, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 18, "500/Internal Server Error", 2], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-fulltime-halfzedd", 6674, 6674, "502/Bad Gateway", 6674, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-fulltime-fullzedd", 1284, 1284, "502/Bad Gateway", 952, "504/Gateway Timeout", 332, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaGlobe-fulltime-fullzedd", 1288, 1288, "502/Bad Gateway", 814, "504/Gateway Timeout", 472, "500/Internal Server Error", 2, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessWestNWM-position-1hour", 2664, 8, "504/Gateway Timeout", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessWestNWM-position-1year", 2230, 44, "504/Gateway Timeout", 44, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaHalfGlobe-1time-fullzedd", 2138, 2138, "502/Bad Gateway", 2116, "504/Gateway Timeout", 22, "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaHalfGlobe-fulltime-fullzedd", 1240, 1240, "504/Gateway Timeout", 1240, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaGlobe-1time-fullzedd", 1638, 1638, "502/Bad Gateway", 1484, "504/Gateway Timeout", 154, "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaHalfGlobe-fulltime-1zedd", 2628, 2628, "502/Bad Gateway", 2628, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-halftime-fullzedd", 2078, 2078, "502/Bad Gateway", 2076, "504/Gateway Timeout", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaGlobe-fulltime-1zedd", 1310, 1310, "502/Bad Gateway", 1216, "504/Gateway Timeout", 94, "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-fulltime-halfzedd", 2324, 2324, "502/Bad Gateway", 2324, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaHalfGlobe-halftime-fullzedd", 1240, 1240, "504/Gateway Timeout", 1240, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaGlobe-1time-halfzedd", 3076, 3076, "502/Bad Gateway", 3074, "504/Gateway Timeout", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-1time-1zedd", 30382, 2, "504/Gateway Timeout", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaHalfGlobe-halftime-1zedd", 4356, 4356, "502/Bad Gateway", 4338, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 18, "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaHalfGlobe-fulltime-halfzedd", 1240, 1240, "504/Gateway Timeout", 1240, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessWestNWM-position-1month", 2600, 12, "504/Gateway Timeout", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaGlobe-halftime-fullzedd", 1260, 1260, "504/Gateway Timeout", 1240, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 20, "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-fulltime-fullzedd", 4248, 4248, "502/Bad Gateway", 4248, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-halftime-halfzedd", 3684, 3684, "502/Bad Gateway", 3684, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaGlobe-fulltime-halfzedd", 1240, 1240, "504/Gateway Timeout", 1238, "502/Bad Gateway", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaGlobe-halftime-1zedd", 2376, 2376, "502/Bad Gateway", 2376, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaHalfGlobe-1time-halfzedd", 4050, 4050, "502/Bad Gateway", 4048, "504/Gateway Timeout", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaGlobe-halftime-halfzedd", 1240, 1240, "504/Gateway Timeout", 1240, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaHalfGlobe-halftime-halfzedd", 1240, 1240, "504/Gateway Timeout", 1240, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessWestNWM-position-1day", 2664, 6, "504/Gateway Timeout", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-halftime-fullzedd", 4838, 4838, "502/Bad Gateway", 4836, "504/Gateway Timeout", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessWestNWM-position-5year", 1320, 464, "504/Gateway Timeout", 464, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
