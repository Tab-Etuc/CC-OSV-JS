import { discordeno } from "@deps";
import { EmptyError } from "@const/errors.ts";
import { BotClient } from "@base/CC-OSV-Client.ts";
import { sanitizeMessage, stripEmoji } from "@utils/text.ts";

export function send(
  bot: BotClient,
  channelId: discordeno.BigString,
  content: string | discordeno.CreateMessageOptions | discordeno.Camelize<
    discordeno.DiscordEmbed
  >[],
): Promise<discordeno.Message> {
  if (
    (typeof content === "string" || Array.isArray(content)) &&
    content.length === 0
  ) {
    throw new EmptyError("訊息內容不可為空");
  }

  let payload: discordeno.CreateMessageOptions;
  if (typeof content === "string") {
    payload = { content: stripEmoji(content) };
  } else if (Array.isArray(content)) {
    payload = { embeds: content };
  } else {
    payload = content;
  }

  return bot.helpers.sendMessage(
    channelId,
    sanitizeMessage(payload),
  ) as unknown as Promise<discordeno.Message>;
}
