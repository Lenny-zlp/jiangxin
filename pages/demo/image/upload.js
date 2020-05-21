import {
  baseRequest
} from '../../until/baseRequest.js';
var _baseRequest = new baseRequest();
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

  //选择相册
  takeAlbum: function() {
    var that = this
    wx.chooseImage({
      sourceType: ['album', 'camera'],
      sizeType: ['compressed'],
      count: 5,
      success: function(res) {
        console.log(res.tempFilePaths[0]);
        that.compressImg(0,res.tempFilePaths[0])
        // var files = res.tempFiles;
        // for (var i = 0; i < files.length; i++) {
        //   if (files[i].size > 2 * 1024 * 1024) {
        //     wx.showToast({
        //       title: '单张图片不允许超过2M',
        //       icon: 'none',
        //       duration: 2000
        //     })
        //     return;
        //   }
        // }
        // that.setData({
        //   tempFiles: res.tempFilePaths
        // });
        // that.upload_img(0);
      },
      fail: function() {

      }
    })
  },

  /**压缩图片 */
  compressImg: function (k, path) {
    var _this = this;
      wx.getImageInfo({
        src: path,
        success: function (res) {
          var ctx = wx.createCanvasContext('photo_canvas');
          var ratio = 2;
          var canvasWidth = res.width
          var canvasHeight = res.height;
          var ww = wx.getSystemInfoSync().windowWidth;
          var hh = wx.getSystemInfoSync().windowHeight;
          // 保证宽高均在1000以内
          while (canvasWidth > ww || canvasHeight > hh) {
            //比例取整
            canvasWidth = Math.trunc(res.width / ratio)
            canvasHeight = Math.trunc(res.height / ratio)
            ratio = ratio + 1;
          }
          _this.setData({ canvasWidth: canvasWidth, canvasHeight: canvasHeight });
          ctx.drawImage(path, 0, 0, res.width, res.height, 0, 0, canvasWidth, canvasHeight)
          ctx.draw(false, function () {
            wx.canvasToTempFilePath({
              canvasId: 'photo_canvas',
              success: function (res) {
               // _this.setData({img: res.tempFilePath});
                console.log(res.tempFilePath);
              }
            })
          })
        }
      })
  },

  upload_img: function(i) {
    var failUp = 0;
    var that = this;
    var j = this.data.tempFiles.length;
    if (i == j) {
      return;
    }
    wx.showLoading({
      title: '上传中(' + (i + 1) + '/' + j + ')...',
    })

    wx.uploadFile({
      url: _baseRequest.domain() + '/order/UploadImg',
      filePath: that.data.tempFiles[i],
      name: 'image_11',
      formData: _baseRequest.getSignData({
        data: {

        }
      }),
      success: function(res) {
        if (i + 1 == j) {
          wx.hideLoading();
          wx.showToast({
            title: '上传完毕(' + (i + 1) + '/' + j + ')',
            duration: 2000
          })
        } else {
          i = i + 1;
          that.upload_img(i)
        }
      },
      fail: function(e) {
        failUp++; //失败+1
      },
      complete: function() {
        // if (i == j ) {
        //   wx.hideLoading();
        //   wx.showToast({
        //     title: '上传完毕,成功' + (j - failUp) + '张,失败' + failUp + '张',
        //     icon: 'none',
        //     duration: 2000
        //   })
        // }
      }
    })
  }
})