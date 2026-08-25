import { addSlashCommand } from "@classes/command.ts";
import { joinResponse } from "@services/commandResponses.ts";
import {
  interactionUserId,
  runSlashGuildAction,
} from "@services/commandAdapters.ts";

export default addSlashCommand({
  name: "join",
  description: "加入語音頻道",
  nameLocalizations: { "zh-TW": "加入頻道" },
  descriptionLocalizations: { "zh-TW": "加入你所在的語音頻道" },
  run: (bot, interaction) => {
    const userId = interactionUserId(interaction);
    if (!userId) return;
    return runSlashGuildAction(
      bot,
      interaction,
      (bot, guildId) => joinResponse(bot, guildId, userId),
    );
  },
});
