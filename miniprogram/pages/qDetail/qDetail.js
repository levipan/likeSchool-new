// pages/qDetail/qDetail.js
const PageSize = 2
let currentPage = 1
Page({
  _handlerAnswerSuccess() {
    wx.startPullDownRefresh()
  },
  _handlerLoadMore() {
    this._loadComments(currentPage, (comments) => {
      // 停止下拉刷新
      wx.stopPullDownRefresh()
      if(currentPage === 1) {
        this.setData({
          commentList: comments
        })
      } else {
        this.setData({
          commentList: this.data.commentList.concat(comments)
        })
      }
      

      if (comments.length > 0) {
        currentPage++
      }

    })
  },
  _loadComments(pageNum=1, successCB) {
    this.setData({
      isLoading: true
    })
    wx.cloud.callFunction({
      name: "comments",
      data: {
        start: (pageNum - 1) * PageSize,
        count: PageSize,
        questionID: this.data.questionID
      }
    }).then(res=> {
      // console.log("评论列表数据", res)
      this.setData({
        isLoading: false
      })
      successCB(res.result)
    }).catch(err=>{
      this.setData({
        isLoading: false
      })
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    isLoading: false,
    questionM: {},
    questionID: '',
    commentList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    this.setData({
      questionID: options.questionID
    })
    // 1. 根据问题id, 获取到问题详情数据 -> 渲染
    const db = wx.cloud.database()
    const questionC = db.collection("questions")
    questionC.doc(options.questionID).get().then(res=>{
      res.data.createTime = res.data.createTime.toString()
      this.setData({
        questionM: res.data
      })
    })

    // 2. 问题对应的评论信息获取, -> 渲染
    currentPage = 1
    this._handlerLoadMore()
    
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
    currentPage = 1
    this._handlerLoadMore()
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
    let questionM = this.data.questionM
    if (questionM._id) {
      return {
        title: questionM.question.qContent,
        path: "/pages/qDetail/qDetail?questionID=" + questionM._id,
        imageUrl: questionM.question.fileIDs[0]
      }
    }
  }
})