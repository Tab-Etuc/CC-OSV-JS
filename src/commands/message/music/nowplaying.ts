import { addMsgCommand } from "@classes/command.ts";
import { nowPlayingResponse } from "@services/musicCommands.ts";
import { runMessageGuildAction } from "@services/commandAdapters.ts";

export default addMsgCommand({
  name: "nowplaying",
  mod: "music",
  description: "顯示目前播放的歌曲",
  aliases: ["np"],
  run: (bot, message) =>
    runMessageGuildAction(
      bot,
      message,
      (bot, guildId) => nowPlayingResponse(bot, guildId),
    ),
});
