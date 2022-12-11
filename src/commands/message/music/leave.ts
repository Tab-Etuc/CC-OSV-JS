import { addMsgCommand } from "@classes/command.ts";

export default addMsgCommand({
  name: "leave",
  mod: "music",
  description: "leave the channel",
  aliases: ["l"],
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

    player.disconnect();
    await bot.helpers.sendMessage(message.channelId, {
      content: "**已離開語音頻道**",
      messageReference: {
        messageId: message.id,
        channelId: message.channelId,
        guildId: message.guildId,
        failIfNotExists: true,
      },
    });
  },
});
