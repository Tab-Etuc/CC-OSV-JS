import { addMsgCommand } from "@classes/command.ts";
import { setPlaybackSpeed } from "@services/musicCommands.ts";
import { runMessageGuildAction } from "@services/commandAdapters.ts";

export default addMsgCommand({
  name: "speed",
  mod: "music",
  description: "調整播放速度",
  aliases: ["rate"],
  requiredArgs: true,
  usage: "<0.5-2>",
  run: (bot, message, args) =>
    runMessageGuildAction(
      bot,
      message,
      (bot, guildId) => setPlaybackSpeed(bot, guildId, args[0] ?? ""),
    ),
});
