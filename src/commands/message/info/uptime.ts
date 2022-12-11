import { addMsgCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { uptime } from "@utils/uptime.ts";

export default addMsgCommand({
  name: "uptime",
  mod: "info",
  description: "Show how long has the bot been running for",
  aliases: ["up"],
  run: (bot, message, _args) => {
    const up = uptime();
    return send(bot, message.channelId, up);
  },
});
