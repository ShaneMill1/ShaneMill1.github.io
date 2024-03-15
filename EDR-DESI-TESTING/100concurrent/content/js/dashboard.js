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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1832219, 0, 0.0, 2.9725294847395314, 0, 60, 2.0, 9.0, 10.0, 13.0, 30539.019267951197, 13965.393933163252, 8269.161742944321], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Tile-62315-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 41639, 0, 0.0, 2.974711208242272, 0, 41, 2.0, 9.0, 11.0, 15.0, 695.188326432483, 318.40168466487745, 188.7327683088186], "isController": false}, {"data": ["Tile-5129-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 41646, 0, 0.0, 2.9752197089756325, 0, 33, 2.0, 9.0, 11.0, 15.0, 695.2587646076794, 317.7549822621035, 188.0729275354758], "isController": false}, {"data": ["Tile-453-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 41682, 0, 0.0, 2.9865169617580825, 0, 35, 2.0, 9.0, 11.0, 15.0, 695.5462479349875, 317.20712674378825, 187.4714496387271], "isController": false}, {"data": ["Tile-5128-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 41655, 0, 0.0, 2.9908534389628825, 0, 33, 2.0, 9.0, 11.0, 15.0, 695.3625801282052, 317.80242919921875, 188.10101044483673], "isController": false}, {"data": ["Tile-321-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 41694, 0, 0.0, 3.0826737660095214, 0, 60, 2.0, 9.0, 11.0, 15.0, 694.946329755317, 316.933531245833, 187.3097529418628], "isController": false}, {"data": ["Tile-74830-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 41611, 0, 0.0, 2.9668116603782697, 0, 34, 2.0, 9.0, 10.950000000000728, 14.0, 694.8832704318493, 318.26196663333724, 188.6499503711466], "isController": false}, {"data": ["Tile-322-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 41688, 0, 0.0, 2.9715025906735693, 0, 35, 2.0, 9.0, 10.0, 15.0, 695.5999399309205, 317.23161323021475, 187.48592130950593], "isController": false}, {"data": ["Tile-62415-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 41644, 0, 0.0, 2.9848477571799044, 0, 35, 2.0, 9.0, 11.0, 15.0, 695.2485892684231, 318.4292855145414, 188.7491287271695], "isController": false}, {"data": ["Tile-74930-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 41605, 0, 0.0, 2.9865160437447478, 0, 34, 2.0, 9.0, 11.0, 15.0, 694.8178827301725, 318.23201855512787, 188.6321986318242], "isController": false}, {"data": ["Tile-74931-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 41594, 0, 0.0, 2.9490791941145695, 0, 31, 2.0, 9.0, 10.0, 15.0, 694.6921869258776, 318.17444889476235, 188.59807418495507], "isController": false}, {"data": ["Tile-454-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 41679, 0, 0.0, 2.9812375536841675, 0, 35, 2.0, 9.0, 11.0, 15.0, 695.5890452110349, 317.22664464214193, 187.48298484203676], "isController": false}, {"data": ["Tile-62314-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 41641, 0, 0.0, 2.9632813813309027, 0, 31, 2.0, 9.0, 11.0, 15.0, 695.2101106900178, 318.4091349003289, 188.73868239436032], "isController": false}, {"data": ["Tile-62416-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 41624, 0, 0.0, 2.9622813761291766, 0, 34, 2.0, 9.0, 10.0, 15.0, 695.0191187029337, 318.3241862028085, 188.68683105411677], "isController": false}, {"data": ["Tile-62316-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 41622, 0, 0.0, 2.964465907452786, 0, 33, 2.0, 9.0, 11.0, 15.0, 695.0205390241458, 318.32483672101995, 188.68721664913335], "isController": false}, {"data": ["Tile-5116-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 41660, 0, 0.0, 2.971003360537667, 0, 35, 2.0, 9.0, 11.0, 15.0, 695.3763979302287, 317.80874436654983, 188.1047482682357], "isController": false}, {"data": ["Tile-74928-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 41595, 0, 0.0, 2.9990623873061852, 0, 34, 2.0, 9.0, 11.0, 15.0, 694.6972860125261, 318.17678431628394, 188.59945850730688], "isController": false}, {"data": ["Tile-74730-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 41607, 0, 0.0, 2.9683707068522103, 0, 41, 2.0, 9.0, 10.0, 15.0, 694.8396793587175, 318.2420015812876, 188.6381160759018], "isController": false}, {"data": ["Tile-74831-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 41596, 0, 0.0, 2.97785844792768, 0, 34, 2.0, 9.0, 11.0, 15.0, 694.713987473904, 318.18443371607515, 188.60399269311065], "isController": false}, {"data": ["Tile-5115-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 41653, 0, 0.0, 2.955705471394603, 0, 35, 2.0, 9.0, 10.0, 15.0, 695.3408009615545, 317.7924754394605, 188.09511901010802], "isController": false}, {"data": ["Tile-5117-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 41662, 0, 0.0, 2.9801257740866807, 0, 35, 2.0, 9.0, 11.0, 15.0, 695.3981739580377, 317.81054658159604, 188.11063885388324], "isController": false}, {"data": ["Tile-74828-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 41603, 0, 0.0, 2.9494988342186907, 0, 33, 2.0, 9.0, 10.0, 15.0, 694.8076890959801, 318.22734979102995, 188.62943121941646], "isController": false}, {"data": ["Tile-464-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 41671, 0, 0.0, 2.952844904129972, 0, 34, 2.0, 9.0, 11.0, 15.0, 695.4903531610922, 317.18163567014653, 187.45638425045064], "isController": false}, {"data": ["Tile-465-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 41664, 0, 0.0, 2.9826468894009412, 0, 35, 2.0, 9.0, 11.0, 15.0, 695.419949258913, 317.1495276405395, 187.43740819869143], "isController": false}, {"data": ["Tile-62513-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 41621, 0, 0.0, 2.9733788231902363, 0, 41, 2.0, 9.0, 11.0, 15.0, 695.0154462720213, 318.3225042007598, 188.68583404650582], "isController": false}, {"data": ["Tile-5125-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 41649, 0, 0.0, 2.9618958438377643, 0, 34, 2.0, 9.0, 11.0, 15.0, 695.2972404467371, 317.7725669229228, 188.08333555053338], "isController": false}, {"data": ["Tile-74728-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 41602, 0, 0.0, 2.9724051728282292, 0, 35, 2.0, 9.0, 11.0, 15.0, 694.8025920235152, 318.2250152920202, 188.62804744388404], "isController": false}, {"data": ["Tile-74829-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 83225, 0, 0.0, 2.9694683088014497, 0, 33, 2.0, 9.0, 11.0, 15.0, 1389.7702224300315, 636.5256194528171, 377.30090023002805], "isController": false}, {"data": ["Tile-5118-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 41655, 0, 0.0, 2.9794742527907845, 0, 34, 2.0, 9.0, 11.0, 15.0, 695.3393650051748, 317.7918191625213, 188.0947305726889], "isController": false}, {"data": ["Tile-62515-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 41632, 0, 0.0, 2.9647146425826247, 0, 35, 2.0, 9.0, 10.0, 15.0, 695.106272853255, 318.36410348454746, 188.71049204414538], "isController": false}, {"data": ["Tile-5126-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 41655, 0, 0.0, 2.976521425999276, 0, 35, 2.0, 9.0, 11.0, 15.0, 695.3509723729237, 317.7971240923128, 188.09787045634755], "isController": false}, {"data": ["Tile-5119-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 41651, 0, 0.0, 2.9459316703080405, 0, 34, 2.0, 9.0, 10.0, 15.0, 695.319021067744, 317.7825213473674, 188.08922737867684], "isController": false}, {"data": ["Tile-455-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 41667, 0, 0.0, 2.9758321933424385, 0, 42, 2.0, 9.0, 11.0, 15.0, 695.4351998664775, 317.15648275160646, 187.44151871401152], "isController": false}, {"data": ["Tile-462-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 41666, 0, 0.0, 2.955767292276676, 0, 35, 2.0, 9.0, 10.0, 15.0, 695.4417238328911, 317.1594580370704, 187.44327712683392], "isController": false}, {"data": ["Tile-62313-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 41622, 0, 0.0, 2.9752534717216688, 0, 34, 2.0, 9.0, 11.0, 15.0, 694.9973283462463, 318.3142060492085, 188.68091531275047], "isController": false}, {"data": ["Tile-62414-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 41646, 0, 0.0, 2.974043125390222, 0, 42, 2.0, 9.0, 11.0, 15.0, 695.2703717925174, 318.4392620807526, 188.75504234210922], "isController": false}, {"data": ["Tile-74729-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 41609, 0, 0.0, 2.9753659064144835, 0, 34, 2.0, 9.0, 11.0, 15.0, 694.8614752592642, 318.25198427401847, 188.6440333223393], "isController": false}, {"data": ["Tile-463-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 41676, 0, 0.0, 2.957049620884914, 0, 31, 2.0, 9.0, 10.0, 14.0, 695.5505858005941, 317.2091050477319, 187.4726188290664], "isController": false}, {"data": ["Tile-62516-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 41620, 0, 0.0, 2.97047092743877, 0, 35, 2.0, 9.0, 11.0, 15.0, 695.0103533498096, 318.32017160259835, 188.68445139770222], "isController": false}, {"data": ["Tile-62514-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 41635, 0, 0.0, 2.9646211120451595, 0, 41, 2.0, 9.0, 10.0, 15.0, 695.144755735132, 318.38172894509466, 188.72093954528], "isController": false}, {"data": ["Tile-332-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 41683, 0, 0.0, 2.9734184199793803, 0, 35, 2.0, 9.0, 11.0, 15.0, 695.5513282605795, 317.2094436500885, 187.47281894523428], "isController": false}, {"data": ["Tile-5127-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 41657, 0, 0.0, 2.947115730849572, 0, 41, 2.0, 9.0, 11.0, 15.0, 695.3495359551312, 317.79646760449356, 188.09748189411263], "isController": false}, {"data": ["Tile-62413-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 41627, 0, 0.0, 2.9623561630672555, 0, 35, 2.0, 9.0, 11.0, 15.0, 695.0576056102855, 318.3418135070546, 188.69727964810485], "isController": false}, {"data": ["Tile-331-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 41686, 0, 0.0, 2.9694861584225185, 0, 34, 2.0, 9.0, 11.0, 15.0, 695.5781745369598, 317.22168702027363, 187.48005485566495], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1832219, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
