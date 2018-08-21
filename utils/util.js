const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//获取当前时间，格式YYYY-MM-DD
function getNowFormatDate() {
  var date = new Date();
  var seperator1 = "-";
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate;
  return currentdate;
}

function ismobile(mobile) {
  var reg = /^1[\d]{10}$/;
  return reg.test(mobile);
}

function checkpwd(pwd) {
  var reg = /^[0-9a-zA-Z_]{6,18}$/;
  return reg.test(pwd);
}

function empty(key) {
  if (key == null || key == '' || key == 'null' || key.length == 0) {
    return true
  } else {
    return false
  }
}



module.exports = {
  formatTime: formatTime,
  getNowFormatDate: getNowFormatDate,
  empty: empty,
  ismobile: ismobile,
  checkpwd: checkpwd
}
