import {
  baseRequest
} from '../../until/baseRequest.js';
var _baseRequest = new baseRequest();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      messid: options.messid
    })
    // if (options.share == 1) {
    //   wx: wx.navigateTo({
    //     url: "/pages/our/ourlist/detail?code=" + options.code + "&loginuserid=" + options.loginuserid + "&messid=" + options.messid + "&shopcode=" + options.shopcode + "&share=1"
    //   })
    // }
  },
  // onShow:function(){
  //   if (wx.getStorageSync('user')) {
  //     var that = this;
  //     wx.request({
  //       url: 'http://api2.jiangxinxiaozhen.com/Life/Detail',
  //       method: 'POST',
  //       data: _baseRequest.getSignData({
  //         data: {
  //           code: wx.getStorageSync('user').rsShopId,
  //           loginuserid: wx.getStorageSync('user').userid,
  //           messid: this.data.messid,
  //           shopcode: wx.getStorageSync('user').shopcode       
  //         }
  //       }),
  //       success: function (res) {
  //         console.log(res)
  //         var richImgs = "" + res.data.data.ImgContext.replace(/\<img/gi, '<img class="rich-img" ') + ""
  //         that.setData({
  //           message: res.data.data,
  //           html: richImgs
  //         })
  //       }
  //     })
  //   } else {
  //     _baseRequest._getWxShouquan()
  //     this.onshow()
  //   }

  // },
  onShow: function() {  
    var thatapp = getApp();
    var luser = _baseRequest._getUser();
    if (luser) {
      if (this.data.messid) {
        this.setData({
          shareurl: thatapp.data.wdurl+"/LifeShareXcx/Index?mid=" + this.data.messid + "&Code=" + luser.reLoginName
        })
      }
    }
  },


  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function(res) {
  //   var shopid = _baseRequest._getShopId();
  //   var _data = this.data.message;
  //   return {
  //     title: _data.ShareTitle,
  //     path: '/pages/our/our?Status=&UserId=&LoginUserId=' + this.data.loginuserid + '&page=1&share=1&shopid=' + shopid,
  //     imageUrl: _data.ShareImg
  //   }
  // }
})