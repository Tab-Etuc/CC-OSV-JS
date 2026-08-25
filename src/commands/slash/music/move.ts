import { addSlashCommand } from "@classes/command.ts";
import { moveMusic } from "@services/musicCommands.ts";
import { runSlashGuildAction, slashOption } from "@services/commandAdapters.ts";

export default addSlashCommand({
  name: "move",
  description: "移動待播歌曲的位置",
  options: [{
    name: "from",
    type: 4,
    required: true,
    description: "原位置",
  }, {
    name: "to",
    type: 4,
    required: true,
    description: "新位置",
  }],
  run: (bot, interaction) =>
    runSlashGuildAction(bot, interaction, (bot, guildId) =>
      moveMusic(
        bot,
        guildId,
        slashOption(interaction, "from"),
        slashOption(interaction, "to", 1),
      )),
});
