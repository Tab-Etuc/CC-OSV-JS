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
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    if (!message.member.voice.channel)
      return client.sendTime(
        message.channel,
        '❌ | **您必須在語音通道中使用此命令！**'
      )
    if (
      message.guild.me.voice.channel &&
      message.member.voice.channel.id !== message.guild.me.voice.channel.id
    )
      return client.sendTime(
        message.channel,
        ':x: | **您必須和我在相同的語音通道以使用此命令！**'
      )
    let SearchString = args.join(' ')
    if (!SearchString)
      return client.sendTime(
        message.channel,
        `**用法 - **\`${GuildDB.prefix}play [歌曲]\``
      )
    let CheckNode = client.Manager.nodes.get(client.botconfig.Lavalink.id)
    let Searching = await message.channel.send(':mag_right: 查詢中...')
    if (!CheckNode || !CheckNode.connected) {
      return client.sendTime(
        message.channel,
        '❌ | **Lavalink node not connected**'
      )
    }
    const player = client.Manager.create({
      guild: message.guild.id,
      voiceChannel: message.member.voice.channel.id,
      textChannel: message.channel.id,
      selfDeafen: client.botconfig.ServerDeafen,
      volume: client.botconfig.DefaultVolume
    })

    let SongAddedEmbed = new MessageEmbed().setColor(
      client.botconfig.EmbedColor
    )

    if (!player)
      return client.sendTime(
        message.channel,
        '❌ | **目前沒有播放任何音樂...**'
      )

    if (player.state != 'CONNECTED') await player.connect()

    try {
      if (SearchString.match(client.Lavasfy.spotifyPattern)) {
        await client.Lavasfy.requestToken()
        let node = client.Lavasfy.nodes.get(client.botconfig.Lavalink.id)
        let Searched = await node.load(SearchString)

        if (Searched.loadType === 'PLAYLIST_LOADED') {
          let songs = []
          for (let i = 0; i < Searched.tracks.length; i++)
            songs.push(TrackUtils.build(Searched.tracks[i], message.author))
          player.queue.add(songs)
          if (
            !player.playing &&
            !player.paused &&
            player.queue.totalSize === Searched.tracks.length
          )
            player.play()
          SongAddedEmbed.setAuthor(
            `音樂播放清單已新增至播放列`,
            message.author.displayAvatarURL()
          )
          SongAddedEmbed.addField(
            '播放列',
            `\`${Searched.tracks.length}\` 首歌`,
            false
          )
          //SongAddedEmbed.addField("Playlist duration", `\`${prettyMilliseconds(Searched.tracks, { colonNotation: true })}\``, false)
          Searching.edit(SongAddedEmbed)
        } else if (Searched.loadType.startsWith('TRACK')) {
          player.queue.add(TrackUtils.build(Searched.tracks[0], message.author))
          if (!player.playing && !player.paused && !player.queue.size)
            player.play()
          SongAddedEmbed.setAuthor(`已新增至播放列`, client.botconfig.IconURL)
          SongAddedEmbed.setDescription(
            `[${Searched.tracks[0].info.title}](${Searched.tracks[0].info.uri})`
          )
          SongAddedEmbed.addField(
            '上傳者',
            Searched.tracks[0].info.author,
            true
          )
          //SongAddedEmbed.addField("持續時間", `\`${prettyMilliseconds(Searched.tracks[0].length, { colonNotation: true })}\``, true);
          if (player.queue.totalSize > 1)
            SongAddedEmbed.addField(
              '播放列中的位置',
              `${player.queue.size - 0}`,
              true
            )
          Searching.edit(SongAddedEmbed)
        } else {
          return client.sendTime(
            message.channel,
            '**查無結果 - **' + SearchString + '您可以嘗試重新輸入指令。'
          )
        }
      } else {
        let Searched = await player.search(SearchString, message.author)
        if (!player)
          return client.sendTime(
            message.channel,
            '❌ | **目前沒有播放任何音樂...**'
          )

        if (Searched.loadType === 'NO_MATCHES')
          return client.sendTime(
            message.channel,
            '**查無結果 - **' + SearchString + '您可以嘗試重新輸入指令。'
          )
        else if (Searched.loadType == 'PLAYLIST_LOADED') {
          player.queue.add(Searched.tracks)
          if (
            !player.playing &&
            !player.paused &&
            player.queue.totalSize === Searched.tracks.length
          )
            player.play()
          SongAddedEmbed.setAuthor(
            `音樂播放清單已新增至播放列`,
            client.botconfig.IconURL
          )
          // SongAddedEmbed.setThumbnail(Searched.tracks[0].displayThumbnail());
          SongAddedEmbed.setDescription(
            `[${Searched.playlist.name}](${SearchString})`
          )
          SongAddedEmbed.addField(
            '播放列',
            `\`${Searched.tracks.length}\` 首歌`,
            false
          )
          SongAddedEmbed.addField(
            '持續時間',
            `\`${prettyMilliseconds(Searched.playlist.duration, {
              colonNotation: true
            })}\``,
            false
          )
          Searching.edit(SongAddedEmbed)
        } else {
          player.queue.add(Searched.tracks[0])
          if (!player.playing && !player.paused && !player.queue.size)
            player.play()
          SongAddedEmbed.setAuthor(`已新增至播放列`, client.botconfig.IconURL)

          // SongAddedEmbed.setThumbnail(Searched.tracks[0].displayThumbnail());
          SongAddedEmbed.setDescription(
            `[${Searched.tracks[0].title}](${Searched.tracks[0].uri})`
          )
          SongAddedEmbed.addField('上傳者', Searched.tracks[0].author, true)
          SongAddedEmbed.addField(
            '持續時間',
            `\`${prettyMilliseconds(Searched.tracks[0].duration, {
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
          Searching.edit(SongAddedEmbed)
        }
      }
    } catch (e) {
      console.log(e)
      return client.sendTime(
        message.channel,
        '**查無結果 - **' + SearchString + '您可以嘗試重新輸入指令。'
      )
    }
  }
}
