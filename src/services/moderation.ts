import { MongoDB, MongoDBReady } from "@base/CC-OSV-Client.ts";

export interface WarningRecord {
  WarningId: string;
  GuildId: string;
  UserId: string;
  ModeratorId: string;
  Reason: string;
  CreatedAt: number;
}

function warningsCollection() {
  if (!MongoDBReady) throw new Error("此功能需要設定 MongoDB。");
  return MongoDB.database("Beta").collection<WarningRecord>("Warnings");
}

export async function addWarning(
  guildId: bigint,
  userId: bigint,
  moderatorId: bigint,
  reason: string,
): Promise<WarningRecord> {
  const record: WarningRecord = {
    WarningId: crypto.randomUUID(),
    GuildId: guildId.toString(),
    UserId: userId.toString(),
    ModeratorId: moderatorId.toString(),
    Reason: reason.trim().slice(0, 500),
    CreatedAt: Date.now(),
  };
  await warningsCollection().insertOne(record);
  return record;
}

export async function getWarnings(
  guildId: bigint,
  userId: bigint,
): Promise<WarningRecord[]> {
  const rows = await warningsCollection().find({
    GuildId: guildId.toString(),
    UserId: userId.toString(),
  }).toArray();
  return rows.sort((a, b) => b.CreatedAt - a.CreatedAt);
}

export async function removeWarning(
  guildId: bigint,
  warningId: string,
): Promise<boolean> {
  const result = await warningsCollection().deleteOne({
    GuildId: guildId.toString(),
    WarningId: warningId,
  }) as { deletedCount?: number };
  return result.deletedCount === 1;
}
