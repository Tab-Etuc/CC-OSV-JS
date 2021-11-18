module.exports = {
  name: 'loopqueue',
  description: '🔂循環整個播放列',
  usage: '',
  permissions: {
    channel: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS'],
    member: []
  },
  aliases: ['lq', 'repeatqueue', 'rq'],
  /**
   * @param {import("../base/CC-OSV-Client")} bot
   * @param {import("discord.js").Message} interaction
   */
  async execute (bot, interaction) {
    await interaction.deferReply()

    let player = bot.manager.players.get(interaction.guild.id)

    const channel = await bot.getChannel(bot, interaction)
    if (!channel) return
    if (!player)
      return bot.say.errorMessage(
        interaction,
        '❌ | **目前沒有播放任何音樂...**'
      )

    if (player.queueRepeat) {
      player.setQueueRepeat(false)
      bot.say.infoMessage(interaction, `:repeat: **播放列循環** \`關閉\``)
    } else {
      player.setQueueRepeat(true)
      bot.say.infoMessage(interaction, `:repeat: **播放列循環** \`啟用\``)
    }
  }
}
