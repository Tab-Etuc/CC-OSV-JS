import { addMsgCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";

interface CatResponse {
  url?: string;
}

export default addMsgCommand({
  name: "cat",
  mod: "fun",
  description: "取得隨機貓咪圖片",
  aliases: ["kitty"],
  run: async (bot, message) => {
    const response = await fetch("https://api.thecatapi.com/v1/images/search");
    if (!response.ok) {
      await send(bot, message.channelId, "貓咪圖片服務目前無法使用。");
      return;
    }
    const data = await response.json() as CatResponse[];
    const url = data[0]?.url;
    await send(bot, message.channelId, url ?? "找不到貓咪圖片。");
  },
});
