module.exports = {
  name: "loopqueue",
  description: "🔂循環整個播放列",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["lq", "repeatqueue", "rq"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} bot
   * @param {import("discord.js").Message} interaction
   * @param {string[]} args
   * @param {*} param3
   */
    async execute(bot, interaction, args, { GuildDB })  {
      let player = await bot.Manager.get(interaction.guild_id);
      const guild = bot.guilds.cache.get(interaction.guild_id);
      const member = guild.members.cache.get(interaction.member.user.id);
      const voiceChannel = member.voice.channel;
      let awaitchannel = bot.channels.cache.get(interaction.channel_id); /// thanks Reyansh for this idea ;-;
      if (!player)
        return bot.sendTime(
          interaction,
          "❌ | **目前沒有播放任何音樂...**"
        );
      if (!member.voice.channel)
        return bot.sendTime(
          interaction,
          "❌ | **您必須先加入一個語音頻道！**"
        );
      if (
        guild.me.voice.channel &&
        !guild.me.voice.channel.equals(voiceChannel)
      )
        return bot.sendTime(
          interaction,
          ":x: | **您必須和我在相同的語音通道以使用此命令！**"
        );

      if (player.queueRepeat) {
        player.setQueueRepeat(false);
        bot.sendTime(interaction, `:repeat: **播放列循環** \`關閉\``);
      } else {
        player.setQueueRepeat(true);
        bot.sendTime(interaction, `:repeat: **播放列循環** \`啟用\``);
      }
      console.log(interaction.data);
    },
  
};
