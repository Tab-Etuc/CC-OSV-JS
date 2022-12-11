import { discordeno } from "@deps";
import { BotClient } from "@base/CC-OSV-Client.ts";
export async function executeButtonClick(
  bot: BotClient,
  interaction: discordeno.Interaction,
) {
  if (!interaction.data) return;

  await Promise.allSettled([
    // SETUP-DD-TEMP: Insert any functions you wish to run when a user clicks a button.
  ]).catch(console.log);
}
