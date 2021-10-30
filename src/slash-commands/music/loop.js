module.exports = {
  name: "loop",
  description: "🔂循環當前的歌曲。",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["l", "repeat"],
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
      const voiceChannel = member.voice.channel;
      let player = await bot.Manager.get(interaction.guild_id);
      if (!player)
        return bot.sendTime(
          interaction,
          "❌ | **目前沒有播放任何音樂...**"
        );
      if (!member.voice.channel)
        return bot.sendTime(
          interaction,
          "❌ | 您必須在語音通道中使用此命令！"
        );
      if (
        guild.me.voice.channel &&
        !guild.me.voice.channel.equals(member.voice.channel)
      )
        return bot.sendTime(
          interaction,
          ":x: | **您必須和我在相同的語音通道以使用此命令！**"
        );

      if (player.trackRepeat) {
        player.setTrackRepeat(false);
        bot.sendTime(interaction, `🔂 \`關閉\``);
      } else {
        player.setTrackRepeat(true);
        bot.sendTime(interaction, `🔂 \`啟用\``);
      }
      console.log(interaction.data);
    },
  
};
