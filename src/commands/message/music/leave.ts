import { addMsgCommand } from "@classes/command.ts";
import { leaveMusic } from "@services/musicCommands.ts";
import { runMessageGuildAction } from "@services/commandAdapters.ts";

export default addMsgCommand({
  name: "leave",
  mod: "music",
  description: "離開語音頻道",
  aliases: [],
  run: (bot, message) =>
    runMessageGuildAction(
      bot,
      message,
      (bot, guildId) => leaveMusic(bot, guildId),
    ),
});
