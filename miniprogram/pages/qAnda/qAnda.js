// miniprogram/pages/qAnda/aAnda.js
const PageSize = 5
let currentPage = 1
let key = ''
Page({

  _handlerUserInfo(userInfo) {
    console.log("用户授权成功, 获取到用户的信息", userInfo)

    // 保存到全局数据里面 App对象内部
    // let app = getApp()
    // app.globalData.userInfo = userInfo

    // 跳转到真正的发布页面, 并且把用户信息传递过去
    wx.navigateTo({
      // url: '/pages/qPublish/qPublish?name="sz"&age=18'
      url: '/pages/qPublish/qPublish',
      success: (res)=>{
        // console.log("跳转页面成功", res)
        res.eventChannel.emit("getUserInfoEvent", { userInfo })
      }
    })
  },
  _handlerAuthorSuccess(evt) {
    // console.log("授权成功", evt.detail.userInfo)
    // 后续事情
    this.setData({
      isModal: false
    })
    this._handlerUserInfo(evt.detail.userInfo)

  },
 
  _handlerSearch(evt) {
    key = evt.detail.value
    wx.startPullDownRefresh()
  },

  _handlerPublish() {
    // console.log("点击了发布按钮")
    wx.getSetting({
      success: (res) => {
        let result = res.authSetting["scope.userInfo"]
        if(result) {
          // console.log("用户已经授权成功-个人信息")
          // 代表已经授权,可以直接通过方法, 来获取用户的信息
          wx.getUserInfo({
            success: (res) => {
              // console.log("授权已经成功, 获取到了用户信息", res)
              let userInfo = res.userInfo
              this._handlerUserInfo(userInfo)
            }
          })
        }else {
          // console.log("没有授权, 应该弹出一个窗口(按钮 open-type = 'getUserInfo')")
          this.setData({
            isModal: true
          })
        }
      }
    })


  },
  /**
   * 页面的初始数据
   */
  data: {
    isModal: false,
    questionList: [],
    isLoadMore: false
  },
  
  _loadData(pageNum=1, successCB) {
    currentPage = pageNum
    wx.cloud.callFunction({
      name: "questions",
      data: {
        start: (pageNum - 1) * PageSize,
        count: PageSize,
        key: key
      },
      success: res=>{
        // console.log(typeof res.result[0].createTime)
        successCB(res.result)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.startPullDownRefresh()
    
    // console.log("加载数据")
    // this._loadData(1, result => {
    //   // console.log("架子啊数据完成", result)
    //   this.setData({
    //     questionList: result
    //   })
    // })
  },
  /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
  onPullDownRefresh: function () {
    console.log("加载数据")
    this._loadData(1, result => {
      // console.log("架子啊数据完成", result)
      wx.stopPullDownRefresh()
      this.setData({
        questionList: result
      })
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      isLoadMore: true
    })
    console.log("触底, 需要加载下一页数据")
    currentPage++
    this._loadData(currentPage, result => {
      if(result.length === 0) {
        currentPage--
      }
      this.setData({
        isLoadMore: false,
        questionList: this.data.questionList.concat(result)
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
    
    if (typeof this.getTabBar === "function" && this.getTabBar()) {
      let tabBar = this.getTabBar()
      tabBar.setData({
        selected: 1
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function (evt) {

    // console.log('用户点击了分享', evt)
    if(evt.target) {
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