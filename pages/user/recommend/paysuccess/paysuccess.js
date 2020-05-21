import {
  baseRequest
} from '../../../until/baseRequest.js';
var _baseRequest = new baseRequest();
// pages/user/recommend/paysuccess/paysuccess.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    this.setData({ pid: options.pid })     
    var para = {
      url: "/Shop/PayFeesshowDialog",
      type: "POST",
      data: {
        PfId: that.data.pid
      }
    }
    _baseRequest._request(para, (res) => {
      if (res.state.returnCode > 0) {
        that.setData({ show: true })
      }
    })
  },
  closeBtn:function(){
    this.setData({ show: false })
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

})