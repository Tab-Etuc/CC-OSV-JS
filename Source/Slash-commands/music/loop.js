const { QueueRepeatMode } = require("discord-player");

module.exports = {
  name: "循環",
  description: "顯示當前設置之重複播放模式。",
  category: "音樂",
  subCommands: ["播放列**\n重複播放列表中的歌曲。", "循環**\n重複當前播放歌曲。", "關閉**\n將重複播放模式關閉。"],
  options: [{
    name: "mode",
    type: "STRING",
    description: "選擇要更改的新重複播放模式",
    required: true,
    choices: [
      {
        name: "關閉",
        value: "off"
      },
      {
        name: "循環",
        value: "track"
       },
      {
        name: "播放列",
        value: "queue"
      }
     ]
  }],
  async execute(bot, interaction) {
    const arg = interaction.options.getString("mode", false);

    const queue = bot.player.getQueue(interaction.guild.id);

    if (!queue || !queue.playing)
      return bot.say.errorMessage(interaction, "我目前沒有在這個伺服器中播放音樂。");

    if (!bot.utils.canModifyQueue(interaction)) return;

    let md = "none";
    if (queue.repeatMode == 2) {
      md = "queue";
    } else if (queue.repeatMode == 1) {
      md = "track";
    } else if (queue.repeatMode == 0) {
      md = "off";
    }

    const embed = bot.say.rootEmbed(interaction)
      .setDescription(`重複播放模式已更換至 \`${md}\`。`)
      .setFooter(`使用 \'\/loop <關閉|循環|播放列>\' 來改變重複播放模式。`);

    if (!arg)
      return interaction.reply({ ephemeral: true, embeds: [embed], allowedMentions: { repliedUser: false } }).catch(console.error);

    let mode;
    switch (arg) {
      case "off":
        queue.setRepeatMode(QueueRepeatMode.OFF);
        mode = "已將循環模式關閉。";
        break;
      case "track":
        queue.setRepeatMode(QueueRepeatMode.TRACK);
        mode = "重複播放模式已更換至 **循環**";
        break;
      case "queue":
        queue.setRepeatMode(QueueRepeatMode.QUEUE);
        mode = "重複播放模式已更換至 **循環播放列**";
        break;
      default:
        return interaction.reply({ ephemeral: true, embeds: [embed], allowedMentions: { repliedUser: false } }).catch(console.error);
    }

    return bot.say.infoMessage(interaction, `${mode}`);
  }
};
