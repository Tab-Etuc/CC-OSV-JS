import { addMsgCommand } from "@classes/command.ts";
import { setBassBoost } from "@services/musicCommands.ts";
import { runMessageGuildAction } from "@services/commandAdapters.ts";

export default addMsgCommand({
  name: "bassboost",
  mod: "music",
  description: "調整低音增強效果",
  aliases: ["bass"],
  usage: "[0-2]",
  run: (bot, message, args) =>
    runMessageGuildAction(
      bot,
      message,
      (bot, guildId) => setBassBoost(bot, guildId, args[0] ?? "1"),
    ),
});
