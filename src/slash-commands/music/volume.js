const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
  name: "volume",
  description: "🔉查看或變更播放音量。",
  usage: "<音量>",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["vol", "v"],

    async execute(bot, interaction, args, { GuildDB })  {
      const guild = bot.guilds.cache.get(interaction.guild_id);
      const member = guild.members.cache.get(interaction.member.user.id);

      if (!member.voice.channel)
        return bot.sendTime(
          interaction,
          "❌ | 您必須先加入一個語音頻道！"
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
      if (!args[0].value)
        return bot.sendTime(
          interaction,
          `🔉 | 當前的音量 \`${player.volume}\`.`
        );
      let vol = parseInt(args[0].value);
      if (!vol || vol < 1 || vol > 100)
        return bot.sendTime(
          interaction,
          `**請輸入一個數字介於** \`1 - 100\``
        );
      player.setVolume(vol);
      bot.sendTime(interaction, `🔉 | 音量已設定至 \`${player.volume}\``);
    },
  
};
