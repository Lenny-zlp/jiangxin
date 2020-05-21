import {
  baseRequest
} from '../../until/baseRequest.js';
var _baseRequest = new baseRequest();
var js_request = require('request.js');
var js_countdown = require('../../until/countdown.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    detail: null,
    status: -10,
    dd: '00',
    hh: '00',
    mm: '00',
    ss: '00',
    pay_timer: null,
    //group_timer:null,
    group_end_timer: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      ordercode: options.ordercode,
      status: options.status ? options.status : -10
    });
  },
  onReady: function() {
    // //弹窗组件
    // this.popup = this.selectComponent("#popup");
    // var para = {
    //   url: '/order/detail/',
    //   type: 'GET',
    //   data: {
    //     ordercode: this.data.ordercode,
    //     username: this.data._user.username,
    //     v: 191
    //   }
    // }
    // _baseRequest._request(para, this._callback);
  },
  onShow: function() {
    wx.showLoading({
      title: '订单加载中...',
    })
    var _user = _baseRequest._getUser();
    if (!_user) {
      return;
    } else {
      this.setData({
        _user: _user
      });
    }
    //弹窗组件
    this.popup = this.selectComponent("#popup");
    var para = {
      url: '/order/detail/',
      type: 'GET',
      data: {
        ordercode: this.data.ordercode,
        username: _user.username,
        v: 201
      }
    }
    _baseRequest._request(para, this._callback);

  },

  onHide: function() {
    clearInterval(this.data.pay_timer);
    //clearInterval(this.data.group_timer);
    clearInterval(this.data.group_end_timer);
  },
  onUnload: function() {
    clearInterval(this.data.pay_timer);
    //clearInterval(this.data.group_timer);
    clearInterval(this.data.group_end_timer);
  },
  onShareAppMessage: function(res) {
    if (this.data.group) {
      var shopid = _baseRequest._getShopId();
      return {
        title: this.data.group.SendTitle,
        path: "/pages/collage/collagedetail/detail?OrderCode=" + this.data.ordercode + "&UserId=" + this.data._user.userid + '&shopid=' + shopid,
        imageUrl: this.data.group.SendImg
      }
    }
  },
  /**
   * 复制订单号
   */
  clipboard: function(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.ordercode
    })
  },

  /**取消订单 */
  cancel_order: function() {
    var that = this;
    var ordercode = this.data.ordercode
    wx.showModal({
      title: '提示',
      content: '确定取消订单？',
      success: function(res) {
        if (res.confirm) {
          var para = {
            url: "/order/Cancel",
            type: "POST",
            data: {
              ordercode: ordercode,
              userid: that.data._user.userid
            }
          }
          _baseRequest._request(para, that._callback_cancel);
        }
      }
    });
  },

  /**删除订单 */
  del_order: function() {
    var that = this;
    var ordercode = this.data.ordercode
    wx.showModal({
      title: '提示',
      content: '确定删除订单？',
      success: function(res) {
        if (res.confirm) {
          var para = {
            url: "/order/Del",
            type: "POST",
            data: {
              ordercode: ordercode,
              userid: that.data._user.userid
            }
          }
          _baseRequest._request(para, that._callback_del);
        }
      }
    });
  },

  /**邀请参团 */
  to_group: function() {
    js_request.toGroup(this);
  },

  /**立即付款 */
  pay_order: function() {
    wx.navigateTo({
      url: '/pages/order/dualPayment/dualPayment?ordercode=' + this.data.ordercode
    })
  },

  /**确认收货 */
  to_confirm: function() {
    var that = this;
    var ordercode = this.data.ordercode
    wx.showModal({
      title: '提示',
      content: '确认收货？',
      success: function(res) {
        if (res.confirm) {
          js_request.toConfirm(that, that.data.ordercode);
          that.onShow()
        }
      }
    });
  },

  /**拼团详情 */
  to_groupDetail: function() {
    wx.navigateTo({
      url: "/pages/collage/collagedetail/detail?OrderCode=" + this.data.ordercode + "&UserId=" + this.data._user.userid,
    })
  },
  /**去评论 */
  to_reviews: function() {
    let orderArr = this.data.detail.OrderDetails.filter((item) => {
      return item.ProductType != 2 && item.ProductType != 3
    })
    wx.navigateTo({
      url: '/pages/order/comment/comment?detail=' + JSON.stringify(orderArr) + '&ordercode=' + this.data.ordercode,
    })

  },
  /**查询回调函数*/
  _callback: function(res) {
    if (res.state.returnCode == 1) {
      var pay_countdown = null;
      var pay_timer = js_countdown.setTime(this, res.data.CountDown, 'pay_countdown', pay_countdown);

      var group_end_countdown = null;
      var group_end_timer = js_countdown.setTime(this, res.data.GroupCountDown, 'group_end_countdown', group_end_countdown);
      this.setData({
        detail: res.data,
        pay_timer: pay_timer,
        group_end_timer: group_end_timer
      });
      if (this.data.detail.TransferCode) {
        js_request.logistics(this);
      }
    } else {
      wx.showToast({
        title: res.state.error,
        icon: 'none',
        duration: 3000
      })
      setTimeout(function() {
        wx.navigateBack({
          delta: 1
        })
      }, 3000);
    }
    wx.hideLoading();
    wx.hideShareMenu();
  },

  /**取消订单回调函数*/
  _callback_cancel: function(res) {
    if (res.state.returnCode == '1') {
      wx.showToast({
        title: '取消成功',
        icon: 'succes',
        duration: 1000,
        mask: true
      });

      //取消成功重新刷新
      this.onShow()
    }
  },

  /**删除订单回调函数*/
  _callback_del: function(res) {
    if (res.returnCode = 1) {
      wx.showToast({
        title: '删除成功',
        icon: 'succes',
        duration: 2500,
        mask: true
      });

      //删除成功回到列表页
      // wx.navigateTo({
      //   url: '/pages/order/orderlist/list?status=' + this.data.status,
      // })
      setTimeout(function() {
        wx.navigateBack();
      }, 2500);

    }
  },

  /**修改地址后回调此方法 */
  //changeData: function() {
  //this.onShow();
  //}

})