import { addMsgCommand } from "@classes/command.ts";
import { pauseMusic } from "@services/musicCommands.ts";
import { runMessageGuildAction } from "@services/commandAdapters.ts";

export default addMsgCommand({
  name: "pause",
  mod: "music",
  description: "暫停歌曲",
  aliases: [],
  run: (bot, message) =>
    runMessageGuildAction(
      bot,
      message,
      (bot, guildId) => pauseMusic(bot, guildId),
    ),
});
