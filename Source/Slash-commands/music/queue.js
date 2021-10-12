module.exports = {
  name: "播放列",
  description: "顯示播放列。",
  category: "音樂",
  subCommands: ["<頁數>**\n顯示該頁數之播放列"],
  options: [{
    name: "頁數",
    description: "播放列的頁碼",
    type: "NUMBER",
    required: false
  }],
  async execute(bot, interaction) {
    await interaction.deferReply();
    
    let page = interaction.options.getNumber("page", false) ?? 1;

    const queue = bot.player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing)
      return bot.say.errorMessage(interaction, "我目前沒有在這個伺服器中播放音樂。");

    if (!queue.tracks.length)
      return bot.say.warnMessage(interaction, "播放列中沒有歌曲。");

    const multiple = 10;

    const maxPages = Math.ceil(queue.tracks.length / multiple);

    if (page < 1 || page > maxPages) page = 1;

    const end = page * multiple;
    const start = end - multiple;

    const tracks = queue.tracks.slice(start, end);

    const embed = bot.say.rootEmbed(interaction)
      .setDescription(`${tracks.map((song, i) => `${start + (++i)} - [${song.title}](${song.url}) ~ [${song.requestedBy.toString()}]`).join("\n")}`)
      .setFooter(`Page ${page} of ${maxPages} | song ${start + 1} to ${end > queue.tracks.length ? `${queue.tracks.length}` : `${end}`} of ${queue.tracks.length}`, interaction.user.displayAvatarURL({ dynamic: true }));

    return interaction.editReply({ ephemeral: true, embeds: [embed], allowedMentions: { repliedUser: false } }).catch(console.error);
  }
};
