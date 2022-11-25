import { discordeno, hasGuildPermissions } from "@deps";
import { addMsgCommand, CCOSVMsgCommand } from "@classes/command.ts";
import { BotClient } from "@base/CC-OSV-Client.ts";

class Help extends CCOSVMsgCommand {
  constructor() {
    super("join", "music", {
      description: "join the channel",
      usage: "[command]",
    });
  }

  override async run(
    bot: BotClient,
    message: discordeno.Message,
    _args: string[],
  ): Promise<void> {
    let player = bot.guildPlayers.get(message.guildId!);

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
    const hasPerms = hasGuildPermissions(bot, message.guildId!, bot.id, [
      "CONNECT",
      "VIEW_CHANNEL",
    ]);
    if (!hasPerms) {
      await bot.helpers.sendMessage(message.channelId, {
        content:
          "I don't have permissions to connect or view the channel that you're in!",
        messageReference: {
          messageId: message.id,
          channelId: message.channelId,
          guildId: message.guildId,
          failIfNotExists: true,
        },
      });

      return;
    }
    const memberVoiceData = bot.guilds.get(message.guildId!)?.voiceStates.get(
      message.authorId,
    );

    // Handle the case in which the voice data doesn't exist
    if (!memberVoiceData || !memberVoiceData.channelId) {
      await bot.helpers.sendMessage(message.channelId, {
        content: ":x: You aren't in a voice channel!",
        messageReference: {
          messageId: message.id,
          channelId: message.channelId,
          guildId: message.guildId,
          failIfNotExists: true,
        },
      });
      return;
    }
    player ??= bot.musicNode.createPlayer(message.guildId!);
    player.connect(memberVoiceData.channelId);
  }
}

addMsgCommand(new Help());
