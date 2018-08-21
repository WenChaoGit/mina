var util = require('../../../utils/util.js');
var api = require('../../../utils/api.js');
import { VIDEO_SRC } from '../../../utils/config'

function getRandomColor() {
  let rgb = []
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length == 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}

Page({
  onReady: function (res) {
    this.videoContext = wx.createVideoContext('myVideo')
  },
  inputValue: '',
  data: {
    src: VIDEO_SRC,
    resource_id:0,
    video:[],
  },
  bindInputBlur: function (e) {
    this.inputValue = e.detail.value
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      'resource_id': options.resource_id,
    });
  },

  geVideoInfo: function(){
    var that = this;
    wx.showLoading({
      title: '操作中...',
    })
    wx.request({
      url: api.getPort(),
      data: api.getResourceInfo(that.data.resource_id),
      method: 'post',
      success: function (result) {
        let {code,msg,data:video} = api.parseResult(result);
        if (code !== api.getSuccessCode()) {
          wx.showToast({
            title: msg,
            icon: 'none',
          })
        } 
        that.setData({ video });
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.geVideoInfo();
  },
})