import { MongoDB, MongoDBReady } from "@base/CC-OSV-Client.ts";

function userKey(guildId: bigint, userId: bigint): string {
  return `${guildId}:${userId}`;
}

/** 以 upsert 建立伺服器與使用者初始資料，避免重複訊息同時建立重複文件。 */
export async function checkGuildData(
  guildId: bigint,
  userId: bigint,
): Promise<void> {
  if (!MongoDBReady) return;
  const db = MongoDB.database("Beta");
  const guilds = db.collection("Guilds");
  const users = db.collection("Users");

  await guilds.updateOne(
    { _id: guildId.toString() },
    {
      $setOnInsert: {
        _id: guildId.toString(),
        ButtonRole: [],
        ClockTime: [],
        ClockDate: [],
        levelPrizes: [],
        CommandRan: 0,
        SongsPlayed: 0,
      },
    },
    { upsert: true },
  );

  await users.updateOne(
    { _id: userKey(guildId, userId) },
    {
      $setOnInsert: {
        _id: userKey(guildId, userId),
        GuildId: guildId.toString(),
        UserId: userId.toString(),
        Xp: 0,
        Level: 1,
        CoinsInWallet: 500,
        CoinsInBank: 20000,
        bankSpace: 200000,
        items: [],
        interest: 1,
        dailyClaimedAt: 0,
      },
    },
    { upsert: true },
  );
}
