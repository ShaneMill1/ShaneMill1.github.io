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

    var data = {"OkPercent": 99.54712804643914, "KoPercent": 0.452871953560861};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4180200121970501, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.31839622641509435, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -80"], "isController": false}, {"data": [0.6216216216216216, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -79"], "isController": false}, {"data": [0.6210629921259843, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -78"], "isController": false}, {"data": [0.47040690505548705, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -77"], "isController": false}, {"data": [0.6422110552763819, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -80"], "isController": false}, {"data": [0.6009852216748769, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79"], "isController": false}, {"data": [0.4708029197080292, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -78"], "isController": false}, {"data": [0.513530135301353, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -79"], "isController": false}, {"data": [0.5964214711729622, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77"], "isController": false}, {"data": [0.625748502994012, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -78"], "isController": false}, {"data": [0.6207414829659319, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -79"], "isController": false}, {"data": [0.6048466864490604, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -80"], "isController": false}, {"data": [0.4742331288343558, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -80"], "isController": false}, {"data": [0.6145418326693227, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.29296875, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -79"], "isController": false}, {"data": [0.29283489096573206, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -78"], "isController": false}, {"data": [0.29323899371069184, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -77"], "isController": false}, {"data": [0.47788697788697787, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -78"], "isController": false}, {"data": [0.4950980392156863, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -77"], "isController": false}, {"data": [0.49510403916768664, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.5061199510403916, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -79"], "isController": false}, {"data": [0.3425925925925926, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -80"], "isController": false}, {"data": [0.6470883534136547, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -77"], "isController": false}, {"data": [0.6145418326693227, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -78"], "isController": false}, {"data": [0.3136645962732919, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}, {"data": [0.2986003110419907, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -79"], "isController": false}, {"data": [0.6101860920666013, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80"], "isController": false}, {"data": [0.31959564541213065, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -78"], "isController": false}, {"data": [0.49938574938574937, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -80"], "isController": false}, {"data": [0.608, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -77"], "isController": false}, {"data": [0.6227634194831014, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77"], "isController": false}, {"data": [0.6333666333666333, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -78"], "isController": false}, {"data": [0.6125370187561698, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78"], "isController": false}, {"data": [0.6290160642570282, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -79"], "isController": false}, {"data": [0.6019607843137255, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79"], "isController": false}, {"data": [0.005894590846047157, 500, 1500, "NDFD_CityLevel1234_Summaries_24hourly_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.5853057199211046, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80"], "isController": false}, {"data": [0.5936254980079682, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79"], "isController": false}, {"data": [0.5897693079237714, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -77"], "isController": false}, {"data": [0.6290160642570282, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -78"], "isController": false}, {"data": [0.6625124626121635, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -79"], "isController": false}, {"data": [0.6221674876847291, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -77"], "isController": false}, {"data": [0.6088031651829872, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.5159118727050184, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -77"], "isController": false}, {"data": [0.6028403525954946, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -79"], "isController": false}, {"data": [0.6286141575274178, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -80"], "isController": false}, {"data": [0.6078528827037774, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -78"], "isController": false}, {"data": [0.4713064713064713, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -79"], "isController": false}, {"data": [0.5822722820763957, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -77"], "isController": false}, {"data": [0.49445129469790383, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -78"], "isController": false}, {"data": [0.5871062992125984, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77"], "isController": false}, {"data": [0.0015981735159817352, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.5982318271119843, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78"], "isController": false}, {"data": [0.5927218344965105, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -79"], "isController": false}, {"data": [0.6114427860696517, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -80"], "isController": false}, {"data": [0.28963893249607536, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -77"], "isController": false}, {"data": [0.5006134969325153, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -77"], "isController": false}, {"data": [0.30125195618153366, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP "], "isController": false}, {"data": [0.5837487537387837, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -80"], "isController": false}, {"data": [0.3330745341614907, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -78"], "isController": false}, {"data": [0.6290160642570282, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -80"], "isController": false}, {"data": [0.5134638922888617, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -79"], "isController": false}, {"data": [0.0442505453412278, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.5227272727272727, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -78"], "isController": false}, {"data": [0.28448275862068967, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST"], "isController": false}, {"data": [0.29205607476635514, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -79"], "isController": false}, {"data": [0.32888540031397173, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -78"], "isController": false}, {"data": [0.5122549019607843, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -80"], "isController": false}, {"data": [0.31375579598145287, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -77"], "isController": false}, {"data": [0.6570289132602194, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -77"], "isController": false}, {"data": [0.653692614770459, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -80"], "isController": false}, {"data": [0.6302605210420842, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -78"], "isController": false}, {"data": [0.6319721115537849, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -79"], "isController": false}, {"data": [0.30625, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -80"], "isController": false}, {"data": [0.35371517027863775, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -80"], "isController": false}, {"data": [0.29937791601866254, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -79"], "isController": false}, {"data": [0.4920245398773006, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -80"], "isController": false}, {"data": [0.5191122071516646, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -79"], "isController": false}, {"data": [0.3299531981279251, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -78"], "isController": false}, {"data": [0.49325980392156865, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -78"], "isController": false}, {"data": [0.4920440636474908, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -77"], "isController": false}, {"data": [0.6124260355029586, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80"], "isController": false}, {"data": [0.30124223602484473, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -77"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 88546, 401, 0.452871953560861, 2819.6530278047453, 121, 61058, 7707.5, 10504.700000000004, 24094.900000000016, 60061.0, 34.30983549134059, 1660.6981719264138, 13.384642321485863], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -80", 636, 0, 0.0, 1351.1022012578621, 181, 2707, 1520.0, 2008.5000000000005, 2211.2499999999995, 2534.43, 3.543274185910471, 10.124574761831806, 1.138415241371626], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -79", 999, 0, 0.0, 897.4944944944947, 134, 2598, 1020.0, 1469.0, 1592.0, 1916.0, 5.58362583558765, 45.75852700254589, 1.9738989770339155], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -78", 1016, 0, 0.0, 830.8031496062994, 127, 1973, 862.5, 1368.3000000000002, 1466.15, 1737.4900000000002, 5.651917535407928, 55.43340269877672, 2.147066329368832], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -77", 811, 0, 0.0, 1115.3353884093704, 143, 4037, 1135.0, 1730.0, 1983.6, 2535.3599999999997, 4.521077923091503, 12.844353939846249, 1.4260821964439019], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -80", 995, 0, 0.0, 855.464321608039, 137, 2282, 965.0, 1464.4, 1605.3999999999999, 2013.5199999999995, 5.525168670350113, 44.07270459956409, 1.9532334557292388], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79", 1015, 0, 0.0, 860.2778325123151, 131, 2000, 919.0, 1350.8, 1501.0, 1875.5600000000004, 5.640110912920022, 54.23364732497596, 2.1425811964120003], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -78", 822, 0, 0.0, 1102.0182481751842, 150, 4097, 1071.0, 1808.7000000000005, 2090.7499999999986, 3536.209999999997, 4.57520705316591, 12.382369398571779, 1.4431561310279188], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -79", 813, 0, 0.0, 1054.8154981549815, 146, 3658, 1116.0, 1653.4, 1871.9999999999995, 2336.8, 4.5181476150516, 12.838078479543295, 1.4251578902945965], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77", 1006, 0, 0.0, 866.0337972166996, 131, 2006, 905.0, 1405.9, 1553.65, 1857.2499999999986, 5.602708904185881, 56.77401065858283, 2.128372816140925], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 1002, 0, 0.0, 886.9011976047899, 132, 2167, 1014.0, 1432.9000000000003, 1570.6999999999998, 1931.4600000000005, 5.579064587973274, 43.83128958449332, 1.9722865047327396], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -79", 998, 0, 0.0, 870.3476953907812, 133, 1917, 974.5, 1465.2, 1581.1, 1778.1299999999999, 5.540535288990546, 43.50966609669844, 1.9586657955220483], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -80", 1011, 0, 0.0, 865.1938674579621, 134, 1958, 908.0, 1438.0000000000005, 1580.4, 1772.52, 5.623414764383927, 55.47001997014473, 2.1362386165481912], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -80", 815, 0, 0.0, 1097.4773006134956, 155, 2625, 1137.0, 1689.0, 1962.999999999999, 2343.880000000001, 4.534958128147345, 12.859602573866956, 1.4304604251871018], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -77", 1004, 0, 0.0, 901.5697211155383, 130, 2084, 1018.5, 1454.5, 1580.5, 1880.5500000000004, 5.602897434609611, 45.296013324320704, 1.980711788406913], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 1976, 0, 0.0, 8966.00556680163, 2039, 17506, 9035.5, 10071.3, 10398.499999999998, 11083.23, 10.821941815632668, 4299.280593823935, 3.9314085502103047], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -79", 640, 0, 0.0, 1390.9218749999998, 156, 2723, 1576.0, 2041.2999999999997, 2193.6499999999996, 2541.6600000000026, 3.5536208064498216, 10.557869448161556, 1.141739497384757], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -78", 642, 0, 0.0, 1395.1604361370703, 153, 2904, 1577.0, 2068.2000000000003, 2268.9500000000003, 2630.230000000002, 3.5777776539363915, 10.479745954101904, 1.1495008282666725], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 636, 0, 0.0, 1406.6006289308177, 172, 3395, 1592.0, 2056.5000000000005, 2295.9999999999986, 2641.97, 3.5497608376542553, 10.540761639280671, 1.1404993316291505], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -78", 814, 0, 0.0, 1123.8611793611813, 147, 4297, 1100.5, 1836.5, 2249.75, 2791.0, 4.523679852396883, 12.95809248605106, 1.426902922191595], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -77", 816, 0, 0.0, 1064.874999999998, 160, 2753, 1094.0, 1658.5000000000005, 2028.35, 2372.66, 4.544340736450513, 12.578993422957831, 1.4334199783921053], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -80", 817, 0, 0.0, 1073.198286413708, 145, 4332, 1066.0, 1731.6000000000001, 2003.1999999999998, 2649.139999999995, 4.543937708565073, 12.565171153712457, 1.4332928514321468], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 1941, 0, 0.0, 9238.727460072136, 4517, 16869, 9379.0, 10279.8, 10570.599999999999, 11065.079999999998, 10.50802312739557, 4174.568979372388, 3.8173677767491716], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 817, 0, 0.0, 1051.5471236230112, 156, 3706, 1085.0, 1706.0000000000005, 2007.3999999999996, 2362.4399999999973, 4.526742130837808, 12.766345852171673, 1.4278688557232537], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -80", 648, 0, 0.0, 1315.4675925925917, 162, 3013, 1466.5, 1983.0, 2075.1, 2518.83, 3.587622701679207, 10.396997113430885, 1.1526639344262295], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 996, 0, 0.0, 838.1485943775108, 131, 2257, 928.0, 1474.3000000000002, 1585.75, 1836.5099999999995, 5.528296441020403, 45.13595945915944, 1.9543391715326037], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -78", 1004, 0, 0.0, 911.624501992032, 134, 2654, 1033.0, 1448.0, 1594.25, 2020.3000000000015, 5.578149654421406, 45.729893277607395, 1.9719630614263173], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -77", 644, 0, 0.0, 1371.257763975156, 166, 3518, 1502.0, 2105.0, 2264.0, 2680.4999999999986, 3.582554517133956, 11.061037111982644, 1.151035582165109], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 2200, 0, 0.0, 8222.211363636372, 4412, 14306, 7148.0, 12065.7, 13208.049999999988, 13441.99, 11.833555660742716, 692.3785682204484, 4.206459238779638], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -79", 643, 0, 0.0, 1364.2737169517884, 144, 3121, 1573.0, 1975.4, 2157.999999999999, 2565.399999999995, 3.5614981555538323, 10.539937339718735, 1.14427040349337], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80", 1021, 0, 0.0, 873.3486777668959, 124, 2100, 931.0, 1482.0000000000005, 1623.8, 1953.6799999999998, 5.685361724875268, 56.69686935326922, 2.1597712021254676], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -78", 643, 0, 0.0, 1362.0155520995356, 157, 3588, 1552.0, 2067.6000000000004, 2325.2, 2943.4399999999905, 3.57762841627348, 10.358974959730816, 1.149452879837866], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -80", 814, 0, 0.0, 1094.9705159705168, 135, 5937, 1115.0, 1740.5, 1999.25, 2780.850000000001, 4.521493759338773, 12.673142677707482, 1.4262133635414294], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -77", 1000, 0, 0.0, 910.0609999999996, 132, 2546, 1016.0, 1406.9, 1552.7499999999995, 1968.5100000000004, 5.569727417540186, 45.59521370695993, 1.9689856690913548], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77", 1006, 0, 0.0, 827.6560636182909, 125, 2437, 879.0, 1353.3000000000002, 1472.65, 1770.739999999999, 5.593301382201514, 52.30859965743809, 2.1247990602308486], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -78", 1001, 0, 0.0, 878.9410589410589, 122, 1784, 1012.0, 1427.0, 1503.6999999999998, 1645.96, 5.58160801610358, 43.19459563138804, 1.9731856463178672], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 1013, 0, 0.0, 873.9526159921018, 136, 2345, 943.0, 1416.0, 1590.6, 1952.760000000001, 5.613587875093514, 53.966557625169706, 2.1325055502064223], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -79", 996, 0, 0.0, 872.2008032128513, 130, 2059, 995.5, 1446.3000000000002, 1571.1999999999998, 1842.4499999999996, 5.5551837226423935, 44.50746286086384, 1.9638442456997522], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79", 1020, 0, 0.0, 858.4568627450977, 131, 2077, 897.0, 1357.5, 1502.85, 1911.539999999999, 5.690122616563835, 55.82809043912963, 2.161579783050129], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 1442, 100, 6.934812760055478, 12274.366851595003, 1249, 61058, 5622.5, 20816.100000000002, 60164.7, 60539.85999999999, 7.810891915022696, 1375.4870910555267, 2.6926219199248163], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 300, 300, 100.0, 60056.56333333332, 60037, 60158, 60059.0, 60065.0, 60068.0, 60096.89, 1.5784156915565284, 0.5934473059074838, 0.6813083356132671], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 1014, 0, 0.0, 892.3648915187373, 132, 2172, 946.0, 1416.5, 1573.25, 1897.3500000000004, 5.616857218824781, 56.94775360331916, 2.133747517698086], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 1004, 0, 0.0, 894.4233067729085, 142, 2277, 952.5, 1409.5, 1543.5, 1856.5500000000013, 5.565101712765368, 55.71196770550413, 2.114086490493875], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -77", 997, 0, 0.0, 955.6810431293884, 122, 2315, 1073.0, 1447.8000000000002, 1543.1999999999998, 1802.06, 5.566287392386972, 45.852241144257285, 1.9677695664493005], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -78", 996, 0, 0.0, 864.4799196787154, 137, 2113, 967.0, 1406.6000000000001, 1512.3, 1823.1499999999999, 5.554130466301596, 44.42625834025741, 1.9634719031261503], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 1003, 0, 0.0, 819.7846460618154, 130, 1946, 903.0, 1424.8000000000002, 1541.5999999999997, 1745.4400000000005, 5.561963489563694, 43.19978004111861, 1.9662409992402903], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -77", 1015, 0, 0.0, 828.6029556650249, 132, 2062, 847.0, 1411.7999999999997, 1602.1999999999998, 1834.8400000000001, 5.646574504186253, 55.09175031640288, 2.145036603641067], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78", 1011, 0, 0.0, 849.1008902077153, 137, 2122, 901.0, 1376.8000000000002, 1509.1999999999998, 1710.1999999999998, 5.620257386663702, 57.14325189530812, 2.1350391830197073], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 1975, 0, 0.0, 8890.252151898752, 1920, 10805, 8878.0, 10062.2, 10246.4, 10606.12, 10.91793581912159, 2609.567915563932, 4.4354114265181455], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -77", 817, 0, 0.0, 1047.4810281517775, 149, 4439, 1081.0, 1643.2, 1876.5999999999985, 2858.1599999999944, 4.567614106491938, 12.940665174528144, 1.440761090231344], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -79", 1021, 0, 0.0, 870.8638589618024, 144, 1999, 921.0, 1378.8000000000002, 1504.3999999999996, 1852.0, 5.677521242048134, 55.6525826014002, 2.1567927374577383], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 1003, 0, 0.0, 877.0897308075781, 126, 2072, 982.0, 1440.0, 1540.7999999999997, 1759.5200000000004, 5.582674228973133, 46.777209492563856, 1.9735625692268302], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -78", 1006, 0, 0.0, 854.8091451292241, 130, 2230, 884.5, 1364.3000000000002, 1479.65, 1822.7199999999998, 5.596568624723926, 54.4427631249548, 2.1260402295093823], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -79", 819, 0, 0.0, 1113.042735042736, 150, 4073, 1104.0, 1773.0, 2074.0, 2847.5999999999954, 4.556809899238306, 12.692910907481181, 1.4373531225136453], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -77", 1021, 0, 0.0, 876.6542605288935, 136, 2065, 907.0, 1434.0, 1588.6999999999998, 1836.3799999999994, 5.652000620003985, 55.96816113460729, 2.147097891778858], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -78", 811, 0, 0.0, 1068.6633785450072, 150, 2901, 1108.0, 1746.0, 1927.6, 2347.72, 4.518986989106511, 12.675461832738973, 1.4254226537904326], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 1016, 0, 0.0, 883.123031496063, 130, 5498, 939.5, 1392.0, 1516.6499999999996, 1795.9800000000002, 5.637428977272727, 55.00777201219039, 2.1415623751553623], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 2190, 0, 0.0, 8346.859817351618, 647, 43634, 8081.0, 8588.0, 8943.9, 24212.040000000008, 11.658175894725074, 972.0801097844834, 4.371815960521903], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78", 1018, 0, 0.0, 892.5137524557957, 133, 2084, 964.5, 1383.0, 1485.0, 1662.8699999999985, 5.6319638846166615, 57.0568664369115, 2.139486280386603], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -79", 1003, 0, 0.0, 894.8763708873374, 129, 2053, 946.0, 1432.6, 1569.5999999999995, 1891.96, 5.586467714895205, 54.10052143382292, 2.1222030674748384], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -80", 1005, 0, 0.0, 906.3253731343281, 146, 2165, 1024.0, 1444.8, 1570.4999999999995, 1775.3399999999992, 5.575682258234534, 45.3453553058442, 1.9710907983211925], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -77", 637, 0, 0.0, 1384.2543171114592, 155, 2560, 1573.0, 2007.0, 2121.2, 2426.54, 3.545724257318275, 10.54447019045048, 1.1392024225172972], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -77", 815, 0, 0.0, 1036.3938650306739, 160, 3011, 1036.0, 1678.1999999999998, 1920.7999999999997, 2390.000000000002, 4.530470891029667, 12.52394326940181, 1.4290450173853346], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -79", 639, 0, 0.0, 1375.7511737089205, 154, 3343, 1558.0, 2001.0, 2153.0, 2649.200000000001, 3.5629255019598878, 10.64522114427618, 1.1447289942820342], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 3219, 0, 0.0, 5488.545200372781, 2255, 14342, 5010.0, 8262.0, 8912.0, 10367.600000000004, 17.461540130622517, 322.5316332340871, 20.991363184371405], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -80", 1003, 0, 0.0, 891.349950149551, 136, 2205, 937.0, 1407.6000000000001, 1564.0, 2024.0, 5.576838605289934, 54.405034193234954, 2.118545134236118], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -78", 644, 0, 0.0, 1335.156832298137, 156, 2928, 1530.5, 2024.0, 2314.75, 2638.949999999999, 3.569112765120236, 9.850163682476431, 1.1467168942622632], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -80", 996, 0, 0.0, 875.0371485943773, 121, 2108, 997.0, 1440.0, 1543.75, 1859.109999999999, 5.5435581183071, 43.82179366073814, 1.9597344129171583], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -79", 817, 0, 0.0, 1070.89840881273, 153, 3854, 1088.0, 1861.8000000000002, 2108.4999999999995, 2738.599999999995, 4.559228112077769, 12.327471433324776, 1.4381158986339058], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 3209, 0, 0.0, 5610.946400747906, 375, 8296, 5975.0, 6552.0, 7093.5, 8018.1, 17.33826087896176, 1093.2924853071881, 9.651180372078322], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 814, 0, 0.0, 1069.3562653562624, 160, 4282, 1098.0, 1673.5, 2030.25, 3198.550000000001, 4.514572529879926, 12.477999518177532, 1.4240302022961093], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -80", 638, 0, 0.0, 1420.343260188088, 151, 2905, 1626.5, 2063.2, 2338.25, 2632.44, 3.5473611636234237, 10.536462793018703, 1.1397283426094789], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 701, 1, 0.14265335235378032, 26369.94293865903, 4737, 32097, 26602.0, 29167.0, 29969.5, 31254.700000000004, 3.661683434147157, 5157.1574376557255, 2.0924663213923798], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 642, 0, 0.0, 1404.0887850467286, 160, 2789, 1582.0, 2037.2000000000003, 2206.300000000001, 2589.8400000000006, 3.5704354596518546, 10.717313153467549, 1.147141861548301], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -78", 637, 0, 0.0, 1358.136577708005, 177, 2815, 1514.0, 2028.0, 2202.8, 2600.48, 3.552665335579079, 10.367410630876957, 1.1414325150444502], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -80", 816, 0, 0.0, 1048.3039215686285, 152, 4043, 1085.0, 1624.0, 1869.0499999999997, 2549.240000000001, 4.522730044007937, 12.767982840230127, 1.4266033244282847], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -77", 647, 0, 0.0, 1355.004636785162, 174, 3545, 1547.0, 1972.6000000000001, 2084.0, 2480.0399999999995, 3.5880656610470276, 10.791584275524068, 1.1528062524262424], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -77", 1003, 0, 0.0, 845.3010967098697, 136, 1997, 987.0, 1422.6, 1531.8, 1756.7200000000003, 5.57730376565315, 44.94868436554694, 1.971664026529727], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -80", 1002, 0, 0.0, 824.6257485029953, 134, 2073, 922.5, 1400.7, 1513.3999999999996, 1730.8200000000002, 5.571030640668524, 43.471221510669466, 1.9694463788300836], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -78", 998, 0, 0.0, 868.4198396793582, 137, 2354, 982.5, 1437.3000000000002, 1582.1499999999999, 2130.29, 5.56075599536418, 44.785548459509, 1.965814131173665], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -79", 1004, 0, 0.0, 874.2500000000006, 134, 2493, 1002.5, 1463.0, 1594.75, 1918.9, 5.584634467874445, 44.4074521704426, 1.9742555443071772], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -80", 640, 0, 0.0, 1365.471875, 158, 2756, 1555.0, 2022.3999999999999, 2126.7999999999997, 2533.650000000001, 3.558105531186239, 10.601662528284159, 1.1431803903908913], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 646, 0, 0.0, 1293.3343653250774, 151, 2959, 1466.5, 2019.5000000000005, 2109.0, 2628.899999999999, 3.6005707406251393, 10.278160288101397, 1.1568239977203818], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -79", 643, 0, 0.0, 1391.1135303265953, 156, 2659, 1563.0, 2031.8000000000002, 2190.6, 2449.0, 3.5743271037388684, 10.882553363022113, 1.1483922042286012], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -80", 815, 0, 0.0, 1077.4098159509206, 152, 2839, 1138.0, 1708.4, 1958.1999999999985, 2423.7200000000003, 4.545708070723409, 12.786988128520832, 1.4338512762145128], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -79", 811, 0, 0.0, 1023.6609124537608, 149, 3658, 1013.0, 1654.200000000001, 2002.0, 2667.9199999999996, 4.519339541156081, 12.499870481705313, 1.4255338591732563], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 641, 0, 0.0, 1348.0093603744142, 166, 2804, 1454.0, 2023.8000000000004, 2232.8, 2559.1800000000007, 3.578266913033042, 10.464238133732842, 1.149658021863155], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -78", 816, 0, 0.0, 1101.8259803921553, 153, 3661, 1117.0, 1706.200000000001, 2160.45, 2694.260000000001, 4.557309846805136, 13.190054062205046, 1.4375108208184169], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -77", 817, 0, 0.0, 1096.396572827415, 142, 3857, 1128.0, 1704.4, 1953.6999999999994, 2799.659999999996, 4.535260680344614, 12.379934377151056, 1.4305558591321388], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80", 1014, 0, 0.0, 865.1587771203154, 121, 2227, 915.5, 1444.5, 1586.5, 1884.7000000000005, 5.637373450973198, 54.65581496600341, 2.141541281668529], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -77", 644, 0, 0.0, 1382.399068322982, 171, 2703, 1532.0, 2044.0, 2185.75, 2528.3499999999995, 3.570933488591311, 10.812435886772574, 1.1473018727993567], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 400, 99.75062344139651, 0.45174259706819053], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 1, 0.24937655860349128, 0.0011293564926704764], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 88546, 401, "504/Gateway Time-out", 400, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 1442, 100, "504/Gateway Time-out", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 300, 300, "504/Gateway Time-out", 300, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 701, 1, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
