var md5 = require('../../../until/md5.js');
import {
  baseRequest
} from '../../../until/baseRequest.js';
var _baseRequest = new baseRequest();
// pages/user/recommend/goldcardmesg/goldcardmesg.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    provincename: '',
    cityname: '',
    areaname: '',
    btn: '获取验证码',
    userCode: '',
    u_codedis: '',
    btnColor: '#fff',
    btnBg: '#eb5902',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //console.log(options.productcode)
    this.setData({
      productcode: options.productcode
    })

  },
  userCodeInput: function (e) {
    this.setData({
      userCode: e.detail.value
    })
  },
  userNameInput: function (e) {
    this.setData({
      userName: e.detail.value
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
    var that = this
    var para = {
      url: "/Shop/CreateShopBuy",
      type: "POST",
      data: {
        ProductCode: that.data.productcode
      }
    }
    _baseRequest._request(para, (res) => {
      if (res.state.returnCode > 0) {
        this.setData({
          str1: res.data.str1,
          str2: res.data.str2,
          str3: res.data.str3,
          str4: res.data.str4,
          str5: res.data.str5,
          str6: res.data.str6,
          str7: res.data.str7,
          img: res.data.Img
        })
      }
    })
  },
  _getphonecode: function (e) {
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
  inviter: function (num) {
    var that = this,
      time
    if (num > 0) {
      time = setInterval(function () {
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
  // bindRegionChange: function(e) {
  //   //console.log(e.detail)
  //   this.setData({
  //     provinceid: e.detail.code[0].substring(0, 2),
  //     cityid: e.detail.code[1].substring(0, 4),
  //     areaid: e.detail.code[2],
  //     provincename: e.detail.value[0],
  //     cityname: e.detail.value[1],
  //     areaname: e.detail.value[2]
  //   })
  // },

  subpay: function(e) {
    var that = this;
    if (e.detail.value.cname == "") {
      wx.showToast({
        title: "姓名不能为空",
        icon: 'none'
      });
      return false;
    }
    // if (e.detail.value.caddress == "") {
    //   wx.showToast({
    //     title: "详细地址不能为空",
    //     icon: 'none'
    //   });
    //   return false;
    // }
    if (e.detail.value.cmobile == "") {
      wx.showToast({
        title: "手机号码不能为空",
        icon: 'none'
      });
      return false;
    }
    if (e.detail.value.cmobile.length != 11) {
      wx.showToast({
        title: "手机号格式不正确",
        icon: 'none'
      });
      return false;
    }
    if (e.detail.value.ccode == "") {
      wx.showToast({
        title: "请输入验证码",
        icon: 'none'
      });
      return false;
    }
    // if (e.detail.value.cpwd != e.detail.value.cpwd1) {
    //   wx.showToast({
    //     title: "密码输入不一致",
    //     icon: 'none'
    //   });
    //   return false;
    // }
    // if (e.detail.value.cpwd == "") {
    //   wx.showToast({
    //     title: "请输入密码",
    //     icon: 'none'
    //   });
    //   return false;
    // }
    var luser=_baseRequest._getUser();
    if (luser)
    {
      var para = {
        url: "/Shop/CreateShopBuyVip",
        type: 'POST',
        data: {
          UserId: luser.userid,
          ShopId: wx.getStorageSync('shopid'),
          FullName: e.detail.value.cname,
          Mobile: e.detail.value.cmobile,
         
          ProductCode: that.data.productcode,
          SMSCode: e.detail.value.ccode,
          v:"v2"
        }
      }
      _baseRequest._request(para, function (res) {
        var isremoveuser=0
        if (res.state.returnCode > 0) {
          if (e.detail.value.cmobile == luser.mobile)
          {
            isremoveuser = 1;
          }
          wx.navigateTo({
            url: '/pages/user/recommend/payGoldcard/payGoldcard?id=' + res.state.returnCode + '?isremoveuser=' + isremoveuser,
          })
        } else {
          wx.showToast({
            title: res.state.error,
            icon: 'none'
          });
        }
      })
    }
    
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var luser = _baseRequest._getUser();
    if (luser)
    return {
      title: '金卡会员 开通有礼',
      imageUrl: 'https://cache.jiangxinxiaozhen.com//VipBuy/VipSendImg1.jpg',
      path: '/pages/user/recommend/Goldcard/Goldcard?shopid=' + luser.rsShopId,
    }
  }
})