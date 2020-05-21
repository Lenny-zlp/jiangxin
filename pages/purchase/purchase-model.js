import {
  baseRequest
} from '../until/baseRequest.js';
class purchase extends baseRequest {
  constructor() {
    super()
  }
  getListData(id,callBack){
    var parms = {
      url: '/Purchase/PurchaseList',
      type: 'POST',
      data: {
        type: id
      },
      sCallBack: function (res) {
        callBack && callBack(res.data.data)
      }
    }
    this.request(parms)
  }
}
export {purchase}