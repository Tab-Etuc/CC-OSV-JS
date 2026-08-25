import { addMsgCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { parseDuration } from "@services/reminders.ts";
import { reminderResponse } from "@services/commandResponses.ts";

export default addMsgCommand({
  name: "remind",
  mod: "utils",
  description: "設定提醒（最長 7 天）",
  aliases: ["reminder", "提醒"],
  requiredArgs: true,
  usage: "<10m|2h|1d> <提醒內容>",
  run: async (bot, message, args) => {
    const delay = parseDuration(args[0] ?? "");
    const text = args.slice(1).join(" ").trim();
    if (!delay || !text) {
      await send(
        bot,
        message.channelId,
        "格式：Bremind 10m 記得休息（時間上限 7 天）。",
      );
      return;
    }
    await send(
      bot,
      message.channelId,
      reminderResponse(
        bot,
        message.channelId,
        message.author.id,
        delay,
        text,
      ),
    );
  },
});
