module.exports = {
  name: "clear",
  description: "清除當前播放列。(註：不會清除當前播放之曲目)",
  category: "音樂",
  execute(bot, interaction) {
    const queue = bot.player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing)
      return bot.say.errorMessage(interaction, "我目前沒有在這個伺服器中播放音樂。");

    if (!bot.utils.canModifyQueue(interaction)) return;

    if (queue.tracks.length < 1)
      return bot.say.warnMessage(interaction, "播放列中沒有歌曲。");

    queue.clear();

    return bot.say.infoMessage(interaction, "已清除播放列。");
  }
};
