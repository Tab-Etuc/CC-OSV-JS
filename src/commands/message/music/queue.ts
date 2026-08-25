import { addMsgCommand } from "@classes/command.ts";
import { queueMusic } from "@services/musicCommands.ts";
import { runMessageGuildAction } from "@services/commandAdapters.ts";

export default addMsgCommand({
  name: "queue",
  mod: "music",
  description: "查看目前播放佇列",
  aliases: ["q"],
  usage: "[頁數]",
  run: (bot, message, args) =>
    runMessageGuildAction(
      bot,
      message,
      (bot, guildId) => queueMusic(bot, guildId, Number(args[0] ?? "1")),
    ),
});
