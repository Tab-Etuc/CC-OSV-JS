module.exports = {
  name: "play",
  description: "從(欲搜尋之)歌曲名稱或連結播放歌曲或播放列表。",
  category: "音樂",
  usage: "<歌曲 連結/名稱>",
  options: [{
    name: "song",
    description: "您想播放之歌曲的名稱或連結。",
    type: "STRING",
    required: true
  }],
  async execute(bot, interaction) {
    if (!bot.utils.havePermissions(interaction))
      return bot.say.errorMessage(interaction, "我缺少播放權限...可以的話請自行判斷是否在不對的地方輸入了此指令");

    await interaction.deferReply();

    const string = await interaction.options.getString("song", true);

    const guildQueue = bot.player.getQueue(interaction.guild.id);

    const channel = interaction.member?.voice?.channel;

    if (!channel)
      return bot.say.warnMessage(interaction, "您必須先加入一個語音頻道。");

    if (guildQueue && channel.id !== interaction.guild.me.voice.channelId)
      return bot.say.warnMessage(interaction, "我已經在其中一個語音通道中播放音樂了！\n如果你可以讓bot同時出現在兩個頻道中，歡迎提供技術協助;w;");

    if (!channel?.viewable)
      return bot.say.warnMessage(interaction, "我缺少播放權限...可以的話請自行判斷是否在不對的地方輸入了此指令");
    if (!channel?.joinable)
      return bot.say.warnMessage(interaction, "我缺少播放權限...可以的話請自行判斷是否在不對的地方輸入了此指令");
    if (!channel?.speakable)
      return bot.say.warnMessage(interaction, "我缺少播放權限...可以的話請自行判斷是否在不對的地方輸入了此指令");
    if (channel?.full)
      return bot.say.warnMessage(interaction, "我無法加入該頻道，該頻道已達人數上限。");

    let result = await bot.player.search(string, { requestedBy: interaction.user }).catch(() => { });
    if (!result || !result.tracks.length)
      return bot.say.errorMessage(interaction, `沒有找到結果 \`${string}\`.`);

    let queue;
    if (guildQueue) {
      queue = guildQueue;
      queue.metadata = interaction;
    } else {
      queue = await bot.player.createQueue(interaction.guild, {
        metadata: interaction
      });
    }

    try {
      if (!queue.connection) await queue.connect(channel);
    } catch (error) {
      bot.logger.error("JOIN", error);
      bot.player.deleteQueue(interaction.guild.id);
      return bot.say.errorMessage(interaction, `無法加入您所在之語音頻道\n\`${error}\``);
    }

    result.playlist ? queue.addTracks(result.tracks) : queue.addTrack(result.tracks[0]);

    if (!queue.playing) await queue.play();
  }
};