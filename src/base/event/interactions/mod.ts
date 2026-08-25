import { discordeno } from "@deps";
import { Bot } from "@base/CC-OSV-Client.ts";
import { executeButtonClick } from "@base/event/interactions/button.ts";
import { executeSlashCommand } from "@base/event/interactions/command.ts";
import { executeSelectMenu } from "@base/event/interactions/selectMenu.ts";

export function setInteractionCreateEvent(): void {
  Bot.events.interactionCreate = async (rawInteraction) => {
    const interaction = rawInteraction as unknown as discordeno.Interaction;
    if (interaction.type === discordeno.InteractionTypes.ApplicationCommand) {
      await executeSlashCommand(Bot, interaction);
      return;
    }

    if (
      interaction.type !== discordeno.InteractionTypes.MessageComponent ||
      !interaction.data
    ) return;

    if (
      interaction.data.componentType === discordeno.MessageComponentTypes.Button
    ) {
      await executeButtonClick(Bot, interaction);
    } else if (
      interaction.data.componentType ===
        discordeno.MessageComponentTypes.SelectMenu
    ) {
      await executeSelectMenu(Bot, interaction);
    }
  };
}
