import { addMsgCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";

export default addMsgCommand({
  name: "emoji",
  mod: "info",
  description: "Display emoji as image",
  aliases: ["e", "emote"],
  run: (bot, message, args) => {
    const arg = args[0];
    if (!arg) {
      return send(
        bot,
        message.channelId,
        "Please use `;emoji <Discord Emoji>`",
      );
    }
    if (!arg.startsWith("<")) {
      return send(bot, message.channelId, "Only Discord Emojis can input");
    }
    let animated = false;
    if (arg.startsWith("<a:")) {
      animated = true;
    }
    const a = arg.replace(animated ? "<a:" : "<:", "");
    const c = a.replace(">", "");
    const [_name, id] = c.split(":");
    const url = `https://cdn.discordapp.com/emojis/${id}.${
      animated ? "gif" : "png"
    }`;
    return send(bot, message.channelId, url);
  },
});
