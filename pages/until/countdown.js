/**
 * countdown:倒计时秒数
 * dataname：绑定的数据的key值
 * tid:定时器id，如果一个页面有多个定时器的话，id不能相同，建议以dataname命名
 */
function setTime(that, countdown, dataname, tid) {
  clearInterval(tid);
  //初始化，如果不初始化的话，倒计时会在一秒后才出现
  setCountDown(that, countdown, dataname);
  tid = setInterval(function() {
    if (countdown < 0) {
      clearInterval(tid);
    }
    countdown--;
    setCountDown(that, countdown, dataname);
  }.bind(this), 1000);
  return tid;
}

/**
 * 格式化秒数，并将格式化后的结果放到key为【dataname】的data中
 */
function setCountDown(that, countdown, dataname) {
  if (countdown > 0) {
    let formatTime = getFormat(countdown);
    that.setData({
      [dataname]: formatTime
    });
  } else {
    that.setData({
      [dataname]: {
        none: true,
        ss: '00',
        mm: '00',
        hh: '00',
        dd: '00'
      }
    });
  }
}

/**
 * 格式化时间
 * msec：秒数
 */
function getFormat(msec) {
  //none为true的时候可以进行一些操作，比如隐藏倒计时或者刷新页面等
  let none = msec <= 0;
  let ss = parseInt(msec);
  let mm = 0;
  let hh = 0;
  let dd = 0;
  if (ss > 60) {
    mm = parseInt(ss / 60);
    ss = parseInt(ss % 60);
    if (mm > 60) {
      hh = parseInt(mm / 60);
      mm = parseInt(mm % 60);
      if (hh > 24) {
        dd = parseInt(hh / 24);
        hh = parseInt(hh % 24);
      }
    }
  }
  ss = ss > 9 ? ss : `0${ss}`;
  mm = mm > 9 ? mm : `0${mm}`;
  hh = hh > 9 ? hh : `0${hh}`;
  dd = dd > 9 ? dd : `0${dd}`;
  return {
    none: none,
    ss,
    mm,
    hh,
    dd
  };
}

module.exports = {
  setTime: setTime
}