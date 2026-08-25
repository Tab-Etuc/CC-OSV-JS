import { addMsgCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { parseUserId, resolveUser } from "@utils/discord.ts";
import { addWarning } from "@services/moderation.ts";

export default addMsgCommand({
  name: "warn",
  mod: "moderation",
  description: "記錄使用者警告",
  aliases: ["warning"],
  permission: ["MANAGE_MESSAGES"],
  requiredArgs: true,
  usage: "<@使用者> <原因>",
  run: async (bot, message, args) => {
    if (!message.guildId || !args[0] || !args[1]) {
      await send(bot, message.channelId, "請提供使用者與警告原因。");
      return;
    }
    const targetId = parseUserId(args[0]);
    const target = await resolveUser(bot, args[0]);
    if (
      !targetId || !target || targetId === bot.id ||
      targetId === message.author.id
    ) {
      await send(
        bot,
        message.channelId,
        "請提供有效且不是機器人/自己的使用者。",
      );
      return;
    }
    try {
      const record = await addWarning(
        message.guildId,
        targetId,
        message.author.id,
        args.slice(1).join(" "),
      );
      await send(
        bot,
        message.channelId,
        `已記錄 <@${targetId}> 的警告，案件 ID：${
          record.WarningId.slice(0, 8)
        }。`,
      );
    } catch (error) {
      await send(
        bot,
        message.channelId,
        error instanceof Error ? error.message : "警告功能目前無法使用。",
      );
    }
  },
});
