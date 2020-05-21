var star = require('../../until/public.js');
var js_request = require('request.js');
var js_image = require('../../until/image_util.js');
import {
  baseRequest
} from '../../until/baseRequest.js';
var _baseRequest = new baseRequest();
Page({

  /**页面的初始数据*/
  data: {
    sku: ''
  },

  /**生命周期函数--监听页面加载*/
  onLoad: function(options) {
    let {
      detail,
      ordercode
    } = options;

    let list = JSON.parse(detail).map((v, i) => {
      v.commentlevel = 5; //初始化评分
      v.content = '';
      v.postimg = [];
      v.starArry = star.starsArray(v.commentlevel);
      return v
    })
    this.setData({
      ordercode: options.ordercode,
      list: list
    })
  },

  onReady: function() {
    //获取用户ip地址
    js_request.getIp(this);
  },

  /**修改星星评分 */
  checkStar: function(e) {
    var productcode = e.currentTarget.dataset.ind;
    var commentlevel = e.target.dataset.index + 1;
    if (!commentlevel) {
      return
    }
    var list = this.data.list.map((v, i) => {
      if (v.ProductCode == productcode) {
        v.commentlevel = commentlevel
        v.starArry = star.starsArray(commentlevel);
      }
      return v
    });
    this.setData({
      list: list
    })
  },

  /**填写评论文章 */
  checkText: function(e) {
    var productcode = e.currentTarget.dataset.sku;
    var content = e.detail.value;
    var list = this.data.list.map((v, i) => {
      if (v.ProductCode == productcode) {
        v.content = content
      }
      return v
    });
    this.setData({
      list: list
    })
  },

  /**选择图片 */
  fileImg: function(e) {
    var that = this;
    this.setData({
      productcode: e.currentTarget.dataset.sku
    })
    //已选择图片的数量
    var imglength = that.data.list.filter((item) => {
      return item.ProductCode == that.data.productcode
    })[0].postimg.length;

    //选择图片
    wx.chooseImage({
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      count: imglength > 5 ? 0 : 5 - imglength,
      success: function(res) {
        //压缩图片
        js_image.compressed(that, 0, 'photo_canvas', res, that._callback_compressed)
      },
      error: function(res) {
        console.log(res);
      }
    })
  },

  /**压缩图片回调 */
  _callback_compressed: function(res, current, last) {
    var data = _baseRequest.getSignData({
      data: {
        productCode: this.data.productcode
      }
    });
    var url = _baseRequest.domain() + '/order/UploadImg';
    js_image.uploadimg(url,data, res.tempFilePath, current, last, this._callback_uplodimg);
  },

  /**上传图片回调 */
  _callback_uplodimg: function (res, path) {
    var productcode = this.data.productcode;
    var res_json = JSON.parse(res.data);
    var res_data = res_json.imgs[0];
    var list = this.data.list.map((v, k) => {
      if (v.ProductCode == productcode) {
        v.postimg.push({
          id: 0,
          commentid: 0,
          useid: 0,
          isdel: 0,
          img: res_data.img,
          localimg: path
        });
      }
      return v
    });
    this.setData({
      list: list
    });
  },

  //预览图片
  previewImage(e) {
    const current = e.target.dataset.src;
    var sku = e.target.dataset.sku;
    var images = this.data.list.filter((item) => {
      return item.ProductCode == sku
    })[0].postimg;

    var preArr = [];
    for (var k in images) {
      preArr.push(images[k].localimg);
    }
    wx.previewImage({
      current,
      urls: preArr
    })
  },

  /**删除图片 */
  deleteImage: function(e) {
    var that = this;
    var sku = e.currentTarget.dataset.sku;
    var images = that.data.list.filter((item) => {
      return item.ProductCode == sku
    })[0].postimg;
    var index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '系统提醒',
      content: '确定要删除此图片吗？',
      success: function(res) {
        if (res.confirm) {
          images.splice(index, 1);
        } else if (res.cancel) {
          return false;
        }
        var list = that.data.list.map((v, i) => {
          if (v.ProductCode == sku) {
            v.postimg = images;
          }
          return v
        });
        that.setData({
          list: list
        });
      }
    })
  },

  /**封装请求数据 package */
  toPackage: function() {
    var list = this.data.list;
    var arr = [];
    for (var i = 0; i < list.length; i++) {
      var temp = {
        productcode: list[i].ProductCode,
        content: list[i].content,
        productname: list[i].ProductName,
        ordercode: this.data.ordercode,
        commentlevel: list[i].commentlevel,
        ip: this.data.ip ? this.data.ip : '',
        userid: _baseRequest._getUser().userid,
        comentimgs: list[i].postimg
      }
      arr.push(temp)
    }
    return arr;
  },

  /**提交请求 */
  submitMessage: function() {
    js_request.toComment(this);
  },

  /**上传图片 */
  // upload_img: function(i, productcode, files) {
  //   var that = this;
  //   var imglength = that.data.list.filter((item) => {
  //     return item.ProductCode == that.data.productcode
  //   })[0].postimg.length;

  //   if (imglength >= 5) {
  //     wx.showToast({
  //       title: '最多只能上传5张图片！',
  //       icon: 'none',
  //       duration: 3000
  //     })
  //     return;
  //   }
  //   var failUp = 0;
  //   var that = this;
  //   var j = files.length;
  //   if (i == j) {
  //     return;
  //   }
  //   wx.showLoading({
  //     title: '上传中(' + (i + 1) + '/' + j + ')...',
  //   })

  //   wx.uploadFile({
  //     url: _baseRequest.domain() + '/order/UploadImg',
  //     filePath: files[i].path,
  //     name: 'image_11',
  //     formData: _baseRequest.getSignData({
  //       data: {
  //         productCode: productcode
  //       }
  //     }),
  //     success: function(res) {
  //       var res_json = JSON.parse(res.data);
  //       var res_data = res_json.imgs[0];
  //       var list = that.data.list.map((v, k) => {
  //         if (v.ProductCode == productcode) {
  //           v.postimg.push({
  //             id: 0,
  //             commentid: 0,
  //             useid: 0,
  //             isdel: 0,
  //             img: res_data.img,
  //             localimg: files[i].path
  //           });
  //         }
  //         return v
  //       });
  //       that.setData({
  //         list: list
  //       });
  //       if (i + 1 == j) {
  //         wx.hideLoading();
  //         wx.showToast({
  //           title: '上传完毕(' + (i + 1) + '/' + j + ')',
  //           duration: 2000
  //         })
  //       } else {
  //         i = i + 1;
  //         that.upload_img(i, productcode, files);
  //       }
  //     },
  //     fail: function(e) {
  //       failUp++; //失败+1
  //     },
  //     complete: function() {}
  //   })
  // }

})