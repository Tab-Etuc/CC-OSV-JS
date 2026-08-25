import { addSlashCommand } from "@classes/command.ts";
import { seekMusic } from "@services/musicCommands.ts";

export default addSlashCommand({
  name: "seek",
  description: "跳轉到歌曲指定時間",
  options: [{
    name: "time",
    type: 3,
    required: true,
    description: "秒數、mm:ss、hh:mm:ss 或 1h2m3s",
  }],
  acknowledge: true,
  run: async (bot, interaction) => {
    if (!interaction.guildId) return;
    const value = interaction.data?.options?.find((item) =>
      item.name === "time"
    )
      ?.value;
    await interaction.edit(
      await seekMusic(bot, interaction.guildId, String(value ?? "")),
    );
  },
});
