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

    var data = {"OkPercent": 99.99586632888668, "KoPercent": 0.0041336711133157355};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8197586526594268, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0975609756097561, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.8036665956086122, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.822609901835254, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.0975609756097561, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.8414772727272727, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.8384173376370021, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.8007239947474891, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.06097560975609756, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.8197864187894699, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.8386483219567691, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.8536585365853658, 500, 1500, "WIFSGriddedLowResItemGlobal"], "isController": false}, {"data": [0.8229492465169178, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.09146341463414634, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.8071997723392146, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.09146341463414634, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.8177074088537044, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.11585365853658537, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.8218307107590666, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.8658536585365854, 500, 1500, "WIFSGriddedHighResItemGlobal"], "isController": false}, {"data": [0.8597560975609756, 500, 1500, "WIFSGriddedHighResItemSector"], "isController": false}, {"data": [0.8192072302875035, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 338682, 14, 0.0041336711133157355, 1004.3057912732282, 32, 30918, 312.0, 4719.0, 5055.950000000001, 5447.0, 93.96236811069006, 38.11451307282429, 27.685494300454327], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 82, 0, 0.0, 2979.0731707317073, 972, 8015, 2509.0, 6048.500000000001, 7674.399999999999, 8015.0, 0.5737836835513012, 0.1641783391411438, 0.20228116187697237], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 28146, 3, 0.010658708164570454, 1172.5372699495565, 156, 30797, 343.0, 4991.0, 5236.0, 5679.980000000003, 7.814666952088312, 2.785429822820627, 2.3352422727920152], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM", 28116, 0, 0.0, 901.0058685445971, 53, 11060, 117.0, 4528.0, 4754.0, 5192.990000000002, 7.81484954830303, 2.8008298674093868, 2.274243325580374], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 82, 0, 0.0, 5895.000000000003, 2738, 13597, 5716.5, 8872.2, 11124.399999999987, 13597.0, 0.607016219177271, 0.173687258026309, 0.21281135027796902], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 82, 0, 0.0, 2316.2317073170725, 873, 5205, 2043.5, 4023.8, 4523.549999999998, 5205.0, 0.5949444234843427, 0.17023312117276604, 0.20160714350494818], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC", 28160, 0, 0.0, 813.0190340909083, 53, 12801, 116.0, 4485.0, 4737.0, 5157.970000000005, 7.817481788126812, 2.78650473893192, 2.3360834249675824], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC", 28193, 1, 0.0035469797467456462, 827.4837370978631, 54, 30845, 116.0, 4490.0, 4732.0, 5174.970000000005, 7.822983527698573, 2.7808026009311386, 2.330087867136782], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 28177, 1, 0.0035489938602406216, 1192.2375696490003, 152, 30300, 344.0, 5012.9000000000015, 5253.0, 5742.0, 7.8201908407433685, 2.7798098830239386, 2.3292560609636013], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 82, 0, 0.0, 3272.8048780487816, 1298, 9081, 2920.0, 6082.6, 8386.399999999994, 9081.0, 0.5976240798775599, 0.17099985879309088, 0.21126945011296552], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM", 28186, 0, 0.0, 907.1202724756937, 52, 11094, 117.0, 4540.0, 4759.0, 5174.980000000003, 7.820767737127198, 2.7953134685435104, 2.268328142506619], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 28128, 1, 0.0035551763367463025, 827.0043017633684, 52, 30308, 116.0, 4484.0, 4738.0, 5162.0, 7.812734357032627, 2.784788669674214, 2.3346647590351406], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal", 82, 0, 0.0, 358.96341463414626, 48, 4292, 133.5, 700.4000000000001, 1346.9499999999985, 4292.0, 0.5827464413380427, 9.42732975320333, 0.1286139606859352], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 28136, 0, 0.0, 1082.6622831959119, 155, 12588, 342.0, 4959.0, 5217.950000000001, 5690.0, 7.813048869043405, 2.800184506776298, 2.2737192997802094], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 82, 0, 0.0, 2622.146341463414, 1007, 5785, 2428.0, 4196.9, 4573.9, 5785.0, 0.5921774799237391, 0.16944140782974174, 0.1995129204821191], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 28112, 4, 0.014228799089356859, 1165.642857142853, 153, 30853, 343.0, 5005.0, 5239.0, 5704.990000000002, 7.8078066401351585, 2.7829606049050426, 2.3331922186341396], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 82, 0, 0.0, 2518.2439024390246, 921, 4898, 2487.5, 4234.900000000001, 4651.65, 4898.0, 0.6113745489248755, 0.1749343191747935, 0.20777181936118816], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 28169, 0, 0.0, 1106.0603145301598, 154, 13466, 342.0, 4965.0, 5217.0, 5665.0, 7.819656822302886, 2.7949164032840392, 2.268005933812458], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 82, 0, 0.0, 4306.39024390244, 1890, 10472, 3916.0, 7409.6, 9433.399999999994, 10472.0, 0.5959215709073996, 0.1705127151131524, 0.21124954124940043], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 82, 0, 0.0, 2398.439024390244, 948, 5119, 2238.0, 3840.3, 4534.499999999999, 5119.0, 0.6017818614140406, 0.17218953651788466, 0.205099482063965], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM", 28153, 1, 0.003552019322985117, 903.4147337761545, 53, 30918, 117.0, 4523.9000000000015, 4763.950000000001, 5195.980000000003, 7.818948556523169, 2.8022745356379692, 2.2754362010194376], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 82, 0, 0.0, 383.93902439024396, 34, 3934, 83.5, 591.1, 3127.5999999999967, 3934.0, 0.6127450980392157, 98.97652566290425, 0.13762829350490194], "isController": false}, {"data": ["WIFSGriddedHighResItemSector", 82, 0, 0.0, 307.17073170731715, 32, 3043, 80.0, 830.700000000001, 2050.499999999999, 3043.0, 0.5976066582127187, 14.59972111309706, 0.13481165824915825], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 28104, 3, 0.01067463706233988, 1106.3760318815914, 153, 30623, 341.0, 4956.0, 5229.0, 5702.970000000005, 7.807705525262945, 2.798196208780279, 2.272164303250349], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 14, 100.0, 0.0041336711133157355], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 338682, 14, "502/Bad Gateway", 14, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 28146, 3, "502/Bad Gateway", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC", 28193, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 28177, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 28128, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 28112, 4, "502/Bad Gateway", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM", 28153, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 28104, 3, "502/Bad Gateway", 3, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
