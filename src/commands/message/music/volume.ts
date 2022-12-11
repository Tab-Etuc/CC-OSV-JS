import { addMsgCommand } from "@classes/command.ts";
import { CCOSVEmbed } from "@classes/embed.ts";

export default addMsgCommand({
  name: "volume",
  mod: "music",
  description: "set music volume",
  aliases: ["v"],
  usage: "[command]",
  run: async (bot, message, args) => {
    if (args.length < 1) {
      await bot.helpers.sendMessage(message.channelId, {
        embeds: new CCOSVEmbed()
          .setDesc(":x: You didn't enter a volume")
          .build(),
        messageReference: {
          messageId: message.id,
          channelId: message.channelId,
          guildId: message.guildId,
          failIfNotExists: true,
        },
      });

      return;
    }
    const player = bot.guildPlayers.get(message.guildId!);
    if (!player?.connected) {
      await bot.helpers.sendMessage(message.channelId, {
        embeds: new CCOSVEmbed()
          .setDesc(":x: A player for this guild doesn't exist.")
          .build(),
        messageReference: {
          messageId: message.id,
          channelId: message.channelId,
          guildId: message.guildId,
          failIfNotExists: true,
        },
      });
      return;
    }
    player.setVolume(+args[0]);
  },
});
