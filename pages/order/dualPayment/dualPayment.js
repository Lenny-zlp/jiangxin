import {
  baseRequest
} from '../../until/baseRequest.js';
var _baseRequest = new baseRequest();
var js_request = require('request.js');
var js_countdown = require('../../until/countdown.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    login_token: '',
    payWrap: false, //是否显示输入密码弹出框
    useamount: 0, //是否使用余额
    pay_timer: null
  },

  onLoad: function(options) {
    if (options) {
      this.setData({
        ordercode: options.ordercode
      });
    } else {
      this.setData({
        ordercode: this.data.ordercode
      });
    }
  },

  onShow: function() {
    wx.showLoading({
      title: 'loading...',
    })
    var _user = js_request._user();
    if (!_user) {
      return;
    } else {
      this.setData({
        _user: _user
      });
    }
    var para = {
      url: '/CartPartial/SelectPayment/',
      type: 'POST',
      data: {
        login_token: this.data.login_token,
        ordercode: this.data.ordercode,
        useamount: this.data.useamount,
        userid: this.data._user.userid
      }
    }
    _baseRequest._request(para, this._callback);
  },

  onHide: function() {
    clearInterval(this.data.pay_timer);
  },
  onUnload: function() {
    clearInterval(this.data.pay_timer);
  },
  bindGetUserInfo: function(e) { //点击的“拒绝”或者“允许
    var that = this;
    if (e.detail.userInfo) { //点击了“允许”按钮，
      if (this.data.useamount == 1) {
        js_request.payAgain(this);
      } else {
        js_request.wxPay(this, this.data.ordercode);
      }
    } else {
      wx.showToast({
        title: '请您允许微信授权，以便支付',
        icon: 'none',
        duration: 3000
      })
    }
  },
  /**是否使用余额 */
  changeSwitch: function(e) {
    js_request.hasAmout(this);
  },

  /**输入密码点击取消 */
  oncancel: function() {
    this.setData({
      useamount: 0,
      payWrap: false
    });
  },

  sumitPay: function(e) {
    let {
      paypass
    } = e.detail.value;
    if (!paypass) {
      wx.showToast({
        title: '请输入支付密码',
        icon: 'none',
        duration: 2000
      })
    } else {
      js_request.checkPass(this, paypass)
    }
  },


  _callback: function(res) {
    wx.hideLoading();
    if (res.state.returnCode == 1) {
      var pay_countdown = null;
      var pay_timer = js_countdown.setTime(this, res.data.order.CountDown, 'pay_countdown', pay_countdown);
      this.setData({
        model: res.data,
        pay_timer: pay_timer
      });
    }
  },


  callback_pay: function(res) {
    var that = this;
    var openId = res.data.openId;
    if (openId) {
      wx.request({
        url: _baseRequest.domain() + "/WxPay/WxPayJsApi",
        method: 'POST',
        data: _baseRequest.getSignData({
          data: {
            ordercode: that.data.ordercode,
            userid: that.data._user.userid,
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
                  if (that.data.model.order.OrderType == 2) {
                    wx.redirectTo({
                      url: "/pages/collage/paysuccess/paysuccess?OrderCode=" + that.data.ordercode
                    })
                  } else {
                    wx.redirectTo({
                      url: "/pages/order/paySuccess/paySuccess?ordercode=" + that.data.ordercode
                    })
                  }
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
  }
})