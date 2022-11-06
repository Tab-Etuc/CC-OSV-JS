module.exports = {
  name: 'volume',
  description: '🔉查看或變更播放音量。',
  usage: '<1 - 100的數字>',
  permissions: {
    channel: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS'],
    member: [],
  },
  aliases: ['vol', 'v'],
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
    if (!args[0])
      return bot.send.msgEmbed(
        bot,
        message.channel,
        `🔉 | 當前的音量 \`${player.volume}\`.`
      );

    if (!parseInt(args[0]))
      return bot.send.msgEmbed(
        bot,
        message.channel,
        `**請輸入一個數字介於** \`1 - 100\``
      );
    let vol = parseInt(args[0]);
    if (vol < 0 || vol > 100) {
      return bot.send.msgEmbed(
        bot,
        message.channel,
        '**請輸入一個數字介於 `1 - 100`**'
      );
    } else {
      player.setVolume(vol);
      bot.send.msgEmbed(
        bot,
        message.channel,
        `🔉 | **音量已設定至** \`${player.volume}\``
      );
    }
  },
};
