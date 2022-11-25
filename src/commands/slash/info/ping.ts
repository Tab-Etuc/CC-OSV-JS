import { discordeno } from "@deps";
import { snowflakeToTimestamp } from "@utils/snowflake.ts";
import { addSlashCommand, CCOSVSlashCommand } from "@classes/command.ts";
import { BotClient } from "@base/CC-OSV-Client.ts";
import { CCOSVEmbed } from "@classes/embed.ts";
import { COLORS } from "@const/colors.ts";
import { main } from "@utils/log.ts";

class Ping extends CCOSVSlashCommand {
  constructor() {
    super("ping", "info", discordeno.ApplicationCommandTypes.ChatInput, [], {
      nameLocalizations: { "zh-TW": "顯示延遲" },
      descriptionLocalizations: { "zh-TW": "顯示機器人的延遲" },
      description: "Show bot ping.",
    });
  }

  override async run(bot: BotClient, interaction: discordeno.Interaction) {
    await bot.helpers.editOriginalInteractionResponse(
      interaction.token,
      {
        embeds: new CCOSVEmbed().setTitle("\`🏓 Pong!\`").setDesc(
          `⏱️: ${Date.now() - snowflakeToTimestamp(interaction.id)}ms\n`,
        ).setColor(COLORS.BLUE).build(),
      },
    ).catch((err) => main.error(err));
  }
}

addSlashCommand(new Ping());
