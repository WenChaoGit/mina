var util = require('../../../utils/util.js');
var api = require('../../../utils/api.js');
var session = require('../../../utils/session.js');
var interval = null //验证码倒计时

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: '',
    yzm: '',
    yzm_btn_text: '获取验证码',
    yzm_btn_css: 'yzm_btn',
    yzm_disabled: false,
    currentTime: 60,
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
  yzmInput: function (e) {
    this.setData({
      yzm: e.detail.value
    })
  },
  sendYzm: function () {
    var that = this;
    if (!that.data.yzm_disabled) {
      if (!util.ismobile(that.data.mobile)) {
        wx.showToast({
          title: '手机号格式不正确！',
          icon: 'none',
        })
      } else {
        wx.showLoading({
          title: '获取证码...',
        })
        wx.request({
          url: api.getPort(),
          data: api.getYzm(that.data.mobile),
          method: 'post',
          success: function (result) {
            wx.hideLoading()
            let d = api.parseResult(result);
            if (d.code == api.getSuccessCode()) {
              that.setData({
                yzm_disabled: true,
                yzm_btn_css: 'yzm_btn bg-gray'
              })
              var currentTime = that.data.currentTime
              interval = setInterval(function () {
                currentTime--;
                that.setData({
                  yzm_btn_text: '验证码(' + currentTime + ')'
                })
                if (currentTime <= 0) {
                  clearInterval(interval)
                  that.setData({
                    yzm_btn_text: '获取验证码',
                    currentTime: 60,
                    yzm_disabled: false,
                    yzm_btn_css: 'yzm_btn'
                  })
                }
              }, 1000);
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
    }
  },

  loginBtn: function (e) {
    if (!util.ismobile(this.data.mobile)) {
      wx.showToast({
        title: '手机号格式不正确！',
        icon: 'none',
      })
    } else if (this.data.yzm == '') {
      wx.showToast({
        title: '验证码不能为空！',
        icon: 'none',
      })
    } else {
      wx.showLoading({
        title: '用户登录...',
      })
      wx.request({
        url: api.getPort(),
        data: api.getLogin(this.data.mobile, this.data.yzm, 2),
        method: 'post',
        success: function (result) {
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
          wx.hideLoading();
          wx.showToast({
            title: '网络连接错误！',
            icon: 'none',
          })
        }
      })
    }
  },

})