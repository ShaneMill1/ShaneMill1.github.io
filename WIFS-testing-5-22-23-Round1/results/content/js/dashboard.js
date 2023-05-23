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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9046805542530686, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.960643616739855, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.7016092981671882, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.35220791594436873, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal-1"], "isController": false}, {"data": [0.9961889134433431, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal-0"], "isController": false}, {"data": [0.9970967144595524, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertUSA-0"], "isController": false}, {"data": [0.6923162832253741, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.9822037933497342, 500, 1500, "WIFSGriddedLowResItemGlobal"], "isController": false}, {"data": [0.9779376752552775, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertUSA-1"], "isController": false}, {"data": [0.4303599374021909, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.9775071159065334, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.4361607142857143, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.9886186281512049, 500, 1500, "WIFSGriddedLowResItemGlobal-1"], "isController": false}, {"data": [0.7284309342869915, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteIWXXM-1"], "isController": false}, {"data": [0.9969050075390842, 500, 1500, "WIFSGriddedLowResItemGlobal-0"], "isController": false}, {"data": [0.9746074615404983, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.9799820122475432, 500, 1500, "WIFSGriddedHighResItemSector"], "isController": false}, {"data": [0.9964285714285714, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteTAC-0"], "isController": false}, {"data": [0.7241071428571428, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteTAC-1"], "isController": false}, {"data": [0.9753892183859352, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.4270252175853604, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.8708646939774336, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.4576820008932559, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM-1"], "isController": false}, {"data": [0.9956453774006253, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM-0"], "isController": false}, {"data": [0.9965332140460748, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM-0"], "isController": false}, {"data": [0.45146499664504586, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM-1"], "isController": false}, {"data": [0.996534764140398, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteTAC-0"], "isController": false}, {"data": [0.4473507712944333, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteTAC-1"], "isController": false}, {"data": [0.977992037984896, 500, 1500, "WIFSGriddedHighResItemGlobal"], "isController": false}, {"data": [0.4566867604375977, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteTAC-1"], "isController": false}, {"data": [0.9962053571428572, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteIWXXM-0"], "isController": false}, {"data": [0.7232142857142857, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteIWXXM-1"], "isController": false}, {"data": [0.9962045099352534, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteTAC-0"], "isController": false}, {"data": [0.4364813574458585, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.9787112917532734, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal-1"], "isController": false}, {"data": [0.9970542676710842, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal-0"], "isController": false}, {"data": [0.6939732142857142, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.9963169642857143, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM-0"], "isController": false}, {"data": [0.45479910714285715, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM-1"], "isController": false}, {"data": [0.6976121401472886, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.9831599015013107, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertWesternHemi-1"], "isController": false}, {"data": [0.9826506566405423, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertUSA-1"], "isController": false}, {"data": [0.9594879059483934, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.9840825827613114, 500, 1500, "WIFSGriddedHighResItemGlobal-1"], "isController": false}, {"data": [0.9971227113980315, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertWesternHemi-0"], "isController": false}, {"data": [0.9955385511544165, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertUSA-0"], "isController": false}, {"data": [0.996944808157759, 500, 1500, "WIFSGriddedHighResItemGlobal-0"], "isController": false}, {"data": [0.6016046671605461, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertWesternHemi-1"], "isController": false}, {"data": [0.9969616331718166, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertWesternHemi-0"], "isController": false}, {"data": [0.9969484345005627, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica-0"], "isController": false}, {"data": [0.9958714572640036, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteIWXXM-0"], "isController": false}, {"data": [0.7232760544521312, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteIWXXM-1"], "isController": false}, {"data": [0.9972221854786439, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica-0"], "isController": false}, {"data": [0.9003888940329898, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica-1"], "isController": false}, {"data": [0.9834910968425233, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica-1"], "isController": false}, {"data": [0.3376252166893832, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.9936398125418433, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteTAC-0"], "isController": false}, {"data": [0.7208212452577549, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteTAC-1"], "isController": false}, {"data": [0.6935951796474001, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.4378070567217508, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.996312025033527, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteIWXXM-0"], "isController": false}, {"data": [0.5761125515927611, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.69609375, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.9964261782443601, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteTAC-0"], "isController": false}, {"data": [0.71632789814608, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteTAC-1"], "isController": false}, {"data": [0.44498995759875026, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteTAC-1"], "isController": false}, {"data": [0.9950903816112475, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteTAC-0"], "isController": false}, {"data": [0.43435473048535006, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.9865025725131271, 500, 1500, "WIFSGriddedHighResItemSector-1"], "isController": false}, {"data": [0.9971497348129141, 500, 1500, "WIFSGriddedHighResItemSector-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2655177, 0, 0.0, 255.970273921465, 0, 75869, 43.0, 1529.9000000000015, 2564.9500000000007, 3756.0, 737.3134311779761, 2023765.0781425075, 284.1348860145687], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 75604, 0, 0.0, 195.00972170784775, 9, 75869, 168.0, 437.0, 573.9500000000007, 972.0, 21.003380643075044, 27919.90962758285, 13.86551300265501], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM", 4474, 0, 0.0, 694.1282968261069, 90, 13504, 505.5, 1484.0, 1707.0, 2168.75, 1.2446544400835482, 1.5606799815110115, 0.6685155684042495], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal-1", 75569, 0, 0.0, 1458.4151437759037, 148, 16518, 2242.5, 3850.0, 4217.950000000001, 5011.990000000002, 21.04199488659114, 552978.9954978985, 6.904404572162718], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal-0", 75569, 0, 0.0, 44.925101562810106, 0, 7536, 4.0, 226.0, 235.0, 465.0, 21.048606016243042, 16.053673143247867, 6.906573849079749], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA-0", 75604, 0, 0.0, 42.02185069573054, 0, 7104, 4.0, 226.0, 235.0, 464.0, 21.00438429433031, 16.060969631309213, 6.933087784651997], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 4477, 0, 0.0, 712.4087558633015, 87, 13299, 510.0, 1533.0, 1746.0, 2181.9800000000023, 1.245355300395721, 1.568855798350078, 0.688350683617166], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal", 75606, 0, 0.0, 104.41373700500034, 2, 27758, 12.0, 247.0, 451.0, 866.5600000000704, 21.004747362946567, 353.8943909473042, 8.328054130230766], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA-1", 75604, 0, 0.0, 152.95006877942782, 8, 75866, 143.0, 350.0, 451.0, 834.0, 21.003392312887318, 27903.86492921436, 6.932760353277259], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 4473, 0, 0.0, 1138.3507712944352, 253, 14878, 894.0, 2121.0, 2377.6000000000004, 2883.0, 1.2442737814017093, 1.5674933378986378, 0.6877528908919605], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 75535, 0, 0.0, 123.75335936982829, 4, 13924, 36.0, 271.0, 472.0, 883.9800000000032, 21.09509030519528, 4308.232689606036, 13.390438182008724], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 4480, 0, 0.0, 1145.714732142862, 251, 33906, 896.0, 2146.8, 2392.95, 2920.6099999999924, 1.2452670124876932, 1.5590159277433817, 0.6664124246516171], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal-1", 75606, 0, 0.0, 62.39081554374015, 1, 27757, 6.0, 227.0, 242.0, 666.0, 21.00475903396889, 340.6025135080651, 4.16402937880438], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM-1", 4474, 0, 0.0, 649.3551631649516, 85, 13499, 447.5, 1428.5, 1646.25, 2083.25, 1.244655132602787, 0.6855327097538787, 0.3342579701814125], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal-0", 75606, 0, 0.0, 41.99010660529652, 0, 14550, 4.0, 225.0, 235.0, 461.0, 21.00545348314182, 13.292513532300683, 4.1641670479275295], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 75534, 0, 0.0, 138.95150528238827, 5, 28334, 66.0, 303.0, 483.0, 899.0, 21.099654763903374, 10149.85530022188, 13.434545806704099], "isController": false}, {"data": ["WIFSGriddedHighResItemSector", 75607, 0, 0.0, 103.93032391180783, 2, 13768, 14.0, 253.0, 453.0, 763.9600000000064, 21.003513873675562, 455.05557530071343, 8.532677511180696], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC-0", 4480, 0, 0.0, 46.395982142857164, 1, 1745, 3.0, 220.0, 231.0, 450.3799999999992, 1.245538788663484, 0.8855002325654457, 0.344226051945084], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC-1", 4480, 0, 0.0, 650.8392857142852, 82, 13516, 448.5, 1472.8000000000002, 1677.8499999999995, 2038.5699999999988, 1.2454089444825605, 0.6835154558585927, 0.3441901672739889], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 75536, 0, 0.0, 121.7891733742849, 2, 10058, 22.0, 258.90000000000146, 470.0, 937.0, 21.090398390634185, 1643.8494227160982, 13.346267731573194], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 4481, 0, 0.0, 1154.4262441419305, 262, 30640, 894.0, 2129.8, 2363.8999999999996, 3073.0200000000114, 1.244838752961041, 1.5657737439588095, 0.6856338444043234], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 75599, 0, 0.0, 391.14190663897665, 27, 9019, 491.0, 909.0, 1049.9500000000007, 1413.9800000000032, 21.012668360673327, 100285.42170679089, 13.91268471536769], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM-1", 4478, 0, 0.0, 1099.2416257257726, 258, 30448, 839.5, 2084.2, 2332.05, 2954.5200000000004, 1.2455742200071265, 0.6860389258633001, 0.33450479541207007], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM-0", 4478, 0, 0.0, 46.53260384100046, 1, 2080, 3.0, 220.0, 231.0, 455.0, 1.2459492043370606, 0.8760580342994958, 0.334605499211613], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM-0", 4471, 0, 0.0, 45.22232162827105, 1, 3049, 4.0, 219.0, 230.39999999999964, 451.5599999999995, 1.2444921965245517, 0.8750335756813253, 0.33421421293383957], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM-1", 4471, 0, 0.0, 1081.2905390293024, 252, 9650, 834.0, 2076.0, 2321.3999999999996, 2751.119999999999, 1.2441590475490818, 0.6852594754078927, 0.3341247442148413], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC-0", 4473, 0, 0.0, 42.877040017885086, 1, 2040, 3.0, 219.0, 231.0, 449.2600000000002, 1.2447228675877005, 0.8849201636756308, 0.3440005581321477], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC-1", 4473, 0, 0.0, 1095.429912810196, 250, 14877, 840.0, 2095.6, 2320.0, 2786.26, 1.2442744736521474, 0.6828928263598699, 0.34387663676128677], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 75609, 0, 0.0, 115.86062505786455, 3, 7264, 29.0, 262.90000000000146, 466.0, 876.9900000000016, 21.001187425785886, 3169.449831748797, 8.490714447534529], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC-1", 4479, 0, 0.0, 1105.3005135074764, 241, 31076, 833.0, 2084.0, 2322.0, 2885.799999999991, 1.2449257255465485, 0.6832502517159769, 0.34405662141569654], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM-0", 4480, 0, 0.0, 43.58035714285718, 1, 3041, 3.0, 219.0, 229.0, 448.1899999999996, 1.2455187043269265, 0.8757553389798701, 0.33448988641592264], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM-1", 4480, 0, 0.0, 670.3506696428578, 85, 31305, 450.0, 1473.9, 1684.0, 2154.379999999999, 1.2453348588685353, 0.6859070902361856, 0.33444051385629614], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC-0", 4479, 0, 0.0, 46.03371288233975, 0, 7059, 4.0, 219.0, 230.0, 450.0, 1.2452714992134688, 0.8853102064720755, 0.34415218191153485], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 4479, 0, 0.0, 1151.3813351194467, 242, 31250, 880.0, 2135.0, 2354.0, 2961.7999999999975, 1.2449253795229647, 1.56831419881311, 0.6881130515722638], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal-1", 75533, 0, 0.0, 156.8881548462243, 11, 71471, 164.0, 370.0, 472.0, 835.0, 21.10202801069112, 35447.23606445671, 6.635598651799357], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal-0", 75533, 0, 0.0, 42.66814504918395, 0, 7382, 4.0, 226.0, 236.0, 461.0, 21.104303872023532, 15.807618232267627, 6.6363143035074], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC", 4480, 0, 0.0, 697.2837053571413, 90, 13521, 512.0, 1510.0, 1738.8499999999995, 2138.569999999999, 1.2454085982676033, 1.5689229411769612, 0.6883801431830697], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM-0", 4480, 0, 0.0, 43.64843749999992, 1, 1748, 4.0, 219.0, 229.0, 450.1899999999996, 1.2456426835036036, 0.8746260639053623, 0.3333067336718627], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM-1", 4480, 0, 0.0, 1102.0212053571406, 248, 33902, 846.0, 2090.7000000000003, 2318.0, 2807.849999999994, 1.2452677047603693, 0.6846540212696172, 0.3332063975628332], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM", 4481, 0, 0.0, 698.7181432715915, 89, 30971, 501.0, 1513.6000000000004, 1730.0, 2204.0800000000017, 1.2452244627555336, 1.5589626574732365, 0.666389653896516], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi-1", 75534, 0, 0.0, 95.5245584769769, 4, 28330, 54.0, 262.0, 299.0, 715.0, 21.09966655185793, 10133.974405399522, 6.717276656157896], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA-1", 75536, 0, 0.0, 75.43479930099542, 1, 10052, 15.0, 235.0, 257.0, 688.0, 21.09041016793647, 1628.0119369450176, 6.673137592198648], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 75533, 0, 0.0, 199.59542186858656, 12, 71476, 194.0, 463.0, 569.0, 948.9900000000016, 21.101998533842316, 35462.992440657, 13.271178765424269], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal-1", 75609, 0, 0.0, 73.15819545292084, 2, 6984, 22.0, 238.0, 256.0, 680.0, 21.00143242718495, 3156.11480098069, 4.245406750417271], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi-0", 75592, 0, 0.0, 41.66664461847749, 0, 7100, 4.0, 226.0, 235.0, 462.0, 21.028491057216346, 16.120474101479328, 6.982116171341365], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA-0", 75536, 0, 0.0, 46.240229824190486, 0, 7292, 4.0, 226.0, 235.0, 465.9900000000016, 21.09051616424893, 15.838483330378345, 6.673171130094388], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal-0", 75609, 0, 0.0, 42.66433890145334, 0, 7238, 4.0, 226.0, 236.0, 463.0, 21.002645851707303, 13.37277841339176, 4.245652042288488], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi-1", 75592, 0, 0.0, 800.5794263943317, 71, 15330, 1147.0, 2026.9000000000015, 2274.9500000000007, 2787.970000000005, 21.022894296769557, 277444.6094527513, 6.980257871974267], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi-0", 75534, 0, 0.0, 43.3774326793236, 0, 7354, 4.0, 226.0, 234.95000000000073, 462.0, 21.099943572581864, 15.886773920371693, 6.717364848302428], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica-0", 75535, 0, 0.0, 42.9418547693126, 0, 7292, 4.0, 223.0, 233.0, 460.0, 21.095426117274204, 15.862771592090954, 6.695325671986441], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM-0", 4481, 0, 0.0, 43.90225396116949, 1, 3346, 3.0, 219.0, 230.0, 451.0, 1.2453781213661417, 0.8744403020139219, 0.3332359426311747], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM-1", 4481, 0, 0.0, 654.7529569292551, 86, 30970, 446.0, 1474.0, 1669.8999999999996, 2063.720000000001, 1.2452251548264217, 0.6846306271164798, 0.3331950121312886], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica-0", 75599, 0, 0.0, 42.3019616661593, 0, 7319, 4.0, 226.0, 236.0, 463.0, 21.015740886942716, 16.090176616565515, 6.957359531907794], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica-1", 75599, 0, 0.0, 348.8003809574205, 26, 8791, 454.0, 849.0, 988.0, 1337.950000000008, 21.012680041581195, 100269.38962213547, 6.95634622470315], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica-1", 75535, 0, 0.0, 80.71912358509294, 2, 13921, 28.0, 245.0, 268.0, 692.0, 21.09509619654312, 4292.371369283923, 6.6952209608169095], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 75569, 0, 0.0, 1503.4286413741038, 150, 16521, 2282.5, 3889.9000000000015, 4260.9000000000015, 5091.950000000008, 21.041983168418287, 552994.7361688227, 13.8088014542745], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC-0", 4481, 0, 0.0, 48.59830395001115, 1, 3550, 3.0, 219.0, 229.0, 497.0000000000582, 1.2452455712637005, 0.8840757131920999, 0.34292895614879254], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC-1", 4481, 0, 0.0, 654.043963401027, 87, 11128, 447.0, 1479.0, 1680.0, 2069.6200000000026, 1.2451113195095689, 0.6821361818797541, 0.3428919844743149], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC", 4481, 0, 0.0, 702.6884623967871, 89, 11129, 507.0, 1533.6000000000004, 1758.8999999999996, 2232.4400000000023, 1.2450967888395315, 1.5660983047122232, 0.6857759657280232], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 4478, 0, 0.0, 1145.8229120142923, 261, 30449, 895.0, 2141.0, 2400.1000000000004, 2983.7800000000007, 1.245573873545602, 1.56183286487554, 0.6690094047364072], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM-0", 4474, 0, 0.0, 44.72239606615993, 1, 2086, 4.0, 219.0, 230.25, 455.0, 1.2449453659872243, 0.8753522104597672, 0.33433591371727217], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 75592, 0, 0.0, 842.2997407133035, 72, 15332, 1184.0, 2071.9000000000015, 2325.9500000000007, 2837.0, 21.02288260342003, 277460.5713072252, 13.960507978833613], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM", 4480, 0, 0.0, 713.9725446428571, 87, 31310, 501.0, 1526.9, 1740.8999999999996, 2262.1399999999976, 1.2453345126947677, 1.5615327288086736, 0.6688808417794162], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC-0", 4477, 0, 0.0, 42.86955550591916, 0, 2048, 4.0, 218.0, 228.0, 449.22000000000025, 1.2454699750488716, 0.8854513103863071, 0.3442070341199518], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC-1", 4477, 0, 0.0, 669.4896135805222, 86, 12854, 461.0, 1492.0, 1705.0, 2068.2000000000025, 1.2453559932305152, 0.6834863947222163, 0.3441755332853865], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC-1", 4481, 0, 0.0, 1108.10243249275, 239, 30638, 847.0, 2074.0, 2314.399999999998, 2918.4400000000023, 1.2448394446032556, 0.6819872347875258, 0.34281711267394344], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC-0", 4481, 0, 0.0, 46.28364204418647, 0, 3538, 3.0, 220.0, 230.0, 455.1800000000003, 1.245317553196959, 0.884126817552919, 0.34294877929838125], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 4471, 0, 0.0, 1126.5520017893073, 257, 9655, 886.0, 2136.0, 2375.7999999999993, 2873.5599999999995, 1.244158701333178, 1.5600583715935556, 0.668249302473875], "isController": false}, {"data": ["WIFSGriddedHighResItemSector-1", 75607, 0, 0.0, 62.39077069583521, 1, 13538, 8.0, 228.0, 262.9500000000007, 675.9800000000032, 21.00352554317283, 441.6619783435434, 4.266341125956982], "isController": false}, {"data": ["WIFSGriddedHighResItemSector-0", 75607, 0, 0.0, 41.50673879402687, 0, 3699, 4.0, 226.0, 235.0, 461.0, 21.003624734423198, 13.39391303865073, 4.266361274179713], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2655177, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
