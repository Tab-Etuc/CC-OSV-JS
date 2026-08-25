import { addMsgCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";

export default addMsgCommand({
  name: "choose",
  mod: "fun",
  description: "從多個選項中隨機選一個",
  aliases: ["choice", "pick"],
  requiredArgs: true,
  usage: "<選項1> | <選項2> | ...",
  run: async (bot, message, args) => {
    const options = args.join(" ").split("|").map((item) => item.trim()).filter(
      Boolean,
    );
    if (options.length < 2) {
      await send(bot, message.channelId, "請使用 | 分隔至少兩個選項。");
      return;
    }
    const choice = options[Math.floor(Math.random() * options.length)]!;
    await send(bot, message.channelId, `我選：${choice}`);
  },
});
