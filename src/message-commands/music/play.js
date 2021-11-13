const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'play',
  description: '🎵播放音樂。',
  usage: '[歌曲]',
  permissions: {
    channel: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS'],
    member: []
  },
  aliases: ['p'],
  /**
   *
   * @param {import("../base/CC-OSV-Client")} bot
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (bot, message, args, GuildDB) => {
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
    let SearchString = args.join(' ')
    if (!SearchString)
      return bot.say.sendTime(
        bot,
        message.channel,
        `**用法 - **\`${GuildDB.prefix}play [歌曲]\``
      )
    let Searching = await message.channel.send(':mag_right: 查詢中...')

    let node = await bot.getLavalink(bot)
    if (!node || !node.connected) {
      return bot.say.sendTime(
        bot,
        message.channel,
        '❌ | **Lavalink伺服器重新連線中，請稍後再試。**'
      )
    }
    let player = bot.createPlayer(message.channel, message.member.voice.channel)
    if (player.state != 'CONNECTED') await player.connect()

    let res = await player.search(SearchString, message.author)
    try {
      if (res.loadType === 'LOAD_FAILED') {
        if (!player.queue.current) player.destroy()
        return bot.say.sendTime(
          bot,
          message.channel,
          `:x: | **在查詢時出了錯誤**`
        )
      }
    } catch (err) {
      return bot.say.sendTime(bot, message.channel, `在查詢時出了錯誤: ${err}`)
    }
    switch (res.loadType) {
      case 'NO_MATCHES':
        if (!player.queue.current) player.destroy()
        return bot.say.sendTime(
          bot,
          message.channel,
          '❌ | **查無結果。**您可以嘗試重新輸入指令。'
        )
      case 'TRACK_LOADED':
        player.queue.add(res.tracks[0])
        if (!player.playing && !player.paused && !player.queue.size)
          player.play()
        let SongAddedEmbed = new MessageEmbed()
          .setAuthor(`已新增至播放列`, bot.config.IconURL)
          //.setThumbnail(res.tracks[0].displayThumbnail());
          .setColor(bot.config.EmbedColor)
          .setDescription(`[${res.tracks[0].title}](${res.tracks[0].uri})`)
          .addField('上傳者', res.tracks[0].author, true)
          .addField(
            '持續時間',
            `\`${bot.ms(res.tracks[0].duration, {
              colonNotation: true
            })}\``,
            true
          )
        if (player.queue.totalSize > 1)
          SongAddedEmbed.addField(
            '播放列中的位置',
            `${player.queue.size - 0}`,
            true
          )
        return Searching.edit({
          content: ':notes:',
          embeds: [SongAddedEmbed]
        })

      case 'PLAYLIST_LOADED':
        player.queue.add(res.tracks)
        player.play()
        let SongAdded = new MessageEmbed()
        SongAdded.setAuthor(`音樂播放清單已新增至播放列`, bot.config.IconURL)
        //SongAdded.setThumbnail(res.tracks[0].displayThumbnail());
        SongAdded.setDescription(`[${res.playlist.name}](${res.playlist.url})`)
        SongAdded.addField('播放列', `\`${res.tracks[0].length}\` songs`, false)
        SongAdded.addField(
          '音樂播放清單 持續時間',
          `\`${bot.ms(res.playlist.duration, {
            colonNotation: true
          })}\``,
          false
        )
        return Searching.edit({ content: ':notes:', embeds: [SongAdded] })
      case 'SEARCH_RESULT':
        player.queue.add(res.tracks[0])

        if (!player.playing && !player.paused && !player.queue.size) {
          player.play()

          let SongAddedEmbed = new MessageEmbed()
          SongAddedEmbed.setAuthor(`已新增至播放列`, bot.config.IconURL)
          SongAddedEmbed.setThumbnail(res.tracks[0].displayThumbnail())
          SongAddedEmbed.setColor(bot.config.EmbedColor)
          SongAddedEmbed.setDescription(
            `[${res.tracks[0].title}](${res.tracks[0].uri})`
          )
          SongAddedEmbed.addField('上傳者', res.tracks[0].author, true)
          SongAddedEmbed.addField(
            '持續時間',
            `\`${bot.ms(res.tracks[0].duration, {
              colonNotation: true
            })}\``,
            true
          )
          if (player.queue.totalSize > 1)
            SongAddedEmbed.addField(
              '播放列中的位置',
              `${player.queue.size - 0}`,
              true
            )

          return Searching.edit({
            content: ':notes:',
            embeds: [SongAddedEmbed]
          })
        } else {
          player.queue.add(res.tracks[0])
          let SongAddedEmbed = new MessageEmbed()
          SongAddedEmbed.setAuthor(`已新增至播放列`, bot.config.IconURL)
          SongAddedEmbed.setThumbnail(res.tracks[0].displayThumbnail())
          SongAddedEmbed.setColor(bot.config.EmbedColor)
          SongAddedEmbed.setDescription(
            `[${res.tracks[0].title}](${res.tracks[0].uri})`
          )
          SongAddedEmbed.addField('上傳者', res.tracks[0].author, true)
          SongAddedEmbed.addField(
            '持續時間',
            `\`${bot.ms(res.tracks[0].duration, {
              colonNotation: true
            })}\``,
            true
          )
          if (player.queue.totalSize > 1)
            SongAddedEmbed.addField(
              '播放列中的位置',
              `${player.queue.size - 0}`,
              true
            )
          Searching.edit({ content: ':notes:', embeds: [SongAddedEmbed] })
        }
    }
  }
}
