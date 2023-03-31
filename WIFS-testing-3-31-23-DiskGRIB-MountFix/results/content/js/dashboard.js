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

    var data = {"OkPercent": 99.99556703529231, "KoPercent": 0.004432964707690308};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9543788825382565, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9819187089061566, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [9.463722397476341E-4, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.9990846254436765, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.0025889967637540453, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.9992155104785386, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.9994024276377218, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.982855862249281, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.9991409255593322, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.999009900990099, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.9864353312302839, 500, 1500, "WIFSGriddedLowResItemGlobal"], "isController": false}, {"data": [0.981918033399335, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.9826072335973696, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.9817519611505416, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.999196802151823, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.9902208201892745, 500, 1500, "WIFSGriddedHighResItemGlobal"], "isController": false}, {"data": [0.9917981072555205, 500, 1500, "WIFSGriddedHighResItemSector"], "isController": false}, {"data": [0.9821014871833196, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 338374, 15, 0.004432964707690308, 1008.5155360636412, 28, 60002, 117.0, 190.0, 269.0, 38813.0, 93.11017094899047, 107.41034421972277, 27.421702750404155], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 26768, 2, 0.007471607890017932, 226.43219515839883, 96, 60001, 161.0, 256.0, 284.0, 381.9900000000016, 7.438429682135514, 2.6513537722144864, 2.215547903370441], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 1585, 0, 0.0, 22306.07003154579, 1349, 49459, 24171.0, 40225.200000000004, 42460.89999999999, 45759.14, 0.4367133476957378, 0.12495801843247187, 0.15353203629928283], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM", 26765, 1, 0.0037362226788716607, 85.86422566784985, 33, 60002, 57.0, 90.0, 101.0, 143.0, 7.439173327596567, 2.6661677396697914, 2.157650857711114], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 1560, 0, 0.0, 26941.980769230766, 5137, 54416, 29206.5, 46037.4, 48063.0, 50677.46, 0.430499569914372, 0.12318005271963964, 0.15050668557553237], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 1545, 0, 0.0, 22458.590938511294, 1272, 49132, 26029.0, 40624.0, 42462.5, 45028.94, 0.4271240644738937, 0.12221420985434656, 0.14432121709762424], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC", 26769, 0, 0.0, 83.00650005603575, 34, 5110, 57.0, 90.0, 101.0, 139.0, 7.438529800385973, 2.651429079239141, 2.215577723747775], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC", 26775, 0, 0.0, 83.1607096171795, 33, 3143, 57.0, 90.0, 101.0, 144.0, 7.437473142458097, 2.643789281108152, 2.2079998391672473], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 26773, 1, 0.0037351062637732044, 220.44612109214512, 95, 60002, 161.0, 253.0, 284.0, 361.0, 7.437830785946437, 2.643896878614146, 2.208106014577848], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 1577, 0, 0.0, 22858.58972733034, 1659, 48468, 25213.0, 40564.0, 42410.1, 45190.64, 0.4347497666355882, 0.12439617346115951, 0.15326627515180405], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM", 26773, 2, 0.007470212527546409, 87.79281365554849, 34, 60000, 57.0, 90.0, 101.0, 141.0, 7.437677882124487, 2.6583486227461317, 2.1499537628016094], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 26765, 0, 0.0, 83.81494489071562, 34, 5113, 57.0, 91.0, 102.0, 140.0, 7.439030660813277, 2.6516076085906697, 2.215726905808642], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal", 1585, 0, 0.0, 165.8258675078864, 46, 2575, 131.0, 351.4000000000001, 433.0, 733.7199999999939, 0.44102887445257466, 7.111750649595881, 0.0969057585467083], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 26767, 3, 0.011207830537602272, 226.98524302312455, 94, 60001, 161.0, 255.0, 283.0, 388.9900000000016, 7.4386954450739315, 2.665955761341461, 2.1575122531122632], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 26764, 3, 0.011209086833059333, 225.14732476460924, 94, 60002, 161.0, 252.0, 282.0, 379.9900000000016, 7.438899518711762, 2.651501420451387, 2.2156878449287962], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 1513, 0, 0.0, 23334.956378056886, 1763, 49752, 26621.0, 41206.8, 43119.399999999994, 46252.659999999996, 0.420395722133154, 0.12028901033692786, 0.14122668790410645], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 1532, 0, 0.0, 22231.60900783286, 1583, 48285, 26228.5, 40382.6, 42417.799999999996, 44730.200000000004, 0.4251760858988908, 0.12165682926599121, 0.14407822442081553], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 26770, 0, 0.0, 220.65024280911425, 93, 45433, 161.0, 254.0, 283.0, 377.0, 7.4379788702496406, 2.6584963540150084, 2.1500407671815367], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 1567, 0, 0.0, 25083.27568602427, 2867, 49524, 28944.0, 43280.0, 45247.6, 47463.87999999999, 0.43271884679736966, 0.12381506065588799, 0.15297287357485137], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 1521, 0, 0.0, 22490.468770545704, 1566, 47087, 25527.0, 40885.4, 42931.799999999996, 45342.86, 0.42155232694944395, 0.12061995292596395, 0.1432619236117251], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM", 26768, 1, 0.003735803945008966, 85.83667065152459, 34, 60000, 57.0, 90.0, 101.0, 143.0, 7.438508230072436, 2.6659293738577063, 2.157457953448744], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 1585, 0, 0.0, 119.55709779179796, 30, 2632, 81.0, 272.4000000000001, 345.6999999999998, 745.5799999999876, 0.4409212778872276, 61.6323029803427, 0.09860446546501477], "isController": false}, {"data": ["WIFSGriddedHighResItemSector", 1585, 0, 0.0, 115.99179810725552, 28, 2550, 78.0, 287.8000000000002, 363.6999999999998, 681.7199999999939, 0.44098249229949976, 6.9495424411044935, 0.09904880198133295], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 26762, 2, 0.007473283013227711, 224.20846722965294, 97, 60001, 161.0, 255.0, 284.0, 388.0, 7.438889475703111, 2.666045647351831, 2.157568529574047], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 15, 100.0, 0.004432964707690308], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 338374, 15, "504/Gateway Time-out", 15, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 26768, 2, "504/Gateway Time-out", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM", 26765, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 26773, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM", 26773, 2, "504/Gateway Time-out", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 26767, 3, "504/Gateway Time-out", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 26764, 3, "504/Gateway Time-out", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM", 26768, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 26762, 2, "504/Gateway Time-out", 2, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
