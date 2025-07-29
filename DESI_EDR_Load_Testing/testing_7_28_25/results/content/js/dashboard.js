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

    var data = {"OkPercent": 0.9624244391478299, "KoPercent": 99.03757556085218};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.004592171668568801, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9996791786974655, 500, 1500, "LREF_ResLevel-1_Times-One_5threads"], "isController": false}, {"data": [0.9994337485843715, 500, 1500, "HREF_ResLevel-4_Times-One_5threads"], "isController": false}, {"data": [0.14170227228588075, 500, 1500, "HREF_ResLevel-4_Times-One_250threads"], "isController": false}, {"data": [0.5480381371470481, 500, 1500, "NBM_ResLevel-4_Times-One_25threads"], "isController": false}, {"data": [2.663775025805898E-4, 500, 1500, "NBM_ResLevel-1_Times-One_100threads"], "isController": false}, {"data": [0.5515276630883568, 500, 1500, "HREF_ResLevel-4_Times-One_50threads"], "isController": false}, {"data": [7.343974731676625E-4, 500, 1500, "HREF_ResLevel-4_Times-One_100threads"], "isController": false}, {"data": [0.9529700011951715, 500, 1500, "LREF_ResLevel-1_Times-One_25threads"], "isController": false}, {"data": [0.9473058637083994, 500, 1500, "NBM_ResLevel-4_Times-One_5threads"], "isController": false}, {"data": [0.7342530815334163, 500, 1500, "LREF_ResLevel-1_Times-One_50threads"], "isController": false}, {"data": [0.43778762930124554, 500, 1500, "LREF_ResLevel-1_Times-One_100threads"], "isController": false}, {"data": [0.1572218382861092, 500, 1500, "NBM_ResLevel-4_Times-One_50threads"], "isController": false}, {"data": [0.851581508515815, 500, 1500, "HREF_ResLevel-4_Times-One_25threads"], "isController": false}, {"data": [1.7076108752878648E-4, 500, 1500, "NBM_ResLevel-4_Times-One_250threads"], "isController": false}, {"data": [0.002160364709037275, 500, 1500, "LREF_ResLevel-1_Times-One_250threads"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 11534412, 11423402, 99.03757556085218, 27.54361722123391, 0, 57189, 2.0, 3.0, 4.0, 8.0, 3927.69539280148, 4973.69208854655, 1171.189761812163], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["LREF_ResLevel-1_Times-One_5threads", 3117, 0, 0.0, 173.3416746871997, 136, 797, 155.0, 238.20000000000027, 292.0, 359.82000000000016, 25.94732285562067, 1093.6644548549257, 7.652433107810003], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_5threads", 2649, 0, 0.0, 203.77161192902955, 172, 1575, 193.0, 261.0, 274.0, 296.5, 22.080336081219627, 3001.826002807449, 6.533536945907761], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_250threads", 20596, 5744, 27.88891046805205, 3486.497523791033, 1, 28416, 2107.0, 8397.900000000001, 12511.900000000001, 23627.69000000021, 66.93924246462255, 6567.452207402854, 19.807217252715464], "isController": false}, {"data": ["NBM_ResLevel-4_Times-One_25threads", 2727, 31, 1.1367803447011369, 972.6439310597724, 8, 6112, 767.0, 1822.6000000000008, 2270.6, 3421.919999999993, 22.536817573263253, 5410.191978683721, 6.778652160708088], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_100threads", 2704808, 2700767, 99.8505993771092, 10.78488676460519, 0, 34049, 1.0, 2.0, 2.0, 3.0, 8468.641884085651, 5416.963455451155, 2547.208691697637], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_50threads", 6055, 101, 1.6680429397192402, 872.9440132122218, 20, 4848, 770.0, 1541.2000000000016, 1895.199999999999, 2681.399999999996, 50.129981951550675, 6701.726890365501, 14.833383331367045], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_100threads", 3801756, 3792141, 99.74709055499616, 7.193187043040539, 0, 22888, 1.0, 2.0, 2.0, 7390.920000000013, 12523.407955937966, 8297.17803251782, 3705.6568463371127], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_25threads", 8367, 0, 0.0, 315.9703597466233, 138, 1631, 282.0, 492.0, 568.0, 714.6399999999994, 69.53956117021276, 2931.051757487845, 20.508737766996344], "isController": false}, {"data": ["NBM_ResLevel-4_Times-One_5threads", 1262, 0, 0.0, 428.45245641838335, 334, 853, 386.0, 526.1000000000001, 738.0, 807.1099999999997, 10.47989968527084, 2544.701813715008, 3.1521573272103702], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_50threads", 8843, 41, 0.4636435598778695, 597.1525500395784, 19, 3408, 485.0, 1138.0, 1425.7999999999993, 2176.119999999999, 73.2709691852613, 3074.1014789950827, 21.609211615184485], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_100threads", 23685, 1024, 4.323411441840827, 1217.7496727886808, 1, 24129, 1007.0, 2064.9000000000015, 2578.0, 6585.650000000056, 77.2353746820583, 3115.586340022337, 22.778401517560162], "isController": false}, {"data": ["NBM_ResLevel-4_Times-One_50threads", 2894, 114, 3.9391845196959228, 1837.8234277816193, 1, 5437, 1797.0, 2972.0, 3376.0, 4139.1, 23.681131195430705, 5523.932034248243, 7.122840242375641], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_25threads", 5754, 0, 0.0, 459.6539798401098, 170, 1893, 419.0, 832.5, 931.0, 1056.4499999999998, 47.77046267776938, 6494.40373121124, 14.135205265004027], "isController": false}, {"data": ["NBM_ResLevel-4_Times-One_250threads", 3077399, 3073349, 99.86839535594832, 21.473977862473212, 0, 57189, 2.0, 3.0, 4.0, 8.0, 10256.013837324783, 6048.106653156432, 3084.816662007845], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_250threads", 1864500, 1850090, 99.22713864306785, 37.00756395816524, 0, 37601, 2.0, 3611.9000000000015, 6370.9000000000015, 19286.980000000003, 5950.747154684318, 3585.1301268393618, 1755.0055085104143], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503/Service Temporarily Unavailable", 3743821, 32.7732579138859, 32.45784007021771], "isController": false}, {"data": ["502/Bad Gateway", 7678116, 67.21391753524914, 66.56703436638122], "isController": false}, {"data": ["504/Gateway Time-out", 1465, 0.012824550864969997, 0.012701124253234582], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 11534412, 11423402, "502/Bad Gateway", 7678116, "503/Service Temporarily Unavailable", 3743821, "504/Gateway Time-out", 1465, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_250threads", 20596, 5744, "502/Bad Gateway", 5694, "504/Gateway Time-out", 50, "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-4_Times-One_25threads", 2727, 31, "502/Bad Gateway", 31, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_100threads", 2704808, 2700767, "502/Bad Gateway", 2391948, "503/Service Temporarily Unavailable", 308620, "504/Gateway Time-out", 199, "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_50threads", 6055, 101, "502/Bad Gateway", 101, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_100threads", 3801756, 3792141, "503/Service Temporarily Unavailable", 3171410, "502/Bad Gateway", 620545, "504/Gateway Time-out", 186, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_50threads", 8843, 41, "502/Bad Gateway", 41, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_100threads", 23685, 1024, "502/Bad Gateway", 967, "504/Gateway Time-out", 57, "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-4_Times-One_50threads", 2894, 114, "502/Bad Gateway", 114, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NBM_ResLevel-4_Times-One_250threads", 3077399, 3073349, "502/Bad Gateway", 3072839, "504/Gateway Time-out", 510, "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_250threads", 1864500, 1850090, "502/Bad Gateway", 1585836, "503/Service Temporarily Unavailable", 263791, "504/Gateway Time-out", 463, "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
