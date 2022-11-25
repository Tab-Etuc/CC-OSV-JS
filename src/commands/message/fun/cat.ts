import { discordeno } from "@deps";
import { BotClient } from "@base/CC-OSV-Client.ts";
import { addMsgCommand, CCOSVMsgCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";

class Cat extends CCOSVMsgCommand {
  constructor() {
    super("cat", "fun", {
      aliases: ["kitty"],
      description: "meow meow",
    });
  }

  override run(
    bot: BotClient,
    message: discordeno.Message,
    _args: string[],
  ): void {
    fetch("https://aws.random.cat/meow").then(async (r) => {
      const j = await r.json();
      send(bot, message.channelId, j.file);
    });
  }
}

addMsgCommand(new Cat());
