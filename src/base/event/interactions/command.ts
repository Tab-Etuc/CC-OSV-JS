import { findSlashCommand } from "@classes/command.ts";
import { discordeno } from "@deps";
import { BotClient } from "@base/CC-OSV-Client.ts";
import { InteractionWithCustomProps } from "@typings/discordeno.ts";
export async function executeSlashCommand(
  bot: BotClient,
  interaction: discordeno.Interaction,
) {
  const command = findSlashCommand(interaction?.data?.name);
  if (!command) return;
  if (command.acknowledge) {
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
    command.run(bot, interaction as InteractionWithCustomProps);
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
