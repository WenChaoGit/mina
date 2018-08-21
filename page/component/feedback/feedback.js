var util = require('../../../utils/util.js');
var api = require('../../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: '',
    content_len: 0,
    content_max_len : 140,
    items: [{checked: '',text: '视频无法播放'},{text: '评估不准确'},{text: '流程复杂'},{text: '服务态度'},{text: '其他'}],
    checkSelected: ''
  },
  checkSelected(e) {
    const index = e.target.dataset.index;
    let item = this.data.items[index];
    let itemCheck = `items[${index}].checked`;
    if (item.checked) {
      this.setData({
        [itemCheck]: ''
      });
    } else {
      this.setData({
        [itemCheck]: 'checkboxselected'
      });
    }
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

  feedbackInput: function (e) {
    let c = e.detail.value;
    if (c.length > this.data.content_max_len) {
      c = c.substring(0, this.data.content_max_len);
    }
    this.setData({
      content: c,
      content_len: c.length
    })
  },

  submitFeedback: function () {
    var that = this;
    var ids = '1,4';
    if (!util.empty(that.data.content)) {
      wx.showLoading({
        title: '提交反馈意见...',
      })
      wx.request({
        url: api.getPort(),
        data: api.getFeedback(that.data.content, ids),
        method: 'post',
        success: function (result) {
          wx.hideLoading();
          console.log(result);
          let d = api.parseResult(result);
          if (d.code == api.getSuccessCode()) {
            wx.navigateBack();
            wx.showToast({
              title: '意见反馈提交成功！',
              icon: 'success',
            })
          } else {
            wx.showToast({
              title: d.msg,
              icon: 'none',
            })
          }
        },
        fail: function ({ errMsg }) {
          wx.hideLoading();
          wx.showToast({
            title: '网络连接错误！',
            icon: 'none',
          })
        }
      })
    } else {
      wx.showToast({
        title: '意见反馈不能为空！',
        icon: 'none',
      })
    }
  },

})