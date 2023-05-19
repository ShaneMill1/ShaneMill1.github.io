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

    var data = {"OkPercent": 99.99178084443604, "KoPercent": 0.008219155563957359};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6227407596143573, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5810129939008221, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.009437259699405802, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.9040859644468029, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.053437833986462416, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.9105249204665959, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.908597165187442, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.5812350914391731, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [8.784258608573436E-4, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.8955352411234764, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.9067515585621435, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.8758295494236814, 500, 1500, "WIFSGriddedLowResItemGlobal"], "isController": false}, {"data": [0.5980639172523537, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.5723003449190767, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.0262024407753051, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.04675231977159172, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.5981444665341286, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.036135957066189626, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.9030226700251889, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.913552217953196, 500, 1500, "WIFSGriddedHighResItemGlobal"], "isController": false}, {"data": [0.893992315752707, 500, 1500, "WIFSGriddedHighResItemSector"], "isController": false}, {"data": [0.6031050955414012, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 121667, 10, 0.008219155563957359, 2803.207048747818, 43, 60008, 644.0, 11549.800000000003, 16435.95, 26023.670000000053, 33.4589921299166, 157.89569288472876, 10.008365491404454], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 7542, 0, 0.0, 761.7450278440724, 349, 12518, 624.0, 1280.6999999999998, 1583.8499999999995, 2177.5699999999997, 2.096952495768282, 0.7474488876517802, 0.6266283825245061], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 2861, 0, 0.0, 12023.058720727011, 934, 54306, 9934.0, 25001.0, 29565.100000000002, 41159.84000000001, 0.7882105086836775, 0.2255328896917163, 0.2778749937839918], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM", 7538, 0, 0.0, 347.55757495356886, 114, 3704, 220.0, 749.0, 1000.0499999999993, 1448.659999999998, 2.0973162531993252, 0.7516748680899926, 0.6103518002474599], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 2829, 3, 0.10604453870625663, 18884.495581477542, 4766, 59746, 17116.0, 31806.0, 37060.0, 47824.89999999997, 0.7805839065617058, 0.22333773472356733, 0.27366174067934806], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 2807, 1, 0.03562522265764161, 10357.154257214128, 671, 49210, 8245.0, 22603.000000000015, 27787.799999999996, 39384.72, 0.7792284943900822, 0.22299347448186302, 0.2640549683138267], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC", 7544, 0, 0.0, 329.9628844114526, 111, 6808, 209.0, 708.0, 948.0, 1413.0, 2.0970741867791483, 0.7474922638421768, 0.6266647472211127], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC", 7549, 0, 0.0, 337.04994038945534, 113, 11620, 209.0, 716.0, 965.0, 1473.0, 2.0968926045994976, 0.7453797930412276, 0.624562738674655], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 7546, 0, 0.0, 769.0106016432547, 344, 14215, 625.0, 1297.0, 1621.6499999999996, 2264.5899999999992, 2.095863682759674, 0.7450140434809779, 0.6242562726969733], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 2846, 2, 0.07027406886858749, 12826.394940267028, 1360, 55392, 10929.5, 25666.70000000001, 31633.750000000007, 42013.210000000014, 0.7858648157884273, 0.2248878667932905, 0.27781549151895574], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM", 7548, 0, 0.0, 358.088235294119, 114, 6934, 221.0, 773.1000000000004, 1051.0, 1558.0800000000017, 2.09684781101923, 0.7494592762041388, 0.6081677733131946], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 7539, 0, 0.0, 337.9021090330287, 114, 11102, 212.0, 722.0, 982.0, 1457.2000000000025, 2.097142278544112, 0.747516534832618, 0.6266850949555648], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal", 2863, 0, 0.0, 380.4889975550125, 76, 8407, 217.0, 914.5999999999999, 1160.199999999999, 1681.3600000000033, 0.7957421817566308, 12.747755215526478, 0.1756227862080064], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 7541, 0, 0.0, 739.4857445962067, 340, 8923, 608.0, 1220.8000000000002, 1520.0, 2153.8999999999996, 2.096645894830729, 0.7514346126981227, 0.610156715487849], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 7538, 0, 0.0, 775.3767577606764, 347, 4954, 631.0, 1310.0, 1653.0, 2232.0499999999984, 2.096875188636706, 0.747421331887107, 0.6266052809793281], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 2786, 1, 0.03589375448671931, 11539.349964106254, 963, 60008, 9806.0, 24060.10000000001, 29925.25, 41259.530000000006, 0.7751407411859041, 0.22179292865269076, 0.261155816122204], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 2802, 0, 0.0, 10924.880442541036, 729, 55423, 8795.5, 23880.000000000007, 28592.949999999997, 40154.779999999984, 0.7765038040926906, 0.22218321738199054, 0.2638899646721253], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 7545, 0, 0.0, 740.0580516898625, 347, 14487, 603.0, 1242.0, 1571.0, 2201.08, 2.0964244085485215, 0.7493079428991785, 0.6080449700575301], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 2843, 2, 0.07034822370735139, 14625.432641575797, 2509, 52394, 12669.0, 27235.399999999994, 32684.8, 43521.679999999986, 0.7849870061595112, 0.22460191134188878, 0.27827176097256107], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 2795, 1, 0.03577817531305903, 11071.440071556348, 814, 59997, 9177.0, 23570.600000000006, 28705.99999999998, 39979.479999999996, 0.7743780871226603, 0.22157470944198232, 0.2639237816462973], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM", 7543, 0, 0.0, 348.49900570064926, 116, 3706, 221.0, 764.6000000000004, 1015.0, 1478.119999999999, 2.097011890110238, 0.7515657848344311, 0.6102632258328623], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 2863, 0, 0.0, 273.3021306322039, 48, 3137, 124.0, 721.1999999999998, 954.3999999999992, 1385.7200000000034, 0.7954355391597112, 119.43170920739557, 0.17866227930345074], "isController": false}, {"data": ["WIFSGriddedHighResItemSector", 2863, 0, 0.0, 306.99091861683564, 43, 5238, 135.0, 815.0, 1062.199999999999, 1521.760000000002, 0.7957092290041711, 16.576805966648443, 0.17950081240230814], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 7536, 0, 0.0, 734.8622611464992, 341, 24763, 600.0, 1217.0, 1524.0, 2145.63, 2.096363743589344, 0.7513334901340716, 0.6100746050679927], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["408/Request Timeout", 2, 20.0, 0.0016438311127914718], "isController": false}, {"data": ["502/Bad Gateway", 6, 60.0, 0.004931493338374416], "isController": false}, {"data": ["504/Gateway Time-out", 2, 20.0, 0.0016438311127914718], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 121667, 10, "502/Bad Gateway", 6, "408/Request Timeout", 2, "504/Gateway Time-out", 2, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 2829, 3, "502/Bad Gateway", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 2807, 1, "408/Request Timeout", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 2846, 2, "408/Request Timeout", 1, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 2786, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 2843, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 2795, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
