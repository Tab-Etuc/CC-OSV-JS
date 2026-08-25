import { addMsgCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { resolveUser, userName } from "@utils/discord.ts";
import { balanceResponse } from "@services/commandResponses.ts";

export default addMsgCommand({
  name: "balance",
  mod: "economy",
  description: "查看錢包與銀行餘額",
  aliases: ["bal", "money"],
  usage: "[@使用者]",
  run: async (bot, message, args) => {
    if (!message.guildId) return;
    const target = await resolveUser(bot, args[0], message.author);
    if (!target) {
      await send(bot, message.channelId, "找不到這位使用者。");
      return;
    }
    await send(
      bot,
      message.channelId,
      await balanceResponse(message.guildId, target.id, userName(target)),
    );
  },
});
