import { addSlashCommand } from "@classes/command.ts";
import { setMusicLoop } from "@services/musicCommands.ts";
import { runSlashGuildAction, slashOption } from "@services/commandAdapters.ts";

export default addSlashCommand({
  name: "loop",
  description: "切換單曲或整個佇列循環",
  nameLocalizations: { "zh-TW": "循環播放" },
  descriptionLocalizations: { "zh-TW": "重複播放目前歌曲" },
  options: [{
    name: "mode",
    type: 3,
    required: false,
    description: "off、track 或 queue",
    nameLocalizations: { "zh-TW": "模式" },
    descriptionLocalizations: { "zh-TW": "關閉、單曲或整個佇列" },
  }],
  run: (bot, interaction) =>
    runSlashGuildAction(
      bot,
      interaction,
      (bot, guildId) =>
        setMusicLoop(bot, guildId, slashOption(interaction, "mode")),
    ),
});
