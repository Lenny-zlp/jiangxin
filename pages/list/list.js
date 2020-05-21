import {
  baseRequest
} from '../until/baseRequest.js';
var _base = new baseRequest();
var page = require("../until/pageList.js")
import {
  list
} from "list-model.js";
var _list = new list();
Page({
  /**页面的初始数据*/
  data: {
    categorys: [],
    productList: [],
    page: 1,
    categoryId: 3,
    scrollTop: 0,
    searchShow: false
  },

  /** 生命周期函数--监听页面加载*/
  onLoad: function(options) {
    page.windowH(this, 174)
   
  },
  onShow:function(){
    _list.getCategorys(null, this._callback_categorys);
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 1,
        cartnum: wx.getStorageSync('cartnum')
      })
    }      

    var data = {
      categoryId: this.data.categoryId,
      page: this.data.page,
      pagesize: 10
    }
    _list.getList(data, this._callback);
  },
  /**生命周期函数--监听页面初次渲染完成*/
  onReady: function() {   
    var windowRule = wx.getSystemInfoSync();
    var screenW = windowRule.windowWidth;
    var windowH = windowRule.windowHeight;
    var rpxR = 750 / screenW
    this.setData({
      searchH: windowH*rpxR-94
    })
    this._animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'linear'
    })
  },


  /**切换标签*/
  tapName: function(e) {
    var data = {
      categoryId: e.currentTarget.dataset.categoryid,
      page: 1,
      pagesize: 10
    }
    _list.getList(data, this._callback);
    this.setData({
      categoryId: e.currentTarget.dataset.categoryid,
    });
  },


  /**下拉滚动*/
  scroll_bottom: function(e) {
    var page = this.data.page;
    var that = this;
    var data = {
      categoryId: that.data.categoryId,
      page: page + 1,
      pagesize: 10
    }
    _list.getList(data, this._callback_page);
  },

  /**分类回调函数 */
  _callback_categorys: function(res) {
    this.setData({
      categorys: res
    });
  },

  /**商品列表回调函数-默认 */
  _callback: function(res) {
    wx.hideLoading();
    this.setData({
      page: 1,
      pagesize: 10,
      scrollTop: 0,
      productList: res.ProductList
    });
  },
  /**商品列表回调函数-分页加载 */
  _callback_page: function(res) {
    wx.hideLoading();
    var productList = this.data.productList;
    var page = this.data.page;
    this.setData({
      page: page + 1,
      productList: productList.concat(res.ProductList)
    });
  }
 
  
})