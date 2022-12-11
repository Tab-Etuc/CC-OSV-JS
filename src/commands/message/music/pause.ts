import { addMsgCommand } from "@classes/command.ts";

export default addMsgCommand({
  name: "pause",
  mod: "music",
  description: "pause music",
  aliases: ["p"],
  usage: "[command]",
  run: async (bot, message, _args) => {
    const player = bot.guildPlayers.get(message.guildId!);

    if (!player) {
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
    if (player.paused) {
      await bot.helpers.sendMessage(message.channelId, {
        content: "**音樂暫停中！**",
        messageReference: {
          messageId: message.id,
          channelId: message.channelId,
          guildId: message.guildId,
          failIfNotExists: true,
        },
      });
      return;
    }

    player.pause(true);
    await bot.helpers.sendMessage(message.channelId, {
      content: "**音樂已暫停！**",
      messageReference: {
        messageId: message.id,
        channelId: message.channelId,
        guildId: message.guildId,
        failIfNotExists: true,
      },
    });
  },
});
