const userinfo_key = '__userinfo__';
function saveUserInfo(userinfo) {
  wx.setStorageSync(userinfo_key, userinfo);
}

function getUserInfo() {
  return wx.getStorageSync(userinfo_key);
}

function isLogin() {
  if(this.getUserInfo() === '') {
    return false;
  } else {
    return true;
  }
}

function logout() {
  return wx.removeStorageSync(userinfo_key);
}

module.exports = {
  saveUserInfo:     saveUserInfo,
  getUserInfo:      getUserInfo,
  isLogin:          isLogin,
  logout:           logout,
}


