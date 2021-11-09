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

    const statuses = bot.config.Presence
    setInterval(() => {
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      bot.user.setPresence({
        status: statuses.status,
        name: status.name,
        type: status.type
      })
    }, 60000)
  }
}
