const mongoose = require('mongoose')

const guldSchema = mongoose.Schema({
  guildId: String,
  prefix: String,
  CommandsRan: 0,
  SongsPlayed: 0,
  EmojiRole: { type: Array, default: [] },
  ClockTime: { type: Array, default: [] },
  ClockDate: { type: Array, default: [] }
})

module.exports = mongoose.model('Gulids', levelSchema)
