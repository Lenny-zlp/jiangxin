import {
  baseRequest
} from '../../../until/baseRequest.js';
var _baseRequest = new baseRequest();
// pages/user/inviteNew/invitenewto/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopcode: '',
    userId: '',
    refuserid: '3002',
    u_codedis: '',
    btnColor: '',
    btnBg: '',
    btn: '获取验证码',
    opacity: '0.8',
    mobile: '',
    userCode: '',
    contentShow: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      contentShow: wx.getStorageSync('openid') ? false : true,
      refuserid: options.refuserid,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // console.log(getCurrentPages())
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    var id = {
      url: '/UserCenter/GetUserNick',
      type: 'GET',
      data: {
        userId: that.data.refuserid,
      }
    }
    _baseRequest._request(id, (res) => {
      that.setData({
        data: res.data
      })
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
  onUnload: function() {

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

  //获取用户输入的用户名
  userMobileInput: function(e) {
    this.setData({
      mobile: e.detail.value
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
        phone: this.data.mobile
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
  _inviteNew: function(e) {
   
    var that = this;
    if (e.detail.userInfo) { //点击了“允许”按钮，
      //console.log(e.detail.userInfo)
      _baseRequest._getWxUser(true);
    } else {
      var prevPages = getCurrentPages();
      console.log(prevPages)
      if (prevPages.length > 0) {
        for (var i = 0; i < prevPages.length; i++) {
          console.log(prevPages[i].__route__)
          console.log(prevPages[i].__route__)
        }
      }
    }    
    that.setData({
      contentShow: false
    })
  },
  _submitGetCoupon: function (e) {
    var that=this;
    var para = {
      url: "/UserCenter/InviteNew",
      type: "POST",
      data: {
        userId: that.data.refuserid,
        mobile: that.data.mobile,
        qcode: that.data.userCode,
        ShopId: wx.getStorageSync('shopid'),
        WxNickName: wx.getStorageSync('nickName'),
        openid: wx.getStorageSync('openid'),
        unionid: wx.getStorageSync('unionId'),
        Head: wx.getStorageSync('userhead'),
      }
    }
    _baseRequest._request(para, (res) => {      
      if (res.state.returnCode > 0) {
        wx.navigateTo({
          url: '/pages/user/inviteNew/invitestatus/index?rIsnew=' + res.data.rIsnew + '&refuserid=' + that.data.refuserid ,
        })
      }
      else
      {
        wx.showToast({
          title: res.state.error,
          icon: 'none',
          duration: 1500
        })
      }
    })
  },
})