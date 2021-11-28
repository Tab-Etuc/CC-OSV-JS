module.exports = {
  name: 'loop',
  description: '🔂循環當前的歌曲。',
  usage: '',
  permissions: {
    channel: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS'],
    member: []
  },
  aliases: ['l', 'repeat'],
  /**
   * @param {import("../base/CC-OSV-Client")} bot
   * @param {import("discord.js").Message} interaction
   */
  async execute (bot, interaction) {
    await interaction.deferReply()

    const channel = await bot.getChannel(bot, interaction)
    if (!channel) return
    let player = await bot.manager.players.get(interaction.guild.id)
    if (!player)
      return bot.say.slashError(
        interaction,
        '❌ | **目前沒有播放任何音樂...**'
      )
    if (player.trackRepeat) {
      player.setTrackRepeat(false)
      bot.say.slashInfo(interaction, `🔂 \`關閉\``)
    } else {
      player.setTrackRepeat(true)
      bot.say.slashInfo(interaction, `🔂 \`啟用\``)
    }
  }
}
