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

    var data = {"OkPercent": 99.9581895757065, "KoPercent": 0.041810424293502596};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.37130619716084173, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.44829372754904667, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -78"], "isController": false}, {"data": [0.4491613529248683, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -80"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.4517455229600725, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -77"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -78"], "isController": false}, {"data": [0.45037635907443546, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.44665698486287214, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -79"], "isController": false}, {"data": [0.4481671401843254, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -77"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -78"], "isController": false}, {"data": [0.08093615315225018, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP "], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -79"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -77"], "isController": false}, {"data": [0.21355916810462264, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -79"], "isController": false}, {"data": [0.4489379779099405, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -78"], "isController": false}, {"data": [0.4512524218101301, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79"], "isController": false}, {"data": [0.45172603493329666, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.4476153025110949, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -80"], "isController": false}, {"data": [0.45135527589545016, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80"], "isController": false}, {"data": [0.45055176776551625, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -80"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -80"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -78"], "isController": false}, {"data": [0.449334911901943, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -79"], "isController": false}, {"data": [0.4502938295788443, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -80"], "isController": false}, {"data": [0.0017421602787456446, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.44938194876044474, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -78"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -78"], "isController": false}, {"data": [0.44587585273721597, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -77"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 303752, 127, 0.041810424293502596, 1481.5354894782474, 0, 60065, 1273.0, 2344.9000000000015, 2700.0, 5515.980000000003, 84.22453628285949, 4974.625996401332, 34.81117104608265], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 14476, 2, 0.013815971262779773, 1254.6952196739412, 711, 60062, 1187.0, 1507.0, 1710.0, 2276.9199999999983, 4.0208028495593116, 35.71816492766805, 1.472461981039787], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 14428, 2, 0.01386193512614361, 1249.348558358752, 731, 60064, 1187.0, 1505.1000000000004, 1691.0, 2171.2599999999948, 4.007250156507172, 35.58626987811188, 1.4674988366115127], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -79", 1, 0, 0.0, 1148.0, 1148, 1148, 1148.0, 1148.0, 1148.0, 1148.0, 0.8710801393728222, 7.737641550522649, 0.31899907447735193], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 6956, 5, 0.0718803910293272, 2587.934013801042, 1771, 60062, 2462.5, 2901.0, 3126.1499999999996, 4974.43, 1.929277929737229, 1089.7886257923324, 0.7253632841297197], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 14351, 3, 0.020904466587694237, 1244.0488467702573, 741, 60061, 1181.0, 1492.0, 1659.3999999999996, 2154.4399999999987, 3.9858186953810777, 13.329127807931643, 1.389587181885786], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -78", 1, 0, 0.0, 1254.0, 1254, 1254, 1254.0, 1254.0, 1254.0, 1254.0, 0.7974481658692185, 2.3736543062200957, 0.2616626794258373], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 14348, 2, 0.013939224979091162, 1250.328199052132, 731, 60065, 1181.0, 1499.0, 1689.5499999999993, 2155.0200000000004, 3.985043034743032, 16.32735433088744, 1.5644407226237291], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 6186, 6, 0.09699321047526673, 2909.986420950537, 1832, 60062, 2761.0, 3276.0, 3521.0, 5319.730000000002, 1.717759315428761, 124.02532977131183, 0.6659672345949396], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 6815, 11, 0.16140865737344093, 2640.868818782104, 1604, 60062, 2463.0, 2895.0, 3139.3999999999996, 4910.640000000003, 1.8925088307822184, 1068.0621670232765, 0.7115389646983927], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 17903, 6, 0.03351393621180808, 1262.8098084119822, 701, 60064, 1184.0, 1516.0, 1707.7999999999993, 2264.8399999999965, 4.966443288144423, 27.538476095402704, 2.1354099770777406], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 14431, 0, 0.0, 1239.3837571893848, 722, 7176, 1184.0, 1509.0, 1694.3999999999996, 2155.6800000000003, 4.007944233723333, 35.585493357320544, 1.4677530152795408], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -78", 1, 0, 0.0, 1362.0, 1362, 1362, 1362.0, 1362.0, 1362.0, 1362.0, 0.7342143906020557, 6.518303735315712, 0.26887734030837], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 9977, 8, 0.08018442417560388, 1804.116367645586, 1063, 60063, 1684.0, 2084.0, 2293.300000000001, 3417.5999999999804, 2.7705161762933566, 203.48518547820632, 1.0200044906861283], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -77", 1, 1, 100.0, 1002.0, 1002, 1002, 1002.0, 1002.0, 1002.0, 1002.0, 0.998003992015968, 1.5964165419161676, 0.3479369386227545], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 6979, 3, 0.042986101160624735, 2579.0011462960247, 0, 60060, 2481.0, 2916.0, 3150.0, 4650.9999999999945, 1.938054458802666, 711.8110026371071, 2.3828228160474185], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -79", 1, 0, 0.0, 1217.0, 1217, 1217, 1217.0, 1217.0, 1217.0, 1217.0, 0.8216926869350862, 2.7483373562037796, 0.2864690324568611], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -77", 1, 0, 0.0, 1361.0, 1361, 1361, 1361.0, 1361.0, 1361.0, 1361.0, 0.7347538574577516, 2.187040778839089, 0.24109110947832477], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 11011, 6, 0.05449096358187267, 1634.7236399963647, 992, 60063, 1534.0, 1883.800000000001, 2098.0, 2778.799999999992, 3.057830514932438, 219.3656533842472, 1.7409328029351674], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -79", 1, 0, 0.0, 1973.0, 1973, 1973, 1973.0, 1973.0, 1973.0, 1973.0, 0.5068423720223011, 1.5086479979726304, 0.16630765331981753], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 17655, 8, 0.045312942509204195, 1264.3605210988417, 692, 60062, 1185.0, 1505.0, 1696.2000000000007, 2171.0, 4.89731722438201, 27.124281018596214, 2.1039584220402854], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 14452, 2, 0.013838915029061722, 1241.476681428176, 718, 60061, 1182.0, 1496.0, 1682.0, 2166.4699999999993, 4.012705605348793, 16.440706639969903, 1.5753004427248192], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79", 1, 0, 0.0, 1059.0, 1059, 1059, 1059.0, 1059.0, 1059.0, 1059.0, 0.9442870632672333, 3.869363786591124, 0.37070644475920683], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 14542, 3, 0.020629899601155275, 1242.1559620409864, 675, 60061, 1179.0, 1491.0, 1678.0, 2130.0, 4.0384359572429, 13.505118411489049, 1.407931285874722], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 2971, 23, 0.7741501178054527, 6062.586334567491, 4140, 60062, 5464.0, 6288.000000000001, 7467.200000000003, 10331.520000000008, 0.8238017995535776, 466.5771996830332, 0.366044744918826], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -80", 17801, 5, 0.02808830964552553, 1259.9734846356996, 693, 60062, 1189.0, 1513.0, 1711.0, 2220.8399999999965, 4.942259329656277, 27.703737706820547, 2.1366392345036944], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 14462, 9, 0.062232056423731155, 1267.8923385423916, 726, 60062, 1181.0, 1494.0, 1671.0, 2202.0, 4.016606342583026, 16.449752552698865, 1.576831786834352], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 14227, 4, 0.028115554930765445, 1249.8687706473627, 711, 60062, 1180.0, 1497.0, 1681.5999999999985, 2238.479999999994, 3.9515130709342006, 16.18797782110175, 1.5512775923003406], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -80", 1, 0, 0.0, 1053.0, 1053, 1053, 1053.0, 1053.0, 1053.0, 1053.0, 0.9496676163342831, 8.456122388414055, 0.3477786680911681], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -80", 1, 0, 0.0, 1388.0, 1388, 1388, 1388.0, 1388.0, 1388.0, 1388.0, 0.7204610951008645, 2.4097453620317006, 0.2511763778818444], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -78", 1, 0, 0.0, 1236.0, 1236, 1236, 1236.0, 1236.0, 1236.0, 1236.0, 0.8090614886731392, 7.184371207524272, 0.2962871662621359], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 14359, 1, 0.006964273278083432, 1248.286510202664, 743, 60060, 1187.0, 1504.0, 1691.0, 2189.5999999999985, 3.9833133044162374, 35.402825808514955, 1.4587328995664932], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 14294, 4, 0.02798376941374003, 1247.3988386735723, 689, 60061, 1177.0, 1499.0, 1688.25, 2170.349999999995, 3.970347112332158, 13.276597357978984, 1.3841932803736137], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 8897, 1, 0.011239743733842868, 2022.9944925255732, 1311, 60062, 1944.0, 2348.0, 2556.0, 3381.0600000000013, 2.470683371526131, 726.0066151704632, 1.0350812171725685], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 14481, 4, 0.027622401767833715, 1259.966024445828, 704, 60062, 1180.0, 1503.0, 1706.0, 2338.720000000001, 4.021845332954136, 13.448845169317579, 1.4021472498677994], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -78", 1, 0, 0.0, 1435.0, 1435, 1435, 1435.0, 1435.0, 1435.0, 1435.0, 0.6968641114982579, 2.074259581881533, 0.22865853658536583], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -77", 17737, 8, 0.04510345605232001, 1276.606190449343, 695, 60062, 1185.0, 1521.0, 1716.0, 2284.479999999996, 4.926354650318253, 27.226996671110346, 2.114725119020473], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -77", 1, 0, 0.0, 1609.0, 1609, 1609, 1609.0, 1609.0, 1609.0, 1609.0, 0.6215040397762585, 2.0787610705407085, 0.21667670136730888], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 1, 0.7874015748031497, 3.2921593931891806E-4], "isController": false}, {"data": ["502/Proxy Error", 125, 98.4251968503937, 0.04115199241486476], "isController": false}, {"data": ["Was not a proper XML response", 1, 0.7874015748031497, 3.2921593931891806E-4], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 303752, 127, "502/Proxy Error", 125, "502/Bad Gateway", 1, "Was not a proper XML response", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 14476, 2, "502/Proxy Error", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 14428, 2, "502/Proxy Error", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 6956, 5, "502/Proxy Error", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 14351, 3, "502/Proxy Error", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 14348, 2, "502/Proxy Error", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 6186, 6, "502/Proxy Error", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 6815, 11, "502/Proxy Error", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 17903, 6, "502/Proxy Error", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 9977, 8, "502/Proxy Error", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -77", 1, 1, "Was not a proper XML response", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 6979, 3, "502/Proxy Error", 2, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 11011, 6, "502/Proxy Error", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 17655, 8, "502/Proxy Error", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 14452, 2, "502/Proxy Error", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 14542, 3, "502/Proxy Error", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 2971, 23, "502/Proxy Error", 23, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -80", 17801, 5, "502/Proxy Error", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 14462, 9, "502/Proxy Error", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 14227, 4, "502/Proxy Error", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 14359, 1, "502/Proxy Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 14294, 4, "502/Proxy Error", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 8897, 1, "502/Proxy Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 14481, 4, "502/Proxy Error", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -77", 17737, 8, "502/Proxy Error", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
