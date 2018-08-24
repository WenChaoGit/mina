// pages/my/my.js
const util = require('../../../utils/util.js');
const api = require('../../../utils/api.js');
const session = require('../../../utils/session.js');
import regeneratorRuntime from '../../../utils/runtime'; //用来编译async await
import { errCode } from '../../../utils/config.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickname: '无',
    is_userinfo: true,
    avatar_url: '../../../image/tximg.png',
  },
  gotoUserInfo: function () {
    wx.navigateTo({
      url: '/page/component/userinfo/userinfo',
    })
  },
  newsList: function () {
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
    let { avatar_url,is_userinfo,nickname } = session.getUserInfo();
    if (avatar_url) {
      this.setData({avatar_url});
    }
    if (!is_userinfo) is_userinfo = false;
    this.setData({nickname ,is_userinfo});
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
  getInfo: function () {
    let d = session.getUserInfo();
    if (d === '') {
      console.log('none');
    } else {
      console.log(d);
    }
  },

  logout: function () {
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

  /**
   * @action 10013
   * @desc 授权完善用户信息
   * @param {detail} 小程序中的事件对象的detail对象
   */
  async onGotUserInfo({ detail }) {
    let { mobile } = session.getUserInfo();
    if (detail.errMsg == 'getUserInfo:ok') {
      let { userInfo: userinfo } = detail;
      let { code, msg: title, data } = await api.setUserInfo({ userinfo, mobile });
      if (!code || code == errCode) {
        wx.showToast({ title }); return;
      }
      session.saveUserInfo(data);
      wx.reLaunch({
        url: '/page/component/my/my',
      });
    }
  }

})