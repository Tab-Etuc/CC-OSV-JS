const { MessageEmbed, Message } = require('discord.js')
const { TrackUtils } = require('erela.js')
const _ = require('lodash')
const prettyMilliseconds = require('pretty-ms')

module.exports = {
  name: 'search',
  description: '🔎播放基於查詢的歌曲結果',
  用法: '[歌曲]',
  permissions: {
    channel: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS'],
    member: []
  },
  aliases: ['se'],
  options: [
    {
      name: '歌曲',
      value: 'song',
      type: 3,
      required: true,
      description: '輸入您欲搜索之歌曲名稱或連結'
    }
  ],
  /**
   * @param {import("../base/CC-OSV-Client")} bot
   * @param {import("discord.js").Message} interaction
   */
  async execute (bot, interaction) {
    await interaction.deferReply()

    const guild = bot.guilds.cache.get(interaction.guild.id)
    const member = guild.members.cache.get(interaction.member.user.id)
    let channel = await bot.getChannel(bot, interaction)
    let awaitchannel = bot.channels.cache.get(interaction.channelId) /// thanks Reyansh for this idea ;-;
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
        ':x: | **您必須和我在相同的語音通道以使用此指令！**'
      )
    let node = await bot.getLavalink(bot)
    if (!node || !node.connected) {
      return bot.say.errorMessage(
        interaction,
        '❌ | **Lavalink node not connected**'
      )
    }
    let player = bot.createPlayer(interaction.channel, channel)
    if (player.state != 'CONNECTED') await player.connect()
    let search = await interaction.options.getString('歌曲', true)

    try {
      let res = await player.search(search, interaction.user)
      if (res.loadType === 'LOAD_FAILED') {
        if (!player.queue.current) player.destroy()
        throw new Error(res.exception.interaction)
      }
    } catch (err) {
      return bot.say.errorMessage(
        interaction,
        `:x: | **在搜索時出現了錯誤** ${err.interaction}`
      )
    }
    switch (res.loadType) {
      case 'NO_MATCHES':
        if (!player.queue.current) player.destroy()
        return bot.say.errorMessage(interaction, ':x: | **查無結果**')
      case 'TRACK_LOADED':
        player.queue.add(res.tracks[0])
        if (!player.playing && !player.paused && !player.queue.length)
          player.play()
        return bot.say.errorMessage(
          interaction,
          `**已新增至播放列** \`[${res.tracks[0].title}](${res.tracks[0].uri})\`.`
        )
      case 'PLAYLIST_LOADED':
        player.queue.add(res.tracks)

        if (
          !player.playing &&
          !player.paused &&
          player.queue.size === res.tracks.length
        )
          player.play()
        return bot.say.errorMessage(
          interaction,
          `**音樂播放清單已新增至播放列**: \n**${res.playlist.name}** \nEnqueued: **${res.playlistInfo.length} songs**`
        )
      case 'SEARCH_RESULT':
        let max = 10,
          collected,
          filter = m =>
            m.author.id === interaction.member.user.id &&
            /^(\d+|end)$/i.test(m.content)
        if (res.tracks.length < max) max = res.tracks.length

        const results = res.tracks
          .slice(0, max)
          .map(
            (track, index) =>
              `\`${++index}\` - [${track.title}](${
                track.uri
              }) \n\t\`${prettyMilliseconds(track.duration, {
                colonNotation: true
              })}\`\n`
          )
          .join('\n')

        const resultss = new MessageEmbed()
          .setDescription(`${results}\n\n\t**輸入您欲播放之歌曲編號！**\n`)
          .setColor(bot.botconfig.EmbedColor)
          .setAuthor(`搜尋結果── ${search}`, bot.botconfig.IconURL)
        interaction.editReply(resultss)
        try {
          collected = await awaitchannel.awaitMessages(filter, {
            max: 1,
            time: 30e3,
            errors: ['time']
          })
        } catch (e) {
          if (!player.queue.current) player.destroy()
          return awaitchannel.send('❌ | **您沒有提供選擇**')
        }

        const first = collected.first().content

        if (first.toLowerCase() === 'cancel') {
          if (!player.queue.current) player.destroy()
          return awaitchannel.send('取消搜尋')
        }

        const index = Number(first) - 1
        if (index < 0 || index > max - 1)
          return awaitchannel.send(
            `您提供的號碼大於或少於搜索總數。 用法 - \`(1-${max})\``
          )
        const track = res.tracks[index]
        player.queue.add(track)

        if (!player.playing && !player.paused && !player.queue.length) {
          player.play()
        } else {
          let SongAddedEmbed = new MessageEmbed()
          SongAddedEmbed.setAuthor(`Added to queue`, bot.botconfig.IconURL)
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
              '於播放列中的位置',
              `${player.queue.size - 0}`,
              true
            )
          awaitchannel.send(SongAddedEmbed)
        }
    }
  }
}
