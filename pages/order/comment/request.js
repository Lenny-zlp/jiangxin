import {
  baseRequest
} from '../../until/baseRequest.js';
var _baseRequest = new baseRequest();

/**评价商品 */
function toComment(that, ordercode) {
  var data_json = that.toPackage();
  wx.request({
    url: _baseRequest.domain() + "/order/CommentForMiniPro",
    method: 'POST',
    data: _baseRequest.getSignData({
      data: {
        json: JSON.stringify(data_json)
      }
    }),
    header: {
      "content-type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      if (res.statusCode == 200) { //返回数据成功
        if (res.data.state.returnCode == 1) {
          wx.showModal({
            title: '评价成功',
            content: '获得沙棘果' + res.data.data.Integral+'颗，加油哦！',
            showCancel:false,
            confirmText:'我知道了',
            success:function(res){
              if(res.confirm)
              {
                wx.redirectTo({
                  url: '/pages/order/orderlist/list?status=5',
                })
              }
            }
            
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

/**获取ip地址 */
function getIp(that){
    wx.request({
      url: 'http://ip-api.com/json',
      success: function (e) {
        that.setData({
          ip: e.data.query
        })
      }
    })
}

module.exports = {
  toComment: toComment,
  getIp: getIp
}