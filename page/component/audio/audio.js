var util = require('../../../utils/util.js');
var api = require('../../../utils/api.js');

Page({

  onReady: function (e) {
    // 使用 wx.createAudioContext 获取 audio 上下文 context
    this.audioCtx = wx.createAudioContext('myAudio')
  },
  data: {
    audioImg:'http://demo.sun-hc.com/yuanxin/images/audio_img.jpg',
    src: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46',
    resource_id:0,
    audio:[],
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      'resource_id': options.resource_id,
    });
  },

  getAudioInfo: function(){
    var that = this;
    wx.showLoading({
      title: '操作中...',
    })
    wx.request({
      url: api.getPort(),
      data: api.getResourceInfo(that.data.resource_id),
      method: 'post',
      success: function (result) {
        let d = api.parseResult(result);
        if (d.code == api.getSuccessCode()) {
          that.setData({
            'audio': d.data,
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
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getAudioInfo();
  },
})