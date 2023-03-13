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

    var data = {"OkPercent": 99.90838003110818, "KoPercent": 0.09161996889182451};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.18577014041292908, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.2, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.19463087248322147, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.21345514950166114, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.19901315789473684, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.15676567656765678, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.19604612850082373, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.23244147157190637, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.17811687185711808, 500, 1500, "WIFSGriddedLowResItemGlobal"], "isController": false}, {"data": [0.19282136894824708, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.17478991596638654, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.20514950166112958, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.21096345514950166, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.19927085493123228, 500, 1500, "WIFSGriddedHighResItemGlobal"], "isController": false}, {"data": [0.17678219021569783, 500, 1500, "WIFSGriddedHighResItemSector"], "isController": false}, {"data": [0.20252100840336135, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 93866, 86, 0.09161996889182451, 7133.764099887134, 53, 90014, 6287.5, 12139.900000000001, 13259.95, 18439.800000000032, 25.987480516172614, 749.0022865811455, 6.630856590205622], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 600, 0, 0.0, 7074.058333333336, 215, 70467, 6029.0, 13681.399999999998, 14965.599999999993, 19980.200000000023, 0.1669426321121387, 2.8424265535890023, 0.04972412382246319], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM", 596, 0, 0.0, 6825.104026845634, 71, 71833, 6118.0, 13159.6, 14121.199999999999, 18038.77999999996, 0.16665767199924614, 0.05972984924191731, 0.04833723494509384], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC", 602, 0, 0.0, 6615.48172757475, 68, 70256, 5984.0, 12956.0, 13982.15, 17940.07, 0.1674166115100311, 0.6850347677998342, 0.049865299326718245], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC", 608, 0, 0.0, 6713.412828947363, 71, 20063, 6425.5, 12622.6, 14158.4, 17403.75, 0.16887017244477626, 1.8697754054481184, 0.050133332444542954], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 606, 0, 0.0, 7720.4488448844895, 236, 88860, 7105.5, 13709.2, 14906.249999999998, 21272.609999999884, 0.16807771514155556, 8.422761672352465, 0.04989807168264931], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM", 607, 1, 0.16474464579901152, 7226.441515650742, 74, 90004, 6393.0, 13083.000000000002, 14633.800000000003, 20490.999999999996, 0.16857945563555288, 3.00633597604311, 0.048729998894652], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 598, 2, 0.33444816053511706, 6718.5418060200645, 69, 90013, 5657.0, 12894.5, 14039.25, 19427.629999999997, 0.166901622099561, 1.220931460718531, 0.049711908926138776], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal", 28835, 35, 0.12138026703658748, 7275.433431593535, 93, 90014, 6912.0, 13063.900000000001, 14024.850000000002, 17200.99, 7.985077168771604, 127.48438760649077, 1.9884713652702728], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 599, 2, 0.333889816360601, 7236.1969949916565, 251, 90001, 6384.0, 13407.0, 15179.0, 19239.0, 0.1668261123249405, 9.807112856019874, 0.04838608921924544], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 595, 0, 0.0, 7280.845378151265, 229, 89964, 6551.0, 13443.6, 15067.799999999992, 20267.87999999994, 0.16672467003926858, 4.624981422983851, 0.04965920347849308], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 602, 0, 0.0, 6775.538205980064, 253, 80375, 6119.0, 13128.9, 14145.6, 19163.840000000033, 0.16752199352285396, 9.88068929960919, 0.04842432625269997], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM", 602, 1, 0.16611295681063123, 7053.9867109634515, 72, 90004, 6384.5, 12965.6, 14552.600000000002, 19678.170000000027, 0.16698320431892905, 2.9779921094888344, 0.04843165203390813], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 28938, 23, 0.07948026815951344, 6896.111203262168, 54, 90011, 6410.5, 12777.0, 13753.0, 16811.87000000002, 8.012801431881913, 457.45855894618495, 2.0266753621654443], "isController": false}, {"data": ["WIFSGriddedHighResItemSector", 28883, 21, 0.07270712876086279, 7265.767337188016, 53, 90009, 6917.5, 13090.900000000001, 14119.0, 17278.0, 7.9984470002846795, 118.95304889733697, 2.030855683666032], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 595, 1, 0.16806722689075632, 6660.156302521007, 234, 90003, 6011.0, 12603.2, 13715.399999999998, 17019.399999999965, 0.1663162843768073, 0.059587023563243934, 0.048238219199132584], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 86, 100.0, 0.09161996889182451], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 93866, 86, "504/Gateway Time-out", 86, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM", 607, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 598, 2, "504/Gateway Time-out", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal", 28835, 35, "504/Gateway Time-out", 35, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 599, 2, "504/Gateway Time-out", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM", 602, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 28938, 23, "504/Gateway Time-out", 23, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResItemSector", 28883, 21, "504/Gateway Time-out", 21, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 595, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
