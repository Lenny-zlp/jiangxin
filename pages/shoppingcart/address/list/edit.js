import {
  baseRequest
} from '../../../until/baseRequest.js';
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

    this.setData({
      UserId: base._getUser().userid,
      addressId: options.addressId,
      fullname: options.fullname,
      address: options.address,
      provinceid: options.provinceid,
      cityid: options.cityid,
      areaid: options.areaid,
      provincename: options.provincename,
      cityname: options.cityname,
      areaname: options.areaname,
      mobilephone: options.mobilephone,
      phone: options.phone,
      postalcode: options.postalcode,
      isdefault: options.isdefault,
      type: options.type,
      source: options.source,
      ordercode: options.ordercode

    })
    var id = {
      url: "/address/getarea",
      type: 'POST',
      data: {
        fid: 0,
        level: 0
      }
    }
    base._request(id, this._callback)

  },
  _callback: function(res) {
    this.setData({
      mesg: res.data
    })
  },
  fromSubmit: function(e) {
    var that=this;

    if (e.detail.value.fullname=="")
    {
      wx.showToast({
        title: "请填写收货人姓名",
        icon: 'none'
      });
      return false;
    }
    if (e.detail.value.mobilephone == "") {
      wx.showToast({
        title: "请填写手机号",
        icon: 'none'
      });
      return false;
    }
    if (that.data.areaid == "") {
      wx.showToast({
        title: "请选择地址",
        icon: 'none'
      });
      return false;
    }
    if (e.detail.value.address == "") {
      wx.showToast({
        title: "请填写详细地址",
        icon: 'none'
      });
      return false;
    } 
    if (e.detail.value.mobilephone.length!=11) {
      wx.showToast({
        title: "手机号格式不正确",
        icon: 'none'
      });
      return false;
    }



    var id = {
      url: "/address/edit",
      type: 'POST',
      data: {
        userid: that.data.UserId,
        addressid: that.data.addressId,
        fullname: e.detail.value.fullname,
        address: e.detail.value.address,
        provinceid: that.data.provinceid.replace('0000', ''),
        cityid: that.data.cityid.replace('00',''),
        areaid: that.data.areaid,
        provincename: that.data.provincename,
        cityname: that.data.cityname,
        areaname: that.data.areaname,
        mobilephone: e.detail.value.mobilephone,
        isdefault: that.data.isdefault,
        type: that.data.type
      }
    }
    base._request(id, function(res){
      if (res.state.returnCode == 1) {
        var tips="修改成功!";
        if(that.data.type==0)
        {
          tips = "添加成功!";

        }
        wx.showToast({
          title: tips,
          duration: 1500,
          success:function(){
            // wx.redirectTo({
            //   url: '/pages/shoppingcart/address/list?source=' + that.data.source + '&ordercode=' + that.data.ordercode,
            // })
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 1500);

          }
        });
       
      }
      else
    {
        wx.showToast({
          title: "修改失败,请稍后重试!",
        icon: 'none'
        });

    }

    })

  },
  bindRegionChange:function(e){
//console.log(e.detail)
    this.setData({
      provinceid:e.detail.code[0],
      cityid:e.detail.code[1],
      areaid: e.detail.code[2],
      provincename: e.detail.value[0],
      cityname: e.detail.value[1],
      areaname: e.detail.value[2]
    })
   
  },
del:function(e){
  var that=this;
  wx.showModal({
    title: '提示',
    content: '确定要删除地址吗?',
    success(res) {
      if (res.confirm) {
        var id = {
          url: "/address/del",
          type: 'POST',
          data: {
            userid: that.data.UserId,
            addressid: that.data.addressId
          }
        }
        base._request(id, function (res) {
          if (res.state.returnCode == 1) {
            wx.showToast({
              title: "删除成功!",
              success:function(){
                // wx.redirectTo({
                //   url: '/pages/shoppingcart/address/list?source=' + that.data.source + '&ordercode=' + that.data.ordercode,
                // })
                wx.navigateBack({
                  delta:1
                })

              }
            });
            
          }
          else {
            wx.showToast({
              title: "删除失败,请稍后重试!",
              icon: 'none'
            });

          }
        })
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })

},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  switchChange:function(e){
    if(e.detail.value)
    {
      this.setData({
        isdefault:1
      }
      )
    }
    else
    {
      this.setData({
        isdefault:0
      }
      )

    }

  }
})