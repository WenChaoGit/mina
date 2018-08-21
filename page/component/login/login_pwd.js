var util = require('../../../utils/util.js');
var api = require('../../../utils/api.js');
var session = require('../../../utils/session.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: '',
    pwd: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  
  },

  mobileInput: function (e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  pwdInput: function (e) {
    this.setData({
      pwd: e.detail.value
    })
  },
  loginBtn: function (e) {
    if (!util.ismobile(this.data.mobile)) {
      wx.showToast({
        title: '手机号格式不正确！',
        icon: 'none',
      })
    } else if (!util.checkpwd(this.data.pwd)) {
      wx.showToast({
        title: '密码格式不正确！',
        icon: 'none',
      })
    } else {
      wx.showLoading({
        title: '用户登录...',
      })
      wx.request({
        url: api.getPort(),
        data: api.getLogin(this.data.mobile, this.data.pwd, 3),
        method: 'post',
        success: function (result) {
          console.log(result);
          wx.hideLoading();
          let d = api.parseResult(result);
          if (d.code == api.getSuccessCode()) {
            session.saveUserInfo(d.data);
            wx.reLaunch({
              url: '/page/component/index/index',
            })
          } else {
            wx.showToast({
              title: d.msg,
              icon: 'none',
            })
          }
        },
        fail: function ({ errMsg }) {
          console.log(errMsg);
          wx.hideLoading()
          wx.showToast({
            title: '网络连接错误！',
            icon: 'none',
          })
        }
      })
    }
  },
})