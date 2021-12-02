const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'remove',
  description: `🎵從播放列中移除一首歌`,
  usage: '[編號]',
  permissions: {
    channel: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS'],
    member: []
  },
  aliases: ['rm'],

  options: [
    {
      name: '編號',
      value: '[track]',
      type: 4,
      required: true,
      description: '從播放列中移除一首歌'
    }
  ],
  /**
   * @param {import("../base/CC-OSV-Client")} bot
   * @param {import("discord.js").Message} interaction
   */
  async execute (bot, interaction) {
    await interaction.deferReply()

    const channel = await bot.getChannel(bot, interaction)
    if (!channel) return
    let player = bot.manager.players.get(interaction.guild.id)

    if (!player)
      return bot.say.slashError(
        interaction,
        '**目前沒有播放任何音樂...**'
      )

    if (!player.queue || !player.queue.length || player.queue.length === 0)
      return bot.say.slashError('**目前沒有播放任何音樂...**')
    let track = await interaction.options.getString('編號', true)
    let rm = new MessageEmbed()
      .setDescription(
        `✅ | 已從播放列移除編號 **\`${Number(track)}\`** 之歌曲!`
      )
      .setColor('GREEN')
    if (isNaN(track)) rm.setDescription(`**用法:** \`/remove [編號]\``)
    if (track > player.queue.length)
      rm.setDescription(`播放列僅有 ${player.queue.length} 首歌曲！`)
    await interaction.editReply({ embeds: [rm] })
    player.queue.remove(Number(track) - 1)
  }
}
