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

    let player = await bot.manager.get(interaction.guild.id)
    const guild = bot.guilds.cache.get(interaction.guild.id)
    const member = guild.members.cache.get(interaction.member.user.id)
    let channel = await bot.getChannel(bot, interaction)
    if (!player)
      return bot.say.errorMessage(
        interaction,
        '❌ | **目前沒有播放任何音樂...**'
      )
    if (!member.voice.channel)
      return bot.say.errorMessage(
        interaction,
        '❌ | **您必須先加入一個語音頻道！**'
      )
    if (guild.me.voice.channel && !guild.me.voice.channel.equals(channel))
      return bot.say.errorMessage(
        interaction,
        ':x: | **您必須和我在相同的語音通道以使用此命令！**'
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
