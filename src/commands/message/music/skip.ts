import { addMsgCommand } from "@classes/command.ts";
import { skipCurrentMusic } from "@services/musicCommands.ts";
import { runMessageGuildAction } from "@services/commandAdapters.ts";

export default addMsgCommand({
  name: "skip",
  mod: "music",
  description: "跳過目前歌曲",
  aliases: ["s"],
  run: (bot, message) =>
    runMessageGuildAction(
      bot,
      message,
      (bot, guildId) => skipCurrentMusic(bot, guildId),
    ),
});
