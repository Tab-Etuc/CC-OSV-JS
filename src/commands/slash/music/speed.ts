import { addSlashCommand } from "@classes/command.ts";
import { setPlaybackSpeed } from "@services/musicCommands.ts";
import { runSlashGuildAction, slashOption } from "@services/commandAdapters.ts";

export default addSlashCommand({
  name: "speed",
  description: "調整播放速度",
  options: [{
    name: "rate",
    type: 10,
    required: true,
    description: "0.5 到 2",
  }],
  run: (bot, interaction) =>
    runSlashGuildAction(
      bot,
      interaction,
      (bot, guildId) =>
        setPlaybackSpeed(bot, guildId, slashOption(interaction, "rate")),
    ),
});
