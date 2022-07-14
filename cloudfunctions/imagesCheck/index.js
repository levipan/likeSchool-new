// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true
})

// 云函数入口函数
exports.main = async (event, context) => {
  
  // 1. 接收小程序端传递过来的所有文件的二进制内容 + mimeType
  let fileIDs = event.fileIDs
  // let fileIDs =

  let promiseArr = []
  for(let i = 0, len = fileIDs.length; i<len; i++) {
    let promise = new Promise(async (resolve, reject)=>{
      let fileID = fileIDs[i]
      let result = await cloud.downloadFile({
        fileID: fileID
      })
      let fileContent = result.fileContent
      let fileIDArr = fileID.split(".")
      let mimeType = 'image/' + fileIDArr[fileIDArr.length - 1]
      mimeType = mimeType.replace("jpg", "jpeg")
      // console.log(mimeType)
      let checkResult = await cloud.openapi.security.imgSecCheck({
        media: {
          contentType: mimeType,
          value: fileContent
        }
      }).then(res => {
        resolve(true)
      }).catch(err => {
        reject(false)
      })
    })
    promiseArr.push(promise)
  }
  
  return Promise.all(promiseArr).then(res=>{
    console.log("验证成功", res)
    return { success: true }
  }).catch(async err=>{
    console.log("验证失败", err)
    let deleResult = await cloud.deleteFile({
      fileList: fileIDs
    })
    return {success: false}
  })




  
}