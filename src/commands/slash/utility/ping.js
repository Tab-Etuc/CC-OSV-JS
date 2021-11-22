
module.exports = {
  name: "ping",
  description: "🏓展示Bot的延遲",
  category: "實用",
  async execute(bot, interaction) {
    const embed1 = bot.say.rootEmbed(interaction)
      .setDescription("Pinging...");

    await interaction.reply({ embeds: [embed1], allowedMentions: { repliedUser: false } }).catch(console.error);

    const embed2 = bot.say.rootEmbed(interaction)
      .setTitle("`🏓 Pong!`")
      .setDescription(`💓: ${Math.round(bot.ws.ping)} ms
⏱️: ${Date.now() - interaction.createdTimestamp} ms`);

    return interaction.editReply({ embeds: [embed2] });
  }
};
