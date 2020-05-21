import {
  baseRequest
} from '../../until/baseRequest.js';
var _baseRequest = new baseRequest();
var list = require('list-module.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    pagesize: 10,
    btnwrapH: '50rpx',
    taggle: true,
    labelid: 0,
    commentlist: [],
    scrollTop: 0,
    sure: true,
    showbigimg: false
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      sku: options.sku,
      pageHeight: wx.getSystemInfoSync().windowHeight,
      count: options.count
    })
    this._onload();

  },

  _onload: function() {
    this.setData({
      sure: false
    })
    wx.showNavigationBarLoading()
    var id = {
      url: '/Product/ProductComment',
      type: 'GET',
      data: {
        'labelid': this.data.labelid,
        'page': this.data.page,
        'pagesize': this.data.pagesize,
        'sku': this.data.sku
      }
    }
    _baseRequest._request(id, this._callback);
  },
  /**初始化页面数据 */
  _callback: function(res) {
    var that = this
    this.setData({
      sure: true
    })
    wx.hideNavigationBarLoading();
    if (this.data.taggle) {
      this.setData({
        discuss: res.data,
        tab: res.data.labels,
        line:'164rpx'
      });
    } else {
      this.setData({
        discuss: res.data,
        tab: res.data.labels,
        line:'auto'
      });

    }

    var starArr = _baseRequest.starsArray(this.data.discuss.commentlevel);
    this.setData({
      starArr: starArr,
      commentlist: this.data.commentlist.concat(list.list(this.data.discuss.commentlist))
    });
    list.positionTop(this)
    // this.bigImgData();
  },
  /**滑到底部追加新的评论信息 */
  loadMore: function(res) {
    wx.showNavigationBarLoading()
    this.setData({
      page: this.data.page + 1,
    })
    this._onload()
  },
  /**更多收起切换 */
  tabmore: function() {
    if (this.data.taggle) {
      this.setData({
        tab: this.data.discuss.labels,
        taggle: false,
        line:"auto"

      })
    } else {
      this.setData({
        tab: this.data.discuss.labels,
        taggle: true,
        line:"164rpx"
      })
    }
    this._onload()
  },
  /**点击评论标签切换对应数据 */
  onlabel: function(e) {
    if (this.data.sure) {
      wx: wx.showNavigationBarLoading()
      this.setData({
        labelid: e.currentTarget.dataset.labelid,
        page: 1,
        commentlist: [],
        scrollTop: 0
      })
      this._onload()
    }
  },
  
  closeBigimg: function() {
    this.setData({
      showbigimg: false
    })
  },
  showbigimg: function(e) {
    var index = e.currentTarget.dataset.i,ind=e.target.dataset.i
    if (ind != undefined){
      this.setData({
        bigimg: this.data.commentlist[index].Imgs,
        showbigimg: true,
        current: ind,
        bigimglength: this.data.commentlist[index].Imgs.length
      })
    }
    
  },
  touchSwiper:function(e){
   if(e.detail.source=='touch'){
     this.setData({ current: e.detail.current})
   }
  }
})