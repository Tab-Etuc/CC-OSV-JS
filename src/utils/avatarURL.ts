import { discordeno } from "@deps";
import { BotClient } from "@base/CC-OSV-Client.ts";

export async function avatarURL(
  bot: BotClient,
  user: bigint | discordeno.User,
): Promise<string> {
  const u = typeof user == "bigint"
    ? bot.users.get(user) || await bot.helpers.getUser(user)
    : user;
  if (!u) throw new Error("Cannot find that user");
  return bot.helpers.getAvatarURL(u.id, u.discriminator, {
    avatar: u.avatar,
    format: "png",
  });
}
