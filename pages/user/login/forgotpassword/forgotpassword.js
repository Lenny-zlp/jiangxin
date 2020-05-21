import {
  baseRequest
} from '../../../until/baseRequest.js';
var _baseRequest = new baseRequest();
// pages/user/login/forgotpassword/forgotpassword.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btn: '获取验证码',
    opacity: '0.5',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},
  btnsubmit: function() {
    if (this.data.userName) {
      if (this.data.userCode) {
        var para = {
          url: "/Account/CheckSMSCode",
          type: "POST",
          data: {
            Username: this.data.userName,
            SMSCode: this.data.userCode,
          }
        }
        _baseRequest._request(para, (res) => {
          if (res.state.returnCode > 0) {
            wx: wx.navigateTo({
              url: '/pages/user/login/setnewWord/setnewWord?userName=' + this.data.userName + '&smsCode=' + this.data.userCode
            })
          }
          else {
            wx.showToast({
              title: res.state.error,
              icon: 'none',
              duration: 1500
            })
          }
        })
      } else {
        wx.showToast({
          title: '请输入验证码',
          icon: 'none',
          duration: 1500
        })
      }
    } else {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 1500
      })
    }

  },
  //获取用户输入的用户名
  userNameInput: function(e) {
    this.setData({
      userName: e.detail.value
    })
  },
  userCodeInput: function(e) {
    this.setData({
      userCode: e.detail.value
    })
  },
  _getphonecode: function(e) {
    if (this.data.userName) {
      if (this.data.userName.length == 11) {
        var para = {
          url: "/Account/GetPhoneCodeForget",
          type: "POST",
          data: {
            phone: this.data.userName,
            isForget: 1,
          }
        }
        _baseRequest._request(para, (res) => {
          wx.showToast({
            title: res.state.error,
            icon: 'none',
            duration: 1500
          })
          if (res.state.returnCode > 0) {
            //调用60秒倒计时
            this.inviter(60)
            this.setData({
              opacity: '1',
              btnColor: '#eb5902',
              btnBg: '#fff'
            })
          }
        })
      } else {
        wx.showToast({
          title: '手机号格式不正确',
          icon: 'none',
          duration: 1500
        })
      }
    } else {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 1500
      })
    }
  },
  //倒计时方法
  inviter: function(num) {
    var that = this,
      time
    if (num > 0) {
      time = setInterval(function() {
        num--
        if (num > 0) {
          that.setData({
            btn: num + '秒后获取',
            u_codedis: 'disable',
            btnColor: '#eb5902',
            btnBg: '#fff'
          })
        } else {
          clearInterval(time)
          that.setData({
            btn: '获取验证码',
            u_codedis: ''
          })
        }
      }, 1000)
    }
  },

})