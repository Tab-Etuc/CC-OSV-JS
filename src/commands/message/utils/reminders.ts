import { addMsgCommand } from "@classes/command.ts";
import { CCOSVEmbed } from "@classes/embed.ts";
import { send } from "@utils/send.ts";
import { formatDuration, listReminders } from "@services/reminders.ts";

export default addMsgCommand({
  name: "reminders",
  mod: "utils",
  description: "查看自己的提醒",
  aliases: ["myreminders"],
  run: async (bot, message) => {
    const items = listReminders(message.author.id);
    const description = items.length
      ? items.map((item) =>
        `**${item.id}** · ${
          formatDuration(item.dueAt - Date.now())
        }後 · ${item.text}`
      ).join("\n")
      : "目前沒有待處理的提醒。";
    await send(
      bot,
      message.channelId,
      new CCOSVEmbed().setTitle("我的提醒").setDesc(description).build(),
    );
  },
});
