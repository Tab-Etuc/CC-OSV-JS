import { BotClient, MongoDB, MongoDBReady } from "@base/CC-OSV-Client.ts";
import { checkGuildData } from "@base/database.ts";

export interface EconomyUser {
  _id: string;
  GuildId: string;
  UserId: string;
  CoinsInWallet: number;
  CoinsInBank: number;
  bankSpace: number;
  dailyClaimedAt?: number;
}

function collection() {
  if (!MongoDBReady) throw new Error("此功能需要設定 MongoDB。");
  return MongoDB.database("Beta").collection<EconomyUser>("Users");
}

async function ensureUser(guildId: bigint, userId: bigint): Promise<void> {
  await checkGuildData(guildId, userId);
  const existing = await collection().findOne({ _id: `${guildId}:${userId}` });
  if (existing && existing.dailyClaimedAt === undefined) {
    await collection().updateOne(
      { _id: `${guildId}:${userId}` },
      { $set: { dailyClaimedAt: 0 } },
    );
  }
}

export async function getEconomyUser(
  guildId: bigint,
  userId: bigint,
): Promise<EconomyUser | undefined> {
  await ensureUser(guildId, userId);
  return await collection().findOne({ _id: `${guildId}:${userId}` });
}

export async function claimDaily(
  guildId: bigint,
  userId: bigint,
): Promise<{ ok: boolean; amount: number; remainingMs: number }> {
  await ensureUser(guildId, userId);
  const users = collection();
  const current = await users.findOne({ _id: `${guildId}:${userId}` });
  const cooldown = 24 * 60 * 60 * 1000;
  const remainingMs = Math.max(
    0,
    (current?.dailyClaimedAt ?? 0) + cooldown - Date.now(),
  );
  if (remainingMs > 0) return { ok: false, amount: 0, remainingMs };

  const amount = 250 + Math.floor(Math.random() * 251);
  const claimedAt = Date.now();
  const result = await users.updateOne(
    {
      _id: `${guildId}:${userId}`,
      dailyClaimedAt: current?.dailyClaimedAt ?? 0,
    },
    { $inc: { CoinsInWallet: amount }, $set: { dailyClaimedAt: claimedAt } },
  ) as { modifiedCount?: number };
  if (result.modifiedCount !== 1) {
    const latest = await users.findOne({ _id: `${guildId}:${userId}` });
    const latestRemaining = Math.max(
      0,
      (latest?.dailyClaimedAt ?? claimedAt) + cooldown - Date.now(),
    );
    return { ok: false, amount: 0, remainingMs: latestRemaining };
  }
  return { ok: true, amount, remainingMs: 0 };
}

export async function transferCoins(
  guildId: bigint,
  fromUserId: bigint,
  toUserId: bigint,
  amount: number,
): Promise<boolean> {
  if (!Number.isSafeInteger(amount) || amount <= 0 || fromUserId === toUserId) {
    return false;
  }
  await ensureUser(guildId, fromUserId);
  await ensureUser(guildId, toUserId);
  const result = await collection().updateOne(
    { _id: `${guildId}:${fromUserId}`, CoinsInWallet: { $gte: amount } },
    { $inc: { CoinsInWallet: -amount } },
  ) as { modifiedCount?: number };
  if (result.modifiedCount !== 1) return false;
  await collection().updateOne(
    { _id: `${guildId}:${toUserId}` },
    { $inc: { CoinsInWallet: amount } },
  );
  return true;
}

export async function getEconomyLeaderboard(
  guildId: bigint,
  limit = 10,
): Promise<EconomyUser[]> {
  const rows = await collection().find({ GuildId: guildId.toString() })
    .toArray();
  return rows
    .sort((a, b) =>
      b.CoinsInWallet + b.CoinsInBank - a.CoinsInWallet - a.CoinsInBank
    )
    .slice(0, Math.min(Math.max(1, limit), 25));
}

export function formatCooldown(milliseconds: number): string {
  const minutes = Math.ceil(milliseconds / 60_000);
  if (minutes < 60) return `${minutes} 分鐘`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes
    ? `${hours} 小時 ${remainingMinutes} 分鐘`
    : `${hours} 小時`;
}

export function formatCoins(amount: number): string {
  return `${Math.max(0, Math.floor(amount)).toLocaleString("en-US")} coins`;
}

export function economyUserLabel(bot: BotClient, userId: string): string {
  const user = bot.users.get(BigInt(userId));
  return user ? user.globalName ?? user.username : `<@${userId}>`;
}
