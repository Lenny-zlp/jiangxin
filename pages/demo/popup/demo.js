// pages/demo/popup/demo.js
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

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.popup = this.selectComponent("#popup");
    this.popup.show();
  },

  popupCancel:function(){
    this.popup.hide()
  },

  popupConfirm:function(){
    this.popup.setContent("您点击了确定按钮");
  }
})