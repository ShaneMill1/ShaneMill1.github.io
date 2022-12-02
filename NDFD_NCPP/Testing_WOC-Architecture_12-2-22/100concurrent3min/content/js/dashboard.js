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

    var data = {"OkPercent": 98.37798459754393, "KoPercent": 1.6220154024560673};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.3018717849603045, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.35648148148148145, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -80"], "isController": false}, {"data": [0.40086830680173663, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -79"], "isController": false}, {"data": [0.42793367346938777, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -78"], "isController": false}, {"data": [0.277319587628866, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -77"], "isController": false}, {"data": [0.4139941690962099, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -80"], "isController": false}, {"data": [0.48582474226804123, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79"], "isController": false}, {"data": [0.27618069815195073, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -78"], "isController": false}, {"data": [0.2668024439918534, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -79"], "isController": false}, {"data": [0.46423927178153446, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77"], "isController": false}, {"data": [0.4130747126436782, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -78"], "isController": false}, {"data": [0.4282608695652174, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -79"], "isController": false}, {"data": [0.4595827900912647, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -80"], "isController": false}, {"data": [0.305327868852459, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -80"], "isController": false}, {"data": [0.353410740203193, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.38740157480314963, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -79"], "isController": false}, {"data": [0.375187969924812, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -78"], "isController": false}, {"data": [0.3517080745341615, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -77"], "isController": false}, {"data": [0.27049180327868855, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -78"], "isController": false}, {"data": [0.24896694214876033, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -77"], "isController": false}, {"data": [0.2799586776859504, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.26386036960985626, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -79"], "isController": false}, {"data": [0.3708206686930091, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -80"], "isController": false}, {"data": [0.41316931982633864, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -77"], "isController": false}, {"data": [0.3722627737226277, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -78"], "isController": false}, {"data": [0.35627836611195157, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}, {"data": [0.375, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -79"], "isController": false}, {"data": [0.49361430395913153, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80"], "isController": false}, {"data": [0.3495297805642633, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -78"], "isController": false}, {"data": [0.25933609958506226, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -80"], "isController": false}, {"data": [0.4064748201438849, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -77"], "isController": false}, {"data": [0.4553686934023286, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77"], "isController": false}, {"data": [0.40217391304347827, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -78"], "isController": false}, {"data": [0.4481012658227848, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78"], "isController": false}, {"data": [0.3870262390670554, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -79"], "isController": false}, {"data": [0.4807692307692308, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_CityLevel1234_Summaries_24hourly_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.47692307692307695, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80"], "isController": false}, {"data": [0.4646529562982005, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79"], "isController": false}, {"data": [0.41351744186046513, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -77"], "isController": false}, {"data": [0.41942446043165466, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -78"], "isController": false}, {"data": [0.3782608695652174, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -79"], "isController": false}, {"data": [0.4878980891719745, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -77"], "isController": false}, {"data": [0.463302752293578, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.28775510204081634, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -77"], "isController": false}, {"data": [0.4491094147582697, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -79"], "isController": false}, {"data": [0.38672438672438675, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -80"], "isController": false}, {"data": [0.4622395833333333, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -78"], "isController": false}, {"data": [0.29065040650406504, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -79"], "isController": false}, {"data": [0.4536213468869123, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -77"], "isController": false}, {"data": [0.2886178861788618, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -78"], "isController": false}, {"data": [0.47283311772315656, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77"], "isController": false}, {"data": [8.403361344537816E-4, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.4904092071611253, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78"], "isController": false}, {"data": [0.44843342036553524, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -79"], "isController": false}, {"data": [0.41884057971014493, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -80"], "isController": false}, {"data": [0.359472049689441, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -77"], "isController": false}, {"data": [0.27561475409836067, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -77"], "isController": false}, {"data": [0.3607305936073059, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -79"], "isController": false}, {"data": [0.013050570962479609, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP "], "isController": false}, {"data": [0.45703125, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -80"], "isController": false}, {"data": [0.3791793313069909, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -78"], "isController": false}, {"data": [0.3991291727140784, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -80"], "isController": false}, {"data": [0.2893660531697341, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -79"], "isController": false}, {"data": [4.2211903756859433E-4, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.2936991869918699, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -78"], "isController": false}, {"data": [0.3669230769230769, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST"], "isController": false}, {"data": [0.3635658914728682, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -79"], "isController": false}, {"data": [0.3870967741935484, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -78"], "isController": false}, {"data": [0.2975708502024291, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -80"], "isController": false}, {"data": [0.3790199081163859, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -77"], "isController": false}, {"data": [0.41389290882778584, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -77"], "isController": false}, {"data": [0.3735632183908046, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -80"], "isController": false}, {"data": [0.3889695210449927, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -78"], "isController": false}, {"data": [0.4017216642754663, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -79"], "isController": false}, {"data": [0.35145482388973964, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -80"], "isController": false}, {"data": [0.34603421461897355, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -80"], "isController": false}, {"data": [0.36722306525037934, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -79"], "isController": false}, {"data": [0.28952772073921973, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -79"], "isController": false}, {"data": [0.28313253012048195, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -80"], "isController": false}, {"data": [0.36817472698907955, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -78"], "isController": false}, {"data": [0.29876796714579057, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -78"], "isController": false}, {"data": [0.286144578313253, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -77"], "isController": false}, {"data": [0.48286802030456855, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80"], "isController": false}, {"data": [0.35176651305683565, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -77"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 67262, 1091, 1.6220154024560673, 3736.551886652192, 38, 90193, 7824.5, 15574.400000000009, 22802.600000000006, 89765.5500000497, 25.24078603609858, 1422.3749092015662, 9.905131468017093], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -80", 648, 0, 0.0, 1359.231481481482, 157, 3780, 1417.0, 2141.1000000000004, 2522.5999999999995, 3101.069999999999, 3.5838725734196117, 9.906203334992533, 1.1584588103534097], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -79", 691, 0, 0.0, 1263.2387843704773, 144, 4649, 1362.0, 1994.000000000001, 2241.1999999999994, 2792.7200000000075, 3.8389102161678674, 25.382259068105935, 1.3646126159034218], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -78", 784, 0, 0.0, 1196.1989795918355, 123, 3701, 1188.5, 1923.0, 2230.25, 2882.3999999999996, 4.355579753220852, 40.6352246661787, 1.6631168784271024], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -77", 485, 36, 7.422680412371134, 1771.4989690721645, 81, 35376, 1333.0, 2347.400000000001, 3393.6, 26641.99999999994, 2.708574173047174, 7.023291818151356, 0.8596548889065737], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -80", 686, 0, 0.0, 1235.6997084548093, 130, 3078, 1338.5, 1988.0, 2144.6, 2740.04, 3.8257979242536626, 24.98133350633543, 1.3599516058870442], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79", 776, 0, 0.0, 1096.8505154639179, 124, 4198, 1061.5, 1931.900000000001, 2254.75, 3111.500000000001, 4.2978831817627965, 39.78256569883525, 1.6410862539738804], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -78", 487, 47, 9.650924024640657, 1742.484599589323, 90, 38274, 1343.0, 2485.1999999999994, 3682.1999999999985, 15493.200000000057, 2.718483454651007, 7.00815950610961, 0.8627999245718528], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -79", 491, 49, 9.979633401221996, 1898.1364562118133, 92, 37901, 1344.0, 3074.2000000000007, 4390.599999999998, 26043.959999999945, 2.724886370573447, 7.058883438268282, 0.8648321000355178], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77", 769, 0, 0.0, 1144.566970091027, 128, 3545, 1139.0, 1905.0, 2246.0, 2916.5999999999954, 4.285961108664998, 39.73055402770269, 1.636533978015639], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 696, 0, 0.0, 1247.3175287356328, 126, 8548, 1310.0, 2127.6000000000004, 2440.0499999999997, 2826.129999999993, 3.8764007396350837, 25.45815568817252, 1.3779393254171586], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -79", 690, 0, 0.0, 1221.8144927536227, 128, 3816, 1320.0, 2068.8, 2323.8999999999996, 3097.5100000000043, 3.8408015585861395, 24.62747660381297, 1.3652849290286668], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -80", 767, 0, 0.0, 1141.6075619295962, 118, 3586, 1125.0, 1947.4000000000003, 2207.2, 2581.519999999996, 4.269840562928654, 40.30375295047653, 1.6303785743213903], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -80", 488, 46, 9.426229508196721, 1573.565573770492, 91, 37362, 1238.0, 2138.9, 3371.449999999999, 9901.620000000143, 2.72348785034211, 6.8380957455268945, 0.8643882337511581], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -77", 689, 0, 0.0, 1338.4949201741651, 135, 4157, 1433.0, 2014.0, 2409.0, 3320.2000000000016, 3.827543872318914, 25.833832507110678, 1.3605722358633638], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 1520, 0, 0.0, 11767.899999999992, 2692, 22476, 11474.5, 16687.300000000003, 17923.6, 19384.59, 7.989781489989118, 3419.3727058535005, 2.9181428488827446], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -79", 635, 0, 0.0, 1327.5559055118113, 158, 4554, 1411.0, 2108.4, 2606.999999999999, 3724.2399999999943, 3.52883642870639, 9.821620531298278, 1.1406688065447412], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -78", 665, 0, 0.0, 1324.4270676691729, 146, 3127, 1405.0, 2043.8, 2329.5999999999976, 2908.34, 3.7022809390988702, 10.187285744409, 1.1967333894938732], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 644, 0, 0.0, 1399.8850931677025, 168, 3887, 1418.5, 2154.5, 2658.5, 3407.0499999999993, 3.562242442680532, 10.031706343170065, 1.1514670395773985], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -78", 488, 39, 7.991803278688525, 1789.768442622951, 87, 38092, 1362.0, 2562.300000000002, 3748.2499999999973, 9565.250000000344, 2.7143230600655217, 7.0974665941502995, 0.8614794868372018], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -77", 484, 42, 8.677685950413224, 1961.4070247933887, 107, 39356, 1412.0, 3242.5, 4314.5, 30425.69999999995, 2.6889038272434846, 7.03554255856977, 0.8534118592325514], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -80", 484, 35, 7.231404958677686, 1722.3780991735546, 99, 37667, 1366.0, 2502.0, 3846.75, 11411.049999999876, 2.6948474961303326, 6.9769991860474825, 0.8552982775804279], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 1555, 0, 0.0, 11758.880385852097, 3706, 22372, 11624.0, 15708.0, 17283.199999999997, 19313.160000000003, 8.198017714044708, 3513.1025567732495, 2.994197876028047], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 487, 45, 9.240246406570842, 1806.2053388090337, 92, 37842, 1331.0, 2967.0, 3707.799999999996, 16332.000000000073, 2.7009639168968307, 6.944216966573491, 0.8572395244057324], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -80", 658, 0, 0.0, 1341.6367781155009, 146, 3931, 1404.0, 2120.9, 2393.0, 3362.4099999999935, 3.6485422465704813, 9.99783922293813, 1.1793627769676067], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 691, 0, 0.0, 1232.7033285094053, 116, 4878, 1338.0, 1965.4000000000005, 2226.7999999999997, 2942.600000000003, 3.860399894970307, 24.799898444527003, 1.372251525165226], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -78", 685, 0, 0.0, 1331.5255474452551, 125, 4208, 1417.0, 2249.9999999999995, 2561.1, 3214.2, 3.816559970136115, 25.296593023774104, 1.3566678018843221], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -77", 661, 0, 0.0, 1333.3403933434195, 138, 3430, 1400.0, 2019.4, 2266.9, 3171.2999999999997, 3.6725078617225786, 10.424606375634772, 1.1871094748341537], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 2046, 0, 0.0, 8801.92864125122, 2980, 17761, 8523.5, 10906.4, 11736.999999999996, 13337.609999999999, 10.859814969134982, 650.1597396892134, 3.8815354284212926], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -79", 656, 0, 0.0, 1330.5762195121956, 159, 3640, 1414.5, 2112.0, 2381.6499999999996, 3144.5899999999992, 3.6368877997937616, 10.036308240101123, 1.1755955680973977], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80", 783, 0, 0.0, 1062.8212005108549, 125, 3064, 1018.0, 1876.4, 2168.1999999999994, 2679.5599999999986, 4.3685176609740175, 41.031627075813034, 1.6680570365633212], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -78", 638, 0, 0.0, 1373.9326018808777, 149, 3613, 1418.0, 2155.4, 2435.099999999999, 3211.5200000000004, 3.551587080684488, 10.008387527972923, 1.1480227770571927], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -80", 482, 43, 8.921161825726141, 1918.0207468879669, 109, 37473, 1381.0, 2797.1, 3993.1, 29681.75000000004, 2.6780455823360114, 6.790197248891556, 0.8499656389250037], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -77", 695, 0, 0.0, 1269.94820143885, 131, 5181, 1370.0, 2082.8, 2388.0, 3563.4799999999996, 3.862462973151714, 25.305818842150305, 1.3729848849875232], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77", 773, 0, 0.0, 1163.2082794307883, 133, 4392, 1080.0, 2086.6000000000004, 2413.8999999999996, 3348.7999999999993, 4.297787167797176, 40.64231489943567, 1.6410495923913042], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -78", 690, 0, 0.0, 1284.755072463768, 132, 7114, 1351.0, 2068.5, 2320.7999999999984, 3120.680000000005, 3.8256183363550176, 24.643758784368192, 1.3598877680011976], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 790, 0, 0.0, 1190.5556962025323, 113, 3564, 1159.0, 2007.4999999999995, 2417.7999999999984, 3194.7800000000016, 4.3791088790589905, 40.88385006991331, 1.672101144250064], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -79", 686, 0, 0.0, 1288.781341107872, 132, 3775, 1396.0, 2158.6000000000004, 2407.45, 3276.3099999999986, 3.8048331364359917, 24.6440703568279, 1.3524992789674815], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79", 780, 0, 0.0, 1105.68717948718, 129, 4311, 1072.0, 1903.1, 2210.499999999999, 3002.689999999991, 4.330831075378669, 39.46048511380924, 1.6536669438213476], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 800, 0, 0.0, 22413.45124999998, 13780, 31703, 22122.5, 28697.9, 29341.799999999996, 30496.15, 4.303481516546887, 41.50396928928003, 1.4919296273185008], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 200, 200, 100.0, 90102.97000000003, 90076, 90193, 90100.0, 90122.9, 90138.95, 90181.67, 1.052194087721421, 0.3000397203268115, 0.4562247802229599], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 780, 0, 0.0, 1107.7269230769218, 115, 3732, 1065.0, 1936.5, 2262.399999999999, 2839.2799999999993, 4.355960126211152, 40.50810045409488, 1.6632621185044536], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 778, 0, 0.0, 1130.3714652956294, 124, 3419, 1104.5, 1973.3000000000002, 2246.1499999999996, 2766.4100000000044, 4.332885935942347, 40.557928462479886, 1.6544515634311112], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -77", 688, 0, 0.0, 1239.0145348837211, 143, 3291, 1316.0, 1979.2, 2178.2, 2702.1700000000005, 3.832740966875759, 24.88871585420543, 1.3624196405691176], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -78", 695, 0, 0.0, 1241.5165467625889, 128, 3633, 1300.0, 2071.4, 2299.5999999999985, 2929.5999999999995, 3.8585601741071183, 25.25364958374741, 1.3715975618896397], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 690, 0, 0.0, 1304.618840579709, 122, 4284, 1394.5, 2103.7, 2371.5999999999995, 2971.6900000000046, 3.854511733915793, 25.238170594265156, 1.3701584679153795], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -77", 785, 0, 0.0, 1072.6917197452242, 123, 2983, 1060.0, 1836.1999999999998, 2167.7999999999997, 2651.3599999999997, 4.369364354892575, 39.179327662320496, 1.668380334729489], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78", 763, 0, 0.0, 1133.732634338138, 121, 3265, 1122.0, 1911.6000000000004, 2229.9999999999995, 2714.2000000000003, 4.233549912055353, 38.62634756272645, 1.616521499622698], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 1781, 0, 0.0, 9946.558674901746, 1630, 15575, 10092.0, 12381.8, 13066.299999999997, 14399.480000000003, 9.282374953744482, 1665.5298402653634, 3.789094463540228], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -77", 490, 43, 8.775510204081632, 1660.7040816326526, 98, 37081, 1280.5, 2422.9000000000005, 3305.799999999999, 6758.3999999995085, 2.7391440454362503, 7.267236954826483, 0.869357240983185], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -79", 786, 0, 0.0, 1139.5025445292617, 137, 3739, 1101.0, 1945.500000000001, 2272.1999999999994, 2696.33, 4.369215375635787, 40.12175505155785, 1.6683234490953056], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 693, 0, 0.0, 1286.6998556998547, 120, 3814, 1391.0, 2073.2000000000007, 2469.3999999999996, 3003.2999999999997, 3.863608487673249, 24.937586154148498, 1.3733920796026002], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -78", 768, 0, 0.0, 1144.2226562500002, 126, 4229, 1130.0, 1887.3000000000002, 2304.5999999999995, 2965.029999999994, 4.283085159779153, 40.76302366537003, 1.6354358373766102], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -79", 492, 48, 9.75609756097561, 1804.518292682927, 104, 37832, 1307.5, 2244.2999999999997, 3713.299999999996, 32397.419999999976, 2.7475595863024105, 6.824021417492237, 0.8720281890119954], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -77", 787, 0, 0.0, 1160.0559085133434, 124, 3423, 1115.0, 1968.6000000000004, 2249.7999999999993, 2858.4800000000005, 4.384474392329677, 41.303881689178645, 1.6741498900399447], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -78", 492, 43, 8.739837398373984, 1815.3211382113827, 107, 37347, 1276.0, 2242.2, 3420.649999999998, 31900.549999999985, 2.7499091747477853, 6.967104665623341, 0.8727739080010061], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 773, 0, 0.0, 1125.7736093143606, 116, 3458, 1115.0, 1935.0, 2186.8999999999996, 2825.999999999999, 4.2820265673989875, 40.11134095671165, 1.6350316287626994], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 1785, 0, 0.0, 10194.543417366955, 1171, 21794, 10206.0, 12092.4, 12498.999999999998, 15683.019999999944, 9.512542166941119, 1224.777232982675, 3.5857824965227265], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78", 782, 0, 0.0, 1052.9437340153447, 121, 3331, 1014.0, 1796.9000000000003, 2063.9499999999994, 2765.0, 4.348478866503923, 40.06579628738886, 1.6604055046904629], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -79", 766, 0, 0.0, 1156.6605744125318, 127, 3203, 1126.5, 1969.6000000000001, 2292.3, 2750.0, 4.257897399125074, 40.29594749334356, 1.6258182451737344], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -80", 690, 0, 0.0, 1248.9565217391305, 142, 3681, 1298.0, 2072.4999999999995, 2407.2999999999993, 3041.040000000002, 3.8294613224406433, 24.872892191991987, 1.3612538294613226], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -77", 644, 0, 0.0, 1343.5403726708066, 162, 3478, 1395.0, 2062.0, 2266.75, 2873.099999999999, 3.584428884708292, 10.249992738261552, 1.1586386336312937], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -77", 488, 56, 11.475409836065573, 1772.948770491804, 90, 37703, 1237.0, 2139.9000000000005, 2718.5499999999947, 32856.36000000002, 2.714806264081667, 6.817553101791328, 0.8616328474868571], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -79", 657, 0, 0.0, 1387.2496194824955, 152, 5221, 1411.0, 2169.2, 2622.800000000001, 4187.619999999997, 3.637934184953238, 9.966997046600994, 1.1759338039253142], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 2452, 34, 1.3866231647634584, 7301.216965742261, 38, 54668, 7139.5, 10720.200000000004, 11823.899999999998, 13499.639999999998, 10.954938210931704, 3012.7067044057103, 13.190858216873822], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -80", 768, 0, 0.0, 1136.936197916666, 126, 4399, 1119.5, 1919.1, 2224.2, 2692.649999999999, 4.256168118640686, 39.905781234413446, 1.6251579437387778], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -78", 658, 0, 0.0, 1338.2021276595756, 138, 3630, 1412.5, 2127.0, 2443.2, 3066.4299999999994, 3.6516199207520783, 9.754569207354297, 1.1803576111024785], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -80", 689, 0, 0.0, 1247.6328011611029, 136, 3671, 1351.0, 1992.0, 2293.0, 2976.6000000000013, 3.8256099321495594, 25.41304068319619, 1.3598847805687888], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -79", 489, 42, 8.588957055214724, 1999.9427402862996, 103, 39417, 1327.0, 2628.0, 3854.5, 35128.9, 2.7329886824088305, 7.1029127951655715, 0.8674036345535838], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 2369, 0, 0.0, 7498.495567750102, 748, 14218, 7438.0, 9192.0, 9723.5, 10905.000000000016, 12.910292811326615, 749.1026441338278, 7.211608875076976], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 492, 37, 7.520325203252033, 1673.9268292682934, 89, 38036, 1319.0, 2667.3999999999996, 3603.449999999999, 5050.259999999997, 2.729708886533991, 7.062118301949079, 0.8663626837144014], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -80", 650, 0, 0.0, 1338.5707692307706, 171, 3486, 1402.5, 2044.6, 2432.749999999999, 3000.37, 3.61048930461976, 10.057165502052424, 1.167062460770645], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 598, 0, 0.0, 32443.433110367918, 11991, 59031, 32789.5, 39169.0, 40604.299999999996, 46842.48999999999, 2.8647667227164506, 3284.7709919464364, 1.6450027665598368], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 645, 0, 0.0, 1365.6620155038756, 151, 5187, 1420.0, 2095.8, 2362.2, 3948.7599999999984, 3.5978446400481943, 9.984509134760199, 1.1629751717343284], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -78", 651, 0, 0.0, 1293.8725038402472, 161, 3363, 1388.0, 1954.4, 2233.4, 2747.920000000002, 3.594976972267321, 9.779743378146295, 1.1620482205278155], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -80", 494, 39, 7.894736842105263, 1699.5829959514172, 87, 36661, 1284.5, 2346.0, 3690.25, 8349.150000000252, 2.7396956386707485, 7.18776906487089, 0.8695323071953058], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -77", 653, 0, 0.0, 1326.3996937212855, 157, 4431, 1413.0, 2003.4, 2520.5999999999995, 3415.180000000003, 3.6251998578788416, 9.984230397967002, 1.171817532185446], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -77", 691, 0, 0.0, 1237.1837916063675, 128, 4855, 1348.0, 2092.4, 2357.3999999999996, 2832.6800000000007, 3.8511483778918447, 24.580777018648252, 1.3689628999537418], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -80", 696, 0, 0.0, 1315.0186781609204, 120, 3644, 1416.5, 2115.9, 2399.95, 2982.5099999999993, 3.8519436819268575, 25.584399325425597, 1.3692456056849376], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -78", 689, 0, 0.0, 1293.6690856313503, 134, 3749, 1381.0, 2069.0, 2293.5, 2985.6000000000013, 3.824484471704921, 25.192466643307153, 1.3594847145513584], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -79", 697, 0, 0.0, 1272.5925394548074, 132, 5548, 1374.0, 2054.2, 2369.7000000000003, 3037.059999999999, 3.8616028144823957, 25.050950381243247, 1.372679125460539], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -80", 653, 0, 0.0, 1411.6569678407345, 170, 5350, 1415.0, 2127.6000000000004, 2533.999999999999, 4225.360000000002, 3.6358574610244987, 10.340394017956571, 1.175262519139755], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 643, 0, 0.0, 1381.8973561430794, 168, 4161, 1473.0, 2173.6000000000013, 2586.2, 3150.9199999999996, 3.585008753442835, 10.064706045311612, 1.15882607166951], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -79", 659, 0, 0.0, 1360.8770864946887, 149, 3720, 1395.0, 2162.0, 2560.0, 3317.199999999999, 3.666407032380105, 10.404818679064203, 1.1851374294119283], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -79", 487, 41, 8.41889117043121, 1738.3572895277212, 100, 35288, 1321.0, 2265.2, 2976.7999999999997, 26754.760000000017, 2.7230892245066847, 6.914585179712706, 0.8642617167623755], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -80", 498, 45, 9.036144578313253, 1944.28514056225, 105, 37179, 1309.0, 2518.8, 3722.749999999998, 34087.35, 2.782527070971202, 7.080839299632908, 0.8831262676422275], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 641, 0, 0.0, 1321.0982839313576, 173, 3618, 1415.0, 2007.0, 2294.2, 2790.660000000003, 3.571289285575, 9.904453821864536, 1.1543913608645753], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -78", 487, 43, 8.829568788501026, 1885.5626283367556, 91, 37790, 1266.0, 2238.3999999999996, 3317.9999999999945, 34552.08, 2.7215370257568052, 7.055701309215784, 0.8637690755575798], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -77", 498, 38, 7.6305220883534135, 1673.8253012048187, 108, 38871, 1331.5, 2147.000000000001, 3424.8999999999983, 17924.75999999994, 2.7664514982168056, 7.208000575649671, 0.8780241571488884], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80", 788, 0, 0.0, 1118.1687817258883, 130, 3710, 1081.5, 1906.2000000000003, 2322.0, 3222.66, 4.38025992506865, 40.728683971264275, 1.6725406549822677], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -77", 651, 0, 0.0, 1368.2304147465422, 169, 4292, 1412.0, 2059.2000000000007, 2369.5999999999995, 3238.5600000000004, 3.605190144706019, 10.236002631207324, 1.165349548728215], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503/Service Unavailable", 600, 54.995417048579284, 0.892034135172906], "isController": false}, {"data": ["502/Bad Gateway", 140, 12.832263978001833, 0.20814129820701138], "isController": false}, {"data": ["504/Gateway Time-out", 200, 18.331805682859763, 0.297344711724302], "isController": false}, {"data": ["502/Proxy Error", 151, 13.84051329055912, 0.224495257351848], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 67262, 1091, "503/Service Unavailable", 600, "504/Gateway Time-out", 200, "502/Proxy Error", 151, "502/Bad Gateway", 140, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -77", 485, 36, "503/Service Unavailable", 24, "502/Bad Gateway", 6, "502/Proxy Error", 6, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -78", 487, 47, "503/Service Unavailable", 32, "502/Proxy Error", 8, "502/Bad Gateway", 7, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -79", 491, 49, "503/Service Unavailable", 32, "502/Bad Gateway", 10, "502/Proxy Error", 7, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -80", 488, 46, "503/Service Unavailable", 29, "502/Proxy Error", 11, "502/Bad Gateway", 6, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -78", 488, 39, "503/Service Unavailable", 26, "502/Proxy Error", 8, "502/Bad Gateway", 5, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -77", 484, 42, "503/Service Unavailable", 26, "502/Bad Gateway", 8, "502/Proxy Error", 8, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -80", 484, 35, "503/Service Unavailable", 19, "502/Proxy Error", 9, "502/Bad Gateway", 7, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 487, 45, "503/Service Unavailable", 25, "502/Bad Gateway", 10, "502/Proxy Error", 10, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -80", 482, 43, "503/Service Unavailable", 25, "502/Proxy Error", 10, "502/Bad Gateway", 8, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 200, 200, "504/Gateway Time-out", 200, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -77", 490, 43, "503/Service Unavailable", 32, "502/Bad Gateway", 6, "502/Proxy Error", 5, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -79", 492, 48, "503/Service Unavailable", 37, "502/Proxy Error", 6, "502/Bad Gateway", 5, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -78", 492, 43, "503/Service Unavailable", 27, "502/Bad Gateway", 8, "502/Proxy Error", 8, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -77", 488, 56, "503/Service Unavailable", 40, "502/Bad Gateway", 9, "502/Proxy Error", 7, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 2452, 34, "503/Service Unavailable", 34, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -79", 489, 42, "503/Service Unavailable", 27, "502/Bad Gateway", 8, "502/Proxy Error", 7, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 492, 37, "503/Service Unavailable", 29, "502/Proxy Error", 6, "502/Bad Gateway", 2, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -80", 494, 39, "503/Service Unavailable", 28, "502/Bad Gateway", 6, "502/Proxy Error", 5, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -79", 487, 41, "503/Service Unavailable", 26, "502/Bad Gateway", 8, "502/Proxy Error", 7, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -80", 498, 45, "503/Service Unavailable", 30, "502/Proxy Error", 8, "502/Bad Gateway", 7, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -78", 487, 43, "503/Service Unavailable", 26, "502/Proxy Error", 9, "502/Bad Gateway", 8, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -77", 498, 38, "503/Service Unavailable", 26, "502/Bad Gateway", 6, "502/Proxy Error", 6, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
