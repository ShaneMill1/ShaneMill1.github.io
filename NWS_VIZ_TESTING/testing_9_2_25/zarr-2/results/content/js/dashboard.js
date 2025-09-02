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

    var data = {"OkPercent": 99.91767491767492, "KoPercent": 0.08232508232508233};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6227892477892478, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.96260017809439, 500, 1500, "HREF_ResLevel-1_Time-All_5threads_ZARR"], "isController": false}, {"data": [0.12408223201174744, 500, 1500, "NBM_ResLevel-1_Times-One_100threads_ZARR"], "isController": false}, {"data": [0.6138686131386861, 500, 1500, "HREF_ResLevel-1_Times-One_50threads_ZARR"], "isController": false}, {"data": [0.4122392758756395, 500, 1500, "NBM_ResLevel-1_Times-One_25threads_ZARR"], "isController": false}, {"data": [0.848208011243851, 500, 1500, "HREF_ResLevel-1_Times-One_25threads_ZARR"], "isController": false}, {"data": [0.2612023898431665, 500, 1500, "NBM_ResLevel-1_Times-One_50threads_ZARR"], "isController": false}, {"data": [0.5629905413564097, 500, 1500, "HREF_ResLevel-1_Time-All_50threads_ZARR"], "isController": false}, {"data": [0.7700407608695652, 500, 1500, "LREF_ResLevel-1_Time-All_50threads_ZARR"], "isController": false}, {"data": [0.22264150943396227, 500, 1500, "NBM_ResLevel-1_Time-All_25threads_ZARR"], "isController": false}, {"data": [0.4367495349230509, 500, 1500, "MRMS_ResLevel-1_Times-One_100threads_ZARR"], "isController": false}, {"data": [0.3513268998793727, 500, 1500, "HREF_ResLevel-1_Times-One_100threads_ZARR"], "isController": false}, {"data": [0.9159800520381614, 500, 1500, "MRMS_ResLevel-1_Times-One_25threads_ZARR"], "isController": false}, {"data": [0.3195395738203957, 500, 1500, "HREF_ResLevel-1_Time-All_100threads_ZARR"], "isController": false}, {"data": [0.7631049738570854, 500, 1500, "LREF_ResLevel-1_Times-One_50threads_ZARR"], "isController": false}, {"data": [0.95, 500, 1500, "HREF_ResLevel-1_Times-One_5threads_ZARR"], "isController": false}, {"data": [0.9553571428571429, 500, 1500, "LREF_ResLevel-1_Time-All_25threads_ZARR"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "NBM_ResLevel-1_Time-All_50threads_ZARR"], "isController": false}, {"data": [0.4744058500914077, 500, 1500, "NBM_ResLevel-1_Time-All_5threads_ZARR"], "isController": false}, {"data": [0.4983596214511041, 500, 1500, "LREF_ResLevel-1_Times-One_100threads_ZARR"], "isController": false}, {"data": [0.9806892453951277, 500, 1500, "MRMS_ResLevel-1_Times-One_5threads_ZARR"], "isController": false}, {"data": [0.4985140198992118, 500, 1500, "LREF_ResLevel-1_Time-All_100threads_ZARR"], "isController": false}, {"data": [0.9827109266943291, 500, 1500, "LREF_ResLevel-1_Time-All_5threads_ZARR"], "isController": false}, {"data": [0.7399271844660195, 500, 1500, "HREF_ResLevel-1_Time-All_25threads_ZARR"], "isController": false}, {"data": [0.051564722617354196, 500, 1500, "NBM_ResLevel-1_Time-All_100threads_ZARR"], "isController": false}, {"data": [0.49017038007863695, 500, 1500, "NBM_ResLevel-1_Times-One_5threads_ZARR"], "isController": false}, {"data": [0.687981897418706, 500, 1500, "MRMS_ResLevel-1_Times-One_50threads_ZARR"], "isController": false}, {"data": [0.9757217847769029, 500, 1500, "LREF_ResLevel-1_Times-One_5threads_ZARR"], "isController": false}, {"data": [0.955285207863358, 500, 1500, "LREF_ResLevel-1_Times-One_25threads_ZARR"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 108108, 89, 0.08232508232508233, 1254.0361397861343, 6, 59709, 1084.0, 4970.500000000007, 8131.0, 16584.480000000243, 31.490365709791586, 3242.3813418461714, 8.90434639933878], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["HREF_ResLevel-1_Time-All_5threads_ZARR", 1123, 0, 0.0, 482.17186108637554, 371, 5941, 426.0, 474.20000000000005, 512.0, 1802.2799999999993, 9.331427716750037, 1263.684890856364, 2.487773209641367], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_100threads_ZARR", 2724, 9, 0.3303964757709251, 3925.3597650513934, 586, 28165, 3871.0, 6922.0, 7922.0, 10830.25, 22.031170385707235, 204.19613606562845, 6.605048152746213], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_50threads_ZARR", 4795, 2, 0.04171011470281543, 1104.0148070907205, 146, 12092, 583.0, 2130.800000000001, 3745.399999999997, 6873.36, 39.30521173172451, 241.28764145162876, 11.59196674119219], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_25threads_ZARR", 2541, 9, 0.3541912632821724, 1046.1731601731597, 6, 5472, 734.0, 1937.6000000000004, 2347.6000000000004, 3311.1799999999985, 20.685949673144084, 191.68771420663154, 6.20174467739769], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_25threads_ZARR", 4269, 0, 0.0, 619.9997657531026, 344, 7743, 435.0, 723.0, 1148.5, 5101.6, 35.028841972249346, 215.12267742377188, 10.330771753534476], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_50threads_ZARR", 2678, 0, 0.0, 1985.5982076176235, 575, 8834, 1394.0, 4226.299999999999, 4820.249999999998, 6106.180000000002, 21.86175987983379, 203.29047758567557, 6.554258088973608], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_50threads_ZARR", 4969, 0, 0.0, 1065.3859931575782, 369, 8397, 646.0, 1972.0, 2595.0, 6346.800000000001, 40.76225164476382, 5520.125285065053, 10.867279979512231], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_50threads_ZARR", 7360, 45, 0.6114130434782609, 717.4804347826087, 6, 14693, 436.0, 1187.0, 1678.9499999999998, 5677.560000000001, 60.74612083195774, 19711.81979149472, 16.135688345988775], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_25threads_ZARR", 1590, 0, 0.0, 1672.3352201257853, 769, 7591, 1579.0, 2398.7000000000003, 2640.7999999999993, 3362.239999999989, 12.991682055137026, 2579.639291871619, 3.527038682937591], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_100threads_ZARR", 5913, 0, 0.0, 1877.2550312869987, 196, 13198, 894.0, 7657.800000000007, 8637.6, 9335.019999999997, 46.9010263813316, 892.274026873602, 13.511526154778146], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_100threads_ZARR", 4974, 1, 0.02010454362685967, 2180.4895456373138, 346, 15546, 1546.0, 4553.5, 7237.25, 9533.25, 40.21473731869411, 246.90927593361414, 11.86020573266174], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_25threads_ZARR", 4612, 0, 0.0, 573.87250650477, 184, 7903, 353.0, 523.0, 721.6999999999989, 6503.0, 38.284025633363214, 728.3466712892636, 11.029089415861474], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_100threads_ZARR", 5256, 0, 0.0, 2016.886605783873, 371, 13375, 1473.0, 3833.3, 6396.15, 8526.170000000006, 43.02694914699237, 5826.832699133178, 11.471051872196208], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_50threads_ZARR", 7459, 1, 0.01340662287169862, 710.2864995307697, 269, 8578, 412.0, 1251.0, 1596.0, 5592.799999999999, 60.45060377664316, 667.311076034322, 17.769171617939055], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_5threads_ZARR", 1220, 0, 0.0, 443.3754098360657, 346, 5666, 385.0, 475.8000000000002, 617.0, 1736.3199999999997, 10.117931961054255, 62.1411166423394, 2.983999465076548], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_25threads_ZARR", 5656, 0, 0.0, 468.211987270156, 274, 8678, 387.0, 467.0, 592.2999999999993, 4130.440000000002, 45.934817389609435, 14997.246850534188, 12.201435869115008], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_50threads_ZARR", 1644, 0, 0.0, 3262.9957420924534, 785, 19649, 2730.5, 5962.0, 7262.0, 10212.899999999996, 13.258599137061978, 2632.641697056837, 3.5995025001008103], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_5threads_ZARR", 547, 2, 0.3656307129798903, 991.3912248628887, 11, 5767, 902.0, 1049.4, 1534.8000000000015, 2780.799999999999, 4.519689983970387, 894.1556527626295, 1.2270252104919603], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_100threads_ZARR", 7925, 12, 0.15141955835962145, 1372.455520504735, 78, 10728, 944.0, 2656.0, 3848.3999999999996, 7499.1799999999985, 63.96287328490718, 705.0991695671912, 18.80158677612994], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_5threads_ZARR", 1683, 0, 0.0, 321.16934046345744, 179, 5859, 252.0, 318.0, 342.0, 4554.4400000000005, 13.997122397890866, 266.2777283031088, 4.032374128298638], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_100threads_ZARR", 7739, 6, 0.07752939656286342, 1365.607184390743, 6, 10780, 915.0, 2726.0, 3785.0, 6951.000000000002, 63.82154049150586, 20820.918828859474, 16.952596693056243], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_5threads_ZARR", 1446, 0, 0.0, 373.73029045643165, 281, 3148, 349.0, 374.0, 406.0, 1337.7799999999993, 12.036458983643401, 3929.774357038436, 3.1971844175302784], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_25threads_ZARR", 4120, 0, 0.0, 642.6330097087379, 360, 6002, 498.0, 644.0, 943.0, 5357.48, 33.711082927627544, 4565.251011281348, 8.987427382072577], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_100threads_ZARR", 1406, 0, 0.0, 7850.054054054053, 820, 59709, 3512.0, 19717.499999999996, 25423.54999999997, 37200.51000000002, 10.851277301844563, 2154.6438987492284, 2.9459522362429578], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_5threads_ZARR", 763, 0, 0.0, 709.9239842726091, 584, 3472, 650.0, 744.0, 1139.7999999999997, 1727.1600000000014, 6.325703247415416, 58.8226797809632, 1.896475485309114], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_50threads_ZARR", 5966, 1, 0.016761649346295676, 948.5858196446544, 7, 9587, 525.0, 914.3000000000002, 6381.999999999993, 8242.949999999999, 46.530491276507796, 885.0559196030947, 13.404780201728318], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_5threads_ZARR", 1524, 0, 0.0, 355.9671916010498, 270, 4549, 319.5, 361.0, 436.75, 1045.0, 12.440511660938917, 137.34908373417386, 3.656830087834584], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_25threads_ZARR", 6206, 1, 0.016113438607798906, 426.32178536899806, 272, 7637, 342.0, 444.3000000000002, 694.0, 3297.110000000008, 51.20546543672338, 565.2464259156504, 15.051606539505602], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 89, 100.0, 0.08232508232508233], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 108108, 89, "502/Bad Gateway", 89, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_100threads_ZARR", 2724, 9, "502/Bad Gateway", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_50threads_ZARR", 4795, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_25threads_ZARR", 2541, 9, "502/Bad Gateway", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_50threads_ZARR", 7360, 45, "502/Bad Gateway", 45, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_100threads_ZARR", 4974, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_50threads_ZARR", 7459, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_5threads_ZARR", 547, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_100threads_ZARR", 7925, 12, "502/Bad Gateway", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_100threads_ZARR", 7739, 6, "502/Bad Gateway", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_50threads_ZARR", 5966, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_25threads_ZARR", 6206, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
