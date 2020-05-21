import {
  purchase
} from 'purchase-model.js';
var _purchase = new purchase();
import {
  time
} from '../until/time.js';
import {
  baseRequest
} from '../until/baseRequest.js';
var _baseRequest = new baseRequest();
var _time = new time();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '1',
    count: null,
    setTime: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var user = wx.getStorageSync('user')
    if (!user || user.mobile == '' || user.mobile == 'undefined' || user.rsShopId == 'undefined' || user.rsShopId == '') {
      wx.hideShareMenu()
    }
  },
  onShow: function() {
    _purchase.getListData(this.data.type, this._callBack);
    var user = wx.getStorageSync('user')
    if (!user || user.mobile == '' || user.mobile == 'undefined' || user.rsShopId == 'undefined' || user.rsShopId == '') {
      wx.hideShareMenu()
    } else {
      wx.showShareMenu()
    }
  },
  _callBack: function(res) {
    var pur = [],
      count = []
    for (var ind in res.pruchaseList) {
      var i = res.pruchaseList[ind],
        style = i.Style.split(',')

      var temp = {
        pruchaseList: i,
        style: style
      }
      pur.push(temp)
    }
    for (var j in res.purchase) {
      var CountDown = res.purchase[j].CountDown,
        State = res.purchase[j].State
      var c = {
        CountDown: CountDown,
        State: State
      }
      count.push(c)
    }
    var resLength = res.purchase? res.purchase.length:null
    if (resLength < 0) {
      resLength = 0
    }

    this.setData({
      content: res,
      tabW: resLength,
      list: pur,
      count: count.length>0?count[this.data.type - 1].CountDown:'0',
      state: count.length>0? count[this.data.type - 1].State:'0'
    })

    clearInterval(this.data.setTime);
    _time.initinterval(this, this.data.count);
    this.interval(this, this.data.count);
  },

  onReady: function() {
    wx.setNavigationBarTitle({
      title: '小镇限时购'
    })
  },
  tapHref: function(event) {
    var sku = event.currentTarget.dataset.sku;
    wx.navigateTo({
      url: '/pages/product/product?sku=' + sku + '&groupid=0&grouplogid=-1'
    })
  },
  onShareAppMessage: function(res) {
    var luser = _baseRequest._getUser();
    if (luser)
      return {
        title: this.data.content.title,
        desc: this.data.content.content,
        imageUrl: this.data.content.shareImg,
        path: '/pages/purchase/purchase?type=1&shopid=' + luser.rsShopId
      }

  },
  interval: function(that, num) {
    that.data.setTime = setInterval(function() {
      num--;
      _time.initinterval(that, num);
      if (num < -1) {
        that.onShow()
      }
    }.bind(this), 1000);

  },
  onHide: function() {
    clearInterval(this.data.setTime)
  },
  onTab: function(event) {
    var num = event.currentTarget.dataset.id * 1 + 1
    this.setData({
      type: num
    })
    _purchase.getListData(this.data.type, this._callBack);
  },
  addCart: function(e) {
    var sku = e.target.dataset.sku
    var _userinfo = wx.getStorageSync('user');
    if (!_userinfo) {
      wx.navigateTo({
        url: '/pages/user/login/wxlogin/wxlogin?id=product',
      })
    }else{
      if (e.target.dataset.count > 1 || e.target.dataset.stock == 0)      {
        wx.navigateTo({
          url: '/pages/product/product?sku=' + sku + '&groupid=0&grouplogid=-1'
        })
      } else {
        var para = {
          url: "/MyCart/AddItem",
          type: "POST",
          data: {
            sku: sku,
            qty: 1,
            userId: _userinfo.userid
          }
        }
        _baseRequest._request(para, this._callback_addcart);
      }
    }
  },
  _callback_addcart: function (res) {
    if (res.state.returnCode == 1) {
      wx.showToast({
        title: '您已成功加入购物车',
        icon: 'none',
        duration: 2500,
        mask: true
      });
    }
    else
    {
      wx.showToast({
        title: res.state.error,
        icon: 'none',
        duration: 2500,
        mask: true
      });
    }
  }

})