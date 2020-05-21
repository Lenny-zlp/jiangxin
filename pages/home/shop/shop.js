

import {
  baseRequest
} from '../../until/baseRequest.js';
var base = new baseRequest();
import {
  time
} from '../../until/time.js';
var _time = new time();
var href = require('../../until/click.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentPage: 0,
    sure: true,
    scrollTop: 0,
    code: 467,
    buttonClicked: false,
    page: []
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
 
  onReady: function() {
    wx.setNavigationBarTitle({
      title: '匠心小镇',
    })
  },
  onHide: function() {
    wx.hideLoading()
  },
  onShow: function() {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0,
        cartnum: wx.getStorageSync('cartnum')
      })
    }
   
    if (this.data.page.length == 0) {
      this._homeload()
    } else {
      if (this.data.code == 467) {
        this._homeload()
      } else {
        this.getPageContent(this.data.code)
      }
    }
    var windowRule = wx.getSystemInfoSync();
    var screenW = windowRule.windowWidth;
    var windowH = windowRule.windowHeight;
    var rpxR = 750 / screenW
    this.setData({
      height: windowH * rpxR - 280
    })
  },
  onHide: function() {
    wx.hideLoading()
    clearInterval(this.data.setTime)
  },
  _homeload: function() {
    var id = {
      url: "/shop/page?appversion=3",
      type: 'POST',
      data: {
        source: 1
      },
      _fcallback: this._fcallback
    }
    base._request(id, this._callback)
  },

  _fcallback: function() {
    wx.hideLoading()
    this.setData({
      loading: false
    })
  },

  _callback: function(res) {
   
   
    wx.hideLoading()
    //重置导航数据
    var menu = [{
      Code: 467,
      PageName: '首页',
      currentIndex: 0
    }]
    var content = []
    res.data.filter(function(v) {
      if (v.ModuleType == 10) {
        for (var i = 0; i < v.Module.length; i++) {
          var temp = {
            Code: v.Module[i].Code,
            PageName: v.Module[i].PageName,
            currentIndex: i + 1
          }
          menu.push(temp)
        }
      } else {
        content.push(v)
      }
    });
    var that=this
    content.map((v,i)=>{
      if (v.ModuleType == 11) {
          var secondAllTime = v.Module[0].Product.xsg_totalsecond;
          if (secondAllTime > 0) {
            clearInterval(that.data.setTime);
            _time.initinterval(that, secondAllTime);
            that.interval(that, secondAllTime);
          }
      } else if (v.ModuleType ==14){
        var hotview = null
        var hotlist=null
        if (v.Module[0].HotView != '') {       
          hotview = JSON.parse(v.Module[0].HotView);
        } 

        if (hotview.length > 0) {
            hotlist = hotview.map((m,i) => {
            let arr = [],
              arrsku = [],
              arrtype = [],
              temp, sku;
            if (m.Code.indexOf('|') > 0) {
              sku = m.Code.split('|')
            }               
            for (var i = 0; i < m.Coords.split('|').length; i++) {
              temp = m.Coords.split('|')[i].split(',');
              var position = {
                left: Math.round(temp[0] * 100),
                top: Math.round(temp[1] * 100),
                width: Math.round(temp[2] * 100),
                height: Math.round(temp[3] * 100)
              }
              arr.push(position);
              arrsku.push(m.Code.split('|')[i]);
              arrtype.push(m.LinkTypes.split('|')[i]);
            }
            m.coordsArrow = arr;
            m.skuArrow = arrsku;
            m.typeArrow = arrtype;
            return m;                           
          });
        }
        v.hotview = hotlist
      }
    })
    //重置首页page数据
    let page = menu.map((v, i) => {
      if (v.Code == 467) {
        v.content = content
      } else {
        v.content = []
      }
      return v
    })
    this.setData({
      menu: menu,
      page: page
    })
    
  },
  //调取倒计时函数
  interval: function(that, num) {
    that.data.setTime = setInterval(function() {
      num--;
      _time.initinterval(that, num);
      if (num < 0) {
        that.onShow()
      }
    }.bind(this), 1000);
  },
  onclickTab: function(e) {
    wx.hideLoading()
    this.setData({
      currentPage: e.target.dataset.cur,
      code: e.target.dataset.code
    })
  },
  //滑动页面更换频道页数据
  onchange: function(event) {

    var index = event.detail.current,
      that = this
    var code = this.data.page[index].Code;

    if (code == 467) {
      wx.showLoading({
        title: "加载中..."
      })
      this._homeload()
    } else {
      wx.showLoading({
        title: "加载中..."
      })
      this.getPageContent(code)
    }
    this.setData({
      code: code
    })
  },
  swipertop: function(event) {
    var index = event.detail.current,
      that = this
    if (event.detail.source == 'touch') {
      this.setData({
        currentPage: index,
        scrollTop: 0
      })
    }
  },
  getPageContent: function(code) {
    this.setData({
      sure: false
    })
    var id = {
      url: "/shop/topic",
      type: 'POST',
      data: {
        id: code
      }
    }
    base._request(id, this.pagecallback);
  },
  pagecallback(res) {
    console.log(res)
    wx.hideLoading()
    var that = this
    var page = this.data.page.filter(function(v) {
      if (v.Code == that.data.code) {
        v.content = res.data
      }
      return v
    })
    this.setData({
      page: page,
      sure: true
    })
  },
  // 点击获取当前元素的sku，跳转到对应详情页
  tapHref: function(event) {
    var code = event.currentTarget.dataset.code;
    var link = event.currentTarget.dataset.link;
    var linktype = event.currentTarget.dataset.linktype;
    if (!this.data.buttonClicked) {
      base.buttonClicked(this)
      if (this.data.buttonClicked) {
        if (linktype == 1) {
          href.href('/pages/product/product?sku=' + event.currentTarget.dataset.sku + "&groupid=-1&grouplogid=0");
        } else if (linktype == 5) {
          href.href('/pages/product/webView/webView?url=' + link);
        }
      }
    }

  },
  //点击跳转到倒计时列表页
  toPurchase: function() {
    if (!this.data.buttonClicked) {
      base.buttonClicked(this)
      if (this.data.buttonClicked) {
        href.href('/pages/purchase/purchase')
      }
    }

  },
  //点击跳转到拼团列表页
  toCollage: function() {
    if (!this.data.buttonClicked) {
      base.buttonClicked(this)
      if (this.data.buttonClicked) {
        console.log('第一次')
        href.href('/pages/collage/collage')
      }
    }

  },
  onShoptop: function(e) {
    if (!this.data.buttonClicked) {
      base.buttonClicked(this)
      if (this.data.buttonClicked) {
        if (e.target.dataset.link != undefined) {
          href.href('/pages/shopTop/shopTop?id=' + e.target.dataset.link + '&title=' + e.target.dataset.title)
        }
      }
    }

  }
})