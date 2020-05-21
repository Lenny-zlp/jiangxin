// pages/shoppingcart/address/list.js
import {
  baseRequest
} from '../../until/baseRequest.js';
var _baseRequest = new baseRequest();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    source: 0, //1:结算页 2:订单详情
    address: [],
    page: 0,
    FullName: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let {
      source,
      ordercode
    } = options;
    if (source) {
      this.setData({
        source: source,
        ordercode: ordercode ? ordercode : 0
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx: wx.setNavigationBarTitle({
      title: '地址管理列表'
    })
  },
onHide:function(){
  this.setData({
    page: 0,
    address:[]
  })
},
  onShow:function(){
    this.getAddress();
  },

  //切换标签或者点击更多
  getAddress: function() {
    var that = this;
    this.setData({
      page: this.data.page + 1
    })
    var para = {
      url: '/Address/List/',
      type: 'GET',
      data: {
        UserName: _baseRequest._getUser().username,
        FullName: that.data.FullName,
        pageIndex: that.data.page
      }
    }
    _baseRequest._request(para, function(res) {
      if (res.state.returnCode == 1) {
        that.setData({
          address: that.data.address.concat(res.data),
        })
      }
    });
  },

  formSubmit: function(e) {
    this.setData({
      FullName: e.detail.value.FullName,
      address: [],
      page: 0
    })
    this.getAddress();
  },

  onToUrl: function(e) {
    var source = this.data.source;
    var addressid = e.currentTarget.dataset.addressid;
    if (source == 1) {
      var pages = getCurrentPages();
      var page = pages.filter((v,k)=>{
        return v.route.indexOf('/shoppingcart/balance')>0;
      })
      if (page.length > 0) {
        //上一个页面实例对象
        var prePage = page[0];
        //关键在这里
        prePage.changeData(addressid)
        wx.navigateBack({
          delta: 1
        })
      }
    }
    if (source == 2) { //来自订单详情，调用修改订单地址接口然后返回订单详情页
      var addr = this.data.address.filter((v, i) => {
        return v.AddressId == addressid;
      })[0]
      var para = {
        url: '/order/Modify/',
        type: 'POST',
        data: {
          address: addr.Address,
          area: addr.Area,
          areaid: addr.AreaId,
          city: addr.City,
          cityid: addr.CityId,
          login_token: '',
          mobilephone: addr.Mobile,
          ordercode: this.data.ordercode,
          province: addr.Province,
          provinceid: addr.ProvinceId,
          receiver: addr.FullName,
          type: 0,
          userid: _baseRequest._getUser().userid
        }
      }
      _baseRequest._request(para, function(res) {
        if (res.state.returnCode == 1) {
          var pages = getCurrentPages();
          var page = pages.filter((v, k) => {
            return v.route.indexOf('/order/orderdetail/detail') > 0;
          })
          // if (pages.length > 1) {
          if (page.length > 0){
            //上一个页面实例对象
            //var prePage = pages[pages.length - 2];
            //上一个页面实例对象
            var prePage = page[0];
            //关键在这里
            //prePage.changeData()
            wx.navigateBack({
              delta: 1
            })
          }
        }
        else{
          wx.showToast({
            title: res.state.error,
            icon: 'none',
            duration: 2000
          })

        }
      });

    }
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.getAddress();
  },
})