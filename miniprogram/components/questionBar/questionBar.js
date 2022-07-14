// components/questionBar/questionBar.js
let g_userInfo = {}
const db = wx.cloud.database()
const answerC = db.collection("answer")
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
  observers: {
    "questionID": function(v) {
      //  console.log("问题ID, 被赋值了", v)
      answerC.where({
        questionID: v
      }).count().then(res => {
        // console.log("个数", res.total)
        this.setData({
          answerCount: res.total
        })
      })
    }
  },
  pageLifetimes: {
    show: function () {
      // 页面被展示
      answerC.where({
        questionID: this.data.questionID
      }).count().then(res => {
        // console.log("个数", res.total)
        this.setData({
          answerCount: res.total
        })
      })
    }
  },
  // lifetimes: {
  //   attached: function () {
  //     console.log("组件被加载", this.data.questionID)
  //     // 在组件实例进入页面节点树时执行
  //     answerC.where({
  //       questionID: this.data.questionID
  //     }).count().then(res=>{
  //       // console.log("个数", res.total)
  //       this.setData({
  //         answerCount: res.total
  //       })
  //     })
  //   }
  // },
  // // 以下是旧式的定义方式，可以保持对 <2.2.3 版本基础库的兼容
  // attached: function () {
  //   // 在组件实例进入页面节点树时执行
  //   answerC.where({
  //     questionID: this.data.questionID
  //   }).count().then(res => {
  //     // console.log("个数", res.total)
  //     this.setData({
  //       answerCount: res.total
  //     })
  //   })
  
  // },
  /**
   * 组件的属性列表
   */
  properties: {
    questionID: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow: false,
    isModal: false,
    isAnswer: false,
    answerCount: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    _checkContent(content, successCB) {
      wx.showLoading({
        title: '文本检测中...'
      })
      // 1. 文本内容安全检测
      wx.cloud.callFunction({
        name: "contentCheck",
        data: {
          textContent: content
        },
        success: res => {
          wx.hideLoading()
          let success = res.result.success
          if (success) {
            // 完成真正的发布逻辑
            // console.log("执行发布-> 传递数据到云数据库当中")
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
    _handlerPublishAnswer(evt) {
      let content = evt.detail.content
      // console.log("开始发布流程", content)
      this._checkContent(content, ()=>{
          // 2. 把这边的答案数据, 发布到云数据库当中的某一个集合里面
          console.log("准备数据, 传递到云数据库当中的某个集合内")
          // 准备的答案数据模型
          // 1. 用户信息 g_userInfo
          // 2. 答案数据 content
          // 3. 发布时间 动态获取
          // 4. 问题ID questionID
          // console.log(g_userInfo, content, this.data.questionID)  
          
          answerC.add({
            data: {
              userInfo: g_userInfo,
              content,
              questionID: this.data.questionID,
              createTime: db.serverDate()
            }
          }).then(res=>{
            // console.log("添加答案成功")
            this.triggerEvent("answerSuccessEvent")
            wx.showToast({
              title: '回答成功!'
            })
            this.setData({
              // answerCount: this.data.answerCount + 1,
              questionID: this.data.questionID,
              isAnswer: false
            })
          })
      })
      

      


    },
    _handlerUserInfo(userInfo) {
      g_userInfo = userInfo
      // console.log("处理授权成功之后的逻辑", userInfo)
      this.setData({
        isAnswer: true
      })
    },
    _handlerAnswer() {
      wx.getSetting({
        success: (res) => {
          let result = res.authSetting["scope.userInfo"]
          if (result) {
            wx.getUserInfo({
              success: (res) => {
                this._handlerUserInfo(res.userInfo)
              }
            })
          } else {
            this.setData({
              isModal: true
            })
          }
        }
      })

    },
    _handlerAuthorSuccess(evt) {
      
      this.setData({
        isModal: false
      })
      this._handlerUserInfo(evt.detail.userInfo)
    }
  }
})
