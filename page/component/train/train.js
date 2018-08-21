const util = require('../../../utils/util.js');
const  api = require('../../../utils/api.js');
const session = require('../../../utils/session')
import { RESOURCE_TYPE_VIDEO } from '../../../utils/config'
import { Http } from "../../../utils/http";
let app = getApp();
const http = new Http()
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
    videoBtn(e) {
        let {type:resource_type,no} = e.currentTarget.dataset;
        if (resource_type == 0) {
            wx.showToast({
                title: '暂无关联资源',
                icon: 'none',
            });
        }  else if(resource_type == RESOURCE_TYPE_VIDEO){
            wx.navigateTo({
                url: `/page/component/video/video?resource_id=${no}`
            });
        }else {
            wx.showToast({
                title: '资源类型错误',
                icon: 'none',
            });
        }
    },
    onLoad: function(options) {
        let { pe_order_id } = options;
        this.setData({pe_order_id});
    },

    getOneTrain() {
        wx.showLoading({
            title: '操作中...',
        })
        wx.request({
            url: api.getPort(),
            data: api.getOneTrainInfo(this.data.pe_order_id),
            method: 'post',
            success:result => {
                let d = api.parseResult(result);
                if (d.code == api.getSuccessCode()) {
                    let {trainlist,level,pe_result} = d.data;
                    this.setData({ trainlist, level, pe_result });
                } else {
                    wx.showToast({
                        title: d.msg,
                        icon: 'none',
                    })
                }
            },
            fail: function({ errMsg }) {
                wx.showToast({
                    title: '网络连接错误！',
                    icon: 'none',
                })
            },
            complete: function() {
                wx.hideLoading()
            }
        });
    },

    startTrain(){
        let { trainlist,pe_order_id } = this.data;
        let {id:user_id} = session.getUserInfo(); 
        wx.showLoading({title: '正在加载...'});
        wx.request({
            url: api.getPort(),
            data: api.getResourceUrl(trainlist, pe_order_id,user_id),
            method: 'post',
            success: result => {
                let { code,msg,data } = api.parseResult(result);
                if (code == api.getSuccessCode()) {
                   // 把请求的资源列表放到全局对象 gloalData中,这样可以在video页面使用
                    app.globalData.train_video_list = data;
                } else {
                    wx.showToast({
                        title: msg,
                        icon: 'none',
                    })
                }
                
            },
            fail: function({ errMsg }) {
                wx.showToast({
                    title: '网络连接错误！',
                    icon: 'none',
                })
            },
            complete: function() {
                wx.hideLoading()
            }
        });
    
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        this.getOneTrain();
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})