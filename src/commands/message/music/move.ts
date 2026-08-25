import { addMsgCommand } from "@classes/command.ts";
import { replyMessage } from "@utils/messageReply.ts";
import { moveMusic } from "@services/musicCommands.ts";

export default addMsgCommand({
  name: "move",
  mod: "music",
  description: "移動待播歌曲的位置",
  aliases: ["mv"],
  requiredArgs: true,
  usage: "<原位置> <新位置>",
  run: async (bot, message, args) => {
    if (!message.guildId || !args[1]) {
      if (message.guildId) {
        await replyMessage(bot, message, "請提供原位置與新位置。");
      }
      return;
    }
    await replyMessage(
      bot,
      message,
      moveMusic(bot, message.guildId, args[0] ?? "", args[1]),
    );
  },
});
