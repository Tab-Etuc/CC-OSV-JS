module.exports = {
  name: "音量",
  description: "顯示當前的音量。",
  category: "音樂",
  subCommands: ["<1-200>**\n更改機器人的音量。"],
  options: [{
    name: "音量",
    description: "更改機器人的輸出音量",
    type: "NUMBER",
    required: false
  }],
  async execute(bot, interaction) {
    await interaction.deferReply();

    const newVol = interaction.options.getNumber("音量", false);

    const queue = bot.player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing)
      return bot.say.errorMessage(interaction, "我目前沒有在這個伺服器中播放音樂。");

    if (!bot.utils.canModifyQueue(interaction)) return;

    if (!newVol) {
      const embed = bot.say.rootEmbed(interaction)
        .setDescription(`音量現在是 \`${queue.volume}%\`。`)
        .setFooter(`使用 \`\/音量 <1-200>\` 以更改音量。`);

      return interaction.reply({ ephemeral: true, embeds: [embed], allowedMentions: { repliedUser: false } }).catch(console.error);
    }

    if (!Number.isInteger(newVol) || newVol > 200 || newVol < 0)
      return bot.say.warnMessage(interaction, "請輸入介於1~200間的數字。");

    queue.setVolume(newVol);

    return bot.say.infoMessage(interaction, `音量已更改至 \`${queue.volume}%\`。`);
  }
};