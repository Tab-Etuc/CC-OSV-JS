const mongoose = require('mongoose')

const guldSchema = mongoose.Schema({
  _id: { type: String, required: false },
  prefix: { type: String, required: false, default: 'C' },
  Language: { type: String, required: false, default: 'zh-TW' },
  CommandsRan: 0,
  SongsPlayed: 0,
  ClockTime: { type: Array, required: false, default: [] },
  ClockDate: { type: Array, required: false, default: [] },
  EmojiRole: { type: Array, required: false, default: {} }
})

module.exports = mongoose.model('Gulids', guldSchema)
