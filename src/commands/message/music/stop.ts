import { addMsgCommand } from "@classes/command.ts";
import { stopMusic } from "@services/musicCommands.ts";
import { runMessageGuildAction } from "@services/commandAdapters.ts";

export default addMsgCommand({
  name: "stop",
  mod: "music",
  description: "停止播放、清空佇列並離開語音頻道",
  aliases: ["disconnect", "dc"],
  run: (bot, message) =>
    runMessageGuildAction(
      bot,
      message,
      (bot, guildId) => stopMusic(bot, guildId),
    ),
});
