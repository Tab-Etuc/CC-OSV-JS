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
        description: '播放音樂。'
      }
    ],
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} bot
     * @param {import("discord.js").Message} interaction
     * @param {string[]} args
     * @param {*} param3
     */
    async execute(bot, interaction, args, { GuildDB })  {
      const guild = bot.guilds.cache.get(interaction.guild_id)
      const member = guild.members.cache.get(interaction.member.user.id)
      const voiceChannel = member.voice.channel
      let awaitchannel = bot.channels.cache.get(interaction.channel_id)
      if (!member.voice.channel)
        return bot.sendTime(
          interaction,
          '❌ | **您必須在語音通道中使用此命令！**'
        )
      if (
        guild.me.voice.channel &&
        !guild.me.voice.channel.equals(member.voice.channel)
      )
        return bot.sendTime(
          interaction,
          ':x: | **您必須和我在相同的語音通道以使用此命令！**'
        )
      let CheckNode = bot.Manager.nodes.get(bot.botconfig.Lavalink.id)
      if (!CheckNode || !CheckNode.connected) {
        return bot.sendTime(
          interaction,
          '❌ | **Lavalink node not connected**'
        )
      }

      let player = bot.Manager.create({
        guild: interaction.guild_id,
        voiceChannel: voiceChannel.id,
        textChannel: interaction.channel_id,
        selfDeafen: bot.botconfig.ServerDeafen,
        volume: bot.botconfig.DefaultVolume
      })
      if (player.state != 'CONNECTED') await player.connect()
      let search = interaction.data.options[0].value
      let res

      if (search.match(bot.Lavasfy.spotifyPattern)) {
        await bot.Lavasfy.requestToken()
        let node = bot.Lavasfy.nodes.get(bot.botconfig.Lavalink.id)
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
            SongAddedEmbed.setAuthor(`已新增至播放列`, bot.botconfig.IconURL)
            SongAddedEmbed.setColor(bot.botconfig.EmbedColor)
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
            return interaction.send(SongAddedEmbed)

          case 'SEARCH_RESULT':
            player.queue.add(TrackUtils.build(Searched.tracks[0], member.user))
            if (!player.playing && !player.paused && !player.queue.length)
              player.play()
            let SongAdded = new MessageEmbed()
            SongAdded.setAuthor(`已新增至播放列`, bot.botconfig.IconURL)
            SongAdded.setColor(bot.botconfig.EmbedColor)
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
            return interaction.send(SongAdded)

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
              bot.botconfig.IconURL
            )
            Playlist.setDescription(
              `[${Searched.playlistInfo.name}](${interaction.data.options[0].value})`
            )
            Playlist.addField(
              '播放列',
              `\`${Searched.tracks.length}\` 首歌`,
              false
            )
            return interaction.send(Playlist)
        }
      } else {
        try {
          res = await player.search(search, member.user)
          if (res.loadType === 'LOAD_FAILED') {
            if (!player.queue.current) player.destroy()
            return bot.sendError(
              interaction,
              `:x: | **在查詢時出了錯誤**`
            )
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
            return bot.sendTime(
              interaction,
              '❌ | **查無結果。**您可以嘗試重新輸入指令。'
            )
          case 'TRACK_LOADED':
            player.queue.add(res.tracks[0])
            if (!player.playing && !player.paused && !player.queue.length)
              player.play()
            let SongAddedEmbed = new MessageEmbed()
            SongAddedEmbed.setAuthor(`已新增至播放列`, bot.botconfig.IconURL)
            //SongAddedEmbed.setThumbnail(res.tracks[0].displayThumbnail());
            SongAddedEmbed.setColor(bot.botconfig.EmbedColor)
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
            return interaction.send(SongAddedEmbed)

          case 'PLAYLIST_LOADED':
            player.queue.add(res.tracks)
            await player.play()
            let SongAdded = new MessageEmbed()
            SongAdded.setAuthor(
              `音樂播放清單已新增至播放列`,
              bot.botconfig.IconURL
            )
            //SongAdded.setThumbnail(res.tracks[0].displayThumbnail());
            SongAdded.setDescription(
              `[${res.playlist.name}](${interaction.data.options[0].value})`
            )
            SongAdded.addField(
              '播放列',
              `\`${res.tracks.length}\` songs`,
              false
            )
            SongAdded.addField(
              'Playlist duration',
              `\`${prettyMilliseconds(res.playlist.duration, {
                colonNotation: true
              })}\``,
              false
            )
            return interaction.send(SongAdded)
          case 'SEARCH_RESULT':
            const track = res.tracks[0]
            player.queue.add(track)

            if (!player.playing && !player.paused && !player.queue.length) {
              let SongAddedEmbed = new MessageEmbed()
              SongAddedEmbed.setAuthor(
                `已新增至播放列`,
                bot.botconfig.IconURL
              )
              SongAddedEmbed.setThumbnail(track.displayThumbnail())
              SongAddedEmbed.setColor(bot.botconfig.EmbedColor)
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
              return interaction.send(SongAddedEmbed)
            } else {
              let SongAddedEmbed = new MessageEmbed()
              SongAddedEmbed.setAuthor(
                `已新增至播放列`,
                bot.botconfig.IconURL
              )
              SongAddedEmbed.setThumbnail(track.displayThumbnail())
              SongAddedEmbed.setColor(bot.botconfig.EmbedColor)
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
              interaction.send(SongAddedEmbed)
            }
        }
      
    }
  }
}
