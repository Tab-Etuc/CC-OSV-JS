const mongoose = require('mongoose')

const wSchema = mongoose.Schema({
  msgId: { type: String, required: false },
  content: { type: String, required: false },
  count: { type: Number, required: false },
  member:{type:Array, required: false, default: []}
})

module.exports = mongoose.model('HomeWork', wSchema)
