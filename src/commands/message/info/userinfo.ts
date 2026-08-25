import { addMsgCommand } from "@classes/command.ts";
import { CCOSVEmbed } from "@classes/embed.ts";
import { send } from "@utils/send.ts";
import { avatarURL } from "@utils/avatarURL.ts";
import { resolveUser, userName } from "@utils/discord.ts";

export default addMsgCommand({
  name: "userinfo",
  mod: "info",
  description: "顯示使用者資訊",
  aliases: ["user", "whois"],
  usage: "[@使用者]",
  run: async (bot, message, args) => {
    const user = await resolveUser(bot, args[0], message.author);
    if (!user) {
      await send(
        bot,
        message.channelId,
        "找不到這位使用者，請使用 @提及或使用者 ID。",
      );
      return;
    }
    const member = message.guildId
      ? bot.guilds.get(message.guildId)?.members?.get(user.id)
      : undefined;
    const embed = new CCOSVEmbed()
      .setTitle(`使用者資訊：${userName(user)}`)
      .setDesc(`使用者 ID：${user.id}`)
      .addField("帳號", user.bot ? "Bot" : "一般使用者", true)
      .addField("伺服器暱稱", member?.nick ?? "無", true)
      .addField("角色數量", `${member?.roles?.size ?? 0}`, true)
      .addField(
        "加入伺服器",
        member?.joinedAt
          ? new Date(member.joinedAt).toLocaleString("zh-TW")
          : "未知",
        true,
      )
      .setThumb(await avatarURL(bot, user));
    await send(bot, message.channelId, embed.build());
  },
});
