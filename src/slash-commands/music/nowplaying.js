const { MessageEmbed } = require('discord.js')
const prettyMilliseconds = require('pretty-ms')

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
   * @param {import("../structures/DiscordMusicBot")} bot
   * @param {import("discord.js").Message} interaction
   * @param {string[]} args
   * @param {*} param3
   */
  async execute (bot, interaction) {
    await interaction.deferReply()

    let player = await bot.manager.get(interaction.guild.id)
    if (!player.queue.current)
      return bot.say.errorMessage(
        interaction,
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
          bot.ProgressBar(player.position, player.queue.current.duration, 15)
            .Bar
        } \`${prettyMilliseconds(player.position, {
          colonNotation: true
        })} / ${prettyMilliseconds(player.queue.current.duration, {
          colonNotation: true
        })}\``
      )
      .setThumbnail(player.queue.current.displayThumbnail())
    return interaction.editReply({embeds:[QueueEmbed]})
  }
}
