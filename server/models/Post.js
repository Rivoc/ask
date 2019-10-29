//提问
const mongoose = require('mongoose')
const schema = new mongoose.Schema({

  title: { type: String },
  body: { type: String },
  category: { type: mongoose.SchemaTypes.ObjectId, ref: 'Category' },
  created_by: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },
  watched_by: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },//有哪些用户关注了这篇文章
  view_count: { type: Number, default: 0 }
},
  {
    timestamps: {
      createdAt: 'created',
      updatedAt: 'updated'
    }

  })

module.exports = mongoose.model('Post', schema)