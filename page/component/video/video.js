var util = require('../../../utils/util.js');
var api = require('../../../utils/api.js');
import regeneratorRuntime from '../../../utils/runtime';//用来编译async await
import { wxToastDuraion, errCode, msgList } from '../../../utils/config';
const app = getApp(); //获取globalData


Page({
  onReady: function (res) {
    this.videoCtx = wx.createVideoContext('resourceVideo');
  },
  data: {
    resource_id: 0,
    video: [],
    videoIndex: 1,
    videoCount: 0,
    modalTrainCompleteSwitch: false,
    modalButton: [
      {
        name: '返回训练列表',
        color: '#f04b49'
      }
    ],
    isComplete: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { resource_id } = options;
    let { trainResourceList } = app.globalData;
    let videoCount = trainResourceList.length;
    this.setData({ resource_id, videoCount });
  },

  async getVideoInfo() {
    let { resource_id } = this.data;
    let { code, msg: title, data } = await api.getResourceInfo(resource_id);
    if (!code || code == 400) {
      wx.showToast({ title, duration: wxToastDuraion }); return;
    }
    this.setData({ video: data })
  },

  /**
   * @action 10015
   * @desc 训练完成后,用户点击返回训练列表
   * @return mixed
   */
  async confirmTrainComplete() {
    let { trainResourceList, peOrderId } = app.globalData;
    if (!trainResourceList && !peOrderId) {
      wx.showToast({ title: '抱歉,出现了一个错误' }); return;
    }
    let { code, msg } = await api.updateUserTrainLog({ trainResourceList, peOrderId });
    if (!code || code == errCode) {
      wx.showToast({
        title: msgList['train_update_fail'],
        duration: wxToastDuraion
      }); return;
    }
    wx.showToast({
      title: msgList['train_completed'],
      duration: wxToastDuraion
    });
    // 本次训练结束,返回训练列表
    wx.navigateTo({
      url: `/page/component/train/train?pe_order_id=${peOrderId}`
    });

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getVideoInfo();
  },
  onTimeUpdate: function (e) {
    let time = e.detail.currentTime;
    if (String(time).startsWith('5')) {
      // this.videoCtx.pause();
    }
    // setTimeout(() => {
    //   this.videoCtx.play()
    // }, 1000*60);
    // this.videoCtx.play(); 

  },
  /**
   * @desc 视频播放完成后操作,继续播放,或者弹窗训练完成提示
   * @param {*} e
   * @return mixed 
   */
  async onVideoEnd(e) {
    let { type } = e; //判断视频是否播完
    let { trainResourceList, peOrderId } = app.globalData;
    if (!trainResourceList && !peOrderId) {
      wx.showToast({ title: '抱歉,出现了一个错误' }); return;
    }
    let videoIndex = this.data.videoIndex;
    if (type == 'ended') {
      //继续播放下一个视频,获取下一个资源的id,请求数据回来
      if (videoIndex >= trainResourceList.length) {
        //显示训练完成的弹窗
        this.setData({ modalTrainCompleteSwitch: true })
      } else {
        // 播放下一个视频
        wx.showToast({ title: '正在为您切换下一个视频', duration: wxToastDuraion });
        let { code, msg: title, data: video } = await api.getResourceInfo(trainResourceList[videoIndex]);
        if (!code || code == errCode) {
          wx.showToast({ title, duration: wxToastDuraion }); return;
        }
        videoIndex += 1;
        this.setData({ video, videoIndex });
      }
    }
  }
})