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

    var data = {"OkPercent": 91.6204736486767, "KoPercent": 8.379526351323301};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7346809240497202, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0011594598281271314, 500, 1500, "NCPPServerlessEastGFSPosition-fulltime-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaHalfGlobe-halftime-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastNWM-position-1year"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastCollections"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaUS-fulltime-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaHalfGlobe-1time-halfzedd"], "isController": false}, {"data": [0.49596410426855325, 500, 1500, "NCPPServerlessEastGFSAreaHalfGlobe-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaGlobe-halftime-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaGlobe-1time-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaGlobe-fulltime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaUS-1time-fullzedd"], "isController": false}, {"data": [0.9999526984873743, 500, 1500, "NCPPServerlessEastRoot"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaUS-fulltime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaHalfGlobe-halftime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaTexas-fulltime-halfzedd"], "isController": false}, {"data": [0.001023331968890708, 500, 1500, "NCPPServerlessEastGFSPosition-halftime-fullzedd"], "isController": false}, {"data": [0.48158881691101263, 500, 1500, "NCPPServerlessEastGFSPosition-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaTexas-halftime-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaHalfGlobe-fulltime-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaUS-1time-halfzedd"], "isController": false}, {"data": [0.5933494708748409, 500, 1500, "NCPPServerlessEastGFSAreaTexas-halftime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaHalfGlobe-fulltime-halfzedd"], "isController": false}, {"data": [0.9711194256244312, 500, 1500, "NCPPServerlessEastGFSCollectionMeta"], "isController": false}, {"data": [0.8843701007094837, 500, 1500, "NCPPServerlessEastGFSPosition-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaGlobe-1time-halfzedd"], "isController": false}, {"data": [0.48611676849966057, 500, 1500, "NCPPServerlessEastGFSPosition-halftime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaTexas-halftime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaUS-halftime-halfzedd"], "isController": false}, {"data": [0.7529645406401105, 500, 1500, "NCPPServerlessEastGFSAreaUS-1time-1zedd"], "isController": false}, {"data": [0.936455229533862, 500, 1500, "NCPPServerlessEastGFSPosition-fulltime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaUS-fulltime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastNWM-position-5year"], "isController": false}, {"data": [0.1886396879570941, 500, 1500, "NCPPServerlessEastGFSAreaGlobe-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaGlobe-halftime-halfzedd"], "isController": false}, {"data": [0.49582229468106787, 500, 1500, "NCPPServerlessEastGFSPosition-fulltime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastNWM-position-1day"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaHalfGlobe-halftime-halfzedd"], "isController": false}, {"data": [0.0011623136879529605, 500, 1500, "NCPPServerlessEastGFSPosition-1time-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaUS-halftime-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaTexas-fulltime-fullzedd"], "isController": false}, {"data": [0.9112572004236303, 500, 1500, "NCPPServerlessEastGFSPosition-halftime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaGlobe-halftime-1zedd"], "isController": false}, {"data": [0.26498436047003127, 500, 1500, "NCPPServerlessEastGFSAreaUS-halftime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaGlobe-fulltime-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastNWM-position-1hour"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSInstances"], "isController": false}, {"data": [5.803830528148578E-4, 500, 1500, "NCPPServerlessEastGFSAreaTexas-1time-halfzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastNWM-position-1month"], "isController": false}, {"data": [0.5332986810473653, 500, 1500, "NCPPServerlessEastGFSAreaTexas-fulltime-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaTexas-1time-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaHalfGlobe-1time-fullzedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaGlobe-fulltime-fullzedd"], "isController": false}, {"data": [0.8092266890005584, 500, 1500, "NCPPServerlessEastGFSAreaTexas-1time-1zedd"], "isController": false}, {"data": [0.0, 500, 1500, "NCPPServerlessEastGFSAreaHalfGlobe-fulltime-1zedd"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1830724, 153406, 8.379526351323301, 1061.8920405260715, 0, 35743, 26002.0, 29146.0, 29176.0, 29366.0, 18.746516050158903, 3559.7187493163233, 7.160359999058027], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["NCPPServerlessEastGFSPosition-fulltime-fullzedd", 14662, 0, 0.0, 2450.9461192197455, 1297, 5209, 2456.0, 2597.0, 2652.0, 2791.0, 8.134190284130785, 1569.8431200208458, 3.431611526117674], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-halftime-fullzedd", 1240, 1240, 100.0, 29108.749999999967, 29036, 29818, 29079.0, 29181.9, 29237.95, 29675.159999999996, 0.6839190769298652, 0.34863843570057584, 0.3479705459770115], "isController": false}, {"data": ["NCPPServerlessEastNWM-position-1year", 1240, 1240, 100.0, 29109.964516128988, 29034, 29874, 29083.0, 29183.9, 29226.9, 29529.8, 0.6833239743665338, 0.3483350728704401, 0.23689454189464795], "isController": false}, {"data": ["NCPPServerlessEastCollections", 1632, 0, 0.0, 22123.077205882357, 21152, 25776, 22038.5, 22652.0, 23007.0, 24898.15000000001, 0.8962591067503907, 30.233865551248776, 0.14616725666730004], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-fulltime-fullzedd", 1362, 1362, 100.0, 26579.421439060196, 25642, 29143, 26402.0, 27410.600000000002, 27905.299999999996, 29045.0, 0.7469328862704193, 0.37434046977800955, 0.8395700704074732], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-1time-halfzedd", 5210, 5210, 100.0, 6903.466410748573, 5085, 18378, 6891.0, 7537.0, 7655.0, 8120.440000000031, 2.8839931736269064, 1.4448129863970733, 1.4786097814005137], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-1time-1zedd", 42122, 0, 0.0, 852.4026874317481, 596, 25201, 818.0, 961.9000000000015, 1024.9500000000007, 1272.9900000000016, 23.38985799054455, 20609.52567186773, 12.014712209986751], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-halftime-fullzedd", 78338, 78338, 100.0, 462.9964257448478, 0, 29956, 1.0, 1.0, 29036.0, 29145.99, 43.05272142023749, 106.80768143374058, 0.3513854547992589], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-1time-fullzedd", 1936, 1936, 100.0, 18648.974173553706, 16775, 24247, 18594.0, 19397.0, 19628.0, 20319.0, 1.061868076055204, 0.5319710185706247, 0.5475257267159646], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-fulltime-1zedd", 1408, 1408, 100.0, 25686.215909090923, 22053, 29194, 25906.5, 26639.100000000002, 26963.95, 28640.86000000002, 0.7715766082960924, 0.3865803278104596, 0.40161165256036846], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-1time-fullzedd", 6830, 0, 0.0, 5265.283162518296, 3033, 7549, 5276.0, 5607.0, 5752.0, 5996.209999999996, 3.784023663721629, 6548.415544837078, 4.253331286077729], "isController": false}, {"data": ["NCPPServerlessEastRoot", 782216, 0, 0.0, 45.78039825316936, 29, 2738, 42.0, 51.0, 55.0, 79.9900000000016, 434.5610645250537, 695.1279528242559, 65.77828613416341], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-fulltime-1zedd", 12106, 0, 0.0, 2966.703618040637, 1511, 25847, 2991.0, 3655.0, 3847.0, 4138.0, 6.717103200694682, 36285.647177388586, 7.58297978515923], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-halftime-1zedd", 5276, 5276, 100.0, 6820.209628506445, 4738, 11041, 6784.0, 7543.0, 7704.0, 8402.979999999989, 2.9207796643760657, 1.490002965897849, 1.4946350187973982], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-fulltime-halfzedd", 11158, 11158, 100.0, 3221.1487721813887, 1977, 17396, 3227.0, 3844.0, 4005.0, 4396.0, 6.18609398449762, 3.0990880996555457, 4.742269314287726], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-halftime-fullzedd", 14658, 0, 0.0, 2451.752080774997, 1229, 4054, 2457.0, 2579.0, 2626.0, 2796.6399999999994, 8.131966651058853, 807.9156516069066, 3.4306734309154536], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-1time-halfzedd", 29330, 0, 0.0, 1224.555199454473, 720, 4751, 1215.0, 1314.0, 1363.9500000000007, 1984.9300000000112, 16.2829107160206, 73.97275454192169, 6.932958078305644], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-halftime-fullzedd", 6572, 6572, 100.0, 5472.687157638487, 3702, 9338, 5487.5, 6069.0, 6180.349999999999, 6412.0, 3.6396038967907574, 1.8233562490758386, 2.7759088314390445], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-fulltime-fullzedd", 1240, 1240, 100.0, 29105.098387096743, 29036, 29817, 29079.0, 29186.0, 29221.8, 29490.159999999996, 0.6840745244027037, 0.348717677478722, 0.348717677478722], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-1time-halfzedd", 13782, 0, 0.0, 2607.2054854157523, 1533, 6895, 2620.0, 2822.0, 2921.0, 3089.0, 7.644978344220392, 6781.319765298416, 8.622998034740775], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-halftime-1zedd", 64446, 0, 0.0, 557.1488377866731, 391, 3828, 546.0, 630.0, 660.0, 749.0, 35.78617585013408, 8329.057691931937, 27.468685759966192], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-fulltime-halfzedd", 1240, 1240, 100.0, 29106.458064516133, 29036, 30168, 29078.0, 29185.0, 29227.95, 29420.429999999993, 0.6839258668484586, 0.3486418969676713, 0.35131348238504806], "isController": false}, {"data": ["NCPPServerlessEastGFSCollectionMeta", 98890, 0, 0.0, 362.9347153402751, 235, 6772, 331.0, 445.90000000000146, 785.0, 1469.9700000000048, 54.9293983095143, 417.4956123466307, 13.14228768147559], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-1time-1zedd", 75266, 0, 0.0, 476.8699545611606, 321, 9469, 463.0, 564.0, 600.0, 812.9800000000032, 41.80227533762393, 137.44947369314434, 16.61477154532514], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-1time-halfzedd", 3898, 3898, 100.0, 9227.789635710647, 7603, 14519, 9129.0, 9931.0, 10141.0, 11088.179999999997, 2.156358685760786, 1.0802851619094562, 1.1202957234616584], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-halftime-halfzedd", 29460, 0, 0.0, 1219.1410047522013, 703, 3990, 1215.0, 1343.0, 1410.0, 2033.8900000000176, 16.354673239624276, 882.4655864345314, 6.963513215308774], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-halftime-halfzedd", 11120, 0, 0.0, 3232.5953237410026, 2250, 5693, 3218.0, 3664.0, 3801.949999999999, 4235.0, 6.167457565451588, 29409.196163835848, 4.727982606327634], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-halftime-halfzedd", 4528, 4528, 100.0, 7949.091872791514, 6254, 24086, 7901.0, 8660.0, 8829.55, 9724.0, 2.504862575538645, 1.254877442628247, 2.825308862057749], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-1time-1zedd", 69488, 0, 0.0, 516.557103384753, 363, 24592, 499.0, 578.0, 606.0, 692.9900000000016, 38.59511729109909, 1818.0034009142237, 43.57026912940484], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-fulltime-1zedd", 79204, 0, 0.0, 453.17817281955655, 321, 3565, 436.0, 508.0, 536.0, 626.0, 43.99237281875225, 627.4927708893508, 18.774088790815167], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-fulltime-halfzedd", 2650, 2650, 100.0, 13603.148679245292, 12758, 17303, 13455.0, 14277.0, 14537.949999999997, 16089.679999999993, 1.4617366976444528, 0.7322958260660197, 1.6487362165813895], "isController": false}, {"data": ["NCPPServerlessEastNWM-position-5year", 1240, 1240, 100.0, 29172.6564516129, 29035, 35743, 29099.0, 29253.0, 29509.95, 30606.699999999997, 0.6811940452653443, 0.3472493082309665, 0.2361561387394504], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-1time-1zedd", 20510, 0, 0.0, 1751.604680643587, 927, 6510, 1603.0, 2389.9000000000015, 2877.850000000002, 4089.9100000000144, 11.37299371463268, 22737.846409350488, 5.919732079979705], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-halftime-halfzedd", 1240, 1240, 100.0, 29107.45322580645, 29036, 29944, 29081.0, 29180.8, 29213.8, 29516.0, 0.6836566367622021, 0.34850465272448194, 0.35518098706786283], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-fulltime-halfzedd", 29442, 0, 0.0, 1219.9091773656733, 742, 3860, 1222.0, 1320.9000000000015, 1354.0, 1443.9900000000016, 16.34429040676421, 1690.0379349900602, 6.959092399755074], "isController": false}, {"data": ["NCPPServerlessEastNWM-position-1day", 1240, 1240, 100.0, 29099.119354838716, 29033, 29920, 29075.0, 29173.0, 29201.85, 29503.26, 0.683709033285051, 0.34853136267069984, 0.23702803400018857], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-halftime-halfzedd", 1240, 1240, 100.0, 29104.1822580645, 29035, 30005, 29079.0, 29184.8, 29260.9, 29459.339999999997, 0.6840190532404024, 0.34868940018700195, 0.35069336225704223], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-1time-fullzedd", 14626, 0, 0.0, 2456.2450430739727, 1242, 5245, 2455.0, 2548.0, 2582.0, 2870.4899999999943, 8.114740409864853, 46.723153766174974, 3.423406110411735], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-halftime-fullzedd", 2324, 2324, 100.0, 15530.34681583478, 13442, 19642, 15456.5, 16314.5, 16593.5, 18048.0, 1.2800705030225417, 0.6412853203618788, 1.4388292470497515], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-fulltime-fullzedd", 5628, 5628, 100.0, 6391.49786780385, 4302, 29075, 6363.5, 7040.1, 7157.0, 7372.97, 3.116113429186488, 1.5611095267776465, 2.3766451056588354], "isController": false}, {"data": ["NCPPServerlessEastGFSPosition-halftime-1zedd", 77426, 0, 0.0, 463.54627644460453, 334, 2961, 444.0, 520.0, 549.0, 635.0, 43.005198326804184, 376.9254443194019, 18.352804364075613], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-halftime-1zedd", 2642, 2642, 100.0, 13640.632853898578, 11468, 17470, 13574.0, 14544.400000000001, 14764.0, 15428.570000000016, 1.457320692188717, 0.7300835108328241, 0.7585468056021349], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-halftime-1zedd", 23658, 0, 0.0, 1518.0241778679467, 962, 26278, 1502.0, 1757.0, 1857.0, 2143.0, 13.132105383230671, 35775.88190092263, 14.82491584278775], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-fulltime-halfzedd", 1244, 1244, 100.0, 29031.175241157565, 26066, 30056, 29071.5, 29173.0, 29201.5, 29565.199999999993, 0.6811507944112782, 0.34665939236585464, 0.3538791236589844], "isController": false}, {"data": ["NCPPServerlessEastNWM-position-1hour", 1240, 1240, 100.0, 29097.759677419355, 29034, 30189, 29077.0, 29172.0, 29197.0, 29328.59, 0.6835077839961062, 0.3484287727011401, 0.2369582649595876], "isController": false}, {"data": ["NCPPServerlessEastGFSInstances", 12612, 0, 0.0, 2849.521091024407, 2419, 6170, 2780.0, 3188.0, 3262.0, 3618.4899999999725, 6.9969603278119195, 6.081342472414656, 1.6467455459010472], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-1time-halfzedd", 13784, 0, 0.0, 2606.5252466628035, 1335, 5489, 2610.0, 2714.5, 2755.0, 2863.0, 7.6482387244797465, 592.7683770796979, 5.863151756559181], "isController": false}, {"data": ["NCPPServerlessEastNWM-position-1month", 1240, 1240, 100.0, 29107.633870967773, 29034, 30573, 29080.0, 29182.0, 29208.75, 29502.859999999997, 0.683654752144829, 0.34850369201132886, 0.23700921583145926], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-fulltime-1zedd", 61564, 0, 0.0, 583.1795204989867, 433, 3080, 568.0, 650.0, 679.0, 790.9800000000032, 34.195307171216484, 15680.551969282322, 26.247569762281405], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-1time-fullzedd", 6844, 0, 0.0, 5252.421390999431, 3785, 6690, 5249.0, 5397.5, 5439.0, 5548.55, 3.7944141610818627, 562.0142482670383, 2.8939818943407567], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-1time-fullzedd", 2548, 2548, 100.0, 14151.227629513342, 12620, 20125, 14088.0, 14905.1, 15147.0, 15658.0, 1.4047297714502456, 0.7037366921425546, 0.7147111434820097], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-fulltime-fullzedd", 1362, 1362, 100.0, 26541.530102789988, 23655, 29333, 26548.0, 28065.7, 28678.599999999984, 29134.0, 0.7472226032094362, 0.3745928199149636, 0.38528665477986557], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-1time-1zedd", 71640, 0, 0.0, 500.9976549413757, 325, 6257, 480.0, 559.0, 589.0, 683.9800000000032, 39.79029558902023, 284.86587594053447, 30.54216048141592], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-fulltime-1zedd", 2922, 2922, 100.0, 12344.177275838478, 10068, 15869, 12151.0, 13142.7, 13431.85, 14829.0, 1.6125952408020812, 0.8078724204408864, 0.8299196209987273], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 19312, 12.588816604304917, 1.0548832046774936], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 20, 0.013037299714483136, 0.001092463965076112], "isController": false}, {"data": ["502/Bad Gateway", 61430, 40.044066073034955, 3.3555030687312777], "isController": false}, {"data": ["504/Gateway Timeout", 14856, 9.684106227918074, 0.811482233258536], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Network is unreachable: connect", 57766, 37.65563276534164, 3.155363670329334], "isController": false}, {"data": ["500/Internal Server Error", 2, 0.0013037299714483137, 1.092463965076112E-4], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 20, 0.013037299714483136, 0.001092463965076112], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1830724, 153406, "502/Bad Gateway", 61430, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Network is unreachable: connect", 57766, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 19312, "504/Gateway Timeout", 14856, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 20], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-halftime-fullzedd", 1240, 1240, "504/Gateway Timeout", 1240, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessEastNWM-position-1year", 1240, 1240, "504/Gateway Timeout", 1240, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-fulltime-fullzedd", 1362, 1362, "502/Bad Gateway", 1332, "504/Gateway Timeout", 30, "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-1time-halfzedd", 5210, 5210, "502/Bad Gateway", 5210, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-halftime-fullzedd", 78338, 78338, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Network is unreachable: connect", 57766, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Permission denied: connect", 19312, "504/Gateway Timeout", 1240, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Software caused connection abort: recv failed", 20, "", ""], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-1time-fullzedd", 1936, 1936, "502/Bad Gateway", 1936, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-fulltime-1zedd", 1408, 1408, "502/Bad Gateway", 1400, "504/Gateway Timeout", 8, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-halftime-1zedd", 5276, 5276, "502/Bad Gateway", 5256, "Non HTTP response code: java.net.SocketTimeoutException/Non HTTP response message: Read timed out", 20, "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-fulltime-halfzedd", 11158, 11158, "502/Bad Gateway", 11158, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-halftime-fullzedd", 6572, 6572, "502/Bad Gateway", 6572, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-fulltime-fullzedd", 1240, 1240, "504/Gateway Timeout", 1240, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-fulltime-halfzedd", 1240, 1240, "504/Gateway Timeout", 1240, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-1time-halfzedd", 3898, 3898, "502/Bad Gateway", 3898, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-halftime-halfzedd", 4528, 4528, "502/Bad Gateway", 4528, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-fulltime-halfzedd", 2650, 2650, "502/Bad Gateway", 2650, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessEastNWM-position-5year", 1240, 1240, "504/Gateway Timeout", 1240, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-halftime-halfzedd", 1240, 1240, "504/Gateway Timeout", 1240, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastNWM-position-1day", 1240, 1240, "504/Gateway Timeout", 1240, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-halftime-halfzedd", 1240, 1240, "504/Gateway Timeout", 1240, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaUS-halftime-fullzedd", 2324, 2324, "502/Bad Gateway", 2324, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaTexas-fulltime-fullzedd", 5628, 5628, "502/Bad Gateway", 5626, "504/Gateway Timeout", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-halftime-1zedd", 2642, 2642, "502/Bad Gateway", 2642, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-fulltime-halfzedd", 1244, 1244, "504/Gateway Timeout", 1126, "502/Bad Gateway", 118, "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessEastNWM-position-1hour", 1240, 1240, "504/Gateway Timeout", 1240, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastNWM-position-1month", 1240, 1240, "504/Gateway Timeout", 1240, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-1time-fullzedd", 2548, 2548, "502/Bad Gateway", 2548, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaGlobe-fulltime-fullzedd", 1362, 1362, "502/Bad Gateway", 1310, "504/Gateway Timeout", 50, "500/Internal Server Error", 2, "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["NCPPServerlessEastGFSAreaHalfGlobe-fulltime-1zedd", 2922, 2922, "502/Bad Gateway", 2922, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
