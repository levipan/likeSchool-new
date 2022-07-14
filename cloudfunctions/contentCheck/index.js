// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true
})

// 云函数入口函数
exports.main = async (event, context) => {
  // 文本的内容安全检测
  // 文本内容传递过来
  let textContent = event.textContent
   let result = await cloud.openapi.security.msgSecCheck({
    content: textContent
  }).then(res=>{
    // console.log("检查成功", res)
    return {success: 1}
  }).catch(err=>{
    // console.log("检查失败", err)
    return { success: 0 }
  })
  return result

}