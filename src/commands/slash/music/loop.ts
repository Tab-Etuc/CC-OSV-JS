import { addSlashCommand } from "@classes/command.ts";

export default addSlashCommand({
  name: "loop",
  description: "loop the current song",
  nameLocalizations: { "zh-TW": "循環播放" },
  descriptionLocalizations: { "zh-TW": "重複播放當前歌曲" },
  acknowledge: false,
  run: async (bot, interaction) => {
    const player = bot.guildPlayers.get(interaction.guildId!);

    if (!player?.connected) {
      return await interaction.reply("**目前沒有播放任何音樂...**");
    }

    player.setTrackRepeat(!player.trackRepeat);
    const trackRepeat = player.trackRepeat ? "啟用" : "關閉";
    await interaction.reply(`循環模式已${trackRepeat}`);
  },
});
