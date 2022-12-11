import { addMsgCommand } from "@classes/command.ts";

export default addMsgCommand({
  name: "loop",
  mod: "music",
  description: "loop the current song",
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

    player.setTrackRepeat(!player.trackRepeat);
    const trackRepeat = player.trackRepeat ? "啟用" : "關閉";
    await bot.helpers.sendMessage(message.channelId, {
      content: `循環模式已${trackRepeat}`,
      messageReference: {
        messageId: message.id,
        channelId: message.channelId,
        guildId: message.guildId,
        failIfNotExists: true,
      },
    });
  },
});
