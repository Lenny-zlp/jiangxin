import {
  collage
} from '../collage-model.js';
var _collage = new collage()
import {
  time
} from '../../until/time.js';
var _time = new time();
import {
  baseRequest
} from '../../until/baseRequest.js';
var _baseRequest = new baseRequest();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    closebtn: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      ordercode: options.OrderCode
    })
  },
  onShow: function(options) {
    var luser = _baseRequest._getUser();
    if (luser) {
      var url = {
        url: '/GroupActivity/GetMyGroupActivityDetails',
        data: {
          OrderCode: this.data.ordercode,
          UserId: luser.userid,
          v: 0
        }
      }
      _collage.getListData(url, this._callback);
      wx.showNavigationBarLoading()
    }

  },
  _callback: function(res) {

    wx.hideNavigationBarLoading()
    this.setData({
      group: res,
      GroupUserList: res.GroupUserList
    });
    //console.log(res);
    clearInterval(this.data.setTime);
    _time.initintervaltext(this, this.data.group.Group.GroupDown);
    this.interval(this, this.data.group.Group.GroupDown);
    var id = this.data.group.Group.GroupId;
    var url2 = {
      url: '/GroupActivity/GetPromoteGroupList',
      data: {
        GroupId: id
      }
    }
    _collage.getListData(url2, this._hotCollage);
  },
  interval: function(that, num) {
    that.data.setTime = setInterval(function() {
      num--;
      _time.initintervaltext(that, num);
    }.bind(this), 1000);

  },
  _hotCollage: function(res) {
    this.setData({
      hotCollage: res,
      PromoteGroupList: res.PromoteGroupList
    })
  },
  onclose: function() {
    var v = this.data.closebtn
    if (v) {
      this.setData({
        closebtn: !v
      })
    } else {
      this.setData({
        closebtn: !v
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx: wx.setNavigationBarTitle({
      title: '小镇拼团',
    })
  },

  imgerr: function(e) {
    var op = e.target.dataset,
      errimg = e.detail.errMsg;
    if (errimg) {
      var list = this.data.hotCollage.PromoteGroupList.map((v, i) => {
        if (v.ProductCode == op.sku) {
          v.GroupUserList[op.index] = {
            userimg: 'https://cache.jiangxinxiaozhen.com/Appimage/defaulthead.jpg'
          }
        }
        return v
      })
      this.setData({
        PromoteGroupList: list
      });
    }
  },
  headimgerr: function(e) {
    if (e.detail.errMsg) {
      var list = this.data.GroupUserList.map((v, i) => {
        if (v.posttime == e.target.dataset.time) {
          v.userimg = 'https://cache.jiangxinxiaozhen.com/Appimage/defaulthead.jpg'
        }
        return v
      })
      this.setData({
        GroupUserList: list
      });
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    var luser = _baseRequest._getUser();
    if (luser) {
      return {
        title: this.data.group.Group.Name,
        path: '/pages/collage/collagedetail/detail?OrderCode=' + this.data.group.Group.ordercode + '&shopid=' + luser.rsShopId,
        imageUrl: this.data.group.Group.ProductImg
      }
    }
  }
})