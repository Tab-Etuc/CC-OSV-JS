import { addSlashCommand } from "@classes/command.ts";
import { clearMusic } from "@services/musicCommands.ts";
import { runSlashGuildAction } from "@services/commandAdapters.ts";

export default addSlashCommand({
  name: "clearqueue",
  description: "清除所有待播歌曲",
  run: (bot, interaction) =>
    runSlashGuildAction(
      bot,
      interaction,
      (bot, guildId) => clearMusic(bot, guildId),
    ),
});
