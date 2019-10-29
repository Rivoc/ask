
const mongoose = require('mongoose')
const schema = new mongoose.Schema({

  username: { type: String, required: true, },
  password: {
    type: String,
    required: true,
  },
  nickName: { type: String, default: '新人' },//昵称
  avatar: { type: String, default: `http://localhost:3111/uploads/avatar/default.png` },
  signature: { type: String, default: '这个人很懒，什么也没有留下' },
  fans: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'User' }],//有哪些用户是该用户的粉丝
  follow: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'User' }],//该用户关注了谁
})
module.exports = mongoose.model('User', schema)