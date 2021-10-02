module.exports = {
  name: "暫停",
  description: "暫停當前播放的歌曲。",
  category: "音樂",
  execute(bot, interaction) {
    const queue = bot.player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing)
      return bot.say.errorMessage(interaction, "我目前沒有在這個伺服器中播放音樂。");

    if (!bot.utils.canModifyQueue(interaction)) return;

    if (queue.connection.paused)
      return bot.say.warnMessage(interaction, "這首歌早已暫停。");

    queue.setPaused(true);
    return bot.say.infoMessage(interaction, "已暫停播放歌曲");
  }
};
