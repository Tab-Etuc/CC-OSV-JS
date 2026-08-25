import { addSlashCommand } from "@classes/command.ts";
import { removeMusic } from "@services/musicCommands.ts";
import { runSlashGuildAction, slashOption } from "@services/commandAdapters.ts";

export default addSlashCommand({
  name: "remove",
  description: "移除佇列中的歌曲",
  options: [{
    name: "position",
    type: 4,
    required: true,
    description: "待播位置",
  }],
  run: (bot, interaction) =>
    runSlashGuildAction(
      bot,
      interaction,
      (bot, guildId) =>
        removeMusic(bot, guildId, slashOption(interaction, "position")),
    ),
});
