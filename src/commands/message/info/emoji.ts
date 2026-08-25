import { addMsgCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";

export default addMsgCommand({
  name: "emoji",
  mod: "info",
  description: "將 Discord 自訂 emoji 轉成圖片網址",
  aliases: ["e", "emote"],
  requiredArgs: true,
  usage: "<Discord emoji>",
  run: async (bot, message, args) => {
    const match = /^(<a?):([\w+\-~]+):(\d+)>$/.exec(args[0] ?? "");
    if (!match) {
      await send(bot, message.channelId, "請提供有效的 Discord 自訂 emoji。");
      return;
    }
    const extension = match[1] === "<a" ? "gif" : "png";
    await send(
      bot,
      message.channelId,
      `https://cdn.discordapp.com/emojis/${match[3]}.${extension}?size=256`,
    );
  },
});
