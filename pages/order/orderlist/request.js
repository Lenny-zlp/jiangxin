import {
  baseRequest
} from '../../until/baseRequest.js';
var _baseRequest = new baseRequest();
var js_countdown = require('../../until/countdown.js');

/**邀请参团请求 */
function toGroup(that,ordercode) {
  wx.request({
    url: _baseRequest.domain() + "/GroupActivity/GroupCommend/",
    method: 'POST',
    data: _baseRequest.getSignData({
      data: {
        ordercode: ordercode,
        shopcode: that.data._user.shopcode
      }
    }),
    header: {
      "content-type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      if (res.statusCode == 200) { //返回数据成功
        if (res.data.state.returnCode == 1) {
          //if (res.data.data.GroupDown > 0) {
            var group_countdown = null;
            var group_timer = js_countdown.setTime(that, res.data.data.GroupDown, 'group_countdown', group_countdown);
            that.setData({
              group: res.data.data,
              group_timer: group_timer
            });
          // }
          // else {
          //   that.setData({
          //     group: res.data.data
          //   });
          // }
          that.popup.show();
        } else {
          wx.showToast({
            title: res.data.state.error,
            icon: 'none',
            duration: 3000
          })
        }
      } else { //返回数据失败
        wx.showToast({
          title: '服务器内部错误！',
          icon: 'none',
          duration: 3000
        })
      }
    }
  })
}

/**取消订单 */
function toCancel(that,ordercode){
  wx.request({
    url: _baseRequest.domain() + "/order/Cancel",
    method: 'POST',
    data: _baseRequest.getSignData({
      data: {
        ordercode: ordercode,
        userid: that.data._user.userid
      }
    }),
    header: {
      "content-type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      if (res.statusCode == 200) { //返回数据成功
        if (res.data.state.returnCode == 1) {
          wx.showToast({
            title: '取消成功',
            icon: 'succes',
            duration: 1000,
            mask: true
          });
          that.refreshView.autoRefresh();
        } else {
          wx.showToast({
            title: res.data.state.error,
            icon: 'none',
            duration: 3000
          })
        }
      } else { //返回数据失败
        wx.showToast({
          title: '服务器内部错误！',
          icon: 'none',
          duration: 3000
        })
      }
    }
  })
}

/**删除订单 */
function toDel(that, ordercode) {
  wx.request({
    url: _baseRequest.domain() + "/order/Del",
    method: 'POST',
    data: _baseRequest.getSignData({
      data: {
        ordercode: ordercode,
        userid: that.data._user.userid
      }
    }),
    header: {
      "content-type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      if (res.statusCode == 200) { //返回数据成功
        if (res.data.state.returnCode == 1) {
          wx.showToast({
            title: '删除成功',
            icon: 'succes',
            duration: 1000,
            mask: true
          });
          that.refreshView.autoRefresh();
        } else {
          wx.showToast({
            title: res.data.state.error,
            icon: 'none',
            duration: 3000
          })
        }
      } else { //返回数据失败
        wx.showToast({
          title: '服务器内部错误！',
          icon: 'none',
          duration: 3000
        })
      }
    }
  })
}

/**确认收货 */
function toConfirm(that,ordercode) {
  wx.request({
    url: _baseRequest.domain() + "/order/ConfirmReceive/",
    method: 'POST',
    data: _baseRequest.getSignData({
      data: {
        ordercode: ordercode,
        userid: that.data._user.userid
      }
    }),
    header: {
      "content-type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      if (res.statusCode == 200) { //返回数据成功
        if (res.data.state.returnCode == 1) {
          that.refreshView.autoRefresh();
          wx.showToast({
            title: '确认成功',
            duration: 1000
          });
        } else {
          wx.showToast({
            title: res.data.state.error,
            icon: 'none',
            duration: 3000
          })
        }
      } else { //返回数据失败
        wx.showToast({
          title: '服务器内部错误！',
          icon: 'none',
          duration: 3000
        })
      }
    }
  })
}

function _user(){
  return _baseRequest._getUser();
}

module.exports = {
  toGroup: toGroup,
  toCancel: toCancel,
  toDel: toDel,
  toConfirm: toConfirm,
  _user: _user
}