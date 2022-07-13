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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.03571428571428571, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "NCPPServerlessEastGFSPosition-fulltime-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaUS-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSPosition-fulltime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaGlobe-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastCollections"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSPosition-fulltime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastNWM-position-1day"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSPosition-1time-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaHalfGlobe-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSPosition-halftime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaUS-1time-fullzedd"], "isController": false}, {"data": [0.5, 500, 1500, "NCPPServerlessEastRoot"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaUS-fulltime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaUS-halftime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastNWM-position-1hour"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSInstances"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSPosition-halftime-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaTexas-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSPosition-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastNWM-position-1month"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaUS-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaTexas-halftime-1zedd"], "isController": false}, {"data": [0.5, 500, 1500, "NCPPServerlessEastGFSCollectionMeta"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaTexas-fulltime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSPosition-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaTexas-1time-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSPosition-halftime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaTexas-1time-1zedd"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 56, 0, 0.0, 4880.071428571428, 727, 22271, 3650.0, 10098.0, 12260.549999999983, 22271.0, 2.5144807148309463, 1363.3874524325356, 1.448334577477437], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NCPPServerlessEastGFSPosition-fulltime-fullzedd", 2, 0, 0.0, 4715.0, 4715, 4715, 4715.0, 4715.0, 4715.0, 4715.0, 0.42417815482502647, 81.76365323435843, 0.17895015906680806], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-1time-1zedd", 2, 0, 0.0, 2631.0, 2631, 2631, 2631.0, 2631.0, 2631.0, 2631.0, 0.7601672367920943, 35.62912747054352, 0.8581575446598252], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-fulltime-1zedd", 2, 0, 0.0, 2070.0, 2070, 2070, 2070.0, 2070.0, 2070.0, 2070.0, 0.966183574879227, 13.55487620772947, 0.4123263888888889], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-1time-1zedd", 2, 0, 0.0, 3461.0, 3461, 3461, 3461.0, 3461.0, 3461.0, 3461.0, 0.5778676683039584, 1155.1851208104595, 0.30078463594336896], "isController": false}, {"data": ["NCPPServerlessEastCollections", 2, 0, 0.0, 22271.0, 22271, 22271, 22271.0, 22271.0, 22271.0, 22271.0, 0.08980288267253378, 3.029356422028647, 0.014645587310852679], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-fulltime-halfzedd", 2, 0, 0.0, 3222.0, 3222, 3222, 3222.0, 3222.0, 3222.0, 3222.0, 0.6207324643078833, 64.03910129577902, 0.26429624456859097], "isController": false}, {"data": ["NCPPServerlessEastNWM-position-1day", 2, 0, 0.0, 10098.0, 10098, 10098, 10098.0, 10098.0, 10098.0, 10098.0, 0.19805902158843336, 0.8518085264408793, 0.06866303971083382], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-1time-fullzedd", 2, 0, 0.0, 4192.0, 4192, 4192, 4192.0, 4192.0, 4192.0, 4192.0, 0.47709923664122134, 2.6356937321087783, 0.20127624045801526], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-1time-1zedd", 2, 0, 0.0, 3069.0, 3069, 3069, 3069.0, 3069.0, 3069.0, 3069.0, 0.6516780710329098, 574.0596489084393, 0.3347486966438579], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-halftime-1zedd", 2, 0, 0.0, 2021.0, 2021, 2021, 2021.0, 2021.0, 2021.0, 2021.0, 0.9896091044037606, 8.442602671944583, 0.422323416625433], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-1time-fullzedd", 2, 0, 0.0, 7207.0, 7207, 7207, 7207.0, 7207.0, 7207.0, 7207.0, 0.2775079783543777, 480.1741687768836, 0.3119254717635632], "isController": false}, {"data": ["NCPPServerlessEastRoot", 2, 0, 0.0, 727.0, 727, 727, 727.0, 727.0, 727.0, 727.0, 2.751031636863824, 4.400575997248969, 0.41641592159559837], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-fulltime-1zedd", 2, 0, 0.0, 3905.0, 3905, 3905, 3905.0, 3905.0, 3905.0, 3905.0, 0.5121638924455826, 2766.577304737516, 0.578185019206146], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-halftime-1zedd", 2, 0, 0.0, 3549.0, 3549, 3549, 3549.0, 3549.0, 3549.0, 3549.0, 0.5635390250774865, 1535.1204784798535, 0.6361827275288814], "isController": false}, {"data": ["NCPPServerlessEastNWM-position-1hour", 2, 0, 0.0, 9598.0, 9598, 9598, 9598.0, 9598.0, 9598.0, 9598.0, 0.20837674515524068, 0.5103602312981871, 0.07223998489268597], "isController": false}, {"data": ["NCPPServerlessEastGFSInstances", 2, 0, 0.0, 3820.0, 3820, 3820, 3820.0, 3820.0, 3820.0, 3820.0, 0.5235602094240839, 0.4550474476439791, 0.12322071335078534], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-halftime-fullzedd", 2, 0, 0.0, 4297.0, 4297, 4297, 4297.0, 4297.0, 4297.0, 4297.0, 0.46544100535257155, 46.13274886548755, 0.19635792413311615], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-1time-halfzedd", 2, 0, 0.0, 5198.0, 5198, 5198, 5198.0, 5198.0, 5198.0, 5198.0, 0.38476337052712584, 29.730109537322043, 0.29496020103886106], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-1time-halfzedd", 2, 0, 0.0, 3751.0, 3751, 3751, 3751.0, 3751.0, 3751.0, 3751.0, 0.5331911490269261, 2.297824746734204, 0.22702279392162092], "isController": false}, {"data": ["NCPPServerlessEastNWM-position-1month", 2, 0, 0.0, 10494.0, 10494, 10494, 10494.0, 10494.0, 10494.0, 10494.0, 0.1905850962454736, 10.405871807699638, 0.06607198160853821], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-1time-halfzedd", 2, 0, 0.0, 4873.0, 4873, 4873, 4873.0, 4873.0, 4873.0, 4873.0, 0.4104247896572953, 363.96221847424584, 0.4629303047404063], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-halftime-1zedd", 2, 0, 0.0, 2742.0, 2742, 2742, 2742.0, 2742.0, 2742.0, 2742.0, 0.7293946024799417, 169.5913680707513, 0.5598673413566739], "isController": false}, {"data": ["NCPPServerlessEastGFSCollectionMeta", 2, 0, 0.0, 1435.0, 1435, 1435, 1435.0, 1435.0, 1435.0, 1435.0, 1.3937282229965158, 10.59315113240418, 0.3334603658536585], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-fulltime-1zedd", 2, 0, 0.0, 2724.0, 2724, 2724, 2724.0, 2724.0, 2724.0, 2724.0, 0.7342143906020557, 336.5068029552129, 0.5635669052863436], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-1time-1zedd", 2, 0, 0.0, 2034.0, 2034, 2034, 2034.0, 2034.0, 2034.0, 2034.0, 0.9832841691248771, 3.0045860988200594, 0.3908170476892822], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-1time-fullzedd", 2, 0, 0.0, 6818.0, 6818, 6818, 6818.0, 6818.0, 6818.0, 6818.0, 0.2933411557641537, 43.37954220445879, 0.2237299244646524], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-halftime-halfzedd", 2, 0, 0.0, 3215.0, 3215, 3215, 3215.0, 3215.0, 3215.0, 3215.0, 0.6220839813374806, 33.42061139191291, 0.2648716951788492], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-1time-1zedd", 2, 0, 0.0, 2505.0, 2505, 2505, 2505.0, 2505.0, 2505.0, 2505.0, 0.7984031936127745, 5.528786177644711, 0.6128368263473054], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 56, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
