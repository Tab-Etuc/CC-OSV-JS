const glob = require('glob')

module.exports = function loadEvents (bot) {
  const eventFiles = glob.sync('./src/events/**/*.js')

  eventFiles.forEach(file => {
    const event = require(`../../${file}`)

    if (event.once === true) {
      bot.once(event.name, event.execute.bind(null, bot))
    } else if (event.once === false) {
      bot.on(event.name, event.execute.bind(null, bot))
    }

    delete require.cache[require.resolve(`../../${file}`)]

    // debug
    bot.logger.log(
      'events',
      `Loaded BOT: ${event.name}`
    )
  })
}
