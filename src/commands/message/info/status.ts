import { addMsgCommand } from "@classes/command.ts";
import { CCOSVEmbed } from "@classes/embed.ts";
import { send } from "@utils/send.ts";
import { uptime } from "@utils/uptime.ts";

export default addMsgCommand({
  name: "status",
  mod: "info",
  description: "顯示機器人連線與播放狀態",
  aliases: ["stats"],
  run: async (bot, message) => {
    const players = [...bot.guildPlayers.values()];
    const playing = players.filter((player) => player.playing).length;
    const connectedNodes = bot.musicNode.idealNodes.length;
    const embed = new CCOSVEmbed()
      .setTitle("機器人狀態")
      .addField("WebSocket", "已連線", true)
      .addField("伺服器", `${bot.guilds.size}`, true)
      .addField("運作時間", uptime(), true)
      .addField("Lavalink 節點", `${connectedNodes}`, true)
      .addField("播放中", `${playing}/${players.length}`, true)
      .addField(
        "記憶體 RSS",
        `${Math.round(Deno.memoryUsage().rss / 1024 / 1024)} MB`,
        true,
      );
    await send(bot, message.channelId, embed.build());
  },
});
