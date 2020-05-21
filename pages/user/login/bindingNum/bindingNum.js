import {
  baseRequest
} from '../../../until/baseRequest.js';
var _baseRequest = new baseRequest();
// pages/user/login/bindingNum/bindingNum.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userid: '',
    shopcode: '',
    opacitynum: 0.6
  },
  //获取用户輸入的邀请码
  shopcodeInput: function(e) {
    this.setData({
      shopcode: e.detail.value
    })
    if (e.detail.value)
    {
      this.setData({
        opacitynum: 1
      })      
    }
    else
    {
      this.setData({
        opacitynum: 0.6
      })  
    }
  },
  _bindShopCode: function() {
    var that = this
    var para = {
      url: "/Account/ChangeShopCode",
      type: "POST",
      data: {
        loginname: that.data.shopcode,
        userid: that.data.userid
      }
    }
    _baseRequest._request(para, (res) => {
      if (res.state.returnCode > 0) {
        var user = wx.getStorageSync('user');
        if (user) {
          user.rsShopId = res.data.ShopId;
          user.reLoginName = res.data.LoginName;
          user.shareShopCode = res.data.ShopCode;
          user.shopcode = res.data.ShopCode;
          wx.removeStorageSync('user')
          wx.setStorageSync('user', user);
          if (res.data.ShopId > 0) {
            wx.removeStorageSync('shopid');
            wx.setStorageSync('shopid', res.data.ShopId)
          }
        }
        var pages = getCurrentPages();
        var page = pages.filter((v, k) => {
          return v.route.indexOf('user/login/bindingTel/bindingTel') > 0;
        })
        if (page.length > 0) {
          //上一个页面实例对象
          wx.navigateBack({
            delta: 2
          })
        } else {
          wx.navigateBack()

        }
      }
      else {
        wx.showToast({
          title: res.state.error,
          icon: 'none',
          duration: 1500
        })
      }
      //_baseRequest._userLoginBind(res);
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      userid: options.userid
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
  onShow: function() {
    this.setData({
      topH: wx.getStorageSync('getPhone').topH,
      fontSize: wx.getStorageSync('getPhone').fontSize
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // wx.reLaunch({
    //   url: '/pages/home/shop/shop'
    // })
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
})