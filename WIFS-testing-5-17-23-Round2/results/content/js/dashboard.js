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

    var data = {"OkPercent": 99.82554632052597, "KoPercent": 0.17445367947402599};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7401889018256155, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.09637494134209292, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.8975825598963955, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.9922977253095306, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.2823265691363851, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.9920143884892086, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.9921964902186421, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.8991584550097101, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.029429041353383457, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.9925196000863123, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.9926216527497841, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.9660370717972783, 500, 1500, "WIFSGriddedLowResItemGlobal"], "isController": false}, {"data": [0.900734235531241, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.9004463000287936, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.22479289940828404, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.28183642157441285, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.8993525179856116, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.0, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.26423340420505553, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.9920497877545147, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.97683284457478, 500, 1500, "WIFSGriddedHighResItemGlobal"], "isController": false}, {"data": [0.9755425219941349, 500, 1500, "WIFSGriddedHighResItemSector"], "isController": false}, {"data": [0.9008350730688935, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 260241, 454, 0.17445367947402599, 1306.9545037100145, 26, 59170, 341.0, 3070.7000000000044, 5669.9000000000015, 17916.280000000115, 72.12666129173964, 463.66549105439105, 21.711968772406117], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 8524, 6, 0.07038948850305021, 3527.3608634444095, 817, 40497, 2290.5, 6904.0, 10464.75, 19031.75, 2.3656992481328207, 0.6770646287026149, 0.8340013950936996], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 13899, 0, 0.0, 434.73523275055607, 197, 5448, 375.0, 633.0, 763.0, 985.0, 3.86400718590242, 1.3773072488812337, 1.1546740223497467], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM", 13892, 0, 0.0, 164.2790814857462, 62, 4129, 126.0, 284.0, 381.0, 544.0, 3.864749351864397, 1.3851201290373374, 1.1247024481011623], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 8499, 332, 3.906341922579127, 10255.552064948815, 1649, 59170, 7280.0, 22495.0, 28565.0, 31809.0, 2.3632924704428553, 0.6802692185917625, 0.8285371063368995], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 8476, 64, 0.7550731477111845, 2751.139924492687, 670, 35912, 1320.5, 5784.100000000001, 9317.89999999999, 25689.17999999997, 2.364072128186484, 0.6796112498009254, 0.8011064731256933], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC", 13900, 0, 0.0, 163.54359712230152, 63, 4151, 125.0, 285.0, 384.0, 537.0, 3.8641498356068342, 1.3773580956997016, 1.1547166500934485], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC", 13904, 0, 0.0, 163.25179804372792, 65, 4182, 125.0, 282.0, 380.0, 538.0, 3.8622179308689657, 1.3728977801135778, 1.1503676454248384], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 13903, 0, 0.0, 431.63446738114294, 195, 4361, 374.0, 629.0, 757.0, 951.0, 3.862714841460047, 1.3730744163002508, 1.1505156510208148], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 8512, 24, 0.2819548872180451, 4011.9937734962377, 1103, 47030, 2829.0, 7281.799999999999, 10574.999999999989, 22056.770000000055, 2.3635371088098958, 0.6763961550038291, 0.8355472982316233], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM", 13903, 0, 0.0, 163.3937279723798, 63, 2481, 126.0, 286.0, 380.0, 538.9599999999991, 3.862898365735316, 1.3806843768155526, 1.1203914205306533], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 13892, 0, 0.0, 162.50539879067128, 64, 2341, 125.0, 286.0, 378.0, 540.0699999999997, 3.8647256982281295, 1.3775633592317063, 1.1548887340408278], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal", 8524, 0, 0.0, 170.89101360863464, 44, 1889, 129.0, 415.0, 541.0, 805.0, 2.3681099709820406, 37.932758188995955, 0.5226492709393957], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 13892, 0, 0.0, 429.90642096170325, 182, 4797, 374.0, 619.7000000000007, 746.0, 956.0699999999997, 3.8638077307861645, 1.384782653514182, 1.1244284216545675], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 13892, 0, 0.0, 431.59141952202646, 186, 4328, 375.0, 627.0, 756.3499999999985, 952.0699999999997, 3.8644934779022577, 1.377480585385082, 1.1548193400762605], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 8450, 2, 0.023668639053254437, 2588.5036686390617, 833, 44138, 1624.0, 4996.900000000001, 7382.699999999999, 15694.759999999995, 2.355132195381767, 0.6739257810050366, 0.7934771556706148], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 8473, 0, 0.0, 2308.3941933199476, 705, 41291, 1341.0, 4673.800000000007, 6913.299999999999, 15798.160000000003, 2.3636573112554218, 0.6763199142557018, 0.8032741643719598], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 13900, 0, 0.0, 430.21000000000004, 184, 5807, 373.0, 622.8999999999996, 746.0, 935.0, 3.863170395552518, 1.3807816062228726, 1.1204703198038064], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 8500, 25, 0.29411764705882354, 5934.867764705884, 736, 41502, 4416.0, 11747.800000000001, 14537.699999999999, 22287.389999999985, 2.360102167434533, 0.6756901463686773, 0.8366377800573588], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 8466, 1, 0.011811953697141508, 2378.7329317269027, 771, 31852, 1432.5, 4840.0, 7228.299999999999, 14307.97, 2.358995935984441, 0.6749817880344905, 0.803993732088447], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM", 13899, 0, 0.0, 164.22059140945433, 66, 3323, 126.0, 284.0, 381.0, 540.0, 3.8641973317882847, 1.3849222859045902, 1.1245418016337], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 8525, 0, 0.0, 145.32480938416413, 29, 4215, 82.0, 346.40000000000055, 464.0, 972.9799999999941, 2.3681187053876993, 355.5206540533789, 0.5319016623429402], "isController": false}, {"data": ["WIFSGriddedHighResItemSector", 8525, 0, 0.0, 128.81501466275708, 26, 2304, 80.0, 357.0, 490.6999999999998, 767.7399999999998, 2.368214094332426, 49.32797345773703, 0.5342357966706938], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 13891, 0, 0.0, 430.9766755453167, 188, 9599, 373.0, 622.0, 749.0, 933.2399999999998, 3.864970060463368, 1.3851992306543515, 1.1247666777520346], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 276, 60.79295154185022, 0.10605554082561933], "isController": false}, {"data": ["502/Proxy Error", 25, 5.506607929515418, 0.009606480147248127], "isController": false}, {"data": ["500/INTERNAL SERVER ERROR", 153, 33.70044052863436, 0.05879165850115854], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 260241, 454, "502/Bad Gateway", 276, "500/INTERNAL SERVER ERROR", 153, "502/Proxy Error", 25, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 8524, 6, "502/Bad Gateway", 3, "502/Proxy Error", 2, "500/INTERNAL SERVER ERROR", 1, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 8499, 332, "502/Bad Gateway", 235, "500/INTERNAL SERVER ERROR", 75, "502/Proxy Error", 22, "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 8476, 64, "500/INTERNAL SERVER ERROR", 64, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 8512, 24, "502/Bad Gateway", 20, "500/INTERNAL SERVER ERROR", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 8450, 2, "502/Bad Gateway", 1, "500/INTERNAL SERVER ERROR", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 8500, 25, "502/Bad Gateway", 16, "500/INTERNAL SERVER ERROR", 8, "502/Proxy Error", 1, "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 8466, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
