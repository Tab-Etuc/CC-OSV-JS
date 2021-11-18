const { MessageEmbed } = require('discord.js')
const _ = require('lodash')
module.exports = {
  name: 'search',
  description: '🔎播放基於查詢的歌曲結果',
  用法: '[歌曲]',
  permissions: {
    channel: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS'],
    member: []
  },
  aliases: ['se'],
  /**
   *
   * @param {import("../base/CC-OSV-bot")} bot
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (bot, message, args, GuildDB) => {
    let awaitchannel = bot.channels.cache.get(message.channelId) /// thanks Reyansh for this idea ;-;
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
        `**用法 - **\`${GuildDB.prefix}SearchString [搜索詞]\``
      )
    let node = await bot.getLavalink(bot)
    if (!node || !node.connected) {
      return bot.say.sendTime(
        bot,
        message.channel,
        '❌ | **Lavalink伺服器重新連線中，請稍後再試。**'
      )
    }
    const player = bot.createPlayer(
      message.channel,
      message.member.voice.channel
    )

    if (player.state != 'CONNECTED') await player.connect()

    let Searched = await player.search(SearchString, message.author)
    if (Searched.loadType == 'NO_MATCHES')
      return bot.sendTime(bot, message.channel, '沒有找到結果: ' + SearchString)
    else {
      Searched.tracks = Searched.tracks.map((s, i) => {
        s.index = i
        return s
      })
      let songs = _.chunk(Searched.tracks, 10)
      let Pages = songs.map(songz => {
        let MappedSongs = songz.map(
          s =>
            `\`${s.index + 1}\`. [${s.title}](${s.uri}) \n持續時間: \`${bot.ms(
              s.duration,
              {
                colonNotation: true
              }
            )}\``
        )

        let em = new MessageEmbed()
          .setAuthor('搜尋結果──' + SearchString, bot.config.IconURL)
          .setColor(bot.config.EmbedColor)
          .setDescription(MappedSongs.join('\n\n'))
        return em
      })

      if (!Pages.length || Pages.length === 1)
        return message.channel.send({ embeds: [Pages[0]] })
      else bot.Pagination(message, Pages)

      let w = a => new Promise(r => setInterval(r, a))
      await w(500) //waits 500ms cuz needed to wait for the above song search embed to send ._.
      let msg = await message.channel.send('**輸入您想要收聽的歌曲的編號！**')

      let er = false
      let filter = msg => message.author.id === msg.author.id
      let SongID = await message.channel
        .awaitMessages({ filter, max: 1, errors: ['time'], time: 30000 })
        .catch(() => {
          er = true
          msg.edit('**已超時！如果您想收聽歌曲，請再次輸入指令！**')
        })
      if (er) return
      /**@type {Message} */
      let SongIDmsg = SongID.first()

      if (!parseInt(SongIDmsg.content))
        return bot.sendTime(bot, message.channel, '請輸入正確的編號。')
      let Song = Searched.tracks[parseInt(SongIDmsg.content) - 1]
      if (!Song)
        return bot.sendTime(
          bot,
          message.channel,
          '出現了一些錯誤，請嘗試再次輸入指令'
        )
      player.queue.add(Song)
      if (!player.playing && !player.paused && !player.queue.size) player.play()
      let SongAddedEmbed = new MessageEmbed()
      SongAddedEmbed.setAuthor(`已新增至播放列`, bot.config.IconURL)
      SongAddedEmbed.setThumbnail(Song.displayThumbnail())
      SongAddedEmbed.setColor(bot.config.EmbedColor)
      SongAddedEmbed.setDescription(`[${Song.title}](${Song.uri})`)
      SongAddedEmbed.addField('上傳者', `${Song.author}`, true)
      SongAddedEmbed.addField(
        '持續時間',
        `\`${bot.ms(player.queue.current.duration, {
          colonNotation: true
        })}\``,
        true
      )
      if (player.queue.totalSize > 1)
        SongAddedEmbed.addField(
          '在播放列中的位置',
          `${player.queue.size - 0}`,
          true
        )
      message.channel.send({ embeds: [SongAddedEmbed] })
    }
  }
}
