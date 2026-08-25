import { addMsgCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { parseUserId, resolveUser } from "@utils/discord.ts";
import { formatCoins, transferCoins } from "@services/economy.ts";

export default addMsgCommand({
  name: "pay",
  mod: "economy",
  description: "轉帳 coins 給其他使用者",
  aliases: ["give", "transfer"],
  requiredArgs: true,
  usage: "<@使用者> <金額>",
  run: async (bot, message, args) => {
    if (!message.guildId || !args[0] || !args[1]) {
      await send(bot, message.channelId, "請提供收款人與金額。");
      return;
    }
    const targetId = parseUserId(args[0]);
    const amount = Number(args[1]);
    const target = await resolveUser(bot, args[0]);
    if (!targetId || !target || !Number.isSafeInteger(amount) || amount <= 0) {
      await send(bot, message.channelId, "請提供有效的使用者與正整數金額。");
      return;
    }
    try {
      const success = await transferCoins(
        message.guildId,
        message.author.id,
        targetId,
        amount,
      );
      await send(
        bot,
        message.channelId,
        success
          ? `已轉給 ${target.globalName ?? target.username} ${
            formatCoins(amount)
          }。`
          : "轉帳失敗，可能是餘額不足或不能轉給自己。",
      );
    } catch (error) {
      await send(
        bot,
        message.channelId,
        error instanceof Error ? error.message : "轉帳目前無法使用。",
      );
    }
  },
});
