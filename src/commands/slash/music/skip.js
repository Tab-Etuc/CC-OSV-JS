module.exports = {
  name: 'skip',
  description: '🎵跳過當前的曲目。',
  usage: '',
  permissions: {
    channel: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'EMBED_LINKS'],
    member: [],
  },
  aliases: ['s', 'next'],
  options: [
    {
      name: '位置',
      value: 'song',
      type: 3,
      required: false,
      description: '您想跳到...位置。',
    },
  ],

  /**
   * @param {import("../base/CC-OSV-Client")} bot
   * @param {import("discord.js").Message} interaction
   */

  async execute(bot, interaction) {
    await interaction.deferReply();
    const channel = await bot.getChannel(bot, interaction);
    if (!channel) return;

    const skipTo = await interaction.options.getString('位置', false);

    let player = bot.manager.players.get(interaction.guild.id);

    if (!player)
      return bot.send.slashError(interaction, '**目前沒有播放任何音樂...**');

    if (
      skipTo !== null &&
      (isNaN(skipTo) || skipTo < 1 || skipTo > player.queue.length)
    )
      return bot.send.slashInfo(interaction, '**無效的數字！**');
    player.stop(skipTo);
    bot.send.slashInfo(interaction, '**已跳過!**');
  },
};
