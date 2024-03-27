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

    var data = {"OkPercent": 36.544381734222675, "KoPercent": 63.455618265777325};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.3580041046690611, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9884169884169884, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -78"], "isController": false}, {"data": [0.9882352941176471, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.9915254237288136, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.4583333333333333, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -79"], "isController": false}, {"data": [0.9894957983193278, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -77"], "isController": false}, {"data": [0.9967069154774972, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP "], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.35, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_CityLevel1234_Summaries_24hourly_REST"], "isController": false}, {"data": [0.9875518672199171, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.3888888888888889, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79"], "isController": false}, {"data": [0.9861751152073732, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.9901960784313726, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -80"], "isController": false}, {"data": [0.9891774891774892, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -78"], "isController": false}, {"data": [0.4666666666666667, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 7796, 4947, 63.455618265777325, 113.36005643919987, 27, 51202, 37.0, 106.0, 153.0, 1323.1799999999985, 88.4883430569113, 8171.001389901761, 44.42310785722798], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 259, 0, 0.0, 58.35521235521236, 29, 2868, 33.0, 37.0, 41.0, 1795.7999999999977, 4.330162339290789, 39.37101361744102, 1.5857528097988731], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 255, 0, 0.0, 59.654901960784365, 29, 2968, 33.0, 38.0, 41.0, 1762.599999999999, 4.4755686604886264, 40.783070942151085, 1.6390021950031592], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 289, 289, 100.0, 205.3529411764705, 138, 7621, 153.0, 165.0, 175.5, 1049.0000000001583, 4.8185941043083895, 2776.7133546126784, 1.8116784474206349], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 236, 0, 0.0, 60.54661016949154, 35, 1690, 41.0, 46.0, 49.0, 1411.0199999999993, 4.296377207354816, 6.8725252594210815, 1.4349228563626433], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 273, 273, 100.0, 60.135531135531174, 29, 2852, 33.0, 38.0, 39.0, 1916.6199999999924, 4.561708384854461, 51.01823521517729, 1.7908269245229422], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 501, 501, 100.0, 119.2534930139719, 41, 14808, 48.0, 52.80000000000001, 54.0, 64.0, 8.359055643613914, 725.6372300460915, 3.240766689955785], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 280, 280, 100.0, 211.98928571428567, 140, 8453, 152.0, 166.0, 171.0, 1711.4899999999823, 4.667522379102835, 2689.6588430535185, 1.754879019486906], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 12, 0, 0.0, 1219.9166666666665, 1005, 1692, 1158.5, 1589.4000000000003, 1692.0, 1692.0, 0.2548853016142736, 0.7985078589634664, 0.09583089953271029], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 238, 0, 0.0, 54.831932773109244, 29, 2275, 33.0, 38.0, 41.0, 1461.099999999994, 4.7582870166739974, 43.26698248005718, 1.7425367492702626], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -80", 1, 0, 0.0, 1666.0, 1666, 1666, 1666.0, 1666.0, 1666.0, 1666.0, 0.6002400960384153, 5.457261029411765, 0.21981448829531813], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 1252, 1252, 100.0, 47.457667731629435, 28, 7556, 34.0, 38.0, 40.0, 51.47000000000003, 20.894177333489093, 1689.8056236284024, 7.692485209692762], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -77", 1, 0, 0.0, 1574.0, 1574, 1574, 1574.0, 1574.0, 1574.0, 1574.0, 0.6353240152477764, 5.846966327827191, 0.23266260324015248], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 911, 0, 0.0, 65.59055982436895, 37, 7244, 42.0, 48.0, 50.0, 73.51999999999998, 15.207919469809525, 278.84782546888306, 18.475245918401416], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -79", 1, 0, 0.0, 1227.0, 1227, 1227, 1227.0, 1227.0, 1227.0, 1227.0, 0.8149959250203749, 1.3036751222493888, 0.27219590464547677], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 1218, 1218, 100.0, 48.79392446633827, 27, 7487, 34.0, 38.0, 39.0, 50.809999999999945, 20.323710996162188, 1675.723076662356, 11.57101905347906], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 10, 0, 0.0, 1452.0, 889, 2597, 1365.0, 2545.5, 2597.0, 2597.0, 0.1772075632187982, 0.5551580691463912, 0.06662589046800518], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 235, 235, 100.0, 58.0127659574468, 29, 2144, 33.0, 38.0, 41.0, 1774.9199999999996, 4.821798633481749, 53.92844341824486, 1.8929326666598272], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 6, 0, 0.0, 10860.666666666666, 38, 24443, 9927.5, 24443.0, 24443.0, 24443.0, 0.09205560158335635, 130.23185665600357, 0.05384893100432662], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 3, 3, 100.0, 24831.333333333332, 21540, 29653, 23301.0, 29653.0, 29653.0, 29653.0, 0.040270618556701034, 15.145291987153673, 0.014393599991945878], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 241, 0, 0.0, 71.85477178423243, 36, 3308, 41.0, 46.0, 50.0, 2102.879999999989, 4.023708155939561, 6.436361288504883, 1.3438556536438768], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 2, 0, 0.0, 44051.0, 36900, 51202, 44051.0, 51202.0, 51202.0, 51202.0, 0.022700960250618598, 15.627704606592358, 0.01008685245510885], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -80", 9, 0, 0.0, 1367.888888888889, 996, 2244, 1285.0, 2244.0, 2244.0, 2244.0, 0.15004001066951186, 0.47004722092558016, 0.05641152744898639], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 263, 263, 100.0, 53.821292775665434, 29, 2229, 33.0, 38.0, 40.79999999999998, 1533.9600000000005, 4.826750844222581, 54.00540457302525, 1.894876796267068], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 252, 252, 100.0, 55.45634920634913, 29, 1926, 33.0, 39.0, 44.74999999999997, 1751.5299999999997, 4.831751509922347, 54.03804989334675, 1.8968399482312337], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 217, 0, 0.0, 60.691244239631345, 29, 2162, 33.0, 37.0, 39.0, 1955.799999999997, 4.0274684484038605, 36.659554507702296, 1.474902996241648], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 380, 380, 100.0, 156.83947368421042, 93, 8056, 102.0, 111.0, 114.0, 1832.3799999999915, 6.337135614702154, 1621.503207914332, 2.654913260456274], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 204, 0, 0.0, 63.12745098039218, 37, 1668, 41.5, 47.0, 49.0, 1473.599999999997, 4.166921992769165, 6.665447484527238, 1.391686837428764], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 231, 0, 0.0, 61.14718614718616, 35, 1603, 41.0, 46.0, 51.0, 1504.9600000000005, 4.346762508702934, 6.953122059819732, 1.4517507597425814], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -77", 15, 0, 0.0, 1233.0666666666666, 943, 1669, 1209.0, 1521.4, 1669.0, 1669.0, 0.341888134202489, 1.0710714204312348, 0.12854192545699047], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80", 1, 1, 100.0, 1577.0, 1577, 1577, 1577.0, 1577.0, 1577.0, 1577.0, 0.6341154090044389, 7.09106987159163, 0.2489398383005707], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Was not a proper XML response", 4947, 100.0, 63.455618265777325], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 7796, 4947, "Was not a proper XML response", 4947, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 289, 289, "Was not a proper XML response", 289, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 273, 273, "Was not a proper XML response", 273, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 501, 501, "Was not a proper XML response", 501, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 280, 280, "Was not a proper XML response", 280, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 1252, 1252, "Was not a proper XML response", 1252, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 1218, 1218, "Was not a proper XML response", 1218, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 235, 235, "Was not a proper XML response", 235, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 3, 3, "Was not a proper XML response", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 263, 263, "Was not a proper XML response", 263, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 252, 252, "Was not a proper XML response", 252, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 380, 380, "Was not a proper XML response", 380, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80", 1, 1, "Was not a proper XML response", 1, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
