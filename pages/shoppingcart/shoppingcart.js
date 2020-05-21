
import {
  baseRequest
} from '../until/baseRequest.js';
var _baseRequest = new baseRequest();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cart: null,
    checkedNum: 0,
    isCheckAll: false,
    left: 0
  },
  onLoad: function () {
    //region 监控网络变化，网络变化后重新加载数据
    const that = this
    wx.onNetworkStatusChange(function (res) {
      if (res.isConnected === true) {
        var user = _baseRequest._getUser();
        if (user) {
          var para = {
            url: '/mycart/index/',
            type: 'GET',
            data: {
              shopid: user.rsShopId,
              userid: user.userid,
              appversion:266
            }
          }
          _baseRequest._request(para, that._callback);
        }
      }
    })
    //endregion
  },
  onShow: function(e) {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2,
        cartnum: wx.getStorageSync('cartnum')
      })
    }      
    var user = _baseRequest._getUser();
    if (user) {
      var para = {
        url: '/mycart/index/',
        type: 'GET',
        data: {
          shopid: user.rsShopId,
          userid: user.userid,
          appversion: 266
        }
      }
      this.popup = this.selectComponent('#popup')
      this.popup.hide();
      wx.showLoading({
        title: '加载中,请稍等...',
      })
      //初次请求
      _baseRequest._request(para, this._callback);
     
    }
  },
  onPullDownRefresh: function() {
    var para = {
      url: '/mycart/index/',
      type: 'GET',
      data: {
        shopid: _baseRequest._getUser().rsShopId,
        userid: _baseRequest._getUser().userid,
        appversion: 266
      }
    }
    //初次请求
    _baseRequest._request(para, this._callback);
  },

  inputChange: function(e) {
    let qty = e.detail.value,
      sku = e.currentTarget.dataset.sku;
    wx.showLoading({
      title: '加载中,请稍等...',
    })
    var para = {
      url: '/MyCart/UpdateQty/',
      type: 'POST',
      data: {
        shopid: _baseRequest._getUser().rsShopId,
        qty: qty,
        userid: _baseRequest._getUser().userid,
        sku: sku,
        appversion: 266
      }
    }
    //初次请求
    _baseRequest._request(para, this._callback);

  },
  /**修改数量 */
  changeNum: function(e) {
    var type = e.currentTarget.dataset.type,
      qty = e.currentTarget.dataset.qty,
      sku = e.currentTarget.dataset.sku;
    if (type == 1) {
      qty++;
    } else {
      if (qty > 1) {
        qty--;
      } else {
        qty = 1;
        return;
      }
    }

    if(qty<1){return;}
    wx.showLoading({
      title: '加载中,请稍等...',
    })
    var para = {
      url: '/MyCart/UpdateQty/',
      type: 'POST',
      data: {
        shopid: _baseRequest._getUser().rsShopId,
        qty: qty,
        userid: _baseRequest._getUser().userid,
        sku: sku,
        appversion: 266
      }
    }
    //初次请求
    _baseRequest._request(para, this._callback);

  },
  getRecCom: function (skus) {
    if (skus.endsWith(",")) {
      skus = skus.substring(0, skus.length - 1);
    }
    var that = this;
    var para = {
      url: '/product/ProductRecommend',
      type: 'GET',
      data: {
        skus: skus
      }
    }
    _baseRequest._request(para, function (res) {
      that.setData({
        RecCom: res.data
      })
    })
  },
  // 推荐商品点击跳转
  hrefUrl: function (e) {
    wx.navigateTo({
      url: "/pages/product/product?sku=" + e.currentTarget.dataset.sku
    })
  },
  /**选中或取消选中 */
  changeRedio: function(e) {
    var check = e.currentTarget.dataset.chk; //1：选中 0：未选中  -1：不可选
    if (check != -1) {
      wx.showLoading({
        title: '加载中,请稍等...',
      })
      var para = {
        url: check == 1 ? '/mycart/NoCheckItem/' : '/mycart/CheckItem/',
        type: 'GET',
        data: {
          shopid: _baseRequest._getUser().rsShopId,
          userid: _baseRequest._getUser().userid,
          sku: e.currentTarget.dataset.sku,
          isPoint: e.currentTarget.dataset.ispoint,
          appversion: 266
        }
      }
      //初次请求
      _baseRequest._request(para, this._callback);
    } else {
      return;
    }
  },

  /**全选 */
  checkAll: function(e) {
    wx.showLoading({
      title: '加载中,请稍等...',
    })
    var ischeckall = e.currentTarget.dataset.ischeckall
    var para = {
      url: ischeckall ? '/mycart/NoCheckItemBatch/' : '/mycart/CheckItemBatch',
      type: 'POST',
      data: {
        userid: _baseRequest._getUser().userid,
        appversion: 266
      }
    }
    this.setData({
      isCheckAll: !ischeckall
    });
    //初次请求
    _baseRequest._request(para, this._callback);
  },
  /**本仓全选 */
  checkByStore: function (e) {
    wx.showLoading({
      title: '加载中,请稍等...',
    })
    var ischeckall = e.currentTarget.dataset.ischeckall;
    var storeId = e.currentTarget.dataset.storeid;
    var para = {
      url: '/mycart/CheckByStore',
      type: 'POST',
      data: {
        userid: _baseRequest._getUser().userid,
        storeId: storeId,
        check: ischeckall?0:1,
        appversion: 266
      }
    }
    _baseRequest._request(para, this._callback);
  },
  /**删除购物车内商品 */
  del: function(e) {
    wx.showLoading({
      title: '加载中,请稍等...',
    })
    var para = {
      url: '/mycart/DeleteItem/',
      type: 'POST',
      data: {
        userid: _baseRequest._getUser().userid,
        sku: e.currentTarget.dataset.sku,
        isPoint: e.currentTarget.dataset.ispoint,
        appversion: 266
      }
    }
    _baseRequest._request(para, this._callback);
  },

  toBalance: function() {
    if (this.data.checkedNum > 0) {
      wx.navigateTo({
        url: '/pages/shoppingcart/balance/balance?buytype=0',
      })
    } else {
      wx.showToast({
        title: '请选择商品！',
        icon: 'none',
        duration: 3000
      })
    }
  },
  /**请求成功回调函数 */
  _callback: function(res) {
    var cartNum=0;
    var cartAllNum=0;
    var skus="";
    wx.stopPullDownRefresh();
    wx.hideLoading();
    if (res.state.returnCode == '1') {
      res.data.Cart.SpitOrders.map((v, i) => {
        v.itemNum = v.Items.length;
        v.itemCheckedNum = v.Items.filter((p) => {
          return p.Ischecked
        }).length;
        return v;
      });
      res.data.Cart.SpitOrders.forEach(function (item, index) {

        
        var s = item.Items.map((v, i) => {
          return v.ProductCode;
        });
        if(s.indexOf(',')>0)
        {
          s=s.replace(",","")
        }
        skus+=s+",";
        cartNum += item.Items.filter((p) => {
          return p.Ischecked
        }).length;

        cartAllNum += item.Items.length;
      });
      if (!wx.getStorageSync("CartId")) {
        wx.setStorage({
          key: 'CartId',
          data: res.data.Cart.CartId,
        })
      }
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 2,
          cartnum: res.data.Cart.CartUNM 
        })
      }        
      wx.setStorageSync('cartnum', res.data.Cart.CartUNM.toString())
      this.setData({
        left: 0,
        cart: res.data.Cart,
        checkedNum: cartNum,
        isCheckAll: cartNum == cartAllNum
    
      });
      this.getRecCom(skus)     
    }
    else{
      wx.showToast({
        title: res.state.error,
        duration:3000,
        icon:"none"
      })
    }
  },
  /**促销描述 */
  moreSale: function() {
    this.popup.show();
  },
  closePage: function() {
    this.popup.hide();
  }

})