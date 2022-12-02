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

    var data = {"OkPercent": 99.51649035469819, "KoPercent": 0.4835096453018046};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.3364747977598009, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.4885780885780886, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -80"], "isController": false}, {"data": [0.4307471264367816, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -79"], "isController": false}, {"data": [0.47173659673659674, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -78"], "isController": false}, {"data": [0.06461731493099122, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -77"], "isController": false}, {"data": [0.45134032634032634, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -80"], "isController": false}, {"data": [0.4619129438717068, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79"], "isController": false}, {"data": [0.06841432225063938, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -78"], "isController": false}, {"data": [0.06846733668341709, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -79"], "isController": false}, {"data": [0.479918509895227, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77"], "isController": false}, {"data": [0.46420323325635104, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -78"], "isController": false}, {"data": [0.4642857142857143, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -79"], "isController": false}, {"data": [0.45804398148148145, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -80"], "isController": false}, {"data": [0.06234413965087282, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -80"], "isController": false}, {"data": [0.490473441108545, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -77"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.4788273615635179, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -79"], "isController": false}, {"data": [0.4733578318787322, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -78"], "isController": false}, {"data": [0.4785747554727527, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -77"], "isController": false}, {"data": [0.06546134663341646, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -78"], "isController": false}, {"data": [0.07142857142857142, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -77"], "isController": false}, {"data": [0.07196969696969698, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.05834378920953576, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -79"], "isController": false}, {"data": [0.4754832626119755, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -80"], "isController": false}, {"data": [0.4851830331202789, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -77"], "isController": false}, {"data": [0.4622969837587007, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -78"], "isController": false}, {"data": [0.47426981919332406, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -77"], "isController": false}, {"data": [0.026989378373672296, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}, {"data": [0.46405228758169936, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -79"], "isController": false}, {"data": [0.46318840579710147, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80"], "isController": false}, {"data": [0.4830153559795254, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -78"], "isController": false}, {"data": [0.06590621039290241, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -80"], "isController": false}, {"data": [0.4647806004618938, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -77"], "isController": false}, {"data": [0.48257839721254353, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77"], "isController": false}, {"data": [0.4679746105020196, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -78"], "isController": false}, {"data": [0.4679930795847751, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78"], "isController": false}, {"data": [0.46084686774941996, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -79"], "isController": false}, {"data": [0.4687864644107351, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79"], "isController": false}, {"data": [4.5004500450045E-4, 500, 1500, "NDFD_CityLevel1234_Summaries_24hourly_REST"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.47058823529411764, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80"], "isController": false}, {"data": [0.4696084161309176, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79"], "isController": false}, {"data": [0.4642018779342723, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -77"], "isController": false}, {"data": [0.49624494511842865, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -78"], "isController": false}, {"data": [0.4568717653824037, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -79"], "isController": false}, {"data": [0.4668205424120023, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -77"], "isController": false}, {"data": [0.47715442452284557, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78"], "isController": false}, {"data": [1.231527093596059E-4, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.06407035175879397, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -77"], "isController": false}, {"data": [0.454043048283886, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -79"], "isController": false}, {"data": [0.4671702498547356, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -80"], "isController": false}, {"data": [0.45459837019790456, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -78"], "isController": false}, {"data": [0.06918238993710692, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -79"], "isController": false}, {"data": [0.45677233429394815, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -77"], "isController": false}, {"data": [0.07232704402515723, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -78"], "isController": false}, {"data": [0.46380618797431405, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77"], "isController": false}, {"data": [7.08215297450425E-4, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.4791304347826087, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78"], "isController": false}, {"data": [0.4645124062319677, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -79"], "isController": false}, {"data": [0.45161290322580644, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -80"], "isController": false}, {"data": [0.4849411764705882, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -77"], "isController": false}, {"data": [0.06809583858764187, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -77"], "isController": false}, {"data": [0.47295423023578365, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP "], "isController": false}, {"data": [0.45307068366164543, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -80"], "isController": false}, {"data": [0.48474341192787795, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -78"], "isController": false}, {"data": [0.476710753306498, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -80"], "isController": false}, {"data": [0.06058673469387755, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -79"], "isController": false}, {"data": [0.00916251406526282, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.06281407035175879, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -78"], "isController": false}, {"data": [0.47969890510948904, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST"], "isController": false}, {"data": [0.47391709361900325, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -79"], "isController": false}, {"data": [0.485653809971778, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -78"], "isController": false}, {"data": [0.056179775280898875, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -80"], "isController": false}, {"data": [0.4885215794306703, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -77"], "isController": false}, {"data": [0.47855917667238423, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -77"], "isController": false}, {"data": [0.47190034762456545, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -80"], "isController": false}, {"data": [0.4540162980209546, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -78"], "isController": false}, {"data": [0.46496815286624205, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -79"], "isController": false}, {"data": [0.4876283846872082, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -80"], "isController": false}, {"data": [0.47502334267040147, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -79"], "isController": false}, {"data": [0.4850606909430439, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -80"], "isController": false}, {"data": [0.06775407779171895, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -79"], "isController": false}, {"data": [0.06870229007633588, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -80"], "isController": false}, {"data": [0.49129821260583256, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -78"], "isController": false}, {"data": [0.06352201257861635, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -78"], "isController": false}, {"data": [0.061237373737373736, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -77"], "isController": false}, {"data": [0.45944380069524915, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80"], "isController": false}, {"data": [0.4763355201499531, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -77"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 160700, 777, 0.4835096453018046, 3954.0058556316076, 34, 96441, 10645.0, 21850.9, 25559.9, 90101.0, 57.879541400980244, 2610.080957719796, 22.031290674041834], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -80", 2145, 0, 0.0, 1001.99627039627, 200, 4335, 850.0, 1746.4, 2081.0999999999995, 2837.4199999999973, 11.892946844903776, 26.413952952860683, 3.844302153967919], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -79", 1740, 0, 0.0, 1362.386206896551, 132, 29961, 1064.0, 2348.9, 2935.0999999999967, 5977.989999999995, 9.582236516030973, 62.43977758816759, 3.406185636557884], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -78", 1716, 6, 0.34965034965034963, 1299.9393939393942, 38, 79107, 929.5, 2306.3, 2880.749999999999, 6353.259999999991, 8.116967584161507, 72.8720518860952, 3.0993499271554192], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -77", 797, 0, 0.0, 2744.555834378919, 334, 22579, 2156.0, 5070.800000000001, 6829.699999999995, 11151.839999999986, 4.230136404649435, 11.21677997784088, 1.3425725893662757], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -80", 1716, 0, 0.0, 1324.3100233100247, 128, 33384, 982.5, 2337.7999999999997, 2842.2999999999997, 7909.85999999999, 9.479720248815035, 62.42982396778221, 3.3697443071959694], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79", 1746, 5, 0.286368843069874, 1264.7605956471918, 45, 26596, 940.5, 2392.6, 3026.399999999998, 4943.429999999997, 9.433554494175617, 82.76794569459003, 3.602070124240885], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -78", 782, 0, 0.0, 2844.4066496163696, 271, 12901, 2173.0, 5606.4000000000015, 7117.899999999999, 10848.229999999958, 4.273200692892389, 11.305351473489216, 1.356240454287135], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -79", 796, 0, 0.0, 2735.007537688446, 443, 14172, 2122.5, 5069.600000000003, 7016.199999999999, 10216.69999999999, 4.3104381917820085, 11.483403662247925, 1.3680589964151884], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77", 1718, 4, 0.23282887077997672, 1314.2275902211882, 35, 62999, 904.5, 2474.9000000000015, 3201.899999999999, 6036.139999999973, 9.462123965940759, 84.22485014058249, 3.6129789752762083], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 1732, 0, 0.0, 1226.5392609699766, 134, 17657, 976.5, 2276.5, 2764.4499999999994, 4362.0700000000015, 9.515751535596163, 61.36356719984452, 3.382552303668948], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -79", 1708, 0, 0.0, 1244.8144028103056, 135, 22375, 986.0, 2264.2000000000003, 2768.2, 4561.220000000003, 9.347533411411872, 60.34025562056019, 3.3227560173378135], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -80", 1728, 5, 0.28935185185185186, 1274.2430555555575, 34, 26343, 972.0, 2457.7000000000025, 3029.7999999999993, 4363.13, 9.357231818920235, 86.56462689358045, 3.572927383982239], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -80", 802, 0, 0.0, 2844.776807980048, 348, 17876, 2151.0, 5404.200000000003, 7239.299999999995, 9226.080000000002, 4.330453563714903, 11.324454981101512, 1.3744115314524838], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -77", 1732, 0, 0.0, 1143.4878752886825, 128, 16948, 921.5, 2158.0, 2601.0499999999997, 3991.0700000000015, 9.606851260205893, 58.06958865814696, 3.414935408901313], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 2970, 0, 0.0, 15465.461616161656, 1688, 33588, 15380.0, 20998.6, 23022.599999999995, 26650.19, 14.560322386127984, 6094.307856522607, 5.317930246495963], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -79", 2149, 0, 0.0, 1006.8329455560721, 181, 6069, 842.0, 1771.0, 2100.5, 2914.5, 11.907664346823884, 30.95936670577707, 3.849059471483111], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -78", 2177, 0, 0.0, 1033.8750574184667, 206, 8321, 865.0, 1831.4, 2214.2, 3025.299999999997, 12.072512713015799, 31.267145501644237, 3.9023454179767865], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 2147, 0, 0.0, 1029.7545412203065, 189, 13196, 851.0, 1789.4000000000003, 2164.6, 3028.68, 11.930561575478723, 31.503021277881505, 3.8564608217611887], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -78", 802, 0, 0.0, 2808.537406483788, 455, 21768, 2184.0, 5207.200000000001, 7189.049999999999, 11632.250000000005, 4.384166707665732, 11.464918808184507, 1.3914591601478152], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -77", 791, 0, 0.0, 2733.0543615676347, 534, 25302, 2127.0, 4720.000000000002, 7175.2, 12269.080000000005, 4.311096577283627, 11.211105689312188, 1.3682679566574014], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -80", 792, 0, 0.0, 2713.979797979796, 298, 15588, 2144.5, 5270.800000000001, 6951.399999999996, 8704.0, 4.320762025302645, 11.420359306550429, 1.3713356037337494], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 2608, 0, 0.0, 17539.964340490755, 4399, 42896, 17084.5, 24385.1, 27005.249999999996, 32473.65999999991, 13.379710858702456, 5613.356675803334, 4.886730333158905], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 797, 0, 0.0, 2940.734002509408, 535, 24952, 2179.0, 6104.200000000002, 7409.8999999999905, 12502.06, 4.30678115391474, 11.516901295952058, 1.3668983154514556], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -80", 2121, 0, 0.0, 1055.435172088635, 187, 10006, 859.0, 1787.0, 2271.7, 3732.0, 11.743470774205337, 31.893940481892024, 3.7959851818964516], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 1721, 0, 0.0, 1257.1708309122578, 128, 48031, 927.0, 2245.2, 2780.2999999999993, 7137.199999999977, 9.46785276141121, 62.55713578027265, 3.3655257862828916], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -78", 1724, 0, 0.0, 1390.5139211136902, 121, 40530, 1001.0, 2480.0, 3018.25, 9982.75, 9.51077961912748, 63.2991447745879, 3.3807849427367214], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -77", 2157, 0, 0.0, 1030.496059341678, 186, 9465, 876.0, 1805.4, 2147.1, 3125.720000000001, 11.969236232881272, 27.882882816488358, 3.8689621026208023], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 5743, 138, 2.4029253003656628, 7825.76371234546, 34, 61809, 8026.0, 10780.0, 11626.8, 14862.360000000011, 24.1939900494159, 1396.234195989803, 8.647461287193574], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -79", 2142, 0, 0.0, 1049.0112044817938, 193, 6595, 898.5, 1817.0, 2118.85, 3170.1100000000038, 11.757344223422475, 33.99226966281342, 3.8004696659695694], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80", 1725, 4, 0.2318840579710145, 1323.0637681159392, 39, 49856, 928.0, 2440.2000000000003, 3162.5999999999985, 6841.620000000002, 9.258811973656668, 81.7750287325089, 3.5353471500974187], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -78", 2149, 0, 0.0, 1037.8785481619345, 185, 8289, 879.0, 1781.0, 2194.0, 3570.0, 11.912813064736078, 34.37437853046664, 3.8507237543238686], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -80", 789, 0, 0.0, 2707.897338403043, 337, 16299, 2107.0, 5260.0, 6891.0, 10710.700000000008, 4.304794744767683, 11.55512287283669, 1.3662678633295868], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -77", 1732, 0, 0.0, 1223.2459584295634, 136, 29038, 971.5, 2231.0, 2722.0, 3692.2900000000063, 9.494312731259422, 61.666834401123744, 3.3749314786898723], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77", 1722, 5, 0.29036004645760743, 1206.817073170732, 35, 19129, 909.0, 2329.9000000000005, 2872.8999999999987, 4927.579999999988, 9.269826231131972, 85.48727947489826, 3.5395527894263688], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -78", 1733, 0, 0.0, 1268.4645124062292, 131, 24030, 964.0, 2365.2000000000007, 3091.699999999999, 6213.140000000023, 9.506308283049918, 59.47816849801151, 3.3791955224904004], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 1734, 8, 0.461361014994233, 1219.4002306805062, 36, 30897, 937.0, 2230.5, 2817.75, 4283.4000000000015, 9.314017757867767, 82.52625337559287, 3.556426702467087], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -79", 1724, 0, 0.0, 1259.0626450115988, 145, 28982, 974.5, 2332.0, 2754.0, 4274.5, 9.500611698317002, 62.336678099271474, 3.3771705646361223], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79", 1714, 6, 0.3500583430571762, 1325.175612602099, 38, 40605, 914.5, 2418.5, 3088.0, 8794.99999999996, 9.001438969823647, 79.57539127736143, 3.437072887891647], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 2222, 0, 0.0, 21498.722772277237, 1378, 30641, 21413.5, 25138.7, 26418.1, 28359.16, 11.050438138433842, 106.57131304456479, 3.830962440570326], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 500, 500, 100.0, 90105.30800000006, 90074, 90365, 90099.0, 90119.9, 90140.85, 90324.98, 2.6293647454774924, 0.7497797907025663, 1.1400761201093816], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 1717, 7, 0.40768782760629, 1209.5812463599311, 38, 28512, 914.0, 2291.4000000000005, 2727.3999999999987, 4070.739999999996, 9.185747913545901, 84.1068632720549, 3.507448666207469], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 1711, 8, 0.46756282875511396, 1292.0251315020478, 37, 76180, 895.0, 2380.8, 2999.5999999999995, 6137.399999999875, 8.558252135811609, 77.29625734341549, 3.2678482276390026], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -77", 1704, 0, 0.0, 1291.5375586854464, 117, 37026, 954.5, 2364.0, 2923.5, 6288.100000000011, 9.40765973422257, 61.11212304145112, 3.3441290461494297], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -78", 1731, 0, 0.0, 1202.3575967648753, 123, 37614, 897.0, 2183.8, 2673.399999999999, 4422.840000000002, 9.533513245580217, 57.38832969894531, 3.388866036514843], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 1739, 0, 0.0, 1288.3283496262231, 124, 46838, 977.0, 2361.0, 2831.0, 6240.79999999999, 9.569772944892636, 63.794695799260396, 3.4017552265048043], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -77", 1733, 9, 0.51933064050779, 1277.5574148874782, 35, 36865, 933.0, 2314.8, 3045.2999999999993, 6526.780000000019, 9.564439931122788, 90.1156204037016, 3.6520468877627046], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78", 1729, 7, 0.4048582995951417, 1248.7941006362078, 37, 39594, 918.0, 2166.0, 2614.0, 6401.000000000002, 9.57417354227809, 86.69910410840855, 3.65576353030345], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 4060, 0, 0.0, 11176.461576354677, 752, 21370, 11155.5, 14773.5, 15803.849999999999, 17644.95, 21.516659512112394, 3801.135380769684, 8.783167652405256], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -77", 796, 0, 0.0, 2660.378140703519, 412, 15144, 2156.0, 4843.6, 5969.399999999999, 11194.749999999996, 4.336834764416162, 11.58171286585233, 1.3764368148781763], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -79", 1719, 8, 0.4653868528214078, 1468.5270506108204, 37, 96441, 949.0, 2406.0, 3048.0, 8572.19999999994, 8.756380084965922, 79.05456847034598, 3.3435005988492925], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 1721, 0, 0.0, 1271.7263219058682, 135, 21223, 944.0, 2350.7999999999997, 3032.9999999999986, 6052.339999999996, 9.467175690097147, 59.157497732567414, 3.3652851085892204], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -78", 1718, 10, 0.5820721769499418, 1325.9557625145494, 37, 51544, 936.0, 2396.2000000000016, 2926.6999999999994, 7899.449999999975, 9.17970419765752, 83.13257530977495, 3.5051409582852444], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -79", 795, 0, 0.0, 2767.2955974842776, 328, 25594, 2152.0, 5057.4, 6830.999999999997, 11578.67999999999, 4.346922706793229, 11.564935319020384, 1.3796385544021477], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -77", 1735, 9, 0.5187319884726225, 1329.186167146975, 39, 41656, 960.0, 2589.400000000001, 3168.5999999999976, 6407.239999999915, 9.63300205430015, 89.07566469796235, 3.6782263703431233], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -78", 795, 0, 0.0, 2655.0616352201237, 402, 20623, 2096.0, 4557.399999999998, 6757.7999999999965, 9182.16, 4.369572386501044, 11.738126666071233, 1.3868271734500386], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 1713, 8, 0.46701692936368944, 1212.002918855807, 39, 23866, 936.0, 2278.4000000000015, 2889.0999999999995, 4344.879999999994, 9.32249971428416, 84.4259590358315, 3.559665418247174], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 3530, 0, 0.0, 12674.74759206796, 444, 47613, 10629.0, 15158.1, 39452.8, 45470.64, 17.702576652658394, 2278.611543667505, 6.673041589771621], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78", 1725, 6, 0.34782608695652173, 1192.2823188405816, 40, 16553, 926.0, 2199.0000000000005, 2757.199999999999, 4869.100000000002, 9.18056169071353, 85.04790960107134, 3.5054683799501856], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -79", 1733, 5, 0.28851702250432776, 1331.2163877668781, 39, 33787, 951.0, 2376.8, 2895.8999999999996, 7276.7800000000025, 9.473620913031834, 83.08739853474572, 3.6173689228471155], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -80", 1736, 0, 0.0, 1352.9205069124416, 136, 22607, 997.5, 2549.9999999999995, 3182.45, 6474.869999999983, 9.526945450554274, 58.45689619690484, 3.386531390626715], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -77", 2125, 0, 0.0, 1014.3472941176467, 155, 6000, 850.0, 1811.8000000000002, 2139.499999999999, 2994.1399999999976, 11.777942822937336, 31.07118203260966, 3.8071280023361895], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -77", 793, 0, 0.0, 2716.142496847415, 415, 15370, 2148.0, 5059.4, 6913.099999999997, 9001.119999999944, 4.317102913636165, 11.468346632605288, 1.370174264581791], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -79", 2163, 0, 0.0, 1045.4345815996287, 186, 5578, 888.0, 1818.2000000000003, 2191.5999999999995, 3166.7200000000034, 12.023479971984123, 26.061176420110286, 3.8864959675065873], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 3812, 0, 0.0, 11915.119097586565, 3045, 25989, 11723.0, 16105.300000000003, 17439.7, 19964.96, 19.88243700678569, 5531.622111126759, 23.94047346617847], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -80", 1726, 1, 0.05793742757821553, 1238.095596755506, 40, 12186, 953.0, 2331.8999999999996, 2855.2999999999997, 4638.0700000000015, 9.200524525847824, 84.94438365214447, 3.5130909078188464], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -78", 2163, 0, 0.0, 1009.8955154877484, 194, 7944, 842.0, 1759.0, 2073.7999999999997, 2919.440000000007, 11.938799165443164, 32.20980978575844, 3.859123558361023], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -80", 1739, 0, 0.0, 1150.8844163312256, 129, 21855, 966.0, 2149.0, 2565.0, 3420.7999999999984, 9.496712466414733, 60.51543147513051, 3.3757845095458614], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -79", 784, 0, 0.0, 2768.3227040816378, 238, 26769, 2148.5, 5120.5, 6767.75, 9737.549999999994, 4.284597854422044, 11.40913153209896, 1.3598577174679338], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 6221, 0, 0.0, 7227.575309435784, 301, 64539, 7214.0, 9341.8, 10021.099999999997, 11529.46, 32.92858503948678, 1909.0098161578862, 18.393701799400816], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 796, 0, 0.0, 2838.5741206030143, 451, 14582, 2157.0, 5326.800000000003, 7229.099999999997, 11726.499999999993, 4.33284525319384, 11.640960101489824, 1.3751706125859358], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -80", 2192, 0, 0.0, 1011.0789233576635, 192, 4752, 861.0, 1740.8000000000002, 2110.0999999999995, 2857.840000000002, 12.019850300222082, 32.13502967948894, 3.8853227044663172], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 1149, 10, 0.8703220191470844, 42838.676240208886, 81, 74723, 43094.0, 59728.0, 64267.0, 72133.5, 5.369786189975465, 5976.3678218833975, 3.083431913774974], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 2147, 0, 0.0, 1026.591057289241, 165, 7609, 860.0, 1822.4, 2191.1999999999994, 3091.5999999999995, 11.816960944035928, 29.778674069696404, 3.8197403051522394], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -78", 2126, 0, 0.0, 1009.9971777986835, 163, 6396, 853.0, 1774.0, 2113.6499999999996, 2986.7100000000005, 11.804946305818072, 30.95939655124546, 3.815856667212678], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -80", 801, 0, 0.0, 3020.526841448194, 378, 13844, 2162.0, 6607.600000000001, 7915.6, 12596.660000000002, 4.369170348551792, 11.718014901407297, 1.386699573514973], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -77", 2178, 0, 0.0, 999.0096418732765, 168, 14220, 845.5, 1715.0, 2030.0499999999997, 2982.830000000001, 12.067618556872393, 32.80922753112481, 3.9007634202390253], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -77", 1749, 0, 0.0, 1379.6946826758156, 131, 55602, 969.0, 2373.0, 3044.5, 10123.5, 9.609362122960277, 57.24709601292512, 3.415827942146036], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -80", 1726, 0, 0.0, 1277.0208574739302, 133, 39743, 965.5, 2279.8999999999996, 2872.249999999999, 5816.380000000004, 9.419700599782791, 59.37630895499173, 3.3484091975790387], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -78", 1718, 0, 0.0, 1265.4080325960444, 135, 22905, 1016.0, 2375.4000000000005, 2851.45, 4536.48, 9.444230663514926, 58.561571913995934, 3.357128868671321], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -79", 1727, 0, 0.0, 1279.2605674580186, 134, 31964, 954.0, 2384.4, 2971.1999999999994, 6251.000000000007, 9.458711928273717, 57.554892415367256, 3.3622765057535475], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -80", 2142, 0, 0.0, 1004.8193277310922, 169, 6386, 847.0, 1782.8000000000002, 2095.7, 3100.8200000000206, 11.88211082204015, 27.39709850031342, 3.8407994942336816], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -79", 2142, 0, 0.0, 1034.8394024276388, 158, 6860, 859.0, 1836.7, 2208.85, 2979.1400000000003, 11.882044909913908, 33.34641975043268, 3.8407781886538124], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 2142, 0, 0.0, 1005.1755368814186, 170, 8091, 859.0, 1732.0, 2034.0, 2766.7500000000123, 11.878618486723898, 31.635330710277056, 3.839670624126572], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -79", 797, 0, 0.0, 2763.0250941028858, 340, 25305, 2159.0, 4985.0, 7060.599999999997, 11799.659999999994, 4.344768560665943, 11.576481146321122, 1.378954865445734], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -80", 786, 0, 0.0, 2986.131043256998, 447, 26765, 2180.0, 5941.000000000002, 7470.549999999999, 13104.38, 4.300957592339262, 11.596496665526676, 1.3650500170998632], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 2126, 0, 0.0, 981.9082784571957, 193, 8810, 821.5, 1711.3, 2068.2999999999997, 3086.4400000000005, 11.801866315830377, 24.553205891496106, 3.8148610845115773], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -78", 795, 0, 0.0, 2761.3484276729546, 395, 12019, 2136.0, 5504.2, 6763.999999999999, 8391.519999999993, 4.298180166736951, 11.56022926330814, 1.3641685099506926], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -77", 792, 0, 0.0, 2754.785353535352, 275, 15834, 2097.0, 4909.4000000000015, 7077.049999999996, 11704.879999999932, 4.279646821065373, 11.339442997481925, 1.3582863445764122], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80", 1726, 8, 0.46349942062572425, 1240.1384704519114, 41, 50395, 928.0, 2253.8999999999996, 2689.6499999999996, 4582.22, 9.388496643857225, 85.61129746433078, 3.5848654177228267], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -77", 2134, 0, 0.0, 1025.036551077793, 167, 6647, 864.5, 1799.5, 2124.0, 2905.800000000001, 11.863662391523096, 33.150039679892366, 3.8348361831974067], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503/Service Unavailable", 253, 32.56113256113256, 0.15743621655258244], "isController": false}, {"data": ["502/Bad Gateway", 8, 1.0296010296010296, 0.004978220286247666], "isController": false}, {"data": ["504/Gateway Time-out", 500, 64.35006435006434, 0.3111387678904792], "isController": false}, {"data": ["502/Proxy Error", 16, 2.0592020592020592, 0.009956440572495333], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 160700, 777, "504/Gateway Time-out", 500, "503/Service Unavailable", 253, "502/Proxy Error", 16, "502/Bad Gateway", 8, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -78", 1716, 6, "503/Service Unavailable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79", 1746, 5, "503/Service Unavailable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77", 1718, 4, "503/Service Unavailable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -80", 1728, 5, "503/Service Unavailable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 5743, 138, "503/Service Unavailable", 118, "502/Proxy Error", 12, "502/Bad Gateway", 8, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80", 1725, 4, "503/Service Unavailable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77", 1722, 5, "503/Service Unavailable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 1734, 8, "503/Service Unavailable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79", 1714, 6, "503/Service Unavailable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 500, 500, "504/Gateway Time-out", 500, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 1717, 7, "503/Service Unavailable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 1711, 8, "503/Service Unavailable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -77", 1733, 9, "503/Service Unavailable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78", 1729, 7, "503/Service Unavailable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -79", 1719, 8, "503/Service Unavailable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -78", 1718, 10, "503/Service Unavailable", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -77", 1735, 9, "503/Service Unavailable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 1713, 8, "503/Service Unavailable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78", 1725, 6, "503/Service Unavailable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -79", 1733, 5, "503/Service Unavailable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -80", 1726, 1, "503/Service Unavailable", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 1149, 10, "503/Service Unavailable", 6, "502/Proxy Error", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80", 1726, 8, "503/Service Unavailable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
