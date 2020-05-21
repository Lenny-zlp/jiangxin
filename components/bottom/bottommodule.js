// components/bottom/bottommodule.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
  },
  properties: {
    title: {
      type: String,
      value: ''
    },
    sure: {
      type: String,
      value: ''
    }
  },
  methods:{
    hide(){
      this.setData({
       showModal:false
      })
    },
    show() {
      this.setData({
        showModal: true
      })
    },
    sureBtn(){
      this.triggerEvent('sure')
    }
  }
})