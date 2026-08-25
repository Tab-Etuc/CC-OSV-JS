import { addMsgCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { leaderboardResponse } from "@services/commandResponses.ts";

export default addMsgCommand({
  name: "leaderboard",
  mod: "info",
  description: "顯示等級或財富排行榜",
  aliases: ["lb", "top"],
  usage: "[level|economy]",
  run: async (bot, message, args) => {
    if (!message.guildId) return;
    const economy = ["economy", "coins", "money"].includes(
      (args[0] ?? "").toLowerCase(),
    );
    await send(
      bot,
      message.channelId,
      await leaderboardResponse(bot, message.guildId, economy),
    );
  },
});
