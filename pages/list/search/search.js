import{baseRequest}from"../../until/baseRequest.js";
var base=new baseRequest;
Page({

  /**
   * 页面的初始数据
   */
  data: {
     pageindex:1,
     list:[]
  },
  onLoad:function(options){
    this.setData({
      keyword: options.keyword
    })
    wx.showLoading();
    this.getdata()
  },
  getdata:function(){
    var id = {
      url: '/Product/Search',
      type: 'POST',
      data: {
        categoryid: 0,
        keyword: this.data.keyword,
        page: this.data.pageindex
      }
    }
    base._request(id, this._callback)
  },
  _callback:function(res){
    wx.hideLoading();
    var newlist = this.data.list
    this.setData({
      list: newlist.concat(res.data.plist)
    })
  },
  onReachBottom: function () {
   this.setData({
     pageindex:this.data.pageindex+1
   })
    wx.showLoading();
    this.getdata()
  }
})