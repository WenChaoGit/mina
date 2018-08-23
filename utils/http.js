/**
 * @author yangwenchao
 * @date 2018-08-22
 */

const baseUrl = "https://omoapi.yuanxinkangfu.com/mina/user/api.html";//接口地址
const session = require('session.js');

const codeList = {
  successCode:200,
  sessionIdErr: 1000
};
class Http {
  request({ data, action = '',url='',method='POST',header={'content_type':'application/json'} }){
    return this._request(data,action,url,method,header)
  }

  _request(data,action,url,method,header){
    return new Promise( (resolve,reject)=>{
        wx.request({
          url: this._getPort(),
          method,
          header,
          data:this._reqData(action,data),
          success: result =>{
            console.log(result)
            if(String(result.statusCode).startsWith('2')){
              let code = parseInt(result.data.head.code) || -999;
              let msg = result.data.head.msg || '异常错误！';
              let data = data = result.data.data || null;
              if (code === codeList['sessionIdErr']) {
                // session_id或者uid不正确时跳转到登录页面
                session.logout();
                reject();
                wx.reLaunch({
                  url: '/page/component/login/index',
                })
              }
              resolve({ code, msg, data });
            }else{
              this._showToast('抱歉,服务器出现了一点小故障,请稍后再试');
              reject();
            }
            
          },
          fail: err => {
            this._showToast('抱歉,网络连接出现错误');
            reject();
          }
        })
    })
  }

  _getPort(){
    return baseUrl
  }

  // 拼接post请求参数
  _reqData(action,data){
    if(!action) return this._errHandler('缺少参数,action');
    let head = { action };
    if (session.isLogin()) {
      let { id, mobile, session_id } = session.getUserInfo();
      head = { action, id, mobile, session_id };
    }
    console.log(JSON.stringify({ head, data }));
    return JSON.stringify({ head, data });
  }

  // 显示提示信息
  _showToast(title){
    let toastTitle = title || '正在处理中..';
    wx.showToast({
      title:toastTitle,
      icon:'none',
      duration:2000
    })
  }
  _showLoading(title){
    let loadingTitle = title || '正在加载中';
    wx.showLoading({ title: loadingTitle});
  }
  _hideLoading(){
    return wx.hideLoading();
  }

  _errHandler(msg){
    wx.showToast({
      title:msg,
      icon:'none',
      duration:2000
    })
  }

}

export { Http }