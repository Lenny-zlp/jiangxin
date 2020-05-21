import {
  baseRequest
} from '../../until/baseRequest.js';
var _baseRequest = new baseRequest();
Page({
  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var id = {
      url: "/Standard/Index",
      type: 'GET',
      data: {
        productCode: options.productcode
      }
    }
    _baseRequest._request(id, this._callback)
  },
  _callback: function(res) {
    this.setData({
      content: res.data
    })
  },
  Toreport: function(e) {
    var list = e.currentTarget.dataset.list;
    if (list.length > 0) {
      wx.setStorage({
        key: 'report',
        data: e.currentTarget.dataset.list
      })
      wx.navigateTo({
        url: '/pages/product/standard/report/report',
      })
    }
  }

})