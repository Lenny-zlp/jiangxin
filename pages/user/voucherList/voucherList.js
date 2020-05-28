import { request } from '../../until/request.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    tabs: [
      {
        id: 0,
        value: "未使用",
        isActive: true,
        number:0
      },
      {
        id: 1,
        value: "已用完",
        isActive: false,
        number:0
      },
      {
        id: 2,
        value: "已过期",
        isActive: false,
        number:0
      }
    ],
    notUserList:[],//未使用数组
    completedList:[],//已使用数组
    expiredList:[],//已使用数组
    pageIndex:1,// 第几页
    flag:false
  },
  onClose() {
    this.setData({ close: false });
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

// 消费记录点击事件
handleMenuTap() {
  this.setData({
    show:true
  })
},

// 获取消费记录 Consumption
getConsumption() {
  const { userid } = wx.getStorageSync("user");
    request({url:'/User/VoucherUsedLog',data:{userId:userid,cardId :"637246149340885269"}})
    .then(res=> {
      console.log("33",res)
    })
},

// 获取未使用数据
  getnotUserList() {
    const { userid } = wx.getStorageSync("user");
    request({url:'/User/VoucherList',data:{userId:userid,type:1}})
    .then(res=> {
      console.log(res)
      const { dataList } = res.data.data;
      let {tabs} = this.data;
      tabs[0].number = dataList.length
      this.setData({
        tabs
      })
      if(dataList.length === 0) {
        this.setData({
          flag:false
        })
        return
      }
      this.setData({
        notUserList: [...this.data.notUserList,...dataList],
      })
    })
    // 关闭下拉刷新的窗口 如果没有调用下拉刷新的窗口 直接关闭也不会报错  
    wx.stopPullDownRefresh();
  },
  // 获取已使用数据
  getcompletedList() {
    const { userid } = wx.getStorageSync("user");
    request({url:'/User/VoucherList',data:{userId:userid,type:2}})
    .then(res=> {
      // console.log(res)
      const { dataList } = res.data.data;
      let {tabs} = this.data;
      tabs[1].number = dataList.length
      this.setData({
        tabs
      })
      // console.log(dataList.length)
      if(dataList.length === 0) {
        this.setData({
          flag:false
        })
        return
      }
      this.setData({
        completedList: [...this.data.completedList, ...dataList]
      })
    })
    // 关闭下拉刷新的窗口 如果没有调用下拉刷新的窗口 直接关闭也不会报错  
    wx.stopPullDownRefresh();
  },
  // 获取已过期数据
  getexpiredList() {
    const { userid } = wx.getStorageSync("user");
    request({url:'/User/VoucherList',data:{userId:userid,type:3}})
    .then(res=> {
      // console.log(res)
      const { dataList } = res.data.data;
      let {tabs} = this.data;
      tabs[2].number = dataList.length
      this.setData({
        tabs
      })
      // console.log(dataList.length)
      if(dataList.length === 0) {
        this.setData({
          flag:false
        })
        return
      }
      this.setData({
        expiredList: [...this.data.expiredList, ...dataList]
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
    this.getnotUserList()
    this.getcompletedList()
    this.getexpiredList()
    this.getConsumption()
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
      notUserList:[],
      completedList:[],
      expiredList:[]
    })
    // 2 重置页码
    this.setData({
     pageIndex: 1
    })
    // 3 发送请求
    this.getnotUserList();
    this.getcompletedList()
    this.getexpiredList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // if(this.data.flag===false) {
    //   return 
    // }
    // let num = this.data.pageIndex;
    // num++;
    // this.setData({
    //   pageIndex: num
    //  })
    // this.getnotUserList();
    // this.getcompletedList();
    // this.getexpiredList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})