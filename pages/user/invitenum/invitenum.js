import {
  baseRequest
} from '../../until/baseRequest.js';
var _baseRequest = new baseRequest();
// pages/user/invitenum/invitenum.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    u_iseditcode: 0,    
    topimg2: "https://cache.jiangxinxiaozhen.com/WD/APP/little/invitenumimg.png"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},
  onShow: function(options) {
    var _user = _baseRequest._getUser();
    if (_user) {
      this.setData({
        rsloginname: _user.reLoginName,
        loginname: _user.reLoginName,
        userid: _user.userid
      })
      var iseditshow = 0;
      if (_user.rsShopId) {
        if (_user.rsShopId == _user.shopId) {
          this.setData({
            topimg2: "https://cache.jiangxinxiaozhen.com/WD/APP/little/setnumimg.png"
          })
          iseditshow = 1
        }
      } else {
        iseditshow = 2
      }
      this.setData({
        u_iseditcode: iseditshow
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.popup = this.selectComponent('#popup')
  },
  checkNum: function(e) {
    this.setData({
      loginname: e.detail.value
    })
  },
  /*点击按钮显示修改弹窗*/
  shopPopup: function() {
    this.popup.show();
    this.setData({
      loginname: this.data.rsloginname
    })
  },
  /**取消隐藏弹窗 */
  onReview: function() {
    this.popup.hide()
    this.onShow();
  },
  // 点击弹窗确定按钮
  onSure: function(e) {
    this._bindShopCode();
    this.onShow();
  },
  _bindShopCode: function() {
    var that = this
    var para = {
      url: "/Account/ChangeShopCode",
      type: "POST",
      data: {
        LoginName: that.data.loginname,
        Userid: that.data.userid
      }
    }
    _baseRequest._request(para, (res) => {
      if (res.state.returnCode > 0) {
        var user = wx.getStorageSync('user');
        if (user) {
          that.popup.hide();
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
          //console.log(user)
        }
        if (this.data.rsloginname) {
          this.setData({
            rsloginname: res.data.LoginName
          })
        } else {
          wx.navigateBack();
        }
      } else {
        wx.showToast({
          title: res.state.error,
          icon: 'none',
          duration: 1500
        })
      }
    })
  },
  copy: function() {
    wx.setClipboardData({
      data: this.data.loginname
    })
  }


})