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

    var data = {"OkPercent": 99.67249571221724, "KoPercent": 0.32750428778275414};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6036014001584219, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.7603316272577302, 500, 1500, "NBM_ResLevel-1_Times-One_100threads"], "isController": false}, {"data": [0.6130229419703104, 500, 1500, "HREF_ResLevel-4_Times-One_50threads"], "isController": false}, {"data": [0.8222387504648568, 500, 1500, "HREF_ResLevel-2_Times-One_25threads"], "isController": false}, {"data": [0.6198432770844562, 500, 1500, "LREF_ResLevel-2_Times-One_100threads"], "isController": false}, {"data": [0.8127249820014398, 500, 1500, "NBM_ResLevel-1_Times-One_25threads"], "isController": false}, {"data": [0.2835954016913319, 500, 1500, "HREF_ResLevel-2_Times-One_100threads"], "isController": false}, {"data": [0.03125, 500, 1500, "NBM_ResLevel-8_Times-One_500threads"], "isController": false}, {"data": [0.8845541977004845, 500, 1500, "LREF_ResLevel-1_Times-One_50threads"], "isController": false}, {"data": [0.8821809676947815, 500, 1500, "LREF_ResLevel-4_Times-One_25threads"], "isController": false}, {"data": [0.027903515842996218, 500, 1500, "HREF_ResLevel-2_Times-One_250threads"], "isController": false}, {"data": [0.28124628609911656, 500, 1500, "LREF_ResLevel-2_Times-One_250threads"], "isController": false}, {"data": [0.9735868991019546, 500, 1500, "LREF_ResLevel-2_Times-One_5threads"], "isController": false}, {"data": [0.9666471620830895, 500, 1500, "HREF_ResLevel-2_Times-One_5threads"], "isController": false}, {"data": [0.9976571651698555, 500, 1500, "LREF_ResLevel-1_Times-One_5threads"], "isController": false}, {"data": [0.9506999391357274, 500, 1500, "HREF_ResLevel-4_Times-One_5threads"], "isController": false}, {"data": [0.985597592433362, 500, 1500, "HREF_ResLevel-1_Times-One_5threads"], "isController": false}, {"data": [0.9886783733826248, 500, 1500, "LREF_ResLevel-4_Times-One_5threads"], "isController": false}, {"data": [0.5276354319180088, 500, 1500, "NBM_ResLevel-8_Times-One_25threads"], "isController": false}, {"data": [0.8198151950718686, 500, 1500, "NBM_ResLevel-4_Times-One_5threads"], "isController": false}, {"data": [0.7583803518088285, 500, 1500, "LREF_ResLevel-4_Times-One_50threads"], "isController": false}, {"data": [0.925689307330195, 500, 1500, "NBM_ResLevel-1_Times-One_5threads"], "isController": false}, {"data": [0.15010295126973233, 500, 1500, "NBM_ResLevel-4_Times-One_100threads"], "isController": false}, {"data": [0.005849822143174744, 500, 1500, "HREF_ResLevel-2_Times-One_500threads"], "isController": false}, {"data": [0.8239166209544706, 500, 1500, "HREF_ResLevel-4_Times-One_25threads"], "isController": false}, {"data": [0.8455218484211976, 500, 1500, "LREF_ResLevel-1_Times-One_250threads"], "isController": false}, {"data": [0.6434735706580367, 500, 1500, "HREF_ResLevel-1_Times-One_250threads"], "isController": false}, {"data": [0.01910617479836044, 500, 1500, "NBM_ResLevel-8_Times-One_250threads"], "isController": false}, {"data": [0.7921225382932167, 500, 1500, "NBM_ResLevel-8_Times-One_5threads"], "isController": false}, {"data": [0.47081822550347296, 500, 1500, "LREF_ResLevel-4_Times-One_100threads"], "isController": false}, {"data": [0.04357896019991467, 500, 1500, "HREF_ResLevel-4_Times-One_250threads"], "isController": false}, {"data": [0.5187155963302752, 500, 1500, "NBM_ResLevel-4_Times-One_25threads"], "isController": false}, {"data": [0.22807422645786976, 500, 1500, "LREF_ResLevel-4_Times-One_250threads"], "isController": false}, {"data": [0.17249790911625312, 500, 1500, "NBM_ResLevel-8_Times-One_100threads"], "isController": false}, {"data": [0.36247467154715995, 500, 1500, "HREF_ResLevel-4_Times-One_100threads"], "isController": false}, {"data": [0.9472743521000894, 500, 1500, "LREF_ResLevel-1_Times-One_25threads"], "isController": false}, {"data": [0.7182568584607915, 500, 1500, "NBM_ResLevel-1_Times-One_50threads"], "isController": false}, {"data": [0.0041714527537633755, 500, 1500, "NBM_ResLevel-4_Times-One_500threads"], "isController": false}, {"data": [0.3201198026779422, 500, 1500, "NBM_ResLevel-8_Times-One_50threads"], "isController": false}, {"data": [0.6185436071126165, 500, 1500, "HREF_ResLevel-2_Times-One_50threads"], "isController": false}, {"data": [0.6112853238323003, 500, 1500, "HREF_ResLevel-1_Times-One_500threads"], "isController": false}, {"data": [0.604952909592859, 500, 1500, "NBM_ResLevel-1_Times-One_500threads"], "isController": false}, {"data": [0.77141093276462, 500, 1500, "LREF_ResLevel-2_Times-One_50threads"], "isController": false}, {"data": [0.8999433908859327, 500, 1500, "LREF_ResLevel-2_Times-One_25threads"], "isController": false}, {"data": [0.00812407680945347, 500, 1500, "HREF_ResLevel-4_Times-One_500threads"], "isController": false}, {"data": [0.9077416766947453, 500, 1500, "HREF_ResLevel-1_Times-One_25threads"], "isController": false}, {"data": [0.7189563467343907, 500, 1500, "NBM_ResLevel-1_Times-One_250threads"], "isController": false}, {"data": [0.8499197431781701, 500, 1500, "HREF_ResLevel-1_Times-One_50threads"], "isController": false}, {"data": [0.8871959185357334, 500, 1500, "LREF_ResLevel-1_Times-One_100threads"], "isController": false}, {"data": [0.2875183016105417, 500, 1500, "NBM_ResLevel-4_Times-One_50threads"], "isController": false}, {"data": [0.05465822457681871, 500, 1500, "NBM_ResLevel-4_Times-One_250threads"], "isController": false}, {"data": [0.7749182395314538, 500, 1500, "HREF_ResLevel-1_Times-One_100threads"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1482118, 4854, 0.32750428778275414, 1664.750181834329, 1, 95233, 14098.0, 30013.700000000004, 35173.65000000001, 48571.41000000009, 125.85918378750274, 18901.39205177548, 37.44649284276404], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NBM_ResLevel-1_Times-One_100threads", 47282, 28, 0.05921915316610973, 603.6712702508341, 2, 5879, 416.0, 956.0, 1182.9500000000007, 2468.700000000048, 157.20056520654973, 38157.80938305212, 47.282982503532544], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_50threads", 5928, 7, 0.11808367071524967, 890.0823211875847, 10, 6756, 629.0, 1864.0, 2482.55, 3784.55, 49.12367930391547, 6670.503418272219, 14.535619950279678], "isController": false}, {"data": ["HREF_ResLevel-2_Times-One_25threads", 5378, 0, 0.0, 491.7086277426561, 219, 2826, 389.0, 905.0, 1092.0500000000002, 1499.8400000000001, 44.6562762079531, 5951.4518265386405, 13.213722354501748], "isController": false}, {"data": ["LREF_ResLevel-2_Times-One_100threads", 24119, 72, 0.2985198391309756, 1183.9596998217257, 1, 33787, 619.0, 2952.7000000000044, 4274.0, 8175.980000000003, 80.17484958282087, 3329.7222800772033, 23.645316966808497], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_25threads", 5556, 0, 0.0, 476.19042476601896, 216, 1552, 411.5, 770.0, 938.1499999999996, 1194.8600000000006, 46.107883817427386, 11198.542336618257, 13.86838692946058], "isController": false}, {"data": ["HREF_ResLevel-2_Times-One_100threads", 15136, 78, 0.5153276955602537, 1887.5414904862507, 2, 10410, 1491.0, 3700.0, 4472.15, 6093.889999999998, 50.28688374812703, 6667.3903260416355, 14.879810327814933], "isController": false}, {"data": ["NBM_ResLevel-8_Times-One_500threads", 1648, 77, 4.672330097087379, 13693.005461165045, 8, 61730, 11171.5, 25501.1, 28414.999999999996, 42673.31, 22.214134551875667, 5140.982086968573, 6.681595158181353], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_50threads", 13829, 0, 0.0, 381.2070287077897, 113, 3328, 298.0, 689.0, 854.0, 1395.8000000000102, 114.99347242202248, 4846.907483600499, 33.914090499463654], "isController": false}, {"data": ["LREF_ResLevel-4_Times-One_25threads", 6841, 0, 0.0, 386.4506651074402, 156, 1372, 318.0, 703.8000000000002, 851.8999999999996, 1121.58, 56.84065340578626, 1629.5615840172534, 16.76355207865962], "isController": false}, {"data": ["HREF_ResLevel-2_Times-One_250threads", 16127, 166, 1.0293296955416382, 4440.899733366408, 43, 20184, 3877.0, 8051.200000000001, 9528.399999999994, 12744.399999999987, 53.352433065473925, 7037.369044937233, 15.78690158089707], "isController": false}, {"data": ["LREF_ResLevel-2_Times-One_250threads", 25243, 229, 0.9071821891217368, 2830.5925999286915, 3, 27367, 2000.0, 6946.9000000000015, 9348.95, 14789.990000000002, 83.77833903626534, 3458.275208741624, 24.708064832961064], "isController": false}, {"data": ["LREF_ResLevel-2_Times-One_5threads", 1893, 0, 0.0, 285.56893819334357, 168, 1671, 225.0, 442.60000000000014, 504.29999999999995, 687.1199999999999, 15.750586590784284, 656.0796098079227, 4.645192529703959], "isController": false}, {"data": ["HREF_ResLevel-2_Times-One_5threads", 1709, 0, 0.0, 316.2744294909297, 220, 1986, 263.0, 463.0, 538.5, 939.4000000000015, 14.200249272953885, 1892.5021665325094, 4.201831571977566], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_5threads", 2561, 0, 0.0, 211.02030456852808, 123, 1595, 172.0, 313.0, 346.0, 445.1400000000003, 21.312894259416456, 898.3260050104234, 6.285638736663837], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_5threads", 1643, 0, 0.0, 328.748021911138, 223, 1796, 270.0, 498.0, 602.0, 670.1199999999999, 13.68174739980181, 1860.0362312193452, 4.048407677871043], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_5threads", 2326, 0, 0.0, 232.330180567498, 150, 843, 187.0, 345.3000000000002, 424.6500000000001, 638.19, 19.35704002063863, 2491.613995156579, 5.7277178967319395], "isController": false}, {"data": ["LREF_ResLevel-4_Times-One_5threads", 2164, 0, 0.0, 249.9473197781885, 160, 898, 202.0, 387.5, 439.75, 549.5499999999988, 17.995393046327326, 515.908939122101, 5.307235058584817], "isController": false}, {"data": ["NBM_ResLevel-8_Times-One_25threads", 2732, 3, 0.10980966325036604, 969.8817715959008, 14, 4544, 803.5, 1783.900000000002, 2191.35, 2946.720000000001, 22.640821434194933, 5490.229697224593, 6.809934572003945], "isController": false}, {"data": ["NBM_ResLevel-4_Times-One_5threads", 974, 0, 0.0, 555.4394250513354, 374, 1446, 461.0, 834.5, 1019.25, 1220.25, 8.095685348804349, 1965.773128470173, 2.435030358820058], "isController": false}, {"data": ["LREF_ResLevel-4_Times-One_50threads", 9039, 3, 0.03318951211417192, 584.2756942139584, 22, 4018, 444.0, 1115.0, 1465.0, 2398.4000000000033, 74.9962663657634, 2149.356996558315, 22.11803949459038], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_5threads", 1487, 0, 0.0, 363.93342299932755, 217, 942, 323.0, 534.6000000000001, 670.0, 813.6799999999985, 12.358093845054269, 3001.496179519597, 3.7170829143327295], "isController": false}, {"data": ["NBM_ResLevel-4_Times-One_100threads", 7285, 27, 0.37062457103637614, 3929.680301990392, 198, 24710, 3382.0, 7836.800000000001, 10083.199999999999, 14304.20000000001, 24.123475104971057, 5835.913573268019, 7.2558889964170765], "isController": false}, {"data": ["HREF_ResLevel-2_Times-One_500threads", 35984, 1110, 3.0847043130280123, 8156.69322476656, 2, 35916, 7608.0, 14781.900000000001, 17362.750000000004, 23083.68000000005, 59.65606250756394, 7705.75831934868, 17.6521356833905], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_25threads", 5469, 0, 0.0, 483.51161089778657, 217, 2654, 395.0, 866.0, 1053.0, 1433.2000000000007, 45.457190115617024, 6179.913874575579, 13.45071152835152], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_250threads", 145205, 31, 0.021349127096174373, 491.126855135851, 16, 19064, 357.0, 819.0, 1006.0, 1583.9800000000032, 482.94613606505584, 20351.578743290913, 142.43137997231136], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_250threads", 63036, 46, 0.0729741734881655, 1131.8024462212068, 1, 15311, 456.0, 2124.9000000000015, 4115.750000000004, 5885.990000000002, 209.51102129809354, 26948.35845761445, 61.9939838411351], "isController": false}, {"data": ["NBM_ResLevel-8_Times-One_250threads", 7563, 216, 2.8560095200317335, 9505.091498082791, 3, 64024, 8182.0, 16902.2, 20040.599999999995, 28836.839999999967, 24.848536620625307, 5860.112154463899, 7.473973905422455], "isController": false}, {"data": ["NBM_ResLevel-8_Times-One_5threads", 914, 0, 0.0, 593.1531728665211, 373, 1529, 477.0, 889.5, 1124.5, 1450.5500000000002, 7.575757575757576, 1839.0817353219697, 2.2786458333333335], "isController": false}, {"data": ["LREF_ResLevel-4_Times-One_100threads", 22891, 61, 0.26648027609104014, 1247.346031191301, 2, 10886, 992.5, 2667.0, 3423.9500000000007, 5066.0, 76.08471658102387, 2175.510773912749, 22.439047272919144], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_250threads", 16407, 147, 0.8959590418723715, 4361.752117998435, 1, 21151, 3800.0, 8150.0, 9628.0, 13054.560000000001, 54.28521325979281, 7314.094371071998, 16.062909782926972], "isController": false}, {"data": ["NBM_ResLevel-4_Times-One_25threads", 2725, 2, 0.07339449541284404, 973.678532110092, 366, 3970, 823.0, 1721.8000000000002, 2131.399999999998, 2901.2199999999993, 22.556639929805392, 5473.128828743885, 6.784614353886778], "isController": false}, {"data": ["LREF_ResLevel-4_Times-One_250threads", 23819, 190, 0.7976825223561023, 2999.2691968596478, 15, 25027, 2406.0, 6666.9000000000015, 8212.850000000002, 11695.990000000002, 79.01083044466189, 2247.2589032671704, 23.302022260046773], "isController": false}, {"data": ["NBM_ResLevel-8_Times-One_100threads", 7174, 85, 1.1848341232227488, 3989.8111235015326, 38, 24748, 3057.5, 8734.0, 11009.75, 16300.75, 23.734140572014624, 5693.48104751832, 7.138784468926274], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_100threads", 15299, 67, 0.4379371200732074, 1867.4085234329052, 30, 15451, 1372.0, 4107.0, 5176.0, 7850.0, 50.83349116004293, 6880.618212283362, 15.041550606926764], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_25threads", 8952, 0, 0.0, 295.2884271671142, 121, 2261, 251.0, 509.0, 603.0, 775.4699999999993, 74.34228009566834, 3133.4835461026773, 21.92516463758969], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_50threads", 8238, 1, 0.012138868657441126, 640.9252245690728, 83, 5152, 514.0, 1178.1000000000004, 1450.0999999999985, 2212.489999999997, 68.34472688657331, 16597.346298188404, 20.556812383852126], "isController": false}, {"data": ["NBM_ResLevel-4_Times-One_500threads", 16541, 578, 3.4943473792394655, 17834.962698748495, 4, 95233, 15299.0, 31203.800000000003, 36435.69999999999, 49920.659999999996, 27.18788420699676, 6371.256668790764, 8.177605796635744], "isController": false}, {"data": ["NBM_ResLevel-8_Times-One_50threads", 2838, 17, 0.5990133897110641, 1867.7350246652563, 1, 11462, 1419.0, 3932.099999999999, 5077.099999999994, 6930.370000000003, 23.40155350693471, 5646.941162805919, 7.038748515757706], "isController": false}, {"data": ["HREF_ResLevel-2_Times-One_50threads", 5905, 9, 0.15241320914479256, 894.7315834038966, 59, 6790, 622.0, 1942.4000000000005, 2559.0, 3975.819999999999, 48.91524946363041, 6509.139938682499, 14.473945886210954], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_500threads", 245868, 214, 0.08703857354352743, 1191.3006084565898, 1, 28094, 479.0, 2262.9000000000015, 3728.0, 7014.920000000013, 408.25516695143637, 52504.45204024946, 120.80206600223167], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_500threads", 341577, 216, 0.06323610781756384, 856.908421819971, 2, 46275, 701.0, 1526.0, 1866.0, 3453.770000000037, 568.4167960501027, 137968.13593895867, 170.96911443694492], "isController": false}, {"data": ["LREF_ResLevel-2_Times-One_50threads", 8909, 3, 0.033673812998091815, 592.7759568975226, 117, 4631, 405.0, 1185.0, 1676.5, 2789.4999999999945, 73.7976508010139, 3072.9608479994326, 21.764541544830273], "isController": false}, {"data": ["LREF_ResLevel-2_Times-One_25threads", 7066, 0, 0.0, 375.0689215963763, 158, 2582, 311.0, 633.0, 779.2999999999993, 1147.3199999999997, 57.92040657403992, 2412.63381055576, 17.081994907578178], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_500threads", 35204, 1043, 2.9627315077832064, 8333.468242245188, 2, 42371, 7676.0, 15001.800000000003, 17573.95, 23142.780000000035, 58.3826848671696, 7702.449243049602, 17.275345229250384], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_25threads", 7479, 0, 0.0, 354.0240673886888, 146, 2647, 285.0, 618.0, 757.0, 1171.3999999999996, 61.93378492522235, 7972.039378343464, 18.326110187834345], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_250threads", 104345, 42, 0.040251090133691124, 683.6971584647074, 4, 9338, 493.0, 1147.0, 1371.0, 1825.9900000000016, 346.92506923872315, 84226.2259430763, 104.34855598195969], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_50threads", 11837, 3, 0.025344259525217537, 445.64560277097394, 117, 4007, 330.0, 764.0, 974.0, 2521.620000000001, 98.30007390983, 12649.862552824248, 29.086838276053214], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_100threads", 72719, 14, 0.01925218993660529, 392.28798525831905, 2, 5336, 283.0, 649.0, 792.0, 2490.980000000003, 242.05456288445666, 10200.506406024278, 71.38718553818937], "isController": false}, {"data": ["NBM_ResLevel-4_Times-One_50threads", 2732, 14, 0.5124450951683748, 1940.008418740844, 12, 9466, 1526.0, 4054.4000000000005, 4829.799999999999, 7021.720000000001, 22.451042428525643, 5423.5985240309155, 6.7528526054549785], "isController": false}, {"data": ["NBM_ResLevel-4_Times-One_250threads", 7739, 41, 0.5297842098462333, 9302.45768187105, 237, 64313, 8321.0, 18051.0, 22917.0, 32006.800000000003, 25.396502443170444, 6134.078383966428, 7.638791750484861], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_100threads", 46783, 14, 0.029925400252228375, 610.0085928649219, 24, 6793, 388.0, 928.0, 1393.7000000000044, 3807.970000000005, 155.60463391351493, 20023.252739401818, 46.04316804276857], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 4801, 98.90811701689329, 0.3239283241955094], "isController": false}, {"data": ["500/Internal Server Error", 53, 1.091882983106716, 0.0035759635872447404], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1482118, 4854, "502/Bad Gateway", 4801, "500/Internal Server Error", 53, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["NBM_ResLevel-1_Times-One_100threads", 47282, 28, "502/Bad Gateway", 28, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_50threads", 5928, 7, "502/Bad Gateway", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["LREF_ResLevel-2_Times-One_100threads", 24119, 72, "502/Bad Gateway", 72, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["HREF_ResLevel-2_Times-One_100threads", 15136, 78, "502/Bad Gateway", 78, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-8_Times-One_500threads", 1648, 77, "502/Bad Gateway", 66, "500/Internal Server Error", 11, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["HREF_ResLevel-2_Times-One_250threads", 16127, 166, "502/Bad Gateway", 166, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-2_Times-One_250threads", 25243, 229, "502/Bad Gateway", 229, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NBM_ResLevel-8_Times-One_25threads", 2732, 3, "502/Bad Gateway", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["LREF_ResLevel-4_Times-One_50threads", 9039, 3, "502/Bad Gateway", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NBM_ResLevel-4_Times-One_100threads", 7285, 27, "502/Bad Gateway", 27, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-2_Times-One_500threads", 35984, 1110, "502/Bad Gateway", 1110, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_250threads", 145205, 31, "502/Bad Gateway", 31, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_250threads", 63036, 46, "502/Bad Gateway", 46, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-8_Times-One_250threads", 7563, 216, "502/Bad Gateway", 215, "500/Internal Server Error", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["LREF_ResLevel-4_Times-One_100threads", 22891, 61, "502/Bad Gateway", 61, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_250threads", 16407, 147, "502/Bad Gateway", 147, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-4_Times-One_25threads", 2725, 2, "502/Bad Gateway", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-4_Times-One_250threads", 23819, 190, "502/Bad Gateway", 190, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-8_Times-One_100threads", 7174, 85, "502/Bad Gateway", 85, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_100threads", 15299, 67, "502/Bad Gateway", 67, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_50threads", 8238, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-4_Times-One_500threads", 16541, 578, "502/Bad Gateway", 537, "500/Internal Server Error", 41, "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-8_Times-One_50threads", 2838, 17, "502/Bad Gateway", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-2_Times-One_50threads", 5905, 9, "502/Bad Gateway", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_500threads", 245868, 214, "502/Bad Gateway", 214, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_500threads", 341577, 216, "502/Bad Gateway", 216, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-2_Times-One_50threads", 8909, 3, "502/Bad Gateway", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["HREF_ResLevel-4_Times-One_500threads", 35204, 1043, "502/Bad Gateway", 1043, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NBM_ResLevel-1_Times-One_250threads", 104345, 42, "502/Bad Gateway", 42, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_50threads", 11837, 3, "502/Bad Gateway", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LREF_ResLevel-1_Times-One_100threads", 72719, 14, "502/Bad Gateway", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-4_Times-One_50threads", 2732, 14, "502/Bad Gateway", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NBM_ResLevel-4_Times-One_250threads", 7739, 41, "502/Bad Gateway", 41, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["HREF_ResLevel-1_Times-One_100threads", 46783, 14, "502/Bad Gateway", 14, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
