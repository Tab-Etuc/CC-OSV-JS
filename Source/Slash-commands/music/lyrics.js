const { Lyrics } = require("@discord-player/extractor");
const lyricsClient = Lyrics.init();

module.exports = {
  name: "歌詞",
  description: "獲取歌曲的歌詞。",
  category: "音樂",
  usage: "<歌曲名稱>",
  options: [{
    name: "歌曲名稱",
    type: "STRING",
    description: "為欲搜索之歌曲提供歌曲名稱",
    required: true
  }],
  async execute(bot, interaction) {
    const songName = interaction.options.getString("query", true);

    const songNameFormated = songName
      .toLowerCase()
      .replace(/\(lyrics|lyric|official music video|official video hd|official video|audio|official|clip officiel|clip|extended|hq\)/g, "");

    try {
      const result = await lyricsClient.search(`${songNameFormated}`);

      if (!result || !result.lyrics)
        return bot.say.errorMessage(interaction, "找不到這首歌的歌詞。");

      const embed = bot.say.baseEmbed(interaction)
        .setTitle(`${songName}`)
        .setDescription(`${result.lyrics.slice(0, 4090)}...`);

      return interaction.reply({ embeds: [embed], allowedMentions: { repliedUser: false } }).catch(console.error);
    } catch {
      return bot.say.errorMessage(interaction, "找不到這首歌的歌詞。");
    }
  }
};