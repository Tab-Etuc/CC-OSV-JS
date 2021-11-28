module.exports = {
  name: 'pause',
  description: '⏸暫停音樂。',
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
      return bot.say.slashError(
        interaction,
        '❌ | **目前沒有播放任何音樂...**'
      )
    if (player.paused) return bot.say.slashError(interaction, '音樂暫停中！')
    player.pause(true)
    bot.say.slashInfo(interaction, '**⏸ 已暫停！**')
  }
}
