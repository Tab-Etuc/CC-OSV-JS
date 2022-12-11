import { snowflakeToTimestamp } from "@utils/snowflake.ts";
import { addSlashCommand } from "@classes/command.ts";
import { CCOSVEmbed } from "@classes/embed.ts";
import { COLORS } from "@const/colors.ts";

export default addSlashCommand({
  name: "ping",
  description: "Show bot ping.",
  nameLocalizations: { "zh-TW": "顯示延遲" },
  descriptionLocalizations: { "zh-TW": "顯示機器人的延遲" },
  acknowledge: true,
  run: async (_, interaction) => {
    return await interaction.editReply({
      embeds: new CCOSVEmbed().setTitle("\`🏓 Pong!\`").setDesc(
        `⏱️: ${Date.now() - snowflakeToTimestamp(interaction.id)}ms\n`,
      ).setColor(COLORS.ORANGE).build(),
    });
  },
});
