/*
七牛云配置
*/
const qiniu = require('qiniu')

// 创建上传凭证
const accessKey = 'okMmGjsUG0zOBy5MTuhYk7tX838E-C3NcSe1pGJo'
const secretKey = 'UQF0b8LRJkGbFtJzcCoJYjxXx391eMkpni5gAUGv'
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
const options = {
  scope: 'makeexam',
  expires: 7200
}
const putPolicy = new qiniu.rs.PutPolicy(options)
const uploadToken = putPolicy.uploadToken(mac)

module.exports = {
  uploadToken
}