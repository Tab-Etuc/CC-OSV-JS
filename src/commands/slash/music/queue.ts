import { addSlashCommand } from "@classes/command.ts";
import { queueMusic } from "@services/musicCommands.ts";
import { runSlashGuildAction, slashOption } from "@services/commandAdapters.ts";

export default addSlashCommand({
  name: "queue",
  description: "查看目前播放佇列",
  options: [{
    name: "page",
    type: 4,
    required: false,
    description: "頁數",
  }],
  run: (bot, interaction) =>
    runSlashGuildAction(
      bot,
      interaction,
      (bot, guildId) =>
        queueMusic(bot, guildId, Number(slashOption(interaction, "page") || 1)),
    ),
});
