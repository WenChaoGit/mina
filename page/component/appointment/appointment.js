// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    appointData: [0, 1, 2, 3, 4, 5, 6, 7]

  },
  /**
   * 生命周期函数--监听页面加载
   */
  quXiaoBtn(){
    let that = this;
    wx.showModal({
      title: '删除确认',
      content: '您确定要删除当前预约吗？',
      confirmColor:'#f04748',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
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

  }
})