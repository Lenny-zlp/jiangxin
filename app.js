import {
  baseRequest
} from '/pages/until/baseRequest.js';
var _baseRequest = new baseRequest();
App({
  data:{
    //wdurl:"http://192.168.0.9:9002"
    wdurl: "https://shop.jiangxinxiaozhen.com"
  },

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function(options) {
    wx.hideTabBar({     
    })  
    // wx.getSystemInfo({
    //   success: function (res) {
    //     wx.setStorage({
    //       key: 'getPhone',
    //       data: { topH: res.statusBarHeight, fontSize: res.fontSizeSetting }
    //     })
        
    //   }
    // }) 
   
  },
  
  // /**
  //  * 当小程序启动，或从后台进入前台显示，会触发 onShow
  //  */
  onShow: function(options) {
    if (!wx.getStorageSync('shopid') && options.query.shopid){
      wx.setStorage({
        key: 'shopid',
        data: options.query.shopid,
      })
    }
   
    wx.setStorage({
      key: 'screenH',
      data: wx.getSystemInfoSync().windowHeight,
    })
    //用户没有登录、或者登录后没有邀请码，重新获取shopid并授权登录
    // var user = wx.getStorageSync('user');
    // if (user) {
    //   _baseRequest._setCartQty();
    //   if (user.rsShopId == 'undefined' || user.rsShopId == '') {
    //     var shopid = options.query.shopid;
    //     if (shopid) {
    //       wx.removeStorageSync('shopid');
    //       wx.setStorageSync('shopid', shopid)
    //     }
    //   }
    //   //_baseRequest._getWxUser(false);
    // }
    // else {
    //   var shopid = options.query.shopid;
    //   if (shopid) {
    //     wx.removeStorageSync('shopid');
    //     wx.setStorageSync('shopid', shopid)
    //   }
    //   _baseRequest._getWxUser(false, _baseRequest._getWxShouquan());
    // }
  },

  // /**
  //  * 当小程序从前台进入后台，会触发 onHide
  //  */
  onHide: function() {
    wx.removeStorage({
      key: 'report',
      success: function(res) {},
    })
  },

  // /**
  //  * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
  //  */
  // onError: function (msg) {

  // },

 
  
})