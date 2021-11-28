const { MessageEmbed } = require('discord.js')
const ProgressBar = require('../../../models/music/ProgressBar')

module.exports = {
  name: 'nowplaying',
  description: '🎵查看目前正在播放的歌曲',
  usage: '',
  permissions: {
    channel: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS'],
    member: []
  },
  aliases: ['np', 'nowplaying', 'now playing'],
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

    let song = player.queue.current
    let QueueEmbed = new MessageEmbed()
      .setAuthor('正在播放', bot.config.IconURL)
      .setColor(bot.config.EmbedColor)
      .setDescription(`[${song.title}](${song.uri})`)
      .addField('請求者', `${song.requester}`, true)
      .addField(
        '持續時間',
        `${
          ProgressBar(player.position, player.queue.current.duration, 15)
            .Bar
        } \`${bot.ms(player.position, {
          colonNotation: true
        })} / ${bot.ms(player.queue.current.duration, {
          colonNotation: true
        })}\``
      )
      .setThumbnail(player.queue.current.displayThumbnail())
    return message.channel.send({ embeds: [QueueEmbed] })
  }
}
