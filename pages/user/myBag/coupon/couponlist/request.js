import {
  baseRequest
} from '../../../../until/baseRequest.js';
var _baseRequest = new baseRequest();
/**加载页面 */
function getInfo(that) {
  wx.request({
    url: _baseRequest.domain() + "/Shopping/CouponList/",
    method: 'POST',
    data: _baseRequest.getSignData({
      data: {
        buytype:that.data.para.buytype,
        couponkeyid: that.data.para.couponkeyid,
        dg: that.data.para.dg,
        groupid: that.data.para.groupid,
        qty: that.data.para.qty,
        sku: that.data.para.sku,
        userid: _baseRequest._getUser("user").userid
      }
    }),
    header: {
      "content-type": "application/x-www-form-urlencoded"
    },
    success: function (res) {
      if (res.statusCode == 200) { //返回数据成功
        if (res.data.state.returnCode == 1) {
          that.setData({
            list: res.data.data.list,
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

module.exports = {
  getInfo: getInfo
}