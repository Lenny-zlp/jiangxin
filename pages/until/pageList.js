import {
  time
} from 'time.js';
var _time = new time();

function home(that, res) {
  //整理异步获取的接口，检索需要的数据
  var homeCont = []; //声明一个首页数据的存储变量
  var slides = []; //遍历到模块类型为导航的数据
  var tabs = [{
    PageName: "首页",
    Code: "467",
    currentIndex: 0
  }] //声明一个导航的数组变量

  for (var index in res) {
    var i = res[index];

    var type = i.ModuleType;
    // 单独提出导航数据
    if (type == 10) {
      slides.push(i.Module)
    } else {
      homeCont.push(i);
    }
    // 单独提出新横版和竖版的按钮色，背景色，文字颜色
    if (type == 18) {
      var btn = {
        ButtonColor: i.ButtonColor,
        ButtonFontColor: i.ButtonFontColor,
        PriceColor: i.PriceColor
      }
      that.setData({
        vertical: btn
      })
    } else if (type == 19) {
      var hor = {
        ButtonColor: i.ButtonColor,
        ButtonFontColor: i.ButtonFontColor,
        PriceColor: i.PriceColor
      }
      that.setData({
        horiz: hor
      })
    } else if (type == 11) {
      var secondAllTime = i.Module[0].Product.xsg_totalsecond;
      if (secondAllTime > 0) {
        clearInterval(that.data.setTime);
        _time.initinterval(that, secondAllTime);
        that.interval(that, secondAllTime);
      }
    } else if (type == 14) {
     
      if (i.Module[0].HotView != '') {
        
        var hotview = ''
        try {
          hotview = JSON.parse(i.Module[0].HotView);
         
        } catch (e) {

        } finally {

        }
        if (hotview.length > 0) {
          let hotlist = hotview.map((v, i) => {
            let arr = [],
              arrsku = [],
              arrtype = [],
              temp, sku;
            if (v.Code.indexOf('|') > 0) {
              sku = v.Code.split('|')
            }
            //if (v.Coords.indexOf('|') > 0) {
            for (var i = 0; i < v.Coords.split('|').length; i++) {
              temp = v.Coords.split('|')[i].split(',');
              var position = {
                left: Math.round(temp[0] * 100),
                top: Math.round(temp[1] * 100),
                width: Math.round(temp[2] * 100),
                height: Math.round(temp[3] * 100)
              }
              arr.push(position);
              arrsku.push(v.Code.split('|')[i]);
              arrtype.push(v.LinkTypes.split('|')[i]);
            }
            v.coordsArrow = arr;
            v.skuArrow = arrsku;
            v.typeArrow = arrtype;

            return v;
          });
          that.setData({
            hotview: hotlist
          })
        }
      }
    }
  }

  for (var i in slides[0]) {
    var text = slides[0][i];
    var temp = {
      "PageName": text.PageName,
      "Code": text.Code,
      "currentIndex": i * 1 + 1
    }
    tabs.push(temp)
  }
  that.setData({
    menu: tabs,
    content: homeCont
  })
};
//动态获取屏幕的高度
function windowH(that, num) {
  var windowRule = wx.getSystemInfoSync();
  var screenW = windowRule.windowWidth;
  var windowH = windowRule.windowHeight;
  var rpxR = 750 / screenW
  that.setData({
    height: windowH * rpxR - num
  });
};

function pageList(that, res) {
  that.setData({
    pageContent: res
  })
}
module.exports = {
  home: home,
  pageList: pageList,
  windowH: windowH
}