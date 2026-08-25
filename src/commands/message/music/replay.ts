import { addMsgCommand } from "@classes/command.ts";
import { replayMusic } from "@services/musicCommands.ts";
import { runMessageGuildAction } from "@services/commandAdapters.ts";

export default addMsgCommand({
  name: "replay",
  mod: "music",
  description: "從頭播放目前歌曲",
  aliases: ["restart"],
  run: (bot, message) =>
    runMessageGuildAction(
      bot,
      message,
      (bot, guildId) => replayMusic(bot, guildId),
    ),
});
