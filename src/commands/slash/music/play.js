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

  options: [
    {
      name: '歌曲',
      value: 'song',
      type: 3,
      required: true,
      description: '您想播放之歌曲的名稱或連結。'
    }
  ],
  /**
   * @param {import("../base/CC-OSV-Client")} bot
   * @param {import("discord.js").Message} interaction
   */
  async execute (bot, interaction) {
    await interaction.deferReply()

    let search = await interaction.options.getString('歌曲', true)
    let channel = await bot.getChannel(bot, interaction)

    if (!channel) return

    let node = await bot.getLavalink(bot, interaction)
    if (!node || !node.connected) return

    let player = bot.createPlayer(interaction.channel, channel)

    if (player.state != 'CONNECTED') await player.connect()

    let res = await player.search(search, interaction.user)
    try {
      if (res.loadType === 'LOAD_FAILED') {
        if (!player.queue.current) player.destroy()
        return bot.say.slashError(interaction, `**在查詢時出了錯誤**`)
      }
    } catch (err) {
      return bot.say.slashError(
        interaction,
        `在查詢時出了錯誤: ${err.interaction}`
      )
    }
    switch (res.loadType) {
      case 'NO_MATCHES':
        if (!player.queue.current) player.destroy()
        return bot.say.slashError(
          interaction,
          '**查無結果。**您可以嘗試重新輸入指令。'
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
        return interaction.editReply({ embeds: [SongAddedEmbed] })

      case 'PLAYLIST_LOADED':
        player.queue.add(res.tracks)
        player.play()
        let SongAdded = new MessageEmbed()
        SongAdded.setAuthor(`音樂播放清單已新增至播放列`, bot.config.IconURL)
        //SongAdded.setThumbnail(res.tracks[0].displayThumbnail());
        SongAdded.setDescription(
          `[${res.playlist.name}](${interaction.data.options[0].value})`
        )
        SongAdded.addField('播放列', `\`${res.tracks[0].length}\` songs`, false)
        SongAdded.addField(
          '音樂播放清單 持續時間',
          `\`${bot.ms(res.playlist.duration, {
            colonNotation: true
          })}\``,
          false
        )
        return interaction.editReply({ embeds: [SongAdded] })
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

          return interaction.editReply({ embeds: [SongAddedEmbed] })
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
          interaction.editReply({ embeds: [SongAddedEmbed] })
        }
    }
  }
}
