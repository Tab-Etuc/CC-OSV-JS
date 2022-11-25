import { discordeno } from "@deps";
import { addMsgCommand, CCOSVMsgCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { BotClient } from "@base/CC-OSV-Client.ts";

class Ping extends CCOSVMsgCommand {
  constructor() {
    super("ping", "utils", {
      aliases: ["pong"],
      description: "Check if the bot responses",
    });
  }

  override run(
    bot: BotClient,
    message: discordeno.Message,
    _args: string[],
  ): void {
    send(
      bot,
      message.channelId,
      `Pong! ${Date.now() - message.timestamp}ms`,
    );
  }
}

addMsgCommand(new Ping());
