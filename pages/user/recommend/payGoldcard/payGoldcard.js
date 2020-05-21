import {
  baseRequest
} from '../../../until/baseRequest.js';
var _baseRequest = new baseRequest();
// pages/user/recommend/payGoldcard/payGoldcard.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.id
      ,isremoveuser: options.isremoveuser
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this    
    that.setData({
      shopid: _baseRequest._getShopId(),
    })
    var para = {
      url: "/Shop/GetLevelUpNewBy",
      type: "POST",
      data: {
        Id: that.data.id
      }
    }
    _baseRequest._request(para, (res) => {
      if (res.state.returnCode > 0) {
        this.setData({
          ratingJoinPrice: res.data.RatingJoinPrice,
          joinPrice: res.data.JoinPrice,
          userRatingName: res.data.UserRatingName,
          userRatingStr: res.data.UserRatingStr
        })
      }
    })
  },
  bindGetUserInfo: function(e) { //点击的“拒绝”或者“允许
    var that = this;    
    
    if (e.detail.userInfo) { //点击了“允许”按钮，
      that.openWxPay();
    } else {
      wx.showToast({
        title: '请您允许微信授权，以便支付',
        icon: 'none',
        duration: 3000
      })
    }
  },
  /**
   * 打开微信支付
   */
  openWxPay: function() {
    var that=this;
    _baseRequest._getOpenId(that.callback_pay);
  },
  callback_pay: function(res) {
    var that = this;
    var openId = res.data.openId;
    if (openId) {
      wx.request({
        url: _baseRequest.domain() + "/WxPay/ContractWxPayJsApi",
        method: 'POST',
        data: _baseRequest.getSignData({
          data: {
            shopId: that.data.shopid,
            hetongid: that.data.id,
            openId: openId
          }
        }),
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        success: function(res) {
          if (res.statusCode == 200) { //返回数据成功
            if (res.data.state.returnCode == 1) {
              wx.requestPayment({
                timeStamp: res.data.data.timeStamp,
                nonceStr: res.data.data.nonceStr,
                package: res.data.data.package,
                signType: 'MD5',
                paySign: res.data.data.paySign,
                success(res) {
                  if (that.data.isremoveuser==1)
                  {
                    wx.removeStorageSync('user');
                    wx.removeStorageSync('shopid');
                  }
                  wx.redirectTo({
                    url: "/pages/user/recommend/paySuccess/paySuccess?pid=" + that.data.id,
                  })
                }
              })
            } else { 
              wx.showToast({
                title: res.data.state.error,
                duration: 3000,
                icon: 'none'
              })
            }
          } else { //返回数据失败
            wx.showToast({
              title: '服务器内部错误！',
              icon: 'none',
              duration: 3000
            })
          }
        }
      })
    }
  },
  /**
   * 打开合同
   */
  openHetong: function () {
    wx.navigateTo({
      url: '/pages/user/recommend/GoldHetong/GoldHetong?id=' + this.data.id,
    })
  },

})