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

    var data = {"OkPercent": 53.47640488860301, "KoPercent": 46.52359511139699};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.17780392959476055, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -77"], "isController": false}, {"data": [0.045454545454545456, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79"], "isController": false}, {"data": [0.25, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -79"], "isController": false}, {"data": [0.047619047619047616, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77"], "isController": false}, {"data": [0.10168195718654434, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -78"], "isController": false}, {"data": [0.14285714285714285, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -79"], "isController": false}, {"data": [0.07142857142857142, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -77"], "isController": false}, {"data": [0.3600833767587285, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -78"], "isController": false}, {"data": [0.19696969696969696, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -77"], "isController": false}, {"data": [0.05555555555555555, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -78"], "isController": false}, {"data": [0.2, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -80"], "isController": false}, {"data": [0.3533500139004726, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.2595118449389806, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -79"], "isController": false}, {"data": [0.10017820773930754, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -78"], "isController": false}, {"data": [0.10169773635153129, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}, {"data": [0.06818181818181818, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80"], "isController": false}, {"data": [0.13636363636363635, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -77"], "isController": false}, {"data": [0.08695652173913043, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77"], "isController": false}, {"data": [0.09245439469320066, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78"], "isController": false}, {"data": [0.11538461538461539, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -79"], "isController": false}, {"data": [0.05555555555555555, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_CityLevel1234_Summaries_24hourly_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.09889349930843706, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80"], "isController": false}, {"data": [0.0988114980652294, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79"], "isController": false}, {"data": [0.06666666666666667, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -78"], "isController": false}, {"data": [0.10104618525133963, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -79"], "isController": false}, {"data": [0.1388888888888889, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78"], "isController": false}, {"data": [0.3536380792618998, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.10045894951555329, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -80"], "isController": false}, {"data": [0.09571230982019364, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77"], "isController": false}, {"data": [0.21668704156479218, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.08695652173913043, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78"], "isController": false}, {"data": [0.20833333333333334, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -80"], "isController": false}, {"data": [0.2, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -79"], "isController": false}, {"data": [0.1689059500959693, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP "], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -80"], "isController": false}, {"data": [0.2222222222222222, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -79"], "isController": false}, {"data": [0.002041457286432161, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.24856938483547925, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST"], "isController": false}, {"data": [0.1923743500866551, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -79"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -78"], "isController": false}, {"data": [0.2503576537911302, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -80"], "isController": false}, {"data": [0.045454545454545456, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -80"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -80"], "isController": false}, {"data": [0.18441558441558442, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -79"], "isController": false}, {"data": [0.2, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -80"], "isController": false}, {"data": [0.19930675909878684, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -78"], "isController": false}, {"data": [0.1, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -78"], "isController": false}, {"data": [0.26105563480741795, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -77"], "isController": false}, {"data": [0.14285714285714285, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -77"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 68404, 31824, 46.52359511139699, 1851.3027015964017, 31, 60156, 87.0, 6907.700000000004, 11417.95, 22013.660000000214, 25.77615995357548, 84.74566261217532, 9.78624461909378], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_1Point_maxt_SOAP 34 -77", 5, 0, 0.0, 1557.2, 1049, 2616, 1381.0, 2616.0, 2616.0, 2616.0, 0.031700945956227335, 0.03943424312406482, 0.010061335386497934], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79", 22, 18, 81.81818181818181, 339.22727272727275, 35, 2148, 47.0, 1757.0999999999995, 2116.4999999999995, 2148.0, 0.17231521151692214, 0.17552776428845565, 0.06579614033507476], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -79", 10, 0, 0.0, 1689.3, 638, 2930, 1624.0, 2874.7000000000003, 2930.0, 2930.0, 0.06434426756920227, 0.0881968886329417, 0.020421764609365952], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77", 21, 16, 76.19047619047619, 463.1428571428571, 39, 2541, 52.0, 2010.0000000000005, 2497.7999999999993, 2541.0, 0.18444998770333415, 0.22064692539437164, 0.07042963397656607], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 3924, 2582, 65.80020387359836, 536.9859836901128, 31, 3609, 53.0, 1766.5, 2148.0, 2699.75, 21.62483880567404, 20.60236993546716, 7.686954419204444], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -79", 14, 7, 50.0, 920.3571428571429, 39, 3018, 592.5, 2612.5, 3018.0, 3018.0, 0.08527485914420588, 0.09196075072331353, 0.03031254758641693], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -77", 7, 6, 85.71428571428571, 249.99999999999997, 39, 1460, 51.0, 1460.0, 1460.0, 1460.0, 0.04451538642535088, 0.03352937657791147, 0.015823828768386446], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 7676, 3996, 52.05836373110996, 1163.7737102657659, 32, 18686, 72.0, 5115.6, 10345.649999999996, 16305.199999999983, 40.02398519175118, 73.27607961877884, 14.618135216518498], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -78", 1, 0, 0.0, 1644.0, 1644, 1644, 1644.0, 1644.0, 1644.0, 1644.0, 0.6082725060827251, 0.29403797901459855, 0.1966193354622871], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 1155, 0, 0.0, 1882.9099567099574, 380, 3905, 1727.0, 2999.8, 3315.0, 3712.1600000000008, 6.348351352391212, 10.614181308296278, 2.052054978165519], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -78", 9, 0, 0.0, 2109.0, 1114, 2920, 2245.0, 2920.0, 2920.0, 2920.0, 0.058777813334726585, 0.08636180234001006, 0.01865506770877553], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -80", 5, 0, 0.0, 1698.4, 824, 2297, 1903.0, 2297.0, 2297.0, 2297.0, 0.03172468053246704, 0.03946376763892238, 0.010068868333058386], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 3597, 1333, 37.05865999443981, 2492.975257158742, 34, 25617, 125.0, 10604.200000000006, 11820.599999999999, 17618.34, 19.193827239546646, 68.83346148227893, 7.010245495693796], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 1393, 0, 0.0, 1554.1708542713561, 276, 3377, 1500.0, 2453.0, 2640.499999999999, 3022.4199999999996, 7.6535097358357875, 12.809141416517406, 2.429092445455694], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 3928, 2557, 65.09674134419552, 561.1290733197549, 31, 3150, 52.0, 1849.1, 2235.0999999999995, 2747.9700000000003, 21.71173362223352, 20.940733113019302, 7.717842811028323], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -78", 7, 5, 71.42857142857143, 565.4285714285714, 41, 1887, 52.0, 1887.0, 1887.0, 1887.0, 0.044515669515669515, 0.032871294467974155, 0.01582392939814815], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 3004, 1065, 35.45272969374168, 2977.096870838883, 33, 35936, 4336.5, 4926.0, 5029.75, 30956.499999999236, 16.344385562096694, 25.415778415644688, 5.841840933327529], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80", 22, 16, 72.72727272727273, 471.6363636363635, 35, 2312, 49.5, 2056.5, 2277.0499999999993, 2312.0, 0.17054131363322764, 0.2240777203277494, 0.06511880237362501], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -77", 11, 5, 45.45454545454545, 1044.0909090909088, 43, 2981, 1010.0, 2919.0, 2981.0, 2981.0, 0.07084798598498022, 0.07840200153611315, 0.02518424501809844], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77", 23, 15, 65.21739130434783, 542.695652173913, 42, 2053, 60.0, 1721.2000000000003, 2000.7999999999993, 2053.0, 0.1872506716600179, 0.2661198404298624, 0.07149903576080763], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 3618, 2538, 70.14925373134328, 753.7493090105024, 33, 60060, 50.0, 1661.1, 2048.0999999999995, 2574.9099999999994, 18.250605326876514, 27.424026747881356, 6.968736994930387], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -79", 13, 8, 61.53846153846154, 589.3846153846155, 35, 1945, 46.0, 1810.6, 1945.0, 1945.0, 0.08887855770611279, 0.07462407147545243, 0.031593549809594786], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79", 18, 14, 77.77777777777777, 345.0, 39, 1759, 45.5, 1705.9, 1759.0, 1759.0, 0.15577941634645343, 0.17334178761207464, 0.059482179483850865], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 975, 261, 26.76923076923077, 9430.928205128203, 35, 42001, 12073.0, 14646.0, 14954.199999999999, 29674.64, 5.160860037475784, 262.1872800017997, 1.789165345023343], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 293, 293, 100.0, 30781.952218430026, 39, 60156, 60042.0, 60078.0, 60085.3, 60134.26, 1.5327714914965187, 0.7324180434799666, 0.6646001388910686], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 3615, 2505, 69.29460580912863, 572.5264177040124, 31, 60043, 50.0, 1628.0000000000005, 1995.1999999999998, 2458.2000000000007, 18.238416209234746, 27.88275428306375, 6.964082751768345], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 3618, 2544, 70.3150912106136, 650.535102266445, 32, 60057, 50.0, 1550.1, 1990.349999999998, 2459.8599999999997, 18.328267477203646, 27.4851289418693, 6.998391194908814], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -78", 15, 9, 60.0, 790.1333333333332, 39, 2473, 51.0, 2462.8, 2473.0, 2473.0, 0.09139709600960279, 0.09619901374916981, 0.03248881147216349], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 3919, 2545, 64.94003572339882, 561.370502679254, 33, 3387, 53.0, 1877.0, 2233.0, 2684.2000000000025, 21.604308733785743, 20.986912181503204, 7.679656620212901], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78", 18, 9, 50.0, 719.0, 40, 2125, 485.0, 1791.1000000000006, 2125.0, 2125.0, 0.15464980411024812, 0.2563904467231425, 0.05905085293662795], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 4769, 1959, 41.077794086810655, 1859.104005032501, 33, 33587, 73.0, 7135.0, 8297.5, 9490.0, 25.036354950310525, 140.70584403365393, 10.219918329325976], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 3922, 2554, 65.11983681795003, 562.1675165731773, 32, 3571, 52.0, 1855.0, 2227.3999999999996, 2681.0, 21.616556893653375, 20.974916550693084, 7.684010458290848], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 3615, 2539, 70.23513139695713, 645.1596127247573, 33, 60058, 50.0, 1607.0000000000005, 2009.3999999999996, 2527.2000000000007, 18.247622508934523, 27.365819125489633, 6.967598047845114], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 3272, 1085, 33.160146699266505, 2740.6176650366733, 33, 29384, 94.5, 6288.400000000001, 6620.049999999999, 10845.289999999994, 17.755011232540724, 24.344436729797707, 6.692806968516328], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78", 23, 11, 47.82608695652174, 1016.7391304347826, 40, 2853, 859.0, 2699.4, 2830.9999999999995, 2853.0, 0.18887292137138165, 0.3772406205091357, 0.0721184690002053], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -80", 12, 4, 33.333333333333336, 1139.333333333333, 43, 3329, 959.0, 3080.300000000001, 3329.0, 3329.0, 0.08204174557487334, 0.09448688015752016, 0.02916327674731826], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -77", 5, 0, 0.0, 1606.2, 718, 2631, 1600.0, 2631.0, 2631.0, 2631.0, 0.0325834788728723, 0.04053206580885228, 0.01034143616570654], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -79", 1, 0, 0.0, 3613.0, 3613, 3613, 3613.0, 3613.0, 3613.0, 3613.0, 0.2767783005812344, 0.4846323173263216, 0.08946642333241074], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 521, 182, 34.93282149712092, 18826.765834932827, 41, 60117, 13693.0, 51123.0, 60041.0, 60058.34, 2.3702827506198676, 3.68794126470053, 2.8540611635881805], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -80", 1, 0, 0.0, 1231.0, 1231, 1231, 1231.0, 1231.0, 1231.0, 1231.0, 0.8123476848090982, 1.4224017567018683, 0.28876421608448416], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -79", 9, 0, 0.0, 1522.9999999999998, 715, 2524, 1555.0, 2524.0, 2524.0, 2524.0, 0.0595293214980223, 0.09585021719934385, 0.018893583483259032], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 3184, 1122, 35.23869346733668, 2771.0731783919623, 35, 10995, 3933.0, 4843.5, 4991.5, 5245.0, 17.552080175079794, 98.19566534869875, 9.80448228529848], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 1398, 0, 0.0, 1561.4477825464937, 310, 3176, 1520.5, 2444.0, 2650.5999999999995, 2971.0699999999997, 7.674024141887108, 12.650771004759212, 2.4356033653450293], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 422, 2, 0.47393364928909953, 21636.83175355447, 58, 38947, 22878.5, 27839.7, 29479.55, 29871.16, 2.227218510191372, 207.78371348113726, 1.2789106288989518], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 1154, 0, 0.0, 1897.993934142114, 210, 4422, 1745.5, 3029.5, 3270.25, 3809.1500000000005, 6.338256375330232, 10.652565528041567, 2.0487918556975653], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -78", 1, 0, 0.0, 1479.0, 1479, 1479, 1479.0, 1479.0, 1479.0, 1479.0, 0.676132521974307, 1.1838921991210276, 0.21855455544286678], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -80", 1398, 0, 0.0, 1563.3061516452058, 179, 3682, 1528.0, 2407.3, 2631.1499999999996, 2931.13, 7.674866732911344, 12.512982732922325, 2.4358707892540887], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -80", 11, 7, 63.63636363636363, 675.7272727272727, 41, 2429, 49.0, 2281.6000000000004, 2429.0, 2429.0, 0.0708498112818663, 0.07157315363781576, 0.025184893854100915], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -80", 1, 0, 0.0, 1308.0, 1308, 1308, 1308.0, 1308.0, 1308.0, 1308.0, 0.764525993883792, 1.3386670967125383, 0.24712705466360854], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 1155, 0, 0.0, 1948.8753246753245, 338, 4384, 1804.0, 3126.0000000000005, 3486.4000000000005, 3921.76, 6.34775822460622, 10.585323720212251, 2.0518632542428303], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -79", 1, 0, 0.0, 2307.0, 2307, 2307, 2307.0, 2307.0, 2307.0, 2307.0, 0.43346337234503685, 0.7589842056783702, 0.14011364867793671], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -80", 10, 0, 0.0, 1781.8, 1112, 2887, 1639.5, 2854.0, 2887.0, 2887.0, 0.06510586213182634, 0.10574616200942732, 0.020663481633636294], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 1154, 0, 0.0, 1888.7781629116134, 204, 4079, 1718.0, 3033.5, 3261.5, 3723.3500000000004, 6.338465256532079, 10.562406625728457, 2.048859374914178], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -78", 5, 0, 0.0, 1689.8, 1000, 2308, 1626.0, 2308.0, 2308.0, 2308.0, 0.0326660743218523, 0.03235344978244395, 0.010367650541603513], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -77", 1402, 0, 0.0, 1552.2874465049929, 259, 3359, 1485.5, 2435.7, 2622.85, 2976.79, 7.720221804946007, 12.743145515443198, 2.4502657095775904], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80", 21, 12, 57.142857142857146, 573.7142857142856, 40, 2184, 59.0, 1604.8000000000002, 2127.7999999999993, 2184.0, 0.184435408085297, 0.2758640469519853, 0.07042406695444445], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -77", 1, 0, 0.0, 1628.0, 1628, 1628, 1628.0, 1628.0, 1628.0, 1628.0, 0.6142506142506142, 1.0755384290540542, 0.19855171222358722], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503/Service Unavailable", 30395, 95.50967823026646, 44.43453599204725], "isController": false}, {"data": ["504/Gateway Time-out", 223, 0.7007290095525389, 0.3260043272323256], "isController": false}, {"data": ["502/Bad Gateway", 580, 1.8225238813474107, 0.8479036313665868], "isController": false}, {"data": ["502/Proxy Error", 626, 1.9670688788335846, 0.9151511607508332], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 68404, 31824, "503/Service Unavailable", 30395, "502/Proxy Error", 626, "502/Bad Gateway", 580, "504/Gateway Time-out", 223, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79", 22, 18, "503/Service Unavailable", 16, "502/Bad Gateway", 1, "502/Proxy Error", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77", 21, 16, "503/Service Unavailable", 13, "502/Proxy Error", 2, "502/Bad Gateway", 1, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 3924, 2582, "503/Service Unavailable", 2582, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -79", 14, 7, "503/Service Unavailable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -77", 7, 6, "503/Service Unavailable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 7676, 3996, "503/Service Unavailable", 3996, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 3597, 1333, "503/Service Unavailable", 1333, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 3928, 2557, "503/Service Unavailable", 2557, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -78", 7, 5, "503/Service Unavailable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 3004, 1065, "503/Service Unavailable", 936, "502/Proxy Error", 67, "502/Bad Gateway", 62, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80", 22, 16, "503/Service Unavailable", 15, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -77", 11, 5, "503/Service Unavailable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77", 23, 15, "503/Service Unavailable", 13, "502/Bad Gateway", 1, "502/Proxy Error", 1, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 3618, 2538, "503/Service Unavailable", 2305, "502/Proxy Error", 109, "502/Bad Gateway", 108, "504/Gateway Time-out", 16, "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -79", 13, 8, "503/Service Unavailable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79", 18, 14, "503/Service Unavailable", 13, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 975, 261, "503/Service Unavailable", 237, "502/Proxy Error", 24, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 293, 293, "504/Gateway Time-out", 150, "503/Service Unavailable", 137, "502/Proxy Error", 4, "502/Bad Gateway", 2, "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 3615, 2505, "503/Service Unavailable", 2265, "502/Proxy Error", 118, "502/Bad Gateway", 116, "504/Gateway Time-out", 6, "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 3618, 2544, "503/Service Unavailable", 2284, "502/Proxy Error", 127, "502/Bad Gateway", 121, "504/Gateway Time-out", 12, "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -78", 15, 9, "503/Service Unavailable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 3919, 2545, "503/Service Unavailable", 2545, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78", 18, 9, "503/Service Unavailable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 4769, 1959, "503/Service Unavailable", 1855, "502/Proxy Error", 58, "502/Bad Gateway", 46, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 3922, 2554, "503/Service Unavailable", 2554, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 3615, 2539, "503/Service Unavailable", 2306, "502/Bad Gateway", 114, "502/Proxy Error", 108, "504/Gateway Time-out", 11, "", ""], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 3272, 1085, "503/Service Unavailable", 1074, "502/Proxy Error", 6, "502/Bad Gateway", 5, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78", 23, 11, "503/Service Unavailable", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -80", 12, 4, "503/Service Unavailable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 521, 182, "503/Service Unavailable", 154, "504/Gateway Time-out", 28, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 3184, 1122, "503/Service Unavailable", 1122, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 422, 2, "503/Service Unavailable", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -80", 11, 7, "503/Service Unavailable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80", 21, 12, "503/Service Unavailable", 10, "502/Bad Gateway", 1, "502/Proxy Error", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
