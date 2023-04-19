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

    var data = {"OkPercent": 99.04596516452013, "KoPercent": 0.9540348354798757};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8385242990897044, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9392891145668042, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.10545549464891674, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.973336719146775, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.1371308016877637, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.9732783243414789, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.9733519446735613, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.9385391547150653, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.046204188481675394, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.9731264674154452, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.9721940071102082, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.911641868963717, 500, 1500, "WIFSGriddedLowResItemGlobal"], "isController": false}, {"data": [0.9387774533451821, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.938737938039614, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.10615343633457645, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.11858804865150714, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.9404633449698508, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.11108165429480382, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.9734052681688353, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.9104672409292612, 500, 1500, "WIFSGriddedHighResItemGlobal"], "isController": false}, {"data": [0.9146436961628818, 500, 1500, "WIFSGriddedHighResItemSector"], "isController": false}, {"data": [0.9398095238095238, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 230914, 2203, 0.9540348354798757, 1480.4335077128264, 1, 60031, 191.0, 496.0, 3515.9500000000007, 59998.0, 63.12494071289954, 232.56326517734394, 18.799978267518842], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 15755, 2, 0.012694382735639479, 373.28276737543786, 155, 30920, 309.0, 557.3999999999996, 980.0, 1327.4400000000005, 4.378802095377008, 1.5607557118805198, 1.3085092199075823], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 3831, 177, 4.620203602192639, 8349.815974941255, 948, 60016, 3555.0, 20606.80000000001, 37688.39999999932, 60009.68, 1.0512725172227855, 0.3011187071316944, 0.3706146276537359], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM", 15752, 1, 0.0063484002031488065, 148.22174961909616, 54, 30140, 104.0, 196.0, 509.0, 832.0, 4.379105063493131, 1.5694399785367696, 1.2743879969931184], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 3801, 675, 17.75848460931334, 15652.70402525651, 1, 60018, 11039.0, 31021.4, 38864.89999999995, 60008.0, 1.0428901969144608, 0.3045112349057352, 0.3656226373948158], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 3792, 326, 8.59704641350211, 8505.999736286914, 2, 60018, 3379.0, 28906.40000000001, 32189.949999999997, 60009.0, 1.041638052752155, 0.3048717807629339, 0.3529769573290994], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC", 15755, 1, 0.006347191367819739, 145.43110123770188, 54, 30791, 104.0, 194.39999999999964, 510.1999999999989, 839.880000000001, 4.378869031654317, 1.5608034553285877, 1.3085292223498255], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC", 15761, 0, 0.0, 144.3601294334128, 53, 6047, 103.0, 193.0, 517.0, 837.3799999999992, 4.378150415481224, 1.5562956555030913, 1.304038942111107], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 15758, 5, 0.0317299149638279, 377.92955958878133, 154, 31243, 306.0, 555.1000000000004, 985.0, 1322.4099999999999, 4.377720795979542, 1.5560249244532016, 1.3039109792712502], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 3820, 174, 4.554973821989528, 9271.348691099487, 1, 60022, 4842.5, 19625.6, 36857.95, 60008.79, 1.0463781073594896, 0.2996767642667629, 0.36991101060950704], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM", 15759, 0, 0.0, 147.54584681769228, 54, 17449, 104.0, 200.0, 511.0, 834.3999999999996, 4.377993740405168, 1.5647907314338783, 1.2697892000979834], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 15752, 2, 0.012696800406297613, 148.9667978669373, 54, 30517, 104.0, 194.0, 521.3499999999985, 833.3499999999967, 4.379069759037183, 1.5608511073191793, 1.3085892053372832], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal", 3831, 0, 0.0, 293.05481597494094, 54, 6072, 140.0, 967.0, 1219.3999999999996, 1556.4399999999987, 1.0646901393184982, 17.224123909533297, 0.23498044090427794], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 15754, 2, 0.012695188523549575, 376.72362574584355, 156, 30947, 306.0, 551.5, 1001.0, 1344.9000000000015, 4.378905095834759, 1.5693438850080177, 1.2743298032800372], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 15752, 5, 0.03174200101574403, 380.4809547993887, 154, 30925, 307.0, 550.0, 992.0, 1349.0, 4.379008890622354, 1.5607577406182265, 1.3085710161430084], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 3754, 236, 6.2866275972296215, 8048.159030367602, 1, 60031, 3417.5, 17902.5, 37226.75, 60009.0, 1.0355099362336622, 0.29771864260273795, 0.3488778593755991], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 3782, 214, 5.6583818085668955, 7573.896086726604, 1, 60018, 3344.5, 17321.90000000001, 32661.549999999992, 60009.0, 1.0395896177377848, 0.3006534767015927, 0.3532980341530753], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 15755, 2, 0.012694382735639479, 375.6613138686114, 154, 30679, 306.0, 544.0, 1001.1999999999989, 1336.4400000000005, 4.378236261355833, 1.5648291077540772, 1.2698595406471507], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 3811, 157, 4.119653634216741, 10868.84807137232, 2, 60015, 6821.0, 22180.6, 31652.799999999996, 60008.0, 1.046048935107911, 0.2999002384180479, 0.3708161752384489], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 3772, 218, 5.779427359490986, 7865.338282078481, 1, 60016, 3544.0, 17642.40000000001, 32886.7, 60009.0, 1.0377313849367182, 0.2999560638060367, 0.3536799349051901], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM", 15755, 0, 0.0, 147.30561726436142, 54, 28476, 103.0, 196.0, 507.0, 837.4400000000005, 4.378920148007779, 1.5693981389832568, 1.2743341836975763], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 3831, 0, 0.0, 287.01096319498794, 36, 6216, 89.0, 729.4000000000005, 1121.0, 4430.039999999983, 1.064573866170477, 171.9745991860984, 0.23911327072188446], "isController": false}, {"data": ["WIFSGriddedHighResItemSector", 3831, 0, 0.0, 238.77838684416622, 33, 5461, 85.0, 872.8000000000002, 1109.7999999999993, 1885.8799999999933, 1.0647218007833528, 26.014273731227366, 0.24018626560640088], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 15750, 6, 0.0380952380952381, 383.29339682539774, 154, 30866, 304.0, 540.8999999999996, 1008.0, 1361.4899999999998, 4.378891131313631, 1.5692411247869982, 1.2743257393861935], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["408/Request Timeout", 5, 0.22696323195642307, 0.002165308296595269], "isController": false}, {"data": ["503/Service Unavailable", 8, 0.3631411711302769, 0.0034644932745524306], "isController": false}, {"data": ["502/Bad Gateway", 680, 30.866999546073536, 0.29448192833695663], "isController": false}, {"data": ["504/Gateway Time-out", 1076, 48.84248751702224, 0.46597434542730193], "isController": false}, {"data": ["502/Proxy Error", 245, 11.12119836586473, 0.10610010653316819], "isController": false}, {"data": ["500/INTERNAL SERVER ERROR", 189, 8.579210167952791, 0.08184865361130118], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 230914, 2203, "504/Gateway Time-out", 1076, "502/Bad Gateway", 680, "502/Proxy Error", 245, "500/INTERNAL SERVER ERROR", 189, "503/Service Unavailable", 8], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 15755, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 3831, 177, "504/Gateway Time-out", 156, "502/Bad Gateway", 14, "502/Proxy Error", 6, "500/INTERNAL SERVER ERROR", 1, "", ""], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM", 15752, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 3801, 675, "502/Bad Gateway", 401, "504/Gateway Time-out", 130, "500/INTERNAL SERVER ERROR", 75, "502/Proxy Error", 68, "408/Request Timeout", 1], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 3792, 326, "504/Gateway Time-out", 107, "502/Bad Gateway", 87, "502/Proxy Error", 65, "500/INTERNAL SERVER ERROR", 65, "408/Request Timeout", 2], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC", 15755, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 15758, 5, "502/Bad Gateway", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 3820, 174, "504/Gateway Time-out", 148, "502/Bad Gateway", 19, "502/Proxy Error", 4, "500/INTERNAL SERVER ERROR", 2, "503/Service Unavailable", 1], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 15752, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 15754, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 15752, 5, "502/Bad Gateway", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 3754, 236, "504/Gateway Time-out", 147, "502/Bad Gateway", 60, "502/Proxy Error", 23, "503/Service Unavailable", 3, "500/INTERNAL SERVER ERROR", 3], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 3782, 214, "504/Gateway Time-out", 128, "502/Proxy Error", 29, "500/INTERNAL SERVER ERROR", 29, "502/Bad Gateway", 25, "503/Service Unavailable", 2], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 15755, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 3811, 157, "504/Gateway Time-out", 121, "502/Bad Gateway", 23, "502/Proxy Error", 7, "500/INTERNAL SERVER ERROR", 6, "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 3772, 218, "504/Gateway Time-out", 139, "502/Proxy Error", 43, "502/Bad Gateway", 25, "500/INTERNAL SERVER ERROR", 8, "503/Service Unavailable", 2], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 15750, 6, "502/Bad Gateway", 6, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
