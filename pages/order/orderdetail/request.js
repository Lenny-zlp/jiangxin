import {
  baseRequest
} from '../../until/baseRequest.js';
var _baseRequest = new baseRequest();
var js_countdown = require('../../until/countdown.js');

/**邀请参团请求 */
function toGroup(that) {
  wx.request({
    url: _baseRequest.domain() + "/GroupActivity/GroupCommend/",
    method: 'POST',
    data: _baseRequest.getSignData({
      data: {
        ordercode: that.data.ordercode,
        shopcode: that.data.shopcode
      }
    }),
    header: {
      "content-type": "application/x-www-form-urlencoded"
    },
    success: function(res) {
      if (res.statusCode == 200) { //返回数据成功
        if (res.data.state.returnCode == 1) {
          //if (res.data.data.GroupDown > 0) {
            that.setData({
              group: res.data.data,
            });
            // var group_countdown = null;
            // var group_timer = js_countdown.setTime(that, res.data.data.GroupDown, 'group_countdown', group_countdown);
          } else {
            that.setData({
              group: res.data.data
              // group_timer: group_timer
            });
          }
          that.popup.show();
        // } else {
        //   wx.showToast({
        //     title: res.data.state.error,
        //     icon: 'none',
        //     duration: 3000
        //   })
        // }
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
    success: function(res) {
      if (res.statusCode == 200) { //返回数据成功
        if (res.data.state.returnCode == 1) {
          wx.showToast({
            title: '确认成功',
            duration: 1000
          })
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

/**物流信息 */
function logistics(that) {
  wx.request({
    url: _baseRequest.domain() + "/order/NewLogistics",
    method: 'POST',
    data: _baseRequest.getSignData({
      data: {
        transfercode: that.data.detail.TransferCode,
        transferway: that.data.detail.TransferWay
      }
    }),
    header: {
      "content-type": "application/x-www-form-urlencoded"
    },
    success: function(res) {
      if (res.statusCode == 200) { //返回数据成功
        if (res.data.state.returnCode == 1) {
          that.setData({
            logistics: res.data.data
          });
        }
      } else { //返回数据失败

      }
    }
  })
}

module.exports = {
  toGroup: toGroup,
  toConfirm: toConfirm,
  logistics: logistics
}