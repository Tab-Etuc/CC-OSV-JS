import { addSlashCommand } from "@classes/command.ts";

export default addSlashCommand({
  name: "pause",
  description: "skip music",
  nameLocalizations: { "zh-TW": "暫停播放" },
  descriptionLocalizations: { "zh-TW": "暫停目前正在播放的歌曲" },
  acknowledge: false,
  run: async (bot, interaction) => {
    const player = bot.guildPlayers.get(interaction.guildId!);

    if (!player) {
      return await interaction.reply("**目前沒有播放任何音樂...**");
    }
    if (player.paused) {
      return await interaction.reply("**音樂暫停中**");
    }

    player.pause(true);
    await interaction.reply("**音樂已暫停**");
  },
});
