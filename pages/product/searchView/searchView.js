import {
  baseRequest
} from '../../until/baseRequest.js';
var _base = new baseRequest();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      history: wx.getStorageSync('keyword')
    })
    var id = {
      url: "/product/getProductRecommend",
      type: 'GET',
      data: null
    }
    _base._request(id, this.searchBack)
  },

  onConfirm: function (e) {
    var aa = [];
    var keyword = e.detail.value;

    var oldword = wx.getStorageSync('keyword');
    if (!oldword) {
      if (aa.indexOf(keyword) == -1 && keyword!=''){
        aa.push(keyword);
      }    
    }else{
      aa = oldword;
      if (aa.indexOf(keyword) == -1) {
        aa.push(keyword);
      }    
    }   
    wx.setStorage({
      key: 'keyword',
      data: aa,
    })
    wx.navigateTo({
      url: '/pages/list/search/search?keyword='+keyword
    })
  },
  searchBack: function (res) {
    this.setData({
      searchMesg: res.data.list.RecommendList
    })
  },
  clearSearch: function () {
    wx.setStorage({
      key: 'keyword',
      data: []
    })
    this.setData({
      history: wx.getStorageSync('keyword')
    })
  },
  topAnimation:function(){
    wx.navigateBack({
      delta: 1
    })
  }
})