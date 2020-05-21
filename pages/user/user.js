
// pages/shoppingcart/address/list.js
import {
  baseRequest
} from '../until/baseRequest.js';
var _baseRequest = new baseRequest();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: null,
    voucherCount: 0,
    customerCount: 0,
    couponCount: 0,
    integralCount: 0,
    customerCount: 0,
    voucherSumPrice:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
 
  backLogin:function(){
    wx.removeTabBarBadge({
      index: 2,
    })
    wx.removeStorageSync("cartnum")
    _baseRequest._clearLoginReseat();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx.setNavigationBarTitle({
      title: '个人中心',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 3,
        cartnum: wx.getStorageSync('cartnum')
      })
    }
    var _user = _baseRequest._getUser();
    if (wx.getStorageSync('cartnum') > 0) {
      wx.setTabBarBadge({
        index: 2,
        text: wx.getStorageSync('cartnum').toString(),
      })
    }
    if (_user) {
      this.setData({ shopcode: _user.shopcode })
      var para = {
        url: '/Account/GetUserInfo/',
        type: 'POST',
        data: {
          //username: _user.username,
          v: 1,
          login_token: "",
          userid: _user.userid
        }
      }
      var that = this;
      _baseRequest._request(para, function(res) {
        if (res.state.returnCode == 1) {
          that.setData({
            userratingid: _user.userRatingId,
            data: res.data,
            userhead:res.data.Head,
            voucherCount: res.data.VoucherCount,
            voucherSumPrice: res.data.VoucherSumPrice,
            shareCouponCount: res.data.ShareCouponCount,
            couponCount: res.data.CouponCount,
            integralCount: res.data.IntegralCount,
            customerCount: res.data.CustomerCount
          })
        }
      });
    }
  },

  imgerr:function(e){
    if (e.detail.errMsg){
      this.setData({
        userhead:'https://cache.jiangxinxiaozhen.com/Appimage/defaulthead.jpg'}
      )
    }
  }
})