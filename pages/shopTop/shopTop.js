import {
  baseRequest
} from '../until/baseRequest.js';
var _base = new baseRequest();
var pageList = require('../until/pageList.js');
var href = require('../until/click.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buttonClicked: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      title: options.title
    })
    this.getShoptop(options.id, this._callback)
  },
  getShoptop: function(id, callBack) {
    var parms = {
      url: "/shop/Topic",
      type: 'GET',
      data: {
        id: id
      },
      sCallBack: function(res) {
        callBack && callBack(res.data.data)
      }
    }
    _base.request(parms)
  },
  _callback: function(res) {
    pageList.home(this, res)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function(res) {
    wx.setNavigationBarTitle({
      title: this.data.title
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  tapHref: function(event) {
    var code = event.currentTarget.dataset.code;
    var link = event.currentTarget.dataset.link;
    var linktype = event.currentTarget.dataset.linktype;
    if (!this.data.buttonClicked) {
      _base.buttonClicked(this)
      if (this.data.buttonClicked) {
        if (linktype == 1) {
          href.href('/pages/product/product?sku=' + event.currentTarget.dataset.sku + "&groupid=-1&grouplogid=0");
        } else if (linktype == 5) {
          href.href('/pages/product/webView/webView?url=' + link);
        }
      }
    }

  }
})