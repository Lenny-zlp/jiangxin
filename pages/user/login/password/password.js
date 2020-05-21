import {
  baseRequest
} from '../../../until/baseRequest.js';
var _baseRequest = new baseRequest();
// pages/user/login/password/password.js
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

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
  },
  //获取用户输入的用户名
  userNameInput: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },
  userPwdInput: function (e) {
    this.setData({
      userPwd: e.detail.value
    })
  },
  loginPhonePwd: function() {
    var that = this
    var para = {
      url: "/Account/UserLoginByMobile",
      type: "POST",
      data: {
        Username: this.data.userName,
        Password: this.data.userPwd
      }
    }
    _baseRequest._request(para, (res) => {
      if (res.state.returnCode > 0) {
        //登录成功清除原缓存，写入新的 
        wx.removeStorageSync('user')
        wx.setStorageSync('user', {
          'userid': res.data.Userid,
          'username': res.data.Username,
          'nickName': res.data.nickName,
          'head': res.data.Head,
          'mobile': res.data.Mobile,
          'loginName': res.data.LoginName,
          'shopcode': res.data.ShopCode,
          'shareShopCode': res.data.ShareShopCode,
          'userRatingId': res.data.UserRatingId,
          'shopId': res.data.ShopId,
          'status': res.data.status,
          'isSuperLife': res.data.IsSuperLife,
          'personName': res.data.PersonName,
          'rsShopId': res.data.rsShopId,
          'reLoginName': res.data.reLoginName,
        })
        if (res.data.rsShopId > 0) {
          wx.removeStorageSync('shopid');
          wx.setStorageSync('shopid', res.data.rsShopId)
        }
        if (res.data.pwdMsg)
          wx.showToast({
            title: res.state.error,
            icon: 'none',
            duration: 2000
          })      
        var pages = getCurrentPages();    
        if (pages.length > 1)
          wx: wx.navigateBack({
            delta: 2
          })
        else
          wx.navigateBack();
      } else {
        wx.showToast({
          title: res.state.error,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
})