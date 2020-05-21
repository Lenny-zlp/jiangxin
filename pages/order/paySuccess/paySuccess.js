import {
  baseRequest
} from '../../until/baseRequest.js';
var _baseRequest = new baseRequest();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    model: null,
    ordercode:0,
    rlist: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var ordercode = options.ordercode;
    this.setData({ ordercode:ordercode});
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  // onReady: function() {
  //   var para = {
  //     url: '/product/getProductRecommend',
  //     type: 'POST',
  //     data: null
  //   }
  //   _baseRequest._request(para, this._callback_recommand);
  // },

  onShow: function() {
    var para = {
      url: '/order/success/',
      type: 'POST',
      data: {
        ordercode: this.data.ordercode,
        userid: _baseRequest._getUser().userid
      }
    }
    _baseRequest._request(para, this._callback);
  },

  _callback: function(res) {
    if (res.state.returnCode == 1) {
      this.setData({
        model: res.data
      })
      this.getRecCom()
    } else {
      wx.showToast({
        title: res.state.error,
        icon: 'none'
      })
    }
    
  },
  getRecCom: function () {
    var that = this;
    var para = {
      url: '/product/ProductRecommend',
      type: 'GET',
      data: {
        skus: that.data.model.skus
      }
    }
    _baseRequest._request(para, function (res) {
      that.setData({
        RecCom: res.data
      })
    })
  },
  // 推荐商品点击跳转
  hrefUrl: function (e) {
    wx.navigateTo({
      url: "/pages/product/product?sku=" + e.currentTarget.dataset.sku
    })
  },
  // _callback_recommand: function(res) {
  //   if (res.state.returnCode == 1) {
  //     this.setData({
  //       rlist: res.data.list
  //     })
  //   } else {
  //     wx.showToast({
  //       title: res.state.error,
  //       icon: 'none'
  //     })
  //   }
  // }
})