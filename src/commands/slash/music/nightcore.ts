import { addSlashCommand } from "@classes/command.ts";

export default addSlashCommand({
  name: "nightcore",
  description: "nightcore mode",
  acknowledge: false,
  run: async (bot, interaction) => {
    const player = bot.guildPlayers.get(interaction.guildId!);

    if (!player?.connected) {
      return await interaction.reply("**目前沒有播放任何音樂...**");
    }
    player.filters.timescale = player.filters.timescale?.rate == 1.09
      ? { rate: 1, pitch: 1, speed: 1 }
      : { rate: 1.09, pitch: 1.125, speed: 1 };
    player.setFilters();
    await interaction.reply(
      `${
        player.filters.timescale?.pitch === 1 ? "Disabled" : "Enabled"
      } **nightcore**!（請等待約５秒左右）`,
    );
  },
});
