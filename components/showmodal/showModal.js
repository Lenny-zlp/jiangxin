// components/popup/popup.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    //标题
    title: {
      type: String,
      value: ''
    },
    //内容
    content: {
      type: String,
      value: ''
    },
    //是否显示右上角的关闭1：是 0：否
    showClose: {
      type: String,
      value: '1'
    },
    //是否显示取消按钮1：是 0：否
    showCancel: {
      type: String,
      value: '1'
    },
    //是否显示确定按钮1：是 0：否
    showConfirm:{
      type: String,
      value: '1'
    },
    //取消按钮文字
    cancelText: {
      type: String,
      value: ''
    },
    //确定按钮文字
    confirmText: {
      type: String,
      value: ''
    },
    //取消按钮背景颜色
    cancelBgColor: {
      type: String,
      value: '#fff'
    },
    //确认按钮背景颜色
    confirmBgColor: {
      type: String,
      value: '#eb5902'
    },
    //取消按钮文字颜色
    cancelColor: {
      type: String,
      value: '#888'
    },
    //确认按钮文字颜色
    confirmColor: {
      type: String,
      value: '#eee'
    },
    //图片路径
    imgUrl: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showModal: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**设置标题 */
    setTitle(title){
      this.setData({
        title: title
      })
    },
    /**设置内容 */
    setContent(content) {
      this.setData({
        content: content
      })
    },
    
    /**设置图片路径 */
    setImgUrl(imgUrl){
      this.setData({
        imgUrl: imgUrl
      });
    },

    /**设置取消按钮的背景颜色 */
    setCancelBgColor(color){
        this.setData({
          cancelBgColor: color
        })
    },
    /**设置取消按钮的文字颜色 */
    setCancelColor(color) {
      this.setData({
        cancelColor: color
      })
    },
    /**设置确定按钮的背景颜色 */
    setConfirmBgColor(color) {
      this.setData({
        confirmBgColor: color
      })
    },
    /**设置确定按钮的文字颜色 */
    setConfirmColor(color) {
      this.setData({
        confirmColor: color
      })
    },
    _onClose:function(){
      this.hide()
    },
    /**隐藏 */
    hide() {
      this.setData({
        showModal: false
      })
    },

    /**显示 */
    show() {
      this.setData({
        showModal: true
      })
    },

    _onCancel() {
      this.triggerEvent("cancelEvent")
    },

    _onConfirm() {
      this.triggerEvent("confirmEvent")
    }
  }
})