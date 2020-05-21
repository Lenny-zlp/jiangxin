import {
  baseRequest
} from '../../../until/baseRequest.js';
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
  onLoad: function (options) {
    var para = {
      url: '/User/MyCost/',
      type: 'POST',
      data: {
        userid: _baseRequest._getUser().userid,
      }
    }
    _baseRequest._request(para, this._callback);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },


  /**查询回调函数*/
  _callback: function (res) {
    this.setData({
      model: res.data
    });
  },
})