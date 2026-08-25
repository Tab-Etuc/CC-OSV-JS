import { addMsgCommand } from "@classes/command.ts";
import { toggleNightcore } from "@services/musicCommands.ts";
import { runMessageGuildAction } from "@services/commandAdapters.ts";

export default addMsgCommand({
  name: "nightcore",
  mod: "music",
  description: "切換 Nightcore 模式",
  aliases: [],
  run: (bot, message) =>
    runMessageGuildAction(
      bot,
      message,
      (bot, guildId) => toggleNightcore(bot, guildId),
    ),
});
