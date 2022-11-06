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
   * @param {import("../base/CC-OSV-Client")} bot
   * @param {import("discord.js").Message} interaction
   */
  async execute (bot, interaction) {
    await interaction.deferReply()

    let player = bot.manager.players.get(interaction.guild.id);
    if (!player)
      return bot.say.slashError(
        interaction,
        '**目前沒有播放任何音樂...**'
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
    return interaction.editReply({ embeds: [QueueEmbed] })
  }
}
