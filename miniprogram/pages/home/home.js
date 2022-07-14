// miniprogram/pages/home/home.js

let currentPage = 1

Page({

  _loadStageData(pageNum=1, pageSize=2) {
    this.setData({
      isLoading: true
    })
    wx.cloud.callFunction({
      name: "getStageData",
      data: {
        pageNum: pageNum,
        pageSize: pageSize
      },
      success: (res) => {
        // console.log(res)
        if(res.result.length > 0) {
          currentPage ++
        }
        this.setData({
          stageData: this.data.stageData.concat(res.result)
        })
      },
      complete: () => {
        this.setData({
          isLoading: false
        })
      }
    })

  },
  _handlerLoadMore() {
    console.log("加载更多")
    this._loadStageData(currentPage)

  },
  _updateComments(index) {
    let currentItem = this.data.freeLive[index]
    let comments = currentItem.comments
    this.setData({
      currentComments: comments
    })
  },
  _handlerChange(evt) {
    let index = evt.detail.current
    this._updateComments(index)
  },
  _handlerHref(evt) {
    
    // console.log(evt)
    let obj = evt.currentTarget.dataset.mini
    console.log(obj)
    obj.fail = function () {
      
      wx.showToast({
        image: "/assets/images/error.png",
        title: '打开三方小程序失败!'
      })

    }
    wx.navigateToMiniProgram(obj)

  },
  /**
   * 页面的初始数据
   */
  data: {
    liveClass: {},
    freeLive: [],
    currentComments: [],
    stageData: [],
    isLoading: false,
    videoInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      wx.cloud.callFunction({
        name: "getLiveClass",
        success: (res) => {
          // console.log(res)
          this.setData({
            liveClass: res.result
          })
        }
      })

    wx.cloud.callFunction({
      name: "getFreeLive",
      success: (res) => {
        
        this.setData({
          freeLive: res.result
        },  () => {
          // console.log(res)
          if (res.result.length > 0) {
            this._updateComments(0)
          }
        })
      }
    })

    this._loadStageData(currentPage)


    wx.cloud.callFunction({
      name: "getAboutUS",
      success: (res) => {
       console.log(res)
       this.setData({
         videoInfo: res.result
       })
      }
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
        selected: 0
      })
    }
     
    //  console.log(tabBar)
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