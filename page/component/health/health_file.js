var util = require('../../../utils/util.js');
var api = require('../../../utils/api.js');
import regeneratorRuntime from '../../../utils/runtime'; //用来编译async await
import { errCode } from '../../../utils/config.js';

Page({
  data: {
    info : [],
  },
  onShow: function () {
    this.getHealthBtn();
  },
  async getHealthBtn(){
    let { data:info, code, msg:title } = await api.getHealthInfo();
    if(!title) title = '抱歉,出现错误';
    if(!code || code == errCode){
      wx.showToast({title});return;
    }
    this.setData({info});  
  },
 
  getDetail({detail}){
    wx.navigateTo({
      url: `/page/component/health_xq/health_file_xq?pe_order_id=${detail.id}`,
    });   
  }
});