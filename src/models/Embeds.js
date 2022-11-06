const { MessageEmbed } = require('discord.js')

class Embeds {
  /**
   * Returns a custom embed
   * @param {import("discord.js").Interaction } interaction
   */
  baseEmbed (interaction) {
    const avatar = interaction.user?.displayAvatarURL({ dynamic: true })
    const tag = interaction.user?.tag

    return new MessageEmbed()
      .setFooter(tag, avatar)
      .setColor(interaction.guild.me.displayColor || '#00FFFF')
      .setTimestamp()
  }

  /**
   * Returns a custom embed
   * @param {import("discord.js").Interaction } interaction
   */
  rootEmbed (interaction) {
    return new MessageEmbed().setColor(
      interaction.guild.me.displayColor || '#00FFFF'
    )
  }

  /**
   * reply a custom embed
   * @param {import("discord.js").Interaction } interaction
   * @param {string} text
   */
  slashInfo (interaction, text) {
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
   * Reply a custom embed
   * @param {import("discord.js").Interaction } interaction
   * @param {string} text
   */
  slashError (interaction, text) {
    return interaction
      .editReply({
        ephemeral: true,
        embeds: [
          new MessageEmbed().setDescription('❌ | ' + text).setColor('RED')
        ],
        allowedMentions: { repliedUser: false }
      })
      .catch(console.error)
  }

  /**
   * Send a custom embed
   * @param {import("../base/CC-OSV-Client")} bot
   * @param {import("discord.js").Message.channel} Channel
   * @param {string} text
   */
  msgEmbed (bot, Channel, text) {
    Channel.send({
      embeds: [
        new MessageEmbed().setColor(bot.config.EmbedColor).setDescription(text)
      ]
    })
  }

  CmdUsage (bot, interaction, cmdName) {
    const cmd = bot.slashCommands.get(cmdName)
    const cmdUsage = cmd.usage ? `\/${cmd.name} ${cmd.usage}` : `\/${cmd.name}`

    const embed = bot.say
      .rootEmbed(interaction)
      .setAuthor(
        `${cmd.category} 指令： ${cmd.name}`,
        bot.user.displayAvatarURL()
      )
      .addField(`${cmdUsage}`, `${cmd.description ?? '尚未註明，ㄏㄏ'}`)
      .setFooter('提示： [] 為非必填 • <> 為必填 • | 為擇一')

    let subcmd = cmd.subCommands
    if (subcmd && subcmd.length >= 1) {
      for (let s = 0; s < subcmd.length; s++) {
        embed.addField('** **', `**\/${cmd.name} ${subcmd[s]}`)
      }
    }
    return interaction.editReply({
      ephemeral: true,
      embeds: [embed],
      allowedMentions: { repliedUser: false }
    })
  }
}
module.exports = new Embeds()
