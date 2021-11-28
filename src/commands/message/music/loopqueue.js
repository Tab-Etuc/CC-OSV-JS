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
   *
   * @param {import("../base/CC-OSV-Client")} bot
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (bot, message, args, GuildDB) => {
    let player = await bot.manager.get(message.guild.id)
    if (!player)
      return bot.say.msgEmbed(
        bot,
        message.channel,
        '❌ | **目前沒有播放任何音樂...**'
      )
    if (!message.member.voice.channel)
      return bot.say.msgEmbed(
        bot,
        message.channel,
        '❌ | **您必須在語音通道中使用此指令！**'
      )
    if (
      message.guild.me.voice.channel &&
      message.member.voice.channel.id !== message.guild.me.voice.channel.id
    )
      return bot.say.msgEmbed(
        bot,
        message.channel,
        '❌ | **您必須和我在相同的語音通道以使用此指令！**'
      )

    if (player.queueRepeat) {
      player.setQueueRepeat(false)
      bot.say.msgEmbed(bot, message.channel, `:repeat: 播放列循環 \`關閉\``)
    } else {
      player.setQueueRepeat(true)
      bot.say.msgEmbed(bot, message.channel, `:repeat: 播放列循環 \`啟用\``)
    }
  }
}
