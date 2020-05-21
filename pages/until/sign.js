var md5 = require('md5.js');

function getSign(parms) {
  var dataJson = "";
  if (parms.data == undefined) {
    var sign = md5.md5("key=JiBaoAppKey");
    dataJson = {
      sign: sign
    };
  } else {
    var arry = [];
    var arry2 = [];
    var param = parms.data;
    var i = 0;
    for (var key in param) {
      if (key != "key") {
        if (param[key] && JSON.stringify(param[key]).indexOf("{") > 0) {
          arry.push(key.toLowerCase() + "=" + param[key] + "&");
          arry2.push("\"" + key.toLowerCase() + "\":" + JSON.stringify(param[key]));
        } else {
          arry.push(key.toLowerCase() + "=" + param[key] + "&");
          arry2.push("\"" + key.toLowerCase() + "\":\"" + param[key] + "\"");
        }
      }
      i++;
    }
    arry.push("wxsource=1");
    arry2.push("\"wxsource\":\"1\"");
    arry2 = arry2.sort();
    var arryToString = arry.sort().toString();
    arryToString = arryToString.replace(/\&,/gi, "&");
    arryToString += "&key=JiBaoAppKey";
    var sign = md5.md5(arryToString);
    dataJson = JSON.parse("{" + arry2.toString() + "}".replace("}", ",\"sign\":\"" + sign + "\"}"));

  }
  return dataJson;
}
module.exports = {
  getSign: getSign
}