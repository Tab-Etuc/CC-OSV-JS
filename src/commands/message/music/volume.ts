import { addMsgCommand } from "@classes/command.ts";
import { setMusicVolume } from "@services/musicCommands.ts";
import { runMessageGuildAction } from "@services/commandAdapters.ts";

export default addMsgCommand({
  name: "volume",
  mod: "music",
  description: "調整音量",
  aliases: ["v"],
  requiredArgs: true,
  usage: "<0-1000>",
  run: (bot, message, args) =>
    runMessageGuildAction(
      bot,
      message,
      (bot, guildId) => setMusicVolume(bot, guildId, args[0] ?? ""),
    ),
});
