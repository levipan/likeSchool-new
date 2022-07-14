// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
  traceUser: true
})

const db = cloud.database()
const questionC = db.collection("questions")
const answerC = db.collection("answer")

// 云函数入口函数
exports.main = async (event, context) => {
  const { OPENID } = cloud.getWXContext()
  let type = event.type

  console.log(OPENID, type)

  if (type === "mq") {
    // 查询所有我发布的问题列表
    let result = await questionC.where({
      _openid: OPENID
    }).orderBy("createTime", "desc").get().then(res=>{
      return res.data
    })
    return result

  } else if (type === "ma") {
    // 查询所有我回答的问题列表
    let questionIDs = await answerC.where({
      _openid: OPENID
    }).field({
      questionID: true,
      _id: false
    }).get().then(res=>{
      let qIDs = res.data.map(v=>v.questionID)
      qIDs = [...new Set(qIDs)]
      return qIDs
    })
    // console.log(questionIDs)
    let result = await questionC.where({
      _id: db.command.in(questionIDs)
    }).orderBy("createTime", "desc").get().then(res=>{
      // console.log(res)
      return res.data
    })
    return result
  }

}