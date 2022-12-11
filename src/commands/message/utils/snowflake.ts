import { addMsgCommand } from "@classes/command.ts";
import { send } from "@utils/send.ts";
import { createdAt } from "@utils/snowflake.ts";
import { CCOSVEmbed } from "@classes/embed.ts";
import { COLORS } from "@const/colors.ts";

export default addMsgCommand({
  name: "snowflake",
  mod: "utils",
  description: "Get a creation data from ID",
  aliases: ["snow"],
  usage: "[command]",
  run: (bot, message, args) => {
    if (!args[0]) {
      send(bot, message.channelId, "Give me random ID lol");
      return;
    }
    const snow = args[0];
    try {
      const data = createdAt(BigInt(snow));
      const e = new CCOSVEmbed()
        .setTitle("Snowflake ID")
        .setDesc(`ID: **${snow}**\nDate: **${data}**`)
        .setThumb("https://cdn-icons-png.flaticon.com/512/2411/2411812.png")
        .setColor(COLORS.CYAN).build();
      send(bot, message.channelId, e);
    } catch {
      send(bot, message.channelId, "Invalid ID");
    }
  },
});
