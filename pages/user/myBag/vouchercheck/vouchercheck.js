import {
  baseRequest
} from '../../../until/baseRequest.js';
var _baseRequest = new baseRequest();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    pageindex: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var voucherId = options.voucherId;
    this.setData({
      voucherId: voucherId
    });
    var para = {
      url: '/User/VoucherList',
      type: 'POST',
      data: {
        pageindex: this.data.pageindex,
        source: 2,
        type: 1,
        userid: _baseRequest._getUser("user").userid
      }
    }
    _baseRequest._request(para, this._callback);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var pageindex = this.data.pageindex;
    var para = {
      url: '/User/VoucherList',
      type: 'POST',
      data: {
        pageindex: pageindex + 1,
        source: 2,
        type: 1,
        userid: _baseRequest._getUser("user").userid
      }
    }
    //上拉分页
    _baseRequest._request(para, this._callback_page);
  },

  /**返回 */
  onBack: function(e) {
    var pages = getCurrentPages();
    var giftcardno = e.currentTarget.dataset.giftcardno;
    var paidbycardisenabled = e.currentTarget.dataset.paidbycardisenabled;
    if (pages.length > 1) {
      //上一个页面实例对象
      var prePage = pages[pages.length - 2];
      prePage.changeDataForVoucher(giftcardno, paidbycardisenabled)
      wx.navigateBack({
        delta: 1
      })
    }
  },

  _callback: function(res) {
    if (res.state.returnCode == 1) {
      this.setData({
        list: res.data.dataList
      });
    } else {
      wx.showToast({
        title: res.state.error,
        icon: 'none',
        duration: 3000
      })
    }
  },

  _callback_page: function(res) {
    var list = this.data.list;
    var pageindex = this.data.pageindex;

    if (res.state.returnCode == 1) {
      this.setData({
        pageindex: pageindex + 1,
        list: list.concat(res.data.dataList)
      });
    } else {
      wx.showToast({
        title: res.state.error,
        icon: 'none',
        duration: 3000
      })
    }
  }

})