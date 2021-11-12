const glob = require('glob')
const { readdirSync } = require('fs')
const { join } = require('path')
module.exports = async function loadCommands (bot) {
  const slashCommandFiles = glob.sync('./src/slash-commands/**/*.js')
  const msgCommandFiles = readdirSync(
    join(__dirname, '../message-commands')
  ).filter(file => file.endsWith('.js'))

  for (const file of slashCommandFiles) {
    const command = require(`../../${file}`)

    const data = {
      name: command.name,
      description: command?.description ?? 'Empty description',
      options: command?.options ?? []
    }

    await bot.application?.commands.create(data)

    delete require.cache[require.resolve(`../../${file}`)]

    bot.slashCommands.set(command.name, command)

    // debug
    bot.logger.log('Slash-Commands', `${command.name}`)
  }
  for (const file of msgCommandFiles) {
    const command = require(join(__dirname, '../message-commands', `${file}`))
    bot.msgCommands.set(command.name, command)
    bot.logger.log('Msg-Commands', `${command.name}`)
  }
}
