import { addMsgCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";

const answers = [
  "可以。",
  "不可以。",
  "很有可能。",
  "現在還說不準。",
  "再問一次吧。",
  "答案就在你心裡。",
  "今天不適合做決定。",
];

export default addMsgCommand({
  name: "8ball",
  mod: "fun",
  description: "詢問神奇 8 號球",
  aliases: ["eightball", "ask"],
  requiredArgs: true,
  usage: "<問題>",
  run: async (bot, message) => {
    await send(
      bot,
      message.channelId,
      `神奇 8 號球：${answers[Math.floor(Math.random() * answers.length)]}`,
    );
  },
});
