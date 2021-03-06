const Users = require('../mongoDB/Users')

/**
 *
 * @param {string} userId - A discord user ID.
 * @param {string} guildId - A discord guild Id.
 */
function fetchUser (bot, userId, guildId) {
  const someone = bot.users.cache.get(userId)
  if (!someone || someone.bot) return false
  const user = Users.findOne({ userId: userId, guildId: guildId })
  if (!user) {
    const newUser = new Users({
      guildId: message.guildId,
      userId: message.author.id,
      userName: message.user.username
    }).save()
    return newUser
  }
  return user
}

/**
 *
 * @param {string} userId - A discord user ID.
 * @param {string} guildId - A discord guild Id.
 * @param {number} amount - Amount of coins to give.
 */
function give (bot, userId, guildId, amount) {
  const someone = bot.users.cache.get(userId)
  if (!someone || someone.bot) return false
  let user = Users.findOne({ userId: userId, guildId: guildId })
  if (!user) {
    const newUser = new Users({
      guildId: message.guildId,
      userId: message.author.id,
      userName: message.user.username,
      coinsInWallet: parseInt(amount)
    }).save()
    return newUser
  }
  user.coinsInWallet += parseInt(amount)
  user.save()
  return user
}

module.exports = {
  fetchUser,
  give
}
