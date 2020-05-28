// pages/detail/detail.js
import { request } from '../../until/request.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navData: [
      {
        text: '美妆护肤'
      },
      {
        text: '营养健康'
      },
      {
        text: '个人护理'
      },
      {
        text: '餐桌食品'
      },
      {
        text: '经典零食'
      },
      {
        text: '清洁清理'
      },
      {
        text: '居家助手'
      },
      {
        text: '首页首页'
      }
    ],
    currentTab: 0,
    navScrollLeft: 0
  },
  // setTab: function (e) {
  //   const edata = e.currentTarget.dataset;
  //   this.setData({
  //     showtab: edata.tabindex,

  //   })
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    // const { userid } = wx.getStorageSync("user");
    request({url:'/Product/HotProductList',data:{HotProductid:1}})
    .then(res=> {
      console.log("11",res)
      // this.setData({
      //   navData:
      // })
    })
    
    // 获取系统信息
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          pixelRatio: res.pixelRatio,
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      },
    })
  },
  // 导航栏点击项居中
  switchNav(event) {
    // 下标
    var cur = event.currentTarget.dataset.current;
    //每个tab选项宽度占1/5          手机宽度/5
    var singleNavWidth = this.data.windowWidth / 5;
    //tab选项居中                            
    this.setData({
      navScrollLeft: (cur - 2) * singleNavWidth
    })
    if (this.data.currentTab == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      })
    }
  },
  // 滑动页面切换
  switchTab(event) {
    var cur = event.detail.current;
    var singleNavWidth = this.data.windowWidth / 5;
    this.setData({
      currentTab: cur,
      navScrollLeft: (cur - 2) * singleNavWidth
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})