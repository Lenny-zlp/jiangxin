import {
  baseRequest
} from '../../../../until/baseRequest.js';
var _baseRequest = new baseRequest();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    incomelist:[],
    page: 0,
    type:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
        
  },
  getIncome: function () {
    var that = this;
    this.setData({
      page: this.data.page + 1

    })
    var para = {
      url: '/User/InComeList',
      type: 'POST',
      data: {
        userId: that.data.userid,
        type: that.data.type,
        pageIndex: that.data.page
      }
    }
    _baseRequest._request(para, function (res) {
      if (res.state.returnCode == 1) {
        that.setData({
          incomelist: that.data.incomelist.concat(res.data.dataList),
        })        
      }
      wx.hideLoading();
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var luser = _baseRequest._getUser();
    if (luser)
    {
      this.setData({
        userid: luser.userid
      })

      wx.showLoading({
        title: '加载中',
      })
      this.getIncome();
      }
      
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
    this.getIncome();
  },

  onTap:function(e){

    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      type:e.currentTarget.dataset.type,
      incomelist: [],
      page: 0,
    })
    this.getIncome();
  }
})