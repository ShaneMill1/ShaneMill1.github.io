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
        data: {"result": {"minY": 4596.0, "minX": 0.0, "maxY": 12251.0, "series": [{"data": [[0.0, 4596.0], [0.1, 4596.0], [0.2, 4642.0], [0.3, 4644.0], [0.4, 4677.0], [0.5, 4692.0], [0.6, 4730.0], [0.7, 4730.0], [0.8, 4732.0], [0.9, 4767.0], [1.0, 4786.0], [1.1, 4801.0], [1.2, 4823.0], [1.3, 4826.0], [1.4, 4826.0], [1.5, 4913.0], [1.6, 4935.0], [1.7, 4936.0], [1.8, 4943.0], [1.9, 4946.0], [2.0, 4952.0], [2.1, 4952.0], [2.2, 4957.0], [2.3, 4958.0], [2.4, 4971.0], [2.5, 4981.0], [2.6, 4984.0], [2.7, 4984.0], [2.8, 4985.0], [2.9, 4989.0], [3.0, 4989.0], [3.1, 4997.0], [3.2, 5025.0], [3.3, 5040.0], [3.4, 5040.0], [3.5, 5044.0], [3.6, 5049.0], [3.7, 5053.0], [3.8, 5058.0], [3.9, 5060.0], [4.0, 5062.0], [4.1, 5062.0], [4.2, 5071.0], [4.3, 5077.0], [4.4, 5085.0], [4.5, 5090.0], [4.6, 5091.0], [4.7, 5091.0], [4.8, 5095.0], [4.9, 5105.0], [5.0, 5110.0], [5.1, 5113.0], [5.2, 5116.0], [5.3, 5129.0], [5.4, 5129.0], [5.5, 5133.0], [5.6, 5142.0], [5.7, 5143.0], [5.8, 5175.0], [5.9, 5180.0], [6.0, 5180.0], [6.1, 5180.0], [6.2, 5187.0], [6.3, 5191.0], [6.4, 5194.0], [6.5, 5196.0], [6.6, 5197.0], [6.7, 5202.0], [6.8, 5202.0], [6.9, 5204.0], [7.0, 5213.0], [7.1, 5219.0], [7.2, 5224.0], [7.3, 5227.0], [7.4, 5227.0], [7.5, 5228.0], [7.6, 5232.0], [7.7, 5233.0], [7.8, 5243.0], [7.9, 5248.0], [8.0, 5256.0], [8.1, 5256.0], [8.2, 5267.0], [8.3, 5268.0], [8.4, 5273.0], [8.5, 5286.0], [8.6, 5287.0], [8.7, 5288.0], [8.8, 5288.0], [8.9, 5295.0], [9.0, 5299.0], [9.1, 5299.0], [9.2, 5300.0], [9.3, 5301.0], [9.4, 5301.0], [9.5, 5304.0], [9.6, 5315.0], [9.7, 5322.0], [9.8, 5322.0], [9.9, 5325.0], [10.0, 5326.0], [10.1, 5326.0], [10.2, 5328.0], [10.3, 5328.0], [10.4, 5328.0], [10.5, 5331.0], [10.6, 5332.0], [10.7, 5342.0], [10.8, 5342.0], [10.9, 5342.0], [11.0, 5345.0], [11.1, 5346.0], [11.2, 5349.0], [11.3, 5355.0], [11.4, 5358.0], [11.5, 5358.0], [11.6, 5373.0], [11.7, 5375.0], [11.8, 5375.0], [11.9, 5385.0], [12.0, 5389.0], [12.1, 5389.0], [12.2, 5389.0], [12.3, 5391.0], [12.4, 5392.0], [12.5, 5392.0], [12.6, 5392.0], [12.7, 5392.0], [12.8, 5392.0], [12.9, 5405.0], [13.0, 5411.0], [13.1, 5412.0], [13.2, 5412.0], [13.3, 5417.0], [13.4, 5421.0], [13.5, 5421.0], [13.6, 5422.0], [13.7, 5424.0], [13.8, 5440.0], [13.9, 5443.0], [14.0, 5451.0], [14.1, 5451.0], [14.2, 5454.0], [14.3, 5456.0], [14.4, 5462.0], [14.5, 5467.0], [14.6, 5467.0], [14.7, 5467.0], [14.8, 5467.0], [14.9, 5470.0], [15.0, 5473.0], [15.1, 5473.0], [15.2, 5476.0], [15.3, 5480.0], [15.4, 5483.0], [15.5, 5483.0], [15.6, 5485.0], [15.7, 5485.0], [15.8, 5492.0], [15.9, 5493.0], [16.0, 5496.0], [16.1, 5500.0], [16.2, 5500.0], [16.3, 5504.0], [16.4, 5506.0], [16.5, 5506.0], [16.6, 5507.0], [16.7, 5509.0], [16.8, 5509.0], [16.9, 5510.0], [17.0, 5510.0], [17.1, 5517.0], [17.2, 5519.0], [17.3, 5521.0], [17.4, 5524.0], [17.5, 5524.0], [17.6, 5527.0], [17.7, 5527.0], [17.8, 5532.0], [17.9, 5533.0], [18.0, 5535.0], [18.1, 5537.0], [18.2, 5537.0], [18.3, 5538.0], [18.4, 5541.0], [18.5, 5545.0], [18.6, 5547.0], [18.7, 5547.0], [18.8, 5547.0], [18.9, 5551.0], [19.0, 5552.0], [19.1, 5557.0], [19.2, 5557.0], [19.3, 5558.0], [19.4, 5560.0], [19.5, 5560.0], [19.6, 5560.0], [19.7, 5578.0], [19.8, 5582.0], [19.9, 5588.0], [20.0, 5593.0], [20.1, 5595.0], [20.2, 5595.0], [20.3, 5604.0], [20.4, 5614.0], [20.5, 5622.0], [20.6, 5625.0], [20.7, 5627.0], [20.8, 5628.0], [20.9, 5628.0], [21.0, 5634.0], [21.1, 5637.0], [21.2, 5638.0], [21.3, 5648.0], [21.4, 5657.0], [21.5, 5657.0], [21.6, 5665.0], [21.7, 5665.0], [21.8, 5674.0], [21.9, 5682.0], [22.0, 5687.0], [22.1, 5687.0], [22.2, 5687.0], [22.3, 5689.0], [22.4, 5691.0], [22.5, 5691.0], [22.6, 5693.0], [22.7, 5695.0], [22.8, 5699.0], [22.9, 5699.0], [23.0, 5703.0], [23.1, 5710.0], [23.2, 5711.0], [23.3, 5713.0], [23.4, 5715.0], [23.5, 5715.0], [23.6, 5720.0], [23.7, 5723.0], [23.8, 5733.0], [23.9, 5734.0], [24.0, 5738.0], [24.1, 5742.0], [24.2, 5742.0], [24.3, 5744.0], [24.4, 5752.0], [24.5, 5752.0], [24.6, 5752.0], [24.7, 5754.0], [24.8, 5758.0], [24.9, 5758.0], [25.0, 5758.0], [25.1, 5760.0], [25.2, 5761.0], [25.3, 5761.0], [25.4, 5765.0], [25.5, 5769.0], [25.6, 5769.0], [25.7, 5770.0], [25.8, 5771.0], [25.9, 5780.0], [26.0, 5787.0], [26.1, 5789.0], [26.2, 5789.0], [26.3, 5791.0], [26.4, 5794.0], [26.5, 5803.0], [26.6, 5808.0], [26.7, 5808.0], [26.8, 5814.0], [26.9, 5814.0], [27.0, 5820.0], [27.1, 5838.0], [27.2, 5844.0], [27.3, 5849.0], [27.4, 5857.0], [27.5, 5859.0], [27.6, 5859.0], [27.7, 5868.0], [27.8, 5879.0], [27.9, 5882.0], [28.0, 5884.0], [28.1, 5886.0], [28.2, 5886.0], [28.3, 5891.0], [28.4, 5893.0], [28.5, 5898.0], [28.6, 5900.0], [28.7, 5906.0], [28.8, 5912.0], [28.9, 5912.0], [29.0, 5913.0], [29.1, 5914.0], [29.2, 5917.0], [29.3, 5921.0], [29.4, 5923.0], [29.5, 5924.0], [29.6, 5924.0], [29.7, 5933.0], [29.8, 5939.0], [29.9, 5940.0], [30.0, 5941.0], [30.1, 5942.0], [30.2, 5943.0], [30.3, 5943.0], [30.4, 5950.0], [30.5, 5953.0], [30.6, 5957.0], [30.7, 5966.0], [30.8, 5984.0], [30.9, 5984.0], [31.0, 5984.0], [31.1, 5987.0], [31.2, 5990.0], [31.3, 5990.0], [31.4, 5996.0], [31.5, 6000.0], [31.6, 6000.0], [31.7, 6006.0], [31.8, 6006.0], [31.9, 6014.0], [32.0, 6016.0], [32.1, 6019.0], [32.2, 6022.0], [32.3, 6022.0], [32.4, 6029.0], [32.5, 6030.0], [32.6, 6030.0], [32.7, 6039.0], [32.8, 6040.0], [32.9, 6040.0], [33.0, 6044.0], [33.1, 6045.0], [33.2, 6046.0], [33.3, 6051.0], [33.4, 6052.0], [33.5, 6059.0], [33.6, 6059.0], [33.7, 6063.0], [33.8, 6066.0], [33.9, 6073.0], [34.0, 6074.0], [34.1, 6076.0], [34.2, 6076.0], [34.3, 6076.0], [34.4, 6076.0], [34.5, 6078.0], [34.6, 6089.0], [34.7, 6089.0], [34.8, 6090.0], [34.9, 6090.0], [35.0, 6092.0], [35.1, 6093.0], [35.2, 6097.0], [35.3, 6098.0], [35.4, 6106.0], [35.5, 6107.0], [35.6, 6107.0], [35.7, 6108.0], [35.8, 6114.0], [35.9, 6116.0], [36.0, 6121.0], [36.1, 6126.0], [36.2, 6134.0], [36.3, 6134.0], [36.4, 6137.0], [36.5, 6139.0], [36.6, 6149.0], [36.7, 6156.0], [36.8, 6156.0], [36.9, 6157.0], [37.0, 6157.0], [37.1, 6171.0], [37.2, 6173.0], [37.3, 6175.0], [37.4, 6177.0], [37.5, 6184.0], [37.6, 6184.0], [37.7, 6185.0], [37.8, 6188.0], [37.9, 6189.0], [38.0, 6194.0], [38.1, 6203.0], [38.2, 6204.0], [38.3, 6204.0], [38.4, 6208.0], [38.5, 6208.0], [38.6, 6211.0], [38.7, 6211.0], [38.8, 6219.0], [38.9, 6221.0], [39.0, 6221.0], [39.1, 6223.0], [39.2, 6226.0], [39.3, 6233.0], [39.4, 6234.0], [39.5, 6234.0], [39.6, 6234.0], [39.7, 6244.0], [39.8, 6248.0], [39.9, 6249.0], [40.0, 6251.0], [40.1, 6255.0], [40.2, 6255.0], [40.3, 6255.0], [40.4, 6270.0], [40.5, 6275.0], [40.6, 6277.0], [40.7, 6280.0], [40.8, 6294.0], [40.9, 6294.0], [41.0, 6294.0], [41.1, 6295.0], [41.2, 6296.0], [41.3, 6297.0], [41.4, 6299.0], [41.5, 6300.0], [41.6, 6307.0], [41.7, 6307.0], [41.8, 6309.0], [41.9, 6319.0], [42.0, 6320.0], [42.1, 6321.0], [42.2, 6323.0], [42.3, 6323.0], [42.4, 6325.0], [42.5, 6326.0], [42.6, 6331.0], [42.7, 6343.0], [42.8, 6352.0], [42.9, 6354.0], [43.0, 6354.0], [43.1, 6359.0], [43.2, 6360.0], [43.3, 6364.0], [43.4, 6364.0], [43.5, 6365.0], [43.6, 6365.0], [43.7, 6365.0], [43.8, 6366.0], [43.9, 6367.0], [44.0, 6370.0], [44.1, 6371.0], [44.2, 6377.0], [44.3, 6377.0], [44.4, 6380.0], [44.5, 6380.0], [44.6, 6383.0], [44.7, 6398.0], [44.8, 6418.0], [44.9, 6418.0], [45.0, 6418.0], [45.1, 6419.0], [45.2, 6419.0], [45.3, 6437.0], [45.4, 6442.0], [45.5, 6442.0], [45.6, 6446.0], [45.7, 6446.0], [45.8, 6454.0], [45.9, 6458.0], [46.0, 6461.0], [46.1, 6462.0], [46.2, 6465.0], [46.3, 6469.0], [46.4, 6469.0], [46.5, 6470.0], [46.6, 6477.0], [46.7, 6483.0], [46.8, 6493.0], [46.9, 6495.0], [47.0, 6495.0], [47.1, 6517.0], [47.2, 6527.0], [47.3, 6528.0], [47.4, 6529.0], [47.5, 6532.0], [47.6, 6541.0], [47.7, 6541.0], [47.8, 6543.0], [47.9, 6556.0], [48.0, 6556.0], [48.1, 6556.0], [48.2, 6561.0], [48.3, 6569.0], [48.4, 6569.0], [48.5, 6571.0], [48.6, 6572.0], [48.7, 6587.0], [48.8, 6596.0], [48.9, 6596.0], [49.0, 6596.0], [49.1, 6599.0], [49.2, 6607.0], [49.3, 6612.0], [49.4, 6629.0], [49.5, 6633.0], [49.6, 6634.0], [49.7, 6634.0], [49.8, 6635.0], [49.9, 6641.0], [50.0, 6645.0], [50.1, 6648.0], [50.2, 6650.0], [50.3, 6654.0], [50.4, 6654.0], [50.5, 6659.0], [50.6, 6668.0], [50.7, 6675.0], [50.8, 6676.0], [50.9, 6677.0], [51.0, 6684.0], [51.1, 6684.0], [51.2, 6690.0], [51.3, 6693.0], [51.4, 6695.0], [51.5, 6697.0], [51.6, 6706.0], [51.7, 6706.0], [51.8, 6709.0], [51.9, 6710.0], [52.0, 6716.0], [52.1, 6717.0], [52.2, 6721.0], [52.3, 6727.0], [52.4, 6727.0], [52.5, 6728.0], [52.6, 6734.0], [52.7, 6737.0], [52.8, 6738.0], [52.9, 6742.0], [53.0, 6762.0], [53.1, 6762.0], [53.2, 6763.0], [53.3, 6771.0], [53.4, 6773.0], [53.5, 6774.0], [53.6, 6775.0], [53.7, 6775.0], [53.8, 6787.0], [53.9, 6788.0], [54.0, 6792.0], [54.1, 6809.0], [54.2, 6816.0], [54.3, 6824.0], [54.4, 6824.0], [54.5, 6827.0], [54.6, 6856.0], [54.7, 6859.0], [54.8, 6859.0], [54.9, 6865.0], [55.0, 6870.0], [55.1, 6870.0], [55.2, 6878.0], [55.3, 6881.0], [55.4, 6886.0], [55.5, 6886.0], [55.6, 6895.0], [55.7, 6901.0], [55.8, 6901.0], [55.9, 6902.0], [56.0, 6911.0], [56.1, 6913.0], [56.2, 6918.0], [56.3, 6922.0], [56.4, 6922.0], [56.5, 6944.0], [56.6, 6948.0], [56.7, 6949.0], [56.8, 6949.0], [56.9, 6951.0], [57.0, 6954.0], [57.1, 6954.0], [57.2, 6961.0], [57.3, 6961.0], [57.4, 6964.0], [57.5, 6972.0], [57.6, 6979.0], [57.7, 6981.0], [57.8, 6981.0], [57.9, 6994.0], [58.0, 6994.0], [58.1, 7001.0], [58.2, 7013.0], [58.3, 7014.0], [58.4, 7014.0], [58.5, 7023.0], [58.6, 7040.0], [58.7, 7056.0], [58.8, 7075.0], [58.9, 7086.0], [59.0, 7086.0], [59.1, 7086.0], [59.2, 7087.0], [59.3, 7093.0], [59.4, 7096.0], [59.5, 7105.0], [59.6, 7111.0], [59.7, 7112.0], [59.8, 7112.0], [59.9, 7114.0], [60.0, 7118.0], [60.1, 7123.0], [60.2, 7125.0], [60.3, 7134.0], [60.4, 7137.0], [60.5, 7137.0], [60.6, 7145.0], [60.7, 7149.0], [60.8, 7151.0], [60.9, 7152.0], [61.0, 7159.0], [61.1, 7159.0], [61.2, 7169.0], [61.3, 7170.0], [61.4, 7175.0], [61.5, 7177.0], [61.6, 7178.0], [61.7, 7182.0], [61.8, 7182.0], [61.9, 7186.0], [62.0, 7192.0], [62.1, 7193.0], [62.2, 7197.0], [62.3, 7203.0], [62.4, 7206.0], [62.5, 7206.0], [62.6, 7217.0], [62.7, 7222.0], [62.8, 7227.0], [62.9, 7230.0], [63.0, 7232.0], [63.1, 7232.0], [63.2, 7238.0], [63.3, 7240.0], [63.4, 7246.0], [63.5, 7247.0], [63.6, 7249.0], [63.7, 7257.0], [63.8, 7257.0], [63.9, 7262.0], [64.0, 7264.0], [64.1, 7265.0], [64.2, 7266.0], [64.3, 7274.0], [64.4, 7283.0], [64.5, 7283.0], [64.6, 7284.0], [64.7, 7287.0], [64.8, 7292.0], [64.9, 7293.0], [65.0, 7294.0], [65.1, 7299.0], [65.2, 7299.0], [65.3, 7304.0], [65.4, 7309.0], [65.5, 7330.0], [65.6, 7335.0], [65.7, 7338.0], [65.8, 7338.0], [65.9, 7342.0], [66.0, 7343.0], [66.1, 7351.0], [66.2, 7361.0], [66.3, 7361.0], [66.4, 7364.0], [66.5, 7364.0], [66.6, 7377.0], [66.7, 7382.0], [66.8, 7394.0], [66.9, 7396.0], [67.0, 7398.0], [67.1, 7400.0], [67.2, 7400.0], [67.3, 7403.0], [67.4, 7403.0], [67.5, 7407.0], [67.6, 7412.0], [67.7, 7416.0], [67.8, 7416.0], [67.9, 7419.0], [68.0, 7421.0], [68.1, 7422.0], [68.2, 7436.0], [68.3, 7446.0], [68.4, 7449.0], [68.5, 7449.0], [68.6, 7466.0], [68.7, 7479.0], [68.8, 7481.0], [68.9, 7484.0], [69.0, 7489.0], [69.1, 7490.0], [69.2, 7490.0], [69.3, 7492.0], [69.4, 7502.0], [69.5, 7517.0], [69.6, 7526.0], [69.7, 7528.0], [69.8, 7528.0], [69.9, 7537.0], [70.0, 7537.0], [70.1, 7540.0], [70.2, 7548.0], [70.3, 7550.0], [70.4, 7554.0], [70.5, 7554.0], [70.6, 7557.0], [70.7, 7565.0], [70.8, 7567.0], [70.9, 7575.0], [71.0, 7577.0], [71.1, 7578.0], [71.2, 7578.0], [71.3, 7586.0], [71.4, 7589.0], [71.5, 7592.0], [71.6, 7599.0], [71.7, 7609.0], [71.8, 7616.0], [71.9, 7616.0], [72.0, 7625.0], [72.1, 7631.0], [72.2, 7632.0], [72.3, 7645.0], [72.4, 7652.0], [72.5, 7652.0], [72.6, 7652.0], [72.7, 7656.0], [72.8, 7664.0], [72.9, 7674.0], [73.0, 7676.0], [73.1, 7677.0], [73.2, 7677.0], [73.3, 7679.0], [73.4, 7684.0], [73.5, 7687.0], [73.6, 7689.0], [73.7, 7708.0], [73.8, 7713.0], [73.9, 7713.0], [74.0, 7721.0], [74.1, 7744.0], [74.2, 7744.0], [74.3, 7750.0], [74.4, 7750.0], [74.5, 7750.0], [74.6, 7753.0], [74.7, 7754.0], [74.8, 7768.0], [74.9, 7779.0], [75.0, 7785.0], [75.1, 7787.0], [75.2, 7787.0], [75.3, 7792.0], [75.4, 7802.0], [75.5, 7814.0], [75.6, 7820.0], [75.7, 7820.0], [75.8, 7821.0], [75.9, 7821.0], [76.0, 7830.0], [76.1, 7833.0], [76.2, 7843.0], [76.3, 7848.0], [76.4, 7853.0], [76.5, 7855.0], [76.6, 7855.0], [76.7, 7856.0], [76.8, 7864.0], [76.9, 7873.0], [77.0, 7874.0], [77.1, 7875.0], [77.2, 7875.0], [77.3, 7884.0], [77.4, 7887.0], [77.5, 7897.0], [77.6, 7901.0], [77.7, 7903.0], [77.8, 7908.0], [77.9, 7908.0], [78.0, 7911.0], [78.1, 7922.0], [78.2, 7928.0], [78.3, 7934.0], [78.4, 7937.0], [78.5, 7938.0], [78.6, 7938.0], [78.7, 7945.0], [78.8, 7948.0], [78.9, 7949.0], [79.0, 7951.0], [79.1, 7975.0], [79.2, 7975.0], [79.3, 7978.0], [79.4, 7996.0], [79.5, 8000.0], [79.6, 8009.0], [79.7, 8011.0], [79.8, 8016.0], [79.9, 8016.0], [80.0, 8016.0], [80.1, 8021.0], [80.2, 8027.0], [80.3, 8032.0], [80.4, 8032.0], [80.5, 8034.0], [80.6, 8034.0], [80.7, 8046.0], [80.8, 8050.0], [80.9, 8052.0], [81.0, 8057.0], [81.1, 8062.0], [81.2, 8065.0], [81.3, 8065.0], [81.4, 8069.0], [81.5, 8070.0], [81.6, 8079.0], [81.7, 8085.0], [81.8, 8109.0], [81.9, 8109.0], [82.0, 8109.0], [82.1, 8116.0], [82.2, 8121.0], [82.3, 8121.0], [82.4, 8136.0], [82.5, 8137.0], [82.6, 8137.0], [82.7, 8150.0], [82.8, 8152.0], [82.9, 8171.0], [83.0, 8173.0], [83.1, 8175.0], [83.2, 8176.0], [83.3, 8176.0], [83.4, 8183.0], [83.5, 8196.0], [83.6, 8199.0], [83.7, 8238.0], [83.8, 8251.0], [83.9, 8251.0], [84.0, 8258.0], [84.1, 8262.0], [84.2, 8270.0], [84.3, 8271.0], [84.4, 8280.0], [84.5, 8282.0], [84.6, 8282.0], [84.7, 8283.0], [84.8, 8291.0], [84.9, 8294.0], [85.0, 8295.0], [85.1, 8299.0], [85.2, 8310.0], [85.3, 8310.0], [85.4, 8318.0], [85.5, 8337.0], [85.6, 8354.0], [85.7, 8357.0], [85.8, 8374.0], [85.9, 8393.0], [86.0, 8393.0], [86.1, 8401.0], [86.2, 8443.0], [86.3, 8444.0], [86.4, 8445.0], [86.5, 8445.0], [86.6, 8445.0], [86.7, 8457.0], [86.8, 8486.0], [86.9, 8487.0], [87.0, 8494.0], [87.1, 8506.0], [87.2, 8507.0], [87.3, 8507.0], [87.4, 8517.0], [87.5, 8520.0], [87.6, 8526.0], [87.7, 8529.0], [87.8, 8535.0], [87.9, 8535.0], [88.0, 8535.0], [88.1, 8543.0], [88.2, 8546.0], [88.3, 8547.0], [88.4, 8554.0], [88.5, 8596.0], [88.6, 8596.0], [88.7, 8613.0], [88.8, 8633.0], [88.9, 8642.0], [89.0, 8646.0], [89.1, 8652.0], [89.2, 8653.0], [89.3, 8653.0], [89.4, 8653.0], [89.5, 8700.0], [89.6, 8712.0], [89.7, 8733.0], [89.8, 8740.0], [89.9, 8744.0], [90.0, 8744.0], [90.1, 8746.0], [90.2, 8758.0], [90.3, 8797.0], [90.4, 8812.0], [90.5, 8814.0], [90.6, 8827.0], [90.7, 8827.0], [90.8, 8831.0], [90.9, 8871.0], [91.0, 8890.0], [91.1, 8908.0], [91.2, 8912.0], [91.3, 8912.0], [91.4, 8950.0], [91.5, 8952.0], [91.6, 8969.0], [91.7, 8983.0], [91.8, 8989.0], [91.9, 9009.0], [92.0, 9009.0], [92.1, 9035.0], [92.2, 9046.0], [92.3, 9049.0], [92.4, 9056.0], [92.5, 9060.0], [92.6, 9075.0], [92.7, 9075.0], [92.8, 9096.0], [92.9, 9116.0], [93.0, 9126.0], [93.1, 9135.0], [93.2, 9152.0], [93.3, 9152.0], [93.4, 9225.0], [93.5, 9261.0], [93.6, 9341.0], [93.7, 9359.0], [93.8, 9391.0], [93.9, 9503.0], [94.0, 9503.0], [94.1, 9507.0], [94.2, 9521.0], [94.3, 9544.0], [94.4, 9634.0], [94.5, 9643.0], [94.6, 9844.0], [94.7, 9844.0], [94.8, 9864.0], [94.9, 9881.0], [95.0, 9882.0], [95.1, 9895.0], [95.2, 9904.0], [95.3, 9933.0], [95.4, 9933.0], [95.5, 9970.0], [95.6, 10031.0], [95.7, 10123.0], [95.8, 10188.0], [95.9, 10285.0], [96.0, 10285.0], [96.1, 10435.0], [96.2, 10483.0], [96.3, 10498.0], [96.4, 10579.0], [96.5, 10580.0], [96.6, 10605.0], [96.7, 10605.0], [96.8, 10628.0], [96.9, 10738.0], [97.0, 10823.0], [97.1, 10831.0], [97.2, 10853.0], [97.3, 10934.0], [97.4, 10934.0], [97.5, 10956.0], [97.6, 10959.0], [97.7, 11023.0], [97.8, 11054.0], [97.9, 11091.0], [98.0, 11091.0], [98.1, 11099.0], [98.2, 11175.0], [98.3, 11205.0], [98.4, 11226.0], [98.5, 11327.0], [98.6, 11435.0], [98.7, 11435.0], [98.8, 11455.0], [98.9, 11456.0], [99.0, 11508.0], [99.1, 11511.0], [99.2, 11587.0], [99.3, 11756.0], [99.4, 11756.0], [99.5, 11787.0], [99.6, 12036.0], [99.7, 12135.0], [99.8, 12141.0], [99.9, 12251.0]], "isOverall": false, "label": "NCPPServerlessWestGFSAreaUS-1time-fullzedd", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 100.0, "title": "Response Time Percentiles"}},
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
        data: {"result": {"minY": 1.0, "minX": 4500.0, "maxY": 35.0, "series": [{"data": [[4600.0, 4.0], [4500.0, 1.0], [4700.0, 4.0], [4800.0, 3.0], [5100.0, 16.0], [5000.0, 14.0], [4900.0, 15.0], [5300.0, 31.0], [5200.0, 21.0], [5500.0, 35.0], [5400.0, 28.0], [5600.0, 23.0], [5700.0, 30.0], [5800.0, 18.0], [6100.0, 23.0], [6000.0, 33.0], [5900.0, 25.0], [6200.0, 29.0], [6300.0, 28.0], [6400.0, 19.0], [6500.0, 18.0], [6600.0, 21.0], [6700.0, 21.0], [6800.0, 14.0], [6900.0, 20.0], [7100.0, 24.0], [7000.0, 12.0], [7200.0, 25.0], [7300.0, 16.0], [7400.0, 19.0], [7500.0, 20.0], [7600.0, 17.0], [7900.0, 16.0], [7800.0, 19.0], [7700.0, 14.0], [8100.0, 16.0], [8000.0, 20.0], [8300.0, 7.0], [8500.0, 13.0], [8600.0, 7.0], [8700.0, 8.0], [8200.0, 13.0], [8400.0, 9.0], [9000.0, 8.0], [9200.0, 2.0], [8800.0, 6.0], [8900.0, 7.0], [9100.0, 4.0], [9600.0, 2.0], [9500.0, 4.0], [9300.0, 3.0], [10000.0, 1.0], [9900.0, 3.0], [10200.0, 1.0], [9800.0, 5.0], [10100.0, 2.0], [10400.0, 3.0], [10600.0, 2.0], [10500.0, 2.0], [10700.0, 1.0], [10900.0, 3.0], [11000.0, 4.0], [11200.0, 2.0], [10800.0, 3.0], [11100.0, 1.0], [11400.0, 3.0], [11700.0, 2.0], [11500.0, 3.0], [11300.0, 1.0], [12100.0, 2.0], [12000.0, 1.0], [12200.0, 1.0]], "isOverall": false, "label": "NCPPServerlessWestGFSAreaUS-1time-fullzedd", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 100, "maxX": 12200.0, "title": "Response Time Distribution"}},
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
        data: {"result": {"minY": 851.0, "minX": 2.0, "ticks": [[0, "Requests having \nresponse time <= 500ms"], [1, "Requests having \nresponse time > 500ms and <= 1,500ms"], [2, "Requests having \nresponse time > 1,500ms"], [3, "Requests in error"]], "maxY": 851.0, "series": [{"data": [], "color": "#9ACD32", "isOverall": false, "label": "Requests having \nresponse time <= 500ms", "isController": false}, {"data": [], "color": "yellow", "isOverall": false, "label": "Requests having \nresponse time > 500ms and <= 1,500ms", "isController": false}, {"data": [[2.0, 851.0]], "color": "orange", "isOverall": false, "label": "Requests having \nresponse time > 1,500ms", "isController": false}, {"data": [], "color": "#FF6347", "isOverall": false, "label": "Requests in error", "isController": false}], "supportsControllersDiscrimination": false, "maxX": 2.0, "title": "Synthetic Response Times Distribution"}},
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
        data: {"result": {"minY": 72.97267759562847, "minX": 1.65824538E12, "maxY": 100.0, "series": [{"data": [[1.65824538E12, 100.0], [1.65824544E12, 72.97267759562847]], "isOverall": false, "label": "NCPPServerlessWestGFSAreaUS-1time-fullzedd", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.65824544E12, "title": "Active Threads Over Time"}},
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
        data: {"result": {"minY": 5062.0, "minX": 1.0, "maxY": 10853.0, "series": [{"data": [[2.0, 6171.0], [3.0, 6234.0], [4.0, 6383.0], [5.0, 5950.0], [6.0, 6307.0], [7.0, 6014.0], [8.0, 6211.0], [9.0, 6418.0], [10.0, 6695.0], [11.0, 10580.0], [12.0, 5943.0], [13.0, 8000.0], [14.0, 6762.0], [15.0, 7779.0], [16.0, 7853.0], [17.0, 6294.0], [18.0, 7951.0], [19.0, 6325.0], [20.0, 7908.0], [21.0, 7802.0], [22.0, 8445.0], [23.0, 6255.0], [24.0, 6944.0], [25.0, 7945.0], [26.0, 7855.0], [27.0, 7422.0], [28.0, 8871.0], [29.0, 6648.0], [30.0, 7361.0], [31.0, 7754.0], [33.0, 8079.0], [32.0, 7830.0], [35.0, 8797.0], [34.0, 8070.0], [37.0, 9970.0], [36.0, 7652.0], [39.0, 7725.5], [41.0, 8653.0], [40.0, 7768.0], [43.0, 7934.0], [42.0, 7151.0], [45.0, 8121.0], [44.0, 10853.0], [47.0, 8032.0], [46.0, 8034.0], [49.0, 8011.0], [48.0, 7589.0], [50.0, 8270.0], [53.0, 7631.0], [52.0, 7230.0], [55.0, 7676.0], [54.0, 8083.0], [57.0, 6599.0], [56.0, 8046.0], [59.0, 7592.0], [58.0, 8065.0], [61.0, 7744.0], [60.0, 7821.0], [63.0, 6981.0], [62.0, 7864.0], [67.0, 8176.0], [66.0, 6961.0], [65.0, 7481.0], [64.0, 7833.0], [71.0, 6951.0], [70.0, 7222.0], [69.0, 6454.0], [68.0, 7137.0], [75.0, 6859.0], [74.0, 6824.0], [73.0, 6728.0], [72.0, 7528.0], [79.0, 6321.0], [78.0, 7175.0], [77.0, 7246.0], [76.0, 6234.0], [83.0, 6442.0], [82.0, 6352.0], [81.0, 6727.0], [80.0, 5933.0], [87.0, 5547.0], [86.0, 5912.0], [85.0, 6881.0], [84.0, 6366.0], [91.0, 5517.0], [90.0, 5884.0], [89.0, 5527.0], [88.0, 5637.0], [95.0, 5814.0], [94.0, 5552.0], [93.0, 5077.0], [92.0, 5062.0], [99.0, 6139.0], [98.0, 5914.0], [97.0, 6188.0], [96.0, 5941.0], [100.0, 6883.789893617024], [1.0, 8517.0]], "isOverall": false, "label": "NCPPServerlessWestGFSAreaUS-1time-fullzedd", "isController": false}, {"data": [[94.1880141010576, 6918.247943595776]], "isOverall": false, "label": "NCPPServerlessWestGFSAreaUS-1time-fullzedd-Aggregated", "isController": false}], "supportsControllersDiscrimination": true, "maxX": 100.0, "title": "Time VS Threads"}},
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
        data : {"result": {"minY": 3510.55, "minX": 1.65824538E12, "maxY": 1.9726429666666668E7, "series": [{"data": [[1.65824538E12, 1.9726429666666668E7], [1.65824544E12, 5404096.75]], "isOverall": false, "label": "Bytes received per second", "isController": false}, {"data": [[1.65824538E12, 12814.466666666667], [1.65824544E12, 3510.55]], "isOverall": false, "label": "Bytes sent per second", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.65824544E12, "title": "Bytes Throughput Over Time"}},
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
        data: {"result": {"minY": 6873.5958083832365, "minX": 1.65824538E12, "maxY": 7081.240437158469, "series": [{"data": [[1.65824538E12, 6873.5958083832365], [1.65824544E12, 7081.240437158469]], "isOverall": false, "label": "NCPPServerlessWestGFSAreaUS-1time-fullzedd", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.65824544E12, "title": "Response Time Over Time"}},
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
        data: {"result": {"minY": 5290.579234972678, "minX": 1.65824538E12, "maxY": 5676.568862275451, "series": [{"data": [[1.65824538E12, 5676.568862275451], [1.65824544E12, 5290.579234972678]], "isOverall": false, "label": "NCPPServerlessWestGFSAreaUS-1time-fullzedd", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.65824544E12, "title": "Latencies Over Time"}},
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
        data: {"result": {"minY": 0.0, "minX": 1.65824538E12, "maxY": 12.904191616766441, "series": [{"data": [[1.65824538E12, 12.904191616766441], [1.65824544E12, 0.0]], "isOverall": false, "label": "NCPPServerlessWestGFSAreaUS-1time-fullzedd", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.65824544E12, "title": "Connect Time Over Time"}},
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
        data: {"result": {"minY": 4596.0, "minX": 1.65824538E12, "maxY": 12251.0, "series": [{"data": [[1.65824538E12, 12251.0], [1.65824544E12, 11587.0]], "isOverall": false, "label": "Max", "isController": false}, {"data": [[1.65824538E12, 8950.2], [1.65824544E12, 8359.199999999999]], "isOverall": false, "label": "90th percentile", "isController": false}, {"data": [[1.65824538E12, 11586.949999999986], [1.65824544E12, 10970.439999999997]], "isOverall": false, "label": "99th percentile", "isController": false}, {"data": [[1.65824538E12, 10081.599999999995], [1.65824544E12, 8786.4]], "isOverall": false, "label": "95th percentile", "isController": false}, {"data": [[1.65824538E12, 4596.0], [1.65824544E12, 4644.0]], "isOverall": false, "label": "Min", "isController": false}, {"data": [[1.65824538E12, 6528.5], [1.65824544E12, 7086.0]], "isOverall": false, "label": "Median", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.65824544E12, "title": "Response Time Percentiles Over Time (successful requests only)"}},
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
    data: {"result": {"minY": 5455.0, "minX": 1.0, "maxY": 8517.0, "series": [{"data": [[8.0, 5844.5], [35.0, 6343.0], [9.0, 7182.0], [10.0, 6905.0], [11.0, 5455.0], [12.0, 6127.5], [13.0, 6073.0], [14.0, 5995.0], [15.0, 6090.0], [16.0, 5919.5], [1.0, 8517.0], [17.0, 7369.5], [18.0, 5643.0], [5.0, 6865.0], [21.0, 7492.0], [23.0, 5891.0], [24.0, 7040.0], [25.0, 7122.5], [26.0, 7641.5], [27.0, 7567.0], [7.0, 5752.0], [28.0, 6993.5], [29.0, 7382.0]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 35.0, "title": "Response Time Vs Request"}},
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
    data: {"result": {"minY": 4944.0, "minX": 1.0, "maxY": 8150.0, "series": [{"data": [[8.0, 5040.5], [35.0, 5207.0], [9.0, 5236.0], [10.0, 4944.0], [11.0, 4947.5], [12.0, 5127.5], [13.0, 5619.0], [14.0, 5180.0], [15.0, 5262.0], [16.0, 5237.5], [1.0, 8150.0], [17.0, 5281.0], [18.0, 4973.0], [5.0, 5148.0], [21.0, 5093.0], [23.0, 5206.0], [24.0, 5087.5], [25.0, 5024.5], [26.0, 5114.5], [27.0, 5187.0], [7.0, 5252.0], [28.0, 5142.0], [29.0, 5677.0]], "isOverall": false, "label": "Successes", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 1000, "maxX": 35.0, "title": "Latencies Vs Request"}},
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
        data: {"result": {"minY": 1.3833333333333333, "minX": 1.65824538E12, "maxY": 12.8, "series": [{"data": [[1.65824538E12, 12.8], [1.65824544E12, 1.3833333333333333]], "isOverall": false, "label": "hitsPerSecond", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.65824544E12, "title": "Hits Per Second"}},
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
        data: {"result": {"minY": 3.05, "minX": 1.65824538E12, "maxY": 11.133333333333333, "series": [{"data": [[1.65824538E12, 11.133333333333333], [1.65824544E12, 3.05]], "isOverall": false, "label": "200", "isController": false}], "supportsControllersDiscrimination": false, "granularity": 60000, "maxX": 1.65824544E12, "title": "Codes Per Second"}},
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
        data: {"result": {"minY": 3.05, "minX": 1.65824538E12, "maxY": 11.133333333333333, "series": [{"data": [[1.65824538E12, 11.133333333333333], [1.65824544E12, 3.05]], "isOverall": false, "label": "NCPPServerlessWestGFSAreaUS-1time-fullzedd-success", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.65824544E12, "title": "Transactions Per Second"}},
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
        data: {"result": {"minY": 3.05, "minX": 1.65824538E12, "maxY": 11.133333333333333, "series": [{"data": [[1.65824538E12, 11.133333333333333], [1.65824544E12, 3.05]], "isOverall": false, "label": "Transaction-success", "isController": false}, {"data": [], "isOverall": false, "label": "Transaction-failure", "isController": false}], "supportsControllersDiscrimination": true, "granularity": 60000, "maxX": 1.65824544E12, "title": "Total Transactions Per Second"}},
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

