module.exports = {
  name: "跳過",
  description: "跳到播放列中的某一首歌。",
  category: "音樂",
  usage: "<曲目於播放列中的列數>",
  options: [{
    name: "列數",
    description: "請輸入欲播放之歌曲列數",
    type: "NUMBER",
    required: true
  }],
  execute(bot, interaction) {
    const index = interaction.options.getNumber("index", true);

    const queue = bot.player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing)
      return bot.say.errorMessage(interaction, "我目前沒有在這個伺服器中播放音樂。");

    if (!bot.utils.canModifyQueue(interaction)) return;

    if (queue.tracks.length < 1)
      return bot.say.errorMessage(interaction, "播放列中目前沒有歌曲。");

    if (!index || index > queue.tracks.length || index < 1 || !queue.tracks[index])
      return bot.say.errorMessage(interaction, "您提供的歌曲索引不存在。");

    queue.jump(index);

    return bot.say.infoMessage(interaction, `已跳到 \`${index}\`首歌。`);
  }
};