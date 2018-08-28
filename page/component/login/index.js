var util = require('../../../utils/util.js');
var api = require('../../../utils/api.js');
var session = require('../../../utils/session.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickname :'',
    gender   : 1,
    country  :'',
    language :'',
    city     :'',
    avatarUrl:'',
    province :'',
    session_key :'',
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
    //  app.globalData.session_key;
    if (app.globalData.session_key && app.globalData.session_key !=''){
      this.setData({
        session_key: app.globalData.session_key,
      });
    }else{
      app.globalData.sessionKeyCallBack = session_key => {
        this.setData({ session_key });
      }
    }
    let user = session.getUserInfo();
    // this.setData({
    //   session_key : session_key,
    // });
    if(user) {
      this.setData({
        nickname : user.nickname,
        gender   : user.gender,
        country  : user.country,
        language : user.language,
        city     : user.city,
        avatarUrl: user.avatarUrl,
        province : user.province,
      });
    }
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

  toLoginByYzm: function () {
    wx.navigateTo({
      url: './login_yzm',
    })
  },
  toLoginByPwd: function () {
    wx.navigateTo({
      url: './login_pwd',
    })
  },
  getPhoneNumber: function(e) {
    var that = this;
    if(e.detail.errMsg == 'getPhoneNumber:ok') {
      wx.request({
        url: api.getPort(),
        data: api.getPhoneNumber({
          'iv':e.detail.iv,
          'encryptedData':e.detail.encryptedData,
          'session_key':that.data.session_key,
        }),
        method: 'post',
        success: function (result) {
          let d = api.parseResult(result);
          if (d.code == api.getSuccessCode()) {
            session.saveUserInfo(d.data);
            wx.reLaunch({
              url: '/page/component/index/index',
            });
          } else {
            wx.showToast({
              title: d.msg,
              icon: 'none',
            })
          }
        },
        fail: function ({ errMsg }) {;
          wx.hideLoading()
          wx.showToast({
            title: errMsg,
            icon: 'none',
          })
        }
      });
    } else {
      
    }
  }
})