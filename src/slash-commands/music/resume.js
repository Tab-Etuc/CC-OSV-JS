module.exports = {
  name: 'resume',
  description: '🔂重新播放音樂。',
  usage: '',
  permissions: {
    channel: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS'],
    member: []
  },
  aliases: [],

  /**
   * @param {import("../base/CC-OSV-Client")} bot
   * @param {import("discord.js").Message} interaction
   */
  async execute (bot, interaction) {
    await interaction.deferReply()

    const channel = await bot.getChannel(bot, interaction)
    if (!channel) return

    let player = bot.manager.players.get(interaction.guild.id)
    if (!player)
      return bot.say.errorMessage(
        interaction,
        '❌ | **目前沒有播放任何音樂...**'
      )
    if (player.playing)
      return bot.say.errorMessage(interaction, '❌ | **歌曲播放中！**')
    player.pause(false)
    bot.say.infoMessage(interaction, '**⏯ 已重新播放！**')
  }
}
