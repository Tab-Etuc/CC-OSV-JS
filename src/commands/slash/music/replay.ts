import { addSlashCommand } from "@classes/command.ts";
import { replayMusic } from "@services/musicCommands.ts";
import { runSlashGuildAction } from "@services/commandAdapters.ts";

export default addSlashCommand({
  name: "replay",
  description: "從頭播放目前歌曲",
  run: (bot, interaction) =>
    runSlashGuildAction(
      bot,
      interaction,
      (bot, guildId) => replayMusic(bot, guildId),
    ),
});
