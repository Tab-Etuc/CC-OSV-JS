import { addSlashCommand } from "@classes/command.ts";
import { toggleVaporwave } from "@services/musicCommands.ts";
import { runSlashGuildAction } from "@services/commandAdapters.ts";

export default addSlashCommand({
  name: "vaporwave",
  description: "切換 Vaporwave 模式",
  run: (bot, interaction) =>
    runSlashGuildAction(
      bot,
      interaction,
      (bot, guildId) => toggleVaporwave(bot, guildId),
    ),
});
