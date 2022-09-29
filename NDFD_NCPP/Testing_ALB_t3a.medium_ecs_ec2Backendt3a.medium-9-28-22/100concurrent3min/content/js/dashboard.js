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

    var data = {"OkPercent": 98.9546963462716, "KoPercent": 1.0453036537283928};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.956337354833858, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -79"], "isController": false}, {"data": [0.037037037037037035, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -78"], "isController": false}, {"data": [0.014285714285714285, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -79"], "isController": false}, {"data": [0.009433962264150943, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.030303030303030304, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -78"], "isController": false}, {"data": [0.015151515151515152, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -77"], "isController": false}, {"data": [0.0014265335235378032, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -79"], "isController": false}, {"data": [0.02727272727272727, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -77"], "isController": false}, {"data": [0.02727272727272727, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -79"], "isController": false}, {"data": [0.028846153846153848, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_CityLevel1234_Summaries_24hourly_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.01818181818181818, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80"], "isController": false}, {"data": [0.03636363636363636, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -77"], "isController": false}, {"data": [0.01818181818181818, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -80"], "isController": false}, {"data": [0.05555555555555555, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -79"], "isController": false}, {"data": [0.018518518518518517, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78"], "isController": false}, {"data": [0.008928571428571428, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -79"], "isController": false}, {"data": [0.014285714285714285, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP "], "isController": false}, {"data": [0.018518518518518517, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -79"], "isController": false}, {"data": [1.0, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -77"], "isController": false}, {"data": [0.014705882352941176, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -80"], "isController": false}, {"data": [0.029411764705882353, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -79"], "isController": false}, {"data": [0.015151515151515152, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -80"], "isController": false}, {"data": [0.030303030303030304, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -77"], "isController": false}, {"data": [0.027777777777777776, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80"], "isController": false}, {"data": [0.030303030303030304, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -77"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 186166, 1946, 1.0453036537283928, 1372.5450082184882, 31, 61009, 104.0, 120.0, 130.0, 60062.0, 67.49884520362487, 429.2490524143402, 32.469193169538066], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -80", 33, 4, 12.121212121212121, 29534.303030303025, 1633, 60062, 25086.0, 60050.8, 60061.3, 60062.0, 0.16905910921218453, 0.3338307049124479, 0.0558027137829281], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -79", 34, 1, 2.9411764705882355, 27780.64705882353, 4008, 60074, 27336.0, 42615.0, 52908.5, 60074.0, 0.17006717653473122, 1.2566877979301825, 0.06161613524842313], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -78", 54, 0, 0.0, 17768.481481481478, 331, 42385, 15486.0, 32495.5, 38036.0, 42385.0, 0.2864478346665535, 2.6075890938965394, 0.11133421698953935], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -77", 16, 15, 93.75, 58515.5625, 35307, 60073, 60061.0, 60068.8, 60073.0, 60073.0, 0.0764222904715733, 0.02924607917826932, 0.024777539488830404], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -80", 34, 0, 0.0, 28717.941176470587, 2804, 53627, 30099.0, 47015.0, 51645.5, 53627.0, 0.17328902570793664, 1.3249572590900287, 0.06278342630629345], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79", 54, 0, 0.0, 16688.092592592595, 4608, 38897, 15872.5, 32368.5, 34796.0, 38897.0, 0.288455374885152, 2.681118008295763, 0.11211449141043994], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -78", 16, 16, 100.0, 60064.5625, 60058, 60082, 60061.5, 60080.6, 60082.0, 60082.0, 0.07062676842806884, 0.02655400961406885, 0.022898522576287945], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -79", 16, 14, 87.5, 59507.87499999999, 55011, 60072, 60064.0, 60072.0, 60072.0, 60072.0, 0.07187780772686433, 0.05187275381850854, 0.023304132973944295], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77", 54, 0, 0.0, 15876.592592592593, 1594, 38803, 15073.5, 27341.0, 32443.5, 38803.0, 0.2902991694218208, 2.7425123645942535, 0.11283112249012177], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 34, 0, 0.0, 28434.176470588234, 5219, 56302, 28774.5, 48832.5, 52310.5, 56302.0, 0.17673171086692102, 1.3959957434947137, 0.06403072727698017], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -79", 35, 0, 0.0, 24890.02857142857, 1179, 56934, 23200.0, 48156.6, 53357.99999999998, 56934.0, 0.16892625644936315, 1.2986912966176136, 0.06120277455343137], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -80", 53, 0, 0.0, 16993.96226415094, 1419, 42865, 17307.0, 26743.2, 29545.299999999996, 42865.0, 0.2767710737673243, 2.6136028168637138, 0.10757313218690925], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -80", 16, 15, 93.75, 60036.43749999999, 59628, 60076, 60063.0, 60072.5, 60076.0, 60076.0, 0.06996462413692077, 0.03839855348139597, 0.02268384298189228], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -77", 34, 1, 2.9411764705882355, 29197.470588235294, 8470, 60066, 27653.5, 51832.0, 59359.5, 60066.0, 0.1748971193415638, 1.3371371045524691, 0.06336604616769548], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 783, 0, 0.0, 23556.965517241388, 6086, 44423, 21774.0, 33937.2, 35713.6, 38875.759999999995, 3.9190758388724274, 2819.7998134857125, 1.4581717720804637], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -79", 33, 3, 9.090909090909092, 26347.121212121212, 261, 60046, 21954.0, 59985.0, 60044.6, 60046.0, 0.16137945199450332, 0.46754290156586975, 0.053267826927873164], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -78", 33, 3, 9.090909090909092, 30004.151515151516, 3661, 60518, 27076.0, 58824.4, 60188.299999999996, 60518.0, 0.16176549885048458, 0.4821800980029314, 0.0533952525502576], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 33, 5, 15.151515151515152, 29066.0, 710, 60080, 23536.0, 60053.6, 60067.4, 60080.0, 0.16061520490606443, 0.4508604548938966, 0.05301556568188455], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -78", 16, 15, 93.75, 58681.9375, 37919, 60098, 60064.0, 60080.5, 60098.0, 60098.0, 0.07184166097920183, 0.03942872409210101, 0.0232924135206006], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -77", 16, 12, 75.0, 55018.1875, 38058, 60086, 60062.5, 60079.0, 60086.0, 60086.0, 0.07730738382149725, 0.06967290219166433, 0.025064503348376063], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -80", 16, 15, 93.75, 59219.25, 46552, 60093, 60060.5, 60076.9, 60093.0, 60093.0, 0.07189751009935337, 0.03945937565999668, 0.023310520852524726], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 600, 100, 16.666666666666668, 31122.61666666667, 14933, 60092, 22438.5, 60064.0, 60066.0, 60071.98, 3.112937367700162, 1869.0620111715539, 1.1582315791931266], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 16, 16, 100.0, 60068.49999999999, 60058, 60104, 60066.0, 60087.9, 60104.0, 60104.0, 0.07603189538011196, 0.028586210665374125, 0.024650966080270675], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -80", 33, 3, 9.090909090909092, 28754.030303030297, 2399, 60070, 25196.0, 57086.20000000001, 60062.3, 60070.0, 0.16937582442399388, 0.47655496149266297, 0.05590725454620111], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 34, 1, 2.9411764705882355, 25036.91176470588, 8781, 60076, 24276.5, 42118.5, 53983.75, 60076.0, 0.18201771996038438, 1.5693904915816805, 0.06594587314970958], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -78", 35, 0, 0.0, 26103.42857142857, 3292, 53071, 27196.0, 42840.2, 47261.39999999997, 53071.0, 0.17978405366810837, 1.507718033111086, 0.06513660538170724], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -77", 33, 3, 9.090909090909092, 28350.848484848473, 1862, 60068, 25758.0, 58992.8, 60053.3, 60068.0, 0.17417740760680242, 0.41728457586481726, 0.057492152120214086], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 1402, 0, 0.0, 12584.10057061342, 357, 14136, 12790.0, 13795.0, 13946.55, 14058.94, 7.721965190570611, 478.35462880728136, 2.8127861485183963], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -79", 33, 3, 9.090909090909092, 27878.75757575758, 7257, 60065, 22910.0, 57580.40000000001, 60050.3, 60065.0, 0.1635736378777064, 0.47389982013095805, 0.05399207969010231], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80", 55, 0, 0.0, 16879.654545454545, 391, 45965, 15361.0, 31226.199999999997, 38895.799999999996, 45965.0, 0.29288970306309375, 1.9565833034896478, 0.11383799005772591], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -78", 33, 1, 3.0303030303030303, 24935.54545454546, 1553, 60062, 21522.0, 50775.000000000015, 57694.59999999999, 60062.0, 0.17144282122150414, 0.4261768591805033, 0.056589524973504286], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -80", 16, 13, 81.25, 54174.0, 12128, 60069, 60061.0, 60068.3, 60069.0, 60069.0, 0.0770802019501291, 0.06895064940070143, 0.024990846726018423], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -77", 34, 0, 0.0, 29752.088235294123, 6797, 58519, 28754.5, 46287.5, 53112.25, 58519.0, 0.1657752185551227, 1.4864727116925163, 0.06006113875385793], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77", 55, 0, 0.0, 16476.56363636364, 373, 51210, 15608.0, 28723.399999999998, 32009.59999999999, 51210.0, 0.29119017365523087, 3.0935285052017156, 0.11317743077615418], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -78", 34, 0, 0.0, 28390.088235294123, 2696, 56815, 26870.5, 49244.5, 56644.75, 56815.0, 0.16593946138003066, 1.3153237924243755, 0.06012064469921032], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 57, 0, 0.0, 16987.894736842107, 1678, 50002, 15111.0, 31633.0, 39295.19999999997, 50002.0, 0.2980002614037381, 3.2218368105476407, 0.11582432035028101], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -79", 34, 0, 0.0, 25208.558823529416, 7057, 46799, 24098.5, 39193.5, 42321.5, 46799.0, 0.17389703249828659, 1.5492799096502623, 0.06300371001646907], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79", 52, 0, 0.0, 16417.480769230766, 414, 39202, 13694.5, 32092.600000000002, 38329.9, 39202.0, 0.27703930228717255, 2.2798927738027372, 0.10767738506864713], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 300, 300, 100.0, 60065.436666666676, 60051, 60114, 60064.0, 60071.0, 60075.0, 60108.98, 1.578199800094692, 0.5933661357777894, 0.5579182887053501], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 300, 300, 100.0, 60064.88333333336, 60050, 60112, 60065.0, 60070.0, 60073.0, 60099.95, 1.578266221946318, 0.5933911088372387, 0.6951152989236224], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 55, 0, 0.0, 15903.16363636364, 384, 46648, 15991.0, 25431.6, 27327.799999999992, 46648.0, 0.2931613453440648, 2.729112462355418, 0.11394356977240018], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 55, 0, 0.0, 16329.563636363639, 492, 45775, 16642.0, 28962.799999999996, 31448.999999999978, 45775.0, 0.2903861079285967, 3.0304564292144267, 0.11286491304256005], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -77", 34, 1, 2.9411764705882355, 30161.85294117647, 7057, 60047, 27803.0, 46557.0, 55779.5, 60047.0, 0.169891269587464, 1.4709531212523985, 0.06155240333686441], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -78", 34, 1, 2.9411764705882355, 29853.823529411766, 3590, 60046, 31048.0, 50009.0, 57541.75, 60046.0, 0.16568716314337786, 1.391817856203035, 0.06002923586542304], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 34, 0, 0.0, 25765.147058823524, 8905, 49343, 24291.5, 40423.5, 44945.75, 49343.0, 0.1646712387151769, 1.465155913998024, 0.059661161682940056], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -77", 53, 0, 0.0, 17344.245283018856, 3769, 46447, 16597.0, 27881.0, 36201.09999999999, 46447.0, 0.2899613202540718, 2.9130929418354006, 0.11269981002062555], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78", 55, 0, 0.0, 17002.09090909091, 4365, 39224, 16128.0, 27645.399999999998, 30862.19999999996, 39224.0, 0.28722726465642395, 3.1098522297322, 0.11163715950513355], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 300, 300, 100.0, 60080.82666666667, 60055, 61009, 60065.0, 60073.9, 60101.85, 60820.92, 1.573778747691791, 0.5917039236927145, 0.6531796560244251], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -77", 15, 15, 100.0, 60063.26666666667, 60055, 60071, 60064.0, 60070.4, 60071.0, 60071.0, 0.07970456175775127, 0.029967047145248282, 0.02584171338239592], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -79", 55, 0, 0.0, 16660.145454545458, 1393, 53346, 15079.0, 29383.199999999997, 38575.199999999975, 53346.0, 0.29452084136571993, 2.851099801064559, 0.11447196764019192], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 35, 0, 0.0, 26849.285714285717, 5289, 57924, 27098.0, 48322.0, 55289.599999999984, 57924.0, 0.16935948243742166, 1.4666370514393137, 0.061359734359651794], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -78", 54, 0, 0.0, 16171.370370370369, 422, 47614, 15511.0, 26846.5, 33640.25, 47614.0, 0.28704929274243707, 2.6630341974048615, 0.11156798682762689], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -79", 16, 14, 87.5, 58719.375, 43325, 60081, 60062.0, 60072.6, 60081.0, 60081.0, 0.07314386025865498, 0.028482533474744793, 0.023714610943235792], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -77", 54, 0, 0.0, 16379.629629629626, 346, 42704, 15140.5, 29221.5, 37074.0, 42704.0, 0.29633206751981034, 2.805803161081173, 0.11517594030555128], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -78", 16, 15, 93.75, 58845.49999999999, 40573, 60071, 60063.5, 60071.0, 60071.0, 60071.0, 0.06988608568034103, 0.03835544936753093, 0.022658379341673075], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 55, 0, 0.0, 16792.963636363635, 3977, 53733, 16130.0, 27110.999999999996, 38339.99999999995, 53733.0, 0.29052262378904886, 2.4317703078615422, 0.11291797291800924], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 300, 300, 100.0, 60065.28333333334, 60055, 60114, 60064.0, 60069.0, 60072.0, 60107.99, 1.5783077384428414, 0.5934067180668887, 0.6057372472734733], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78", 52, 0, 0.0, 17138.211538461546, 2888, 37845, 16458.5, 28836.200000000004, 32677.799999999992, 37845.0, 0.28014675379949033, 2.639318293852395, 0.10888516407441129], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -79", 56, 0, 0.0, 17276.21428571428, 575, 45241, 17519.5, 25438.9, 27794.45, 45241.0, 0.2999480447136835, 2.6332021646473733, 0.1165813689414512], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -80", 35, 0, 0.0, 25741.400000000005, 800, 58609, 27534.0, 40219.799999999996, 46462.59999999993, 58609.0, 0.1817275540509668, 1.616736345121394, 0.06584074468057488], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -77", 33, 0, 0.0, 26934.39393939394, 9532, 57902, 23286.0, 46952.8, 55675.99999999999, 57902.0, 0.17150162666694385, 0.41826867483811286, 0.05660893536467482], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -77", 16, 12, 75.0, 58310.37499999999, 50229, 60097, 60065.5, 60093.5, 60097.0, 60097.0, 0.07337665613405915, 0.07832098159621743, 0.023790087730964492], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -79", 33, 2, 6.0606060606060606, 27005.24242424242, 1583, 60058, 23561.0, 51490.600000000006, 60048.2, 60058.0, 0.17065552406760026, 0.4949727322854394, 0.05632965540512587], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 1117, 0, 0.0, 16903.394807520144, 5856, 46198, 16746.0, 25543.8, 27218.8, 35839.02, 5.753165013339926, 106.30707755666893, 6.966723258341317], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -80", 54, 0, 0.0, 18096.55555555557, 414, 53819, 16370.0, 31844.5, 36702.0, 53819.0, 0.2854122621564482, 2.7024096111918605, 0.11093171908033828], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -78", 33, 2, 6.0606060606060606, 25758.545454545456, 5571, 60066, 21064.0, 53427.4, 60050.6, 60066.0, 0.17784101013693757, 0.4860892879757921, 0.05870142717410635], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -80", 34, 0, 0.0, 27965.088235294115, 4616, 56764, 26067.0, 50715.0, 53578.75, 56764.0, 0.1739308369142623, 1.5456744296091673, 0.06301595751483528], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -79", 16, 15, 93.75, 58964.625, 42496, 60080, 60062.0, 60070.2, 60080.0, 60080.0, 0.07344233399737445, 0.028105678354708112, 0.023811381725711244], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 178011, 0, 0.0, 98.286751942295, 31, 379, 104.0, 119.0, 125.95000000000073, 146.0, 988.4338178950992, 746.1517004227653, 474.911560941786], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 16, 14, 87.5, 58222.1875, 42321, 60068, 60063.0, 60068.0, 60068.0, 60068.0, 0.08021417183880962, 0.04456234082500275, 0.026006938525864057], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -80", 33, 6, 18.181818181818183, 30828.87878787879, 5706, 60072, 26490.0, 60062.8, 60066.4, 60072.0, 0.16794064061720732, 0.41473764204979185, 0.05543353176622663], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 303, 300, 99.00990099009901, 59785.98019801979, 30391, 60117, 60066.0, 60072.0, 60081.0, 60106.92, 1.423885562834237, 0.5368620196735872, 0.8273553807484093], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 33, 2, 6.0606060606060606, 24235.424242424244, 1524, 60061, 22425.0, 47793.60000000001, 60060.3, 60061.0, 0.1604582298053593, 0.4117582681573074, 0.05296375163497211], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -78", 33, 3, 9.090909090909092, 28306.87878787879, 3769, 60046, 26243.0, 57078.40000000001, 60044.6, 60046.0, 0.1711014787315677, 0.5100081807894519, 0.056476855284443246], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -80", 16, 15, 93.75, 59204.8125, 46273, 60118, 60062.0, 60094.9, 60118.0, 60118.0, 0.08309745773715235, 0.045606221922148076, 0.026941753875717366], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -77", 33, 1, 3.0303030303030303, 30155.393939393944, 8171, 60058, 31182.0, 51568.4, 55151.69999999998, 60058.0, 0.16371483851763657, 0.36592146183707897, 0.05403868693257925], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -77", 35, 0, 0.0, 27024.228571428575, 3892, 56347, 26246.0, 49035.19999999999, 54508.59999999999, 56347.0, 0.17893203138979064, 1.3311964002709542, 0.0648279137164183], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -80", 34, 0, 0.0, 28645.647058823528, 1423, 54137, 28877.0, 46973.5, 51210.5, 54137.0, 0.1679219656747747, 1.4510906053216446, 0.06083891529818496], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -78", 34, 0, 0.0, 28471.4705882353, 371, 51620, 28336.5, 45915.5, 51371.75, 51620.0, 0.17570605410712903, 1.25473683658045, 0.06365912702514147], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -79", 34, 0, 0.0, 28548.08823529412, 9155, 53863, 27243.5, 45494.5, 50685.25, 53863.0, 0.16855882207129047, 1.49480728830995, 0.061069651355906994], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -80", 33, 3, 9.090909090909092, 26782.75757575757, 1321, 60067, 22688.0, 58462.40000000001, 60064.9, 60067.0, 0.1660561169035063, 0.46721464923161304, 0.05481149171229016], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 33, 2, 6.0606060606060606, 29529.969696969696, 9209, 60062, 28331.0, 55726.600000000006, 60057.8, 60062.0, 0.17026370235841026, 0.4796073341734729, 0.056200323630022135], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -79", 33, 4, 12.121212121212121, 28604.757575757572, 278, 60101, 25891.0, 60054.4, 60080.0, 60101.0, 0.17372627057076978, 0.5027481571196184, 0.05734324165324236], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -79", 16, 15, 93.75, 59207.9375, 46389, 60071, 60062.0, 60070.3, 60071.0, 60071.0, 0.07429455003041432, 0.04077493859091099, 0.024087686142673394], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -80", 16, 12, 75.0, 56074.18749999999, 36783, 60074, 60062.5, 60069.1, 60074.0, 60074.0, 0.07540163150280163, 0.08048240550054901, 0.02444662271379897], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 33, 3, 9.090909090909092, 28520.727272727272, 6614, 60079, 22391.0, 59821.6, 60068.5, 60079.0, 0.1636628743168315, 0.47415835281996094, 0.0540215346866104], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -78", 16, 15, 93.75, 58914.5, 41682, 60070, 60062.0, 60069.3, 60070.0, 60070.0, 0.07374393340922812, 0.04047274470311153, 0.02390916591002318], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -77", 16, 15, 93.75, 58620.6875, 37023, 60067, 60060.0, 60067.0, 60067.0, 60067.0, 0.0725863891447055, 0.039837451854809074, 0.02353386835550999], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80", 54, 0, 0.0, 15780.740740740739, 424, 44144, 14956.5, 28893.5, 31387.25, 44144.0, 0.2822924235850092, 2.5649372634494045, 0.10971912557307976], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -77", 33, 0, 0.0, 26418.787878787873, 253, 58385, 27769.0, 46031.20000000001, 53014.59999999998, 58385.0, 0.17075000646780328, 0.4820888336610354, 0.05636084197863038], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 1946, 100.0, 1.0453036537283928], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 186166, 1946, "504/Gateway Time-out", 1946, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -80", 33, 4, "504/Gateway Time-out", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -79", 34, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -77", 16, 15, "504/Gateway Time-out", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -78", 16, 16, "504/Gateway Time-out", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -79", 16, 14, "504/Gateway Time-out", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -80", 16, 15, "504/Gateway Time-out", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -77", 34, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -79", 33, 3, "504/Gateway Time-out", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -78", 33, 3, "504/Gateway Time-out", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 33, 5, "504/Gateway Time-out", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -78", 16, 15, "504/Gateway Time-out", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -77", 16, 12, "504/Gateway Time-out", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -80", 16, 15, "504/Gateway Time-out", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 600, 100, "504/Gateway Time-out", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 16, 16, "504/Gateway Time-out", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -80", 33, 3, "504/Gateway Time-out", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 34, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -77", 33, 3, "504/Gateway Time-out", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -79", 33, 3, "504/Gateway Time-out", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -78", 33, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -80", 16, 13, "504/Gateway Time-out", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 300, 300, "504/Gateway Time-out", 300, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 300, 300, "504/Gateway Time-out", 300, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -77", 34, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -78", 34, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 300, 300, "504/Gateway Time-out", 300, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -77", 15, 15, "504/Gateway Time-out", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -79", 16, 14, "504/Gateway Time-out", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -78", 16, 15, "504/Gateway Time-out", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 300, 300, "504/Gateway Time-out", 300, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -77", 16, 12, "504/Gateway Time-out", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -79", 33, 2, "504/Gateway Time-out", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -78", 33, 2, "504/Gateway Time-out", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -79", 16, 15, "504/Gateway Time-out", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 16, 14, "504/Gateway Time-out", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -80", 33, 6, "504/Gateway Time-out", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 303, 300, "504/Gateway Time-out", 300, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 33, 2, "504/Gateway Time-out", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -78", 33, 3, "504/Gateway Time-out", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -80", 16, 15, "504/Gateway Time-out", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -77", 33, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -80", 33, 3, "504/Gateway Time-out", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 33, 2, "504/Gateway Time-out", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -79", 33, 4, "504/Gateway Time-out", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -79", 16, 15, "504/Gateway Time-out", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -80", 16, 12, "504/Gateway Time-out", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 33, 3, "504/Gateway Time-out", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -78", 16, 15, "504/Gateway Time-out", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -77", 16, 15, "504/Gateway Time-out", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
