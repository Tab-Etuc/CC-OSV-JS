import { addMsgCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { cancelReminder } from "@services/reminders.ts";

export default addMsgCommand({
  name: "remindcancel",
  mod: "utils",
  description: "取消自己的提醒",
  aliases: ["cancelremind"],
  requiredArgs: true,
  usage: "<提醒 ID>",
  run: async (bot, message, args) => {
    await send(
      bot,
      message.channelId,
      cancelReminder(message.author.id, args[0] ?? "")
        ? "提醒已取消。"
        : "找不到這個提醒，或它不屬於你。",
    );
  },
});
