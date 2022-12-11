import { addSlashCommand } from "@classes/command.ts";
import { CCOSVEmbed } from "@classes/embed.ts";

export default addSlashCommand({
  name: "nowplaying",
  description: "the current song",
  nameLocalizations: { "zh-TW": "正在播放" },
  descriptionLocalizations: { "zh-TW": "顯示目前正在播放的音樂資訊" },
  acknowledge: false,
  run: async (bot, interaction) => {
    const player = bot.guildPlayers.get(interaction.guildId!);
    const current = bot.guildQueues.get(interaction.guildId!);
    if (!player?.connected || !current) {
      return await interaction.reply("**目前沒有播放任何音樂...**");
    }

    await interaction.reply({
      type: 4,
      data: {
        embeds: new CCOSVEmbed().setTitle(
          `(${current[0].title})[${current[0].link}]`,
        )
          .build(),
      },
    });
  },
});
