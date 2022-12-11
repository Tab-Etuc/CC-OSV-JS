import { addMsgCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";


export default addMsgCommand({
  name: "ping",
  mod: "utils",
  description: "Check if the bot responses",
  aliases: ["pong"],
  usage: "[command]",
  run:  (bot, message, _args) => {
    send(
      bot,
      message.channelId,
      `Pong! ${Date.now() - message.timestamp}ms`,
    );
  },
});
