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

    var data = {"OkPercent": 59.87685765542292, "KoPercent": 40.12314234457708};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.13719518947531617, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.25, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77"], "isController": false}, {"data": [0.021542738012508687, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -77"], "isController": false}, {"data": [0.297196261682243, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -78"], "isController": false}, {"data": [0.17391304347826086, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -77"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -80"], "isController": false}, {"data": [0.27521929824561403, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.3375776397515528, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -79"], "isController": false}, {"data": [0.125, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -80"], "isController": false}, {"data": [0.020166898470097356, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -78"], "isController": false}, {"data": [0.06286959228135698, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77"], "isController": false}, {"data": [0.01598245064243184, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_CityLevel1234_Summaries_24hourly_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.012972804001250391, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80"], "isController": false}, {"data": [0.016943834326953247, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -78"], "isController": false}, {"data": [0.026829268292682926, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -79"], "isController": false}, {"data": [0.016666666666666666, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78"], "isController": false}, {"data": [0.3225, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.02510460251046025, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -80"], "isController": false}, {"data": [0.015298157976896659, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77"], "isController": false}, {"data": [0.1589041095890411, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.025, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -80"], "isController": false}, {"data": [0.125, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -77"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -79"], "isController": false}, {"data": [0.13859275053304904, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP "], "isController": false}, {"data": [9.339975093399751E-4, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.32464307883302296, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST"], "isController": false}, {"data": [0.18221343873517787, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -78"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -80"], "isController": false}, {"data": [0.1737925574030087, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -80"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -79"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -80"], "isController": false}, {"data": [0.1848341232227488, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -78"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -78"], "isController": false}, {"data": [0.33851897946484133, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -77"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 45151, 18116, 40.12314234457708, 2847.6000310070926, 20, 63576, 125.0, 11088.000000000015, 17202.600000000006, 60064.0, 16.71028886878846, 527.5021948972155, 6.2853312629210425], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_1Point_maxt_SOAP 34 -77", 2, 0, 0.0, 1182.5, 790, 1575, 1182.5, 1575.0, 1575.0, 1575.0, 0.017909592377677485, 0.03125433747940397, 0.005684196799555842], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79", 24, 15, 62.5, 1406.9999999999998, 25, 5197, 75.5, 4345.5, 4997.0, 5197.0, 0.15199782136456044, 0.5834994490078976, 0.05803823061869447], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -79", 2, 0, 0.0, 2014.5, 1804, 2225, 2014.5, 2225.0, 2225.0, 2225.0, 0.04415303441729033, 0.07627609168377597, 0.014013414243768904], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77", 19, 15, 78.94736842105263, 628.1578947368421, 39, 3003, 61.0, 2836.0, 3003.0, 3003.0, 0.1289849562808885, 0.206889058935942, 0.04925109170490957], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 1439, 696, 48.36692147324531, 1589.894371091037, 22, 11096, 986.0, 4125.0, 4920.0, 5792.799999999999, 7.8855796366824675, 25.575309486053648, 2.8030771364769707], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -79", 2, 0, 0.0, 5257.0, 4863, 5651, 5257.0, 5651.0, 5651.0, 5651.0, 0.21922613175490518, 1.3226357831853557, 0.07792803902225146], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -77", 1, 1, 100.0, 144.0, 144, 144, 144.0, 144.0, 144.0, 144.0, 6.944444444444444, 4.075792100694445, 2.468532986111111], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 3210, 1429, 44.517133956386296, 2834.018691588793, 21, 22191, 115.0, 11730.000000000002, 13946.749999999996, 17157.129999999997, 17.072107049025135, 1887.1880376583556, 6.235320347983789], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -78", 1, 0, 0.0, 1397.0, 1397, 1397, 1397.0, 1397.0, 1397.0, 1397.0, 0.7158196134574087, 0.34602608267716534, 0.23138309770937723], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 1265, 0, 0.0, 1719.690909090911, 324, 4564, 1675.0, 2445.6000000000004, 2629.7, 3321.7999999999984, 7.019120862047918, 20.903445429456447, 2.268875981775255], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -77", 1, 0, 0.0, 2159.0, 2159, 2159, 2159.0, 2159.0, 2159.0, 2159.0, 0.4631773969430292, 1.3764148622047245, 0.14700454492820753], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -80", 3, 0, 0.0, 1641.3333333333333, 790, 2520, 1614.0, 2520.0, 2520.0, 2520.0, 0.02663896214603479, 0.05706738602964028, 0.008454748727989557], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 1824, 513, 28.125, 4955.067434210535, 23, 23254, 307.0, 13505.5, 15759.0, 19987.75, 9.724888035828535, 1907.4121177056675, 3.5518634037108123], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 1610, 0, 0.0, 1355.165838509316, 199, 3179, 1279.0, 2024.0, 2242.8999999999996, 2636.5599999999995, 8.914185736195469, 24.905747452397694, 2.8292093401011016], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -80", 4, 0, 0.0, 2115.25, 1136, 2956, 2184.5, 2956.0, 2956.0, 2956.0, 0.04380921088658891, 0.11134128059799572, 0.01416098515962981], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 1438, 718, 49.93045897079277, 1539.0987482614737, 23, 8800, 262.0, 4047.600000000001, 4728.0, 6092.9299999999985, 7.852731254198044, 25.086906761785922, 2.791400563015711], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -78", 1, 1, 100.0, 143.0, 143, 143, 143.0, 143.0, 143.0, 143.0, 6.993006993006993, 4.104294143356643, 2.4857954545454546], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 3213, 1576, 49.05073140367258, 3026.4394646747623, 23, 31855, 111.0, 6479.2, 7037.9, 7778.58000000002, 15.330953926022064, 282.18450399556724, 5.479618297777417], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80", 24, 19, 79.16666666666667, 768.3750000000003, 25, 5233, 56.5, 3610.0, 5039.75, 5233.0, 0.15199782136456044, 0.2738447077050229, 0.05803823061869447], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -77", 4, 4, 100.0, 77.5, 39, 163, 54.0, 163.0, 163.0, 163.0, 0.05332693410124119, 0.03129832753402925, 0.018956058606300577], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77", 20, 15, 75.0, 953.1000000000001, 29, 4560, 58.5, 4413.7, 4552.85, 4560.0, 0.12420817289777666, 0.31482647730095636, 0.04742714414358464], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 3191, 2339, 73.29990598558446, 787.8335944844872, 20, 60074, 59.0, 2445.2000000000007, 3389.7999999999993, 4472.319999999998, 13.367292651968649, 39.12097912355425, 5.10411272160131], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -79", 5, 3, 60.0, 2765.6, 44, 8886, 52.0, 8886.0, 8886.0, 8886.0, 0.03691998700416457, 0.1020275187738134, 0.013123901630386627], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79", 30, 23, 76.66666666666667, 907.8666666666667, 23, 5325, 61.0, 4024.800000000001, 4911.95, 5325.0, 0.19884800721155438, 0.5047968974739675, 0.07592731525363064], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 456, 27, 5.921052631578948, 20345.31359649124, 29, 45033, 22479.0, 23747.1, 24205.399999999998, 26109.03, 2.3903380021806595, 974.1281018124764, 0.8286816316153652], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 227, 227, 100.0, 39701.77533039647, 22, 60139, 60049.0, 60072.0, 60075.6, 60119.88, 1.1948940650085538, 0.5347486100144756, 0.5180985984998027], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 3199, 2380, 74.39824945295405, 770.3794935917476, 21, 60044, 58.0, 2321.0, 3066.0, 4814.0, 13.394184269474742, 37.24438092720916, 5.114380907582641], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 3187, 2359, 74.01945403200502, 892.037025415752, 21, 60087, 59.0, 2453.800000000001, 3415.5999999999976, 4779.479999999997, 13.346007923014431, 35.87851971122036, 5.095985447166643], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -78", 2, 1, 50.0, 2831.0, 49, 5613, 2831.0, 5613.0, 5613.0, 5613.0, 0.2201430930104568, 0.7284715533846999, 0.07825399009356081], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 1435, 741, 51.637630662020904, 1452.468989547035, 24, 8637, 77.0, 3965.600000000001, 4719.400000000001, 6386.480000000003, 7.853847290559511, 24.754514893234198, 2.7917972790660763], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78", 30, 23, 76.66666666666667, 848.3333333333331, 24, 4695, 50.0, 4059.1000000000004, 4675.75, 4695.0, 0.20223810165835243, 0.5134030141903735, 0.0772217751449373], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 3000, 1170, 39.0, 3104.5946666666705, 23, 46503, 149.0, 10577.6, 11383.399999999994, 23761.24999999872, 15.638602325981452, 679.5726183793325, 6.383726340097898], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 1434, 716, 49.9302649930265, 1540.747559274754, 22, 8805, 195.0, 4049.0, 4830.25, 6295.0000000000055, 7.8393212481686385, 24.86432206818132, 2.7866337249349455], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 3203, 2331, 72.77552294723696, 795.5825788323439, 21, 60044, 59.0, 2361.5999999999995, 2965.9999999999945, 4703.88, 13.39584448608137, 39.291504363686926, 5.1150148379470854], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 730, 333, 45.61643835616438, 12325.88767123289, 26, 60388, 563.0, 60043.9, 60055.0, 60228.45, 3.9337831138318284, 140.0094780849886, 1.4828518378311384], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78", 20, 16, 80.0, 469.8, 44, 2835, 56.0, 2621.400000000002, 2829.0, 2835.0, 0.1255216995638121, 0.19493863165657263, 0.04792869582954153], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -80", 5, 2, 40.0, 3361.0, 49, 7628, 4000.0, 7628.0, 7628.0, 7628.0, 0.036920804873546244, 0.14218836533136422, 0.01312419235739339], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -77", 4, 0, 0.0, 2241.75, 1082, 2946, 2469.5, 2946.0, 2946.0, 2946.0, 0.04361146545426793, 0.112403867382985, 0.014097065493518246], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -77", 1, 0, 0.0, 1977.0, 1977, 1977, 1977.0, 1977.0, 1977.0, 1977.0, 0.5058168942842691, 1.5031257903388973, 0.1605375885179565], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -79", 3, 0, 0.0, 2135.0, 1199, 3332, 1874.0, 3332.0, 3332.0, 3332.0, 0.06372267890142101, 0.14737943801907433, 0.020597858121455426], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 469, 58, 12.366737739872068, 20167.624733475466, 26, 46402, 22417.0, 37414.0, 41052.0, 44401.5, 2.305620010225351, 366.94969164944007, 2.7762006568436113], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 1606, 297, 18.493150684931507, 5527.153175591533, 25, 21675, 6617.0, 7382.3, 9028.599999999999, 9473.86, 8.800771574494203, 336.4563543499019, 4.916055996690121], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 1611, 0, 0.0, 1371.7951582867786, 226, 3285, 1306.0, 1986.8, 2222.0, 2870.3199999999983, 8.94840917170281, 24.670641234961007, 2.8400712703158324], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 152, 50, 32.89473684210526, 58163.4210526316, 13235, 63576, 60151.5, 61292.4, 61777.5, 63513.99, 0.8045265202640117, 460.54249385357616, 0.46197421280785045], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 1265, 0, 0.0, 1697.6181818181815, 353, 4525, 1678.0, 2376.0, 2644.8, 3302.0999999999985, 7.004468463280528, 20.87500419610574, 2.2641397083455614], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -78", 3, 0, 0.0, 2436.3333333333335, 2149, 2684, 2476.0, 2684.0, 2684.0, 2684.0, 0.12516688918558078, 0.40398102417807075, 0.040459219062917225], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -80", 1608, 0, 0.0, 1355.1019900497495, 275, 3232, 1302.0, 1967.0, 2199.95, 2585.920000000001, 8.89518288230478, 25.01586511600248, 2.8231781608877484], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -80", 4, 3, 75.0, 1780.0, 39, 6982, 49.5, 6982.0, 6982.0, 6982.0, 0.05333404445392605, 0.10394669845597942, 0.018958586114481528], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -80", 3, 0, 0.0, 2038.6666666666667, 1792, 2206, 2118.0, 2206.0, 2206.0, 2206.0, 0.06238822110385559, 0.14429306996838998, 0.020166505063843945], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 1263, 0, 0.0, 1762.2969121140147, 241, 4853, 1737.0, 2472.2000000000003, 2769.9999999999995, 3615.319999999996, 7.015809178878137, 21.25665218174723, 2.267805506063148], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -79", 3, 0, 0.0, 2044.0, 1406, 2368, 2358.0, 2368.0, 2368.0, 2368.0, 0.12683916793505834, 0.29335686464146793, 0.04099977010400811], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -80", 1, 0, 0.0, 915.0, 915, 915, 915.0, 915.0, 915.0, 915.0, 1.092896174863388, 0.5283043032786885, 0.3468664617486339], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 1266, 0, 0.0, 1727.6508688783586, 314, 4602, 1677.5, 2456.7999999999997, 2799.249999999999, 3478.619999999999, 7.017582758697146, 20.96109201431232, 2.2683788018835505], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -78", 1, 0, 0.0, 1457.0, 1457, 1457, 1457.0, 1457.0, 1457.0, 1457.0, 0.6863417982155113, 2.0395879804392587, 0.21783309025394645], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -77", 1607, 0, 0.0, 1360.9701306782817, 190, 3254, 1311.0, 1961.2, 2197.2, 2759.1600000000017, 8.910353087295954, 25.085238043173902, 2.827992923214048], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80", 19, 15, 78.94736842105263, 699.8947368421051, 28, 4039, 60.0, 2973.0, 4039.0, 4039.0, 0.1289998438422943, 0.273899236694345, 0.04925677631087604], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -77", 1, 0, 0.0, 1413.0, 1413, 1413, 1413.0, 1413.0, 1413.0, 1413.0, 0.7077140835102619, 0.3421078821656051, 0.22876304847841472], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503/Service Unavailable", 17046, 94.09361890041951, 37.753316648579215], "isController": false}, {"data": ["502/Bad Gateway", 362, 1.9982336056524619, 0.8017541139731125], "isController": false}, {"data": ["504/Gateway Time-out", 309, 1.705674541841466, 0.6843702243582644], "isController": false}, {"data": ["502/Proxy Error", 399, 2.2024729520865534, 0.8837013576664968], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 45151, 18116, "503/Service Unavailable", 17046, "502/Proxy Error", 399, "502/Bad Gateway", 362, "504/Gateway Time-out", 309, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79", 24, 15, "503/Service Unavailable", 14, "502/Proxy Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77", 19, 15, "503/Service Unavailable", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 1439, 696, "503/Service Unavailable", 696, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -77", 1, 1, "503/Service Unavailable", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 3210, 1429, "503/Service Unavailable", 1429, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 1824, 513, "503/Service Unavailable", 513, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 1438, 718, "503/Service Unavailable", 718, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -78", 1, 1, "503/Service Unavailable", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 3213, 1576, "503/Service Unavailable", 1408, "502/Proxy Error", 88, "502/Bad Gateway", 80, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80", 24, 19, "503/Service Unavailable", 17, "502/Proxy Error", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -77", 4, 4, "503/Service Unavailable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77", 20, 15, "503/Service Unavailable", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 3191, 2339, "503/Service Unavailable", 2215, "502/Bad Gateway", 67, "502/Proxy Error", 51, "504/Gateway Time-out", 6, "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -79", 5, 3, "503/Service Unavailable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79", 30, 23, "503/Service Unavailable", 21, "502/Proxy Error", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 456, 27, "503/Service Unavailable", 23, "502/Proxy Error", 4, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 227, 227, "504/Gateway Time-out", 150, "503/Service Unavailable", 77, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 3199, 2380, "503/Service Unavailable", 2243, "502/Proxy Error", 71, "502/Bad Gateway", 60, "504/Gateway Time-out", 6, "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 3187, 2359, "503/Service Unavailable", 2214, "502/Bad Gateway", 70, "502/Proxy Error", 63, "504/Gateway Time-out", 12, "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -78", 2, 1, "503/Service Unavailable", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 1435, 741, "503/Service Unavailable", 741, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78", 30, 23, "503/Service Unavailable", 21, "502/Proxy Error", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 3000, 1170, "503/Service Unavailable", 1112, "502/Proxy Error", 38, "502/Bad Gateway", 20, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 1434, 716, "503/Service Unavailable", 716, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 3203, 2331, "503/Service Unavailable", 2190, "502/Proxy Error", 72, "502/Bad Gateway", 63, "504/Gateway Time-out", 6, "", ""], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 730, 333, "503/Service Unavailable", 254, "504/Gateway Time-out", 79, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78", 20, 16, "503/Service Unavailable", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -80", 5, 2, "503/Service Unavailable", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 469, 58, "503/Service Unavailable", 58, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 1606, 297, "503/Service Unavailable", 290, "502/Proxy Error", 5, "502/Bad Gateway", 2, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 152, 50, "504/Gateway Time-out", 50, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -80", 4, 3, "503/Service Unavailable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80", 19, 15, "503/Service Unavailable", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
