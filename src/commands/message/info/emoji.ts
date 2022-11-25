import { discordeno } from "@deps";
import { addMsgCommand, CCOSVMsgCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { BotClient } from "@base/CC-OSV-Client.ts";

class Emoji extends CCOSVMsgCommand {
  constructor() {
    super("emoji", "info", {
      aliases: ["e", "emote"],
      description: "Display emoji as image",
    });
  }

  override run(
    bot: BotClient,
    message: discordeno.Message,
    args: string[],
  ) {
    const arg = args[0];
    if (!arg) {
      return send(
        bot,
        message.channelId,
        "Please use `;emoji <Discord Emoji>`",
      );
    }
    if (!arg.startsWith("<")) {
      return send(bot, message.channelId, "Only Discord Emojis can input");
    }
    let animated = false;
    if (arg.startsWith("<a:")) {
      animated = true;
    }
    const a = arg.replace(animated ? "<a:" : "<:", "");
    const c = a.replace(">", "");
    const [_name, id] = c.split(":");
    const url = `https://cdn.discordapp.com/emojis/${id}.${
      animated ? "gif" : "png"
    }`;
    return send(bot, message.channelId, url);
  }
}

addMsgCommand(new Emoji());
