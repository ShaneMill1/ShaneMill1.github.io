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

    var data = {"OkPercent": 99.75391604751313, "KoPercent": 0.24608395248686762};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9320650545012856, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -77"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79"], "isController": false}, {"data": [0.5714285714285714, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77"], "isController": false}, {"data": [0.32495590828924165, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -79"], "isController": false}, {"data": [0.4, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -78"], "isController": false}, {"data": [0.330470737913486, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -77"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -78"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -80"], "isController": false}, {"data": [0.07152496626180836, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.3889541715628672, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -80"], "isController": false}, {"data": [0.29086115992970124, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -77"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -78"], "isController": false}, {"data": [0.020856820744081173, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -77"], "isController": false}, {"data": [0.5789473684210527, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77"], "isController": false}, {"data": [0.6091644204851752, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78"], "isController": false}, {"data": [1.0, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -79"], "isController": false}, {"data": [0.5416666666666666, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_CityLevel1234_Summaries_24hourly_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.6008742434431742, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80"], "isController": false}, {"data": [0.6014784946236559, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -77"], "isController": false}, {"data": [0.08333333333333333, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -78"], "isController": false}, {"data": [0.3264499121265378, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -79"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.34527972027972026, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -80"], "isController": false}, {"data": [0.6056979096426163, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77"], "isController": false}, {"data": [6.105006105006105E-4, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.5526315789473685, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78"], "isController": false}, {"data": [1.0, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -77"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -79"], "isController": false}, {"data": [0.01589825119236884, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP "], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -79"], "isController": false}, {"data": [0.9998280080853931, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.3901292596944771, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST"], "isController": false}, {"data": [0.31317632081476765, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -79"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -78"], "isController": false}, {"data": [0.3928361714621257, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -80"], "isController": false}, {"data": [0.5, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -80"], "isController": false}, {"data": [0.16666666666666666, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -80"], "isController": false}, {"data": [0.3244274809160305, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -79"], "isController": false}, {"data": [0.315404201145767, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -78"], "isController": false}, {"data": [0.39571092831962396, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -77"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -77"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 316965, 780, 0.24608395248686762, 410.35797327780455, 18, 60401, 29.0, 35.0, 39.0, 34998.840000000026, 115.344096332053, 694.5092517169336, 53.774605013155046], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_1Point_maxt_SOAP 34 -77", 1, 0, 0.0, 1601.0, 1601, 1601, 1601.0, 1601.0, 1601.0, 1601.0, 0.6246096189881324, 0.30193531386633354, 0.20068023891317927], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79", 11, 0, 0.0, 1004.7272727272729, 254, 1518, 1001.0, 1471.2000000000003, 1518.0, 1518.0, 0.09291560728796236, 0.917071434680328, 0.035841469608149545], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77", 14, 0, 0.0, 827.4285714285714, 469, 1040, 870.0, 1036.0, 1040.0, 1040.0, 0.08459163388740853, 0.7874173532184096, 0.03263056189992809], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 1134, 64, 5.64373897707231, 1891.7724867724855, 22, 43152, 1376.0, 1929.0, 2082.75, 37179.70000000001, 6.279556554771688, 52.03730623844041, 2.2567156368710752], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -79", 7, 0, 0.0, 2206.5714285714284, 1653, 3290, 1882.0, 3290.0, 3290.0, 3290.0, 0.0538374570261727, 0.4986273851916229, 0.019347836118780815], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -77", 5, 0, 0.0, 1112.6, 372, 1933, 760.0, 1933.0, 1933.0, 1933.0, 0.031255078950329425, 0.12505083833935515, 0.01123229399777464], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 630, 0, 0.0, 14085.384126984125, 6370, 21485, 14156.0, 16072.499999999996, 17901.75, 20192.289999999975, 3.4468986119394, 1386.3769453775997, 1.2723903079229426], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -78", 3, 0, 0.0, 1344.6666666666667, 230, 2305, 1499.0, 2305.0, 2305.0, 2305.0, 0.17260226684310456, 0.23951935662505033, 0.05646656190667971], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 1572, 68, 4.325699745547074, 1606.1125954198465, 21, 39556, 1288.5, 2116.2000000000003, 2414.0499999999997, 8492.119999999997, 7.5691187658291845, 21.602548438508133, 2.476225377492946], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -78", 1, 0, 0.0, 528.0, 528, 528, 528.0, 528.0, 528.0, 528.0, 1.893939393939394, 0.91552734375, 0.6085020123106061], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -80", 1, 0, 0.0, 957.0, 957, 957, 957.0, 957.0, 957.0, 957.0, 1.0449320794148382, 3.276637604493208, 0.3357252481713689], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 741, 33, 4.4534412955465585, 13010.732793522286, 21, 60057, 14077.0, 14824.6, 15203.0, 52183.160000000025, 3.1286416375335664, 1114.2648920874606, 1.154908729480164], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 1702, 0, 0.0, 1330.2949471210347, 290, 11615, 1078.0, 1946.8000000000002, 2841.049999999999, 5981.88, 9.407680912688761, 28.429835445040794, 3.0225849807369167], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -80", 1, 0, 0.0, 1957.0, 1957, 1957, 1957.0, 1957.0, 1957.0, 1957.0, 0.510986203372509, 1.6532200114971896, 0.16716833801737352], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 1138, 71, 6.239015817223199, 1966.859402460458, 21, 43958, 1474.5, 1979.3000000000004, 2185.5499999999993, 29206.199999999848, 6.293795247023168, 54.30360026657376, 2.261832666898951], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -78", 6, 0, 0.0, 8436.5, 1179, 42078, 1765.5, 42078.0, 42078.0, 42078.0, 0.03759516275572543, 0.34845282198690436, 0.013510761615338826], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 887, 16, 1.8038331454340473, 10262.101465614447, 27, 43405, 10224.0, 10988.0, 11248.8, 41327.08000000001, 4.742453243795246, 279.20585712357115, 1.7135817384807042], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80", 11, 0, 0.0, 680.3636363636364, 144, 1585, 675.0, 1518.8000000000002, 1585.0, 1585.0, 0.09348812700787, 0.5717101076600771, 0.0360623146172936], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -77", 1, 0, 0.0, 2297.0, 2297, 2297, 2297.0, 2297.0, 2297.0, 2297.0, 0.4353504571179799, 4.055051425772747, 0.15645407052677404], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77", 19, 0, 0.0, 827.4736842105264, 271, 1083, 888.0, 1080.0, 1083.0, 1083.0, 0.1120791868949936, 1.0911706118048878, 0.043233670726096164], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 2968, 0, 0.0, 730.4528301886787, 112, 3110, 766.0, 1019.0, 1165.0, 1598.1699999999996, 16.30348206781765, 171.6441991542706, 6.288940836707004], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -79", 1, 0, 0.0, 339.0, 339, 339, 339.0, 339.0, 339.0, 339.0, 2.949852507374631, 1.4259540929203538, 1.060103244837758], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79", 12, 0, 0.0, 960.5, 469, 1296, 992.0, 1255.2, 1296.0, 1296.0, 0.09637160892401099, 0.8770537944313271, 0.03717459523924252], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 250, 0, 0.0, 38311.748, 31051, 41613, 39722.5, 40845.4, 41138.95, 41455.28, 1.2702671117682627, 899.6319480435346, 0.44533778625469367], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 174, 150, 86.20689655172414, 55578.390804597686, 25223, 60401, 60043.0, 60051.5, 60061.25, 60260.75, 0.8079457283352138, 0.31573983625168905, 0.3534762561466561], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 2974, 0, 0.0, 743.1882985877602, 101, 2402, 791.0, 1031.0, 1139.25, 1415.0, 16.361875839000025, 171.79317923069198, 6.311465777739266], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 2976, 0, 0.0, 738.2063172042997, 99, 3091, 761.0, 1015.3000000000002, 1130.0, 1583.8300000000004, 16.328411765674122, 171.46576416493838, 6.298557272891874], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -77", 1, 0, 0.0, 1649.0, 1649, 1649, 1649.0, 1649.0, 1649.0, 1649.0, 0.6064281382656156, 5.620120148574894, 0.21793511218920558], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -78", 6, 0, 0.0, 2077.5, 1119, 2878, 1952.5, 2878.0, 2878.0, 2878.0, 0.04610206998294223, 0.42594891026232085, 0.01656793140011987], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 1138, 82, 7.205623901581722, 1875.6836555360276, 23, 43799, 1356.0, 2007.0, 2124.2, 39820.91999999996, 6.298463020052137, 51.47494940094034, 2.2635101478312367], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78", 12, 0, 0.0, 893.4166666666667, 163, 1157, 992.5, 1151.3, 1157.0, 1157.0, 0.0960783999743791, 0.8731343526317475, 0.037061492177616936], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 849, 0, 0.0, 10917.003533568888, 2218, 12659, 11110.0, 11744.0, 11976.5, 12341.0, 4.454588383440894, 1224.6028881532347, 1.835777634582087], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 1144, 73, 6.381118881118881, 1926.3050699300682, 22, 43841, 1363.0, 2013.0, 2119.5, 32370.649999999736, 6.30640066592063, 53.519902639082595, 2.2663627393152264], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 2966, 0, 0.0, 730.9120026972365, 111, 2649, 774.0, 1009.3000000000002, 1124.3000000000002, 1397.6499999999996, 16.30521426019076, 171.37494287883786, 6.289609016382178], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 819, 0, 0.0, 11052.150183150183, 1361, 21680, 10612.0, 13624.0, 13721.0, 19039.39999999997, 4.403983481028995, 395.3187416232228, 1.6772983960950272], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78", 19, 0, 0.0, 835.6842105263158, 244, 982, 910.0, 971.0, 982.0, 982.0, 0.1121572562793306, 1.152972674581624, 0.043263785381187095], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -80", 1, 0, 0.0, 363.0, 363, 363, 363.0, 363.0, 363.0, 363.0, 2.7548209366391188, 1.3316761363636365, 0.9900137741046833], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -77", 1, 0, 0.0, 1536.0, 1536, 1536, 1536.0, 1536.0, 1536.0, 1536.0, 0.6510416666666666, 2.1375020345052085, 0.21298726399739584], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -79", 3, 0, 0.0, 1183.3333333333333, 532, 1624, 1394.0, 1624.0, 1624.0, 1624.0, 0.022156082213835734, 0.03103438208533046, 0.007248327677377902], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 629, 17, 2.7027027027027026, 14597.85373608904, 25, 44106, 14719.0, 25015.0, 31112.5, 34811.1, 3.101195611980772, 54.5829128405029, 3.746268527363491], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -79", 1, 0, 0.0, 968.0, 968, 968, 968.0, 968.0, 968.0, 968.0, 1.0330578512396695, 3.2394030862603307, 0.33191018853305787], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 281990, 0, 0.0, 30.98540019149562, 18, 7203, 29.0, 34.0, 37.0, 48.0, 1566.3848555208692, 1182.4370051929998, 748.0099554196338], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 1702, 0, 0.0, 1284.1122209165696, 259, 9583, 1073.0, 1892.0, 2374.8999999999987, 6208.7300000000005, 9.399783506748847, 27.849333106208714, 3.0200476305862987], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 300, 0, 0.0, 35052.33666666667, 25312, 38577, 35644.0, 37531.5, 37912.75, 38540.66, 1.3874821361674967, 1980.270329214824, 0.8021381099718341], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 1571, 65, 4.137492043284532, 1589.1260343730128, 22, 39754, 1362.0, 2150.3999999999996, 2498.5999999999976, 6615.679999999995, 7.559462801764997, 21.88062670370611, 2.473066443936791], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -78", 2, 0, 0.0, 1283.5, 1253, 1314, 1283.5, 1314.0, 1314.0, 1314.0, 0.22024006166721727, 0.7125540276401278, 0.07205119204933377], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -80", 1703, 0, 0.0, 1294.7539635936598, 205, 7792, 1067.0, 1928.6000000000008, 2775.7999999999965, 5042.400000000008, 9.382816718273077, 27.68311114512512, 3.0145963870232833], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -80", 1, 0, 0.0, 1332.0, 1332, 1332, 1332.0, 1332.0, 1332.0, 1332.0, 0.7507507507507507, 6.963506475225225, 0.269801051051051], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -80", 3, 0, 0.0, 1880.6666666666667, 1410, 2488, 1744.0, 2488.0, 2488.0, 2488.0, 0.022136463921253218, 0.07161924313585148, 0.007241909583613114], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 1572, 66, 4.198473282442748, 1594.1335877862587, 21, 39525, 1317.5, 2062.4, 2347.35, 3531.2599999999993, 7.556784040379762, 21.793870553419058, 2.472190091335176], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -79", 2, 0, 0.0, 1818.0, 1558, 2078, 1818.0, 2078.0, 2078.0, 2078.0, 0.20189783969311528, 0.653210491116495, 0.06605056279022814], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 1571, 75, 4.774029280712922, 1564.469764481222, 22, 39866, 1320.0, 2155.8, 2408.7999999999997, 5502.999999999993, 7.566708409594451, 21.89261500126433, 2.4754368332169348], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -77", 1702, 0, 0.0, 1248.7485311398345, 226, 6768, 1077.5, 1820.4, 2102.499999999999, 5357.230000000001, 9.404406036059433, 27.994928365307576, 3.021532798694876], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80", 14, 0, 0.0, 911.4285714285714, 217, 1084, 950.5, 1066.5, 1084.0, 1084.0, 0.08459725663182066, 0.8519857223246117, 0.032632730829657376], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -77", 3, 0, 0.0, 1343.0, 787, 2224, 1018.0, 2224.0, 2224.0, 2224.0, 0.18640487138063874, 0.6030852918789611, 0.06098206241456443], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503/Service Unavailable", 256, 32.82051282051282, 0.08076601517517706], "isController": false}, {"data": ["502/Bad Gateway", 173, 22.17948717948718, 0.05458015869260013], "isController": false}, {"data": ["504/Gateway Time-out", 155, 19.871794871794872, 0.04890129825059549], "isController": false}, {"data": ["502/Proxy Error", 196, 25.128205128205128, 0.06183648036849494], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 316965, 780, "503/Service Unavailable", 256, "502/Proxy Error", 196, "502/Bad Gateway", 173, "504/Gateway Time-out", 155, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 1134, 64, "503/Service Unavailable", 22, "502/Bad Gateway", 22, "502/Proxy Error", 20, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 1572, 68, "503/Service Unavailable", 31, "502/Proxy Error", 19, "502/Bad Gateway", 18, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 741, 33, "503/Service Unavailable", 13, "502/Proxy Error", 11, "504/Gateway Time-out", 5, "502/Bad Gateway", 4, "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 1138, 71, "503/Service Unavailable", 28, "502/Bad Gateway", 26, "502/Proxy Error", 17, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 887, 16, "503/Service Unavailable", 8, "502/Bad Gateway", 4, "502/Proxy Error", 4, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 174, 150, "504/Gateway Time-out", 150, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 1138, 82, "503/Service Unavailable", 34, "502/Proxy Error", 29, "502/Bad Gateway", 19, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 1144, 73, "502/Proxy Error", 28, "503/Service Unavailable", 24, "502/Bad Gateway", 21, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 629, 17, "502/Bad Gateway", 7, "502/Proxy Error", 6, "503/Service Unavailable", 4, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 1571, 65, "503/Service Unavailable", 29, "502/Proxy Error", 20, "502/Bad Gateway", 16, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 1572, 66, "503/Service Unavailable", 25, "502/Proxy Error", 23, "502/Bad Gateway", 18, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 1571, 75, "503/Service Unavailable", 38, "502/Proxy Error", 19, "502/Bad Gateway", 18, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
