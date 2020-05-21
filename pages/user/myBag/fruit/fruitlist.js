import {
  baseRequest
} from '../../../until/baseRequest.js';
var base = new baseRequest()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fruit: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var id={
      url:"/Integral/GiftGoodsList",
      type:'GET',
      data:{
        page:1,
        userId: base._getUser().userid,
      }
    }
    base._request(id, this._callback)
  },
_callback:function(res){
this.setData({
  fruit:res.data
})
},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },
})