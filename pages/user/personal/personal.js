import {
  baseRequest
} from "../../until/baseRequest.js";
var base = new baseRequest();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    sexwrap: false,
    isUpload: false
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var id = {
      url: "/Account/GetUserInfo",
      type: 'POST',
      data: {
        login_token: '',
        userid: base._getUser().userid,
        username: base._getUser().username,
        v: 1
      }

    }
    base._request(id, this.callback)
  },

  formSubmit: function(e) {
    if (this.data.isUpload) {
      this.upload_submit(e);
    } else {
      this.noupload_submit(e);
    }

  },
  fromcallback: function(res) {

  },
  callback: function(res) {
    this.setData({
      Area: res.data.Area,
      AreaId: res.data.AreaId,
      Sex: res.data.Sex,
      Province: res.data.Province,
      ProvinceId: res.data.ProvinceId,
      City: res.data.City,
      CityId: res.data.CityId,
      TrueName: res.data.TrueName,
      address: res.data.address,
      nickName: res.data.nickName,
      Birthday: res.data.Birthday,
      Head: res.data.Head,
      Mobile: res.data.Mobile
    })
  },
  checkedSex: function(e) {
    this.setData({
      Sex: e.target.dataset.sexnum,
      sexwrap: false,
      show: false
    })
  },
  focusCheck: function(e) {
    this.setData({
      sexwrap: true,
      show: true
    })
  },
  checkedImg: function() {
    this.setData({
      show: true
    })
  },
  hideCheckedImg: function() {
    this.setData({
      show: false,
      sexwrap: false
    })
  },
  //选择相册
  takePhoto1: function() {
    var that = this
    wx.chooseImage({
      sourceType: ['album'],
      count: 1,
      success: function(res) {
        console.log(res)
        that.setData({
          Head: res.tempFilePaths[0],
          show: false,
          isUpload: true
        })
      },
      fail: function() {
        isUpload: false
      }
    })
  },
  //选择相机
  takePhoto: function() {
    var that = this
    wx.chooseImage({
      sourceType: ['camera'],
      count: 1,
      success: function(res) {
        that.setData({
          Head: res.tempFilePaths[0],
          show: false,
          isUpload: true
        })
      },
      fail: function() {
        isUpload: false
      }
    })
  },
  birstday: function(e) {
    this.setData({
      Birthday: e.detail.value
    })
  },
  checkAddress: function(e) {
    var code = e.detail.code,
      city = e.detail.value
    this.setData({
      Province: e.detail.value[0],
      ProvinceId: e.detail.code[0].substring(0, 2),
      City: e.detail.value[1],
      CityId: e.detail.code[1].substring(0, 4),
      Area: e.detail.value[2],
      AreaId: e.detail.code[2]
    })
  },

  upload_submit: function(e) {
    wx.uploadFile({
      url: base.domain() + '/Account/Modify',
      filePath: this.data.Head,
      name: 'file',
      formData: base.getSignData({
        data: {
          address: e.detail.value.detailAddress,
          areaid: this.data.AreaId,
          cityid: this.data.CityId,
          provinceid: this.data.ProvinceId,
          birthday: this.data.Birthday,
          login_token: '',
          userid: base._getUser().userid,
          username: base._getUser().username,
          nickname: e.detail.value.nickname,
          truename: e.detail.value.name,
          sex: this.data.Sex
        }
      }),
      success: function(res) {
        wx.showToast({
          title: '保存成功',
          duration: 2000
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 2000);
      }
    })
  },

  noupload_submit: function(e) {
    wx.request({
      url: base.domain() + '/Account/Modify',
      method: 'POST',
      data: base.getSignData({
        data: {
          address: e.detail.value.detailAddress,
          areaid: this.data.AreaId,
          cityid: this.data.CityId,
          provinceid: this.data.ProvinceId,
          birthday: this.data.Birthday,
          login_token: 'GCIMQU',
          userid: base._getUser().userid,
          username: base._getUser().username,
          nickname: e.detail.value.nickname,
          truename: e.detail.value.name,
          sex: this.data.Sex
        }
      }),
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        wx.hideLoading();
        if (res.statusCode == 200) { //返回数据成功
          wx.showToast({
            title: '保存成功',
            duration: 2000
          })
          setTimeout(function() {
            wx.navigateBack({
              delta: 1
            })
          }, 2000);
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
})