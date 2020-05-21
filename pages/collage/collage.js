var href = require('../until/click.js')
import {
  collage
} from 'collage-model.js';
var _collage = new collage()
import {
  baseRequest
} from '../until/baseRequest.js';
var _baseRequest = new baseRequest();
var timegroup = require('../until/timegroup.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 'false',
    pageIndex: 1,
    v: '',
    GroupList: [],
    shownone: false, //是否显示暂无数据
    showLine: false, //是否显示下拉加载完毕提示,
    setTime: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      v: options.v
    })
    var user = wx.getStorageSync('user')
    if (!user) {
      wx.hideShareMenu()
    }
  },
  onShow: function(options) {
    this.popup = this.selectComponent("#popup");

    wx.showNavigationBarLoading()
    var url = "/GroupActivity/GetGroupActivityList",
      UserId = "",
      id = ""
    if (this.data.v == "v2") {
      this.setData({
        active: 'true'
      });
      var luser = _baseRequest._getUser();
      if (luser) {
        id = {
          url: "/GroupActivity/GetMyGroupActivityList",
          data: {
            UserId: luser.userid,
            pageIndex: this.data.pageIndex
          }
        }
        _collage.getListData(id, this._callback)
      }
      //console.log(luser)

    } else {
      id = {
        url: "/GroupActivity/GetGroupActivityList",
        data: {
          type: ''
        }
      }
      _collage.getListData(id, this._callback)
    }


  },
  _closePopup: function() {
    this.popup.hide();
  },
  _callback: function(res) {
    wx.hideNavigationBarLoading()
    var user = wx.getStorageSync('user')
    if (!user) {
      wx.hideShareMenu()
    }
    if (res.GroupActivityList) {
      this.setData({
        topImg: res.HeadTopImg,
        list: res.GroupActivityList
      });
    }
    if (res.GroupList) {
      var arr = this.data.GroupList
      this.setData({
        recount: res.recount,
        GroupList: arr.concat(res.GroupList)
      })
      let list1 = this.data.GroupList.map((v, i) => {
        if (v.GroupDown > 0) {
          var temp = timegroup.initinterval(v.GroupDown)
          v.showpopuptime = temp
          if (temp.d > 0) {
            v.pay_countdown = `${temp.d}天${temp.h}:${temp.s}:${temp.m}`;
          } else {
            v.pay_countdown = `${temp.h}:${temp.s}:${temp.m}`;
          }
        }
        return v
      })
      this.setData({
        GroupList: list1
      });
      clearTimeout(this.data.setTime)
      this.interval();
    }
  },
  interval: function() {

    let list1 = this.data.GroupList.map((v, i) => {
      v.GroupDown--
        var num = v.GroupDown
      if (num > 0) {
        num--;
        var temp = timegroup.initinterval(num)
        v.showpopuptime = temp
        if (temp.d > 0) {
          v.pay_countdown = `${temp.d}天${temp.h}:${temp.s}:${temp.m}`;
        } else {
          v.pay_countdown = `${temp.h}:${temp.s}:${temp.m}`;
        }
      }
      return v
    });
    this.setData({
      GroupList: list1
    });
    this.data.setTime = setTimeout(this.interval, 1000)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onhref: function(event) {
    var url = "/pages/product/product?sku=" + event.currentTarget.dataset.sku + "&groupid=" + event.currentTarget.dataset.groupid + "&grouplogid=0";
    href.href(url)
  },
  collageListLink: function(event) {
    this.setData({
      v: '',
      active: 'false',
      GroupList: [],
      pageIndex: 1
    })
    this.onShow();
  },
  collageMyLink: function(event) {
    this.setData({
      v: 'v2',
      active: 'true',
      GroupList: [],
      pageIndex: 1
    })
    this.onShow();
  },
  /**取消订单 */
  cancel_order: function(e) {
    var that = this;
    var ordercode = e.currentTarget.dataset.oc;
    wx.showModal({
      title: '提示',
      content: '确定取消订单？',
      success: function(res) {
        if (res.confirm) {
          var luser = _baseRequest._getUser();
          if (luser) {
            var para = {
              url: "/order/Cancel",
              type: "POST",
              data: {
                ordercode: ordercode,
                userid: luser.userid
              }
            }
            _baseRequest._request(para, that._callback_cancel);
          }
        }
      }
    });
  },

  /**删除订单 */
  del_order: function(e) {
    var that = this;
    var ordercode = e.currentTarget.dataset.oc;
    wx.showModal({
      title: '提示',
      content: '确定删除订单？',
      success: function(res) {
        if (res.confirm) {
          var luser = _baseRequest._getUser();
          if (luser) {
            var para = {
              url: "/order/Del",
              type: "POST",
              data: {
                ordercode: ordercode,
                userid: luser.userid
              }
            }
            _baseRequest._request(para, that._callback_del);
          }
        }
      }
    });
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
      this.setData({
        pageIndex: 1,
        GroupList: []
      })
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
        duration: 1000,
        mask: true
      });
      this.setData({
        pageIndex: 1,
        GroupList: []
      })
      //删除成功重新刷新
      this.onShow()
    }
  },
  onReachBottom: function() {
    if (this.data.recount == this.data.GroupList.length) {
      // wx.showToast({
      //   title: '已经到底啦！！！',
      //   icon: 'none'
      // })
    } else {
      this.setData({
        pageIndex: this.data.pageIndex + 1
      })
      this.onShow();
    }
  },
  onHide: function() {
    this.setData({
      GroupList: [],
      pageIndex: 1
    })
  },
  /**邀请成团 */
  send_order: function(e) {
    var that = this;
    var ordercode = e.currentTarget.dataset.oc;
    var luser = _baseRequest._getUser();
    this.setData({
      ordercode: ordercode,
      i: e.currentTarget.dataset.ind
    })
    if (luser) {
      var para = {
        url: "/GroupActivity/GroupCommend",
        type: "POST",
        data: {
          ordercode: ordercode,
          shopcode: luser.shopcode
        }
      }
      _baseRequest._request(para, that._callback_send);
    }
  },
  /**邀请成团回调函数*/
  _callback_send: function(res) {
    var that = this
    if (res.state.returnCode = 1) {
      this.popup.show();
      /**GroupDown 倒计时*/
      this.setData({
        sendTitle: res.data.SendTitle,
        sendContent: res.data.SendContent,
        sendImg: res.data.SendImg,
        persons: res.data.Persons,
        isHasGroup: res.data.IsHasGroup,
        sendStr: res.data.SendStr,
        sendStr1: res.data.SendStr1,
        hasGroupStr: res.data.IsHasGroup == 1 ? "开团成功" : "参团成功"
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {    
    if (res.from === 'button') {
      var luser = _baseRequest._getUser();
      if (luser) {
        return {
          title: this.data.sendTitle,
          path: '/pages/collage/collagedetail/detail?OrderCode=' + this.data.ordercode + '&shopid=' + luser.rsShopId,
          imageUrl: this.data.sendImg
        }
      }
    } else {
      var luser = _baseRequest._getUser();
      if (luser) {
        return {
          title: '小镇拼团',
          path: '/pages/collage/collage?v=v1' + '&shopid=' + luser.rsShopId,
        }
      }
    }
  }
})