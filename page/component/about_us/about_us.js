const api = require('../../../utils/api.js');
import { errCode } from '../../../utils/config.js';
import regeneratorRuntime from '../../../utils/runtime'; 
// pages/my/about_us/about_us.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'',
    desc:'',
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
    this.getAboutUs();
  },

  async getAboutUs(){
    let {code,msg,data} = await api.getAboutUsData();
    if(!code || code == errCode ){
      if(!msg) msg = '抱歉,发生了一个错误'
      wx.showToast({title:msg});return;
    }
    let {list} = data
    this.setData({...list});

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