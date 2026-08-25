import { discordeno } from "@deps";
import { BotClient } from "@base/CC-OSV-Client.ts";
import { send } from "@utils/send.ts";

export function replyMessage(
  bot: BotClient,
  message: discordeno.Message,
  content: string | discordeno.CreateMessageOptions | discordeno.Camelize<
    discordeno.DiscordEmbed
  >[],
): Promise<discordeno.Message> {
  const options: discordeno.CreateMessageOptions = typeof content === "string"
    ? { content }
    : Array.isArray(content)
    ? { embeds: content }
    : { ...content };
  options.messageReference = {
    messageId: message.id,
    channelId: message.channelId,
    guildId: message.guildId,
    failIfNotExists: true,
  };
  return send(bot, message.channelId, options);
}
