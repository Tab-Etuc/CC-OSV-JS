module.exports = {
  name: "洗牌",
  description: "將播放列中的播放順序重新排列。",
  category: "音樂",
  async execute(bot, interaction) {
    await interaction.deferReply();

    const queue = bot.player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing)
      return bot.say.errorMessage(interaction, "我目前沒有在這個伺服器中播放音樂。");

    if (!bot.utils.canModifyQueue(interaction)) return;

    if (queue.tracks.length < 3)
      return bot.say.warnMessage(interaction, "在播放列中至少需要\`3 \`首歌曲才能重新排序。");

    queue.shuffle();

    return bot.say.infoMessage(interaction, "已重新排序。");
  }
};
