import { addMsgCommand } from "@classes/command.ts";
import { CCOSVEmbed } from "@classes/embed.ts";
import { send } from "@utils/send.ts";
import { resolveUser } from "@utils/discord.ts";
import { getWarnings } from "@services/moderation.ts";

export default addMsgCommand({
  name: "warnings",
  mod: "moderation",
  description: "查看使用者警告紀錄",
  aliases: ["warns", "infractions"],
  permission: ["MANAGE_MESSAGES"],
  usage: "[@使用者]",
  run: async (bot, message, args) => {
    if (!message.guildId) return;
    const target = await resolveUser(bot, args[0], message.author);
    if (!target) {
      await send(bot, message.channelId, "找不到這位使用者。");
      return;
    }
    try {
      const rows = await getWarnings(message.guildId, target.id);
      const description = rows.length
        ? rows.map((row, index) =>
          `${index + 1}. **${row.WarningId.slice(0, 8)}** · <t:${
            Math.floor(row.CreatedAt / 1000)
          }:R> · ${row.Reason}\n由 <@${row.ModeratorId}> 記錄`
        ).join("\n")
        : "沒有警告紀錄。";
      await send(
        bot,
        message.channelId,
        new CCOSVEmbed().setTitle(`<@${target.id}> 的警告紀錄`).setDesc(
          description,
        ).build(),
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
