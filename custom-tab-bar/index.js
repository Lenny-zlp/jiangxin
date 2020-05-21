Component({
  data: {
    selected: 0,
    color: "#303030",
    selectedColor: "#eb5902",
    backgroundColor: "#fff",
    cartnum: wx.getStorageSync('cartnum'),
    list: [
      {
        "pagePath": "/pages/home/shop/shop",
        "text": "首页",
        "iconPath": "/pages/image/home.png",
        "selectedIconPath": "/pages/image/curHome.png"
      },
      {
        "pagePath": "/pages/list/list",
        "text": "分类",
        "iconPath": "/pages/image/list.png",
        "selectedIconPath": "/pages/image/curList.png"
      },
      {
        "pagePath": "/pages/shoppingcart/shoppingcart",
        "text": "购物车",
        "iconPath": "/pages/image/cart.png",
        "selectedIconPath": "/pages/image/curCart.png"
      },
      {
        "pagePath": "/pages/user/user",
        "text": "个人",
        "iconPath": "/pages/image/user.png",
        "selectedIconPath": "/pages/image/curUser.png"
      }
    ]
  },
  attached() {
  },
  methods: {
  
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
     
      wx.reLaunch({ url })
      this.setData({
        selected: data.index,
        cartnum: wx.getStorageSync('cartnum')
      })
    }
  }
})