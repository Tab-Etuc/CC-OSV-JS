import { addSlashCommand } from "@classes/command.ts";
import { CCOSVEmbed } from "@classes/embed.ts";

export default addSlashCommand({
  name: "volume",
  description: "set music volume",
  nameLocalizations: { "zh-TW": "音量" },
  descriptionLocalizations: { "zh-TW": "調整音樂播放音量" },
  options: [
    {
      name: "調整大小",
      type: 4,
      required: true,
      description: "您欲調整之音量大小(100以上有機率爆音)",
    },
  ],
  acknowledge: false,
  run: async (bot, interaction) => {
    const player = bot.guildPlayers.get(interaction.guildId!);
    if (!player?.connected) {
      return await interaction.reply({
        type: 4,
        data: {
          embeds: new CCOSVEmbed()
            .setDesc(":x: A player for this guild doesn't exist.")
            .build(),
        },
      });
    }
    const arg = Number(interaction.data!.options![0]!.value!);
    player.setVolume(+arg);
    await interaction.reply(`**已調整音量至**${arg}`);
  },
});
