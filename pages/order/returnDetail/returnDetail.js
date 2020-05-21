
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
  onLoad: function (options) {
    this.getrefunddetail(options.refundid);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  getrefunddetail: function (refundid) {
    var that = this;
    var para = {
      url: '/Refund/detail/',
      type: 'GET',
      data: {
        userid: _baseRequest._getUser().userid,
        refundid: refundid,
      }
    }
    _baseRequest._request(para, function (res) {
      if (res.state.returnCode == 1) {
        that.setData({
          detail: res.data,
        })
      }
    });
  },
})