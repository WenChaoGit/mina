// pages/my/my.js
var util = require('../../../utils/util.js');
var api = require('../../../utils/api.js');
var session = require('../../../utils/session.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickname   : '无',
    is_userinfo: true,
    avatar_url : '../../../image/timg.png',
  },
  gotoUserInfo: function () {
    wx.navigateTo({
      url: '/page/component/userinfo/userinfo',
    })
  },
  newsList:function() {
    wx.navigateTo({
      url: '/pages/news/news',
    })
  },
  healthFile: function () {
    wx.navigateTo({
      url: '/page/component/health/health_file',
    })
  },
  myConsume: function () {
    wx.navigateTo({
      url: '/pages/my_consume/my_consume',
    })
  },
  gotoFeedback: function () {
    wx.navigateTo({
      url: '/page/component/feedback/feedback',
    })
  },
  aboutUs: function () {
    wx.navigateTo({
      url: '/page/component/about_us/about_us',
    })
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
    let user = session.getUserInfo();
    if(user.avatar_url) {
      this.setData({
        avatar_url: user.avatar_url,
      })
    }
    this.setData({
      nickname   : user.nickname,
      is_userinfo: user.is_userinfo,
    })
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
  getInfo: function() {
    let d = session.getUserInfo();
    if(d === '') {
      console.log('none');
    } else {
      console.log(d);
    }
  },

  logout: function() {
    wx.showModal({
      title: '退出',
      content: '您确定要退出？',
      confirmText: "确定",
      cancelText: "取消",
      success: function (res) {
        if (res.confirm) {
          session.logout()
          wx.reLaunch({
            url: '/page/component/login/index',
          })
        }
      }
    })
  },

  onGotUserInfo:function(e){
    var that = this;
    let user = session.getUserInfo();
    if(e.detail.errMsg == 'getUserInfo:ok'){
      wx.showLoading({
        title: '操作中...',
      })
      wx.request({
        url: api.getPort(),
        data: api.setUserInfo(e.detail.userInfo,user.mobile),
        method: 'post',
        success: function (result) {
          let d = api.parseResult(result);
          if (d.code == api.getSuccessCode()) {
            session.saveUserInfo(d.data);
            wx.reLaunch({
              url: '/page/component/my/my',
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
            icon: 'none',
          })
        },
        complete: function () {
          wx.hideLoading()
        }
      });
    }
  },
})