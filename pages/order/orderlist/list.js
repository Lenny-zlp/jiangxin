// pages/order/orderlist/list.js
import {
  list
} from "list-model.js";
var _list = new list();
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
    orderList1: [], //返回订单列表
    pageindex: 1, //默认页码
    pagesize: 5, //每页5条数据
    status: -10, //默认状态：全部
    shownone: false, //是否显示暂无数据
    showLine: false, //是否显示下拉加载完毕提示
    timer: null,
    group_timer: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.status) {
      this.setData({
        status: options.status
      });
    }
    // 刷新组件
    this.refreshView = this.selectComponent("#refreshView");
    this.refreshView.autoHeight(280);

    //弹窗组件
    this.popup = this.selectComponent("#popup");
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // var data = {
    //   iscomment: this.data.status == 5 ? 0 : -10,
    //   pageindex: 1,
    //   pagesize: this.data.pagesize,
    //   status: this.data.status,
    //   username: '001-11-01'
    // }

    // //初次请求
    // wx.showLoading({
    //   title: '加载中',
    // })
    // _list.getList(data, this._callback);
    // this.setCountDown();
    //this.setCountDown();
  },
  onShow: function() {
    var _user = js_request._user();
    if (!_user) {
      return;
    } else {
      this.setData({
        _user: _user
      });
    }
    var data = {
      iscomment: this.data.status == 5 ? 0 : -10,
      pageindex: 1,
      pagesize: this.data.pagesize,
      status: this.data.status,
      username: _user.username
    }

    //初次请求
    wx.showLoading({
      title: '加载中',
    })
    _list.getList(data, this._callback);
  },

  /**
   * 切入其他页面或者页面隐藏时，清除定时器
   */
  onHide: function() {
    clearTimeout(this.data.timer);
    clearTimeout(this.data.group_timer);
  },

  /**
   * 页面卸载时（如页面回退），清除定时器
   */
  onUnload: function() {
    clearTimeout(this.data.timer);
    clearTimeout(this.data.group_timer);
  },
  onShareAppMessage: function(res) {
    var luser = _baseRequest._getUser();
    if (luser)
    return {
      title: this.data.group.SendTitle,
      path: "pages/collage/collagedetail/detail?OrderCode=" + this.data.ordercode + "&UserId=" + this.data._user.userid + '&shopid=' + luser.rsShopId,
      imageUrl: this.data.group.SendImg
    }
  },
  //触摸开始
  handletouchstart: function(event) {
    this.refreshView.handletouchstart(event)
  },
  //触摸移动
  handletouchmove: function(event) {
    this.refreshView.handletouchmove(event)
  },
  //触摸结束
  handletouchend: function(event) {
    this.refreshView.handletouchend(event)
  },
  //触摸取消
  handletouchcancel: function(event) {
    this.refreshView.handletouchcancel(event)
  },
  //页面滚动
  onPageScroll: function(event) {
    this.refreshView.onPageScroll(event)
  },
  onPullDownRefresh: function() {
    var data = {
      iscomment: this.data.status == 5 ? 0 : -10,
      pageindex: 1,
      pagesize: this.data.pagesize,
      status: this.data.status,
      username: this.data._user.username
    }
    setTimeout(() => {
      _list.getList(data, this._callback);
      this.refreshView.stopPullRefresh()
    }, 1000)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.orderList1.length <= 0) {
      return;
    }
    var pageindex = this.data.pageindex;
    var data = {
      iscomment: this.data.status == 5 ? 0 : -10,
      pageindex: pageindex + 1,
      pagesize: this.data.pagesize,
      status: this.data.status,
      username: this.data._user.username
    }

    //上拉分页
    _list.getList(data, this._callback_page);
  },

  /**
   * 列表回调函数-默认
   */
  _callback: function(res) {
    wx.hideLoading();
    this.setData({
      pageindex: 1,
      showLine: false,
      shownone: res.OrderList.length <= 0,
      orderList1: res.OrderList
    });
    wx.hideShareMenu();
    clearTimeout(this.data.timer); //先清空定时器
    //this.initCountDonw();
    this.setCountDown(); //设置定时器
  },

  /**
   * 列表回调函数-分页加载
   */
  _callback_page: function(res) {
    wx.hideLoading();
    var orderList = this.data.orderList;
    var pageindex = this.data.pageindex;

    if (res.OrderList.length <= 0) {
      this.setData({
        showLine: true
      });
    }
    this.setData({
      shownone: false,
      pageindex: pageindex + 1,
      orderList1: orderList.concat(res.OrderList)
    });
  },

  /**
   * 切换标签 
   */
  onTap: function(e) {
    var status = e.currentTarget.dataset.status;
    this.setData({
      orderList: [],
      pageindex: 1,
      pagesize: 5,
      status: status,
      showLine: false
    });

    //先清空数据然后回到顶部
    wx.pageScrollTo({
      scrollTop: 0
    });
    var data = {
      iscomment: status == 5 ? 0 : -10,
      pageindex: 1,
      pagesize: this.data.pagesize,
      status: status,
      username: this.data._user.username
    }
    wx.showLoading({
      title: '加载中',
    })
    _list.getList(data, this._callback);
  },

  /**邀请参团 */
  toGroup: function(e) {
    var ordercode = e.currentTarget.dataset.ordercode;
    js_request.toGroup(this, ordercode);
  },

  /**立即付款 */
  toPay: function(e) {
    var ordercode = e.currentTarget.dataset.ordercode;
    wx.navigateTo({
      url: '/pages/order/dualPayment/dualPayment?ordercode=' + ordercode,
    })
  },
  /**取消订单 */
  toCancel: function(e) {
    var that = this;
    var ordercode = e.currentTarget.dataset.ordercode;
    wx.showModal({
      title: '提示',
      content: '确定取消订单？',
      success: function(res) {
        if (res.confirm) {
          js_request.toCancel(that, ordercode);
        }
      }
    });
  },
  /**去评论 */
  toReviews: function(e) {
    var i = e.currentTarget.dataset.ordercode;
    let detail = this.data.orderList.filter((item) => {
      return item.ordercode == i
    })
    let orderArr = detail[0].Details.filter((item) => {
      return item.ProductType != 2 && item.ProductType != 3
    })
    wx.navigateTo({
      url: '/pages/order/comment/comment?detail=' + JSON.stringify(orderArr) + '&ordercode=' + i,
    })

  },
  /**删除订单 */
  toDel: function(e) {
    var that = this;
    var ordercode = e.currentTarget.dataset.ordercode;
    wx.showModal({
      title: '提示',
      content: '确定删除订单？',
      success: function(res) {
        if (res.confirm) {
          js_request.toDel(that, ordercode);
        }
      }
    });
  },

  /**确认收货 */
  toConfirm: function(e) {
    var that = this;
    var ordercode = e.currentTarget.dataset.ordercode;
    wx.showModal({
      title: '提示',
      content: '确认收货?',
      success: function(res) {
        if (res.confirm) {
          js_request.toConfirm(that, ordercode);
        }
      }
    });
  },

  // 查看物流
  toLogistics: function(e) {
    var that = this;
    var ordercode = e.currentTarget.dataset.ordercode;
    wx.navigateTo({
      url: '/pages/order/logistics/logistics?ordercode=' + ordercode,
    })
  },
  /**
   * 初始化倒计时
   */
  initCountDonw: function() {
    var listData = this.data.orderList1;
    let list = listData.map((v, i) => {
      //支付倒计时
      if (v.PayCountDown <= 0) {
        v.PayCountDown = 0;
      }

      //团购倒计时
      if (v.GroupCountDown <= 0) {
        v.GroupCountDown = 0
      }
      let formatTime = this.getFormat(v.PayCountDown);
      v.PayCountDown -= 1;
      let formatTime_group = this.getFormat(v.GroupCountDown);
      v.GroupCountDown -= 1;
      if (formatTime.dd > 0) {
        v.pay_countdown = `${formatTime.dd}天${formatTime.hh}:${formatTime.mm}:${formatTime.ss}`;
      } else {
        v.pay_countdown = `${formatTime.hh}:${formatTime.mm}:${formatTime.ss}`;
      }
      if (formatTime_group.dd > 0) {
        v.pay_countdown_group = `${formatTime_group.dd}天${formatTime_group.hh}:${formatTime_group.mm}:${formatTime_group.ss}`;
      } else {
        v.pay_countdown_group = `${formatTime_group.hh}:${formatTime_group.mm}:${formatTime_group.ss}`;
      }
      return v;
    })
    this.setData({
      orderList: list
    });
  },
  /**
   * 倒计时
   */
  setCountDown: function() {
    var listData = this.data.orderList1;
    let list = listData.map((v, i) => {
      //支付倒计时
      if (v.PayCountDown <= 0) {
        v.PayCountDown = 0;
      }

      //团购倒计时
      if (v.GroupCountDown <= 0) {
        v.GroupCountDown = 0
      }
      let formatTime = this.getFormat(v.PayCountDown);
      v.PayCountDown -= 1;
      let formatTime_group = this.getFormat(v.GroupCountDown);
      v.GroupCountDown -= 1;
      if (formatTime.dd > 0) {
        v.pay_countdown = `${formatTime.dd}天${formatTime.hh}:${formatTime.mm}:${formatTime.ss}`;
      } else {
        v.pay_countdown = `${formatTime.hh}:${formatTime.mm}:${formatTime.ss}`;
      }
      if (formatTime_group.dd > 0) {
        v.pay_countdown_group = `${formatTime_group.dd}天${formatTime_group.hh}:${formatTime_group.mm}:${formatTime_group.ss}`;
      } else {
        v.pay_countdown_group = `${formatTime_group.hh}:${formatTime_group.mm}:${formatTime_group.ss}`;
      }
      return v;
    })
    this.setData({
      orderList: list
    });

    var timer = setTimeout(this.setCountDown, 1000);
    this.setData({
      timer: timer
    });
  },

  /**
   * 格式化时间
   */
  getFormat: function(msec) {
    let ss = parseInt(msec);
    let mm = 0;
    let hh = 0;
    let dd = 0;
    if (ss > 60) {
      mm = parseInt(ss / 60);
      ss = parseInt(ss % 60);
      if (mm > 60) {
        hh = parseInt(mm / 60);
        mm = parseInt(mm % 60);
        if (hh > 24) {
          dd = parseInt(hh / 24);
          hh = parseInt(hh % 24);
        }
      }
    }
    ss = ss > 9 ? ss : `0${ss}`;
    mm = mm > 9 ? mm : `0${mm}`;
    hh = hh > 9 ? hh : `0${hh}`;
    return {
      ss,
      mm,
      hh,
      dd
    };
  }
})