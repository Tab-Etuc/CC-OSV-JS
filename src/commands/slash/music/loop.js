module.exports = {
  name: 'loop',
  description: '๐ๅพช็ฐ็ถๅ็ๆญๆฒใ',
  usage: '',
  permissions: {
    channel: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS'],
    member: []
  },
  aliases: ['l', 'repeat'],
  /**
   * @param {import("../base/CC-OSV-Client")} bot
   * @param {import("discord.js").Message} interaction
   */
  async execute (bot, interaction) {
    await interaction.deferReply()

    const channel = await bot.getChannel(bot, interaction)
    if (!channel) return
    let player = await bot.manager.players.get(interaction.guild.id)
    if (!player)
      return bot.say.slashError(
        interaction,
        '**็ฎๅๆฒๆๆญๆพไปปไฝ้ณๆจ...**'
      )
    if (player.trackRepeat) {
      player.setTrackRepeat(false)
      bot.say.slashInfo(interaction, `๐ \`้้\``)
    } else {
      player.setTrackRepeat(true)
      bot.say.slashInfo(interaction, `๐ \`ๅ็จ\``)
    }
  }
}
