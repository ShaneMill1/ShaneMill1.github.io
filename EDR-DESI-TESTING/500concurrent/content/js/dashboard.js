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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [1.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Tile-62315-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude"], "isController": false}, {"data": [1.0, 500, 1500, "Tile-5129-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude"], "isController": false}, {"data": [1.0, 500, 1500, "Tile-453-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude"], "isController": false}, {"data": [1.0, 500, 1500, "Tile-5128-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude"], "isController": false}, {"data": [1.0, 500, 1500, "Tile-321-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude"], "isController": false}, {"data": [1.0, 500, 1500, "Tile-74830-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude"], "isController": false}, {"data": [1.0, 500, 1500, "Tile-322-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude"], "isController": false}, {"data": [1.0, 500, 1500, "Tile-62415-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude"], "isController": false}, {"data": [1.0, 500, 1500, "Tile-74930-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude"], "isController": false}, {"data": [1.0, 500, 1500, "Tile-74931-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude"], "isController": false}, {"data": [1.0, 500, 1500, "Tile-454-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude"], "isController": false}, {"data": [1.0, 500, 1500, "Tile-62314-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude"], "isController": false}, {"data": [1.0, 500, 1500, "Tile-62416-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude"], "isController": false}, {"data": [1.0, 500, 1500, "Tile-62316-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude"], "isController": false}, {"data": [1.0, 500, 1500, "Tile-5116-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude"], "isController": false}, {"data": [1.0, 500, 1500, "Tile-74928-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude"], "isController": false}, {"data": [1.0, 500, 1500, "Tile-74730-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude"], "isController": false}, {"data": [1.0, 500, 1500, "Tile-74831-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude"], "isController": false}, {"data": [1.0, 500, 1500, "Tile-5115-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude"], "isController": false}, {"data": [1.0, 500, 1500, "Tile-5117-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude"], "isController": false}, {"data": [1.0, 500, 1500, "Tile-74828-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude"], "isController": false}, {"data": [1.0, 500, 1500, "Tile-464-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude"], "isController": false}, {"data": [1.0, 500, 1500, "Tile-465-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude"], "isController": false}, {"data": [1.0, 500, 1500, "Tile-62513-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude"], "isController": false}, {"data": [1.0, 500, 1500, "Tile-5125-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude"], "isController": false}, {"data": [1.0, 500, 1500, "Tile-74728-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude"], "isController": false}, {"data": [1.0, 500, 1500, "Tile-74829-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude"], "isController": false}, {"data": [1.0, 500, 1500, "Tile-5118-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude"], "isController": false}, {"data": [1.0, 500, 1500, "Tile-62515-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude"], "isController": false}, {"data": [1.0, 500, 1500, "Tile-5126-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude"], "isController": false}, {"data": [1.0, 500, 1500, "Tile-5119-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude"], "isController": false}, {"data": [1.0, 500, 1500, "Tile-455-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude"], "isController": false}, {"data": [1.0, 500, 1500, "Tile-462-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude"], "isController": false}, {"data": [1.0, 500, 1500, "Tile-62313-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude"], "isController": false}, {"data": [1.0, 500, 1500, "Tile-62414-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude"], "isController": false}, {"data": [1.0, 500, 1500, "Tile-74729-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude"], "isController": false}, {"data": [1.0, 500, 1500, "Tile-463-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude"], "isController": false}, {"data": [1.0, 500, 1500, "Tile-62516-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude"], "isController": false}, {"data": [1.0, 500, 1500, "Tile-62514-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude"], "isController": false}, {"data": [1.0, 500, 1500, "Tile-332-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude"], "isController": false}, {"data": [1.0, 500, 1500, "Tile-5127-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude"], "isController": false}, {"data": [1.0, 500, 1500, "Tile-62413-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude"], "isController": false}, {"data": [1.0, 500, 1500, "Tile-331-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1886538, 0, 0.0, 14.701789203291252, 0, 81, 4.0, 11.0, 12.0, 16.0, 30834.34941078404, 14100.395295287293, 8349.066450111755], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Tile-62315-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 42853, 0, 0.0, 14.732504142067171, 0, 79, 15.0, 22.0, 24.0, 32.0, 701.702963812019, 321.38543948030946, 190.5013905661536], "isController": false}, {"data": ["Tile-5129-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 42902, 0, 0.0, 14.699804204932105, 0, 71, 15.0, 22.0, 24.0, 31.0, 702.4363088610911, 321.03534428417055, 190.0145093305881], "isController": false}, {"data": ["Tile-453-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 43072, 0, 0.0, 14.647659732540841, 0, 70, 15.0, 22.0, 24.0, 31.0, 704.7120418848167, 321.387230039267, 189.94191753926702], "isController": false}, {"data": ["Tile-5128-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 42952, 0, 0.0, 14.729209349972049, 0, 79, 15.0, 22.0, 24.0, 31.9900000000016, 703.1743693007875, 321.37266096950054, 190.21416044562318], "isController": false}, {"data": ["Tile-321-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 43117, 0, 0.0, 14.864902474661907, 0, 69, 15.0, 22.0, 24.0, 33.0, 704.7449371536915, 321.4022320808339, 189.9507838422059], "isController": false}, {"data": ["Tile-74830-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 42715, 0, 0.0, 14.749127941004273, 0, 80, 15.0, 22.0, 24.0, 32.0, 699.6494791325428, 320.4449274542603, 189.9439015613739], "isController": false}, {"data": ["Tile-322-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 43108, 0, 0.0, 14.66261482787409, 0, 76, 15.0, 22.0, 24.0, 31.0, 705.2548916955697, 321.63479924006936, 190.0882325273215], "isController": false}, {"data": ["Tile-62415-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 42873, 0, 0.0, 14.712779604879495, 0, 80, 15.0, 22.0, 24.0, 31.0, 702.0074665968039, 321.5249041346689, 190.58405831436664], "isController": false}, {"data": ["Tile-74930-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 42678, 0, 0.0, 14.708421200618629, 0, 73, 15.0, 22.0, 24.0, 32.0, 699.0777899719897, 320.18308935240543, 189.78869688692689], "isController": false}, {"data": ["Tile-74931-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 42625, 0, 0.0, 14.716527859237452, 0, 79, 15.0, 22.0, 24.0, 32.0, 698.3583458942264, 319.853578344133, 189.59337906112785], "isController": false}, {"data": ["Tile-454-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 43065, 0, 0.0, 14.642401021711235, 0, 80, 15.0, 22.0, 24.0, 31.0, 704.6090413782948, 321.3402561754528, 189.91415568399353], "isController": false}, {"data": ["Tile-62314-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 42862, 0, 0.0, 14.698357519481162, 0, 78, 15.0, 22.0, 24.0, 32.0, 701.8503356803668, 321.4529369473555, 190.54139972572457], "isController": false}, {"data": ["Tile-62416-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 42799, 0, 0.0, 14.713194233510132, 0, 70, 15.0, 22.0, 24.0, 31.0, 700.864638260243, 321.0014798281777, 190.27379827768314], "isController": false}, {"data": ["Tile-62316-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 42774, 0, 0.0, 14.748562210688734, 0, 73, 15.0, 22.0, 24.0, 31.0, 700.5470208654067, 320.8560085799568, 190.18757011775688], "isController": false}, {"data": ["Tile-5116-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 42989, 0, 0.0, 14.687571239154195, 0, 70, 15.0, 22.0, 24.0, 32.0, 703.6533865846073, 321.5915868374963, 190.34373836321896], "isController": false}, {"data": ["Tile-74928-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 42636, 0, 0.0, 14.742987147012006, 0, 80, 15.0, 22.0, 24.0, 31.0, 698.5271228926716, 319.93087952799124, 189.63919937906516], "isController": false}, {"data": ["Tile-74730-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 42689, 0, 0.0, 14.709995549204734, 0, 77, 15.0, 22.0, 24.0, 31.0, 699.2350657646886, 320.2551228941786, 189.83139480721036], "isController": false}, {"data": ["Tile-74831-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 42650, 0, 0.0, 14.705650644783175, 0, 75, 15.0, 22.0, 24.0, 32.0, 698.6992562497952, 320.00971795034565, 189.6859308959405], "isController": false}, {"data": ["Tile-5115-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 42938, 0, 0.0, 14.67529926871311, 0, 75, 15.0, 22.0, 24.0, 32.0, 702.9912081075329, 321.28895058039586, 190.16461391190097], "isController": false}, {"data": ["Tile-5117-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 43000, 0, 0.0, 14.685465116278952, 0, 73, 15.0, 22.0, 24.0, 32.0, 703.8219166871265, 321.66861036091336, 190.38932707259187], "isController": false}, {"data": ["Tile-74828-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 42669, 0, 0.0, 14.689516979540214, 0, 76, 15.0, 22.0, 24.0, 31.0, 698.9418162757175, 320.12081233721824, 189.75178215297797], "isController": false}, {"data": ["Tile-464-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 43045, 0, 0.0, 14.643071204553408, 0, 80, 15.0, 22.0, 24.0, 31.0, 704.3048578955119, 321.2015318722696, 189.8321687296497], "isController": false}, {"data": ["Tile-465-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 43009, 0, 0.0, 14.637401474109996, 0, 76, 15.0, 22.0, 24.0, 32.0, 703.8194671728743, 320.9801671579417, 189.7013407614388], "isController": false}, {"data": ["Tile-62513-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 42757, 0, 0.0, 14.707954253104898, 0, 70, 15.0, 22.0, 24.0, 32.0, 700.2800661676794, 320.73374124281406, 190.11509608849107], "isController": false}, {"data": ["Tile-5125-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 42913, 0, 0.0, 14.702374571808052, 0, 75, 15.0, 22.0, 24.0, 32.0, 702.5934051540653, 321.1071421993189, 190.05700510515243], "isController": false}, {"data": ["Tile-74728-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 42659, 0, 0.0, 14.781241941911398, 0, 75, 15.0, 22.0, 24.0, 32.0, 698.7894573033891, 320.05103073758744, 189.71041907259982], "isController": false}, {"data": ["Tile-74829-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 85453, 0, 0.0, 14.72749932711565, 0, 79, 15.0, 21.0, 24.0, 30.0, 1399.5839884696018, 641.0204009689875, 379.96518436967705], "isController": false}, {"data": ["Tile-5118-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 42972, 0, 0.0, 14.647607744577874, 0, 77, 15.0, 22.0, 24.0, 31.0, 703.4211818628253, 321.4854620232444, 190.28092517187756], "isController": false}, {"data": ["Tile-62515-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 42835, 0, 0.0, 14.691443912688237, 0, 80, 15.0, 22.0, 24.0, 32.0, 701.4426777146413, 321.26622641422534, 190.4307269576858], "isController": false}, {"data": ["Tile-5126-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 42963, 0, 0.0, 14.663989944836272, 0, 80, 15.0, 22.0, 24.0, 31.9900000000016, 703.3314234263731, 321.44443961283457, 190.25664481357944], "isController": false}, {"data": ["Tile-5119-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 42922, 0, 0.0, 14.715740179861225, 0, 81, 15.0, 22.0, 24.0, 31.0, 702.7292522798343, 321.16922858101805, 190.09375281397863], "isController": false}, {"data": ["Tile-455-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 43030, 0, 0.0, 14.697536602370407, 0, 78, 15.0, 22.0, 24.0, 32.0, 704.1285529610054, 321.12112718045853, 189.78464904027098], "isController": false}, {"data": ["Tile-462-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 43022, 0, 0.0, 14.64541397424572, 0, 76, 15.0, 22.0, 24.0, 31.0, 704.0091638029783, 321.06667919530355, 189.7524699312715], "isController": false}, {"data": ["Tile-62313-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 42784, 0, 0.0, 14.72728122662678, 0, 80, 15.0, 22.0, 24.0, 31.9900000000016, 700.6993236050378, 320.92576442457295, 190.22891793183643], "isController": false}, {"data": ["Tile-62414-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 42888, 0, 0.0, 14.718219548591739, 0, 80, 15.0, 22.0, 24.0, 32.0, 702.2415797488252, 321.6321297873037, 190.64761637712246], "isController": false}, {"data": ["Tile-74729-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 42703, 0, 0.0, 14.734210711191215, 0, 81, 15.0, 22.0, 24.0, 32.0, 699.4529253750901, 320.35490429777076, 189.89054028737797], "isController": false}, {"data": ["Tile-463-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 43055, 0, 0.0, 14.67430031355241, 0, 72, 15.0, 22.0, 24.0, 32.0, 704.4569521253967, 321.27089515875025, 189.87316287754834], "isController": false}, {"data": ["Tile-62516-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 42740, 0, 0.0, 14.691132428638298, 0, 75, 15.0, 22.0, 24.0, 32.0, 700.0131027253668, 320.6114699005831, 190.04261968520703], "isController": false}, {"data": ["Tile-62514-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 42846, 0, 0.0, 14.718806889791376, 0, 71, 15.0, 22.0, 24.0, 31.0, 701.5998297008302, 321.33820325164976, 190.47339126643632], "isController": false}, {"data": ["Tile-332-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 43081, 0, 0.0, 14.637566444604364, 0, 75, 15.0, 22.0, 24.0, 32.0, 704.8477609986747, 321.4491253773253, 189.97849808167405], "isController": false}, {"data": ["Tile-5127-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 42978, 0, 0.0, 14.688584857368767, 0, 80, 15.0, 22.0, 24.0, 31.0, 703.5078816846999, 321.5250865512105, 190.30437815103699], "isController": false}, {"data": ["Tile-62413-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 42821, 0, 0.0, 14.711987109128795, 0, 78, 15.0, 22.0, 24.0, 32.0, 701.2134213241195, 321.1612251963008, 190.36848742979024], "isController": false}, {"data": ["Tile-331-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 43096, 0, 0.0, 14.668066641915752, 0, 75, 15.0, 22.0, 24.0, 31.0, 705.0816399986911, 321.5557869915906, 190.04153578089722], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1886538, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
