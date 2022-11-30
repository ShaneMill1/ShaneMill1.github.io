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

    var data = {"OkPercent": 99.70288940057937, "KoPercent": 0.29711059942063434};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.293909232711877, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3361629881154499, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -80"], "isController": false}, {"data": [0.28009630818619585, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -79"], "isController": false}, {"data": [0.4163059163059163, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -78"], "isController": false}, {"data": [0.4286723163841808, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -77"], "isController": false}, {"data": [0.3352, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -80"], "isController": false}, {"data": [0.37695590327169276, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79"], "isController": false}, {"data": [0.44373219373219375, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -78"], "isController": false}, {"data": [0.4568245125348189, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -79"], "isController": false}, {"data": [0.37117903930131, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77"], "isController": false}, {"data": [0.3545751633986928, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -78"], "isController": false}, {"data": [0.4001584786053883, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -79"], "isController": false}, {"data": [0.3817663817663818, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -80"], "isController": false}, {"data": [0.423728813559322, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -80"], "isController": false}, {"data": [0.35841423948220064, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.33192567567567566, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -79"], "isController": false}, {"data": [0.2863247863247863, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -78"], "isController": false}, {"data": [0.2820299500831947, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -77"], "isController": false}, {"data": [0.42382271468144045, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -78"], "isController": false}, {"data": [0.4074074074074074, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -77"], "isController": false}, {"data": [0.42141863699582754, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.4309116809116809, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -79"], "isController": false}, {"data": [0.31143344709897613, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -80"], "isController": false}, {"data": [0.36939102564102566, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -77"], "isController": false}, {"data": [0.3553054662379421, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -78"], "isController": false}, {"data": [0.3330522765598651, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -77"], "isController": false}, {"data": [0.005544354838709678, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}, {"data": [0.3136593591905565, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -79"], "isController": false}, {"data": [0.4199134199134199, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80"], "isController": false}, {"data": [0.27504244482173174, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -78"], "isController": false}, {"data": [0.3948497854077253, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -80"], "isController": false}, {"data": [0.3519108280254777, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -77"], "isController": false}, {"data": [0.4117647058823529, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77"], "isController": false}, {"data": [0.2953074433656958, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -78"], "isController": false}, {"data": [0.40902578796561606, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78"], "isController": false}, {"data": [0.36187399030694667, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -79"], "isController": false}, {"data": [0.45014450867052025, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_CityLevel1234_Summaries_24hourly_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.44420289855072465, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80"], "isController": false}, {"data": [0.4152046783625731, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79"], "isController": false}, {"data": [0.36142625607779577, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -77"], "isController": false}, {"data": [0.3734076433121019, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -78"], "isController": false}, {"data": [0.41402337228714525, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -79"], "isController": false}, {"data": [0.3494318181818182, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -77"], "isController": false}, {"data": [0.4421965317919075, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.433240611961057, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -77"], "isController": false}, {"data": [0.4020319303338171, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -79"], "isController": false}, {"data": [0.34558823529411764, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -80"], "isController": false}, {"data": [0.4108695652173913, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -78"], "isController": false}, {"data": [0.41748942172073344, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -79"], "isController": false}, {"data": [0.41751085383502173, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -77"], "isController": false}, {"data": [0.45639943741209565, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -78"], "isController": false}, {"data": [0.37766714082503555, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77"], "isController": false}, {"data": [3.50385423966363E-4, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.4365079365079365, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78"], "isController": false}, {"data": [0.4290830945558739, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -79"], "isController": false}, {"data": [0.3391167192429022, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -80"], "isController": false}, {"data": [0.3082191780821918, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -77"], "isController": false}, {"data": [0.43037974683544306, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -77"], "isController": false}, {"data": [0.2887563884156729, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP "], "isController": false}, {"data": [0.42887624466571833, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -80"], "isController": false}, {"data": [0.3065326633165829, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -78"], "isController": false}, {"data": [0.3646677471636953, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -80"], "isController": false}, {"data": [0.4387323943661972, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -79"], "isController": false}, {"data": [0.0027184466019417475, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.4231311706629055, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -78"], "isController": false}, {"data": [0.32357859531772576, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST"], "isController": false}, {"data": [0.28678929765886285, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -79"], "isController": false}, {"data": [0.293015332197615, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -78"], "isController": false}, {"data": [0.4295774647887324, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -80"], "isController": false}, {"data": [0.32154882154882153, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -77"], "isController": false}, {"data": [0.3295081967213115, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -77"], "isController": false}, {"data": [0.37763371150729336, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -78"], "isController": false}, {"data": [0.409688013136289, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -80"], "isController": false}, {"data": [0.3328, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -79"], "isController": false}, {"data": [0.29572649572649573, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -80"], "isController": false}, {"data": [0.2965811965811966, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -79"], "isController": false}, {"data": [0.3149078726968174, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -80"], "isController": false}, {"data": [0.4146685472496474, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -79"], "isController": false}, {"data": [0.43820224719101125, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -80"], "isController": false}, {"data": [0.30351170568561875, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -78"], "isController": false}, {"data": [0.44523470839260315, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -78"], "isController": false}, {"data": [0.42574257425742573, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -77"], "isController": false}, {"data": [0.38200589970501475, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80"], "isController": false}, {"data": [0.29588336192109777, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -77"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 67315, 200, 0.29711059942063434, 3720.15541855455, 94, 90264, 7471.0, 14106.600000000006, 26851.9, 89610.37000006733, 25.77618619661584, 1892.5386772476816, 10.146078866121595], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -80", 589, 0, 0.0, 1459.495755517828, 141, 5591, 1572.0, 2361.0, 3223.0, 3761.6000000000013, 3.276499874836592, 8.840567459600035, 1.0591029868856563], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -79", 623, 0, 0.0, 1539.4606741573034, 108, 4155, 1766.0, 2369.8, 2756.999999999998, 3735.5999999999995, 3.459266169154229, 28.991194930412114, 1.2296610210665422], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -78", 693, 0, 0.0, 1243.373737373738, 102, 4200, 1473.0, 2099.0, 2463.0, 3461.4399999999987, 3.859692115757346, 33.69684525516853, 1.4737691574815648], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -77", 708, 0, 0.0, 1246.8192090395464, 129, 3820, 1186.5, 2266.800000000001, 2612.4999999999986, 3325.73, 3.954158568460559, 10.733482801085719, 1.254981967528986], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -80", 625, 0, 0.0, 1439.3903999999977, 108, 4563, 1709.0, 2410.2, 2708.1, 3823.36, 3.4585034917051254, 28.632566730095622, 1.2293899130670563], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79", 703, 0, 0.0, 1329.2873399715502, 102, 5739, 1572.0, 2121.6, 2520.2, 3638.760000000002, 3.89693899045444, 36.271714356935775, 1.4879913528004745], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -78", 702, 0, 0.0, 1189.6467236467236, 130, 4325, 1169.5, 2073.4, 2316.65, 2821.6400000000003, 3.9093172060076515, 10.302299038402637, 1.2407500897973505], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -79", 718, 0, 0.0, 1213.2646239554333, 130, 4893, 1162.0, 2160.4000000000005, 2521.999999999998, 3728.179999999985, 3.9895094792523285, 10.45695432831218, 1.2662017390205142], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77", 687, 0, 0.0, 1326.2518195050964, 102, 4162, 1562.0, 2203.2, 2444.4, 3540.7200000000003, 3.806958921417053, 33.23669824239855, 1.4536337287832692], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 612, 0, 0.0, 1423.35294117647, 106, 4437, 1671.5, 2400.7, 2679.4500000000003, 3762.88, 3.3850306422708467, 27.655976037910133, 1.2032726111197152], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -79", 631, 0, 0.0, 1372.786053882724, 103, 5645, 1622.0, 2368.600000000003, 2912.399999999999, 3968.319999999996, 3.4774270346530285, 28.506577093758267, 1.236116641224319], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -80", 702, 0, 0.0, 1339.1495726495716, 100, 5161, 1566.0, 2226.8, 2797.05, 3949.810000000002, 3.913152540483291, 35.331050849731035, 1.494182268875944], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -80", 708, 0, 0.0, 1242.389830508475, 131, 4282, 1214.0, 2184.4, 2571.2999999999997, 3397.1999999999994, 3.937423879252335, 10.372950822521176, 1.2496706648017664], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -77", 618, 0, 0.0, 1451.2508090614892, 105, 4542, 1709.0, 2405.6000000000004, 3236.299999999997, 3912.9099999999994, 3.4293705051939978, 26.985922387255282, 1.219034046768179], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 1586, 0, 0.0, 11146.067465321554, 3517, 15925, 11363.5, 12452.6, 12741.149999999998, 13715.429999999998, 8.192529611397223, 5787.6824864501705, 2.992193432287658], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -79", 592, 0, 0.0, 1427.9932432432436, 118, 5272, 1582.0, 2294.500000000002, 2922.500000000001, 3732.270000000003, 3.2771095008497233, 8.523313077438319, 1.0593000437316977], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -78", 585, 0, 0.0, 1535.8598290598302, 135, 4711, 1671.0, 2447.2, 3049.599999999998, 3740.0599999999995, 3.2460146153888836, 9.164778504586035, 1.0492488649352738], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 601, 0, 0.0, 1588.6821963394345, 153, 5805, 1651.0, 2711.4, 3255.4999999999995, 4493.0800000000045, 3.340577736522353, 9.185926548282744, 1.0798156550672842], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -78", 722, 0, 0.0, 1233.8074792243765, 125, 4538, 1164.5, 2208.4, 2555.55, 3148.4099999999976, 4.015081580674223, 11.088569529868426, 1.2743178844913303], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -77", 702, 0, 0.0, 1266.2079772079767, 129, 4902, 1219.5, 2173.800000000001, 2467.25, 3065.1300000000037, 3.9122148039991527, 10.581888834862182, 1.2416697375973875], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -80", 719, 0, 0.0, 1239.0166898470093, 139, 4053, 1187.0, 2232.0, 2497.0, 2960.999999999999, 4.005414830619419, 10.572076402313002, 1.2712498241712022], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 1580, 0, 0.0, 11286.470886075946, 4639, 36733, 11504.5, 13653.7, 14397.799999999996, 16540.680000000008, 8.380140128672279, 5920.024534202773, 3.060715242308039], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 702, 0, 0.0, 1223.7948717948718, 121, 4342, 1145.0, 2074.8, 2632.0, 3332.7700000000013, 3.8965796689572487, 10.01212087098547, 1.2367074144639707], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -80", 586, 0, 0.0, 1454.0938566552911, 133, 3859, 1605.5, 2298.1000000000013, 2977.0, 3694.56, 3.2625519168884387, 8.54436458182547, 1.054594418447337], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 624, 0, 0.0, 1396.3685897435903, 100, 5258, 1716.0, 2326.0, 2653.75, 3737.5, 3.4502015382148525, 27.72044084583847, 1.2264388280373109], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -78", 622, 0, 0.0, 1437.8344051446938, 100, 4622, 1706.0, 2403.1000000000004, 3083.7, 4008.0999999999995, 3.4569959705432822, 27.760812882103654, 1.2288540364040572], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -77", 593, 0, 0.0, 1418.7133220910623, 137, 4517, 1556.0, 2222.2000000000003, 2895.0999999999967, 3778.359999999997, 3.2929808973789427, 8.55232960698023, 1.0644303486644824], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 1984, 0, 0.0, 9262.275201612883, 189, 20192, 9152.0, 11475.5, 13157.75, 14632.100000000002, 10.505914872435742, 780.1483821059885, 3.755043792296368], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -79", 593, 0, 0.0, 1465.1129848229334, 137, 4558, 1604.0, 2352.0, 3089.5999999999995, 3716.6999999999975, 3.300587203962931, 8.66118235674728, 1.0668890278434866], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80", 693, 0, 0.0, 1249.0937950937946, 111, 3916, 1486.0, 2116.0, 2514.999999999999, 3421.4799999999996, 3.8725468281997406, 33.28909100799376, 1.4786775486582995], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -78", 589, 0, 0.0, 1509.3786078098465, 138, 3735, 1680.0, 2147.0, 2607.5, 3603.6000000000004, 3.2604303325196096, 9.077813107179034, 1.053908632874991], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -80", 699, 0, 0.0, 1300.6766809728185, 148, 3536, 1247.0, 2278.0, 2636.0, 3146.0, 3.879819940831358, 10.589791865560631, 1.23138816481464], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -77", 628, 0, 0.0, 1454.025477707005, 94, 5409, 1651.0, 2402.0, 2981.55, 4094.3600000000006, 3.4901686173819293, 29.244251538063956, 1.2406458757099825], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77", 680, 0, 0.0, 1254.6073529411751, 111, 5659, 1444.0, 2139.7, 2423.0, 3379.4899999999957, 3.7816644885020714, 35.60228133776381, 1.4439754052776466], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -78", 618, 0, 0.0, 1518.4935275080898, 107, 6558, 1736.0, 2311.2, 2631.1499999999987, 4070.2699999999963, 3.431122165715428, 26.762082751532343, 1.219656707344156], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 698, 0, 0.0, 1255.4713467048707, 109, 3863, 1446.0, 2148.5, 2565.4999999999995, 3488.04, 3.890139777515215, 35.776226876170384, 1.4853951689535636], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -79", 619, 0, 0.0, 1383.8432956381264, 105, 4101, 1705.0, 2290.0, 2630.0, 3876.399999999998, 3.4290399242176637, 27.01650524084989, 1.2189165355617477], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79", 692, 0, 0.0, 1190.9190751445105, 104, 4219, 1425.0, 2116.8, 2473.0000000000014, 3484.8400000000006, 3.8690559391686, 32.56208437875654, 1.4773446017723855], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 797, 0, 0.0, 23697.947302383942, 12021, 47968, 25021.0, 31948.0, 32377.199999999997, 33193.26, 4.099920779447926, 2704.2812424846575, 1.4213592545937632], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 200, 200, 100.0, 90041.23999999999, 90031, 90264, 90040.0, 90044.0, 90045.95, 90064.94, 1.052747935298112, 0.3001976534248522, 0.45646492507066566], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 690, 0, 0.0, 1196.7115942029009, 103, 3897, 1447.5, 2105.3999999999996, 2467.45, 3295.9600000000046, 3.8348672802454313, 34.07259171029523, 1.4642901431405897], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 684, 0, 0.0, 1263.3640350877195, 99, 4053, 1447.5, 2287.5, 2517.75, 3685.6499999999987, 3.820311321861229, 33.829442115511355, 1.4587321551247465], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -77", 617, 0, 0.0, 1402.756888168557, 105, 4389, 1655.0, 2301.8, 2763.6000000000013, 4032.120000000001, 3.4139890553154757, 27.289676945406608, 1.213566422006673], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -78", 628, 0, 0.0, 1385.404458598725, 101, 5496, 1638.0, 2327.2000000000003, 2642.0499999999984, 3802.7300000000023, 3.4817706023241377, 28.90921269293888, 1.2376606437949083], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 599, 0, 0.0, 1296.8146911519204, 95, 4522, 1563.0, 2296.0, 2799.0, 3993.0, 3.3099408741780407, 25.05701696068409, 1.1765805451179754], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -77", 704, 0, 0.0, 1361.7386363636367, 96, 4379, 1573.5, 2189.0, 2499.75, 3646.4000000000005, 3.922398903511215, 37.198651013750684, 1.497712862571177], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78", 692, 0, 0.0, 1226.663294797688, 118, 4503, 1449.5, 2165.9000000000015, 2616.05, 3537.9000000000033, 3.8447862032180637, 33.50008607535948, 1.4680775443928349], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 1579, 0, 0.0, 11140.59531348955, 1608, 17377, 11642.0, 13134.0, 16277.0, 16889.0, 8.704520396912901, 1959.841774264402, 3.553212427646086], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -77", 719, 0, 0.0, 1215.550764951321, 128, 4330, 1161.0, 2122.0, 2349.0, 3358.3999999999987, 4.016445641123041, 10.773358682840447, 1.2747508138329962], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -79", 689, 0, 0.0, 1250.3628447024655, 99, 4117, 1476.0, 2094.0, 2379.5, 3399.4000000000005, 3.805242287342737, 33.962516603061864, 1.4529782562021583], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 612, 0, 0.0, 1426.8300653594774, 102, 4329, 1689.5, 2321.9000000000005, 2606.75, 3756.23, 3.361510702456869, 27.577805095201608, 1.194912007513965], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -78", 690, 0, 0.0, 1302.9869565217377, 117, 4905, 1531.5, 2338.4999999999995, 3031.1499999999996, 3536.6600000000026, 3.8519080901234846, 32.45099546005181, 1.470796936756135], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -79", 709, 0, 0.0, 1261.1480959097328, 123, 3444, 1226.0, 2255.0, 2550.5, 3032.7999999999975, 3.950829172610556, 10.596140645199938, 1.2539252745101863], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -77", 691, 0, 0.0, 1227.735166425469, 104, 4171, 1435.0, 2159.8, 2455.0, 3242.2000000000025, 3.868006381370875, 33.69210322846987, 1.4769438428867305], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -78", 711, 0, 0.0, 1188.4050632911394, 128, 4093, 1154.0, 2029.8000000000004, 2441.0, 3314.5199999999995, 3.971956090611994, 10.52678783413871, 1.2606305951649395], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 703, 0, 0.0, 1330.7894736842077, 98, 4910, 1545.0, 2126.2, 2728.999999999992, 3873.520000000005, 3.9137091162143354, 34.668966379610296, 1.494394789491997], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 1427, 0, 0.0, 12343.419060967057, 1499, 43659, 10318.0, 14063.4, 35412.999999999985, 41522.6, 7.860786409157513, 1012.8126555751953, 2.9631480018894534], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78", 693, 0, 0.0, 1218.5425685425687, 103, 3776, 1417.0, 2122.2, 2417.0999999999995, 3205.24, 3.877074906429902, 34.64757077025394, 1.4804065316543864], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -79", 698, 0, 0.0, 1219.59598853868, 99, 5488, 1453.0, 2052.6000000000004, 2367.6999999999994, 3612.1499999999996, 3.881270921607224, 32.738818235022634, 1.4820087210433834], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -80", 634, 0, 0.0, 1467.4936908517354, 102, 5093, 1741.0, 2378.0, 2915.0, 3973.249999999994, 3.4932284262840647, 28.68369185069479, 1.2417335421556635], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -77", 584, 0, 0.0, 1489.001712328768, 129, 6839, 1615.0, 2373.5, 3092.0, 4129.699999999993, 3.2353495174675633, 8.928335701098579, 1.0458014553532846], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -77", 711, 0, 0.0, 1214.6526019690577, 117, 3796, 1178.0, 2144.6000000000004, 2377.7999999999997, 2864.52, 3.949341776370605, 10.566717613036715, 1.2534532005082486], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -79", 587, 0, 0.0, 1480.1635434412267, 144, 5351, 1654.0, 2225.400000000001, 2658.0, 3615.640000000001, 3.2660646424855475, 9.016202786031036, 1.0557298795534338], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 2725, 0, 0.0, 6486.624220183507, 2065, 17182, 6506.0, 8246.4, 9242.7, 12793.799999999985, 14.194334767525445, 259.4585270268598, 17.091420672225464], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -80", 703, 0, 0.0, 1221.4822190611662, 113, 4034, 1443.0, 2154.6000000000004, 2482.0, 3643.640000000005, 3.8882528304600084, 34.43659007347858, 1.484674664755726], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -78", 597, 0, 0.0, 1485.1775544388595, 129, 4508, 1610.0, 2417.4000000000005, 2907.4, 3751.3999999999987, 3.2981603226341085, 8.856069329733165, 1.0661045574139552], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -80", 617, 0, 0.0, 1413.0210696920574, 117, 4552, 1663.0, 2452.4000000000005, 2688.7000000000003, 3799.040000000001, 3.425246900901001, 27.57146260506126, 1.2175682343046526], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -79", 710, 0, 0.0, 1236.1830985915494, 135, 3603, 1216.0, 2169.4999999999995, 2542.1499999999996, 3258.2799999999993, 3.9715835990378694, 10.768299088913128, 1.2605123727415113], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 2575, 0, 0.0, 6977.059805825245, 257, 8655, 6995.0, 7937.4, 8319.0, 8488.72, 13.929384780997616, 991.6702405794084, 7.780867280010386], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 709, 0, 0.0, 1268.0705218617768, 130, 4161, 1228.0, 2264.0, 2592.5, 3141.2999999999997, 3.9348884189962425, 10.510624961844348, 1.248865953294706], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -80", 598, 0, 0.0, 1427.7993311036766, 129, 4607, 1552.5, 2291.5000000000014, 2839.299999999999, 3819.059999999999, 3.307339195840938, 8.912303488468558, 1.0690715564681157], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 600, 0, 0.0, 30759.363333333305, 23890, 37877, 30065.0, 34298.6, 34907.399999999994, 37194.86, 3.155237694572991, 5086.859138562592, 1.811796644930585], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 598, 0, 0.0, 1528.4715719063538, 156, 4934, 1601.0, 2374.7000000000003, 2976.5999999999985, 3833.16, 3.319713993871297, 9.138191075076609, 1.0730716132533198], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -78", 587, 0, 0.0, 1473.9676320272583, 107, 4198, 1625.0, 2149.6000000000004, 2577.6000000000004, 3676.2, 3.2672644591758924, 8.856164787432999, 1.05611771092502], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -80", 710, 0, 0.0, 1230.6873239436622, 140, 3359, 1200.0, 2224.5, 2502.0499999999993, 3018.959999999999, 3.939913543868995, 10.69668318933227, 1.2504608415599838], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -77", 594, 0, 0.0, 1472.5521885521894, 142, 4581, 1583.5, 2345.5, 3001.5, 3538.0499999999975, 3.276391777028853, 8.64424552667722, 1.0590680451138188], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -77", 610, 0, 0.0, 1463.9770491803267, 109, 4107, 1697.5, 2363.2, 3196.8499999999976, 3978.23, 3.365387267802071, 25.40284974338922, 1.1962900053515175], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -78", 617, 0, 0.0, 1384.6142625607763, 107, 5619, 1665.0, 2305.0000000000005, 2751.2000000000007, 3763.420000000004, 3.426407214891821, 26.22055019138178, 1.217980689668577], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -80", 609, 0, 0.0, 1334.0853858784888, 108, 4777, 1527.0, 2328.0, 2835.0, 3886.7999999999993, 3.3758876256257033, 27.806206588801366, 1.2000225544216367], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -79", 625, 0, 0.0, 1477.9455999999982, 99, 4864, 1711.0, 2564.3999999999987, 3117.5999999999995, 3946.76, 3.4700438058330048, 28.40555087292422, 1.233492134104701], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -80", 585, 0, 0.0, 1583.0820512820528, 137, 5886, 1630.0, 2567.4, 3526.5999999999995, 5558.999999999999, 3.2424163484295065, 9.095469329374076, 1.048085753252116], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -79", 585, 0, 0.0, 1494.4615384615404, 126, 4367, 1617.0, 2224.4, 3146.3999999999996, 3946.4999999999964, 3.24437641421536, 8.745853974638404, 1.048719329204379], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 597, 0, 0.0, 1492.7169179229488, 117, 5132, 1625.0, 2546.6000000000004, 3185.3, 3741.08, 3.3138498942565486, 8.690865802262522, 1.0711760888661306], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -79", 709, 0, 0.0, 1254.9055007052182, 125, 3982, 1190.0, 2199.0, 2545.0, 3488.599999999994, 3.960694713673614, 10.852162548391423, 1.257056427679614], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -80", 712, 0, 0.0, 1238.623595505617, 127, 4493, 1164.0, 2277.5, 2539.4, 3290.9800000000005, 3.980544529546598, 10.4651335467099, 1.2633564180689887], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 598, 0, 0.0, 1474.5484949832778, 151, 5497, 1628.5, 2252.800000000001, 3034.6999999999985, 3808.629999999999, 3.3191059505242304, 8.929203275813263, 1.0728750679917187], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -78", 703, 0, 0.0, 1215.6273115220472, 136, 3635, 1173.0, 2108.4000000000005, 2560.2, 3131.600000000002, 3.937074020351816, 10.736866035876098, 1.2495596255999417], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -77", 707, 0, 0.0, 1253.7581329561522, 109, 4123, 1216.0, 2256.2, 2593.600000000001, 3282.479999999994, 3.9247905760615533, 10.779848722777663, 1.245661071503911], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80", 678, 0, 0.0, 1309.7212389380536, 96, 5390, 1518.0, 2128.8, 2570.5499999999993, 3499.05, 3.7428785938259064, 34.48751839006536, 1.4291655568221966], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -77", 583, 0, 0.0, 1519.1252144082341, 128, 4616, 1638.0, 2458.2000000000003, 3002.2, 3842.999999999998, 3.246590523074181, 8.68832983313193, 1.0494350225952676], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 200, 100.0, 0.29711059942063434], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 67315, 200, "504/Gateway Time-out", 200, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 200, 200, "504/Gateway Time-out", 200, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
