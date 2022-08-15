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

    var data = {"OkPercent": 99.94941831057157, "KoPercent": 0.05058168942842691};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7629275125481498, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8683856313619921, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.834688489968321, 500, 1500, "NDFD_1Point-wspd-wdir_REST"], "isController": false}, {"data": [0.7496823379923762, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_CityLevel1234_Summaries_24hourly_REST"], "isController": false}, {"data": [0.0017421602787456446, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.8484341146346267, 500, 1500, "NDFD_1Point_maxt_SOAP"], "isController": false}, {"data": [0.7933026920551542, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP"], "isController": false}, {"data": [0.16934619506966775, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP"], "isController": false}, {"data": [0.28399122807017546, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.008676789587852495, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.491894395553497, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 51402, 26, 0.05058168942842691, 1658.7502237267013, 64, 115926, 247.0, 5154.600000000006, 14440.30000000001, 63052.44000000009, 37.79130892531287, 701.7705355250674, 14.768034912085323], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_Line_Summaries_24Hourly_REST", 11887, 0, 0.0, 471.85135021451924, 64, 50640, 138.0, 1139.0, 1826.2000000000025, 4125.360000000002, 150.1528433923654, 113.78770163327691, 70.38414534017129], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST", 9470, 0, 0.0, 598.2953537486793, 67, 94335, 171.0, 1361.7999999999993, 2078.7999999999956, 4686.059999999987, 88.79345910062634, 429.9198927938529, 31.73672463948168], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST", 6296, 0, 0.0, 915.9706162642949, 70, 94643, 272.0, 1975.500000000001, 2974.5999999999985, 8162.839999999993, 58.89506276776861, 568.9355086902023, 22.60328092552057], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 161, 0, 0.0, 42396.14285714286, 1976, 100918, 52613.0, 72815.2, 75708.8, 97559.45999999998, 1.4836248364326656, 883.3363186291675, 0.8446809371486758], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 256, 0, 0.0, 24232.11718749999, 1795, 86360, 13295.5, 59662.9, 68608.64999999998, 83625.85000000002, 2.6873536914372096, 890.2300324896863, 0.9185290937529524], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 287, 0, 0.0, 22434.954703832766, 985, 87560, 16688.0, 50502.8, 67914.59999999992, 82013.40000000002, 3.043897886240945, 1241.9846514995438, 1.0968733593973718], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 100, 26, 26.0, 66657.32999999999, 52598, 79327, 67631.0, 73015.0, 74769.0, 79320.42, 1.192947295588481, 358.0093549435736, 0.5114295534798273], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP", 10154, 0, 0.0, 557.4608036241867, 68, 94539, 139.0, 1216.0, 2102.25, 4742.400000000009, 97.51459741856178, 273.30751424928934, 31.235144485633068], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP", 7615, 0, 0.0, 739.0987524622454, 69, 62704, 234.0, 1523.4000000000005, 2711.7999999999984, 8071.560000000023, 93.14756825521089, 284.62767682671375, 30.200188145244155], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP", 933, 0, 0.0, 6468.997856377283, 301, 80635, 2876.0, 15220.800000000001, 30580.299999999923, 62765.13999999998, 10.43682532580122, 1018.354885183036, 12.516036621175681], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 1368, 0, 0.0, 4316.458333333334, 215, 63871, 1854.0, 9104.40000000001, 15874.15, 46607.28999999998, 15.8144804226443, 1015.8332658982926, 5.884098672878397], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 255, 0, 0.0, 25740.698039215666, 4026, 115926, 19715.0, 56590.20000000002, 69326.2, 87030.11999999998, 2.1069852758911307, 859.7014326337936, 0.7592554363318625], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 461, 0, 0.0, 13558.913232104122, 557, 84094, 8299.0, 31885.800000000003, 47573.19999999998, 69443.15999999999, 4.843200084046856, 1051.8352213781059, 1.9533609713978042], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 2159, 0, 0.0, 2799.3918480778107, 136, 96170, 1033.0, 5567.0, 9027.0, 32947.00000000004, 20.076810772106345, 709.138836734682, 7.077860047588271], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 26, 100.0, 0.05058168942842691], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 51402, 26, "504/Gateway Time-out", 26, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 100, 26, "504/Gateway Time-out", 26, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
