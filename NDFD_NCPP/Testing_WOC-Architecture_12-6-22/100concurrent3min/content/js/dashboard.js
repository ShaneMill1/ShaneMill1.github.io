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

    var data = {"OkPercent": 99.10591278432254, "KoPercent": 0.8940872156774539};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.2668484831444879, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.03691275167785235, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -80"], "isController": false}, {"data": [0.10666666666666667, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -79"], "isController": false}, {"data": [0.11421319796954314, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -78"], "isController": false}, {"data": [0.030821917808219176, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -77"], "isController": false}, {"data": [0.06, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -80"], "isController": false}, {"data": [0.07614213197969544, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79"], "isController": false}, {"data": [0.04794520547945205, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -78"], "isController": false}, {"data": [0.05782312925170068, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -79"], "isController": false}, {"data": [0.0707070707070707, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77"], "isController": false}, {"data": [0.04, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -78"], "isController": false}, {"data": [0.07, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -79"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -80"], "isController": false}, {"data": [0.03767123287671233, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -80"], "isController": false}, {"data": [0.03666666666666667, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -77"], "isController": false}, {"data": [0.009907120743034056, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.053691275167785234, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -79"], "isController": false}, {"data": [0.05704697986577181, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -78"], "isController": false}, {"data": [0.04697986577181208, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -77"], "isController": false}, {"data": [0.034013605442176874, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -78"], "isController": false}, {"data": [0.02054794520547945, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -77"], "isController": false}, {"data": [0.023972602739726026, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -80"], "isController": false}, {"data": [0.051466519092418374, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.017006802721088437, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -79"], "isController": false}, {"data": [0.06711409395973154, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -80"], "isController": false}, {"data": [0.06, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -77"], "isController": false}, {"data": [0.07, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -78"], "isController": false}, {"data": [0.040268456375838924, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -77"], "isController": false}, {"data": [0.8080575680438614, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}, {"data": [0.06375838926174497, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -79"], "isController": false}, {"data": [0.12121212121212122, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80"], "isController": false}, {"data": [0.040268456375838924, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -78"], "isController": false}, {"data": [0.034013605442176874, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -80"], "isController": false}, {"data": [0.08, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -77"], "isController": false}, {"data": [0.08375634517766498, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77"], "isController": false}, {"data": [0.056666666666666664, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -78"], "isController": false}, {"data": [0.07323232323232323, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78"], "isController": false}, {"data": [0.056666666666666664, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -79"], "isController": false}, {"data": [0.10858585858585859, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_CityLevel1234_Summaries_24hourly_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.0707070707070707, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80"], "isController": false}, {"data": [0.08585858585858586, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79"], "isController": false}, {"data": [0.056666666666666664, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -77"], "isController": false}, {"data": [0.05333333333333334, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -78"], "isController": false}, {"data": [0.04666666666666667, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -79"], "isController": false}, {"data": [0.07106598984771574, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -77"], "isController": false}, {"data": [0.09090909090909091, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.04452054794520548, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -77"], "isController": false}, {"data": [0.08883248730964467, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -79"], "isController": false}, {"data": [0.03333333333333333, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -80"], "isController": false}, {"data": [0.08838383838383838, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -78"], "isController": false}, {"data": [0.04794520547945205, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -79"], "isController": false}, {"data": [0.10101010101010101, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -77"], "isController": false}, {"data": [0.030821917808219176, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -78"], "isController": false}, {"data": [0.07106598984771574, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77"], "isController": false}, {"data": [0.10305745914602003, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.06313131313131314, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78"], "isController": false}, {"data": [0.06565656565656566, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -79"], "isController": false}, {"data": [0.06, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -80"], "isController": false}, {"data": [0.040268456375838924, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -77"], "isController": false}, {"data": [0.04081632653061224, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -77"], "isController": false}, {"data": [0.04697986577181208, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP "], "isController": false}, {"data": [0.08585858585858586, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -80"], "isController": false}, {"data": [0.050335570469798654, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -78"], "isController": false}, {"data": [0.03, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -80"], "isController": false}, {"data": [0.05136986301369863, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -79"], "isController": false}, {"data": [0.06403162055335969, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.047619047619047616, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -78"], "isController": false}, {"data": [0.04697986577181208, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST"], "isController": false}, {"data": [0.04697986577181208, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -79"], "isController": false}, {"data": [0.087248322147651, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -78"], "isController": false}, {"data": [0.04081632653061224, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -80"], "isController": false}, {"data": [0.050335570469798654, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -77"], "isController": false}, {"data": [0.04, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -77"], "isController": false}, {"data": [0.043333333333333335, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -78"], "isController": false}, {"data": [0.05, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -80"], "isController": false}, {"data": [0.056666666666666664, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -79"], "isController": false}, {"data": [0.07046979865771812, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -80"], "isController": false}, {"data": [0.04697986577181208, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -79"], "isController": false}, {"data": [0.0738255033557047, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -80"], "isController": false}, {"data": [0.05821917808219178, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -80"], "isController": false}, {"data": [0.0273972602739726, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -79"], "isController": false}, {"data": [0.03355704697986577, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -78"], "isController": false}, {"data": [0.0273972602739726, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -78"], "isController": false}, {"data": [0.05102040816326531, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -77"], "isController": false}, {"data": [0.07360406091370558, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80"], "isController": false}, {"data": [0.06375838926174497, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -77"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 35567, 318, 0.8940872156774539, 7069.057187842648, 1, 90004, 6746.0, 12857.900000000001, 35321.95, 89834.09000002671, 13.529659919271673, 1569.9364571443875, 5.718106831062223], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -80", 149, 0, 0.0, 6157.120805369129, 351, 34252, 5284.0, 10872.0, 14016.5, 26896.0, 0.7995235054544674, 2.2773445255445077, 0.2592205115340656], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -79", 150, 0, 0.0, 5665.206666666667, 95, 17545, 5627.0, 10844.500000000004, 12397.299999999997, 17438.920000000002, 0.8097734253955743, 6.463120134611336, 0.28863994166932094], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -78", 197, 0, 0.0, 4465.284263959388, 89, 15347, 4105.0, 7698.0000000000055, 10455.799999999997, 14771.740000000005, 1.085387488843098, 10.506669046690945, 0.4154998980727485], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -77", 146, 0, 0.0, 6119.198630136985, 116, 24360, 5067.5, 11363.300000000005, 16424.850000000006, 22012.820000000007, 0.7994655627470951, 2.2427858157834213, 0.25451735689018845], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -80", 150, 0, 0.0, 6041.960000000001, 160, 25642, 5841.0, 10731.2, 12502.74999999999, 20038.6300000001, 0.8146949239074942, 6.793484256699508, 0.29039418674437045], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79", 197, 2, 1.015228426395939, 4844.781725888325, 2, 16807, 4584.0, 7916.8, 9740.8, 14032.620000000028, 1.0948823974034059, 10.884551303160153, 0.4191346677559913], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -78", 146, 0, 0.0, 5990.123287671232, 194, 19063, 5310.0, 11222.200000000003, 12962.65, 18822.36, 0.808640265854334, 2.3232073006092495, 0.2574382096372196], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -79", 147, 0, 0.0, 5791.7687074829955, 108, 21155, 5033.0, 10406.200000000008, 13032.999999999995, 20694.68000000001, 0.7948523845571537, 2.186857899859414, 0.2530487083648751], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77", 198, 0, 0.0, 4705.782828282826, 120, 14335, 4235.0, 8083.499999999999, 9995.099999999999, 14316.19, 1.0835718468332887, 10.582942756075937, 0.4148048476158683], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 150, 0, 0.0, 5951.753333333335, 78, 21155, 5598.5, 9766.7, 11520.55, 19537.79000000003, 0.8185226212368423, 6.720315850826981, 0.29175855151508534], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -79", 150, 0, 0.0, 5672.279999999999, 143, 15355, 5250.5, 10178.5, 12373.199999999997, 15164.260000000004, 0.8226706081729582, 7.174892787166887, 0.29323708201477516], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -80", 198, 1, 0.5050505050505051, 4325.823232323234, 2, 14921, 3951.5, 7684.699999999998, 9614.949999999995, 12590.539999999979, 1.0931133856702773, 10.75633448510495, 0.41845746795190303], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -80", 146, 0, 0.0, 6224.890410958904, 454, 19089, 5426.0, 11850.800000000005, 13798.500000000002, 19038.24, 0.8046559820109785, 2.3400707484127334, 0.2561697755230264], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -77", 150, 0, 0.0, 5890.133333333332, 82, 23206, 5868.0, 9810.7, 11624.549999999996, 18544.600000000082, 0.8148763832526605, 6.928008981974934, 0.29045886707736435], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 1615, 5, 0.30959752321981426, 10910.034055727541, 2, 14447, 10983.0, 12648.4, 13013.4, 13503.84, 8.886027753017947, 3885.18076588515, 3.2541605540837213], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -79", 149, 0, 0.0, 5484.845637583892, 34, 19112, 4926.0, 9064.0, 11480.5, 19065.0, 0.8056449214631377, 2.2807033847900726, 0.2612051893806267], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -78", 149, 0, 0.0, 5104.825503355705, 73, 23386, 4509.0, 9934.0, 12426.0, 19506.0, 0.8140252730262619, 2.3594120477106224, 0.2639222564889833], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 149, 3, 2.0134228187919465, 6382.4899328859065, 2, 29625, 5252.0, 12386.0, 16381.0, 28357.0, 0.8104432961653523, 2.237318763598042, 0.26276091242861027], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -78", 147, 0, 0.0, 6392.258503401365, 81, 23257, 5616.0, 12092.600000000008, 15240.999999999996, 21145.000000000044, 0.8045932972452258, 2.1855423957723277, 0.2561498192401793], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -77", 146, 0, 0.0, 6270.965753424656, 157, 23029, 5713.5, 10303.800000000005, 12857.600000000008, 20833.160000000003, 0.7970084886863007, 2.30381001446625, 0.25373512432786527], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -80", 146, 0, 0.0, 6014.376712328766, 403, 17120, 5045.5, 11538.800000000001, 13139.3, 17003.44, 0.7937414034000402, 2.294366270883282, 0.2526950170980597], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 1807, 11, 0.6087437742114001, 10085.419479800792, 3, 54631, 10570.0, 12615.4, 13124.999999999998, 32997.52000000003, 9.139325399434545, 3655.5807392953056, 3.3469209226444865], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 147, 0, 0.0, 5973.047619047623, 611, 21429, 5394.0, 10068.000000000007, 12340.6, 18418.920000000064, 0.7980109441500911, 2.3070896758012682, 0.2540542654227829], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -80", 149, 2, 1.342281879194631, 6401.510067114092, 2, 25528, 4990.0, 14736.0, 16550.5, 22944.5, 0.7993219175142698, 2.349778862092829, 0.25915515294407965], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 150, 0, 0.0, 5715.826666666669, 120, 18958, 5557.5, 9693.800000000001, 10318.099999999999, 16432.990000000045, 0.814098006545348, 6.683442527055191, 0.2901814183486836], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -78", 150, 0, 0.0, 5510.053333333329, 214, 13701, 5640.0, 9741.800000000001, 10826.149999999998, 13651.53, 0.8120178643930166, 6.848588273108676, 0.28943996142915146], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -77", 149, 0, 0.0, 5897.3959731543655, 84, 27211, 5136.0, 10379.0, 13155.5, 24914.0, 0.815790194092365, 2.221731150250486, 0.26449447699088396], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 10214, 55, 0.5384766007440768, 1760.645094967691, 1, 51914, 353.0, 6429.0, 6833.0, 20128.20000000002, 55.21678019245324, 4211.68222789288, 19.78960774475619], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -79", 149, 1, 0.6711409395973155, 6281.080536912754, 2, 31653, 5391.0, 11546.0, 15422.5, 28236.0, 0.8062988717227197, 2.271034287994805, 0.26141721231635057], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80", 198, 0, 0.0, 4156.2929292929275, 101, 13808, 3796.5, 7491.2, 8997.5, 12901.159999999993, 1.0841651654446993, 10.331647210670267, 0.415031977396799], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -78", 149, 0, 0.0, 6484.838926174494, 389, 32054, 5061.0, 11779.0, 20178.0, 31394.0, 0.7986835122777489, 2.301397411380972, 0.25894816999630144], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -80", 147, 0, 0.0, 6287.544217687077, 216, 20221, 5485.0, 11733.200000000006, 13972.599999999995, 19329.160000000018, 0.8004574042309891, 2.23024976857524, 0.2548331189251], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -77", 150, 0, 0.0, 5835.78666666667, 125, 25595, 5671.5, 9730.1, 11126.999999999993, 23691.680000000033, 0.8154877432192194, 6.765946777872013, 0.29067678347169446], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77", 197, 0, 0.0, 4716.903553299494, 106, 14279, 4574.0, 8331.000000000002, 9301.699999999999, 12212.180000000022, 1.0790972830850132, 10.896262487332931, 0.4130919286809816], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -78", 150, 0, 0.0, 6016.75333333333, 64, 24837, 5540.0, 10456.900000000001, 12014.449999999999, 19881.33000000009, 0.8220664558522911, 6.707323704423265, 0.29302173475203735], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 198, 0, 0.0, 4486.464646464648, 172, 13803, 4286.5, 8193.5, 9136.899999999994, 12713.00999999999, 1.0854192020524291, 10.794356702395048, 0.4155120382856955], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -79", 150, 0, 0.0, 6193.480000000001, 94, 19502, 5799.5, 10659.6, 12396.499999999998, 17508.410000000036, 0.819999234667381, 7.1129007831676025, 0.29228488345077547], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79", 198, 1, 0.5050505050505051, 4283.414141414139, 3, 11799, 4065.5, 7924.199999999999, 8702.899999999985, 11520.809999999998, 1.084557111791546, 10.109213583119253, 0.4151820193577012], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 499, 0, 0.0, 35650.83166332667, 26703, 73310, 35946.0, 38249.0, 39639.0, 40583.0, 2.7201020447099737, 1838.2278855857076, 0.9456604764812018], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 200, 200, 100.0, 90002.46999999996, 90001, 90004, 90002.0, 90004.0, 90004.0, 90004.0, 1.053152612345055, 0.30031304961401956, 0.45766885985698186], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 198, 1, 0.5050505050505051, 4538.1767676767695, 4, 12809, 3902.0, 8196.699999999999, 9294.249999999993, 12682.279999999999, 1.084931506849315, 10.563634417808219, 0.4153253424657534], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 198, 1, 0.5050505050505051, 4339.818181818185, 2, 13188, 4085.5, 7476.599999999999, 8741.049999999997, 12475.199999999993, 1.0758121566773704, 9.9174894439328, 0.4118343412280559], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -77", 150, 0, 0.0, 5600.740000000002, 89, 15987, 5272.5, 10043.9, 11310.899999999994, 15463.230000000009, 0.8227112173932121, 6.756237350815032, 0.2932515569809789], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -78", 150, 0, 0.0, 5821.293333333335, 67, 25512, 5484.5, 9857.1, 11677.049999999997, 22872.24000000005, 0.8146816495674041, 6.421256054103008, 0.2903894551680688], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 150, 0, 0.0, 6055.58, 127, 16925, 5796.0, 10852.800000000003, 11945.099999999999, 16278.83000000001, 0.8133519862055503, 6.628866344918177, 0.2899155028955331], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -77", 197, 1, 0.5076142131979695, 4477.274111675126, 4, 11996, 4383.0, 8067.800000000003, 8889.2, 10771.980000000012, 1.0813659243482985, 11.08749578020277, 0.4139603929145831], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78", 198, 1, 0.5050505050505051, 4488.414141414142, 2, 12042, 4062.0, 8029.799999999999, 10006.999999999993, 11621.249999999996, 1.0839336939146431, 10.497613840409924, 0.4149433672016992], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 1500, 0, 0.0, 12075.815999999992, 3067, 13889, 12304.5, 13082.7, 13249.550000000001, 13597.86, 8.044793409705239, 2311.6337129721624, 3.291766053385249], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -77", 146, 0, 0.0, 6256.205479452053, 382, 14830, 5880.5, 11235.000000000002, 12186.7, 14803.68, 0.8074640650838159, 2.1493740252360176, 0.257063755095043], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -79", 197, 1, 0.5076142131979695, 4743.527918781726, 3, 14834, 4334.0, 8214.2, 10173.3, 14385.160000000005, 1.0853336712375559, 10.401691822396439, 0.41547929602062683], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 150, 0, 0.0, 6063.026666666665, 194, 27239, 5668.5, 10220.7, 11604.299999999997, 25726.340000000026, 0.8128098837681866, 6.7727277730363875, 0.28972227302284], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -78", 198, 1, 0.5050505050505051, 4434.717171717173, 3, 15253, 4266.0, 7562.4, 8721.69999999999, 12912.639999999978, 1.0735023828499861, 10.513940112934618, 0.4109501309347603], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -79", 146, 0, 0.0, 5812.897260273972, 334, 16612, 5170.5, 11082.800000000003, 12956.050000000003, 16587.56, 0.7999693162454043, 2.2560778490688027, 0.25467773153906426], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -77", 198, 1, 0.5050505050505051, 4515.39393939394, 3, 11936, 4377.0, 8045.2, 9673.5, 11203.399999999994, 1.0796309625073612, 10.236014638405418, 0.4132962278348492], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -78", 146, 0, 0.0, 6492.602739726028, 247, 23624, 5935.5, 10929.700000000004, 13392.700000000003, 21558.820000000007, 0.7982722327018235, 2.0968208364088685, 0.25413744908280705], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 197, 0, 0.0, 4464.197969543145, 119, 14427, 3970.0, 7233.800000000001, 8456.6, 11702.600000000028, 1.0770324203160024, 10.76298837201356, 0.4123014734022197], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 1897, 20, 1.0542962572482868, 9576.209277807047, 1, 69198, 8992.0, 11621.2, 27797.89999999984, 38417.6, 9.733196511031299, 714.6202128896228, 3.678463915790149], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78", 198, 2, 1.0101010101010102, 4341.090909090907, 2, 14152, 3972.0, 7524.9, 8537.6, 9722.73999999996, 1.0781260209526715, 11.281234558090846, 0.41272011739594455], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -79", 198, 2, 1.0101010101010102, 4323.732323232322, 2, 17271, 3842.0, 7509.4, 8526.099999999986, 14454.449999999973, 1.0811991481461256, 10.133559706560913, 0.41389654889968874], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -80", 150, 0, 0.0, 6010.900000000001, 122, 24299, 5438.5, 11072.500000000002, 13333.199999999999, 20878.94000000006, 0.8154522770145748, 6.834344819771456, 0.2906641417092967], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -77", 149, 0, 0.0, 5808.9865771812065, 458, 28426, 4957.0, 10375.0, 13720.0, 24187.5, 0.8127065856505471, 2.511402692704186, 0.2634947133163883], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -77", 147, 0, 0.0, 6229.380952380951, 380, 17578, 5657.0, 11884.200000000004, 14323.199999999999, 16858.960000000014, 0.8036607567532106, 2.351506419718664, 0.25585293623197913], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -79", 149, 0, 0.0, 5813.449664429529, 51, 29772, 4936.0, 9693.0, 13015.0, 27194.5, 0.8045660473128033, 2.3208210066660184, 0.26085539815219794], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 1944, 0, 0.0, 9364.493827160484, 3163, 27175, 7634.0, 14416.5, 15052.5, 21456.149999999998, 10.087696538840746, 184.51202584193865, 12.156462430595194], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -80", 198, 1, 0.5050505050505051, 4631.19191919192, 4, 13631, 4405.0, 8340.1, 9629.05, 13362.709999999997, 1.087195255875247, 10.086648741214583, 0.416191933889743], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -78", 149, 0, 0.0, 6547.1677852348985, 18, 34067, 5021.0, 13601.0, 16112.0, 32183.0, 0.7936677035837559, 2.161279669322879, 0.2573219507712959], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -80", 150, 0, 0.0, 5977.493333333335, 119, 27880, 5514.0, 10554.600000000002, 11981.399999999998, 22361.800000000097, 0.8144339412630242, 6.874670832948739, 0.2903011607041053], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -79", 146, 0, 0.0, 6210.876712328766, 132, 20410, 5087.5, 12915.400000000003, 15560.200000000003, 20252.55, 0.8071917467408251, 2.3474451655572386, 0.25697705999756737], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 2530, 0, 0.0, 7075.500395256918, 241, 10369, 7350.5, 8568.6, 9481.45, 10209.11, 13.743203089776252, 1067.7991635675426, 7.690288447697062], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 147, 0, 0.0, 5763.8299319727885, 229, 24612, 5134.0, 10372.600000000011, 12698.199999999999, 22491.840000000044, 0.7944271207691351, 2.2967286626062617, 0.2529133216511114], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -80", 149, 0, 0.0, 6320.926174496645, 15, 27257, 5209.0, 11438.0, 16361.0, 25582.5, 0.7944548120501199, 2.334377499333511, 0.2575771460943748], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 500, 0, 0.0, 36559.34800000005, 25106, 44688, 36800.0, 41471.6, 42100.35, 43293.82, 2.646748998205504, 3700.2060132234888, 1.522397617131877], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 149, 1, 0.6711409395973155, 5645.7718120805375, 2, 29826, 4694.0, 9736.0, 13644.5, 29566.5, 0.8161432030060363, 2.3525043254905076, 0.2646089290996133], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -78", 149, 1, 0.6711409395973155, 5988.563758389266, 1, 28991, 5321.0, 12297.0, 14576.5, 24872.5, 0.8005329722875901, 2.3110394638578167, 0.2595477996088671], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -80", 147, 0, 0.0, 5729.714285714287, 210, 18413, 5291.0, 10621.600000000002, 12446.4, 17757.800000000014, 0.802327294956254, 2.1934053096874195, 0.25542841616771367], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -77", 149, 0, 0.0, 6174.765100671141, 20, 31890, 5060.0, 11678.0, 14057.5, 31836.0, 0.8051747337249329, 2.277498920917251, 0.2610527456998806], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -77", 150, 0, 0.0, 5880.660000000003, 146, 16201, 5428.0, 10071.2, 11810.89999999999, 15486.490000000013, 0.8308730259841691, 6.906285831399246, 0.2961607953947478], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -78", 150, 0, 0.0, 6541.753333333331, 76, 20776, 6134.0, 11125.8, 13504.35, 19836.070000000018, 0.833222237035062, 7.124435274949451, 0.29699816066191176], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -80", 150, 0, 0.0, 5533.960000000001, 78, 13031, 5329.0, 9519.800000000001, 10497.299999999997, 12821.900000000003, 0.820425308479916, 7.164903478671677, 0.2924367554640326], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -79", 150, 0, 0.0, 6411.233333333334, 133, 19014, 5844.5, 10968.1, 13512.799999999997, 18188.310000000016, 0.8164153921515267, 6.751186566224896, 0.291007439585261], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -80", 149, 1, 0.6711409395973155, 5348.140939597315, 3, 31088, 4690.0, 8859.0, 11705.5, 30130.0, 0.8145815565614818, 2.2778343269588226, 0.26410261404141794], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -79", 149, 0, 0.0, 5963.758389261746, 22, 29922, 4813.0, 11968.0, 16645.5, 26054.0, 0.8074130269860194, 2.3456709504037065, 0.2617784423431235], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 149, 1, 0.6711409395973155, 5604.315436241614, 2, 27273, 4664.0, 10430.0, 13336.0, 26657.0, 0.809193304875797, 2.291713762124323, 0.2623556418151998], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -80", 146, 0, 0.0, 5565.794520547944, 303, 22088, 4949.5, 10087.300000000007, 12461.300000000005, 21520.710000000003, 0.8021493206454555, 2.234003885754158, 0.2553717563773618], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -79", 146, 0, 0.0, 5958.000000000001, 150, 19697, 5314.5, 10002.600000000004, 12694.150000000005, 18567.590000000004, 0.7916325523643244, 2.274344480125143, 0.2520236446003611], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 149, 1, 0.6711409395973155, 6500.10067114094, 2, 30540, 5762.0, 11499.0, 14561.0, 29221.0, 0.8101172223309628, 2.146781967347926, 0.2626551931776168], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -78", 146, 0, 0.0, 5980.554794520547, 645, 22666, 5142.5, 10736.200000000006, 13299.0, 20833.000000000004, 0.7977008730999967, 2.235647616322271, 0.25395555139706927], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -77", 147, 0, 0.0, 5939.07482993197, 172, 17066, 5597.0, 10572.000000000002, 13680.999999999998, 16634.00000000001, 0.8134175155905023, 2.3942665304976236, 0.2589590918774451], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80", 197, 0, 0.0, 4585.192893401014, 134, 11752, 4430.0, 8239.2, 9034.0, 11213.980000000005, 1.0847181384695013, 11.241389705639433, 0.4152436623828559], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -77", 149, 0, 0.0, 6278.187919463086, 21, 29182, 5244.0, 12401.0, 17030.0, 27943.0, 0.8117590655509065, 2.384616740079106, 0.263187509534083], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 81, 25.471698113207548, 0.2277391964461439], "isController": false}, {"data": ["504/Gateway Time-out", 200, 62.893081761006286, 0.5623190035707256], "isController": false}, {"data": ["502/Proxy Error", 37, 11.635220125786164, 0.10402901566058424], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 35567, 318, "504/Gateway Time-out", 200, "502/Bad Gateway", 81, "502/Proxy Error", 37, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79", 197, 2, "502/Bad Gateway", 1, "502/Proxy Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -80", 198, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 1615, 5, "502/Proxy Error", 3, "502/Bad Gateway", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 149, 3, "502/Proxy Error", 2, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 1807, 11, "502/Proxy Error", 9, "502/Bad Gateway", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -80", 149, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 10214, 55, "502/Bad Gateway", 46, "502/Proxy Error", 9, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -79", 149, 1, "502/Proxy Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79", 198, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 200, 200, "504/Gateway Time-out", 200, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 198, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 198, 1, "502/Proxy Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -77", 197, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78", 198, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -79", 197, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -78", 198, 1, "502/Proxy Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -77", 198, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 1897, 20, "502/Bad Gateway", 13, "502/Proxy Error", 7, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78", 198, 2, "502/Bad Gateway", 1, "502/Proxy Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -79", 198, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -80", 198, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 149, 1, "502/Proxy Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -78", 149, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -80", 149, 1, "502/Proxy Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 149, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 149, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
