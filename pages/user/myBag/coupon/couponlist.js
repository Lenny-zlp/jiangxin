import {
  baseRequest
} from '../../../until/baseRequest.js';
var base = new baseRequest()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgGary: false,
    pageindex: 1,
    type: 1,
    
    pageindex: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showNavigationBarLoading()
    var id = {
      url: '/Coupon/Coupons',
      type: 'POST',
      data: {
        type: 1,
        userid: base._getUser().userid,
        pageindex: 1
      }
    }
    base._request(id, this._callback)
  },
  _callback: function(res) {
    wx.hideNavigationBarLoading()
    this.setData({
      list: res.data
    });
    if (this.data.type == 3) {
      this.setData({
        bgGary: true
      })
    };
    this.show()
  },
  show: function() {
    let list1 = this.data.list.list.map((v, i) => {
      if (v.Remarks.length > 30) {
        v.show = true;
        v.arrow = false;
      } else {
        v.show = false
        v.arrow = true;
      }
      return v
    });
    this.setData({
      coupon: list1
    })
  },
  moreRemarks: function(e) {
    var ind = e.target.dataset.ind;
    let list1 = this.data.coupon.map((v, i) => {
      if (ind == i) {
        v.arrow = !v.arrow
      }
      return v
    });
    this.setData({
      coupon: list1
    })
  },
  ontab: function(e) {
    wx.showNavigationBarLoading();
    this.setData({
      pageindex:1,
      coupon:[]
    })
    var id = {
      url: '/Coupon/Coupons',
      type: 'POST',
      data: {
        type: e.target.dataset.type,
        userid: wx.getStorageSync('user').userid,
        pageindex: '1'
      }
    }
    base._request(id, this._callback);
    this.setData({
      type: e.target.dataset.type
    })
    if (e.target.dataset.type != 3) {
      this.setData({
        bgGary: false
      })
    }
    this.show()
  },
  scrollLoad: function(e) {
    wx.showNavigationBarLoading()
    var type = e.currentTarget.dataset.type, page = this.data.pageindex;
    var id = {
      url: '/Coupon/Coupons',
      type: 'POST',
      data: {
        type: type,
        userid: wx.getStorageSync('user').userid,
        pageindex: page+1
      }
    }
    base._request(id, this._callback_page);
  },

  del: function (e) {
    var r = {
      url: '/Coupon/DelCouponById',
      type: 'POST',
      data: {
        id: e.currentTarget.dataset.cid,
      }
    }
    base._request(r, (res) => {
      wx.showToast({
        title: res.data.info,
        icon: 'none',
        duration: 1500
      })
      var id = {
        url: '/Coupon/Coupons',
        type: 'POST',
        data: {
          type: 3,
          userid: base._getUser().userid,
          pageindex: 1
        }
      }
      base._request(id, this._callback)
     
      
    })
  },

  _callback_page:function(res){
    wx.hideNavigationBarLoading()
    var coupon = this.data.coupon;
    this.setData({
      list:res.data
    })
    this.show()
    this.setData({
      coupon: coupon.concat(this.data.coupon),
      pageindex:this.data.pageindex+1
    })
   
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this;
    let query = wx.createSelectorQuery();
    query.select('.couponTab').boundingClientRect();
    query.exec(function(res) {
    
      that.setData({
        height: wx.getSystemInfoSync().windowHeight - res[0].height
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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
})