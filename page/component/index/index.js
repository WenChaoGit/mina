var session = require('../../../utils/session.js');
var api = require('../../../utils/api.js');
import { errCode } from '../../../utils/config.js';
import regeneratorRuntime from '../../../utils/runtime'; //用来编译async await
var app = getApp();

Page({
  data: {
    avatar_url: '../../../image/tximg.png',
    training: [],//训练中数组
    trained: [],//已完成数组
    nickname: "无",
    feedback_content: "",//评价内容
    feedback_order_id: 0,//评价的orderid
    hidden: true,
    upperThreshold:50,
    scrollTop: 0,
    scrollHeight: 0,
    refreshText:'正在刷新中...',
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    tabList: [{ 'id': 0, 'name': '进行中' }, { 'id': 1, 'name': '已完成' }],
    expertList: [{ //假数据

    }],
    showModal: false,
    refreshState: false,
    starIndex1: 1,  //星星1
    starIndex2: 2,  //星星2
    starIndex3: 3,  //星星3
    starIndex4: 4,  //星星4
    starIndex5: 5,  //星星5
    actions: [
      { name: '取消' },
      { name: '提交', color: '#f04748' }
    ],
    touchStartY:0,
    touchEndY:0
  },
  onStar({ detail }) {
    const index = detail.index;
    this.setData({
      starIndex2: index
    })
    
  },
  async touchStart({changedTouches}){
    let touchStartY = changedTouches[0].clientY;
    console.log(touchStartY)
    this.setData({touchStartY})
  },
  async touchMove(e) {
    console.log(e);
    // let touchStartY = changedTouches[0].clientY;
    // this.setData({ refreshState: true, touchStartY})
  },

  async touchEnd({ changedTouches}){
    let touchEndY = changedTouches[0].clientY;
    console.log(touchEndY)
    if (touchEndY > this.data.touchStartY){
      console.log(11);
      this.setData({ refreshState: true })
    }
  },
  async onPullDownRefresh() {
    wx.showNavigationBarLoading();
    let { code, msg: title, data } = await api.getTrainListInfo();
    if (!code || code == errCode) {
      wx.showToast({ title }); return;
    }
    this.setData({ ...data });
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  },
  /**
   *  @param {小程序事件对象event中的currentTarget} currentTarget
   */
  indexNav: function ({ currentTarget }) {
    let { no } = currentTarget.dataset;
    if (!no) {
      wx.showToast({ title: '参数异常' }); return;
    }
    wx.navigateTo({
      url: `/page/component/train/train?pe_order_id=${no}`,
    });
  },

  /**
   * @action 10007
   * @desc 获取用户的所有的训练列表包括进行中的,和已完成的
   */
  async setInfo() {
    let { code, msg: title, data } = await api.getTrainListInfo();
    if (!code || code == errCode) {
      wx.showToast({ title }); return;
    }
    this.setData({ ...data });
  },

  /**
   * @desc 滚动至页面底部 下拉加载更多
   * 
   */
  async onScrollBottom() {

  },

  /**
   * @desc 滚动至顶部 上拉刷新页面
   */
  async onScrollTop() {
    this.setData({ refreshState: true });
    let { code, msg: title, data } = await api.getTrainListInfo();
    if (!code || code == errCode) {
      wx.showToast({ title }); return;
    }
    this.setData({ ...data });
    setTimeout(() => {
      this.setData({ refreshState: false });
    }, 1000);
  },

  /**
   * @desc 弹出评价
   * @param {小程序事件对象event中的currentTarget} currentTarget
   */
  showDialogBtn: function ({ currentTarget }) {
    //把获取到的no赋值到feedback_order_id
    let { no: feedback_order_id } = currentTarget.dataset;
    this.setData({ showModal: true, feedback_order_id })
  },
  /**
   * 下拉加载训练列表
   */
  async onPullDown(e) {
    console.log(e)
  },

  /**
   * @action 10012
   * @desc 对某个已完成的康复方案进行评价
   * @param {小程序事件对象event中的detail} detail
   */
  async handleUserRate({ detail }) {
    const index = detail.index;
    if (index === 0) {
      this.setData({ showModal: false, feedback_content: '' }); return;
    }
    if (index === 1) {
      let { feedback_order_id: pe_order_id, starIndex2:feedback_level, feedback_content } = this.data;
      let { code, msg: title } = await api.setOderFeedback({
        pe_order_id, feedback_level, feedback_content
      });
      if (!code || code == errCode) {
        this.setData({ showModal: false });
        wx.showToast({ title }); return;
      }
      wx.reLaunch({ url: '/page/component/index/index' });
    }
  },

  /**
   * @desc 用户在评价的模态窗中输入文字时,把获取到的评价内容传递到data中feedback_content中
   * @param {小程序事件对象event中的detail} detail
   */
  bindTextAreaBlur({ detail }) {
    this.setData({ feedback_content: detail.value });
  },

  /**
   * @desc 滚动切换标签样式
   * @param {小程序事件对象event中的detail} detail
   */
  switchTab: function ({ detail }) {
    this.setData({ currentTab: detail.current });
    this.checkCor();
  },
  /**
   * @desc 点击标题切换当前页时改变样式
   * @param {小程序事件对象event中的target} target
   */
  swichNav: function ({ target }) {
    let currentTab = target.dataset.current;
    if (this.data.currentTaB == currentTab) return;
    this.setData({ currentTab });
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab > 2) {
      this.setData({ scrollLeft: 300 })
    } else {
      this.setData({ scrollLeft: 0 })
    }
  },
  onLoad: function () {
    //  高度自适应
    wx.getSystemInfo({
      success: res => {
        let scrollHeight = res.windowHeight - 150;
        this.setData({ scrollHeight })
      }
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (session.isLogin()) {
      let { avatar_url, nickname } = session.getUserInfo();
      if (avatar_url && nickname) this.setData({ avatar_url, nickname });
      this.setInfo(); return;
    }
    // 没有登录就跳转到登录页面进行登录
    wx.redirectTo({ url: '../login/index' })
  },
  footerTap: app.footerTap
})

