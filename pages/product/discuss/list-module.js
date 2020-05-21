import {
  baseRequest
} from '../../until/baseRequest.js';
var _nbaseRequest = new baseRequest();

function list(data) {
 var list= data.map((v, i) => {
   v.starArr = _nbaseRequest.starsArray(v.commentlevel);
    var line = v.Receiver.length
    if (line > 1) {
      v.discussName = '***' + v.Receiver.substring(line - 1)
    }
    return v
  })
  return list
}
function positionTop(that){
  const query = wx.createSelectorQuery()
  query.select('#getheight').boundingClientRect()
  query.exec(function (res) {
    that.setData({
      height: wx.getSystemInfoSync().windowHeight - res[0].height
    })
  })
}
module.exports = {
  list: list,
  positionTop: positionTop
}