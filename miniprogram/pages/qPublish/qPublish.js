// miniprogram/pages/qPublish/qPublish.js
let content = ""
let deviceMsg = ""
const MAXIMAGECOUNT = 9
Page({
  _checkMsgContent(qContent, successCB) {
    wx.showLoading({
      title: '文本检测中...',
    })
    // 1. 文本内容安全检测
    wx.cloud.callFunction({
      name: "contentCheck",
      data: {
        textContent: qContent
      },
      success: res => {
        wx.hideLoading()
        let success = res.result.success
        if (success) {
          // 图片内容安全检测
          successCB()
        } else {
          wx.showToast({
            image: "/assets/images/error.png",
            title: '文本存在违规!',
          })
        }
      }
    })
  },
  _checkImageContent(completeCB) {
    if(this.data.chooseImages.length === 0) {
      completeCB(true, [])
      return
    }
    wx.showLoading({
      title: '正在上传并检测图片'
    })
    let promiseArr = []
    for (let i = 0, len = this.data.chooseImages.length; i < len; i++) {
      let imagePath = this.data.chooseImages[i]

      // 1. 先把图片上传到云存储 -> fileID
      let extName = /\.\w+$/.exec(imagePath)[0]
      let urlName = 'questionImages/' + Date.now() + Math.random() * 1000 + extName
      let promise = wx.cloud.uploadFile({
        cloudPath: urlName,
        filePath: imagePath
      })
      promiseArr.push(promise)
    }

    Promise.all(promiseArr).then(res => {
      let fileIDs = res.map(v => v.fileID)
      // console.log("全部的图片都上传成功", fileIDs)
      wx.cloud.callFunction({
        name: "imagesCheck",
        data: {
          fileIDs
        },
        success: res => {
          wx.hideLoading()
          // console.log("成功回调", res)
          // 如果没有问题, 那么, 就开始真正的去发布问题
          completeCB(res.result.success, fileIDs)
        },
        fail: err => {
          // console.log("失败回调", err)
          wx.hideLoading()
        }
      })
    }).catch(err => {
      console.log("有些图片上传失败", err)
      wx.hideLoading()
    })
  },
  _publishContent(userInfo, userLocation, qContent, fileIDs, deviceMsg) {
    wx.showLoading({
      title: '正在发布...',
    })
    let db = wx.cloud.database()
    let questionsC = db.collection("questions")
    questionsC.add({
      data: {
        userInfo,
        userLocation,
        question: {
          qContent,
          fileIDs
        },
        deviceMsg,
        createTime: db.serverDate()
      }
    }).then(res => {
      wx.hideLoading()
      wx.showToast({
        title: '发布成功!',
        complete: () => {
          wx.navigateBack()
          let pages = getCurrentPages()
          let prePage = pages[pages.length - 2]
          prePage.onPullDownRefresh()
        }
      })
      
    }).catch(err => {
      wx.hideLoading()
    })
  },
  _handlerPublish() {
    // 1. 获取所有需要发布的信息
    // 用户的个人信息: 头像, 昵称
    const userInfo = this.data.userInfo
    let userLocation = this.data.userLocation
    let qContent = content
    // let images = this.data.chooseImages
    // deviceMsg

    // 如果你的小程序内部的内容产生, 是任意的用户登录之后可发布的一个信息, 那么必须要做一个内容安全检查, 否则, 小程序审核, 无法通过
    this._checkMsgContent(qContent, () => {
      // console.log("检测成功")
      this._checkImageContent((isSafe, fileIDs)=>{
        console.log(isSafe, fileIDs)
        if(isSafe) {
          this._publishContent(userInfo, userLocation, qContent, fileIDs, deviceMsg)
        } else {
          wx.showToast({
            image: "/assets/images/error.png",
            title: '图片存在违规'
          })
        }
      })
    })

    
  },
  _handlerDeleteImage(evt) {
    let index = evt.currentTarget.dataset.index
    this.data.chooseImages.splice(index, 1)
    this.setData({
      chooseImages: this.data.chooseImages
    })
  },
  _handlerPreviewImage(evt) {
    wx.previewImage({
      urls: this.data.chooseImages,
      current: evt.currentTarget.dataset.src
    })
  },
  _handlerChooseImage() {
    wx.chooseImage({
      count: MAXIMAGECOUNT - this.data.chooseImages.length,
      success: (res) => {
        this.setData({
          chooseImages: this.data.chooseImages.concat(res.tempFilePaths)
        })
      }
    })
  },
  _chooseLocation() {
    wx.chooseLocation({
      latitude: this.data.userLocation.latitude,
      longitude: this.data.userLocation.longitude,
      success: (res) => {
        delete res["errMsg"]
        this.setData({
          userLocation: res
        })
      }
    })
  },
  _handlerLocation() {

    wx.getSetting({
      success: res=>{
        console.log(res)
        if (res.authSetting["scope.userLocation"]) {
          this._chooseLocation()
        } else {
          wx.authorize({
            scope: 'scope.userLocation',
            success: res=>{
              console.log("授权成功")
              this._chooseLocation()
            },
            fail: err=>{
              console.log("授权失败")
              wx.showModal({
                title: '打开设置页面',
                content: '当前没有授权, 是否打开授权页面进行开启位置授权?',
                success: res=>{
          
                  if (res.confirm) {
                    wx.openSetting({
                      success: res=>{
                        if (res.authSetting["scope.userLocation"]) {
                          this._chooseLocation()
                        }
                      }
                    })
                  }
                }
              })
            }
          })
        }
      }
    })

  },

  _handlerBlur(evt) {
    this.setData({
      publishBarToBottom: 0
    })
  },
  _handlerFocus(evt) {
    this.setData({
      publishBarToBottom: evt.detail.height
    })
  },
  _handlerInput(evt) {
    // console.log(evt)
    content = evt.detail.value
    this.setData({
      leftLength: this.data.maxLength - content.length,
      canPublish: content.trim().length !== 0
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    isShow: false,
    userInfo: {},
    maxLength: 150,
    leftLength: 150,
    canPublish: false,
    publishBarToBottom: 0,
    userLocation: {},
    chooseImages: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // 方案3: eventChannel
    let ec = this.getOpenerEventChannel()
    ec.on && ec.on("getUserInfoEvent", res=>{
      console.log("触发了获取用户信息的事件", res)
      this.setData({
        userInfo: res.userInfo
      })
    })


    // 方案2: url?pa1=v1&pa2=v2
    // console.log(options)

    // 方案1 
    // let app = getApp()
    // let userInfo = app.globalData.userInfo
    // console.log(userInfo)

    // 获取当前的设备信息
    wx.getSystemInfo({
      success: (res) => {
        deviceMsg = res.model.split("<")[0]
      }
    })

    // 在组件实例进入页面节点树时执行
    let app = getApp()
    let isShow = app.globalData ? app.globalData.isShow : false
    this.setData({
      isShow: isShow
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
  onShareAppMessage: function () {

  }
})