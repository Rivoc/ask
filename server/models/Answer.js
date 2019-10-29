//回答
const mongoose = require('mongoose')
const schema = new mongoose.Schema({
  body: { type: String },
  answer_for: { type: mongoose.SchemaTypes.ObjectId, ref: 'Post' },//回复了哪篇提问
  created_by: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },//谁的回答
  collected_by: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },//被谁收藏

}, {
  timestamps: {//created和updated为自定义的自动记录时间的字段名，分别记录创建时间与更新时间
    createdAt: 'created',
    updatedAt: 'updated'
  }
})
module.exports = mongoose.model('Answer', schema)