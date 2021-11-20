const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  guildId: { type: String, required: false },
  userId: { type: String, required: false },
  userName: { type: String, required: false },
  xp: { type: Number, required: false, default: 0 },
  level: { type: Number, required: false, default: 1 },
  totalXp: { type: Number, required: false, default: 0 },
  xpToLevel: { type: Number, required: false, default: 100 },
  coinsInWallet: { type: Number, required: false, default: 100 },
  coinsInBank: { type: Number, required: false, default: 500 },
  bankSpace: { type: Number, required: false, default: 2500 },
  items: { type: Array, required: false, default: [] },
  interest: { type: Number, required: false, default: 1 }
})

module.exports = mongoose.model('Users', userSchema)
