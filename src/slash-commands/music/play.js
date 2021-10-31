const { MessageEmbed } = require('discord.js')
const { TrackUtils } = require('erela.js')
const prettyMilliseconds = require('pretty-ms')

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
   *
   * @param {import("../structures/DiscordMusicBot")} bot
   * @param {import("discord.js").Message} interaction
   * @param {string[]} args
   * @param {*} param3
   */
  async execute (bot, interaction) {
    await interaction.deferReply();
    let search = await interaction.options.getString("歌曲", true);

    const guild = bot.guilds.cache.get(interaction.guild.id)
    const member = guild.members.cache.get(interaction.member.user.id)
    const voiceChannel = interaction.member?.voice?.channel;
    if (!member.voice.channel)
      return bot.say.errorMessage(
        interaction,
        '❌ | **您必須先加入一個語音頻道！**'
      )
    if (
      guild.me.voice.channel &&
      !guild.me.voice.channel.equals(member.voice.channel)
    )
      return bot.say.errorMessage(
        interaction,
        ':x: | **您必須和我在相同的語音通道以使用此命令！**'
      )
    let CheckNode = bot.Manager.nodes.get(bot.config.Lavalink.id)
    if (!CheckNode || !CheckNode.connected) {
      return bot.say.errorMessage(interaction, '❌ | **Lavalink node not connected**')
    }

    let player = bot.Manager.create({
      guild: interaction.guild.id,
      voiceChannel: voiceChannel.id,
      textChannel: interaction.channelId,
      selfDeafen: bot.config.ServerDeafen,
      volume: bot.config.DefaultVolume
    })
    if (player.state != 'CONNECTED') await player.connect()
    
    let res

    if (search.match(bot.Lavasfy.spotifyPattern)) {
      await bot.Lavasfy.requestToken()
      let node = bot.Lavasfy.nodes.get(bot.config.Lavalink.id)
      let Searched = await node.load(search)

      switch (Searched.loadType) {
        case 'LOAD_FAILED':
          if (!player.queue.current) player.destroy()
          return bot.sendError(interaction, `❌ | **搜索時出錯**`)

        case 'NO_MATCHES':
          if (!player.queue.current) player.destroy()
          return bot.sendTime(
            interaction,
            '❌ | **查無結果 - ** 您可以嘗試重新輸入指令。'
          )
        case 'TRACK_LOADED':
          player.queue.add(TrackUtils.build(Searched.tracks[0], member.user))
          if (!player.playing && !player.paused && !player.queue.length)
            player.play()
          let SongAddedEmbed = new MessageEmbed()
          SongAddedEmbed.setAuthor(`已新增至播放列`, bot.config.IconURL)
          SongAddedEmbed.setColor(bot.config.EmbedColor)
          SongAddedEmbed.setDescription(
            `[${Searched.tracks[0].info.title}](${Searched.tracks[0].info.uri})`
          )
          SongAddedEmbed.addField(
            '上傳者',
            Searched.tracks[0].info.author,
            true
          )
          if (player.queue.totalSize > 1)
            SongAddedEmbed.addField(
              '播放列中的位置',
              `${player.queue.size - 0}`,
              true
            )
          return interaction.editReply({embeds: [SongAddedEmbed]})

        case 'SEARCH_RESULT':
          player.queue.add(TrackUtils.build(Searched.tracks[0], member.user))
          if (!player.playing && !player.paused && !player.queue.length)
            player.play()
          let SongAdded = new MessageEmbed()
          SongAdded.setAuthor(`已新增至播放列`, bot.config.IconURL)
          SongAdded.setColor(bot.config.EmbedColor)
          SongAdded.setDescription(
            `[${Searched.tracks[0].info.title}](${Searched.tracks[0].info.uri})`
          )
          SongAdded.addField('上傳者', Searched.tracks[0].info.author, true)
          if (player.queue.totalSize > 1)
            SongAdded.addField(
              '播放列中的位置',
              `${player.queue.size - 0}`,
              true
            )
          return interaction.editReply({embeds: [SongAdded]})

        case 'PLAYLIST_LOADED':
          let songs = []
          for (let i = 0; i < Searched.tracks.length; i++)
            songs.push(TrackUtils.build(Searched.tracks[i], member.user))
          player.queue.add(songs)
          if (
            !player.playing &&
            !player.paused &&
            player.queue.totalSize === Searched.tracks.length
          )
            player.play()
          let Playlist = new MessageEmbed()
          Playlist.setAuthor(
            `音樂播放清單已新增至播放列`,
            bot.config.IconURL
          )
          Playlist.setDescription(
            `[${Searched.playlistInfo.name}](${interaction.data.options[0].value})`
          )
          Playlist.addField(
            '播放列',
            `\`${Searched.tracks.length}\` 首歌`,
            false
          )
          return interaction.editReply({embeds: [Playlist]})
      }
    } else {
      try {
        res = await player.search(search, member.user)
        if (res.loadType === 'LOAD_FAILED') {
          if (!player.queue.current) player.destroy()
          return bot.sendError(interaction, `:x: | **在查詢時出了錯誤**`)
        }
      } catch (err) {
        return bot.sendError(
          interaction,
          `在查詢時出了錯誤: ${err.interaction}`
        )
      }
      switch (res.loadType) {
        case 'NO_MATCHES':
          if (!player.queue.current) player.destroy()
          return bot.say.errorMessage(
            interaction,
            '❌ | **查無結果。**您可以嘗試重新輸入指令。'
          )
        case 'TRACK_LOADED':
          player.queue.add(res.tracks[0])
          if (!player.playing && !player.paused && !player.queue.length)
            player.play()
          let SongAddedEmbed = new MessageEmbed()
          SongAddedEmbed.setAuthor(`已新增至播放列`, bot.config.IconURL)
          //SongAddedEmbed.setThumbnail(res.tracks[0].displayThumbnail());
          SongAddedEmbed.setColor(bot.config.EmbedColor)
          SongAddedEmbed.setDescription(
            `[${res.tracks[0].title}](${res.tracks[0].uri})`
          )
          SongAddedEmbed.addField('上傳者', res.tracks[0].author, true)
          SongAddedEmbed.addField(
            '持續時間',
            `\`${prettyMilliseconds(res.tracks[0].duration, {
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
          return interaction.editReply({embeds: [SongAddedEmbed]})

        case 'PLAYLIST_LOADED':
          player.queue.add(res.tracks)
          await player.play()
          let SongAdded = new MessageEmbed()
          SongAdded.setAuthor(
            `音樂播放清單已新增至播放列`,
            bot.config.IconURL
          )
          //SongAdded.setThumbnail(res.tracks[0].displayThumbnail());
          SongAdded.setDescription(
            `[${res.playlist.name}](${interaction.data.options[0].value})`
          )
          SongAdded.addField('播放列', `\`${res.tracks.length}\` songs`, false)
          SongAdded.addField(
            'Playlist duration',
            `\`${prettyMilliseconds(res.playlist.duration, {
              colonNotation: true
            })}\``,
            false
          )
          return interaction.editReply({embeds: [SongAdded]})
        case 'SEARCH_RESULT':
          const track = res.tracks[0]
          player.queue.add(track)

          if (!player.playing && !player.paused && !player.queue.length) {
            let SongAddedEmbed = new MessageEmbed()
            SongAddedEmbed.setAuthor(`已新增至播放列`, bot.config.IconURL)
            SongAddedEmbed.setThumbnail(track.displayThumbnail())
            SongAddedEmbed.setColor(bot.config.EmbedColor)
            SongAddedEmbed.setDescription(`[${track.title}](${track.uri})`)
            SongAddedEmbed.addField('上傳者', track.author, true)
            SongAddedEmbed.addField(
              '持續時間',
              `\`${prettyMilliseconds(track.duration, {
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
            player.play()
            return interaction.editReply({embeds: [SongAddedEmbed]})
          } else {
            let SongAddedEmbed = new MessageEmbed()
            SongAddedEmbed.setAuthor(`已新增至播放列`, bot.config.IconURL)
            SongAddedEmbed.setThumbnail(track.displayThumbnail())
            SongAddedEmbed.setColor(bot.config.EmbedColor)
            SongAddedEmbed.setDescription(`[${track.title}](${track.uri})`)
            SongAddedEmbed.addField('上傳者', track.author, true)
            SongAddedEmbed.addField(
              '持續時間',
              `\`${prettyMilliseconds(track.duration, {
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
            interaction.editReply({embeds: [SongAddedEmbed]})
          }
      }
    }
  }
}
