module.exports = {
  name: 'ping',
  description: '🏓展示Bot的延遲',
  category: '實用',
  async execute (bot, interaction) {
    await interaction.deferReply()

    const embed = bot.say.rootEmbed(interaction).setTitle('`🏓 Pong!`')
      .setDescription(`💓: ${Math.round(bot.ws.ping)} ms
⏱️: ${Date.now() - interaction.createdTimestamp} ms`)

    return interaction.editReply({ embeds: [embed] })
  }
}
