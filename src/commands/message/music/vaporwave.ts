import { addMsgCommand } from "@classes/command.ts";
import { toggleVaporwave } from "@services/musicCommands.ts";
import { runMessageGuildAction } from "@services/commandAdapters.ts";

export default addMsgCommand({
  name: "vaporwave",
  mod: "music",
  description: "切換 Vaporwave 模式",
  aliases: ["vapor"],
  run: (bot, message) =>
    runMessageGuildAction(
      bot,
      message,
      (bot, guildId) => toggleVaporwave(bot, guildId),
    ),
});
