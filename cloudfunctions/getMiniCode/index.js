// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true
})

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    let result = await cloud.openapi.wxacode.getUnlimited({
      scene: 'itlike',
      width: 860,
      autoColor: true
    }).then(async res=>{
      let buffer = res.buffer
      let result2 = await cloud.uploadFile({
        cloudPath: "miniCode/itlikeCode.png",
        fileContent: buffer
      }).then(res=>{
        // console.log(res)
        return res.fileID
      })
      return result2
    })
    return result
   
  } catch (err) {
    // console.log(err)
    return ''
  }
}