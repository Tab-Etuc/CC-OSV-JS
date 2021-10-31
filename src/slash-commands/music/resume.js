

module.exports = {
  name: "resume",
  description: "🔂重新播放音樂。",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: [],
  
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} bot
     * @param {import("discord.js").Message} interaction
     * @param {string[]} args
     * @param {*} param3
     */
    async execute(bot, interaction)  {
      await interaction.deferReply();

      const guild = bot.guilds.cache.get(interaction.guild.id);
      const member = guild.members.cache.get(interaction.member.user.id);

      if (!member.voice.channel)
        return bot.say.errorMessage(
          interaction,
          "❌ | **您必須先加入一個語音頻道！**"
        );
      if (
        guild.me.voice.channel &&
        !guild.me.voice.channel.equals(member.voice.channel)
      )
        return bot.say.errorMessage(
          interaction,
          ":x: | **您必須和我在相同的語音通道以使用此指令！**"
        );

      let player = await bot.Manager.get(interaction.guild.id);
      if (!player)
        return bot.say.errorMessage(
          interaction,
          "❌ | **目前沒有播放任何音樂...**"
        );
      if (player.playing)
        return bot.say.errorMessage(
          interaction,
          "❌ | **歌曲播放中！**"
        );
      player.pause(false);
      bot.say.infoMessage(interaction, "**⏯ 已重新播放！**");
    },
  
};
