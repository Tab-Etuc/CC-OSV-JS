module.exports = {
  name: "unmute",
  description: "解除歌曲靜音。",
  category: "音樂",
  execute(bot, interaction) {
    const queue = bot.player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing)
      return bot.say.errorMessage(interaction, "我目前沒有在這個伺服器中播放音樂。");

    if (!bot.utils.canModifyQueue(interaction)) return;

    if (queue.volume > 0)
      return bot.say.warnMessage(interaction, "這首歌沒有被靜音。");

    queue.unmute();
    return bot.say.infoMessage(interaction, "已解除靜音。");
  }
};