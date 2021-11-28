/**
 *
 * @param {import("../../base/CC-OSV-Client")} bot
 * @param {import("discord.js").GuildCommandInteraction} interaction
 * @returns
 */
module.exports = async (bot, interaction) => {
  return new Promise(async resolve => {
    if (!interaction.member.voice.channel) {
      bot.say.slashError(interaction, '❌ | **您必須先加入一個語音頻道！**')
      return resolve(false)
    }
    if (
      interaction.guild.me.voice.channel &&
      interaction.member.voice.channel.id !==
        interaction.guild.me.voice.channel.id
    ) {
      bot.say.slashError(
        interaction,
        '❌ | **您必須和我處在同一個語音頻道以使用此指令！**'
      )
      return resolve(false)
    }

    resolve(interaction.member.voice.channel)
  })
}
