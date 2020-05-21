import {
  baseRequest
} from '../../../until/baseRequest.js';
var _baseRequest = new baseRequest();
// pages/user/login/bindingTel/bindingTel.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showInp: false,
    btn: '获取验证码',
    userName: '',
    userCode: '',
    u_codedis: '',
    btnColor: '#fff',
    btnBg: '#eb5902',
    userid: ''
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
      url: "/Account/GetPhoneCodeForBind",
      type: "POST",
      data: {
        mobile: this.data.userName
      }
    }
    var _mobile = this.data.userName
    var _userCode = this.data.userCode
    if (_mobile && _mobile.length == 11) {
      _baseRequest._request(para, (res) => {
        if (res.state.error) {
          wx.showToast({
            title: res.state.error,
            icon: 'none',
            duration: 1500
          })
        }
        if (res.state.returnCode > 0) {
          //调用60秒倒计时
          this.inviter(60)
          this.setData({
            btnColor: '#fff',
            btnBg: '#eb5902'
          })
        }
      })
    } else {
      wx.showToast({
        title: "手机号格式不正确",
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
            btnColor: '#999',
            btnBg: '#eee'
          })
        } else {
          clearInterval(time)
          that.setData({
            btn: '获取验证码',
            u_codedis: '',
            btnColor: '#fff',
            btnBg: '#eb5902'
          })
        }
      }, 1000)
    }
  },
  _bindPhoneCode: function() {
    var that = this
    var para = {
      url: "/Account/BindMobile",
      type: "POST",
      data: {
        mobile: that.data.userName,
        code: that.data.userCode,
        userid: that.data.userid
      }
    }
    _baseRequest._request(para, (res) => {
      _baseRequest._userLoginBind(res)
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
   * 获取手机号并登陆or绑定
   */
  getPhoneNumber: function(e) {
    if (e.detail.errMsg != "getPhoneNumber:fail user deny") { //点击了“允许”按钮，
      _baseRequest._getUserMobile(e.detail.encryptedData, e.detail.iv, this.data.userid, _baseRequest._userLoginBind)
    }
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
  // closeWeb: function () {
   
  //     wx.navigateBack()
  //   // } else {
  //   //   wx.switchTab({
  //   //     url: '/pages/home/shop/shop',
  //   //   })
  //   },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

})