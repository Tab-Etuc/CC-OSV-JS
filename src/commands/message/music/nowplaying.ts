import { addMsgCommand } from "@classes/command.ts";
import { CCOSVEmbed } from "@classes/embed.ts";

export default addMsgCommand({
  name: "nowplaying",
  mod: "music",
  description: "the current song",
  aliases: ["np"],
  usage: "[command]",
  run: async (bot, message, _args) => {
    const player = bot.guildPlayers.get(message.guildId!);
    const current = bot.guildQueues.get(message.guildId!);
    if (!player?.connected || !current) {
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
    await bot.helpers.sendMessage(message.channelId, {
      embeds: new CCOSVEmbed().setTitle(
        `(${current[0].title})[${current[0].link}]`,
      )
        .build(),
      messageReference: {
        messageId: message.id,
        channelId: message.channelId,
        guildId: message.guildId,
        failIfNotExists: true,
      },
    });
  },
});
