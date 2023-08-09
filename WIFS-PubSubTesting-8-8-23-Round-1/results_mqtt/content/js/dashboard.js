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

    var data = {"OkPercent": 99.74382960688148, "KoPercent": 0.2561703931185233};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9036451595152432, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "MQTT Sub Sampler - NAM-CAR"], "isController": false}, {"data": [1.0, 500, 1500, "MQTT Sub Sampler - AFI"], "isController": false}, {"data": [1.0, 500, 1500, "MQTT Sub Sampler - ASIA-PAC"], "isController": false}, {"data": [0.6735458200442566, 500, 1500, "MQTT Connect"], "isController": false}, {"data": [1.0, 500, 1500, "MQTT Sub Sampler - EUR-NAT"], "isController": false}, {"data": [1.0, 500, 1500, "MQTT Sub Sampler - GLOBAL"], "isController": false}, {"data": [1.0, 500, 1500, "MQTT Sub Sampler - SAM"], "isController": false}, {"data": [0.4620387014909591, 500, 1500, "MQTT DisConnect"], "isController": false}, {"data": [1.0, 500, 1500, "MQTT Sub Sampler - MID"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 854119, 2188, 0.2561703931185233, 7404.946274465284, 0, 300004, 0.0, 120011.0, 179971.0, 179990.0, 29.406389744810824, 46.32486586080815, 0.0], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["MQTT Sub Sampler - NAM-CAR", 94597, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, 3.277214622896518, 0.08557548524018362, 0.0], "isController": false}, {"data": ["MQTT Sub Sampler - AFI", 94586, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, 3.276833766388629, 0.10766193025103464, 0.0], "isController": false}, {"data": ["MQTT Sub Sampler - ASIA-PAC", 94575, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, 3.2764526828093437, 46.06056741798969, 0.0], "isController": false}, {"data": ["MQTT Connect", 96257, 1094, 1.1365407191165318, 30692.353802839985, 0, 300004, 120000.0, 179994.0, 180005.0, 240031.0, 3.3140239915822685, 0.03674012314714773, 0.0], "isController": false}, {"data": ["MQTT Sub Sampler - EUR-NAT", 94840, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, 3.285632991191912, 0.06205801996025506, 0.0], "isController": false}, {"data": ["MQTT Sub Sampler - GLOBAL", 95520, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, 3.3023257438037574, 0.0045558177838746034, 0.0], "isController": false}, {"data": ["MQTT Sub Sampler - SAM", 94592, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, 3.2770415166294478, 0.09450402174159693, 0.0], "isController": false}, {"data": ["MQTT DisConnect", 94570, 1094, 1.1568150576292693, 35638.69522047177, 0, 173017, 112977.0, 172967.0, 172984.0, 173002.0, 3.2635055191099522, 0.03726926182158891, 0.0], "isController": false}, {"data": ["MQTT Sub Sampler - MID", 94582, 0, 0.0, 0.0, 0, 0, 0.0, 0.0, 0.0, 0.0, 3.2766951905416164, 0.1249002107747294, 0.0], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500/Connection HiveMQTTConnection{clientId='conn_48bc1c6ea409430ca1'} is already established.", 110, 5.027422303473492, 0.012878767478536363], "isController": false}, {"data": ["500/Connection HiveMQTTConnection{clientId='conn_cd0dad0abef64ffcb1'} is already established.", 110, 5.027422303473492, 0.012878767478536363], "isController": false}, {"data": ["501/Failed to disconnect Connection HiveMQTTConnection{clientId='conn_a266141f6e114751b0'}.", 110, 5.027422303473492, 0.012878767478536363], "isController": false}, {"data": ["501/Failed to disconnect Connection HiveMQTTConnection{clientId='conn_c3852f60cd5e4d068c'}.", 109, 4.9817184643510055, 0.012761687774186032], "isController": false}, {"data": ["500/Connection HiveMQTTConnection{clientId='conn_a24adf5430a54c96a1'} is already established.", 109, 4.9817184643510055, 0.012761687774186032], "isController": false}, {"data": ["500/Connection HiveMQTTConnection{clientId='conn_2be77ae69df3436ab5'} is already established.", 109, 4.9817184643510055, 0.012761687774186032], "isController": false}, {"data": ["500/Connection HiveMQTTConnection{clientId='conn_7a3a46e256384649a7'} is already established.", 110, 5.027422303473492, 0.012878767478536363], "isController": false}, {"data": ["501/Failed to disconnect Connection HiveMQTTConnection{clientId='conn_4da639cd54b345919c'}.", 109, 4.9817184643510055, 0.012761687774186032], "isController": false}, {"data": ["501/Failed to disconnect Connection HiveMQTTConnection{clientId='conn_3823ebd66178482bb6'}.", 109, 4.9817184643510055, 0.012761687774186032], "isController": false}, {"data": ["501/Failed to disconnect Connection HiveMQTTConnection{clientId='conn_7a3a46e256384649a7'}.", 110, 5.027422303473492, 0.012878767478536363], "isController": false}, {"data": ["501/Failed to disconnect Connection HiveMQTTConnection{clientId='conn_bda53c46fff1451499'}.", 109, 4.9817184643510055, 0.012761687774186032], "isController": false}, {"data": ["501/Failed to disconnect Connection HiveMQTTConnection{clientId='conn_48bc1c6ea409430ca1'}.", 110, 5.027422303473492, 0.012878767478536363], "isController": false}, {"data": ["501/Failed to disconnect Connection HiveMQTTConnection{clientId='conn_a24adf5430a54c96a1'}.", 109, 4.9817184643510055, 0.012761687774186032], "isController": false}, {"data": ["500/Connection HiveMQTTConnection{clientId='conn_4da639cd54b345919c'} is already established.", 109, 4.9817184643510055, 0.012761687774186032], "isController": false}, {"data": ["501/Failed to disconnect Connection HiveMQTTConnection{clientId='conn_cd0dad0abef64ffcb1'}.", 110, 5.027422303473492, 0.012878767478536363], "isController": false}, {"data": ["500/Connection HiveMQTTConnection{clientId='conn_3823ebd66178482bb6'} is already established.", 109, 4.9817184643510055, 0.012761687774186032], "isController": false}, {"data": ["500/Connection HiveMQTTConnection{clientId='conn_c3852f60cd5e4d068c'} is already established.", 109, 4.9817184643510055, 0.012761687774186032], "isController": false}, {"data": ["500/Connection HiveMQTTConnection{clientId='conn_bda53c46fff1451499'} is already established.", 109, 4.9817184643510055, 0.012761687774186032], "isController": false}, {"data": ["500/Connection HiveMQTTConnection{clientId='conn_a266141f6e114751b0'} is already established.", 110, 5.027422303473492, 0.012878767478536363], "isController": false}, {"data": ["501/Failed to disconnect Connection HiveMQTTConnection{clientId='conn_2be77ae69df3436ab5'}.", 109, 4.9817184643510055, 0.012761687774186032], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 854119, 2188, "500/Connection HiveMQTTConnection{clientId='conn_48bc1c6ea409430ca1'} is already established.", 110, "500/Connection HiveMQTTConnection{clientId='conn_cd0dad0abef64ffcb1'} is already established.", 110, "501/Failed to disconnect Connection HiveMQTTConnection{clientId='conn_a266141f6e114751b0'}.", 110, "500/Connection HiveMQTTConnection{clientId='conn_7a3a46e256384649a7'} is already established.", 110, "501/Failed to disconnect Connection HiveMQTTConnection{clientId='conn_7a3a46e256384649a7'}.", 110], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["MQTT Connect", 96257, 1094, "500/Connection HiveMQTTConnection{clientId='conn_48bc1c6ea409430ca1'} is already established.", 110, "500/Connection HiveMQTTConnection{clientId='conn_cd0dad0abef64ffcb1'} is already established.", 110, "500/Connection HiveMQTTConnection{clientId='conn_a266141f6e114751b0'} is already established.", 110, "500/Connection HiveMQTTConnection{clientId='conn_7a3a46e256384649a7'} is already established.", 110, "500/Connection HiveMQTTConnection{clientId='conn_a24adf5430a54c96a1'} is already established.", 109], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["MQTT DisConnect", 94570, 1094, "501/Failed to disconnect Connection HiveMQTTConnection{clientId='conn_7a3a46e256384649a7'}.", 110, "501/Failed to disconnect Connection HiveMQTTConnection{clientId='conn_a266141f6e114751b0'}.", 110, "501/Failed to disconnect Connection HiveMQTTConnection{clientId='conn_48bc1c6ea409430ca1'}.", 110, "501/Failed to disconnect Connection HiveMQTTConnection{clientId='conn_cd0dad0abef64ffcb1'}.", 110, "501/Failed to disconnect Connection HiveMQTTConnection{clientId='conn_bda53c46fff1451499'}.", 109], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
