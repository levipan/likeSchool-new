// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true
})

// 云函数入口函数
exports.main = async (event, context) => {
  let start = event.start || 0
  let count = event.count || 5
  let key = event.key || ''
  const db = cloud.database()
  const qC = db.collection("questions")
  let whereObj = {}
  if(key.trim().length > 0) {
   whereObj = {
      "question.qContent": db.RegExp({
        "regexp": key,
        "options": "i"
      })
    }
  }
  let result = await qC.where(whereObj).skip(start).limit(count).orderBy("createTime", "desc").get().then(res=>{
    return res.data
  })
  return result
}