import {
  collage
} from '../../collage/collage-model.js';
var _data = new collage()
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
      url: '/shop/Commend',
      type: 'POST',
      data: {
        shopcode: wx.getStorageSync('user').shopcode
      }
    }
    _data.getListData(id, this._callback)

  },
  _callback: function(res) {
    this.setData({
      data: res
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
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    var luser = _baseRequest._getUser();
    if (luser)
    return {
      title: this.data.data.title,
      imageUrl: this.data.data.SendImg,
      path: '/pages/user/recommend/Goldcard/Goldcard?shopid=' + luser.rsShopId + '&url=http://192.168.0.9:9002/VipCreateBuy/index_' + wx.getStorageSync('user').shopcode + '.html'

    }
  }
})