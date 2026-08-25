import { addMsgCommand } from "@classes/command.ts";
import { historyMusic } from "@services/musicCommands.ts";
import { runMessageGuildAction } from "@services/commandAdapters.ts";

export default addMsgCommand({
  name: "history",
  mod: "music",
  description: "查看最近播放過的歌曲",
  aliases: ["previous", "recent"],
  run: (bot, message) =>
    runMessageGuildAction(
      bot,
      message,
      (bot, guildId) => historyMusic(bot, guildId),
    ),
});
