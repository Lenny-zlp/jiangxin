import {
  collage
} from '../../../collage/collage-model.js';
var _data = new collage()
import {
  baseRequest
} from '../../../until/baseRequest.js';
var _baseRequest = new baseRequest();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: '1'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  onShow: function(options) {
    var thatapp = getApp();
    var that = this;
    wx.getStorage({
      key: 'user',
      success(res) {
        var id = {
          url: '/UserCenter/InvitationRecord',
          type: 'GET',
          data: {
            userId: res.data.userid,
            shopCode: res.data.shopcode,
            pageIndex: "1"
          }
        }
        _data.getListData(id, that._callback)
      },
      fail: function() {
        thatapp._getWxShouquan()
      }
    })
  },

  _callback: function(res) {
    this.setData({
      data: res
    })
  },
  ontaggle: function(e) {
    var num = e.target.dataset.ind
    if (this.data.show != num) {
      this.setData({
        show: num
      })
    }
  },



  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    var luser = _baseRequest._getUser();
    if (luser)
    return {
      title: this.data.data.ShareTitle,
      imageUrl: this.data.data.ShareIcon,
      path: 'pages/user/inviteNew/invitenewto/index?url=' + wx.getStorageSync('user').shopcode + '&isWxlogin=1&shopid=' + luser.rsShopId
    }
  }
})