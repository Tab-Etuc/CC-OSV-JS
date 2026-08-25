import { addSlashCommand } from "@classes/command.ts";
import { shuffleMusic } from "@services/musicCommands.ts";
import { runSlashGuildAction } from "@services/commandAdapters.ts";

export default addSlashCommand({
  name: "shuffle",
  description: "隨機排列待播歌曲",
  run: (bot, interaction) =>
    runSlashGuildAction(
      bot,
      interaction,
      (bot, guildId) => shuffleMusic(bot, guildId),
    ),
});
