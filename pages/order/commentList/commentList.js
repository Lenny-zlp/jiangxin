// pages/order/commentList/commentList.js
import { request } from '../../until/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "待评价",
        isActive: true
      },
      {
        id: 1,
        value: "已评价",
        isActive: false
      }
    ],
    commentList:[],//待评价数组
    commentedList:[],//已评价数组
    pageIndex:1,// 第几页
    flag:true
  },
// 标题点击事件
handleItemTap(e) {
  const {index} = e.currentTarget.dataset;
  let {tabs} = this.data;
  tabs.forEach((v,i) => i===index?v.isActive=true:v.isActive=false);
  this.setData({
    tabs
  })
},

// 获取待评价数据
  getcommentList() {
    const { userid } = wx.getStorageSync("user");
    request({url:'/Product/GetReCommentForUser',data:{userId:userid,pageIndex:this.data.pageIndex}})
    .then(res=> {
      const { detailList } = res.data.data;
      // console.log(detailList)
      if(detailList.length === 0) {
        this.setData({
          flag:false
        })
        return
      }
      this.setData({
        commentList: [...this.data.commentList,...detailList]
      })
    })
    // 关闭下拉刷新的窗口 如果没有调用下拉刷新的窗口 直接关闭也不会报错  
    wx.stopPullDownRefresh();
  },
  // 获取已评价数据
  getcommentedList() {
    const { userid } = wx.getStorageSync("user");
    request({url:'/Product/GetCommentedForUser',data:{userId:userid,pageIndex:this.data.pageIndex}})
    .then(res=> {
      // console.log(res)
      const { CommentList } = res.data.data;
      console.log(CommentList.length)
      if(CommentList.length === 0) {
        this.setData({
          flag:false
        })
        return
      }
      this.setData({
        commentedList: [...this.data.commentedList, ...CommentList]
      })
    })
    // 关闭下拉刷新的窗口 如果没有调用下拉刷新的窗口 直接关闭也不会报错  
    wx.stopPullDownRefresh();
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getcommentList();
    this.getcommentedList()
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
     // 1 重置数组
     this.setData({
      commentList:[],
      commentedList:[],
    })
    // 2 重置页码
    this.setData({
     pageIndex: 1
    })
    // 3 发送请求
    this.getcommentList();
    this.getcommentedList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.flag===false) {
      return 
    }
    let num = this.data.pageIndex;
    num++;
    this.setData({
      pageIndex: num
     })
    this.getcommentList();
    this.getcommentedList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})