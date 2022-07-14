// components/searchBar/searchBar.js
let value = ""
Component({
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      let app = getApp()
      let isShow = app.globalData ? app.globalData.isShow : false
      this.setData({
        isShow: isShow
      })
    }
  },
  // 以下是旧式的定义方式，可以保持对 <2.2.3 版本基础库的兼容
  attached: function () {
    let app = getApp()
    let isShow = app.globalData ? app.globalData.isShow : false
    this.setData({
      isShow: isShow
    })
  },
  /**
   * 组件的属性列表
   */
  properties: {
  
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _handlerInput(evt) {
      value = evt.detail.value
    },
    _handlerPublish() {
      this.triggerEvent("publish")
    },
    _handlerSearch() {
      // console.log(value)
      this.triggerEvent("search", {
        value: value
      })
    }
  }
})
