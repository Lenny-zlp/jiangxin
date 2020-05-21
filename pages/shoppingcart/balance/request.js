import {
  baseRequest
} from '../../until/baseRequest.js';
var _baseRequest = new baseRequest();

/**加载页面 */
function getInfo(that, qty, sku, operation=0) {
  // var cart_userid = wx.getStorageSync("cartuserid");
  // var userid = _baseRequest._getMobileUser().userid;
  var userid = _baseRequest._getUser().userid;
  wx.request({
    url: _baseRequest.domain() + "/shopping/orderinfo/",
    method: 'POST',
    data: _baseRequest.getSignData({
      data: {
        addressId: that.data.addressid,
        shopid: wx.getStorageSync("shopid"),
        userid: userid,
        operation: operation,
        // CartUserId: cart_userid,
        AppVersion: 266,
        virtualaccountisenabled: that.data.useAmount,
        couponid: that.data.couponid,
        couponkeyid: that.data.couponkeyid,
        sku: sku != null ? sku : that.data.sku,
        qty: qty > 0 ? qty : that.data.qty,
        dg: that.data.dg,
        cardtype: that.data.cardtype,
        giftcardno: that.data.giftcardno,
        paidbycardisenabled: that.data.paidbycardisenabled,
        buytype: that.data.buytype,
        couponcount: that.data.couponcount,
        groupid: that.data.groupid,
        grouplogid: that.data.grouplogid,
        login_token: that.data.login_token
      }
    }),
    header: {
      "content-type": "application/x-www-form-urlencoded"
    },
    success: function(res) {
      if (res.statusCode == 200) { //返回数据成功
        if (res.data.state.returnCode == 1) {
          that.setData({
            //paytypeid: res.data.data.model.ShiJiZhiFu > 0 ? 12 : res.data.data.model.DisAmount > 0 ? 6 : 7,
            model: res.data.data.model
          });
        } else {
          wx.showToast({
            title: res.data.state.error,
            icon: 'none',
            duration: 3000
          })
        }
      } else { //返回数据失败
        wx.showToast({
          title: '服务器内部错误！',
          icon: 'none',
          duration: 3000
        })
      }
      wx.hideLoading();
    }
  })
}

