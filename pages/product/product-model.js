import { baseRequest } from'../until/baseRequest.js';
class product extends baseRequest{
  getProductData(id,callback){
    wx.showLoading({ title: '加载中...' })
    var parms={
      url:'/product/product',
      type:id.type,
      data: {
        sku: id.sku,
        groupid:id.groupid,
        grouplogid:id.grouplogid,
        v:"v5"
      },
     sCallBack:function(res){
       callback && callback(res.data.data)      
      }
    }
    this.request(parms);
  }
  getProductDetail(id,callback){
    wx.showLoading({ title: '加载中...' })
    var parmsDetial={
      url:id.sku,
      type:id.type,
      data:id.data,
      sCallBack:function(res){
        callback && callback(res.data.data)
      }
    }
    this.request(parmsDetial);
  }
getRequest(url,callback)
{
  var parms = {
    url: url,
    type: "POST",
    sCallBack: function (res) {
      callback && callback(res.data)
    }
  }
  this.request(parms);
}

  getCHProductCude(_url, callback) {
    var parmsCHP = {
      url: _url,
      type: "POST",
      sCallBack: function (res) {      
        callback && callback(res.data.data)
      }
    }
    this.request(parmsCHP);
  }
  getProductBute(url, callback) {
    var parmsBute = {
      url: url,
      type: "POST",
      sCallBack: function (res) {
        console.log(res)
        callback && callback(res.data.data)
      }
    }
    this.request(parmsBute);
  }
}
export{product}