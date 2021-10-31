
module.exports = {
  name: "pause",
  description: "⏸暫停音樂。",
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
    async execute(bot, interaction, args, { GuildDB })  {
      const guild = bot.guilds.cache.get(interaction.guild_id);
      const member = guild.members.cache.get(interaction.member.user.id);

      if (!member.voice.channel)
        return bot.sendTime(
          interaction,
          "❌ | **您必須先加入一個語音頻道！**"
        );
      if (
        guild.me.voice.channel &&
        !guild.me.voice.channel.equals(member.voice.channel)
      )
        return bot.sendTime(
          interaction,
          ":x: | **您必須和我在相同的語音通道以使用此指令！**"
        );

      let player = await bot.Manager.get(interaction.guild_id);
      if (!player)
        return bot.sendTime(
          interaction,
          "❌ | **目前沒有播放任何音樂...**"
        );
      if (player.paused)
        return bot.sendTime(interaction, "音樂暫停中！");
      player.pause(true);
      bot.sendTime(interaction, "**⏸ 已暫停！**");
    },
  
};
