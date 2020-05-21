//<canvas canvas-id="photo_canvas" style="width:{{canvasWidth}}px;height:{{canvasHeight}}px;position: absolute;left:-1000px;top:-1000px;"></canvas>
//等比例压缩图片,使用此方法页面中必须要有画布canvas，画布宽高必须为width:{{canvasWidth}}px;height:{{canvasHeight}}px

/**
 * 压缩图片--使用方法见评价商品
 * i：图片索引，递归调用，i会自动加一，第一次调用的时候值为0
 * canvasid：页面中的画布ID
 * file：要压缩的图片文件
 * _callback：压缩成功后的回调函数
 */
function compressed(_this,i,canvasid,file,_callback){
  if (i < file.tempFilePaths.length) {
    wx.getImageInfo({
      src: file.tempFilePaths[i],
      success: function (res) {
        var ctx = wx.createCanvasContext(canvasid);
        var ratio = 1.5;
        var canvasWidth = res.width
        var canvasHeight = res.height;
        var ww = wx.getSystemInfoSync().windowWidth;
        var wh = wx.getSystemInfoSync().windowHeight;
        //如果画布尺寸大于屏幕则继续等比例缩放
        while (canvasWidth > ww || canvasHeight > wh) {
          //比例取整
          canvasWidth = Math.trunc(res.width / ratio)
          canvasHeight = Math.trunc(res.height / ratio)
          ratio = ratio + 0.1;
        }
        _this.setData({
          canvasWidth: canvasWidth,
          canvasHeight: canvasHeight
        }) //设置canvas尺寸
        ctx.drawImage(file.tempFilePaths[i], 0, 0, res.width, res.height, 0, 0, canvasWidth, canvasHeight)
        ctx.draw(false, function () {
          setTimeout(function () {
            wx.canvasToTempFilePath({
              canvasId: canvasid,
              success: function (res) {
                _callback(res, i + 1, file.tempFilePaths.length);  //压缩成功执行回调，比如上传
                i++;
                compressed(_this, i, canvasid, file, _callback); //递归调用压缩方法
              },
              fail: function (error) {
                console.log(error)
              }
            })
          }, 100)
        })
      },
      fail: function (error) {
        console.log(error)
      }
    })
  }
}

/**
 * 上传图片--使用方法见评价商品
 * url：上传图片的服务器地址
 * data：formData参数
 * path：要上传图片的本地路径
 * current：int类型，当前第几个图片
 * last：int类型，总共几张图片
 * _callback：上传成功后的回调函数
 */
function uploadimg(url, data, path, current, last, _callback){
  wx.showLoading({
    title: '上传中(' + current + '/' + last + ')...',
  })

  wx.uploadFile({
    url: url,
    filePath: path,
    name: 'imagefile',
    formData: data,
    success: function (res) {
      if (current == last) {
        wx.showToast({
          title: '上传完毕(' + current + '/' + last + ')',
          duration: 2000
        })
      }
      _callback(res, path);
    }
  })
}
module.exports = {
  compressed: compressed,
  uploadimg: uploadimg
}