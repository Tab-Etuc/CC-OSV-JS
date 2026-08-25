import { discordeno } from "@deps";
import { BotClient } from "@base/CC-OSV-Client.ts";

/** 解析純 ID、一般提及與 nickname 提及。 */
export function parseUserId(value: string | undefined): bigint | undefined {
  if (!value) return undefined;
  const match = /^<@!?(\d+)>$/.exec(value.trim()) ??
    /^(\d+)$/.exec(value.trim());
  if (!match) return undefined;
  try {
    return BigInt(match[1]!);
  } catch {
    return undefined;
  }
}

export async function resolveUser(
  bot: BotClient,
  value: string | undefined,
  fallback?: discordeno.User,
): Promise<discordeno.User | undefined> {
  const userId = parseUserId(value);
  if (!userId) return fallback;
  return bot.users.get(userId) ??
    (await bot.helpers.getUser(userId) as unknown as
      | discordeno.User
      | undefined);
}

export function userName(user: discordeno.User): string {
  return user.globalName?.trim() || user.username || user.id.toString();
}
