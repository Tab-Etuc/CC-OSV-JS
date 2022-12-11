import { snowflakeToTimestamp } from "@utils/snowflake.ts";
import { addSlashCommand } from "@classes/command.ts";
import { CCOSVEmbed } from "@classes/embed.ts";
import { COLORS } from "@const/colors.ts";
import { main } from "@utils/log.ts";

export default addSlashCommand({
  name: "ping",
  description: "Show bot ping.",
  nameLocalizations: { "zh-TW": "顯示延遲" },
  descriptionLocalizations: { "zh-TW": "顯示機器人的延遲" },
  run: async (bot, interaction) => {
    return await bot.helpers.editOriginalInteractionResponse(
      interaction.token,
      {
        embeds: new CCOSVEmbed().setTitle("\`🏓 Pong!\`").setDesc(
          `⏱️: ${Date.now() - snowflakeToTimestamp(interaction.id)}ms\n`,
        ).setColor(COLORS.BLUE).build(),
      },
    ).catch((err) => main.error(err));
  },
});
