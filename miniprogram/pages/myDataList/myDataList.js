// pages/myDataList/myDataList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let type = options.type
    let naviTitle = type === "mq" ? "我的提问" : "我的回答"
    wx.setNavigationBarTitle({
      title: naviTitle
    })
    wx.showLoading({
      title: '正在加载...',
    })
    wx.cloud.callFunction({
      name: "getMyData",
      data: {
        type: type
      }
    }).then(res=>{
      // console.log("结果", res)
      wx.hideLoading()
      this.setData({
        questionList: res.result
      })
    })
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
  onShareAppMessage: function (evt) {
    // console.log('用户点击了分享', evt)
    if (evt.target) {
      let questionID = evt.target.dataset.questionid
      // console.log(questionID)
      // 1. 查询问题的信息模型
      let result = this.data.questionList.filter(v => v._id === questionID)[0]
      // console.log(result)
      // 2. 自定义转发内容
      return {
        title: result.question.qContent,
        path: "/pages/qDetail/qDetail?questionID=" + questionID,
        imageUrl: result.question.fileIDs[0]
      }
    }
  }
})