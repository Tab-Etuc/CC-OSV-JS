import { discordeno } from "@deps";
import { addMsgCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { Reddit } from "@classes/reddit.ts";
import { BotClient } from "@base/CC-OSV-Client.ts";

export default addMsgCommand({
  name: "reddit",
  mod: "music",
  description: "Get random post from specific subreddit",
  aliases: [],
  usage: "<subreddit>",
  run: async (bot, message, args) => {
    let reddit: Reddit | undefined;
    async function checkSafety(
      bot: BotClient,
      message: discordeno.Message,
    ): Promise<boolean> {
      if (!reddit) throw new Error("what.");

      const data = await reddit.toData();
      const channel = bot.channels.get(message.channelId) ??
        await bot.helpers.getChannel(message.channelId);
      return !(!channel?.nsfw && data.over_18);
    }
    if (!args[0]) {
      return send(
        bot,
        message.channelId,
        "Please type which subreddit do you want to look for",
      ) as unknown as void;
    }
    reddit = new Reddit(args[0]);
    const safe = await checkSafety(bot, message).catch(() => {
      return send(
        bot,
        message.channelId,
        "that subreddit not exist",
      ) as unknown as void;
    });
    if (!safe) {
      return send(
        bot,
        message.channelId,
        "The post you're looking for marked as NSFW. Try again",
      ) as unknown as void;
    }
    send(bot, message.channelId, await reddit.toEmbed(false, true));
  },
});
