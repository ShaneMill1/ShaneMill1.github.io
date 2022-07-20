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
$(document).ready(function() {

    $(".click-title").mouseenter( function(    e){
        e.preventDefault();
        this.style.cursor="pointer";
    });
    $(".click-title").mousedown( function(event){
        event.preventDefault();
    });

    // Ugly code while this script is shared among several pages
    try{
        refreshHitsPerSecond(true);
    } catch(e){}
    try{
        refreshResponseTimeOverTime(true);
    } catch(e){}
    try{
        refreshResponseTimePercentiles();
    } catch(e){}
});


var responseTimePercentilesInfos = {
        data: {"result": {"minY": 7612.0, "minX": 0.0, "maxY": 74470.0, "series": [{"data": [[0.0, 7612.0], [0.1, 7612.0], [0.2, 7612.0], [0.3, 7612.0], [0.4, 7612.0], [0.5, 7612.0], [0.6, 7711.0], [0.7, 7711.0], [0.8, 7711.0], [0.9, 7711.0], [1.0, 7711.0], [1.1, 7711.0], [1.2, 7807.0], [1.3, 7807.0], [1.4, 7807.0], [1.5, 7807.0], [1.6, 7807.0], [1.7, 7807.0], [1.8, 7911.0], [1.9, 7911.0], [2.0, 7911.0], [2.1, 7911.0], [2.2, 7911.0], [2.3, 7911.0], [2.4, 8171.0], [2.5, 8171.0], [2.6, 8171.0], [2.7, 8171.0], [2.8, 8171.0], [2.9, 8171.0], [3.0, 8353.0], [3.1, 8353.0], [3.2, 8353.0], [3.3, 8353.0], [3.4, 8353.0], [3.5, 11464.0], [3.6, 11464.0], [3.7, 11464.0], [3.8, 11464.0], [3.9, 11464.0], [4.0, 11464.0], [4.1, 11479.0], [4.2, 11479.0], [4.3, 11479.0], [4.4, 11479.0], [4.5, 11479.0], [4.6, 11479.0], [4.7, 11818.0], [4.8, 11818.0], [4.9, 11818.0], [5.0, 11818.0], [5.1, 11818.0], [5.2, 11818.0], [5.3, 12024.0], [5.4, 12024.0], [5.5, 12024.0], [5.6, 12024.0], [5.7, 12024.0], [5.8, 12024.0], [5.9, 12049.0], [6.0, 12049.0], [6.1, 12049.0], [6.2, 12049.0], [6.3, 12049.0], [6.4, 12073.0], [6.5, 12073.0], [6.6, 12073.0], [6.7, 12073.0], [6.8, 12073.0], [6.9, 12073.0], [7.0, 14876.0], [7.1, 14876.0], [7.2, 14876.0], [7.3, 14876.0], [7.4, 14876.0], [7.5, 14876.0], [7.6, 14980.0], [7.7, 14980.0], [7.8, 14980.0], [7.9, 14980.0], [8.0, 14980.0], [8.1, 14980.0], [8.2, 15080.0], [8.3, 15080.0], [8.4, 15080.0], [8.5, 15080.0], [8.6, 15080.0], [8.7, 15080.0], [8.8, 15303.0], [8.9, 15303.0], [9.0, 15303.0], [9.1, 15303.0], [9.2, 15303.0], [9.3, 15303.0], [9.4, 15346.0], [9.5, 15346.0], [9.6, 15346.0], [9.7, 15346.0], [9.8, 15346.0], [9.9, 15565.0], [10.0, 15565.0], [10.1, 15565.0], [10.2, 15565.0], [10.3, 15565.0], [10.4, 15565.0], [10.5, 18967.0], [10.6, 18967.0], [10.7, 18967.0], [10.8, 18967.0], [10.9, 18967.0], [11.0, 18967.0], [11.1, 19048.0], [11.2, 19048.0], [11.3, 19048.0], [11.4, 19048.0], [11.5, 19048.0], [11.6, 19048.0], [11.7, 19122.0], [11.8, 19122.0], [11.9, 19122.0], [12.0, 19122.0], [12.1, 19122.0], [12.2, 19122.0], [12.3, 19300.0], [12.4, 19300.0], [12.5, 19300.0], [12.6, 19300.0], [12.7, 19300.0], [12.8, 19333.0], [12.9, 19333.0], [13.0, 19333.0], [13.1, 19333.0], [13.2, 19333.0], [13.3, 19333.0], [13.4, 19398.0], [13.5, 19398.0], [13.6, 19398.0], [13.7, 19398.0], [13.8, 19398.0], [13.9, 19398.0], [14.0, 22672.0], [14.1, 22672.0], [14.2, 22672.0], [14.3, 22672.0], [14.4, 22672.0], [14.5, 22672.0], [14.6, 22811.0], [14.7, 22811.0], [14.8, 22811.0], [14.9, 22811.0], [15.0, 22811.0], [15.1, 22811.0], [15.2, 22842.0], [15.3, 22842.0], [15.4, 22842.0], [15.5, 22842.0], [15.6, 22842.0], [15.7, 22997.0], [15.8, 22997.0], [15.9, 22997.0], [16.0, 22997.0], [16.1, 22997.0], [16.2, 22997.0], [16.3, 23293.0], [16.4, 23293.0], [16.5, 23293.0], [16.6, 23293.0], [16.7, 23293.0], [16.8, 23293.0], [16.9, 23351.0], [17.0, 23351.0], [17.1, 23351.0], [17.2, 23351.0], [17.3, 23351.0], [17.4, 23351.0], [17.5, 26552.0], [17.6, 26552.0], [17.7, 26552.0], [17.8, 26552.0], [17.9, 26552.0], [18.0, 26552.0], [18.1, 26597.0], [18.2, 26597.0], [18.3, 26597.0], [18.4, 26597.0], [18.5, 26597.0], [18.6, 26597.0], [18.7, 26609.0], [18.8, 26609.0], [18.9, 26609.0], [19.0, 26609.0], [19.1, 26609.0], [19.2, 26683.0], [19.3, 26683.0], [19.4, 26683.0], [19.5, 26683.0], [19.6, 26683.0], [19.7, 26683.0], [19.8, 26851.0], [19.9, 26851.0], [20.0, 26851.0], [20.1, 26851.0], [20.2, 26851.0], [20.3, 26851.0], [20.4, 27012.0], [20.5, 27012.0], [20.6, 27012.0], [20.7, 27012.0], [20.8, 27012.0], [20.9, 27012.0], [21.0, 30216.0], [21.1, 30216.0], [21.2, 30216.0], [21.3, 30216.0], [21.4, 30216.0], [21.5, 30216.0], [21.6, 30460.0], [21.7, 30460.0], [21.8, 30460.0], [21.9, 30460.0], [22.0, 30460.0], [22.1, 30515.0], [22.2, 30515.0], [22.3, 30515.0], [22.4, 30515.0], [22.5, 30515.0], [22.6, 30515.0], [22.7, 30656.0], [22.8, 30656.0], [22.9, 30656.0], [23.0, 30656.0], [23.1, 30656.0], [23.2, 30656.0], [23.3, 30952.0], [23.4, 30952.0], [23.5, 30952.0], [23.6, 30952.0], [23.7, 30952.0], [23.8, 30952.0], [23.9, 31066.0], [24.0, 31066.0], [24.1, 31066.0], [24.2, 31066.0], [24.3, 31066.0], [24.4, 31066.0], [24.5, 34210.0], [24.6, 34210.0], [24.7, 34210.0], [24.8, 34210.0], [24.9, 34210.0], [25.0, 34386.0], [25.1, 34386.0], [25.2, 34386.0], [25.3, 34386.0], [25.4, 34386.0], [25.5, 34386.0], [25.6, 34442.0], [25.7, 34442.0], [25.8, 34442.0], [25.9, 34442.0], [26.0, 34442.0], [26.1, 34442.0], [26.2, 34533.0], [26.3, 34533.0], [26.4, 34533.0], [26.5, 34533.0], [26.6, 34533.0], [26.7, 34533.0], [26.8, 34753.0], [26.9, 34753.0], [27.0, 34753.0], [27.1, 34753.0], [27.2, 34753.0], [27.3, 34753.0], [27.4, 34885.0], [27.5, 34885.0], [27.6, 34885.0], [27.7, 34885.0], [27.8, 34885.0], [27.9, 34885.0], [28.0, 37855.0], [28.1, 37855.0], [28.2, 37855.0], [28.3, 37855.0], [28.4, 37855.0], [28.5, 37948.0], [28.6, 37948.0], [28.7, 37948.0], [28.8, 37948.0], [28.9, 37948.0], [29.0, 37948.0], [29.1, 37975.0], [29.2, 37975.0], [29.3, 37975.0], [29.4, 37975.0], [29.5, 37975.0], [29.6, 37975.0], [29.7, 38153.0], [29.8, 38153.0], [29.9, 38153.0], [30.0, 38153.0], [30.1, 38153.0], [30.2, 38153.0], [30.3, 38496.0], [30.4, 38496.0], [30.5, 38496.0], [30.6, 38496.0], [30.7, 38496.0], [30.8, 38496.0], [30.9, 38578.0], [31.0, 38578.0], [31.1, 38578.0], [31.2, 38578.0], [31.3, 38578.0], [31.4, 41548.0], [31.5, 41548.0], [31.6, 41548.0], [31.7, 41548.0], [31.8, 41548.0], [31.9, 41548.0], [32.0, 41659.0], [32.1, 41659.0], [32.2, 41659.0], [32.3, 41659.0], [32.4, 41659.0], [32.5, 41659.0], [32.6, 41831.0], [32.7, 41831.0], [32.8, 41831.0], [32.9, 41831.0], [33.0, 41831.0], [33.1, 41831.0], [33.2, 41882.0], [33.3, 41882.0], [33.4, 41882.0], [33.5, 41882.0], [33.6, 41882.0], [33.7, 41882.0], [33.8, 41901.0], [33.9, 41901.0], [34.0, 41901.0], [34.1, 41901.0], [34.2, 41901.0], [34.3, 41901.0], [34.4, 42035.0], [34.5, 42035.0], [34.6, 42035.0], [34.7, 42035.0], [34.8, 42035.0], [34.9, 45161.0], [35.0, 45161.0], [35.1, 45161.0], [35.2, 45161.0], [35.3, 45161.0], [35.4, 45161.0], [35.5, 45338.0], [35.6, 45338.0], [35.7, 45338.0], [35.8, 45338.0], [35.9, 45338.0], [36.0, 45338.0], [36.1, 45483.0], [36.2, 45483.0], [36.3, 45483.0], [36.4, 45483.0], [36.5, 45483.0], [36.6, 45483.0], [36.7, 45702.0], [36.8, 45702.0], [36.9, 45702.0], [37.0, 45702.0], [37.1, 45702.0], [37.2, 45702.0], [37.3, 45722.0], [37.4, 45722.0], [37.5, 45722.0], [37.6, 45722.0], [37.7, 45722.0], [37.8, 45726.0], [37.9, 45726.0], [38.0, 45726.0], [38.1, 45726.0], [38.2, 45726.0], [38.3, 45726.0], [38.4, 48788.0], [38.5, 48788.0], [38.6, 48788.0], [38.7, 48788.0], [38.8, 48788.0], [38.9, 48788.0], [39.0, 48949.0], [39.1, 48949.0], [39.2, 48949.0], [39.3, 48949.0], [39.4, 48949.0], [39.5, 48949.0], [39.6, 49306.0], [39.7, 49306.0], [39.8, 49306.0], [39.9, 49306.0], [40.0, 49306.0], [40.1, 49306.0], [40.2, 49349.0], [40.3, 49349.0], [40.4, 49349.0], [40.5, 49349.0], [40.6, 49349.0], [40.7, 49561.0], [40.8, 49561.0], [40.9, 49561.0], [41.0, 49561.0], [41.1, 49561.0], [41.2, 49561.0], [41.3, 49863.0], [41.4, 49863.0], [41.5, 49863.0], [41.6, 49863.0], [41.7, 49863.0], [41.8, 49863.0], [41.9, 52376.0], [42.0, 52376.0], [42.1, 52376.0], [42.2, 52376.0], [42.3, 52376.0], [42.4, 52376.0], [42.5, 52654.0], [42.6, 52654.0], [42.7, 52654.0], [42.8, 52654.0], [42.9, 52654.0], [43.0, 52654.0], [43.1, 52753.0], [43.2, 52753.0], [43.3, 52753.0], [43.4, 52753.0], [43.5, 52753.0], [43.6, 52753.0], [43.7, 52916.0], [43.8, 52916.0], [43.9, 52916.0], [44.0, 52916.0], [44.1, 52916.0], [44.2, 53047.0], [44.3, 53047.0], [44.4, 53047.0], [44.5, 53047.0], [44.6, 53047.0], [44.7, 53047.0], [44.8, 53053.0], [44.9, 53053.0], [45.0, 53053.0], [45.1, 53053.0], [45.2, 53053.0], [45.3, 53053.0], [45.4, 55881.0], [45.5, 55881.0], [45.6, 55881.0], [45.7, 55881.0], [45.8, 55881.0], [45.9, 55881.0], [46.0, 55941.0], [46.1, 55941.0], [46.2, 55941.0], [46.3, 55941.0], [46.4, 55941.0], [46.5, 55941.0], [46.6, 55959.0], [46.7, 55959.0], [46.8, 55959.0], [46.9, 55959.0], [47.0, 55959.0], [47.1, 55967.0], [47.2, 55967.0], [47.3, 55967.0], [47.4, 55967.0], [47.5, 55967.0], [47.6, 55967.0], [47.7, 56049.0], [47.8, 56049.0], [47.9, 56049.0], [48.0, 56049.0], [48.1, 56049.0], [48.2, 56049.0], [48.3, 56447.0], [48.4, 56447.0], [48.5, 56447.0], [48.6, 56447.0], [48.7, 56447.0], [48.8, 56447.0], [48.9, 60386.0], [49.0, 60386.0], [49.1, 60386.0], [49.2, 60386.0], [49.3, 60386.0], [49.4, 60386.0], [49.5, 60422.0], [49.6, 60422.0], [49.7, 60422.0], [49.8, 60422.0], [49.9, 60422.0], [50.0, 60422.0], [50.1, 60447.0], [50.2, 60447.0], [50.3, 60447.0], [50.4, 60447.0], [50.5, 60447.0], [50.6, 60548.0], [50.7, 60548.0], [50.8, 60548.0], [50.9, 60548.0], [51.0, 60548.0], [51.1, 60548.0], [51.2, 60576.0], [51.3, 60576.0], [51.4, 60576.0], [51.5, 60576.0], [51.6, 60576.0], [51.7, 60576.0], [51.8, 60679.0], [51.9, 60679.0], [52.0, 60679.0], [52.1, 60679.0], [52.2, 60679.0], [52.3, 60679.0], [52.4, 63957.0], [52.5, 63957.0], [52.6, 63957.0], [52.7, 63957.0], [52.8, 63957.0], [52.9, 63957.0], [53.0, 64268.0], [53.1, 64268.0], [53.2, 64268.0], [53.3, 64268.0], [53.4, 64268.0], [53.5, 64321.0], [53.6, 64321.0], [53.7, 64321.0], [53.8, 64321.0], [53.9, 64321.0], [54.0, 64321.0], [54.1, 64607.0], [54.2, 64607.0], [54.3, 64607.0], [54.4, 64607.0], [54.5, 64607.0], [54.6, 64607.0], [54.7, 64631.0], [54.8, 64631.0], [54.9, 64631.0], [55.0, 64631.0], [55.1, 64631.0], [55.2, 64631.0], [55.3, 64815.0], [55.4, 64815.0], [55.5, 64815.0], [55.6, 64815.0], [55.7, 64815.0], [55.8, 64815.0], [55.9, 67810.0], [56.0, 67810.0], [56.1, 67810.0], [56.2, 67810.0], [56.3, 67810.0], [56.4, 68055.0], [56.5, 68055.0], [56.6, 68055.0], [56.7, 68055.0], [56.8, 68055.0], [56.9, 68055.0], [57.0, 68057.0], [57.1, 68057.0], [57.2, 68057.0], [57.3, 68057.0], [57.4, 68057.0], [57.5, 68057.0], [57.6, 68161.0], [57.7, 68161.0], [57.8, 68161.0], [57.9, 68161.0], [58.0, 68161.0], [58.1, 68161.0], [58.2, 68356.0], [58.3, 68356.0], [58.4, 68356.0], [58.5, 68356.0], [58.6, 68356.0], [58.7, 68356.0], [58.8, 68479.0], [58.9, 68479.0], [59.0, 68479.0], [59.1, 68479.0], [59.2, 68479.0], [59.3, 68479.0], [59.4, 68708.0], [59.5, 68708.0], [59.6, 68708.0], [59.7, 68708.0], [59.8, 68708.0], [59.9, 68769.0], [60.0, 68769.0], [60.1, 68769.0], [60.2, 68769.0], [60.3, 68769.0], [60.4, 68769.0], [60.5, 68774.0], [60.6, 68774.0], [60.7, 68774.0], [60.8, 68774.0], [60.9, 68774.0], [61.0, 68774.0], [61.1, 68841.0], [61.2, 68841.0], [61.3, 68841.0], [61.4, 68841.0], [61.5, 68841.0], [61.6, 68841.0], [61.7, 68863.0], [61.8, 68863.0], [61.9, 68863.0], [62.0, 68863.0], [62.1, 68863.0], [62.2, 68863.0], [62.3, 68870.0], [62.4, 68870.0], [62.5, 68870.0], [62.6, 68870.0], [62.7, 68870.0], [62.8, 68943.0], [62.9, 68943.0], [63.0, 68943.0], [63.1, 68943.0], [63.2, 68943.0], [63.3, 68943.0], [63.4, 68945.0], [63.5, 68945.0], [63.6, 68945.0], [63.7, 68945.0], [63.8, 68945.0], [63.9, 68945.0], [64.0, 69144.0], [64.1, 69144.0], [64.2, 69144.0], [64.3, 69144.0], [64.4, 69144.0], [64.5, 69144.0], [64.6, 69168.0], [64.7, 69168.0], [64.8, 69168.0], [64.9, 69168.0], [65.0, 69168.0], [65.1, 69168.0], [65.2, 69229.0], [65.3, 69229.0], [65.4, 69229.0], [65.5, 69229.0], [65.6, 69229.0], [65.7, 69292.0], [65.8, 69292.0], [65.9, 69292.0], [66.0, 69292.0], [66.1, 69292.0], [66.2, 69292.0], [66.3, 69324.0], [66.4, 69324.0], [66.5, 69324.0], [66.6, 69324.0], [66.7, 69324.0], [66.8, 69324.0], [66.9, 69359.0], [67.0, 69359.0], [67.1, 69359.0], [67.2, 69359.0], [67.3, 69359.0], [67.4, 69359.0], [67.5, 69362.0], [67.6, 69362.0], [67.7, 69362.0], [67.8, 69362.0], [67.9, 69362.0], [68.0, 69362.0], [68.1, 69366.0], [68.2, 69366.0], [68.3, 69366.0], [68.4, 69366.0], [68.5, 69366.0], [68.6, 69366.0], [68.7, 69385.0], [68.8, 69385.0], [68.9, 69385.0], [69.0, 69385.0], [69.1, 69385.0], [69.2, 69400.0], [69.3, 69400.0], [69.4, 69400.0], [69.5, 69400.0], [69.6, 69400.0], [69.7, 69400.0], [69.8, 69485.0], [69.9, 69485.0], [70.0, 69485.0], [70.1, 69485.0], [70.2, 69485.0], [70.3, 69485.0], [70.4, 69549.0], [70.5, 69549.0], [70.6, 69549.0], [70.7, 69549.0], [70.8, 69549.0], [70.9, 69549.0], [71.0, 69979.0], [71.1, 69979.0], [71.2, 69979.0], [71.3, 69979.0], [71.4, 69979.0], [71.5, 69979.0], [71.6, 70026.0], [71.7, 70026.0], [71.8, 70026.0], [71.9, 70026.0], [72.0, 70026.0], [72.1, 71593.0], [72.2, 71593.0], [72.3, 71593.0], [72.4, 71593.0], [72.5, 71593.0], [72.6, 71593.0], [72.7, 71721.0], [72.8, 71721.0], [72.9, 71721.0], [73.0, 71721.0], [73.1, 71721.0], [73.2, 71721.0], [73.3, 71823.0], [73.4, 71823.0], [73.5, 71823.0], [73.6, 71823.0], [73.7, 71823.0], [73.8, 71823.0], [73.9, 71833.0], [74.0, 71833.0], [74.1, 71833.0], [74.2, 71833.0], [74.3, 71833.0], [74.4, 71833.0], [74.5, 72767.0], [74.6, 72767.0], [74.7, 72767.0], [74.8, 72767.0], [74.9, 72767.0], [75.0, 72767.0], [75.1, 72811.0], [75.2, 72811.0], [75.3, 72811.0], [75.4, 72811.0], [75.5, 72811.0], [75.6, 72862.0], [75.7, 72862.0], [75.8, 72862.0], [75.9, 72862.0], [76.0, 72862.0], [76.1, 72862.0], [76.2, 73032.0], [76.3, 73032.0], [76.4, 73032.0], [76.5, 73032.0], [76.6, 73032.0], [76.7, 73032.0], [76.8, 73131.0], [76.9, 73131.0], [77.0, 73131.0], [77.1, 73131.0], [77.2, 73131.0], [77.3, 73131.0], [77.4, 73190.0], [77.5, 73190.0], [77.6, 73190.0], [77.7, 73190.0], [77.8, 73190.0], [77.9, 73190.0], [78.0, 73192.0], [78.1, 73192.0], [78.2, 73192.0], [78.3, 73192.0], [78.4, 73192.0], [78.5, 73194.0], [78.6, 73194.0], [78.7, 73194.0], [78.8, 73194.0], [78.9, 73194.0], [79.0, 73194.0], [79.1, 73237.0], [79.2, 73237.0], [79.3, 73237.0], [79.4, 73237.0], [79.5, 73237.0], [79.6, 73237.0], [79.7, 73342.0], [79.8, 73342.0], [79.9, 73342.0], [80.0, 73342.0], [80.1, 73342.0], [80.2, 73342.0], [80.3, 73354.0], [80.4, 73354.0], [80.5, 73354.0], [80.6, 73354.0], [80.7, 73354.0], [80.8, 73354.0], [80.9, 73354.0], [81.0, 73354.0], [81.1, 73354.0], [81.2, 73354.0], [81.3, 73354.0], [81.4, 73410.0], [81.5, 73410.0], [81.6, 73410.0], [81.7, 73410.0], [81.8, 73410.0], [81.9, 73410.0], [82.0, 73418.0], [82.1, 73418.0], [82.2, 73418.0], [82.3, 73418.0], [82.4, 73418.0], [82.5, 73418.0], [82.6, 73484.0], [82.7, 73484.0], [82.8, 73484.0], [82.9, 73484.0], [83.0, 73484.0], [83.1, 73484.0], [83.2, 73553.0], [83.3, 73553.0], [83.4, 73553.0], [83.5, 73553.0], [83.6, 73553.0], [83.7, 73553.0], [83.8, 73555.0], [83.9, 73555.0], [84.0, 73555.0], [84.1, 73555.0], [84.2, 73555.0], [84.3, 73555.0], [84.4, 73560.0], [84.5, 73560.0], [84.6, 73560.0], [84.7, 73560.0], [84.8, 73560.0], [84.9, 73565.0], [85.0, 73565.0], [85.1, 73565.0], [85.2, 73565.0], [85.3, 73565.0], [85.4, 73565.0], [85.5, 73577.0], [85.6, 73577.0], [85.7, 73577.0], [85.8, 73577.0], [85.9, 73577.0], [86.0, 73577.0], [86.1, 73582.0], [86.2, 73582.0], [86.3, 73582.0], [86.4, 73582.0], [86.5, 73582.0], [86.6, 73582.0], [86.7, 73627.0], [86.8, 73627.0], [86.9, 73627.0], [87.0, 73627.0], [87.1, 73627.0], [87.2, 73627.0], [87.3, 73630.0], [87.4, 73630.0], [87.5, 73630.0], [87.6, 73630.0], [87.7, 73630.0], [87.8, 73633.0], [87.9, 73633.0], [88.0, 73633.0], [88.1, 73633.0], [88.2, 73633.0], [88.3, 73633.0], [88.4, 73648.0], [88.5, 73648.0], [88.6, 73648.0], [88.7, 73648.0], [88.8, 73648.0], [88.9, 73648.0], [89.0, 73655.0], [89.1, 73655.0], [89.2, 73655.0], [89.3, 73655.0], [89.4, 73655.0], [89.5, 73655.0], [89.6, 73659.0], [89.7, 73659.0], [89.8, 73659.0], [89.9, 73659.0], [90.0, 73659.0], [90.1, 73659.0], [90.2, 73675.0], [90.3, 73675.0], [90.4, 73675.0], [90.5, 73675.0], [90.6, 73675.0], [90.7, 73695.0], [90.8, 73695.0], [90.9, 73695.0], [91.0, 73695.0], [91.1, 73695.0], [91.2, 73695.0], [91.3, 73708.0], [91.4, 73708.0], [91.5, 73708.0], [91.6, 73708.0], [91.7, 73708.0], [91.8, 73708.0], [91.9, 73773.0], [92.0, 73773.0], [92.1, 73773.0], [92.2, 73773.0], [92.3, 73773.0], [92.4, 73773.0], [92.5, 73919.0], [92.6, 73919.0], [92.7, 73919.0], [92.8, 73919.0], [92.9, 73919.0], [93.0, 73919.0], [93.1, 73940.0], [93.2, 73940.0], [93.3, 73940.0], [93.4, 73940.0], [93.5, 73940.0], [93.6, 73940.0], [93.7, 73945.0], [93.8, 73945.0], [93.9, 73945.0], [94.0, 73945.0], [94.1, 73945.0], [94.2, 74036.0], [94.3, 74036.0], [94.4, 74036.0], [94.5, 74036.0], [94.6, 74036.0], [94.7, 74036.0], [94.8, 74045.0], [94.9, 74045.0], [95.0, 74045.0], [95.1, 74045.0], [95.2, 74045.0], [95.3, 74045.0], [95.4, 74113.0], [95.5, 74113.0], [95.6, 74113.0], [95.7, 74113.0], [95.8, 74113.0], [95.9, 74113.0], [96.0, 74129.0], [96.1, 74129.0], [96.2, 74129.0], [96.3, 74129.0], [96.4, 74129.0], [96.5, 74129.0], [96.6, 74234.0], [96.7, 74234.0], [96.8, 74234.0], [96.9, 74234.0], [97.0, 74234.0], [97.1, 74238.0], [97.2, 74238.0], [97.3, 74238.0], [97.4, 74238.0], [97.5, 74238.0], [97.6, 74238.0], [97.7, 74283.0], [97.8, 74283.0], [97.9, 74283.0], [98.0, 74283.0], [98.1, 74283.0], [98.2, 74283.0], [98.3, 74338.0], [98.4, 74338.0], [98.5, 74338.0], [98.6, 74338.0], [98.7, 74338.0], [98.8, 74338.0], [98.9, 74461.0], [99.0, 74461.0], [99.1, 74461.0], [99.2, 74461.0], [99.3, 74461.0], [99.4, 74461.0], [99.5, 74470.0], [99.6, 74470.0], [99.7, 74470.0], [99.8, 74470.0], [99.9, 74470.0]], "isOverall": false, "label": "NCPPServerEastGFSAreaUS-1time-fullzedd", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 100.0, "title": "Response Time Percentiles"}},
        getOptions: function() {
            return {
                series: {
                    points: { show: false }
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimePercentiles'
                },
                xaxis: {
                    tickDecimals: 1,
                    axisLabel: "Percentiles",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Percentile value in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : %x.2 percentile was %y ms"
                },
                selection: { mode: "xy" },
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimePercentiles"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimesPercentiles"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimesPercentiles"), dataset, prepareOverviewOptions(options));
        }
};

/**
 * @param elementId Id of element where we display message
 */
function setEmptyGraph(elementId) {
    $(function() {
        $(elementId).text("No graph series with filter="+seriesFilter);
    });
}

// Response times percentiles
function refreshResponseTimePercentiles() {
    var infos = responseTimePercentilesInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyResponseTimePercentiles");
        return;
    }
    if (isGraph($("#flotResponseTimesPercentiles"))){
        infos.createGraph();
    } else {
        var choiceContainer = $("#choicesResponseTimePercentiles");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimesPercentiles", "#overviewResponseTimesPercentiles");
        $('#bodyResponseTimePercentiles .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var responseTimeDistributionInfos = {
        data: {"result": {"minY": 2.0, "minX": 7600.0, "maxY": 16.0, "series": [{"data": [[68300.0, 2.0], [68700.0, 6.0], [69100.0, 4.0], [69500.0, 2.0], [71500.0, 2.0], [72700.0, 2.0], [73100.0, 8.0], [73500.0, 12.0], [69900.0, 2.0], [73900.0, 6.0], [74300.0, 2.0], [34300.0, 2.0], [34500.0, 2.0], [34700.0, 2.0], [37900.0, 4.0], [38100.0, 2.0], [38500.0, 2.0], [41500.0, 2.0], [41900.0, 2.0], [45100.0, 2.0], [45700.0, 6.0], [45300.0, 2.0], [48700.0, 2.0], [48900.0, 2.0], [49300.0, 4.0], [49500.0, 2.0], [52300.0, 2.0], [52900.0, 2.0], [52700.0, 2.0], [55900.0, 6.0], [60300.0, 2.0], [60500.0, 4.0], [63900.0, 2.0], [64300.0, 2.0], [67800.0, 2.0], [69400.0, 4.0], [71800.0, 4.0], [73000.0, 2.0], [73400.0, 6.0], [74200.0, 6.0], [68100.0, 2.0], [68900.0, 4.0], [69300.0, 10.0], [71700.0, 2.0], [73300.0, 6.0], [73700.0, 4.0], [74100.0, 4.0], [7600.0, 2.0], [7800.0, 2.0], [7900.0, 2.0], [7700.0, 2.0], [8100.0, 2.0], [8300.0, 2.0], [11400.0, 4.0], [12000.0, 6.0], [11800.0, 2.0], [14800.0, 2.0], [14900.0, 2.0], [15300.0, 4.0], [15000.0, 2.0], [15500.0, 2.0], [19000.0, 2.0], [18900.0, 2.0], [19300.0, 6.0], [19100.0, 2.0], [22900.0, 2.0], [22800.0, 4.0], [22600.0, 2.0], [23300.0, 2.0], [23200.0, 2.0], [26600.0, 4.0], [26500.0, 4.0], [27000.0, 2.0], [26800.0, 2.0], [30500.0, 2.0], [30200.0, 2.0], [30400.0, 2.0], [30600.0, 2.0], [30900.0, 2.0], [31000.0, 2.0], [34200.0, 2.0], [34400.0, 2.0], [34800.0, 2.0], [37800.0, 2.0], [38400.0, 2.0], [41800.0, 4.0], [41600.0, 2.0], [42000.0, 2.0], [45400.0, 2.0], [49800.0, 2.0], [52600.0, 2.0], [53000.0, 4.0], [55800.0, 2.0], [56000.0, 2.0], [56400.0, 2.0], [60400.0, 4.0], [60600.0, 2.0], [64200.0, 2.0], [64600.0, 4.0], [64800.0, 2.0], [68000.0, 4.0], [68400.0, 2.0], [68800.0, 6.0], [69200.0, 4.0], [72800.0, 4.0], [73200.0, 2.0], [73600.0, 16.0], [70000.0, 2.0], [74000.0, 4.0], [74400.0, 4.0]], "isOverall": false, "label": "NCPPServerEastGFSAreaUS-1time-fullzedd", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 100, "maxX": 74400.0, "title": "Response Time Distribution"}},
        getOptions: function() {
            var granularity = this.data.result.granularity;
            return {
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimeDistribution'
                },
                xaxis:{
                    axisLabel: "Response times in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of responses",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                bars : {
                    show: true,
                    barWidth: this.data.result.granularity
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: function(label, xval, yval, flotItem){
                        return yval + " responses for " + label + " were between " + xval + " and " + (xval + granularity) + " ms";
                    }
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimeDistribution"), prepareData(data.result.series, $("#choicesResponseTimeDistribution")), options);
        }

};

// Response time distribution
function refreshResponseTimeDistribution() {
    var infos = responseTimeDistributionInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyResponseTimeDistribution");
        return;
    }
    if (isGraph($("#flotResponseTimeDistribution"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimeDistribution");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        $('#footerResponseTimeDistribution .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var syntheticResponseTimeDistributionInfos = {
        data: {"result": {"minY": 344.0, "minX": 2.0, "ticks": [[0, "Requests having \nresponse time <= 500ms"], [1, "Requests having \nresponse time > 500ms and <= 1,500ms"], [2, "Requests having \nresponse time > 1,500ms"], [3, "Requests in error"]], "maxY": 344.0, "series": [{"data": [], "color": "#9ACD32", "isOverall": false, "label": "Requests having \nresponse time <= 500ms", "isController": false}, {"data": [], "color": "yellow", "isOverall": false, "label": "Requests having \nresponse time > 500ms and <= 1,500ms", "isController": false}, {"data": [[2.0, 344.0]], "color": "orange", "isOverall": false, "label": "Requests having \nresponse time > 1,500ms", "isController": false}, {"data": [], "color": "#FF6347", "isOverall": false, "label": "Requests in error", "isController": false}], "supportsControllersDiscrimination": false, "maxX": 2.0, "title": "Synthetic Response Times Distribution"}},
        getOptions: function() {
            return {
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendSyntheticResponseTimeDistribution'
                },
                xaxis:{
                    axisLabel: "Response times ranges",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                    tickLength:0,
                    min:-0.5,
                    max:3.5
                },
                yaxis: {
                    axisLabel: "Number of responses",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                bars : {
                    show: true,
                    align: "center",
                    barWidth: 0.25,
                    fill:.75
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: function(label, xval, yval, flotItem){
                        return yval + " " + label;
                    }
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var options = this.getOptions();
            prepareOptions(options, data);
            options.xaxis.ticks = data.result.ticks;
            $.plot($("#flotSyntheticResponseTimeDistribution"), prepareData(data.result.series, $("#choicesSyntheticResponseTimeDistribution")), options);
        }

};

// Response time distribution
function refreshSyntheticResponseTimeDistribution() {
    var infos = syntheticResponseTimeDistributionInfos;
    prepareSeries(infos.data, true);
    if (isGraph($("#flotSyntheticResponseTimeDistribution"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesSyntheticResponseTimeDistribution");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        $('#footerSyntheticResponseTimeDistribution .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var activeThreadsOverTimeInfos = {
        data: {"result": {"minY": 23.5, "minX": 1.65824658E12, "maxY": 97.52380952380955, "series": [{"data": [[1.65824664E12, 82.97619047619045], [1.6582467E12, 23.5], [1.65824658E12, 97.52380952380955]], "isOverall": false, "label": "NCPPServerEastGFSAreaUS-1time-fullzedd", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.6582467E12, "title": "Active Threads Over Time"}},
        getOptions: function() {
            return {
                series: {
                    stack: true,
                    lines: {
                        show: true,
                        fill: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of active threads",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 6,
                    show: true,
                    container: '#legendActiveThreadsOverTime'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                selection: {
                    mode: 'xy'
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : At %x there were %y active threads"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesActiveThreadsOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotActiveThreadsOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewActiveThreadsOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Active Threads Over Time
function refreshActiveThreadsOverTime(fixTimestamps) {
    var infos = activeThreadsOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -14400000);
    }
    if(isGraph($("#flotActiveThreadsOverTime"))) {
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesActiveThreadsOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotActiveThreadsOverTime", "#overviewActiveThreadsOverTime");
        $('#footerActiveThreadsOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var timeVsThreadsInfos = {
        data: {"result": {"minY": 21912.75, "minX": 1.0, "maxY": 74470.0, "series": [{"data": [[2.0, 74461.0], [3.0, 74470.0], [4.0, 74338.0], [5.0, 74238.0], [6.0, 74036.0], [7.0, 74113.0], [8.0, 74129.0], [9.0, 69979.0], [10.0, 70026.0], [11.0, 73582.0], [12.0, 73633.0], [13.0, 73655.0], [14.0, 69385.0], [15.0, 73648.0], [16.0, 69324.0], [17.0, 73675.0], [18.0, 73773.0], [19.0, 73630.0], [20.0, 73342.0], [21.0, 69366.0], [22.0, 69359.0], [23.0, 73410.0], [24.0, 73354.0], [25.0, 73553.0], [26.0, 73565.0], [27.0, 69400.0], [28.0, 69362.0], [29.0, 73627.0], [30.0, 73555.0], [31.0, 73659.0], [33.0, 73708.0], [32.0, 69292.0], [35.0, 74045.0], [34.0, 69229.0], [37.0, 73919.0], [36.0, 73945.0], [39.0, 69549.0], [38.0, 73940.0], [41.0, 73560.0], [40.0, 69485.0], [43.0, 73695.0], [42.0, 73577.0], [45.0, 73354.0], [44.0, 69144.0], [47.0, 73484.0], [46.0, 69168.0], [49.0, 73190.0], [48.0, 73418.0], [51.0, 68863.0], [50.0, 73194.0], [53.0, 68769.0], [52.0, 68870.0], [55.0, 73192.0], [54.0, 73237.0], [57.0, 73032.0], [56.0, 73131.0], [59.0, 74234.0], [58.0, 68708.0], [61.0, 72811.0], [60.0, 72767.0], [63.0, 68943.0], [62.0, 72862.0], [67.0, 71833.0], [66.0, 71823.0], [65.0, 71721.0], [64.0, 68945.0], [71.0, 68356.0], [70.0, 68841.0], [69.0, 68774.0], [68.0, 71593.0], [75.0, 67810.0], [74.0, 68055.0], [73.0, 68057.0], [72.0, 68479.0], [79.0, 64631.0], [78.0, 64607.0], [77.0, 64815.0], [76.0, 68161.0], [81.0, 21912.75], [83.0, 25443.0], [82.0, 63957.0], [80.0, 64268.0], [87.0, 34387.5], [86.0, 60576.0], [85.0, 60679.0], [84.0, 60548.0], [91.0, 55959.0], [90.0, 55967.0], [89.0, 56447.0], [88.0, 60386.0], [94.0, 55881.0], [93.0, 56049.0], [92.0, 55941.0], [99.0, 52654.0], [98.0, 53047.0], [97.0, 52916.0], [96.0, 52903.0], [100.0, 30862.000000000007], [1.0, 74283.0]], "isOverall": false, "label": "NCPPServerEastGFSAreaUS-1time-fullzedd", "isController": false}, {"data": [[70.62209302325577, 51885.674418604656]], "isOverall": false, "label": "NCPPServerEastGFSAreaUS-1time-fullzedd-Aggregated", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 100.0, "title": "Time VS Threads"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    axisLabel: "Number of active threads",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response times in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: { noColumns: 2,show: true, container: '#legendTimeVsThreads' },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s: At %x.2 active threads, Average response time was %y.2 ms"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesTimeVsThreads"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotTimesVsThreads"), dataset, options);
            // setup overview
            $.plot($("#overviewTimesVsThreads"), dataset, prepareOverviewOptions(options));
        }
};

// Time vs threads
function refreshTimeVsThreads(){
    var infos = timeVsThreadsInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyTimeVsThreads");
        return;
    }
    if(isGraph($("#flotTimesVsThreads"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesTimeVsThreads");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotTimesVsThreads", "#overviewTimesVsThreads");
        $('#footerTimeVsThreads .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var bytesThroughputOverTimeInfos = {
        data : {"result": {"minY": 1619.8, "minX": 1.65824658E12, "maxY": 4961342.4, "series": [{"data": [[1.65824664E12, 4961342.4], [1.6582467E12, 2716925.6], [1.65824658E12, 2480671.2]], "isOverall": false, "label": "Bytes received per second", "isController": false}, {"data": [[1.65824664E12, 3239.6], [1.6582467E12, 1774.0666666666666], [1.65824658E12, 1619.8]], "isOverall": false, "label": "Bytes sent per second", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.6582467E12, "title": "Bytes Throughput Over Time"}},
        getOptions : function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity) ,
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Bytes / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendBytesThroughputOverTime'
                },
                selection: {
                    mode: "xy"
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y"
                }
            };
        },
        createGraph : function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesBytesThroughputOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotBytesThroughputOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewBytesThroughputOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Bytes throughput Over Time
function refreshBytesThroughputOverTime(fixTimestamps) {
    var infos = bytesThroughputOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -14400000);
    }
    if(isGraph($("#flotBytesThroughputOverTime"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesBytesThroughputOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotBytesThroughputOverTime", "#overviewBytesThroughputOverTime");
        $('#footerBytesThroughputOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var responseTimesOverTimeInfos = {
        data: {"result": {"minY": 19212.50000000001, "minX": 1.65824658E12, "maxY": 72468.26086956526, "series": [{"data": [[1.65824664E12, 56950.84523809521], [1.6582467E12, 72468.26086956526], [1.65824658E12, 19212.50000000001]], "isOverall": false, "label": "NCPPServerEastGFSAreaUS-1time-fullzedd", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.6582467E12, "title": "Response Time Over Time"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average response time was %y ms"
                }
            };
        },
        createGraph: function() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Response Times Over Time
function refreshResponseTimeOverTime(fixTimestamps) {
    var infos = responseTimesOverTimeInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyResponseTimeOverTime");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -14400000);
    }
    if(isGraph($("#flotResponseTimesOverTime"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimesOverTime", "#overviewResponseTimesOverTime");
        $('#footerResponseTimesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var latenciesOverTimeInfos = {
        data: {"result": {"minY": 18784.47619047619, "minX": 1.65824658E12, "maxY": 72085.67391304349, "series": [{"data": [[1.65824664E12, 56532.61904761905], [1.6582467E12, 72085.67391304349], [1.65824658E12, 18784.47619047619]], "isOverall": false, "label": "NCPPServerEastGFSAreaUS-1time-fullzedd", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.6582467E12, "title": "Latencies Over Time"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average response latencies in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendLatenciesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average latency was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesLatenciesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotLatenciesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewLatenciesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Latencies Over Time
function refreshLatenciesOverTime(fixTimestamps) {
    var infos = latenciesOverTimeInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyLatenciesOverTime");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -14400000);
    }
    if(isGraph($("#flotLatenciesOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesLatenciesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotLatenciesOverTime", "#overviewLatenciesOverTime");
        $('#footerLatenciesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var connectTimeOverTimeInfos = {
        data: {"result": {"minY": 0.0, "minX": 1.65824658E12, "maxY": 18.95238095238096, "series": [{"data": [[1.65824664E12, 12.940476190476188], [1.6582467E12, 0.0], [1.65824658E12, 18.95238095238096]], "isOverall": false, "label": "NCPPServerEastGFSAreaUS-1time-fullzedd", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.6582467E12, "title": "Connect Time Over Time"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getConnectTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Average Connect Time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendConnectTimeOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Average connect time was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesConnectTimeOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotConnectTimeOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewConnectTimeOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Connect Time Over Time
function refreshConnectTimeOverTime(fixTimestamps) {
    var infos = connectTimeOverTimeInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyConnectTimeOverTime");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -14400000);
    }
    if(isGraph($("#flotConnectTimeOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesConnectTimeOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotConnectTimeOverTime", "#overviewConnectTimeOverTime");
        $('#footerConnectTimeOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var responseTimePercentilesOverTimeInfos = {
        data: {"result": {"minY": 7612.0, "minX": 1.65824658E12, "maxY": 74470.0, "series": [{"data": [[1.65824664E12, 74234.0], [1.6582467E12, 74470.0], [1.65824658E12, 31066.0]], "isOverall": false, "label": "Max", "isController": false}, {"data": [[1.65824664E12, 73041.9], [1.6582467E12, 74238.0], [1.65824658E12, 30487.5]], "isOverall": false, "label": "90th percentile", "isController": false}, {"data": [[1.65824664E12, 74234.0], [1.6582467E12, 74470.0], [1.65824658E12, 31066.0]], "isOverall": false, "label": "99th percentile", "isController": false}, {"data": [[1.65824664E12, 73217.65], [1.6582467E12, 74381.05], [1.65824658E12, 30878.0]], "isOverall": false, "label": "95th percentile", "isController": false}, {"data": [[1.65824664E12, 34210.0], [1.6582467E12, 69144.0], [1.65824658E12, 7612.0]], "isOverall": false, "label": "Min", "isController": false}, {"data": [[1.65824664E12, 58416.5], [1.6582467E12, 73579.5], [1.65824658E12, 19211.0]], "isOverall": false, "label": "Median", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.6582467E12, "title": "Response Time Percentiles Over Time (successful requests only)"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true,
                        fill: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Response Time in ms",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: '#legendResponseTimePercentilesOverTime'
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s : at %x Response time was %y ms"
                }
            };
        },
        createGraph: function () {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesResponseTimePercentilesOverTime"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotResponseTimePercentilesOverTime"), dataset, options);
            // setup overview
            $.plot($("#overviewResponseTimePercentilesOverTime"), dataset, prepareOverviewOptions(options));
        }
};

// Response Time Percentiles Over Time
function refreshResponseTimePercentilesOverTime(fixTimestamps) {
    var infos = responseTimePercentilesOverTimeInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -14400000);
    }
    if(isGraph($("#flotResponseTimePercentilesOverTime"))) {
        infos.createGraph();
    }else {
        var choiceContainer = $("#choicesResponseTimePercentilesOverTime");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimePercentilesOverTime", "#overviewResponseTimePercentilesOverTime");
        $('#footerResponseTimePercentilesOverTime .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var responseTimeVsRequestInfos = {
    data: {"result": {"minY": 14980.0, "minX": 2.0, "maxY": 68109.0, "series": [{"data": [[2.0, 45161.0], [8.0, 60562.0], [4.0, 60404.0], [10.0, 43686.5], [6.0, 14980.0], [12.0, 68109.0]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 12.0, "title": "Response Time Vs Request"}},
    getOptions: function() {
        return {
            series: {
                lines: {
                    show: false
                },
                points: {
                    show: true
                }
            },
            xaxis: {
                axisLabel: "Global number of requests per second",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            yaxis: {
                axisLabel: "Median Response Time in ms",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            legend: {
                noColumns: 2,
                show: true,
                container: '#legendResponseTimeVsRequest'
            },
            selection: {
                mode: 'xy'
            },
            grid: {
                hoverable: true // IMPORTANT! this is needed for tooltip to work
            },
            tooltip: true,
            tooltipOpts: {
                content: "%s : Median response time at %x req/s was %y ms"
            },
            colors: ["#9ACD32", "#FF6347"]
        };
    },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesResponseTimeVsRequest"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotResponseTimeVsRequest"), dataset, options);
        // setup overview
        $.plot($("#overviewResponseTimeVsRequest"), dataset, prepareOverviewOptions(options));

    }
};

// Response Time vs Request
function refreshResponseTimeVsRequest() {
    var infos = responseTimeVsRequestInfos;
    prepareSeries(infos.data);
    if (isGraph($("#flotResponseTimeVsRequest"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesResponseTimeVsRequest");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotResponseTimeVsRequest", "#overviewResponseTimeVsRequest");
        $('#footerResponseRimeVsRequest .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};


var latenciesVsRequestInfos = {
    data: {"result": {"minY": 14686.0, "minX": 2.0, "maxY": 67778.5, "series": [{"data": [[2.0, 44953.0], [8.0, 59976.0], [4.0, 59997.0], [10.0, 43318.5], [6.0, 14686.0], [12.0, 67778.5]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 12.0, "title": "Latencies Vs Request"}},
    getOptions: function() {
        return{
            series: {
                lines: {
                    show: false
                },
                points: {
                    show: true
                }
            },
            xaxis: {
                axisLabel: "Global number of requests per second",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            yaxis: {
                axisLabel: "Median Latency in ms",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelFontFamily: 'Verdana, Arial',
                axisLabelPadding: 20,
            },
            legend: { noColumns: 2,show: true, container: '#legendLatencyVsRequest' },
            selection: {
                mode: 'xy'
            },
            grid: {
                hoverable: true // IMPORTANT! this is needed for tooltip to work
            },
            tooltip: true,
            tooltipOpts: {
                content: "%s : Median Latency time at %x req/s was %y ms"
            },
            colors: ["#9ACD32", "#FF6347"]
        };
    },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesLatencyVsRequest"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotLatenciesVsRequest"), dataset, options);
        // setup overview
        $.plot($("#overviewLatenciesVsRequest"), dataset, prepareOverviewOptions(options));
    }
};

// Latencies vs Request
function refreshLatenciesVsRequest() {
        var infos = latenciesVsRequestInfos;
        prepareSeries(infos.data);
        if(isGraph($("#flotLatenciesVsRequest"))){
            infos.createGraph();
        }else{
            var choiceContainer = $("#choicesLatencyVsRequest");
            createLegend(choiceContainer, infos);
            infos.createGraph();
            setGraphZoomable("#flotLatenciesVsRequest", "#overviewLatenciesVsRequest");
            $('#footerLatenciesVsRequest .legendColorBox > div').each(function(i){
                $(this).clone().prependTo(choiceContainer.find("li").eq(i));
            });
        }
};

var hitsPerSecondInfos = {
        data: {"result": {"minY": 1.0, "minX": 1.65824658E12, "maxY": 4.733333333333333, "series": [{"data": [[1.65824664E12, 1.0], [1.65824658E12, 4.733333333333333]], "isOverall": false, "label": "hitsPerSecond", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.65824664E12, "title": "Hits Per Second"}},
        getOptions: function() {
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of hits / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendHitsPerSecond"
                },
                selection: {
                    mode : 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y.2 hits/sec"
                }
            };
        },
        createGraph: function createGraph() {
            var data = this.data;
            var dataset = prepareData(data.result.series, $("#choicesHitsPerSecond"));
            var options = this.getOptions();
            prepareOptions(options, data);
            $.plot($("#flotHitsPerSecond"), dataset, options);
            // setup overview
            $.plot($("#overviewHitsPerSecond"), dataset, prepareOverviewOptions(options));
        }
};

// Hits per second
function refreshHitsPerSecond(fixTimestamps) {
    var infos = hitsPerSecondInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -14400000);
    }
    if (isGraph($("#flotHitsPerSecond"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesHitsPerSecond");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotHitsPerSecond", "#overviewHitsPerSecond");
        $('#footerHitsPerSecond .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
}

var codesPerSecondInfos = {
        data: {"result": {"minY": 1.4, "minX": 1.65824658E12, "maxY": 2.8, "series": [{"data": [[1.65824664E12, 2.8], [1.6582467E12, 1.5333333333333334], [1.65824658E12, 1.4]], "isOverall": false, "label": "200", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.6582467E12, "title": "Codes Per Second"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of responses / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendCodesPerSecond"
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "Number of Response Codes %s at %x was %y.2 responses / sec"
                }
            };
        },
    createGraph: function() {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesCodesPerSecond"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotCodesPerSecond"), dataset, options);
        // setup overview
        $.plot($("#overviewCodesPerSecond"), dataset, prepareOverviewOptions(options));
    }
};

// Codes per second
function refreshCodesPerSecond(fixTimestamps) {
    var infos = codesPerSecondInfos;
    prepareSeries(infos.data);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -14400000);
    }
    if(isGraph($("#flotCodesPerSecond"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesCodesPerSecond");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotCodesPerSecond", "#overviewCodesPerSecond");
        $('#footerCodesPerSecond .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var transactionsPerSecondInfos = {
        data: {"result": {"minY": 1.4, "minX": 1.65824658E12, "maxY": 2.8, "series": [{"data": [[1.65824664E12, 2.8], [1.6582467E12, 1.5333333333333334], [1.65824658E12, 1.4]], "isOverall": false, "label": "NCPPServerEastGFSAreaUS-1time-fullzedd-success", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.6582467E12, "title": "Transactions Per Second"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of transactions / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendTransactionsPerSecond"
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y transactions / sec"
                }
            };
        },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesTransactionsPerSecond"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotTransactionsPerSecond"), dataset, options);
        // setup overview
        $.plot($("#overviewTransactionsPerSecond"), dataset, prepareOverviewOptions(options));
    }
};

// Transactions per second
function refreshTransactionsPerSecond(fixTimestamps) {
    var infos = transactionsPerSecondInfos;
    prepareSeries(infos.data);
    if(infos.data.result.series.length == 0) {
        setEmptyGraph("#bodyTransactionsPerSecond");
        return;
    }
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -14400000);
    }
    if(isGraph($("#flotTransactionsPerSecond"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesTransactionsPerSecond");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotTransactionsPerSecond", "#overviewTransactionsPerSecond");
        $('#footerTransactionsPerSecond .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

var totalTPSInfos = {
        data: {"result": {"minY": 1.4, "minX": 1.65824658E12, "maxY": 2.8, "series": [{"data": [[1.65824664E12, 2.8], [1.6582467E12, 1.5333333333333334], [1.65824658E12, 1.4]], "isOverall": false, "label": "Transaction-success", "isController": false}, {"data": [], "isOverall": false, "label": "Transaction-failure", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.6582467E12, "title": "Total Transactions Per Second"}},
        getOptions: function(){
            return {
                series: {
                    lines: {
                        show: true
                    },
                    points: {
                        show: true
                    }
                },
                xaxis: {
                    mode: "time",
                    timeformat: getTimeFormat(this.data.result.granularity),
                    axisLabel: getElapsedTimeLabel(this.data.result.granularity),
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20,
                },
                yaxis: {
                    axisLabel: "Number of transactions / sec",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelFontFamily: 'Verdana, Arial',
                    axisLabelPadding: 20
                },
                legend: {
                    noColumns: 2,
                    show: true,
                    container: "#legendTotalTPS"
                },
                selection: {
                    mode: 'xy'
                },
                grid: {
                    hoverable: true // IMPORTANT! this is needed for tooltip to
                                    // work
                },
                tooltip: true,
                tooltipOpts: {
                    content: "%s at %x was %y transactions / sec"
                },
                colors: ["#9ACD32", "#FF6347"]
            };
        },
    createGraph: function () {
        var data = this.data;
        var dataset = prepareData(data.result.series, $("#choicesTotalTPS"));
        var options = this.getOptions();
        prepareOptions(options, data);
        $.plot($("#flotTotalTPS"), dataset, options);
        // setup overview
        $.plot($("#overviewTotalTPS"), dataset, prepareOverviewOptions(options));
    }
};

// Total Transactions per second
function refreshTotalTPS(fixTimestamps) {
    var infos = totalTPSInfos;
    // We want to ignore seriesFilter
    prepareSeries(infos.data, false, true);
    if(fixTimestamps) {
        fixTimeStamps(infos.data.result.series, -14400000);
    }
    if(isGraph($("#flotTotalTPS"))){
        infos.createGraph();
    }else{
        var choiceContainer = $("#choicesTotalTPS");
        createLegend(choiceContainer, infos);
        infos.createGraph();
        setGraphZoomable("#flotTotalTPS", "#overviewTotalTPS");
        $('#footerTotalTPS .legendColorBox > div').each(function(i){
            $(this).clone().prependTo(choiceContainer.find("li").eq(i));
        });
    }
};

// Collapse the graph matching the specified DOM element depending the collapsed
// status
function collapse(elem, collapsed){
    if(collapsed){
        $(elem).parent().find(".fa-chevron-up").removeClass("fa-chevron-up").addClass("fa-chevron-down");
    } else {
        $(elem).parent().find(".fa-chevron-down").removeClass("fa-chevron-down").addClass("fa-chevron-up");
        if (elem.id == "bodyBytesThroughputOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshBytesThroughputOverTime(true);
            }
            document.location.href="#bytesThroughputOverTime";
        } else if (elem.id == "bodyLatenciesOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshLatenciesOverTime(true);
            }
            document.location.href="#latenciesOverTime";
        } else if (elem.id == "bodyCustomGraph") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshCustomGraph(true);
            }
            document.location.href="#responseCustomGraph";
        } else if (elem.id == "bodyConnectTimeOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshConnectTimeOverTime(true);
            }
            document.location.href="#connectTimeOverTime";
        } else if (elem.id == "bodyResponseTimePercentilesOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshResponseTimePercentilesOverTime(true);
            }
            document.location.href="#responseTimePercentilesOverTime";
        } else if (elem.id == "bodyResponseTimeDistribution") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshResponseTimeDistribution();
            }
            document.location.href="#responseTimeDistribution" ;
        } else if (elem.id == "bodySyntheticResponseTimeDistribution") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshSyntheticResponseTimeDistribution();
            }
            document.location.href="#syntheticResponseTimeDistribution" ;
        } else if (elem.id == "bodyActiveThreadsOverTime") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshActiveThreadsOverTime(true);
            }
            document.location.href="#activeThreadsOverTime";
        } else if (elem.id == "bodyTimeVsThreads") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshTimeVsThreads();
            }
            document.location.href="#timeVsThreads" ;
        } else if (elem.id == "bodyCodesPerSecond") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshCodesPerSecond(true);
            }
            document.location.href="#codesPerSecond";
        } else if (elem.id == "bodyTransactionsPerSecond") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshTransactionsPerSecond(true);
            }
            document.location.href="#transactionsPerSecond";
        } else if (elem.id == "bodyTotalTPS") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshTotalTPS(true);
            }
            document.location.href="#totalTPS";
        } else if (elem.id == "bodyResponseTimeVsRequest") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshResponseTimeVsRequest();
            }
            document.location.href="#responseTimeVsRequest";
        } else if (elem.id == "bodyLatenciesVsRequest") {
            if (isGraph($(elem).find('.flot-chart-content')) == false) {
                refreshLatenciesVsRequest();
            }
            document.location.href="#latencyVsRequest";
        }
    }
}

/*
 * Activates or deactivates all series of the specified graph (represented by id parameter)
 * depending on checked argument.
 */
function toggleAll(id, checked){
    var placeholder = document.getElementById(id);

    var cases = $(placeholder).find(':checkbox');
    cases.prop('checked', checked);
    $(cases).parent().children().children().toggleClass("legend-disabled", !checked);

    var choiceContainer;
    if ( id == "choicesBytesThroughputOverTime"){
        choiceContainer = $("#choicesBytesThroughputOverTime");
        refreshBytesThroughputOverTime(false);
    } else if(id == "choicesResponseTimesOverTime"){
        choiceContainer = $("#choicesResponseTimesOverTime");
        refreshResponseTimeOverTime(false);
    }else if(id == "choicesResponseCustomGraph"){
        choiceContainer = $("#choicesResponseCustomGraph");
        refreshCustomGraph(false);
    } else if ( id == "choicesLatenciesOverTime"){
        choiceContainer = $("#choicesLatenciesOverTime");
        refreshLatenciesOverTime(false);
    } else if ( id == "choicesConnectTimeOverTime"){
        choiceContainer = $("#choicesConnectTimeOverTime");
        refreshConnectTimeOverTime(false);
    } else if ( id == "choicesResponseTimePercentilesOverTime"){
        choiceContainer = $("#choicesResponseTimePercentilesOverTime");
        refreshResponseTimePercentilesOverTime(false);
    } else if ( id == "choicesResponseTimePercentiles"){
        choiceContainer = $("#choicesResponseTimePercentiles");
        refreshResponseTimePercentiles();
    } else if(id == "choicesActiveThreadsOverTime"){
        choiceContainer = $("#choicesActiveThreadsOverTime");
        refreshActiveThreadsOverTime(false);
    } else if ( id == "choicesTimeVsThreads"){
        choiceContainer = $("#choicesTimeVsThreads");
        refreshTimeVsThreads();
    } else if ( id == "choicesSyntheticResponseTimeDistribution"){
        choiceContainer = $("#choicesSyntheticResponseTimeDistribution");
        refreshSyntheticResponseTimeDistribution();
    } else if ( id == "choicesResponseTimeDistribution"){
        choiceContainer = $("#choicesResponseTimeDistribution");
        refreshResponseTimeDistribution();
    } else if ( id == "choicesHitsPerSecond"){
        choiceContainer = $("#choicesHitsPerSecond");
        refreshHitsPerSecond(false);
    } else if(id == "choicesCodesPerSecond"){
        choiceContainer = $("#choicesCodesPerSecond");
        refreshCodesPerSecond(false);
    } else if ( id == "choicesTransactionsPerSecond"){
        choiceContainer = $("#choicesTransactionsPerSecond");
        refreshTransactionsPerSecond(false);
    } else if ( id == "choicesTotalTPS"){
        choiceContainer = $("#choicesTotalTPS");
        refreshTotalTPS(false);
    } else if ( id == "choicesResponseTimeVsRequest"){
        choiceContainer = $("#choicesResponseTimeVsRequest");
        refreshResponseTimeVsRequest();
    } else if ( id == "choicesLatencyVsRequest"){
        choiceContainer = $("#choicesLatencyVsRequest");
        refreshLatenciesVsRequest();
    }
    var color = checked ? "black" : "#818181";
    if(choiceContainer != null) {
        choiceContainer.find("label").each(function(){
            this.style.color = color;
        });
    }
}

