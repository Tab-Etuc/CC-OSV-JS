const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'remove',
  description: `🎵從播放列中移除一首歌`,
  usage: '[編號]',
  permissions: {
    channel: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS'],
    member: []
  },
  aliases: ['rm'],

  /**
   *
   * @param {import("../base/CC-OSV-Client")} bot
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (bot, message, args, GuildDB) => {
    let player = await bot.manager.players.get(message.guild.id)
    const song = player.queue.slice(args[0] - 1, 1)
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

    if (!player.queue || !player.queue.length || player.queue.length === 0)
      return message.channel.send('播放列中沒有任何東西可以刪除')
    let rm = new MessageEmbed()
      .setDescription(
        `✅ **| 已從播放列移除編號 **\`${Number(args[0])}\`** 之歌曲!`
      )
      .setColor('GREEN')
    if (isNaN(args[0]))
      rm.setDescription(`**用法 - **${bot.botconfig.prefix}\`remove [編號]\``)
    if (args[0] > player.queue.length)
      rm.setDescription(`播放列僅有 ${player.queue.length} 首歌曲！`)
    await message.channel.send(rm)
    player.queue.remove(Number(args[0]) - 1)
  }
}
