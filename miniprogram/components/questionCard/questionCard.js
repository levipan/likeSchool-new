// components/questionCard/questionCard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    questionM: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    _handlerDetail() {

      let pages = getCurrentPages()
      let currentPage = pages[pages.length - 1]
      if (currentPage.route !== "pages/qDetail/qDetail") {
        wx.navigateTo({
          url: '/pages/qDetail/qDetail?questionID=' + this.data.questionM._id
        })
      }
      // console.log(pages)
      // return 
     
    },
    _handlerPreviewImage(evt) {
        // console.log(evt)
        wx.previewImage({
          urls: this.data.questionM.question.fileIDs,
          current: evt.currentTarget.dataset.src
        })
    }
  }
})
