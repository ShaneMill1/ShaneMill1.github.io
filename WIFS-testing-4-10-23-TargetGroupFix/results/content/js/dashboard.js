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

    var data = {"OkPercent": 99.76830062993267, "KoPercent": 0.23169937006733762};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.922398088480197, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0010948905109489052, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.975976718530072, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.994825158860013, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.007235621521335807, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.9961582350703689, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.9965957932372295, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.9754849752757703, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.99505515405097, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.9961188691450097, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.9492700729927007, 500, 1500, "WIFSGriddedLowResItemGlobal"], "isController": false}, {"data": [0.9782765836028153, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.9751151021650623, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.001687289088863892, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.0035421327367636092, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.9792887029288703, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.0046694060515502425, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.9945790695020352, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.8512773722627737, 500, 1500, "WIFSGriddedHighResItemGlobal"], "isController": false}, {"data": [0.8627737226277372, 500, 1500, "WIFSGriddedHighResItemSector"], "isController": false}, {"data": [0.9790326876974009, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 345275, 800, 0.23169937006733762, 987.379065961942, 31, 60015, 108.0, 261.0, 2095.250000000011, 24959.87000000002, 95.14111416024379, 155.53086871824783, 28.173809140456417], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 2740, 0, 0.0, 12905.512408759116, 1230, 43907, 11862.0, 23040.600000000002, 26061.95, 32417.63000000001, 0.7557778388284451, 0.21625283864915468, 0.26644121075885613], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 26287, 6, 0.022824970517746415, 229.89405409517914, 86, 60011, 147.0, 275.0, 313.0, 434.9900000000016, 7.304271666555984, 2.603454543798399, 2.1827218066075496], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM", 26281, 1, 0.0038050302499904876, 96.06654997907258, 31, 60003, 53.0, 101.0, 134.0, 234.9900000000016, 7.317319000694952, 2.6224953039940795, 2.129454162311617], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 2712, 0, 0.0, 17646.289823008938, 4971, 50465, 17080.0, 28128.200000000008, 31924.799999999996, 37941.53999999999, 0.7494362647565991, 0.21443830622430032, 0.26274181547619047], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 2695, 0, 0.0, 11830.103525046374, 881, 41019, 11179.0, 21519.000000000004, 25576.0, 32265.799999999996, 0.7488178680446768, 0.21426136263387724, 0.25374980489404575], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC", 26290, 3, 0.011411182959300114, 95.69406618486082, 31, 60011, 52.0, 97.0, 124.0, 215.9900000000016, 7.312997692052422, 2.606624256965081, 2.185329388445352], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC", 26291, 0, 0.0, 89.60073789509654, 31, 5110, 52.0, 98.0, 125.0, 220.0, 7.303104242917175, 2.5960253363494643, 2.17524100985326], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 26290, 2, 0.007607455306200076, 220.9389121338903, 87, 60011, 146.0, 278.0, 314.0, 432.0, 7.305497046122723, 2.5968368260685923, 2.175953710026788], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 2728, 0, 0.0, 13562.427419354826, 1869, 44475, 12455.0, 23839.099999999995, 27497.74999999999, 33276.39, 0.7528642926235583, 0.21541917747920172, 0.2661492909470001], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM", 26290, 1, 0.003803727653100038, 96.31513883605841, 31, 60002, 52.0, 99.0, 130.0, 223.9900000000016, 7.305241267471864, 2.6110329505908383, 2.1188053285538513], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 26281, 0, 0.0, 89.88485978463507, 31, 9465, 52.0, 98.0, 126.0, 220.0, 7.317094900891661, 2.6081441785404844, 2.186553749680516], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal", 2740, 71, 2.591240875912409, 222.38503649635015, 56, 60007, 142.0, 378.0, 502.7999999999993, 683.130000000001, 0.7616387575170132, 11.869861088313682, 0.16809605390512206], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 26285, 1, 0.0038044512079132586, 213.28849153509586, 88, 60005, 145.0, 274.90000000000146, 311.0, 435.9900000000016, 7.313242436003912, 2.6210342840409386, 2.128267818290201], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 26281, 2, 0.007610060499980975, 222.2383090445574, 87, 60015, 147.0, 278.0, 314.0, 431.9800000000032, 7.317343448776646, 2.6081930746506297, 2.186628022778959], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 2667, 0, 0.0, 12035.83352080991, 1034, 41957, 11340.0, 21701.80000000001, 25196.8, 32190.880000000067, 0.7425690885778842, 0.2124733817903516, 0.2501819683196973], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 2682, 0, 0.0, 11765.053691275165, 869, 42093, 10844.0, 21627.4, 24893.799999999996, 32240.290000000008, 0.7442067995861078, 0.21294198464719685, 0.25291402954684133], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 26290, 2, 0.007607455306200076, 214.9817421072649, 88, 60011, 145.0, 275.0, 308.0, 422.0, 7.312013256744004, 2.6134332899081145, 2.120769469973603], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 2722, 0, 0.0, 15144.763776634854, 2646, 44925, 14028.0, 25418.4, 28633.75, 36066.63, 0.7518676536149588, 0.2151340063566239, 0.266531209240459], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 2677, 0, 0.0, 12186.300336197248, 989, 40391, 11488.0, 22412.4, 25560.5, 32237.059999999976, 0.743598924350962, 0.2127680515965155, 0.2534336177719587], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM", 26287, 2, 0.007608323505915471, 99.60223684711039, 31, 60005, 53.0, 100.0, 132.0, 234.9900000000016, 7.312867023885397, 2.6208793640355332, 2.128158567497899], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 2740, 364, 13.284671532846716, 252.08868613138753, 37, 48985, 89.0, 327.0, 440.0, 737.9500000000007, 0.7615555633996396, 99.16204307708472, 0.17105251912296593], "isController": false}, {"data": ["WIFSGriddedHighResItemSector", 2740, 341, 12.445255474452555, 147.39087591240875, 35, 41254, 87.0, 328.9000000000001, 448.0, 611.5900000000001, 0.7615919718199852, 12.822708474597295, 0.17180443895548494], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 26279, 4, 0.015221279348529244, 219.01708588606837, 87, 60011, 145.0, 275.0, 308.0, 418.0, 7.31887123560226, 2.6229904214143893, 2.129905886923314], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 25, 3.125, 0.007240605314604301], "isController": false}, {"data": ["404/NOT FOUND", 775, 96.875, 0.22445876475273333], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 345275, 800, "404/NOT FOUND", 775, "504/Gateway Time-out", 25, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 26287, 6, "504/Gateway Time-out", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM", 26281, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC", 26290, 3, "504/Gateway Time-out", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 26290, 2, "504/Gateway Time-out", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM", 26290, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal", 2740, 71, "404/NOT FOUND", 70, "504/Gateway Time-out", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 26285, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 26281, 2, "504/Gateway Time-out", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 26290, 2, "504/Gateway Time-out", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM", 26287, 2, "504/Gateway Time-out", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 2740, 364, "404/NOT FOUND", 364, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResItemSector", 2740, 341, "404/NOT FOUND", 341, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 26279, 4, "504/Gateway Time-out", 4, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
