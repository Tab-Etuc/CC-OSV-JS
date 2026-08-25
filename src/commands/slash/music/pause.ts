import { addSlashCommand } from "@classes/command.ts";
import { pauseMusic } from "@services/musicCommands.ts";
import { runSlashGuildAction } from "@services/commandAdapters.ts";

export default addSlashCommand({
  name: "pause",
  description: "暫停歌曲",
  nameLocalizations: { "zh-TW": "暫停播放" },
  descriptionLocalizations: { "zh-TW": "暫停目前正在播放的歌曲" },
  run: (bot, interaction) =>
    runSlashGuildAction(
      bot,
      interaction,
      (bot, guildId) => pauseMusic(bot, guildId),
    ),
});
