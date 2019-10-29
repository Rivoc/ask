//回答
const mongoose = require('mongoose')
const schema = new mongoose.Schema({
  like_for: { type: mongoose.SchemaTypes.ObjectId, ref: 'Answer' },//点赞了哪条回答
  user: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },//点赞的人
  enum: [0, 1]//0取消，1有效
}, {
  timestamps: {//created和updated为自定义的自动记录时间的字段名，分别记录创建时间与更新时间
    createdAt: 'created',
    updatedAt: 'updated'
  }
})
module.exports = mongoose.model('Like', schema)