import { addMsgCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";

export default addMsgCommand({
  name: "cat",
  mod: "fun",
  description: "meow meow",
  aliases: ["kitty"],
  run: (bot, message, _args) => {
    fetch("https://aws.random.cat/meow").then(async (r) => {
      const j = await r.json();
      send(bot, message.channelId, j.file);
    });
  }
});
