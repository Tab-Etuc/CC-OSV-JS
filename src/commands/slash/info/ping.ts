import { snowflakeToTimestamp } from "@utils/snowflake.ts";
import { addSlashCommand } from "@classes/command.ts";
import { CCOSVEmbed } from "@classes/embed.ts";
import { COLORS } from "@const/colors.ts";

export default addSlashCommand({
  name: "ping",
  description: "顯示機器人延遲",
  nameLocalizations: { "zh-TW": "顯示延遲" },
  descriptionLocalizations: { "zh-TW": "顯示機器人的延遲" },
  acknowledge: true,
  run: async (_, interaction) => {
    await interaction.edit({
      embeds: new CCOSVEmbed()
        .setTitle("連線延遲")
        .setDesc(`${Date.now() - snowflakeToTimestamp(interaction.id)} 毫秒`)
        .setColor(COLORS.ORANGE)
        .build(),
    });
  },
});
