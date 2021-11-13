const mongoose = require('mongoose')

const guldSchema = mongoose.Schema({
  _id: { type: String, required: false },
  prefix: { type: String, required: false, default: 'C' },
  CommandsRan: 0,
  SongsPlayed: 0,
  ClockTime: { type: Array, required: false, default: [] },
  ClockDate: { type: Array, required: false, default: [] },
  EmojiRole: { type: Array, required: false, default: {} }
})

module.exports = mongoose.model('Gulids', guldSchema)
