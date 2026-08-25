import { addMsgCommand } from "@classes/command.ts";
import { removeMusic } from "@services/musicCommands.ts";
import { runMessageGuildAction } from "@services/commandAdapters.ts";

export default addMsgCommand({
  name: "remove",
  mod: "music",
  description: "移除佇列中的歌曲",
  aliases: ["rm"],
  requiredArgs: true,
  usage: "<待播位置>",
  run: (bot, message, args) =>
    runMessageGuildAction(
      bot,
      message,
      (bot, guildId) => removeMusic(bot, guildId, args[0] ?? ""),
    ),
});
