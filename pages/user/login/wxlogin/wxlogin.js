import {
  baseRequest
} from '../../../until/baseRequest.js';
var _baseRequest = new baseRequest();

// pages/user/login/wxlogin/wxlogin.js
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
      navB: options.id == 'product' ? true : false
    })
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    var user = wx.getStorageSync('user');
    if (user) { //获取到用户缓存就返回
      wx.navigateBack();
    }
    wx.login({
      success(res) {
        if (res.code) {
          that.setData({
            logincode : res.code
          })
        }
      }
    })
    wx.getSystemInfo({
      success: function (res) {
        wx.setStorage({
          key: 'getPhone',
          data: { topH: res.statusBarHeight, fontSize: res.fontSizeSetting },
          success: function () {
            that.setData({
              topH: wx.getStorageSync('getPhone').topH,
              fontSize: wx.getStorageSync('getPhone').fontSize
            })
          }
        })
      }
    })

  },
  closeWeb:function(){
    if(this.data.navB){
      wx.navigateBack()
    }else{
      wx.switchTab({
        url: '/pages/home/shop/shop',
      })
    }
   
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  //微信授权点击的“拒绝”或者“允许
  bindGetUserInfo: function(e) {
    var that = this;
    //console.log(e.detail.userInfo)
    if (e.detail.userInfo) { //点击了“允许”按钮，
      wx.showLoading({
        title: '加载中',
      })
      _baseRequest._getWxUser(true);
    }
  },
  /**
   * 获取手机号并登陆or绑定
   */
  getPhoneNumber: function(e) {
    if (e.detail.errMsg != "getPhoneNumber:fail user deny") { //点击了“允许”按钮，
      wx.showLoading({
        title: '加载中',
      })
      if (this.data.logincode)
        _baseRequest._getWxUserMobileByApi(e.detail.encryptedData, e.detail.iv, this.data.logincode,0, _baseRequest._userLoginBind);
      else      
        _baseRequest._getUserMobile(e.detail.encryptedData, e.detail.iv, 0, _baseRequest._userLoginBind);  
    }
  },
})