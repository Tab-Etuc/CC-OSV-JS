import { discordeno } from "@deps";
import { addMsgCommand, CCOSVMsgCommand } from "@classes/command.ts";
import { CCOSVEmbed } from "@classes/embed.ts";
import { BotClient } from "@base/CC-OSV-Client.ts";

class BotInfo extends CCOSVMsgCommand {
  constructor() {
    super("volume", "music", {
      aliases: ["p"],
      description: "set music volume",
    });
  }
  override async run(
    bot: BotClient,
    message: discordeno.Message,
    args: string[],
  ): Promise<void> {
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
  }
}

addMsgCommand(new BotInfo());
