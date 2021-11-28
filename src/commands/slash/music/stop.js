module.exports = {
  name: 'stop',
  description: '🎵停止播放歌曲。',
  usage: '',
  permissions: {
    channel: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS'],
    member: []
  },
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
      return bot.say.slashError(
        interaction,
        '❌ | **目前沒有播放任何音樂...**'
      )

    player.destroy();

    bot.say.slashInfo(interaction, '**已停止播放!**')
  }
}
