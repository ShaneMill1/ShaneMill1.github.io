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

    var data = {"OkPercent": 99.81169615575925, "KoPercent": 0.1883038442407447};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.587712285937611, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.05579021471312918, 500, 1500, "NBM_ResLevel-1_Times-One_100threads_ZARR"], "isController": false}, {"data": [0.514078027235922, 500, 1500, "HREF_ResLevel-1_Times-One_50threads_ZARR"], "isController": false}, {"data": [0.4760125835627212, 500, 1500, "NBM_ResLevel-1_Times-One_25threads_ZARR"], "isController": false}, {"data": [0.7415056628914057, 500, 1500, "HREF_ResLevel-1_Times-One_25threads_ZARR"], "isController": false}, {"data": [0.19419475655430712, 500, 1500, "NBM_ResLevel-1_Times-One_50threads_ZARR"], "isController": false}, {"data": [0.5032600596125186, 500, 1500, "HREF_ResLevel-1_Time-All_50threads_ZARR"], "isController": false}, {"data": [0.7022985664854177, 500, 1500, "LREF_ResLevel-1_Time-All_50threads_ZARR"], "isController": false}, {"data": [0.07376325088339222, 500, 1500, "NBM_ResLevel-1_Time-All_25threads_ZARR"], "isController": false}, {"data": [0.8907780979827089, 500, 1500, "LREF_ResLevel-1_Time-All_25threads_ZARR"], "isController": false}, {"data": [0.05698371893744644, 500, 1500, "NBM_ResLevel-1_Time-All_50threads_ZARR"], "isController": false}, {"data": [0.4430696014277216, 500, 1500, "LREF_ResLevel-1_Times-One_100threads_ZARR"], "isController": false}, {"data": [0.41180662786554223, 500, 1500, "LREF_ResLevel-1_Time-All_100threads_ZARR"], "isController": false}, {"data": [0.471371798645864, 500, 1500, "MRMS_ResLevel-1_Times-One_100threads_ZARR"], "isController": false}, {"data": [0.36357065413805567, 500, 1500, "HREF_ResLevel-1_Times-One_100threads_ZARR"], "isController": false}, {"data": [0.7617283950617284, 500, 1500, "HREF_ResLevel-1_Time-All_25threads_ZARR"], "isController": false}, {"data": [0.04032258064516129, 500, 1500, "NBM_ResLevel-1_Time-All_100threads_ZARR"], "isController": false}, {"data": [0.7732615689185846, 500, 1500, "MRMS_ResLevel-1_Times-One_50threads_ZARR"], "isController": false}, {"data": [0.9135901162790697, 500, 1500, "MRMS_ResLevel-1_Times-One_25threads_ZARR"], "isController": false}, {"data": [0.28835931963146705, 500, 1500, "HREF_ResLevel-1_Time-All_100threads_ZARR"], "isController": false}, {"data": [0.7144752714113389, 500, 1500, "LREF_ResLevel-1_Times-One_50threads_ZARR"], "isController": false}, {"data": [0.9278982700748774, 500, 1500, "LREF_ResLevel-1_Times-One_25threads_ZARR"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 112584, 212, 0.1883038442407447, 1162.7730316918942, 7, 62620, 1180.0, 4426.9000000000015, 5412.950000000001, 16125.520000000237, 43.93285356730057, 8.929435275778319, 12.428885156014038], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NBM_ResLevel-1_Times-One_100threads_ZARR", 2841, 77, 2.710313269975361, 3758.7940865892306, 203, 15315, 3422.0, 6465.400000000001, 7363.6, 10177.359999999997, 23.193540749932648, 4.753545987562352, 6.953532236552073], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_50threads_ZARR", 5434, 8, 0.1472211998527788, 971.4928229665097, 42, 4611, 783.0, 1757.5, 2211.0, 3076.499999999989, 45.0330247706498, 9.151800512982009, 13.281224102281485], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_25threads_ZARR", 2543, 0, 0.0, 1041.781360597722, 354, 4205, 922.0, 1682.9999999999995, 2043.5999999999995, 3007.5999999999995, 21.031129048264912, 4.27194808792881, 6.305231072087234], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_25threads_ZARR", 4503, 4, 0.08882966910948256, 587.4368198978439, 14, 3624, 504.0, 973.5999999999999, 1119.0, 1503.4400000000005, 37.414626850790164, 7.602085566329329, 11.034391903260381], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_50threads_ZARR", 2670, 3, 0.11235955056179775, 1987.301498127341, 113, 5888, 1683.0, 3305.9, 3819.1499999999987, 4735.58, 21.97313845546119, 4.464957357606656, 6.587649908033774], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_50threads_ZARR", 5368, 11, 0.20491803278688525, 1003.3455663189256, 7, 4844, 811.0, 1756.1000000000004, 2219.0, 3623.7900000000036, 43.749337810414104, 8.892625130909787, 11.663641818596728], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_50threads_ZARR", 8092, 4, 0.049431537320810674, 660.7226890756301, 14, 4166, 539.0, 1121.0, 1383.0, 3061.2599999999948, 66.3637705644037, 13.482351364262634, 17.62787655616973], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_25threads_ZARR", 1132, 2, 0.17667844522968199, 2353.956713780916, 20, 9037, 2200.5, 3473.7, 4213.299999999998, 5436.710000000001, 9.29881054084248, 1.8899279229233752, 2.524481767924032], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_25threads_ZARR", 6940, 0, 0.0, 380.91930835734934, 164, 2014, 337.0, 605.9000000000005, 698.0, 927.0, 57.675686457017484, 11.715373811581676, 15.32010421514527], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_50threads_ZARR", 1167, 0, 0.0, 4598.7403598971705, 623, 31898, 3279.0, 9378.600000000002, 11704.599999999997, 16915.799999999977, 9.409772617319788, 1.9113600628930818, 2.5546062379051766], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_100threads_ZARR", 8405, 28, 0.33313503866745986, 1286.3433670434274, 45, 6521, 1020.0, 2470.4000000000005, 3360.0, 4940.9400000000005, 68.13999302791267, 13.856231860412326, 20.029431544337612], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_100threads_ZARR", 8419, 19, 0.2256800095023162, 1254.6267965316565, 45, 7940, 1051.0, 2241.0, 2679.0, 4650.399999999994, 69.66372091483798, 14.161037040657167, 18.50442586800384], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_100threads_ZARR", 6794, 1, 0.014718869590815425, 1555.5500441566091, 14, 7483, 790.0, 4627.0, 4970.25, 5895.150000000004, 56.11536936698824, 11.398990954246234, 16.166048792247587], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_100threads_ZARR", 5534, 23, 0.41561257679797614, 1913.1830502349098, 129, 10883, 1383.0, 4136.0, 5144.0, 7089.65, 45.56645176164481, 9.268446464668298, 13.438543390641339], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_25threads_ZARR", 4860, 2, 0.0411522633744856, 544.3216049382729, 83, 2347, 477.0, 871.9000000000005, 1035.749999999999, 1735.5600000000013, 40.32793414763675, 8.192729899304634, 10.751490256157064], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_100threads_ZARR", 1240, 1, 0.08064516129032258, 8878.11532258065, 37, 62620, 5012.0, 20676.90000000001, 28236.45000000001, 43357.90999999993, 9.565760747980775, 1.9435649647262574, 2.5969545780650938], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_50threads_ZARR", 8082, 0, 0.0, 652.242885424397, 107, 3820, 421.0, 956.0, 2861.0, 3230.34, 67.21221495933337, 13.65248116361459, 19.362893958011078], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_25threads_ZARR", 6880, 0, 0.0, 389.86656976744206, 105, 2292, 285.0, 541.0, 1549.8499999999995, 1879.1899999999996, 56.39251815544007, 11.454730250323765, 16.245891460795725], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_100threads_ZARR", 5644, 20, 0.3543586109142452, 1927.2645287030466, 78, 12077, 1491.5, 3676.5, 5014.25, 7092.0, 44.81285630349515, 9.113311707001413, 11.947177510599781], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_50threads_ZARR", 8290, 7, 0.08443908323281062, 637.4843184559724, 37, 3551, 525.0, 1123.9000000000005, 1381.4499999999998, 2158.630000000001, 68.73678537374073, 13.966070475415613, 20.204855856929647], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_25threads_ZARR", 7746, 2, 0.025819777949909632, 341.2266976504008, 12, 1813, 306.0, 555.0, 635.0, 864.5299999999997, 64.39705698964958, 13.08177258698092, 18.929213040902855], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 212, 100.0, 0.1883038442407447], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 112584, 212, "502/Bad Gateway", 212, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["NBM_ResLevel-1_Times-One_100threads_ZARR", 2841, 77, "502/Bad Gateway", 77, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_50threads_ZARR", 5434, 8, "502/Bad Gateway", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_25threads_ZARR", 4503, 4, "502/Bad Gateway", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_50threads_ZARR", 2670, 3, "502/Bad Gateway", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_50threads_ZARR", 5368, 11, "502/Bad Gateway", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_50threads_ZARR", 8092, 4, "502/Bad Gateway", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_25threads_ZARR", 1132, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_100threads_ZARR", 8405, 28, "502/Bad Gateway", 28, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_100threads_ZARR", 8419, 19, "502/Bad Gateway", 19, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_100threads_ZARR", 6794, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_100threads_ZARR", 5534, 23, "502/Bad Gateway", 23, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_25threads_ZARR", 4860, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_100threads_ZARR", 1240, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_100threads_ZARR", 5644, 20, "502/Bad Gateway", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_50threads_ZARR", 8290, 7, "502/Bad Gateway", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_25threads_ZARR", 7746, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
