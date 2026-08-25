import { addSlashCommand } from "@classes/command.ts";
import { setMusicVolume } from "@services/musicCommands.ts";
import { runSlashGuildAction, slashOption } from "@services/commandAdapters.ts";

export default addSlashCommand({
  name: "volume",
  description: "調整音量",
  nameLocalizations: { "zh-TW": "調整音量" },
  descriptionLocalizations: { "zh-TW": "將音量調整為 0 到 1000" },
  options: [{
    name: "value",
    type: 4,
    required: true,
    description: "音量數值",
    nameLocalizations: { "zh-TW": "數值" },
  }],
  run: (bot, interaction) =>
    runSlashGuildAction(
      bot,
      interaction,
      (bot, guildId) =>
        setMusicVolume(bot, guildId, slashOption(interaction, "value")),
    ),
});
