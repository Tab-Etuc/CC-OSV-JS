import { addMsgCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { Reddit } from "@classes/reddit.ts";
import { main } from "@utils/log.ts";

export default addMsgCommand({
  name: "meme",
  mod: "reddit",
  description: "Get random memes",
  aliases: [],
  usage: "[command]",
  run: async (bot, message, _args) => {
    const subredditMeme = ["dankmemes", "meme", "memes"];
    try {
      const subPick =
        subredditMeme[Math.floor(Math.random() * subredditMeme.length)];
      const reddit = new Reddit(subPick, "hot");
      const e = await reddit.toEmbed(true);
      send(bot, message.channelId, e);
    } catch (e) {
      main.error(e);
    }
  },
});
