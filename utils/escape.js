/**
 * 对提交接口的中文、特殊字符escape编码、escape解码函数
 */
function encode (str) {
  var res = [];
  for (var i = 0; i < str.length; i++)
    res[i] = ("00" + str.charCodeAt(i).toString(16)).slice(-4);
  return "\\u" + res.join("\\u");
}

function decode (str) {
  str = str.replace(/\\/g, "%");
  return unescape(str);
}

module.exports = {
  encode: encode,
  decode: decode
}