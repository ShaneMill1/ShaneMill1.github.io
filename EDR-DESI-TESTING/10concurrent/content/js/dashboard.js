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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1533837, 0, 0.0, 0.3336990827578084, 0, 150, 0.0, 1.0, 1.0, 1.0, 25605.77276217822, 11709.444713474717, 6933.3800220046905], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Tile-62315-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 34861, 0, 0.0, 0.33355325435299904, 0, 11, 0.0, 1.0, 1.0, 2.0, 583.7310158905577, 267.35336567643714, 158.47385001716316], "isController": false}, {"data": ["Tile-5129-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 34861, 0, 0.0, 0.33300823269555974, 0, 8, 0.0, 1.0, 1.0, 2.0, 583.7016944611881, 266.7699150467149, 157.89586852123938], "isController": false}, {"data": ["Tile-453-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 34863, 0, 0.0, 0.3332472822189736, 0, 8, 0.0, 1.0, 1.0, 2.0, 583.5300025106703, 266.121592941878, 157.27957098920413], "isController": false}, {"data": ["Tile-5128-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 34861, 0, 0.0, 0.3293938785462269, 0, 10, 0.0, 1.0, 1.0, 2.0, 583.6723759773637, 266.7565155834045, 157.8879376423142], "isController": false}, {"data": ["Tile-321-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 34864, 0, 0.0, 0.34270307480495726, 0, 150, 0.0, 1.0, 1.0, 2.0, 582.0270112352048, 265.43614672543026, 156.87446787198877], "isController": false}, {"data": ["Tile-74830-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 34857, 0, 0.0, 0.3321284103623384, 0, 8, 0.0, 1.0, 1.0, 2.0, 583.7520096463022, 267.36142729895164, 158.47954949382031], "isController": false}, {"data": ["Tile-322-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 34864, 0, 0.0, 0.33633547498852956, 0, 11, 0.0, 1.0, 1.0, 2.0, 583.5076737685987, 266.1114098143902, 157.2735526954426], "isController": false}, {"data": ["Tile-62415-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 34861, 0, 0.0, 0.3338114225065266, 0, 8, 0.0, 1.0, 1.0, 2.0, 583.7114679436734, 267.3444125640457, 158.4685430550207], "isController": false}, {"data": ["Tile-74930-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 34856, 0, 0.0, 0.3328838650447566, 0, 9, 0.0, 1.0, 1.0, 2.0, 583.7548149388712, 267.3642658264947, 158.48031108692012], "isController": false}, {"data": ["Tile-74931-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 34854, 0, 0.0, 0.33129626441728327, 0, 9, 0.0, 1.0, 1.0, 2.0, 583.7506490026295, 267.36153999949755, 158.47918010032325], "isController": false}, {"data": ["Tile-454-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 34863, 0, 0.0, 0.336660643088661, 0, 11, 0.0, 1.0, 1.0, 2.0, 583.5300025106703, 266.121592941878, 157.27957098920413], "isController": false}, {"data": ["Tile-62314-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 34861, 0, 0.0, 0.3285620033848737, 0, 8, 0.0, 1.0, 1.0, 2.0, 583.7212417534578, 267.3472538647818, 158.47119649166137], "isController": false}, {"data": ["Tile-62416-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 34860, 0, 0.0, 0.3342512908777979, 0, 15, 0.0, 1.0, 1.0, 2.0, 583.7533700621264, 267.3636040616575, 158.4799188254601], "isController": false}, {"data": ["Tile-62316-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 34858, 0, 0.0, 0.33269263870560467, 0, 7, 0.0, 1.0, 1.0, 2.0, 583.7394289541991, 267.3572189253119, 158.47613403248764], "isController": false}, {"data": ["Tile-5116-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 34861, 0, 0.0, 0.3368233842976409, 0, 14, 0.0, 1.0, 1.0, 2.0, 583.6332892467898, 266.7386517260719, 157.87736437632887], "isController": false}, {"data": ["Tile-74928-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 34854, 0, 0.0, 0.33232914443105604, 0, 8, 0.0, 1.0, 1.0, 2.0, 583.7506490026295, 267.36235779514965, 158.47918010032325], "isController": false}, {"data": ["Tile-74730-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 34856, 0, 0.0, 0.3311051182006003, 0, 12, 0.0, 1.0, 1.0, 2.0, 583.7450386026026, 267.35978818810605, 158.47765696437844], "isController": false}, {"data": ["Tile-74831-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 34854, 0, 0.0, 0.3329029666609266, 0, 13, 0.0, 1.0, 1.0, 2.0, 583.7408722449253, 267.35787996374023, 158.4765258633684], "isController": false}, {"data": ["Tile-5115-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 34861, 0, 0.0, 0.334901465821403, 0, 13, 0.0, 1.0, 1.0, 2.0, 583.6821484780497, 266.7609819216087, 157.89058118009746], "isController": false}, {"data": ["Tile-5117-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 34861, 0, 0.0, 0.33226241358538, 0, 9, 0.0, 1.0, 1.0, 2.0, 583.6332892467898, 266.73701679195057, 157.87736437632887], "isController": false}, {"data": ["Tile-74828-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 34856, 0, 0.0, 0.3363552903373869, 0, 14, 0.0, 1.0, 1.0, 2.0, 583.764591602606, 267.367925846606, 158.48296529836372], "isController": false}, {"data": ["Tile-464-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 34863, 0, 0.0, 0.33843903278547355, 0, 15, 0.0, 1.0, 1.0, 1.0, 583.5495371842726, 266.12968451847917, 157.28483619419848], "isController": false}, {"data": ["Tile-465-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 34861, 0, 0.0, 0.33943375118327007, 0, 9, 0.0, 1.0, 1.0, 2.0, 583.6332892467898, 266.1686973420418, 157.3074099922988], "isController": false}, {"data": ["Tile-62513-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 34858, 0, 0.0, 0.32927878822651896, 0, 8, 0.0, 1.0, 1.0, 2.0, 583.7394289541991, 267.3564012392196, 158.47613403248764], "isController": false}, {"data": ["Tile-5125-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 34861, 0, 0.0, 0.32993890020366706, 0, 9, 0.0, 1.0, 1.0, 2.0, 583.6919213059858, 266.76463086019254, 157.89322480640436], "isController": false}, {"data": ["Tile-74728-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 34855, 0, 0.0, 0.33174580404533055, 0, 7, 0.0, 1.0, 1.0, 2.0, 583.7478437086536, 267.3610729485923, 158.4784185068415], "isController": false}, {"data": ["Tile-74829-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 69716, 0, 0.0, 0.33326639508864975, 0, 10, 0.0, 1.0, 1.0, 1.0, 1167.517960913034, 534.7323473322392, 316.96288391974946], "isController": false}, {"data": ["Tile-5118-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 34861, 0, 0.0, 0.3314018530736359, 0, 8, 0.0, 1.0, 1.0, 2.0, 583.6626038039111, 266.7520493947562, 157.88529419305016], "isController": false}, {"data": ["Tile-62515-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 34860, 0, 0.0, 0.33207114170969604, 0, 11, 0.0, 1.0, 1.0, 2.0, 583.7338200572683, 267.354650006698, 158.4746113046099], "isController": false}, {"data": ["Tile-5126-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 34861, 0, 0.0, 0.3323484696365561, 0, 7, 0.0, 1.0, 1.0, 2.0, 583.6626038039111, 266.75098663420005, 157.88529419305016], "isController": false}, {"data": ["Tile-5119-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 34861, 0, 0.0, 0.331057628868934, 0, 8, 0.0, 1.0, 1.0, 2.0, 583.6821484780497, 266.7609819216087, 157.89058118009746], "isController": false}, {"data": ["Tile-455-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 34863, 0, 0.0, 0.3324154547801385, 0, 9, 0.0, 1.0, 1.0, 2.0, 583.5593050115497, 266.13495648475947, 157.28746892889424], "isController": false}, {"data": ["Tile-462-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 34862, 0, 0.0, 0.32620044747863053, 0, 13, 0.0, 1.0, 1.0, 2.0, 583.6402598272283, 266.1718763079254, 157.30928878155763], "isController": false}, {"data": ["Tile-62313-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 34860, 0, 0.0, 0.33904188181296663, 0, 10, 0.0, 1.0, 1.0, 2.0, 583.76314555563, 267.3680813140532, 158.48257271920423], "isController": false}, {"data": ["Tile-62414-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 34861, 0, 0.0, 0.3361923065890239, 0, 7, 0.0, 1.0, 1.0, 2.0, 583.7114679436734, 267.3444125640457, 158.4685430550207], "isController": false}, {"data": ["Tile-74729-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 34857, 0, 0.0, 0.3386407321341464, 0, 9, 0.0, 1.0, 1.0, 2.0, 583.7617859355898, 267.36745859745275, 158.4822036036074], "isController": false}, {"data": ["Tile-463-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 34863, 0, 0.0, 0.3275965923758738, 0, 11, 0.0, 1.0, 1.0, 2.0, 583.539769683985, 266.12604730705175, 157.28220354763658], "isController": false}, {"data": ["Tile-62516-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 34858, 0, 0.0, 0.335389293705894, 0, 6, 0.0, 1.0, 1.0, 2.0, 583.7492045416485, 267.3616962207355, 158.47878795173662], "isController": false}, {"data": ["Tile-62514-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 34861, 0, 0.0, 0.3366225868448997, 0, 8, 0.0, 1.0, 1.0, 2.0, 583.7310158905577, 267.35336567643714, 158.47385001716316], "isController": false}, {"data": ["Tile-332-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 34863, 0, 0.0, 0.3354846111923796, 0, 9, 0.0, 1.0, 1.0, 2.0, 583.5202356643122, 266.1158311068942, 157.27693851889666], "isController": false}, {"data": ["Tile-5127-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 34861, 0, 0.0, 0.33636441869137396, 0, 11, 0.0, 1.0, 1.0, 2.0, 583.6528319576755, 266.7475833556564, 157.8826508323009], "isController": false}, {"data": ["Tile-62413-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 34860, 0, 0.0, 0.334595524956971, 0, 13, 0.0, 1.0, 1.0, 2.0, 583.7435948960112, 267.3583093141934, 158.4772650205968], "isController": false}, {"data": ["Tile-331-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 34864, 0, 0.0, 0.3347579164754507, 0, 15, 0.0, 1.0, 1.0, 2.0, 583.5272063869315, 266.1203177565401, 157.27881734647764], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1533837, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
