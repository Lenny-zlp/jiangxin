import { baseRequest } from '../until/baseRequest.js';
class collage extends baseRequest {
  constructor() {
    super()
  }
  getListData(id,callBack) {
    var parms = {
      url: id.url,
      type: id.type,
      data:id.data,
      sCallBack: function (res) {
        callBack && callBack(res.data.data)
      }
    }
    this.request(parms)
  }
}
export {collage}