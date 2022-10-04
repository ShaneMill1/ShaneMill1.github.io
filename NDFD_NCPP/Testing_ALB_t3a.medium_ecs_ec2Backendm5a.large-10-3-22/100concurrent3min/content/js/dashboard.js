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

    var data = {"OkPercent": 99.36620547047056, "KoPercent": 0.6337945295294454};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.20143570431888103, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.28882575757575757, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -80"], "isController": false}, {"data": [0.23385300668151449, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -79"], "isController": false}, {"data": [0.26127819548872183, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -78"], "isController": false}, {"data": [0.32842287694974004, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -77"], "isController": false}, {"data": [0.21603563474387527, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -80"], "isController": false}, {"data": [0.2781954887218045, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79"], "isController": false}, {"data": [0.3125, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -78"], "isController": false}, {"data": [0.2977430555555556, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -79"], "isController": false}, {"data": [0.27358490566037735, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77"], "isController": false}, {"data": [0.22160356347438753, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -78"], "isController": false}, {"data": [0.22271714922049, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -79"], "isController": false}, {"data": [0.2514177693761815, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -80"], "isController": false}, {"data": [0.3382867132867133, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -80"], "isController": false}, {"data": [0.20935412026726058, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -77"], "isController": false}, {"data": [0.003194888178913738, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.2822429906542056, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -79"], "isController": false}, {"data": [0.27861163227016883, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -78"], "isController": false}, {"data": [0.28544423440453687, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -77"], "isController": false}, {"data": [0.3275563258232236, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -78"], "isController": false}, {"data": [0.34467713787085513, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -77"], "isController": false}, {"data": [0.3246527777777778, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -80"], "isController": false}, {"data": [0.002482073910645339, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.31195079086115995, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -79"], "isController": false}, {"data": [0.2947761194029851, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -80"], "isController": false}, {"data": [0.17260579064587972, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -77"], "isController": false}, {"data": [0.2222222222222222, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -78"], "isController": false}, {"data": [0.27973977695167285, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -77"], "isController": false}, {"data": [0.038461538461538464, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}, {"data": [0.2851782363977486, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -79"], "isController": false}, {"data": [0.2650943396226415, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80"], "isController": false}, {"data": [0.27902621722846443, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -78"], "isController": false}, {"data": [0.30521739130434783, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -80"], "isController": false}, {"data": [0.234375, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -77"], "isController": false}, {"data": [0.2579737335834897, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77"], "isController": false}, {"data": [0.25389755011135856, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -78"], "isController": false}, {"data": [0.2824858757062147, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78"], "isController": false}, {"data": [0.24720357941834453, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -79"], "isController": false}, {"data": [0.26033834586466165, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79"], "isController": false}, {"data": [0.012620192307692308, 500, 1500, "NDFD_CityLevel1234_Summaries_24hourly_REST"], "isController": false}, {"data": [0.027243589743589744, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.2768361581920904, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80"], "isController": false}, {"data": [0.2457627118644068, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79"], "isController": false}, {"data": [0.20515695067264575, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -77"], "isController": false}, {"data": [0.1860986547085202, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -78"], "isController": false}, {"data": [0.22172949002217296, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -79"], "isController": false}, {"data": [0.2523540489642185, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -77"], "isController": false}, {"data": [0.28330206378986866, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78"], "isController": false}, {"data": [0.017382413087934562, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.32809773123909247, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -77"], "isController": false}, {"data": [0.2689393939393939, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -79"], "isController": false}, {"data": [0.18819599109131402, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -80"], "isController": false}, {"data": [0.2617702448210923, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -78"], "isController": false}, {"data": [0.3298791018998273, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -79"], "isController": false}, {"data": [0.2660377358490566, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -77"], "isController": false}, {"data": [0.3382867132867133, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -78"], "isController": false}, {"data": [0.28383458646616544, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77"], "isController": false}, {"data": [0.035407182599898834, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.2570888468809074, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78"], "isController": false}, {"data": [0.2551594746716698, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -79"], "isController": false}, {"data": [0.28159645232815966, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -80"], "isController": false}, {"data": [0.2783018867924528, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -77"], "isController": false}, {"data": [0.33015597920277295, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -77"], "isController": false}, {"data": [0.27715355805243447, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP "], "isController": false}, {"data": [0.2789179104477612, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -80"], "isController": false}, {"data": [0.25469924812030076, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -78"], "isController": false}, {"data": [0.2639821029082774, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -80"], "isController": false}, {"data": [0.3379549393414211, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -79"], "isController": false}, {"data": [0.033786137234413094, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.3228621291448517, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -78"], "isController": false}, {"data": [0.30711610486891383, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST"], "isController": false}, {"data": [0.2768361581920904, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -79"], "isController": false}, {"data": [0.2712665406427221, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -78"], "isController": false}, {"data": [0.340630472854641, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -80"], "isController": false}, {"data": [0.26062846580406657, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -77"], "isController": false}, {"data": [0.2011111111111111, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -77"], "isController": false}, {"data": [0.2163677130044843, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -80"], "isController": false}, {"data": [0.2544642857142857, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -78"], "isController": false}, {"data": [0.23542600896860988, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -79"], "isController": false}, {"data": [0.28101503759398494, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -80"], "isController": false}, {"data": [0.3058161350844278, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -79"], "isController": false}, {"data": [0.28212290502793297, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -80"], "isController": false}, {"data": [0.35086206896551725, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -80"], "isController": false}, {"data": [0.3568935427574171, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -79"], "isController": false}, {"data": [0.27695167286245354, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -78"], "isController": false}, {"data": [0.3463541666666667, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -78"], "isController": false}, {"data": [0.31794425087108014, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -77"], "isController": false}, {"data": [0.2843691148775895, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80"], "isController": false}, {"data": [0.29924242424242425, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -77"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 59483, 377, 0.6337945295294454, 4238.671502782331, 102, 60347, 7183.5, 12420.800000000003, 23557.600000000006, 60184.0, 22.71677037894764, 818.6612231573105, 9.257920745794669], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -80", 528, 6, 1.1363636363636365, 1756.0928030303025, 104, 57745, 1558.0, 2600.5, 3136.099999999997, 4207.700000000003, 2.7012232243805863, 7.287400374807512, 0.8916146971099981], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -79", 449, 0, 0.0, 1954.2293986636982, 163, 4165, 2366.0, 2837.0, 3125.0, 4092.5, 2.497927665800644, 8.754862248885948, 0.9050109023555069], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -78", 532, 0, 0.0, 1647.9586466165426, 162, 4476, 1762.5, 2457.2999999999997, 2768.8999999999983, 4261.909999999997, 2.961132354823807, 25.19975445944028, 1.1509088644725343], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -77", 577, 0, 0.0, 1531.5615251299819, 249, 4341, 1409.0, 2751.000000000001, 3087.9, 3629.7800000000016, 3.2160972075135166, 7.256135344671423, 1.042719016498523], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -80", 449, 0, 0.0, 1986.051224944321, 166, 4213, 2383.0, 2868.0, 3149.5, 3831.5, 2.4852765354470177, 8.862970633676328, 0.9004273385262145], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79", 532, 0, 0.0, 1721.451127819549, 160, 6710, 1726.0, 2822.8, 3496.7499999999986, 5724.059999999926, 2.9529799008642463, 24.97727568003186, 1.1477402349062207], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -78", 576, 0, 0.0, 1586.1145833333317, 254, 4193, 1467.0, 2868.2000000000007, 3113.15, 3881.190000000001, 3.211597435182604, 7.403405526902705, 1.04126010593811], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -79", 576, 0, 0.0, 1585.189236111111, 255, 4840, 1504.5, 2789.8, 3039.3999999999996, 3502.0200000000013, 3.1940200846193516, 7.326961553230896, 1.0355611993101805], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77", 530, 0, 0.0, 1667.5037735849046, 165, 4511, 1806.5, 2610.5000000000005, 3010.2, 4122.429999999998, 2.9582165861064285, 26.26982122848316, 1.1497755871780846], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 449, 0, 0.0, 1995.40534521158, 164, 4406, 2414.0, 2903.0, 3079.0, 4247.0, 2.4818010468889047, 8.953891192162704, 0.8991681527302575], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -79", 449, 0, 0.0, 2003.9732739420945, 170, 6465, 2373.0, 2966.0, 3406.0, 5314.5, 2.4880308537990956, 9.229014555880951, 0.9014252409760396], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -80", 529, 0, 0.0, 1685.646502835538, 163, 4390, 1791.0, 2600.0, 3014.5, 4109.700000000001, 2.9489152005708297, 26.099877822443528, 1.1461604002218655], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -80", 572, 0, 0.0, 1500.8129370629374, 252, 4648, 1393.5, 2627.5, 2992.9000000000005, 3724.6199999999963, 3.1921780476371184, 7.00810086682702, 1.034963976382347], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -77", 449, 0, 0.0, 1957.7126948775067, 167, 4264, 2327.0, 2894.0, 3027.5, 3985.5, 2.4881963070511826, 9.074960247392658, 0.9014851854648328], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 1878, 0, 0.0, 9596.353035143786, 1198, 15978, 10042.5, 11375.0, 11611.05, 12108.21, 10.120388433225914, 1483.7332503580262, 3.7654960869717513], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -79", 535, 2, 0.37383177570093457, 1622.7084112149537, 102, 54195, 1619.0, 2450.0, 2644.4, 3467.7999999999993, 2.797385620915033, 7.572763480392157, 0.9233558006535948], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -78", 533, 4, 0.7504690431519699, 1650.2495309568485, 103, 37756, 1641.0, 2705.800000000001, 3288.1999999999994, 3973.9799999999937, 2.7280171972566283, 7.154947250230321, 0.900458801438223], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 529, 2, 0.3780718336483932, 1681.5293005671074, 118, 53745, 1598.0, 2436.0, 2902.0, 3909.4, 2.697259400892288, 7.157400215105162, 0.8903063256851498], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -78", 577, 0, 0.0, 1541.0034662045061, 251, 3966, 1408.0, 2745.8, 3077.5000000000005, 3763.88, 3.211961634593439, 7.625163477087637, 1.0413781862158416], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -77", 573, 0, 0.0, 1513.2495636998246, 249, 3910, 1366.0, 2720.0, 3078.8999999999996, 3617.3199999999997, 3.197580330137613, 6.9491807769896985, 1.0367154976618043], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -80", 576, 0, 0.0, 1553.6319444444432, 251, 4182, 1473.0, 2706.600000000002, 3109.15, 3848.9800000000005, 3.208198730088003, 7.114089739751588, 1.0401581820207197], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 1813, 0, 0.0, 10001.389409817988, 1238, 13234, 10327.0, 11629.0, 11849.6, 12449.359999999997, 9.59071504520279, 1418.314778075853, 3.568420343967054], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 569, 0, 0.0, 1570.7188049209135, 252, 3793, 1474.0, 2792.0, 3007.0, 3401.7999999999993, 3.1565691588214735, 7.16431157736923, 1.0234189069616497], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -80", 536, 2, 0.373134328358209, 1781.0298507462676, 105, 43368, 1577.0, 2482.2, 3326.2999999999984, 4389.45, 2.7452828255925916, 7.405967420893856, 0.9061578076663047], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 449, 0, 0.0, 2079.7527839643644, 169, 4440, 2400.0, 2874.0, 3186.0, 4268.0, 2.4861985525783927, 8.884184295697048, 0.9007613896548669], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -78", 450, 0, 0.0, 2004.1111111111113, 165, 6574, 2407.5, 2946.5, 3318.5, 4414.85, 2.4855012427506216, 8.947221934548466, 0.9005087510356254], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -77", 538, 4, 0.7434944237918215, 1733.486988847584, 109, 55797, 1583.0, 2383.4, 2779.299999999999, 3924.0300000000016, 2.7259691631071994, 7.292711705960144, 0.8997827901662436], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 2626, 0, 0.0, 6697.348438690019, 242, 19747, 6883.0, 7532.6, 7816.550000000001, 8153.49, 14.51518401008214, 368.36077414545036, 5.287269175547498], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -79", 533, 5, 0.9380863039399625, 1675.7598499061917, 104, 33760, 1561.0, 2552.0, 3110.3, 4194.779999999999, 2.7355919502768953, 7.456807688014207, 0.9029590617124909], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80", 530, 0, 0.0, 1622.1584905660382, 156, 4057, 1743.5, 2450.8, 2712.0, 3740.719999999995, 2.962151528023071, 24.783736521861236, 1.1513049884308422], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -78", 534, 6, 1.1235955056179776, 1677.3745318352055, 102, 41365, 1642.5, 2502.5, 3156.75, 3888.499999999999, 2.730145096475352, 7.293967350736731, 0.9011611744225283], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -80", 575, 0, 0.0, 1576.6139130434785, 244, 4037, 1465.0, 2850.0, 3247.1999999999994, 3848.2, 3.1928834791879526, 7.357861156767803, 1.0351926905179691], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -77", 448, 0, 0.0, 1949.2008928571422, 165, 6573, 2322.5, 2821.4, 3160.699999999995, 4426.869999999999, 2.4953073739674827, 8.799913980126659, 0.9040615583417345], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77", 533, 0, 0.0, 1673.2851782363969, 159, 5929, 1768.0, 2588.6000000000004, 3207.499999999999, 3777.3999999999987, 2.9617199090924244, 25.875294939098595, 1.1511372302917822], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -78", 449, 0, 0.0, 1860.6681514476616, 159, 4126, 2293.0, 2842.0, 2950.0, 3851.5, 2.4927549105606204, 8.4885012397847, 0.9031367888847558], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 531, 0, 0.0, 1590.8700564971748, 161, 2998, 1680.0, 2565.0, 2787.9999999999995, 2931.0, 2.964013195719764, 25.217808177480755, 1.1520285663051426], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -79", 447, 0, 0.0, 1893.5682326621923, 168, 4278, 2366.0, 2854.6, 3044.7999999999997, 3824.3999999999996, 2.4760976258267506, 8.40054938416073, 0.8971017765446528], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79", 532, 0, 0.0, 1660.4454887218053, 164, 5885, 1813.5, 2465.7, 2719.5999999999976, 5634.529999999998, 2.972814394680227, 26.06805503653153, 1.1554493448073537], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 832, 0, 0.0, 23524.764423076933, 955, 29845, 24064.0, 27351.0, 28292.79999999999, 29489.809999999998, 4.127188848653207, 1391.6558671065034, 1.4590257453246689], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 312, 300, 96.15384615384616, 57894.62179487178, 395, 60347, 60186.0, 60196.0, 60201.0, 60340.27, 1.63139813957866, 0.615512106072252, 0.7185161728027106], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 531, 0, 0.0, 1610.5574387947274, 165, 4430, 1662.0, 2460.8, 2793.5999999999963, 3803.559999999979, 2.970164114152748, 25.88676122586392, 1.1544192553054626], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 531, 0, 0.0, 1707.1073446327682, 161, 5893, 1770.0, 2688.0, 3021.7999999999993, 5633.0799999999945, 2.9711612708289037, 25.844049704002956, 1.1548068220604528], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -77", 446, 0, 0.0, 1938.5672645739912, 163, 4146, 2242.5, 2828.5, 3004.0999999999995, 3491.4399999999987, 2.479182647944947, 8.918329544728124, 0.8982194945191164], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -78", 446, 0, 0.0, 2024.085201793722, 167, 4414, 2399.0, 2805.3, 2987.0999999999985, 4272.149999999999, 2.4857044129613324, 8.817326458749012, 0.9005823605553265], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 451, 0, 0.0, 2011.0133037694002, 172, 4304, 2424.0, 2997.6, 3552.999999999999, 4218.000000000001, 2.492952296722127, 9.14537205136532, 0.9032083028163175], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -77", 531, 0, 0.0, 1670.2956685499062, 169, 4335, 1772.0, 2555.8, 2898.0, 3653.8799999999865, 2.9595362835804258, 26.203743094066997, 1.1502885164697358], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78", 533, 0, 0.0, 1643.568480300188, 161, 5849, 1751.0, 2511.6000000000004, 3382.9999999999995, 4337.92, 2.960403903511939, 24.7402703798537, 1.1506257359353043], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 1956, 0, 0.0, 9222.487730061353, 716, 13378, 9421.5, 11467.8, 12046.0, 12648.730000000001, 10.535273777078778, 1273.8606795379505, 4.37255015161961], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -77", 573, 0, 0.0, 1511.7783595113442, 247, 4642, 1364.0, 2624.6, 2913.2, 4350.62, 3.2142797040394466, 6.899499767203128, 1.0421297477940392], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -79", 528, 0, 0.0, 1632.9090909090914, 165, 3992, 1728.0, 2439.0, 2663.55, 3791.170000000001, 2.9302240400463955, 25.77771425529022, 1.1388956718149075], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 449, 0, 0.0, 2078.5412026726076, 166, 4159, 2412.0, 2939.0, 3238.0, 3925.0, 2.491980152959851, 9.123952684983738, 0.9028560905743209], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -78", 531, 0, 0.0, 1658.1883239171389, 165, 4321, 1781.0, 2515.6, 2714.7999999999997, 4048.879999999989, 2.96416210784861, 26.295229115496262, 1.1520864442614716], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -79", 579, 0, 0.0, 1518.5682210708117, 247, 3811, 1381.0, 2760.0, 3065.0, 3667.8000000000006, 3.2272268701473155, 7.287028369916003, 1.046327461805575], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -77", 530, 0, 0.0, 1647.618867924529, 166, 4448, 1733.0, 2573.7000000000003, 2765.0499999999997, 4214.269999999995, 2.963625688483798, 25.61985384572371, 1.1518779531411636], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -78", 572, 0, 0.0, 1504.8304195804199, 251, 3954, 1383.0, 2713.2000000000007, 2999.35, 3687.5199999999986, 3.1929264398870196, 7.191814305789691, 1.0352066191821196], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 532, 0, 0.0, 1576.0112781954872, 164, 4405, 1687.0, 2486.2999999999997, 2716.5999999999985, 3498.459999999998, 2.9691145118262288, 26.08763396245633, 1.15401130440121], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 1977, 0, 0.0, 9192.702579666167, 256, 21381, 9806.0, 10983.0, 11630.3, 12918.280000000004, 10.580339940917069, 454.68509799993046, 4.060618746855868], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78", 529, 0, 0.0, 1686.175803402646, 170, 5198, 1729.0, 2536.0, 2874.0, 4736.00000000002, 2.9485535923304167, 25.94419185629285, 1.1460198532690486], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -79", 533, 0, 0.0, 1730.138836772983, 167, 5187, 1849.0, 2657.6000000000004, 3031.499999999999, 4780.519999999982, 2.9720084755213563, 26.11847825708152, 1.1551361066967771], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -80", 451, 0, 0.0, 1811.3481152993356, 164, 4182, 2251.0, 2869.2, 3169.7999999999997, 3522.32, 2.4867392287248706, 8.434836344231426, 0.9009572791571553], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -77", 530, 4, 0.7547169811320755, 1864.8641509433971, 107, 57614, 1605.0, 2468.9, 2702.0499999999997, 19894.459999998715, 2.716750561290918, 7.372204397996268, 0.8967399313636036], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -77", 577, 0, 0.0, 1553.984402079723, 248, 4464, 1410.0, 2844.0, 3165.4, 3748.0800000000004, 3.2127485425703104, 7.200974612604887, 1.0416333165364677], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -79", 534, 3, 0.5617977528089888, 1709.2490636704126, 104, 48846, 1641.0, 2577.0, 3271.0, 4110.249999999997, 2.7172253770531842, 7.273170396809041, 0.8968966576601332], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 2615, 0, 0.0, 6762.878393881456, 1772, 14339, 6249.0, 10297.800000000001, 10831.599999999999, 13148.880000000001, 14.120785364062467, 1622.0745944661642, 17.099388526794392], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -80", 536, 0, 0.0, 1565.3656716417902, 164, 3644, 1710.5, 2368.0, 2668.5, 3236.8999999999996, 2.9652906095442524, 25.0072729751242, 1.1525250611314575], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -78", 532, 4, 0.7518796992481203, 1694.5300751879697, 103, 40645, 1664.0, 2624.2, 3353.7999999999997, 3887.7099999999996, 2.747820338002562, 7.526963108123114, 0.9069953850047519], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -80", 447, 0, 0.0, 1850.1297539149896, 167, 4358, 2261.0, 2906.6, 3306.6, 4018.479999999998, 2.485777681386697, 8.499031208813667, 0.9006089060492818], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -79", 577, 0, 0.0, 1529.272097053726, 250, 6611, 1335.0, 2782.2000000000007, 3091.9000000000005, 5036.140000000013, 3.2322032758968384, 6.876889273930629, 1.047940905857178], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 2871, 0, 0.0, 6309.3117380703625, 351, 8503, 6508.0, 7389.0, 7697.800000000001, 8153.280000000001, 15.400790691935907, 639.8614101499846, 8.708064268194228], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 573, 0, 0.0, 1531.8952879581147, 250, 3783, 1389.0, 2704.4000000000005, 3037.7999999999997, 3554.8999999999996, 3.1817601297136417, 6.975587417887822, 1.0315862920555947], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -80", 534, 4, 0.7490636704119851, 1595.9550561797755, 111, 49937, 1629.0, 2561.5, 2921.25, 3911.8999999999933, 2.788482626813297, 7.12612396835281, 0.9204171170536077], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 849, 0, 0.0, 21098.99646643108, 3321, 39521, 21813.0, 26673.0, 28295.0, 36389.5, 4.5814873375029, 1799.6141400048432, 2.6620946931779548], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 531, 4, 0.7532956685499058, 1596.647834274951, 106, 41224, 1602.0, 2438.6, 2736.9999999999995, 3231.3999999999996, 2.735956966642965, 7.266716476476438, 0.9030795456301975], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -78", 529, 2, 0.3780718336483932, 1660.3534971644604, 116, 4320, 1697.0, 2648.0, 3406.0, 4176.500000000001, 2.950165075399304, 7.842709869877643, 0.9737849565282858], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -80", 571, 0, 0.0, 1455.1436077057792, 253, 3710, 1348.0, 2504.2000000000003, 2794.0, 3571.399999999998, 3.1651709247731445, 6.861715575648139, 1.0262077607662927], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -77", 541, 8, 1.478743068391867, 1725.5397412199625, 103, 57373, 1688.0, 2470.0, 2707.7, 3723.940000000006, 2.7947101973344353, 7.700289649305196, 0.9224727018545303], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -77", 450, 0, 0.0, 2067.0244444444456, 170, 4297, 2447.5, 2980.1000000000004, 3384.6499999999996, 4162.780000000001, 2.500513994543323, 9.202179102440502, 0.9059479413823953], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -80", 446, 0, 0.0, 1958.8923766816145, 172, 4378, 2304.0, 2828.1000000000004, 3147.95, 4226.989999999998, 2.4846658235887262, 9.003480699620058, 0.9002060747572437], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -78", 448, 0, 0.0, 1867.3482142857144, 169, 4610, 2179.5, 2860.5, 3226.6499999999996, 4397.769999999999, 2.4927110458258217, 8.624389428373506, 0.9031208964857226], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -79", 446, 0, 0.0, 1922.5269058295958, 164, 4523, 2294.0, 2942.5, 3288.1499999999983, 3873.279999999998, 2.475549782973102, 8.825981312998856, 0.8969032905107625], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -80", 532, 2, 0.37593984962406013, 1857.4172932330825, 105, 55546, 1648.5, 2690.3999999999996, 3307.2, 14144.999999999365, 2.6908233818389653, 6.897106946003976, 0.8881819365835647], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -79", 533, 4, 0.7504690431519699, 1667.3583489681052, 102, 32961, 1562.0, 2556.8, 3061.4999999999955, 4240.399999999997, 2.7027301123686662, 7.113023392496755, 0.8921120878716888], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 537, 3, 0.5586592178770949, 1878.7560521415285, 104, 55957, 1595.0, 2574.0, 2964.099999999999, 5657.820000000011, 2.7561358667200446, 7.3169410693114285, 0.9097401591322022], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -80", 580, 0, 0.0, 1453.4534482758627, 248, 4075, 1354.0, 2542.8999999999996, 2867.5499999999993, 3478.569999999982, 3.2356321197853326, 7.319021428740782, 1.0490526013366508], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -79", 573, 0, 0.0, 1438.003490401396, 249, 3787, 1339.0, 2611.2, 2977.2, 3613.72, 3.1955474257160703, 6.907129751494601, 1.036056391931382], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 538, 3, 0.5576208178438662, 1729.710037174721, 108, 45832, 1628.5, 2592.6000000000004, 3057.699999999994, 4012.330000000001, 2.7682871609105506, 7.552289689931256, 0.9137510355349278], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -78", 576, 0, 0.0, 1461.7118055555563, 237, 3969, 1365.0, 2556.3, 2884.3, 3728.030000000001, 3.2286995515695067, 7.3679341542881165, 1.046804932735426], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -77", 574, 0, 0.0, 1580.7299651567928, 252, 6611, 1423.0, 2648.0, 2986.5, 5237.5, 3.1786817884792167, 7.165856825028519, 1.030588236108496], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80", 531, 0, 0.0, 1592.6214689265541, 164, 3818, 1675.0, 2457.8, 2966.5999999999985, 3437.5599999999968, 2.9521977472118133, 25.423478233448787, 1.1474362337795914], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -77", 528, 5, 0.946969696969697, 1543.0321969696965, 103, 3905, 1571.5, 2583.1000000000004, 3054.5999999999976, 3619.170000000001, 2.9468067888177614, 7.863056677196292, 0.9726764595902376], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503/Service Unavailable", 45, 11.936339522546419, 0.07565186691996033], "isController": false}, {"data": ["502/Bad Gateway", 14, 3.713527851458886, 0.023536136375098767], "isController": false}, {"data": ["504/Gateway Time-out", 300, 79.57559681697613, 0.5043457794664021], "isController": false}, {"data": ["502/Proxy Error", 18, 4.774535809018568, 0.03026074676798413], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 59483, 377, "504/Gateway Time-out", 300, "503/Service Unavailable", 45, "502/Proxy Error", 18, "502/Bad Gateway", 14, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -80", 528, 6, "503/Service Unavailable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -79", 535, 2, "503/Service Unavailable", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -78", 533, 4, "503/Service Unavailable", 2, "502/Bad Gateway", 1, "502/Proxy Error", 1, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 529, 2, "503/Service Unavailable", 1, "502/Proxy Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -80", 536, 2, "502/Bad Gateway", 1, "502/Proxy Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -77", 538, 4, "503/Service Unavailable", 2, "502/Bad Gateway", 1, "502/Proxy Error", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -79", 533, 5, "503/Service Unavailable", 4, "502/Proxy Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -78", 534, 6, "503/Service Unavailable", 3, "502/Bad Gateway", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 312, 300, "504/Gateway Time-out", 300, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -77", 530, 4, "503/Service Unavailable", 2, "502/Bad Gateway", 1, "502/Proxy Error", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -79", 534, 3, "503/Service Unavailable", 1, "502/Bad Gateway", 1, "502/Proxy Error", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -78", 532, 4, "503/Service Unavailable", 2, "502/Bad Gateway", 1, "502/Proxy Error", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -80", 534, 4, "503/Service Unavailable", 3, "502/Proxy Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 531, 4, "503/Service Unavailable", 2, "502/Proxy Error", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -78", 529, 2, "503/Service Unavailable", 1, "502/Proxy Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -77", 541, 8, "503/Service Unavailable", 4, "502/Proxy Error", 3, "502/Bad Gateway", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -80", 532, 2, "503/Service Unavailable", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -79", 533, 4, "503/Service Unavailable", 2, "502/Bad Gateway", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 537, 3, "503/Service Unavailable", 1, "502/Bad Gateway", 1, "502/Proxy Error", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 538, 3, "503/Service Unavailable", 1, "502/Bad Gateway", 1, "502/Proxy Error", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -77", 528, 5, "503/Service Unavailable", 4, "502/Proxy Error", 1, "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
