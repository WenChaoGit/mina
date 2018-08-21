// 身份证处理相关js库

function GetVerifyBit(id) {
  var result;
  var nNum = eval(id.charAt(0) * 7 + id.charAt(1) * 9 + id.charAt(2) * 10 + id.charAt(3) * 5 + id.charAt(4) * 8 + id.charAt(5) * 4 + id.charAt(6) * 2 + id.charAt(7) * 1 + id.charAt(8) * 6 + id.charAt(9) * 3 + id.charAt(10) * 7 + id.charAt(11) * 9 + id.charAt(12) * 10 + id.charAt(13) * 5 + id.charAt(14) * 8 + id.charAt(15) * 4 + id.charAt(16) * 2);
  nNum = nNum % 11;
  switch (nNum) {
    case 0:
      result = "1";
      break;
    case 1:
      result = "0";
      break;
    case 2:
      result = "X";
      break;
    case 3:
      result = "9";
      break;
    case 4:
      result = "8";
      break;
    case 5:
      result = "7";
      break;
    case 6:
      result = "6";
      break;
    case 7:
      result = "5";
      break;
    case 8:
      result = "4";
      break;
    case 9:
      result = "3";
      break;
    case 10:
      result = "2";
      break;
  }
  //document.write(result);
  return result;
}

function validateIdCard(obj) {
  var aCity = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙 江", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖 北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西 藏", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国 外" };
  var iSum = 0;
  //var info = "";
  var strIDno = obj;
  var idCardLength = strIDno.length;
  if (!/^\d{17}(\d|x)$/i.test(strIDno) && !/^\d{15}$/i.test(strIDno))
    return 1; //非法身份证号

  if (aCity[parseInt(strIDno.substr(0, 2))] == null)
    return 2;// 非法地区

  // 15位身份证转换为18位
  if (idCardLength == 15) {
    var sBirthday = "19" + strIDno.substr(6, 2) + "-" + Number(strIDno.substr(8, 2)) + "-" + Number(strIDno.substr(10, 2));
    var d = new Date(sBirthday.replace(/-/g, "/"))
    var dd = d.getFullYear().toString() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    if (sBirthday != dd)
      return 3; //非法生日
    strIDno = strIDno.substring(0, 6) + "19" + strIDno.substring(6, 15);
    strIDno = strIDno + GetVerifyBit(strIDno);
  }

  // 判断是否大于2078年，小于1900年
  var year = strIDno.substring(6, 10);
  if (year < 1900 || year > 2078)
    return 3;//非法生日

  //18位身份证处理

  //在后面的运算中x相当于数字10,所以转换成a
  strIDno = strIDno.replace(/x$/i, "a");

  sBirthday = strIDno.substr(6, 4) + "-" + Number(strIDno.substr(10, 2)) + "-" + Number(strIDno.substr(12, 2));
  var d = new Date(sBirthday.replace(/-/g, "/"))
  if (sBirthday != (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()))
    return 3; //非法生日
  // 身份证编码规范验证
  for (var i = 17; i >= 0; i--)
    iSum += (Math.pow(2, i) % 11) * parseInt(strIDno.charAt(17 - i), 11);
  if (iSum % 11 != 1)
    return 1;// 非法身份证号

  //判断是否屏蔽身份证
  var words = new Array();
  words = new Array("11111119111111111", "12121219121212121");

  for (var k = 0; k < words.length; k++) {
    if (strIDno.indexOf(words[k]) != -1) {
      return 1;
    }
  }

  return 0;
}

function getAreaInCard(val) {
  var aCity = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙 江", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖 北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西 藏", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国 外" };
  var strIDno = val;
  if (!/^\d{17}(\d|x)$/i.test(strIDno) && !/^\d{15}$/i.test(strIDno))
    return ""; //非法身份证号
  return aCity[parseInt(strIDno.substr(0, 2))];
}

function getSixInCard(val) {
  var six = 1;
  if (15 == val.length) { //15位身份证号码 
    if (parseInt(val.charAt(14) / 2) * 2 != val.charAt(14))
      six = 1;//男
    else
      six = 0;//女
  }
  if (18 == val.length) { //18位身份证号码 
    if (parseInt(val.charAt(16) / 2) * 2 != val.charAt(16))
      six = 1;//男
    else
      six = 0;//女
  }

  return six;
}

function getBirthdayInCard(val) {
  var birthdayValue;
  if (15 == val.length) { //15位身份证号码 
    birthdayValue = val.charAt(6) + val.charAt(7);
    if (parseInt(birthdayValue) < 10) {
      birthdayValue = '20' + birthdayValue;
    }
    else {
      birthdayValue = '19' + birthdayValue;
    }
    birthdayValue = birthdayValue + '-' + val.charAt(8) + val.charAt(9) + '-' + val.charAt(10) + val.charAt(11);
  }
  else if (18 == val.length) { //18位身份证号码 
    birthdayValue = val.charAt(6) + val.charAt(7) + val.charAt(8) + val.charAt(9) + '-' + val.charAt(10) + val.charAt(11) + '-' + val.charAt(12) + val.charAt(13);
  }

  return birthdayValue;
}


module.exports = {
  validateIdCard:       validateIdCard,
  getAreaInCard:        getAreaInCard,
  getSixInCard:         getSixInCard,
  getBirthdayInCard:    getBirthdayInCard,
}
