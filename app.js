var api = require('./utils/api.js');
var session = require('./utils/session.js');

App({
  globalData:{
    session_key: '',
    userInfo: null
  },
  data:{
    session_key : '',
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        var that = this;
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: api.getPort(),
          data: api.getSessionKey(res.code),
          method: 'post',
          success: function(result){
            let d = api.parseResult(result);
            if (d.code == api.getSuccessCode()) {
              that.globalData.session_key = d.data.session_key;
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
          }
        });
      }
    })
    //获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              //res.userInfo.session_key = this.session_key;
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          });
        }
      }
    })
  },
})