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

    var data = {"OkPercent": 98.7285989261473, "KoPercent": 1.2714010738526997};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6657126937493668, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "NCPPServerlessEastGFSPosition-fulltime-fullzedd"], "isController": false}, {"data": [0.6570996978851964, 500, 1500, "NCPPServerlessEastGFSAreaUS-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSTrajectory20waypoints"], "isController": false}, {"data": [0.9664259927797834, 500, 1500, "NCPPServerlessEastGFSPosition-fulltime-1zedd"], "isController": false}, {"data": [0.08073654390934844, 500, 1500, "NCPPServerlessEastGFSAreaGlobe-1time-1zedd"], "isController": false}, {"data": [0.9973390101117616, 500, 1500, "NCPPServerlessEastCollections"], "isController": false}, {"data": [0.013636363636363636, 500, 1500, "NCPPServerlessEastGFSPosition-fulltime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastNWM-position-1day"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSPosition-1time-fullzedd"], "isController": false}, {"data": [0.49829642248722317, 500, 1500, "NCPPServerlessEastGFSAreaHalfGlobe-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSTrajectory10waypoints"], "isController": false}, {"data": [0.9380699088145896, 500, 1500, "NCPPServerlessEastGFSPosition-halftime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSCorridor20waypoints"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSCorridor5waypoints"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaUS-1time-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaUS-fulltime-1zedd"], "isController": false}, {"data": [0.22802197802197802, 500, 1500, "NCPPServerlessEastGFSAreaUS-halftime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastNWM-position-1hour"], "isController": false}, {"data": [0.9803020354563362, 500, 1500, "NCPPServerlessEastGFSInstances"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSPosition-halftime-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaTexas-1time-halfzedd"], "isController": false}, {"data": [0.040419161676646706, 500, 1500, "NCPPServerlessEastGFSPosition-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastNWM-position-1month"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaUS-1time-halfzedd"], "isController": false}, {"data": [0.49945887445887444, 500, 1500, "NCPPServerlessEastGFSAreaTexas-halftime-1zedd"], "isController": false}, {"data": [0.9696969696969697, 500, 1500, "NCPPServerlessEastGFSCollectionMeta"], "isController": false}, {"data": [0.49702734839476814, 500, 1500, "NCPPServerlessEastGFSAreaTexas-fulltime-1zedd"], "isController": false}, {"data": [0.9374034003091191, 500, 1500, "NCPPServerlessEastGFSPosition-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSCorridor10waypoints"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaTexas-1time-fullzedd"], "isController": false}, {"data": [0.012195121951219513, 500, 1500, "NCPPServerlessEastGFSPosition-halftime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaTexas-halftime-halfzedd"], "isController": false}, {"data": [0.7760675273088381, 500, 1500, "NCPPServerlessEastGFSAreaTexas-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSTrajectory5waypoints"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 39484, 502, 1.2714010738526997, 978.6280012156823, 99, 24180, 716.0, 3237.9000000000015, 4933.750000000004, 7100.950000000008, 18.422377468374155, 4816.547004460897, 9.565187702407497], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NCPPServerlessEastGFSPosition-fulltime-fullzedd", 398, 0, 0.0, 2886.0351758793972, 2625, 7706, 2823.0, 3086.0, 3171.0, 3443.0, 6.307748387403522, 1215.8677809563053, 2.6610813509358606], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-1time-1zedd", 1986, 0, 0.0, 561.7331319234629, 427, 7085, 519.0, 645.0, 684.0, 790.0, 32.751199722950574, 1535.052569045911, 36.973034062237176], "isController": false}, {"data": ["NCPPServerlessEastGFSTrajectory20waypoints", 434, 0, 0.0, 2607.1428571428573, 2298, 7565, 2501.0, 2824.0, 3079.0, 4534.649999999964, 6.970991679784124, 53.60992136552732, 12.137966958061615], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-fulltime-1zedd", 2770, 0, 0.0, 402.7696750902528, 325, 923, 390.0, 458.0, 519.0, 580.0, 45.78209705143461, 642.2906310946383, 19.537867589332937], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-1time-1zedd", 706, 0, 0.0, 1594.7337110481571, 1112, 2395, 1586.0, 1767.5000000000005, 1844.0, 2059.0, 11.403282077787827, 22795.70653836292, 5.935497409629797], "isController": false}, {"data": ["NCPPServerlessEastCollections", 7516, 0, 0.0, 147.69531665779675, 99, 5771, 137.0, 167.0, 189.0, 273.0, 125.16861791596581, 4222.362860030476, 20.413241398404583], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-fulltime-halfzedd", 660, 0, 0.0, 1715.5575757575746, 1428, 6149, 1692.5, 1876.6, 1929.0, 2156.229999999999, 10.315562432597178, 1064.2255488934215, 4.392173067004267], "isController": false}, {"data": ["NCPPServerlessEastNWM-position-1day", 176, 0, 0.0, 6617.795454545455, 6118, 10285, 6526.5, 7107.0, 7699.1, 10285.0, 2.6595342792813215, 11.438075162065369, 0.9220065128367861], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-1time-fullzedd", 392, 0, 0.0, 2902.0255102040824, 2550, 6659, 2818.5, 3162.0, 3344.0, 4629.0, 6.232213548705067, 34.4293281689693, 2.62921509085995], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-1time-1zedd", 1174, 0, 0.0, 954.19080068143, 801, 1775, 935.0, 1071.0, 1120.25, 1245.0, 19.270858981303654, 16975.594289120338, 9.898898265786839], "isController": false}, {"data": ["NCPPServerlessEastGFSTrajectory10waypoints", 402, 0, 0.0, 2837.9950248756213, 2465, 4025, 2792.0, 3081.1, 3301.3999999999996, 3891.979999999996, 6.41230141006827, 33.84618078263574, 6.593899789845595], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-halftime-1zedd", 2632, 0, 0.0, 438.96580547112467, 343, 24180, 402.0, 523.0, 552.0, 594.0, 32.476987241183586, 277.06929740134746, 13.859808031637916], "isController": false}, {"data": ["NCPPServerlessEastGFSCorridor20waypoints", 502, 502, 100.0, 2254.54980079681, 1785, 9150, 2155.0, 2456.2999999999997, 3077.0, 3623.0, 8.06425702811245, 4.040003765060241, 14.537713353413654], "isController": false}, {"data": ["NCPPServerlessEastGFSCorridor5waypoints", 310, 0, 0.0, 3666.2580645161283, 2888, 9768, 3256.0, 3907.0, 8250.0, 9063.0, 4.974326059050065, 71.22418816190628, 3.725886803995507], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-1time-fullzedd", 220, 0, 0.0, 5270.545454545455, 4742, 7456, 5182.0, 5788.400000000001, 5832.0, 7135.749999999988, 3.366900309142665, 5825.773251220501, 3.784474859202351], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-fulltime-1zedd", 370, 0, 0.0, 3067.648648648649, 1927, 10596, 2900.0, 3836.0, 4458.0, 6455.0, 5.995689585325144, 32387.169376205216, 6.768571445933464], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-halftime-1zedd", 728, 0, 0.0, 1533.4862637362644, 1211, 2573, 1517.5, 1729.7000000000003, 1844.1999999999998, 2238.0, 11.88532619343042, 32376.475844666296, 13.417419023052307], "isController": false}, {"data": ["NCPPServerlessEastNWM-position-1hour", 170, 0, 0.0, 7133.823529411761, 6017, 14429, 6542.0, 10318.0, 11415.549999999996, 14429.0, 2.520011858879336, 6.172060294989624, 0.8736369237325824], "isController": false}, {"data": ["NCPPServerlessEastGFSInstances", 3046, 0, 0.0, 365.40118187787255, 252, 4732, 321.0, 363.0, 390.3000000000002, 893.0600000000004, 50.478936727320935, 67.58459204409864, 11.88029663211362], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-halftime-fullzedd", 386, 0, 0.0, 2963.5233160621765, 2546, 10322, 2860.0, 3173.4, 3280.0, 9008.0, 6.1585589610223845, 610.4130290517255, 2.5981420616813184], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-1time-halfzedd", 412, 0, 0.0, 2765.9611650485413, 2336, 7791, 2668.5, 3055.0, 3337.499999999997, 6425.10000000001, 6.603093196570239, 510.2114677658466, 5.061941561823864], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-1time-halfzedd", 668, 0, 0.0, 1684.6736526946113, 1414, 6381, 1625.0, 1875.2, 2034.0, 2487.189999999981, 10.830090791180284, 46.673037755350194, 4.6112495946822305], "isController": false}, {"data": ["NCPPServerlessEastNWM-position-1month", 162, 0, 0.0, 7468.9629629629635, 6794, 14676, 7195.0, 8047.300000000001, 8453.199999999999, 14676.0, 2.41247338088785, 131.7201042240622, 0.8363555177882683], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-1time-halfzedd", 384, 0, 0.0, 2980.380208333336, 2526, 6903, 2911.5, 3284.0, 3377.0, 6755.0, 5.969313995243202, 5293.551508650842, 6.732966469244043], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-halftime-1zedd", 1848, 0, 0.0, 604.2002164502169, 480, 1720, 580.0, 704.0, 737.55, 836.02, 30.497062512377056, 7090.864857003763, 23.40887806125817], "isController": false}, {"data": ["NCPPServerlessEastGFSCollectionMeta", 2838, 0, 0.0, 392.6835799859052, 273, 6712, 329.0, 375.0, 583.0, 668.2000000000025, 46.843278039118594, 356.0363603305274, 11.207620233968804], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-fulltime-1zedd", 1682, 0, 0.0, 663.3460166468486, 562, 1799, 640.0, 753.0, 798.8499999999999, 929.5700000000015, 27.789251078031292, 12736.432514105276, 21.330421237629487], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-1time-1zedd", 2588, 0, 0.0, 430.50618238021656, 328, 6134, 393.0, 516.0, 546.0, 738.0, 42.806576466307185, 130.80251734675312, 17.013942013463893], "isController": false}, {"data": ["NCPPServerlessEastGFSCorridor10waypoints", 290, 0, 0.0, 3942.710344827586, 3358, 5219, 3855.0, 4474.0, 4620.9, 4870.46999999999, 4.575720281485689, 99.3431770488182, 5.053847303086244], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-1time-fullzedd", 226, 0, 0.0, 5159.097345132744, 4425, 5918, 5231.0, 5410.3, 5455.0, 5822.419999999996, 3.4719021722432175, 513.4278768972563, 2.64800351222847], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-halftime-halfzedd", 656, 0, 0.0, 1712.1189024390244, 1465, 2943, 1710.5, 1879.0, 1953.15, 2224.5899999999942, 10.700944488850464, 574.8936124659479, 4.556261520643361], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-halftime-halfzedd", 252, 0, 0.0, 4499.468253968253, 3898, 6568, 4410.0, 5037.0, 5390.7, 6560.05, 3.944958437045038, 18810.39396750106, 3.024211301836284], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-1time-1zedd", 2014, 0, 0.0, 553.6345580933461, 414, 6003, 494.0, 621.0, 658.0, 3372.749999999986, 33.28760557327736, 230.51016710948218, 25.550837871675785], "isController": false}, {"data": ["NCPPServerlessEastGFSTrajectory5waypoints", 486, 0, 0.0, 2327.4526748971184, 1788, 7643, 2087.0, 2319.3, 2876.3499999999995, 7346.469999999998, 7.870190439176059, 32.095620384764864, 5.3800129955305085], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 502, 100.0, 1.2714010738526997], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 39484, 502, "502/Bad Gateway", 502, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSCorridor20waypoints", 502, 502, "502/Bad Gateway", 502, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
