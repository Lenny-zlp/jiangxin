import {
  baseRequest
} from '../../../until/baseRequest.js';
var _baseRequest = new baseRequest();
// pages/user/login/setnewWord/setnewWord.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _src: 'https://cache.jiangxinxiaozhen.com/WD/APP/little/wordFalse.png',
    _src2: 'https://cache.jiangxinxiaozhen.com/WD/APP/little/wordTrue.png',
    isShow:true,
    isShow2: true
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      userName: options.userName,
      smsCode: options.smsCode,
    })
  },
  openeye:function(){    
      this.setData({
        isShow:!this.data.isShow
      })
  },
  openeye1: function () {
    this.setData({
      isShow2: !this.data.isShow2
    })
  },
  userPwdInput: function (e) {
    this.setData({
      userPwd: e.detail.value
    })
  },
  surePwdInput: function (e) {
    this.setData({
      surePwd: e.detail.value
    })
  },
  btnsubmit: function () {
    if (this.data.userPwd)
    {
      if (this.data.userPwd != this.data.surePwd)
      {
        wx.showToast({
          title: "密码不一致，请确认",
          icon: 'none',
          duration: 1500
        })
      }
      else
      {
        var para = {
          url: "/Account/FindPwd",
          type: "POST",
          data: {
            Username: this.data.userName,
            Password: this.data.userPwd,
            SMSCode: this.data.smsCode,
          }
        }
        _baseRequest._request(para, (res) => {
          wx.showToast({
            title: res.state.error,
            icon: 'none',
            duration: 1500
          })
          if (res.state.returnCode > 0) {
            wx: wx.navigateBack({
              delta: 2
            })
          }
        })
      }
    }
    else
    {
      wx.showToast({
        title: "请输入密码",
        icon: 'none',
        duration: 1500
      })
    }    
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
})