const { version } = require('discord.js')
const os = require('os')
const moment = require('moment')

module.exports = {
  name: 'botinfo',
  description: '展示bot資訊',
  category: '實用',
  async execute (bot, interaction) {
    const util = bot.utils
    const uptime = moment
      .duration(bot.uptime)
      .format(' D [天], H [小時], m [分], s [秒]')
    const nodev = process.version
    const createdAt = bot.user.createdAt
    const users = bot.guilds.cache.reduce((a, g) => a + g.memberCount, 0)
    const core = os.cpus()[0]

    const embed = bot.say
      .baseEmbed(interaction)
      .setAuthor(`${bot.user.username}的資訊`, bot.user.displayAvatarURL())
      .addField(
        '__**一般介紹**__',
        `**Bot Id:** ${bot.user.id}
**Bot Tag:** ${bot.user.tag}
**創建於 :** <t:${createdAt}:F>
**創建者: [CC_#8844](https:www.youtube.com)**`
      )
      .addField(
        '__**狀態:**__',
        `**用戶:** ${util.formatNumber(users)}
**伺服器:** ${util.formatNumber(bot.guilds.cache.size)}
**頻道:** ${util.formatNumber(bot.channels.cache.size)}
**指令數:** ${util.formatNumber(bot.slashCommands.size)}`
      )
      .addField(
        '__**系統介紹**__',
        `**已使用 記憶體:**  ${(
          process.memoryUsage().heapUsed /
          1024 /
          1024
        ).toFixed(2)} MB
**記憶體總數:** ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB
**已上線時間:** ${uptime}
**Node 版本:** ${nodev}
**Discord.js 版本:** ${version}
**CPU:** ${core.model}
**核心數:** ${os.cpus().length}
**速度:** ${core.speed} MHz
**位元:** ${os.arch()}
**作業系統:** ${util.toCapitalize(process.platform)}`
      )
    return interaction.reply({
      ephemeral: true,
      embeds: [embed],
      allowedMentions: { repliedUser: false }
    })
  }
}
