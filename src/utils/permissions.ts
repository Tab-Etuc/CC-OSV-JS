import { discordeno } from "@deps";
import { BotClient } from "@base/CC-OSV-Client.ts";

/** 檢查成員在指定伺服器是否具備所有要求權限。 */
export function hasGuildPermissions(
  bot: BotClient,
  guildId: bigint,
  userId: bigint,
  permissions: discordeno.PermissionStrings[],
): boolean {
  const guild = bot.guilds.get(guildId);
  if (!guild) return false;
  if (guild.ownerId === userId) return true;

  const member = guild.members?.get(userId);
  const memberPermissions = member?.permissions;
  if (!memberPermissions) return false;
  return memberPermissions.has("ADMINISTRATOR") ||
    memberPermissions.hasAll(permissions);
}
