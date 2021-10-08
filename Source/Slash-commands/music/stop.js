module.exports = {
  name: "停止",
  description: "停止播放歌曲。",
  category: "音樂",
  async execute(bot, interaction) {
    await interaction.deferReply();

    const queue = bot.player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing)
      return bot.say.errorMessage(interaction, "我目前沒有在這個伺服器中播放音樂。");

    if (!bot.utils.canModifyQueue(interaction)) return;

    queue.stop();

    return bot.say.infoMessage(interaction, "已停止播放歌曲。");
  }
};
