import { addMsgCommand } from "@classes/command.ts";
import { clearMusic } from "@services/musicCommands.ts";
import { runMessageGuildAction } from "@services/commandAdapters.ts";

export default addMsgCommand({
  name: "clearqueue",
  mod: "music",
  description: "清除所有待播歌曲",
  aliases: ["clearq", "cq"],
  run: (bot, message) =>
    runMessageGuildAction(
      bot,
      message,
      (bot, guildId) => clearMusic(bot, guildId),
    ),
});
