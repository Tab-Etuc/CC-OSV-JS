import { discordeno } from "@deps";
import { addMsgCommand, CCOSVMsgCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { CCOSVEmbed } from "@classes/embed.ts";
import { isIP } from "https://deno.land/x/isIP@1.0.0/mod.ts";
import { BotClient } from "@base/CC-OSV-Client.ts";

class IP extends CCOSVMsgCommand {
  constructor() {
    super("ip", "fun", {
      description: "Get some information about specific IP",
      usage: "<IP>",
    });
  }

  override async run(
    bot: BotClient,
    message: discordeno.Message,
    args: string[],
  ) {
    if (!args[0]) return send(bot, message.channelId, "Give me the IP.");
    if (isIP(args[0]) == 0) {
      return send(bot, message.channelId, "That's not an IP");
    }
    const jj = await fetch(`https://ipinfo.io/${args[0]}/geo`);
    const info = await jj.json();
    const e = new CCOSVEmbed()
      .setTitle(`IP: ${info.ip}`)
      .setDesc(
        `City: ${info.city}\nRegion: ${info.region}\nCountry: ${info.country}\nLocation: ${info.loc}\nTimezone: ${info.timezone}\nPostal: ${info.postal}`,
      );
    send(bot, message.channelId, e.build());
  }
}

addMsgCommand(new IP());
