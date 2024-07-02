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

    var data = {"OkPercent": 99.88995033565148, "KoPercent": 0.11004966434852374};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.456656407197958, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -79"], "isController": false}, {"data": [0.4870730776569357, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -78"], "isController": false}, {"data": [0.4860054612834016, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.4869123311829953, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -77"], "isController": false}, {"data": [0.48811917382562603, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.4872272852803093, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -79"], "isController": false}, {"data": [0.48676739486093734, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -77"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -80"], "isController": false}, {"data": [0.42560175054704596, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP "], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -77"], "isController": false}, {"data": [0.4390632105502501, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.4879826544263505, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -78"], "isController": false}, {"data": [0.4875698324022346, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_CityLevel1234_Summaries_24hourly_REST"], "isController": false}, {"data": [0.4868470236426502, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.4875034648433891, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -80"], "isController": false}, {"data": [0.48768181818181816, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80"], "isController": false}, {"data": [0.4879390018484288, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79"], "isController": false}, {"data": [0.4866653875671527, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -79"], "isController": false}, {"data": [9.11854103343465E-4, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.48680916172106825, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -80"], "isController": false}, {"data": [0.48673666758773143, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -78"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -80"], "isController": false}, {"data": [0.4889632879242669, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -77"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 281691, 310, 0.11004966434852374, 1016.0076608766392, 441, 90014, 679.0, 1182.0, 2323.0, 6202.610000000062, 77.05488304763031, 2548.5844734283974, 27.874148878527727], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79", 1, 0, 0.0, 814.0, 814, 814, 814.0, 814.0, 814.0, 814.0, 1.2285012285012284, 5.155146268427519, 0.48228270884520885], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -79", 1, 0, 0.0, 662.0, 662, 662, 662.0, 662.0, 662.0, 662.0, 1.5105740181268883, 4.496317975830816, 0.4956570996978852], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 10482, 2, 0.019080328181644724, 838.3772180881529, 466, 90006, 690.0, 904.0, 1024.0, 3824.1900000000005, 2.9172515827523133, 25.906607122493256, 1.0683294370430836], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 10254, 1, 0.009752291788570315, 847.6875365710939, 466, 74275, 688.0, 900.5, 1037.0, 3994.000000000029, 2.850086928485165, 25.304143295805616, 1.0437330060370478], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 2472, 5, 0.2022653721682848, 2922.593851132689, 2007, 79634, 2430.0, 3251.0, 4566.599999999997, 12116.079999999996, 0.6762013241728844, 381.45859579688016, 0.25423584942046923], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 21547, 7, 0.03248712117696199, 838.6215714484637, 447, 90002, 677.0, 874.0, 1000.0, 3836.970000000005, 5.988847796492021, 20.23997434477608, 2.087908850925441], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 10942, 2, 0.018278194114421494, 822.8474684701147, 469, 70672, 680.0, 888.0, 1015.8500000000004, 3838.1399999999994, 3.039975595736033, 12.701761923298543, 1.1934279194198096], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 2483, 9, 0.36246476037051956, 2888.0289971808297, 1697, 80502, 2302.0, 2903.0, 4725.799999999988, 14975.199999999953, 0.6895287710947762, 49.64987497648229, 0.2673270723873302], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 5993, 21, 0.35040881027865844, 2986.259302519601, 1846, 87384, 2429.0, 3191.6000000000004, 4500.500000000003, 12035.520000000117, 1.65484646625527, 932.1472551355156, 0.6221834858479287], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 21726, 6, 0.027616680475006903, 831.0724477584434, 468, 88867, 664.0, 856.0, 981.0, 3783.970000000005, 6.030892292249834, 17.947251838817003, 1.9788865333944767], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 10391, 9, 0.0866134154556828, 899.0416706765468, 471, 90002, 692.0, 905.8000000000011, 1040.3999999999996, 3952.5599999999995, 2.8860177149438835, 25.596029084054607, 1.0568912530312073], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -80", 1, 0, 0.0, 643.0, 643, 643, 643.0, 643.0, 643.0, 643.0, 1.5552099533437014, 13.791857017884913, 0.5695348950233281], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 2285, 3, 0.13129102844638948, 1575.4227571115973, 986, 60060, 1260.0, 1615.4, 2105.7999999999993, 8643.979999999987, 0.6346539969175536, 46.586905698870005, 0.233656793787029], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 1175, 2, 0.1702127659574468, 3064.1182978723446, 2031, 90000, 2616.0, 3553.600000000001, 5066.200000000002, 11239.720000000001, 0.32629408233052287, 119.68597625653422, 0.40117602505285965], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -77", 1, 0, 0.0, 574.0, 574, 574, 574.0, 574.0, 574.0, 574.0, 1.7421602787456445, 5.185648954703833, 0.5716463414634146], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 4398, 11, 0.2501136880400182, 1638.5036380172835, 805, 90014, 1214.0, 1556.0, 2002.6500000000024, 9713.580000000056, 1.209381700168483, 92.97797035818652, 0.6885444640607672], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 21677, 8, 0.03690547584997924, 823.0753794344246, 464, 90003, 663.0, 854.0, 979.0, 3811.980000000003, 6.017542676195021, 17.905979682326656, 1.9745061906264914], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 10740, 2, 0.0186219739292365, 823.1422718808179, 457, 89999, 679.0, 887.0, 1014.0, 3784.7700000000004, 2.9871253229794488, 12.481501582390703, 1.1726800584352914], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -79", 2, 0, 0.0, 625.5, 561, 690, 625.5, 690.0, 690.0, 690.0, 0.001154381831415232, 0.01023612014575225, 4.2274725271553893E-4], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 693, 6, 0.8658008658008658, 10350.847041847052, 8215, 90000, 9097.0, 11773.2, 13579.499999999998, 42468.83999999898, 0.19227882593938472, 254.00502120555564, 0.11247560228290181], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 358, 171, 47.76536312849162, 20088.843575419007, 6220, 90001, 16069.0, 32174.90000000005, 47446.000000000015, 90000.0, 0.09900187854681836, 19.2457816026337, 0.03538543705872609], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 21402, 3, 0.014017381553125876, 811.8937949724292, 473, 90003, 677.0, 874.0, 1000.0, 3712.9900000000016, 5.941087134001467, 20.080942491157213, 2.071257916834496], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 547, 6, 1.0968921389396709, 6581.036563071297, 4473, 81838, 5211.0, 8328.0, 11400.200000000017, 39242.75999999973, 0.15192954690831706, 85.90508103259249, 0.06750775765945728], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -80", 21646, 6, 0.027718747112630508, 816.2740460131209, 462, 85812, 665.0, 859.0, 987.9500000000007, 3744.870000000021, 6.012154851733418, 17.89147632238382, 1.9727383107250276], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 11000, 4, 0.03636363636363636, 829.1649999999997, 455, 76701, 681.0, 892.0, 1021.9499999999989, 3774.9299999999985, 3.055169416087689, 12.76452440125623, 1.1993926809250497], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 10820, 2, 0.018484288354898338, 809.972828096121, 466, 89999, 681.0, 890.0, 1009.9499999999989, 3688.8999999999905, 3.0071819397879906, 12.566128863652093, 1.1805538474558324], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 10424, 2, 0.01918649270913277, 854.2613200306998, 468, 90005, 691.0, 905.0, 1028.75, 3950.25, 2.898727246284198, 25.753367821242463, 1.0615456224185296], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 3290, 5, 0.1519756838905775, 2189.7778115501483, 1421, 89206, 1822.0, 2424.0, 3235.249999999999, 8818.490000000023, 0.9048121153517189, 285.0535124539034, 0.3790667944198119], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 21568, 4, 0.018545994065281898, 829.9649944361955, 448, 90007, 676.0, 874.0, 1001.0, 3842.950000000008, 5.996317913832956, 20.26854549168945, 2.0905131789437164], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 21714, 6, 0.027631942525559547, 832.9111633047802, 441, 90005, 676.0, 874.0, 996.0, 3827.9600000000064, 6.028955311486306, 20.377447950751453, 2.1018916466802846], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -80", 3, 0, 0.0, 1776.6666666666667, 634, 3879, 817.0, 3879.0, 3879.0, 3879.0, 0.0010533574716049938, 0.0031353843490742393, 3.456329203703886E-4], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -77", 21655, 7, 0.03232509812976218, 825.1357654121402, 441, 90001, 663.0, 857.0, 971.0, 3683.0, 6.0219320126517575, 17.91975738659969, 1.9759464416513581], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["408/Request Timeout", 1, 0.3225806451612903, 3.5499891725330237E-4], "isController": false}, {"data": ["502/Bad Gateway", 1, 0.3225806451612903, 3.5499891725330237E-4], "isController": false}, {"data": ["504/Gateway Time-out", 25, 8.064516129032258, 0.00887497293133256], "isController": false}, {"data": ["502/Proxy Error", 111, 35.806451612903224, 0.03940487981511656], "isController": false}, {"data": ["Was not a proper XML response", 172, 55.483870967741936, 0.06105981376756801], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 281691, 310, "Was not a proper XML response", 172, "502/Proxy Error", 111, "504/Gateway Time-out", 25, "408/Request Timeout", 1, "502/Bad Gateway", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 10482, 2, "504/Gateway Time-out", 1, "502/Proxy Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 10254, 1, "502/Proxy Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 2472, 5, "502/Proxy Error", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 21547, 7, "502/Proxy Error", 5, "408/Request Timeout", 1, "504/Gateway Time-out", 1, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 10942, 2, "502/Proxy Error", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 2483, 9, "502/Proxy Error", 8, "Was not a proper XML response", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 5993, 21, "502/Proxy Error", 20, "Was not a proper XML response", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 21726, 6, "502/Proxy Error", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 10391, 9, "502/Proxy Error", 6, "504/Gateway Time-out", 2, "Was not a proper XML response", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 2285, 3, "Was not a proper XML response", 2, "502/Proxy Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 1175, 2, "504/Gateway Time-out", 1, "Was not a proper XML response", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 4398, 11, "502/Proxy Error", 9, "504/Gateway Time-out", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 21677, 8, "502/Proxy Error", 5, "504/Gateway Time-out", 2, "Was not a proper XML response", 1, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 10740, 2, "504/Gateway Time-out", 1, "502/Proxy Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 693, 6, "502/Proxy Error", 5, "504/Gateway Time-out", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 358, 171, "Was not a proper XML response", 161, "502/Proxy Error", 6, "504/Gateway Time-out", 4, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 21402, 3, "502/Proxy Error", 2, "504/Gateway Time-out", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 547, 6, "502/Proxy Error", 3, "Was not a proper XML response", 3, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -80", 21646, 6, "502/Proxy Error", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 11000, 4, "502/Proxy Error", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 10820, 2, "504/Gateway Time-out", 1, "502/Proxy Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 10424, 2, "504/Gateway Time-out", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 3290, 5, "502/Proxy Error", 4, "Was not a proper XML response", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 21568, 4, "504/Gateway Time-out", 2, "502/Proxy Error", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 21714, 6, "502/Proxy Error", 3, "504/Gateway Time-out", 2, "502/Bad Gateway", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -77", 21655, 7, "502/Proxy Error", 5, "504/Gateway Time-out", 2, "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
