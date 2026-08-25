import { addMsgCommand } from "@classes/command.ts";
import { shuffleMusic } from "@services/musicCommands.ts";
import { runMessageGuildAction } from "@services/commandAdapters.ts";

export default addMsgCommand({
  name: "shuffle",
  mod: "music",
  description: "隨機排列待播歌曲",
  aliases: ["shuf"],
  run: (bot, message) =>
    runMessageGuildAction(
      bot,
      message,
      (bot, guildId) => shuffleMusic(bot, guildId),
    ),
});
