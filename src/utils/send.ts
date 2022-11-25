import { discordeno } from "@deps";
import { EmptyError } from "@const/errors.ts";
import { BotClient } from "@base/CC-OSV-Client.ts";

export function send(
  bot: BotClient,
  channelId: discordeno.BigString,
  content: string | discordeno.CreateMessage | discordeno.Embed[],
): Promise<discordeno.Message> {
  if (
    (typeof content == "string" || Array.isArray(content)) && !content.length
  ) throw new EmptyError("The content cannot be empty");
  content = typeof content == "object" && !Array.isArray(content) ? content : {
    embeds: Array.isArray(content) ? content : [],
    content: typeof content == "string" ? content : undefined,
  };

  return bot.helpers.sendMessage(channelId, content);
}
