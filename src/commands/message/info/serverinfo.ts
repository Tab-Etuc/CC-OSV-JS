import { addMsgCommand } from "@classes/command.ts";
import { CCOSVEmbed } from "@classes/embed.ts";
import { send } from "@utils/send.ts";

export default addMsgCommand({
  name: "serverinfo",
  mod: "info",
  description: "顯示目前伺服器資訊",
  aliases: ["server", "guildinfo"],
  run: async (bot, message) => {
    if (!message.guildId) {
      await send(bot, message.channelId, "此指令只能在伺服器中使用。");
      return;
    }
    const guild = bot.guilds.get(message.guildId);
    if (!guild) {
      await send(
        bot,
        message.channelId,
        "目前還沒有伺服器快取資料。請稍後再試。",
      );
      return;
    }
    const icon = guild.icon
      ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=256`
      : undefined;
    const embed = new CCOSVEmbed()
      .setTitle(guild.name)
      .setDesc(`伺服器 ID：${guild.id}`)
      .addField(
        "成員",
        `${guild.memberCount ?? guild.members?.size ?? "未知"}`,
        true,
      )
      .addField("頻道", `${guild.channels?.size ?? "未知"}`, true)
      .addField("擁有者", guild.ownerId ? `<@${guild.ownerId}>` : "未知", true)
      .addField(
        "建立時間",
        new Date(Number((guild.id >> 22n) + 1420070400000n)).toLocaleString(
          "zh-TW",
        ),
        true,
      );
    if (icon) embed.setThumb(icon);
    await send(bot, message.channelId, embed.build());
  },
});
