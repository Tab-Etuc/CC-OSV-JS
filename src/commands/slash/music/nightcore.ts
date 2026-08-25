import { addSlashCommand } from "@classes/command.ts";
import { toggleNightcore } from "@services/musicCommands.ts";
import { runSlashGuildAction } from "@services/commandAdapters.ts";

export default addSlashCommand({
  name: "nightcore",
  description: "切換 Nightcore 模式",
  run: (bot, interaction) =>
    runSlashGuildAction(
      bot,
      interaction,
      (bot, guildId) => toggleNightcore(bot, guildId),
    ),
});
