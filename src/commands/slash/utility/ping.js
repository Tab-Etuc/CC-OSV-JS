module.exports = {
  name: 'ping',
  description: 'ðå±ç¤ºBotçå»¶é²',
  category: 'å¯¦ç¨',
  async execute (bot, interaction) {
    await interaction.deferReply()

    const embed = bot.say.rootEmbed(interaction).setTitle('`ð Pong!`')
      .setDescription(`ð: ${Math.round(bot.ws.ping)} ms
â±ï¸: ${Date.now() - interaction.createdTimestamp} ms`)

    return interaction.editReply({ embeds: [embed] })
  }
}
