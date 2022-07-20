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
        data: {"result": {"minY": 4647.0, "minX": 0.0, "maxY": 10105.0, "series": [{"data": [[0.0, 4647.0], [0.1, 4647.0], [0.2, 4662.0], [0.3, 4671.0], [0.4, 4706.0], [0.5, 4756.0], [0.6, 4779.0], [0.7, 4787.0], [0.8, 4806.0], [0.9, 4809.0], [1.0, 4815.0], [1.1, 4815.0], [1.2, 4826.0], [1.3, 4834.0], [1.4, 4840.0], [1.5, 4854.0], [1.6, 4861.0], [1.7, 4865.0], [1.8, 4868.0], [1.9, 4877.0], [2.0, 4882.0], [2.1, 4882.0], [2.2, 4895.0], [2.3, 4904.0], [2.4, 4908.0], [2.5, 4909.0], [2.6, 4911.0], [2.7, 4913.0], [2.8, 4913.0], [2.9, 4921.0], [3.0, 4926.0], [3.1, 4926.0], [3.2, 4928.0], [3.3, 4936.0], [3.4, 4953.0], [3.5, 4954.0], [3.6, 4961.0], [3.7, 4966.0], [3.8, 4968.0], [3.9, 4974.0], [4.0, 4976.0], [4.1, 4976.0], [4.2, 4978.0], [4.3, 4982.0], [4.4, 4987.0], [4.5, 4998.0], [4.6, 4999.0], [4.7, 5000.0], [4.8, 5007.0], [4.9, 5011.0], [5.0, 5020.0], [5.1, 5020.0], [5.2, 5021.0], [5.3, 5037.0], [5.4, 5039.0], [5.5, 5042.0], [5.6, 5042.0], [5.7, 5043.0], [5.8, 5044.0], [5.9, 5052.0], [6.0, 5058.0], [6.1, 5058.0], [6.2, 5065.0], [6.3, 5068.0], [6.4, 5069.0], [6.5, 5074.0], [6.6, 5085.0], [6.7, 5086.0], [6.8, 5088.0], [6.9, 5102.0], [7.0, 5106.0], [7.1, 5106.0], [7.2, 5106.0], [7.3, 5113.0], [7.4, 5119.0], [7.5, 5120.0], [7.6, 5123.0], [7.7, 5129.0], [7.8, 5130.0], [7.9, 5160.0], [8.0, 5166.0], [8.1, 5166.0], [8.2, 5168.0], [8.3, 5174.0], [8.4, 5174.0], [8.5, 5176.0], [8.6, 5178.0], [8.7, 5179.0], [8.8, 5183.0], [8.9, 5187.0], [9.0, 5195.0], [9.1, 5195.0], [9.2, 5197.0], [9.3, 5202.0], [9.4, 5204.0], [9.5, 5206.0], [9.6, 5210.0], [9.7, 5214.0], [9.8, 5223.0], [9.9, 5230.0], [10.0, 5232.0], [10.1, 5239.0], [10.2, 5239.0], [10.3, 5241.0], [10.4, 5248.0], [10.5, 5249.0], [10.6, 5251.0], [10.7, 5254.0], [10.8, 5255.0], [10.9, 5257.0], [11.0, 5258.0], [11.1, 5261.0], [11.2, 5261.0], [11.3, 5263.0], [11.4, 5265.0], [11.5, 5267.0], [11.6, 5269.0], [11.7, 5277.0], [11.8, 5278.0], [11.9, 5279.0], [12.0, 5283.0], [12.1, 5283.0], [12.2, 5283.0], [12.3, 5284.0], [12.4, 5284.0], [12.5, 5290.0], [12.6, 5292.0], [12.7, 5295.0], [12.8, 5299.0], [12.9, 5300.0], [13.0, 5302.0], [13.1, 5302.0], [13.2, 5302.0], [13.3, 5306.0], [13.4, 5309.0], [13.5, 5311.0], [13.6, 5313.0], [13.7, 5318.0], [13.8, 5320.0], [13.9, 5323.0], [14.0, 5325.0], [14.1, 5328.0], [14.2, 5328.0], [14.3, 5330.0], [14.4, 5331.0], [14.5, 5336.0], [14.6, 5339.0], [14.7, 5340.0], [14.8, 5341.0], [14.9, 5348.0], [15.0, 5354.0], [15.1, 5355.0], [15.2, 5355.0], [15.3, 5364.0], [15.4, 5368.0], [15.5, 5375.0], [15.6, 5392.0], [15.7, 5392.0], [15.8, 5394.0], [15.9, 5399.0], [16.0, 5399.0], [16.1, 5404.0], [16.2, 5404.0], [16.3, 5405.0], [16.4, 5407.0], [16.5, 5409.0], [16.6, 5412.0], [16.7, 5415.0], [16.8, 5418.0], [16.9, 5427.0], [17.0, 5428.0], [17.1, 5434.0], [17.2, 5434.0], [17.3, 5435.0], [17.4, 5443.0], [17.5, 5448.0], [17.6, 5449.0], [17.7, 5454.0], [17.8, 5456.0], [17.9, 5462.0], [18.0, 5463.0], [18.1, 5468.0], [18.2, 5468.0], [18.3, 5469.0], [18.4, 5469.0], [18.5, 5473.0], [18.6, 5474.0], [18.7, 5475.0], [18.8, 5477.0], [18.9, 5478.0], [19.0, 5485.0], [19.1, 5486.0], [19.2, 5486.0], [19.3, 5488.0], [19.4, 5490.0], [19.5, 5491.0], [19.6, 5492.0], [19.7, 5494.0], [19.8, 5495.0], [19.9, 5497.0], [20.0, 5503.0], [20.1, 5505.0], [20.2, 5509.0], [20.3, 5509.0], [20.4, 5510.0], [20.5, 5512.0], [20.6, 5513.0], [20.7, 5513.0], [20.8, 5516.0], [20.9, 5516.0], [21.0, 5519.0], [21.1, 5520.0], [21.2, 5520.0], [21.3, 5520.0], [21.4, 5524.0], [21.5, 5526.0], [21.6, 5529.0], [21.7, 5529.0], [21.8, 5533.0], [21.9, 5534.0], [22.0, 5535.0], [22.1, 5537.0], [22.2, 5538.0], [22.3, 5538.0], [22.4, 5541.0], [22.5, 5549.0], [22.6, 5549.0], [22.7, 5552.0], [22.8, 5555.0], [22.9, 5557.0], [23.0, 5560.0], [23.1, 5563.0], [23.2, 5570.0], [23.3, 5570.0], [23.4, 5572.0], [23.5, 5576.0], [23.6, 5577.0], [23.7, 5581.0], [23.8, 5583.0], [23.9, 5586.0], [24.0, 5589.0], [24.1, 5591.0], [24.2, 5591.0], [24.3, 5591.0], [24.4, 5595.0], [24.5, 5597.0], [24.6, 5599.0], [24.7, 5604.0], [24.8, 5605.0], [24.9, 5606.0], [25.0, 5608.0], [25.1, 5616.0], [25.2, 5617.0], [25.3, 5617.0], [25.4, 5618.0], [25.5, 5618.0], [25.6, 5619.0], [25.7, 5625.0], [25.8, 5625.0], [25.9, 5626.0], [26.0, 5626.0], [26.1, 5631.0], [26.2, 5635.0], [26.3, 5635.0], [26.4, 5637.0], [26.5, 5637.0], [26.6, 5637.0], [26.7, 5639.0], [26.8, 5643.0], [26.9, 5644.0], [27.0, 5645.0], [27.1, 5645.0], [27.2, 5649.0], [27.3, 5649.0], [27.4, 5652.0], [27.5, 5652.0], [27.6, 5656.0], [27.7, 5660.0], [27.8, 5662.0], [27.9, 5666.0], [28.0, 5668.0], [28.1, 5668.0], [28.2, 5669.0], [28.3, 5669.0], [28.4, 5670.0], [28.5, 5683.0], [28.6, 5683.0], [28.7, 5691.0], [28.8, 5691.0], [28.9, 5697.0], [29.0, 5699.0], [29.1, 5701.0], [29.2, 5709.0], [29.3, 5709.0], [29.4, 5716.0], [29.5, 5719.0], [29.6, 5724.0], [29.7, 5730.0], [29.8, 5732.0], [29.9, 5738.0], [30.0, 5742.0], [30.1, 5746.0], [30.2, 5748.0], [30.3, 5753.0], [30.4, 5753.0], [30.5, 5756.0], [30.6, 5761.0], [30.7, 5762.0], [30.8, 5763.0], [30.9, 5766.0], [31.0, 5767.0], [31.1, 5768.0], [31.2, 5770.0], [31.3, 5772.0], [31.4, 5772.0], [31.5, 5772.0], [31.6, 5772.0], [31.7, 5781.0], [31.8, 5792.0], [31.9, 5796.0], [32.0, 5797.0], [32.1, 5805.0], [32.2, 5806.0], [32.3, 5808.0], [32.4, 5808.0], [32.5, 5814.0], [32.6, 5814.0], [32.7, 5816.0], [32.8, 5820.0], [32.9, 5821.0], [33.0, 5826.0], [33.1, 5826.0], [33.2, 5827.0], [33.3, 5828.0], [33.4, 5828.0], [33.5, 5828.0], [33.6, 5832.0], [33.7, 5834.0], [33.8, 5838.0], [33.9, 5847.0], [34.0, 5848.0], [34.1, 5851.0], [34.2, 5856.0], [34.3, 5856.0], [34.4, 5856.0], [34.5, 5857.0], [34.6, 5861.0], [34.7, 5867.0], [34.8, 5868.0], [34.9, 5871.0], [35.0, 5878.0], [35.1, 5886.0], [35.2, 5887.0], [35.3, 5888.0], [35.4, 5888.0], [35.5, 5891.0], [35.6, 5896.0], [35.7, 5898.0], [35.8, 5900.0], [35.9, 5903.0], [36.0, 5907.0], [36.1, 5908.0], [36.2, 5917.0], [36.3, 5917.0], [36.4, 5917.0], [36.5, 5917.0], [36.6, 5917.0], [36.7, 5922.0], [36.8, 5924.0], [36.9, 5924.0], [37.0, 5925.0], [37.1, 5929.0], [37.2, 5929.0], [37.3, 5937.0], [37.4, 5937.0], [37.5, 5940.0], [37.6, 5941.0], [37.7, 5942.0], [37.8, 5945.0], [37.9, 5956.0], [38.0, 5958.0], [38.1, 5959.0], [38.2, 5964.0], [38.3, 5968.0], [38.4, 5968.0], [38.5, 5969.0], [38.6, 5973.0], [38.7, 5980.0], [38.8, 5984.0], [38.9, 5984.0], [39.0, 5985.0], [39.1, 5988.0], [39.2, 5990.0], [39.3, 5994.0], [39.4, 5994.0], [39.5, 5996.0], [39.6, 5999.0], [39.7, 6004.0], [39.8, 6004.0], [39.9, 6007.0], [40.0, 6012.0], [40.1, 6016.0], [40.2, 6018.0], [40.3, 6026.0], [40.4, 6029.0], [40.5, 6029.0], [40.6, 6031.0], [40.7, 6032.0], [40.8, 6040.0], [40.9, 6048.0], [41.0, 6051.0], [41.1, 6052.0], [41.2, 6053.0], [41.3, 6054.0], [41.4, 6055.0], [41.5, 6055.0], [41.6, 6057.0], [41.7, 6060.0], [41.8, 6065.0], [41.9, 6065.0], [42.0, 6070.0], [42.1, 6072.0], [42.2, 6074.0], [42.3, 6075.0], [42.4, 6075.0], [42.5, 6075.0], [42.6, 6076.0], [42.7, 6085.0], [42.8, 6089.0], [42.9, 6089.0], [43.0, 6090.0], [43.1, 6095.0], [43.2, 6102.0], [43.3, 6108.0], [43.4, 6109.0], [43.5, 6109.0], [43.6, 6111.0], [43.7, 6111.0], [43.8, 6111.0], [43.9, 6113.0], [44.0, 6114.0], [44.1, 6117.0], [44.2, 6118.0], [44.3, 6125.0], [44.4, 6126.0], [44.5, 6126.0], [44.6, 6128.0], [44.7, 6130.0], [44.8, 6131.0], [44.9, 6131.0], [45.0, 6132.0], [45.1, 6146.0], [45.2, 6147.0], [45.3, 6147.0], [45.4, 6148.0], [45.5, 6148.0], [45.6, 6150.0], [45.7, 6151.0], [45.8, 6152.0], [45.9, 6153.0], [46.0, 6154.0], [46.1, 6158.0], [46.2, 6158.0], [46.3, 6160.0], [46.4, 6162.0], [46.5, 6162.0], [46.6, 6165.0], [46.7, 6169.0], [46.8, 6172.0], [46.9, 6173.0], [47.0, 6175.0], [47.1, 6176.0], [47.2, 6176.0], [47.3, 6177.0], [47.4, 6177.0], [47.5, 6177.0], [47.6, 6182.0], [47.7, 6182.0], [47.8, 6186.0], [47.9, 6186.0], [48.0, 6189.0], [48.1, 6191.0], [48.2, 6192.0], [48.3, 6192.0], [48.4, 6193.0], [48.5, 6193.0], [48.6, 6203.0], [48.7, 6204.0], [48.8, 6204.0], [48.9, 6206.0], [49.0, 6215.0], [49.1, 6225.0], [49.2, 6242.0], [49.3, 6242.0], [49.4, 6243.0], [49.5, 6243.0], [49.6, 6250.0], [49.7, 6256.0], [49.8, 6258.0], [49.9, 6271.0], [50.0, 6275.0], [50.1, 6279.0], [50.2, 6280.0], [50.3, 6281.0], [50.4, 6282.0], [50.5, 6284.0], [50.6, 6284.0], [50.7, 6286.0], [50.8, 6286.0], [50.9, 6291.0], [51.0, 6291.0], [51.1, 6293.0], [51.2, 6295.0], [51.3, 6297.0], [51.4, 6299.0], [51.5, 6302.0], [51.6, 6302.0], [51.7, 6303.0], [51.8, 6307.0], [51.9, 6308.0], [52.0, 6311.0], [52.1, 6321.0], [52.2, 6322.0], [52.3, 6323.0], [52.4, 6323.0], [52.5, 6324.0], [52.6, 6324.0], [52.7, 6325.0], [52.8, 6325.0], [52.9, 6332.0], [53.0, 6337.0], [53.1, 6349.0], [53.2, 6351.0], [53.3, 6358.0], [53.4, 6360.0], [53.5, 6362.0], [53.6, 6362.0], [53.7, 6364.0], [53.8, 6367.0], [53.9, 6370.0], [54.0, 6370.0], [54.1, 6371.0], [54.2, 6371.0], [54.3, 6372.0], [54.4, 6373.0], [54.5, 6374.0], [54.6, 6374.0], [54.7, 6377.0], [54.8, 6382.0], [54.9, 6393.0], [55.0, 6394.0], [55.1, 6398.0], [55.2, 6399.0], [55.3, 6405.0], [55.4, 6409.0], [55.5, 6410.0], [55.6, 6410.0], [55.7, 6425.0], [55.8, 6433.0], [55.9, 6438.0], [56.0, 6438.0], [56.1, 6446.0], [56.2, 6447.0], [56.3, 6453.0], [56.4, 6459.0], [56.5, 6460.0], [56.6, 6460.0], [56.7, 6461.0], [56.8, 6466.0], [56.9, 6483.0], [57.0, 6484.0], [57.1, 6489.0], [57.2, 6491.0], [57.3, 6491.0], [57.4, 6491.0], [57.5, 6493.0], [57.6, 6493.0], [57.7, 6494.0], [57.8, 6502.0], [57.9, 6506.0], [58.0, 6514.0], [58.1, 6520.0], [58.2, 6521.0], [58.3, 6523.0], [58.4, 6528.0], [58.5, 6533.0], [58.6, 6533.0], [58.7, 6535.0], [58.8, 6537.0], [58.9, 6544.0], [59.0, 6544.0], [59.1, 6549.0], [59.2, 6553.0], [59.3, 6554.0], [59.4, 6565.0], [59.5, 6566.0], [59.6, 6566.0], [59.7, 6567.0], [59.8, 6574.0], [59.9, 6578.0], [60.0, 6582.0], [60.1, 6584.0], [60.2, 6586.0], [60.3, 6587.0], [60.4, 6593.0], [60.5, 6600.0], [60.6, 6602.0], [60.7, 6602.0], [60.8, 6617.0], [60.9, 6622.0], [61.0, 6625.0], [61.1, 6626.0], [61.2, 6630.0], [61.3, 6640.0], [61.4, 6641.0], [61.5, 6644.0], [61.6, 6646.0], [61.7, 6646.0], [61.8, 6648.0], [61.9, 6652.0], [62.0, 6656.0], [62.1, 6656.0], [62.2, 6663.0], [62.3, 6677.0], [62.4, 6683.0], [62.5, 6685.0], [62.6, 6692.0], [62.7, 6692.0], [62.8, 6706.0], [62.9, 6709.0], [63.0, 6710.0], [63.1, 6714.0], [63.2, 6714.0], [63.3, 6715.0], [63.4, 6718.0], [63.5, 6719.0], [63.6, 6719.0], [63.7, 6719.0], [63.8, 6722.0], [63.9, 6732.0], [64.0, 6738.0], [64.1, 6742.0], [64.2, 6744.0], [64.3, 6747.0], [64.4, 6757.0], [64.5, 6771.0], [64.6, 6773.0], [64.7, 6773.0], [64.8, 6783.0], [64.9, 6785.0], [65.0, 6793.0], [65.1, 6798.0], [65.2, 6801.0], [65.3, 6809.0], [65.4, 6810.0], [65.5, 6822.0], [65.6, 6823.0], [65.7, 6823.0], [65.8, 6828.0], [65.9, 6828.0], [66.0, 6831.0], [66.1, 6832.0], [66.2, 6836.0], [66.3, 6840.0], [66.4, 6841.0], [66.5, 6849.0], [66.6, 6853.0], [66.7, 6853.0], [66.8, 6862.0], [66.9, 6867.0], [67.0, 6868.0], [67.1, 6869.0], [67.2, 6870.0], [67.3, 6877.0], [67.4, 6884.0], [67.5, 6890.0], [67.6, 6896.0], [67.7, 6896.0], [67.8, 6898.0], [67.9, 6904.0], [68.0, 6907.0], [68.1, 6910.0], [68.2, 6910.0], [68.3, 6923.0], [68.4, 6934.0], [68.5, 6943.0], [68.6, 6943.0], [68.7, 6943.0], [68.8, 6946.0], [68.9, 6946.0], [69.0, 6948.0], [69.1, 6958.0], [69.2, 6960.0], [69.3, 6961.0], [69.4, 6965.0], [69.5, 6967.0], [69.6, 6969.0], [69.7, 6969.0], [69.8, 6970.0], [69.9, 6970.0], [70.0, 6976.0], [70.1, 6980.0], [70.2, 6987.0], [70.3, 6990.0], [70.4, 6991.0], [70.5, 6992.0], [70.6, 6995.0], [70.7, 6996.0], [70.8, 6996.0], [70.9, 6999.0], [71.0, 7000.0], [71.1, 7007.0], [71.2, 7018.0], [71.3, 7019.0], [71.4, 7019.0], [71.5, 7023.0], [71.6, 7030.0], [71.7, 7031.0], [71.8, 7031.0], [71.9, 7045.0], [72.0, 7046.0], [72.1, 7048.0], [72.2, 7057.0], [72.3, 7061.0], [72.4, 7061.0], [72.5, 7066.0], [72.6, 7068.0], [72.7, 7069.0], [72.8, 7069.0], [72.9, 7070.0], [73.0, 7071.0], [73.1, 7080.0], [73.2, 7083.0], [73.3, 7086.0], [73.4, 7093.0], [73.5, 7099.0], [73.6, 7101.0], [73.7, 7114.0], [73.8, 7114.0], [73.9, 7129.0], [74.0, 7131.0], [74.1, 7135.0], [74.2, 7139.0], [74.3, 7148.0], [74.4, 7149.0], [74.5, 7161.0], [74.6, 7182.0], [74.7, 7185.0], [74.8, 7185.0], [74.9, 7194.0], [75.0, 7197.0], [75.1, 7202.0], [75.2, 7205.0], [75.3, 7207.0], [75.4, 7211.0], [75.5, 7212.0], [75.6, 7213.0], [75.7, 7220.0], [75.8, 7220.0], [75.9, 7228.0], [76.0, 7231.0], [76.1, 7237.0], [76.2, 7238.0], [76.3, 7242.0], [76.4, 7265.0], [76.5, 7268.0], [76.6, 7272.0], [76.7, 7273.0], [76.8, 7273.0], [76.9, 7275.0], [77.0, 7280.0], [77.1, 7284.0], [77.2, 7287.0], [77.3, 7288.0], [77.4, 7293.0], [77.5, 7296.0], [77.6, 7301.0], [77.7, 7301.0], [77.8, 7301.0], [77.9, 7304.0], [78.0, 7305.0], [78.1, 7314.0], [78.2, 7314.0], [78.3, 7316.0], [78.4, 7321.0], [78.5, 7331.0], [78.6, 7331.0], [78.7, 7336.0], [78.8, 7336.0], [78.9, 7336.0], [79.0, 7341.0], [79.1, 7348.0], [79.2, 7363.0], [79.3, 7369.0], [79.4, 7374.0], [79.5, 7374.0], [79.6, 7381.0], [79.7, 7391.0], [79.8, 7391.0], [79.9, 7392.0], [80.0, 7394.0], [80.1, 7396.0], [80.2, 7398.0], [80.3, 7399.0], [80.4, 7410.0], [80.5, 7410.0], [80.6, 7417.0], [80.7, 7418.0], [80.8, 7418.0], [80.9, 7418.0], [81.0, 7418.0], [81.1, 7419.0], [81.2, 7420.0], [81.3, 7426.0], [81.4, 7433.0], [81.5, 7438.0], [81.6, 7440.0], [81.7, 7441.0], [81.8, 7445.0], [81.9, 7445.0], [82.0, 7458.0], [82.1, 7494.0], [82.2, 7498.0], [82.3, 7516.0], [82.4, 7520.0], [82.5, 7526.0], [82.6, 7529.0], [82.7, 7530.0], [82.8, 7530.0], [82.9, 7530.0], [83.0, 7530.0], [83.1, 7541.0], [83.2, 7542.0], [83.3, 7556.0], [83.4, 7558.0], [83.5, 7566.0], [83.6, 7569.0], [83.7, 7578.0], [83.8, 7596.0], [83.9, 7596.0], [84.0, 7599.0], [84.1, 7599.0], [84.2, 7607.0], [84.3, 7607.0], [84.4, 7610.0], [84.5, 7613.0], [84.6, 7619.0], [84.7, 7630.0], [84.8, 7632.0], [84.9, 7632.0], [85.0, 7632.0], [85.1, 7636.0], [85.2, 7648.0], [85.3, 7649.0], [85.4, 7649.0], [85.5, 7652.0], [85.6, 7672.0], [85.7, 7672.0], [85.8, 7672.0], [85.9, 7672.0], [86.0, 7678.0], [86.1, 7686.0], [86.2, 7699.0], [86.3, 7706.0], [86.4, 7709.0], [86.5, 7718.0], [86.6, 7719.0], [86.7, 7720.0], [86.8, 7732.0], [86.9, 7732.0], [87.0, 7738.0], [87.1, 7750.0], [87.2, 7756.0], [87.3, 7757.0], [87.4, 7760.0], [87.5, 7762.0], [87.6, 7772.0], [87.7, 7778.0], [87.8, 7785.0], [87.9, 7785.0], [88.0, 7798.0], [88.1, 7799.0], [88.2, 7800.0], [88.3, 7801.0], [88.4, 7803.0], [88.5, 7809.0], [88.6, 7811.0], [88.7, 7824.0], [88.8, 7837.0], [88.9, 7837.0], [89.0, 7843.0], [89.1, 7849.0], [89.2, 7856.0], [89.3, 7858.0], [89.4, 7890.0], [89.5, 7893.0], [89.6, 7914.0], [89.7, 7920.0], [89.8, 7930.0], [89.9, 7930.0], [90.0, 7934.0], [90.1, 7939.0], [90.2, 7949.0], [90.3, 7950.0], [90.4, 7961.0], [90.5, 7965.0], [90.6, 7968.0], [90.7, 7977.0], [90.8, 7983.0], [90.9, 7984.0], [91.0, 7984.0], [91.1, 7985.0], [91.2, 7993.0], [91.3, 8005.0], [91.4, 8010.0], [91.5, 8016.0], [91.6, 8019.0], [91.7, 8021.0], [91.8, 8023.0], [91.9, 8028.0], [92.0, 8028.0], [92.1, 8028.0], [92.2, 8030.0], [92.3, 8032.0], [92.4, 8039.0], [92.5, 8047.0], [92.6, 8064.0], [92.7, 8070.0], [92.8, 8071.0], [92.9, 8079.0], [93.0, 8079.0], [93.1, 8089.0], [93.2, 8099.0], [93.3, 8107.0], [93.4, 8134.0], [93.5, 8136.0], [93.6, 8136.0], [93.7, 8150.0], [93.8, 8163.0], [93.9, 8169.0], [94.0, 8169.0], [94.1, 8197.0], [94.2, 8204.0], [94.3, 8224.0], [94.4, 8258.0], [94.5, 8264.0], [94.6, 8265.0], [94.7, 8265.0], [94.8, 8269.0], [94.9, 8269.0], [95.0, 8269.0], [95.1, 8272.0], [95.2, 8276.0], [95.3, 8283.0], [95.4, 8299.0], [95.5, 8314.0], [95.6, 8326.0], [95.7, 8328.0], [95.8, 8340.0], [95.9, 8345.0], [96.0, 8345.0], [96.1, 8396.0], [96.2, 8412.0], [96.3, 8450.0], [96.4, 8451.0], [96.5, 8468.0], [96.6, 8497.0], [96.7, 8508.0], [96.8, 8533.0], [96.9, 8538.0], [97.0, 8538.0], [97.1, 8560.0], [97.2, 8586.0], [97.3, 8587.0], [97.4, 8592.0], [97.5, 8604.0], [97.6, 8611.0], [97.7, 8623.0], [97.8, 8632.0], [97.9, 8666.0], [98.0, 8666.0], [98.1, 8673.0], [98.2, 8689.0], [98.3, 8739.0], [98.4, 8758.0], [98.5, 8812.0], [98.6, 8853.0], [98.7, 8899.0], [98.8, 8913.0], [98.9, 8914.0], [99.0, 8914.0], [99.1, 8984.0], [99.2, 8996.0], [99.3, 9009.0], [99.4, 9016.0], [99.5, 9061.0], [99.6, 9078.0], [99.7, 9151.0], [99.8, 9622.0], [99.9, 10105.0]], "isOverall": false, "label": "NCPPServerlessEastGFSAreaUS-1time-fullzedd", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 100.0, "title": "Response Time Percentiles"}},
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
        data: {"result": {"minY": 1.0, "minX": 4600.0, "maxY": 48.0, "series": [{"data": [[8300.0, 6.0], [8400.0, 5.0], [8200.0, 12.0], [8600.0, 7.0], [8700.0, 2.0], [8500.0, 7.0], [9000.0, 4.0], [8900.0, 4.0], [8800.0, 3.0], [9100.0, 1.0], [9600.0, 1.0], [10100.0, 1.0], [4600.0, 3.0], [4800.0, 13.0], [4700.0, 4.0], [5100.0, 21.0], [4900.0, 22.0], [5000.0, 20.0], [5300.0, 29.0], [5200.0, 33.0], [5400.0, 35.0], [5600.0, 40.0], [5500.0, 42.0], [5700.0, 27.0], [5800.0, 33.0], [5900.0, 35.0], [6000.0, 32.0], [6100.0, 48.0], [6200.0, 27.0], [6300.0, 34.0], [6400.0, 22.0], [6500.0, 25.0], [6600.0, 20.0], [6800.0, 24.0], [6900.0, 28.0], [6700.0, 22.0], [7000.0, 24.0], [7100.0, 13.0], [7300.0, 25.0], [7200.0, 23.0], [7400.0, 17.0], [7500.0, 17.0], [7600.0, 19.0], [7900.0, 15.0], [7800.0, 13.0], [7700.0, 17.0], [8000.0, 18.0], [8100.0, 8.0]], "isOverall": false, "label": "NCPPServerlessEastGFSAreaUS-1time-fullzedd", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 100, "maxX": 10100.0, "title": "Response Time Distribution"}},
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
        data: {"result": {"minY": 901.0, "minX": 2.0, "ticks": [[0, "Requests having \nresponse time <= 500ms"], [1, "Requests having \nresponse time > 500ms and <= 1,500ms"], [2, "Requests having \nresponse time > 1,500ms"], [3, "Requests in error"]], "maxY": 901.0, "series": [{"data": [], "color": "#9ACD32", "isOverall": false, "label": "Requests having \nresponse time <= 500ms", "isController": false}, {"data": [], "color": "yellow", "isOverall": false, "label": "Requests having \nresponse time > 500ms and <= 1,500ms", "isController": false}, {"data": [[2.0, 901.0]], "color": "orange", "isOverall": false, "label": "Requests having \nresponse time > 1,500ms", "isController": false}, {"data": [], "color": "#FF6347", "isOverall": false, "label": "Requests in error", "isController": false}], "supportsControllersDiscrimination": false, "maxX": 2.0, "title": "Synthetic Response Times Distribution"}},
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
        data: {"result": {"minY": 94.06482593037211, "minX": 1.65824556E12, "maxY": 97.20588235294116, "series": [{"data": [[1.65824556E12, 97.20588235294116], [1.65824562E12, 94.06482593037211]], "isOverall": false, "label": "NCPPServerlessEastGFSAreaUS-1time-fullzedd", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.65824562E12, "title": "Active Threads Over Time"}},
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
        data: {"result": {"minY": 4926.0, "minX": 1.0, "maxY": 9016.0, "series": [{"data": [[2.0, 5668.0], [3.0, 6258.0], [4.0, 5973.0], [5.0, 6193.0], [6.0, 5871.0], [8.0, 6189.0], [9.0, 6586.0], [10.0, 5848.0], [11.0, 5595.0], [12.0, 6060.0], [13.0, 5570.0], [14.0, 6177.0], [15.0, 6256.0], [16.0, 6321.0], [17.0, 6706.0], [19.0, 6173.0], [20.0, 6382.0], [21.0, 6518.5], [22.0, 6980.0], [23.0, 6738.0], [24.0, 6537.0], [25.0, 6377.0], [26.0, 7093.0], [27.0, 7719.0], [28.0, 6832.0], [29.0, 9016.0], [30.0, 6793.0], [31.0, 6225.0], [33.0, 5988.0], [32.0, 6617.0], [35.0, 6215.0], [34.0, 6282.0], [37.0, 6130.0], [36.0, 6349.0], [39.0, 6656.0], [38.0, 5984.0], [41.0, 6719.0], [40.0, 6192.0], [43.0, 6040.0], [42.0, 5608.0], [45.0, 5204.0], [44.0, 5058.0], [47.0, 6026.0], [46.0, 5492.0], [49.0, 5265.0], [48.0, 6004.0], [51.0, 6076.0], [50.0, 5223.0], [53.0, 6054.0], [52.0, 5325.0], [55.0, 5269.0], [54.0, 5261.0], [57.0, 5606.0], [56.0, 4926.0], [59.0, 6152.0], [58.0, 5591.0], [61.0, 5392.0], [60.0, 6242.0], [63.0, 6114.0], [62.0, 6111.0], [67.0, 6574.0], [66.0, 5878.0], [65.0, 6206.0], [64.0, 5847.0], [71.0, 6456.5], [69.0, 6108.0], [68.0, 6332.0], [75.0, 7061.0], [74.0, 7369.0], [73.0, 6587.0], [72.0, 6295.0], [76.0, 7213.5], [77.0, 7105.5], [79.0, 7699.0], [78.0, 6969.0], [82.0, 6590.5], [83.0, 6656.0], [81.0, 6568.0], [84.0, 7074.0], [85.0, 7162.5], [86.0, 7763.0], [87.0, 7147.0], [89.0, 7615.0], [91.0, 6710.0], [90.0, 7046.0], [88.0, 7212.0], [93.0, 7395.0], [94.0, 7461.0], [95.0, 7151.0], [92.0, 7030.0], [96.0, 6893.5], [99.0, 6075.0], [98.0, 6370.0], [97.0, 6995.0], [100.0, 6428.2417302799], [1.0, 5887.0]], "isOverall": false, "label": "NCPPServerlessEastGFSAreaUS-1time-fullzedd", "isController": false}, {"data": [[94.30188679245289, 6438.671476137623]], "isOverall": false, "label": "NCPPServerlessEastGFSAreaUS-1time-fullzedd-Aggregated", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 100.0, "title": "Time VS Threads"}},
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
        data : {"result": {"minY": 1304.4666666666667, "minX": 1.65824556E12, "maxY": 2.4598975916666668E7, "series": [{"data": [[1.65824556E12, 2008079.6666666667], [1.65824562E12, 2.4598975916666668E7]], "isOverall": false, "label": "Bytes received per second", "isController": false}, {"data": [[1.65824556E12, 1304.4666666666667], [1.65824562E12, 15979.716666666667]], "isOverall": false, "label": "Bytes sent per second", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.65824562E12, "title": "Bytes Throughput Over Time"}},
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
        data: {"result": {"minY": 6338.85114045618, "minX": 1.65824556E12, "maxY": 7661.470588235294, "series": [{"data": [[1.65824556E12, 7661.470588235294], [1.65824562E12, 6338.85114045618]], "isOverall": false, "label": "NCPPServerlessEastGFSAreaUS-1time-fullzedd", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.65824562E12, "title": "Response Time Over Time"}},
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
        data: {"result": {"minY": 5282.841536614652, "minX": 1.65824556E12, "maxY": 7447.705882352941, "series": [{"data": [[1.65824556E12, 7447.705882352941], [1.65824562E12, 5282.841536614652]], "isOverall": false, "label": "NCPPServerlessEastGFSAreaUS-1time-fullzedd", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.65824562E12, "title": "Latencies Over Time"}},
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
        data: {"result": {"minY": 3.693877551020405, "minX": 1.65824556E12, "maxY": 95.98529411764707, "series": [{"data": [[1.65824556E12, 95.98529411764707], [1.65824562E12, 3.693877551020405]], "isOverall": false, "label": "NCPPServerlessEastGFSAreaUS-1time-fullzedd", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.65824562E12, "title": "Connect Time Over Time"}},
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
        data: {"result": {"minY": 4647.0, "minX": 1.65824556E12, "maxY": 10105.0, "series": [{"data": [[1.65824556E12, 9078.0], [1.65824562E12, 10105.0]], "isOverall": false, "label": "Max", "isController": false}, {"data": [[1.65824556E12, 8820.7], [1.65824562E12, 7682.8]], "isOverall": false, "label": "90th percentile", "isController": false}, {"data": [[1.65824556E12, 9078.0], [1.65824562E12, 8659.06]], "isOverall": false, "label": "99th percentile", "isController": false}, {"data": [[1.65824556E12, 8959.1], [1.65824562E12, 8036.499999999999]], "isOverall": false, "label": "95th percentile", "isController": false}, {"data": [[1.65824556E12, 4826.0], [1.65824562E12, 4647.0]], "isOverall": false, "label": "Min", "isController": false}, {"data": [[1.65824556E12, 7963.0], [1.65824562E12, 6177.0]], "isOverall": false, "label": "Median", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.65824562E12, "title": "Response Time Percentiles Over Time (successful requests only)"}},
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
    data: {"result": {"minY": 5497.5, "minX": 2.0, "maxY": 7961.0, "series": [{"data": [[2.0, 7308.0], [8.0, 5497.5], [9.0, 5624.5], [10.0, 6065.0], [11.0, 7961.0], [12.0, 6006.0], [13.0, 6148.0], [14.0, 5948.5], [15.0, 6491.0], [16.0, 6059.0], [17.0, 6148.0], [18.0, 5595.0], [19.0, 6915.0], [20.0, 7419.5], [21.0, 5654.0], [22.0, 6078.5], [24.0, 6442.0], [27.0, 6868.0], [7.0, 7352.5], [31.0, 6674.0]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 31.0, "title": "Response Time Vs Request"}},
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
    data: {"result": {"minY": 4963.0, "minX": 2.0, "maxY": 7784.0, "series": [{"data": [[2.0, 7147.0], [8.0, 4963.0], [9.0, 5172.5], [10.0, 5097.5], [11.0, 7784.0], [12.0, 5543.5], [13.0, 5243.0], [14.0, 5080.5], [15.0, 5225.0], [16.0, 5163.0], [17.0, 5087.0], [18.0, 5189.0], [19.0, 5410.0], [20.0, 5476.0], [21.0, 5401.0], [22.0, 5071.0], [24.0, 5094.0], [27.0, 5108.0], [7.0, 6481.0], [31.0, 5118.5]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 31.0, "title": "Latencies Vs Request"}},
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
        data: {"result": {"minY": 2.8, "minX": 1.65824556E12, "maxY": 12.216666666666667, "series": [{"data": [[1.65824556E12, 2.8], [1.65824562E12, 12.216666666666667]], "isOverall": false, "label": "hitsPerSecond", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.65824562E12, "title": "Hits Per Second"}},
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
        data: {"result": {"minY": 1.1333333333333333, "minX": 1.65824556E12, "maxY": 13.883333333333333, "series": [{"data": [[1.65824556E12, 1.1333333333333333], [1.65824562E12, 13.883333333333333]], "isOverall": false, "label": "200", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.65824562E12, "title": "Codes Per Second"}},
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
        data: {"result": {"minY": 1.1333333333333333, "minX": 1.65824556E12, "maxY": 13.883333333333333, "series": [{"data": [[1.65824556E12, 1.1333333333333333], [1.65824562E12, 13.883333333333333]], "isOverall": false, "label": "NCPPServerlessEastGFSAreaUS-1time-fullzedd-success", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.65824562E12, "title": "Transactions Per Second"}},
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
        data: {"result": {"minY": 1.1333333333333333, "minX": 1.65824556E12, "maxY": 13.883333333333333, "series": [{"data": [[1.65824556E12, 1.1333333333333333], [1.65824562E12, 13.883333333333333]], "isOverall": false, "label": "Transaction-success", "isController": false}, {"data": [], "isOverall": false, "label": "Transaction-failure", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.65824562E12, "title": "Total Transactions Per Second"}},
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

