import { discordeno } from "@deps";
import { addMsgCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { Reddit } from "@classes/reddit.ts";

export default addMsgCommand({
  name: "reddit",
  mod: "reddit",
  description: "取得指定 subreddit 的隨機貼文",
  aliases: [],
  usage: "<subreddit>",
  requiredArgs: true,
  run: async (bot, message, args) => {
    const subreddit = args[0];
    if (!subreddit) return;
    const reddit = new Reddit(subreddit);

    try {
      const data = await reddit.toData();
      const channel = bot.channels.get(message.channelId) ??
        await bot.helpers.getChannel(
          message.channelId,
        ) as unknown as discordeno.Channel;
      if (!channel?.nsfw && data.over_18) {
        await send(
          bot,
          message.channelId,
          "此貼文標記為 NSFW，請在 NSFW 頻道中使用。",
        );
        return;
      }
      await send(bot, message.channelId, await reddit.toEmbed(false, true));
    } catch (error) {
      const text = error instanceof Error
        ? error.message
        : "讀取 subreddit 失敗。";
      await send(bot, message.channelId, text);
    }
  },
});
