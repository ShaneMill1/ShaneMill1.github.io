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

    var data = {"OkPercent": 99.6249953124414, "KoPercent": 0.3750046875585945};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.31041638020475254, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3459214501510574, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -80"], "isController": false}, {"data": [0.32617728531855955, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -79"], "isController": false}, {"data": [0.48516129032258065, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -78"], "isController": false}, {"data": [0.4602272727272727, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -77"], "isController": false}, {"data": [0.37742382271468145, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -80"], "isController": false}, {"data": [0.47516339869281043, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79"], "isController": false}, {"data": [0.4753164556962025, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -78"], "isController": false}, {"data": [0.4723618090452261, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -79"], "isController": false}, {"data": [0.47074122236671, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77"], "isController": false}, {"data": [0.38271604938271603, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -78"], "isController": false}, {"data": [0.35664819944598336, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -79"], "isController": false}, {"data": [0.47265625, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -80"], "isController": false}, {"data": [0.4737171464330413, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -80"], "isController": false}, {"data": [0.41237830319888735, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.325, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -79"], "isController": false}, {"data": [0.3397239263803681, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -78"], "isController": false}, {"data": [0.3125948406676783, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -77"], "isController": false}, {"data": [0.465495608531995, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -78"], "isController": false}, {"data": [0.4748743718592965, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -77"], "isController": false}, {"data": [0.49746835443037973, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.4672131147540984, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -79"], "isController": false}, {"data": [0.3455098934550989, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -80"], "isController": false}, {"data": [0.3948824343015214, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -77"], "isController": false}, {"data": [0.4051246537396122, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -78"], "isController": false}, {"data": [0.35572519083969467, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -77"], "isController": false}, {"data": [0.0028553299492385786, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}, {"data": [0.3445635528330781, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -79"], "isController": false}, {"data": [0.4622395833333333, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80"], "isController": false}, {"data": [0.35106382978723405, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -78"], "isController": false}, {"data": [0.4830188679245283, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -80"], "isController": false}, {"data": [0.40594744121715076, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -77"], "isController": false}, {"data": [0.4611901681759379, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77"], "isController": false}, {"data": [0.38381742738589214, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -78"], "isController": false}, {"data": [0.46088657105606257, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78"], "isController": false}, {"data": [0.4129834254143646, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -79"], "isController": false}, {"data": [0.45708712613784136, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_CityLevel1234_Summaries_24hourly_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.4641927083333333, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80"], "isController": false}, {"data": [0.48764629388816644, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79"], "isController": false}, {"data": [0.4088397790055249, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -77"], "isController": false}, {"data": [0.3997214484679666, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -78"], "isController": false}, {"data": [0.3941908713692946, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -79"], "isController": false}, {"data": [0.4739583333333333, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -77"], "isController": false}, {"data": [0.49417852522639066, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.4742138364779874, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -77"], "isController": false}, {"data": [0.4883116883116883, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -79"], "isController": false}, {"data": [0.340499306518724, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -80"], "isController": false}, {"data": [0.4803921568627451, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -78"], "isController": false}, {"data": [0.47338403041825095, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -79"], "isController": false}, {"data": [0.4609375, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -77"], "isController": false}, {"data": [0.46788413098236775, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -78"], "isController": false}, {"data": [0.4486345903771131, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77"], "isController": false}, {"data": [7.613247049866769E-4, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.44328552803129073, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78"], "isController": false}, {"data": [0.5032341526520052, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -79"], "isController": false}, {"data": [0.4084022038567493, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -80"], "isController": false}, {"data": [0.3363774733637747, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -77"], "isController": false}, {"data": [0.4740177439797212, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -77"], "isController": false}, {"data": [0.31666666666666665, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP "], "isController": false}, {"data": [0.45930232558139533, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -80"], "isController": false}, {"data": [0.3639817629179331, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -78"], "isController": false}, {"data": [0.3723994452149792, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -80"], "isController": false}, {"data": [0.4987405541561713, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -79"], "isController": false}, {"data": [0.002835820895522388, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.4563843236409608, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -78"], "isController": false}, {"data": [0.3330792682926829, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST"], "isController": false}, {"data": [0.33001531393568145, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -79"], "isController": false}, {"data": [0.3541033434650456, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -78"], "isController": false}, {"data": [0.46545226130653267, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -80"], "isController": false}, {"data": [0.3086232980332829, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -77"], "isController": false}, {"data": [0.4124137931034483, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -77"], "isController": false}, {"data": [0.4056865464632455, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -78"], "isController": false}, {"data": [0.39709944751381215, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -80"], "isController": false}, {"data": [0.36099585062240663, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -79"], "isController": false}, {"data": [0.3295281582952816, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -80"], "isController": false}, {"data": [0.33843797856049007, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -80"], "isController": false}, {"data": [0.34370257966616086, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -79"], "isController": false}, {"data": [0.4822109275730623, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -80"], "isController": false}, {"data": [0.4666666666666667, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -79"], "isController": false}, {"data": [0.33484848484848484, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -78"], "isController": false}, {"data": [0.4924433249370277, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -78"], "isController": false}, {"data": [0.4729219143576826, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -77"], "isController": false}, {"data": [0.4772135416666667, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80"], "isController": false}, {"data": [0.3195718654434251, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -77"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 79999, 300, 0.3750046875585945, 3127.0234502931444, 113, 60117, 6886.0, 15717.700000000004, 21431.600000000006, 60064.0, 30.962408843593757, 2028.9639482176508, 12.226567443766724], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -80", 662, 0, 0.0, 1339.7356495468284, 165, 4404, 1454.0, 2045.2000000000003, 2285.9000000000005, 3433.01, 3.7007843203023243, 11.010844412626271, 1.1890215247846334], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -79", 722, 0, 0.0, 1296.1717451523562, 138, 2425, 1539.5, 1890.7, 1999.4, 2233.7799999999997, 3.9951305887560866, 32.9345703125, 1.412341087040726], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -78", 775, 0, 0.0, 1124.9019354838701, 127, 2335, 1312.0, 1651.4, 1828.5999999999995, 2143.2400000000007, 4.298677671281505, 40.828142853379035, 1.6329937637973686], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -77", 792, 0, 0.0, 1141.71590909091, 152, 3236, 1104.5, 2009.5000000000002, 2224.8999999999987, 2980.259999999999, 4.401491616603404, 12.619424152073758, 1.3883611251590817], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -80", 722, 0, 0.0, 1231.8864265927966, 133, 3384, 1531.5, 1909.4, 2015.7, 2411.039999999999, 4.015215553677092, 33.36460734514726, 1.4194414359678782], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79", 765, 0, 0.0, 1129.8771241830073, 136, 3026, 1289.0, 1696.1999999999998, 1876.3999999999999, 2186.6800000000003, 4.261411111977629, 41.148788657335196, 1.6188368384368141], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -78", 790, 0, 0.0, 1109.9936708860764, 152, 3241, 1073.0, 1896.0999999999995, 2225.7999999999997, 2914.8000000000006, 4.385575343074122, 12.132120401391171, 1.3833406599735756], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -79", 796, 0, 0.0, 1153.713567839196, 145, 3686, 1122.0, 2018.9, 2355.0499999999997, 3230.4399999999987, 4.410436555648517, 12.710241140341642, 1.3911826244867882], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77", 769, 0, 0.0, 1117.6671001300394, 143, 2898, 1285.0, 1762.0, 1936.5, 2204.2, 4.270964660405547, 40.64086555417016, 1.6224660672829667], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 729, 0, 0.0, 1222.6378600823025, 131, 3302, 1478.0, 1851.0, 1950.5, 2873.900000000006, 4.05249904107533, 31.01899274517897, 1.4326217313176457], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -79", 722, 0, 0.0, 1277.12049861496, 132, 3230, 1538.5, 1931.4, 2068.55, 2986.889999999999, 4.004037311860158, 31.843645237164342, 1.4154897528255637], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -80", 768, 0, 0.0, 1146.770833333334, 122, 2962, 1321.0, 1716.0000000000002, 1939.3999999999996, 2603.2999999999984, 4.262806458595827, 41.563598831336066, 1.6193669066345475], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -80", 799, 0, 0.0, 1118.0012515644557, 150, 3179, 1117.0, 1869.0, 2193.0, 2863.0, 4.437606913558305, 12.396597797094728, 1.3997529619915359], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -77", 719, 0, 0.0, 1204.965229485395, 124, 3183, 1444.0, 1846.0, 1992.0, 2599.9999999999955, 3.9977092403240424, 30.716572831353936, 1.413252680661429], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 2151, 0, 0.0, 8213.612273361237, 1817, 13179, 8188.0, 9699.8, 10128.4, 10820.96, 11.807457746208275, 4690.766265531253, 4.289428009364725], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -79", 660, 0, 0.0, 1342.3590909090922, 159, 3107, 1463.0, 1917.6999999999998, 2105.7, 2665.669999999999, 3.6672982569220256, 10.847549612711079, 1.1782628188743618], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -78", 652, 0, 0.0, 1343.007668711658, 154, 3174, 1421.0, 2032.7000000000005, 2253.4, 3036.2300000000005, 3.636120281966628, 10.804600535658516, 1.1682456765302935], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 659, 0, 0.0, 1394.942336874052, 154, 3750, 1489.0, 2041.0, 2310.0, 3127.1999999999994, 3.6830045269099645, 11.290700928784998, 1.1833090716341585], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -78", 797, 0, 0.0, 1117.8230865746548, 142, 3195, 1062.0, 1971.2000000000003, 2233.6999999999985, 2747.6399999999994, 4.422053674965184, 12.7304124643517, 1.3948470088024945], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -77", 796, 0, 0.0, 1106.2324120603005, 140, 3407, 1046.5, 2009.9, 2254.2, 2750.2999999999997, 4.41574579505614, 11.846622349720409, 1.3928573162139972], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -80", 790, 0, 0.0, 1045.6734177215203, 152, 2519, 1033.5, 1790.8, 1995.0499999999993, 2322.27, 4.38477207510726, 12.188523778369197, 1.3830872854098095], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 2155, 0, 0.0, 8176.703480278433, 2232, 15165, 8208.0, 9343.2, 9729.4, 10832.480000000001, 11.863212480870226, 4712.916031731341, 4.309682659066137], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 793, 0, 0.0, 1118.6103404791918, 143, 3556, 1089.0, 1942.2000000000003, 2159.5, 2530.539999999994, 4.387056799384816, 12.039894754548875, 1.383807955274703], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -80", 657, 0, 0.0, 1330.3957382039578, 152, 3916, 1422.0, 1973.0, 2151.1000000000004, 2786.9399999999955, 3.6408574025225544, 10.931961607172545, 1.1697676615526567], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 723, 0, 0.0, 1201.6901798063604, 122, 3121, 1486.0, 1879.2, 1996.1999999999998, 2468.119999999999, 4.026755927351307, 32.27838505261795, 1.4235211383800521], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -78", 722, 0, 0.0, 1186.5346260387814, 140, 3158, 1463.0, 1869.4, 2011.1000000000001, 2451.93, 4.011891201066875, 31.62467137707332, 1.4182662253771567], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -77", 655, 0, 0.0, 1278.1419847328264, 149, 3150, 1368.0, 1910.0, 2017.7999999999993, 2720.9999999999955, 3.6521991257025603, 10.581570673886498, 1.1734116331602953], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 3152, 0, 0.0, 5658.083121827425, 424, 8298, 5363.0, 6895.700000000001, 7140.049999999999, 8177.469999999999, 17.189758132686173, 1005.6679982548468, 6.110421836228287], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -79", 653, 0, 0.0, 1306.4747320061254, 154, 2660, 1428.0, 1883.8000000000002, 1963.0, 2426.0400000000027, 3.6294110127335077, 10.877448020011782, 1.1660900617083243], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80", 768, 0, 0.0, 1165.833333333332, 142, 2902, 1333.0, 1739.2, 2019.549999999999, 2594.9199999999983, 4.2660741563671705, 42.13006982537147, 1.6206082488543256], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -78", 658, 0, 0.0, 1312.735562310031, 146, 3061, 1392.5, 1949.3000000000002, 2072.6499999999996, 2477.889999999999, 3.6639827158019003, 10.941593616707316, 1.1771975717761962], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -80", 795, 0, 0.0, 1081.123270440252, 146, 3691, 1054.0, 1818.9999999999995, 2115.7999999999997, 2729.24, 4.405530464658779, 12.065535079729017, 1.3896350977390484], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -77", 723, 0, 0.0, 1169.5020746887953, 118, 2974, 1449.0, 1840.0, 1950.9999999999998, 2413.959999999999, 4.005118574776062, 32.99563407279843, 1.4158719961610688], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77", 773, 0, 0.0, 1162.7736093143606, 130, 2862, 1339.0, 1783.8000000000002, 1920.3, 2776.26, 4.278424123006077, 40.90851737798466, 1.6252997889153946], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -78", 723, 0, 0.0, 1245.1784232365146, 118, 3473, 1515.0, 1922.6, 2026.8, 3033.1599999999994, 4.026800781967952, 31.35563150769715, 1.4235369951878896], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 767, 0, 0.0, 1211.5749674054766, 126, 3324, 1336.0, 1826.4, 2142.9999999999973, 2853.239999999987, 4.270268464596302, 41.191332741671026, 1.6222015944608994], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -79", 724, 0, 0.0, 1171.03867403315, 134, 2968, 1452.0, 1889.0, 2010.0, 2440.5, 4.024726496486703, 32.43983539410633, 1.422803702859557], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79", 769, 0, 0.0, 1181.0494148244477, 125, 3237, 1305.0, 1785.0, 2105.0, 2852.1999999999985, 4.273599270876172, 41.34931542177479, 1.6234669105183892], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 1000, 0, 0.0, 18793.253, 10798, 24878, 18354.0, 22565.4, 23079.649999999998, 24311.25, 5.165849601454703, 3757.8932567582224, 1.7808055755014747], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 300, 300, 100.0, 60066.98333333338, 60055, 60117, 60066.0, 60071.0, 60079.95, 60108.95, 1.5783824736410126, 0.5934348167497948, 0.6812939974114527], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 768, 0, 0.0, 1123.5455729166677, 117, 2634, 1264.5, 1772.3000000000002, 1982.8499999999997, 2321.6799999999985, 4.273480493898605, 40.71026072647778, 1.6234217891860911], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 769, 0, 0.0, 1119.0208062418706, 113, 2650, 1303.0, 1671.0, 1860.0, 2342.2999999999984, 4.281665673735962, 42.46157671364064, 1.6265311983235247], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -77", 724, 0, 0.0, 1176.3591160221013, 132, 3281, 1467.0, 1880.5, 1979.75, 2369.5, 4.003184854248683, 32.77520664748474, 1.4151883957402576], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -78", 718, 0, 0.0, 1196.8342618384422, 135, 2867, 1468.0, 1896.3000000000002, 2005.05, 2465.819999999999, 3.995392500013912, 30.213014709360237, 1.4124336767627306], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 723, 0, 0.0, 1188.312586445366, 141, 3005, 1496.0, 1859.6, 1964.0, 2350.92, 4.015194428709473, 32.333164037769485, 1.4194339679617474], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -77", 768, 0, 0.0, 1138.2578124999998, 144, 2623, 1313.0, 1719.1, 1942.4999999999995, 2261.159999999998, 4.259165802447912, 40.917268485847146, 1.6179838839377318], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78", 773, 0, 0.0, 1119.7451487710243, 129, 3040, 1307.0, 1723.8000000000002, 1951.3, 2673.2599999999993, 4.278755673641093, 41.367043712982955, 1.6254257393031109], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 2272, 0, 0.0, 8023.185299295786, 1709, 10854, 7954.0, 9272.0, 9645.05, 10181.7, 12.107711738405214, 3365.009772234331, 4.918757893727118], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -77", 795, 0, 0.0, 1112.3698113207552, 150, 3329, 1064.0, 1921.1999999999998, 2246.7999999999993, 2871.919999999999, 4.4135771626528095, 11.999613508391349, 1.3921732651727123], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -79", 770, 0, 0.0, 1128.511688311688, 116, 2817, 1291.0, 1720.0, 1991.299999999999, 2360.9299999999994, 4.268576623722199, 39.51584137387187, 1.6215588931913432], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 721, 0, 0.0, 1291.1955617198337, 122, 3085, 1520.0, 1879.8000000000002, 1998.8999999999996, 2517.8399999999992, 4.004977058869275, 33.727664033597925, 1.4158219680768334], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -78", 765, 0, 0.0, 1119.9464052287583, 131, 2407, 1274.0, 1698.3999999999999, 1842.7999999999997, 2280.36, 4.249976389020061, 41.72632526173466, 1.6144929837195348], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -79", 789, 0, 0.0, 1105.6324461343488, 157, 2704, 1082.0, 1913.0, 2074.0, 2544.7000000000003, 4.373735413952715, 12.097384169114997, 1.379605994830788], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -77", 768, 0, 0.0, 1155.6940104166665, 139, 2653, 1322.0, 1750.2, 1902.7499999999998, 2190.089999999998, 4.269441803839163, 42.048593521552895, 1.621887560247494], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -78", 794, 0, 0.0, 1122.8047858942064, 161, 3113, 1085.0, 1933.0, 2148.75, 2653.2499999999964, 4.413342300829864, 12.510437134190063, 1.392099182781295], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 769, 0, 0.0, 1165.2834850455133, 127, 2665, 1319.0, 1739.0, 1944.5, 2385.4999999999964, 4.302218243866961, 42.37993326736412, 1.6343387664689921], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 2627, 0, 0.0, 6917.181575942137, 1014, 8226, 6963.0, 7480.200000000001, 7634.2, 7876.879999999999, 14.063771467728811, 1172.5806802737136, 5.273914300398304], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78", 767, 0, 0.0, 1177.664928292047, 147, 2788, 1335.0, 1819.6000000000001, 2068.0, 2607.24, 4.263479710950528, 42.50082511117287, 1.6196226636325737], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -79", 773, 0, 0.0, 1086.2406209573078, 127, 2970, 1281.0, 1678.6, 1883.0999999999997, 2189.0999999999995, 4.29048766137895, 41.59502230755248, 1.6298825198011835], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -80", 726, 0, 0.0, 1179.0068870523419, 130, 3440, 1471.0, 1938.3000000000002, 2069.95, 2474.0600000000004, 4.031183368869936, 31.924678149084375, 1.425086308135661], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -77", 657, 0, 0.0, 1310.5022831050228, 152, 2722, 1472.0, 1941.4000000000005, 2091.4, 2428.419999999998, 3.6607381652848354, 10.919672097179504, 1.1761551331823348], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -77", 789, 0, 0.0, 1113.737642585552, 140, 3980, 1106.0, 1858.0, 2233.0, 3048.2000000000025, 4.373662679187131, 12.331387361209659, 1.3795830521264094], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -79", 660, 0, 0.0, 1327.6818181818192, 157, 3154, 1491.0, 1939.0, 2042.7999999999997, 2478.499999999999, 3.680119548125927, 10.946591393817398, 1.1823821595053026], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 3343, 0, 0.0, 5337.578522285376, 2117, 12621, 5010.0, 8043.599999999999, 8831.999999999998, 10207.68, 17.937917527432727, 331.23795835792663, 21.564039527607115], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -80", 774, 0, 0.0, 1147.885012919895, 137, 2807, 1289.0, 1829.0, 2088.0, 2362.5, 4.310896989612632, 43.561143707009386, 1.63763567281183], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -78", 658, 0, 0.0, 1298.9072948328271, 143, 3655, 1358.5, 1934.1, 2178.1499999999996, 2784.989999999999, 3.6610878661087867, 10.551784762947342, 1.1762674882322175], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -80", 721, 0, 0.0, 1226.438280166435, 142, 2358, 1524.0, 1873.0, 1972.6, 2145.9399999999996, 3.9884274753420037, 31.81875974979671, 1.4099714317127006], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -79", 794, 0, 0.0, 1084.0075566750634, 144, 3350, 1090.0, 1813.0, 2214.0, 2790.05, 4.413072476656291, 12.362905649038462, 1.3920140722265453], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 3350, 0, 0.0, 5291.968955223897, 556, 6859, 5225.0, 6091.9, 6288.45, 6711.4299999999985, 18.375798798716435, 1274.1929626004498, 10.228716128191767], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 791, 0, 0.0, 1174.869785082173, 150, 3544, 1136.0, 2084.6000000000004, 2245.3999999999996, 3255.9600000000005, 4.372871611162709, 12.24493561796526, 1.3793335257866746], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -80", 656, 0, 0.0, 1326.84756097561, 142, 3165, 1429.0, 1946.3000000000002, 2111.0999999999995, 2684.059999999993, 3.6421984220841592, 10.554407247475169, 1.170198516470399], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 800, 0, 0.0, 22451.389999999974, 14198, 30968, 22217.5, 26541.0, 27709.249999999996, 30457.45, 4.302000430200043, 6060.619555280705, 2.4618869649386963], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 653, 0, 0.0, 1337.5604900459407, 170, 3320, 1461.0, 2006.0, 2174.7999999999997, 2742.040000000001, 3.636930720090004, 11.006818331342211, 1.1685060614351674], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -78", 658, 0, 0.0, 1282.1793313069907, 161, 2445, 1424.0, 1923.0, 2006.2999999999997, 2229.5599999999995, 3.651214667007003, 10.629766902127471, 1.1730953373489297], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -80", 796, 0, 0.0, 1135.3718592964824, 142, 3043, 1087.0, 2041.1000000000013, 2312.95, 2841.3899999999994, 4.401583685386299, 12.36349163505563, 1.3883901663864988], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -77", 661, 0, 0.0, 1409.118003025718, 160, 4557, 1493.0, 2034.4, 2381.5, 3583.12, 3.6718142428619043, 11.014601893192422, 1.1797137557632484], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -77", 725, 0, 0.0, 1175.096551724138, 124, 3152, 1448.0, 1861.0, 1958.9999999999986, 2229.66, 4.022146772296563, 32.973146405795774, 1.421891730050152], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -78", 721, 0, 0.0, 1218.37309292649, 130, 3059, 1478.0, 1993.2000000000003, 2203.999999999999, 2932.2999999999993, 3.9963417675913866, 33.36387092779148, 1.412769257683674], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -80", 724, 0, 0.0, 1209.867403314917, 126, 3036, 1474.5, 1854.0, 1951.75, 2800.75, 4.032729723557491, 30.068802750291034, 1.4256329686795037], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -79", 723, 0, 0.0, 1273.4453665283552, 144, 2903, 1514.0, 1912.6, 2069.0, 2725.3999999999996, 4.029785858405698, 32.07537041597924, 1.4245922663504522], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -80", 657, 0, 0.0, 1345.992389649925, 157, 3046, 1473.0, 1939.2, 2039.7000000000003, 2538.3799999999983, 3.6533082736033187, 10.771261136821122, 1.1737679902495037], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 653, 0, 0.0, 1325.4961715160814, 174, 3588, 1432.0, 1973.0, 2403.3, 2684.0, 3.6416768444005734, 10.547444665542933, 1.1700309392654187], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -79", 659, 0, 0.0, 1327.2534142640377, 159, 3504, 1394.0, 1940.0, 2153.0, 3142.3999999999996, 3.6730894639741827, 10.649371796845823, 1.1801234703588925], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -80", 787, 0, 0.0, 1079.9822109275724, 148, 2630, 1090.0, 1806.6000000000006, 2060.999999999999, 2422.8, 4.37219793223371, 12.411893935658691, 1.3791210274526253], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -79", 795, 0, 0.0, 1080.8528301886788, 150, 2938, 1024.0, 1861.4, 2059.3999999999996, 2539.5199999999995, 4.41806572081159, 12.187914410743957, 1.393589089670062], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 660, 0, 0.0, 1335.4727272727278, 160, 3236, 1460.5, 1922.9, 2204.349999999999, 2568.2599999999993, 3.679955394480067, 10.732201352104823, 1.1823294187343185], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -78", 794, 0, 0.0, 1059.8211586901773, 139, 2934, 1043.5, 1751.0, 2074.25, 2662.199999999999, 4.417811458489821, 12.508413367913558, 1.3935088877853634], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -77", 794, 0, 0.0, 1115.9924433249378, 142, 3541, 1085.5, 1883.0, 2178.75, 3166.999999999999, 4.399598827512453, 12.544637971613167, 1.3877640832876197], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80", 768, 0, 0.0, 1121.5585937500011, 123, 2831, 1284.5, 1709.7000000000003, 1953.2499999999993, 2421.169999999994, 4.252632977839795, 40.95037807526828, 1.6155021761520316], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -77", 654, 0, 0.0, 1402.0932721712538, 166, 4100, 1480.5, 2002.5, 2310.0, 3153.1000000000045, 3.6222051142877714, 11.00887576985705, 1.1637748853522234], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 300, 100.0, 0.3750046875585945], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 79999, 300, "504/Gateway Time-out", 300, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 300, 300, "504/Gateway Time-out", 300, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
