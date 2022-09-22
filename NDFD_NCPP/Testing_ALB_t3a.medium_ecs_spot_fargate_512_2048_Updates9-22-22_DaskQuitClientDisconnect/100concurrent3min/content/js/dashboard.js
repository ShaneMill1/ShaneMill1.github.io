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

    var data = {"OkPercent": 99.5128513366535, "KoPercent": 0.48714866334649953};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8972622932051062, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3466183574879227, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -80"], "isController": false}, {"data": [0.06338028169014084, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -79"], "isController": false}, {"data": [0.47733516483516486, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -78"], "isController": false}, {"data": [0.26229508196721313, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -77"], "isController": false}, {"data": [0.08411214953271028, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -80"], "isController": false}, {"data": [0.4883241758241758, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79"], "isController": false}, {"data": [0.27400468384074944, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -78"], "isController": false}, {"data": [0.23481308411214954, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -79"], "isController": false}, {"data": [0.5185185185185185, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77"], "isController": false}, {"data": [0.08878504672897196, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -78"], "isController": false}, {"data": [0.0947867298578199, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -79"], "isController": false}, {"data": [0.48904109589041095, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -80"], "isController": false}, {"data": [0.2728337236533958, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -80"], "isController": false}, {"data": [0.11971830985915492, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -77"], "isController": false}, {"data": [0.13411181882519463, 500, 1500, "NDFD_line_glance_SOAP"], "isController": false}, {"data": [0.3180722891566265, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -79"], "isController": false}, {"data": [0.3031400966183575, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -78"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -77"], "isController": false}, {"data": [0.2652582159624413, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -78"], "isController": false}, {"data": [0.2371495327102804, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -77"], "isController": false}, {"data": [0.2540983606557377, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_glance_REST"], "isController": false}, {"data": [0.27634660421545665, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -79"], "isController": false}, {"data": [0.3168674698795181, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 37 -80"], "isController": false}, {"data": [0.09579439252336448, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -77"], "isController": false}, {"data": [0.11428571428571428, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -78"], "isController": false}, {"data": [0.3115942028985507, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -77"], "isController": false}, {"data": [0.36912235746316463, 500, 1500, "NDFD_MultiZip-glance_REST"], "isController": false}, {"data": [0.28313253012048195, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -79"], "isController": false}, {"data": [0.4965659340659341, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80"], "isController": false}, {"data": [0.3325301204819277, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 38 -78"], "isController": false}, {"data": [0.2505854800936768, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -80"], "isController": false}, {"data": [0.10141509433962265, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -77"], "isController": false}, {"data": [0.510989010989011, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77"], "isController": false}, {"data": [0.07746478873239436, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -78"], "isController": false}, {"data": [0.5034340659340659, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78"], "isController": false}, {"data": [0.10328638497652583, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -79"], "isController": false}, {"data": [0.5048209366391184, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_CityLevel1234_Summaries_24hourly_REST"], "isController": false}, {"data": [0.0012315270935960591, 500, 1500, "NDFD_MultiPoint_AllElems_REST"], "isController": false}, {"data": [0.5123796423658872, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80"], "isController": false}, {"data": [0.49862637362637363, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79"], "isController": false}, {"data": [0.07819905213270142, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -77"], "isController": false}, {"data": [0.1056338028169014, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -78"], "isController": false}, {"data": [0.107981220657277, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -79"], "isController": false}, {"data": [0.48482758620689653, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -77"], "isController": false}, {"data": [0.49179206566347466, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_bbox_Summaries_12Hourly_SOAP"], "isController": false}, {"data": [0.27049180327868855, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -77"], "isController": false}, {"data": [0.4951790633608815, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -79"], "isController": false}, {"data": [0.07783018867924528, 500, 1500, "NDFD_1Point-wspd-wdir_REST 34 -80"], "isController": false}, {"data": [0.49383561643835616, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -78"], "isController": false}, {"data": [0.2371495327102804, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -79"], "isController": false}, {"data": [0.4972489683631362, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -77"], "isController": false}, {"data": [0.26229508196721313, 500, 1500, "NDFD_1Point_maxt_SOAP 38 -78"], "isController": false}, {"data": [0.48632010943912446, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77"], "isController": false}, {"data": [0.26711111111111113, 500, 1500, "NDFD_MultiPoint_Glance_SOAP"], "isController": false}, {"data": [0.5027662517289073, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78"], "isController": false}, {"data": [0.49043715846994534, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -79"], "isController": false}, {"data": [0.08685446009389672, 500, 1500, "NDFD_1Point-wspd-wdir_REST 35 -80"], "isController": false}, {"data": [0.344578313253012, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -77"], "isController": false}, {"data": [0.2887323943661972, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -77"], "isController": false}, {"data": [0.2927710843373494, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -79"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP "], "isController": false}, {"data": [0.48079561042524005, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -80"], "isController": false}, {"data": [0.3024096385542169, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -78"], "isController": false}, {"data": [0.09004739336492891, 500, 1500, "NDFD_1Point-wspd-wdir_REST 36 -80"], "isController": false}, {"data": [0.2540983606557377, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -79"], "isController": false}, {"data": [0.9997075728546939, 500, 1500, "NDFD_Line_Summaries_24Hourly_REST"], "isController": false}, {"data": [0.2494172494172494, 500, 1500, "NDFD_1Point_maxt_SOAP 36 -78"], "isController": false}, {"data": [0.30193236714975846, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -80"], "isController": false}, {"data": [0.0, 500, 1500, "NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST"], "isController": false}, {"data": [0.3159806295399516, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -79"], "isController": false}, {"data": [0.2987951807228916, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -78"], "isController": false}, {"data": [0.2383177570093458, 500, 1500, "NDFD_1Point_maxt_SOAP 34 -80"], "isController": false}, {"data": [0.2898550724637681, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -77"], "isController": false}, {"data": [0.09669811320754718, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -77"], "isController": false}, {"data": [0.10141509433962265, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -78"], "isController": false}, {"data": [0.09198113207547169, 500, 1500, "NDFD_1Point-wspd-wdir_REST 37 -80"], "isController": false}, {"data": [0.08962264150943396, 500, 1500, "NDFD_1Point-wspd-wdir_REST 38 -79"], "isController": false}, {"data": [0.31490384615384615, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 35 -80"], "isController": false}, {"data": [0.3031400966183575, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -79"], "isController": false}, {"data": [0.3389830508474576, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 34 -80"], "isController": false}, {"data": [0.24532710280373832, 500, 1500, "NDFD_1Point_maxt_SOAP 35 -80"], "isController": false}, {"data": [0.22833723653395785, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -79"], "isController": false}, {"data": [0.31280193236714976, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -78"], "isController": false}, {"data": [0.24707259953161592, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -78"], "isController": false}, {"data": [0.2336448598130841, 500, 1500, "NDFD_1Point_maxt_SOAP 37 -77"], "isController": false}, {"data": [0.509641873278237, 500, 1500, "NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80"], "isController": false}, {"data": [0.28966346153846156, 500, 1500, "NDFD_1Point_ptotsvrtsm_SOAP 36 -77"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 349380, 1702, 0.48714866334649953, 736.7342893124693, 18, 61070, 52.0, 63.0, 81.95000000000073, 32108.790000000034, 128.27248485809733, 1223.3675131875536, 59.28183655712582], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -80", 414, 0, 0.0, 1990.6473429951698, 138, 12155, 1500.0, 3875.5, 5826.0, 9904.250000000033, 2.2889621160183116, 5.944932474926466, 0.7488303797520844], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -79", 213, 59, 27.699530516431924, 4279.920187793428, 23, 51671, 2257.0, 8905.999999999998, 16230.199999999968, 50530.37999999998, 1.1511522331272428, 6.651525774933525, 0.41369533378010287], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -78", 728, 0, 0.0, 1269.6373626373627, 96, 5969, 1167.0, 2549.1000000000004, 3135.949999999998, 4287.300000000001, 3.9872058887963897, 32.18186453734993, 1.538033521557201], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -77", 427, 0, 0.0, 1995.3489461358326, 132, 7402, 1851.0, 3828.799999999999, 4566.4, 5804.279999999991, 2.3818820773135494, 6.56005192063647, 0.7652726596056227], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -80", 214, 78, 36.44859813084112, 3752.911214953273, 23, 52427, 1703.5, 6522.5, 17234.0, 50982.549999999996, 1.151590163052252, 6.688667481703707, 0.41385271484690306], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -79", 728, 0, 0.0, 1233.4065934065927, 98, 5823, 1161.0, 2500.5, 2974.5999999999995, 4650.890000000013, 3.9910311442966084, 34.193901565301054, 1.539509083981602], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -78", 427, 0, 0.0, 1996.072599531615, 132, 8336, 1788.0, 3636.1999999999994, 4741.999999999998, 7619.639999999998, 2.377108500807215, 5.81501841458832, 0.7637389616851306], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -79", 428, 0, 0.0, 2189.8294392523358, 126, 12184, 1849.5, 4027.1000000000013, 5374.899999999996, 8489.109999999986, 2.365451149012369, 6.391325170776731, 0.7599935820557319], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -77", 729, 0, 0.0, 1152.576131687243, 102, 4443, 1151.0, 2344.0, 2776.0, 3750.800000000002, 4.038042906283062, 37.08280978235281, 1.557643503888486], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 214, 43, 20.093457943925234, 3847.8785046728985, 22, 50315, 2484.0, 6285.0, 11814.0, 49758.04999999999, 1.1498020083924803, 8.132696898556837, 0.41321009676604753], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -79", 211, 55, 26.066350710900473, 3879.241706161137, 22, 48816, 2233.0, 8506.6, 12673.399999999956, 47976.36, 1.1373252912037861, 7.144177162332972, 0.4087262765263606], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -80", 730, 0, 0.0, 1224.8369863013695, 103, 6018, 1148.5, 2519.0, 2923.8999999999996, 4102.529999999986, 4.044500587283647, 36.27325436342054, 1.5601345038838288], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -80", 427, 0, 0.0, 1970.8641686182666, 130, 7201, 1851.0, 3587.2, 4243.999999999998, 6358.559999999997, 2.3663982531879877, 6.347382942605144, 0.7602978762684061], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -77", 213, 59, 27.699530516431924, 4237.0093896713615, 22, 50977, 2216.0, 8021.799999999999, 16551.99999999999, 50685.51999999999, 1.1363151380649568, 7.229478933824313, 0.4083632527420938], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 1413, 179, 12.668082094833688, 13353.06723283795, 22, 60046, 15258.0, 19399.6, 21214.899999999998, 60027.86, 7.272671123944228, 2151.1111005222892, 2.684638364112225], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -79", 415, 0, 0.0, 2097.253012048192, 134, 11049, 1659.0, 4332.80000000001, 6410.799999999999, 9030.119999999999, 2.311359636420345, 6.420489968211843, 0.7561576935554838], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -78", 414, 0, 0.0, 2222.400966183574, 131, 11261, 1637.5, 4909.5, 6921.25, 10265.550000000003, 2.2092018057823455, 6.016793969252607, 0.7227369188838728], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -77", 414, 0, 0.0, 2054.3091787439616, 134, 10402, 1517.5, 4280.0, 6743.75, 9105.550000000003, 2.288291574775731, 5.821504534437683, 0.7486110132322948], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -78", 426, 0, 0.0, 2047.3896713615025, 126, 7533, 1870.5, 3822.9, 4746.099999999998, 6426.500000000003, 2.356533572305752, 6.1423487510648656, 0.757128462195891], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -77", 428, 0, 0.0, 2114.007009345796, 122, 11738, 1920.0, 3815.2000000000007, 4422.649999999999, 8296.539999999994, 2.369589529514677, 6.681512357298668, 0.7613231984475867], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -80", 427, 0, 0.0, 1994.2786885245912, 123, 7959, 1847.0, 3562.3999999999996, 4098.999999999999, 6280.199999999997, 2.360655012660187, 6.375968043047401, 0.7584526359035172], "isController": false}, {"data": ["NDFD_bbox_glance_REST", 1097, 0, 0.0, 16298.370100273467, 5689, 29552, 16722.0, 18787.6, 19307.3, 20042.239999999998, 5.947765928030406, 2378.596871162349, 2.195562032026849], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -79", 427, 0, 0.0, 1915.9156908665109, 135, 7250, 1713.0, 3389.8, 4180.799999999998, 6382.239999999985, 2.3554072317069807, 6.376424940356345, 0.7567665812808562], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 37 -80", 415, 0, 0.0, 2001.7156626506016, 138, 9984, 1593.0, 3780.6000000000013, 5715.4, 8406.119999999999, 2.202409382794672, 5.927987805484795, 0.7205147883166162], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 214, 69, 32.242990654205606, 3550.845794392522, 22, 52096, 2018.0, 6152.0, 15806.0, 49245.6, 1.1644230664591744, 6.197124429351079, 0.4184645395087658], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -78", 210, 36, 17.142857142857142, 4619.990476190477, 21, 50140, 2882.5, 8970.2, 15949.749999999984, 48036.219999999994, 1.1322402721689948, 7.615110883727011, 0.40689884781073254], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -77", 414, 0, 0.0, 2122.8840579710154, 133, 10845, 1620.0, 4263.5, 7119.5, 9344.350000000013, 2.235686744645692, 6.609065416113145, 0.7314014252502997], "isController": false}, {"data": ["NDFD_MultiZip-glance_REST", 7805, 0, 0.0, 2252.691864189619, 193, 14455, 1392.0, 5635.200000000032, 11159.7, 11990.939999999999, 42.87001131482682, 2569.8562251458293, 15.490140807115157], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -79", 415, 0, 0.0, 2234.5903614457834, 130, 10520, 1670.0, 4628.400000000002, 7253.799999999999, 8716.239999999994, 2.2165961628851, 6.465929306272166, 0.7251559712563561], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -80", 728, 0, 0.0, 1209.2637362637352, 97, 5226, 1147.0, 2494.1, 2887.0, 3979.3700000000017, 4.062930779491129, 35.04041261001445, 1.5672438065419882], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 38 -78", 415, 0, 0.0, 2098.096385542168, 131, 11029, 1545.0, 4388.600000000012, 6778.0, 9251.359999999999, 2.2394664134001037, 6.2801866328813025, 0.7326379379775729], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -80", 427, 0, 0.0, 2055.0491803278683, 129, 11331, 1846.0, 3632.2, 4460.199999999998, 6767.159999999991, 2.359689648312297, 6.021583155919119, 0.7581424748972126], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -77", 212, 80, 37.735849056603776, 3502.915094339623, 21, 51922, 1571.5, 6388.900000000003, 16683.449999999993, 49928.69, 1.1471489020919234, 5.647592526081404, 0.41225663668928497], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -77", 728, 0, 0.0, 1201.380494505496, 99, 4866, 1152.5, 2465.9000000000005, 2949.2999999999997, 4237.810000000004, 3.981928172141818, 34.673673456934466, 1.5359976835898614], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -78", 213, 30, 14.084507042253522, 5456.835680751173, 23, 54496, 3110.0, 9642.399999999998, 17520.699999999983, 50867.6, 1.1373405453894991, 8.220340082510585, 0.4087317584993512], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -78", 728, 0, 0.0, 1187.8200549450553, 97, 5332, 1144.0, 2533.2, 2864.299999999999, 4099.060000000007, 3.984390820576533, 33.167026292600966, 1.5369476309841117], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -79", 213, 75, 35.2112676056338, 4059.7840375586848, 21, 54419, 1767.0, 8798.399999999998, 17847.499999999993, 51846.01999999998, 1.14023254320036, 6.472991285317766, 0.40977107021262926], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 36 -79", 726, 0, 0.0, 1185.676308539945, 99, 6996, 1153.0, 2434.8, 2799.8999999999996, 3862.800000000001, 4.0063350863348655, 34.634586396602344, 1.5454124600608126], "isController": false}, {"data": ["NDFD_CityLevel1234_Summaries_24hourly_REST", 549, 0, 0.0, 34943.16575591988, 22150, 59049, 30717.0, 56603.0, 57134.5, 58355.5, 2.5566514850931847, 1822.2283787005085, 0.8963260577621616], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 406, 300, 73.89162561576354, 49484.89408866995, 1486, 61070, 60031.0, 60048.0, 60051.0, 60076.0, 1.96248084647696, 0.792886747091323, 0.8585853703336701], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 34 -80", 727, 0, 0.0, 1150.916093535075, 96, 4558, 1144.0, 2379.000000000002, 2752.6, 3642.92, 3.990712125287501, 35.255748699381904, 1.5393860248911748], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -79", 728, 0, 0.0, 1206.620879120878, 98, 5722, 1149.5, 2422.1000000000004, 3008.5999999999985, 4402.930000000007, 3.9900686752204675, 31.5139913601037, 1.5391378190547702], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -77", 211, 35, 16.587677725118482, 4738.4881516587675, 24, 52342, 2697.0, 7679.40000000001, 15593.599999999995, 50799.44, 1.140176916550938, 8.252958135986361, 0.40975107938549327], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -78", 213, 64, 30.046948356807512, 3969.6948356807507, 21, 52951, 2153.0, 8626.999999999998, 16488.099999999988, 52260.45999999999, 1.1469063144461735, 7.034439706986975, 0.41216945675409355], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 213, 26, 12.206572769953052, 4337.558685446011, 23, 51344, 2830.0, 9347.199999999999, 15526.2, 50488.379999999976, 1.1444168041220497, 8.803360364359744, 0.41127478898136155], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -77", 725, 0, 0.0, 1218.2634482758629, 101, 5435, 1151.0, 2471.2, 2914.2999999999975, 3794.44, 3.990928207330096, 35.576947805195914, 1.5394693768509649], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 35 -78", 731, 0, 0.0, 1208.8741450068405, 99, 4049, 1157.0, 2468.6000000000004, 2912.2, 3839.1999999999994, 4.052802865237374, 36.763983876456045, 1.5633370427429325], "isController": false}, {"data": ["NDFD_bbox_Summaries_12Hourly_SOAP", 1503, 0, 0.0, 12103.747837658024, 1532, 15039, 12258.0, 13563.6, 13915.2, 14601.52, 8.0057099940876, 2203.4753881760644, 3.299228142094694], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -77", 427, 0, 0.0, 2013.7915690866507, 123, 8169, 1770.0, 3650.0, 4533.999999999997, 7033.7599999999975, 2.3871151685236227, 6.40295186252285, 0.7669539945744841], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -79", 726, 0, 0.0, 1220.7327823691464, 99, 5279, 1146.0, 2494.8000000000025, 2880.2, 3968.3200000000015, 3.9656745197218566, 36.65937028871312, 1.5297279641505208], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 212, 26, 12.264150943396226, 4341.410377358489, 23, 49872, 3098.5, 8935.500000000002, 11966.149999999998, 46749.890000000036, 1.1377907538400438, 8.73429248333566, 0.40889355216126577], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -78", 730, 0, 0.0, 1199.0383561643837, 101, 4894, 1149.5, 2515.2, 2925.399999999999, 3987.619999999988, 3.984520411115174, 33.14814808497399, 1.5369976195219668], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -79", 428, 0, 0.0, 2117.572429906541, 128, 10319, 1940.0, 3917.2000000000003, 4847.899999999998, 7176.409999999999, 2.3649806049487774, 6.521957228662681, 0.7598424013946755], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -77", 727, 0, 0.0, 1217.6451169188454, 99, 6871, 1153.0, 2486.400000000002, 2918.8000000000006, 4115.3600000000015, 3.9796800928409546, 37.41624607232398, 1.535130504562673], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 38 -78", 427, 0, 0.0, 2038.4473067915676, 125, 10509, 1839.0, 3749.2, 4482.2, 7624.839999999994, 2.3621176080101787, 6.2918835485008575, 0.7589225517923327], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -77", 731, 0, 0.0, 1283.7811217510277, 102, 6823, 1150.0, 2639.8000000000006, 3236.2, 5132.799999999993, 4.079514253186597, 39.3099705337411, 1.573640751961627], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 2250, 100, 4.444444444444445, 7974.499555555546, 296, 60359, 1698.5, 12660.900000000001, 33400.44999999998, 60050.0, 12.092418322432243, 1037.7222674661546, 4.605510884520092], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -78", 723, 0, 0.0, 1220.5477178423228, 99, 5097, 1152.0, 2560.2000000000003, 3028.199999999998, 4149.48, 3.9898240173057924, 33.713924565147806, 1.5390434441755743], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -79", 732, 0, 0.0, 1194.9904371584705, 101, 4688, 1153.5, 2462.7000000000007, 2887.1000000000004, 3838.749999999991, 4.011266617713139, 33.67221064218625, 1.5473147597623929], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -80", 213, 60, 28.169014084507044, 4406.657276995304, 22, 52933, 2230.0, 9022.39999999999, 15503.199999999973, 51585.51999999994, 1.147425296148853, 7.458653717954243, 0.412355965803494], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -77", 415, 0, 0.0, 1938.3710843373483, 134, 9424, 1481.0, 3988.400000000006, 6133.999999999998, 7624.0399999999945, 2.211587653478854, 5.813801597605623, 0.7235174452298986], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -77", 426, 0, 0.0, 1870.06103286385, 141, 8224, 1643.0, 3411.6, 4231.049999999999, 6754.560000000003, 2.3534481329863928, 6.339447688952605, 0.7561371442895736], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -79", 415, 0, 0.0, 2206.8650602409643, 132, 10857, 1752.0, 4360.800000000008, 6632.8, 9012.759999999998, 2.2681313876591793, 6.435774776944307, 0.7420156395174072], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 803, 95, 11.83063511830635, 23931.348692403488, 2654, 60109, 20448.0, 60026.0, 60032.0, 60050.0, 3.394229387347936, 55.48031050409379, 4.100255617333396], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 38 -80", 729, 0, 0.0, 1251.999999999998, 102, 5942, 1159.0, 2543.0, 2946.0, 4459.10000000002, 4.0395196905805495, 38.26625310132877, 1.5582131618938642], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -78", 415, 0, 0.0, 2387.2289156626507, 132, 11540, 1873.0, 5597.800000000001, 8009.799999999998, 10060.55999999998, 2.209856492451876, 6.211804885313773, 0.7229510986048617], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -80", 211, 57, 27.01421800947867, 3761.37914691943, 22, 52310, 2232.0, 6167.8, 16056.399999999998, 50250.11999999998, 1.147606071978288, 6.679208197700981, 0.41242093211719727], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -79", 427, 0, 0.0, 2007.8360655737706, 134, 7101, 1893.0, 3511.7999999999997, 4155.999999999999, 6038.719999999995, 2.372986851318758, 6.453495475278145, 0.7624147207850307], "isController": false}, {"data": ["NDFD_Line_Summaries_24Hourly_REST", 297510, 0, 0.0, 58.80232261100485, 18, 1678, 52.0, 61.0, 67.0, 333.0, 1650.064891127109, 1245.6056258215383, 787.9704411730042], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 36 -78", 429, 0, 0.0, 2096.666666666667, 132, 9140, 1894.0, 3834.0, 4658.0, 8269.499999999996, 2.3663873704416707, 6.0012248657530245, 0.7602943797610445], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -80", 414, 0, 0.0, 2118.777777777776, 140, 10977, 1687.0, 4242.0, 6456.25, 9035.150000000012, 2.2658114231922766, 6.592689440169443, 0.7412566667670045], "isController": false}, {"data": ["NDFD_MultiCitiesLevel3-sky-icons-dryfireo-phail-pxhail-pxtstmwinds-tmpabv90d-tcsurge-tctornado-snowlvl-snow48e10-snow72e90-ceil-llwswindspd_REST", 400, 0, 0.0, 50144.06750000001, 40190, 57851, 50556.0, 54053.600000000006, 54977.3, 57293.1, 1.9285752168441759, 2752.540144498498, 1.114957547238039], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -79", 413, 0, 0.0, 2114.9612590799024, 127, 9787, 1559.0, 4718.000000000001, 7207.599999999997, 9000.74, 2.2180332006809844, 6.230230746948191, 0.7256260959259081], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -78", 415, 0, 0.0, 2152.038554216869, 127, 11115, 1708.0, 4174.800000000001, 6784.0, 9128.119999999999, 2.2127078745741207, 6.3812222828347185, 0.7238839238108695], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 34 -80", 428, 0, 0.0, 2224.36214953271, 130, 11438, 1902.0, 3958.700000000002, 5540.149999999992, 8285.039999999999, 2.358854522607526, 6.505063201318314, 0.7578741581424572], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -77", 414, 0, 0.0, 2296.2705314009677, 136, 10367, 1796.0, 5767.0, 7514.5, 8923.600000000002, 2.2265366598723237, 6.167607807533654, 0.7284079893136997], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -77", 212, 27, 12.735849056603774, 4862.367924528303, 21, 49935, 2819.0, 9829.200000000006, 17387.049999999996, 48783.320000000014, 1.132781191557574, 8.18035854428266, 0.40709324071600317], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -78", 212, 79, 37.264150943396224, 2876.297169811323, 23, 50229, 1589.5, 5196.400000000002, 9466.99999999996, 49495.41, 1.1472358110740724, 6.440597528234448, 0.4122878696047448], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -80", 212, 39, 18.39622641509434, 4844.523584905662, 23, 52339, 2459.0, 9351.600000000002, 16587.149999999998, 50988.86, 1.1436833076184414, 8.05844501553683, 0.41101118867537734], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -79", 212, 31, 14.622641509433961, 5100.985849056607, 23, 52892, 2944.5, 10361.000000000004, 16959.199999999993, 52277.91, 1.1503795709952411, 8.340718213981452, 0.41341765832641475], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 35 -80", 416, 0, 0.0, 2144.420673076925, 129, 10894, 1630.5, 4294.600000000004, 6803.899999999998, 9299.459999999995, 2.2566383682768723, 6.211254288833437, 0.7382557161843283], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -79", 414, 0, 0.0, 2139.106280193235, 133, 9476, 1724.0, 4182.0, 6672.75, 8672.15000000001, 2.2970393714767634, 6.775165134382352, 0.7514728412546052], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 34 -80", 413, 0, 0.0, 2091.2905569007276, 133, 9856, 1552.0, 4570.800000000003, 6544.699999999991, 8527.400000000003, 2.2437725803384674, 5.8390495120609565, 0.7340466937630729], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 35 -80", 428, 0, 0.0, 2052.25, 122, 7410, 1891.5, 3679.5000000000005, 4509.8499999999985, 6773.979999999989, 2.3772495001110863, 6.1580282506665185, 0.7637842632192846], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -79", 427, 0, 0.0, 2164.170960187352, 137, 12052, 1908.0, 3791.399999999999, 5213.999999999996, 7231.959999999999, 2.3752704860126053, 6.607247747456458, 0.7631484276349092], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -78", 414, 0, 0.0, 2154.1570048309195, 132, 9486, 1616.0, 4453.5, 6704.5, 8959.150000000001, 2.2238336959149145, 5.923603137673569, 0.7275237188784144], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -78", 427, 0, 0.0, 2080.669789227167, 125, 7962, 1922.0, 3766.2, 4813.599999999999, 7444.799999999999, 2.370891888440375, 6.388890166142887, 0.7617416321258628], "isController": false}, {"data": ["NDFD_1Point_maxt_SOAP 37 -77", 428, 0, 0.0, 2194.495327102805, 130, 12255, 1946.5, 3854.5000000000005, 4848.949999999997, 9348.909999999996, 2.372873838511521, 6.470200301321713, 0.7623784110061428], "isController": false}, {"data": ["NDFD_1Point-conhazo-ptotsvrtstm_REST 37 -80", 726, 0, 0.0, 1179.9104683195578, 94, 4941, 1145.0, 2488.800000000001, 2869.9999999999995, 3971.38, 4.014576340542244, 33.68570102673066, 1.5485914594865102], "isController": false}, {"data": ["NDFD_1Point_ptotsvrtsm_SOAP 36 -77", 416, 0, 0.0, 2262.497596153845, 142, 10786, 1675.0, 4934.1, 6581.5999999999985, 9536.839999999993, 2.2489768777064763, 5.981880210219869, 0.7357492715153022], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503/Service Unavailable", 678, 39.83548766157462, 0.1940580456809205], "isController": false}, {"data": ["504/Gateway Time-out", 517, 30.376028202115158, 0.1479764153643597], "isController": false}, {"data": ["502/Bad Gateway", 247, 14.512338425381904, 0.07069666265956838], "isController": false}, {"data": ["502/Proxy Error", 260, 15.27614571092832, 0.07441753964165092], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 349380, 1702, "503/Service Unavailable", 678, "504/Gateway Time-out", 517, "502/Proxy Error", 260, "502/Bad Gateway", 247, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -79", 213, 59, "503/Service Unavailable", 35, "502/Bad Gateway", 14, "502/Proxy Error", 10, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -80", 214, 78, "503/Service Unavailable", 43, "502/Proxy Error", 18, "502/Bad Gateway", 17, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -78", 214, 43, "503/Service Unavailable", 27, "502/Proxy Error", 9, "502/Bad Gateway", 7, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -79", 211, 55, "503/Service Unavailable", 28, "502/Proxy Error", 14, "502/Bad Gateway", 13, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -77", 213, 59, "503/Service Unavailable", 30, "502/Proxy Error", 15, "502/Bad Gateway", 14, "", "", "", ""], "isController": false}, {"data": ["NDFD_line_glance_SOAP", 1413, 179, "503/Service Unavailable", 106, "502/Proxy Error", 28, "502/Bad Gateway", 23, "504/Gateway Time-out", 22, "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -77", 214, 69, "503/Service Unavailable", 44, "502/Proxy Error", 13, "502/Bad Gateway", 12, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -78", 210, 36, "503/Service Unavailable", 21, "502/Bad Gateway", 9, "502/Proxy Error", 6, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -77", 212, 80, "503/Service Unavailable", 50, "502/Bad Gateway", 16, "502/Proxy Error", 14, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -78", 213, 30, "503/Service Unavailable", 15, "502/Bad Gateway", 8, "502/Proxy Error", 7, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -79", 213, 75, "503/Service Unavailable", 41, "502/Bad Gateway", 20, "502/Proxy Error", 14, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_AllElems_REST", 406, 300, "504/Gateway Time-out", 300, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -77", 211, 35, "503/Service Unavailable", 14, "502/Proxy Error", 13, "502/Bad Gateway", 8, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -78", 213, 64, "503/Service Unavailable", 37, "502/Bad Gateway", 14, "502/Proxy Error", 13, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -79", 213, 26, "503/Service Unavailable", 14, "502/Proxy Error", 8, "502/Bad Gateway", 4, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 34 -80", 212, 26, "503/Service Unavailable", 12, "502/Bad Gateway", 8, "502/Proxy Error", 6, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_Glance_SOAP", 2250, 100, "504/Gateway Time-out", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 35 -80", 213, 60, "503/Service Unavailable", 36, "502/Proxy Error", 15, "502/Bad Gateway", 9, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_MultiPoint_waveh-wdir-wgust-wspd_SOAP ", 803, 95, "504/Gateway Time-out", 95, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 36 -80", 211, 57, "503/Service Unavailable", 30, "502/Bad Gateway", 14, "502/Proxy Error", 13, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -77", 212, 27, "503/Service Unavailable", 12, "502/Proxy Error", 8, "502/Bad Gateway", 7, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -78", 212, 79, "503/Service Unavailable", 50, "502/Proxy Error", 17, "502/Bad Gateway", 12, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 37 -80", 212, 39, "503/Service Unavailable", 18, "502/Proxy Error", 11, "502/Bad Gateway", 10, "", "", "", ""], "isController": false}, {"data": ["NDFD_1Point-wspd-wdir_REST 38 -79", 212, 31, "503/Service Unavailable", 15, "502/Bad Gateway", 8, "502/Proxy Error", 8, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
