var md5 = require('../../../../until/md5.js');
import {
  baseRequest
} from '../../../../until/baseRequest.js';
var _baseRequest = new baseRequest();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: null,
    disabled:false,
    codestr: '获取验证码'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      mobile: options.mobile
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  getCode: function() {
    var that = this;
    var ss = 60;
    that.setData({
      codestr: ss + '秒',
      disabled:true
    });
    var si = setInterval(function() {
      ss--;
      that.setData({
        codestr: (ss < 10 ? '0' + ss : ss) + '秒'
      });
      if (ss < 1) {
        clearInterval(si);
        that.setData({
          codestr: '获取验证码',
          disabled: false
        });
      }
    }, 1000)

    var para = {
      url: '/User/GetMobileCode',
      type: 'POST',
      data: {
        userid: wx.getStorageSync('user').userid,
        phone: this.data.mobile
      }
    }
    _baseRequest._request(para, null);
  },

  tosubmit: function(e) {
    let {
      paypass,
      mobile,
      code
    } = e.detail.value;

    if (!paypass) {
      wx.showToast({
        title: '请输入支付密码',
        icon: 'none',
        duration: 3000
      })
      return;
    }
    if (!mobile) {
      wx.showToast({
        title: '手机号不允许为空',
        icon: 'none',
        duration: 3000
      })
      return;
    }
    if (!code) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none',
        duration: 3000
      })
      return;
    }

    if (paypass.length < 6) {
      wx.showToast({
        title: '请输入6-20位大小写英文字母、符号或数字',
        icon: 'none',
        duration: 3000
      })
      return;
    }
    var para = {
      url: '/User/SetPass/',
      type: 'POST',
      data: {
        userid: wx.getStorageSync('user').userid,
        paypass: md5.md5(paypass),
        phone: mobile,
        phoneCode: code,
        v: "v2"
      }
    }
    _baseRequest._request(para, this._callback_setpass);
  },

  _callback_setpass: function(res) {
    wx.showToast({
      title: res.state.error,
      icon: 'none',
      duration: 2000
    });
    setTimeout(function () {
      wx.navigateBack({
        delta: 1
      })},2000);
  }
})