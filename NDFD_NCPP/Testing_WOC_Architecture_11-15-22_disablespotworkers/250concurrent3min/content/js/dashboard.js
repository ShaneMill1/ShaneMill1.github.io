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

    var data = {"OkPercent": 95.26300220076003, "KoPercent": 4.736997799239973};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.41404683035293427, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4893847487001733, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -80"], "isController": false}, {"data": [0.49252089749230094, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -79"], "isController": false}, {"data": [0.48313622426631625, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -78"], "isController": false}, {"data": [0.3642052565707134, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -77"], "isController": false}, {"data": [0.4978021978021978, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -80"], "isController": false}, {"data": [0.4748468941382327, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79"], "isController": false}, {"data": [0.3717146433041302, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -78"], "isController": false}, {"data": [0.36988304093567254, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -79"], "isController": false}, {"data": [0.48947368421052634, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77"], "isController": false}, {"data": [0.49054945054945054, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -78"], "isController": false}, {"data": [0.4854689564068692, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -79"], "isController": false}, {"data": [0.48355263157894735, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -80"], "isController": false}, {"data": [0.373125, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -80"], "isController": false}, {"data": [0.49231107205623903, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.4793388429752066, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -79"], "isController": false}, {"data": [0.49565783760312637, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -78"], "isController": false}, {"data": [0.49479843953185954, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -77"], "isController": false}, {"data": [0.3634278565471226, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -78"], "isController": false}, {"data": [0.370625, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -77"], "isController": false}, {"data": [0.3731281198003328, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.37468776019983346, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -79"], "isController": false}, {"data": [0.49587852494577006, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -80"], "isController": false}, {"data": [0.49252089749230094, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -77"], "isController": false}, {"data": [0.4896839332748025, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -78"], "isController": false}, {"data": [0.48043478260869565, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -77"], "isController": false}, {"data": [0.4872192630827522, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}, {"data": [0.49282920469361147, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -79"], "isController": false}, {"data": [0.49496497373029774, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80"], "isController": false}, {"data": [0.4913232104121475, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -78"], "isController": false}, {"data": [0.3756281407035176, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -80"], "isController": false}, {"data": [0.4835742444152431, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -77"], "isController": false}, {"data": [0.4923279263480929, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77"], "isController": false}, {"data": [0.48171000440722783, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -78"], "isController": false}, {"data": [0.4912319158263919, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78"], "isController": false}, {"data": [0.4960456942003515, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -79"], "isController": false}, {"data": [0.4962784588441331, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_CityLevel1234_Summaries_24hourly_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.48967940272288096, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80"], "isController": false}, {"data": [0.4929762949956102, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79"], "isController": false}, {"data": [0.49295464553060325, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -77"], "isController": false}, {"data": [0.4892449517120281, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -78"], "isController": false}, {"data": [0.4881474978050922, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -79"], "isController": false}, {"data": [0.4815870232354231, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -77"], "isController": false}, {"data": [0.4929947460595447, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78"], "isController": false}, {"data": [0.001098901098901099, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.36625, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -77"], "isController": false}, {"data": [0.4912434325744308, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -79"], "isController": false}, {"data": [0.48746150461944565, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -80"], "isController": false}, {"data": [0.4804738920579201, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -78"], "isController": false}, {"data": [0.37411421425594, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -79"], "isController": false}, {"data": [0.4890590809628009, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -77"], "isController": false}, {"data": [0.36783042394014964, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -78"], "isController": false}, {"data": [0.49188952213941256, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77"], "isController": false}, {"data": [0.45537764442947676, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.49430074528715473, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78"], "isController": false}, {"data": [0.4822056239015817, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -79"], "isController": false}, {"data": [0.49274087109546855, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -80"], "isController": false}, {"data": [0.4911101474414571, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -77"], "isController": false}, {"data": [0.36959234608985025, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -77"], "isController": false}, {"data": [0.4898224339540927, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP "], "isController": false}, {"data": [0.485513608428446, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -80"], "isController": false}, {"data": [0.489343192692475, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -78"], "isController": false}, {"data": [0.4901229148375768, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -80"], "isController": false}, {"data": [0.36942940441482713, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -79"], "isController": false}, {"data": [0.39374751095181204, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.36620603015075376, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -78"], "isController": false}, {"data": [0.48935708079930496, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST"], "isController": false}, {"data": [0.4863102998696219, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -79"], "isController": false}, {"data": [0.4813610749891634, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -78"], "isController": false}, {"data": [0.3788445552784705, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -80"], "isController": false}, {"data": [0.4878472222222222, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -77"], "isController": false}, {"data": [0.4892165492957746, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -77"], "isController": false}, {"data": [0.4914323374340949, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -78"], "isController": false}, {"data": [0.4874780316344464, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -80"], "isController": false}, {"data": [0.48462889767237594, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -79"], "isController": false}, {"data": [0.4932696482848459, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -80"], "isController": false}, {"data": [0.4913344887348354, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -79"], "isController": false}, {"data": [0.4921773142112125, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -80"], "isController": false}, {"data": [0.3604262432093606, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -80"], "isController": false}, {"data": [0.371661101836394, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -79"], "isController": false}, {"data": [0.4891445940078159, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -78"], "isController": false}, {"data": [0.36199000832639466, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -78"], "isController": false}, {"data": [0.3652719665271967, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -77"], "isController": false}, {"data": [0.4906031468531469, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80"], "isController": false}, {"data": [0.49478487614080835, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -77"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 307621, 14572, 4.736997799239973, 2008.269789773793, 3, 61154, 909.0, 12225.0, 12957.95, 18048.360000001703, 115.79408579545219, 564.8062510463244, 42.66247954168095], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -80", 2308, 0, 0.0, 951.0619584055456, 189, 9635, 914.0, 1100.1, 1305.0999999999995, 1890.8199999999997, 12.796841819280647, 17.789467989182565, 4.136479142755757], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -79", 2273, 0, 0.0, 945.1038275406946, 175, 2335, 935.0, 1067.6000000000001, 1169.199999999999, 1874.8199999999983, 12.592239679127795, 20.356346524461518, 4.476147698439958], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -78", 2283, 0, 0.0, 967.7796758650909, 271, 3133, 934.0, 1087.0, 1383.1999999999935, 2156.3199999999997, 12.664336828091196, 48.777484814444996, 4.835698925569978], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -77", 2397, 703, 29.328327075511055, 842.8039215686271, 3, 2255, 896.0, 1188.2000000000003, 1422.1, 1801.06, 13.348480545299632, 25.923171362232765, 2.9940607580010137], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -80", 2275, 0, 0.0, 939.1850549450554, 171, 2013, 936.0, 1071.0, 1138.3999999999996, 1796.5599999999959, 12.633624878522838, 22.093024390878803, 4.490858843537415], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79", 2286, 0, 0.0, 999.9575678040256, 245, 3394, 942.0, 1117.0, 1672.3000000000002, 2602.9500000000016, 12.666925250734195, 48.76879099538704, 4.836687278356513], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -78", 2397, 687, 28.660826032540676, 838.6837713808918, 4, 2099, 896.0, 1208.0, 1380.1999999999998, 1792.2199999999998, 13.332888347489446, 25.34312254388673, 3.0188096037679175], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -79", 2394, 692, 28.905597326649957, 840.2030075187972, 3, 2255, 892.5, 1183.5, 1412.25, 1901.250000000001, 13.31079653496725, 25.760358488690827, 3.003466961396466], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77", 2280, 0, 0.0, 954.7184210526316, 274, 2927, 934.5, 1081.9, 1186.9499999999998, 1939.19, 12.66237552829319, 48.62028527832234, 4.834950030822887], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 2275, 0, 0.0, 959.9389010989006, 224, 2567, 941.0, 1079.0, 1265.199999999999, 1894.4399999999987, 12.628435350737444, 21.964332519539383, 4.489014128582451], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -79", 2271, 0, 0.0, 982.9361514751201, 142, 4063, 943.0, 1087.8, 1386.2000000000016, 2428.200000000003, 12.592391334482969, 21.936525273153975, 4.476201607179493], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -80", 2280, 0, 0.0, 975.7438596491223, 258, 3119, 939.0, 1091.0, 1489.8999999999996, 2290.76, 12.654012654012654, 34.60556370712621, 4.831756784881785], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -80", 2400, 683, 28.458333333333332, 838.2341666666667, 4, 2143, 892.0, 1186.0, 1401.7999999999993, 1877.9699999999993, 13.349352556401014, 25.772083183848398, 3.0311167237490544], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -77", 2276, 0, 0.0, 955.5329525483305, 126, 2761, 938.0, 1085.3000000000002, 1250.0500000000006, 1921.69, 12.647395503395238, 20.539319417586327, 4.495753870347525], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 5539, 0, 0.0, 7951.901245712209, 1852, 28604, 7098.0, 12724.0, 14035.0, 20680.800000000007, 29.680634444325367, 355.5842661139615, 10.840387970876648], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -79", 2299, 0, 0.0, 1024.4915180513271, 268, 30715, 916.0, 1115.0, 1585.0, 4109.0, 11.64404376012966, 19.001713139118213, 3.7638461763700364], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -78", 2303, 0, 0.0, 927.3525835866238, 179, 7593, 907.0, 1085.6, 1196.0, 1795.0, 12.752361650996157, 21.430662278024187, 4.12210127585911], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 2307, 0, 0.0, 930.5583008235805, 210, 9113, 906.0, 1077.2000000000003, 1190.0, 1822.0, 12.788390115189747, 22.083002539870176, 4.133747195437311], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -78", 2398, 682, 28.440366972477065, 863.1109257714778, 3, 4328, 894.5, 1239.2999999999997, 1487.0999999999995, 2131.3599999999915, 13.337634599982202, 25.87440886552238, 3.0292165738742547], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -77", 2400, 695, 28.958333333333332, 831.899166666666, 4, 2262, 889.0, 1163.0, 1377.0, 1988.769999999995, 13.355146739674803, 25.379310947464194, 3.011238886361613], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -80", 2404, 688, 28.618968386023294, 834.944259567388, 4, 2549, 897.0, 1188.0, 1372.5, 1877.0499999999965, 13.371824608829632, 25.64087521762589, 3.0294019181671032], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 5432, 0, 0.0, 8225.570324005888, 2588, 23667, 7091.0, 13516.4, 14731.0, 19488.02, 28.50426094622392, 341.489739103955, 10.410735931531], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 2402, 695, 28.934221482098252, 831.4725228975853, 4, 2357, 893.5, 1179.7000000000003, 1378.6999999999998, 1823.9699999999998, 13.333185310182513, 20.896102232420404, 3.007307501096297], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -80", 2305, 0, 0.0, 944.4941431670273, 200, 30726, 906.0, 1095.4, 1248.6999999999998, 1827.88, 11.66734156711885, 20.230340426642538, 3.771377010465175], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 2273, 0, 0.0, 960.6889573251201, 132, 3091, 938.0, 1076.0, 1229.8999999999992, 2255.759999999994, 12.618874460797104, 22.003870663129348, 4.48561553098647], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -78", 2278, 0, 0.0, 960.980684811238, 172, 3001, 937.0, 1084.0, 1322.4999999999973, 1949.3100000000004, 12.632676375009705, 16.650670608370397, 4.490521680179231], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -77", 2300, 0, 0.0, 997.472608695651, 224, 30923, 918.0, 1138.9, 1517.749999999999, 2044.7899999999954, 11.62396963616975, 17.335972127110637, 3.7573573726290896], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 36422, 0, 0.0, 1204.9855581791285, 44, 6285, 1137.0, 1318.0, 1801.8500000000167, 5336.900000000016, 201.37337726961098, 476.22050766995824, 71.97525007878674], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -79", 2301, 0, 0.0, 945.6792698826595, 238, 8335, 906.0, 1093.8000000000002, 1242.7000000000003, 1914.7800000000002, 12.771413347542294, 22.20766368923727, 4.1282595879262685], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80", 2284, 0, 0.0, 945.5091943957963, 196, 2757, 935.0, 1071.0, 1140.75, 1867.15, 12.686633487380021, 48.50789655623722, 4.844212591372645], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -78", 2305, 0, 0.0, 937.517570498915, 198, 8484, 914.0, 1091.0, 1227.7999999999993, 1851.7000000000003, 12.802852731090104, 22.142911105919303, 4.138422123037914], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -80", 2388, 684, 28.64321608040201, 823.9325795644887, 3, 2069, 893.0, 1127.1, 1340.0, 1704.5500000000006, 13.269394264376565, 19.40010325039036, 3.0051750220878737], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -77", 2283, 0, 0.0, 974.3394656154189, 188, 3103, 940.0, 1093.6, 1492.5999999999967, 2159.279999999995, 12.65184429863451, 19.181669762549323, 4.497335278030236], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77", 2281, 0, 0.0, 951.2297238053462, 171, 2385, 937.0, 1079.0, 1204.7000000000003, 1895.9799999999982, 12.645456007007391, 34.270922337649196, 4.828489549550674], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -78", 2269, 0, 0.0, 994.3627148523584, 178, 31993, 941.0, 1095.0, 1551.5, 2228.9000000000024, 12.561798623683059, 21.960326693614466, 4.4653268545123375], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 2281, 0, 0.0, 949.8803156510294, 198, 2165, 931.0, 1075.0, 1197.7000000000003, 1919.0, 12.631660556656957, 48.5024130846504, 4.823221950832881], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -79", 2276, 0, 0.0, 942.7403339191575, 152, 2526, 937.0, 1067.0, 1145.15, 1865.8400000000001, 12.644584939832665, 20.47841764214047, 4.494754802831142], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79", 2284, 0, 0.0, 936.4238178633972, 151, 2173, 931.0, 1067.0, 1132.75, 1881.6000000000004, 12.689382364869745, 34.053451036984775, 4.8452622115860065], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 3739, 0, 0.0, 11846.090398502283, 2931, 15260, 12152.0, 13378.0, 13658.0, 14153.599999999999, 20.41875095567837, 1412.1241261515922, 7.078766200454902], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 750, 750, 100.0, 60074.30799999998, 60057, 61154, 60070.0, 60084.0, 60091.0, 60112.0, 3.9437775078481176, 1.4827679106655518, 1.7099972787935196], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 2277, 0, 0.0, 953.715854194115, 176, 2776, 932.0, 1072.0, 1204.2999999999997, 1987.2799999999952, 12.65907233517354, 26.58628440660251, 4.833688752981303], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 2278, 0, 0.0, 948.6518876207206, 191, 2457, 933.0, 1073.1, 1196.0499999999997, 1909.42, 12.611345782285433, 33.84252850078337, 4.815465039915629], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -77", 2271, 0, 0.0, 952.0537208278289, 186, 2528, 939.0, 1073.8, 1176.6000000000008, 1882.1600000000044, 12.575795331838194, 21.830402104618322, 4.470302246864358], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -78", 2278, 0, 0.0, 963.0842844600522, 126, 3089, 940.0, 1077.0, 1267.0999999999995, 2197.300000000001, 12.655274327237173, 21.96895624541677, 4.498554546010089], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 2278, 0, 0.0, 963.5307287093947, 177, 2593, 938.0, 1091.1, 1342.0499999999997, 1969.5200000000004, 12.64164974084063, 22.008613875431468, 4.493711431314443], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -77", 2281, 0, 0.0, 978.6668128014028, 166, 3753, 938.0, 1088.8000000000002, 1462.6000000000004, 2264.7199999999993, 12.656050602008545, 48.55868846404594, 4.832534946665373], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78", 2284, 0, 0.0, 962.8112959719788, 166, 31917, 933.0, 1075.5, 1193.0, 1996.0000000000018, 12.65843831228212, 9.068473910675985, 4.833446660256162], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 6370, 0, 0.0, 6939.990266875985, 925, 13979, 6978.5, 8036.900000000001, 8295.0, 8734.45, 34.94892080804978, 783.7388397143461, 14.266258689223443], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -77", 2400, 691, 28.791666666666668, 844.8920833333334, 5, 2182, 903.0, 1212.9, 1428.9499999999998, 1755.9899999999998, 13.378895906615307, 25.825493555831805, 3.023670759656497], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -79", 2284, 0, 0.0, 946.8962346760081, 316, 2186, 934.0, 1070.5, 1170.0, 1909.0, 12.66693287191091, 40.960712586031434, 4.83669018839567], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 2273, 0, 0.0, 984.1381434227893, 162, 4565, 941.0, 1088.0, 1382.8999999999992, 2878.159999999996, 12.610193563419898, 16.742641814400475, 4.482529743246917], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -78", 2279, 0, 0.0, 976.0719613865718, 148, 3079, 938.0, 1096.0, 1477.0, 2062.3999999999996, 12.65323798525362, 48.585133833392554, 4.831460988509927], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -79", 2399, 688, 28.678616090037515, 828.1829929137136, 4, 2169, 887.0, 1157.0, 1397.0, 1792.0, 13.346165828474787, 25.018057648524078, 3.021062309111999], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -77", 2285, 0, 0.0, 966.7855579868711, 201, 2887, 941.0, 1091.0, 1307.0999999999995, 2040.0799999999972, 12.701359629131415, 48.620524994163496, 4.8498355615140465], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -78", 2406, 699, 29.052369077306732, 837.0677472984206, 5, 2434, 896.0, 1193.9000000000005, 1414.9000000000005, 1847.8799999999974, 13.394870310264391, 25.500926690782258, 3.01619777719476], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 2281, 0, 0.0, 952.0898728627786, 204, 2425, 933.0, 1073.0, 1201.8000000000002, 1990.3599999999997, 12.63389939406024, 48.54832052842489, 4.824076819411673], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 32663, 0, 0.0, 1343.1870618130545, 462, 19422, 1097.0, 1427.9000000000015, 1952.0, 5948.94000000001, 180.6122336131294, 434.06904972842915, 68.08234587369917], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78", 2281, 0, 0.0, 945.8347216133263, 211, 2186, 936.0, 1076.0, 1163.0, 1877.0, 12.675531944452162, 34.20269698025318, 4.8399736233210895], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -79", 2276, 0, 0.0, 977.6498242530739, 197, 2654, 941.5, 1101.6000000000004, 1444.9000000000024, 2095.69, 12.634056442480626, 48.268228371602795, 4.824136786142505], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -80", 2273, 0, 0.0, 950.4087109546864, 142, 2355, 938.0, 1082.0, 1196.5999999999995, 1889.7799999999993, 12.599917959179148, 22.005948522503022, 4.478877087051963], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -77", 2306, 0, 0.0, 952.2038161318293, 233, 8482, 910.0, 1100.0, 1287.3000000000002, 1846.7199999999993, 12.760353261471037, 21.290949525083555, 4.124684501510657], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -77", 2404, 694, 28.86855241264559, 836.8839434276217, 4, 2109, 893.0, 1165.5, 1383.5, 1929.5499999999984, 13.365579740360825, 25.962701192561084, 3.017399768576432], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -79", 2309, 0, 0.0, 939.9861411866607, 216, 3904, 909.0, 1112.0, 1311.0, 1918.6000000000004, 12.804303221871015, 22.20212921276271, 4.138890982850884], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 4343, 0, 0.0, 10455.229795072537, 2149, 45190, 9860.0, 16960.0, 19843.600000000002, 32200.56, 21.031680694244013, 56.716390904815064, 25.3242795859403], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -80", 2278, 0, 0.0, 969.4100087796313, 152, 3205, 935.5, 1086.0, 1258.0999999999995, 2134.810000000002, 12.620288859464939, 40.82666194433057, 4.818879828174602], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -78", 2299, 0, 0.0, 946.2387994780336, 176, 9001, 907.0, 1105.0, 1266.0, 1848.0, 12.763713080168776, 17.788721364576393, 4.125770536656118], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -80", 2278, 0, 0.0, 962.3994732221244, 183, 3287, 939.0, 1088.1, 1280.3999999999978, 2110.42, 12.617772337278927, 20.36623882166734, 4.485223760517118], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -79", 2401, 695, 28.946272386505623, 831.4664723032073, 3, 2225, 893.0, 1164.8000000000002, 1386.7000000000003, 1805.6000000000004, 13.382754584471321, 23.551583793754528, 3.0179760221002176], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 25110, 0, 0.0, 1785.8330147351614, 349, 59059, 849.0, 3966.0, 4296.950000000001, 18048.360000001703, 113.87135393992163, 943.7449921234445, 63.6078266148781], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 2388, 680, 28.47571189279732, 843.7705192629824, 4, 2640, 891.0, 1198.1999999999998, 1437.5499999999997, 1883.8400000000056, 13.269984162707342, 25.72463862493401, 3.0123633338890277], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -80", 2302, 0, 0.0, 955.6511728931364, 158, 9189, 916.0, 1102.0, 1276.0999999999995, 1865.9399999999996, 12.780865345644123, 22.350844938316502, 4.13131487246895], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 2084, 0, 0.0, 21903.484644913595, 10095, 41618, 22626.5, 28864.0, 31334.5, 32691.900000000005, 10.654669086633094, 998.7087476673739, 6.118110764590097], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 2301, 0, 0.0, 972.2064319860939, 204, 10206, 914.0, 1103.0, 1299.9, 2780.860000000001, 12.749405748037168, 21.5021716082619, 4.121145803320608], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -78", 2307, 0, 0.0, 976.5509319462506, 176, 31858, 914.0, 1129.4000000000005, 1508.5999999999995, 2236.880000000001, 12.796050807033113, 16.80908947910311, 4.136223454226524], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -80", 2406, 688, 28.595178719867, 823.2714048212803, 5, 2264, 885.0, 1128.2000000000007, 1339.0, 1779.3699999999985, 13.361989970177104, 24.409349522805908, 3.028182757562631], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -77", 2304, 0, 0.0, 941.1740451388882, 194, 2371, 913.0, 1101.0, 1302.5, 1891.449999999998, 12.791330320560508, 22.249535644590885, 4.134697593853055], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -77", 2272, 0, 0.0, 966.1219190140849, 188, 3124, 940.0, 1086.0, 1293.4499999999994, 2165.8299999999995, 12.602897778961148, 21.877533008414872, 4.479936319865096], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -78", 2276, 0, 0.0, 953.5329525483307, 158, 2840, 942.0, 1074.0, 1170.15, 1937.23, 12.61081560283688, 21.975891979028148, 4.482750858820922], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -80", 2276, 0, 0.0, 972.8831282952541, 170, 3428, 946.0, 1098.0, 1408.4500000000003, 1949.8100000000009, 12.648520078692023, 22.10499598481733, 4.496153621722555], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -79", 2277, 0, 0.0, 992.3386034255615, 181, 31965, 945.0, 1093.2000000000003, 1566.3999999999996, 2345.22, 12.65569506277825, 20.335100230867777, 4.498704104346956], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -80", 2303, 0, 0.0, 945.6552323056885, 173, 31722, 909.0, 1085.0, 1231.3999999999978, 1863.88, 12.74650342877068, 16.095890603466408, 4.120207651292085], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -79", 2308, 0, 0.0, 958.7755632582321, 209, 10019, 915.0, 1098.0, 1244.0, 1889.8199999999997, 12.776015632351882, 22.216136016407326, 4.129747240535618], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 2301, 0, 0.0, 945.2555410691, 212, 9722, 912.0, 1089.0, 1219.8000000000002, 1834.98, 12.746651303471122, 22.01012437990948, 4.120255450633731], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -80", 2393, 699, 29.210196406184707, 848.2536564981193, 3, 2156, 903.0, 1217.6, 1476.5999999999995, 1821.019999999999, 13.32642787133565, 25.925235974324487, 2.9941107790641985], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -79", 2396, 691, 28.839732888146912, 831.7988313856443, 3, 2130, 894.0, 1185.6000000000004, 1389.3000000000002, 1783.0600000000004, 13.335559637112485, 25.668228123086774, 3.01184224028775], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 2303, 0, 0.0, 950.7924446374299, 248, 8510, 912.0, 1099.6, 1267.3999999999978, 2107.4000000000005, 12.763316134538542, 22.11644348124574, 4.125642227082283], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -78", 2402, 701, 29.184013322231475, 847.1136552872618, 3, 2177, 897.0, 1217.7000000000003, 1494.5499999999997, 1867.9699999999998, 13.391836666425071, 25.81743926771408, 3.0099193482630198], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -77", 2390, 687, 28.744769874476987, 845.8112970711298, 4, 3927, 897.0, 1189.9, 1471.4999999999982, 1917.4500000000007, 13.278441699862771, 25.44968828302526, 3.0029442010294956], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80", 2288, 0, 0.0, 960.2443181818193, 223, 2645, 940.0, 1089.0, 1240.2999999999984, 2033.880000000001, 12.686443027446632, 48.638519718602716, 4.844139866925423], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -77", 2301, 0, 0.0, 930.2016514558883, 197, 7964, 903.0, 1085.0, 1187.8000000000002, 1878.4600000000005, 12.766524076632434, 16.79794022072327, 4.1266791693020854], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 750, 5.146856986000549, 0.24380650215687485], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 13822, 94.85314301399946, 4.493191297083099], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 307621, 14572, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 13822, "504/Gateway Time-out", 750, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -77", 2397, 703, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 703, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -78", 2397, 687, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 687, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -79", 2394, 692, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 692, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -80", 2400, 683, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 683, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -78", 2398, 682, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 682, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -77", 2400, 695, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 695, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -80", 2404, 688, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 688, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 2402, 695, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 695, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -80", 2388, 684, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 684, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 750, 750, "504/Gateway Time-out", 750, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -77", 2400, 691, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 691, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -79", 2399, 688, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 688, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -78", 2406, 699, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 699, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -77", 2404, 694, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 694, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -79", 2401, 695, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 695, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 2388, 680, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 680, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -80", 2406, 688, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 688, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -80", 2393, 699, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 699, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -79", 2396, 691, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 691, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -78", 2402, 701, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 701, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -77", 2390, 687, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 687, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
