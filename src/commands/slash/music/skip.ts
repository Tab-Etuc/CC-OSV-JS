import { addSlashCommand } from "@classes/command.ts";

export default addSlashCommand({
  name: "skip",
  description: "skip music",
  nameLocalizations: { "zh-TW": "跳過歌曲" },
  descriptionLocalizations: { "zh-TW": "跳過目前播放的歌曲" },
  acknowledge: false,
  run: async (bot, interaction) => {
    const player = bot.guildPlayers.get(interaction.guildId!);

    if (!player) {
      return await interaction.reply("**目前沒有播放任何音樂...**");
    }

    player.stop();
    await interaction.reply("**音樂已跳過**");
  },
});
