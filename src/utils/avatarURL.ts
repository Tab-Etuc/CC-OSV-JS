import { discordeno } from "@deps";
import { BotClient } from "@base/CC-OSV-Client.ts";

export async function avatarURL(
  bot: BotClient,
  user: bigint | discordeno.User,
): Promise<string> {
  const userId = typeof user === "bigint" ? user : user.id;
  const value = typeof user === "bigint"
    ? bot.users.get(user) ??
      (await bot.helpers.getUser(user) as unknown as
        | discordeno.User
        | undefined)
    : user;
  if (!value) {
    return `https://cdn.discordapp.com/embed/avatars/${
      Number(userId % 5n)
    }.png`;
  }
  const avatar = value.avatar?.toString();
  if (avatar) {
    return `https://cdn.discordapp.com/avatars/${value.id}/${avatar}.png?size=256`;
  }
  return `https://cdn.discordapp.com/embed/avatars/${
    Number(value.id % 5n)
  }.png`;
}
