const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
  name: "skip",
  description: "🎵跳過當前的曲目。",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["s", "next"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} bot
   * @param {import("discord.js").Message} interaction
   * @param {string[]} args
   * @param {*} param3
   */
  SlashCommand: {
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} bot
     * @param {import("discord.js").Message} interaction
     * @param {string[]} args
     * @param {*} param3
     */
    async execute(bot, interaction, args, { GuildDB })  {
      const guild = bot.guilds.cache.get(interaction.guild_id);
      const member = guild.members.cache.get(interaction.member.user.id);

      if (!member.voice.channel)
        return bot.sendTime(
          interaction,
          "❌ | **您必須在語音通道中使用此指令！**"
        );
      if (
        guild.me.voice.channel &&
        !guild.me.voice.channel.equals(member.voice.channel)
      )
        return bot.sendTime(
          interaction,
          ":x: | **您必須和我在相同的語音通道以使用此指令！**"
        );

      const skipTo = interaction.data.options
        ? interaction.data.options[0].value
        : null;

      let player = await bot.Manager.get(interaction.guild_id);

      if (!player)
        return bot.sendTime(
          interaction,
          "❌ | **目前沒有播放任何音樂...**"
        );
      console.log(interaction.data);
      if (
        skipTo !== null &&
        (isNaN(skipTo) || skipTo < 1 || skipTo > player.queue.length)
      )
        return bot.sendTime(interaction, "❌ | **無效的數字！**");
      player.stop(skipTo);
      bot.sendTime(interaction, "**已跳過!**");
    },
  },
};
