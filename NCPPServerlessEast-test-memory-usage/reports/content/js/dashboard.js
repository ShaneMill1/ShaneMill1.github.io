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

    var data = {"OkPercent": 57.407407407407405, "KoPercent": 42.592592592592595};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "NCPPServerlessEastGFSPosition-fulltime-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaHalfGlobe-halftime-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastNWM-position-1year"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastCollections"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaUS-fulltime-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaHalfGlobe-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaHalfGlobe-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaGlobe-halftime-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaGlobe-1time-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaGlobe-fulltime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaUS-1time-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastRoot"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaUS-fulltime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaHalfGlobe-halftime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaTexas-fulltime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSPosition-halftime-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSPosition-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaTexas-halftime-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaHalfGlobe-fulltime-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaUS-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaTexas-halftime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaHalfGlobe-fulltime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSCollectionMeta"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSPosition-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaGlobe-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSPosition-halftime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaTexas-halftime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaUS-halftime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaUS-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSPosition-fulltime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaUS-fulltime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastNWM-position-5year"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaGlobe-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaGlobe-halftime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSPosition-fulltime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastNWM-position-1day"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaHalfGlobe-halftime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSPosition-1time-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaUS-halftime-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaTexas-fulltime-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSPosition-halftime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaGlobe-halftime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaUS-halftime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastNWM-position-1hour"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaGlobe-fulltime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSInstances"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaTexas-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastNWM-position-1month"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaTexas-fulltime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaTexas-1time-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaHalfGlobe-1time-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaGlobe-fulltime-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaTexas-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaHalfGlobe-fulltime-1zedd"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 108, 46, 42.592592592592595, 14401.499999999995, 1540, 29787, 10650.5, 29773.1, 29777.0, 29787.0, 3.625621055458574, 1614.0326536692628, 2.1904793876728883], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NCPPServerlessEastGFSPosition-fulltime-fullzedd", 2, 0, 0.0, 7415.0, 7415, 7415, 7415.0, 7415.0, 7415.0, 7415.0, 0.26972353337828725, 51.99131827376939, 0.11378961564396493], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-halftime-fullzedd", 2, 2, 100.0, 29758.0, 29758, 29758, 29758.0, 29758.0, 29758.0, 29758.0, 0.06720881779689496, 0.034260745009745276, 0.0341951113986155], "isController": false}, {"data": ["NCPPServerlessEastNWM-position-1year", 2, 0, 0.0, 15171.0, 15171, 15171, 15171.0, 15171.0, 15171.0, 15171.0, 0.1318304660206974, 89.61562149825325, 0.04570294476303474], "isController": false}, {"data": ["NCPPServerlessEastCollections", 2, 0, 0.0, 26412.0, 26412, 26412, 26412.0, 26412.0, 26412.0, 26412.0, 0.07572315614114797, 2.5543993970543695, 0.012349381909737998], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-fulltime-fullzedd", 2, 2, 100.0, 29741.0, 29741, 29741, 29741.0, 29741.0, 29741.0, 29741.0, 0.06724723445748293, 0.03428032850274033, 0.07558746763726842], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-1time-halfzedd", 2, 2, 100.0, 11866.0, 11866, 11866, 11866.0, 11866.0, 11866.0, 11866.0, 0.16854879487611665, 0.08443899587055453, 0.08641417706050902], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-1time-1zedd", 2, 0, 0.0, 6746.0, 6746, 6746, 6746.0, 6746.0, 6746.0, 6746.0, 0.2964719833975689, 261.1605488437593, 0.1522893195967981], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-halftime-fullzedd", 2, 2, 100.0, 29773.0, 29773, 29773, 29773.0, 29773.0, 29773.0, 29773.0, 0.06717495717596479, 0.034243484029153934, 0.03463708729385685], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-1time-fullzedd", 2, 2, 100.0, 23483.0, 23483, 23483, 23483.0, 23483.0, 23483.0, 23483.0, 0.08516799386790444, 0.04266716880296385, 0.04391474683813823], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-fulltime-1zedd", 2, 2, 100.0, 29773.0, 29773, 29773, 29773.0, 29773.0, 29773.0, 29773.0, 0.06717495717596479, 0.034243484029153934, 0.03496509001444262], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-1time-fullzedd", 2, 0, 0.0, 9012.0, 9012, 9012, 9012.0, 9012.0, 9012.0, 9012.0, 0.22192632046160674, 384.00080274911227, 0.2494503855969818], "isController": false}, {"data": ["NCPPServerlessEastRoot", 2, 0, 0.0, 1540.0, 1540, 1540, 1540.0, 1540.0, 1540.0, 1540.0, 1.2987012987012987, 2.0774147727272725, 0.196580762987013], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-fulltime-1zedd", 2, 0, 0.0, 7732.0, 7732, 7732, 7732.0, 7732.0, 7732.0, 7732.0, 0.2586652871184687, 1397.2431938696327, 0.2920088592860838], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-halftime-1zedd", 2, 2, 100.0, 12111.0, 12111, 12111, 12111.0, 12111.0, 12111.0, 12111.0, 0.1651391297167864, 0.08273083353975724, 0.08482732639748988], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-fulltime-halfzedd", 2, 2, 100.0, 8130.0, 8130, 8130, 8130.0, 8130.0, 8130.0, 8130.0, 0.24600246002460022, 0.12324146678966788, 0.18858587023370232], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-halftime-fullzedd", 2, 0, 0.0, 7455.0, 7455, 7455, 7455.0, 7455.0, 7455.0, 7455.0, 0.2682763246143528, 26.590532780013415, 0.11317907444668009], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-1time-halfzedd", 2, 0, 0.0, 6838.0, 6838, 6838, 6838.0, 6838.0, 6838.0, 6838.0, 0.2924831822170225, 1.260476838988008, 0.12453385492834163], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-halftime-fullzedd", 2, 2, 100.0, 10754.0, 10754, 10754, 10754.0, 10754.0, 10754.0, 10754.0, 0.1859773107680863, 0.09317027385159012, 0.1418440231541752], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-fulltime-fullzedd", 2, 2, 100.0, 29787.0, 29787, 29787, 29787.0, 29787.0, 29787.0, 29787.0, 0.06714338469802263, 0.03422738946520294, 0.03422738946520294], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-1time-halfzedd", 2, 0, 0.0, 7861.0, 7861, 7861, 7861.0, 7861.0, 7861.0, 7861.0, 0.25442055718102025, 225.61860967116144, 0.28696849955476406], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-halftime-1zedd", 2, 0, 0.0, 6668.0, 6668, 6668, 6668.0, 6668.0, 6668.0, 6668.0, 0.29994001199760045, 69.73898189112177, 0.23022739202159567], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-fulltime-halfzedd", 2, 2, 100.0, 29774.0, 29774, 29774, 29774.0, 29774.0, 29774.0, 29774.0, 0.06717270101430779, 0.03424233391549674, 0.03450472727883388], "isController": false}, {"data": ["NCPPServerlessEastGFSCollectionMeta", 2, 0, 0.0, 7339.0, 7339, 7339, 7339.0, 7339.0, 7339.0, 7339.0, 0.2725166916473634, 2.0712865342689737, 0.06520174751328518], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-1time-1zedd", 2, 0, 0.0, 6433.0, 6433, 6433, 6433.0, 6433.0, 6433.0, 6433.0, 0.310896937665164, 0.9499965995647444, 0.12356938831027514], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-1time-halfzedd", 2, 2, 100.0, 12977.0, 12977, 12977, 12977.0, 12977.0, 12977.0, 12977.0, 0.15411882561454882, 0.07720991947291361, 0.08006954612005857], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-halftime-halfzedd", 2, 0, 0.0, 6674.0, 6674, 6674, 6674.0, 6674.0, 6674.0, 6674.0, 0.2996703626011388, 16.09938052517231, 0.1275940215762661], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-halftime-halfzedd", 2, 0, 0.0, 8736.0, 8736, 8736, 8736.0, 8736.0, 8736.0, 8736.0, 0.22893772893772893, 1091.6233831272893, 0.17550402071886445], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-halftime-halfzedd", 2, 2, 100.0, 13203.0, 13203, 13203, 13203.0, 13203.0, 13203.0, 13203.0, 0.1514807240778611, 0.07588829243353784, 0.1708596057714156], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-1time-1zedd", 2, 0, 0.0, 6563.0, 6563, 6563, 6563.0, 6563.0, 6563.0, 6563.0, 0.30473868657626085, 14.28313795139418, 0.344021407892732], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-fulltime-1zedd", 2, 0, 0.0, 6486.0, 6486, 6486, 6486.0, 6486.0, 6486.0, 6486.0, 0.3083564600678384, 4.326024321615788, 0.13159352836879434], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-fulltime-halfzedd", 2, 2, 100.0, 19519.0, 19519, 19519, 19519.0, 19519.0, 19519.0, 19519.0, 0.10246426558737641, 0.05133219555305088, 0.11557248706388648], "isController": false}, {"data": ["NCPPServerlessEastNWM-position-5year", 2, 0, 0.0, 26602.0, 26602, 26602, 26602.0, 26602.0, 26602.0, 26602.0, 0.07518231711901362, 255.45453584316968, 0.02606418220434554], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-1time-1zedd", 2, 0, 0.0, 7037.0, 7037, 7037, 7037.0, 7037.0, 7037.0, 7037.0, 0.28421202216853775, 568.153432304249, 0.14793457794514708], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-halftime-halfzedd", 2, 2, 100.0, 29774.0, 29774, 29774, 29774.0, 29774.0, 29774.0, 29774.0, 0.06717270101430779, 0.03424233391549674, 0.03489831732383959], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-fulltime-halfzedd", 2, 0, 0.0, 6806.0, 6806, 6806, 6806.0, 6806.0, 6806.0, 6806.0, 0.2938583602703497, 30.316483158242725, 0.12511937995885983], "isController": false}, {"data": ["NCPPServerlessEastNWM-position-1day", 2, 0, 0.0, 12838.0, 12838, 12838, 12838.0, 12838.0, 12838.0, 12838.0, 0.15578750584203147, 0.6700079841096744, 0.0540083638417199], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-halftime-halfzedd", 2, 2, 100.0, 29783.0, 29783, 29783, 29783.0, 29783.0, 29783.0, 29783.0, 0.06715240237719505, 0.034231986368062316, 0.03442872192190175], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-1time-fullzedd", 2, 0, 0.0, 7201.0, 7201, 7201, 7201.0, 7201.0, 7201.0, 7201.0, 0.2777392028884877, 1.534346358144702, 0.11717122621858075], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-halftime-fullzedd", 2, 2, 100.0, 20207.0, 20207, 20207, 20207.0, 20207.0, 20207.0, 20207.0, 0.0989756025139803, 0.04958445711882021, 0.11125089696639778], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-fulltime-fullzedd", 2, 2, 100.0, 10547.0, 10547, 10547, 10547.0, 10547.0, 10547.0, 10547.0, 0.18962738219398884, 0.09499887408741822, 0.14462791552100124], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-halftime-1zedd", 2, 0, 0.0, 6434.0, 6434, 6434, 6434.0, 6434.0, 6434.0, 6434.0, 0.31084861672365555, 2.6519272614236864, 0.13265707569163818], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-halftime-1zedd", 2, 2, 100.0, 19737.0, 19737, 19737, 19737.0, 19737.0, 19737.0, 19737.0, 0.10133252267315195, 0.05076521887824898, 0.052744369711708976], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-halftime-1zedd", 2, 0, 0.0, 7440.0, 7440, 7440, 7440.0, 7440.0, 7440.0, 7440.0, 0.26881720430107525, 732.2772282426075, 0.30346942204301075], "isController": false}, {"data": ["NCPPServerlessEastNWM-position-1hour", 2, 0, 0.0, 12757.0, 12757, 12757, 12757.0, 12757.0, 12757.0, 12757.0, 0.15677667163126127, 0.3839803637218782, 0.054351287528415775], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-fulltime-halfzedd", 2, 2, 100.0, 29758.0, 29758, 29758, 29758.0, 29758.0, 29758.0, 29758.0, 0.06720881779689496, 0.034260745009745276, 0.03491708112104308], "isController": false}, {"data": ["NCPPServerlessEastGFSInstances", 2, 0, 0.0, 6431.0, 6431, 6431, 6431.0, 6431.0, 6431.0, 6431.0, 0.3109936246306951, 0.2702971932825377, 0.07319283548437257], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-1time-halfzedd", 2, 0, 0.0, 7755.0, 7755, 7755, 7755.0, 7755.0, 7755.0, 7755.0, 0.2578981302385558, 19.927415780141843, 0.19770510960670534], "isController": false}, {"data": ["NCPPServerlessEastNWM-position-1month", 2, 0, 0.0, 13029.0, 13029, 13029, 13029.0, 13029.0, 13029.0, 13029.0, 0.15350372246526978, 8.381243284212141, 0.05321662253434646], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-fulltime-1zedd", 2, 0, 0.0, 6616.0, 6616, 6616, 6616.0, 6616.0, 6616.0, 6616.0, 0.30229746070133007, 138.54965708131803, 0.23203691807738816], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-1time-fullzedd", 2, 0, 0.0, 8777.0, 8777, 8777, 8777.0, 8777.0, 8777.0, 8777.0, 0.2278682921271505, 33.69735886407657, 0.17379407827275836], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-1time-fullzedd", 2, 2, 100.0, 18476.0, 18476, 18476, 18476.0, 18476.0, 18476.0, 18476.0, 0.10824853864472829, 0.054229980785884396, 0.05507567249404633], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-fulltime-fullzedd", 2, 2, 100.0, 29777.0, 29777, 29777, 29777.0, 29777.0, 29777.0, 29777.0, 0.06716593343855996, 0.034238884038015914, 0.03463243442925748], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-1time-1zedd", 2, 0, 0.0, 6444.0, 6444, 6444, 6444.0, 6444.0, 6444.0, 6444.0, 0.31036623215394166, 2.1492255392613284, 0.23823033054003726], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-fulltime-1zedd", 2, 2, 100.0, 17725.0, 17725, 17725, 17725.0, 17725.0, 17725.0, 17725.0, 0.11283497884344147, 0.05652767983074753, 0.058070345557122705], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 26, 56.52173913043478, 24.074074074074073], "isController": false}, {"data": ["504/Gateway Timeout", 20, 43.47826086956522, 18.51851851851852], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 108, 46, "502/Bad Gateway", 26, "504/Gateway Timeout", 20, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-halftime-fullzedd", 2, 2, "504/Gateway Timeout", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-fulltime-fullzedd", 2, 2, "504/Gateway Timeout", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-1time-halfzedd", 2, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-halftime-fullzedd", 2, 2, "504/Gateway Timeout", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-1time-fullzedd", 2, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-fulltime-1zedd", 2, 2, "504/Gateway Timeout", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-halftime-1zedd", 2, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-fulltime-halfzedd", 2, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-halftime-fullzedd", 2, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-fulltime-fullzedd", 2, 2, "504/Gateway Timeout", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-fulltime-halfzedd", 2, 2, "504/Gateway Timeout", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-1time-halfzedd", 2, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-halftime-halfzedd", 2, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-fulltime-halfzedd", 2, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-halftime-halfzedd", 2, 2, "504/Gateway Timeout", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-halftime-halfzedd", 2, 2, "504/Gateway Timeout", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-halftime-fullzedd", 2, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-fulltime-fullzedd", 2, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-halftime-1zedd", 2, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-fulltime-halfzedd", 2, 2, "504/Gateway Timeout", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-1time-fullzedd", 2, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-fulltime-fullzedd", 2, 2, "504/Gateway Timeout", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-fulltime-1zedd", 2, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
