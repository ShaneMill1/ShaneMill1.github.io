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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.017857142857142856, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "NCPPServerlessEastGFSPosition-fulltime-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaUS-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSPosition-fulltime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaGlobe-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastCollections"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSPosition-fulltime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastNWM-position-1day"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSPosition-1time-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaHalfGlobe-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSPosition-halftime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaUS-1time-fullzedd"], "isController": false}, {"data": [0.5, 500, 1500, "NCPPServerlessEastRoot"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaUS-fulltime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaUS-halftime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastNWM-position-1hour"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaTexas-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSInstances"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSPosition-halftime-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSPosition-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastNWM-position-1month"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaUS-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaTexas-halftime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaTexas-fulltime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSCollectionMeta"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSPosition-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaTexas-1time-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSPosition-halftime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaTexas-1time-1zedd"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 56, 0, 0.0, 5512.999999999999, 857, 11499, 4319.5, 11451.0, 11478.6, 11499.0, 4.869565217391304, 27.034986413043477, 2.804857336956522], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NCPPServerlessEastGFSPosition-fulltime-fullzedd", 2, 0, 0.0, 7324.0, 7324, 7324, 7324.0, 7324.0, 7324.0, 7324.0, 0.27307482250136533, 1.1005662035772803, 0.11520344074276352], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-1time-1zedd", 2, 0, 0.0, 4199.0, 4199, 4199, 4199.0, 4199.0, 4199.0, 4199.0, 0.4763038818766373, 2.3717514586806385, 0.5377024291497976], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-fulltime-1zedd", 2, 0, 0.0, 4370.0, 4370, 4370, 4370.0, 4370.0, 4370.0, 4370.0, 0.4576659038901602, 1.3461813501144164, 0.1953125], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-1time-1zedd", 2, 0, 0.0, 4287.0, 4287, 4287, 4287.0, 4287.0, 4287.0, 4287.0, 0.4665267086540705, 7.5414224690926055, 0.24283079659435503], "isController": false}, {"data": ["NCPPServerlessEastCollections", 2, 0, 0.0, 2873.0, 2873, 2873, 2873.0, 2873.0, 2873.0, 2873.0, 0.6961364427427776, 23.48304798990602, 0.11353006439262095], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-fulltime-halfzedd", 2, 0, 0.0, 6338.0, 6338, 6338, 6338.0, 6338.0, 6338.0, 6338.0, 0.3155569580309246, 1.1069146418428526, 0.1343582360366046], "isController": false}, {"data": ["NCPPServerlessEastNWM-position-1day", 2, 0, 0.0, 11451.0, 11451, 11451, 11451.0, 11451.0, 11451.0, 11451.0, 0.17465723517596715, 0.4272620840974587, 0.0605501157104183], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-1time-fullzedd", 2, 0, 0.0, 7111.0, 7111, 7111, 7111.0, 7111.0, 7111.0, 7111.0, 0.28125439459991564, 1.1335321157361835, 0.11865419772183941], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-1time-1zedd", 2, 0, 0.0, 4126.0, 4126, 4126, 4126.0, 4126.0, 4126.0, 4126.0, 0.4847309743092584, 5.430028326466311, 0.24899266844401355], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-halftime-1zedd", 2, 0, 0.0, 4079.0, 4079, 4079, 4079.0, 4079.0, 4079.0, 4079.0, 0.4903162539838195, 1.4422192939445944, 0.20924629198332925], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-1time-fullzedd", 2, 0, 0.0, 4289.0, 4289, 4289, 4289.0, 4289.0, 4289.0, 4289.0, 0.4663091629750524, 2.8297315807880628, 0.5241424283049663], "isController": false}, {"data": ["NCPPServerlessEastRoot", 2, 0, 0.0, 857.0, 857, 857, 857.0, 857.0, 857.0, 857.0, 2.333722287047841, 3.733044049008168, 0.35324897899649943], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-fulltime-1zedd", 2, 0, 0.0, 3923.0, 3923, 3923, 3923.0, 3923.0, 3923.0, 3923.0, 0.5098139179199592, 2.538614421361203, 0.5755321182768289], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-halftime-1zedd", 2, 0, 0.0, 4155.0, 4155, 4155, 4155.0, 4155.0, 4155.0, 4155.0, 0.4813477737665463, 2.3968674789410347, 0.5433965102286401], "isController": false}, {"data": ["NCPPServerlessEastNWM-position-1hour", 2, 0, 0.0, 11475.0, 11475, 11475, 11475.0, 11475.0, 11475.0, 11475.0, 0.17429193899782133, 0.4263684640522876, 0.060423474945533774], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-1time-halfzedd", 2, 0, 0.0, 4342.0, 4342, 4342, 4342.0, 4342.0, 4342.0, 4342.0, 0.460617227084293, 1.8109814025794566, 0.3531098859972363], "isController": false}, {"data": ["NCPPServerlessEastGFSInstances", 2, 0, 0.0, 5381.0, 5381, 5381, 5381.0, 5381.0, 5381.0, 5381.0, 0.3716781267422412, 0.497627648206653, 0.0874750278758595], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-halftime-fullzedd", 2, 0, 0.0, 7264.0, 7264, 7264, 7264.0, 7264.0, 7264.0, 7264.0, 0.27533039647577096, 1.1096567834526432, 0.11615501101321586], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-1time-halfzedd", 2, 0, 0.0, 6340.0, 6340, 6340, 6340.0, 6340.0, 6340.0, 6340.0, 0.3154574132492114, 1.1065654574132493, 0.13431585173501578], "isController": false}, {"data": ["NCPPServerlessEastNWM-position-1month", 2, 0, 0.0, 11499.0, 11499, 11499, 11499.0, 11499.0, 11499.0, 11499.0, 0.17392816766675365, 0.42547857422384555, 0.06029736281415775], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-1time-halfzedd", 2, 0, 0.0, 4007.0, 4007, 4007, 4007.0, 4007.0, 4007.0, 4007.0, 0.4991265285749938, 2.7681050349388574, 0.5629796293985526], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-halftime-1zedd", 2, 0, 0.0, 4297.0, 4297, 4297, 4297.0, 4297.0, 4297.0, 4297.0, 0.46544100535257155, 1.566318070747033, 0.3572623341866419], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-fulltime-1zedd", 2, 0, 0.0, 4018.0, 4018, 4018, 4018.0, 4018.0, 4018.0, 4018.0, 0.49776007964161273, 1.675079330512693, 0.3820697486311598], "isController": false}, {"data": ["NCPPServerlessEastGFSCollectionMeta", 2, 0, 0.0, 7313.0, 7313, 7313, 7313.0, 7313.0, 7313.0, 7313.0, 0.27348557363599074, 2.078650605086832, 0.06543356009845482], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-1time-1zedd", 2, 0, 0.0, 4064.0, 4064, 4064, 4064.0, 4064.0, 4064.0, 4064.0, 0.4921259842519685, 1.4475424458661417, 0.19560085506889763], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-1time-fullzedd", 2, 0, 0.0, 4443.0, 4443, 4443, 4443.0, 4443.0, 4443.0, 4443.0, 0.45014629754670266, 2.0049973272563584, 0.34332447107810043], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-halftime-halfzedd", 2, 0, 0.0, 6279.0, 6279, 6279, 6279.0, 6279.0, 6279.0, 6279.0, 0.3185220576524924, 1.1173156553591337, 0.1356207198598503], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-1time-1zedd", 2, 0, 0.0, 4260.0, 4260, 4260, 4260.0, 4260.0, 4260.0, 4260.0, 0.4694835680751174, 1.5799222417840377, 0.3603653169014085], "isController": false}]}, function(index, item){
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
