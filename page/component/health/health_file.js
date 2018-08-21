var util = require('../../../utils/util.js');
var api = require('../../../utils/api.js');

Page({
  data: {
    info : [],
  },
  onShow: function () {
    this.getHealthBtn();
  },
  getHealthBtn: function(){
    var that = this;
    wx.showLoading({
      title: '操作中...',
    })
    wx.request({
      url: api.getPort(),
      data: api.getHealthInfo(),
      method: 'post',
      success: function (result) {
        let d = api.parseResult(result);
        if (d.code == api.getSuccessCode()) {
          that.setData({
            'info': d.data,
          })
        } else {
          wx.showToast({
            title: d.msg,
            icon: 'none',
          })
        }
      },
      fail: function ({ errMsg }) {
        wx.showToast({
          title: '网络连接错误！',
          icon: 'none',
        })
      },
      complete: function () {
        wx.hideLoading()
      }
    });
  },
  healthFileXq : function (e) {
    wx.navigateTo({
      url: '/page/component/health_xq/health_file_xq?pe_order_id='+e.currentTarget.dataset.no,
    })
  },
});