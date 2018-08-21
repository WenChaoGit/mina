var session = require('../../../utils/session.js');
var api = require('../../../utils/api.js');
var app = getApp();

Page({
  data: {
    avatar_url : '../../../image/timg.png',
    training : [],//训练中数组
    trained : [],//已完成数组
    nickname: "无",
    feedback_content: "",//评价内容
    feedback_order_id : 0,//评价的orderid
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    tabList: [{ 'id': 0, 'name': '进行中' }, { 'id': 1, 'name': '已完成' }],
    expertList: [{ //假数据
      
    }],
    showModal: false,
    
    starIndex1: 1,  //星星1
    starIndex2: 2,  //星星2
    starIndex3: 3,  //星星3
    starIndex4: 4,  //星星4
    starIndex5: 5,  //星星5
    actions: [
      {
        name: '取消'
      },
      {
        name: '提交',
        color: '#f04748',
      }
    ],
  },
  onStar(e) {
    const index = e.detail.index;
    this.setData({
      'starIndex2': index
    })
  },
  indexNav: function (e) {
    wx.navigateTo({
      url: '/page/component/train/train?pe_order_id='+e.currentTarget.dataset.no,
    });
  },

  setInfo: function(){
    var that = this;
    wx.showLoading({
      title: '操作中...',
    })
    wx.request({
      url: api.getPort(),
      data: api.getTrainListInfo(),
      method: 'post',
      success: function (result) {
        let d = api.parseResult(result);
        if (d.code == api.getSuccessCode()) {
          console.log(d.data)
          that.setData({
            'training': d.data.training,
            'trained': d.data.trained,
          });
        } else {
          wx.showToast({
            title: d.msg,
            icon: 'none',
          })
        }
      },
      fail: function ({ errMsg }) {
        console.log(errMsg);
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

  // 弹出评价
  showDialogBtn: function (e) {
    this.setData({
      showModal: true,
      feedback_order_id : e.currentTarget.dataset.no,
    })
  },

  handleUserRate({ detail }) {
    var that = this;
    const index = detail.index;
    if (index === 0) {
      that.setData({
        showModal: false,
        feedback_content: '',
      });
    } else if (index === 1) {
      wx.showLoading({
        title: '评价中...',
      })
      wx.request({
        url: api.getPort(),
        data: api.setOderFeedback({
          'pe_order_id'     : that.data.feedback_order_id,
          'feedback_level'  : that.data.starIndex2,
          'feedback_content': that.data.feedback_content,
        }),
        method: 'post',
        success: function (result) {
          let d = api.parseResult(result);
          if (d.code == api.getSuccessCode()) {
            wx.reLaunch({
              url: '/page/component/index/index',
            });
          } else {
            wx.showToast({
              title: d.msg,
              icon: 'none',
            });
            that.setData({
              showModal: false,
            });
          }
        },
        fail: function ({ errMsg }) {
          console.log(errMsg);
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

  bindTextAreaBlur : function(e){
    this.setData({
      feedback_content : e.detail.value
    });
  },
  
  // 滚动切换标签样式
  switchTab: function (e) {
    this.setData({
      currentTab: e.detail.current,

    });
    this.checkCor();
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) { return false; }
    else {
      this.setData({
        currentTab: cur
      });
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab > 2) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
  onLoad: function () {
    var that = this;
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 320;
        console.log(calc)
        that.setData({
          winHeight: calc
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (session.isLogin()) {
      let user = session.getUserInfo();
      if(user.avatar_url) {
        this.setData({
          avatar_url: user.avatar_url,
        });
      }
      this.setData({
        nickname: user.nickname
      });
      this.setInfo();
    } else {
      wx.redirectTo({
        url: '../login/index',
      })
    }
  },
  footerTap: app.footerTap
})

