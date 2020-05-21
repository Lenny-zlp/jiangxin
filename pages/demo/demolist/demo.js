import {
  baseRequest
} from '../../until/baseRequest.js';
var _baseRequest = new baseRequest();

Page({
  data: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var para = {
      url: '/order/detail/',
      type: 'GET',
      data: {
        ordercode: 123,
        username: '001-11-01',
        v: 191
      }
    }
    _baseRequest._request(para, this._callback_success);
  },


  /**请求成功回调 */
  _callback_success: function (res) {
    wx.showToast({
      title: res.state.returnCode == 1 ? 'request success' : res.state.error,
      icon: "loading",
      duration: 30000
    })
  }
})