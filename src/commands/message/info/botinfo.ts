import { config } from "@deps";
import { addMsgCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { CCOSVEmbed } from "@classes/embed.ts";
import { avatarURL } from "@utils/avatarURL.ts";
import { uptime } from "@utils/uptime.ts";

export default addMsgCommand({
  name: "botinfo",
  mod: "info",
  description: "Information about this bot with some stats",
  aliases: ["clientinfo", "bot"],
  run: async (bot, message, _args) => {
    function bytesToMB(bytes: number): string {
      const kb = bytes / 1024;
      const mb = kb / 1024;
      return mb.toFixed(0) + " MB";
    }
    const discordeno_version = bot.constants.DISCORDENO_VERSION;
    const deno_version = Deno.version;
    const user = bot?.users?.get(bot.id) ||
      await bot.helpers.getUser(bot.id);
    if (!user) throw new Error("what.");

    const memory = Deno.memoryUsage();
    const sMemory = `**RSS:** ${bytesToMB(memory.rss)}\n**External:** ${
      bytesToMB(memory.external)
    }\n**Heap Total:** ${bytesToMB(memory.heapTotal)}\n**Heap Used** ${
      bytesToMB(memory.heapUsed)
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
  },
});
