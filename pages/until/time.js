class time {
  constructor() {

  };
  initinterval(that, num) {
    if (num > -1) {
      //获取后台返回的截止时间的秒数，计算出，小时分秒的显示
      var second = num;
      // 天数位  
      var day = Math.floor(second / 3600 / 24);
      var dayStr = day.toString();
      if (dayStr.length == 1) dayStr = '0' + dayStr;
      // 小时位  
      var hr = Math.floor((second - day * 3600 * 24) / 3600);
      var hrStr = hr.toString();
      if (hrStr.length == 1) hrStr = '0' + hrStr;
      // 分钟位  
      var min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
      var minStr = min.toString();
      if (minStr.length == 1) minStr = '0' + minStr;
      // 秒位  
      var sec = second - day * 3600 * 24 - hr * 3600 - min * 60;
      var secStr = sec.toString();
      if (secStr.length == 1) secStr = '0' + secStr;
      var lastTime = {
        d: dayStr,
        h: hrStr,
        s: minStr,
        m: secStr
      };
      
      that.setData({
        saleTime: lastTime
      })
    };
  }
  initintervaltext(that, num) {
    if (num > -1) {
      //获取后台返回的截止时间的秒数，计算出，小时分秒的显示
      var second = num;
      // 天数位  
      var day = Math.floor(second / 3600 / 24);
      var dayStr = day.toString();
      if (dayStr.length == 1) dayStr = '0' + dayStr;
      // 小时位  
      var hr = Math.floor((second - day * 3600 * 24) / 3600);
      var hrStr = hr.toString();
      if (hrStr.length == 1) hrStr = '0' + hrStr;
      // 分钟位  
      var min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
      var minStr = min.toString();
      if (minStr.length == 1) minStr = '0' + minStr;
      // 秒位  
      var sec = second - day * 3600 * 24 - hr * 3600 - min * 60;
      var secStr = sec.toString();
      if (secStr.length == 1) secStr = '0' + secStr;
      var lastTime = {
        d: dayStr,
        h: hrStr,
        s: minStr,
        m: secStr
      };
      var saleTime = ""
      if (lastTime.d > 0) {
        saleTime = lastTime.d + ' 天 ' + lastTime.h + ' : ' + lastTime.s + ' : ' + lastTime.m
      } else {
        saleTime = lastTime.h + ' : ' + lastTime.s + ' : ' + lastTime.m
      }
      that.setData({
        saleTime: saleTime
      })
    }
  }
}
export {
  time
}