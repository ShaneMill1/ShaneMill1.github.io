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

    var data = {"OkPercent": 99.075628319805, "KoPercent": 0.9243716801949918};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8751178458920646, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.8788103537788327, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.9549636444576347, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.9594704835360427, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.961119347664937, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.8816443027652161, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.956223589591519, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.9603486646884273, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.8845132743362832, 500, 1500, "WIFSGriddedLowResItemGlobal"], "isController": false}, {"data": [0.8920623145400594, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.8800178081175336, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.8889300808185661, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [4.6816479400749064E-4, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.9567232811688793, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.9234513274336283, 500, 1500, "WIFSGriddedHighResItemGlobal"], "isController": false}, {"data": [0.9172566371681415, 500, 1500, "WIFSGriddedHighResItemSector"], "isController": false}, {"data": [0.8918156859835275, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 173956, 1608, 0.9243716801949918, 1995.31941985332, 1, 90023, 186.0, 948.0, 15610.95, 58726.79000000004, 47.59879933125925, 12062.910733001272, 14.033674460974845], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 1130, 197, 17.43362831858407, 29020.189380530963, 1, 88880, 27638.5, 56599.1, 61059.600000000006, 68878.39, 0.3102851850356869, 335.8522163556641, 0.10908463536410867], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 13483, 0, 0.0, 402.0400504338817, 107, 31645, 298.0, 691.0, 915.0, 1617.0, 3.7479534000661583, 1.3359404209220194, 1.116333776386893], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM", 13478, 0, 0.0, 220.1191571449768, 37, 66737, 108.0, 474.0, 621.0, 1190.6299999999974, 3.748413015153011, 1.3434253677355028, 1.0871861967777776], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 1104, 240, 21.73913043478261, 38359.27898550723, 1, 90023, 34285.5, 75981.5, 90001.0, 90009.0, 0.30393814638476035, 6438.601751046095, 0.10625962539623457], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 1091, 254, 23.281393217231898, 35485.7607699358, 1, 90012, 29819.0, 75263.80000000003, 90002.0, 90008.08, 0.30599849609171764, 26.791829217411653, 0.10339402309349054], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC", 13484, 1, 0.007416196974191634, 207.80754968851986, 37, 90002, 101.0, 459.0, 588.75, 1132.7499999999982, 3.7477531963882154, 1.3358492451233208, 1.1162741454085994], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC", 13490, 0, 0.0, 197.97531504818303, 38, 13461, 101.0, 453.0, 593.4499999999989, 1104.0, 3.747261776652087, 1.3320344596692966, 1.1124683399435884], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 13489, 2, 0.014826895989324634, 414.8198532137293, 108, 90002, 296.0, 693.0, 902.0, 1638.1000000000004, 3.747494076909058, 1.3320779669212595, 1.1125373040823765], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 1121, 181, 16.146297948260482, 31179.058876003524, 1, 85543, 28533.0, 60199.40000000001, 64173.899999999994, 78567.13999999997, 0.30798251670344967, 1232.9232837611582, 0.10857586770502473], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM", 13489, 1, 0.007413447994662317, 224.86900437393368, 36, 90002, 109.0, 470.0, 620.5, 1173.1000000000004, 3.7474201586145797, 1.3393898631715193, 1.0832386395995268], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 13480, 1, 0.00741839762611276, 203.19421364985152, 38, 90002, 101.0, 457.89999999999964, 589.9499999999989, 1103.5700000000015, 3.7484677998829854, 1.3361039525305773, 1.1164869911760846], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal", 1130, 13, 1.1504424778761062, 427.2530973451327, 7, 55246, 180.0, 756.9, 1086.5000000000032, 1618.5300000000075, 0.31467040781006383, 5.029286038080967, 0.06914144702857847], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 13480, 2, 0.01483679525222552, 398.04465875371, 108, 90001, 284.0, 657.0, 865.0, 1621.9500000000025, 3.7479383558673027, 1.3432145225173802, 1.087048527043544], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 13477, 0, 0.0, 406.3154262818129, 105, 67143, 298.0, 683.0, 912.0999999999985, 1675.2199999999993, 3.7486780743082178, 1.3361987276586909, 1.1165496217421937], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 1058, 168, 15.879017013232515, 31653.04064272213, 1, 90002, 29417.5, 57711.3, 61891.95, 82180.26000000002, 0.3176678257438847, 417.0651443223969, 0.10671653521083625], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 1082, 184, 17.005545286506468, 36368.59704251382, 1, 90011, 32691.5, 74580.90000000001, 87236.29999999999, 90004.17, 0.30823830980571015, 91.46303130646821, 0.10445184912361467], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 13487, 6, 0.04448728405130867, 430.26618224957355, 104, 90002, 285.0, 665.2000000000007, 892.5999999999985, 1630.479999999996, 3.747708915251261, 1.3393926622974426, 1.0833221083148175], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 1115, 201, 18.026905829596412, 36308.29955156949, 1, 90019, 33117.0, 68198.79999999999, 79614.8, 90007.84, 0.3057314920711348, 3311.9797693859987, 0.10808085950170977], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 1068, 148, 13.857677902621722, 31178.762172284663, 1, 90012, 28270.5, 57303.8, 62200.649999999994, 90001.31, 0.3132156780283601, 249.41145214023012, 0.10644439057995049], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM", 13483, 0, 0.0, 214.98353482162605, 38, 66754, 107.0, 469.0, 609.7999999999993, 1166.1599999999999, 3.7480346654983996, 1.3432897678104618, 1.0870764605986571], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 1130, 3, 0.26548672566371684, 402.63185840707945, 19, 65057, 98.0, 591.9, 907.45, 1913.160000000009, 0.31467443866118, 44.32138288259469, 0.07037152973965842], "isController": false}, {"data": ["WIFSGriddedHighResItemSector", 1130, 3, 0.26548672566371684, 354.1371681415934, 10, 65036, 111.5, 619.5999999999999, 930.9000000000001, 1347.2500000000014, 0.31467987171086437, 4.978220504383797, 0.07068004931005742], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 13477, 3, 0.02226014691696965, 412.4097351042533, 109, 90004, 284.0, 661.0, 874.0999999999985, 1574.2199999999993, 3.7491963722623454, 1.3436449954821585, 1.0874134009393717], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503/Service Unavailable", 1278, 79.4776119402985, 0.7346685368713928], "isController": false}, {"data": ["504/Gateway Time-out", 265, 16.480099502487562, 0.15233737266895078], "isController": false}, {"data": ["502/Bad Gateway", 1, 0.06218905472636816, 5.748580100715123E-4], "isController": false}, {"data": ["500/INTERNAL SERVER ERROR", 64, 3.9800995024875623, 0.03679091264457679], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 173956, 1608, "503/Service Unavailable", 1278, "504/Gateway Time-out", 265, "500/INTERNAL SERVER ERROR", 64, "502/Bad Gateway", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 1130, 197, "503/Service Unavailable", 188, "500/INTERNAL SERVER ERROR", 9, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 1104, 240, "503/Service Unavailable", 162, "504/Gateway Time-out", 74, "500/INTERNAL SERVER ERROR", 4, "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 1091, 254, "503/Service Unavailable", 157, "504/Gateway Time-out", 86, "500/INTERNAL SERVER ERROR", 10, "502/Bad Gateway", 1, "", ""], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC", 13484, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 13489, 2, "504/Gateway Time-out", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 1121, 181, "503/Service Unavailable", 177, "500/INTERNAL SERVER ERROR", 4, "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM", 13489, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 13480, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal", 1130, 13, "500/INTERNAL SERVER ERROR", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 13480, 2, "504/Gateway Time-out", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 1058, 168, "503/Service Unavailable", 162, "504/Gateway Time-out", 4, "500/INTERNAL SERVER ERROR", 2, "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 1082, 184, "503/Service Unavailable", 130, "504/Gateway Time-out", 49, "500/INTERNAL SERVER ERROR", 5, "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 13487, 6, "504/Gateway Time-out", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 1115, 201, "503/Service Unavailable", 171, "504/Gateway Time-out", 24, "500/INTERNAL SERVER ERROR", 6, "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 1068, 148, "503/Service Unavailable", 131, "504/Gateway Time-out", 12, "500/INTERNAL SERVER ERROR", 5, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 1130, 3, "500/INTERNAL SERVER ERROR", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResItemSector", 1130, 3, "500/INTERNAL SERVER ERROR", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 13477, 3, "504/Gateway Time-out", 3, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
