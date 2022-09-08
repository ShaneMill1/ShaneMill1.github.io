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

    var data = {"OkPercent": 96.56152784358969, "KoPercent": 3.438472156410309};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9110818105028946, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79"], "isController": false}, {"data": [0.06, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -78"], "isController": false}, {"data": [0.07432432432432433, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -77"], "isController": false}, {"data": [0.18585526315789475, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -79"], "isController": false}, {"data": [0.06, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP "], "isController": false}, {"data": [0.9975163873074917, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.0026041666666666665, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -78"], "isController": false}, {"data": [0.17763157894736842, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_CityLevel1234_Summaries_24hourly_REST"], "isController": false}, {"data": [0.0027472527472527475, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -80"], "isController": false}, {"data": [0.18646864686468648, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80"], "isController": false}, {"data": [0.1716171617161716, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79"], "isController": false}, {"data": [0.10666666666666667, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -79"], "isController": false}, {"data": [0.0027472527472527475, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.0027472527472527475, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -77"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 48539, 1669, 3.438472156410309, 2644.4597746142595, 34, 61090, 57.0, 72.0, 84.0, 146.0, 17.494910728702912, 24.38371281748024, 8.226336268239558], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79", 1, 1, 100.0, 44.0, 44, 44, 44.0, 44.0, 44.0, 44.0, 22.727272727272727, 13.338955965909092, 8.766867897727273], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 75, 42, 56.0, 34735.69333333333, 896, 60079, 60043.0, 60066.0, 60069.2, 60079.0, 0.36615730117658546, 1.5250308563809012, 0.1315877801103354], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 74, 37, 50.0, 31173.89189189189, 829, 60076, 32853.0, 60067.5, 60069.25, 60076.0, 0.36790478226500084, 1.7247333078741567, 0.13221578112648466], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 150, 150, 100.0, 60070.34666666667, 60057, 60178, 60068.0, 60080.0, 60082.45, 60175.45, 0.7892078457782642, 0.2967236529537419, 0.29132867744549207], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 182, 0, 0.0, 12401.554945054942, 1529, 15886, 12938.5, 13391.800000000001, 13544.9, 15094.179999999988, 0.9614927438995399, 2.5060782553397187, 0.31455084883432216], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 304, 54, 17.763157894736842, 7587.065789473684, 36, 58700, 1361.0, 34500.5, 45512.75, 55486.84999999999, 1.4313830738951512, 7.978640050710512, 0.5521448380747898], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 150, 150, 100.0, 60069.22666666667, 60057, 60190, 60066.0, 60075.0, 60085.45, 60186.43, 0.7893615117851673, 0.2967814277707905, 0.300635732027554], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 150, 150, 100.0, 60069.76, 60054, 60198, 60067.0, 60074.9, 60082.45, 60191.37, 0.7894612190333836, 0.2968189153592312, 0.29142220780724515], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 193, 0, 0.0, 11687.310880829013, 1527, 12985, 12195.0, 12642.8, 12779.6, 12957.74, 1.0191795868362132, 3.195884427081133, 0.32745125397374425], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 75, 40, 53.333333333333336, 33176.46666666667, 816, 60077, 60042.0, 60067.0, 60070.2, 60077.0, 0.3658268907153135, 1.6086618280979441, 0.1314690388508158], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 230, 11, 4.782608695652174, 42508.256521739124, 16881, 60078, 38685.5, 56867.5, 59629.54999999999, 60063.45, 1.0121457489878543, 93.54980124950492, 0.365716725708502], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80", 1, 0, 0.0, 10054.0, 10054, 10054, 10054.0, 10054.0, 10054.0, 10054.0, 0.09946290033817387, 0.6622441938531928, 0.038367036751541676], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 157, 147, 93.63057324840764, 58676.31847133758, 6090, 60191, 60068.0, 60079.0, 60100.3, 60184.04, 0.656672968496428, 1.004464402417142, 0.7932660762012514], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 44089, 100, 0.22681394452130918, 198.54183583206367, 34, 61061, 57.0, 71.0, 81.0, 121.0, 244.85183046028078, 184.62400977048438, 116.92631356941143], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 192, 0, 0.0, 11724.36458333334, 1498, 13206, 12210.5, 12655.0, 12743.1, 13110.21, 1.0148206093152075, 3.182215797374152, 0.3260507621725618], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 304, 48, 15.789473684210526, 8484.667763157897, 38, 57926, 1532.5, 40038.5, 48742.0, 56679.75, 1.429975869157208, 8.143332590514179, 0.5516020198409152], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 150, 150, 100.0, 60077.193333333336, 60055, 61075, 60067.0, 60081.0, 60094.45, 60627.22000000001, 0.7895069266074362, 0.29683610033580365, 0.456433691944924], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 150, 150, 100.0, 60069.426666666666, 60056, 60176, 60067.0, 60079.9, 60083.45, 60146.93, 0.7894321351507816, 0.2968079805010263, 0.2767638051944635], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 182, 0, 0.0, 12388.181318681321, 916, 17266, 12925.0, 13416.4, 13584.25, 16707.409999999993, 0.9603968233028152, 2.503221798237514, 0.3141923201234796], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 150, 150, 100.0, 60098.433333333334, 60056, 61090, 60068.0, 60082.0, 60143.35, 61087.45, 0.789436289859954, 0.29680954257429915, 0.3453783768137299], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -80", 193, 0, 0.0, 11676.031088082895, 1529, 12972, 12225.0, 12645.8, 12725.3, 12959.78, 1.0192980047109523, 3.1962557550067072, 0.3274893003417025], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 303, 54, 17.821782178217823, 8514.656765676562, 38, 58423, 1422.0, 41142.80000000002, 48205.000000000015, 56120.43999999999, 1.4278578362534518, 7.947783676298031, 0.5507850051954234], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 303, 54, 17.821782178217823, 8879.795379537945, 38, 57101, 1461.0, 42381.200000000004, 46903.40000000002, 53489.159999999996, 1.4252317765537612, 7.9345398806192, 0.5497720231823591], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 75, 31, 41.333333333333336, 26051.86666666667, 755, 60200, 4087.0, 60068.4, 60070.0, 60200.0, 0.37135698794822786, 2.0148582638689456, 0.1334564175438944], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 182, 0, 0.0, 12360.76373626374, 903, 17166, 12932.0, 13397.3, 13590.25, 14961.519999999968, 0.9605286073918482, 2.5035652862586355, 0.31423543308229407], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 150, 150, 100.0, 60068.24000000001, 60055, 60204, 60066.0, 60071.9, 60080.45, 60194.31, 0.7892992075435956, 0.2967580028362152, 0.32527760310878645], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 182, 0, 0.0, 12376.175824175823, 1399, 15699, 12892.5, 13344.7, 13507.15, 14191.719999999978, 0.9607162086548918, 2.5040542586913146, 0.3142968065423718], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -77", 192, 0, 0.0, 11686.432291666662, 1675, 13103, 12185.0, 12639.1, 12743.25, 13056.5, 1.0195899336735506, 3.1971711689704794, 0.32758309392441226], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503/Service Unavailable", 114, 6.8304373876572795, 0.23486268773563526], "isController": false}, {"data": ["504/Gateway Time-out", 1458, 87.35769922109047, 3.0037701641978614], "isController": false}, {"data": ["502/Bad Gateway", 47, 2.816057519472738, 0.09682935371556893], "isController": false}, {"data": ["502/Proxy Error", 50, 2.995805871779509, 0.10300995076124353], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 48539, 1669, "504/Gateway Time-out", 1458, "503/Service Unavailable", 114, "502/Proxy Error", 50, "502/Bad Gateway", 47, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79", 1, 1, "503/Service Unavailable", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 75, 42, "504/Gateway Time-out", 42, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 74, 37, "504/Gateway Time-out", 37, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 150, 150, "504/Gateway Time-out", 150, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 304, 54, "503/Service Unavailable", 28, "502/Proxy Error", 16, "502/Bad Gateway", 10, "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 150, 150, "504/Gateway Time-out", 150, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 150, 150, "504/Gateway Time-out", 150, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 75, 40, "504/Gateway Time-out", 40, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 230, 11, "504/Gateway Time-out", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 157, 147, "504/Gateway Time-out", 147, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 44089, 100, "504/Gateway Time-out", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 304, 48, "503/Service Unavailable", 30, "502/Proxy Error", 10, "502/Bad Gateway", 8, "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 150, 150, "504/Gateway Time-out", 150, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 150, 150, "504/Gateway Time-out", 150, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 150, 150, "504/Gateway Time-out", 150, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 303, 54, "503/Service Unavailable", 28, "502/Bad Gateway", 15, "502/Proxy Error", 11, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 303, 54, "503/Service Unavailable", 27, "502/Bad Gateway", 14, "502/Proxy Error", 13, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 75, 31, "504/Gateway Time-out", 31, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 150, 150, "504/Gateway Time-out", 150, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
