import {
  baseRequest
} from '../../until/baseRequest.js';
var base = new baseRequest()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var id = {
      url: '/Order/LogisticsList',
      type: 'POST',
      data: {
        ordercode: options.ordercode
      }
    }
    base._request(id, this.resetData)
  },

  resetData: function(res) {
    var list;
    if (res.data.length > 1) {
      list = res.data.map((v, i) => {
        v.moreshow = false;      
        return v;
      })
    } else {
      list = res.data.map((v, i) => {
        v.moreshow = true;
        return v;
      })
    }
    this.setData({
      list: list
    })
  },
  checkarrow:function(e){
    var mailno=e.currentTarget.dataset.mailno
   let list=this.data.list.map((v,i)=>{
     if (v.showapi_res_body.mailNo == mailno){
       if (v.moreshow){
         v.moreshow=false
       }else{
         v.moreshow=true
       }
     }
     return v
   })
   this.setData({list:list})
  },
  copynum:function(e){
   
    wx.setClipboardData({
      data: e.currentTarget.dataset.copynum
    })
  }
})