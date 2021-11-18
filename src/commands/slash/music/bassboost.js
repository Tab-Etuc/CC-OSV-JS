module.exports = {
  name: 'bassboost',
  description: '🎵啟用低音效果',
  usage: '<無|低|中|高>',
  permissions: {
    channel: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS'],
    member: []
  },
  options: [
    {
      name: '效果等級',
      description: '請指定一個效果等級 \n可用的等級: `無`, `低`, `中`, `高`',
      value: '[level]',
      type: 3,
      required: true
    }
  ],
  /**
   *
   * @param {import("../base/CC-OSV-Client")} bot
   * @param {import("discord.js").Message} interaction
   */

  async execute (bot, interaction) {
    const levels = {
      無: 0.0,
      低: 0.2,
      中: 0.3,
      高: 0.35
    }

    let player = bot.manager.players.get(interaction.guild.id)

    const channel = await bot.getChannel(bot, interaction)
    if (!channel) return

    if (!player)
      return bot.say.errorMessage(
        interaction,
        '❌ | **目前沒有播放任何音樂...**'
      )

    let level = '無'
    let cLevel = await interaction.options.getString('效果等級', true)
    if (cLevel in levels) level = cLevel

    player.setEQ(
      ...new Array(3)
        .fill(null)
        .map((_, i) => ({ band: i, gain: levels[level] }))
    )

    return bot.say.infoMessage(
      interaction,
      `✅ | **低音效果等級已設定至：** \`${level}\``
    )
  }
}
