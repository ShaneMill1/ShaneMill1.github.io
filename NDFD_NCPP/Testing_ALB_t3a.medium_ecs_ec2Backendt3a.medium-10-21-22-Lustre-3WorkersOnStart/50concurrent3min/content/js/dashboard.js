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

    var data = {"OkPercent": 94.14324724086927, "KoPercent": 5.856752759130732};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.30354704744567074, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.08333333333333333, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -77"], "isController": false}, {"data": [0.4, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79"], "isController": false}, {"data": [0.375, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -79"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77"], "isController": false}, {"data": [0.4295774647887324, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -78"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -79"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -77"], "isController": false}, {"data": [0.06333333333333334, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -78"], "isController": false}, {"data": [0.23190546528803546, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -80"], "isController": false}, {"data": [0.006345177664974619, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.3635294117647059, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -79"], "isController": false}, {"data": [0.1, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -80"], "isController": false}, {"data": [0.44991558806978055, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -77"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -78"], "isController": false}, {"data": [0.08710155670867309, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}, {"data": [0.3, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80"], "isController": false}, {"data": [0.4, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -77"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77"], "isController": false}, {"data": [0.43149381541389153, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78"], "isController": false}, {"data": [0.25, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -79"], "isController": false}, {"data": [0.125, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_CityLevel1234_Summaries_24hourly_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.4356600189933523, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80"], "isController": false}, {"data": [0.41313660161827703, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -78"], "isController": false}, {"data": [0.44187358916478553, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -79"], "isController": false}, {"data": [0.3125, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78"], "isController": false}, {"data": [5.64334085778781E-4, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.43968432919954903, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -80"], "isController": false}, {"data": [0.41500474833808165, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77"], "isController": false}, {"data": [0.01406799531066823, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.625, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78"], "isController": false}, {"data": [0.25, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -80"], "isController": false}, {"data": [0.2, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -77"], "isController": false}, {"data": [0.3, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -77"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP "], "isController": false}, {"data": [0.125, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -79"], "isController": false}, {"data": [0.005980861244019139, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.3802236609770453, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST"], "isController": false}, {"data": [0.2240618101545254, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -78"], "isController": false}, {"data": [0.3654299175500589, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -80"], "isController": false}, {"data": [0.7, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -80"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -80"], "isController": false}, {"data": [0.22938144329896906, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -80"], "isController": false}, {"data": [0.25, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -79"], "isController": false}, {"data": [0.25, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -80"], "isController": false}, {"data": [0.22324723247232472, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -78"], "isController": false}, {"data": [0.3, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -78"], "isController": false}, {"data": [0.36704009433962265, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -77"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80"], "isController": false}, {"data": [0.14285714285714285, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -77"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 35156, 2059, 5.856752759130732, 3607.9746558197835, 35, 60103, 1169.0, 11408.500000000007, 14166.95, 51967.65000000005, 13.246665066536647, 523.8692034212623, 4.877918558382389], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_1Point_maxt_SOAP 34 -77", 6, 0, 0.0, 1642.0, 1385, 1995, 1610.5, 1995.0, 1995.0, 1995.0, 0.04439577352236067, 0.13331738630982332, 0.014003744968479], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79", 5, 2, 40.0, 517.2, 46, 1164, 468.0, 1164.0, 1164.0, 1164.0, 0.047620408202139114, 0.2132408396192272, 0.018090174600226674], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -79", 4, 0, 0.0, 1270.75, 825, 1855, 1201.5, 1855.0, 1855.0, 1855.0, 0.037631120937014914, 0.11168064114022297, 0.01186997271743732], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77", 3, 0, 0.0, 895.3333333333333, 241, 2095, 350.0, 2095.0, 2095.0, 2095.0, 0.0296653745747963, 0.20948273784214066, 0.01126936592733961], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 1775, 0, 0.0, 1249.5752112676048, 168, 19860, 1100.0, 1785.4, 2088.199999999997, 3227.4, 9.841864797728885, 59.4409701670206, 3.4792529851346257], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -79", 7, 0, 0.0, 1522.2857142857142, 1051, 2253, 1468.0, 2253.0, 2253.0, 2253.0, 0.05216600713929069, 0.3209941513522174, 0.018441498617600808], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -77", 3, 0, 0.0, 1261.6666666666667, 519, 1662, 1604.0, 1662.0, 1662.0, 1662.0, 0.11879306248515087, 0.5063786306129722, 0.04199520373010216], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 900, 61, 6.777777777777778, 9860.461111111103, 39, 46416, 10125.0, 12469.8, 12990.599999999999, 34864.470000000016, 4.339942905639997, 1033.393129358026, 1.57661988368953], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -78", 7, 0, 0.0, 1987.5714285714287, 1606, 2219, 2064.0, 2219.0, 2219.0, 2219.0, 0.04249145618220337, 0.12034305970353104, 0.013652040121039948], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 1354, 0, 0.0, 1604.3161004431315, 282, 3401, 1539.0, 2304.5, 2541.0, 2909.6500000000005, 7.45668623541981, 22.25689314951372, 2.3957517299346853], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -78", 4, 0, 0.0, 1929.5, 1587, 2555, 1788.0, 2555.0, 2555.0, 2555.0, 0.025549636556419984, 0.0758255327099222, 0.008059113874730132], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -80", 6, 0, 0.0, 1858.8333333333333, 1552, 2378, 1766.0, 2378.0, 2378.0, 2378.0, 0.04437213429965981, 0.13168644153971307, 0.013996288455849727], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 788, 3, 0.38071065989847713, 11163.442893401017, 43, 38527, 11244.0, 13018.5, 13564.75, 29318.370000000003, 4.352941826357394, 1186.6325965878018, 1.5813421478563972], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 1700, 0, 0.0, 1293.125882352941, 229, 3111, 1229.5, 1932.0, 2152.95, 2586.7700000000004, 9.387389974267508, 26.43290138684882, 2.961061486023833], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -80", 5, 0, 0.0, 2151.2, 1229, 3828, 1979.0, 3828.0, 3828.0, 3828.0, 0.03535317825072474, 0.09459046657356995, 0.011358589496570742], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 1777, 0, 0.0, 1216.5768148564994, 134, 20405, 1091.0, 1726.4, 2005.3999999999996, 2951.280000000006, 9.864166486258444, 58.229350327440926, 3.487136980493708], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -78", 3, 0, 0.0, 1846.0, 1420, 2229, 1889.0, 2229.0, 2229.0, 2229.0, 0.11125945705384957, 0.6848323806742324, 0.03933195649755229], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 1349, 0, 0.0, 6613.550778354337, 251, 9307, 6684.0, 9005.0, 9092.0, 9226.5, 7.356670356817599, 282.9085175596877, 2.6150664159000057], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80", 5, 1, 20.0, 1056.4, 49, 1903, 1099.0, 1903.0, 1903.0, 1903.0, 0.04772631820090871, 0.4010781822715819, 0.01813040798843114], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -77", 5, 0, 0.0, 1452.0, 1245, 1825, 1367.0, 1825.0, 1825.0, 1825.0, 0.043334691153656145, 0.26952992964612893, 0.015319490427366723], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77", 4, 0, 0.0, 980.75, 801, 1184, 969.0, 1184.0, 1184.0, 1184.0, 0.03989547385849075, 0.31449828013105663, 0.015155604815383694], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 2102, 446, 21.217887725975263, 1006.2264509990498, 36, 53643, 714.0, 1342.8000000000002, 1617.0, 3976.729999999998, 11.66494633680729, 94.2210421834593, 4.431312622087925], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -79", 6, 0, 0.0, 1366.5, 901, 1692, 1417.0, 1692.0, 1692.0, 1692.0, 0.048153320171425824, 0.250524231653585, 0.017022951076226707], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79", 8, 3, 37.5, 791.0, 43, 1667, 682.5, 1667.0, 1667.0, 1667.0, 0.11712344811431248, 0.495472789843933, 0.044493184879362845], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 350, 0, 0.0, 27374.691428571437, 18447, 29803, 27809.5, 29282.2, 29435.0, 29706.29, 1.7787716311335857, 738.7947313419562, 0.613189829873199], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 150, 150, 100.0, 60067.76666666664, 60056, 60103, 60067.0, 60073.9, 60083.45, 60099.94, 0.7894072078140788, 0.2967986084066605, 0.3407402205603739], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 2106, 448, 21.27255460588794, 1017.2146248812936, 35, 54135, 696.0, 1328.4999999999998, 1559.0, 3141.579999999999, 11.67606406865925, 94.84214045235046, 4.4355360573324685], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 2101, 445, 21.180390290337936, 1067.6901475487869, 35, 53788, 731.0, 1511.8, 1762.199999999999, 4596.1400000000085, 11.661273582025764, 94.83244724397649, 4.429917405671897], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -78", 7, 0, 0.0, 1590.0, 1316, 1893, 1596.0, 1893.0, 1893.0, 1893.0, 0.05237795935470354, 0.27969742609095805, 0.018516427037502618], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 1772, 0, 0.0, 1245.6698645598196, 178, 17903, 1133.0, 1767.7, 1950.0, 3357.97, 9.854517951683944, 59.02053718280075, 3.483726072763269], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78", 8, 1, 12.5, 1396.7500000000002, 48, 4565, 1134.0, 4565.0, 4565.0, 4565.0, 0.11597228262445275, 0.7731721454509872, 0.044055876895421994], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 886, 0, 0.0, 10408.269751693002, 1247, 15491, 10391.0, 13817.3, 14655.599999999999, 15233.94, 4.676448854639502, 716.6155516830729, 1.8998073471972976], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 1774, 0, 0.0, 1198.3455467869217, 157, 18104, 1101.5, 1716.0, 1862.5, 2586.75, 9.820365911040993, 58.25664416050817, 3.4716527927703504], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 2106, 444, 21.08262108262108, 1061.3528015194695, 35, 54211, 712.5, 1446.1999999999998, 1781.0, 3169.919999999993, 11.723707942728629, 93.15965688948764, 4.45363514621234], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 853, 7, 0.82063305978898, 10414.228604923805, 41, 60045, 10038.0, 11769.6, 12103.6, 16333.460000000006, 4.647108496091089, 299.4885356654, 1.7426656860341587], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78", 4, 0, 0.0, 890.75, 284, 1255, 1012.0, 1255.0, 1255.0, 1255.0, 0.039858105145681375, 0.2158915822173064, 0.015141409083662164], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -80", 6, 0, 0.0, 1347.8333333333333, 667, 1750, 1476.5, 1750.0, 1750.0, 1750.0, 0.0479620140848448, 0.2947509322616488, 0.016955321385462713], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -77", 5, 0, 0.0, 1729.2, 574, 2431, 2104.0, 2431.0, 2431.0, 2431.0, 0.035591495056341335, 0.056897731842998796, 0.011435158079625292], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -77", 5, 0, 0.0, 1344.4, 989, 1931, 1167.0, 1931.0, 1931.0, 1931.0, 0.06397707061789056, 0.06271502293577981, 0.020180267392166645], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -79", 3, 0, 0.0, 1038.0, 839, 1382, 893.0, 1382.0, 1382.0, 1382.0, 0.025364616360177554, 0.035429547135912065, 0.008149373811033608], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 353, 0, 0.0, 26647.83286118981, 6902, 48397, 24454.0, 41712.8, 44642.5, 46833.34, 1.7096086788066642, 382.3997264035863, 2.0552034019638707], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -79", 4, 0, 0.0, 1650.0, 1443, 1837, 1660.0, 1837.0, 1837.0, 1837.0, 0.025694060817841955, 0.07625415119670088, 0.008104669574377882], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 1254, 0, 0.0, 7139.574960127597, 286, 12637, 7297.0, 8836.0, 9823.25, 10896.0, 6.8149951632012, 297.4443651378895, 3.793503167016293], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 1699, 0, 0.0, 1261.6945261918786, 263, 2862, 1232.0, 1820.0, 2066.0, 2515.0, 9.390475769366821, 25.83657350057758, 2.9620348374076984], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 383, 48, 12.532637075718016, 26203.284595300254, 40, 52935, 26820.0, 35923.4, 36536.2, 52106.91999999999, 1.8567716413279554, 1420.783250922932, 1.0625665838068181], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 1359, 0, 0.0, 1620.3524650478278, 471, 3480, 1571.0, 2348.0, 2608.0, 3062.0000000000014, 7.467402234176415, 22.762205831950478, 2.3991946631289456], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -78", 4, 0, 0.0, 1962.0, 1557, 2297, 1997.0, 2297.0, 2297.0, 2297.0, 0.07706238199822757, 0.1956285761761646, 0.024759300466227412], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -80", 1698, 0, 0.0, 1302.959363957596, 254, 3178, 1258.5, 1898.1000000000001, 2111.05, 2552.01, 9.346103038309113, 26.410694197902906, 2.9480383607166445], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -80", 5, 0, 0.0, 702.4, 366, 1469, 564.0, 1469.0, 1469.0, 1469.0, 0.04366964784795975, 0.07069024245388486, 0.015437902852501397], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -80", 3, 0, 0.0, 1460.3333333333333, 962, 1970, 1449.0, 1970.0, 1970.0, 1970.0, 0.025349827621172178, 0.035408890078922464, 0.008144622350943013], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 1358, 0, 0.0, 1598.7378497790899, 278, 3505, 1565.5, 2313.1000000000004, 2527.1, 2872.090000000004, 7.474886473097564, 22.829303271638913, 2.4015992672354476], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -79", 4, 0, 0.0, 1352.25, 714, 2004, 1345.5, 2004.0, 2004.0, 2004.0, 0.0770549594498276, 0.09003540916183468, 0.02475691568261062], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -80", 4, 0, 0.0, 1234.25, 910, 1565, 1231.0, 1565.0, 1565.0, 1565.0, 0.03775330105426093, 0.08859490472010648, 0.011908511953638947], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 1355, 0, 0.0, 1616.3468634686349, 322, 3876, 1572.0, 2291.4, 2558.000000000001, 3001.1600000000008, 7.453573314557297, 22.625751760597275, 2.3947515825091314], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -78", 5, 0, 0.0, 1322.6, 518, 1990, 1226.0, 1990.0, 1990.0, 1990.0, 0.06363671074569498, 0.12562035849741, 0.02007290778404246], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -77", 1696, 0, 0.0, 1294.2181603773572, 175, 2970, 1243.0, 1922.0, 2121.2999999999997, 2603.279999999998, 9.362768641349653, 26.53851170070055, 2.9532951866757204], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80", 3, 0, 0.0, 850.0, 367, 1299, 884.0, 1299.0, 1299.0, 1299.0, 0.029477945583712452, 0.20814001225791237, 0.01119816487506264], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -77", 7, 0, 0.0, 2060.0, 1009, 2937, 2118.0, 2937.0, 2937.0, 2937.0, 0.04242372819723397, 0.10354396272469424, 0.013630279860244118], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503/Service Unavailable", 1059, 51.43273433705682, 3.012288087381955], "isController": false}, {"data": ["502/Bad Gateway", 412, 20.009713453132587, 1.1719194447604961], "isController": false}, {"data": ["504/Gateway Time-out", 151, 7.33365711510442, 0.4295141654340653], "isController": false}, {"data": ["502/Proxy Error", 437, 21.22389509470617, 1.2430310615542155], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 35156, 2059, "503/Service Unavailable", 1059, "502/Proxy Error", 437, "502/Bad Gateway", 412, "504/Gateway Time-out", 151, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79", 5, 2, "503/Service Unavailable", 1, "502/Proxy Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 900, 61, "502/Proxy Error", 28, "503/Service Unavailable", 17, "502/Bad Gateway", 16, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 788, 3, "502/Proxy Error", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80", 5, 1, "502/Proxy Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 2102, 446, "503/Service Unavailable", 256, "502/Proxy Error", 97, "502/Bad Gateway", 93, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79", 8, 3, "502/Proxy Error", 2, "503/Service Unavailable", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 150, 150, "504/Gateway Time-out", 150, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 2106, 448, "503/Service Unavailable", 256, "502/Bad Gateway", 102, "502/Proxy Error", 90, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 2101, 445, "503/Service Unavailable", 255, "502/Bad Gateway", 95, "502/Proxy Error", 95, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78", 8, 1, "502/Proxy Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 2106, 444, "503/Service Unavailable", 269, "502/Proxy Error", 89, "502/Bad Gateway", 86, "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 853, 7, "503/Service Unavailable", 4, "502/Proxy Error", 2, "504/Gateway Time-out", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 383, 48, "502/Proxy Error", 28, "502/Bad Gateway", 20, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
