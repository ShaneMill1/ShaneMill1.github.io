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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2035195, 0, 0.0, 1.3197015519397706, 0, 49, 1.0, 4.0, 6.0, 10.0, 33959.53612547973, 15529.591310304731, 9195.35664329739], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Tile-62315-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 46251, 0, 0.0, 1.323193012042969, 0, 26, 1.0, 3.0, 6.0, 10.0, 772.9886017983087, 354.0348185970769, 209.8543274413377], "isController": false}, {"data": ["Tile-5129-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 46254, 0, 0.0, 1.3154321788385934, 0, 21, 1.0, 3.0, 5.0, 9.0, 772.9999832879322, 353.28514861206276, 209.1025345417551], "isController": false}, {"data": ["Tile-453-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 46274, 0, 0.0, 1.3102174007001859, 0, 26, 1.0, 3.0, 6.0, 10.0, 772.9466985150417, 352.50596504543404, 208.33328983413233], "isController": false}, {"data": ["Tile-5128-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 46259, 0, 0.0, 1.3236559372230345, 0, 21, 1.0, 3.0, 6.0, 9.0, 772.9027083925081, 353.24069094501345, 209.07622092258276], "isController": false}, {"data": ["Tile-321-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 46279, 0, 0.0, 1.392532250048624, 0, 49, 1.0, 4.0, 6.0, 10.0, 772.282019190655, 352.2028349238632, 208.15413798498125], "isController": false}, {"data": ["Tile-74830-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 46240, 0, 0.0, 1.302897923875438, 0, 22, 1.0, 3.0, 6.0, 9.0, 772.9468599033817, 354.01202753853033, 209.84299516908212], "isController": false}, {"data": ["Tile-322-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 46277, 0, 0.0, 1.3187112388443512, 0, 22, 1.0, 3.0, 6.0, 9.9900000000016, 772.9322554783539, 352.4993782308508, 208.32939698440006], "isController": false}, {"data": ["Tile-62415-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 46252, 0, 0.0, 1.3092623021707106, 0, 19, 1.0, 3.0, 6.0, 9.0, 772.9794772377833, 354.0306394770707, 209.8518502657263], "isController": false}, {"data": ["Tile-74930-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 46238, 0, 0.0, 1.32038582983693, 0, 22, 1.0, 3.0, 6.0, 10.0, 772.9521899030425, 354.01814166457706, 209.8444421807088], "isController": false}, {"data": ["Tile-74931-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 46229, 0, 0.0, 1.3260291159229023, 0, 20, 1.0, 3.0, 6.0, 9.0, 772.8663378751149, 353.9788207650673, 209.82113469656443], "isController": false}, {"data": ["Tile-454-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 46273, 0, 0.0, 1.3097054437793008, 0, 25, 1.0, 3.0, 6.0, 9.0, 772.9429058230047, 352.50423537045236, 208.33226758510673], "isController": false}, {"data": ["Tile-62314-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 46252, 0, 0.0, 1.2946899593530952, 0, 25, 1.0, 3.0, 6.0, 9.0, 773.0053147040145, 354.03839293921516, 209.85886473409766], "isController": false}, {"data": ["Tile-62416-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 46249, 0, 0.0, 1.310190490605198, 0, 22, 1.0, 3.0, 5.0, 9.0, 772.9810135044793, 354.0313430992195, 209.8522673381301], "isController": false}, {"data": ["Tile-62316-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 46247, 0, 0.0, 1.3100957899971777, 0, 22, 1.0, 3.0, 6.0, 9.0, 772.9605054236098, 354.0219502379619, 209.8466997146128], "isController": false}, {"data": ["Tile-5116-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 46265, 0, 0.0, 1.314946503836584, 0, 25, 1.0, 3.0, 6.0, 10.0, 772.9771272952066, 353.2747027091374, 209.09635181716038], "isController": false}, {"data": ["Tile-74928-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 46230, 0, 0.0, 1.3346528228423127, 0, 26, 1.0, 3.0, 6.0, 10.0, 772.8701350809148, 353.98055991498927, 209.82216557860772], "isController": false}, {"data": ["Tile-74730-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 46238, 0, 0.0, 1.3195423677494706, 0, 24, 1.0, 3.0, 6.0, 9.0, 772.9263481662265, 354.00630594722674, 209.83742655294037], "isController": false}, {"data": ["Tile-74831-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 46231, 0, 0.0, 1.3074992970084927, 0, 20, 1.0, 3.0, 6.0, 10.0, 772.8868530159154, 353.98821685982847, 209.82670423674267], "isController": false}, {"data": ["Tile-5115-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 46256, 0, 0.0, 1.3358050847457668, 0, 22, 1.0, 3.0, 6.0, 10.0, 772.8525839167265, 353.2177824931914, 209.06266186028637], "isController": false}, {"data": ["Tile-5117-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 46268, 0, 0.0, 1.325105904728989, 0, 22, 1.0, 3.0, 6.0, 9.0, 772.962678338735, 353.264020421247, 209.09244326155235], "isController": false}, {"data": ["Tile-74828-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 46234, 0, 0.0, 1.3145088030453782, 0, 26, 1.0, 3.0, 6.0, 9.0, 772.9240851263019, 354.005187828084, 209.83681217296086], "isController": false}, {"data": ["Tile-464-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 46273, 0, 0.0, 1.3132064054632266, 0, 26, 1.0, 3.0, 6.0, 9.0, 772.9687291193371, 352.51601220579147, 208.33922777044634], "isController": false}, {"data": ["Tile-465-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 46269, 0, 0.0, 1.3345004214484801, 0, 22, 1.0, 3.0, 6.0, 9.0, 772.9793845434194, 352.5208716618915, 208.34209974021852], "isController": false}, {"data": ["Tile-62513-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 46247, 0, 0.0, 1.329988972257674, 0, 22, 1.0, 3.0, 6.0, 9.0, 772.9863444149158, 354.0337846978472, 209.85371459701815], "isController": false}, {"data": ["Tile-5125-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 46254, 0, 0.0, 1.3245773338522193, 0, 25, 1.0, 3.0, 6.0, 10.0, 772.9999832879322, 353.28514861206276, 209.1025345417551], "isController": false}, {"data": ["Tile-74728-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 46234, 0, 0.0, 1.3240039797551622, 0, 25, 1.0, 3.0, 6.0, 9.0, 772.9240851263019, 354.0052694572613, 209.83681217296086], "isController": false}, {"data": ["Tile-74829-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 92484, 0, 0.0, 1.3150599022533522, 0, 25, 1.0, 4.0, 6.0, 10.0, 1545.9089009611366, 708.0383540534893, 419.6901117843711], "isController": false}, {"data": ["Tile-5118-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 46261, 0, 0.0, 1.3078619139231675, 0, 22, 1.0, 3.0, 5.950000000000728, 9.0, 772.9232105861124, 353.2500610881842, 209.08176692612614], "isController": false}, {"data": ["Tile-62515-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 46249, 0, 0.0, 1.3185798611861999, 0, 25, 1.0, 3.0, 6.0, 9.0, 772.9680945297746, 354.02542610787526, 209.84876003835677], "isController": false}, {"data": ["Tile-5126-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 46259, 0, 0.0, 1.3044596727123265, 0, 24, 1.0, 3.0, 5.0, 9.0, 772.8897948272405, 353.2342179720394, 209.07272770229065], "isController": false}, {"data": ["Tile-5119-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 46255, 0, 0.0, 1.3123338017511579, 0, 26, 1.0, 3.0, 6.0, 10.0, 773.0037768642, 353.2868823949664, 209.10356073377284], "isController": false}, {"data": ["Tile-455-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 46273, 0, 0.0, 1.314070840446899, 0, 25, 1.0, 3.0, 6.0, 9.0, 773.0074672992433, 352.5336789343229, 208.34966892049917], "isController": false}, {"data": ["Tile-462-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 46270, 0, 0.0, 1.3251566889993558, 0, 22, 1.0, 3.0, 6.0, 10.0, 772.9702639492149, 352.5167121721517, 208.3396414550618], "isController": false}, {"data": ["Tile-62313-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 46248, 0, 0.0, 1.3233437121605256, 0, 26, 1.0, 3.0, 6.0, 9.0, 772.9772191673213, 354.02960526315786, 209.85123723487823], "isController": false}, {"data": ["Tile-62414-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 46253, 0, 0.0, 1.3265950316736095, 0, 21, 1.0, 3.0, 6.0, 10.0, 772.9961895848653, 354.03829386259946, 209.85638740682867], "isController": false}, {"data": ["Tile-74729-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 46238, 0, 0.0, 1.3243652407111044, 0, 22, 1.0, 3.0, 6.0, 10.0, 772.9134279457734, 354.00038838532004, 209.8339189149658], "isController": false}, {"data": ["Tile-463-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 46273, 0, 0.0, 1.318068852246435, 0, 24, 1.0, 3.0, 6.0, 10.0, 772.9687291193371, 352.51601220579147, 208.33922777044634], "isController": false}, {"data": ["Tile-62516-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 46245, 0, 0.0, 1.3301762352686928, 0, 22, 1.0, 3.0, 6.0, 9.0, 772.9658353947984, 354.02439140640666, 209.84814671850972], "isController": false}, {"data": ["Tile-62514-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 46249, 0, 0.0, 1.3302341672252238, 0, 22, 1.0, 3.0, 6.0, 9.0, 772.9680945297746, 354.02542610787526, 209.84876003835677], "isController": false}, {"data": ["Tile-332-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 46276, 0, 0.0, 1.3192367533926828, 0, 25, 1.0, 3.0, 6.0, 9.0, 772.9542835190165, 352.5073852651205, 208.3353342297349], "isController": false}, {"data": ["Tile-5127-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 46264, 0, 0.0, 1.3201841604703473, 0, 26, 1.0, 3.0, 6.0, 9.0, 772.9604196949192, 353.26706681369353, 209.09183228075452], "isController": false}, {"data": ["Tile-62413-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 46249, 0, 0.0, 1.308871543168512, 0, 26, 1.0, 3.0, 5.0, 9.0, 772.9810135044793, 354.0310982730813, 209.8522673381301], "isController": false}, {"data": ["Tile-331-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 46276, 0, 0.0, 1.3078485608090602, 0, 25, 1.0, 3.0, 6.0, 9.0, 772.9284628618196, 352.49764859030245, 208.3283747557248], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2035195, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
