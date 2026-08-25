import {
  addMsgCommand,
  findMsgCommand,
  globalMsgCommand,
} from "@classes/command.ts";
import { CCOSVEmbed } from "@classes/embed.ts";
import { send } from "@utils/send.ts";
import { avatarURL } from "@utils/avatarURL.ts";

export default addMsgCommand({
  name: "help",
  mod: "utils",
  description: "顯示可用指令",
  aliases: ["h"],
  usage: "[指令名稱]",
  run: async (bot, message, args) => {
    const blacklist = new Set(["help", "eval", "unwarnall", "setlevel"]);
    if (args[0]) {
      const command = findMsgCommand(args[0]);
      if (!command) {
        await send(bot, message.channelId, "找不到此指令。");
        return;
      }
      await send(bot, message.channelId, new CCOSVEmbed().command(command));
      return;
    }

    const embed = new CCOSVEmbed()
      .setTitle("指令列表")
      .setThumb(await avatarURL(bot, bot.id));
    const categories = new Set(
      [...globalMsgCommand.values()]
        .filter((command) => !blacklist.has(command.name))
        .map((command) => command.mod),
    );
    for (const category of categories) {
      const names = [...globalMsgCommand.values()]
        .filter((command) =>
          command.mod === category && !blacklist.has(command.name)
        )
        .map((command) => command.name)
        .join(", ");
      embed.addField(category.toUpperCase(), names || "無");
    }
    await send(bot, message.channelId, embed.build());
  },
});
