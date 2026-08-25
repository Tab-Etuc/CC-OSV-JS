import { config, discordeno } from "@deps";
import { addMsgCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { CCOSVEmbed } from "@classes/embed.ts";
import { avatarURL } from "@utils/avatarURL.ts";
import { uptime } from "@utils/uptime.ts";

export default addMsgCommand({
  name: "botinfo",
  mod: "info",
  description: "顯示機器人資訊",
  aliases: ["clientinfo", "bot"],
  run: async (bot, message) => {
    const toMb = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(0)} MB`;
    const user = bot.users.get(bot.id) ??
      (await bot.helpers.getUser(bot.id) as unknown as
        | discordeno.User
        | undefined);
    if (!user) {
      await send(bot, message.channelId, "無法取得機器人資訊。");
      return;
    }
    const memory = Deno.memoryUsage();
    const memoryText = `RSS：${toMb(memory.rss)}\nExternal：${
      toMb(memory.external)
    }\nHeap：${toMb(memory.heapUsed)}`;
    const embed = new CCOSVEmbed()
      .setTitle("機器人資訊")
      .setDesc(config.description)
      .addField("執行環境", `Deno v${Deno.version.deno}`, true)
      .addField("語言", `TypeScript v${Deno.version.typescript}`, true)
      .addField("函式庫", `Discordeno v${bot.discordenoVersion}`, true)
      .addField("記憶體", memoryText, true)
      .addField("運作時間", uptime(), true)
      .setThumb(await avatarURL(bot, user));
    await send(bot, message.channelId, embed.build());
  },
});
