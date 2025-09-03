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

    var data = {"OkPercent": 99.7203144207238, "KoPercent": 0.2796855792762008};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4182201621725254, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.03986710963455149, 500, 1500, "NBM_ResLevel-1_Times-One_100threads_ZARR"], "isController": false}, {"data": [0.39530485091232753, 500, 1500, "HREF_ResLevel-1_Times-One_50threads_ZARR"], "isController": false}, {"data": [0.3065739570164349, 500, 1500, "NBM_ResLevel-1_Times-One_25threads_ZARR"], "isController": false}, {"data": [0.443791329904482, 500, 1500, "HREF_ResLevel-1_Times-One_25threads_ZARR"], "isController": false}, {"data": [0.21481051817478733, 500, 1500, "NBM_ResLevel-1_Times-One_50threads_ZARR"], "isController": false}, {"data": [0.36046228710462286, 500, 1500, "HREF_ResLevel-1_Time-All_50threads_ZARR"], "isController": false}, {"data": [0.5081792900376247, 500, 1500, "LREF_ResLevel-1_Time-All_50threads_ZARR"], "isController": false}, {"data": [0.023762376237623763, 500, 1500, "NBM_ResLevel-1_Time-All_25threads_ZARR"], "isController": false}, {"data": [0.5989423879766212, 500, 1500, "LREF_ResLevel-1_Time-All_25threads_ZARR"], "isController": false}, {"data": [0.00841452612931798, 500, 1500, "NBM_ResLevel-1_Time-All_50threads_ZARR"], "isController": false}, {"data": [0.3617389156477708, 500, 1500, "LREF_ResLevel-1_Times-One_100threads_ZARR"], "isController": false}, {"data": [0.3414099755123083, 500, 1500, "LREF_ResLevel-1_Time-All_100threads_ZARR"], "isController": false}, {"data": [0.439971448965025, 500, 1500, "MRMS_ResLevel-1_Times-One_100threads_ZARR"], "isController": false}, {"data": [0.21417565485362094, 500, 1500, "HREF_ResLevel-1_Times-One_100threads_ZARR"], "isController": false}, {"data": [0.43956043956043955, 500, 1500, "HREF_ResLevel-1_Time-All_25threads_ZARR"], "isController": false}, {"data": [0.004862953138815208, 500, 1500, "NBM_ResLevel-1_Time-All_100threads_ZARR"], "isController": false}, {"data": [0.6310767832803271, 500, 1500, "MRMS_ResLevel-1_Times-One_50threads_ZARR"], "isController": false}, {"data": [0.7809513917739925, 500, 1500, "MRMS_ResLevel-1_Times-One_25threads_ZARR"], "isController": false}, {"data": [0.19796466973886329, 500, 1500, "HREF_ResLevel-1_Time-All_100threads_ZARR"], "isController": false}, {"data": [0.5611182313361103, 500, 1500, "LREF_ResLevel-1_Times-One_50threads_ZARR"], "isController": false}, {"data": [0.706839562674803, 500, 1500, "LREF_ResLevel-1_Times-One_25threads_ZARR"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 88671, 248, 0.2796855792762008, 1473.6913985406698, 6, 55761, 1311.0, 4191.9000000000015, 5113.0, 15514.930000000011, 34.5883344190419, 7.032273946700161, 9.79629692723347], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NBM_ResLevel-1_Times-One_100threads_ZARR", 2709, 42, 1.550387596899225, 3938.3584348468066, 193, 19658, 3274.0, 6560.0, 8016.5, 11538.200000000006, 21.994349181605614, 4.490579559016952, 6.594008983157151], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_50threads_ZARR", 4494, 18, 0.40053404539385845, 1176.4583889630635, 6, 4232, 1035.0, 1973.5, 2303.75, 3109.250000000001, 37.110745930947914, 7.548136127443289, 10.94477077260378], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_25threads_ZARR", 1582, 10, 0.6321112515802781, 1678.145385587864, 6, 5230, 1293.0, 2443.1000000000004, 3231.85, 3597.51, 13.061965900177517, 2.658775363291087, 3.916038604838377], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_25threads_ZARR", 2722, 2, 0.07347538574577517, 974.82659808964, 334, 4511, 729.0, 1583.1000000000008, 1835.0999999999995, 3356.0, 22.499586708546868, 4.571342499793354, 6.63562029880972], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_50threads_ZARR", 2586, 17, 0.6573859242072699, 2062.563418406804, 210, 7166, 1656.0, 3446.6000000000004, 3873.3, 4823.39, 21.225776267513726, 4.320888082970131, 6.36358722082687], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_50threads_ZARR", 4110, 9, 0.21897810218978103, 1309.542579075426, 13, 5367, 1084.0, 2172.8, 2780.5999999999985, 3847.89, 33.37149538401579, 6.783509084293474, 8.896892812340145], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_50threads_ZARR", 6113, 4, 0.06543432030099787, 864.7531490266639, 188, 3762, 704.0, 1409.0, 1637.3000000000002, 2756.8799999999974, 50.56537599364728, 10.273321501244903, 13.431427998312557], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_25threads_ZARR", 1010, 7, 0.693069306930693, 2655.4089108910885, 79, 8130, 2448.5, 3958.2999999999997, 4494.15, 5769.089999999999, 8.234344554326293, 1.6764467554848073, 2.235495884865927], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_25threads_ZARR", 3593, 4, 0.11132758140829391, 736.1374895630403, 20, 2892, 579.0, 1204.6, 1366.2999999999997, 1769.6599999999994, 29.775667321350138, 6.050416065849555, 7.909161632233631], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_50threads_ZARR", 1129, 7, 0.6200177147918512, 4763.773250664305, 6, 16263, 4252.0, 8249.0, 9997.5, 13740.500000000013, 9.087543063202292, 1.8497038272924111, 2.4671259487990596], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_100threads_ZARR", 8097, 29, 0.3581573422255156, 1305.2120538471077, 47, 6507, 1125.0, 2205.3999999999996, 2659.0999999999995, 4128.099999999998, 66.84553785189466, 13.594132143667961, 19.648932513105756], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_100threads_ZARR", 7759, 19, 0.24487691712849594, 1392.8484340765608, 22, 7143, 1174.0, 2294.0, 3010.0, 5235.599999999997, 62.818281180423426, 12.7703286923653, 16.686105938549975], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_100threads_ZARR", 7005, 4, 0.05710206995003569, 1507.9096359743014, 43, 6259, 956.0, 4180.400000000001, 4521.7, 5113.94, 57.96489834421468, 11.7763502904451, 16.698872081585282], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_100threads_ZARR", 5192, 20, 0.3852080123266564, 2031.8786594761132, 36, 9492, 1702.5, 3725.7, 4505.899999999992, 5730.769999999997, 43.00434019149853, 8.746418979640858, 12.682920642414604], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_25threads_ZARR", 2639, 6, 0.22735884804850323, 1013.0617658203863, 103, 3828, 788.0, 1674.0, 1888.0, 2514.999999999999, 21.695701143566513, 4.410263093261096, 5.78410782440787], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_100threads_ZARR", 1131, 5, 0.4420866489832007, 9721.046861184801, 115, 55761, 6827.0, 19580.800000000017, 25139.6, 38784.76, 8.75285377084704, 1.7805308134697984, 2.376263035444801], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_50threads_ZARR", 6603, 1, 0.015144631228229592, 812.7592003634707, 45, 3729, 583.0, 2189.6000000000004, 2657.5999999999985, 3112.8, 53.80847994914964, 10.930396598669253, 15.501466391600728], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_25threads_ZARR", 4814, 0, 0.0, 549.4509763190676, 242, 3028, 456.0, 903.5, 1355.25, 1694.550000000001, 39.957170959254306, 8.116300351098532, 11.511099055644552], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_100threads_ZARR", 5208, 28, 0.5376344086021505, 2036.5948540706638, 41, 8878, 1756.0, 3551.7000000000025, 4534.4500000000035, 6237.0, 42.69377382465058, 8.68763961757593, 11.382226810673444], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_50threads_ZARR", 6242, 14, 0.2242870874719641, 845.9538609420038, 101, 3647, 780.0, 1389.6999999999998, 1604.0, 2142.1399999999994, 51.653798730584306, 10.4999843546999, 15.183392009673709], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_25threads_ZARR", 3933, 2, 0.05085176709890669, 673.1184846173401, 187, 3423, 524.0, 1040.7999999999993, 1261.0, 1645.0, 32.59302229220187, 6.6215744644484955, 9.580566123000745], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 248, 100.0, 0.2796855792762008], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 88671, 248, "502/Bad Gateway", 248, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["NBM_ResLevel-1_Times-One_100threads_ZARR", 2709, 42, "502/Bad Gateway", 42, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_50threads_ZARR", 4494, 18, "502/Bad Gateway", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_25threads_ZARR", 1582, 10, "502/Bad Gateway", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_25threads_ZARR", 2722, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_50threads_ZARR", 2586, 17, "502/Bad Gateway", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_50threads_ZARR", 4110, 9, "502/Bad Gateway", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_50threads_ZARR", 6113, 4, "502/Bad Gateway", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_25threads_ZARR", 1010, 7, "502/Bad Gateway", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_25threads_ZARR", 3593, 4, "502/Bad Gateway", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_50threads_ZARR", 1129, 7, "502/Bad Gateway", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_100threads_ZARR", 8097, 29, "502/Bad Gateway", 29, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_100threads_ZARR", 7759, 19, "502/Bad Gateway", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_100threads_ZARR", 7005, 4, "502/Bad Gateway", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_100threads_ZARR", 5192, 20, "502/Bad Gateway", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_25threads_ZARR", 2639, 6, "502/Bad Gateway", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_100threads_ZARR", 1131, 5, "502/Bad Gateway", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_50threads_ZARR", 6603, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_100threads_ZARR", 5208, 28, "502/Bad Gateway", 28, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_50threads_ZARR", 6242, 14, "502/Bad Gateway", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_25threads_ZARR", 3933, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
