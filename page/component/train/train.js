const util = require('../../../utils/util.js');
const api = require('../../../utils/api.js');
const session = require('../../../utils/session')
import { RESOURCE_TYPE_VIDEO, errCode, msgList } from '../../../utils/config'
import regeneratorRuntime from '../../../utils/runtime'; //用来编译async await

let app = getApp();

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		pe_result: [],
		level: [],
		trainlist: [],
		pe_order_id: 0,
		jump: ['image/image', 'video/video', 'audio/audio', 'image/image'],

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	videoBtn({ currentTarget}) {
		let { type: resource_type, no } = currentTarget.dataset;
		if (resource_type == 0) {
			wx.showToast({title: '暂无关联资源'});
		} else if (resource_type == RESOURCE_TYPE_VIDEO) {
			wx.navigateTo({
				url: `/page/component/video/video?resource_id=${no}`
			});
		} else {
			wx.showToast({title: '资源类型错误'});
		}
	},
	/**
	 * @desc 页面加载时获取其 路由传递过来的参数
	 */
	onLoad: function (options) {
		let { pe_order_id } = options;
		this.setData({ pe_order_id });
	},
	/**
	 * @desc 监听页面显示,用康复方案id获取其自我训练的内容,自我训练没有视频的不展示
	 */
	onShow: function () {
		this.getOneTrain();
	},

	/**
	 * 获取自我训练内容
	 */
	async getOneTrain() {
		let { pe_order_id } = this.data;
		let { code, msg: title, data } = await api.getOneTrainInfo({ pe_order_id });
		if (!code || code == errCode) {
			wx.showToast({ title }); return;
		}
		this.setData({ ...data });
	},
	async startTrain() {
		let { trainlist, pe_order_id } = this.data;
		let { id: user_id } = session.getUserInfo();
		let { code, msg, data } = await api.getResourceUrl({ trainlist, pe_order_id, user_id });
		if (!code || code == 400) {
			wx.showToast({ title: msg, icon: 'none', duration: 2000 }); return;
		}
		if(data.length === 0){
			wx.showToast({
				title: msgList['no_trainlist_data'], icon: 'none', duration: 2000 }); return;
		}
		// 把数据存放到app的globalData中   
		app.globalData.trainResourceList = data;
		app.globalData.peOrderId = pe_order_id;
		wx.navigateTo({
			url: `/page/component/video/video?resource_id=${data[0]}`
		});
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