const { version } = require('discord.js')
const os = require('os')
const moment = require('moment')


module.exports = {
  name: 'botinfo',
  description: '展示bot資訊',
  category: '實用',
  async execute (bot, interaction) {
    let MTBS = await bot.getLanguage(interaction.guildId)
    MTBS = MTBS.commands.utility.BotInfo
    const uptime = moment
      .duration(bot.uptime)
      .format(' D [天], H [小時], m [分], s [秒]')
    const nodev = process.version
    const createdAt = Math.floor(new Date(bot.user.createdAt).getTime() / 1000)
    const users = bot.guilds.cache.reduce((a, g) => a + g.memberCount, 0)
    const core = os.cpus()[0]

    const embed = bot.say
      .baseEmbed(interaction)
      .setAuthor(
        MTBS.author.format(bot.user.username),
        bot.user.displayAvatarURL()
      )
      .addField(
        MTBS.FieldTitleI,
        MTBS.FieldValueI.format(bot.user.id, bot.user.tag, createdAt)
      )
      .addField(
        MTBS.FieldTitleII,
        MTBS.FieldValueII.format(
          bot.utils.formatNumber(users),
          bot.utils.formatNumber(bot.guilds.cache.size),
          bot.utils.formatNumber(bot.channels.cache.size),
          bot.utils.formatNumber(bot.slashCommands.size)
        )
      )
      .addField(
        MTBS.FieldTitleIII,
        MTBS.FieldValueIII.format(
          (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
          (os.totalmem() / 1024 / 1024 / 1024).toFixed(2),
          uptime,
          nodev,
          version,
          core.model,
          os.cpus().length,
          core.speed,
          os.arch(),
          toCapitalize(process.platform)
        )
      )
    return interaction.reply({
      ephemeral: true,
      embeds: [embed],
      allowedMentions: { repliedUser: false }
    })
  }
}
/**
 * @param {string} str
 * @returns {string}
 */
function toCapitalize (str) {
  if (str === null || str === '') {
    return false
  } else {
    str = str.toString()
  }

  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}

