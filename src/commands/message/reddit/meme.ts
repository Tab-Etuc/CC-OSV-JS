import { discordeno } from "@deps";
import { addMsgCommand, CCOSVMsgCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { Reddit } from "@classes/reddit.ts";
import { main } from "@utils/log.ts";
import { BotClient } from "@base/CC-OSV-Client.ts";

class Meme extends CCOSVMsgCommand {
  private readonly subredditMeme: string[];

  constructor() {
    super("meme", "reddit", {
      description: "Get random memes",
    });
    this.subredditMeme = ["dankmemes", "meme", "memes"];
  }

  override async run(
    bot: BotClient,
    message: discordeno.Message,
    _: string[],
  ): Promise<void> {
    try {
      const subPick = this
        .subredditMeme[Math.floor(Math.random() * this.subredditMeme.length)];
      const reddit = new Reddit(subPick, "hot");
      const e = await reddit.toEmbed(true);
      send(bot, message.channelId, e);
    } catch (e) {
      main.error(e);
    }
  }
}

addMsgCommand(new Meme());
