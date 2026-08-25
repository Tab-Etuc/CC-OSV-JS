import { addMsgCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { dailyResponse } from "@services/commandResponses.ts";

export default addMsgCommand({
  name: "daily",
  mod: "economy",
  description: "領取每日獎勵",
  aliases: ["dailycoin", "claim"],
  run: async (bot, message) => {
    if (!message.guildId) return;
    await send(
      bot,
      message.channelId,
      await dailyResponse(message.guildId, message.author.id),
    );
  },
});
