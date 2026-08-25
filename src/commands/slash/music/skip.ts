import { addSlashCommand } from "@classes/command.ts";
import { skipCurrentMusic } from "@services/musicCommands.ts";
import { runSlashGuildAction } from "@services/commandAdapters.ts";

export default addSlashCommand({
  name: "skip",
  description: "跳過目前歌曲",
  nameLocalizations: { "zh-TW": "跳過歌曲" },
  descriptionLocalizations: { "zh-TW": "跳過目前正在播放的歌曲" },
  run: (bot, interaction) =>
    runSlashGuildAction(
      bot,
      interaction,
      (bot, guildId) => skipCurrentMusic(bot, guildId),
    ),
});
