import { addSlashCommand } from "@classes/command.ts";
import { setBassBoost } from "@services/musicCommands.ts";
import { runSlashGuildAction, slashOption } from "@services/commandAdapters.ts";

export default addSlashCommand({
  name: "bassboost",
  description: "調整低音增強效果",
  options: [{
    name: "level",
    type: 10,
    required: false,
    description: "0 到 2",
  }],
  run: (bot, interaction) =>
    runSlashGuildAction(
      bot,
      interaction,
      (bot, guildId) =>
        setBassBoost(bot, guildId, slashOption(interaction, "level") || "1"),
    ),
});
