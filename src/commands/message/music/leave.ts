import { discordeno } from "@deps";
import { addMsgCommand, CCOSVMsgCommand } from "@classes/command.ts";
import { BotClient } from "@base/CC-OSV-Client.ts";

class Help extends CCOSVMsgCommand {
  constructor() {
    super("leave", "music", {
      description: "leave the channel",
      usage: "[command]",
    });
  }

  override async run(
    bot: BotClient,
    message: discordeno.Message,
    _args: string[],
  ): Promise<void> {
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
  }
}

addMsgCommand(new Help());
