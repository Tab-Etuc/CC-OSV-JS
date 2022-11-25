import { discordeno } from "@deps";
import { addMsgCommand, CCOSVMsgCommand } from "@classes/command.ts";
import { BotClient } from "@base/CC-OSV-Client.ts";
import { CCOSVEmbed } from "@classes/embed.ts";

class Help extends CCOSVMsgCommand {
  constructor() {
    super("nowplaying", "music", {
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
  }
}

addMsgCommand(new Help());
