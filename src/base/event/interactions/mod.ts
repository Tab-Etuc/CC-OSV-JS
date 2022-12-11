import { discordeno } from "@deps";
import { Bot } from "@base/CC-OSV-Client.ts";
import { executeButtonClick } from "@base/event/interactions/button.ts";
import { executeSlashCommand } from "@base/event/interactions/command.ts";
import { executeModalSubmit } from "@base/event/interactions/modal.ts";
import { executeSelectMenu } from "@base/event/interactions/selectMenu.ts";
export function setInteractionCreateEvent() {
  Bot.events.interactionCreate = async function (_, interaction) {
    if (interaction.type === discordeno.InteractionTypes.ApplicationCommand) {
      await executeSlashCommand(Bot, interaction);
    } else if (
      interaction.type === discordeno.InteractionTypes.MessageComponent
    ) {
      if (!interaction.data) return;

      // THE INTERACTION CAME FROM A BUTTON
      if (
        interaction.data.componentType ===
          discordeno.MessageComponentTypes.Button
      ) {
        await executeButtonClick(Bot, interaction);
      } else if (
        interaction.data.componentType ===
          discordeno.MessageComponentTypes.SelectMenu
      ) {
        // THE INTERACTION CAME FROM A SELECT MENU
        await executeSelectMenu(Bot, interaction);
      }
    } else if (interaction.type === discordeno.InteractionTypes.ModalSubmit) {
      await executeModalSubmit(Bot, interaction);
    }
  };
}
