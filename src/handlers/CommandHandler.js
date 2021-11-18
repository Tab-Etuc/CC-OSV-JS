const glob = require('glob')
module.exports = async function loadCommands (bot) {
  const slashCommandFiles = glob.sync('./src/commands/slash/**/*.js')
  const msgCommandFiles = glob.sync('./src/commands/message/**/*.js')

  // 訊息指令
  for (const file of msgCommandFiles) {
    const command = require(`../../${file}`)
    delete require.cache[require.resolve(`../../${file}`)]

    bot.msgCommands.set(command.name, command)
    bot.logger.log('Msg-Commands', `${command.name}`)
  }

  //斜線指令
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
}
