module.exports = {
  name: 'loop',
  description: '🔂循環當前的歌曲。',
  usage: '',
  permissions: {
    channel: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS'],
    member: [],
  },
  aliases: ['l', 'repeat'],
  /**
   *
   * @param {import("../base/CC-OSV-Client")} bot
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (bot, message, args, GuildDB) => {
    let player = await bot.manager.get(message.guild.id);
    if (!player)
      return bot.send.msgEmbed(
        bot,
        message.channel,
        '**目前沒有播放任何音樂...**'
      );
    if (!message.member.voice.channel)
      return bot.send.msgEmbed(
        bot,
        message.channel,
        '**您必須在語音通道中使用此指令！**'
      );
    if (
      message.guild.me.voice.channel &&
      message.member.voice.channel.id !== message.guild.me.voice.channel.id
    )
      return bot.send.msgEmbed(
        bot,
        message.channel,
        '**您必須和我在相同的語音通道以使用此指令！**'
      );

    if (player.trackRepeat) {
      player.setTrackRepeat(false);
      bot.send.msgEmbed(bot, message.channel, `🔂  \`關閉\``);
    } else {
      player.setTrackRepeat(true);
      bot.send.msgEmbed(bot, message.channel, `🔂 \`啟用\``);
    }
  },
};
