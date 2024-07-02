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

    var data = {"OkPercent": 99.89224584524845, "KoPercent": 0.10775415475154379};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4593072651166646, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -79"], "isController": false}, {"data": [0.4900690041029467, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -78"], "isController": false}, {"data": [0.48889614630960154, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -77"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -78"], "isController": false}, {"data": [0.48944974988631196, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -77"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -78"], "isController": false}, {"data": [0.4900164113785558, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.4911169784301441, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -79"], "isController": false}, {"data": [0.4886825572801183, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -77"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -78"], "isController": false}, {"data": [0.44524617996604415, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -77"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP "], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -77"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -79"], "isController": false}, {"data": [0.4618627450980392, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -79"], "isController": false}, {"data": [0.4912600801910168, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -78"], "isController": false}, {"data": [0.4895414320193081, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_CityLevel1234_Summaries_24hourly_REST"], "isController": false}, {"data": [0.4902957063077909, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -78"], "isController": false}, {"data": [0.4909339183381089, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -80"], "isController": false}, {"data": [0.49045749246644144, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80"], "isController": false}, {"data": [0.48995495495495495, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -80"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -80"], "isController": false}, {"data": [0.48800184586986617, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -79"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78"], "isController": false}, {"data": [0.004624105011933174, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.4898761637892073, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -80"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -79"], "isController": false}, {"data": [0.48932676518883417, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -78"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -80"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -78"], "isController": false}, {"data": [0.4901424858858321, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -77"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -77"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 289548, 312, 0.10775415475154379, 988.1101233647022, 1, 90008, 659.0, 1231.9000000000015, 2341.9500000000007, 6185.420000000093, 80.0600779619945, 2620.292164328852, 28.996870670179785], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_1Point_maxt_SOAP 34 -79", 2, 0, 0.0, 815.0, 607, 1023, 815.0, 1023.0, 1023.0, 1023.0, 0.0010691042242980662, 0.003182255542637213, 3.50799823597803E-4], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 10724, 3, 0.027974636329727715, 824.4003170458755, 421, 89998, 686.0, 881.0, 1000.0, 3813.5, 2.978602612082283, 26.449406431614488, 1.0907968550106018], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 10717, 4, 0.0373238779509191, 842.5913035364391, 432, 90000, 685.0, 877.0, 998.0, 4003.459999999999, 2.976922117528563, 26.423400186043743, 1.0901814395246203], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 2510, 3, 0.11952191235059761, 2862.3290836653437, 1795, 89999, 2431.0, 2857.8, 3849.249999999988, 12121.789999999974, 0.6940154851168241, 391.83182532648107, 0.2609335564159934], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -77", 3, 0, 0.0, 877.3333333333334, 735, 999, 898.0, 999.0, 999.0, 999.0, 0.0015005852282390132, 0.013319159315883193, 5.495307232320605E-4], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -78", 1, 0, 0.0, 655.0, 655, 655, 655.0, 655.0, 655.0, 655.0, 1.5267175572519083, 5.106452767175572, 0.5322638358778625], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 21990, 2, 0.009095043201455207, 804.0182355616197, 425, 77786, 677.0, 861.0, 976.9500000000007, 3731.970000000005, 6.10843005014246, 20.42942231567972, 2.1295991483406818], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -78", 1, 0, 0.0, 706.0, 706, 706, 706.0, 706.0, 706.0, 706.0, 1.41643059490085, 4.216094192634561, 0.4647662889518414], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 10968, 4, 0.03646973012399708, 818.7316739606124, 433, 90002, 676.0, 861.0, 984.5499999999993, 3787.239999999998, 3.0338318723843294, 12.427584461258343, 1.1910160280258795], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 2670, 3, 0.11235955056179775, 2686.1191011235996, 1699, 90004, 2321.0, 2745.6000000000004, 3825.7999999999993, 11119.629999999994, 0.741301164009412, 53.51170657609789, 0.28739898643724276], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 6298, 20, 0.31756113051762463, 2838.9429977770706, 1772, 90003, 2428.0, 2863.0, 3560.0499999999993, 11248.950000000043, 1.7486230773267335, 985.2934845830057, 0.657441293721477], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 22346, 7, 0.03132551687102837, 796.1513469972253, 2, 90003, 666.5, 848.0, 946.0, 3737.980000000003, 6.209787209327853, 18.47887764899349, 2.0375864280607017], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 10824, 1, 0.009238728750923873, 821.6859756097527, 433, 78171, 685.0, 882.0, 1005.75, 3869.75, 3.0082008490997074, 26.699428340398047, 1.1016360531371], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -78", 1, 0, 0.0, 738.0, 738, 738, 738.0, 738.0, 738.0, 738.0, 1.3550135501355014, 12.029715023712738, 0.4962207825203252], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 2356, 2, 0.08488964346349745, 1528.1426146010213, 869, 90005, 1255.0, 1521.0, 1697.3000000000002, 5618.16999999998, 0.6542848716340848, 48.05111750913596, 0.24088417637309567], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -77", 3, 3, 100.0, 604.6666666666666, 597, 615, 602.0, 615.0, 615.0, 615.0, 0.0015937270901730787, 0.002549340794632327, 5.556255578044816E-4], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77", 1, 0, 0.0, 696.0, 696, 696, 696.0, 696.0, 696.0, 696.0, 1.4367816091954022, 5.8874371408045985, 0.5640490301724138], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 1241, 0, 0.0, 2900.3078162771985, 1899, 48191, 2586.0, 3153.0, 4204.3999999999905, 12162.419999999978, 0.34470575294735917, 126.65427209102788, 0.4238130302350832], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -77", 1, 0, 0.0, 663.0, 663, 663, 663.0, 663.0, 663.0, 663.0, 1.5082956259426847, 4.489536199095022, 0.4949095022624434], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -79", 1, 0, 0.0, 660.0, 660, 660, 660.0, 660.0, 660.0, 660.0, 1.5151515151515151, 5.067767518939394, 0.5282315340909091], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 5100, 6, 0.11764705882352941, 1405.9307843137237, 741, 90001, 1194.0, 1438.0, 1664.0, 5775.9599999999555, 1.4163350082189088, 101.53941512792977, 0.8063704197183826], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -79", 1, 0, 0.0, 835.0, 835, 835, 835.0, 835.0, 835.0, 835.0, 1.1976047904191616, 3.564745508982036, 0.39296407185628746], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 22197, 8, 0.03604090642879668, 805.9036806775752, 401, 89998, 667.0, 850.0, 950.0, 3804.9900000000016, 6.165894992283256, 18.3476655730099, 2.0231842943429434], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 11187, 2, 0.017877893984088674, 798.8419594171777, 435, 90004, 678.0, 862.0, 988.0, 3782.3600000000024, 3.109612809147549, 12.7400727297978, 1.2207659660911274], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 634, 23, 3.6277602523659307, 11327.086750788649, 7570, 63097, 9094.5, 12326.5, 17898.0, 60062.0, 0.17575837381921006, 225.99122518435223, 0.10281178312276057], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 389, 177, 45.501285347043705, 18489.421593830313, 6806, 90004, 15336.0, 27251.0, 36921.0, 89998.0, 0.10756699225268786, 20.39925094729466, 0.03844679605906617], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 21846, 6, 0.027464982147761604, 818.9938203790166, 457, 90003, 677.0, 858.0, 963.0, 3750.0, 6.064571614329223, 20.279373195390193, 2.1143086585112623], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 577, 3, 0.5199306759098787, 6246.720970537266, 4168, 90006, 5225.0, 7795.200000000007, 9485.200000000004, 27539.10000000013, 0.16005325862332007, 90.87912404344253, 0.07111741472032287], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -78", 2, 0, 0.0, 726.0, 724, 728, 726.0, 728.0, 728.0, 728.0, 0.0012125989025979932, 0.004055811759177858, 4.2275176584715194E-4], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -80", 22336, 6, 0.026862464183381087, 805.4719287249252, 400, 90005, 665.0, 848.0, 959.9500000000007, 3754.880000000019, 6.203484627517353, 18.460845953834365, 2.0355183934041317], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 10951, 2, 0.018263172313030773, 806.1556935439694, 437, 82079, 677.0, 867.0, 975.3999999999996, 3778.5199999999895, 3.0416554871731627, 12.461610200850364, 1.1940874080504018], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 11100, 4, 0.036036036036036036, 810.6534234234216, 440, 90002, 677.0, 865.0, 977.0, 3847.8899999999976, 3.0834301187787285, 12.630803910476912, 1.2104872145986805], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -80", 1, 0, 0.0, 772.0, 772, 772, 772.0, 772.0, 772.0, 772.0, 1.2953367875647668, 11.534063309585491, 0.4743664993523316], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -80", 2, 0, 0.0, 835.0, 639, 1031, 835.0, 1031.0, 1031.0, 1031.0, 0.001069099652382248, 0.0035758460052824213, 3.7272321865279546E-4], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 10835, 1, 0.009229349330872173, 826.9337332718068, 442, 90008, 686.0, 884.0, 1005.1999999999989, 3944.7999999999884, 3.0142352021498855, 26.782288707954407, 1.1038458992248115], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78", 1, 0, 0.0, 686.0, 686, 686, 686.0, 686.0, 686.0, 686.0, 1.4577259475218658, 5.9732598396501455, 0.5722713192419825], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 3352, 5, 0.14916467780429593, 2139.2661097852056, 1326, 62715, 1795.0, 2143.7000000000003, 2656.7499999999995, 9062.389999999992, 0.9306419124802356, 273.08143575487287, 0.38988806684962996], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 22126, 5, 0.022597848684805206, 815.2619090662578, 441, 90002, 679.0, 865.0, 967.9500000000007, 3760.830000000027, 6.14926944422288, 20.563508966567134, 2.143837101159735], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -79", 3, 0, 0.0, 681.0, 634, 709, 700.0, 709.0, 709.0, 709.0, 0.002373966137747011, 0.007940267599397961, 8.276424913825029E-4], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 21924, 5, 0.02280605728881591, 812.3925834701747, 439, 90005, 677.0, 865.0, 976.0, 3830.970000000005, 6.094118608492906, 20.379069892496094, 2.1246097101874684], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -80", 1, 0, 0.0, 591.0, 591, 591, 591.0, 591.0, 591.0, 591.0, 1.6920473773265652, 5.036484771573605, 0.5552030456852792], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -78", 4, 0, 0.0, 753.25, 667, 790, 778.0, 790.0, 790.0, 790.0, 0.0012293685072054825, 0.003659292197228819, 4.0338654142679895E-4], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -77", 22318, 7, 0.03136481763598889, 796.1209337754246, 1, 90008, 667.0, 851.0, 960.0, 3707.9900000000016, 6.174422596870627, 18.373628976212785, 2.0259824145981744], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80", 2, 0, 0.0, 604.0, 594, 614, 604.0, 614.0, 614.0, 614.0, 0.0010706317155374358, 0.004387080740620195, 4.203065914512199E-4], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -77", 1, 0, 0.0, 626.0, 626, 626, 626.0, 626.0, 626.0, 626.0, 1.5974440894568689, 5.343013678115016, 0.5569214257188498], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 34, 10.897435897435898, 0.01174243994087336], "isController": false}, {"data": ["502/Bad Gateway", 2, 0.6410256410256411, 6.907317612278447E-4], "isController": false}, {"data": ["502/Proxy Error", 94, 30.128205128205128, 0.032464392777708705], "isController": false}, {"data": ["Was not a proper XML response", 182, 58.333333333333336, 0.06285659027173388], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 289548, 312, "Was not a proper XML response", 182, "502/Proxy Error", 94, "504/Gateway Time-out", 34, "502/Bad Gateway", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 10724, 3, "502/Proxy Error", 2, "504/Gateway Time-out", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 10717, 4, "504/Gateway Time-out", 2, "502/Proxy Error", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 2510, 3, "502/Proxy Error", 2, "504/Gateway Time-out", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 21990, 2, "502/Proxy Error", 1, "Was not a proper XML response", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 10968, 4, "502/Proxy Error", 3, "504/Gateway Time-out", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 2670, 3, "504/Gateway Time-out", 2, "502/Proxy Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 6298, 20, "502/Proxy Error", 16, "504/Gateway Time-out", 2, "Was not a proper XML response", 2, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 22346, 7, "502/Proxy Error", 4, "504/Gateway Time-out", 1, "502/Bad Gateway", 1, "Was not a proper XML response", 1, "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 10824, 1, "502/Proxy Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 2356, 2, "504/Gateway Time-out", 1, "502/Proxy Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -77", 3, 3, "Was not a proper XML response", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 5100, 6, "Was not a proper XML response", 4, "504/Gateway Time-out", 1, "502/Proxy Error", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 22197, 8, "502/Proxy Error", 7, "504/Gateway Time-out", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 11187, 2, "504/Gateway Time-out", 1, "502/Proxy Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 634, 23, "502/Proxy Error", 20, "Was not a proper XML response", 3, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 389, 177, "Was not a proper XML response", 165, "502/Proxy Error", 8, "504/Gateway Time-out", 4, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 21846, 6, "504/Gateway Time-out", 4, "502/Proxy Error", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 577, 3, "502/Proxy Error", 2, "504/Gateway Time-out", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -80", 22336, 6, "502/Proxy Error", 4, "504/Gateway Time-out", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 10951, 2, "502/Proxy Error", 1, "Was not a proper XML response", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 11100, 4, "502/Proxy Error", 3, "504/Gateway Time-out", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 10835, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 3352, 5, "502/Proxy Error", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 22126, 5, "504/Gateway Time-out", 3, "502/Proxy Error", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 21924, 5, "504/Gateway Time-out", 2, "502/Proxy Error", 2, "Was not a proper XML response", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -77", 22318, 7, "502/Proxy Error", 3, "504/Gateway Time-out", 2, "502/Bad Gateway", 1, "Was not a proper XML response", 1, "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
