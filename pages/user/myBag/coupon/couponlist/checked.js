// pages/user/myBag/coupon/couponlist/checked.js
var js_request = require('request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    para: {
      buytype: 0,
      couponkeyid: 0,
      dg: 0,
      groupid: 0,
      qty: 0,
      sku: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var buytype = options.buytype ? options.buytype:this.data.para.buytype;
    var couponkeyid = options.couponkeyid ? options.couponkeyid : this.data.para.couponkeyid;
    var dg = options.dg ? options.dg : this.data.para.dg;
    var groupid = options.groupid ? options.groupid : this.data.para.groupid;
    var qty = options.qty ? options.qty : this.data.para.qty;
    var sku = options.sku ? options.sku : this.data.para.sku;

    var para = {
      buytype: buytype,
      couponkeyid: couponkeyid,
      dg: dg,
      groupid: groupid,
      qty: qty,
      sku: sku
    };
    this.setData({
      para: para
    });
    js_request.getInfo(this);
  },

  onBack:function(e){
    var pages = getCurrentPages();
    let { couponid, couponkeyid } = e.currentTarget.dataset;
    var couponcount = this.data.list.length;
    if (pages.length > 2) {
      //上一个页面实例对象
      var prePage = pages[pages.length - 2];
      prePage.changeDataForCoupon(couponid, couponkeyid, couponcount)
      wx.navigateBack({
        delta: 1
      })
    }
  }
})