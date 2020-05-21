import {
  baseRequest
} from '../../until/baseRequest.js';
var _baseRequest = new baseRequest();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    followerlist: [],
    page: 0,
    finish:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    wx.showLoading({
      title: '加载中',
    })
    this.getFollower();
   
  },
  getFollower: function () {
    var that = this;
    this.setData({
      page: this.data.page + 1
    })
    var para = {
      url: '/account/MyCustomerList',
      type: 'POST',
      data: {
        pageIndex: that.data.page,
        SearchName: '',
        v: '1',
        userId: _baseRequest._getUser().userid,
        loginName: _baseRequest._getUser().reLoginName,
    }}
    _baseRequest._request(para, function (res) {
      if (res.state.returnCode == 1) {
        if(res.data.list.length>0)
        {
        that.setData({
          followerlist: that.data.followerlist.concat(res.data.list)
        })
        }
        else
        {
          that.setData({
            finish: 1
          }) 
        }
        wx.hideLoading();
      }
    });
  },

  /**
 * 页面上拉触底事件的处理函数
 */
  onReachBottom: function () {
    if (this.data.finish == 1) {
     return false;
    }
    wx.showLoading({
      title: '加载中',
    })
    this.getFollower();
  }


})