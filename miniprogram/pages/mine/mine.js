// miniprogram/pages/mine/mine.js
Page({
  _handlerTJ() {
    wx.cloud.callFunction({
      name: "getMiniCode"
    }).then(res=>{
      console.log(res)
      let codeFileID = res.result
      wx.previewImage({
        urls: [codeFileID]
      })
    })
  },
  _handlerMyData(evt) {
    let type = evt.currentTarget.dataset.type 
    console.log(evt)
    wx.navigateTo({
      url: "/pages/myDataList/myDataList?type=" + type,
    })
  },
  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (typeof this.getTabBar === "function" && this.getTabBar()) {
      let tabBar = this.getTabBar()
      tabBar.setData({
        selected: 2
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})