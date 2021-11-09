require('dotenv').config()

const mongoose = require('mongoose')

module.exports = {
  name: 'ready',
  once: true,
  async execute (bot) {
    //initializing commands
    require('../../handlers/CommandHandler')(bot)

    mongoose
      .connect(bot.config.MongoDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .then(() => {
        bot.logger.log('database', `Connected to the Mongodb database.`)
      })
      .catch(err => {
        bot.logger.error(
          'database',
          `Unable to connect to the Mongodb database. Error:` + err
        )
      })
    bot.logger.log('EVENTS', `Bot: 已上線。`)
    bot.manager.init(bot.user.id)
    const formatNum = bot.utils.formatNumber
    const serverCount = formatNum(bot.guilds.cache.size)
    const userCount = formatNum(
      bot.guilds.cache.reduce((a, g) => a + g.memberCount, 0)
    )
    const statuses = [
      {
        status: 'idle',
        name: `正服務 ${serverCount} 個伺服器 和 ${userCount} 位使用者`,
        type: 'LISTENING'
      },
      { status: 'idle', name: 'CC-OSV 測試版', type: 'WATCHING' },
      { status: 'idle', name: '由 CC_#8844 編寫', type: 'WATCHING' }
    ]
    setInterval(() => {
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      bot.user.setPresence({
        activities: [{ name: status.name, type: status.type }],
        status: statuses.status
      })
    }, 60000)
  }
}
