import {
  baseRequest
} from '../../until/baseRequest.js';
var base = new baseRequest();
Page({

  /**
   * 页面的初始数据
   */
  data: {
   datalist:null,
   pageIndex :'1',
   topshow:false
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      top: wx.getStorageSync('getPhone').topH+44,
      screenH: wx.getSystemInfoSync().windowHeight
    });
    var user = wx.getStorageSync('user')
    if (!user || user.mobile == '' || user.mobile == 'undefined' || user.rsShopId == 'undefined' || user.rsShopId == '') {
      wx.hideShareMenu()
    }
  },
  
  _callback:function(res){
  
    this.setData({datalist:res.data})
    if (this.data.datalist.list) {
      var that=this
      let newlist = this.data.datalist.list.filter(function (v) {
        if (v.ActivityPrice.indexOf('起') > 0) {
          v.ActivityPrice = v.ActivityPrice.replace('起', '');
          v.smallest='起'
        }
        return v
      })
      that.setData({ list: newlist })
    }
  },
  scrollMenu:function(e){
    if (e.detail.scrollTop>this.data.top){
      this.setData({
        topshow:true
      })
    }else{
      this.setData({
        topshow: false
      })
    }
  },
  backLastpage:function(){
    wx.navigateBack()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // wx.setNavigationBarTitle({
    //   title: '每周一品',
    // })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var id = {
      url: "/WeekActivity/WeekList",
      type: 'POST',
      data: {
        shopCode: wx.getStorageInfoSync('user').shopcode,
        pageIndex: this.data.pageIndex
      },
      _fcallback: this._fcallback
    }
    base._request(id, this._callback);
    var user = wx.getStorageSync('user')
    if (!user || user.mobile == '' || user.mobile == 'undefined' || user.rsShopId == 'undefined' || user.rsShopId == '') {
      wx.hideShareMenu()
    } else {
      wx.showShareMenu()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var luser = base._getUser();
    if (luser) {
      return {
        title: this.data.datalist.title,
        path: "/pages/home/weekly/weekly",
        imageUrl: this.data.datalist.shareImg
      }
    } else
      return false;
  }
})