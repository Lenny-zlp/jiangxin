import {
  baseRequest
} from '../../until/baseRequest.js';
var _baseRequest = new baseRequest();

/**加载页面 */
// function getInfo(that) {
//   wx.request({
//     url: _baseRequest.domain() + "/shopping/orderinfo/",
//     method: 'GET',
//     data: _baseRequest.getSignData({
//       data: {
//         addressId:that.data.addressid,
//         shopid: _baseRequest._getUser().shopid,
//         userid: _baseRequest._getUser().userid,
//         AppVersion: 264,
//         virtualaccountisenabled: that.data.useAmount,
//         couponid: that.data.couponid,
//         couponkeyid: that.data.couponkeyid,
//         sku: that.data.sku,
//         qty: that.data.qty,
//         dg: that.data.dg,
//         cardtype: that.data.cardtype,
//         giftcardno: that.data.giftcardno,
//         paidbycardisenabled: that.data.paidbycardisenabled,
//         buytype: that.data.buytype,
//         couponcount: that.data.couponcount,
//         login_token: _baseRequest._getUser().logintoken
//       }
//     }),
//     header: {
//       "content-type": "application/x-www-form-urlencoded"
//     },
//     success: function(res) {
//       wx.hideLoading();
//       if (res.statusCode == 200) { //返回数据成功
//         if (res.data.state.returnCode == 1) {
//           that.setData({
//             paytypeid: res.data.data.model.ShiJiZhiFu > 0 ? 12 : res.data.data.model.DisAmount > 0 ? 6 : 7,
//             model: res.data.data.model,
//           });
//         } else {
//           wx.showToast({
//             title: res.data.state.error,
//             icon: 'none',
//             duration: 3000
//           })
//         }
//       } else { //返回数据失败
//         wx.showToast({
//           title: '服务器内部错误！',
//           icon: 'none',
//           duration: 3000
//         })
//       }
//     }
//   })
// }

/**验证有没有设置支付密码 */
function hasAmout(that) {
  wx.request({
    url: _baseRequest.domain() + "/User/MyCost/",
    method: 'POST',
    data: _baseRequest.getSignData({
      data: {
        userid: _user().userid
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
              url: "/pages/user/myBag/fund/setpassword/password"
            })
          } else {
            if (that.data.useamount == 0) {
              that.setData({
                useamount: 1,
                payWrap: true
              });
            } else {
              that.setData({
                useamount: 0,
                payWrap: false
              });
              that.onShow();
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
        userid: _user().userid,
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
            useamount: 1,
            payWrap: false
          });
          that.onShow();
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

/**点击支付 */
function payAgain(that) {
  wx.request({
    url: _baseRequest.domain() + "/Order/PayAgain/",
    method: 'POST',
    data: _baseRequest.getSignData({
      data: {
        ordercode: that.data.ordercode,
        useamount: that.data.useamount,
        userid: _user().userid,
        login_token: that.data.login_token
      }
    }),
    header: {
      "content-type": "application/x-www-form-urlencoded"
    },
    success: function(res) {
      if (res.statusCode == 200) { //返回数据成功
        if (res.data.state.returnCode == 1) {
          if (that.data.model.order.PayPrice > 0) //余额没有支付完剩余的调用微信支付
          {
            wxPay(that, that.data.ordercode);
          } else //余额支付完跳转到支付成功页面
          {
            if (that.data.model.order.OrderType == 2) {
              wx.redirectTo({
                url: "/pages/collage/paysuccess/paysuccess?OrderCode=" + that.data.ordercode
              })
            } else {
              wx.redirectTo({
                url: "/pages/order/paySuccess/paySuccess?ordercode=" + that.data.ordercode,
              })
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


/**请求微信支付 */
function wxPay(that, ordercode) {
  //获取openid，回调是为了保证百分百能获取到
  _baseRequest._getOpenId(that.callback_pay);
}


function _user() {
  return _baseRequest._getUser();
}

module.exports = {
  // getInfo: getInfo,
  hasAmout: hasAmout,
  checkPass: checkPass,
  payAgain: payAgain,
  wxPay: wxPay,
  _user: _user
}