var js_request = require('request.js');
import {
  baseRequest
} from '../../until/baseRequest.js';
var _baseRequest = new baseRequest();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressid: -1,
    model: null,
    couponid: 0, //选中优惠券的时候赋值
    couponkeyid: 0, //选中优惠券的时候赋值
    giftcardno: '0', //xuan选中的代金券Id，默认‘0’
    groupid: 0,
    grouplogid: 0,
    buytype: 0, //来源：0:购物车 1：普通商品 4：团购 5：星品
    //paytypeid: 12, //支付方式
    check: false, //是否开启越支付
    payWrap: false, //是否弹出输入密码弹层
    useAmount: false, //是否使用余额支付
    useVoucher: false, //是否使用代金券
    useCoupon: false, //是否使用优惠券
    cardtype: 0,
    paidbycardisenabled: false,
    couponcount: 0,
    sku: null,
    qty: 1,
    dg: 0,
    remark: '',
    login_token: '',
    submit_disabled: false,
    submit_text: '提交订单',
    submit_text1: '完成订单',
    submit_ms: 0,
    fareDetail: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中...',
    })
    this.setData({
      addressid: options.addressid ? options.addressid : this.data.addressid,
      buytype: options.buytype ? options.buytype : this.data.buytype,
      couponid: options.couponid ? options.couponid : this.data.couponid,
      couponkeyid: options.couponkeyid ? options.couponkeyid : this.data.couponkeyid,
      giftcardno: options.giftcardno ? options.giftcardno : this.data.giftcardno,
      cardtype: options.cardtype ? options.cardtype : this.data.cardtype,
      paidbycardisenabled: options.paidbycardisenabled ? options.paidbycardisenabled : this.data.paidbycardisenabled,
      couponcount: options.couponcount ? options.couponcount : this.data.couponcount,
      sku: options.sku ? options.sku : null,
      qty: options.qty ? options.qty : 1,
      dg: options.dg ? options.dg : 0,
      groupid: options.groupid ? options.groupid : 0,
      grouplogid: options.grouplogid ? options.grouplogid : 0,
    });
  },
  onShow: function() {
    this.setData({
      submit_ms: 0,
      submit_disabled: false,
      submit_text: '提交订单',
      submit_text1: '完成订单'
    });
    js_request.getInfo(this);
  },
  /**余额开关 */
  switchBtn: function() {
    js_request.hasAmout(this);
  },

  /**取消密码输入 */
  pay_cancel: function() {
    this.setData({
      check: false,
      payWrap: false,
    });
  },

  /**验证支付密码 */
  formSubmit: function(e) {
    let {
      paypass
    } = e.detail.value;
    if (!paypass) {
      wx.showToast({
        title: '请输入支付密码',
        icon: 'none',
        duration: 2000
      })
    } else {
      js_request.checkPass(this, paypass)
    }
  },

  /**获取留言 */
  remark: function(e) {
    this.setData({
      remark: e.detail.value
    });
  },

  /**提交订单-获取授权支付 */
  bindGetUserInfo: function(e) {
    var that = this;
    var myDate = new Date(); //获取系统当前时间
    let ms = myDate.getMilliseconds(); //获取当前毫秒数
    let ms_after = this.data.submit_ms; //获取上次点击的毫秒数
    this.setData({
      submit_disabled: true,
      submit_text: '提交中...',
      submit_ms: ms
    });
    if (ms_after != 0 && (ms - ms_after < 1000)) {
      return;
    }
    if (e.detail.userInfo) { //点击了“允许”按钮，
      js_request.validateForSubmit(this, that.data.remark);
    } else {
      wx.showToast({
        title: '请您允许微信授权，以便支付',
        icon: 'none',
        duration: 3000
      })
    }
  },

  /**提交订单 */
  sumitOrder: function(e) {
    var myDate = new Date(); //获取系统当前时间
    let ms = myDate.getMilliseconds(); //获取当前毫秒数
    let ms_after = this.data.submit_ms; //获取上次点击的毫秒数
    this.setData({
      submit_disabled: true,
      submit_text1: '提交中...',
      submit_ms: ms
    });
    if (ms_after != 0 && (ms - ms_after < 1000)) {
      return;
    }

    let {
      customremark
    } = e.detail.value;
    if (!customremark) {
      customremark = '';
    }
    js_request.validateForSubmit(this, customremark);
  },

  /**选择地址回此页面的时候调用次函数 */
  changeData: function(addressid) {
    console.log(addressid);
    wx.showLoading({
      title: '加载中...',
    })
    this.setData({
      addressid: addressid
    })
    js_request.getInfo(this);
  },

  /**修改数量 */
  changeNum: function (e) {
    let qty = parseInt(e.currentTarget.dataset.qty);
    let sku = e.currentTarget.dataset.sku;
    let type = parseInt(e.currentTarget.dataset.type);
    qty += type;
    if (qty <1) { return}
    wx.showLoading({
      title: '加载中...',
    })
   
    js_request.getInfo(this, qty, sku,1);
    
  },
  /**选择代金券返回此页面的时候调用次函数 */
  changeDataForVoucher: function(giftcardno, paidbycardisenabled) {
    wx.showLoading({
      title: '加载中...',
    })
    if (giftcardno == -1) {
      this.setData({
        cardtype: 1,
        paidbycardisenabled: paidbycardisenabled,
        giftcardno: giftcardno
      })
    } else {
      this.setData({
        cardtype: 1,
        paidbycardisenabled: paidbycardisenabled,
        giftcardno: giftcardno,
        couponid: -1,
        couponkeyid: -1,
      })
    }
    //js_request.getInfo(this);
  },

  /**选择优惠券返回此页面的时候调用次函数 */
  changeDataForCoupon: function(couponid, couponkeyid, couponcount) {
    wx.showLoading({
      title: '加载中...',
    })
    if (couponid == "-1" && couponkeyid == "-1") {
      this.setData({
        couponid: couponid,
        couponkeyid: couponkeyid,
        couponcount: couponcount
      })
    } else {
      this.setData({
        couponid: couponid,
        couponkeyid: couponkeyid,
        couponcount: couponcount,
        giftcardno: "-1"
      })
    }
    //js_request.getInfo(this);
  },

  /**微信支付 */
  callback_pay: function(res) {
    var that = this;
    var openId = res.data.openId;
    if (openId) {
      wx.request({
        url: _baseRequest.domain() + "/WxPay/WxPayJsApi",
        method: 'POST',
        data: _baseRequest.getSignData({
          data: {
            ordercode: that.data.ordercode,
            userid: _baseRequest._getUser().userid,
            openId: openId
          }
        }),
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        success: function(res) {
          if (res.statusCode == 200) { //返回数据成功
            if (res.data.state.returnCode == 1) {
              wx.requestPayment({
                timeStamp: res.data.data.timeStamp,
                nonceStr: res.data.data.nonceStr,
                package: res.data.data.package,
                signType: 'MD5',
                paySign: res.data.data.paySign,
                success(res) {
                  if (that.data.groupid > 0) {
                    wx.redirectTo({
                      url: "/pages/collage/paysuccess/paysuccess?OrderCode=" + that.data.ordercode
                    })
                  } else {
                    wx.redirectTo({
                      url: "/pages/order/paySuccess/paySuccess?ordercode=" + that.data.ordercode
                    })
                  }
                },
                fail(res) {
                  wx.redirectTo({
                    url: "/pages/order/orderdetail/detail?ordercode=" + that.data.ordercode,
                  })
                }
              })
            } else {
              wx.showToast({
                title: res.data.state.error,
                duration: 3000,
                icon: 'none'
              })
            }
          } else { //返回数据失败
            wx.showToast({
              title: '服务器内部错误！',
              icon: 'none',
              duration: 3000
            })
          }
        }
      })
    }
  },
  showFareList: function() {
    if (this.data.model.ZongYunFei > 0) {
      this.setData({
        fareDetail: !this.data.fareDetail
      })
    }
  },
  closeFareList: function() {
    this.setData({
      fareDetail: !this.data.fareDetail
    })
  }
})