import {
  baseRequest
} from '../../until/baseRequest.js';
class list extends baseRequest {
  constructor() {
    super()
  }
  getList(data, callBack) {
    var parms = {
      url: '/order/orders/',
      type: 'POST',
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