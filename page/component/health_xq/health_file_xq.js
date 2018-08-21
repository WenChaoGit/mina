var util = require('../../../utils/util.js');
var api = require('../../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info : [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      'pe_order_id': options.pe_order_id,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getOneHealthBtn();
  },

  getOneHealthBtn: function(){
    var that = this;
    console.log(that.pe_order_id);
    wx.showLoading({
      title: '操作中...',
    })
    wx.request({
      url: api.getPort(),
      data: api.getOneHealthInfo(that.data.pe_order_id),
      method: 'post',
      success: function (result) {
        let d = api.parseResult(result);
        console.log(d.data);
        if (d.code == api.getSuccessCode()) {
          that.setData({
            'info': d.data,
          });
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
          icon: 'none'
        })
      },
      complete: function () {
        wx.hideLoading()
      }
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})