/**验证有没有设置支付密码 */
function hasAmout(that) {
  wx.request({
    url: _baseRequest.domain() + "/User/MyCost/",
    method: 'POST',
    data: _baseRequest.getSignData({
      data: {
        userid: _baseRequest._getUser()
          .userid
      }
    }),
    header: {
      "content-type": "application/x-www-form-urlencoded"
    },
    success: function(res) {
      if (res.statusCode == 200) { //返回数据成功
        if (res.data.state.returnCode == 1) {
          if (res.data.data.jsonData.NoSet) {
            //跳转到设置密码页
            wx.navigateTo({
              url: "/pages/user/myBag/fund/setpassword/password?mobile=" + res.data.data.jsonData.Mobile
            })
          } else {
            if (!that.data.check) {
              that.setData({
                check: true,
                payWrap: true
              })
            } else {
              that.setData({
                check: false,
                payWrap: false,
                useAmount: false
              });
              getInfo(that);
            }
          }
        } else {
          wx.showToast({
            title: res.data.state.error,
            icon: 'none',
            duration: 3000
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

/**验证支付密码 */
function checkPass(that, paypass) {
  wx.request({
    url: _baseRequest.domain() + "/User/ValidatePass",
    method: 'POST',
    data: _baseRequest.getSignData({
      data: {
        userid: _baseRequest._getUser()
          .userid,
        paypass: paypass
      }
    }),
    header: {
      "content-type": "application/x-www-form-urlencoded"
    },
    success: function(res) {
      if (res.statusCode == 200) { //返回数据成功
        if (res.data.state.returnCode == 1) {
          that.setData({
            check: true,
            payWrap: false,
            useAmount: true
          })
          getInfo(that);
        } else {
          wx.showToast({
            title: res.data.state.error,
            icon: 'none',
            duration: 3000
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

/**下单前的验证 */
function validateForSubmit(that, customremark) {
  wx.request({
    url: _baseRequest.domain() + "/Order/ValidateApi",
    method: 'POST',
    data: _baseRequest.getSignData({
      data: {
        cityid: that.data.model.AddressModel.CityId
      }
    }),
    header: {
      "content-type": "application/x-www-form-urlencoded"
    },
    success: function(res) {
      if (res.statusCode == 200) { //返回数据成功
        if (res.data.state.returnCode == 1) {
          if (res.data.data.code == 0) {
            wx.showModal({
              title: '提示',
              content: res.data.data.msg,
              showCancel: false,
              confirmText: '去支付',
              success(res) {
                if (res.confirm) {
                  submitOrder(that, customremark);
                }
              }
            })
          } else {
            submitOrder(that, customremark);
          }
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

/**提交订单 */
function submitOrder(that, customremark) {
  wx.request({
    url: _baseRequest.domain() + "/Shopping/success",
    method: 'POST',
    data: _baseRequest.getSignData({
      data: {
        addressid: that.data.model.AddressModel.AddressId,
        AppVersion: 266,
        areaid: that.data.model.AddressModel.AreaId,
        buytype: that.data.buytype, //来源：0:购物车 1：普通商品 4：团购 5：星品
        cardtype: that.data.useVoucher ? 1 : 0, //1：使用代金券 0：未使用代金券
        cartid: wx.getStorageSync('CartId'),
        content: '', //不知道有什么用
        couponid: that.data.couponid, //优惠券Id，默认0
        couponkeyid: that.data.couponkeyid, //用户优惠券Id，默认0
        customremark: customremark ? customremark : '', //备注
        giftcardno: that.data.giftcardno, //代金券Id，，默认‘0’
        groupid: that.data.groupid,
        grouplogid: that.data.grouplogid,
        login_token: that.data.login_token,
        noticemobile: '', //通知手机号，已废弃
        paidbycardisenabled: false, //是否使用代金券，已废弃
        paytypeid: 12, //that.data.paytypeid, //支付方式
        price: '', //弃用
        qty: that.data.qty, //立即购买的话需要传值
        shopid: _baseRequest._getUser()
          .rsShopId,
        sku: that.data.sku, //立即购买的话需要传值
        title: '', //不知道有什么用
        transferid: '', //不知道有什么用
        userid: _baseRequest._getUser()
          .userid,
        virtualaccountisenabled: that.data.useAmount, //是否使用余额
        ordersource: 3 //1:app 2：微商城 3：小程序
      }
    }),
    header: {
      "content-type": "application/x-www-form-urlencoded"
    },
    success: function(res) {
      if (res.statusCode == 200) { //返回数据成功
        if (res.data.state.returnCode == 1) {
          if (res.data.data.OrderForms.Status == 1) {
            if (that.data.groupid > 0) {
              wx.redirectTo({
                url: "/pages/collage/paysuccess/paysuccess?OrderCode=" + res.data.data.OrderForms.ordercode
              })
            } else {
              wx.redirectTo({
                url: "/pages/order/paySuccess/paySuccess?ordercode=" + res.data.data.OrderForms.ordercode,
              })
            }

          } else {
            that.setData({
              ordercode: res.data.data.OrderForms.ordercode
            });
            //调用支付接口
            wxPay(that);
          }
        } else {
          wx.showToast({
            title: res.data.state.error,
            icon: 'none',
            duration: 3000
          });
          setTimeout(function() {
            that.setData({
              submit_ms: 0,
              submit_disabled: false,
              submit_text: '提交订单',
              submit_text1: '完成订单'
            });
          }, 3000);
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

/**请求微信支付 */
function wxPay(that) {
  //获取openid，回调是为了保证百分百能获取到
  _baseRequest._getOpenId(that.callback_pay);
  // wx.request({
  //   url: _baseRequest.domain() + "/WxPay/WxPayJsApi",
  //   method: 'POST',
  //   data: _baseRequest.getSignData({
  //     data: {
  //       ordercode: ordercode,
  //       userid: _baseRequest._getUser().userid,
  //       openId: _baseRequest._getOpenId()
  //     }
  //   }),
  //   header: {
  //     "content-type": "application/x-www-form-urlencoded"
  //   },
  //   success: function(res) {
  //     if (res.statusCode == 200) { //返回数据成功
  //       if (res.data.state.returnCode == 1) {
  //         wx.requestPayment({
  //           timeStamp: res.data.data.timeStamp,
  //           nonceStr: res.data.data.nonceStr,
  //           package: res.data.data.package,
  //           signType: 'MD5',
  //           paySign: res.data.data.paySign,
  //           success(res) {
  //             wx.redirectTo({
  //               url: "/pages/order/paySuccess/paySuccess?ordercode=" + ordercode,
  //             })
  //           },
  //           fail(res) {
  //              wx.redirectTo({
  //                url: "/pages/order/orderdetail/detail?ordercode=" + ordercode,
  //           })
  //           }
  //         })
  //       } else {
  //         wx.showToast({
  //           title: res.data.state.error,
  //           duration: 3000,
  //           icon: 'none'
  //         })
  //       }
  //     } else { //返回数据失败
  //       wx.showToast({
  //         title: '服务器内部错误！',
  //         icon: 'none',
  //         duration: 3000
  //       })
  //     }
  //   }
  // })
}

module.exports = {
  validateForSubmit: validateForSubmit,
  getInfo: getInfo,
  hasAmout: hasAmout,
  checkPass: checkPass,
  submitOrder: submitOrder
}