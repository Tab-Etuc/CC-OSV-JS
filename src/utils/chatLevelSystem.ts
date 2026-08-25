import { BotClient, MongoDB, MongoDBReady } from "@base/CC-OSV-Client.ts";
import { discordeno } from "@deps";
import { CCOSVEmbed } from "@classes/embed.ts";
import { COLORS } from "@const/colors.ts";
import { send } from "@utils/send.ts";

interface LevelUser {
  _id: string;
  GuildId: string;
  UserId: string;
  Xp: number;
  Level: number;
}

function userKey(guildId: bigint, userId: bigint): string {
  return `${guildId}:${userId}`;
}

const xpCooldowns = new Map<string, number>();
const XP_COOLDOWN = 60_000;

function guildIconUrl(guild: discordeno.Guild): string | undefined {
  return guild.icon
    ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=128`
    : undefined;
}

/** 為每則伺服器訊息增加經驗，升級時發送通知。 */
export async function chatLevelSystem(
  bot: BotClient,
  message: discordeno.Message,
): Promise<void> {
  if (!message.guildId || !MongoDBReady) return;
  const key = userKey(message.guildId, message.author.id);
  const now = Date.now();
  const lastXpAt = xpCooldowns.get(key) ?? 0;
  if (now - lastXpAt < XP_COOLDOWN) return;
  xpCooldowns.set(key, now);
  const db = MongoDB.database("Beta");
  const users = db.collection<LevelUser>("Users");
  const filter = { _id: key };
  const user = await users.findOne(filter);
  if (!user) return;

  const addedXp = Math.floor(Math.random() * 4) + 1;
  const xpToLevel = user.Level ** 2 + user.Level * Math.abs(100 - user.Level);
  const nextXp = user.Xp + addedXp;

  if (nextXp >= xpToLevel) {
    await users.updateOne(filter, {
      $inc: { Level: 1 },
      $set: { Xp: nextXp - xpToLevel },
    });

    const guild = bot.guilds.get(message.guildId);
    if (!guild) return;
    const iconUrl = guildIconUrl(guild);
    const embed = new CCOSVEmbed()
      .setAuthor(guild.name, iconUrl)
      .setDesc(
        `恭喜 <@${message.author.id}> 升級\n目前等級：**${
          user.Level + 1
        }**\n繼續聊天可解鎖更多等級獎勵。`,
      )
      .setColor(COLORS.BLUE);
    if (iconUrl) embed.setThumb(iconUrl);
    await send(bot, message.channelId, embed.build());
  } else {
    await users.updateOne(filter, {
      $inc: { Xp: addedXp },
    });
  }
}
