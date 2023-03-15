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

    var data = {"OkPercent": 99.98987326270523, "KoPercent": 0.01012673729477166};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8792028903592284, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9605490099453454, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.9558765019495504, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.060283568706568036, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal-1"], "isController": false}, {"data": [0.9976238511544496, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal-0"], "isController": false}, {"data": [0.9988856285279096, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertUSA-0"], "isController": false}, {"data": [0.9522237250377914, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.9923562812888486, 500, 1500, "WIFSGriddedLowResItemGlobal"], "isController": false}, {"data": [0.9752150344951169, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertUSA-1"], "isController": false}, {"data": [0.8321795177846741, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.98226767342451, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.8926838966202784, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.9948761885562611, 500, 1500, "WIFSGriddedLowResItemGlobal-1"], "isController": false}, {"data": [0.9665791358319408, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteIWXXM-1"], "isController": false}, {"data": [0.9988912408023385, 500, 1500, "WIFSGriddedLowResItemGlobal-0"], "isController": false}, {"data": [0.9695890226525598, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.9917235045750317, 500, 1500, "WIFSGriddedHighResItemSector"], "isController": false}, {"data": [0.9986877684110068, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteTAC-0"], "isController": false}, {"data": [0.9820941738749958, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertUSA"], "isController": false}, {"data": [0.9652457451884842, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteTAC-1"], "isController": false}, {"data": [0.6758377760853008, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica"], "isController": false}, {"data": [0.8335188424232788, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.9246558994351182, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM-1"], "isController": false}, {"data": [0.9984883443392474, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM-0"], "isController": false}, {"data": [0.9983687435346542, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM-0"], "isController": false}, {"data": [0.9214211824620037, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM-1"], "isController": false}, {"data": [0.9987268242221692, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteTAC-0"], "isController": false}, {"data": [0.8740749582239198, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteTAC-1"], "isController": false}, {"data": [0.9882517639153321, 500, 1500, "WIFSGriddedHighResItemGlobal"], "isController": false}, {"data": [0.8754871550147141, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteTAC-1"], "isController": false}, {"data": [0.9981706832100533, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteIWXXM-0"], "isController": false}, {"data": [0.966396245923805, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteIWXXM-1"], "isController": false}, {"data": [0.9985683607730852, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteTAC-0"], "isController": false}, {"data": [0.836832895888014, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteTAC"], "isController": false}, {"data": [0.9445921836604168, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal-1"], "isController": false}, {"data": [0.9987601126558274, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal-0"], "isController": false}, {"data": [0.9545093049149038, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.9987673956262425, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM-0"], "isController": false}, {"data": [0.9269582504970179, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM-1"], "isController": false}, {"data": [0.9561968359965021, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.9827889912374199, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertWesternHemi-1"], "isController": false}, {"data": [0.9886461804270024, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertUSA-1"], "isController": false}, {"data": [0.9245856756544473, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.9923899652816665, 500, 1500, "WIFSGriddedHighResItemGlobal-1"], "isController": false}, {"data": [0.9983253240133974, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertWesternHemi-0"], "isController": false}, {"data": [0.9965164417219212, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertUSA-0"], "isController": false}, {"data": [0.9985944674655617, 500, 1500, "WIFSGriddedHighResItemGlobal-0"], "isController": false}, {"data": [0.2772512910127589, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertWesternHemi-1"], "isController": false}, {"data": [0.9986648565562275, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertWesternHemi-0"], "isController": false}, {"data": [0.9988500072926367, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica-0"], "isController": false}, {"data": [0.9990460290961126, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteIWXXM-0"], "isController": false}, {"data": [0.968002225932109, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteIWXXM-1"], "isController": false}, {"data": [0.998695174947359, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica-0"], "isController": false}, {"data": [0.6993974284306259, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica-1"], "isController": false}, {"data": [0.9908056680616172, 500, 1500, "WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica-1"], "isController": false}, {"data": [0.056842636180228646, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal"], "isController": false}, {"data": [0.9984101748807631, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteTAC-0"], "isController": false}, {"data": [0.9606120826709063, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteTAC-1"], "isController": false}, {"data": [0.9476550079491256, 500, 1500, "WIFSOpmetGlobalAllDataVarOneMinuteTAC"], "isController": false}, {"data": [0.8916779377834354, 500, 1500, "WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.9986074639929975, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteIWXXM-0"], "isController": false}, {"data": [0.2666487437129639, 500, 1500, "WIFSGriddedHighResCubeFullTimeFullVertWesternHemi"], "isController": false}, {"data": [0.9542670802513322, 500, 1500, "WIFSOpmetNamCarAllDataVarOneMinuteIWXXM"], "isController": false}, {"data": [0.9985679051634975, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteTAC-0"], "isController": false}, {"data": [0.9636407033176864, 500, 1500, "WIFSOpmetEurNatAllDataVarOneMinuteTAC-1"], "isController": false}, {"data": [0.8735093019557958, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteTAC-1"], "isController": false}, {"data": [0.9983701701383367, 500, 1500, "WIFSOpmetGlobalAllDataVarFiveMinuteTAC-0"], "isController": false}, {"data": [0.8899498687037479, 500, 1500, "WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM"], "isController": false}, {"data": [0.9946353974173751, 500, 1500, "WIFSGriddedHighResItemSector-1"], "isController": false}, {"data": [0.9988632418327006, 500, 1500, "WIFSGriddedHighResItemSector-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3396948, 344, 0.01012673729477166, 393.6288951141031, 0, 90477, 136.0, 2059.9000000000015, 4213.750000000004, 7113.970000000005, 942.9968159143211, 2036806.6772081745, 361.74895973290603], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 89288, 13, 0.014559627273541797, 259.28623107248484, 7, 90477, 265.0, 564.0, 704.0, 1064.9600000000064, 24.802628709748298, 26879.445281186556, 16.373610359169778], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM", 12567, 0, 0.0, 211.77910400254615, 81, 1870, 117.0, 449.0, 593.0, 924.3199999999997, 3.4935845311516154, 4.38062747851433, 1.8764370040365121], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal-1", 89220, 45, 0.05043712172158709, 3140.8665994171306, 121, 90243, 4380.0, 6961.0, 7604.0, 8900.980000000003, 24.771958875549643, 542663.4050092004, 8.128299006039727], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal-0", 89220, 0, 0.0, 34.466599417171125, 0, 7261, 6.0, 223.0, 234.0, 462.0, 24.786638218429125, 18.904652781829245, 8.133115665422057], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA-0", 89288, 0, 0.0, 30.188580772332102, 0, 3695, 5.0, 218.0, 232.0, 449.9900000000016, 24.805136825799252, 18.967209115821106, 8.187633053828268], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC", 12569, 0, 0.0, 230.88646670379467, 90, 2836, 139.0, 478.0, 640.0, 924.2999999999993, 3.492796679995187, 28.78828513589783, 1.9305887899192147], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal", 89289, 0, 0.0, 74.8347276820207, 1, 30227, 17.0, 247.0, 312.0, 686.0, 24.80424318709065, 418.780454994042, 9.834494857381644], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA-1", 89288, 13, 0.014559627273541797, 229.05315383926109, 6, 90475, 238.0, 496.0, 609.0, 939.9700000000048, 24.802642489219956, 26860.494912639493, 8.186809727887056], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC", 12567, 0, 0.0, 489.3288772181113, 286, 7353, 392.0, 777.0, 915.5999999999985, 1265.3199999999997, 3.4930941414860173, 100.0546330702406, 1.9307532071104354], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 89131, 17, 0.019073049780659927, 152.00990676644295, 3, 90452, 100.0, 339.0, 493.0, 799.9900000000016, 24.7642174547849, 9551.599740418664, 15.719473970322449], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM", 12575, 0, 0.0, 398.8560636182887, 228, 3813, 307.0, 681.0, 811.0, 1127.2399999999998, 3.4940232058711813, 4.374353271412944, 1.8698483562669994], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal-1", 89289, 0, 0.0, 43.94109016788201, 1, 3380, 11.0, 229.0, 242.0, 664.0, 24.804250077644365, 403.0841318278949, 4.9172487946892645], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM-1", 12567, 0, 0.0, 180.77432959338037, 79, 1826, 107.0, 372.2000000000007, 549.5999999999985, 803.9599999999991, 3.493586473562638, 1.9242019248919218, 0.9382190236618413], "isController": false}, {"data": ["WIFSGriddedLowResItemGlobal-0", 89289, 0, 0.0, 30.851829452676085, 0, 30202, 5.0, 218.0, 231.0, 442.0, 24.804291421047076, 15.696465664881353, 4.917256990695856], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 89129, 4, 0.0044878771219244015, 224.59541787746028, 7, 90467, 238.0, 526.0, 658.0, 1024.9800000000032, 24.762010598915104, 25145.14206614815, 15.766436436027975], "isController": false}, {"data": ["WIFSGriddedHighResItemSector", 89289, 0, 0.0, 74.32799112992691, 1, 14052, 17.0, 247.0, 344.0, 707.9900000000016, 24.806234716448976, 389.8653861241922, 10.077532853557397], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC-0", 12574, 0, 0.0, 32.56728169238113, 0, 2089, 6.0, 216.0, 224.0, 438.0, 3.493948250441676, 2.483978834298379, 0.9656126512451116], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 89133, 73, 0.0819000819000819, 184.34492275588107, 2, 90247, 48.0, 282.0, 486.0, 1093.0, 24.764195174075624, 3119.019050291879, 15.671092258594733], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC-1", 12574, 0, 0.0, 196.43303642436712, 88, 2268, 124.0, 403.0, 591.0, 836.75, 3.4936298352764923, 14.96733797593552, 0.9655246517414525], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 89284, 1, 0.0011200215044128846, 668.3935867568597, 21, 90017, 816.0, 1455.0, 1682.0, 2183.980000000003, 24.795249789563634, 94600.88283481894, 16.41716734113686], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC", 12578, 0, 0.0, 497.01049451423046, 292, 3946, 406.0, 777.0, 928.0499999999993, 1223.6299999999974, 3.4942645223250386, 178.25867615404073, 1.9245753814368378], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM-1", 12569, 0, 0.0, 367.88654626461897, 224, 2046, 294.0, 576.0, 767.0, 1043.5999999999985, 3.4932762284067365, 1.9240310476771478, 0.9381357058709497], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM-0", 12569, 0, 0.0, 32.23987588511397, 0, 1724, 6.0, 215.0, 223.0, 439.0, 3.4935412985000203, 2.456396225507827, 0.9382068916870171], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM-0", 12567, 0, 0.0, 30.987029521763347, 0, 1774, 6.0, 44.20000000000073, 223.0, 438.3199999999997, 3.4934340008673126, 2.4563207818598287, 0.9381780764047958], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM-1", 12567, 0, 0.0, 371.21771305800974, 221, 3817, 295.0, 596.0, 765.5999999999985, 1037.9599999999991, 3.4931553112944242, 1.923964448798882, 0.9381032330136394], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC-0", 12567, 0, 0.0, 32.03071536564021, 0, 1754, 6.0, 215.0, 223.0, 439.0, 3.4934611924747836, 2.4836325665250416, 0.9654780444046522], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteTAC-1", 12567, 0, 0.0, 457.2329115938585, 281, 7349, 376.0, 687.0, 871.0, 1200.3199999999997, 3.493099967089756, 97.57142417838699, 0.9653782135609383], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal", 89290, 0, 0.0, 100.98269683054995, 2, 53501, 48.0, 279.0, 462.0, 734.9900000000016, 24.803039587640093, 3759.831430002334, 10.027791395784178], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC-1", 12573, 0, 0.0, 446.96619740714135, 277, 3624, 367.0, 678.6000000000004, 869.2999999999993, 1111.2600000000002, 3.4936820290865076, 60.1568374383333, 0.9655390763979312], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM-0", 12573, 0, 0.0, 32.19024894615434, 0, 3504, 6.0, 214.0, 223.0, 439.0, 3.4940189276727245, 2.456732058519884, 0.9383351612402336], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM-1", 12573, 0, 0.0, 180.62697844587575, 77, 2746, 107.0, 372.0, 549.0, 777.5200000000004, 3.493924744868185, 1.92438823838443, 0.9383098680065927], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC-0", 12573, 0, 0.0, 31.54481826135373, 0, 2031, 6.0, 66.20000000000073, 223.0, 441.0, 3.4940024210410474, 2.4840173462088697, 0.965627622221305], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteTAC", 12573, 0, 0.0, 478.55945279567237, 280, 3631, 383.0, 769.0, 926.2999999999993, 1209.0, 3.493677175114837, 62.640539975691816, 1.9310754698388652], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal-1", 89121, 3, 0.003366209984178813, 289.625385711559, 9, 90243, 341.5, 675.0, 812.0, 1154.9900000000016, 24.758137215546448, 41617.60403995493, 7.785273616607379], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal-0", 89121, 0, 0.0, 31.57003399872091, 0, 3663, 5.0, 219.0, 232.0, 449.0, 24.76264306017488, 18.54780002651771, 7.786690493531554], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteTAC", 12574, 0, 0.0, 229.05392078892942, 90, 2579, 138.0, 459.0, 632.25, 924.25, 3.493625952522918, 17.451071042143287, 1.9310471573515346], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM-0", 12575, 0, 0.0, 31.668310139165044, 0, 3323, 6.0, 214.0, 223.0, 439.0, 3.494354290566883, 2.453555405192958, 0.9350127691555917], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteIWXXM-1", 12575, 0, 0.0, 367.1272365805159, 223, 3338, 294.0, 566.3999999999996, 763.0, 1015.0, 3.494024176702319, 1.9210308705892634, 0.9349244379066752], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM", 12579, 0, 0.0, 210.78313061451638, 81, 2630, 118.0, 449.0, 585.0, 856.0, 3.494667569018226, 4.375159983868521, 1.8701931912324101], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi-1", 89129, 4, 0.0044878771219244015, 192.4040884560597, 6, 90013, 209.0, 454.0, 554.0, 906.9800000000032, 24.762065634518034, 25126.553858952193, 7.88323573911414], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA-1", 89133, 73, 0.0819000819000819, 146.6608439074168, 1, 90233, 37.0, 256.90000000000146, 287.0, 908.0, 24.764208934763662, 3100.4234429342664, 7.835550483265065], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 89121, 3, 0.003366209984178813, 321.2495595875278, 10, 90244, 373.0, 739.0, 887.0, 1275.9600000000064, 24.75810970397556, 41636.102198357075, 15.57052993101588], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal-1", 89290, 0, 0.0, 68.51569044685816, 1, 53496, 40.0, 255.0, 278.0, 696.9900000000016, 24.803335852834465, 3744.083591110401, 5.013955587438217], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi-0", 89271, 0, 0.0, 32.93468203559986, 0, 3054, 5.0, 224.0, 234.0, 459.0, 24.800310701879546, 19.01195693454633, 8.234478162733442], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA-0", 89133, 0, 0.0, 37.537814277540306, 0, 7317, 6.0, 221.0, 233.0, 470.9900000000016, 24.766135582040167, 18.59878736580946, 7.836160086504897], "isController": false}, {"data": ["WIFSGriddedHighResItemGlobal-0", 89290, 0, 0.0, 32.415522454922666, 0, 7266, 5.0, 218.0, 232.0, 444.0, 24.80474837723219, 15.79364838081581, 5.014241127038148], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi-1", 89271, 16, 0.017922953702770215, 1660.690313763712, 60, 90230, 2180.0, 3610.9000000000015, 4037.9500000000007, 4853.990000000002, 24.788225072452057, 270032.6305210527, 8.230465356087597], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi-0", 89129, 0, 0.0, 32.13682415375453, 0, 3694, 5.0, 220.0, 233.0, 454.0, 24.764473681651385, 18.64590743022775, 7.884002363494483], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica-0", 89131, 0, 0.0, 32.48623935555565, 0, 14566, 5.0, 219.0, 231.0, 445.0, 24.76586888657648, 18.622772502601457, 7.860261121227888], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM-0", 12579, 0, 0.0, 30.782097146037106, 0, 2035, 6.0, 109.0, 223.0, 437.0, 3.4947918460969127, 2.453862634124688, 0.9351298494439004], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteIWXXM-1", 12579, 0, 0.0, 179.9509499960259, 79, 2397, 108.0, 364.0, 545.0, 780.2000000000007, 3.4946695107796066, 1.9213856782899594, 0.9350971151890745], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica-0", 89284, 0, 0.0, 32.18621477532369, 0, 3502, 5.0, 225.0, 234.0, 460.0, 24.801889614868465, 18.988946736383667, 8.210781815859775], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica-1", 89284, 1, 0.0011200215044128846, 636.1588414497528, 21, 90010, 783.0, 1402.0, 1610.0, 2083.9900000000016, 24.795263561454533, 94581.95150480917, 8.208588229817467], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica-1", 89131, 17, 0.019073049780659927, 119.41161885314904, 3, 90451, 86.0, 293.0, 342.0, 742.9800000000032, 24.764231215806475, 9532.983507016557, 7.859741352672954], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 89220, 45, 0.05043712172158709, 3175.434386908778, 122, 90245, 4419.0, 7009.800000000003, 7651.950000000001, 8971.0, 24.771876340525843, 542680.4903613698, 16.256543848470084], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC-0", 12580, 0, 0.0, 32.271303656597865, 0, 3527, 6.0, 214.0, 223.0, 438.0, 3.494544427243335, 2.4809900377010785, 0.962364773908809], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC-1", 12580, 0, 0.0, 207.39928457869686, 87, 3690, 128.0, 409.0, 605.0, 854.0, 3.494486184140533, 39.36415833404399, 0.9623487343043264], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarOneMinuteTAC", 12580, 0, 0.0, 239.7384737678854, 91, 3866, 140.0, 514.0, 655.0, 972.380000000001, 3.4944444444444445, 41.84460720486111, 1.9246744791666666], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarFiveMinuteIWXXM", 12569, 0, 0.0, 400.18267165247994, 230, 2512, 307.0, 677.0, 820.0, 1134.2999999999993, 3.4932733157720084, 4.3802372436047445, 1.876269847338481], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteIWXXM-0", 12567, 0, 0.0, 30.955995862178725, 0, 1757, 6.0, 77.60000000000582, 224.0, 436.0, 3.4936777693171854, 2.4564921815511465, 0.9382435415646739], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 89271, 16, 0.017922953702770215, 1693.6923973070886, 61, 90233, 2215.0, 3663.0, 4090.850000000002, 4922.930000000011, 24.7882181894113, 270051.5582268605, 16.460926141405942], "isController": false}, {"data": ["WIFSOpmetNamCarAllDataVarOneMinuteIWXXM", 12573, 0, 0.0, 212.87091386303905, 80, 3734, 117.0, 459.60000000000036, 592.0, 853.2600000000002, 3.493920861150201, 4.381049204801619, 1.8766176500318463], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC-0", 12569, 0, 0.0, 31.74405282838733, 0, 1754, 6.0, 215.0, 223.0, 437.0, 3.493500515867369, 2.4836605229994575, 0.9654889121000638], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarOneMinuteTAC-1", 12569, 0, 0.0, 199.0901424138766, 86, 2831, 126.0, 405.0, 594.5, 836.2999999999993, 3.4928005624495455, 26.30515423594814, 0.965295467942599], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC-1", 12578, 0, 0.0, 465.3657179201775, 287, 3943, 391.0, 685.0, 869.0999999999985, 1131.2099999999991, 3.494265493058696, 175.77793367035113, 0.9622879580493675], "isController": false}, {"data": ["WIFSOpmetGlobalAllDataVarFiveMinuteTAC-0", 12578, 0, 0.0, 31.58339958657983, 0, 2083, 6.0, 212.0, 223.0, 439.0, 3.49467324888475, 2.481081496034388, 0.9624002501811517], "isController": false}, {"data": ["WIFSOpmetEurNatAllDataVarFiveMinuteIWXXM", 12567, 0, 0.0, 402.25208880401124, 226, 3819, 309.0, 687.0, 815.5999999999985, 1134.3199999999997, 3.4931533693628185, 4.380086842052597, 1.8762054229976075], "isController": false}, {"data": ["WIFSGriddedHighResItemSector-1", 89289, 0, 0.0, 42.74276786614218, 1, 14046, 10.0, 227.0, 244.0, 663.0, 24.8062484997733, 374.04677435979215, 5.038769226516451], "isController": false}, {"data": ["WIFSGriddedHighResItemSector-0", 89289, 0, 0.0, 31.537748210865807, 0, 3665, 5.0, 218.0, 230.0, 443.9900000000016, 24.806310524922303, 15.818867942162365, 5.038781825374842], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["504/Gateway Time-out", 344, 100.0, 0.01012673729477166], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3396948, 344, "504/Gateway Time-out", 344, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA", 89288, 13, "504/Gateway Time-out", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal-1", 89220, 45, "504/Gateway Time-out", 45, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertUSA-1", 89288, 13, "504/Gateway Time-out", 13, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica", 89131, 17, "504/Gateway Time-out", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi", 89129, 4, "504/Gateway Time-out", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA", 89133, 73, "504/Gateway Time-out", 73, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica", 89284, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal-1", 89121, 3, "504/Gateway Time-out", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertWesternHemi-1", 89129, 4, "504/Gateway Time-out", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertUSA-1", 89133, 73, "504/Gateway Time-out", 73, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertRoughlyGlobal", 89121, 3, "504/Gateway Time-out", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi-1", 89271, 16, "504/Gateway Time-out", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertNorthAmerica-1", 89284, 1, "504/Gateway Time-out", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedLowResCubeFullTimeFullVertNorthAmerica-1", 89131, 17, "504/Gateway Time-out", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertRoughlyGlobal", 89220, 45, "504/Gateway Time-out", 45, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["WIFSGriddedHighResCubeFullTimeFullVertWesternHemi", 89271, 16, "504/Gateway Time-out", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
