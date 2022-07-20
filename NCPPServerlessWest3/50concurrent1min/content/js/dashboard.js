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

    var data = {"OkPercent": 99.16597685351492, "KoPercent": 0.8340231464850766};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.492214222125041, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "NCPPServerlessWestGFSPosition-1time-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSTrajectory20waypoints"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSCorridor5waypoints"], "isController": false}, {"data": [0.009040333796940195, 500, 1500, "NCPPServerlessWestGFSAreaGlobe-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSPosition-halftime-fullzedd"], "isController": false}, {"data": [0.5, 500, 1500, "NCPPServerlessWestGFSPosition-1time-1zedd"], "isController": false}, {"data": [0.4990949056115852, 500, 1500, "NCPPServerlessWestGFSPosition-fulltime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSCorridor10waypoints"], "isController": false}, {"data": [0.5071107784431138, 500, 1500, "NCPPServerlessWestGFSPosition-halftime-1zedd"], "isController": false}, {"data": [0.4902946273830156, 500, 1500, "NCPPServerlessWestGFSAreaTexas-halftime-1zedd"], "isController": false}, {"data": [0.4801812004530011, 500, 1500, "NCPPServerlessWestGFSAreaTexas-fulltime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSCorridor20waypoints"], "isController": false}, {"data": [0.5529884480160723, 500, 1500, "NCPPServerlessWestGFSCollectionMeta"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSAreaUS-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestNWM-position-1month"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSTrajectory5waypoints"], "isController": false}, {"data": [0.49068501003152765, 500, 1500, "NCPPServerlessWestGFSAreaTexas-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestNWM-position-1hour"], "isController": false}, {"data": [0.012300531914893617, 500, 1500, "NCPPServerlessWestGFSPosition-fulltime-halfzedd"], "isController": false}, {"data": [0.49430823117338, 500, 1500, "NCPPServerlessWestGFSAreaUS-1time-1zedd"], "isController": false}, {"data": [0.1974291364535267, 500, 1500, "NCPPServerlessWestGFSAreaHalfGlobe-1time-1zedd"], "isController": false}, {"data": [0.9937520966118752, 500, 1500, "NCPPServerlessWestCollections"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSAreaTexas-1time-fullzedd"], "isController": false}, {"data": [0.005671077504725898, 500, 1500, "NCPPServerlessWestGFSAreaUS-halftime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSAreaUS-1time-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSAreaTexas-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSTrajectory10waypoints"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSAreaTexas-halftime-halfzedd"], "isController": false}, {"data": [0.8737564322469983, 500, 1500, "NCPPServerlessWestGFSInstances"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSPosition-fulltime-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSAreaUS-fulltime-1zedd"], "isController": false}, {"data": [0.02420916720464816, 500, 1500, "NCPPServerlessWestGFSPosition-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestNWM-position-1day"], "isController": false}, {"data": [0.01255783212161269, 500, 1500, "NCPPServerlessWestGFSPosition-halftime-halfzedd"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 128054, 1068, 0.8340231464850766, 1533.1383947397198, 157, 79093, 2753.0, 9996.100000000013, 17845.500000000007, 29088.470000000085, 53.47025968906794, 10169.456037613201, 27.5096404874139], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NCPPServerlessWestGFSPosition-1time-fullzedd", 1908, 0, 0.0, 2975.5293501048272, 2420, 4825, 2955.5, 3292.0, 3466.0, 4113.0, 29.77713964666958, 164.50124900508771, 12.56223078843873], "isController": false}, {"data": ["NCPPServerlessWestGFSTrajectory20waypoints", 2116, 0, 0.0, 2668.802457466913, 2269, 4360, 2631.0, 2930.0, 3195.0, 3450.0, 33.764161480772295, 259.66090982527527, 58.79052726583692], "isController": false}, {"data": ["NCPPServerlessWestGFSCorridor5waypoints", 380, 0, 0.0, 16265.121052631563, 8811, 26597, 16062.0, 20846.3, 21657.0, 25433.0, 5.385182245904428, 77.10697469672922, 4.033627717391305], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaGlobe-1time-1zedd", 1438, 6, 0.4172461752433936, 4122.792767732959, 1269, 55768, 3701.0, 5514.0, 6681.0, 24049.059999999434, 15.072743281204144, 30005.597577145614, 7.812745665800176], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-halftime-fullzedd", 1826, 0, 0.0, 3091.5016429353755, 2467, 7494, 3055.0, 3474.0, 3593.0, 4152.0, 28.838105465973875, 2858.3237444033384, 12.16607574345773], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-1time-1zedd", 7724, 0, 0.0, 718.1941998964285, 419, 4884, 668.0, 833.0, 900.75, 3023.0, 127.24666809443008, 388.8230707690153, 50.57557999456352], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-fulltime-1zedd", 7734, 0, 0.0, 716.7794155676228, 437, 3720, 665.0, 828.0, 910.5, 2864.0, 127.30654639429802, 1676.492947389755, 54.329063256160396], "isController": false}, {"data": ["NCPPServerlessWestGFSCorridor10waypoints", 256, 110, 42.96875, 25165.9765625, 10372, 29344, 27736.0, 29288.0, 29322.15, 29338.3, 3.390369232399216, 42.72224259350003, 3.744636329925306], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-halftime-1zedd", 8016, 0, 0.0, 691.6828842315398, 436, 5260, 668.0, 826.0, 890.2999999999993, 1280.5399999999972, 130.51548406004753, 1113.4602233872806, 55.69850247484451], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-halftime-1zedd", 5770, 0, 0.0, 963.7331022530332, 569, 3398, 1004.0, 1202.0, 1282.0, 1817.0, 93.64298813639094, 21772.909224016912, 71.8783092531282], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-fulltime-1zedd", 5298, 0, 0.0, 1050.4073235183112, 643, 3110, 1084.0, 1334.0, 1456.1500000000005, 1766.0200000000004, 86.57287121917742, 36622.18448974214, 66.45144216628266], "isController": false}, {"data": ["NCPPServerlessWestGFSCorridor20waypoints", 800, 800, 100.0, 7272.399999999995, 1934, 14485, 7356.0, 10812.0, 11575.349999999999, 14234.400000000009, 12.30655631787835, 6.165296280343353, 22.185452112112728], "isController": false}, {"data": ["NCPPServerlessWestGFSCollectionMeta", 7964, 0, 0.0, 695.3046207935715, 430, 7156, 586.0, 801.0, 963.0, 6103.0, 130.9480745831826, 995.2820942196389, 31.33034987585912], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-1time-halfzedd", 1670, 0, 0.0, 3412.2574850299425, 2536, 7765, 3289.0, 3906.0, 4500.0, 6380.089999999992, 26.23352550307105, 23263.731580324464, 29.58957222270221], "isController": false}, {"data": ["NCPPServerlessWestNWM-position-1month", 338, 6, 1.7751479289940828, 18817.467455621292, 6740, 29522, 19190.0, 26536.0, 27982.200000000008, 29321.0, 4.576163333829761, 253.58792613828678, 1.5864628745210598], "isController": false}, {"data": ["NCPPServerlessWestGFSTrajectory5waypoints", 2342, 0, 0.0, 2397.6327924850593, 1774, 8814, 2145.0, 2588.2000000000016, 2928.0, 7603.0, 37.69940279767558, 153.74287703427072, 25.77107613122354], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-1time-1zedd", 6978, 0, 0.0, 794.8756090570382, 517, 5117, 743.0, 920.0, 1006.0499999999993, 3264.0, 114.95313246462284, 796.0279905338286, 88.23550988007182], "isController": false}, {"data": ["NCPPServerlessWestNWM-position-1hour", 324, 38, 11.728395061728396, 19389.827160493824, 9411, 29311, 18551.0, 29095.5, 29236.5, 29307.0, 4.435378992183328, 10.251947750824788, 1.5376558029541814], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-fulltime-halfzedd", 3008, 0, 0.0, 1863.445478723399, 1444, 4236, 1820.5, 2105.1, 2251.649999999999, 2953.5999999999913, 48.58587326969359, 4636.297467332138, 20.686953853111724], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-1time-1zedd", 6852, 0, 0.0, 809.9197314652612, 529, 3261, 807.5, 1009.0, 1088.3499999999995, 1538.9400000000005, 112.58811350827322, 5277.018074052317, 127.10142501519907], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaHalfGlobe-1time-1zedd", 3034, 0, 0.0, 1865.3599208965052, 940, 54843, 1587.0, 2635.0, 2994.0, 4280.25, 37.15632845508542, 32730.806537413508, 19.08616090563958], "isController": false}, {"data": ["NCPPServerlessWestCollections", 23848, 0, 0.0, 231.4069104327415, 157, 2628, 199.0, 300.0, 391.0, 467.0, 395.7845821923492, 13351.15900651398, 64.54689963488507], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-1time-fullzedd", 1110, 0, 0.0, 5154.230630630629, 4035, 10704, 5160.0, 5660.0, 5944.0, 6680.0, 17.015927521346555, 2516.3299849194423, 12.977968158370762], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-halftime-1zedd", 1058, 12, 1.1342155009451795, 5561.086956521739, 1397, 79093, 4846.0, 7784.0, 9627.099999999988, 35461.670000000006, 10.257205735503698, 27624.783890800263, 11.44808804424753], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-1time-fullzedd", 1004, 0, 0.0, 5809.591633466132, 4636, 15045, 5713.0, 6514.0, 6974.25, 8093.600000000003, 14.917389753952216, 25811.673119818286, 16.76749570976465], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-1time-halfzedd", 1954, 0, 0.0, 2891.4800409416566, 2318, 6898, 2845.0, 3265.0, 3481.0, 4045.0, 31.158311009057275, 2407.5576581734754, 23.886009904404258], "isController": false}, {"data": ["NCPPServerlessWestGFSTrajectory10waypoints", 1958, 0, 0.0, 2895.2921348314594, 2446, 4044, 2864.0, 3155.0, 3331.0, 3668.0, 31.119375705271857, 164.25803289745548, 32.000686150050065], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-halftime-halfzedd", 682, 24, 3.5190615835777126, 9154.706744868037, 4208, 76335, 7795.0, 12987.400000000001, 13938.4, 38810.51999999997, 5.88321558275752, 27065.835322800478, 4.35136968612786], "isController": false}, {"data": ["NCPPServerlessWestGFSInstances", 11660, 0, 0.0, 474.3859348198945, 306, 5199, 399.0, 561.0, 611.0, 1100.5599999999977, 192.7910052910053, 258.1215510292659, 45.37366433118387], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-fulltime-fullzedd", 1812, 2, 0.11037527593818984, 3138.7660044150184, 2473, 29253, 3075.5, 3460.0, 3581.35, 4107.1799999999985, 22.554706365605316, 4012.9373562713163, 9.515266747989743], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-fulltime-1zedd", 718, 70, 9.749303621169917, 8289.34540389972, 2123, 62490, 6939.0, 12969.0, 18326.0, 35615.0, 6.146365683076949, 27642.426696242845, 6.262198566989394], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-1time-halfzedd", 3098, 0, 0.0, 1806.2595222724362, 1408, 6955, 1751.0, 2026.0, 2255.2499999999986, 3300.089999999998, 50.133505947083094, 216.0538688910915, 21.345906829031474], "isController": false}, {"data": ["NCPPServerlessWestNWM-position-1day", 350, 0, 0.0, 18510.028571428564, 4861, 28853, 19332.0, 25085.0, 27301.0, 28543.0, 4.665111629456847, 20.537425024991666, 1.6172994418527156], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-halftime-halfzedd", 3026, 0, 0.0, 1852.5234633179075, 1448, 3692, 1801.0, 2147.0, 2329.0, 2831.19, 48.88056085032146, 2626.0413027917325, 20.812426299550932], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Timeout", 156, 14.606741573033707, 0.12182360566635951], "isController": false}, {"data": ["502/Bad Gateway", 800, 74.90636704119851, 0.6247364393146642], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 112, 10.486891385767791, 0.08746310150405298], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 128054, 1068, "502/Bad Gateway", 800, "504/Gateway Timeout", 156, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 112, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaGlobe-1time-1zedd", 1438, 6, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessWestGFSCorridor10waypoints", 256, 110, "504/Gateway Timeout", 110, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessWestGFSCorridor20waypoints", 800, 800, "502/Bad Gateway", 800, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessWestNWM-position-1month", 338, 6, "504/Gateway Timeout", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessWestNWM-position-1hour", 324, 38, "504/Gateway Timeout", 38, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-halftime-1zedd", 1058, 12, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-halftime-halfzedd", 682, 24, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 24, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-fulltime-fullzedd", 1812, 2, "504/Gateway Timeout", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-fulltime-1zedd", 718, 70, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 70, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
