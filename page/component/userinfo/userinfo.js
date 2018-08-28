var util = require('../../../utils/util.js');
var api = require('../../../utils/api.js');
var session = require('../../../utils/session.js');
var idCard = require('../../../utils/idCard.js');

var userinfo = session.getUserInfo();

Page({
  data: {
    idCard: '',
    nickname: '',
    gender: '',
    genderId: 1,
    date: '',
    nowDate: util.getNowFormatDate(),
    selectsex: false,
    haveIdCard:false,
    sex: [{ 'name': '男', 'id': 1 }, { 'name': '女', 'id': 2 }],
  },
  initData: function () {
    userinfo = session.getUserInfo();
    this.setData({
      idCard: userinfo.id_card_no,
      nickname: userinfo.nickname,
      gender: userinfo.gender == 2 ? '女' : '男',
      genderId: userinfo.gender == 2 ? 2 : 1,
      date: util.empty(userinfo.birthday) ? '　' : userinfo.birthday,
    })
  },
  onShow: function () {
    this.initData();
  },
  saveBtn: function () {
    var that = this;
    //idCard.validateIdCard(that.data.idCard)
    if (!util.empty(that.data.idCard) && idCard.validateIdCard(that.data.idCard) != 0) {
      // 身份证号不为空时要校验合法性
      wx.showToast({
        title: '身份证号不合法！',
        icon: 'none',
      }); return;
    }else{
      this.setData({haveIdCard:true});
    }
    if(!that.data.haveIdCard){
      if (that.data.date.length != 10) {
        wx.showToast({
          title: '出生日期不能为空！',
          icon: 'none',
        }); return;
      }
    } 
    if (util.empty(that.data.nickname)) {
      wx.showToast({
        title: '昵称不能为空！',
        icon: 'none',
      }); return;
    }

    wx.showLoading({
      title: '保存用户信息...',
    })
    wx.request({
      url: api.getPort(),
      data: api.getUpdateUserInfo(that.data.idCard, that.data.genderId, that.data.date == '　' ? '' : that.data.date, that.data.nickname),
      method: 'post',
      success: function (result) {
        let d = api.parseResult(result);
        if (d.code == api.getSuccessCode()) {
          session.saveUserInfo(d.data);
          wx.navigateBack();
          wx.showToast({
            title: '编辑成功！',
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
        wx.showToast({
          title: '网络连接错误！',
          icon: 'none',
        })
      },
      complete: function () {
        wx.hideLoading()
      }
    })

  },
  idCardInput: function (e) {
    this.setData({
      idCard: e.detail.value
    })
  },
  nicknameInput: function (e) {
    this.setData({
      nickname: e.detail.value
    })
  },
  handleOpen() {
    this.setData({
      selectsex: true,
    });
  },
  handleCancel() {
    this.setData({
      selectsex: false
    });
  },
  handleClickItem({ detail }) {
    const index = detail.index;
    this.setData({
      gender: this.data.sex[index].name,
      genderId: this.data.sex[index].id,
      selectsex: false
    });
  },
  bindPickerChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
})

