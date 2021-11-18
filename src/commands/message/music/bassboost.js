const levels = {
  無: 0.0,
  低: 0.2,
  中: 0.3,
  高: 0.35
}
module.exports = {
  name: 'bassboost',
  description: '🎵啟用低音效果',
  usage: '<無|低|中|高>',
  permissions: {
    channel: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS'],
    member: []
  },
  aliases: ['bb', 'bass'],
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

    if (!args[0])
      return bot.say.sendTime(
        bot,
        message.channel,
        '**請指定一個效果等級 \n可用的等級:** `無`, `低`, `中`, `高`'
      ) //if the user do not provide args [arguments]

    let level = '無'
    if (args.length && args[0].toLowerCase in levels)
      level = args[0].toLowerCase()

    player.setEQ(
      ...new Array(3)
        .fill(null)
        .map((_, i) => ({ band: i, gain: levels[level] }))
    )

    return bot.say.sendTime(
      bot,
      message.channel,
      `✅ | **低音效果等級已設定至：** \`${level}\``
    )
  }
}
