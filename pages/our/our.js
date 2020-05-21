// pages/our/our.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that=this
    wx.request({
      url: 'http://api2.jiangxinxiaozhen.com//Life/List',
      method: 'GET',
      data: {
        Status: '',
        UserId: '',
        LoginUserId: '2659',
        page: '1'
      },
      success: function(res) {
        that.setData({
          bannerlist: res.data.data.bannerlist,
          list: res.data.data.list
        })
      }
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