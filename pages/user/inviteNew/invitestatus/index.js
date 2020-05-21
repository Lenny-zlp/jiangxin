import {
  baseRequest
} from '../../../until/baseRequest.js';
var _baseRequest = new baseRequest();
// pages/user/inviteNew/invitestatus/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contentShow: false,
    userNickName: '',
    userhead: '',
    refuserid: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      contentShow: options.rIsnew = 1 ? false : true,
      refuserid: options.refuserid
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    var id = {
      url: '/UserCenter/GetUserNick',
      type: 'GET',
      data: {
        userId: that.data.refuserid,
      }
    }
    _baseRequest._request(id, (res) => {
      that.setData({
        data: res.data
      })
    })
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