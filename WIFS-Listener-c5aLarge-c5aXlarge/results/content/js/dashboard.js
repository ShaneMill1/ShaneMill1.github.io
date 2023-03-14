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

    var data = {"OkPercent": 97.14591454559351, "KoPercent": 2.8540854544064818};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9187495222808224, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [5.847953216374269E-4, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.9621697555205048, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.9764111412373675, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.9768863042728303, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.9777777777777777, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.9613678919877796, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.9760778516876077, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.9775203352230712, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.8777777777777778, 500, 1500, "WIFSGriddedLowResItemGlobal"], "isController": false}, {"data": [0.9594814413170997, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.961073858593827, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.9601054654773052, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.9762444553967472, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.8769725306838106, 500, 1500, "WIFSGriddedHighResItemGlobal"], "isController": false}, {"data": [0.8853801169590644, 500, 1500, "WIFSGriddedHighResItemSector"], "isController": false}, {"data": [0.9612445145702875, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 261660, 7468, 2.8540854544064818, 2567.3789612473906, 1, 98563, 166.0, 271.0, 6338.450000000023, 58336.53000000007, 71.69594081947535, 9170.208259434256, 21.136046349027517], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 1710, 866, 50.64327485380117, 44319.21988304097, 1, 97303, 34762.5, 90002.0, 90002.0, 91029.78, 0.4706558465364684, 251.7010264142176, 0.16546494604797718], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 20288, 0, 0.0, 282.42626182965245, 140, 4683, 223.0, 388.0, 568.0, 1030.9800000000032, 5.640986572071889, 96.04550867585291, 1.680176664533131], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM", 20285, 0, 0.0, 120.55977323145197, 47, 4062, 76.0, 150.0, 331.9500000000007, 757.9800000000032, 5.64509508443988, 2.0231932578021836, 1.6372980860143012], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 1651, 985, 59.66081162931557, 52172.75832828592, 1, 97304, 52288.0, 90003.0, 90003.0, 94989.96000000008, 0.46032312955043075, 4070.9710280057034, 0.16093328162017012], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 1623, 969, 59.70425138632163, 46827.953789279105, 1, 97302, 37205.0, 90003.0, 90003.0, 93043.0, 0.4655044829544477, 23.56127763171009, 0.15728960068578018], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC", 20291, 0, 0.0, 115.09945295943957, 44, 2732, 71.0, 139.0, 298.9500000000007, 788.9900000000016, 5.640482939422419, 23.07971046501947, 1.6800266567615605], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC", 20295, 0, 0.0, 115.74215323971443, 45, 4770, 72.0, 139.0, 296.9500000000007, 770.0, 5.637593959899331, 62.420937809901, 1.6736607068451141], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 20294, 0, 0.0, 287.97851581748273, 140, 7172, 227.0, 390.0, 569.9500000000007, 1024.9900000000016, 5.638257468940825, 282.5460761901352, 1.6738576860918075], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 1689, 1001, 59.26583777383067, 48251.82238010658, 1, 97296, 42360.0, 90003.0, 90003.0, 93027.2, 0.46392113615357466, 721.0722123831442, 0.16355032241351608], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM", 20295, 0, 0.0, 123.53431879773312, 48, 3527, 78.0, 151.0, 336.0, 765.9800000000032, 5.638013685691363, 100.70791828611398, 1.6297383310201596], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 20285, 0, 0.0, 115.38240078876022, 45, 3414, 72.0, 139.0, 301.0, 787.9700000000048, 5.643413078362901, 41.41625906630586, 1.6808994032233249], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal", 1710, 0, 0.0, 371.71169590643296, 48, 3562, 139.0, 934.9000000000001, 2340.699999999999, 3094.459999999998, 0.4754622549701098, 7.633855451915056, 0.10447168688308077], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 20287, 0, 0.0, 305.9099423275974, 156, 7237, 246.0, 409.0, 596.0, 1061.0, 5.641718740005951, 332.76223482312446, 1.6363188142400074], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 20282, 0, 0.0, 284.8555862340991, 141, 6418, 225.0, 388.90000000000146, 586.0, 1030.0, 5.646886138484301, 156.6459449704932, 1.6819338596071403], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 1556, 825, 53.02056555269923, 43932.770565552746, 1, 97291, 32293.0, 90003.0, 90003.0, 92766.06000000003, 0.48027285424367055, 379.4140169849066, 0.16123797195836195], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 1594, 930, 58.34378920953576, 45835.3883312423, 1, 97294, 35575.5, 90003.0, 90003.0, 97077.3, 0.46786221017638463, 75.10770786251764, 0.15854315130000535], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 20291, 1, 0.004928293332019122, 310.46764575427363, 155, 90001, 246.0, 405.0, 587.0, 1080.9900000000016, 5.639501580455657, 332.6096405285014, 1.6301684256004634], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 1671, 1007, 60.26331538001197, 50240.13883901864, 1, 98563, 46684.0, 90003.0, 90003.0, 93020.28, 0.45942577551813246, 1989.630169897494, 0.1624141901734023], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 1571, 884, 56.26989178866964, 47675.08720560151, 1, 98367, 42669.0, 90003.0, 90003.0, 93035.0, 0.47374899807062626, 210.32346133540224, 0.16100063606306442], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM", 20290, 0, 0.0, 123.37244948250411, 49, 3216, 78.0, 152.0, 332.0, 777.9600000000064, 5.640523253745151, 100.75825327881476, 1.6359720765256933], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 1711, 0, 0.0, 338.22092343658676, 30, 5597, 85.0, 879.8, 2270.9999999999986, 3109.959999999995, 0.47527566544148697, 71.67787641863953, 0.10628723377548878], "isController": false}, {"data": ["WIFSGriddedHighResItemSector", 1710, 0, 0.0, 319.80233918128664, 29, 3706, 84.0, 877.9000000000001, 2282.499999999998, 3026.89, 0.47546899733598336, 7.076731657306276, 0.10679479432351188], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 20281, 0, 0.0, 295.3022533405644, 150, 6637, 236.0, 395.0, 583.0, 1058.9900000000016, 5.6513768421451545, 2.0254446299485074, 1.639120041129991], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503/Service Unavailable", 885, 11.850562399571505, 0.33822517771153404], "isController": false}, {"data": ["504/Gateway Time-out", 6548, 87.68077129084092, 2.502484139723305], "isController": false}, {"data": ["502/Bad Gateway", 30, 0.4017139796464917, 0.011465260261407933], "isController": false}, {"data": ["502/Proxy Error", 4, 0.05356186395286556, 0.0015287013681877246], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 1, 0.01339046598821639, 3.8217534204693115E-4], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 261660, 7468, "504/Gateway Time-out", 6548, "503/Service Unavailable", 885, "502/Bad Gateway", 30, "502/Proxy Error", 4, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 1710, 866, "504/Gateway Time-out", 768, "503/Service Unavailable", 93, "502/Bad Gateway", 5, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 1651, 985, "504/Gateway Time-out", 897, "503/Service Unavailable", 82, "502/Bad Gateway", 3, "502/Proxy Error", 3, "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 1623, 969, "504/Gateway Time-out", 820, "503/Service Unavailable", 144, "502/Bad Gateway", 5, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 1689, 1001, "504/Gateway Time-out", 910, "503/Service Unavailable", 86, "502/Bad Gateway", 5, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 1556, 825, "504/Gateway Time-out", 701, "503/Service Unavailable", 119, "502/Bad Gateway", 4, "Non HTTP response code: org.apache.http.ConnectionClosedException/Non HTTP response message: Premature end of chunk coded message body: closing chunk expected", 1, "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 1594, 930, "504/Gateway Time-out", 767, "503/Service Unavailable", 158, "502/Bad Gateway", 5, "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 20291, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 1671, 1007, "504/Gateway Time-out", 919, "503/Service Unavailable", 86, "502/Bad Gateway", 1, "502/Proxy Error", 1, "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 1571, 884, "504/Gateway Time-out", 765, "503/Service Unavailable", 117, "502/Bad Gateway", 2, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
