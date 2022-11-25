import { discordeno } from "@deps";
import { addMsgCommand, CCOSVMsgCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { Reddit } from "@classes/reddit.ts";
import { BotClient } from "@base/CC-OSV-Client.ts";

class RedditCmd extends CCOSVMsgCommand {
  private reddit: Reddit | undefined;

  constructor() {
    super("reddit", "reddit", {
      aliases: ["r"],
      description: "Get random post from specific subreddit",
      usage: "<subreddit>",
    });
  }

  // filter explict results
  private async checkSafety(
    bot: BotClient,
    message: discordeno.Message,
  ): Promise<boolean> {
    if (!this.reddit) throw new Error("what.");

    const data = await this.reddit.toData();
    const channel = bot.channels.get(message.channelId) ??
      await bot.helpers.getChannel(message.channelId);
    return !(!channel?.nsfw && data.over_18);
  }

  override async run(
    bot: BotClient,
    message: discordeno.Message,
    args: string[],
  ): Promise<void> {
    if (!args[0]) {
      return send(
        bot,
        message.channelId,
        "Please type which subreddit do you want to look for",
      ) as unknown as void;
    }
    this.reddit = new Reddit(args[0]);
    const safe = await this.checkSafety(bot, message).catch(() => {
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
    send(bot, message.channelId, await this.reddit.toEmbed(false, true));
  }
}

addMsgCommand(new RedditCmd());
