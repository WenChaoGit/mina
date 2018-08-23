var escape = require('escape.js');
var session = require('session.js');
import { Http } from '../utils/http';
const http = new Http();

const port = "https://omoapi.yuanxinkangfu.com/mina/user/api.html"; //接口地址
// const port = "https://omotest.yuanxinkangfu.com/mina/user/api.html"; //接口地址
// const port = "http://app.omo.com/mina/user/api.html?XDEBUG_SESSION_START=19193"; //接口地址
const success_code = 200; //接口返回成功code
const session_id_err = 1000; //session id不正确


const actionCode = {
  yzm: 10003, //验证码
  login: 10001, //注册登录
  updateUserInfo: 10002, //修改用户信息
  feedback: 10004, //用户反馈
  health: 10005, //健康档案
  oneHealth: 10006, //查看单个健康档案
  trainList: 10007, //训练列表
  oneTrain: 10008, //单个训练详情
  resourceDetail: 10009,//单个资源详情
  phoneNumber: 10010, //解密手机号
  sessionKey: 10011, //获取用户session_key
  orderFeedback: 10012, //对某次康复进行评价
  setUserinfo: 10013, //用户授权设置userinfo
  getResourceurl: 10014, //获取所有资源url
  updateUserTrainLog: 10015, //更新用户训练记录
}
/**
 * 接口地址
 */
function getPort() {
  return port;
}

function getSuccessCode() {
  return success_code;
}

/**
 * 解析返回结果
 */
function parseResult(result) {
  let code = -999;
  let msg = '异常错误！'
  let data = null;
  try {
    code = parseInt(result.data.head.code);
    msg = result.data.head.msg;
    data = result.data.data;
  } catch (e) {
    code = -999;
    msg = '异常错误！';
    data = null;
  }

  if (code === session_id_err) {
    // session_id或者uid不正确时跳转到登录页面
    session.logout();
    wx.reLaunch({
      url: '/page/component/login/index',
    })
  }
  return { code, msg, data };
}

/**
 * 接口数据初始化拼装，并返回json字符串
 */
function initData(act, data) {
  //{"head":{"action":"10000"},"data":{"mobile":"13581568689"}}
  let head = null;
  if (session.isLogin()) {
    let { id, mobile, session_id } = session.getUserInfo();
    head = { 'action': act, id, mobile, session_id };
  } else {
    head = { 'action': act };
  }
  let json = { head, data };
  console.log(JSON.stringify(json));
  return JSON.stringify(json);
}

/**
 * 测试中文编码
 */
function testCN(name) {
  let data = { 'name': escape.encode(name) };
  return initData(actionCode['yzm'], data);
}

/**
 * 获取用户session_key
 */
function getSessionKey(code) {
  let data = { code };
  return initData(actionCode['sessionKey'], data);
}

/**
 * 获取验证码
 */
function getYzm(mobile) {
  let data = { mobile };

  return initData(actionCode['yzm'], data);
}

/**
 * 用户登录
 * {'mobile':'18618423379','code':'密码/验证码/userinfo','t':1}
 * t->1微信绑定登录（微信获取手机号）
 * t->2手机号+验证码
 * t->3手机号+密码
 */
function getLogin(mobile, code, t) {
  let data = { mobile, code, t };
  return initData(actionCode['login'], data);
}

/**
 * 用户授权登录
 */
function getOauthLogin(userinfo) {
  let data = userinfo;
  return initData(actionCode['login'], data);
}

/**
 * 修改用户信息
 * gender：1男，2女
 */
function getUpdateUserInfo(id_card_no, gender, birthday, nickname) {
  let data = { id_card_no, gender, birthday, nickname };
  return initData(actionCode['updateUserInfo'], data);
}

/**
 * 初始化健康档案接口数据
 */
function getHealthInfo() {
  let data = {};
  return initData(actionCode['health'], data);
}

/**
 * 用户授权获取userinfo
 */
function setUserInfo(userinfo, mobile) {
  let data = { userinfo, mobile };
  return initData(action['setUserinfo'], data);
}

/**
 * 获取单个健康档案数据
 */
function getOneHealthInfo(pe_order_id) {
  let data = { pe_order_id };
  return initData(actionCode['oneHealth'], data);
}

/**
 * @action 10007
 * @desc 获取训练计划列表
 * @param {无需参数}
 * @return promise
 */
function getTrainListInfo() {
  http._showLoading()
  let action = actionCode['trainList']
  let result = http.request({ data: {}, action })
  http._hideLoading()
  return result
}

/**
 * @action 10012
 * @desc 对某次已完成的康复方案进行评价
 * @param {要评价的康复方案的id,评价的星星个数,评价的内容} 
 * @return object
 */
function setOderFeedback({pe_order_id, feedback_level, feedback_content}) {
  http._showLoading('评价中...');
  let data = { pe_order_id, feedback_level, feedback_content };//拼接参数
  let action = actionCode['orderFeedback']; //获取action值
  let result = http.request({ data, action });//调用http请求方法
  http._hideLoading()
  return result;
}

/**
 * 获取一个训练计划
 */
function getOneTrainInfo({ pe_order_id }) {
  http._showLoading();
  let action = actionCode['oneTrain'];
  let result = http.request({ data: { pe_order_id }, action });
  http._hideLoading()
  return result;
}

/**
 * 手机号授权 - 解密手机号
 */
function getPhoneNumber(data) {
  return initData(actionCode['phoneNumber'], data);
}

/**
 * 意见反馈
 */
function getFeedback(content, ids) {
  let data = { content, ids };
  return initData(actionCode['feedback'], data);
}
/**
 * @action 1009 
 * @desc 获取单个资源的url和描述,训练次数
 * @return promise
 */
function getResourceInfo(resource_id) {
  http._showLoading();
  let action = actionCode['resourceDetail'];
  let result = http.request({ data: { resource_id }, action });
  http._hideLoading()
  return result;
}

/**
 * @action 10014
 * @desc 点击开始训练
 * @param 
 */
function getResourceUrl({ trainlist, pe_order_id, user_id }) {
  http._showLoading();
  let data = { trainlist, pe_order_id, user_id };
  let action = actionCode['getResourceurl'];
  let result = http.request({ data, action });
  http._hideLoading();
  return result;
}

/**
 * @action 10015
 * @desc 更新训练记录
 * @param { 本次训练的资源id数组; 康复方案的id }
 * @return promise 
 */
function updateUserTrainLog({ trainResourceList, peOrderId }) {
  http._showLoading();
  let data = { trainResourceList, peOrderId };
  let action = actionCode['updateUserTrainLog'];
  let result = http.request({ data, action });
  http._hideLoading();
  return result;
}

module.exports = {
  parseResult,
  getSuccessCode,
  getPort,
  getYzm,
  getLogin,
  getUpdateUserInfo,
  getFeedback,
  getHealthInfo,
  getOneHealthInfo,
  getTrainListInfo,
  getOneTrainInfo,
  getResourceInfo,
  getOauthLogin,
  getPhoneNumber,
  getSessionKey,
  setOderFeedback,
  setUserInfo,
  //训练
  getResourceUrl,
  updateUserTrainLog,
}

