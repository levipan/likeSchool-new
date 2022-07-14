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

  let questionID = event.questionID

  const db = cloud.database()
  const qC = db.collection("answer")
  let result = await qC.where({
    questionID: questionID
  }).skip(start).limit(count).orderBy("createTime", "desc").get().then(res => {
    return res.data
  })
  return result
}