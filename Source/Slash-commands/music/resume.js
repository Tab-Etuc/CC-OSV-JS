module.exports = {
  name: "取消暫停",
  description: "取消當前暫停的歌曲。",
  category: "音樂",
  async execute(bot, interaction) {
    await interaction.deferReply();

    const queue = bot.player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing)
      return bot.say.errorMessage(interaction, "我目前沒有在這個伺服器中播放音樂。");

    if (!bot.utils.canModifyQueue(interaction)) return;

    if (!queue.connection.paused)
      return bot.say.warnMessage(interaction, "這首歌沒有被暫停。");

    queue.setPaused(false);
    return bot.say.infoMessage(interaction, "已重新播放歌曲。");
  }
};
