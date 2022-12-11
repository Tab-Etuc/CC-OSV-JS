import { addSlashCommand } from "@classes/command.ts";

export default addSlashCommand({
  name: "resume",
  description: "resume music",
  nameLocalizations: { "zh-TW": "恢復播放" },
  descriptionLocalizations: { "zh-TW": "恢復目前暫停的歌曲" },
  acknowledge: false,
  run: async (bot, interaction) => {
    const player = bot.guildPlayers.get(interaction.guildId!);

    if (!player) {
      return await interaction.reply("**目前沒有播放任何音樂...**");
    }
    if (!player.paused) {
      return await interaction.reply("**歌曲播放中**");
    }

    player.pause(false);
    await interaction.reply("**音樂已恢復播放**");
  },
});
