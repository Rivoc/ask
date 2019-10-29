//回复
const mongoose = require('mongoose')
const schema = new mongoose.Schema({
  body: { type: String },
  reply_for: { type: mongoose.SchemaTypes.ObjectId, ref: 'Answer' },//回复某个问题下的哪个回答
  created_by: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },//谁的回答
}, {
  timestamps: {
    createdAt: 'created',
    updatedAt: 'updated'
  }
})
module.exports = mongoose.model('Reply', schema)