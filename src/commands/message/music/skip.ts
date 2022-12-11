import { addMsgCommand } from "@classes/command.ts";

export default addMsgCommand({
  name: "skip",
  mod: "music",
  description: "skip music",
  aliases: ["s"],
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

    player.stop();
  },
});
