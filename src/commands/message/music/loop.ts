import { addMsgCommand } from "@classes/command.ts";
import { setMusicLoop } from "@services/musicCommands.ts";
import { runMessageGuildAction } from "@services/commandAdapters.ts";

export default addMsgCommand({
  name: "loop",
  mod: "music",
  description: "切換單曲或整個佇列循環",
  aliases: [],
  usage: "[off|track|queue]",
  run: (bot, message, args) =>
    runMessageGuildAction(
      bot,
      message,
      (bot, guildId) => setMusicLoop(bot, guildId, args[0]),
    ),
});
