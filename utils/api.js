var escape = require('escape.js');
var session = require('session.js');

const port = "https://omoapi.yuanxinkangfu.com/mina/user/api.html"; //接口地址
// const port = "https://omotest.yuanxinkangfu.com/mina/user/api.html"; //接口地址
const success_code            = 200; //接口返回成功code
const session_id_err          = 1000; //session id不正确
const action_test             = '10000'; //测试接口
const action_yzm              = '10003'; //验证码
const action_login            = '10001'; //注册登录
const action_update_user_info = '10002'; //修改用户信息
const action_feedback         = '10004'; //用户反馈
const action_health           = '10005'; //健康档案
const action_one_health       = '10006'; //查看单个健康档案
const action_train_list       = '10007'; //训练列表
const action_one_train        = '10008'; //单个训练详情
const action_one_resource     = '10009'; //单个资源详情
const action_phone_number     = '10010'; //解密手机号
const action_session_key      = '10011'; //获取用户session_key
const action_order_feedback   = '10012'; //对某次康复进行评价
const action_set_userinfo   = '10013'; //用户授权设置userinfo
const action_get_resourceurl   = '10014'; //获取所有资源url


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
  console.log(result);
  let code = -999;
  let msg = '异常错误！'
  let data = null;
  try {
    code = parseInt(result.data.head.code);
    msg = result.data.head.msg;
    data = result.data.data;
  } catch (e) {
    console.log(e)
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
  return { code,msg,data };
}

/**
 * 接口数据初始化拼装，并返回json字符串
 */
function initData(act, data) {
  //{"head":{"action":"10000"},"data":{"mobile":"13581568689"}}
  let head = null;
  if (session.isLogin()) {
    let { id,mobile,session_id } = session.getUserInfo();
    head = { 'action': act, id, mobile, session_id};
  } else {
    head ={ 'action': act };
  }
  let json = {head,data};
  console.log(JSON.stringify(json));
  return JSON.stringify(json);
}

/**
 * 测试中文编码
 */
function testCN(name) {
  let data = { 'name': escape.encode(name) };
  return initData(action_yzm, data);
}

/**
 * 获取用户session_key
 */
function getSessionKey(code) {
  let data = { 'code': code };
  return initData(action_session_key, data);
}

/**
 * 获取验证码
 */
function getYzm(mobile) {
  let data = {'mobile': mobile};

  return initData(action_yzm, data);
}

/**
 * 用户登录
 * {'mobile':'18618423379','code':'密码/验证码/userinfo','t':1}
 * t->1微信绑定登录（微信获取手机号）
 * t->2手机号+验证码
 * t->3手机号+密码
 */
function getLogin(mobile, code, t) {
  let data = { mobile,code,t};
  return initData(action_login, data);
}

/**
 * 用户授权登录
 */
function getOauthLogin(userinfo) {
  let data = userinfo;
  return initData(action_login, data);
}

/**
 * 修改用户信息
 * gender：1男，2女
 */
function getUpdateUserInfo(id_card_no, gender, birthday, nickname) {
  let data = {
    id_card_no,
    gender,
    birthday,
    nickname
  };
  
  return initData(action_update_user_info, data);
}

/**
 * 初始化健康档案接口数据
 */
function getHealthInfo() {
  let data = {
    
  };
  return initData(action_health, data);
}

/**
 * 用户授权获取userinfo
 */
function setUserInfo(userinfo,mobile) {
  let data ={
    'userinfo' : userinfo,
    'mobile' : mobile,
  };
  return initData(action_set_userinfo, data);
}

/**
 * 获取单个健康档案数据
 */
function getOneHealthInfo(pe_order_id) {
  let data = {
    'pe_order_id' : pe_order_id,
  };
  return initData(action_one_health, data);
}

/**
 * 获取训练计划列表
 */
function getTrainListInfo() {
  let data = {
    
  };
  return initData(action_train_list, data);
}

/**
 * 对某次康复评价
 */
function setOderFeedback(pe_order_id) {
  return initData(action_order_feedback, pe_order_id);
}

/**
 * 获取一个训练计划
 */
function getOneTrainInfo(pe_order_id) {
  let data = {
    'pe_order_id' : pe_order_id,
  };
  return initData(action_one_train, data);
}

/**
 * 点击开始训练获取所有视频url并判断当天是否已经点击过一次
 */
function getResourceUrl(trainlist,pe_order_id,user_id) {
  let data = {trainlist, pe_order_id,user_id};
  return initData(action_get_resourceurl, data);
}

/**
 * 手机号授权 - 解密手机号
 */
function getPhoneNumber(data) {
  return initData(action_phone_number, data);
}

/**
 * 获取某资源
 */
function getResourceInfo(resource_id) {
  let data = {
    'resource_id' : resource_id,
  };
  return initData(action_one_resource, data);
}

/**
 * 意见反馈
 */
function getFeedback(content, ids) {
  let data = {
    'content': content,
    'ids': ids
  };

  return initData(action_feedback, data);
}




module.exports = {
  parseResult      : parseResult,
  getSuccessCode   : getSuccessCode,
  getPort          : getPort,
  getYzm           : getYzm,
  getLogin         : getLogin,
  getUpdateUserInfo: getUpdateUserInfo,
  getFeedback      : getFeedback,
  getHealthInfo    : getHealthInfo,
  getOneHealthInfo : getOneHealthInfo ,
  getTrainListInfo : getTrainListInfo ,
  getOneTrainInfo  : getOneTrainInfo ,
  getResourceInfo  : getResourceInfo ,
  getOauthLogin    : getOauthLogin ,
  getPhoneNumber   : getPhoneNumber ,
  getSessionKey    : getSessionKey ,
  setOderFeedback  : setOderFeedback ,
  setUserInfo      : setUserInfo ,
  getResourceUrl   : getResourceUrl ,
}

