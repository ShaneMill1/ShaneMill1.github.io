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

    var data = {"OkPercent": 92.63491083146761, "KoPercent": 7.3650891685323865};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.08700687099513627, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0784313725490196, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -78"], "isController": false}, {"data": [0.09103641456582633, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -80"], "isController": false}, {"data": [0.16241610738255033, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.013064133016627079, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -77"], "isController": false}, {"data": [0.10354223433242507, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77"], "isController": false}, {"data": [0.14251668255481412, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.2816011235955056, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.034518828451882845, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -79"], "isController": false}, {"data": [0.07563025210084033, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -77"], "isController": false}, {"data": [0.02005730659025788, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}, {"data": [0.19093406593406592, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP "], "isController": false}, {"data": [0.010978956999085087, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.03347280334728033, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -78"], "isController": false}, {"data": [0.10626702997275204, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_CityLevel1234_Summaries_24hourly_REST"], "isController": false}, {"data": [0.016587677725118485, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.038702928870292884, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -80"], "isController": false}, {"data": [0.09809264305177112, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80"], "isController": false}, {"data": [0.09809264305177112, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79"], "isController": false}, {"data": [0.0700280112044818, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -79"], "isController": false}, {"data": [0.009501187648456057, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -80"], "isController": false}, {"data": [0.19234234234234235, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.009501187648456057, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -78"], "isController": false}, {"data": [0.029350104821802937, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -77"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 12953, 954, 7.3650891685323865, 10180.381378831074, 1, 90005, 5862.0, 23073.800000000007, 38092.09999999999, 90002.0, 4.409141658951038, 377.29584366841146, 1.7704177672784704], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 357, 47, 13.165266106442576, 6429.081232492994, 1, 35339, 5001.0, 16719.79999999999, 26232.3, 33287.200000000004, 1.9393215090854767, 12.307074729404894, 0.6912620613439443], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 357, 26, 7.282913165266106, 6115.3361344537825, 1, 35361, 5059.0, 11473.799999999988, 21257.199999999993, 32890.24000000002, 1.9111758281761921, 12.733173405078269, 0.6812296653167091], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 745, 63, 8.456375838926174, 12466.320805369127, 1, 80904, 9335.0, 27392.8, 35796.799999999996, 70076.63999999991, 3.470249019479975, 967.375283195028, 1.2708431467822174], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 421, 0, 0.0, 5191.460807600945, 196, 10462, 5123.0, 8226.2, 8879.3, 9282.859999999999, 2.237623972872131, 6.64982870682874, 0.7254796474546363], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 367, 44, 11.989100817438691, 6143.373297002725, 2, 90001, 2343.0, 6297.199999999998, 32981.59999999999, 86104.15999999999, 1.7374755001751678, 13.938681384216432, 0.6651273399108064], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 1049, 76, 7.244995233555767, 8683.742612011427, 1, 85992, 8338.0, 11597.0, 19753.0, 75788.0, 5.125498991024269, 339.0040311695323, 1.9370782319593673], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 712, 56, 7.865168539325842, 14020.372191011224, 1, 90002, 7953.5, 40028.100000000006, 51841.15, 75874.65000000001, 2.7869981837539926, 540.5530429643463, 1.020629217683347], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 478, 0, 0.0, 4755.7112970711305, 680, 10296, 4667.5, 7848.4, 8413.05, 9579.699999999997, 2.5291808205551503, 7.284901818973089, 0.8051884252939246], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 357, 28, 7.8431372549019605, 6438.280112044823, 1, 35323, 4906.0, 15591.99999999999, 25902.199999999993, 34402.960000000014, 1.902579407375826, 12.351402619377533, 0.6781655114181412], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 698, 46, 6.590257879656161, 13355.822349570211, 1, 37898, 13405.0, 24765.100000000002, 26550.6, 37685.42, 3.6277266419620906, 249.2142104692137, 1.3001715601563353], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 364, 103, 28.296703296703296, 30647.750000000015, 1, 90004, 21422.0, 90000.0, 90001.0, 90003.0, 1.3594974341353372, 12.511267383546347, 1.6383006188701232], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 1093, 57, 5.215004574565416, 8547.061299176581, 1, 69993, 6049.0, 11448.800000000001, 33733.9, 62335.479999999894, 5.581172097203287, 283.4261411036347, 3.1230582145483234], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 478, 0, 0.0, 4561.305439330543, 290, 10312, 4554.0, 7681.500000000001, 8261.099999999999, 9677.869999999988, 2.5368991449906857, 7.320764327111385, 0.807645626237269], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 367, 58, 15.803814713896458, 4312.373297002726, 2, 89740, 2292.0, 5500.8, 6286.5999999999985, 84411.99999999999, 2.013286594363895, 15.60262288694052, 0.7707112744049285], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 182, 63, 34.61538461538461, 58982.3846153846, 2, 90005, 62195.0, 90003.0, 90003.0, 90004.17, 0.69727793421834, 616.7634829715247, 0.4010709992720725], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 399, 3, 0.7518796992481203, 22245.16290726816, 2, 53140, 21026.0, 26810.0, 30543.0, 47287.0, 2.178708719203215, 1201.0699933212204, 0.7574417031604928], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 422, 0, 0.0, 5291.5236966824705, 476, 11083, 5258.0, 8169.1, 8826.449999999999, 10015.48, 2.2144791251233182, 6.637513348533826, 0.7179756538485759], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 109, 91, 83.4862385321101, 83429.11009174313, 8046, 90005, 90002.0, 90004.0, 90004.0, 90005.0, 0.5550350334039433, 0.1844978301440036, 0.2412017479147996], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -80", 478, 0, 0.0, 4617.968619246859, 678, 10597, 4651.0, 7830.7, 8357.699999999999, 10120.949999999993, 2.525225843943156, 7.3684888266680755, 0.8039293214115907], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 367, 66, 17.983651226158038, 6389.629427792918, 2, 90002, 2248.0, 6070.4, 33466.2, 89198.4, 1.7325050039654066, 12.803976699400941, 0.6632245718305072], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 367, 62, 16.893732970027248, 7968.811989100817, 2, 90003, 2449.0, 6721.799999999999, 75341.59999999998, 90001.32, 1.7341340906191378, 12.369714759749188, 0.6638482065651387], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 357, 38, 10.644257703081232, 5861.347338935571, 2, 33383, 5037.0, 8783.8, 20968.499999999993, 31935.000000000015, 1.9226626454114606, 12.880637428977272, 0.6853240874757647], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 421, 0, 0.0, 5363.895486935865, 464, 11212, 5322.0, 8530.8, 8990.9, 10478.98, 2.2102057958840824, 6.610366327829694, 0.7165901603842924], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 1110, 27, 2.4324324324324325, 8154.3027027027065, 2, 55326, 8636.0, 11537.4, 18397.850000000006, 40906.050000000054, 5.952764013128258, 935.300293859067, 2.4357501186530666], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 421, 0, 0.0, 5491.320665083137, 594, 10894, 5345.0, 8435.4, 9118.5, 10653.019999999997, 2.2131220791782535, 6.675188604918282, 0.7175356741085743], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -77", 477, 0, 0.0, 4792.129979035641, 389, 10747, 4713.0, 7721.999999999999, 8529.199999999999, 10138.019999999993, 2.54164135682087, 7.4161594706778775, 0.8091553538316442], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503/Service Unavailable", 325, 34.067085953878404, 2.5090712576237166], "isController": false}, {"data": ["502/Bad Gateway", 240, 25.157232704402517, 1.8528526210144367], "isController": false}, {"data": ["504/Gateway Time-out", 185, 19.39203354297694, 1.4282405620319618], "isController": false}, {"data": ["502/Proxy Error", 204, 21.38364779874214, 1.5749247278622713], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 12953, 954, "503/Service Unavailable", 325, "502/Bad Gateway", 240, "502/Proxy Error", 204, "504/Gateway Time-out", 185, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 357, 47, "502/Bad Gateway", 25, "503/Service Unavailable", 16, "502/Proxy Error", 6, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 357, 26, "502/Bad Gateway", 15, "503/Service Unavailable", 8, "502/Proxy Error", 3, "", "", "", ""], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 745, 63, "502/Proxy Error", 23, "503/Service Unavailable", 20, "502/Bad Gateway", 20, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 367, 44, "503/Service Unavailable", 20, "502/Bad Gateway", 12, "502/Proxy Error", 11, "504/Gateway Time-out", 1, "", ""], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 1049, 76, "503/Service Unavailable", 49, "502/Proxy Error", 17, "502/Bad Gateway", 10, "", "", "", ""], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 712, 56, "502/Bad Gateway", 21, "502/Proxy Error", 20, "503/Service Unavailable", 14, "504/Gateway Time-out", 1, "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 357, 28, "503/Service Unavailable", 12, "502/Bad Gateway", 10, "502/Proxy Error", 6, "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 698, 46, "502/Bad Gateway", 39, "502/Proxy Error", 7, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 364, 103, "503/Service Unavailable", 48, "504/Gateway Time-out", 38, "502/Proxy Error", 10, "502/Bad Gateway", 7, "", ""], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 1093, 57, "503/Service Unavailable", 31, "502/Proxy Error", 24, "502/Bad Gateway", 2, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 367, 58, "503/Service Unavailable", 30, "502/Bad Gateway", 14, "502/Proxy Error", 14, "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 182, 63, "504/Gateway Time-out", 47, "503/Service Unavailable", 8, "502/Proxy Error", 8, "", "", "", ""], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 399, 3, "502/Bad Gateway", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 109, 91, "504/Gateway Time-out", 91, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 367, 66, "503/Service Unavailable", 35, "502/Proxy Error", 17, "502/Bad Gateway", 12, "504/Gateway Time-out", 2, "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 367, 62, "503/Service Unavailable", 23, "502/Bad Gateway", 17, "502/Proxy Error", 17, "504/Gateway Time-out", 5, "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 357, 38, "502/Bad Gateway", 19, "503/Service Unavailable", 11, "502/Proxy Error", 8, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 1110, 27, "502/Bad Gateway", 14, "502/Proxy Error", 13, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
