const baseUrl = "https://omotest.yuanxinkangfu.com/mina/user/api.html";//接口地址


const code = {
  successCode:200,
  sessionIdErr: 1000
};
class Http {
  request({data,url='',action='',method='POST',header={'content_type':'application/json'} }){
    this._request(data,url,action,method,header)
  }

  _request(data,url,action,method,header){
    return new Promise( (resolve,reject)=>{
        wx.request({
          url: this._getPort(),
          method,
          header,
          data:this._reqData(action,data),
          success: res =>{
            let { data,header,statusCode,errMsg } = res;
            if(String(statusCode).startsWith('2')){
              //成功         
              resolve(res);
            }else{
              reject()
              this._showToast('抱歉,出现了一个错误');
            }
          },
          fail: err => {
            reject(err)
          },
          complete:()=>{
            this._hideLoading();
          }

        })
    })
  }

  _getPort(){
    return baseUrl
  }

  _reqData(action,data){
    if(!action) return this._errHandler({msg:'缺少参数,action'})
    let head = { action };
    if (session.isLogin()) {
      let { id, mobile, session_id } = session.getUserInfo();
      head = { action, id, mobile, session_id };
    }
    return JSON.stringify({ head, data });
  }

  _showToast(title){
    return wx.showToast({
      title,
      icon:'none',
      duration:2000
    })
  }

  _hideLoading(){
    return wx.hideLoading();
  }

  _parseResult(){
   
  }


}

export { Http }