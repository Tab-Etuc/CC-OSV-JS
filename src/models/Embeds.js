const { MessageEmbed, Interaction } = require('discord.js')
class Embeds {
  /**
   * Returns a custom embed
   * @param {Interaction} interaction
   */
  baseEmbed (interaction) {
    if (!interaction) {
      throw Error("'interaction' must be passed down as param! (baseEmbed)")
    }

    const avatar = interaction.user?.displayAvatarURL({ dynamic: true })
    const tag = interaction.user?.tag

    return new MessageEmbed()
      .setFooter(tag, avatar)
      .setColor(interaction.guild.me.displayColor || '#00FFFF')
      .setTimestamp()
  }

  /**
   * Returns a custom embed
   * @param {Interaction} interaction
   */
  rootEmbed (interaction) {
    return new MessageEmbed().setColor(
      interaction.guild.me.displayColor || '#00FFFF'
    )
  }

  /**
   * Returns a custom embed
   * @param {Interaction} interaction
   * @param {string} text
   */
  infoMessage (interaction, text) {
    return interaction
      .editReply({
        embeds: [
          new MessageEmbed()
            .setDescription(text)
            .setColor(interaction.guild.me.displayColor || '#00FFFF')
        ],
        allowedMentions: { repliedUser: false }
      })
      .catch(console.error)
  }

  /**
   * Returns a custom embed
   * @param {Interaction} interaction
   * @param {string} text
   */
  warnMessage (interaction, text) {
    return interaction
      .editReply({
        ephemeral: true,
        embeds: [new MessageEmbed().setDescription(text).setColor('ORANGE')],
        allowedMentions: { repliedUser: false }
      })
      .catch(console.error)
  }

  /**
   * Returns a custom embed
   * @param {Interaction} interaction
   * @param {string} text
   */
  errorMessage (interaction, text) {
    return interaction
      .editReply({
        ephemeral: true,
        embeds: [new MessageEmbed().setDescription(text).setColor('RED')],
        allowedMentions: { repliedUser: false }
      })
      .catch(console.error)
  }

  sendTime (bot, Channel, msg) {
    Channel.send({
      embeds: [
        new MessageEmbed().setColor(bot.config.EmbedColor).setDescription(msg)
      ]
    })
  }
}
module.exports = new Embeds()
