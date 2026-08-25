import { addMsgCommand } from "@classes/command.ts";
import { joinResponse } from "@services/commandResponses.ts";
import { runMessageGuildAction } from "@services/commandAdapters.ts";

export default addMsgCommand({
  name: "join",
  mod: "music",
  description: "加入語音頻道",
  aliases: ["j"],
  run: (bot, message) =>
    runMessageGuildAction(
      bot,
      message,
      (bot, guildId) => joinResponse(bot, guildId, message.author.id),
    ),
});
