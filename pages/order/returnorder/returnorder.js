
import {
  baseRequest
} from '../../until/baseRequest.js';
var _baseRequest = new baseRequest();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    refundlist: [],
    page: 0,
    ordercode: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getrefund();
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
    this.getrefund();
  },

  //切换标签或者点击更多
  getrefund: function () {
    var that = this;
    this.setData({
      page: this.data.page + 1

    })
    var para = {
      url: '/Refund/List/',
      type: 'GET',
      data: {
        userid: _baseRequest._getUser().userid,
        pagesize: 5,
        pageindex: that.data.page,
        ordercode: that.data.ordercode,
      }
    }
    _baseRequest._request(para, function (res) {
      if (res.state.returnCode == 1) {
        that.setData({
          refundlist: that.data.refundlist.concat(res.data),
        })
      }
    });
  },

})