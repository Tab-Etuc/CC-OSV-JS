const { MessageEmbed } = require('discord.js')
const _ = require('lodash')
const Pagination = require('../../../models/music/pagination')
const ProgressBar = require('../../../models/music/ProgressBar')

module.exports = {
  name: 'queue',
  description: '🎵顯示所有目前播放列中的歌曲',
  usage: '',
  permissions: {
    channel: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS'],
    member: []
  },
  aliases: ['q'],
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

    if (!player.queue || !player.queue.length || player.queue === 0) {
      let QueueEmbed = new MessageEmbed()
        .setAuthor('目前正在播放', bot.botconfig.IconURL)
        .setColor(bot.botconfig.EmbedColor)
        .setDescription(
          `[${player.queue.current.title}](${player.queue.current.uri})`
        )
        .addField('請求者', `${player.queue.current.requester}`, true)
        .addField(
          '持續時間',
          `${
            ProgressBar(player.position, player.queue.current.duration, 15)
              .Bar
          } \`[${bot.ms(player.position, {
            colonNotation: true
          })} / ${bot.ms(player.queue.current.duration, {
            colonNotation: true
          })}]\``
        )
        .setThumbnail(player.queue.current.displayThumbnail())
      return message.channel.send(QueueEmbed)
    }

    let Songs = player.queue.map((t, index) => {
      t.index = index
      return t
    })

    let ChunkedSongs = _.chunk(Songs, 10) //How many songs to show per-page

    let Pages = ChunkedSongs.map(Tracks => {
      let SongsDescription = Tracks.map(
        t =>
          `\`${t.index + 1}.\` [${t.title}](${t.uri}) \n\`${bot.ms(t.duration, {
            colonNotation: true
          })}\` **|** 請求者: ${t.requester}\n`
      ).join('\n')

      let Embed = new MessageEmbed()
        .setAuthor('播放列', bot.botconfig.IconURL)
        .setColor(bot.botconfig.EmbedColor)
        .setDescription(
          `**目前正在播放:** \n[${player.queue.current.title}](${player.queue.current.uri}) \n\n**Up Next:** \n${SongsDescription}\n\n`
        )
        .addField('總計曲目數 \n', `\`${player.queue.totalSize - 1}\``, true)
        .addField(
          '總計長度 \n',
          `\`${bot.ms(player.queue.duration, {
            colonNotation: true
          })}\``,
          true
        )
        .addField('請求者:', `${player.queue.current.requester}`, true)
        .addField(
          '當前之歌曲持續時間:',
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

      return Embed
    })

    if (!Pages.length || Pages.length === 1)
      return message.channel.send(Pages[0])
    else Pagination(message, Pages)
  }
}
