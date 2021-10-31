/**
 *
 * @param {import("../base/CC-OSV-Client")} bot
 * @param {import("discord.js").GuildCommandInteraction} interaction
 * @returns
 */
module.exports = async (bot, interaction) => {
  return new Promise(async (resolve) => {
    if (!interaction.member.voice.channel) {
      await interaction.reply({
        embeds: [
          bot.ErrorEmbed(
            "You must be in a voice channel to use this command!"
          ),
        ],
      });
      return resolve(false);
    }
    if (
      interaction.guild.me.voice.channel &&
      interaction.member.voice.channel.id !==
        interaction.guild.me.voice.channel.id
    ) {
      await interaction.reply({
        embeds: [
          bot.ErrorEmbed(
            "You must be in the same voice channel as me to use this command!"
          ),
        ],
      });
      return resolve(false);
    }

    resolve(interaction.member.voice.channel);
  });
};
