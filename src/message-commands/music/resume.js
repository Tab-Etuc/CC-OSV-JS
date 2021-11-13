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
   *
   * @param {import("../base/CC-OSV-Client")} bot
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (bot, message, args, GuildDB) => {
    let player = await bot.manager.get(message.guild.id)
    if (!player)
      return bot.say.sendTime(
        bot,
        message.channel,
        '❌ | **目前沒有播放任何音樂...**'
      )
    if (!message.member.voice.channel)
      return bot.say.sendTime(
        bot,
        message.channel,
        '❌ | **您必須在語音通道中使用此指令！**'
      )
    if (
      message.guild.me.voice.channel &&
      message.member.voice.channel.id !== message.guild.me.voice.channel.id
    )
      return bot.say.sendTime(
        bot,
        message.channel,
        '❌ | **您必須和我在相同的語音通道以使用此指令！**'
      )

    if (player.playing)
      return bot.say.sendTime(bot, message.channel, '❌ | **歌曲播放中！**')
    player.pause(false)
    await message.react('✅')
  }
}
