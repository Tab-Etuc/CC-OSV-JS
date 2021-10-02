module.exports = {
  name: "跳過",
  description: "跳過當前播放的歌曲。",
  category: "音樂",
  execute(bot, interaction) {
    const queue = bot.player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing)
      return bot.say.errorMessage(interaction, "我目前沒有在這個伺服器中播放音樂。");

    if (!bot.utils.canModifyQueue(interaction)) return;

    if (queue.tracks.length < 1 && queue.repeatMode !== 3)
      return bot.say.warnMessage(interaction, "沒有可以跳過的歌曲。");

    queue.skip();

    return bot.say.infoMessage(interaction, "已跳過該歌曲。");
  }
};