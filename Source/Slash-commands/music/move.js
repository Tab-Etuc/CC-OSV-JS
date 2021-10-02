module.exports = {
  name: "移動",
  description: "將所選歌曲移動到播放列中您所提供的位置。",
  usage: "<從...> [到]",
  category: "音樂",
  options: [
    {
      name: "from",
      description: "這首歌的當前位置",
      type: "NUMBER",
      required: true
    },
    {
      name: "to",
      description: "這首歌將被移動的位置",
      type: "NUMBER",
      required: false
    }
  ],
  async execute(bot, interaction) {
    const fr = await interaction.options.getNumber("from", true);
    let to = await interaction.options.getNumber("to") ?? 1;
    to = to - 1;

    const queue = bot.player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing)
      return bot.say.errorMessage(interaction, "我目前沒有在這個伺服器中播放音樂。");

    if (!bot.utils.canModifyQueue(interaction)) return;

    if (queue.tracks.length < 3)
      return bot.say.warnMessage(interaction, "至少需要 \`3\` 首歌才能使用此指令。");

    if (!fr || !to || fr < 0 || to < 0 || fr > queue.tracks.length || !queue.tracks[fr] || to > queue.tracks.length || !queue.tracks[to])
      return bot.say.warnMessage(interaction, "提供的歌曲索引不存在。");

    if (fr === to)
      return bot.say.warnMessage(interaction, "這首歌已經在這個位置。");

    const song = queue.tracks[fr];
    queue.splice(fr, 1);
    queue.splice(to, 0, song);

    return bot.say.infoMessage(interaction, `**[${song.title}](${song.url})** 已經從播放列中移動位置至 **${to}** 首歌。`);
  }
};
