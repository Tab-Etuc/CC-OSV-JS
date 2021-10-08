module.exports = {
  name: "返回",
  description: "返回上一首歌。",
  category: "音樂",
  async execute(bot, interaction) {
    await interaction.deferReply();

    const queue = bot.player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing)
      return bot.say.errorMessage(interaction, "我目前沒有在這個伺服器中播放音樂。");

    if (!bot.utils.canModifyQueue(interaction)) return;

    if (queue.previousTracks.length <= 1)
      return bot.say.warnMessage(interaction, "沒有找到以前的曲目。");

    queue.back();

    return bot.say.infoMessage(interaction, "已返回上一首歌。");
  }
};