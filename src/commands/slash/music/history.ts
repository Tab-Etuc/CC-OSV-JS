import { addSlashCommand } from "@classes/command.ts";
import { historyMusic } from "@services/musicCommands.ts";
import { runSlashGuildAction } from "@services/commandAdapters.ts";

export default addSlashCommand({
  name: "history",
  description: "查看最近播放過的歌曲",
  run: (bot, interaction) =>
    runSlashGuildAction(
      bot,
      interaction,
      (bot, guildId) => historyMusic(bot, guildId),
    ),
});
