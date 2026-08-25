import { addMsgCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { removeWarning } from "@services/moderation.ts";

export default addMsgCommand({
  name: "unwarn",
  mod: "moderation",
  description: "移除警告紀錄",
  aliases: ["delwarn", "clearwarn"],
  permission: ["MANAGE_MESSAGES"],
  requiredArgs: true,
  usage: "<案件 ID>",
  run: async (bot, message, args) => {
    if (!message.guildId) return;
    try {
      const removed = await removeWarning(message.guildId, args[0] ?? "");
      await send(
        bot,
        message.channelId,
        removed ? "警告已移除。" : "找不到這個案件 ID。",
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
