import { BotClient, MongoDB, MongoDBReady } from "@base/CC-OSV-Client.ts";
import { checkGuildData } from "@base/database.ts";

export interface LevelUser {
  _id: string;
  GuildId: string;
  UserId: string;
  Xp: number;
  Level: number;
}

export function xpForNextLevel(level: number): number {
  return Math.max(1, level ** 2 + level * Math.abs(100 - level));
}

function usersCollection() {
  if (!MongoDBReady) throw new Error("此功能需要設定 MongoDB。");
  return MongoDB.database("Beta").collection<LevelUser>("Users");
}

export async function getLevelUser(
  guildId: bigint,
  userId: bigint,
): Promise<LevelUser | undefined> {
  await checkGuildData(guildId, userId);
  return await usersCollection().findOne({ _id: `${guildId}:${userId}` });
}

export async function getLevelLeaderboard(
  guildId: bigint,
  limit = 10,
): Promise<LevelUser[]> {
  const collection = usersCollection();
  const rows = await collection.find({ GuildId: guildId.toString() }).toArray();
  return rows
    .sort((a, b) => b.Level - a.Level || b.Xp - a.Xp)
    .slice(0, Math.min(Math.max(1, limit), 25));
}

export function displayLevelUser(bot: BotClient, userId: string): string {
  const user = bot.users.get(BigInt(userId));
  return user ? user.globalName ?? user.username : `<@${userId}>`;
}
