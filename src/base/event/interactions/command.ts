import { findSlashCommand } from "@classes/command.ts";
import { discordeno } from "@deps";
import { BotClient } from "@base/CC-OSV-Client.ts";

export async function executeSlashCommand(
  bot: BotClient,
  interaction: discordeno.Interaction,
) {
  const command = findSlashCommand(interaction?.data?.name);
  if (!command) return;
  if (interaction.guildId) {
    await bot.helpers.sendInteractionResponse(
      interaction.id,
      interaction.token,
      {
        type: discordeno.InteractionResponseTypes
          .DeferredChannelMessageWithSource,
      },
    );
  }
  try {
    command.run(bot, interaction);
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.stack) {
      bot.helpers.sendInteractionResponse(interaction.id, interaction.token, {
        type: discordeno.InteractionResponseTypes.ChannelMessageWithSource,
        data: { content: String(error.stack) },
      });
    } else {
      bot.helpers.sendInteractionResponse(interaction.id, interaction.token, {
        type: discordeno.InteractionResponseTypes.ChannelMessageWithSource,
        data: { content: String(error) },
      });
    }
  }
}
