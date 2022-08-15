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

    var data = {"OkPercent": 89.1149487317863, "KoPercent": 10.885051268213708};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8331084727468969, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9967155128852956, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.9741931656383483, 500, 1500, "NDFD_1Point-wspd-wdir_REST"], "isController": false}, {"data": [0.9465227002210509, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST"], "isController": false}, {"data": [0.08064516129032258, 500, 1500, "NDFD_CityLevel1234_Summaries_24hourly_REST"], "isController": false}, {"data": [0.01968503937007874, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.9805625428767436, 500, 1500, "NDFD_1Point_maxt_SOAP"], "isController": false}, {"data": [0.5507846875916691, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP"], "isController": false}, {"data": [0.46813186813186813, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP"], "isController": false}, {"data": [0.6341463414634146, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.11455847255369929, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.790692007797271, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 55590, 6051, 10.885051268213708, 356.21219643820916, 3, 76543, 90.0, 1095.0, 2786.600000000006, 9574.950000000008, 59.494505400418674, 845.6784886332746, 21.02139587973259], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_Line_Summaries_24Hourly_REST", 13853, 0, 0.0, 99.72071031545504, 63, 1844, 85.0, 125.0, 143.0, 327.91999999999825, 227.0202061585356, 172.03874997951525, 106.41572163681356], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST", 8428, 0, 0.0, 164.25272899857526, 66, 3638, 93.0, 250.0, 472.5499999999993, 1207.0, 138.58650968526985, 671.0077295112967, 49.5338501414148], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST", 5881, 0, 0.0, 235.67556538003683, 69, 7534, 98.0, 478.0, 1095.0, 1869.320000000007, 95.69292350749305, 924.4085931016808, 36.72589740082497], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 94, 0, 0.0, 15632.202127659579, 2602, 76543, 7972.5, 38516.0, 44353.0, 76543.0, 1.1968423733129616, 712.5887286732874, 0.6814053746498598], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 248, 0, 0.0, 5750.471774193547, 643, 38245, 2805.0, 19447.999999999985, 26286.749999999993, 34851.61999999998, 3.488241251265894, 915.5415191255485, 1.1922699589287724], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 254, 0, 0.0, 5619.6614173228345, 461, 65293, 4765.5, 8941.5, 10454.25, 26570.94999999993, 3.7302473124596136, 1518.4000827923985, 1.3442004475562475], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 25, 25, 100.0, 60079.560000000005, 60065, 60127, 60075.0, 60097.4, 60118.3, 60127.0, 0.35878815712050977, 0.13594707515894314, 0.15381640720303102], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP", 8746, 0, 0.0, 158.12943059684378, 65, 10247, 102.0, 231.30000000000018, 425.0, 1128.5300000000007, 144.01686179584712, 403.641009134845, 46.13040104398228], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP", 13636, 6026, 44.191845115869754, 101.01378703432043, 3, 4025, 78.0, 120.0, 189.0, 1088.0, 226.8394523647131, 633.6249672491807, 41.04444442133981], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP", 910, 0, 0.0, 1534.8780219780208, 181, 47109, 842.0, 3115.999999999999, 4485.699999999995, 9287.529999999988, 14.446278892557785, 1409.57026909171, 17.32424851568453], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 820, 0, 0.0, 1744.3146341463407, 210, 60257, 531.0, 2881.599999999997, 5193.099999999998, 24770.38999999998, 9.482070791752912, 601.3614486609466, 3.527997042634628], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 224, 0, 0.0, 6402.575892857143, 1552, 37675, 5241.0, 11794.5, 13705.5, 25717.0, 3.4833452554971545, 1417.8984076135976, 1.2552289055453614], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 419, 0, 0.0, 3363.472553699282, 523, 32993, 2529.0, 6328.0, 8654.0, 18029.60000000006, 6.501062822919738, 1411.8860949112504, 2.622010689322121], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 2052, 0, 0.0, 679.4225146198819, 123, 16969, 289.0, 1542.0, 2535.049999999998, 4612.790000000002, 31.78783325329574, 1115.8026156801388, 11.206452934023206], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 25, 0.41315485043794414, 0.044972117287281885], "isController": false}, {"data": ["Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 6026, 99.58684514956205, 10.840079150926426], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 55590, 6051, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 6026, "504/Gateway Time-out", 25, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 25, 25, "504/Gateway Time-out", 25, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP", 13636, 6026, "Non HTTP response code: java.net.BindException/Non HTTP response message: Address already in use: connect", 6026, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
