import {
  baseRequest
} from '../until/baseRequest.js';
class list extends baseRequest {
  constructor() {
    super()
  }
  getList(data, callBack) {
    wx.showLoading({
      title: '加载中',
    })
    var parms = {
      url: '/Product/CategoryProducts',
      type: 'GET',
      data: data,
      sCallBack: function (res) {
        callBack && callBack(res.data.data)
      }
    }
    this.request(parms)
  }

  getCategorys(data, callBack) {
    var parms = {
      url: '/Product/Category',
      type: 'GET',
      data: data,
      sCallBack: function (res) {
        callBack && callBack(res.data.data)
      }
    }
    this.request(parms)
  }
}
export {
  list
}