import { addMsgCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { avatarURL } from "@utils/avatarURL.ts";
import { resolveUser, userName } from "@utils/discord.ts";

export default addMsgCommand({
  name: "avatar",
  mod: "info",
  description: "顯示使用者頭像連結",
  aliases: ["pfp"],
  usage: "[@使用者]",
  run: async (bot, message, args) => {
    const user = await resolveUser(bot, args[0], message.author);
    if (!user) {
      await send(bot, message.channelId, "找不到這位使用者。");
      return;
    }
    await send(
      bot,
      message.channelId,
      `${userName(user)} 的頭像：\n${await avatarURL(bot, user)}`,
    );
  },
});
