import { config, discordeno } from "@deps";
import { addMsgCommand, CCOSVMsgCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { CCOSVEmbed } from "@classes/embed.ts";
import { avatarURL } from "@utils/avatarURL.ts";
import { uptime } from "@utils/uptime.ts";
import { BotClient } from "@base/CC-OSV-Client.ts";

class BotInfo extends CCOSVMsgCommand {
  constructor() {
    super("botinfo", "info", {
      aliases: ["clientinfo", "bot"],
      description: "Information about this bot with some stats",
    });
  }

  private bytesToMB(bytes: number): string {
    const kb = bytes / 1024;
    const mb = kb / 1024;
    return mb.toFixed(0) + " MB";
  }

  override async run(
    bot: BotClient,
    message: discordeno.Message,
    _args: string[],
  ): Promise<void> {
    const discordeno_version = bot.constants.DISCORDENO_VERSION;
    const deno_version = Deno.version;
    const user = bot?.users?.get(bot.id) ||
      await bot.helpers.getUser(bot.id);
    if (!user) throw new Error("what.");

    const memory = Deno.memoryUsage();
    const sMemory = `**RSS:** ${this.bytesToMB(memory.rss)}\n**External:** ${
      this.bytesToMB(memory.external)
    }\n**Heap Total:** ${this.bytesToMB(memory.heapTotal)}\n**Heap Used** ${
      this.bytesToMB(memory.heapUsed)
    }`;

    const up = uptime();

    const em = new CCOSVEmbed()
      .setTitle("Information about the bot")
      .setDesc(config.description)
      .addField("Runtime", `Deno v${deno_version.deno}`, true)
      .addField("Language", `TypeScript v${deno_version.typescript}`, true)
      .addField("Library", `Discordeno v${discordeno_version}`, true)
      .addField("Memory", sMemory, true)
      .addField("Uptime", up, true)
      .setThumb(await avatarURL(bot, user))
      .build();
    send(bot, message.channelId, em);
  }
}

addMsgCommand(new BotInfo());
