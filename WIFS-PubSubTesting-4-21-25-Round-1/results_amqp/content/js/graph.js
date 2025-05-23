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
        data: {"result": {"minY": 0.0, "minX": 0.0, "maxY": 21.0, "series": [{"data": [[0.0, 0.0], [0.1, 0.0], [0.2, 0.0], [0.3, 0.0], [0.4, 0.0], [0.5, 0.0], [0.6, 0.0], [0.7, 0.0], [0.8, 0.0], [0.9, 0.0], [1.0, 0.0], [1.1, 0.0], [1.2, 0.0], [1.3, 0.0], [1.4, 0.0], [1.5, 0.0], [1.6, 0.0], [1.7, 0.0], [1.8, 0.0], [1.9, 0.0], [2.0, 0.0], [2.1, 0.0], [2.2, 0.0], [2.3, 0.0], [2.4, 0.0], [2.5, 0.0], [2.6, 0.0], [2.7, 0.0], [2.8, 0.0], [2.9, 0.0], [3.0, 0.0], [3.1, 0.0], [3.2, 0.0], [3.3, 0.0], [3.4, 0.0], [3.5, 0.0], [3.6, 0.0], [3.7, 0.0], [3.8, 0.0], [3.9, 0.0], [4.0, 0.0], [4.1, 0.0], [4.2, 0.0], [4.3, 0.0], [4.4, 0.0], [4.5, 0.0], [4.6, 0.0], [4.7, 0.0], [4.8, 0.0], [4.9, 0.0], [5.0, 0.0], [5.1, 0.0], [5.2, 0.0], [5.3, 0.0], [5.4, 0.0], [5.5, 0.0], [5.6, 0.0], [5.7, 0.0], [5.8, 0.0], [5.9, 0.0], [6.0, 0.0], [6.1, 0.0], [6.2, 0.0], [6.3, 0.0], [6.4, 0.0], [6.5, 0.0], [6.6, 0.0], [6.7, 0.0], [6.8, 0.0], [6.9, 0.0], [7.0, 0.0], [7.1, 0.0], [7.2, 0.0], [7.3, 0.0], [7.4, 0.0], [7.5, 0.0], [7.6, 0.0], [7.7, 0.0], [7.8, 0.0], [7.9, 0.0], [8.0, 0.0], [8.1, 0.0], [8.2, 0.0], [8.3, 0.0], [8.4, 0.0], [8.5, 0.0], [8.6, 0.0], [8.7, 0.0], [8.8, 0.0], [8.9, 0.0], [9.0, 0.0], [9.1, 0.0], [9.2, 0.0], [9.3, 0.0], [9.4, 0.0], [9.5, 0.0], [9.6, 0.0], [9.7, 0.0], [9.8, 0.0], [9.9, 0.0], [10.0, 0.0], [10.1, 0.0], [10.2, 0.0], [10.3, 0.0], [10.4, 0.0], [10.5, 0.0], [10.6, 0.0], [10.7, 0.0], [10.8, 0.0], [10.9, 0.0], [11.0, 0.0], [11.1, 0.0], [11.2, 0.0], [11.3, 0.0], [11.4, 0.0], [11.5, 0.0], [11.6, 0.0], [11.7, 0.0], [11.8, 0.0], [11.9, 0.0], [12.0, 0.0], [12.1, 0.0], [12.2, 0.0], [12.3, 0.0], [12.4, 0.0], [12.5, 0.0], [12.6, 0.0], [12.7, 0.0], [12.8, 0.0], [12.9, 0.0], [13.0, 0.0], [13.1, 0.0], [13.2, 0.0], [13.3, 0.0], [13.4, 0.0], [13.5, 0.0], [13.6, 0.0], [13.7, 0.0], [13.8, 0.0], [13.9, 0.0], [14.0, 0.0], [14.1, 0.0], [14.2, 0.0], [14.3, 0.0], [14.4, 0.0], [14.5, 0.0], [14.6, 0.0], [14.7, 0.0], [14.8, 0.0], [14.9, 0.0], [15.0, 0.0], [15.1, 0.0], [15.2, 0.0], [15.3, 0.0], [15.4, 0.0], [15.5, 0.0], [15.6, 0.0], [15.7, 0.0], [15.8, 0.0], [15.9, 0.0], [16.0, 0.0], [16.1, 0.0], [16.2, 0.0], [16.3, 0.0], [16.4, 0.0], [16.5, 0.0], [16.6, 0.0], [16.7, 0.0], [16.8, 0.0], [16.9, 0.0], [17.0, 0.0], [17.1, 0.0], [17.2, 0.0], [17.3, 0.0], [17.4, 0.0], [17.5, 0.0], [17.6, 0.0], [17.7, 0.0], [17.8, 0.0], [17.9, 0.0], [18.0, 0.0], [18.1, 0.0], [18.2, 0.0], [18.3, 0.0], [18.4, 0.0], [18.5, 0.0], [18.6, 0.0], [18.7, 0.0], [18.8, 0.0], [18.9, 0.0], [19.0, 0.0], [19.1, 0.0], [19.2, 0.0], [19.3, 0.0], [19.4, 0.0], [19.5, 0.0], [19.6, 0.0], [19.7, 0.0], [19.8, 0.0], [19.9, 0.0], [20.0, 0.0], [20.1, 0.0], [20.2, 0.0], [20.3, 0.0], [20.4, 0.0], [20.5, 0.0], [20.6, 0.0], [20.7, 0.0], [20.8, 0.0], [20.9, 0.0], [21.0, 0.0], [21.1, 0.0], [21.2, 0.0], [21.3, 0.0], [21.4, 0.0], [21.5, 0.0], [21.6, 0.0], [21.7, 0.0], [21.8, 0.0], [21.9, 0.0], [22.0, 0.0], [22.1, 0.0], [22.2, 0.0], [22.3, 0.0], [22.4, 0.0], [22.5, 0.0], [22.6, 0.0], [22.7, 0.0], [22.8, 0.0], [22.9, 0.0], [23.0, 0.0], [23.1, 0.0], [23.2, 0.0], [23.3, 0.0], [23.4, 0.0], [23.5, 0.0], [23.6, 0.0], [23.7, 0.0], [23.8, 0.0], [23.9, 0.0], [24.0, 0.0], [24.1, 0.0], [24.2, 0.0], [24.3, 0.0], [24.4, 0.0], [24.5, 0.0], [24.6, 0.0], [24.7, 0.0], [24.8, 0.0], [24.9, 0.0], [25.0, 0.0], [25.1, 0.0], [25.2, 0.0], [25.3, 0.0], [25.4, 0.0], [25.5, 0.0], [25.6, 0.0], [25.7, 0.0], [25.8, 0.0], [25.9, 0.0], [26.0, 0.0], [26.1, 0.0], [26.2, 0.0], [26.3, 0.0], [26.4, 0.0], [26.5, 0.0], [26.6, 0.0], [26.7, 0.0], [26.8, 0.0], [26.9, 0.0], [27.0, 0.0], [27.1, 0.0], [27.2, 0.0], [27.3, 0.0], [27.4, 0.0], [27.5, 0.0], [27.6, 0.0], [27.7, 0.0], [27.8, 0.0], [27.9, 0.0], [28.0, 0.0], [28.1, 0.0], [28.2, 0.0], [28.3, 0.0], [28.4, 0.0], [28.5, 0.0], [28.6, 0.0], [28.7, 0.0], [28.8, 0.0], [28.9, 0.0], [29.0, 0.0], [29.1, 0.0], [29.2, 0.0], [29.3, 0.0], [29.4, 0.0], [29.5, 0.0], [29.6, 0.0], [29.7, 0.0], [29.8, 0.0], [29.9, 0.0], [30.0, 0.0], [30.1, 0.0], [30.2, 0.0], [30.3, 0.0], [30.4, 0.0], [30.5, 0.0], [30.6, 0.0], [30.7, 0.0], [30.8, 0.0], [30.9, 0.0], [31.0, 0.0], [31.1, 0.0], [31.2, 0.0], [31.3, 0.0], [31.4, 0.0], [31.5, 0.0], [31.6, 0.0], [31.7, 0.0], [31.8, 0.0], [31.9, 0.0], [32.0, 0.0], [32.1, 0.0], [32.2, 0.0], [32.3, 0.0], [32.4, 0.0], [32.5, 0.0], [32.6, 0.0], [32.7, 0.0], [32.8, 0.0], [32.9, 0.0], [33.0, 0.0], [33.1, 0.0], [33.2, 0.0], [33.3, 0.0], [33.4, 0.0], [33.5, 0.0], [33.6, 0.0], [33.7, 0.0], [33.8, 0.0], [33.9, 0.0], [34.0, 0.0], [34.1, 0.0], [34.2, 0.0], [34.3, 0.0], [34.4, 0.0], [34.5, 0.0], [34.6, 0.0], [34.7, 0.0], [34.8, 0.0], [34.9, 0.0], [35.0, 0.0], [35.1, 0.0], [35.2, 0.0], [35.3, 0.0], [35.4, 0.0], [35.5, 0.0], [35.6, 0.0], [35.7, 0.0], [35.8, 0.0], [35.9, 0.0], [36.0, 0.0], [36.1, 0.0], [36.2, 0.0], [36.3, 0.0], [36.4, 0.0], [36.5, 0.0], [36.6, 0.0], [36.7, 0.0], [36.8, 0.0], [36.9, 0.0], [37.0, 0.0], [37.1, 0.0], [37.2, 0.0], [37.3, 0.0], [37.4, 0.0], [37.5, 0.0], [37.6, 0.0], [37.7, 0.0], [37.8, 0.0], [37.9, 0.0], [38.0, 0.0], [38.1, 0.0], [38.2, 0.0], [38.3, 0.0], [38.4, 0.0], [38.5, 0.0], [38.6, 0.0], [38.7, 0.0], [38.8, 0.0], [38.9, 0.0], [39.0, 0.0], [39.1, 0.0], [39.2, 0.0], [39.3, 0.0], [39.4, 0.0], [39.5, 0.0], [39.6, 0.0], [39.7, 0.0], [39.8, 0.0], [39.9, 0.0], [40.0, 0.0], [40.1, 0.0], [40.2, 0.0], [40.3, 0.0], [40.4, 0.0], [40.5, 0.0], [40.6, 0.0], [40.7, 0.0], [40.8, 0.0], [40.9, 0.0], [41.0, 0.0], [41.1, 0.0], [41.2, 0.0], [41.3, 0.0], [41.4, 0.0], [41.5, 0.0], [41.6, 0.0], [41.7, 0.0], [41.8, 0.0], [41.9, 0.0], [42.0, 0.0], [42.1, 0.0], [42.2, 0.0], [42.3, 0.0], [42.4, 0.0], [42.5, 0.0], [42.6, 0.0], [42.7, 0.0], [42.8, 0.0], [42.9, 0.0], [43.0, 0.0], [43.1, 0.0], [43.2, 0.0], [43.3, 0.0], [43.4, 0.0], [43.5, 0.0], [43.6, 0.0], [43.7, 0.0], [43.8, 0.0], [43.9, 0.0], [44.0, 0.0], [44.1, 0.0], [44.2, 0.0], [44.3, 0.0], [44.4, 0.0], [44.5, 0.0], [44.6, 0.0], [44.7, 0.0], [44.8, 0.0], [44.9, 0.0], [45.0, 0.0], [45.1, 0.0], [45.2, 0.0], [45.3, 0.0], [45.4, 0.0], [45.5, 0.0], [45.6, 0.0], [45.7, 0.0], [45.8, 0.0], [45.9, 0.0], [46.0, 0.0], [46.1, 0.0], [46.2, 0.0], [46.3, 0.0], [46.4, 0.0], [46.5, 0.0], [46.6, 0.0], [46.7, 0.0], [46.8, 0.0], [46.9, 0.0], [47.0, 0.0], [47.1, 0.0], [47.2, 0.0], [47.3, 0.0], [47.4, 0.0], [47.5, 0.0], [47.6, 0.0], [47.7, 0.0], [47.8, 0.0], [47.9, 0.0], [48.0, 0.0], [48.1, 0.0], [48.2, 0.0], [48.3, 0.0], [48.4, 0.0], [48.5, 0.0], [48.6, 0.0], [48.7, 0.0], [48.8, 0.0], [48.9, 0.0], [49.0, 0.0], [49.1, 0.0], [49.2, 0.0], [49.3, 0.0], [49.4, 0.0], [49.5, 0.0], [49.6, 0.0], [49.7, 0.0], [49.8, 0.0], [49.9, 0.0], [50.0, 0.0], [50.1, 0.0], [50.2, 0.0], [50.3, 0.0], [50.4, 0.0], [50.5, 0.0], [50.6, 0.0], [50.7, 0.0], [50.8, 0.0], [50.9, 0.0], [51.0, 0.0], [51.1, 0.0], [51.2, 0.0], [51.3, 0.0], [51.4, 0.0], [51.5, 0.0], [51.6, 0.0], [51.7, 0.0], [51.8, 0.0], [51.9, 0.0], [52.0, 0.0], [52.1, 0.0], [52.2, 0.0], [52.3, 0.0], [52.4, 0.0], [52.5, 0.0], [52.6, 0.0], [52.7, 0.0], [52.8, 0.0], [52.9, 0.0], [53.0, 0.0], [53.1, 0.0], [53.2, 0.0], [53.3, 0.0], [53.4, 0.0], [53.5, 0.0], [53.6, 0.0], [53.7, 0.0], [53.8, 0.0], [53.9, 0.0], [54.0, 0.0], [54.1, 0.0], [54.2, 0.0], [54.3, 0.0], [54.4, 0.0], [54.5, 0.0], [54.6, 0.0], [54.7, 0.0], [54.8, 0.0], [54.9, 0.0], [55.0, 0.0], [55.1, 0.0], [55.2, 0.0], [55.3, 0.0], [55.4, 0.0], [55.5, 0.0], [55.6, 0.0], [55.7, 0.0], [55.8, 0.0], [55.9, 0.0], [56.0, 0.0], [56.1, 0.0], [56.2, 0.0], [56.3, 0.0], [56.4, 0.0], [56.5, 0.0], [56.6, 0.0], [56.7, 0.0], [56.8, 0.0], [56.9, 0.0], [57.0, 0.0], [57.1, 0.0], [57.2, 0.0], [57.3, 0.0], [57.4, 0.0], [57.5, 0.0], [57.6, 0.0], [57.7, 0.0], [57.8, 0.0], [57.9, 0.0], [58.0, 0.0], [58.1, 0.0], [58.2, 0.0], [58.3, 0.0], [58.4, 0.0], [58.5, 0.0], [58.6, 0.0], [58.7, 0.0], [58.8, 0.0], [58.9, 0.0], [59.0, 0.0], [59.1, 0.0], [59.2, 0.0], [59.3, 0.0], [59.4, 0.0], [59.5, 0.0], [59.6, 0.0], [59.7, 0.0], [59.8, 0.0], [59.9, 0.0], [60.0, 0.0], [60.1, 0.0], [60.2, 0.0], [60.3, 0.0], [60.4, 0.0], [60.5, 0.0], [60.6, 0.0], [60.7, 0.0], [60.8, 0.0], [60.9, 0.0], [61.0, 0.0], [61.1, 0.0], [61.2, 0.0], [61.3, 0.0], [61.4, 0.0], [61.5, 0.0], [61.6, 0.0], [61.7, 0.0], [61.8, 0.0], [61.9, 0.0], [62.0, 0.0], [62.1, 0.0], [62.2, 0.0], [62.3, 0.0], [62.4, 0.0], [62.5, 0.0], [62.6, 0.0], [62.7, 0.0], [62.8, 0.0], [62.9, 0.0], [63.0, 0.0], [63.1, 0.0], [63.2, 0.0], [63.3, 0.0], [63.4, 0.0], [63.5, 0.0], [63.6, 0.0], [63.7, 0.0], [63.8, 0.0], [63.9, 0.0], [64.0, 0.0], [64.1, 0.0], [64.2, 0.0], [64.3, 0.0], [64.4, 0.0], [64.5, 0.0], [64.6, 0.0], [64.7, 0.0], [64.8, 0.0], [64.9, 0.0], [65.0, 0.0], [65.1, 0.0], [65.2, 0.0], [65.3, 0.0], [65.4, 0.0], [65.5, 0.0], [65.6, 0.0], [65.7, 0.0], [65.8, 0.0], [65.9, 0.0], [66.0, 0.0], [66.1, 0.0], [66.2, 0.0], [66.3, 0.0], [66.4, 0.0], [66.5, 0.0], [66.6, 0.0], [66.7, 0.0], [66.8, 0.0], [66.9, 0.0], [67.0, 0.0], [67.1, 0.0], [67.2, 0.0], [67.3, 0.0], [67.4, 0.0], [67.5, 0.0], [67.6, 0.0], [67.7, 0.0], [67.8, 0.0], [67.9, 0.0], [68.0, 0.0], [68.1, 0.0], [68.2, 0.0], [68.3, 0.0], [68.4, 0.0], [68.5, 0.0], [68.6, 0.0], [68.7, 0.0], [68.8, 0.0], [68.9, 0.0], [69.0, 0.0], [69.1, 0.0], [69.2, 0.0], [69.3, 0.0], [69.4, 0.0], [69.5, 0.0], [69.6, 0.0], [69.7, 0.0], [69.8, 0.0], [69.9, 0.0], [70.0, 0.0], [70.1, 0.0], [70.2, 0.0], [70.3, 0.0], [70.4, 0.0], [70.5, 0.0], [70.6, 0.0], [70.7, 0.0], [70.8, 0.0], [70.9, 0.0], [71.0, 0.0], [71.1, 0.0], [71.2, 0.0], [71.3, 0.0], [71.4, 0.0], [71.5, 0.0], [71.6, 0.0], [71.7, 0.0], [71.8, 0.0], [71.9, 0.0], [72.0, 0.0], [72.1, 0.0], [72.2, 0.0], [72.3, 0.0], [72.4, 0.0], [72.5, 0.0], [72.6, 0.0], [72.7, 0.0], [72.8, 0.0], [72.9, 0.0], [73.0, 0.0], [73.1, 0.0], [73.2, 0.0], [73.3, 0.0], [73.4, 0.0], [73.5, 0.0], [73.6, 0.0], [73.7, 0.0], [73.8, 0.0], [73.9, 0.0], [74.0, 0.0], [74.1, 0.0], [74.2, 0.0], [74.3, 0.0], [74.4, 0.0], [74.5, 0.0], [74.6, 0.0], [74.7, 0.0], [74.8, 0.0], [74.9, 0.0], [75.0, 0.0], [75.1, 0.0], [75.2, 0.0], [75.3, 0.0], [75.4, 0.0], [75.5, 0.0], [75.6, 0.0], [75.7, 0.0], [75.8, 0.0], [75.9, 0.0], [76.0, 0.0], [76.1, 0.0], [76.2, 0.0], [76.3, 0.0], [76.4, 0.0], [76.5, 0.0], [76.6, 0.0], [76.7, 0.0], [76.8, 0.0], [76.9, 0.0], [77.0, 0.0], [77.1, 0.0], [77.2, 0.0], [77.3, 0.0], [77.4, 0.0], [77.5, 0.0], [77.6, 0.0], [77.7, 0.0], [77.8, 0.0], [77.9, 0.0], [78.0, 0.0], [78.1, 0.0], [78.2, 0.0], [78.3, 0.0], [78.4, 0.0], [78.5, 0.0], [78.6, 0.0], [78.7, 0.0], [78.8, 0.0], [78.9, 0.0], [79.0, 0.0], [79.1, 0.0], [79.2, 0.0], [79.3, 0.0], [79.4, 0.0], [79.5, 0.0], [79.6, 0.0], [79.7, 0.0], [79.8, 0.0], [79.9, 0.0], [80.0, 0.0], [80.1, 0.0], [80.2, 0.0], [80.3, 0.0], [80.4, 0.0], [80.5, 0.0], [80.6, 0.0], [80.7, 0.0], [80.8, 0.0], [80.9, 0.0], [81.0, 0.0], [81.1, 0.0], [81.2, 0.0], [81.3, 0.0], [81.4, 0.0], [81.5, 0.0], [81.6, 0.0], [81.7, 0.0], [81.8, 0.0], [81.9, 0.0], [82.0, 0.0], [82.1, 0.0], [82.2, 0.0], [82.3, 0.0], [82.4, 0.0], [82.5, 0.0], [82.6, 0.0], [82.7, 0.0], [82.8, 0.0], [82.9, 0.0], [83.0, 0.0], [83.1, 0.0], [83.2, 0.0], [83.3, 0.0], [83.4, 0.0], [83.5, 0.0], [83.6, 0.0], [83.7, 0.0], [83.8, 0.0], [83.9, 0.0], [84.0, 0.0], [84.1, 0.0], [84.2, 0.0], [84.3, 0.0], [84.4, 0.0], [84.5, 0.0], [84.6, 0.0], [84.7, 0.0], [84.8, 0.0], [84.9, 0.0], [85.0, 0.0], [85.1, 0.0], [85.2, 0.0], [85.3, 0.0], [85.4, 0.0], [85.5, 0.0], [85.6, 0.0], [85.7, 0.0], [85.8, 0.0], [85.9, 0.0], [86.0, 0.0], [86.1, 0.0], [86.2, 0.0], [86.3, 0.0], [86.4, 0.0], [86.5, 0.0], [86.6, 0.0], [86.7, 0.0], [86.8, 0.0], [86.9, 0.0], [87.0, 0.0], [87.1, 0.0], [87.2, 0.0], [87.3, 0.0], [87.4, 0.0], [87.5, 0.0], [87.6, 0.0], [87.7, 0.0], [87.8, 0.0], [87.9, 0.0], [88.0, 0.0], [88.1, 0.0], [88.2, 0.0], [88.3, 0.0], [88.4, 0.0], [88.5, 0.0], [88.6, 0.0], [88.7, 0.0], [88.8, 0.0], [88.9, 0.0], [89.0, 0.0], [89.1, 0.0], [89.2, 0.0], [89.3, 0.0], [89.4, 0.0], [89.5, 0.0], [89.6, 0.0], [89.7, 0.0], [89.8, 0.0], [89.9, 0.0], [90.0, 0.0], [90.1, 0.0], [90.2, 0.0], [90.3, 0.0], [90.4, 0.0], [90.5, 0.0], [90.6, 0.0], [90.7, 0.0], [90.8, 0.0], [90.9, 0.0], [91.0, 0.0], [91.1, 0.0], [91.2, 0.0], [91.3, 0.0], [91.4, 0.0], [91.5, 0.0], [91.6, 0.0], [91.7, 0.0], [91.8, 0.0], [91.9, 0.0], [92.0, 0.0], [92.1, 0.0], [92.2, 0.0], [92.3, 0.0], [92.4, 0.0], [92.5, 0.0], [92.6, 0.0], [92.7, 0.0], [92.8, 0.0], [92.9, 0.0], [93.0, 0.0], [93.1, 0.0], [93.2, 0.0], [93.3, 0.0], [93.4, 0.0], [93.5, 0.0], [93.6, 0.0], [93.7, 0.0], [93.8, 0.0], [93.9, 0.0], [94.0, 0.0], [94.1, 0.0], [94.2, 0.0], [94.3, 0.0], [94.4, 0.0], [94.5, 0.0], [94.6, 0.0], [94.7, 0.0], [94.8, 0.0], [94.9, 0.0], [95.0, 0.0], [95.1, 0.0], [95.2, 0.0], [95.3, 0.0], [95.4, 0.0], [95.5, 0.0], [95.6, 0.0], [95.7, 0.0], [95.8, 0.0], [95.9, 0.0], [96.0, 0.0], [96.1, 0.0], [96.2, 0.0], [96.3, 0.0], [96.4, 0.0], [96.5, 0.0], [96.6, 0.0], [96.7, 0.0], [96.8, 0.0], [96.9, 0.0], [97.0, 0.0], [97.1, 0.0], [97.2, 0.0], [97.3, 0.0], [97.4, 0.0], [97.5, 0.0], [97.6, 0.0], [97.7, 0.0], [97.8, 0.0], [97.9, 0.0], [98.0, 0.0], [98.1, 0.0], [98.2, 0.0], [98.3, 0.0], [98.4, 0.0], [98.5, 0.0], [98.6, 0.0], [98.7, 0.0], [98.8, 0.0], [98.9, 0.0], [99.0, 0.0], [99.1, 0.0], [99.2, 0.0], [99.3, 0.0], [99.4, 0.0], [99.5, 0.0], [99.6, 0.0], [99.7, 0.0], [99.8, 0.0], [99.9, 0.0], [100.0, 21.0]], "isOverall": false, "label": "AMQP Consumer - collections/tac_opmet_reports/locations/GLOBAL", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 100.0, "title": "Response Time Percentiles"}},
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
        data: {"result": {"minY": 1.5489592E7, "minX": 0.0, "maxY": 1.5489592E7, "series": [{"data": [[0.0, 1.5489592E7]], "isOverall": false, "label": "AMQP Consumer - collections/tac_opmet_reports/locations/GLOBAL", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 100, "maxX": 4.9E-324, "title": "Response Time Distribution"}},
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
        data: {"result": {"minY": 1.5489592E7, "minX": 0.0, "ticks": [[0, "Requests having \nresponse time <= 500ms"], [1, "Requests having \nresponse time > 500ms and <= 1,500ms"], [2, "Requests having \nresponse time > 1,500ms"], [3, "Requests in error"]], "maxY": 1.5489592E7, "series": [{"data": [[0.0, 1.5489592E7]], "color": "#9ACD32", "isOverall": false, "label": "Requests having \nresponse time <= 500ms", "isController": false}, {"data": [], "color": "yellow", "isOverall": false, "label": "Requests having \nresponse time > 500ms and <= 1,500ms", "isController": false}, {"data": [], "color": "orange", "isOverall": false, "label": "Requests having \nresponse time > 1,500ms", "isController": false}, {"data": [], "color": "#FF6347", "isOverall": false, "label": "Requests in error", "isController": false}], "supportsControllersDiscrimination": false, "maxX": 4.9E-324, "title": "Synthetic Response Times Distribution"}},
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
        data: {"result": {"minY": 492.20003225607815, "minX": 1.7452617E12, "maxY": 500.0, "series": [{"data": [[1.74526194E12, 500.0], [1.74526176E12, 500.0], [1.74526224E12, 500.0], [1.74526182E12, 500.0], [1.7452623E12, 492.20003225607815], [1.74526212E12, 500.0], [1.7452617E12, 494.2503822354128], [1.74526218E12, 500.0], [1.745262E12, 500.0], [1.74526206E12, 500.0], [1.74526188E12, 500.0]], "isOverall": false, "label": "Thread Group - 100 users", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.7452623E12, "title": "Active Threads Over Time"}},
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
        fixTimeStamps(infos.data.result.series, 0);
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
        data: {"result": {"minY": 0.0, "minX": 12.0, "maxY": 0.5714285714285714, "series": [{"data": [[12.0, 0.0], [13.0, 0.0], [15.0, 0.0], [16.0, 0.0], [17.0, 0.0], [18.0, 0.0], [19.0, 0.0], [20.0, 0.0], [21.0, 0.0], [22.0, 0.0], [23.0, 0.0], [24.0, 0.0], [25.0, 0.0], [26.0, 0.0], [27.0, 0.0], [28.0, 0.0], [29.0, 0.0], [30.0, 0.0], [31.0, 0.0], [33.0, 0.0], [32.0, 0.0], [35.0, 0.0], [34.0, 0.0], [37.0, 0.0], [36.0, 0.0], [39.0, 0.0], [38.0, 0.0], [41.0, 0.0], [40.0, 0.0], [43.0, 0.0], [42.0, 0.019607843137254912], [45.0, 0.0], [44.0, 0.0], [47.0, 0.0], [46.0, 0.0], [49.0, 0.0], [48.0, 0.0], [51.0, 0.0], [50.0, 0.0], [53.0, 0.0], [55.0, 0.0], [54.0, 0.0], [57.0, 0.0], [56.0, 0.0], [59.0, 0.0], [58.0, 0.0], [61.0, 0.0], [60.0, 0.0], [63.0, 0.0], [62.0, 0.0], [67.0, 0.0], [66.0, 0.0], [65.0, 0.0], [64.0, 0.005780346820809249], [71.0, 0.16666666666666669], [70.0, 8.539709649871917E-4], [69.0, 0.0], [73.0, 0.0], [74.0, 0.0], [75.0, 0.0], [72.0, 0.0], [76.0, 0.0], [77.0, 0.019047619047619067], [79.0, 0.1081081081081081], [78.0, 0.0], [80.0, 0.15625], [81.0, 0.0], [82.0, 0.0], [83.0, 0.0], [84.0, 0.0], [86.0, 0.13095238095238096], [87.0, 0.0], [88.0, 0.0], [89.0, 0.024390243902439036], [90.0, 0.0], [91.0, 0.0], [92.0, 0.0], [93.0, 0.0], [94.0, 0.0], [95.0, 0.0], [96.0, 0.0], [97.0, 0.0], [98.0, 0.0], [99.0, 0.0], [100.0, 0.0], [101.0, 0.0], [102.0, 0.0], [103.0, 0.0], [104.0, 0.0], [105.0, 0.0], [106.0, 0.0], [107.0, 0.0], [108.0, 0.09090909090909093], [109.0, 0.10526315789473686], [110.0, 0.0], [111.0, 0.023809523809523808], [112.0, 0.0], [113.0, 0.0], [114.0, 0.0], [115.0, 0.0], [116.0, 0.0], [117.0, 0.0], [118.0, 0.0], [119.0, 0.0], [120.0, 0.0], [121.0, 0.0], [122.0, 0.012552301255230137], [123.0, 0.0], [124.0, 0.0], [125.0, 0.0], [126.0, 0.0], [127.0, 0.13953488372093026], [133.0, 0.5714285714285714], [134.0, 0.0], [130.0, 0.0], [129.0, 0.030303030303030304], [128.0, 0.0], [135.0, 0.0], [132.0, 0.0], [131.0, 0.0], [136.0, 0.007518796992481206], [137.0, 0.0], [138.0, 0.0], [139.0, 0.0], [140.0, 0.022471910112359553], [141.0, 0.0], [142.0, 0.0], [143.0, 0.0], [144.0, 0.0], [145.0, 0.0], [146.0, 0.0], [147.0, 0.0], [148.0, 0.0], [149.0, 0.0], [150.0, 0.0], [151.0, 0.0], [152.0, 0.0], [153.0, 0.0], [154.0, 0.0], [155.0, 0.0], [156.0, 0.0], [157.0, 0.0], [158.0, 0.0], [159.0, 0.0], [161.0, 0.0], [160.0, 0.0], [162.0, 0.0], [163.0, 0.0], [165.0, 0.0], [167.0, 0.0], [166.0, 0.0], [164.0, 0.0], [168.0, 0.0], [169.0, 0.0], [170.0, 0.022727272727272742], [171.0, 0.0], [172.0, 0.0], [173.0, 0.0], [174.0, 0.0], [175.0, 0.0], [176.0, 0.0], [177.0, 0.0], [178.0, 0.0], [179.0, 0.0], [180.0, 0.0], [181.0, 0.0], [182.0, 0.0], [183.0, 0.0], [184.0, 0.0], [185.0, 0.0], [187.0, 0.0], [188.0, 0.0], [189.0, 0.0], [190.0, 0.0], [191.0, 0.0], [186.0, 0.0], [192.0, 0.0], [193.0, 0.0], [194.0, 0.0], [195.0, 0.0], [196.0, 0.0], [197.0, 0.04666666666666669], [198.0, 0.0], [199.0, 0.12244897959183676], [200.0, 0.0010940919037199142], [201.0, 0.0], [202.0, 0.003086419753086418], [204.0, 0.004830917874396134], [205.0, 0.0], [206.0, 0.0], [207.0, 0.01492537313432836], [203.0, 0.0], [209.0, 0.012931034482758622], [210.0, 0.0], [215.0, 0.0], [214.0, 0.0], [213.0, 0.0], [212.0, 0.0], [211.0, 0.0], [208.0, 0.0], [217.0, 0.0], [218.0, 0.0], [219.0, 0.0], [220.0, 0.0], [221.0, 0.0], [222.0, 0.0], [223.0, 0.0], [216.0, 0.0], [224.0, 0.0], [225.0, 0.0], [228.0, 0.0], [229.0, 0.0], [230.0, 0.0], [231.0, 0.0], [227.0, 0.0], [226.0, 0.0], [232.0, 0.0], [233.0, 0.0], [234.0, 0.0], [235.0, 0.0], [236.0, 0.0], [237.0, 0.0], [238.0, 0.0], [239.0, 0.0019047619047619054], [240.0, 0.0], [241.0, 0.0], [242.0, 0.0], [243.0, 0.0], [244.0, 0.0], [245.0, 0.0], [246.0, 0.0], [247.0, 0.0], [248.0, 0.0], [249.0, 0.0018050541516245497], [250.0, 0.0], [251.0, 0.00510204081632653], [252.0, 0.0037878787878787876], [253.0, 0.0014858841010401188], [254.0, 0.0], [255.0, 0.0], [257.0, 0.0], [256.0, 0.236842105263158], [258.0, 0.0], [259.0, 0.0], [260.0, 0.004032258064516133], [261.0, 0.001893939393939395], [262.0, 0.0], [263.0, 0.0], [268.0, 0.0], [269.0, 0.0], [270.0, 0.0], [271.0, 0.0], [267.0, 0.0], [266.0, 0.0], [265.0, 0.0], [264.0, 0.0], [273.0, 0.0], [272.0, 0.0], [275.0, 0.0], [274.0, 0.0], [284.0, 0.0], [285.0, 0.0], [286.0, 0.0], [287.0, 0.0], [276.0, 0.0], [277.0, 0.0], [278.0, 0.0], [279.0, 0.0], [280.0, 0.0], [281.0, 0.0], [283.0, 0.0], [282.0, 0.004566210045662101], [290.0, 0.0], [291.0, 0.0], [301.0, 0.0], [300.0, 0.0], [303.0, 0.0], [302.0, 0.0], [292.0, 0.0], [293.0, 0.0], [294.0, 0.0], [295.0, 0.0], [289.0, 0.0], [288.0, 0.004694835680751173], [296.0, 0.0], [297.0, 0.0], [298.0, 0.0], [299.0, 0.0], [305.0, 0.0], [304.0, 0.0], [306.0, 0.0], [307.0, 0.006289308176100629], [309.0, 0.0], [308.0, 0.0], [310.0, 0.0], [311.0, 0.0], [312.0, 0.01041666666666667], [318.0, 0.0], [319.0, 0.0], [316.0, 0.0], [317.0, 0.0], [313.0, 0.0], [314.0, 0.0], [315.0, 0.0], [323.0, 0.0], [320.0, 0.0], [321.0, 0.008620689655172415], [322.0, 0.0], [325.0, 0.0], [324.0, 0.0], [326.0, 0.0], [327.0, 0.0], [328.0, 0.0], [329.0, 0.0], [335.0, 0.0], [330.0, 0.0], [331.0, 0.0], [333.0, 0.0], [332.0, 0.0], [334.0, 0.0], [337.0, 0.0], [336.0, 0.0], [338.0, 0.0], [339.0, 0.0], [340.0, 0.0], [341.0, 0.0], [342.0, 0.0068965517241379335], [343.0, 0.0], [344.0, 0.0], [350.0, 0.0], [351.0, 0.0], [348.0, 0.0], [349.0, 0.0], [345.0, 0.0], [346.0, 0.0], [347.0, 0.006535947712418301], [365.0, 0.0], [354.0, 0.0], [355.0, 0.0], [364.0, 0.0], [366.0, 0.0], [367.0, 0.0], [356.0, 0.0], [357.0, 0.0], [358.0, 0.0], [359.0, 0.0], [353.0, 0.003597122302158273], [352.0, 0.0], [360.0, 0.0], [361.0, 0.0], [362.0, 0.0], [363.0, 0.0], [375.0, 0.0], [371.0, 0.0], [370.0, 0.0], [369.0, 0.0], [372.0, 0.01360544217687075], [373.0, 0.001785714285714286], [374.0, 0.0], [376.0, 0.0], [378.0, 0.0], [377.0, 0.0], [379.0, 0.0], [380.0, 0.0], [381.0, 0.01041666666666667], [382.0, 0.0], [383.0, 0.0], [386.0, 0.004739336492890994], [387.0, 0.0], [396.0, 0.0], [397.0, 0.0], [398.0, 0.0], [392.0, 0.0], [388.0, 0.0], [389.0, 0.008264462809917357], [390.0, 0.0], [391.0, 0.0], [385.0, 0.0], [384.0, 0.0], [393.0, 0.0], [394.0, 0.0], [395.0, 0.0], [412.0, 0.0], [402.0, 0.0], [400.0, 0.0], [401.0, 0.0], [403.0, 0.0], [406.0, 0.0], [405.0, 0.0], [404.0, 0.0], [407.0, 0.0], [409.0, 0.0], [410.0, 0.0], [411.0, 0.0], [415.0, 0.0], [414.0, 0.0], [413.0, 0.0], [417.0, 0.0], [416.0, 0.0], [418.0, 0.0], [419.0, 0.0], [420.0, 0.0], [421.0, 0.2364532019704434], [422.0, 0.0], [423.0, 0.018691588785046728], [424.0, 0.0], [431.0, 0.0], [429.0, 0.0019267822736030859], [428.0, 0.0], [430.0, 0.0], [425.0, 0.0], [426.0, 0.0], [427.0, 0.0], [433.0, 0.0031104199066874032], [435.0, 0.0], [434.0, 0.0], [444.0, 0.015873015873015872], [445.0, 0.0], [446.0, 0.0], [447.0, 0.0], [436.0, 0.0], [437.0, 0.0033003300330032995], [438.0, 0.0], [439.0, 0.0], [432.0, 0.0], [440.0, 0.02205882352941178], [441.0, 0.0], [442.0, 0.0], [443.0, 0.0], [455.0, 0.0], [450.0, 0.0], [449.0, 0.0], [448.0, 0.0], [460.0, 0.0], [451.0, 0.0], [463.0, 0.0], [462.0, 0.0], [452.0, 0.0], [453.0, 0.0], [454.0, 0.0], [456.0, 0.0], [457.0, 0.0], [458.0, 0.0], [459.0, 0.0], [465.0, 0.0], [464.0, 0.0], [472.0, 0.0], [479.0, 0.0], [478.0, 0.0], [477.0, 0.0], [467.0, 0.0], [466.0, 0.0], [475.0, 0.0], [473.0, 0.0], [471.0, 0.0], [470.0, 0.0], [469.0, 0.0036630036630036617], [468.0, 0.0], [494.0, 0.0], [480.0, 0.0], [487.0, 0.0], [485.0, 0.0], [484.0, 0.0], [481.0, 0.0], [483.0, 0.0], [482.0, 0.0], [488.0, 0.0], [489.0, 0.0], [491.0, 0.0], [490.0, 0.0], [495.0, 0.0], [493.0, 0.0], [492.0, 0.0], [500.0, 0.0012732295426553038], [499.0, 0.0], [498.0, 0.012195121951219514], [497.0, 0.0], [496.0, 0.0]], "isOverall": false, "label": "AMQP Consumer - collections/tac_opmet_reports/locations/GLOBAL", "isController": false}, {"data": [[499.3093406850602, 0.001281570231159244]], "isOverall": false, "label": "AMQP Consumer - collections/tac_opmet_reports/locations/GLOBAL-Aggregated", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 500.0, "title": "Time VS Threads"}},
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
        data : {"result": {"minY": 0.0, "minX": 1.7452617E12, "maxY": 55624.5, "series": [{"data": [[1.74526194E12, 53258.166666666664], [1.74526176E12, 54613.23333333333], [1.74526224E12, 45776.76666666667], [1.74526182E12, 53378.63333333333], [1.7452623E12, 31415.266666666666], [1.74526212E12, 55624.5], [1.7452617E12, 19403.4], [1.74526218E12, 49388.7], [1.745262E12, 50070.8], [1.74526206E12, 52276.566666666666], [1.74526188E12, 51113.7]], "isOverall": false, "label": "Bytes received per second", "isController": false}, {"data": [[1.74526194E12, 0.0], [1.74526176E12, 0.0], [1.74526224E12, 0.0], [1.74526182E12, 0.0], [1.7452623E12, 0.0], [1.74526212E12, 0.0], [1.7452617E12, 0.0], [1.74526218E12, 0.0], [1.745262E12, 0.0], [1.74526206E12, 0.0], [1.74526188E12, 0.0]], "isOverall": false, "label": "Bytes sent per second", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.7452623E12, "title": "Bytes Throughput Over Time"}},
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
        fixTimeStamps(infos.data.result.series, 0);
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
        data: {"result": {"minY": 9.942087604965198E-4, "minX": 1.7452617E12, "maxY": 0.0026833785144184034, "series": [{"data": [[1.74526194E12, 0.00126615949353629], [1.74526176E12, 0.001173097851131415], [1.74526224E12, 0.001021624506754861], [1.74526182E12, 0.0012576817565580504], [1.7452623E12, 9.942087604965198E-4], [1.74526212E12, 0.0012092992596187283], [1.7452617E12, 0.0026833785144184034], [1.74526218E12, 0.001166933596821408], [1.745262E12, 0.0012662070508160752], [1.74526206E12, 0.0013345686435669133], [1.74526188E12, 0.001466012699791548]], "isOverall": false, "label": "AMQP Consumer - collections/tac_opmet_reports/locations/GLOBAL", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.7452623E12, "title": "Response Time Over Time"}},
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
        fixTimeStamps(infos.data.result.series, 0);
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
        data: {"result": {"minY": 0.0, "minX": 1.7452617E12, "maxY": 4.9E-324, "series": [{"data": [[1.74526194E12, 0.0], [1.74526176E12, 0.0], [1.74526224E12, 0.0], [1.74526182E12, 0.0], [1.7452623E12, 0.0], [1.74526212E12, 0.0], [1.7452617E12, 0.0], [1.74526218E12, 0.0], [1.745262E12, 0.0], [1.74526206E12, 0.0], [1.74526188E12, 0.0]], "isOverall": false, "label": "AMQP Consumer - collections/tac_opmet_reports/locations/GLOBAL", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.7452623E12, "title": "Latencies Over Time"}},
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
        fixTimeStamps(infos.data.result.series, 0);
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
        data: {"result": {"minY": 0.0, "minX": 1.7452617E12, "maxY": 4.9E-324, "series": [{"data": [[1.74526194E12, 0.0], [1.74526176E12, 0.0], [1.74526224E12, 0.0], [1.74526182E12, 0.0], [1.7452623E12, 0.0], [1.74526212E12, 0.0], [1.7452617E12, 0.0], [1.74526218E12, 0.0], [1.745262E12, 0.0], [1.74526206E12, 0.0], [1.74526188E12, 0.0]], "isOverall": false, "label": "AMQP Consumer - collections/tac_opmet_reports/locations/GLOBAL", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.7452623E12, "title": "Connect Time Over Time"}},
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
        fixTimeStamps(infos.data.result.series, 0);
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
        data: {"result": {"minY": 0.0, "minX": 1.7452617E12, "maxY": 21.0, "series": [{"data": [[1.74526194E12, 13.0], [1.74526176E12, 13.0], [1.74526224E12, 15.0], [1.74526182E12, 13.0], [1.7452623E12, 15.0], [1.74526212E12, 18.0], [1.7452617E12, 21.0], [1.74526218E12, 14.0], [1.745262E12, 14.0], [1.74526206E12, 13.0], [1.74526188E12, 16.0]], "isOverall": false, "label": "Max", "isController": false}, {"data": [[1.74526194E12, 0.0], [1.74526176E12, 0.0], [1.74526224E12, 0.0], [1.74526182E12, 0.0], [1.7452623E12, 0.0], [1.74526212E12, 0.0], [1.7452617E12, 0.0], [1.74526218E12, 0.0], [1.745262E12, 0.0], [1.74526206E12, 0.0], [1.74526188E12, 0.0]], "isOverall": false, "label": "Min", "isController": false}, {"data": [[1.74526194E12, 0.0], [1.74526176E12, 0.0], [1.74526224E12, 0.0], [1.74526182E12, 0.0], [1.7452623E12, 0.0], [1.74526212E12, 0.0], [1.7452617E12, 0.0], [1.74526218E12, 0.0], [1.745262E12, 0.0], [1.74526206E12, 0.0], [1.74526188E12, 0.0]], "isOverall": false, "label": "90th percentile", "isController": false}, {"data": [[1.74526194E12, 0.0], [1.74526176E12, 0.0], [1.74526224E12, 0.0], [1.74526182E12, 0.0], [1.7452623E12, 0.0], [1.74526212E12, 0.0], [1.7452617E12, 0.0], [1.74526218E12, 0.0], [1.745262E12, 0.0], [1.74526206E12, 0.0], [1.74526188E12, 0.0]], "isOverall": false, "label": "99th percentile", "isController": false}, {"data": [[1.74526194E12, 0.0], [1.74526176E12, 0.0], [1.74526224E12, 0.0], [1.74526182E12, 0.0], [1.7452623E12, 0.0], [1.74526212E12, 0.0], [1.7452617E12, 0.0], [1.74526218E12, 0.0], [1.745262E12, 0.0], [1.74526206E12, 0.0], [1.74526188E12, 0.0]], "isOverall": false, "label": "Median", "isController": false}, {"data": [[1.74526194E12, 0.0], [1.74526176E12, 0.0], [1.74526224E12, 0.0], [1.74526182E12, 0.0], [1.7452623E12, 0.0], [1.74526212E12, 0.0], [1.7452617E12, 0.0], [1.74526218E12, 0.0], [1.745262E12, 0.0], [1.74526206E12, 0.0], [1.74526188E12, 0.0]], "isOverall": false, "label": "95th percentile", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.7452623E12, "title": "Response Time Percentiles Over Time (successful requests only)"}},
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
        fixTimeStamps(infos.data.result.series, 0);
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
    data: {"result": {"minY": 0.0, "minX": 2487.0, "maxY": 4.9E-324, "series": [{"data": [[16483.0, 0.0], [23811.0, 0.0], [27491.0, 0.0], [27203.0, 0.0], [27555.0, 0.0], [27571.0, 0.0], [27235.0, 0.0], [27667.0, 0.0], [27731.0, 0.0], [27795.0, 0.0], [27923.0, 0.0], [27939.0, 0.0], [27907.0, 0.0], [27987.0, 0.0], [27971.0, 0.0], [28099.0, 0.0], [28035.0, 0.0], [28211.0, 0.0], [28227.0, 0.0], [28259.0, 0.0], [28403.0, 0.0], [28179.0, 0.0], [28611.0, 0.0], [11105.0, 0.0], [13913.0, 0.0], [15209.0, 0.0], [17010.0, 0.0], [24834.0, 0.0], [27634.0, 0.0], [27202.0, 0.0], [27490.0, 0.0], [27602.0, 0.0], [28146.0, 0.0], [27666.0, 0.0], [27794.0, 0.0], [27730.0, 0.0], [27778.0, 0.0], [27762.0, 0.0], [27746.0, 0.0], [28114.0, 0.0], [28066.0, 0.0], [28050.0, 0.0], [27970.0, 0.0], [27922.0, 0.0], [27906.0, 0.0], [27954.0, 0.0], [27938.0, 0.0], [28034.0, 0.0], [28018.0, 0.0], [28594.0, 0.0], [28658.0, 0.0], [28450.0, 0.0], [28434.0, 0.0], [28418.0, 0.0], [27810.0, 0.0], [27890.0, 0.0], [28338.0, 0.0], [28242.0, 0.0], [28882.0, 0.0], [28738.0, 0.0], [20321.0, 0.0], [20241.0, 0.0], [21761.0, 0.0], [24993.0, 0.0], [27265.0, 0.0], [27201.0, 0.0], [27249.0, 0.0], [27441.0, 0.0], [27409.0, 0.0], [27521.0, 0.0], [27473.0, 0.0], [28433.0, 0.0], [27777.0, 0.0], [27729.0, 0.0], [28449.0, 0.0], [28497.0, 0.0], [27841.0, 0.0], [27857.0, 0.0], [27809.0, 0.0], [28065.0, 0.0], [28049.0, 0.0], [28017.0, 0.0], [27921.0, 0.0], [28177.0, 0.0], [28241.0, 0.0], [28193.0, 0.0], [3142.0, 0.0], [3226.0, 0.0], [3446.0, 0.0], [3948.0, 0.0], [4644.0, 0.0], [4664.0, 0.0], [4992.0, 0.0], [5016.0, 0.0], [5416.0, 0.0], [5968.0, 0.0], [7524.0, 0.0], [12752.0, 0.0], [14472.0, 0.0], [18960.0, 0.0], [21232.0, 0.0], [24752.0, 0.0], [26608.0, 0.0], [27616.0, 0.0], [27200.0, 0.0], [27360.0, 0.0], [27216.0, 0.0], [27568.0, 0.0], [28144.0, 0.0], [28016.0, 0.0], [27968.0, 0.0], [28528.0, 0.0], [27824.0, 0.0], [27808.0, 0.0], [28512.0, 0.0], [27888.0, 0.0], [27872.0, 0.0], [27856.0, 0.0], [28656.0, 0.0], [28176.0, 0.0], [28080.0, 0.0], [28064.0, 0.0], [28192.0, 0.0], [28208.0, 0.0], [27952.0, 0.0], [28240.0, 0.0], [28336.0, 0.0], [28304.0, 0.0], [28400.0, 0.0], [28752.0, 0.0], [17895.0, 0.0], [19255.0, 0.0], [20183.0, 0.0], [23719.0, 0.0], [23783.0, 0.0], [27559.0, 0.0], [27527.0, 0.0], [27143.0, 0.0], [27223.0, 0.0], [27175.0, 0.0], [27111.0, 0.0], [27079.0, 0.0], [27447.0, 0.0], [28087.0, 0.0], [27751.0, 0.0], [28135.0, 0.0], [28119.0, 0.0], [28151.0, 0.0], [27671.0, 0.0], [28055.0, 0.0], [28071.0, 0.0], [27815.0, 0.0], [27991.0, 0.0], [28039.0, 0.0], [27911.0, 0.0], [28311.0, 0.0], [28407.0, 0.0], [28215.0, 0.0], [28247.0, 0.0], [27895.0, 0.0], [28167.0, 0.0], [28727.0, 0.0], [12379.0, 0.0], [14451.0, 0.0], [24998.0, 0.0], [26502.0, 0.0], [26486.0, 0.0], [26038.0, 0.0], [27286.0, 0.0], [27478.0, 0.0], [27414.0, 0.0], [27398.0, 0.0], [27526.0, 0.0], [27190.0, 0.0], [28134.0, 0.0], [27654.0, 0.0], [27670.0, 0.0], [27734.0, 0.0], [27814.0, 0.0], [27798.0, 0.0], [27894.0, 0.0], [28150.0, 0.0], [28022.0, 0.0], [28038.0, 0.0], [28070.0, 0.0], [28102.0, 0.0], [27942.0, 0.0], [28310.0, 0.0], [28278.0, 0.0], [28294.0, 0.0], [28486.0, 0.0], [28454.0, 0.0], [28358.0, 0.0], [28758.0, 0.0], [16981.0, 0.0], [18837.0, 0.0], [19461.0, 0.0], [27493.0, 0.0], [27477.0, 0.0], [27525.0, 0.0], [27621.0, 0.0], [27445.0, 0.0], [27077.0, 0.0], [27733.0, 0.0], [27765.0, 0.0], [27861.0, 0.0], [27797.0, 0.0], [27749.0, 0.0], [27973.0, 0.0], [27909.0, 0.0], [27989.0, 0.0], [28005.0, 0.0], [28085.0, 0.0], [28101.0, 0.0], [28117.0, 0.0], [28181.0, 0.0], [28165.0, 0.0], [28485.0, 0.0], [28581.0, 0.0], [28453.0, 0.0], [28277.0, 0.0], [28389.0, 0.0], [28309.0, 0.0], [28405.0, 0.0], [4253.0, 0.0], [4593.0, 0.0], [4653.0, 0.0], [5469.0, 0.0], [6345.0, 0.0], [6341.0, 0.0], [7013.0, 0.0], [10074.0, 0.0], [10210.0, 0.0], [11034.0, 0.0], [15122.0, 0.0], [16452.0, 0.0], [18356.0, 0.0], [25860.0, 0.0], [27428.0, 0.0], [27572.0, 0.0], [26932.0, 0.0], [27524.0, 0.0], [27460.0, 0.0], [27012.0, 0.0], [27892.0, 0.0], [28084.0, 0.0], [28020.0, 0.0], [27924.0, 0.0], [28500.0, 0.0], [27652.0, 0.0], [28116.0, 0.0], [27700.0, 0.0], [27828.0, 0.0], [27860.0, 0.0], [27684.0, 0.0], [28052.0, 0.0], [28068.0, 0.0], [28036.0, 0.0], [28180.0, 0.0], [28196.0, 0.0], [28516.0, 0.0], [28212.0, 0.0], [28340.0, 0.0], [28356.0, 0.0], [28244.0, 0.0], [28324.0, 0.0], [16875.0, 0.0], [25515.0, 0.0], [25883.0, 0.0], [27243.0, 0.0], [27035.0, 0.0], [27435.0, 0.0], [27691.0, 0.0], [27755.0, 0.0], [27707.0, 0.0], [27771.0, 0.0], [27803.0, 0.0], [27787.0, 0.0], [27675.0, 0.0], [27899.0, 0.0], [28427.0, 0.0], [28491.0, 0.0], [27835.0, 0.0], [27963.0, 0.0], [28155.0, 0.0], [28011.0, 0.0], [28123.0, 0.0], [28059.0, 0.0], [27931.0, 0.0], [28251.0, 0.0], [28299.0, 0.0], [28347.0, 0.0], [28859.0, 0.0], [28795.0, 0.0], [16293.0, 0.0], [20122.0, 0.0], [22634.0, 0.0], [26602.0, 0.0], [27210.0, 0.0], [27290.0, 0.0], [27130.0, 0.0], [27434.0, 0.0], [27498.0, 0.0], [28106.0, 0.0], [27786.0, 0.0], [27738.0, 0.0], [28122.0, 0.0], [28074.0, 0.0], [28090.0, 0.0], [27914.0, 0.0], [28010.0, 0.0], [27978.0, 0.0], [27930.0, 0.0], [28538.0, 0.0], [28474.0, 0.0], [28426.0, 0.0], [27898.0, 0.0], [27802.0, 0.0], [28362.0, 0.0], [28266.0, 0.0], [28202.0, 0.0], [28218.0, 0.0], [28250.0, 0.0], [28554.0, 0.0], [28714.0, 0.0], [18169.0, 0.0], [26409.0, 0.0], [27641.0, 0.0], [27449.0, 0.0], [27529.0, 0.0], [27305.0, 0.0], [27737.0, 0.0], [28505.0, 0.0], [27721.0, 0.0], [27897.0, 0.0], [27657.0, 0.0], [28137.0, 0.0], [27673.0, 0.0], [27817.0, 0.0], [27881.0, 0.0], [27769.0, 0.0], [27785.0, 0.0], [28009.0, 0.0], [27993.0, 0.0], [27945.0, 0.0], [28105.0, 0.0], [28057.0, 0.0], [28553.0, 0.0], [28569.0, 0.0], [28617.0, 0.0], [28537.0, 0.0], [28521.0, 0.0], [28377.0, 0.0], [28281.0, 0.0], [28313.0, 0.0], [28265.0, 0.0], [28201.0, 0.0], [28185.0, 0.0], [28233.0, 0.0], [28409.0, 0.0], [28393.0, 0.0], [2487.0, 0.0], [3035.0, 0.0], [3311.0, 0.0], [3577.0, 0.0], [4053.0, 0.0], [4206.0, 0.0], [5322.0, 0.0], [6890.0, 0.0], [22408.0, 0.0], [24680.0, 0.0], [24664.0, 0.0], [26328.0, 0.0], [27208.0, 0.0], [27320.0, 0.0], [26840.0, 0.0], [26872.0, 0.0], [27000.0, 0.0], [27528.0, 0.0], [27288.0, 0.0], [27624.0, 0.0], [28056.0, 0.0], [27976.0, 0.0], [27736.0, 0.0], [28504.0, 0.0], [27816.0, 0.0], [28344.0, 0.0], [28072.0, 0.0], [27912.0, 0.0], [27960.0, 0.0], [28904.0, 0.0], [26431.0, 0.0], [26543.0, 0.0], [27647.0, 0.0], [27247.0, 0.0], [27055.0, 0.0], [27487.0, 0.0], [27407.0, 0.0], [27823.0, 0.0], [27679.0, 0.0], [27807.0, 0.0], [28063.0, 0.0], [28031.0, 0.0], [28271.0, 0.0], [28335.0, 0.0], [28351.0, 0.0], [28415.0, 0.0], [28255.0, 0.0], [28575.0, 0.0], [28527.0, 0.0], [28607.0, 0.0], [28191.0, 0.0], [10655.0, 0.0], [10983.0, 0.0], [11967.0, 0.0], [21294.0, 0.0], [20782.0, 0.0], [24126.0, 0.0], [25358.0, 0.0], [26590.0, 0.0], [27534.0, 0.0], [27246.0, 0.0], [27390.0, 0.0], [27470.0, 0.0], [27486.0, 0.0], [27518.0, 0.0], [27214.0, 0.0], [27278.0, 0.0], [27678.0, 0.0], [27870.0, 0.0], [27998.0, 0.0], [28030.0, 0.0], [27662.0, 0.0], [28142.0, 0.0], [27950.0, 0.0], [28254.0, 0.0], [28638.0, 0.0], [28222.0, 0.0], [28174.0, 0.0], [28558.0, 0.0], [28494.0, 0.0], [28510.0, 0.0], [28462.0, 0.0], [27854.0, 0.0], [27774.0, 0.0], [28318.0, 0.0], [28366.0, 0.0], [28334.0, 0.0], [28686.0, 0.0], [28830.0, 0.0], [28846.0, 0.0], [28798.0, 0.0], [22125.0, 0.0], [22237.0, 0.0], [25693.0, 0.0], [27549.0, 0.0], [27645.0, 0.0], [27597.0, 0.0], [26701.0, 0.0], [26637.0, 0.0], [27261.0, 0.0], [26749.0, 0.0], [26861.0, 0.0], [28141.0, 0.0], [28125.0, 0.0], [27821.0, 0.0], [28429.0, 0.0], [27741.0, 0.0], [27773.0, 0.0], [27757.0, 0.0], [28157.0, 0.0], [28077.0, 0.0], [28061.0, 0.0], [28045.0, 0.0], [28093.0, 0.0], [28541.0, 0.0], [28269.0, 0.0], [28189.0, 0.0], [28173.0, 0.0], [28333.0, 0.0], [28317.0, 0.0], [28285.0, 0.0], [28413.0, 0.0], [28365.0, 0.0], [4251.0, 0.0], [4643.0, 0.0], [5307.0, 0.0], [6123.0, 0.0], [6363.0, 0.0], [6551.0, 0.0], [6583.0, 0.0], [7331.0, 0.0], [8542.0, 0.0], [9238.0, 0.0], [14422.0, 0.0], [16924.0, 0.0], [23228.0, 0.0], [25804.0, 0.0], [26028.0, 0.0], [26316.0, 0.0], [27532.0, 0.0], [27628.0, 0.0], [27180.0, 0.0], [27468.0, 0.0], [26924.0, 0.0], [27580.0, 0.0], [27516.0, 0.0], [27484.0, 0.0], [28108.0, 0.0], [27964.0, 0.0], [27996.0, 0.0], [28028.0, 0.0], [27740.0, 0.0], [27868.0, 0.0], [27852.0, 0.0], [28444.0, 0.0], [27708.0, 0.0], [28076.0, 0.0], [27948.0, 0.0], [28204.0, 0.0], [28380.0, 0.0], [28396.0, 0.0], [28412.0, 0.0], [28284.0, 0.0], [28364.0, 0.0], [28252.0, 0.0], [28796.0, 0.0], [28732.0, 0.0]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 28904.0, "title": "Response Time Vs Request"}},
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
    data: {"result": {"minY": 0.0, "minX": 2487.0, "maxY": 4.9E-324, "series": [{"data": [[16483.0, 0.0], [23811.0, 0.0], [27491.0, 0.0], [27203.0, 0.0], [27555.0, 0.0], [27571.0, 0.0], [27235.0, 0.0], [27667.0, 0.0], [27731.0, 0.0], [27795.0, 0.0], [27923.0, 0.0], [27939.0, 0.0], [27907.0, 0.0], [27987.0, 0.0], [27971.0, 0.0], [28099.0, 0.0], [28035.0, 0.0], [28211.0, 0.0], [28227.0, 0.0], [28259.0, 0.0], [28403.0, 0.0], [28179.0, 0.0], [28611.0, 0.0], [11105.0, 0.0], [13913.0, 0.0], [15209.0, 0.0], [17010.0, 0.0], [24834.0, 0.0], [27634.0, 0.0], [27202.0, 0.0], [27490.0, 0.0], [27602.0, 0.0], [28146.0, 0.0], [27666.0, 0.0], [27794.0, 0.0], [27730.0, 0.0], [27778.0, 0.0], [27762.0, 0.0], [27746.0, 0.0], [28114.0, 0.0], [28066.0, 0.0], [28050.0, 0.0], [27970.0, 0.0], [27922.0, 0.0], [27906.0, 0.0], [27954.0, 0.0], [27938.0, 0.0], [28034.0, 0.0], [28018.0, 0.0], [28594.0, 0.0], [28658.0, 0.0], [28450.0, 0.0], [28434.0, 0.0], [28418.0, 0.0], [27810.0, 0.0], [27890.0, 0.0], [28338.0, 0.0], [28242.0, 0.0], [28882.0, 0.0], [28738.0, 0.0], [20321.0, 0.0], [20241.0, 0.0], [21761.0, 0.0], [24993.0, 0.0], [27265.0, 0.0], [27201.0, 0.0], [27249.0, 0.0], [27441.0, 0.0], [27409.0, 0.0], [27521.0, 0.0], [27473.0, 0.0], [28433.0, 0.0], [27777.0, 0.0], [27729.0, 0.0], [28449.0, 0.0], [28497.0, 0.0], [27841.0, 0.0], [27857.0, 0.0], [27809.0, 0.0], [28065.0, 0.0], [28049.0, 0.0], [28017.0, 0.0], [27921.0, 0.0], [28177.0, 0.0], [28241.0, 0.0], [28193.0, 0.0], [3142.0, 0.0], [3226.0, 0.0], [3446.0, 0.0], [3948.0, 0.0], [4644.0, 0.0], [4664.0, 0.0], [4992.0, 0.0], [5016.0, 0.0], [5416.0, 0.0], [5968.0, 0.0], [7524.0, 0.0], [12752.0, 0.0], [14472.0, 0.0], [18960.0, 0.0], [21232.0, 0.0], [24752.0, 0.0], [26608.0, 0.0], [27616.0, 0.0], [27200.0, 0.0], [27360.0, 0.0], [27216.0, 0.0], [27568.0, 0.0], [28144.0, 0.0], [28016.0, 0.0], [27968.0, 0.0], [28528.0, 0.0], [27824.0, 0.0], [27808.0, 0.0], [28512.0, 0.0], [27888.0, 0.0], [27872.0, 0.0], [27856.0, 0.0], [28656.0, 0.0], [28176.0, 0.0], [28080.0, 0.0], [28064.0, 0.0], [28192.0, 0.0], [28208.0, 0.0], [27952.0, 0.0], [28240.0, 0.0], [28336.0, 0.0], [28304.0, 0.0], [28400.0, 0.0], [28752.0, 0.0], [17895.0, 0.0], [19255.0, 0.0], [20183.0, 0.0], [23719.0, 0.0], [23783.0, 0.0], [27559.0, 0.0], [27527.0, 0.0], [27143.0, 0.0], [27223.0, 0.0], [27175.0, 0.0], [27111.0, 0.0], [27079.0, 0.0], [27447.0, 0.0], [28087.0, 0.0], [27751.0, 0.0], [28135.0, 0.0], [28119.0, 0.0], [28151.0, 0.0], [27671.0, 0.0], [28055.0, 0.0], [28071.0, 0.0], [27815.0, 0.0], [27991.0, 0.0], [28039.0, 0.0], [27911.0, 0.0], [28311.0, 0.0], [28407.0, 0.0], [28215.0, 0.0], [28247.0, 0.0], [27895.0, 0.0], [28167.0, 0.0], [28727.0, 0.0], [12379.0, 0.0], [14451.0, 0.0], [24998.0, 0.0], [26502.0, 0.0], [26486.0, 0.0], [26038.0, 0.0], [27286.0, 0.0], [27478.0, 0.0], [27414.0, 0.0], [27398.0, 0.0], [27526.0, 0.0], [27190.0, 0.0], [28134.0, 0.0], [27654.0, 0.0], [27670.0, 0.0], [27734.0, 0.0], [27814.0, 0.0], [27798.0, 0.0], [27894.0, 0.0], [28150.0, 0.0], [28022.0, 0.0], [28038.0, 0.0], [28070.0, 0.0], [28102.0, 0.0], [27942.0, 0.0], [28310.0, 0.0], [28278.0, 0.0], [28294.0, 0.0], [28486.0, 0.0], [28454.0, 0.0], [28358.0, 0.0], [28758.0, 0.0], [16981.0, 0.0], [18837.0, 0.0], [19461.0, 0.0], [27493.0, 0.0], [27477.0, 0.0], [27525.0, 0.0], [27621.0, 0.0], [27445.0, 0.0], [27077.0, 0.0], [27733.0, 0.0], [27765.0, 0.0], [27861.0, 0.0], [27797.0, 0.0], [27749.0, 0.0], [27973.0, 0.0], [27909.0, 0.0], [27989.0, 0.0], [28005.0, 0.0], [28085.0, 0.0], [28101.0, 0.0], [28117.0, 0.0], [28181.0, 0.0], [28165.0, 0.0], [28485.0, 0.0], [28581.0, 0.0], [28453.0, 0.0], [28277.0, 0.0], [28389.0, 0.0], [28309.0, 0.0], [28405.0, 0.0], [4253.0, 0.0], [4593.0, 0.0], [4653.0, 0.0], [5469.0, 0.0], [6345.0, 0.0], [6341.0, 0.0], [7013.0, 0.0], [10074.0, 0.0], [10210.0, 0.0], [11034.0, 0.0], [15122.0, 0.0], [16452.0, 0.0], [18356.0, 0.0], [25860.0, 0.0], [27428.0, 0.0], [27572.0, 0.0], [26932.0, 0.0], [27524.0, 0.0], [27460.0, 0.0], [27012.0, 0.0], [27892.0, 0.0], [28084.0, 0.0], [28020.0, 0.0], [27924.0, 0.0], [28500.0, 0.0], [27652.0, 0.0], [28116.0, 0.0], [27700.0, 0.0], [27828.0, 0.0], [27860.0, 0.0], [27684.0, 0.0], [28052.0, 0.0], [28068.0, 0.0], [28036.0, 0.0], [28180.0, 0.0], [28196.0, 0.0], [28516.0, 0.0], [28212.0, 0.0], [28340.0, 0.0], [28356.0, 0.0], [28244.0, 0.0], [28324.0, 0.0], [16875.0, 0.0], [25515.0, 0.0], [25883.0, 0.0], [27243.0, 0.0], [27035.0, 0.0], [27435.0, 0.0], [27691.0, 0.0], [27755.0, 0.0], [27707.0, 0.0], [27771.0, 0.0], [27803.0, 0.0], [27787.0, 0.0], [27675.0, 0.0], [27899.0, 0.0], [28427.0, 0.0], [28491.0, 0.0], [27835.0, 0.0], [27963.0, 0.0], [28155.0, 0.0], [28011.0, 0.0], [28123.0, 0.0], [28059.0, 0.0], [27931.0, 0.0], [28251.0, 0.0], [28299.0, 0.0], [28347.0, 0.0], [28859.0, 0.0], [28795.0, 0.0], [16293.0, 0.0], [20122.0, 0.0], [22634.0, 0.0], [26602.0, 0.0], [27210.0, 0.0], [27290.0, 0.0], [27130.0, 0.0], [27434.0, 0.0], [27498.0, 0.0], [28106.0, 0.0], [27786.0, 0.0], [27738.0, 0.0], [28122.0, 0.0], [28074.0, 0.0], [28090.0, 0.0], [27914.0, 0.0], [28010.0, 0.0], [27978.0, 0.0], [27930.0, 0.0], [28538.0, 0.0], [28474.0, 0.0], [28426.0, 0.0], [27898.0, 0.0], [27802.0, 0.0], [28362.0, 0.0], [28266.0, 0.0], [28202.0, 0.0], [28218.0, 0.0], [28250.0, 0.0], [28554.0, 0.0], [28714.0, 0.0], [18169.0, 0.0], [26409.0, 0.0], [27641.0, 0.0], [27449.0, 0.0], [27529.0, 0.0], [27305.0, 0.0], [27737.0, 0.0], [28505.0, 0.0], [27721.0, 0.0], [27897.0, 0.0], [27657.0, 0.0], [28137.0, 0.0], [27673.0, 0.0], [27817.0, 0.0], [27881.0, 0.0], [27769.0, 0.0], [27785.0, 0.0], [28009.0, 0.0], [27993.0, 0.0], [27945.0, 0.0], [28105.0, 0.0], [28057.0, 0.0], [28553.0, 0.0], [28569.0, 0.0], [28617.0, 0.0], [28537.0, 0.0], [28521.0, 0.0], [28377.0, 0.0], [28281.0, 0.0], [28313.0, 0.0], [28265.0, 0.0], [28201.0, 0.0], [28185.0, 0.0], [28233.0, 0.0], [28409.0, 0.0], [28393.0, 0.0], [2487.0, 0.0], [3035.0, 0.0], [3311.0, 0.0], [3577.0, 0.0], [4053.0, 0.0], [4206.0, 0.0], [5322.0, 0.0], [6890.0, 0.0], [22408.0, 0.0], [24680.0, 0.0], [24664.0, 0.0], [26328.0, 0.0], [27208.0, 0.0], [27320.0, 0.0], [26840.0, 0.0], [26872.0, 0.0], [27000.0, 0.0], [27528.0, 0.0], [27288.0, 0.0], [27624.0, 0.0], [28056.0, 0.0], [27976.0, 0.0], [27736.0, 0.0], [28504.0, 0.0], [27816.0, 0.0], [28344.0, 0.0], [28072.0, 0.0], [27912.0, 0.0], [27960.0, 0.0], [28904.0, 0.0], [26431.0, 0.0], [26543.0, 0.0], [27647.0, 0.0], [27247.0, 0.0], [27055.0, 0.0], [27487.0, 0.0], [27407.0, 0.0], [27823.0, 0.0], [27679.0, 0.0], [27807.0, 0.0], [28063.0, 0.0], [28031.0, 0.0], [28271.0, 0.0], [28335.0, 0.0], [28351.0, 0.0], [28415.0, 0.0], [28255.0, 0.0], [28575.0, 0.0], [28527.0, 0.0], [28607.0, 0.0], [28191.0, 0.0], [10655.0, 0.0], [10983.0, 0.0], [11967.0, 0.0], [21294.0, 0.0], [20782.0, 0.0], [24126.0, 0.0], [25358.0, 0.0], [26590.0, 0.0], [27534.0, 0.0], [27246.0, 0.0], [27390.0, 0.0], [27470.0, 0.0], [27486.0, 0.0], [27518.0, 0.0], [27214.0, 0.0], [27278.0, 0.0], [27678.0, 0.0], [27870.0, 0.0], [27998.0, 0.0], [28030.0, 0.0], [27662.0, 0.0], [28142.0, 0.0], [27950.0, 0.0], [28254.0, 0.0], [28638.0, 0.0], [28222.0, 0.0], [28174.0, 0.0], [28558.0, 0.0], [28494.0, 0.0], [28510.0, 0.0], [28462.0, 0.0], [27854.0, 0.0], [27774.0, 0.0], [28318.0, 0.0], [28366.0, 0.0], [28334.0, 0.0], [28686.0, 0.0], [28830.0, 0.0], [28846.0, 0.0], [28798.0, 0.0], [22125.0, 0.0], [22237.0, 0.0], [25693.0, 0.0], [27549.0, 0.0], [27645.0, 0.0], [27597.0, 0.0], [26701.0, 0.0], [26637.0, 0.0], [27261.0, 0.0], [26749.0, 0.0], [26861.0, 0.0], [28141.0, 0.0], [28125.0, 0.0], [27821.0, 0.0], [28429.0, 0.0], [27741.0, 0.0], [27773.0, 0.0], [27757.0, 0.0], [28157.0, 0.0], [28077.0, 0.0], [28061.0, 0.0], [28045.0, 0.0], [28093.0, 0.0], [28541.0, 0.0], [28269.0, 0.0], [28189.0, 0.0], [28173.0, 0.0], [28333.0, 0.0], [28317.0, 0.0], [28285.0, 0.0], [28413.0, 0.0], [28365.0, 0.0], [4251.0, 0.0], [4643.0, 0.0], [5307.0, 0.0], [6123.0, 0.0], [6363.0, 0.0], [6551.0, 0.0], [6583.0, 0.0], [7331.0, 0.0], [8542.0, 0.0], [9238.0, 0.0], [14422.0, 0.0], [16924.0, 0.0], [23228.0, 0.0], [25804.0, 0.0], [26028.0, 0.0], [26316.0, 0.0], [27532.0, 0.0], [27628.0, 0.0], [27180.0, 0.0], [27468.0, 0.0], [26924.0, 0.0], [27580.0, 0.0], [27516.0, 0.0], [27484.0, 0.0], [28108.0, 0.0], [27964.0, 0.0], [27996.0, 0.0], [28028.0, 0.0], [27740.0, 0.0], [27868.0, 0.0], [27852.0, 0.0], [28444.0, 0.0], [27708.0, 0.0], [28076.0, 0.0], [27948.0, 0.0], [28204.0, 0.0], [28380.0, 0.0], [28396.0, 0.0], [28412.0, 0.0], [28284.0, 0.0], [28364.0, 0.0], [28252.0, 0.0], [28796.0, 0.0], [28732.0, 0.0]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 28904.0, "title": "Latencies Vs Request"}},
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
        data: {"result": {"minY": 9701.7, "minX": 1.7452617E12, "maxY": 27812.25, "series": [{"data": [[1.74526194E12, 26629.083333333332], [1.74526176E12, 27306.616666666665], [1.74526224E12, 22888.383333333335], [1.74526182E12, 26689.316666666666], [1.7452623E12, 15707.633333333333], [1.74526212E12, 27812.25], [1.7452617E12, 9701.7], [1.74526218E12, 24694.35], [1.745262E12, 25035.4], [1.74526206E12, 26138.283333333333], [1.74526188E12, 25556.85]], "isOverall": false, "label": "hitsPerSecond", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.7452623E12, "title": "Hits Per Second"}},
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
        fixTimeStamps(infos.data.result.series, 0);
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
        data: {"result": {"minY": 9701.7, "minX": 1.7452617E12, "maxY": 27812.25, "series": [{"data": [[1.74526194E12, 26629.083333333332], [1.74526176E12, 27306.616666666665], [1.74526224E12, 22888.383333333335], [1.74526182E12, 26689.316666666666], [1.7452623E12, 15707.633333333333], [1.74526212E12, 27812.25], [1.7452617E12, 9701.7], [1.74526218E12, 24694.35], [1.745262E12, 25035.4], [1.74526206E12, 26138.283333333333], [1.74526188E12, 25556.85]], "isOverall": false, "label": "200", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.7452623E12, "title": "Codes Per Second"}},
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
        fixTimeStamps(infos.data.result.series, 0);
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
        data: {"result": {"minY": 9701.7, "minX": 1.7452617E12, "maxY": 27812.25, "series": [{"data": [[1.74526194E12, 26629.083333333332], [1.74526176E12, 27306.616666666665], [1.74526224E12, 22888.383333333335], [1.74526182E12, 26689.316666666666], [1.7452623E12, 15707.633333333333], [1.74526212E12, 27812.25], [1.7452617E12, 9701.7], [1.74526218E12, 24694.35], [1.745262E12, 25035.4], [1.74526206E12, 26138.283333333333], [1.74526188E12, 25556.85]], "isOverall": false, "label": "AMQP Consumer - collections/tac_opmet_reports/locations/GLOBAL-success", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.7452623E12, "title": "Transactions Per Second"}},
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
        fixTimeStamps(infos.data.result.series, 0);
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
        data: {"result": {"minY": 9701.7, "minX": 1.7452617E12, "maxY": 27812.25, "series": [{"data": [[1.74526194E12, 26629.083333333332], [1.74526176E12, 27306.616666666665], [1.74526224E12, 22888.383333333335], [1.74526182E12, 26689.316666666666], [1.7452623E12, 15707.633333333333], [1.74526212E12, 27812.25], [1.7452617E12, 9701.7], [1.74526218E12, 24694.35], [1.745262E12, 25035.4], [1.74526206E12, 26138.283333333333], [1.74526188E12, 25556.85]], "isOverall": false, "label": "Transaction-success", "isController": false}, {"data": [], "isOverall": false, "label": "Transaction-failure", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.7452623E12, "title": "Total Transactions Per Second"}},
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
        fixTimeStamps(infos.data.result.series, 0);
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

