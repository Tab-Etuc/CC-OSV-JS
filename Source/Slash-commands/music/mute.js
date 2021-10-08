module.exports = {
  name: "禁音",
  description: "將音樂靜音。",
  category: "音樂",
  async execute(bot, interaction) {
    await interaction.deferReply();

    const queue = bot.player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing)
      return bot.say.errorMessage(interaction, "我目前沒有在這個伺服器中播放音樂。");

    if (!bot.utils.canModifyQueue(interaction)) return;

    if (queue.volume === 0)
      return bot.say.warnMessage(interaction, "這首歌早已靜音。");

    queue.mute();
    return bot.say.infoMessage(interaction, "已靜音。");
  }
};