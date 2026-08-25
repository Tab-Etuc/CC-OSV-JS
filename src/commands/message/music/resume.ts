import { addMsgCommand } from "@classes/command.ts";
import { resumeMusic } from "@services/musicCommands.ts";
import { runMessageGuildAction } from "@services/commandAdapters.ts";

export default addMsgCommand({
  name: "resume",
  mod: "music",
  description: "恢復播放",
  aliases: ["r"],
  run: (bot, message) =>
    runMessageGuildAction(
      bot,
      message,
      (bot, guildId) => resumeMusic(bot, guildId),
    ),
});
