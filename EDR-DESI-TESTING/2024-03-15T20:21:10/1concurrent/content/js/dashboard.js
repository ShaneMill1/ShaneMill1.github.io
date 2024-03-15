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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 265216, 0, 0.0, 0.20291762186293685, 0, 119, 0.0, 1.0, 1.0, 1.0, 4429.4947807933195, 2025.594956941545, 1199.39248434238], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Tile-62315-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 6028, 0, 0.0, 0.20255474452554725, 0, 2, 0.0, 1.0, 1.0, 1.0, 100.81953503930423, 46.17613470061883, 27.37092845793611], "isController": false}, {"data": ["Tile-5129-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 6028, 0, 0.0, 0.2115129396151299, 0, 119, 0.0, 1.0, 1.0, 1.0, 100.81110460740865, 46.07382515260473, 27.270191383058783], "isController": false}, {"data": ["Tile-453-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 6028, 0, 0.0, 0.19459190444591984, 0, 2, 0.0, 1.0, 1.0, 1.0, 100.77739697400318, 45.96000428404247, 27.162657778149295], "isController": false}, {"data": ["Tile-5128-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 6028, 0, 0.0, 0.21366954213669653, 0, 2, 0.0, 1.0, 1.0, 1.0, 100.80267558528429, 46.06997282608696, 27.26791126672241], "isController": false}, {"data": ["Tile-321-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 6028, 0, 0.0, 0.20952222959522368, 0, 51, 0.0, 1.0, 1.0, 1.0, 100.68481710372474, 45.917782800233844, 27.137704609988308], "isController": false}, {"data": ["Tile-74830-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 6027, 0, 0.0, 0.21005475360876052, 0, 3, 0.0, 1.0, 1.0, 1.0, 100.83654007026936, 46.183678057553955, 27.375545058139533], "isController": false}, {"data": ["Tile-322-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 6028, 0, 0.0, 0.19774386197743915, 0, 1, 0.0, 1.0, 1.0, 1.0, 100.77065815209214, 45.95693101272171, 27.160841455056083], "isController": false}, {"data": ["Tile-62415-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 6028, 0, 0.0, 0.2085268745852692, 0, 2, 0.0, 1.0, 1.0, 1.0, 100.81616269735082, 46.174590141657745, 27.3700129197886], "isController": false}, {"data": ["Tile-74930-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 6027, 0, 0.0, 0.1991040318566451, 0, 3, 0.0, 1.0, 1.0, 1.0, 100.8416015526963, 46.186241336147035, 27.376919171532784], "isController": false}, {"data": ["Tile-74931-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 6027, 0, 0.0, 0.20358387257341948, 0, 1, 0.0, 1.0, 1.0, 1.0, 100.84835098639626, 46.18916922364172, 27.378751537322426], "isController": false}, {"data": ["Tile-454-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 6028, 0, 0.0, 0.21068347710683474, 0, 3, 0.0, 1.0, 1.0, 1.0, 100.77908182030963, 45.96077266609824, 27.16311189688033], "isController": false}, {"data": ["Tile-62314-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 6028, 0, 0.0, 0.20371599203715926, 0, 2, 0.0, 1.0, 1.0, 1.0, 100.81616269735082, 46.17434515173434, 27.3700129197886], "isController": false}, {"data": ["Tile-62416-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 6027, 0, 0.0, 0.20341795254687187, 0, 1, 0.0, 1.0, 1.0, 1.0, 100.82304526748972, 46.17774241255144, 27.371881430041153], "isController": false}, {"data": ["Tile-62316-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 6027, 0, 0.0, 0.2044134727061549, 0, 1, 0.0, 1.0, 1.0, 1.0, 100.82641862955032, 46.17928743872959, 27.372797245131824], "isController": false}, {"data": ["Tile-5116-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 6028, 0, 0.0, 0.19873921698739172, 0, 2, 0.0, 1.0, 1.0, 1.0, 100.79087732205261, 46.06458065109435, 27.264719744344305], "isController": false}, {"data": ["Tile-74928-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 6027, 0, 0.0, 0.2083955533432882, 0, 4, 0.0, 1.0, 1.0, 1.0, 100.8466635432702, 46.18855976737668, 27.37829342287999], "isController": false}, {"data": ["Tile-74730-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 6027, 0, 0.0, 0.19429235108677623, 0, 4, 0.0, 1.0, 1.0, 1.0, 100.83991433543032, 46.18546857745784, 27.376461118407843], "isController": false}, {"data": ["Tile-74831-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 6027, 0, 0.0, 0.208229633316741, 0, 1, 0.0, 1.0, 1.0, 1.0, 100.8449761566134, 46.18778693110516, 27.377835323768092], "isController": false}, {"data": ["Tile-5115-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 6028, 0, 0.0, 0.19757796947578005, 0, 2, 0.0, 1.0, 1.0, 1.0, 100.80267558528429, 46.06997282608696, 27.26791126672241], "isController": false}, {"data": ["Tile-5117-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 6028, 0, 0.0, 0.2033842070338423, 0, 1, 0.0, 1.0, 1.0, 1.0, 100.78919208132692, 46.06356551903591, 27.264263873562065], "isController": false}, {"data": ["Tile-74828-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 6027, 0, 0.0, 0.2019246723079476, 0, 1, 0.0, 1.0, 1.0, 1.0, 100.84328882642305, 46.186850723028144, 27.377377239985947], "isController": false}, {"data": ["Tile-464-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 6028, 0, 0.0, 0.19442601194426057, 0, 1, 0.0, 1.0, 1.0, 1.0, 100.78245168193673, 45.962146235287236, 27.164020179897012], "isController": false}, {"data": ["Tile-465-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 6028, 0, 0.0, 0.2035500995355008, 0, 4, 0.0, 1.0, 1.0, 1.0, 100.78750689695532, 45.96461496179505, 27.165382718319986], "isController": false}, {"data": ["Tile-62513-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 6027, 0, 0.0, 0.1904761904761902, 0, 3, 0.0, 1.0, 1.0, 1.0, 100.82810539523213, 46.17989661752405, 27.37325517565872], "isController": false}, {"data": ["Tile-5125-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 6028, 0, 0.0, 0.20437956204379623, 0, 2, 0.0, 1.0, 1.0, 1.0, 100.80773282940615, 46.07212083173069, 27.2692792907671], "isController": false}, {"data": ["Tile-74728-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 6027, 0, 0.0, 0.20059731209557027, 0, 4, 0.0, 1.0, 1.0, 1.0, 100.84328882642305, 46.187014120695714, 27.377377239985947], "isController": false}, {"data": ["Tile-74829-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 12054, 0, 0.0, 0.20001659200265576, 0, 1, 0.0, 1.0, 1.0, 1.0, 201.66295819182577, 92.36321034371706, 54.74834216535894], "isController": false}, {"data": ["Tile-5118-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 6028, 0, 0.0, 0.19508958195089618, 0, 4, 0.0, 1.0, 1.0, 1.0, 100.79761884855274, 46.06766173937763, 27.266543379930773], "isController": false}, {"data": ["Tile-62515-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 6028, 0, 0.0, 0.19575315195753157, 0, 1, 0.0, 1.0, 1.0, 1.0, 100.82290760687764, 46.17767936291564, 27.37184405733592], "isController": false}, {"data": ["Tile-5126-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 6028, 0, 0.0, 0.20952222959522232, 0, 2, 0.0, 1.0, 1.0, 1.0, 100.79930437109127, 46.068268776545935, 27.266999326945587], "isController": false}, {"data": ["Tile-5119-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 6028, 0, 0.0, 0.2030524220305238, 0, 2, 0.0, 1.0, 1.0, 1.0, 100.80604702498411, 46.071513679387266, 27.268823267500583], "isController": false}, {"data": ["Tile-455-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 6028, 0, 0.0, 0.20139349701393483, 0, 4, 0.0, 1.0, 1.0, 1.0, 100.78413669726305, 45.96307796642758, 27.164474344184182], "isController": false}, {"data": ["Tile-462-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 6028, 0, 0.0, 0.21698739216987387, 0, 1, 0.0, 1.0, 1.0, 1.0, 100.78582176893495, 45.96384645126233, 27.16492852365825], "isController": false}, {"data": ["Tile-62313-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 6027, 0, 0.0, 0.20408163265306178, 0, 1, 0.0, 1.0, 1.0, 1.0, 100.82473192030379, 46.17851491271726, 27.372339329926227], "isController": false}, {"data": ["Tile-62414-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 6028, 0, 0.0, 0.20554080955540743, 0, 1, 0.0, 1.0, 1.0, 1.0, 100.81279058099476, 46.173045686022014, 27.36909744288725], "isController": false}, {"data": ["Tile-74729-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 6027, 0, 0.0, 0.20839555334328963, 0, 1, 0.0, 1.0, 1.0, 1.0, 100.83822717462229, 46.184695844626816, 27.37600308061035], "isController": false}, {"data": ["Tile-463-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 6028, 0, 0.0, 0.20039814200398157, 0, 6, 0.0, 1.0, 1.0, 1.0, 100.7807667229532, 45.961541073846824, 27.16356603079598], "isController": false}, {"data": ["Tile-62516-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 6027, 0, 0.0, 0.19777667164426774, 0, 1, 0.0, 1.0, 1.0, 1.0, 100.83147909591288, 46.18160517185853, 27.37417108267947], "isController": false}, {"data": ["Tile-62514-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 6028, 0, 0.0, 0.19459190444591856, 0, 1, 0.0, 1.0, 1.0, 1.0, 100.82122129488702, 46.17690701884962, 27.371386249979093], "isController": false}, {"data": ["Tile-332-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 6028, 0, 0.0, 0.21101526211015278, 0, 4, 0.0, 1.0, 1.0, 1.0, 100.77571218403104, 45.958991036052225, 27.16220367460211], "isController": false}, {"data": ["Tile-5127-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 6028, 0, 0.0, 0.19990046449900534, 0, 1, 0.0, 1.0, 1.0, 1.0, 100.79424797257755, 46.06612114371708, 27.265631531644512], "isController": false}, {"data": ["Tile-62413-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 6028, 0, 0.0, 0.20305242203052404, 0, 1, 0.0, 1.0, 1.0, 1.0, 100.82628040009367, 46.1790607855518, 27.372759717994178], "isController": false}, {"data": ["Tile-331-MRMS_Tiles_CONUS-ReflectivityAtLowestAltitude", 6028, 0, 0.0, 0.20272063702720658, 0, 1, 0.0, 1.0, 1.0, 1.0, 100.77234277307834, 45.95769929201913, 27.16129551305627], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 265216, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
