import { addSlashCommand } from "@classes/command.ts";
import { resumeMusic } from "@services/musicCommands.ts";
import { runSlashGuildAction } from "@services/commandAdapters.ts";

export default addSlashCommand({
  name: "resume",
  description: "恢復播放",
  nameLocalizations: { "zh-TW": "恢復播放" },
  descriptionLocalizations: { "zh-TW": "恢復目前歌曲的播放" },
  run: (bot, interaction) =>
    runSlashGuildAction(
      bot,
      interaction,
      (bot, guildId) => resumeMusic(bot, guildId),
    ),
});
