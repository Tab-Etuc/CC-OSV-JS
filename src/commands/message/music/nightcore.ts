import { addMsgCommand } from "@classes/command.ts";

export default addMsgCommand({
  name: "nightcore",
  mod: "music",
  description: "nightcore mode",
  aliases: ["nc"],
  usage: "[command]",
  run: async (bot, message, _args) => {
    const player = bot.guildPlayers.get(message.guildId!);

    if (!player?.connected) {
      await bot.helpers.sendMessage(message.channelId, {
        content: "**目前沒有播放任何音樂...**",
        messageReference: {
          messageId: message.id,
          channelId: message.channelId,
          guildId: message.guildId,
          failIfNotExists: true,
        },
      });
      return;
    }
    player.filters.timescale = player.filters.timescale?.rate !== 1.0
      ? { rate: 1.09, pitch: 1.125, speed: 1 }
      : { rate: 1, pitch: 1, speed: 1 };
    await bot.helpers.sendMessage(message.channelId, {
      content: `${
        player.filters.timescale?.pitch === 1 ? "Enabled" : "Disabled"
      } **nightcore**!`,
      messageReference: {
        messageId: message.id,
        channelId: message.channelId,
        guildId: message.guildId,
        failIfNotExists: true,
      },
    });

    player.setFilters();
  },
});
