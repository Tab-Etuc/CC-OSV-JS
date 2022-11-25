import { discordeno } from "@deps";
import { addMsgCommand, CCOSVMsgCommand } from "@classes/command.ts";
import { BotClient } from "@base/CC-OSV-Client.ts";

class Help extends CCOSVMsgCommand {
  constructor() {
    super("loop", "music", {
      description: "loop the current song",
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
  }
}

addMsgCommand(new Help());
