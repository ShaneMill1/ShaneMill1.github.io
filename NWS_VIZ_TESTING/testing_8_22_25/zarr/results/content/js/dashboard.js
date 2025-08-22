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

    var data = {"OkPercent": 99.36710750216437, "KoPercent": 0.6328924978356271};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5509398851638455, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6928104575163399, 500, 1500, "HREF_ResLevel-1_Time-All_5threads_ZARR"], "isController": false}, {"data": [0.056910569105691054, 500, 1500, "NBM_ResLevel-1_Times-One_100threads_ZARR"], "isController": false}, {"data": [0.5888732677244427, 500, 1500, "HREF_ResLevel-1_Times-One_50threads_ZARR"], "isController": false}, {"data": [0.3526413345690454, 500, 1500, "NBM_ResLevel-1_Times-One_25threads_ZARR"], "isController": false}, {"data": [0.6246159754224271, 500, 1500, "HREF_ResLevel-1_Times-One_25threads_ZARR"], "isController": false}, {"data": [0.18117331288343558, 500, 1500, "NBM_ResLevel-1_Times-One_50threads_ZARR"], "isController": false}, {"data": [0.5220983476010352, 500, 1500, "HREF_ResLevel-1_Time-All_50threads_ZARR"], "isController": false}, {"data": [0.746470431539691, 500, 1500, "LREF_ResLevel-1_Time-All_50threads_ZARR"], "isController": false}, {"data": [0.10435132957292506, 500, 1500, "NBM_ResLevel-1_Time-All_25threads_ZARR"], "isController": false}, {"data": [0.4704600120264582, 500, 1500, "MRMS_ResLevel-1_Times-One_100threads_ZARR"], "isController": false}, {"data": [0.24672320740169623, 500, 1500, "HREF_ResLevel-1_Times-One_100threads_ZARR"], "isController": false}, {"data": [0.8048780487804879, 500, 1500, "MRMS_ResLevel-1_Times-One_25threads_ZARR"], "isController": false}, {"data": [0.3089803554724041, 500, 1500, "HREF_ResLevel-1_Time-All_100threads_ZARR"], "isController": false}, {"data": [0.7842181530760111, 500, 1500, "LREF_ResLevel-1_Times-One_50threads_ZARR"], "isController": false}, {"data": [0.8711832061068703, 500, 1500, "HREF_ResLevel-1_Times-One_5threads_ZARR"], "isController": false}, {"data": [0.7787988609888687, 500, 1500, "LREF_ResLevel-1_Time-All_25threads_ZARR"], "isController": false}, {"data": [0.09440789473684211, 500, 1500, "NBM_ResLevel-1_Time-All_50threads_ZARR"], "isController": false}, {"data": [0.3498542274052478, 500, 1500, "NBM_ResLevel-1_Time-All_5threads_ZARR"], "isController": false}, {"data": [0.47839314541164785, 500, 1500, "LREF_ResLevel-1_Times-One_100threads_ZARR"], "isController": false}, {"data": [0.9272986457590877, 500, 1500, "MRMS_ResLevel-1_Times-One_5threads_ZARR"], "isController": false}, {"data": [0.4566929133858268, 500, 1500, "LREF_ResLevel-1_Time-All_100threads_ZARR"], "isController": false}, {"data": [0.7977099236641222, 500, 1500, "LREF_ResLevel-1_Time-All_5threads_ZARR"], "isController": false}, {"data": [0.6576670128071997, 500, 1500, "HREF_ResLevel-1_Time-All_25threads_ZARR"], "isController": false}, {"data": [0.06760466712422787, 500, 1500, "NBM_ResLevel-1_Time-All_100threads_ZARR"], "isController": false}, {"data": [0.4627906976744186, 500, 1500, "NBM_ResLevel-1_Times-One_5threads_ZARR"], "isController": false}, {"data": [0.7880699088145897, 500, 1500, "MRMS_ResLevel-1_Times-One_50threads_ZARR"], "isController": false}, {"data": [0.8876500857632933, 500, 1500, "LREF_ResLevel-1_Times-One_5threads_ZARR"], "isController": false}, {"data": [0.7091797377217793, 500, 1500, "LREF_ResLevel-1_Times-One_25threads_ZARR"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 100491, 636, 0.6328924978356271, 1338.5496711148292, 6, 52891, 1128.0, 4998.9000000000015, 6130.950000000001, 17241.69000000005, 28.872658734833315, 2895.850931056044, 8.169671500546619], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["HREF_ResLevel-1_Time-All_5threads_ZARR", 612, 3, 0.49019607843137253, 890.4607843137264, 365, 20949, 502.5, 1561.6000000000008, 2085.150000000001, 4722.260000000001, 4.940185014772122, 665.7218096151983, 1.3170610439773331], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_100threads_ZARR", 2706, 30, 1.1086474501108647, 3943.561714708057, 578, 21967, 3460.0, 7030.6, 7992.100000000001, 11043.009999999991, 21.896569861062783, 201.44186966695932, 6.564694284517847], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_50threads_ZARR", 4979, 16, 0.3213496686081542, 1075.501305483024, 7, 26710, 693.0, 2044.0, 2968.0, 5768.799999999992, 38.93219901633448, 238.35481538189367, 11.48195713177052], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_25threads_ZARR", 2158, 0, 0.0, 1229.6556997219614, 612, 7913, 847.0, 2024.0, 2737.249999999993, 3863.3799999999974, 17.746126772145654, 165.00085253671753, 5.3203719912585115], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_25threads_ZARR", 2604, 5, 0.19201228878648233, 1018.3874807987713, 355, 39014, 557.0, 1768.0, 2808.5, 5709.899999999996, 21.480540478115255, 131.65705222064574, 6.3350812738191475], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_50threads_ZARR", 2608, 2, 0.07668711656441718, 2036.10314417178, 222, 8385, 1888.5, 3581.2, 4487.65, 5603.189999999999, 21.421824304899584, 199.06198823616987, 6.422363341410325], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_50threads_ZARR", 5023, 38, 0.7565200079633685, 1053.078837348199, 7, 21883, 756.0, 1860.6000000000004, 3243.4000000000005, 4685.560000000001, 41.44286857586033, 5569.888100632307, 11.048733516806514], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_50threads_ZARR", 7508, 46, 0.6126798082045818, 714.9898774640347, 7, 29254, 448.0, 1137.0, 1771.2999999999956, 4039.91, 61.226320467759955, 19867.361713519454, 16.26324137424874], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_25threads_ZARR", 1241, 0, 0.0, 2147.2997582594667, 789, 6858, 2051.0, 3160.5999999999995, 3600.399999999999, 5371.279999999995, 10.051594404801438, 1995.8598900834663, 2.7288508247410155], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_100threads_ZARR", 6652, 0, 0.0, 1594.8018641010328, 178, 15987, 795.0, 5454.7, 5854.699999999999, 6447.880000000001, 51.76613411568782, 984.9048171317733, 14.913095277468658], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_100threads_ZARR", 5188, 1, 0.01927525057825752, 2042.9936391673086, 349, 10695, 1732.0, 4180.200000000001, 5215.0, 7012.369999999978, 42.57065021170447, 261.39127125506695, 12.55501598040503], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_25threads_ZARR", 4633, 2, 0.043168573278653144, 575.3393049859711, 176, 17988, 298.0, 1062.800000000001, 1981.3000000000002, 3738.579999999991, 35.511712043169, 675.382792379507, 10.230424856186382], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_100threads_ZARR", 5345, 15, 0.2806361085126286, 1984.939195509825, 284, 36854, 1480.0, 3866.6000000000104, 5686.199999999997, 9081.099999999999, 43.70722293545723, 5902.298727395107, 11.652413927128734], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_50threads_ZARR", 7591, 12, 0.15808193913845342, 695.6514293242009, 6, 26877, 399.0, 1093.6000000000004, 1549.9999999999982, 3711.6799999999967, 62.91023006033282, 693.4400160259066, 18.492167234531426], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_5threads_ZARR", 1048, 0, 0.0, 516.5811068702293, 346, 4391, 383.0, 842.1, 1298.4999999999986, 1846.02, 8.683475710296714, 53.333166755048104, 2.5609469379976635], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_25threads_ZARR", 3863, 2, 0.05177323323841574, 687.1426352575722, 9, 20409, 412.0, 1085.7999999999997, 1726.0, 3752.2400000000075, 31.44945942425426, 10262.599088910565, 8.35376265956754], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_50threads_ZARR", 1520, 44, 2.8947368421052633, 3597.936842105265, 7, 23019, 2434.0, 7886.400000000004, 10007.95, 14921.409999999993, 12.0446603326545, 2322.4676358565375, 3.269937082497999], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_5threads_ZARR", 343, 0, 0.0, 1619.3469387755106, 816, 21809, 1123.0, 2546.2000000000003, 3149.4000000000015, 10273.920000000004, 2.730044014995344, 542.0737004930794, 0.7411642931335015], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_100threads_ZARR", 8053, 14, 0.17384825530858064, 1313.0620886626125, 38, 28353, 961.0, 2671.2000000000007, 3606.7999999999956, 5910.180000000001, 66.31640493111428, 730.8510740619313, 19.493396371352926], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_5threads_ZARR", 1403, 3, 0.21382751247327156, 392.1368496079824, 174, 14497, 247.0, 565.4000000000005, 885.8, 2349.7200000000003, 11.315154887775924, 214.84322231144097, 3.259737003802634], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_100threads_ZARR", 8001, 7, 0.08748906386701662, 1322.249343832019, 226, 33607, 1029.0, 2459.8, 3547.699999999999, 5639.279999999984, 65.43019062339, 21343.514809780387, 17.37989438433797], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_5threads_ZARR", 786, 3, 0.3816793893129771, 689.6730279898227, 285, 13611, 446.5, 1106.7000000000012, 1588.6, 5107.289999999992, 6.486540016835295, 2109.6776300892725, 1.722987191971875], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_25threads_ZARR", 2889, 10, 0.3461405330564209, 919.5479404638279, 7, 28660, 530.0, 1466.0, 2208.0, 5434.199999999985, 23.493726061039773, 3170.58155440853, 6.263464076820174], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_100threads_ZARR", 1457, 0, 0.0, 7550.294440631432, 808, 52891, 3392.0, 18421.800000000003, 25044.799999999996, 36472.220000000125, 11.264099451870521, 2236.6158564353996, 3.058026999628911], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_5threads_ZARR", 645, 0, 0.0, 840.1906976744195, 581, 3129, 659.0, 1394.1999999999998, 1906.1999999999962, 2483.5599999999886, 5.351453604141777, 49.77094112726918, 1.6043908754604739], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_50threads_ZARR", 6580, 18, 0.2735562310030395, 817.7392097264432, 178, 39185, 376.0, 1300.7000000000016, 3762.95, 5610.289999999964, 44.4135454563863, 842.7431096358157, 12.794917880501915], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_5threads_ZARR", 1166, 12, 1.0291595197255574, 466.0171526586621, 9, 12067, 317.0, 734.0, 837.5999999999995, 2138.83999999996, 9.514095712129247, 103.99512113183876, 2.7966238372567416], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_25threads_ZARR", 3889, 353, 9.076883517613782, 681.4834147595778, 6, 19956, 392.0, 1174.0, 1585.0, 4049.199999999919, 31.973230948837895, 321.6742343643378, 9.398381362890827], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 606, 95.28301886792453, 0.6030390781263993], "isController": false}, {"data": ["504/Gateway Time-out", 30, 4.716981132075472, 0.029853419709227693], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 100491, 636, "502/Bad Gateway", 606, "504/Gateway Time-out", 30, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["HREF_ResLevel-1_Time-All_5threads_ZARR", 612, 3, "502/Bad Gateway", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_100threads_ZARR", 2706, 30, "502/Bad Gateway", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_50threads_ZARR", 4979, 16, "502/Bad Gateway", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_25threads_ZARR", 2604, 5, "502/Bad Gateway", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_50threads_ZARR", 2608, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_50threads_ZARR", 5023, 38, "502/Bad Gateway", 38, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_50threads_ZARR", 7508, 46, "502/Bad Gateway", 46, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_100threads_ZARR", 5188, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_25threads_ZARR", 4633, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_100threads_ZARR", 5345, 15, "502/Bad Gateway", 15, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_50threads_ZARR", 7591, 12, "502/Bad Gateway", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_25threads_ZARR", 3863, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-1_Time-All_50threads_ZARR", 1520, 44, "502/Bad Gateway", 31, "504/Gateway Time-out", 13, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_100threads_ZARR", 8053, 14, "502/Bad Gateway", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_5threads_ZARR", 1403, 3, "502/Bad Gateway", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_100threads_ZARR", 8001, 7, "502/Bad Gateway", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Time-All_5threads_ZARR", 786, 3, "502/Bad Gateway", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Time-All_25threads_ZARR", 2889, 10, "502/Bad Gateway", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["MRMS_ResLevel-1_Times-One_50threads_ZARR", 6580, 18, "502/Bad Gateway", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_5threads_ZARR", 1166, 12, "502/Bad Gateway", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_25threads_ZARR", 3889, 353, "502/Bad Gateway", 336, "504/Gateway Time-out", 17, "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
