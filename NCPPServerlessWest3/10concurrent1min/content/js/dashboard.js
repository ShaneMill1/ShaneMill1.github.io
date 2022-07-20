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

    var data = {"OkPercent": 98.5048010973937, "KoPercent": 1.49519890260631};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5095336076817558, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "NCPPServerlessWestGFSPosition-1time-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSTrajectory20waypoints"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSCorridor5waypoints"], "isController": false}, {"data": [0.04778156996587031, 500, 1500, "NCPPServerlessWestGFSAreaGlobe-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSPosition-halftime-fullzedd"], "isController": false}, {"data": [0.71723044397463, 500, 1500, "NCPPServerlessWestGFSPosition-1time-1zedd"], "isController": false}, {"data": [0.728744939271255, 500, 1500, "NCPPServerlessWestGFSPosition-fulltime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSCorridor10waypoints"], "isController": false}, {"data": [0.7178714859437751, 500, 1500, "NCPPServerlessWestGFSPosition-halftime-1zedd"], "isController": false}, {"data": [0.49829931972789115, 500, 1500, "NCPPServerlessWestGFSAreaTexas-halftime-1zedd"], "isController": false}, {"data": [0.4933837429111531, 500, 1500, "NCPPServerlessWestGFSAreaTexas-fulltime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSCorridor20waypoints"], "isController": false}, {"data": [0.5770156438026474, 500, 1500, "NCPPServerlessWestGFSCollectionMeta"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSAreaUS-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestNWM-position-1month"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSTrajectory5waypoints"], "isController": false}, {"data": [0.4948453608247423, 500, 1500, "NCPPServerlessWestGFSAreaTexas-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestNWM-position-1hour"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSPosition-fulltime-halfzedd"], "isController": false}, {"data": [0.49728260869565216, 500, 1500, "NCPPServerlessWestGFSAreaUS-1time-1zedd"], "isController": false}, {"data": [0.3511166253101737, 500, 1500, "NCPPServerlessWestGFSAreaHalfGlobe-1time-1zedd"], "isController": false}, {"data": [0.993412664683383, 500, 1500, "NCPPServerlessWestCollections"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSAreaTexas-1time-fullzedd"], "isController": false}, {"data": [0.07118055555555555, 500, 1500, "NCPPServerlessWestGFSAreaUS-halftime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSAreaUS-1time-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSAreaTexas-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSTrajectory10waypoints"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSAreaTexas-halftime-halfzedd"], "isController": false}, {"data": [0.8701799485861182, 500, 1500, "NCPPServerlessWestGFSInstances"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSPosition-fulltime-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestGFSAreaUS-fulltime-1zedd"], "isController": false}, {"data": [0.008012820512820512, 500, 1500, "NCPPServerlessWestGFSPosition-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessWestNWM-position-1day"], "isController": false}, {"data": [0.0018726591760299626, 500, 1500, "NCPPServerlessWestGFSPosition-halftime-halfzedd"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 29160, 436, 1.49519890260631, 1325.7114540466366, 159, 29313, 1115.0, 3560.9000000000015, 5218.950000000001, 6413.980000000003, 13.71107437270424, 4110.670368268831, 7.4712007854832825], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NCPPServerlessWestGFSPosition-1time-fullzedd", 372, 2, 0.5376344086021505, 3065.430107526882, 2462, 29313, 2902.5, 3175.0, 3324.7999999999997, 5734.0, 5.922623786021334, 32.55934937708963, 2.49860690972775], "isController": false}, {"data": ["NCPPServerlessWestGFSTrajectory20waypoints", 422, 0, 0.0, 2688.91943127962, 2265, 3540, 2659.0, 2950.8, 3182.0, 3497.969999999999, 6.745093024742664, 51.872663642430155, 11.744629749136884], "isController": false}, {"data": ["NCPPServerlessWestGFSCorridor5waypoints", 252, 0, 0.0, 4717.809523809524, 3408, 9816, 4217.0, 6902.0, 8834.5, 9478.39, 3.795237880088555, 54.34157988072109, 2.8427221230741426], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaGlobe-1time-1zedd", 586, 0, 0.0, 1931.4675767918066, 1266, 3070, 1897.0, 2243.4000000000005, 2524.0, 3005.0, 9.372550901268333, 18736.177742840635, 4.8784859671640834], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-halftime-fullzedd", 350, 0, 0.0, 3264.805714285715, 2686, 4354, 3277.0, 3590.0, 3746.0, 3965.0, 5.541043299295496, 549.2072164667933, 2.3376276418902875], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-1time-1zedd", 1892, 0, 0.0, 588.4133192389032, 415, 4141, 539.0, 687.0, 736.0, 3425.7899999999872, 31.16711967712709, 95.23624752903386, 12.38771260604563], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-fulltime-1zedd", 1976, 0, 0.0, 564.2550607287443, 408, 1582, 515.0, 677.0, 773.1499999999999, 1456.0, 32.610489487407996, 429.445752673532, 13.916781158200482], "isController": false}, {"data": ["NCPPServerlessWestGFSCorridor10waypoints", 214, 0, 0.0, 5470.785046728969, 4342, 7145, 5493.0, 6000.0, 6118.75, 7105.549999999998, 3.3132063786963926, 71.9328166124787, 3.659410560845332], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-halftime-1zedd", 1992, 0, 0.0, 559.9226907630534, 404, 2890, 524.0, 670.0, 733.0, 1056.0, 32.797141775194696, 279.8006157696297, 13.996436480234452], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-halftime-1zedd", 1176, 0, 0.0, 952.2653061224486, 606, 3345, 996.5, 1170.0, 1213.2999999999997, 1386.0, 19.38195302843016, 4506.493355995056, 14.877163164400494], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-fulltime-1zedd", 1058, 0, 0.0, 1058.6710775047268, 627, 3207, 1089.0, 1263.0, 1386.0, 1603.8800000000056, 17.327219128725844, 7329.7859559245, 13.299994370291516], "isController": false}, {"data": ["NCPPServerlessWestGFSCorridor20waypoints", 434, 434, 100.0, 2618.972350230416, 1954, 3816, 2566.0, 2952.0, 3439.0, 3789.6, 6.950783965149986, 3.48217985754096, 12.530417187174683], "isController": false}, {"data": ["NCPPServerlessWestGFSCollectionMeta", 1662, 0, 0.0, 671.6654632972331, 443, 6836, 568.0, 748.0, 848.0, 6320.8499999999885, 27.422574950088272, 208.4276375356807, 6.561065295675417], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-1time-halfzedd", 336, 0, 0.0, 3393.1488095238074, 2619, 5637, 3384.0, 3811.0, 4031.7499999999964, 5266.0, 5.3488705286785425, 4743.345999092602, 6.0331498638903485], "isController": false}, {"data": ["NCPPServerlessWestNWM-position-1month", 190, 0, 0.0, 6204.736842105264, 5512, 7988, 6115.0, 6819.0, 7150.0, 7988.0, 2.901737988331959, 163.6789921328538, 1.0059736190018023], "isController": false}, {"data": ["NCPPServerlessWestGFSTrajectory5waypoints", 472, 0, 0.0, 2406.686440677963, 1860, 8591, 2166.0, 2406.0, 2958.0, 7774.499999999999, 7.603092783505154, 31.00636275773196, 5.197426707474227], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-1time-1zedd", 1552, 0, 0.0, 720.877577319588, 495, 4593, 687.5, 851.0, 944.0, 3370.0, 25.49235393636767, 176.5295720339679, 19.567373236313465], "isController": false}, {"data": ["NCPPServerlessWestNWM-position-1hour", 196, 0, 0.0, 5950.2959183673465, 4841, 11945, 5390.5, 8406.0, 8778.0, 11945.0, 2.9825762763448225, 7.838000741839762, 1.0339986114281365], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-fulltime-halfzedd", 564, 0, 0.0, 2006.219858156027, 1520, 3816, 1957.0, 2276.5, 2475.75, 3625.0, 8.99751132665433, 858.5857610195585, 3.830971619552039], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-1time-1zedd", 1472, 0, 0.0, 758.519021739131, 517, 3912, 751.0, 962.0, 1023.0, 1369.199999999999, 24.232048200704572, 1135.7589388601718, 27.355710664076646], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaHalfGlobe-1time-1zedd", 806, 0, 0.0, 1394.384615384615, 902, 3112, 1439.0, 1610.0, 1681.5499999999997, 1833.3699999999994, 13.120197942440422, 11557.51061641327, 6.739476677464514], "isController": false}, {"data": ["NCPPServerlessWestCollections", 4706, 0, 0.0, 236.46238844028971, 159, 2842, 202.0, 383.0, 415.0, 504.0, 77.85075021919303, 2626.1703758023295, 12.696362584575427], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-1time-fullzedd", 214, 0, 0.0, 5394.897196261678, 4131, 8905, 5271.0, 6217.0, 7045.75, 8888.65, 3.300024673081668, 488.01048461402047, 2.5169133492937332], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-halftime-1zedd", 576, 0, 0.0, 1951.5972222222229, 1263, 4541, 1920.5, 2264.0, 2720.0, 3647.0, 9.349738661818654, 25469.354648897835, 10.554978411193714], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-1time-fullzedd", 208, 0, 0.0, 5622.538461538459, 4652, 9444, 5587.5, 6185.299999999999, 6414.499999999998, 9189.56999999999, 3.1710700836979555, 5486.9267204579755, 3.5643570960315887], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-1time-halfzedd", 374, 0, 0.0, 3056.401069518717, 2325, 4182, 3084.0, 3345.0, 3521.5, 4152.0, 5.969672785315243, 461.2679880786113, 4.576360484836393], "isController": false}, {"data": ["NCPPServerlessWestGFSTrajectory10waypoints", 382, 0, 0.0, 2996.732984293193, 2512, 4204, 2967.0, 3250.3999999999996, 3603.0, 4145.0, 6.1009694472393905, 32.20287095930558, 6.273750808538163], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaTexas-halftime-halfzedd", 236, 0, 0.0, 4871.584745762716, 3940, 6613, 4825.0, 5374.0, 5851.0, 6512.729999999999, 3.6468715713998736, 17389.05291440669, 2.7956974448719736], "isController": false}, {"data": ["NCPPServerlessWestGFSInstances", 2334, 0, 0.0, 477.23907455012846, 312, 5150, 396.0, 559.0, 614.25, 1134.0, 38.64622313474848, 51.742160075918136, 9.095448999486704], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-fulltime-fullzedd", 348, 0, 0.0, 3260.7528735632186, 2640, 5452, 3197.0, 3561.2, 3800.0, 5408.0, 5.553427805438529, 989.1555184196668, 2.3428523554193794], "isController": false}, {"data": ["NCPPServerlessWestGFSAreaUS-fulltime-1zedd", 444, 0, 0.0, 2565.2657657657646, 1915, 3582, 2583.5, 2864.5, 2927.25, 3272.450000000001, 7.106956493901463, 35413.05501838765, 8.023087604443448], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-1time-halfzedd", 624, 0, 0.0, 1816.9391025641035, 1463, 2851, 1810.5, 2010.0, 2094.0, 2389.25, 10.089251067132324, 43.48033687427241, 4.2958139309274355], "isController": false}, {"data": ["NCPPServerlessWestNWM-position-1day", 206, 0, 0.0, 5592.9514563106795, 4795, 8011, 5437.0, 6476.500000000003, 7111.199999999997, 7965.2900000000045, 3.1981618331987827, 14.079407757871202, 1.108737744907781], "isController": false}, {"data": ["NCPPServerlessWestGFSPosition-halftime-halfzedd", 534, 0, 0.0, 2112.610486891386, 1497, 9443, 1967.0, 2332.0, 3029.25, 6722.0, 8.663767927834384, 465.44908692768837, 3.688869938023233], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Timeout", 2, 0.45871559633027525, 0.006858710562414266], "isController": false}, {"data": ["502/Bad Gateway", 434, 99.54128440366972, 1.4883401920438957], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 29160, 436, "502/Bad Gateway", 434, "504/Gateway Timeout", 2, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["NCPPServerlessWestGFSPosition-1time-fullzedd", 372, 2, "504/Gateway Timeout", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessWestGFSCorridor20waypoints", 434, 434, "502/Bad Gateway", 434, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
