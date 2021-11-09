const mongoose = require('mongoose')

const guldSchema = mongoose.Schema({
  guildId: String,
  prefix: String,
  CommandsRan: 0,
  SongsPlayed: 0,
  ClockTime: { type: Array, default: [] },
  ClockDate: { type: Array, default: [] },
  EmojiRole: { type: Array, default: [] }
})

module.exports = mongoose.model('Gulids', guldSchema)
