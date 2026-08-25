import { addMsgCommand } from "@classes/command.ts";
import { seekMusic } from "@services/musicCommands.ts";
import { runMessageGuildAction } from "@services/commandAdapters.ts";

export default addMsgCommand({
  name: "seek",
  mod: "music",
  description: "跳轉到歌曲指定時間",
  aliases: ["jump"],
  requiredArgs: true,
  usage: "<秒數|mm:ss|hh:mm:ss|1h2m3s>",
  run: (bot, message, args) =>
    runMessageGuildAction(
      bot,
      message,
      (bot, guildId) => seekMusic(bot, guildId, args[0] ?? ""),
    ),
});
