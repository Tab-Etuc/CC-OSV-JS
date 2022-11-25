import { discordeno } from "@deps";
import { addMsgCommand, CCOSVMsgCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { uptime } from "@utils/uptime.ts";
import { BotClient } from "@base/CC-OSV-Client.ts";

class Uptime extends CCOSVMsgCommand {
  constructor() {
    super("uptime", "info", {
      description: "Show how long has the bot been running for",
    });
  }

  override run(
    bot: BotClient,
    message: discordeno.Message,
    _: string[],
  ) {
    const up = uptime();
    return send(bot, message.channelId, up);
  }
}

addMsgCommand(new Uptime());
