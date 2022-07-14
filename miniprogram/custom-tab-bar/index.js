// custom-tab-bar/index.js
Component({
 
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    selected: 0,
    color: "#707070",
    selectedColor: "#d4237a",
    list: [{
      "pagePath": "/pages/home/home",
      "text": "撩课程",
      "iconPath": "/assets/images/tabbar/home_normal.png",
      "selectedIconPath": "/assets/images/tabbar/home_selected.png"
    }, {
      "pagePath": "/pages/qAnda/aAnda",
      "text": "撩答疑",
      "iconPath": "/assets/images/tabbar/discover_normal.png",
      "selectedIconPath": "/assets/images/tabbar/discover_selected.png"
    },
    {
      "pagePath": "/pages/mine/mine",
      "text": "撩我",
      "iconPath": "/assets/images/tabbar/mine_normal.png",
      "selectedIconPath": "/assets/images/tabbar/mine_selected.png"
    }]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _handlerTap(evt) {
      let index = evt.currentTarget.dataset.index;

      this.setData({
        selected: index
      })


      // 切换tabbar 对应的页面
      let pagePath = this.data.list[index].pagePath
      wx.switchTab({
        url: pagePath,
      })

    }
  }
})
