import {
  baseRequest
} from "../../../until/baseRequest.js";
var base = new baseRequest;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageindex: 1,
    type: 1,
    datalist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showNavigationBarLoading()
    this.base(this.data.pageindex)
  },
  base: function(page) {
    var id = {
      url: "/User/VoucherList",
      type: 'POST',
      data: {
        pageindex: page,
        source: 0,
        type: this.data.type,
        userid: base._getUser().userid,
      }

    }
    base._request(id, this.callback)
  },
  callback: function(res) {
   
    wx.hideNavigationBarLoading()
    this.setData({
      data: res.data,
      normal:res.data.Normal,
      Expire: res.data.Expire,
      datalist:this.data.datalist.concat(res.data.dataList)
    })
  },
  onClickTab: function(e) {
    this.setData({
      type: e.target.dataset.type,
      data:[],
      pageindex:1,
      datalist:[]
    })
    wx.showNavigationBarLoading()
    this.base(this.data.pageindex)
  },
  onReachBottom: function () {  
    wx.showNavigationBarLoading()
    this.setData({ pageindex: this.data.pageindex + 1 }) 
    this.base(this.data.pageindex);
    if(this.data.data.rows==this.data.datalist.length){
      wx.showToast({
        title: '暂无更多信息',
        icon:'none'
      })
    }
  }
})