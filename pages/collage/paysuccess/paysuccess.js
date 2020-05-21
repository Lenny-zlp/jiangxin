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
    var ordercode = options.OrderCode;

    this.setData({
      ordercode: ordercode
    })
    var luser = _baseRequest._getUser();
    this.popup = this.selectComponent("#popup");
    this.popup.hide();
    var url = {
      url: '/GroupActivity/GetMyGroupActivityDetails',
      data: {
        OrderCode: options.OrderCode,
        UserId: luser.userid,
        v: 0
      }
    }
    _collage.getListData(url, this._callback);
    /**邀请成团 */
    var that = this;

    if (luser) {
      var para = {
        url: "/GroupActivity/GroupCommend",
        type: "POST",
        data: {
          ordercode: ordercode,
          shopcode: luser.shopcode
        }
      }
      _baseRequest._request(para, that._callback_send);
    }
  },
  /**关闭分享弹出层 */
  _closePopup: function() {
    this.popup.hide();
  },
  _callback: function(res) {

    if (res.Group.Status == 0) {
      this.popup.show();
    } else {
      this.popup.hide();
    }

    this.setData({
      group: res,
      GroupUserList: res.GroupUserList
    });
    clearInterval(this.data.setTime);
    _time.initinterval(this, this.data.group.Group.GroupDown);
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
      _time.initinterval(that, num);
    }.bind(this), 1000);

  },
  _hotCollage: function(res) {
    this.setData({
      hotCollage: res
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
        hotCollage: {
          PromoteGroupList: list
        }
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    wx: wx.setNavigationBarTitle({
      title: '小镇拼团',
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {

    var luser = _baseRequest._getUser();
    if (luser) {
      this.popup.hide();
      if (res.from === 'button') {

      }
      return {
        title: this.data.group.Group.Name,
        path: '/pages/collage/collagedetail/detail?OrderCode=' + this.data.group.Group.ordercode + '&shopid=' + luser.rsShopId,
        imageUrl: this.data.group.Group.ProductImg
      }
    }
  },

  /**邀请成团回调函数*/
  _callback_send: function(res) {
    if (res.state.returnCode = 1) {
      //this.popup.show();
      /**GroupDown 倒计时*/
      this.setData({
        sendStr: res.data.SendStr,
        sendStr1: res.data.SendStr1
      })
    }
  },
})