import { addSlashCommand } from "@classes/command.ts";
import { leaveMusic } from "@services/musicCommands.ts";
import { runSlashGuildAction } from "@services/commandAdapters.ts";

export default addSlashCommand({
  name: "leave",
  description: "離開語音頻道",
  nameLocalizations: { "zh-TW": "離開頻道" },
  descriptionLocalizations: { "zh-TW": "離開目前的語音頻道" },
  run: (bot, interaction) =>
    runSlashGuildAction(
      bot,
      interaction,
      (bot, guildId) => leaveMusic(bot, guildId),
    ),
});
