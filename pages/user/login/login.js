import {
  baseRequest
} from '../../until/baseRequest.js';
var _baseRequest = new baseRequest();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    btn: '获取验证码',
    opacity: '0.5',
    userName: '',
    userCode: '',
    u_codedis: '',
    btnColor: '',
    btnBg: '',
    contentReadOnly: ''
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
    var para = {
      url: "/Account/GetPhoneCode",
      type: "POST",
      data: {
        phone: this.data.userName
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
  loginPhoneCode: function() {
    var that = this
    var para = {
      url: "/Account/UserLoginByMobileCode",
      type: "POST",
      data: {
        username: this.data.userName,
        code: this.data.userCode
      }
    }
    _baseRequest._request(para, (res) => {
      _baseRequest._userLoginBind(res);
    })
  },
  bindGetUserInfo: function(e) { //点击的“拒绝”或者“允许
    var that = this;
    if (e.detail.userInfo) { //点击了“允许”按钮，
      that.setData({
        contentReadOnly: 'disable'
      })
      _baseRequest._getWxUser(true);
    } else {
      that.setData({
        contentShow: false
      })

    
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      contentShow: options.contentShow > 0 ? true : false
    })
  },
  onUnload: function() {
    // wx.reLaunch({
    //   url: '/pages/home/shop/shop'
    // })
  }
})
