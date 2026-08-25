import { addSlashCommand } from "@classes/command.ts";
import { stopMusic } from "@services/musicCommands.ts";
import { runSlashGuildAction } from "@services/commandAdapters.ts";

export default addSlashCommand({
  name: "stop",
  description: "停止播放、清空佇列並離開語音頻道",
  run: (bot, interaction) =>
    runSlashGuildAction(
      bot,
      interaction,
      (bot, guildId) => stopMusic(bot, guildId),
    ),
});
