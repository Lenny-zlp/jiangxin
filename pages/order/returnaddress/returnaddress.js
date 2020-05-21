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
  onLoad: function (options) {
    this.setData({
refundid:options.refundid

    })
    this.getinfo(options.refundid);
  },
  getinfo: function (refundid) {
    var that = this;
    var para = {
      url: '/Refund/RefundInfo/',
      type: 'GET',
      data: {
        userid: _baseRequest._getUser().userid,
        refundid: refundid,
      }
    }
    _baseRequest._request(para, function (res) {
      if (res.state.returnCode == 1) {
        that.setData({
          info: res.data,
        })
      }
    });
  },

  formSubmit: function (e) {
    var that = this;

    if (e.detail.value.name == "") {
      wx.showToast({
        title: "快递名称不能为空",
        icon: 'none'
      });
      return false;
    }
    if (e.detail.value.num == "") {
      wx.showToast({
        title: "快递单号不能为空",
        icon: 'none'
      });
      return false;
    }
    if (e.detail.value.price == "") {
      wx.showToast({
        title: "运费不能为空",
        icon: 'none'
      });
      return false;
    }

    this.setData({
      name: e.detail.value.name,
      num: e.detail.value.num,
      price: e.detail.value.price,
    })

    var para = {
      url: '/Refund/SubTransferInfo/',
      type: 'POST',
      data: {
        userid: _baseRequest._getUser().userid,
        refundid: that.data.refundid,
        transferway: that.data.name,
        transfercode: that.data.num,
        transferprice: that.data.price
      }
    }
    _baseRequest._request(para, function (res) {
      if (res.state.returnCode == 1) {
        wx.showToast({
          title: "提交成功",
          icon: 'success'
        });

        wx.navigateTo({
          url: "/pages/order/returnDetail/returnDetail?refundid=" + that.data.refundid,
        })
      }
      else
      {
        wx.showToast({
          title: "提交失败,请稍后重试!",
          icon: 'none'
        });
      }
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
})