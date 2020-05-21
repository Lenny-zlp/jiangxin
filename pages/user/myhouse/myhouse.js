import {
  baseRequest
} from '../../until/baseRequest.js';
var _house = new baseRequest();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndex: 1,
    dataList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showNavigationBarLoading()
    this._load(this.data.pageIndex)
  },
  _load: function(page) {
    var id = {
      url: "/ProductCollection/MyCollection",
      type: "POST",
      data: {
        'userId': wx.getStorageSync('user').userid,
        'pageIndex': page
      }
    }
    _house._request(id, this._callback);
    this.setData({
      scrollLeft: 0
    })
  },
  _callback: function(res) {
    wx.hideNavigationBarLoading()
      this.setData({
        house: res.data,
        dataList:this.data.dataList.concat(res.data.dataList)
      })
   

  },
  // 点击删除商品
  onDelete: function(e) {
    var that = this
    wx.showModal({
      content: '是否确定删除该收藏商品',
      success(res) {
        if (res.confirm) {
          var sku = e.currentTarget.dataset.sku;
          var id = {
            url: "/ProductCollection/CancelCollection",
            type: "POST",
            data: {
              'userId': wx.getStorageSync('user').userid,
              'productCodeStr': sku,
            }
          }
          _house._request(id, (res) => {
            wx.showToast({
              title: '删除成功',
              icon: 'none',
              duration: 800
            })
            that.setData({ dataList:[],
              pageIndex:1})
            that._load(that.data.pageIndex)
          })
        }
      }
    })
  },
  onReachBottom: function() {
    if(this.data.dataList.length!=this.data.house.rows){
      wx.showNavigationBarLoading()
      var page = this.data.pageIndex + 1
      this._load(page)
      this.setData({ pageIndex: page })
    }else{
      wx.showToast({
        title: '我是有底线的！！',
        icon:'none',
        duration:1000
      })
    }
   
  }

})