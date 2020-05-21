import {
  time
} from '../until/time.js';
var _time = new time();
import {
  baseRequest
} from '../until/baseRequest.js';
var _base = new baseRequest();
import {
  product
} from 'product-model.js';
var _product = new product();
var pageList = require('../until/pageList.js');
var js_countdown = require('../until/countdown.js');
var timegroup = require('../until/timegroup.js');
Page({

  data: {
    freight: 10,
    textshow: true,
    index: 0,
    videoPlay: false,
    videofooter: false,
    shade: false,
    server: false,
    collage: false,
    setTime: '',
    addnum: '1',
    addView: false,
    action: "cart",
    groupid: 0,
    grouplogid: 0,
    originalgrouplogid: 0,
    collageArr: [],
    collageMoreShow: false,
    attendShow: false,
    p_toggle: 0,
    VideoImg: '',
    Video: '',
    onjiontime: null,
    collagetimelist: null,
    RecShow: false
  },

  onLoad: function(options) {
   
 var user=wx.getStorageSync('user')
    console.log(user)
    console.log('user')
    if (!user || user.mobile == '' || user.mobile == 'undefined' || user.rsShopId == 'undefined' || user.rsShopId == '') {
      wx.hideShareMenu()
    }
    this.popup = this.selectComponent('#popup');
    this.servel = this.selectComponent('#servel')
    this.setData({
      sku: options.sku
    })
    if (options.groupid != undefined && options.groupid > 0) {
      this.setData({
        collage: true,
        groupid: options.groupid,
        grouplogid: options.grouplogid,
        originalgrouplogid: options.grouplogid,
      })
    }
  },
  
  onShow: function() {  
    var user = wx.getStorageSync('user')
  
    if (!user || user.mobile == '' || user.mobile == 'undefined' || user.rsShopId == 'undefined' || user.rsShopId == '') {
      wx.hideShareMenu()
    }else{
      wx.showShareMenu()
    }
    // wx.getShareInfo({
    //   shareTicket: '',
    // })
    //加载商品信息
    this._loadproduct(this.data.sku, this.data.groupid, this.data.grouplogid);
    //this.getproductAttr(this.data.sku);
    this.comment(this.data.sku);
    //加载描述信息
    // this.decrible(this.data.sku);
    //加载参团列表
    if (this.data.groupid > 0) {
      this.joinlist(this.data.sku, this.data.groupId);
    }
    this.setData({
      cartnum: wx.getStorageSync('cartnum'),
      userRatingId: wx.getStorageSync('user') ? wx.getStorageSync('user').userRatingId : -1
    });

  },
  onUnload: function() {
    wx.hideLoading();
    clearInterval(this.data.grouplog_timer);
  },
  onHide: function() {
    wx.hideLoading();
    clearInterval(this.data.grouplog_timer);
  },
  intervalarr: function() {
    clearTimeout(this.data.collagetimelist)
    let list1 = this.data.collageArr.map((v, i) => {

      v.Totalsecs--
        var num = v.Totalsecs
      if (num > 0) {
        let temp = timegroup.initinterval(num)
        if (temp.d > 0) {
          v.pay_countdown = `${temp.d}天${temp.h}:${temp.s}:${temp.m}`;
        } else {
          v.pay_countdown = `${temp.h}:${temp.s}:${temp.m}`;
        }
      }

      return v
    });
    this.setData({
      collageArr: list1
    });

    this.data.collagetimelist = setTimeout(this.intervalarr, 1000)
  },

  _loadproduct: function(sku, groupid, grouplogid) {
    pageList.windowH(this, 0)
    var id = {
      sku: sku,
      groupid: groupid,
      grouplogid: grouplogid,
      type: 'POST'
    }
    var data = _product.getProductData(id, this._callback)

    var server = _product.getProductBute('/product/ProductCUXIAO_V2?sku=' + id.sku, this._dCallback);
    //var _AttrBute = _product.getProductBute('/product/GetProductAttributeList?sku=' + id.sku, this._aCallback);

  },
  textTaggle: function() {
    if (this.data.textshow) {
      this.setData({
        textshow: !this.data.textshow
      })
    } else {
      this.setData({
        textshow: !this.data.textshow
      })
    }
  },
  //加载参团列表
  joinlist: function(sku) {
    var that = this;
    var para = {
      url: '/Product/GetJoinGroupList',
      type: 'GET',
      data: {
        productcode: that.data.sku,
        groupId: that.data.groupid,
      }
    }
    _base._request(para, function(res) {
      if (res.state.returnCode == 1) {
        if (res.data != null) {
          that.setData({
            collageArr: res.data.list,
            joinlist_title: res.data.title
          })
          if (that.data.collageArr.length > 0) {
            var list1 = that.data.collageArr.map((v, i) => {

              // if(v.GroupLogId == that.data.grouplogid){
              //   that.setData({ grouplog_num:i})
              // }
              if (v.Totalsecs > 0) {
                var temp = timegroup.initinterval(v.Totalsecs)
                if (temp.d > 0) {
                  v.pay_countdown = `${temp.d}天${temp.h}:${temp.s}:${temp.m}`;
                } else {
                  v.pay_countdown = `${temp.h}:${temp.s}:${temp.m}`;
                }
                if (v.GroupLogId == that.data.grouplogid) {
                  that.setData({
                    grouplog_num: i
                  })
                }
              }
              return v
            })
            that.setData({
              collageArr: list1
            });
            //倒计时
            that.intervalarr();
          }
        }
      }
    });
  },

  //评论用户名处理
  getcommentlist: function(data) {
    var list = data.map((v, i) => {
      v.starArr = _base.starsArray(v.commentlevel);
      var line = v.Receiver.length
      if (line > 1) {
        v.discussName = '***' + v.Receiver.substring(line - 1)
      }
      return v
    })
    return list
  },
  //加载评论列表
  comment: function(sku) {
    var that = this;
    var para = {
      url: '/Product/ProductComment',
      data: {
        sku: sku,
        pagesize: 2,
        page: 1,
        labelid: 0
      },
      type: 'GET'
    }
    _base._request(para, function(res) {
      if (res.state.returnCode == 1) {
        that.setData({
          commentlist: that.getcommentlist(res.data.commentlist),
          commentcount: res.data.recordCount,
          commentlike: res.data.perLike,
        })
      }
    });
  },


  _callback: function(res) {
    wx.hideLoading()
    var timeNum = ""
    if (res.product.CountDown > 0) {
      timeNum = res.product.CountDown
    }
    this.setData({
      freight: res.FreightConfigEntity.Freight,
      product: res.product,
      promotion: res.promotion,
      count: timeNum
    });

    if (this.data.collage && this.data.product.GroupLogStatus == 1) {
      var grouplog_countdown = null;
      var grouplog_timer = js_countdown.setTime(this, this.data.grouplog_countdownc, 'grouplog_countdown', grouplog_countdown);
      this.setData({
        grouplog_timer: grouplog_timer
      });
    }

    this.getCHProduct(this.data.product.Color, this.data.product.hue);

    clearInterval(this.data.setTime);
    _time.initinterval(this, this.data.count);
    this.interval(this, this.data.count);
    var text = ""
    for (var i = 0; i < this.data.product.RuleDes.length; i++) {
      text += this.data.product.RuleDes[i] + '；';
    };
    this.setData({
      "starrules": text
    });
  },
  chageVideo: function(e) {
    let _video = wx.createVideoContext('video', this)
    this.setData({
      index: e.detail.current
    })
    if (this.data.index != 0 && this.data.product.VideoUrl) {
      _video.pause()
    }
  },

  videoImg: function(e) {
    let _video = wx.createVideoContext('video', this)
    if (e.target.dataset.click == 0) {
      _video.play()
      this.setData({
        index: e.target.dataset.click
      })
    } else {
      _video.pause()
      this.setData({
        index: e.target.dataset.click
      })
    }
  },
  videoPlay: function(e) {
    var id = e.currentTarget.dataset.id,
      _video = wx.createVideoContext(id, this);
    _video.play()
    if (id == 'video') {
      this.setData({
        videoPlay: true
      })
    } else if (id == 'videofooter') {
      this.setData({
        videofooter: true
      })
    }
  },
  interval: function(that, num) {
    that.data.setTime = setInterval(function() {
      num--;
      if (num == 0) {
        that.onShow();

      }
      _time.initinterval(that, num);
    }.bind(this), 1000);
  },

  _houseBack: function() {},
  //服务列表回调函数
  _dCallback: function(res) {
    this.setData({
      "saleList": res.list,
      "serveList": res.serviceList
    })
  },
  //参团用户头像报错，用默认图片代替
  imgerr: function(e) {
    if (e.detail.errMsg) {
      var img = 'collageArr[' + e.target.dataset.index + '].Head';
      var list = this.data.collageArr.map((v, i) => {
        if (v.GroupLogId == e.target.dataset.logid) {
          v.Head = 'https://cache.jiangxinxiaozhen.com/Appimage/defaulthead.jpg'
        }
        return v
      })
      this.setData({
        collageArr: list
      })
    }
  },

  //促销列表回调函数
  _aCallback: function(res) {
    this.setData({
      "bute": res
    })
  },
  moreSale: function() {
    this.popup.show()
  },
  closeSale: function() {
    this.popup.hide();
    this.servel.hide();
  },
  //规格弹层回调参数
  _tanchuCallback: function(res) {
    this.setData({
      modelcolor: res.modelcolor,
      modelhue: res.modelhue
    })
    if (res.modelproduct != null) {
      this.setData({
        modelproduct: res.modelproduct,
        modelproductcode: res.modelproduct.ProductCode,
        modelproductstock: res.modelproduct.stock
      })
    } else {
      this.setData({
        modelproductcode: "",
        modelproductstock: 0
      })

    }
  },

  //选择规格颜色回调函数
  _tanchuCallback2: function(res) {
    res = res.data;
    this.setData({
      modelcolor: res.modelcolor,
      modelhue: res.modelhue
    })
    if (res.modelproduct != null) {
      this.setData({
        modelproduct: res.modelproduct,
        modelproductcode: res.modelproduct.ProductCode,
        modelproductstock: res.modelproduct.stock
      })
    } else {
      this.setData({
        modelproductcode: "",
        modelproductstock: 0
      })
    }

  },
  //关闭参团列表弹出层
  onCollageMoreClose: function() {
    this.setData({
      collageMoreShow: false
    })
  },
  //点击去参团
  onJoin: function(e) {
    var num = e.currentTarget.dataset.index;
    this.setData({
      collageMoreShow: false,
      attendShow: true,
      grouplogid: e.currentTarget.dataset.grouplogid,
      grouplogindex: num,
    })
  },

  //隐藏参团弹出层
  onHideJoinWindow: function(e) {
    this.setData({
      grouplogid: 0,
      attendShow: false,
      grouplogid: this.data.originalgrouplogid,

    })
  },
  //立即参团
  onJoinNow: function(e) {
    this.setData({
      addView: true,
      action: "group",
      attendShow: false,
    })
  },

  //显示参团列表弹出层
  onCollageMoreShow: function() {

    this.setData({
      collageMoreShow: true
    })
    let query = wx.createSelectorQuery();

    query.select('.collageMoreH').boundingClientRect()
    query.select('.collageMore-list-wrap').boundingClientRect()
    query.exec((res) => {

      this.setData({
        collageMoreH: res[1].height - res[0].height
      })

    });

  },
  decrible: function(sku) {
    var that = this;
    var para = {
      url: '/Product/GetProductDescribe',
      type: 'GET',
      data: {
        sku: sku,
        source: 1,
      }
    }
    _base._request(para, function(res) {
      if (res.state.returnCode == 1) {
        var richImgs = "" + res.data.Describe.replace(/\<img/gi, '<img class="rich-img"').replace(/<br\/>/gi, '').replace(/<\/p>/gi, '').replace('" id="imgWrap"', 'display:none;" id="imgWrap"').replace(/\<p>/gi, '') + "";

        if (res.data != null) {
          that.setData({
            "html": richImgs,
            Video: res.data.Video.replace('https:', ''),
            VideoImg: res.data.VideoImg.replace('https:', '')
          })
          that.getRecCom()
        }
      }
    });
  },

  getproductAttr: function() {
    var that = this;
    var para = {
      url: '/Product/GetProductAttributeList',
      type: 'GET',
      data: {
        sku: that.data.sku,
        source: 1,
      }
    }
    _base._request(para, function(res) {
      if (res.state.returnCode == 1) {
        var richImgs = "" + res.data.Parameters.replace(/\<img/gi, '<img class="rich-img"').replace(/<br\/>/gi, '').replace(/<\/p>/gi, '').replace(/\<p>/gi, '') + "";

        if (res.data != null) {
          that.setData({
            productRule: richImgs,
          })
          that.getRecCom()
        }
      }
    });
  },

  // 推荐商品
  getRecCom: function() {
    var that = this;
    var para = {
      url: '/product/ProductRecommend',
      type: 'GET',
      data: {
        skus: that.data.sku
      }
    }
    _base._request(para, function(res) {
      that.setData({
        RecCom: res.data,
        RecShow: true
      })
    })
  },
  // 推荐商品点击跳转
  hrefUrl: function(e) {
    wx.navigateTo({
      url: "/pages/product/product?sku=" + e.currentTarget.dataset.sku
    })
  },


  subtract: function(e) {
    let num = e.currentTarget.dataset.num;
    num--
    if (num < 1) {
      num = 1
    }
    this.setData({
      addnum: num
    })
  },
  add: function(e) {
    let num = e.currentTarget.dataset.num;
    var limittips = e.currentTarget.dataset.limitcounttips;
    if (e.currentTarget.dataset.limitcount == 0 || e.currentTarget.dataset.limitcount > num) {
      num++
      this.setData({
        addnum: num
      })
    } else if (e.currentTarget.dataset.limitcount > 0 && num >= e.currentTarget.dataset.limitcount) {
      wx.showToast({
        title: limittips + "",
        icon: "none",
      })
    }
  },
  checklimit: function(e) {
    let num = e.detail.value;
    var limittips = e.currentTarget.dataset.limitcounttips;
    this.setData({
      addnum: num
    })
    if (e.currentTarget.dataset.limitcount > 0 && num >= e.currentTarget.dataset.limitcount) {
      wx.showToast({
        title: limittips + "",
        icon: "none",
      })
    }

  },
  //加入购物车
  addShow: function(options) {
    this.setData({
      addView: true,
      action: "cart"
    })
    //this.getCHProduct(this.data.product.Color,this.data.product.hue);
  },
  //立即购买(包括发起拼团)
  buynow: function(options) {

    this.setData({
      grouplogid: 0,
      addView: true,
      action: "buy"
    })
  },
  creategroup: function(options) {
    this.setData({
      addView: true,
      action: "group"
    })
  },
  addhide: function() {
    this.setData({
      addView: false
    })
  },

  //点击规格触发事件
  colorbtn: function(e) {
    if (e.currentTarget.dataset.status != 2) {
      return false;
    }
    this.setData({
      selcolor: e.currentTarget.dataset.color
    })

    this.getCHProduct(this.data.selcolor, '')
  },
  //点击尺码触发事件
  huebtn: function(e) {
    this.setData({
      selhue: e.currentTarget.dataset.hue
    })
    this.getCHProduct(this.data.selcolor, this.data.selhue)
  },
  //获取规格参数
  getCHProduct: function(color, hue) {
    var url = '/product/GetCHProductCude?styleId=' + this.data.product.styleId + '&GroupId=' + this.data.product.GroupId + '&ProductCode=' + this.data.product.productcode + '&hue=' + encodeURIComponent(hue) + '&color=' + encodeURIComponent(color) + '&v=v3'
    var _CHP = _product.getRequest(url, this._tanchuCallback2);
  },
  //规格弹出层确定按钮
  subbtn: function(e) {
    //跳转购物车
    var _userinfo = wx.getStorageSync('user');
    if (!_userinfo){
      wx.navigateTo({
        url: '/pages/user/login/wxlogin/wxlogin?id=product',
      })
    } else if (_userinfo.mobile == 'undefined' || _userinfo.mobile == '') {
      wx.navigateTo({
        url: '/pages/user/login/bindingTel/bindingTel?userid=' + _userinfo.userid,
      })
      return false;
    } else if (_userinfo.rsShopId == 'undefined' || _userinfo.rsShopId == '') {
      wx.navigateTo({
        url: '/pages/user/login/bindingNum/bindingNum?userid=' + _userinfo.userid,
      })
      return false;
    }else{
      if (e.currentTarget.dataset.sku == "") {
        wx.showToast({
          title: "请选择尺码",
          icon: "none",
        })
        return false;
      }
      if (e.currentTarget.dataset.stock == 0) {
        wx.showToast({
          title: "库存不足",
          icon: "none",
        })
        return false;
      }
      if (e.currentTarget.dataset.limitcount > 0 && this.data.addnum > e.currentTarget.dataset.limitcount) {
        wx.showToast({
          title: "库存不足",
          icon: "none",
        })
        return false;
      }

      var that = this;
      if (this.data.action == "cart") {
        var url = '/MyCart/AddItem?sku=' + e.currentTarget.dataset.sku + '&qty=' + this.data.addnum + '&userid=' + _userinfo.userid;
        var _CHP = _product.getRequest(url, function(res) {
          that.setData({
            addView: false
          })
          if (res.state.returnCode == 1) {
            wx.showToast({
              title: "加入购物车成功!",
              success: function() {
                that.setData({
                  cartnum: res.data.Cart.CartUNM
                });
                wx.setStorage({
                  key: 'cartnum',
                  data: res.data.Cart.CartUNM,
                })

              }
            })
          } else {
            wx.showToast({
              title: res.state.error,
              icon: "none",
              duration: 3000
            })
          }

        });
      } else {
        var buytype = 1;
        //var groupid = 1;
        //跳转团购
        if (this.data.action == "group") {
          buytype = 4;
        }
        //立即购买 buytype 4团购，5星品，1 普通商品
        else if (this.data.action == "buy") {
          buytype = 1;
        }
        //隐藏规格弹窗
        this.setData({
          addView: false
        })

        var para = {
          url: '/MyCart/GetCheckBySku',
          type: 'GET',
          data: {
            sku: e.currentTarget.dataset.sku,
            qty: that.data.addnum,
            userid: _base._getUser().userid,
            buytype: buytype,
            groupId: that.data.groupid,
            groupLogId: that.data.grouplogid
          }
        }
        _base._request(para, function(res) {
          if (res.state.returnCode == 1) {

            var url = '/pages/shoppingcart/balance/balance?sku=' + e.currentTarget.dataset.sku + '&qty=' + that.data.addnum + '&userid=' + _userinfo.userid + '&buytype=' + buytype + '&dg=1&groupid=' + that.data.groupid + '&grouplogid=' + that.data.grouplogid;


            wx.navigateTo({
              url: url,
            })
          } else if (res.state.returnCode == 0) {

            wx.showToast({
              title: res.state.error,
              icon: "none",
              duration: 3000
            })
          } else {
            //弹框开团
            wx.showModal({
              title: res.data.title,
              content: res.data.content,
              confirmText: "一键开团",
              confirmColor: "#eb5902",
              showCancel: true,
              success(_res) {
                if (_res.confirm) {
                  that.creategroup();

                } else if (_res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
        });
      }
    }
  },
  onShade: function() {
    if (this.data.shade == false) {
      this.setData({
        shade: true
      });

    } else {
      this.setData({
        shade: false
      })
    }
  },
  onServer: function() {
    this.servel.show()
  },
 
  
  onShareAppMessage: function(res) {
    return {
      title: this.data.product.productname,
      path: "/pages/product/product?sku=" + this.data.sku + "&groupid=" + this.data.groupid + "&shopid=" + luser.rsShopId,
      imageUrl: this.data.product.ScrollImgList.length > 0 ? this.data.product.ScrollImgList[0].ImgUrl : ""
    }
  },

  normalbuy: function() {
    wx.navigateTo({
      url: "/pages/product/product?sku=" + this.data.sku,
    })

  },

  groupbuy: function() {

    wx.navigateTo({
      url: "/pages/product/product?sku=" + this.data.sku + "&groupid=" + this.data.product.GroupId,
    })

  },
  view_toggle: function(e) {
    if (e.currentTarget.dataset.toggle != this.data.p_toggle) {
      this.setData({
        p_toggle: (this.data.p_toggle * -1) + 1
      })
      if (this.data.p_toggle == 1) {
        if (!this.data.productRule) {

          this.getproductAttr();
          that.setData({
            RecShow: false
          })
        }
      }
    }
  },

  onReachBottom: function() {
    this.decrible(this.data.sku);
  },
})