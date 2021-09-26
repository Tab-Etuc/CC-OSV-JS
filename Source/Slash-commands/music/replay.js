module.exports = {
  name: "replay",
  description: "重播當前的歌曲。",
  category: "音樂",
  execute(bot, interaction) {
    const queue = bot.player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing)
      return bot.say.errorMessage(interaction, "我目前沒有在這個伺服器中播放音樂。");

    if (!bot.utils.canModifyQueue(interaction)) return;

    queue.seek(0);

    return bot.say.infoMessage(interaction, "已重複播放當前的歌曲。");
  }
};
