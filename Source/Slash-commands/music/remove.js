module.exports = {
  name: "移除",
  description: "從播放列中移除歌曲。",
  usage: "<播放列列數>",
  category: "音樂",
  options: [{
    name: "列數",
    description: "請指定該首歌在播放列的位置",
    type: "NUMBER",
    required: true
  }],
  async execute(bot, interaction) {
    await interaction.deferReply();

    const sNum = interaction.options.getNumber("列數", true);

    const queue = bot.player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing)
      return bot.say.errorMessage(interaction, "我目前沒有在這個伺服器中播放音樂。");

    if (!bot.utils.canModifyQueue(interaction)) return;

    if (queue.tracks.length < 1)
      return bot.say.warnMessage(interaction, "在播放列中沒有歌曲得以刪除。");

    const index = (sNum - 1);

    if (!index || index < 0 || index > queue.tracks.length || !queue.tracks[index])
      return bot.say.warnMessage(interaction, "提供的歌曲索引不存在。");

    queue.remove(index);

    return bot.say.infoMessage(interaction, `已移除 \`${sNum}\`。`);
  }
};
