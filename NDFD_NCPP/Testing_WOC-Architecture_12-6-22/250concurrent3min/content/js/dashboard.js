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

    var data = {"OkPercent": 99.23213904124225, "KoPercent": 0.7678609587577463};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.34929126006125794, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.10698198198198199, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -80"], "isController": false}, {"data": [0.07617728531855955, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -79"], "isController": false}, {"data": [0.1328976034858388, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -78"], "isController": false}, {"data": [0.08004158004158005, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -77"], "isController": false}, {"data": [0.049723756906077346, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -80"], "isController": false}, {"data": [0.15108695652173912, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79"], "isController": false}, {"data": [0.07796257796257797, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -78"], "isController": false}, {"data": [0.07780082987551867, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -79"], "isController": false}, {"data": [0.15359477124183007, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77"], "isController": false}, {"data": [0.062326869806094184, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -78"], "isController": false}, {"data": [0.07756232686980609, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -79"], "isController": false}, {"data": [0.11546840958605664, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -80"], "isController": false}, {"data": [0.07380457380457381, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -80"], "isController": false}, {"data": [0.055401662049861494, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.09706546275395034, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -79"], "isController": false}, {"data": [0.08783783783783784, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -78"], "isController": false}, {"data": [0.12274774774774774, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -77"], "isController": false}, {"data": [0.07780082987551867, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -78"], "isController": false}, {"data": [0.08835758835758836, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -77"], "isController": false}, {"data": [0.0945945945945946, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.07780082987551867, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -79"], "isController": false}, {"data": [0.11824324324324324, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -80"], "isController": false}, {"data": [0.055248618784530384, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -77"], "isController": false}, {"data": [0.05124653739612189, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -78"], "isController": false}, {"data": [0.08108108108108109, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -77"], "isController": false}, {"data": [0.48552154112174567, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}, {"data": [0.11373873873873874, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -79"], "isController": false}, {"data": [0.14270152505446623, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80"], "isController": false}, {"data": [0.1072234762979684, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -78"], "isController": false}, {"data": [0.07883817427385892, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -80"], "isController": false}, {"data": [0.07202216066481995, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -77"], "isController": false}, {"data": [0.16013071895424835, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77"], "isController": false}, {"data": [0.09556786703601108, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -78"], "isController": false}, {"data": [0.12717391304347825, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78"], "isController": false}, {"data": [0.062154696132596686, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -79"], "isController": false}, {"data": [0.13152173913043477, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79"], "isController": false}, {"data": [0.004945598417408506, 500, 1500, "NDFD_CityLevel1234_Summaries_24hourly_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.09347826086956522, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80"], "isController": false}, {"data": [0.13804347826086957, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79"], "isController": false}, {"data": [0.09833795013850416, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -77"], "isController": false}, {"data": [0.04834254143646409, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -78"], "isController": false}, {"data": [0.055401662049861494, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -79"], "isController": false}, {"data": [0.13398692810457516, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -77"], "isController": false}, {"data": [0.10326086956521739, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78"], "isController": false}, {"data": [0.01099537037037037, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.07172557172557173, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -77"], "isController": false}, {"data": [0.14705882352941177, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -79"], "isController": false}, {"data": [0.06925207756232687, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -80"], "isController": false}, {"data": [0.1514161220043573, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -78"], "isController": false}, {"data": [0.11642411642411643, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -79"], "isController": false}, {"data": [0.10108695652173913, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -77"], "isController": false}, {"data": [0.07796257796257797, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -78"], "isController": false}, {"data": [0.12608695652173912, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77"], "isController": false}, {"data": [0.5828091815062898, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.11956521739130435, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78"], "isController": false}, {"data": [0.1437908496732026, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -79"], "isController": false}, {"data": [0.07617728531855955, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -80"], "isController": false}, {"data": [0.13318284424379231, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -77"], "isController": false}, {"data": [0.0912863070539419, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -77"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP "], "isController": false}, {"data": [0.15760869565217392, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -80"], "isController": false}, {"data": [0.08108108108108109, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -78"], "isController": false}, {"data": [0.05955678670360111, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -80"], "isController": false}, {"data": [0.0945945945945946, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -79"], "isController": false}, {"data": [0.532586843704708, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.09439834024896265, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -78"], "isController": false}, {"data": [0.09706546275395034, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST"], "isController": false}, {"data": [0.11486486486486487, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -79"], "isController": false}, {"data": [0.10585585585585586, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -78"], "isController": false}, {"data": [0.0975103734439834, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -80"], "isController": false}, {"data": [0.11173814898419865, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -77"], "isController": false}, {"data": [0.04986149584487535, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -77"], "isController": false}, {"data": [0.0664819944598338, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -80"], "isController": false}, {"data": [0.06509695290858726, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -78"], "isController": false}, {"data": [0.060941828254847646, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -79"], "isController": false}, {"data": [0.0744920993227991, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -80"], "isController": false}, {"data": [0.10496613995485328, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -79"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -80"], "isController": false}, {"data": [0.08212058212058213, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -80"], "isController": false}, {"data": [0.09875259875259876, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -79"], "isController": false}, {"data": [0.10585585585585586, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -78"], "isController": false}, {"data": [0.08108108108108109, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -78"], "isController": false}, {"data": [0.09439834024896265, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -77"], "isController": false}, {"data": [0.09259259259259259, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80"], "isController": false}, {"data": [0.09346846846846847, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -77"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 140390, 1078, 0.7678609587577463, 4644.838742075731, 1, 90208, 659.0, 7813.700000000004, 45589.50000000001, 90002.0, 48.19145591128845, 4373.345141079251, 20.38059064676751], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -80", 444, 7, 1.5765765765765767, 4572.538288288287, 2, 20287, 3644.5, 9458.5, 11481.0, 17306.45000000003, 2.3693647540983607, 5.818111648976477, 0.7681924788678279], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -79", 361, 0, 0.0, 6258.024930747927, 158, 24493, 5701.0, 11699.8, 14321.899999999998, 20270.259999999995, 1.9216540064622933, 16.69150487366855, 0.6849645628503293], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -78", 459, 0, 0.0, 4665.997821350761, 104, 24608, 4326.0, 8585.0, 10874.0, 16237.399999999992, 2.458634413382685, 24.475369339181743, 0.941195986373059], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -77", 481, 3, 0.6237006237006237, 4338.407484407486, 3, 51413, 3585.0, 7537.800000000003, 9313.0, 26738.740000000074, 2.618200028304865, 7.334520513202587, 0.8335285246361192], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -80", 362, 0, 0.0, 6835.842541436462, 154, 26080, 5932.0, 13489.3, 16404.6, 22989.24, 1.945723975941822, 16.515122738163065, 0.6935441906433252], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79", 460, 0, 0.0, 4722.204347826087, 117, 24171, 4270.0, 9049.200000000003, 11600.3, 16686.809999999994, 2.450510345415415, 24.562318792084852, 0.9380859916043385], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -78", 481, 0, 0.0, 4951.340956340962, 63, 65571, 3928.0, 8009.600000000002, 10176.999999999998, 40923.32000000005, 2.5406852983588544, 7.06573420721111, 0.8088509836572135], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -79", 482, 3, 0.6224066390041494, 4635.7572614107885, 3, 46491, 3913.0, 7660.199999999999, 9483.04999999999, 35385.37000000011, 2.630530526706434, 7.313700742360819, 0.8374540544006811], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77", 459, 0, 0.0, 4972.041394335512, 75, 28093, 4315.0, 9468.0, 12134.0, 21434.799999999905, 2.461099612872784, 23.234560445397367, 0.9421396955528627], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 361, 0, 0.0, 6360.423822714677, 124, 33883, 5543.0, 12363.0, 14975.399999999994, 21729.439999999988, 1.9181823495342696, 15.346693775604546, 0.6837271070117269], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -79", 361, 0, 0.0, 5836.282548476456, 98, 25280, 5288.0, 10230.400000000001, 12456.999999999978, 18770.339999999982, 1.913677759989822, 15.488632651397886, 0.6821214671838721], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -80", 459, 0, 0.0, 5082.37908496732, 193, 28635, 4398.0, 9725.0, 12163.0, 21559.199999999957, 2.449894585145846, 23.18184395932855, 0.9378502708761443], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -80", 481, 0, 0.0, 4830.220374220374, 78, 60654, 3931.0, 7187.6, 9433.799999999994, 35626.06000000003, 2.5417996575704414, 6.988509263895348, 0.8092057503593397], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -77", 361, 0, 0.0, 6426.418282548474, 149, 26068, 5647.0, 11722.600000000002, 14313.799999999992, 22692.859999999986, 1.912309232586597, 16.71199268846311, 0.6816336620059648], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 4022, 0, 0.0, 11408.971904525104, 2707, 20777, 11465.0, 13098.7, 14496.349999999995, 16708.54, 21.147607354866526, 9386.751453216111, 7.744485115307565], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -79", 443, 3, 0.6772009029345373, 5374.6862302483105, 2, 21089, 4819.0, 10450.000000000004, 12697.39999999998, 16996.96, 2.3927967635128202, 6.857706405727588, 0.7757895756701721], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -78", 444, 3, 0.6756756756756757, 5280.333333333333, 1, 32082, 4767.5, 9936.5, 11894.75, 20789.25000000003, 2.3665485169096288, 6.707084238333821, 0.7672794019667937], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 444, 3, 0.6756756756756757, 4829.927927927925, 2, 27044, 4315.5, 9104.0, 12400.5, 16388.900000000005, 2.369213037074982, 6.627883059459777, 0.7681432893641544], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -78", 482, 2, 0.4149377593360996, 4484.336099585063, 2, 60753, 3730.5, 7379.5, 9338.999999999995, 27745.500000000335, 2.6327001015938216, 6.601326096366655, 0.8381447589058455], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -77", 481, 3, 0.6237006237006237, 4450.638253638256, 3, 65575, 3475.0, 7866.6, 10062.5, 21542.240000000063, 2.6160213632680143, 6.825203475882024, 0.8328349261966531], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -80", 481, 1, 0.2079002079002079, 4270.904365904365, 3, 59400, 3749.0, 7167.8, 9007.699999999999, 18727.64000000011, 2.540068122409104, 7.112339265439759, 0.8086544999075859], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 4134, 0, 0.0, 11050.639574262217, 4855, 20390, 11103.5, 12525.5, 12892.25, 13690.050000000001, 21.642052801583105, 9606.338012658887, 7.9255564458922505], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 482, 3, 0.6224066390041494, 4637.217842323654, 4, 49293, 3837.5, 7864.0, 10226.899999999994, 28839.32000000003, 2.258732672896145, 5.89605432761699, 0.7190887220352962], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -80", 444, 1, 0.22522522522522523, 4770.558558558554, 3, 32750, 4195.5, 9087.0, 11762.5, 18290.250000000044, 2.3887920459681062, 6.467475195770654, 0.774491171153722], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 362, 0, 0.0, 6214.848066298343, 114, 26051, 5705.5, 11190.5, 14539.549999999996, 20999.75, 1.9314289372872493, 16.230145080591807, 0.6884487911228966], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -78", 361, 0, 0.0, 6207.778393351802, 162, 21745, 5315.0, 11512.400000000003, 13790.699999999997, 18835.539999999997, 1.9319896817836386, 16.825443218702837, 0.6886486658701445], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -77", 444, 3, 0.6756756756756757, 5503.146396396403, 2, 23251, 4773.0, 10315.5, 12466.5, 18208.50000000001, 2.401194107339866, 6.626732956389124, 0.7785121519890973], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 41061, 0, 0.0, 1067.8949611553555, 422, 9402, 909.0, 1120.0, 1239.0, 7534.0, 227.21160709839143, 17670.067297253787, 81.43228496592738], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -79", 444, 4, 0.9009009009009009, 4909.740990990997, 2, 20356, 4372.5, 9484.0, 12239.5, 17858.800000000014, 2.3660440702352723, 6.587210822386827, 0.7671158508965922], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80", 459, 0, 0.0, 4730.736383442269, 148, 24701, 3959.0, 9613.0, 12162.0, 20048.999999999985, 2.495080505756624, 26.402972106671488, 0.9551480061099575], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -78", 443, 3, 0.6772009029345373, 5194.792325056429, 2, 28340, 4428.0, 10296.0, 13137.399999999996, 18696.2, 2.368933284849522, 6.432443039320015, 0.768052588447306], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -80", 482, 0, 0.0, 4664.765560165973, 72, 60741, 3613.0, 7654.999999999998, 9447.199999999993, 39433.45000000003, 2.607801763782936, 7.040380011361791, 0.830218139641833], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -77", 361, 0, 0.0, 6058.7728531855955, 141, 23667, 5500.0, 11900.400000000001, 14337.799999999997, 19916.939999999995, 1.9150380885691853, 15.389412352526152, 0.6826063499294459], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77", 459, 0, 0.0, 4898.840958605665, 100, 27765, 4478.0, 9957.0, 11614.0, 18098.799999999996, 2.457147139752251, 23.47034100611878, 0.9406266394364087], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -78", 361, 0, 0.0, 5659.6011080332355, 118, 24522, 5110.0, 10868.800000000001, 12943.799999999996, 17700.059999999994, 1.9306258222540726, 16.181494286336946, 0.6881625245339223], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 460, 0, 0.0, 4834.5456521739125, 111, 29681, 4346.0, 9258.000000000002, 10349.55, 18215.949999999968, 2.4462750144915204, 25.012061033232115, 0.9364646539850352], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -79", 362, 0, 0.0, 6440.4530386740325, 142, 30523, 5686.5, 12366.5, 14352.349999999995, 24751.60000000001, 1.9164390233572624, 16.301167631503716, 0.6831057065677741], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79", 460, 0, 0.0, 4929.2869565217425, 125, 24597, 4137.0, 9655.400000000005, 12010.899999999998, 17932.579999999987, 2.4359374917257557, 24.199149349776793, 0.9325073210512659], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 1011, 0, 0.0, 46660.50741839758, 978, 54137, 47365.0, 52144.0, 52684.2, 53558.72, 5.17511440534813, 3465.1022797729042, 1.799160867484311], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 500, 500, 100.0, 90002.38400000002, 90001, 90011, 90002.0, 90003.0, 90004.0, 90004.0, 2.6320915125577087, 0.7505573453777841, 1.1438288311408011], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 460, 0, 0.0, 4899.58695652174, 88, 20252, 4511.0, 9055.200000000003, 10577.9, 16226.979999999998, 2.4800383866811155, 23.806336211660494, 0.9493896949013646], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 460, 0, 0.0, 4823.04782608696, 117, 25309, 4367.0, 8790.2, 10975.9, 17504.909999999993, 2.4466783681719058, 25.563384261475456, 0.9366190628158078], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -77", 361, 0, 0.0, 5927.0221606648265, 135, 23922, 5516.0, 11067.400000000001, 13893.199999999992, 22729.059999999998, 1.9291710977036987, 16.447928746252543, 0.6876439947869628], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -78", 362, 0, 0.0, 6395.624309392267, 115, 27384, 5748.0, 11438.499999999998, 14310.949999999983, 21916.220000000005, 1.9170378058919788, 16.3081795074881, 0.6833191397954806], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 361, 0, 0.0, 6327.204986149584, 102, 24776, 5374.0, 12073.000000000002, 14413.699999999993, 19164.479999999996, 1.9177339927646713, 15.837781816588134, 0.6835672923428759], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -77", 459, 0, 0.0, 4579.117647058827, 137, 21273, 4242.0, 8769.0, 10175.0, 17573.199999999993, 2.473086994471923, 24.563973825485725, 0.946728615071283], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78", 460, 0, 0.0, 4905.254347826086, 122, 21487, 4318.0, 10052.900000000001, 11579.449999999995, 16457.279999999988, 2.4488666006537407, 24.655788258882463, 0.9374567455627602], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 2592, 63, 2.4305555555555554, 18807.1161265432, 783, 90005, 17535.0, 27575.300000000003, 29275.4, 90002.0, 9.669476982765053, 2436.486354646581, 3.956553570096247], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -77", 481, 2, 0.4158004158004158, 4630.985446985444, 4, 56842, 3926.0, 7616.2, 9316.5, 26146.88, 2.619397701900561, 6.945607335402713, 0.8339098152534989], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -79", 459, 0, 0.0, 4834.150326797383, 120, 26879, 4209.0, 8643.0, 10843.0, 21637.999999999996, 2.445274334208802, 23.98125327135353, 0.936081581064307], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 361, 0, 0.0, 6075.196675900272, 123, 25582, 5868.0, 10627.400000000001, 13490.799999999996, 18776.539999999997, 1.948865231380509, 16.665232333685136, 0.6946638764198104], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -78", 459, 0, 0.0, 4639.4291938997785, 87, 23679, 4442.0, 8384.0, 10886.0, 13399.19999999999, 2.4624859842164843, 25.518035974626738, 0.9426704158328729], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -79", 481, 0, 0.0, 4510.787941787942, 101, 60588, 3455.0, 7665.6, 9757.199999999993, 34880.88000000012, 2.540121777979626, 6.6946316740907585, 0.8086715816614826], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -77", 460, 0, 0.0, 5069.915217391307, 123, 25536, 4949.0, 9411.8, 11862.099999999999, 15166.869999999997, 2.467241998895105, 24.907400904700093, 0.9444910777020322], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -78", 481, 1, 0.2079002079002079, 4791.361746361744, 121, 65126, 3619.0, 7725.4, 9630.599999999999, 36833.280000000035, 2.6075972698836067, 7.082062104252389, 0.8301530370918513], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 460, 0, 0.0, 4750.558695652178, 125, 22746, 4257.5, 9365.900000000001, 11263.85, 15172.619999999975, 2.4470948728042647, 24.309880178797517, 0.9367785059953824], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 24484, 134, 0.5472961934324457, 2181.0821352720154, 168, 90003, 676.0, 1195.0, 1442.0, 35962.870000000185, 94.8198407534777, 4138.356868014569, 35.835232784761594], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78", 460, 0, 0.0, 5098.371739130434, 126, 28026, 4337.5, 9666.900000000001, 11753.949999999999, 15896.929999999995, 2.444325180268982, 25.319968725257848, 0.9357182330717196], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -79", 459, 0, 0.0, 4957.416122004353, 105, 26611, 4460.0, 9510.0, 11854.0, 17885.399999999994, 2.4611128090466003, 24.059260657449556, 0.9421447472131517], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -80", 361, 0, 0.0, 6373.72299168975, 168, 25493, 5716.0, 11949.400000000005, 13702.699999999999, 19844.879999999997, 1.9309666065802635, 16.043611855319252, 0.6882839955095665], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -77", 443, 4, 0.9029345372460497, 4524.528216704291, 1, 27060, 4127.0, 8623.600000000004, 10453.199999999993, 15459.240000000002, 2.421426619294889, 6.612035392183657, 0.785071911724515], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -77", 482, 3, 0.6224066390041494, 5081.668049792532, 3, 65600, 3539.5, 8127.0999999999985, 10989.149999999989, 53207.01000000006, 2.544408372264893, 6.48554315299443, 0.8100362591390187], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -79", 444, 6, 1.3513513513513513, 4702.265765765767, 2, 23144, 4246.0, 8456.0, 10146.5, 15483.000000000002, 2.4203703602753985, 6.850939179677066, 0.7847294527455394], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 5032, 0, 0.0, 9005.95747217807, 2351, 24021, 8854.0, 9920.399999999998, 10774.699999999977, 16834.72, 25.87439196207283, 473.8014681046828, 31.180663751169796], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -80", 460, 0, 0.0, 4558.434782608692, 157, 18006, 4303.0, 8727.100000000002, 10414.449999999999, 16160.63999999999, 2.49202281826111, 25.391952907879126, 0.9539774851155811], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -78", 444, 4, 0.9009009009009009, 5215.04504504505, 2, 33096, 4611.0, 9980.0, 13365.25, 18179.100000000017, 2.396670571152507, 6.809264250136297, 0.7770455367408519], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -80", 361, 0, 0.0, 6575.080332409977, 112, 24657, 5782.0, 12283.6, 14767.399999999994, 18904.39999999999, 1.9435351882160392, 16.701109372981094, 0.6927640075184125], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -79", 481, 0, 0.0, 4720.490644490642, 65, 65557, 3516.0, 7561.400000000001, 9747.599999999999, 38800.100000000115, 2.2619646644438904, 5.603141407767333, 0.7201176568444417], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 21389, 283, 1.3231100098181308, 2386.5697788582856, 254, 90208, 659.0, 1112.9000000000015, 7813.850000000002, 90002.0, 80.18880303524497, 5571.729596227782, 44.87127357343298], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 482, 2, 0.4149377593360996, 4393.765560165978, 108, 44597, 3672.5, 7412.5999999999985, 9593.399999999994, 24435.480000000014, 2.609651378729717, 7.049127482417338, 0.8308069819002809], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -80", 443, 3, 0.6772009029345373, 5084.7968397291215, 2, 34142, 4357.0, 10220.6, 13301.199999999983, 19193.28, 2.3780766030544593, 6.419452217033041, 0.7710170236465631], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 1250, 0, 0.0, 38256.63760000006, 26516, 52481, 36729.5, 49505.1, 50105.9, 51288.12, 6.295104423192171, 8800.616593674931, 3.6209145559181533], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 444, 3, 0.6756756756756757, 4844.6238738738675, 3, 34594, 4247.0, 8926.0, 11263.75, 19700.500000000004, 2.418208456104615, 6.252777459124652, 0.7840285228776681], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -78", 444, 1, 0.22522522522522523, 4988.844594594595, 3, 22587, 4410.0, 9653.0, 11196.75, 17545.200000000044, 2.4312248116348343, 6.762400136345716, 0.7882486693972315], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -80", 482, 1, 0.2074688796680498, 4550.145228215764, 3, 65511, 3669.5, 7145.4, 10068.39999999999, 33154.880000000136, 2.5417516993350313, 6.8252157209583775, 0.8091904824054884], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -77", 443, 5, 1.1286681715575622, 4839.681715575622, 2, 33466, 4032.0, 10009.600000000004, 12584.399999999996, 19407.24, 2.399887319060414, 6.331689872123385, 0.7780884667266187], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -77", 361, 0, 0.0, 6086.238227146817, 158, 27631, 5452.0, 10724.400000000003, 13654.499999999995, 21711.03999999998, 1.9332933464718736, 16.22544619546881, 0.6891133510373377], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -80", 361, 0, 0.0, 6171.066481994462, 107, 24921, 5628.0, 10792.000000000004, 13422.099999999993, 20966.559999999987, 1.9602625991670242, 16.867053614335983, 0.6987264147421522], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -78", 361, 0, 0.0, 6222.914127423827, 157, 30211, 5932.0, 10867.800000000001, 13435.49999999999, 21149.97999999999, 1.9310802280921355, 16.40182746353147, 0.6883244953648725], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -79", 361, 0, 0.0, 5765.803324099723, 117, 31259, 5016.0, 10506.0, 12775.899999999998, 18731.999999999996, 1.963802923400806, 15.527055286696188, 0.699988346720014], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -80", 443, 0, 0.0, 5169.318284424385, 15, 20016, 4575.0, 9651.400000000001, 11971.59999999999, 17328.000000000004, 2.3943098658537902, 6.737728106319789, 0.7762801518197836], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -79", 443, 3, 0.6772009029345373, 4896.424379232509, 1, 29060, 4338.0, 9591.6, 11924.199999999995, 16709.76, 2.419667582462599, 6.859887105506792, 0.7845015990015457], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 444, 3, 0.6756756756756757, 5154.740990990989, 1, 21703, 4356.5, 10049.5, 11909.25, 18452.550000000017, 2.379918632511618, 6.74194072247147, 0.7716142441346262], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -80", 481, 0, 0.0, 4475.6237006237, 107, 65033, 3689.0, 8138.200000000003, 9658.399999999998, 21745.160000000058, 2.544206244677531, 6.282037089012838, 0.8099719099266359], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -79", 481, 4, 0.8316008316008316, 4327.247401247397, 4, 49938, 3675.0, 7185.200000000001, 9142.199999999999, 22202.600000000053, 2.542269861152954, 6.833124478068298, 0.8093554440779912], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 444, 6, 1.3513513513513513, 5083.837837837833, 2, 34549, 4378.0, 10228.0, 12154.25, 22115.10000000004, 2.407939693041922, 6.645036717351809, 0.7806991973534357], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -78", 481, 1, 0.2079002079002079, 4741.563409563412, 83, 65483, 3551.0, 7672.8, 10203.5, 51482.920000000006, 2.5452967572601812, 6.886787211074422, 0.810319084830878], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -77", 482, 2, 0.4149377593360996, 4745.906639004145, 3, 59207, 3756.5, 7821.099999999999, 10838.3, 33645.940000000104, 2.5427171200827177, 6.357720107247799, 0.8094978331513338], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80", 459, 0, 0.0, 4854.431372549016, 128, 19374, 4291.0, 8849.0, 10405.0, 15220.599999999982, 2.478923747441416, 23.133768340457763, 0.948962997067417], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -77", 444, 2, 0.45045045045045046, 5156.407657657658, 2, 33442, 4539.0, 9460.5, 12473.5, 21427.50000000005, 2.3608858639300245, 6.466046895355329, 0.7654434636960625], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503/Service Unavailable", 11, 1.0204081632653061, 0.007835315905691288], "isController": false}, {"data": ["502/Bad Gateway", 55, 5.1020408163265305, 0.03917657952845644], "isController": false}, {"data": ["504/Gateway Time-out", 980, 90.9090909090909, 0.6980554170524966], "isController": false}, {"data": ["502/Proxy Error", 32, 2.968460111317254, 0.02279364627110193], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 140390, 1078, "504/Gateway Time-out", 980, "502/Bad Gateway", 55, "502/Proxy Error", 32, "503/Service Unavailable", 11, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -80", 444, 7, "502/Bad Gateway", 3, "502/Proxy Error", 3, "503/Service Unavailable", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -77", 481, 3, "502/Proxy Error", 2, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -79", 482, 3, "502/Bad Gateway", 2, "502/Proxy Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -79", 443, 3, "502/Bad Gateway", 2, "502/Proxy Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -78", 444, 3, "503/Service Unavailable", 1, "502/Bad Gateway", 1, "502/Proxy Error", 1, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 444, 3, "502/Proxy Error", 2, "503/Service Unavailable", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -78", 482, 2, "503/Service Unavailable", 1, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -77", 481, 3, "502/Bad Gateway", 2, "503/Service Unavailable", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -80", 481, 1, "502/Proxy Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 482, 3, "502/Proxy Error", 2, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -80", 444, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -77", 444, 3, "502/Bad Gateway", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -79", 444, 4, "502/Bad Gateway", 2, "503/Service Unavailable", 1, "502/Proxy Error", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -78", 443, 3, "502/Bad Gateway", 2, "502/Proxy Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 500, 500, "504/Gateway Time-out", 500, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 2592, 63, "504/Gateway Time-out", 63, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -77", 481, 2, "502/Bad Gateway", 1, "502/Proxy Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -78", 481, 1, "502/Proxy Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 24484, 134, "504/Gateway Time-out", 134, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -77", 443, 4, "502/Bad Gateway", 2, "503/Service Unavailable", 1, "502/Proxy Error", 1, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -77", 482, 3, "503/Service Unavailable", 1, "502/Bad Gateway", 1, "502/Proxy Error", 1, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -79", 444, 6, "502/Bad Gateway", 5, "502/Proxy Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -78", 444, 4, "502/Proxy Error", 2, "503/Service Unavailable", 1, "502/Bad Gateway", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 21389, 283, "504/Gateway Time-out", 283, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 482, 2, "502/Proxy Error", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -80", 443, 3, "502/Bad Gateway", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 444, 3, "502/Bad Gateway", 2, "502/Proxy Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -78", 444, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -80", 482, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -77", 443, 5, "502/Bad Gateway", 3, "502/Proxy Error", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -79", 443, 3, "502/Bad Gateway", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 444, 3, "502/Bad Gateway", 2, "503/Service Unavailable", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -79", 481, 4, "502/Proxy Error", 3, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 444, 6, "502/Bad Gateway", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -78", 481, 1, "502/Proxy Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -77", 482, 2, "503/Service Unavailable", 1, "502/Proxy Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -77", 444, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
