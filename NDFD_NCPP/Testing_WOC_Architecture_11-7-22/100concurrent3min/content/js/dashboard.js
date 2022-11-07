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

    var data = {"OkPercent": 99.63742280127144, "KoPercent": 0.36257719872856264};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4096034614036572, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.39655172413793105, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -80"], "isController": false}, {"data": [0.5230496453900709, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -79"], "isController": false}, {"data": [0.4796437659033079, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -78"], "isController": false}, {"data": [0.5130641330166271, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -77"], "isController": false}, {"data": [0.5599294947121034, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -80"], "isController": false}, {"data": [0.47831632653061223, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79"], "isController": false}, {"data": [0.5203592814371257, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -78"], "isController": false}, {"data": [0.5178571428571429, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -79"], "isController": false}, {"data": [0.4802295918367347, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77"], "isController": false}, {"data": [0.5059031877213696, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -78"], "isController": false}, {"data": [0.5041031652989449, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -79"], "isController": false}, {"data": [0.49682337992376113, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -80"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -80"], "isController": false}, {"data": [0.5135453474676089, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.3946991404011461, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -79"], "isController": false}, {"data": [0.3968253968253968, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -78"], "isController": false}, {"data": [0.42263610315186245, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -77"], "isController": false}, {"data": [0.527810650887574, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -78"], "isController": false}, {"data": [0.5215568862275449, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -77"], "isController": false}, {"data": [0.5029797377830751, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.4994061757719715, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -79"], "isController": false}, {"data": [0.39553314121037464, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -80"], "isController": false}, {"data": [0.5406839622641509, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -77"], "isController": false}, {"data": [0.5450819672131147, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -78"], "isController": false}, {"data": [0.36872309899569583, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -77"], "isController": false}, {"data": [0.5142135777071255, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}, {"data": [0.4134199134199134, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -79"], "isController": false}, {"data": [0.5019157088122606, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80"], "isController": false}, {"data": [0.3800287356321839, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -78"], "isController": false}, {"data": [0.5665467625899281, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -80"], "isController": false}, {"data": [0.5374554102259215, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -77"], "isController": false}, {"data": [0.46424010217113665, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77"], "isController": false}, {"data": [0.5292397660818714, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -78"], "isController": false}, {"data": [0.5057106598984772, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78"], "isController": false}, {"data": [0.5141342756183745, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -79"], "isController": false}, {"data": [0.4685494223363286, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_CityLevel1234_Summaries_24hourly_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.49680715197956576, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80"], "isController": false}, {"data": [0.467005076142132, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79"], "isController": false}, {"data": [0.5467289719626168, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -77"], "isController": false}, {"data": [0.5689858490566038, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -78"], "isController": false}, {"data": [0.5182567726737338, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -79"], "isController": false}, {"data": [0.4955470737913486, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -77"], "isController": false}, {"data": [0.47628205128205126, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.4958481613285884, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -77"], "isController": false}, {"data": [0.5031847133757962, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -79"], "isController": false}, {"data": [0.52989449003517, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -80"], "isController": false}, {"data": [0.47961783439490446, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -78"], "isController": false}, {"data": [0.5219454329774614, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -79"], "isController": false}, {"data": [0.47701149425287354, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -77"], "isController": false}, {"data": [0.5273483947681332, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -78"], "isController": false}, {"data": [0.5082802547770701, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.47058823529411764, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78"], "isController": false}, {"data": [0.48662420382165605, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -79"], "isController": false}, {"data": [0.491725768321513, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -80"], "isController": false}, {"data": [0.417027417027417, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -77"], "isController": false}, {"data": [0.535077288941736, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -77"], "isController": false}, {"data": [0.4272334293948127, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP "], "isController": false}, {"data": [0.46871008939974457, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -80"], "isController": false}, {"data": [0.4243937232524964, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -78"], "isController": false}, {"data": [0.5742049469964664, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -80"], "isController": false}, {"data": [0.5131736526946108, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -79"], "isController": false}, {"data": [0.0017537022603273578, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.539833531510107, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -78"], "isController": false}, {"data": [0.430835734870317, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST"], "isController": false}, {"data": [0.4367816091954023, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -79"], "isController": false}, {"data": [0.414616497829233, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -78"], "isController": false}, {"data": [0.5337278106508876, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -80"], "isController": false}, {"data": [0.4064748201438849, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -77"], "isController": false}, {"data": [0.5082063305978898, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -77"], "isController": false}, {"data": [0.5526627218934911, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -78"], "isController": false}, {"data": [0.5106007067137809, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -80"], "isController": false}, {"data": [0.5776470588235294, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -79"], "isController": false}, {"data": [0.4135714285714286, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -80"], "isController": false}, {"data": [0.415351506456241, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -79"], "isController": false}, {"data": [0.41079136690647483, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -80"], "isController": false}, {"data": [0.5415676959619953, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -79"], "isController": false}, {"data": [0.5285714285714286, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -80"], "isController": false}, {"data": [0.43185078909612623, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -78"], "isController": false}, {"data": [0.5285714285714286, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -78"], "isController": false}, {"data": [0.5178571428571429, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -77"], "isController": false}, {"data": [0.4840561224489796, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80"], "isController": false}, {"data": [0.40431654676258993, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -77"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 82741, 300, 0.36257719872856264, 3035.4502121076775, 44, 60377, 7242.0, 14406.0, 24736.95, 60045.990000000005, 31.893393938015624, 1583.005955588822, 12.382164926223808], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -80", 696, 0, 0.0, 1298.405172413795, 168, 4929, 1345.5, 1916.6000000000001, 2150.699999999999, 4503.539999999999, 3.8755157609875885, 11.68325228020647, 1.2527301922723553], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -79", 846, 0, 0.0, 1059.6749408983426, 129, 3668, 935.0, 2006.6000000000001, 2171.5499999999997, 2723.06, 4.710625076561578, 24.94474081121864, 1.6744800076839985], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -78", 786, 0, 0.0, 1140.3142493638677, 122, 3840, 1193.5, 1937.9, 2410.149999999999, 2847.97, 4.376197051356288, 39.69631302962563, 1.6709893037893635], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -77", 842, 0, 0.0, 1082.0047505938242, 160, 2944, 1111.0, 1725.9000000000008, 2098.7, 2728.8499999999995, 4.690494228798075, 12.964912773937119, 1.4886822503509514], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -80", 851, 0, 0.0, 1001.528789659225, 141, 4377, 672.0, 1918.0, 2068.9999999999995, 2666.84, 4.747188504105677, 24.009157103838472, 1.6874771635688146], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79", 784, 0, 0.0, 1098.6798469387752, 119, 2928, 1246.0, 1825.5, 1986.75, 2516.799999999998, 4.331994319782958, 40.153624954414596, 1.6541111123390004], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -78", 835, 0, 0.0, 1044.0718562874254, 147, 3152, 1086.0, 1671.4, 2056.7999999999975, 2540.9999999999995, 4.648780460646821, 12.360094021236854, 1.4754430172951336], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -79", 840, 0, 0.0, 1060.9523809523826, 155, 2671, 1121.0, 1752.6999999999998, 1958.9499999999998, 2528.4900000000002, 4.657971785999467, 12.627773641979415, 1.478360185986159], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77", 784, 0, 0.0, 1135.9056122448992, 123, 3532, 1255.5, 1935.0, 2139.75, 3093.3, 4.354418568484896, 40.31044888626303, 1.6626734963648382], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 847, 0, 0.0, 1066.1251475796928, 133, 2554, 1118.0, 1952.8000000000002, 2077.3999999999996, 2328.8399999999997, 4.719109887844532, 22.12575168156594, 1.6774960929447358], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -79", 853, 0, 0.0, 1077.6483001172317, 110, 3638, 1228.0, 1952.0, 2065.8999999999996, 2547.7000000000035, 4.740126588609248, 25.050155240187717, 1.6849668732946936], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -80", 787, 0, 0.0, 1112.712833545108, 125, 3545, 1264.0, 1806.0, 2101.599999999998, 3254.2000000000003, 4.363180742128811, 40.62482783073132, 1.6660192091527004], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -80", 844, 0, 0.0, 1058.8578199052129, 168, 2526, 1107.0, 1679.0, 1849.5, 2327.899999999999, 4.698677800974252, 12.785490605427976, 1.4912795755045234], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -77", 849, 0, 0.0, 1057.6065959952864, 135, 2618, 1132.0, 1953.0, 2119.5, 2384.0, 4.724619776623984, 22.1711810801655, 1.6794546862218067], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 1581, 0, 0.0, 11353.459203036062, 2644, 15857, 11263.0, 13587.4, 14290.699999999999, 15203.760000000006, 8.541744331166832, 3819.936465584834, 3.1197386522035107], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -79", 698, 0, 0.0, 1298.538681948425, 170, 4516, 1348.5, 1900.3000000000002, 2161.3999999999996, 2768.14, 3.8721416604719794, 11.553658268936326, 1.251639540640845], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -78", 693, 0, 0.0, 1258.9249639249651, 147, 3048, 1335.0, 1877.0, 2023.7999999999997, 2478.5399999999886, 3.8480759620189904, 11.67317274522461, 1.2438604916291853], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 698, 0, 0.0, 1247.1332378223494, 137, 3291, 1326.5, 1938.0000000000005, 2199.7999999999993, 2954.129999999999, 3.882890249940199, 11.15830070356525, 1.2551139382130916], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -78", 845, 0, 0.0, 1041.465088757398, 131, 2956, 1079.0, 1742.4, 2150.2999999999993, 2619.959999999999, 4.689936893985226, 12.41783396201151, 1.488505361860545], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -77", 835, 0, 0.0, 1031.7628742514962, 135, 2702, 1059.0, 1636.3999999999999, 1867.1999999999998, 2456.04, 4.650437475285848, 12.655521846265449, 1.475968925261622], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -80", 839, 0, 0.0, 1091.8247914183555, 139, 2890, 1113.0, 1808.0, 2211.0, 2689.4, 4.657669610787585, 12.39067648105844, 1.478264280767544], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 1679, 0, 0.0, 11033.9231685527, 4372, 19281, 11044.0, 12928.0, 13416.0, 14109.800000000001, 8.79974423614132, 3935.3160891042894, 3.2139690862469275], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 842, 0, 0.0, 1094.8491686460832, 130, 3236, 1114.5, 1839.2000000000003, 2168.7999999999993, 2720.14, 4.6637864185222115, 12.246734189791736, 1.4802056504098815], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -80", 694, 0, 0.0, 1299.9740634005757, 160, 2907, 1348.5, 1968.0, 2262.5, 2818.2, 3.836670610218591, 11.776182149945269, 1.240173800764017], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 848, 0, 0.0, 1011.357311320755, 119, 3686, 796.5, 1939.4, 2051.6499999999996, 2521.3399999999997, 4.697930805240852, 24.687919829090607, 1.6699675909254592], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -78", 854, 0, 0.0, 1023.500000000001, 130, 2775, 951.5, 1935.0, 2133.25, 2663.25, 4.748639075627916, 20.83593437223714, 1.6879927964146106], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -77", 697, 0, 0.0, 1350.2611190817786, 139, 3024, 1388.0, 1973.0, 2399.4000000000005, 2859.06, 3.8726740341928783, 11.79784451415165, 1.2518116262869556], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 5347, 0, 0.0, 3346.479521226856, 44, 9747, 540.0, 7988.2, 8440.0, 9613.52, 29.072106653907632, 1133.0387603593508, 10.391006870439643], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -79", 693, 0, 0.0, 1241.207792207792, 141, 2972, 1328.0, 1927.6, 2088.7, 2572.979999999998, 3.8337279546812417, 11.159043395324844, 1.2392226103510655], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80", 783, 0, 0.0, 1102.1328224776491, 127, 3145, 1161.0, 1992.2, 2289.7999999999993, 2771.3199999999997, 4.354233282357848, 39.14645749339636, 1.6626027474628111], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -78", 696, 0, 0.0, 1350.0603448275867, 152, 4355, 1386.5, 1954.6000000000001, 2491.3, 3681.7999999999984, 3.8607896868100777, 11.851967352474567, 1.2479701038419295], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -80", 834, 0, 0.0, 973.2697841726617, 144, 2661, 1023.0, 1586.5, 1840.0, 2368.3499999999995, 4.610791685095091, 12.092281916878594, 1.4633860328670942], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -77", 841, 0, 0.0, 1030.7728894173604, 138, 3007, 846.0, 1960.4000000000005, 2157.4999999999995, 2678.5400000000004, 4.667865547711025, 20.707111080005884, 1.6592803314129034], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77", 783, 0, 0.0, 1121.288633461047, 127, 3168, 1261.0, 1794.0, 2063.5999999999995, 2779.9199999999973, 4.331015714451654, 40.02939891254446, 1.6537374456548795], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -78", 855, 0, 0.0, 1051.4690058479541, 117, 3514, 1011.0, 1961.5999999999997, 2099.1999999999994, 2956.0799999999936, 4.782414140284149, 25.225688739302495, 1.6999987764291307], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 788, 0, 0.0, 1065.2791878172584, 121, 2708, 1175.0, 1795.3000000000002, 2005.1, 2433.220000000001, 4.387210279879519, 39.20611932843113, 1.6751945502274335], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -79", 849, 0, 0.0, 1054.186101295644, 128, 2812, 1168.0, 1958.0, 2086.0, 2502.0, 4.70665195722435, 24.410792548008956, 1.6730676879195931], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79", 779, 0, 0.0, 1160.0205391527622, 123, 3505, 1271.0, 1963.0, 2287.0, 2962.400000000006, 4.330087157595162, 41.03835305044635, 1.653382889277059], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 800, 0, 0.0, 22678.432499999977, 12713, 31312, 22532.0, 29197.5, 29641.949999999997, 31165.53, 4.274097898212359, 1851.2770870954298, 1.4817429236966673], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 300, 300, 100.0, 60051.583333333336, 60037, 60377, 60048.0, 60057.0, 60069.95, 60180.25, 1.5785734957510065, 0.5935066365860717, 0.6844596016732879], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 783, 0, 0.0, 1130.770114942528, 132, 4861, 1210.0, 1844.6000000000001, 2229.9999999999995, 3454.5199999999977, 4.361169439508965, 40.25313071776885, 1.6652512215312552], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 788, 0, 0.0, 1168.418781725887, 121, 4449, 1286.5, 1879.4, 2159.2999999999997, 2953.0800000000004, 4.387845445383017, 40.36572890159088, 1.6754370792429296], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -77", 856, 0, 0.0, 1010.4450934579442, 106, 2864, 774.5, 1939.2000000000003, 2061.15, 2460.4399999999996, 4.791062653218855, 25.672805244842333, 1.70307305251139], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -78", 848, 0, 0.0, 976.3419811320751, 117, 3157, 649.0, 1917.1, 2058.55, 2527.79, 4.7330672843468315, 24.21950218722965, 1.6824575112326627], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 849, 0, 0.0, 1042.4793875147234, 142, 2588, 994.0, 1952.0, 2105.0, 2319.5, 4.727776942481499, 21.053463268890226, 1.68057696002272], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -77", 786, 0, 0.0, 1099.665394402036, 139, 3092, 1190.0, 1901.3000000000002, 2165.3999999999996, 2720.7499999999995, 4.360997370085555, 39.120421663642816, 1.6651855192416525], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78", 780, 0, 0.0, 1135.369230769232, 121, 3084, 1240.5, 1925.5, 2245.7999999999997, 2841.119999999997, 4.327275148125957, 40.46908655139749, 1.652309163005126], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 1800, 0, 0.0, 9970.246111111115, 2114, 12324, 10121.5, 11306.0, 11502.75, 11792.93, 9.749228186101933, 1500.0863212912311, 3.979665411904891], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -77", 843, 0, 0.0, 1107.5634638196948, 136, 3436, 1116.0, 1802.2, 2252.599999999999, 2774.6799999999985, 4.698289555083684, 12.741433711551217, 1.491156352931833], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -79", 785, 0, 0.0, 1076.4407643312095, 101, 3235, 1194.0, 1822.1999999999998, 2150.8999999999996, 2699.239999999999, 4.346502034827386, 41.00440511579137, 1.6596506793139725], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 853, 0, 0.0, 1029.6025791324732, 130, 2904, 955.0, 1926.8000000000002, 2119.2999999999993, 2437.3600000000006, 4.747381426774564, 24.854770582653412, 1.6875457415487707], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -78", 785, 0, 0.0, 1131.547770700636, 121, 2969, 1287.0, 1815.1999999999998, 2060.5999999999995, 2683.68, 4.352671764190541, 39.585249467698745, 1.6620065037094744], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -79", 843, 0, 0.0, 1059.5539739027306, 171, 3147, 1089.0, 1757.0000000000002, 2060.8, 2664.7999999999984, 4.691517424841112, 12.709220224794919, 1.4890069951888294], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -77", 783, 0, 0.0, 1111.5402298850595, 115, 3414, 1242.0, 1852.4, 2054.0, 2728.079999999994, 4.366325204793478, 39.090082511626804, 1.6672198780021972], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -78", 841, 0, 0.0, 1018.3353151010681, 152, 2989, 1073.0, 1616.0, 1802.8, 2463.600000000001, 4.684506038055345, 12.340796726346309, 1.4867817015312375], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 785, 0, 0.0, 1070.615286624204, 116, 2947, 1171.0, 1788.1999999999998, 2100.7999999999997, 2773.7999999999997, 4.371359520653978, 42.502803012479255, 1.6691421607184622], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 1600, 0, 0.0, 10970.466249999981, 8454, 18659, 10395.5, 12863.800000000003, 16679.85, 17146.370000000003, 8.859946397324295, 828.4569018982436, 3.339784481803885], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78", 782, 0, 0.0, 1169.4910485933508, 131, 4938, 1282.5, 1836.0, 2167.0999999999995, 3480.7099999999973, 4.349760818778507, 39.86714013307932, 1.6608950001390588], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -79", 785, 0, 0.0, 1120.2789808917207, 120, 3122, 1224.0, 1852.8, 2216.2999999999934, 2875.66, 4.353371783496007, 40.686132639196984, 1.662273796237245], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -80", 846, 0, 0.0, 1100.343971631207, 118, 2756, 1237.0, 1986.3000000000002, 2120.0, 2430.12, 4.69723385117653, 21.910979246249433, 1.669719845535407], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -77", 693, 0, 0.0, 1250.1096681096683, 144, 2959, 1349.0, 1895.2, 2099.2999999999993, 2790.3599999999997, 3.846858398974171, 11.592567241960733, 1.243466923887159], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -77", 841, 0, 0.0, 1031.6183115338877, 147, 2807, 1087.0, 1655.0000000000005, 2024.9999999999998, 2577.680000000002, 4.675781011102895, 12.276308695715628, 1.4840125279379306], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -79", 694, 0, 0.0, 1213.8587896253593, 153, 2832, 1333.5, 1914.5, 2076.5, 2578.8499999999995, 3.8841906723455697, 11.369134798626542, 1.2555342895960777], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 2974, 0, 0.0, 5956.807330195018, 2586, 16180, 5188.5, 9409.0, 10067.0, 10956.75, 16.05675474305953, 3510.499937067402, 19.333963474797265], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -80", 783, 0, 0.0, 1140.5210727969345, 132, 3168, 1257.0, 1854.8000000000002, 2045.0, 2786.719999999997, 4.363648522879897, 40.60598327163572, 1.6661978246543354], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -78", 701, 0, 0.0, 1250.1825962910134, 149, 2991, 1308.0, 1967.8000000000006, 2245.8, 2781.100000000001, 3.882494987649124, 11.451814406977968, 1.2549861727654885], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -80", 849, 0, 0.0, 979.3992932862196, 142, 3997, 538.0, 1940.0, 2091.5, 3406.5, 4.7550238591303176, 24.586815633961177, 1.6902623874252303], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -79", 835, 0, 0.0, 1026.4479041916163, 148, 2832, 1067.0, 1738.4, 1880.7999999999997, 2338.9999999999995, 4.640770979341622, 12.656874602269253, 1.4729009455918234], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 2566, 0, 0.0, 6855.391270459872, 610, 9169, 6730.0, 8212.3, 8960.6, 9095.33, 14.182750768278392, 663.3483059530521, 7.922395936968009], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 841, 0, 0.0, 1030.4851367419742, 137, 2762, 1077.0, 1685.4, 1942.0, 2450.4800000000005, 4.658660344330948, 12.245141876911104, 1.4785787225659746], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -80", 694, 0, 0.0, 1214.0864553314116, 148, 2907, 1282.5, 1877.5, 2037.25, 2689.3499999999995, 3.8477318341594313, 11.308061628854661, 1.2437492549870817], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 700, 0, 0.0, 27894.38571428573, 19184, 33854, 28067.5, 31478.0, 32291.649999999998, 33624.91, 3.481340017506167, 2897.416624237835, 1.9990507131773694], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 696, 0, 0.0, 1235.2528735632184, 147, 6246, 1285.5, 1944.5000000000005, 2133.3, 3388.8499999999976, 3.871721414068367, 11.397040928434345, 1.2515036992740523], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -78", 691, 0, 0.0, 1230.9406657018806, 138, 3018, 1301.0, 1906.0, 2185.4, 2671.3600000000006, 3.8455545167178666, 11.541190711469325, 1.2430454541343885], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -80", 845, 0, 0.0, 1021.9857988165688, 147, 2858, 1089.0, 1685.1999999999998, 1875.7999999999997, 2433.3599999999988, 4.683230708691966, 12.524194454874715, 1.486376933911024], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -77", 695, 0, 0.0, 1261.2676258992797, 146, 3246, 1318.0, 1881.4, 2117.0, 2777.199999999998, 3.8497116870599837, 11.5738827440828, 1.2443892269695846], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -77", 853, 0, 0.0, 1066.9167643610758, 126, 2583, 1184.0, 1948.6, 2090.8999999999996, 2351.2800000000007, 4.7163551918611075, 25.118660497069556, 1.676516884606878], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -78", 845, 0, 0.0, 993.4970414201181, 143, 2998, 908.0, 1882.0, 2032.8999999999996, 2307.7999999999993, 4.687647355778565, 21.08636270810103, 1.666312145999412], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -80", 849, 0, 0.0, 1075.7879858657243, 137, 3121, 1163.0, 1977.0, 2104.5, 2467.5, 4.743387750997284, 21.81238380725308, 1.686126114612316], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -79", 850, 0, 0.0, 943.5694117647062, 127, 3005, 576.0, 1883.0, 1993.4499999999998, 2273.45, 4.7528251351759385, 19.994989002102425, 1.6894808097695717], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -80", 700, 0, 0.0, 1282.1457142857137, 162, 3641, 1327.0, 1917.1999999999996, 2376.349999999999, 3010.59, 3.8825043262191063, 11.495960982218131, 1.2549891913852775], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -79", 697, 0, 0.0, 1251.9698708751791, 167, 2964, 1284.0, 1929.2000000000003, 2170.7000000000003, 2827.18, 3.8704375204766692, 11.333885147751316, 1.2510886907009546], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 695, 0, 0.0, 1248.909352517985, 145, 3036, 1321.0, 1887.8, 2015.1999999999998, 2533.359999999994, 3.8639876352395675, 11.311670693391191, 1.2490038156877896], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -79", 842, 0, 0.0, 1024.7315914489316, 133, 2651, 1098.0, 1640.0, 1865.6999999999998, 2491.2799999999997, 4.687621783523176, 12.711057369782097, 1.4877705855908518], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -80", 840, 0, 0.0, 1031.1107142857147, 150, 3200, 1080.0, 1648.0, 1940.0, 2708.2500000000023, 4.687892401707732, 12.195082072997181, 1.4878564751513799], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 697, 0, 0.0, 1215.473457675753, 168, 2841, 1298.0, 1876.0, 2042.5, 2535.2, 3.8782982227712304, 11.326365516044582, 1.253629601305935], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -78", 840, 0, 0.0, 1047.7630952380948, 148, 2834, 1076.5, 1743.9, 2127.7999999999997, 2622.750000000001, 4.66830057186682, 12.503660135213991, 1.4816383650944496], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -77", 840, 0, 0.0, 1042.0988095238092, 148, 2639, 1061.5, 1791.0, 2106.399999999999, 2413.59, 4.643115751770187, 12.326172490368299, 1.473645136059874], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80", 784, 0, 0.0, 1131.9489795918369, 129, 3339, 1246.5, 1824.5, 2084.5, 2747.499999999999, 4.354225097886757, 40.195264771528144, 1.662599622337619], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -77", 695, 0, 0.0, 1283.0906474820135, 166, 6188, 1338.0, 1909.3999999999999, 2085.6, 3374.039999999999, 3.8384429728878895, 11.479381270262285, 1.2407467031502848], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 300, 100.0, 0.36257719872856264], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 82741, 300, "504/Gateway Time-out", 300, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 300, 300, "504/Gateway Time-out", 300, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
